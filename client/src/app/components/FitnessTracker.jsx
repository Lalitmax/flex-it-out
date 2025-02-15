"use client";

import { useEffect, useRef, useState } from "react";

const exercises = {
    curl: { joints: ["shoulder", "elbow", "wrist"], thresholds: [160, 30] },
    squat: { joints: ["hip", "knee", "ankle"], thresholds: [160, 90] },
    pushup: { joints: ["shoulder", "elbow", "wrist"], thresholds: [160, 90] },
};

const FitnessTracker = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [counter, setCounter] = useState(0);
    const [stage, setStage] = useState(null);
    const [angleHistory, setAngleHistory] = useState([]);
    const [currentExercise, setCurrentExercise] = useState("curl");
    const poseRef = useRef(null);
    const drawConnectorsRef = useRef(null);
    const drawLandmarksRef = useRef(null);
    const POSE_CONNECTIONS_REF = useRef(null);

    useEffect(() => {
        async function loadMediaPipe() {
            const { Pose } = await import("@mediapipe/pose");
            const { Camera } = await import("@mediapipe/camera_utils");
            const drawingUtils = await import("@mediapipe/drawing_utils");

            drawConnectorsRef.current = drawingUtils.drawConnectors;
            drawLandmarksRef.current = drawingUtils.drawLandmarks;
            POSE_CONNECTIONS_REF.current = drawingUtils.POSE_CONNECTIONS;

            poseRef.current = new Pose({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
            });

            poseRef.current.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                enableSegmentation: false,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });

            poseRef.current.onResults(onResults);

            const camera = new Camera(videoRef.current, {
                onFrame: async () => {
                    if (poseRef.current) {
                        await poseRef.current.send({ image: videoRef.current });
                    }
                },
                width: 640,
                height: 480,
            });

            camera.start();
        }

        loadMediaPipe();
    }, []);

    const calculateAngle = (a, b, c) => {
        const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
        let angle = Math.abs((radians * 180) / Math.PI);
        return angle > 180 ? 360 - angle : angle;
    };

    const onResults = (results) => {
        if (!results.poseLandmarks) return;

        const canvasCtx = canvasRef.current.getContext("2d");
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        drawConnectorsRef.current(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS_REF.current, { color: "#DC143C", lineWidth: 1 });
        drawLandmarksRef.current(canvasCtx, results.poseLandmarks, { color: "#FFFF00", radius: 1 });

        const { joints, thresholds } = exercises[currentExercise];
        const landmarks = results.poseLandmarks;

        try {
            // Dynamically map joints based on selected exercise
            const jointMap = {
                shoulder: landmarks[11], elbow: landmarks[13], wrist: landmarks[15],
                hip: landmarks[23], knee: landmarks[25], ankle: landmarks[27]
            };

            if (!jointMap[joints[0]] || !jointMap[joints[1]] || !jointMap[joints[2]]) {
                return; // Prevent errors if joints are not detected
            }

            const [a, b, c] = joints.map(j => jointMap[j]);
            const angle = calculateAngle(a, b, c);

            setAngleHistory(prev => [angle, ...prev.slice(0, 4)]);

            setStage((prevStage) => {
                if (angle > thresholds[0] && prevStage !== "up") {
                    return "up";
                }
                if (angle < thresholds[1] && prevStage === "up") {
                    setCounter(prev => prev + 0.5);
                    return "down";
                }
                return prevStage;
            });

        } catch (error) {
            console.error("Error processing pose data:", error);
        }
    };

    const changeExercise = (exercise) => {
        setCurrentExercise(exercise);
        setCounter(0);
        setStage(null);
        setAngleHistory([]);
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            const keyMap = { "1": "curl", "2": "squat", "3": "pushup" };
            if (keyMap[e.key]) changeExercise(keyMap[e.key]);
        };

        window.addEventListener("keypress", handleKeyPress);
        return () => window.removeEventListener("keypress", handleKeyPress);
    }, []);

    return (
        <div>
            <div style={{ position: "relative", width: 640, height: 480 }}>
                <video ref={videoRef} autoPlay style={{ position: "absolute", width: "100%", height: "100%" }} />
                <canvas ref={canvasRef} style={{ position: "absolute", width: "100%", height: "100%" }} />
            </div>
            <div>
                <h2>{currentExercise.toUpperCase()}</h2>
                <p>Count: {counter}</p>
                <p>Stage: {stage || "-"}</p>
                {angleHistory.map((angle, i) => (
                    <p key={i}>Angle {i + 1}: {angle.toFixed(1)}°</p>
                ))}
                <button onClick={() => changeExercise("curl")}>Curls (1)</button>
                <button onClick={() => changeExercise("squat")}>Squats (2)</button>
                <button onClick={() => changeExercise("pushup")}>Pushups (3)</button>
            </div>
        </div>
    );
};

export default FitnessTracker;
