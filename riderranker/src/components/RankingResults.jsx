import React from "react";

// Displays the final ranked list of images and provides export buttons.
// Rankings are passed in pre-sorted (highest score first) from MainLayout.
export default function RankingResults({ rankings, onReset }) {

  // Serialises the ranked list to JSON (rank, name, score, base64 image data)
  // and triggers a file download in the browser.
  const handleSaveJSON = () => {
    const data = rankings.map((img, i) => ({
      rank: i + 1,
      name: img.name,
      score: img.score,
      image: img.src,
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    downloadBlob(blob, "rankings.json");
  };

  // Serialises the ranked list to CSV (rank, name, score — no image data)
  // and triggers a file download in the browser.
  const handleSaveCSV = () => {
    const rows = ["Rank,Name,Score"].concat(
      rankings.map((img, i) => `${i + 1},"${img.name}",${img.score}`)
    );
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    downloadBlob(blob, "rankings.csv");
  };

  return (
    <div className="results-container">
      <h1>Final Rankings</h1>

      <div className="results-list">
        {rankings.map((img, index) => (
          <div key={img.id} className={`result-item rank-${index + 1}`}>
            <span className="rank-number">#{index + 1}</span>
            <img src={img.src} alt={img.name} className="result-thumbnail" />
            <div className="result-info">
              <span className="result-name">{img.name}</span>
              <span className="result-score">{img.score} pts</span>
            </div>
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
