import React, { useEffect, useRef, useState, useCallback } from "react";
import {
    evaluateStamina,
    calculateCaloriesDynamic,
    plotWorkoutSummary,
} from "./Utils";
import {drawConnectors, drawLandmarks} from "@mediapipe/drawing_utils";
import {Pose, POSE_CONNECTIONS} from "@mediapipe/pose";
import {Camera} from "@mediapipe/camera_utils";
import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import {ArrowLeft, Download, Trophy} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import PerformanceInsights from "@/components/PerformanceInsights.tsx";


const placeholderUser = {
    name: "Guest",
    age: 25,
    weight: 70, // in kg
    gender: "male",
    height: "175cm"
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
            avg_pose_score: Number(avgPose.toFixed(2))*100,
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
        <div className="min-h-screen bg-background overflow-hidden z-[-1]" >
            <div className="relative z-10">

                <header className="border-b border-border/50 backdrop-blur-xl bg-background/80">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link to="/exercise">
                                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back to Exercise
                                    </Button>
                                </Link>
                                <div>
                                    <h1 className="text-2xl font-bold text-foreground">High Knees Analysis</h1>
                                    <p className="text-sm text-muted-foreground">Live camera analysis</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

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

                <div >
                    <div className={"flex justify-center items-center mt-6"}
                        style={{
                            width: 800,
                            height: 600,
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


                    {/*<div*/}
                    {/*    style={{ padding: 8, background: "#fff", borderRadius: 8, color: "#000" }}*/}
                    {/*>*/}
                    {/*    <div>*/}
                    {/*        <strong>User:</strong> {activeUser?.name ?? "—"}*/}
                    {/*    </div>*/}
                    {/*    <div>*/}
                    {/*        <strong>Elapsed Time:</strong> {Math.floor(elapsedTime)}s*/}
                    {/*    </div>*/}
                    {/*    <div>*/}
                    {/*        <strong>Reps:</strong> {reps}*/}
                    {/*    </div>*/}
                    {/*    <div>*/}
                    {/*        <strong>Pose Score:</strong> {poseScore}*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {summary && (

                        <>
                            <section className="animate-fade-in">
                                <Card className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-card/90 via-card/80 to-card/70 border-0 shadow-2xl glow-primary">
                                    <div className="absolute inset-0 bg-gradient-to-br from-kompte-purple/5 via-transparent to-velocity-orange/5"></div>
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-kompte-purple via-velocity-orange to-accuracy-green"></div>


                                    <CardHeader className="relative">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-2">
                                                    Session Results
                                                </CardTitle>
                                                <p className="text-sm text-muted-foreground">
                                                    Video Analysis
                                                </p>
                                            </div>
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center">
                                                <Trophy className="w-6 h-6 text-primary" />
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="relative">
                                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                                            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-kompte-purple/10 to-kompte-purple/5 border border-kompte-purple/20 hover:shadow-lg hover:scale-105 transition-all duration-300">
                                                <div className="text-xs uppercase tracking-wider text-kompte-purple font-semibold mb-2">Name</div>
                                                <div className="text-xl font-bold text-foreground">{summary.activeUser.name}</div>
                                            </div>

                                            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-velocity-orange/10 to-velocity-orange/5 border border-velocity-orange/20 hover:shadow-lg hover:scale-105 transition-all duration-300">
                                                <div className="text-xs uppercase tracking-wider text-velocity-orange font-semibold mb-2">Age</div>
                                                <div className="text-xl font-bold text-foreground">{summary.activeUser.age}</div>
                                            </div>

                                            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-data-blue/10 to-data-blue/5 border border-data-blue/20 hover:shadow-lg hover:scale-105 transition-all duration-300">
                                                <div className="text-xs uppercase tracking-wider text-data-blue font-semibold mb-2">Reps</div>
                                                <div className="text-xl font-bold text-foreground">{summary.total_reps}</div>
                                            </div>

                                            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-accuracy-green/10 to-accuracy-green/5 border border-accuracy-green/20 hover:shadow-lg hover:scale-105 transition-all duration-300">
                                                <div className="text-xs uppercase tracking-wider text-accuracy-green font-semibold mb-2">Height</div>
                                                <div className="text-xl font-bold text-foreground">{summary.activeUser.height}</div>
                                            </div>





                                            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-kompte-purple/10 to-kompte-purple/5 border border-kompte-purple/20 hover:shadow-lg hover:scale-105 transition-all duration-300">
                                                <div className="text-xs uppercase tracking-wider text-kompte-purple font-semibold mb-2">Weight</div>
                                                <div className="text-xl font-bold text-foreground">{summary.activeUser.weight} kg</div>
                                            </div>

                                            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-velocity-orange/10 to-velocity-orange/5 border border-velocity-orange/20 hover:shadow-lg hover:scale-105 transition-all duration-300">
                                                <div className="text-xs uppercase tracking-wider text-velocity-orange font-semibold mb-2">Gender</div>
                                                <div className="text-xl font-bold text-foreground">{summary.activeUser.gender}</div>
                                            </div>
                                        </div>

                                        <div className="flex justify-center">
                                            <Button className="gap-2 bg-gradient-to-r from-kompte-purple to-velocity-orange hover:from-kompte-purple/90 hover:to-velocity-orange/90 text-white border-0 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                                <Download className="w-5 h-5" />
                                                Download Premium Report
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>
                            <section>
                                <PerformanceInsights stamina={summary.stamina} cal={summary.calories} form={summary.avg_pose_score} recov={summary.total_duration}/>
                            </section>
                            <div
                                style={{ marginTop: 12, background: "#fff", padding: 8, borderRadius: 8 }} className={"grid-cols-2"}
                            >
                                <div style={{ marginTop: 12, background: "#fff", padding: 8, borderRadius: 8 }}>
                                    <h4>Charts</h4>
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 px-[15rem]">
                                        <div style={{ flex: "1 1 600px", height: 360 }}>
                                            <canvas id="hk-reps-chart" style={{ width: "100%", height: "100%" }} />
                                        </div>
                                        <div style={{ flex: "1 1 600px", height: 360 }}>
                                            <canvas id="hk-pose-chart" style={{ width: "100%", height: "100%" }} />
                                        </div>
                                        <div style={{ flex: "1 1 600px", height: 360 }}>
                                            <canvas id="hk-activity-chart" style={{ width: "100%", height: "100%" }} />
                                        </div>

                                    </div>
                                </div>


                            </div>

                        </>


                    )}

                </div>
            </div>
        </div>
    );
}
