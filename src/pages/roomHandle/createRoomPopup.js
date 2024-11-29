import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useUser } from "../../contexts/userContext";
import { useNavigate } from "react-router-dom";

function CreateRoomPopup({ onClose }) {
    const [roomName, setRoomName] = useState("");
    const [roomPass, setRoomPass] = useState("");
    const [roomId, setRoomId] = useState(localStorage.getItem("roomId") || "");
    const [roomCreated, setRoomCreated] = useState(JSON.parse(localStorage.getItem("roomCreated")) || false);
    const [users, setUsers] = useState([]);
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        let unsubscribe;

        if (roomId) {
            const roomRef = doc(db, "rooms", roomId);

            // Listener (real-time updates on room members)
            unsubscribe = onSnapshot(roomRef, (snapshot) => {
                if (snapshot.exists()) {
                    const roomData = snapshot.data();
                    setUsers(roomData.users || []); // Update users in real-time
                }
            });
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [roomId]);

    // We need to store whether a room was created + the id if it was in local storage to retrieve on refresh
    useEffect(() => {
        localStorage.setItem("roomCreated", JSON.stringify(roomCreated));
        localStorage.setItem("roomId", roomId);
    }, [roomId, roomCreated]);

    // Once the start session button is pressed
    // Navigate all users in the room to the session page
    useEffect(() => {
        if (roomId) {
            const room = doc(db, "rooms", roomId);
            const unsubscribe = onSnapshot(room, (snapshot) => {
                if (snapshot.exists()) {
                    const roomData = snapshot.data();
                    if (roomData.sessionStarted) {
                        navigate(`/session/${roomId}`);
                    }
                }
            });
    
            return () => {
                unsubscribe();
            };
        }
    }, [roomId, navigate]);
    

    const createRoom = async () => {
        if (!roomName || !roomPass) {
            alert("Please enter a room name and password!");
            return;
        }

        try {
            const room = await addDoc(collection(db, "rooms"), {
                roomName,
                roomPass,
                users: [{ uid: user.uid, displayName: user.displayName }],
                host: { uid: user.uid, displayName: user.displayName },
                maxUsers: 4,
                sessionStarted: false,
            });
            setRoomId(room.id);
            setRoomCreated(true);
        } catch (e) {
            console.error("Error creating room:", e);
        }
    };

    const startSession = async () => {
        const room = doc(db, 'rooms', roomId);
        await updateDoc(room, {
            sessionStarted: true,
        });
        // Implement session logic here if needed
    };

    const leaveRoom = async () => {
        try {
            if (!roomId) return;

            const roomRef = doc(db, "rooms", roomId);
            await deleteDoc(roomRef); // Delete the room document

            setRoomId(""); // Reset room state
            setRoomCreated(false);
            // Remove values from local storage
            localStorage.removeItem("roomCreated");
            localStorage.removeItem("roomId");
            onClose();
        } catch (e) {
            console.error("Error leaving room:", e);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* Transparent Box Styled to Match JoinRoomPopup */}
            <div className="bg-white bg-opacity-70 rounded-lg w-full max-w-md p-8 shadow-md">
                {!roomCreated ? (
                    <>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Create a Room</h2>
                        <div className="flex flex-col items-center">
                            <input
                                type="text"
                                placeholder="Room Name"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring focus:ring-blue-300"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={roomPass}
                                onChange={(e) => setRoomPass(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded mb-6 focus:outline-none focus:ring focus:ring-blue-300"
                            />
                            <button
                                onClick={createRoom}
                                className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded mb-4 transition duration-200">
                                Create Room
                            </button>
                            <button
                                onClick={onClose}
                                className="text-red-500 hover:underline">
                                Cancel
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Room Created</h2>
                        <p className="text-gray-600 mb-4 text-center">Users in the Room:</p>
                        <ul className="space-y-2 mb-6">
                            {users.map((userObj) => (
                                <li
                                    key={userObj.uid}
                                    className="bg-gray-100 border border-gray-300 rounded-md px-4 py-2 text-gray-700 text-center">
                                    {userObj.displayName === user.displayName
                                        ? `${userObj.displayName} (Host)`
                                        : userObj.displayName}
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={startSession}
                                className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded transition duration-200">
                                Start Session
                            </button>
                            <button
                                onClick={leaveRoom}
                                className="bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded transition duration-200">
                                Leave Room
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default CreateRoomPopup;

