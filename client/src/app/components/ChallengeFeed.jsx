"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

const exercises = {
    curl: { joints: ["shoulder", "elbow", "wrist"], thresholds: [160, 30] },
    squat: { joints: ["hip", "knee", "ankle"], thresholds: [160, 90] },
    pushup: { joints: ["shoulder", "wrist", "elbow"], thresholds: [160, 90] },
};

const ChallengeFeed = ({ setRepsCount, exerciseType }) => {
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
            if (!videoRef.current) return;
            const { Pose } = await import("@mediapipe/pose");
            const { Camera } = await import("@mediapipe/camera_utils");
            const drawingUtils = await import("@mediapipe/drawing_utils");

            drawConnectorsRef.current = drawingUtils.drawConnectors;
            drawLandmarksRef.current = drawingUtils.drawLandmarks;
            POSE_CONNECTIONS_REF.current = drawingUtils.POSE_CONNECTIONS;

            poseRef.current = new Pose({
                locateFile: (file) =>
                    `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
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
                facingMode: "user",
            });

            try {
                await camera.start();
            } catch (err) {
                console.error("Camera.start failed, falling back to getUserMedia:", err);
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        await videoRef.current.play();
                    }
                } catch (e) {
                    console.error("getUserMedia fallback failed:", e);
                }
            }
        }

        loadMediaPipe();
    }, []);

    const calculateAngle = (a, b, c) => {
        const radians =
            Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
        let angle = Math.abs((radians * 180) / Math.PI);
        return angle > 180 ? 360 - angle : angle;
    };

    const updateExerciseCount = async (exercise) => {
        try {
            console.log(exercise);
            const inc = await axios.post(
                "https://flex-it-out-3tml.vercel.app/api/v1/user/updateExerciseCount",
                { exercise },
                { withCredentials: true }
            );
        } catch (error) {
            console.error("Failed to update exercise count:", error);
        }
    };

    const onResults = (results) => {
        if (!results.poseLandmarks || !canvasRef.current) return;

        const canvasCtx = canvasRef.current.getContext("2d");
        if (!canvasCtx) return;
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        drawConnectorsRef.current(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS_REF.current, { color: "#DC143C", lineWidth: 1 });
        drawLandmarksRef.current(canvasCtx, results.poseLandmarks, { color: "#FFFF00", radius: 1 });

        const currentExercise = localStorage.getItem('currentExercise') || "curl";
        const { joints, thresholds } = exercises[currentExercise];
        const landmarks = results.poseLandmarks;

        try {
            const jointMap = {
                shoulder: landmarks[11],
                elbow: landmarks[13],
                wrist: landmarks[15],
                hip: landmarks[23],
                knee: landmarks[25],
                ankle: landmarks[27],
            };

            if (!jointMap[joints[0]] || !jointMap[joints[1]] || !jointMap[joints[2]]) return;

            const [a, b, c] = joints.map((j) => jointMap[j]);
            const angle = calculateAngle(a, b, c);

            setAngleHistory((prev) => [angle, ...prev.slice(0, 4)]);

            setStage((prevStage) => {
                if (angle > thresholds[0] && prevStage !== "up") {
                    return "up";
                }
                if (angle < thresholds[1] && prevStage === "up") {
                    setCounter((prev) => {
                        const newCount = prev + 0.5;
                        if (newCount % 1 === 0) {
                            const currentExerciseUp = localStorage.getItem('currentExercise') || "curl"
                            updateExerciseCount(currentExerciseUp);
                        }
                        return newCount;
                    });
                    return "down";
                }
                return prevStage;
            });

        } catch (error) {
            console.error("Error processing pose data:", error);
        }
    };

    useEffect(() => {
        if (counter % 1 === 0) {
            setRepsCount(counter);
        }
    }, [counter]);

    const changeExercise = (exercise) => {
        localStorage.setItem('currentExercise', exercise);
        setCurrentExercise(exercise);
        setCounter(0);
        setStage(null);
        setAngleHistory([]);
    };

    useEffect(() => {
        localStorage.setItem('currentExercise', "curl");
    }, []);

    useEffect(() => {
        changeExercise(exerciseType);
    }, [exerciseType]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            const keyMap = { 1: "curl", 2: "squat", 3: "pushup" };
            if (keyMap[e.key]) changeExercise(keyMap[e.key]);
        };

        window.addEventListener("keypress", handleKeyPress);
        return () => window.removeEventListener("keypress", handleKeyPress);
    }, []);

    return (
        <div className="text-white font-poppins  ">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 relative rounded-xl overflow-hidden shadow-2xl border-2 border-blue-600 min-h-64">
                        <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover z-0" />
                        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 pointer-events-none" />

                        <div className="absolute bottom-4 right-4 h-28 w-24 bg-gray-800 rounded-xl p-2 shadow-2xl flex flex-col justify-center items-center">
                            <div className="text-xs font-bold text-center mb-1">
                                <span className={`inline-block px-2 py-1 rounded-full bg-[${exercises[currentExercise].color}]`}>
                                    {currentExercise.toUpperCase()}
                                </span>
                            </div>
                            <div className="text-lg font-bold text-center mb-1 animate-pulse">
                                {counter}
                            </div>
                            <div className="text-[8px] text-gray-300 text-center">
                                REPETITIONS
                            </div>
                            <div className="grid grid-cols-2 gap-1 mt-1">
                                <div className="text-[8px] text-gray-300 text-center">
                                    <div>STAGE</div>
                                    <div className="font-semibold">{stage || "-"}</div>
                                </div>
                                <div className="text-[8px] text-gray-300 text-center">
                                    <div>ANGLE</div>
                                    <div className="font-semibold">
                                        {angleHistory[0] ? angleHistory[0].toFixed(1) + "°" : "-"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChallengeFeed;
