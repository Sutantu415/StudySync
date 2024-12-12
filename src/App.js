import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import RoomPage from "./pages/roomPage";
import RegisterPage from "./pages/register";
import SessionPage from "./pages/session";
import "./App.css";
import AccountPage from "./pages/account/account";


//function app for routes
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<RoomPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/session/:roomId" element={<SessionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
