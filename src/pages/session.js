import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { doc, onSnapshot, updateDoc, deleteDoc, arrayRemove } from "firebase/firestore";
import { useUser } from "../contexts/userContext";
import Chat from "./Chat";

function SessionPage() {
  const { roomId } = useParams();
  const { user, loading } = useUser();
  const navigate = useNavigate();

  const [roomData, setRoomData] = useState(null);
  const [timer, setTimer] = useState({
    duration: 25 * 60,
    timeRemaining: 25 * 60,
    isRunning: false,
    phase: "study", // study, short_break, or long_break
    cycle: 1, // Tracks number of study-break cycles
  });

  // Listen for real-time room updates
  useEffect(() => {
    const roomRef = doc(db, "rooms", roomId);

    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setRoomData(data);

        if (data.timer) {
          setTimer(data.timer);
        }
      } else {
        if (user.uid !== roomData?.host.uid) {
          alert("Host has left, room is shutting down!");
        }
        localStorage.removeItem("roomInfo");
        localStorage.setItem("showJoinPopup", false);
        navigate("/home");
      }
    });

    return () => unsubscribe();
  }, [roomId, navigate, user.uid, roomData?.host?.uid]);

  // Update the timer in Firestore
  const updateTimer = useCallback(
    async (newTimerState) => {
      const roomRef = doc(db, "rooms", roomId);
      await updateDoc(roomRef, { timer: newTimerState });
    },
    [roomId]
  );

  // Transition between phases
  const transitionPhase = useCallback(() => {
    let nextPhase, nextDuration, nextCycle;

    if (timer.phase === "study") {
      if (timer.cycle === 2) {
        nextPhase = "long_break";
        nextDuration = 30 * 60; 
        nextCycle = 1; 
      } else {
        nextPhase = "short_break";
        nextDuration = 5 * 60; 
        nextCycle = timer.cycle;
      }
    } else if (timer.phase === "short_break") {
      nextPhase = "study";
      nextDuration = 25 * 60; 
      nextCycle = timer.cycle + 1;
    } else {
      nextPhase = "study";
      nextDuration = 25 * 60;
      nextCycle = timer.cycle;
    }

    const updatedTimer = {
      ...timer,
      phase: nextPhase,
      duration: nextDuration,
      timeRemaining: nextDuration,
      isRunning: true, // Ensure the timer keeps running
      cycle: nextCycle,
    };

    setTimer(updatedTimer);
    updateTimer(updatedTimer);
  }, [timer, updateTimer]);

  // Timer countdown logic
  useEffect(() => {
    let interval;
    if (timer.isRunning) {
      if (timer.timeRemaining > 0) {
        interval = setInterval(() => {
          setTimer((prev) => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
          updateTimer({ ...timer, timeRemaining: timer.timeRemaining - 1 });
        }, 1000);
      } else if (timer.timeRemaining === 0) {
        transitionPhase();
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer.isRunning, timer.timeRemaining, timer, updateTimer, transitionPhase]);

  const handleStart = () => {
    if (user.uid === roomData.host.uid) {
      const updatedTimer = {
        ...timer,
        isRunning: true,
      };
      setTimer(updatedTimer);
      updateTimer(updatedTimer);
    }
  };

  const handlePause = () => {
    if (user.uid === roomData.host.uid) {
      const updatedTimer = {
        ...timer,
        isRunning: false,
      };
      setTimer(updatedTimer);
      updateTimer(updatedTimer);
    }
  };

  const handleReset = () => {
    if (user.uid === roomData.host.uid) {
      const updatedTimer = {
        ...timer,
        phase: "study",
        duration: 25 * 60,
        timeRemaining: 25 * 60, 
        isRunning: false,
        cycle: 1,
      };
      setTimer(updatedTimer);
      updateTimer(updatedTimer);
    }
  };

  const handleLeave = async () => {
    if (user.uid === roomData.host.uid) {
      try {
        const roomRef = doc(db, "rooms", roomId);
        await deleteDoc(roomRef);
      } catch (e) {
        console.error("Error leaving room:", e);
      }
    } else {
      try {
        const roomRef = doc(db, "rooms", roomId);
        await updateDoc(roomRef, {
          users: arrayRemove({ uid: user.uid, displayName: user.displayName }),
        });
        localStorage.removeItem("roomInfo");
        localStorage.setItem("showJoinPopup", false);
      } catch (e) {
        console.error("Error leaving room:", e);
      }
    }
    navigate("/home");
  };

  if (!user || loading) {
    return <div>Loading...</div>;
  }
  if (!roomData) return null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <video autoPlay loop muted className="w-full h-screen object-cover">
        <source src="/backgrounds/backgroundFour.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>
      <nav className="absolute top-0 left-0 w-full bg-white bg-opacity-80 py-4 z-30 flex justify-between items-center">
        <h1 className="text-black text-3xl font-bold ml-8">StudySync</h1>
        <button
          onClick={handleLeave}
          className="text-black hover:text-gray-500 hover:scale-105 transition-transform duration-200 ease-in-out mr-8"
        >
          Leave
        </button>
      </nav>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <h2 className="text-4xl font-bold text-white mb-4">Pomodoro Timer</h2>
        <p className="text-6xl font-bold text-white">
          {Math.floor(timer.timeRemaining / 60)}:
          {String(timer.timeRemaining % 60).padStart(2, "0")}
        </p>
        <p className="text-2xl text-white mt-4 capitalize">{`Phase: ${timer.phase.replace("_", " ")}`}</p>
        {user.uid === roomData.host.uid && (
          <div className="flex space-x-4 mt-8">
            <button
              onClick={handleStart}
              className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600"
            >
              Start
            </button>
            <button
              onClick={handlePause}
              className="bg-yellow-500 text-white py-3 px-6 rounded-lg hover:bg-yellow-600"
            >
              Pause
            </button>
            <button
              onClick={handleReset}
              className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600"
            >
              Reset
            </button>
          </div>
        )}
        <div className="chat-container">
          <Chat roomId={roomId} />
        </div>
      </div>
    </div>
  );
}

export default SessionPage;
