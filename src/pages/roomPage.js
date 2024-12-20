import { getAuth, signOut } from "firebase/auth";
import { useUser } from "../contexts/userContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateRoomPopup from "./roomHandle/createRoomPopup";
import JoinRoomPopup from "./roomHandle/joinRoomPopup";

function RoomPage() {
  const { user, userDoc, loading } = useUser();
  const navigate = useNavigate();
  const [showCreatePopup, setShowCreatePopup] = useState(JSON.parse(sessionStorage.getItem("showCreatePopup")) || false);
  const [showJoinPopup, setShowJoinPopup] = useState(JSON.parse(sessionStorage.getItem("showJoinPopup")) || false);

  // Get user state (loading is for the time that fireauth takes to get user info)
  useEffect(() => {
    if (!user && !loading) {
      navigate("/");
    }
  }, [loading, user, navigate]);

  // Store popup state so on refresh it'll be brought back
  useEffect(() => {
    sessionStorage.setItem("showCreatePopup", JSON.stringify(showCreatePopup));
    sessionStorage.setItem("showJoinPopup", JSON.stringify(showJoinPopup));
  }, [showCreatePopup, showJoinPopup]);

  if (loading || !user) {
    return null;
  }

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("Logged out");
        navigate("/"); // Ensure the user is redirected after logout
      })
      .catch((err) => {
        console.error("Error during logout:", err);
      });
  };

  const handleAccount = () => {
    navigate("/account");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <video autoPlay loop muted className="w-full h-screen object-cover">
        <source src={`/backgrounds/${userDoc.background}.mp4`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full bg-white bg-opacity-80 py-4 z-30 flex justify-between items-center">
        <h1 className="text-black text-3xl font-bold ml-8">StudySync</h1>
        <div className="flex space-x-4">
          <button
            className="text-black hover:text-gray-500 hover:scale-105 transition-transform duration-200 ease-in-out"
            onClick={handleAccount} >
            Account
          </button>
          <button
            className="text-black hover:text-gray-500 hover:scale-105 transition-transform duration-200 ease-in-out"
            onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Buttons */}
      {!showCreatePopup && !showJoinPopup && (
        <div className="absolute inset-0 flex justify-center items-center z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Join Room */}
            <div
              className="flex justify-center items-center bg-white bg-opacity-70 font-bold text-2xl rounded-lg p-12 cursor-pointer hover:shadow-xl"
              onClick={() => setShowJoinPopup(true)}>
              Join a Room
            </div>

            {/* Create Room */}
            <div
              className="flex justify-center items-center bg-white bg-opacity-70 font-bold text-2xl rounded-lg p-12 cursor-pointer hover:shadow-xl"
              onClick={() => setShowCreatePopup(true)}>
              Create a Room
            </div>
          </div>
        </div>
      )}

      {/* Popups */}
      {showCreatePopup && (
        <div className="absolute inset-0 z-50 flex justify-center items-center">
          <CreateRoomPopup onClose={() => setShowCreatePopup(false)} />
        </div>
      )}

      {showJoinPopup && (
        <div className="absolute inset-0 z-50 flex justify-center items-center">
          <JoinRoomPopup onClose={() => setShowJoinPopup(false)} />
        </div>
      )}
    </div>
  );
}

export default RoomPage;

