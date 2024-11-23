import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/authentication/login";
import HomePage from "./pages/home";
import RegisterPage from "./components/authentication/register";
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
        <Route path="/home" element={<HomePage />} />
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
