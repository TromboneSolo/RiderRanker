import React, { useEffect, useState } from "react";
import { fetchStats } from "../services/globalStats";
import { APPS_SCRIPT_URL } from "../config";

// Fetches and displays aggregated global ranking stats from the Apps Script
// endpoint. Shows a leaderboard sorted by average rank across all sessions.
export default function StatsView({ onBack, url }) {
  const [stats, setStats] = useState(null);   // null = loading, object = loaded
  const [error, setError] = useState(null);
  const [sortCol, setSortCol] = useState("avgRank");
  const [sortDir, setSortDir] = useState("asc");

  // Fetch stats once on mount.
  useEffect(() => {
    fetchStats(url)
      .then(setStats)
      .catch(err => setError(err.message));
  }, [url]);

  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      // Names sort ascending by default, numbers sort descending (higher = better)
      setSortDir(col === "name" ? "asc" : col === "avgRank" ? "asc" : "desc");
    }
  };

  const sorted = stats ? [...stats.rankings].sort((a, b) => {
    let av = a[sortCol], bv = b[sortCol];
    if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase(); }
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  }) : [];

  const arrow = (col) => sortCol === col ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  if (!APPS_SCRIPT_URL) {
    return (
      <div className="stats-container">
        <h1>Global Stats</h1>
        <p className="stats-notice">
          Global stats are not configured. Add your Apps Script URL to{" "}
          <code>src/config.js</code> to enable this feature.
        </p>
        <button className="reset-btn" onClick={onBack}>Back</button>
      </div>
    );
  }

  return (
    <div className="stats-container">
      <h1>Global Stats</h1>

      {!stats && !error && <p className="stats-notice">Loading...</p>}

      {error && (
        <p className="stats-notice stats-error">Failed to load stats: {error}</p>
      )}

      {stats && (
        <>
          <p className="stats-summary">
            {stats.totalSessions} ranking session{stats.totalSessions !== 1 ? "s" : ""} submitted
          </p>

          <div className="stats-table-wrapper">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th className="stats-th-sortable" onClick={() => handleSort("name")}>Name{arrow("name")}</th>
                  <th className="stats-th-sortable" onClick={() => handleSort("avgRank")}>Avg Rank{arrow("avgRank")}</th>
                  <th className="stats-th-sortable" onClick={() => handleSort("count")}>Times Ranked{arrow("count")}</th>
                  <th className="stats-th-sortable" onClick={() => handleSort("timesFirst")}>Times #1{arrow("timesFirst")}</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((row, i) => (
                  <tr key={row.name} className={i < 3 ? `stats-row-top stats-row-${i + 1}` : ""}>
                    <td className="stats-pos">#{i + 1}</td>
                    <td className="stats-name">{row.name}</td>
                    <td className="stats-avg">{row.avgRank.toFixed(2)}</td>
                    <td className="stats-count">{row.count}</td>
                    <td className="stats-first">{row.timesFirst}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="results-actions" style={{ marginTop: "24px" }}>
        <button className="reset-btn" onClick={onBack}>Back</button>
      </div>
    </div>
  );
}
