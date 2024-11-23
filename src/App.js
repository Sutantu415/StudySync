import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import RoomPage from "./pages/roomPage";
import RegisterPage from "./pages/register";
import "./App.css";
import TimerPage from "./pages/timer/timer";
import SettingsPage from "./components/timerComponents/Settings";
import { useState } from "react";
import SettingsContext from "./components/timerComponents/SettingsContext";

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<RoomPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/timer"
          element={
            <SettingsContext.Provider
              value={{
                showSettings,
                setShowSettings,
                workMinutes,
                breakMinutes,
                setWorkMinutes,
                setBreakMinutes,
              }}
            >
              {showSettings ? <SettingsPage /> : <TimerPage />}
            </SettingsContext.Provider>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
