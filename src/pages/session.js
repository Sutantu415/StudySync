import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useUser } from "../contexts/userContext";

function SessionPage() {
  const { roomId } = useParams(); // roomId comes from the URL
  const { user } = useUser();
  const navigate = useNavigate();

  const [roomData, setRoomData] = useState(null); // Room details
  const [timer, setTimer] = useState({
    duration: 25 * 60, // Default duration in seconds
    timeRemaining: 25 * 60,
    isRunning: false,
  });

  // Listen for real-time room updates
  useEffect(() => {
    const roomRef = doc(db, "rooms", roomId);

    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setRoomData(data);

        // Update timer from Firestore if available
        if (data.timer) {
          setTimer(data.timer);
        }
      } else {
        // If the room is deleted (host leaves), redirect everyone to the RoomPage
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [roomId, navigate]);

  // Update the timer in Firestore
  const updateTimer = useCallback(async (newTimerState) => {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, { timer: newTimerState });
  }, [roomId]);

  // Start the timer (only host can do this)
  const handleStart = () => {
    if (user.uid === roomData.host.uid) {
      const updatedTimer = {
        ...timer,
        isRunning: true,
      };
      updateTimer(updatedTimer);
    }
  };

  // Reset the timer (only host can do this)
  const handleReset = () => {
    if (user.uid === roomData.host.uid) {
      const updatedTimer = {
        duration: timer.duration,
        timeRemaining: timer.duration,
        isRunning: false,
      };
      updateTimer(updatedTimer);
    }
  };

  // Timer countdown logic
  useEffect(() => {
    let interval;
    if (timer.isRunning && timer.timeRemaining > 0) {
      interval = setInterval(() => {
        setTimer((prev) => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
        updateTimer({ ...timer, timeRemaining: timer.timeRemaining - 1 });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer.isRunning, timer.timeRemaining, timer, updateTimer]);

  if (!roomData) return null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <video autoPlay loop muted className="w-full h-screen object-cover">
        <source src="/backgrounds/backgroundThree.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full bg-white bg-opacity-80 py-4 z-30 flex justify-between items-center">
        <h1 className="text-black text-3xl font-bold ml-8">StudySync</h1>
        <button
          onClick={() => navigate("/")}
          className="text-black hover:text-gray-500 hover:scale-105 transition-transform duration-200 ease-in-out mr-8">
          Leave
        </button>
      </nav>

      {/* Pomodoro Timer */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <h2 className="text-4xl font-bold text-white mb-4">Pomodoro Timer</h2>
        <p className="text-6xl font-bold text-white">
          {Math.floor(timer.timeRemaining / 60)}:
          {String(timer.timeRemaining % 60).padStart(2, "0")}
        </p>

        {user.uid === roomData.host.uid && (
          <div className="flex space-x-4 mt-8">
            <button
              onClick={handleStart}
              className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600">
              Start
            </button>
            <button
              onClick={handleReset}
              className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600">
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SessionPage;
