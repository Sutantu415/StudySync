import React from "react";
import { useNavigate } from "react-router-dom"; // Import the hook for navigation
import { useUser } from "../../contexts/userContext";

function AccountPage() {
    const navigate = useNavigate(); // Initialize the navigate function
    const { user, loading } = useUser();

    // Show a loading message while user data is being fetched
    if (loading) {
        return <div>Loading...</div>;
    }

    // If no user is logged in, redirect to the login page
    if (!user) {
        navigate("/");
        return null; // Prevent rendering the rest of the component
    }

    return (
        <div className="relative h-screen flex justify-center items-center">
            {/* Video Background */}
            <video autoPlay loop muted className="absolute w-full h-full object-cover">
                <source src="/backgrounds/backgroundFour.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>
            <button
                className="absolute top-5 left-5 bg-blue-600 text-white px-4 py-2 rounded-lg z-20 hover:bg-blue-700"
                onClick={() => navigate("/home")}>
                ← Back
            </button>
            {/* Profile Card */}
            <div className="relative bg-white bg-opacity-70 shadow-lg rounded-lg p-8 z-20 max-w-lg text-center">
                {/* Profile Picture */}
                <div className="flex justify-center mb-6">
                    <img
                        src="https://th.bing.com/th/id/OIP.rC8YhyU3o0agogK61ALrQgHaHa?rs=1&pid=ImgDetMain"
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover"
                    />
                </div>
                <div>
                    <h1 className="text-3xl font-semibold mb-4">My Profile</h1>
                    <p className="text-lg mb-2"><strong>Username:</strong> {user.displayName || "No Display Name"}</p>
                    <p className="text-lg mb-2"><strong>Email:</strong> {user.email || "No Email"}</p>
                    <p className="text-lg mb-2"><strong>Pomodoros Completed:</strong> 0</p>
                </div>
            </div>
        </div>
    );
}

export default AccountPage;
