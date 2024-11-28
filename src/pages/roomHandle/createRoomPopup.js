import React, {useState} from 'react';
import {db} from '../../firebase/firebaseConfig';
import {addDoc, collection, deleteDoc, doc} from 'firebase/firestore';
import {useUser} from '../../contexts/userContext';

function CreateRoomPopup( {onClose} ) {
    const [roomName, setRoomName] = useState('');
    const [roomPass, setRoomPass] = useState('');
    const [roomId, setRoomId] = useState('');
    const [roomCreated, setRoomCreated] = useState(false);
    const { user } = useUser();

    const createRoom = async () => {
        // Check for valid inputs
        if(!roomName || !roomPass) {
            alert('Please enter a room name and password!');
            return;
        }
        
        // Try creating a room and adding it to the db
        try {
            const room = await addDoc(collection(db, 'rooms'), {
                roomName,
                roomPass,
                users: [user.uid],
                host: user.uid,
                maxUsers: 4
            });
            setRoomId(room.id);
            setRoomCreated(true);
        } catch (e) {
            console.log(e);
        }
    };

    const startSession = async() => {
        console.log('Temporary Start');
    };

    const leaveRoom = async() => {
        try {
            // Get room from doc
            const roomInfo = doc(db, 'rooms', roomId);

            // Delete document with room info
            await deleteDoc(roomInfo);

            onClose();
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                {!roomCreated ? (
                    <>
                        <h2 className="text-2xl font-bold mb-4">Create a Room</h2>
                        <input
                            type="text"
                            placeholder="Room Name"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            className="border p-2 mb-4 w-full"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={roomPass}
                            onChange={(e) => setRoomPass(e.target.value)}
                            className="border p-2 mb-4 w-full"
                        />
                        <button
                            onClick={createRoom}
                            className="bg-blue-500 text-white py-2 px-4 rounded w-full"
                        >
                            Create Room
                        </button>
                        <button onClick={onClose} className="mt-2 text-red-500 underline">
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold mb-4">Room Created</h2>
                        <p>Users in the Room:</p>
                        <ul className="list-disc pl-5 mb-4">
                            <li>{user.displayName} (Host)</li>
                        </ul>
                        <div className="flex space-x-4">
                            <button
                                onClick={startSession}
                                className="bg-green-500 text-white py-2 px-4 rounded"
                            >
                                Start Session
                            </button>
                            <button
                                onClick={leaveRoom}
                                className="bg-red-500 text-white py-2 px-4 rounded"
                            >
                                Leave Room
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default CreateRoomPopup