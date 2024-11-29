import React from "react";
import { useNavigate } from "react-router-dom"; // Import the hook for navigation
import "./account.css";
import ProfileImage from "/Users/brandonwong/Documents/GitHub/StudySync/src/assets/image.png"; // Import your image or use a URL
import { useUser } from "/Users/brandonwong/Documents/GitHub/StudySync/src/contexts/userContext.js";

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
        <div className="profile-page">
            {/* Top left back button */}
            <button className="back-button" onClick={() => navigate("/home")}>
                ← Back
            </button>
            <div className="profile-card">
                {/* Profile Picture */}
                <div className="profile-picture">
                    <img src={ProfileImage} alt="Profile" className="profile-img" />
                </div>
                {/* User Info */}
                <div className="profile-info">
                    <h1>My Profile</h1>
                    <p><strong>Username:</strong> {user.displayName || "No Display Name"}</p>
                    <p><strong>Email:</strong> {user.email || "No Email"}</p>
                    <p><strong>Pomodoros Completed:</strong> 0</p>
                </div>


            </div>
        </div>
    );
}

export default AccountPage;
