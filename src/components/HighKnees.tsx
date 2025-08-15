import React, { useEffect, useRef, useState, useCallback } from "react";
import {
    evaluateStamina,
    calculateCaloriesDynamic,
    plotWorkoutSummary,
} from "./Utils";
import {drawConnectors, drawLandmarks} from "@mediapipe/drawing_utils";
import {Pose, POSE_CONNECTIONS} from "@mediapipe/pose";
import {Camera} from "@mediapipe/camera_utils";


const placeholderUser = {
    name: "Guest",
    age: 25,
    weight: 70, // in kg
    gender: "male",
};
export default function HighKnees({ user, onFinish }) {
    const activeUser = user ?? placeholderUser;

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const cameraRef = useRef(null);
    const poseRef = useRef(null);
    const rafRef = useRef(null);

    const [useCamera, setUseCamera] = useState(true);
    const [file, setFile] = useState(null);
    const [reps, setReps] = useState(0);
    const [poseScore, setPoseScore] = useState(0);
    const [running, setRunning] = useState(false);
    const [summary, setSummary] = useState(null);
    const [isSessionActive, setIsSessionActive] = useState(false);

    // Internal refs
    const lastKneeRef = useRef(null); // "left" or "right"
    const lastRepTimeRef = useRef(0);
    const startTimeRef = useRef(null);
    const poseScoresRef = useRef([]);
    const pauseStartRef = useRef(null);
    const pauseTimeRef = useRef(0);
    const repTimestampsRef = useRef([]);

    const margin = 0.12; // Same margin as your python code
    const cooldown = 0.1; // seconds cooldown between reps

    // Calculate average visibility
    const avgVisibility = (landmarks) => {
        if (!landmarks || landmarks.length === 0) return 0;
        let sum = 0;
        landmarks.forEach((l) => (sum += l.visibility ?? 1));
        return sum / landmarks.length;
    };

    const onResults = useCallback((results) => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;

        const ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        if (results.poseLandmarks) {
            if (results.poseLandmarks) {
                drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
                    color: "#00FFAA",
                    lineWidth: 2,
                });
                drawLandmarks(ctx, results.poseLandmarks, {
                    color: "#FF0066",
                    lineWidth: 1,
                });
            }


            const lm = results.poseLandmarks;
            const score = avgVisibility(lm);
            poseScoresRef.current.push(score);
            setPoseScore(Number(score.toFixed(2)));

            if (pauseStartRef.current) {
                pauseTimeRef.current += performance.now() / 1000 - pauseStartRef.current;
                pauseStartRef.current = null;
            }

            const leftKneeY = lm[25].y;
            const rightKneeY = lm[26].y;
            const leftHipY = lm[23].y;
            const rightHipY = lm[24].y;
            const hipY = (leftHipY + rightHipY) / 2;

            const now = performance.now() / 1000;

            // Start timer on first valid rep
            if (!startTimeRef.current) {
                if (
                    Math.abs(leftKneeY - hipY) < margin ||
                    Math.abs(rightKneeY - hipY) < margin
                ) {
                    startTimeRef.current = now;
                    setIsSessionActive(true);
                }
            }

            // Rep detection logic with cooldown and last knee tracking
            if (startTimeRef.current) {
                if (
                    Math.abs(leftKneeY - hipY) < margin &&
                    lastKneeRef.current !== "left" &&
                    now - lastRepTimeRef.current > cooldown
                ) {
                    setReps((r) => r + 1);
                    repTimestampsRef.current.push(now - startTimeRef.current);
                    lastKneeRef.current = "left";
                    lastRepTimeRef.current = now;
                } else if (
                    Math.abs(rightKneeY - hipY) < margin &&
                    lastKneeRef.current !== "right" &&
                    now - lastRepTimeRef.current > cooldown
                ) {
                    setReps((r) => r + 1);
                    repTimestampsRef.current.push(now - startTimeRef.current);
                    lastKneeRef.current = "right";
                    lastRepTimeRef.current = now;
                }
            }
        } else {
            if (startTimeRef.current && !pauseStartRef.current) {
                pauseStartRef.current = performance.now() / 1000;
            }
        }
    }, []);

    const startWebcam = useCallback(async () => {
        if (!videoRef.current || !poseRef.current) {
            alert("Video element or Pose instance not found.");
            return;
        }

        try {
            // Ask for camera permission first
            await navigator.mediaDevices.getUserMedia({ video: true });

            // Create MediaPipe camera instance
            cameraRef.current = new Camera(videoRef.current, {
                onFrame: async () => {
                    await poseRef.current.send({ image: videoRef.current });
                },
                width: 640,
                height: 480,
            });

            await cameraRef.current.start();
            setRunning(true);
        } catch (error) {
            console.error("Error starting webcam:", error);
            alert("Could not start webcam. Please check permissions.");
        }
    }, []);

    const processFileFrame = useCallback(async () => {
        if (!videoRef.current || !poseRef.current) return;
        if (videoRef.current.paused || videoRef.current.ended) return;
        await poseRef.current.send({ image: videoRef.current });
        rafRef.current = requestAnimationFrame(processFileFrame);
    }, []);

    const startFileProcessing = useCallback(
        (fileObj) => {
            if (!videoRef.current || !poseRef.current) return;
            const url = URL.createObjectURL(fileObj);
            videoRef.current.src = url;
            videoRef.current.play().then(() => {
                setRunning(true);
                rafRef.current = requestAnimationFrame(processFileFrame);
            });
        },
        [processFileFrame]
    );

    const stopEverything = useCallback(async () => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        if (cameraRef.current) {
            try {
                cameraRef.current.stop();
            } catch {}
            cameraRef.current = null;
        }
        if (videoRef.current && !useCamera) {
            try {
                videoRef.current.pause();
            } catch {}
        }
        setRunning(false);
    }, [useCamera]);

    const startSession = useCallback(async () => {
        if (!activeUser || !activeUser.name) {
            alert("Please provide user info.");
            return;
        }

        // Reset states
        lastKneeRef.current = null;
        lastRepTimeRef.current = 0;
        startTimeRef.current = null;
        poseScoresRef.current = [];
        pauseTimeRef.current = 0;
        pauseStartRef.current = null;
        repTimestampsRef.current = [];
        setReps(0);
        setPoseScore(0);
        setSummary(null);
        setIsSessionActive(false);

        if (useCamera) {
            await startWebcam();
        } else {
            if (!file) {
                alert("Please upload a video file.");
                return;
            }
            startFileProcessing(file);
        }
    }, [file, useCamera, activeUser, startWebcam, startFileProcessing]);

    const stopSession = useCallback(async () => {
        if (pauseStartRef.current) {
            pauseTimeRef.current += performance.now() / 1000 - pauseStartRef.current;
            pauseStartRef.current = null;
        }

        const totalDuration = startTimeRef.current
            ? Math.round(performance.now() / 1000 - startTimeRef.current)
            : 0;

        const avgPose =
            poseScoresRef.current.length > 0
                ? poseScoresRef.current.reduce((a, b) => a + b, 0) / poseScoresRef.current.length
                : 0;

        const calories = calculateCaloriesDynamic(
            reps,
            totalDuration,
            activeUser.weight,
            activeUser.age,
            activeUser.gender,
            "high_knees"
        );

        const stamina = evaluateStamina(
            activeUser.age,
            activeUser.weight,
            reps,
            totalDuration,
            avgPose,
            Math.round(pauseTimeRef.current)
        );

        const totalTime = Math.max(1, totalDuration);
        const segmentLength = 5;
        const numSegments = Math.ceil(totalTime / segmentLength);
        const counts = new Array(numSegments).fill(0);
        repTimestampsRef.current.forEach((t) => {
            const idx = Math.floor(t / segmentLength);
            if (idx >= 0 && idx < counts.length) counts[idx] += 1;
        });

        const summaryObj = {
            activeUser,
            total_reps: reps,
            total_duration: totalDuration,
            avg_pose_score: Number(avgPose.toFixed(3)),
            pause_time: Math.round(pauseTimeRef.current),
            reps_over_time: counts,
            pose_scores: [...poseScoresRef.current],
            calories,
            stamina,
        };

        await stopEverything();
        setSummary(summaryObj);
        setIsSessionActive(false);

        if (onFinish) onFinish(summaryObj);
    }, [reps, activeUser, stopEverything, onFinish]);

    const handleFileSelect = useCallback((e) => {
        const f = e.target.files[0];
        if (f) {
            setFile(f);
            setUseCamera(false);
            if (videoRef.current) {
                videoRef.current.src = URL.createObjectURL(f);
            }
        }
    }, []);

    const reset = useCallback(async () => {
        await stopEverything();
        setFile(null);
        setUseCamera(true);
        setSummary(null);
        poseScoresRef.current = [];
        repTimestampsRef.current = [];
        pauseTimeRef.current = 0;
        setReps(0);
        setPoseScore(0);
        setIsSessionActive(false);
    }, [stopEverything]);

    useEffect(() => {
        if (!poseRef.current) {
            poseRef.current = new Pose({
                locateFile: (file) => {
                    return `${window.location.origin}/node_modules/@mediapipe/pose/${file}`;
                },
            });
            poseRef.current.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                enableSegmentation: false,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });
            poseRef.current.onResults(onResults);
        }

        return () => {
            stopEverything();
        };
    }, [onResults, stopEverything]);

    useEffect(() => {
        if (!summary) return;

        plotWorkoutSummary(
            {
                repsChart: "hk-reps-chart",
                poseChart: "hk-pose-chart",
                activityChart: "hk-activity-chart",
                summaryBox: "hk-summary-text",
            },
            summary.activeUser,
            summary.reps_over_time,
            summary.pose_scores,
            summary.total_duration,
            summary.pause_time,
            summary.total_reps,
            summary.calories,
            summary.stamina
        );
    }, [summary]);

    return (
        <div style={{ padding: 12 }}>
            <h2>High Knees</h2>

            <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                <div>
                    <label>
                        <input
                            type="radio"
                            checked={useCamera}
                            onChange={() => setUseCamera(true)}
                        />{" "}
                        Live Camera
                    </label>
                    <br />
                    <label>
                        <input
                            type="radio"
                            checked={!useCamera}
                            onChange={() => setUseCamera(false)}
                        />{" "}
                        Upload Video
                    </label>
                </div>

                {!useCamera && (
                    <div>
                        <input type="file" accept="video/*" onChange={handleFileSelect} />
                    </div>
                )}

                <div style={{ marginLeft: "auto" }}>
                    <button onClick={startSession} disabled={running}>
                        Start
                    </button>
                    <button onClick={stopSession} disabled={!running}>
                        Stop
                    </button>
                    <button onClick={reset}>Reset</button>
                </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
                <div
                    style={{
                        width: isSessionActive ? 800 : 1000,
                        height: 800,
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: 8,
                        border: "1px solid #ccc",
                        flexShrink: 0,
                    }}
                >
                    <video
                        ref={videoRef}
                        style={{ width: "100%", height: "100%", transform: "scaleX(-1)" }}
                        playsInline
                        muted
                    />
                    <canvas
                        ref={canvasRef}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            transform: "scaleX(-1)",
                        }}
                    />
                </div>

                <div style={{ width: 340 }}>
                    <div
                        style={{ padding: 8, background: "#fff", borderRadius: 8, color: "#000" }}
                    >
                        <div>
                            <strong>User:</strong> {activeUser?.name ?? "—"}
                        </div>
                        <div>
                            <strong>Duration:</strong>{" "}
                            {summary
                                ? `${summary.total_duration}s`
                                : startTimeRef.current
                                    ? Math.round(performance.now() / 1000 - startTimeRef.current) + "s"
                                    : "0s"}
                        </div>
                        <div>
                            <strong>Reps:</strong> {reps}
                        </div>
                        <div>
                            <strong>Pose score:</strong> {poseScore}
                        </div>
                    </div>

                    {summary && (
                        <div
                            id="hk-summary-container"
                            style={{
                                marginTop: 12,
                                background: "#fff",
                                padding: 8,
                                borderRadius: 8,
                                color: "#000",
                            }}
                        >
                            <h4>Session Summary</h4>
                            <div>
                                <strong>Name:</strong> {summary.activeUser.name}
                            </div>
                            <div>
                                <strong>Age:</strong> {summary.activeUser.age}
                            </div>
                            <div>
                                <strong>Reps:</strong> {summary.total_reps}
                            </div>
                            <div>
                                <strong>Gender:</strong> {summary.activeUser.gender}
                            </div>
                            <div>
                                <strong>Duration:</strong> {summary.total_duration}s
                            </div>
                            <div>
                                <strong>Avg Pose Score:</strong> {summary.avg_pose_score}
                            </div>
                            <div>
                                <strong>Pause time:</strong> {summary.pause_time}s
                            </div>
                            <div>
                                <strong>Calories:</strong> {summary.calories} kcal
                            </div>
                            <div>
                                <strong>Stamina:</strong> {summary.stamina}
                            </div>

                            <div
                                style={{
                                    marginTop: 12,
                                    background: "#fff",
                                    padding: 8,
                                    borderRadius: 8,
                                }}
                            >
                                <h4>Charts</h4>
                                <div
                                    style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
                                >
                                    <div style={{ flex: "1 1 300px", height: 180 }}>
                                        <canvas
                                            id="hk-reps-chart"
                                            style={{ width: "100%", height: "100%" }}
                                        />
                                    </div>
                                    <div style={{ flex: "1 1 300px", height: 180 }}>
                                        <canvas
                                            id="hk-pose-chart"
                                            style={{ width: "100%", height: "100%" }}
                                        />
                                    </div>
                                    <div style={{ flex: "1 1 300px", height: 180 }}>
                                        <canvas
                                            id="hk-activity-chart"
                                            style={{ width: "100%", height: "100%" }}
                                        />
                                    </div>
                                    <pre
                                        id="hk-summary-text"
                                        style={{
                                            flex: "1 1 300px",
                                            whiteSpace: "pre-wrap",
                                            background: "#eee",
                                            padding: 12,
                                            borderRadius: 8,
                                            fontSize: 14,
                                            height: 180,
                                            overflowY: "auto",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
