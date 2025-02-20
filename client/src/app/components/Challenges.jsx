"use client";
import { Button } from './ui/button';
import ChallengeFeed from './ChallengeFeed';
import { useState, memo, useRef, useEffect } from 'react';
import AgoraVoiceCalling from './AgoraVoiceCalling';
import { FaPlay, FaStop, FaDumbbell, FaRunning, FaFire } from 'react-icons/fa';
import { useRouter } from "next/navigation";
import { socket } from '@/lib/socket';
import { useSelector } from 'react-redux';

const Challenges = memo(({ roomId }) => {
    const exercises = {
        curl: { joints: ["shoulder", "elbow", "wrist"], thresholds: [160, 30], color: "#FF0000", icon: <FaDumbbell /> },
        squat: { joints: ["hip", "knee", "ankle"], thresholds: [160, 90], color: "#00FF00", icon: <FaRunning /> },
        pushup: { joints: ["shoulder", "wrist", "elbow"], thresholds: [160, 90], color: "#0000FF", icon: <FaFire /> },
    };

    const [repsCount, setRepsCount] = useState(0);
    const [repsLimit, setRepsLimit] = useState(0);
    const [timer, setTimer] = useState(0);
    const [exerciseType, setExerciseType] = useState('curl');
    const [isRunning, setIsRunning] = useState(false);
    const [isSettingLimit, setIsSettingLimit] = useState(false); // Track if setting limit
    const [inputValue, setInputValue] = useState(0); // Store input value
    const intervalRef = useRef(null);
    const router = useRouter();
    const channelName = roomId;

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const userData = useSelector((state) => state.auth.user);

    const changeExercise = (exercise) => {
        setExerciseType(exercise);
    };

    const onClickToggle = () => {

        socket.emit('message', { name: 'Lalit' });
        if (isRunning) {
            clearInterval(intervalRef.current);
            setTimer(0);
            setIsRunning(false);
        } else {
            intervalRef.current = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
            setIsRunning(true);
        }
    };

    const handleSetLimit = () => {
        if (isSettingLimit) {
            // Save the limit
            const limit = parseInt(inputValue, 10);
            if (!isNaN(limit)) { // Fixed the missing parenthesis
                setRepsLimit(limit);
                setIsSettingLimit(false); // Disable input after saving
                setInputValue(''); // Clear input
            }
        } else {
            // Enable input for setting limit
            setIsSettingLimit(true);
        }
    };

    useEffect(() => {
        console.log('reps:', repsCount);
        const dataOfDoing = { room: roomId, name: userData.name, exerciseType, repsCount, repsLimit };
        socket.emit("doing", dataOfDoing);
    }, [repsCount]);



    useEffect(() => {
        if (roomId) {
            socket.emit("join_room", roomId);
        }
        return () => {
            socket.emit("leave_room", roomId);
        };
    }, [roomId]);

    return (
        <div className="p-4 bg-gray-900 rounded-3xl mt-5">
            <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row gap-4">
                {/* Left Side - Video and Exercise Feed */}
                <div className="md:w-2/3 border-2 border-gray-700 rounded-lg py-4 bg-gray-800 shadow-lg">
                    <ChallengeFeed setRepsCount={setRepsCount} exerciseType={exerciseType} />
                </div>

                {/* Right Side - Controls and Stats */}
                <div className="md:w-1/3 flex flex-col gap-4  justify-center">
                    {/* Reps and Timer Section */}
                    <div className="border-2 border-gray-700 rounded-lg p-4 bg-gray-800 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-lg font-semibold text-white">
                                <span className="text-blue-500">My Reps:</span> {repsCount}
                            </div>
                            <div className="text-lg font-semibold text-white">
                                <span className="text-green-500">Remote:</span> {0}
                            </div>
                        </div>
                        <div className="text-center text-lg font-semibold text-white mb-4">
                            <span className="text-green-500">Limit:</span> {repsLimit}
                        </div>
                        <div className="flex justify-center">
                            <Button
                                onClick={onClickToggle}
                                className={`px-6 py-3 rounded-lg text-white font-semibold flex items-center gap-2 ${isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                                    } transition-all duration-300`}
                            >
                                {isRunning ? <FaStop /> : <FaPlay />}
                                {isRunning ? `Stop :: ${timer}s` : `Start :: ${timer}s`}
                            </Button>
                        </div>
                    </div>

                    {/* Exercise Selection Section */}
                    <div className="border-2 border-gray-700 rounded-lg p-4 bg-gray-800 shadow-lg">
                        <div className="grid grid-cols-3 gap-2">
                            {Object.entries(exercises).map(([key, ex]) => (
                                <button
                                    key={key}
                                    onClick={() => changeExercise(key)}
                                    className={`h-14 border-2 rounded-lg text-sm font-medium flex flex-col items-center justify-center transition-all ${exerciseType === key ? "text-white scale-105 shadow-lg" : "text-gray-400 hover:scale-95"
                                        }`}
                                    style={{
                                        backgroundColor: exerciseType === key ? ex.color : "#2D3748",
                                        borderColor: exerciseType === key ? ex.color : "#4A5568",
                                    }}
                                >
                                    <span className="text-xl">{ex.icon}</span>
                                    <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-center items-center gap-2">
                            <input
                                type="number"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={`${inputValue}`}
                                className="px-4 py-2 w-24 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Reps Limit Input"
                                disabled={!isSettingLimit} // Disable input unless setting limit
                            />
                            <Button
                                onClick={handleSetLimit}
                                className={`px-4 py-2 ${isSettingLimit ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
                                    } text-white rounded-lg transition`}
                            >
                                {isSettingLimit ? "Save" : "Set Limit"}
                            </Button>
                        </div>
                    </div>

                    {/* Agora Voice Calling Section */}
                    <div className="border-2 border-gray-700 rounded-lg p-4 bg-gray-800 shadow-lg">
                        <AgoraVoiceCalling channelName={channelName} />
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Challenges;