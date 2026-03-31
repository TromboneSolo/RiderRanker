import React from "react";

// Displays the final ranked list produced by the merge sort.
// Rankings are passed in already sorted (index 0 = most preferred).
// isPartial is true when the user finished early and the sort was incomplete.
export default function RankingResults({ rankings, isPartial, onReset }) {

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
