  "use client";
  import axios from "axios";

  import { useEffect, useRef, useState } from "react";

  const exercises = {
    curl: { joints: ["shoulder", "elbow", "wrist"], thresholds: [160, 30] },
    squat: { joints: ["hip", "knee", "ankle"], thresholds: [160, 90] },
    pushup: { joints: ["shoulder", "wrist", "elbow"], thresholds: [160, 90] },
    shoulderPress: { joints: ["shoulder", "wrist", "elbow"], thresholds: [160, 90] }, // added new shoulder pess
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
        });

        camera.start();
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
          "https://flex-it-out.onrender.com/api/v1/user/updateExerciseCount",
          { exercise },
          { withCredentials: true } // Ensures cookies/session are sent
        );
      } catch (error) {
        console.error("Failed to update exercise count:", error);
      }
    };

    const onResults = (results) => {
      if (!results.poseLandmarks || !canvasRef.current) return;

      const canvasCtx = canvasRef.current.getContext("2d");
      if (!canvasCtx) return;
      canvasCtx.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      drawConnectorsRef.current(
        canvasCtx,
        results.poseLandmarks,
        POSE_CONNECTIONS_REF.current,
        { color: "#DC143C", lineWidth: 1 }
      );
      drawLandmarksRef.current(canvasCtx, results.poseLandmarks, {
        color: "#FFFF00",
        radius: 1,
      });

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

        if (!jointMap[joints[0]] || !jointMap[joints[1]] || !jointMap[joints[2]])
          return;

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
                updateExerciseCount(currentExerciseUp); // 🔥 Fix: Ensure correct exercise is passed
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

    const changeExercise = (exercise) => {
      localStorage.setItem('currentExercise', exercise);
      setCurrentExercise(exercise);
      setCounter(0);
      setStage(null);
      setAngleHistory([]);
    };


    useEffect(() => {
      localStorage.setItem('currentExercise', "curl");
    }, [])

    useEffect(() => {

      const handleKeyPress = (e) => {
        const keyMap = { 1: "curl", 2: "squat", 3: "pushup","shoulderPress":4 };
        if (keyMap[e.key]) changeExercise(keyMap[e.key]);
      };

      window.addEventListener("keypress", handleKeyPress);
      return () => window.removeEventListener("keypress", handleKeyPress);
    }, []);

    return (
      <div className="  text-white font-poppins">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Video Preview Section */}
            <div className="flex-1 border-2 border-blue-600 relative rounded-xl overflow-hidden shadow-2xl">
              <video
                ref={videoRef}
                autoPlay
                className="absolute inset-0 w-full h-full object-cover"
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
              />
            </div>

            {/* Control Panel */}
            <div className="lg:w-96 bg-gray-800 rounded-xl p-6 shadow-2xl">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  <span
                    className={`inline-block px-4 py-2 rounded-full bg-[${exercises[currentExercise].color}]`}
                  >
                    {currentExercise.toUpperCase()}
                  </span>
                </h2>

                <div className="bg-gray-700 rounded-lg p-4 mb-4">
                  <div className="text-4xl font-bold text-center mb-2 animate-pulse">
                    {counter}
                  </div>
                  <div className="text-center text-sm text-gray-300">
                    REPETITIONS
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-300 mb-1">
                      CURRENT STAGE
                    </div>
                    <div className="font-semibold text-lg">{stage || "-"}</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-300 mb-1">ANGLE</div>
                    <div className="font-semibold text-lg">
                      {angleHistory[0] ? angleHistory[0].toFixed(1) + "°" : "-"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Exercise Selector */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">
                  SELECT EXERCISE
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(exercises).map(([key, ex]) => (
                    <button
                      key={key}
                      onClick={() => changeExercise(key)}
                      className={`p-2  border rounded-lg text-sm font-medium transition-all ${currentExercise === key ? "text-white" : "text-gray-400"
                        } ${currentExercise === key ? "scale-105" : "hover:scale-95"
                        }`}
                      style={{
                        backgroundColor:
                          currentExercise === key ? ex.color : "#2D3748",
                        border:
                          currentExercise === key
                            ? `2px solid ${ex.color}`
                            : "2px solid #4A5568",
                      }}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Angle History */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-2">ANGLE HISTORY</h3>
                <div className="space-y-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const angle = angleHistory[i] || null; // Use null for empty frames
                    return (
                      <div
                        key={i}
                        className="flex h-5 items-center bg-gray-700 rounded-md p-4"
                      >
                        <div className="w-16 text-sm text-gray-400">Frame {i + 1}</div>
                        <div className="flex-1 h-1.5 bg-gray-600 rounded-full">
                          <div
                            className="h-1.5 rounded-full transition-all"
                            style={{
                              width: angle ? `${(angle / 180) * 100}%` : "0%", // Show 0% width if angle is null
                              backgroundColor: angle ? exercises[currentExercise].color : "transparent", // Transparent if no angle
                            }}
                          />
                        </div>
                        <div className="w-10 text-right text-xs">
                          {angle ? angle.toFixed(1) + "°" : "-"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default FitnessTracker;
