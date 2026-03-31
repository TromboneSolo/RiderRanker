// Renders a single head-to-head battle between two images.
// The user clicks the image they prefer (or "Tie / Skip") to record a result.
// Shows a progress bar and a "Finish Early" button in the header.
export default function ImageBattle({ fighter1, fighter2, onResult, onQuit, currentBattle, totalBattles }) {
  // Percentage of battles completed before this one, used to fill the progress bar.
  const progressPct = Math.round(((currentBattle - 1) / totalBattles) * 100);

  if (!fighter1 || !fighter2) return null;

  return (
    <div className="battle-container">
      <div className="battle-header">
        <h2 className="battle-counter">Battle {currentBattle} of {totalBattles}</h2>
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
