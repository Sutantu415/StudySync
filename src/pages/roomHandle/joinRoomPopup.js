import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useUser } from "../../contexts/userContext";
import { useNavigate } from "react-router-dom";

function JoinRoomPopup({ onClose }) {
  const [roomName, setRoomName] = useState("");
  const [roomPass, setRoomPass] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [roomInfo, setRoomInfo] = useState(JSON.parse(localStorage.getItem("roomInfo")) || null); // Room info after joining
  const [users, setUsers] = useState([]);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribe;

    if (roomInfo && roomInfo.id) {
      const roomRef = doc(db, "rooms", roomInfo.id);

      // Listener (real-time updates on room members)
      unsubscribe = onSnapshot(roomRef, (snapshot) => {
        if (snapshot.exists()) {
          const roomData = snapshot.data();
          setUsers(roomData.users || []);
        } else {
          if(user.uid !== roomInfo?.host?.uid) {
            alert("Host has closed the lobby!");
          }
          localStorage.removeItem("roomInfo");
          onClose();
        }
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [roomInfo, onClose, user.uid]);

  // Store the room info as it changes so that if we refresh we can still display the room info
  useEffect(() => {
    localStorage.setItem("roomInfo", JSON.stringify(roomInfo));
  }, [roomInfo]);

  // Once the start session button is pressed
  // Navigate all users in the room to the session page
  useEffect(() => {
    if (roomInfo && roomInfo.id) {
      const room = doc(db, "rooms", roomInfo.id);
      const unsubscribe = onSnapshot(room, (snapshot) => {
        if (snapshot.exists()) {
          const roomData = snapshot.data();
          if (roomData.sessionStarted) {
            navigate(`/session/${roomInfo.id}`);
          }
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [roomInfo, navigate]);

  const joinRoom = async () => {
    // Make sure there is a valid room name and password
    if (!roomName || !roomPass) {
      setErrMsg("Please enter a room name and password!");
      return;
    }

    // Try and get the room info with the given name and password
    try {
      const roomCollection = collection(db, "rooms");

      const roomQuery = query(
        roomCollection,
        where("roomName", "==", roomName),
        where("roomPass", "==", roomPass)
      );

      const queryResult = await getDocs(roomQuery);

      // If there wasn't a room then display proper error message
      if (queryResult.empty) {
        setErrMsg("Room not found or incorrect password!");
        return;
      }

      // Else get room info
      const roomDoc = queryResult.docs[0];
      const roomData = roomDoc.data();

      // If the room is full then bring up a message saying room is full
      if (roomData.users.length >= roomData.maxUsers) {
        setErrMsg("Room is full!");
        return;
      }

      // If the session already started then bring a message saying session in progress
      if (roomData.sessionStarted) {
        setErrMsg("Session already started!");
        return;
      }

      // Add user to the list of users in the room
      await updateDoc(roomDoc.ref, {
        users: arrayUnion({ uid: user.uid, displayName: user.displayName }),
      });

      // Update our controlled variable of the room info to match with the additional user
      setRoomInfo({
        id: roomDoc.id,
        ...roomData,
        users: [...roomData.users, { uid: user.uid, displayName: user.displayName }],
      });

      setErrMsg(""); // Clear error message
    } catch (e) {
      console.error("Error joining room:", e);
      setErrMsg("An error occurred. Please try again.");
    }
  };

  // Remove user from room and close the popup
  const leaveRoom = async () => {
    try {
      const roomRef = doc(db, "rooms", roomInfo.id);
      await updateDoc(roomRef, {
        users: arrayRemove({ uid: user.uid, displayName: user.displayName }),
      });
      // Remove room info from local storage
      localStorage.removeItem("roomInfo");
      onClose();
    } catch (e) {
      console.error("Error leaving room:", e);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Transparent Box Styled to Match CreateRoomPopup */}
      <div className="bg-white bg-opacity-70 rounded-lg w-full max-w-md p-8 shadow-md">
        {!roomInfo ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Join a Room</h2>
            <div className="flex flex-col items-center">
              <input
                type="text"
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring focus:ring-blue-300" />
              <input
                type="password"
                placeholder="Password"
                value={roomPass}
                onChange={(e) => setRoomPass(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded mb-6 focus:outline-none focus:ring focus:ring-blue-300" />
              {errMsg && <p className="text-red-500">{errMsg}</p>}
              <button
                onClick={joinRoom}
                className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded mb-4 transition duration-200">
                Join Room
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Room Joined</h2>
            <p className="text-gray-600 mb-4 text-center">Users in the Room:</p>
            <ul className="space-y-2 mb-6">
              {users.map((userObj) => (
                <li
                  key={userObj.uid}
                  className="bg-gray-100 border border-gray-300 rounded-md px-4 py-2 text-gray-700 text-center"
                >
                  {userObj.displayName === user.displayName
                    ? `${userObj.displayName} (You)`
                    : userObj.displayName}
                </li>
              ))}
            </ul>
            <div className="flex justify-center space-x-4">
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

export default JoinRoomPopup;

