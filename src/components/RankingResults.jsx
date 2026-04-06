import React from "react";

// Displays the final ranked list produced by the merge sort.
// Rankings are passed in already sorted (index 0 = most preferred).
// isPartial is true when the user finished early and the sort was incomplete.
// submissionStatus reflects whether results have been sent to global stats.
export default function RankingResults({ rankings, isPartial, onReset, onViewStats, onSubmit, submissionStatus, comparisonStats, comparisonReady }) {

  // Serialises the ranked list to JSON (rank, name, base64 image) and
  // triggers a browser file download.
  const handleSaveJSON = () => {
    const data = rankings.map((img, i) => ({
      rank: i + 1,
      name: img.name,
      image: img.src,
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    downloadBlob(blob, "rankings.json");
  };

  // Serialises the ranked list to CSV (rank, name — no image data) and
  // triggers a browser file download.
  const handleSaveCSV = () => {
    const rows = ["Rank,Name"].concat(
      rankings.map((img, i) => `${i + 1},"${img.name}"`)
    );
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    downloadBlob(blob, "rankings.csv");
  };

  return (
    <div className="results-container">
      <h1>{isPartial ? "Partial Rankings" : "Final Rankings"}</h1>

      {isPartial && (
        <p className="partial-notice">
          Ranking is based on comparisons completed before you finished early.
        </p>
      )}

      {/* Submission status banner */}
      {submissionStatus === "submitting" && (
        <p className="submission-status submission-status--pending">Submitting to global stats...</p>
      )}
      {submissionStatus === "submitted" && (
        <p className="submission-status submission-status--ok">Results submitted to global stats.</p>
      )}
      {submissionStatus === "failed" && (
        <p className="submission-status submission-status--err">Could not reach global stats endpoint.</p>
      )}
      {submissionStatus === "skipped" && (
        <p className="submission-status submission-status--skip">Global stats not configured — results saved locally only.</p>
      )}

      {!comparisonReady && (
        <p className="comparison-loading">Loading global comparison...</p>
      )}

      {comparisonReady && !comparisonStats && (
        <p className="comparison-loading">No matching global data to compare against yet.</p>
      )}

      {comparisonReady && comparisonStats && (
        <div className="comparison-section">
          <h2>How you compare to {comparisonStats.totalSessions} global session{comparisonStats.totalSessions !== 1 ? "s" : ""}</h2>
          <div className="comparison-grid">
            <div className="comparison-card">
              <span className="comparison-label">Agreement with global rankings</span>
              <span className="comparison-value">{comparisonStats.agreementPct}%</span>
            </div>
            <div className={`comparison-card ${comparisonStats.sameTopPick ? "comparison-card--match" : "comparison-card--diff"}`}>
              <span className="comparison-label">Your #1 pick</span>
              <span className="comparison-value">{comparisonStats.userTop}</span>
              {!comparisonStats.sameTopPick && (
                <span className="comparison-sub">Global #1: {comparisonStats.globalTop}</span>
              )}
              {comparisonStats.sameTopPick && (
                <span className="comparison-sub">Matches global #1!</span>
              )}
            </div>
            {comparisonStats.hiddenGem && (
              <div className="comparison-card">
                <span className="comparison-label">Your hidden gem</span>
                <span className="comparison-value">{comparisonStats.hiddenGem.name}</span>
                <span className="comparison-sub">You: #{comparisonStats.hiddenGem.userRank} &mdash; Global: #{comparisonStats.hiddenGem.globalRank}</span>
              </div>
            )}
            {comparisonStats.mostOverrated && (
              <div className="comparison-card">
                <span className="comparison-label">Your most overrated</span>
                <span className="comparison-value">{comparisonStats.mostOverrated.name}</span>
                <span className="comparison-sub">You: #{comparisonStats.mostOverrated.userRank} &mdash; Global: #{comparisonStats.mostOverrated.globalRank}</span>
              </div>
            )}
            {comparisonStats.mostControversial && (
              <div className="comparison-card">
                <span className="comparison-label">Most controversial pick</span>
                <span className="comparison-value">{comparisonStats.mostControversial.name}</span>
                <span className="comparison-sub">You: #{comparisonStats.mostControversial.userRank} &mdash; Global: #{comparisonStats.mostControversial.globalRank}</span>
              </div>
            )}
            <div className="comparison-card">
              <span className="comparison-label">Most mainstream pick</span>
              <span className="comparison-value">{comparisonStats.mostMainstream.name}</span>
              <span className="comparison-sub">Only {Math.abs(comparisonStats.mostMainstream.diff)} rank{Math.abs(comparisonStats.mostMainstream.diff) !== 1 ? "s" : ""} off global average</span>
            </div>
          </div>
        </div>
      )}

      <div className="results-list">
        {rankings.map((img, index) => (
          <div key={img.id} className={`result-item rank-${index + 1}`}>
            <span className="rank-number">#{index + 1}</span>
            <img src={img.src} alt={img.name} className="result-thumbnail" />
            <span className="result-name">{img.name}</span>
          </div>
        ))}
      </div>

      <div className="results-actions">
        <button className="save-btn" onClick={handleSaveJSON}>Save as JSON</button>
        <button className="save-btn" onClick={handleSaveCSV}>Save as CSV</button>
        {onSubmit && submissionStatus !== "submitted" && submissionStatus !== "skipped" && (
          <button className="submit-btn" onClick={onSubmit} disabled={submissionStatus === "submitting"}>
            {submissionStatus === "submitting" ? "Submitting…" : "Submit to Global Stats"}
          </button>
        )}
        <button className="stats-btn" onClick={onViewStats}>Global Stats</button>
        <button className="reset-btn" onClick={onReset}>Start Over</button>
      </div>
    </div>
  );
}

// Creates a temporary <a> element to trigger a browser file download for
// the given Blob, then immediately revokes the object URL to free memory.
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
