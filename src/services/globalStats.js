import { APPS_SCRIPT_URL } from "../config";

// Key used in sessionStorage to track which sessions have already been submitted
// so that refreshing the results page doesn't produce duplicate rows.
const SUBMITTED_KEY = "riderranker_submitted";

// Submits a completed ranking session to the Apps Script endpoint.
// Uses no-cors mode because Google Apps Script web apps redirect POST requests
// from script.google.com to script.googleusercontent.com, which blocks a normal
// CORS fetch. With no-cors the browser still sends the request and the script
// still receives and processes it — we just can't read the response.
export function submitRanking(sessionId, rankings) {
  if (!APPS_SCRIPT_URL) return Promise.resolve({ skipped: true });

  // Guard against double-submission on page refresh
  const submitted = getSubmittedIds();
  if (submitted.has(sessionId)) return Promise.resolve({ duplicate: true });

  const payload = {
    sessionId,
    timestamp: new Date().toISOString(),
    imageCount: rankings.length,
    rankings: rankings.map((img, i) => ({ rank: i + 1, name: img.name })),
  };

  return fetch(APPS_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(() => {
      markSubmitted(sessionId);
      return { success: true };
    })
    .catch(() => ({ success: false }));
}

// Fetches aggregated global stats from the Apps Script endpoint via GET.
// Returns a promise resolving to { totalSessions, rankings: [...] }.
export function fetchStats() {
  if (!APPS_SCRIPT_URL) return Promise.reject(new Error("No Apps Script URL configured."));
  return fetch(`${APPS_SCRIPT_URL}?action=stats`)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    });
}

// Returns the Set of sessionIds already submitted this browser session.
function getSubmittedIds() {
  try {
    const raw = sessionStorage.getItem(SUBMITTED_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch (e) {
    return new Set();
  }
}

// Persists a sessionId to the submitted-ids set in sessionStorage.
function markSubmitted(sessionId) {
  try {
    const ids = getSubmittedIds();
    ids.add(sessionId);
    sessionStorage.setItem(SUBMITTED_KEY, JSON.stringify([...ids]));
  } catch (e) { /* ignore */ }
}
