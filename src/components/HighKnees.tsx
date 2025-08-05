import React, { useEffect, useRef, useState } from "react";
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

export default function HighKneesApp() {
    const repCountRef = useRef(0);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [reps, setReps] = useState(0);
    const [status, setStatus] = useState("Waiting...");
    const [isWebcam, setIsWebcam] = useState(false);
    const poseInstance = useRef(null);

    // Timer and tracking refs
    const startTimeRef = useRef(null);
    const lastKneeRef = useRef(null);
    const lastTimeRef = useRef(0);
    const timerStartedRef = useRef(false);

    // State variables
    const poseScoresRef = useRef([]);
    const [summary, setSummary] = useState(null);
    const [pauseTime, setPauseTime] = useState(0);
    const pauseStartRef = useRef(null);
    const videoEndedRef = useRef(false);

    // Constants
    const TIMER_DURATION = 30; // seconds
    const MARGIN = 0.12;
    const COOLDOWN = 0.1;

    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Setup Pose with correct path
        poseInstance.current = new Pose({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
            }
        });

        poseInstance.current.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        poseInstance.current.onResults((results) => {
            // Don't process if video has ended or canvas not ready
            if (!ctx || videoEndedRef.current) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (results.image) {
                ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
            }

            if (results.poseLandmarks && results.poseLandmarks.length > 0) {
                const lm = results.poseLandmarks;

                // ENHANCED: Draw landmarks with high visibility
                try {
                    // Draw all pose connections in bright green
                    drawConnectors(ctx, lm, POSE_CONNECTIONS, {
                        color: "#00FF00",
                        lineWidth: 4,
                    });

                    // Draw all landmarks in bright red
                    drawLandmarks(ctx, lm, {
                        color: "#FF0000",
                        lineWidth: 3,
                        radius: 6,
                    });

                    // Highlight key points for high knees tracking
                    // Left knee (index 25) in yellow
                    if (lm[25] && lm[25].visibility > 0.5) {
                        ctx.fillStyle = "#FFFF00";
                        ctx.beginPath();
                        ctx.arc(lm[25].x * canvas.width, lm[25].y * canvas.height, 12, 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.strokeStyle = "#000000";
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    }

                    // Right knee (index 26) in yellow
                    if (lm[26] && lm[26].visibility > 0.5) {
                        ctx.fillStyle = "#FFFF00";
                        ctx.beginPath();
                        ctx.arc(lm[26].x * canvas.width, lm[26].y * canvas.height, 12, 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.strokeStyle = "#000000";
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    }

                    // Highlight hips in blue for reference
                    if (lm[23] && lm[23].visibility > 0.5) { // Left hip
                        ctx.fillStyle = "#0088FF";
                        ctx.beginPath();
                        ctx.arc(lm[23].x * canvas.width, lm[23].y * canvas.height, 10, 0, 2 * Math.PI);
                        ctx.fill();
                    }

                    if (lm[24] && lm[24].visibility > 0.5) { // Right hip
                        ctx.fillStyle = "#0088FF";
                        ctx.beginPath();
                        ctx.arc(lm[24].x * canvas.width, lm[24].y * canvas.height, 10, 0, 2 * Math.PI);
                        ctx.fill();
                    }

                } catch (drawError) {
                    console.error("Drawing error:", drawError);
                }

                // Calculate pose score
                const score = lm.reduce((sum, landmark) => sum + (landmark.visibility || 0), 0) / lm.length;
                poseScoresRef.current.push(score);

                // Reset pause time if pose is detected
                if (pauseStartRef.current) {
                    const pauseDuration = (Date.now() - pauseStartRef.current) / 1000;
                    setPauseTime(prev => prev + pauseDuration);
                    pauseStartRef.current = null;
                }

                // Get knee and hip positions with visibility check
                const leftKnee = lm[25];   // LEFT_KNEE
                const rightKnee = lm[26];  // RIGHT_KNEE
                const leftHip = lm[23];    // LEFT_HIP
                const rightHip = lm[24];   // RIGHT_HIP

                // Only proceed if we have good visibility for key landmarks
                if (leftKnee && rightKnee && leftHip && rightHip &&
                    leftKnee.visibility > 0.5 && rightKnee.visibility > 0.5 &&
                    leftHip.visibility > 0.5 && rightHip.visibility > 0.5) {

                    const leftKneeY = leftKnee.y;
                    const rightKneeY = rightKnee.y;
                    const hipY = (leftHip.y + rightHip.y) / 2;

                    const currentTime = Date.now() / 1000;

                    // Start timer when first knee lift is detected
                    if (!timerStartedRef.current) {
                        if (Math.abs(leftKneeY - hipY) < MARGIN || Math.abs(rightKneeY - hipY) < MARGIN) {
                            timerStartedRef.current = true;
                            startTimeRef.current = Date.now();
                            setStatus("Exercise started! Lift your knees!");
                        }
                    }

                    if (timerStartedRef.current && startTimeRef.current) {
                        const elapsed = (Date.now() - startTimeRef.current) / 1000;
                        const remaining = Math.max(0, Math.floor(TIMER_DURATION - elapsed));

                        // Check for left knee lift
                        if (Math.abs(leftKneeY - hipY) < MARGIN && lastKneeRef.current !== "left") {
                            if (currentTime - lastTimeRef.current > COOLDOWN) {
                                repCountRef.current++;
                                setReps(repCountRef.current);
                                lastKneeRef.current = "left";
                                lastTimeRef.current = currentTime;

                                // Visual feedback for successful rep
                                ctx.fillStyle = "#00FF00";
                                ctx.font = "30px Arial";
                                ctx.fillText("LEFT!", 50, 150);
                            }
                        }
                        // Check for right knee lift
                        else if (Math.abs(rightKneeY - hipY) < MARGIN && lastKneeRef.current !== "right") {
                            if (currentTime - lastTimeRef.current > COOLDOWN) {
                                repCountRef.current++;
                                setReps(repCountRef.current);
                                lastKneeRef.current = "right";
                                lastTimeRef.current = currentTime;

                                // Visual feedback for successful rep
                                ctx.fillStyle = "#00FF00";
                                ctx.font = "30px Arial";
                                ctx.fillText("RIGHT!", canvas.width - 150, 150);
                            }
                        }

                        // Display current status on canvas
                        ctx.fillStyle = "#FFFFFF";
                        ctx.font = "20px Arial";
                        ctx.fillText(`Reps: ${repCountRef.current}`, 20, 40);
                        ctx.fillText(`Time: ${Math.floor(elapsed)}s`, 20, 70);

                        // For uploaded videos, check if we should end based on video duration
                        if (!isWebcam && video && video.duration && elapsed >= video.duration) {
                            generateSummary();
                            return;
                        }

                        // For webcam or timer-based exercise, check if time is up
                        if (remaining === 0 && isWebcam) {
                            generateSummary();
                            setStatus("Time's up! Great job!");
                            return;
                        }

                        setStatus(`Reps: ${repCountRef.current} | Time: ${Math.floor(elapsed)}s`);
                    } else {
                        setStatus("Waiting for knee lift to start...");
                    }
                }
            } else {
                // No pose detected - start pause timer
                if (timerStartedRef.current && !pauseStartRef.current) {
                    pauseStartRef.current = Date.now();
                }

                // Display "No pose detected" message
                ctx.fillStyle = "#FF0000";
                ctx.font = "24px Arial";
                ctx.fillText("No pose detected", canvas.width/2 - 100, canvas.height/2);
            }
        });

        return () => {
            if (video && video.srcObject) {
                video.srcObject.getTracks().forEach((track) => track.stop());
            }
        };
    }, [isWebcam]);

    const generateSummary = () => {
        videoEndedRef.current = true;
        const totalTime = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0;
        const scores = poseScoresRef.current;
        const avgScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

        const user = {
            name: "User",
            age: 25,
            gender: "Male",
            weight: 70,
        };

        const staminaLevel = evaluateStamina(user.age, user.weight, repCountRef.current, totalTime, avgScore, pauseTime);
        const caloriesBurned = calculateCaloriesDynamic(repCountRef.current, totalTime, user.weight, user.age, user.gender, "high_knees");

        const summaryData = {
            ...user,
            duration_sec: totalTime.toFixed(1),
            reps: repCountRef.current,
            avg_pose_score: avgScore.toFixed(2),
            pause_time: pauseTime.toFixed(1),
            stamina: staminaLevel,
            calories: caloriesBurned.toFixed(2),
        };

        setSummary(summaryData);
        setStatus("Exercise completed! Check your summary below.");
    };

    function evaluateStamina(age, weight, reps, duration, avgScore, pauseTime) {
        let score = 0;
        duration = duration > 0 ? duration : 1;
        const repRate = (reps / duration) * 60;

        // Repetition Rate (adjusted for high knees)
        if (repRate > 60) score += 2;
        else if (repRate >= 40) score += 1;

        // Pose Quality
        if (avgScore > 0.8) score += 2;
        else if (avgScore >= 0.6) score += 1;

        // Pause Time
        if (pauseTime < 5) score += 2;
        else if (pauseTime < 10) score += 1;

        // Age
        if (age < 25) score += 2;
        else if (age <= 35) score += 1;

        // Final Levels
        if (score >= 8) return "Elite 💎";
        else if (score >= 7) return "Excellent 💪";
        else if (score >= 5) return "Good 🙂";
        else if (score >= 3) return "Average 😐";
        else return "Needs Improvement 😓";
    }

    function calculateCaloriesDynamic(reps, durationSec, weightKg, age, gender, exerciseType = "generic") {
        const durationMin = durationSec / 60;
        if (durationMin === 0) return 0.0;

        let bmr;
        if (gender.toLowerCase() === "male" || gender.toLowerCase() === "m") {
            bmr = 10 * weightKg + 6.25 * 170 - 5 * age + 5;
        } else {
            bmr = 10 * weightKg + 6.25 * 160 - 5 * age - 161;
        }

        const caloriesPerMin = bmr / 1440;
        const multiplierMap = {
            jumping_jacks: 8,
            high_knees: 8.5,
            squats: 6.5,
            pushups: 7.0,
            generic: 6.0
        };
        const multiplier = multiplierMap[exerciseType.toLowerCase()] || 6.0;
        const totalCalories = caloriesPerMin * durationMin * (multiplier / 1.5);

        return parseFloat(totalCalories.toFixed(2));
    }

    const processFrameLoop = () => {
        const video = videoRef.current;
        const pose = poseInstance.current;

        const step = async () => {
            if (video && pose && !video.paused && !video.ended && !videoEndedRef.current) {
                try {
                    await pose.send({ image: video });
                } catch (error) {
                    console.error("Error processing frame:", error);
                }
                requestAnimationFrame(step);
            }
        };

        if (video && pose) {
            requestAnimationFrame(step);
        }
    };

    const resetWorkout = () => {
        poseScoresRef.current = [];
        setPauseTime(0);
        repCountRef.current = 0;
        setReps(0);
        lastKneeRef.current = null;
        lastTimeRef.current = 0;
        startTimeRef.current = null;
        timerStartedRef.current = false;
        videoEndedRef.current = false;
        setSummary(null);
        setStatus("Waiting...");
        pauseStartRef.current = null;
    };

    const handleVideoUpload = (e) => {
        resetWorkout();

        const file = e.target.files[0];
        if (!file) return;

        console.log("Video file selected:", file.name);
        setIsWebcam(false);
        const video = videoRef.current;

        // Clean up previous video
        if (video.src) {
            URL.revokeObjectURL(video.src);
        }

        video.src = URL.createObjectURL(file);

        video.onloadedmetadata = () => {
            console.log(`Video loaded: ${video.duration.toFixed(2)}s duration`);
            setStatus(`Video loaded (${video.duration.toFixed(1)}s). Processing...`);
        };

        video.onloadeddata = () => {
            video.currentTime = 0;
            video.play().then(() => {
                console.log("Video started playing");
                processFrameLoop();
            }).catch(error => {
                console.error("Error playing video:", error);
                setStatus("Error playing video");
            });
        };

        video.onended = () => {
            console.log("Video playback ended");
            if (!videoEndedRef.current) {
                generateSummary();
            }
        };

        video.onerror = (error) => {
            console.error("Video error:", error);
            setStatus("Error loading video file");
        };
    };

    const startWebcam = async () => {
        resetWorkout();
        setIsWebcam(true);

        try {
            const video = videoRef.current;
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: 640,
                    height: 480,
                    facingMode: 'user'
                }
            });
            video.srcObject = stream;

            const camera = new Camera(video, {
                onFrame: async () => {
                    if (poseInstance.current && !videoEndedRef.current) {
                        try {
                            await poseInstance.current.send({ image: video });
                        } catch (error) {
                            console.error("Frame processing error:", error);
                        }
                    }
                },
                width: 640,
                height: 480,
            });

            camera.start();
            setStatus("Webcam started! Begin high knees when ready!");
        } catch (error) {
            console.error("Error accessing webcam:", error);
            setStatus("Error accessing webcam. Please check permissions and try again.");
        }
    };

    const stopWebcam = () => {
        const video = videoRef.current;
        if (video && video.srcObject) {
            video.srcObject.getTracks().forEach((track) => track.stop());
            video.srcObject = null;
        }
        if (!videoEndedRef.current && timerStartedRef.current) {
            generateSummary();
        }
        setIsWebcam(false);
        setStatus("Webcam stopped.");
    };

    return (
        <div
            style={{
                textAlign: "center",
                background: "#111",
                color: "white",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                paddingTop: "20px",
                fontFamily: "Arial, sans-serif"
            }}
        >
            <h1 style={{ color: "#4CAF50", marginBottom: "10px" }}>🏃‍♂️ High Knees Exercise Tracker</h1>
            <p style={{ fontSize: "18px", margin: "15px 0", color: "#4CAF50", fontWeight: "bold" }}>
                {status}
            </p>

            <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                <button
                    onClick={startWebcam}
                    disabled={isWebcam}
                    style={{
                        padding: "12px 24px",
                        fontSize: "16px",
                        backgroundColor: isWebcam ? "#666" : "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: isWebcam ? "not-allowed" : "pointer",
                        fontWeight: "bold"
                    }}
                >
                    📷 Start Webcam
                </button>

                <button
                    onClick={stopWebcam}
                    disabled={!isWebcam}
                    style={{
                        padding: "12px 24px",
                        fontSize: "16px",
                        backgroundColor: !isWebcam ? "#666" : "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: !isWebcam ? "not-allowed" : "pointer",
                        fontWeight: "bold"
                    }}
                >
                    🛑 Stop Webcam
                </button>

                <label style={{
                    padding: "12px 24px",
                    fontSize: "16px",
                    backgroundColor: "#FF9800",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}>
                    📁 Upload Video
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        style={{ display: "none" }}
                    />
                </label>
            </div>

            <video
                ref={videoRef}
                style={{ display: "none" }}
                width={640}
                height={480}
                playsInline
                muted
            />

            <canvas
                ref={canvasRef}
                width={640}
                height={480}
                style={{
                    marginTop: "15px",
                    maxWidth: "90%",
                    border: "3px solid #4CAF50",
                    borderRadius: "10px",
                    backgroundColor: "#000"
                }}
            />

            <div style={{
                marginTop: "20px",
                padding: "15px",
                backgroundColor: "#222",
                borderRadius: "8px",
                minWidth: "300px"
            }}>
                <h3 style={{ color: "#4CAF50", margin: "0 0 10px 0" }}>📊 Live Stats</h3>
                <p style={{ margin: "5px 0", fontSize: "18px" }}><strong>Reps:</strong> {reps}</p>
                <p style={{ margin: "5px 0", fontSize: "16px" }}>
                    <strong>Exercise:</strong> High Knees (30s timer for webcam)
                </p>
            </div>

            {summary && (
                <div style={{
                    background: "linear-gradient(135deg, #2C5530, #1B4332)",
                    padding: "25px",
                    marginTop: "25px",
                    borderRadius: "12px",
                    maxWidth: "600px",
                    textAlign: "left",
                    border: "2px solid #4CAF50"
                }}>
                    <h3 style={{ textAlign: "center", color: "#4CAF50", marginBottom: "20px", fontSize: "24px" }}>
                        🏆 High Knees Workout Summary
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                        <p><strong>👤 Name:</strong> {summary.name}</p>
                        <p><strong>🎂 Age:</strong> {summary.age}</p>
                        <p><strong>⚧ Gender:</strong> {summary.gender}</p>
                        <p><strong>⚖️ Weight:</strong> {summary.weight} kg</p>
                        <p><strong>⏱️ Duration:</strong> {summary.duration_sec}s</p>
                        <p><strong>🔢 Reps:</strong> {summary.reps}</p>
                        <p><strong>📈 Pose Score:</strong> {summary.avg_pose_score}</p>
                        <p><strong>⏸️ Pause Time:</strong> {summary.pause_time}s</p>
                    </div>
                    <div style={{ marginTop: "15px", padding: "15px", backgroundColor: "#1B4332", borderRadius: "8px" }}>
                        <p style={{ fontSize: "18px", textAlign: "center" }}>
                            <strong>💪 Stamina:</strong> <span style={{ color: "#4CAF50" }}>{summary.stamina}</span>
                        </p>
                        <p style={{ fontSize: "18px", textAlign: "center" }}>
                            <strong>🔥 Calories:</strong> <span style={{ color: "#FF9800" }}>{summary.calories} kcal</span>
                        </p>
                    </div>
                </div>
            )}

            <div style={{
                marginTop: "30px",
                padding: "20px",
                backgroundColor: "#222",
                borderRadius: "8px",
                maxWidth: "600px",
                fontSize: "14px",
                color: "#ccc"
            }}>
                <h4 style={{ color: "#4CAF50" }}>📝 Instructions:</h4>
                <ul style={{ textAlign: "left", paddingLeft: "20px" }}>
                    <li>Stand in front of the camera with full body visible</li>
                    <li>Start with hands at your sides</li>
                    <li>Lift your knees up toward your chest alternately</li>
                    <li>The system tracks when each knee crosses above hip level</li>
                    <li>Yellow circles = knees, Blue circles = hips, Green lines = pose skeleton</li>
                    <li>For webcam: Exercise runs for 30 seconds</li>
                    <li>For video upload: Processes entire video duration</li>
                </ul>
            </div>
        </div>
    );
}
