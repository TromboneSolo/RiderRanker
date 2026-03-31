// Renders a single head-to-head comparison between two images.
// The user clicks the image they prefer (or "Tie / Skip") to record a result.
// Progress is shown as pass X of Y with a comparison counter.
import React from "react";

export default function ImageBattle({ fighter1, fighter2, onResult, onQuit,
                                      comparisons, pass, totalPasses, imageCount }) {
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
        <button className="quit-btn" onClick={onQuit}>Finish Early</button>
      </div>

      <p className="battle-prompt">Which do you prefer?</p>

      <div className="battle-arena">
        <button
          className="fighter-btn"
          style={{ backgroundImage: `url(${fighter1.src})` }}
          onClick={() => onResult("fighter1")}
        >
          <span className="fighter-name">{fighter1.name}</span>
        </button>

        <div className="vs-column">
          <span className="vs-label">VS</span>
          <button className="tie-btn" onClick={() => onResult("tie")}>
            Tie / Skip
          </button>
        </div>

        <button
          className="fighter-btn"
          style={{ backgroundImage: `url(${fighter2.src})` }}
          onClick={() => onResult("fighter2")}
        >
          <span className="fighter-name">{fighter2.name}</span>
        </button>
      </div>
    </div>
  );
}
