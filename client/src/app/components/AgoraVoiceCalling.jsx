"use client";
import {
    LocalUser,
    RemoteUser,
    useIsConnected,
    useJoin,
    useLocalMicrophoneTrack,
    usePublish,
    useRemoteUsers,
} from "agora-rtc-react";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import { memo, useState } from "react";
import { FaMicrophone, FaMicrophoneSlash, FaPhone } from "react-icons/fa";

export const AgoraVoiceCalling = memo(({ channelName }) => { // Wrap with memo
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    return (
        <AgoraRTCProvider client={client}>
            <Basics channel={channelName} />
        </AgoraRTCProvider>
    );
});

const Basics = ({ channel }) => {
    const [calling, setCalling] = useState(false);
    const isConnected = useIsConnected(); // Store the user's connection status
    const [appId, setAppId] = useState("e0fff0e0685c49ef8c9c40f34d238d9a");
    const [token, setToken] = useState("");
    const [micOn, setMic] = useState(true);

    const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);

    useJoin({ appid: appId, channel: channel, token: token ? token : null }, calling);
    usePublish([localMicrophoneTrack]);

    const remoteUsers = useRemoteUsers();

    return (
        <div className="border-2 border-gray-700 rounded-lg p-4 bg-gray-800 shadow-lg">
            {isConnected ? (
                <div className="w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Local User */}
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <LocalUser
                                audioTrack={localMicrophoneTrack}
                                playAudio={false}
                                micOn={micOn}
                            >
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg font-semibold">You</span>
                                    {micOn ? (
                                        <FaMicrophone className="text-green-500" />
                                    ) : (
                                        <FaMicrophoneSlash className="text-red-500" />
                                    )}
                                </div>
                            </LocalUser>
                        </div>

                        {/* Remote Users */}
                        {remoteUsers.map((user) => (
                            <div key={user.uid} className="bg-gray-700 p-4 rounded-lg">
                                <RemoteUser user={user}>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg font-semibold">{user.uid}</span>
                                        <FaMicrophone className="text-green-500" />
                                    </div>
                                </RemoteUser>
                            </div>
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="mt-6 flex justify-center space-x-4">
                        {/* Mic Button */}
                        <button
                            onClick={() => setMic(a => !a)}
                            className="p-3 bg-blue-500 rounded-full hover:bg-blue-600 transition duration-200"
                        >
                            {micOn ? (
                                <FaMicrophone className="text-white text-2xl" />
                            ) : (
                                <FaMicrophoneSlash className="text-white text-2xl" />
                            )}
                        </button>

                        {/* End Call Button */}
                        <button
                            onClick={() => setCalling(a => !a)}
                            className="p-3 bg-red-500 rounded-full hover:bg-red-600 transition duration-200"
                        >
                            <FaPhone className="text-white text-2xl" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="w-full">
                    <h1 className="text-2xl text-white font-bold mb-4 text-center">Voice Call</h1>
                    <button
                        disabled={!appId || !channel}
                        onClick={() => setCalling(true)}
                        className="w-full p-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-gray-600"
                    >
                        <span className="flex justify-center items-center">
                            <FaPhone className="text-white text-2xl" />
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default AgoraVoiceCalling;