// Renders a single head-to-head comparison between two images.
// The user clicks the image they prefer (or "Tie") to record a result.
// Progress is shown as pass X of Y with a comparison counter.
import React, { useEffect, useState } from "react";

// Plays a short beep using the Web Audio API.
function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {}
}

export default function ImageBattle({ fighter1, fighter2, onResult, onQuit, onSave, onRandomFinish, onUndo, canUndo,
                                      comparisons, pass, totalPasses, imageCount, saveStatus }) {
  const [floatAnim, setFloatAnim] = useState(null); // { side: "left"|"right", id: number }

  const handlePick = (fighter) => {
    playBeep();
    if (fighter !== "tie") {
      setFloatAnim({ side: fighter === "fighter1" ? "left" : "right", id: Date.now() });
    }
    onResult(fighter);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "1") handlePick("fighter1");
      if (e.key === "2") handlePick("fighter2");
      if (e.key === " ") { e.preventDefault(); handlePick("tie"); }
      if ((e.key === "z" || e.key === "Z") && canUndo) onUndo();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handlePick, onUndo, canUndo]); // eslint-disable-line react-hooks/exhaustive-deps

  // Progress bar fills based on completed passes; each pass is roughly equal work.
  const progressPct = Math.round(((pass - 1) / totalPasses) * 100);

  // Rough upper-bound estimate: n * ceil(log2(n)) comparisons total.
  const estimatedTotal = Math.round(imageCount * Math.ceil(Math.log2(Math.max(imageCount, 2))));

  if (!fighter1 || !fighter2) return null;

  return (
    <div className="battle-container">
      <div className="battle-header">
        <div className="battle-meta">
          <span className="battle-counter">#{comparisons + 1}</span>
          <span className="battle-pass">Pass {pass} of {totalPasses} &mdash; ~{estimatedTotal} total</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        {/* Shows "Saved!" or "Failed" briefly after a save attempt, then reverts to the button */}
        {saveStatus ? (
          <span className={`save-status save-status--${saveStatus}`}>
            {saveStatus === "saved" ? "Saved!" : "Save failed"}
          </span>
        ) : (
          <button className="save-progress-btn" onClick={onSave}>Save</button>
        )}
        <button className="undo-btn" onClick={onUndo} disabled={!canUndo}>Undo</button>
        <button className="quit-btn" onClick={onQuit}>Finish Early</button>
        <button className="quit-btn" onClick={onRandomFinish}>Finish For Me</button>
      </div>

      <p className="battle-prompt">Which do you prefer?</p>

      <div className="battle-arena">
        {floatAnim && (
          <span
            key={floatAnim.id}
            className={`float-plus float-plus--${floatAnim.side}`}
          >
            +1
          </span>
        )}

        <button
          className="fighter-btn"
          style={{ backgroundImage: `url(${fighter1.src})` }}
          onClick={() => handlePick("fighter1")}
        >
          <span className="fighter-name">{fighter1.name}</span>
        </button>

        <div className="vs-column">
          <span className="vs-label">VS</span>
          {/* Randomly picks fighter1 or fighter2 with equal probability */}
          <button className="random-btn" onClick={() => handlePick(Math.random() < 0.5 ? "fighter1" : "fighter2")}>
            Random
          </button>
          <button className="tie-btn" onClick={() => handlePick("tie")}>
            Tie
          </button>
        </div>

        <button
          className="fighter-btn"
          style={{ backgroundImage: `url(${fighter2.src})` }}
          onClick={() => handlePick("fighter2")}
        >
          <span className="fighter-name">{fighter2.name}</span>
        </button>
      </div>
    </div>
  );
}
