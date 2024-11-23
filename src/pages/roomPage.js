import { getAuth, signOut } from "firebase/auth";
import { useUser } from "../contexts/userContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RoomPage() {
  // Variables
  const { user, loading } = useUser();
  const navigate = useNavigate();

  // If the user isn't logged in bring them back to the login page
  // Use useEffect to do this check when user changes (logout) and navigate is done rendering
  useEffect(() => {
    if (!user && !loading) {
      navigate("/");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }
  // if(!user.user) {
  //     navigate('/');
  //     return null;
  // }

  const handleLogout = () => {
    // Logic for logging out
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        //Successful (Should navigate back to login)
      })
      .catch((err) => {
        console.log(err);
      });
    console.log("Logged out");
  };

  const handleAccount = () => {
    // Logic for navigating to the account page
    console.log(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-blue-800 to-cyan-500">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-blue-600 px-8 py-4">
        <h1 className="text-white text-3xl font-bold">StudySync</h1>
        <div className="flex space-x-4">
          <button
            className="text-white hover:underline"
            onClick={handleAccount}
          >
            Account
          </button>
          <button className="text-white hover:underline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Join a Room */}
          <div
            className="flex justify-center items-center bg-blue-500 hover:bg-blue-700 text-white font-bold text-2xl rounded-lg p-12 cursor-pointer"
            onClick={() => console.log("Join a Room")}
          >
            Join a Room
          </div>

          {/* Create a Room */}
          <div
            className="flex justify-center items-center bg-green-500 hover:bg-green-700 text-white font-bold text-2xl rounded-lg p-12 cursor-pointer"
            onClick={() => console.log("Create a Room")}
          >
            Create a Room
          </div>
          <div
            className="flex justify-center items-center bg-blue-500 hover:bg-blue-700 text-white font-bold text-2xl rounded-lg p-12 cursor-pointer"
            onClick={() => navigate("/timer")}
          >
            Open Timer
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomPage;
