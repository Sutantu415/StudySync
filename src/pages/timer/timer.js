import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import PlayButton from "../../components/timerComponents/PlayButton";
import PauseButton from "../../components/timerComponents/PauseButton";
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

  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);

  function tick() {
    secondsLeftRef.current--;
    setSecondsLeft(secondsLeftRef.current);
  }

  useEffect(() => {
    function switchMode() {
      const nextMode = modeRef.current === "work" ? "break" : "work";
      const nextSeconds =
        (nextMode === "work"
          ? settingsInfo.workMinutes
          : settingsInfo.breakMinutes) * 60;

      setMode(nextMode);
      modeRef.current = nextMode;

      setSecondsLeft(nextSeconds);
      secondsLeftRef.current = nextSeconds;
    }

    secondsLeftRef.current = settingsInfo.workMinutes * 60;
    setSecondsLeft(secondsLeftRef.current);

    const interval = setInterval(() => {
      if (isPausedRef.current) {
        return;
      }
      if (secondsLeftRef.current === 0) {
        return switchMode();
      }

      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [settingsInfo]);

  const totalSeconds =
    mode === "work"
      ? settingsInfo.workMinutes * 60
      : settingsInfo.breakMinutes * 60;
  const percentage = Math.round((secondsLeft / totalSeconds) * 100);

  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if (seconds < 10) seconds = "0" + seconds;

  return (
    <div style={timerStyles}>
      <CircularProgressbar
        value={percentage}
        text={minutes + ":" + seconds}
        styles={buildStyles({
          textColor: "black",
          pathColor: mode === "work" ? "black" : "grey",
          tailColor: "rgba(255, 255, 255, .2)",
        })}
      />
      <div style={{ marginTop: "20px" }}>
        {isPaused ? (
          <PlayButton
            onClick={() => {
              console.log("Pressed");
              setIsPaused(false);
              isPausedRef.current = false;
            }}
          />
        ) : (
          <PauseButton
            onClick={() => {
              console.log("Pressed");
              setIsPaused(true);
              isPausedRef.current = true;
            }}
          />
        )}
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
