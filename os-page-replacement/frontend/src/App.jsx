import React, { useState, useMemo } from "react";
import { runSimulation } from "./utils/algorithms";
import "./App.css";

export default function App() {
  const [inputStr, setInputStr] = useState("7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2");
  const [frameCount, setFrameCount] = useState(3);
  const [algorithm, setAlgorithm] = useState("FIFO");
  const [currentStep, setCurrentStep] = useState(0);
  const [saveMessage, setSaveMessage] = useState("");

  const pages = useMemo(
    () =>
      inputStr
        .split(/[\s,]+/)
        .map(Number)
        .filter((n) => !isNaN(n)),
    [inputStr]
  );

  const { steps, hits, faults } = useMemo(
    () => runSimulation(pages, frameCount, algorithm),
    [pages, frameCount, algorithm]
  );

  const activeData = steps[currentStep] || null;

  const handleSaveToDB = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referenceString: pages,
          frameCount,
          algorithm,
          hits,
          faults,
        }),
      });
      if (res.ok) setSaveMessage("Saved to MongoDB!");
    } catch {
      setSaveMessage("Backend offline (running in local mode).");
    }
  };

  return (
    <div className="container">
      <h1>OS Page Replacement Visualizer</h1>

      <div className="controls">
        <input
          value={inputStr}
          onChange={(e) => {
            setInputStr(e.target.value);
            setCurrentStep(0);
          }}
          placeholder="Enter pages e.g. 7, 0, 1, 2"
        />

        <select
          value={algorithm}
          onChange={(e) => {
            setAlgorithm(e.target.value);
            setCurrentStep(0);
          }}
        >
          <option value="FIFO">FIFO (First-In First-Out)</option>
          <option value="LRU">LRU (Least Recently Used)</option>
          <option value="OPTIMAL">Optimal (OPT)</option>
        </select>

        <input
          type="number"
          min="2"
          max="6"
          value={frameCount}
          onChange={(e) => {
            setFrameCount(Number(e.target.value));
            setCurrentStep(0);
          }}
        />
      </div>

      {activeData && (
        <div className="narration-box">
          <strong>Step {activeData.step} (Page {activeData.page}):</strong>{" "}
          <span>{activeData.explanation}</span>
        </div>
      )}

      <div className="playback">
        <button
          disabled={currentStep === 0}
          onClick={() => setCurrentStep((s) => s - 1)}
        >
          Previous
        </button>
        <button
          disabled={currentStep >= steps.length - 1}
          onClick={() => setCurrentStep((s) => s + 1)}
        >
          Next Step
        </button>
        <button onClick={() => setCurrentStep(steps.length - 1)}>
          Show All
        </button>
        <button onClick={handleSaveToDB}>Save Result</button>
      </div>
      {saveMessage && <p className="status-msg">{saveMessage}</p>}

      <div className="stats">
        <span>Total: {pages.length}</span>
        <span className="hit">Hits: {hits}</span>
        <span className="fault">Faults: {faults}</span>
        <span>
          Hit Ratio: {pages.length ? ((hits / pages.length) * 100).toFixed(1) : 0}%
        </span>
      </div>

      <div className="grid">
        {steps.slice(0, currentStep + 1).map((item) => (
          <div
            key={item.step}
            className={`column ${item.status === "HIT" ? "col-hit" : "col-fault"}`}
          >
            <div className="page-header">{item.page}</div>
            {Array.from({ length: frameCount }).map((_, idx) => (
              <div key={idx} className="frame-cell">
                {item.frames[idx] !== undefined ? item.frames[idx] : "-"}
              </div>
            ))}
            <div className="badge">{item.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
