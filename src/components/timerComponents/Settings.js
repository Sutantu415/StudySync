import ReactSlider from "react-slider";
import "./slider.css";
import SettingsContext from "./SettingsContext";
import { useContext } from "react";
import BackButton from "./BackButton";

function Settings() {
  const settingsInfo = useContext(SettingsContext);
  return (
    <div style={{ textAlign: "left" }}>
      <label>Work: {settingsInfo.workMinutes}:00</label>
      <ReactSlider
        className={"slider"}
        thumbClassName={"thumb"}
        trackClassName={"track"}
        value={settingsInfo.workMinutes}
        onChange={(newValue) => settingsInfo.setWorkMinutes(newValue)}
        min={1}
        max={120}
      />
      <label>Break: {settingsInfo.breakMinutes}:00</label>
      <ReactSlider
        className={"slider break"}
        thumbClassName={"thumb"}
        trackClassName={"track"}
        value={settingsInfo.breakMinutes}
        onChange={(newValue) => settingsInfo.setBreakMinutes(newValue)}
        min={1}
        max={120}
      />
      <label>Long Break: {settingsInfo.longBreakMinutes}:00</label>
      <ReactSlider
        className={"slider long"}
        thumbClassName={"thumb"}
        trackClassName={"track"}
        value={settingsInfo.longBreakMinutes}
        onChange={(newValue) => settingsInfo.setLongBreakMinutes(newValue)}
        min={1}
        max={120}
      />
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <BackButton onClick={() => settingsInfo.setShowSettings(false)} />
      </div>
    </div>
  );
}

export default Settings;