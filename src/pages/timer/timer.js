import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import PlayButton from "../../components/timerComponents/PlayButton";
import PauseButton from "../../components/timerComponents/PauseButton";
import RestartButton from "../../components/timerComponents/RestartButton";
import SettingsButton from "../../components/timerComponents/SettingButton";
import { useContext, useState, useEffect, useRef } from "react";
import SettingsContext from "../../components/timerComponents/SettingsContext";

function TimerPage() {
  const timerStyles = {
    paddingTop: "50px",
    maxWidth: "340px",
    margin: "0 auto",
    textAlign: "center",
  };

  const settingsInfo = useContext(SettingsContext);
  const [isPaused, setIsPaused] = useState(true);
  const [mode, setMode] = useState("work");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [workSessionCount, setWorkSessionCount] = useState(0);

  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);
  const workSessionCountRef = useRef(workSessionCount);

  function tick() {
    secondsLeftRef.current--;
    setSecondsLeft(secondsLeftRef.current);
  }

  function incrementWorkSessionCount() {
    setWorkSessionCount((prev) => {
      const newCount = prev + 1;
      workSessionCountRef.current = newCount;
      return newCount;
    });
  }

  function resetWorkSessionCount() {
    setWorkSessionCount(0);
    workSessionCountRef.current = 0;
  }

  function switchMode() {
    if (modeRef.current === "work") {
      const nextMode =
        workSessionCountRef.current === 1 ? "longBreak" : "break"; // Switch to long break after two work sessions
      const nextSeconds =
        nextMode === "longBreak"
          ? settingsInfo.longBreakMinutes * 60
          : settingsInfo.breakMinutes * 60;

      setMode(nextMode);
      modeRef.current = nextMode;

      setSecondsLeft(nextSeconds);
      secondsLeftRef.current = nextSeconds;

      if (nextMode === "longBreak") {
        resetWorkSessionCount();
      } else {
        incrementWorkSessionCount();
      }
    } else {
      const nextMode = "work";
      const nextSeconds = settingsInfo.workMinutes * 60;

      setMode(nextMode);
      modeRef.current = nextMode;

      setSecondsLeft(nextSeconds);
      secondsLeftRef.current = nextSeconds;
    }
  }

  function resetTimer() {
    const initialSeconds =
      mode === "work"
        ? settingsInfo.workMinutes * 60
        : mode === "break"
          ? settingsInfo.breakMinutes * 60
          : settingsInfo.longBreakMinutes * 60;

    setSecondsLeft(initialSeconds);
    secondsLeftRef.current = initialSeconds;

    setIsPaused(true);
    isPausedRef.current = true;
  }

  useEffect(() => {
    secondsLeftRef.current = settingsInfo.workMinutes * 60;
    setSecondsLeft(secondsLeftRef.current);

    const interval = setInterval(() => {
      if (isPausedRef.current) return;
      if (secondsLeftRef.current === 0) {
        switchMode();
      } else {
        tick();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [settingsInfo]);

  const totalSeconds =
    mode === "work"
      ? settingsInfo.workMinutes * 60
      : mode === "break"
        ? settingsInfo.breakMinutes * 60
        : settingsInfo.longBreakMinutes * 60;

  const percentage = Math.round((secondsLeft / totalSeconds) * 100);

  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if (seconds < 10) seconds = "0" + seconds;

  return (
    <div style={timerStyles}>
      <CircularProgressbar
        value={percentage}
        text={`${minutes}:${seconds}`}
        styles={buildStyles({
          textColor: "black",
          pathColor: mode === "work" ? "green" : "red",
          tailColor: "rgba(255, 255, 255, .2)",
        })}
      />
      <div style={{ marginTop: "20px" }}>
        {isPaused ? (
          <PlayButton
            onClick={() => {
              setIsPaused(false);
              isPausedRef.current = false;
            }}
          />
        ) : (
          <PauseButton
            onClick={() => {
              setIsPaused(true);
              isPausedRef.current = true;
            }}
          />
        )}
        <RestartButton
          onClick={() => {
            resetTimer();
          }}
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <SettingsButton
          onClick={() => settingsInfo.setShowSettings(true)}
        ></SettingsButton>
      </div>
    </div>
  );
}

export default TimerPage;
