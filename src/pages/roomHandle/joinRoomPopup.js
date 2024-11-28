import React, { useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, where, getDocs, updateDoc, arrayUnion, arrayRemove, doc } from "firebase/firestore";
import { useUser } from "../../contexts/userContext";

function JoinRoomPopup({ onClose }) {
  const [roomName, setRoomName] = useState("");
  const [roomPass, setRoomPass] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [roomInfo, setRoomInfo] = useState(null); // Room info after joining
  const { user } = useUser();

  const joinRoom = async () => {
    // Check for valid inputs
    if (!roomName || !roomPass) {
      setErrMsg("Please enter a room name and password!");
      return;
    }

    try {
      // Get room collection from Firestore
      const roomCollection = collection(db, "rooms");

      // Query to get room (matches name and pass)
      const roomQuery = query(
        roomCollection,
        where("roomName", "==", roomName),
        where("roomPass", "==", roomPass)
      );

      // Execute the query result
      const queryResult = await getDocs(roomQuery);

      // If no matching room is found
      if (queryResult.empty) {
        setErrMsg("Room not found or incorrect password!");
        return;
      }

      // Get the first matching room
      const roomDoc = queryResult.docs[0];
      const roomData = roomDoc.data();

      // Check to make sure room isn't full
      if (roomData.users.length >= roomData.maxUsers) {
        setErrMsg("Room is full!");
        return;
      }

      // Add user to the room
      await updateDoc(roomDoc.ref, {
        users: arrayUnion({ uid: user.uid, displayName: user.displayName }),
      });

      // Update roomInfo state with room details
      setRoomInfo({
        id: roomDoc.id,
        ...roomData,
        users: [...roomData.users, { uid: user.uid, displayName: user.displayName }], // Add current user to local state
      });

      setErrMsg(""); // Clear error message
    } catch (e) {
      console.log("Error joining room:", e);
      setErrMsg("An error occurred. Please try again.");
    }
  };

  const leaveRoom = async () => {
    try {
      // Remove user from the room's user list
      const roomRef = doc(db, "rooms", roomInfo.id);
      await updateDoc(roomRef, {
        users: arrayRemove({ uid: user.uid, displayName: user.displayName }),
      });

      // Close the popup
      onClose();
    } catch (e) {
      console.log("Error leaving room:", e);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {/* Before joining the room */}
        {!roomInfo ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Join a Room</h2>
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
            {errMsg && <p className="text-red-500">{errMsg}</p>}
            <button
              onClick={joinRoom}
              className="bg-blue-500 text-white py-2 px-4 rounded w-full"
            >
              Join Room
            </button>
            <button
              onClick={onClose}
              className="mt-2 text-red-500 underline w-full"
            >
              Cancel
            </button>
          </>
        ) : (
          /* After joining the room */
          <>
            <h2 className="text-2xl font-bold mb-4">Room Joined</h2>
            <p className="mb-2">Room Name: {roomInfo.roomName}</p>
            <p className="mb-4">Host: {roomInfo.host.displayName}</p>
            <p>Users in the Room:</p>
            <ul className="list-disc pl-5 mb-4">
              {roomInfo.users.map((userObj) => (
                <li key={userObj.uid}>
                  {userObj.displayName === user.displayName
                    ? `${userObj.displayName} (You)`
                    : userObj.displayName}
                </li>
              ))}
            </ul>
            <div className="flex space-x-4">
              <button
                onClick={leaveRoom}
                className="bg-red-500 text-white py-2 px-4 rounded w-full"
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

export default JoinRoomPopup;
