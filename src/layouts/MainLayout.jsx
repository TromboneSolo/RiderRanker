import React, { useState, useCallback, useEffect } from "react";
import ImageUpload from "../components/ImageUpload";
import ImageBattle from "../components/ImageBattle";
import RankingResults from "../components/RankingResults";
import StatsView from "../components/StatsView";
import { submitRanking, fetchStats } from "../services/globalStats";
// eslint-disable-next-line no-unused-vars
import { APPS_SCRIPT_URL, APPS_SCRIPT_URL_RIDERS } from "../config";

// ---------------------------------------------------------------------------
// Merge-sort state machine
//
// Instead of exhaustive pairwise battles (O(n²)), we use a bottom-up merge
// sort driven by the user's choices. Each comparison asks the user to pick
// between the front item of two sorted runs. This produces a total ordering
// in O(n log n) comparisons — roughly 700 for 100 images vs 4,950 exhaustive.
// ---------------------------------------------------------------------------

// Builds the initial sort state from an array of images.
// Shuffles first so the initial order doesn't bias early comparisons.
function initSortState(images) {
  const n = images.length;
  const shuffled = [...images].sort(() => Math.random() - 0.5);
  const state = {
    runs: shuffled.map(img => [img]), // start: each image is its own sorted run
    passBuffer: [],                   // completed merges accumulate here each pass
    mergeLeft: null,                  // left side of the active merge
    mergeRight: null,                 // right side of the active merge
    mergeResult: [],                  // items placed so far in the active merge
    leftIdx: 0,
    rightIdx: 0,
    comparisons: 0,                   // total comparisons completed
    pass: 1,                          // current merge pass (1-indexed)
    totalPasses: Math.ceil(Math.log2(Math.max(n, 2))),
    done: false,
  };
  return advanceToNextComparison(state);
}

// Runs the merge-sort state forward until either a user comparison is needed
// or the sort is fully complete. Pure function — returns a new state object.
function advanceToNextComparison(state) {
  let { runs, passBuffer, mergeLeft, mergeRight, mergeResult,
        leftIdx, rightIdx, comparisons, pass, totalPasses } = state;

  while (true) {
    if (mergeLeft !== null) {
      if (leftIdx >= mergeLeft.length && rightIdx >= mergeRight.length) {
        passBuffer = [...passBuffer, mergeResult];
        mergeLeft = null; mergeRight = null; mergeResult = [];
        leftIdx = 0; rightIdx = 0;
        continue;
      }
      if (leftIdx >= mergeLeft.length) {
        mergeResult = [...mergeResult, ...mergeRight.slice(rightIdx)];
        rightIdx = mergeRight.length;
        continue;
      }
      if (rightIdx >= mergeRight.length) {
        mergeResult = [...mergeResult, ...mergeLeft.slice(leftIdx)];
        leftIdx = mergeLeft.length;
        continue;
      }
      return { runs, passBuffer, mergeLeft, mergeRight, mergeResult,
               leftIdx, rightIdx, comparisons, pass, totalPasses, done: false };
    }

    if (runs.length === 0) {
      if (passBuffer.length <= 1) {
        return { runs: passBuffer.length === 1 ? passBuffer : [],
                 passBuffer: [], mergeLeft: null, mergeRight: null,
                 mergeResult: [], leftIdx: 0, rightIdx: 0,
                 comparisons, pass, totalPasses, done: true };
      }
      runs = passBuffer;
      passBuffer = [];
      pass = pass + 1;
      continue;
    }

    if (runs.length === 1) {
      passBuffer = [...passBuffer, runs[0]];
      runs = [];
      continue;
    }

    mergeLeft = runs[0];
    mergeRight = runs[1];
    runs = runs.slice(2);
    mergeResult = [];
    leftIdx = 0;
    rightIdx = 0;
  }
}

// Records the user's choice for the current comparison and advances the sort.
// "fighter1" = left wins, "fighter2" = right wins, "tie" = place both and advance both.
function applyComparison(state, result) {
  let { mergeLeft, mergeRight, mergeResult, leftIdx, rightIdx, comparisons } = state;

  if (result === "fighter1") {
    mergeResult = [...mergeResult, mergeLeft[leftIdx]];
    leftIdx++;
  } else if (result === "fighter2") {
    mergeResult = [...mergeResult, mergeRight[rightIdx]];
    rightIdx++;
  } else {
    mergeResult = [...mergeResult, mergeLeft[leftIdx], mergeRight[rightIdx]];
    leftIdx++;
    rightIdx++;
  }

  return advanceToNextComparison(
    { ...state, mergeResult, leftIdx, rightIdx, comparisons: comparisons + 1 }
  );
}

// Returns the ranked image array from a completed or partially-completed sort.
function getRankings(sortState) {
  if (sortState.done) return sortState.runs[0] || [];
  const { runs, passBuffer, mergeLeft, mergeRight, mergeResult, leftIdx, rightIdx } = sortState;
  return [
    ...passBuffer.flat(),
    ...(mergeResult || []),
    ...(mergeLeft  ? mergeLeft.slice(leftIdx)   : []),
    ...(mergeRight ? mergeRight.slice(rightIdx) : []),
    ...runs.flat(),
  ];
}

// Randomly resolves all remaining comparisons in one shot, returning a done state.
function randomFinish(state) {
  let s = state;
  while (!s.done) {
    s = applyComparison(s, Math.random() < 0.5 ? "fighter1" : "fighter2");
  }
  return s;
}

// Generates a short unique ID for each ranking session.
function generateSessionId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ---------------------------------------------------------------------------
// localStorage persistence
// ---------------------------------------------------------------------------

const STORAGE_KEY = "riderranker_session";

// Serialises the current session to localStorage.
// Returns true on success, false if storage is unavailable or quota is exceeded.
function saveSession(phase, sortState, imageCount, sessionId) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ phase, sortState, imageCount, sessionId }));
    return true;
  } catch (e) {
    return false;
  }
}

// Reads and deserialises a previously saved session.
function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

// Removes the saved session from localStorage.
function clearSession() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
}

// Compares the user's rankings against global stats and returns a set of
// interesting data points. Returns null if there's not enough overlap to compare.
function computeComparison(userRankings, globalData) {
  if (!globalData || !globalData.rankings || globalData.rankings.length === 0) return null;

  // Map global name → 1-based position (sorted best-first by avgRank)
  const globalRankMap = {};
  globalData.rankings.forEach((item, i) => {
    globalRankMap[item.name] = i + 1;
  });

  // Build overlapping items with rank diff (positive = user ranked it higher than global)
  const overlapping = userRankings
    .map((item, i) => {
      const globalRank = globalRankMap[item.name];
      if (!globalRank) return null;
      const userRank = i + 1;
      return { name: item.name, userRank, globalRank, diff: globalRank - userRank };
    })
    .filter(Boolean);

  if (overlapping.length < 1) return null;

  const sameTopPick = userRankings[0]?.name === globalData.rankings[0]?.name;

  // Biggest absolute rank difference (most controversial pick)
  const mostControversial = overlapping.reduce((a, b) =>
    Math.abs(b.diff) > Math.abs(a.diff) ? b : a
  );

  // User ranked it much higher than global average (hidden gem)
  const hiddenGem = overlapping.reduce((a, b) => b.diff > a.diff ? b : a);

  // User ranked it much lower than global average (their "overrated" pick)
  const mostOverrated = overlapping.reduce((a, b) => b.diff < a.diff ? b : a);

  // Closest to global consensus
  const mostMainstream = overlapping.reduce((a, b) =>
    Math.abs(b.diff) < Math.abs(a.diff) ? b : a
  );

  const avgAbsDiff = overlapping.reduce((s, x) => s + Math.abs(x.diff), 0) / overlapping.length;
  const agreementPct = Math.max(0, Math.round((1 - avgAbsDiff / (userRankings.length - 1)) * 100));

  return {
    sameTopPick,
    userTop: userRankings[0]?.name,
    globalTop: globalData.rankings[0]?.name,
    mostControversial: Math.abs(mostControversial.diff) > 2 ? mostControversial : null,
    hiddenGem: hiddenGem.diff > 2 ? hiddenGem : null,
    mostOverrated: mostOverrated.diff < -2 ? mostOverrated : null,
    mostMainstream,
    agreementPct,
    totalSessions: globalData.totalSessions,
    overlappingCount: overlapping.length,
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MainLayout() {
  const [phase, setPhase] = useState("upload");
  const [sortState, setSortState] = useState(null);
  const [imageCount, setImageCount] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [hasSavedSession, setHasSavedSession] = useState(() => !!loadSession());
  const [saveStatus, setSaveStatus] = useState(null);       // "saved" | "failed" | null
  const [submissionStatus, setSubmissionStatus] = useState(null); // "submitting" | "submitted" | "failed" | "skipped" | null
  const [importedRankings, setImportedRankings] = useState(null);
  const [activeStatsUrl, setActiveStatsUrl] = useState(null);
  const [comparisonStats, setComparisonStats] = useState(null);
  const [comparisonReady, setComparisonReady] = useState(false);
  const [sortHistory, setSortHistory] = useState([]);

  // Fetch global stats and compute comparison whenever the results phase is entered.
  useEffect(() => {
    if (phase !== "results") return;
    setComparisonReady(false);
    setComparisonStats(null);
    fetchStats(activeStatsUrl || undefined)
      .then(globalData => {
        const userRankings = importedRankings || (sortState ? getRankings(sortState) : null);
        const result = userRankings ? computeComparison(userRankings, globalData) : null;
        setComparisonStats(result);
      })
      .catch((err) => { console.warn("[comparison] fetch failed:", err); })
      .finally(() => setComparisonReady(true));
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initialises the merge-sort state from the uploaded images and begins battling.
  const handleImagesSelected = useCallback((images, statsUrl = null) => {
    const state = initSortState(images);
    const id = generateSessionId();
    setImageCount(images.length);
    setSortState(state);
    setSessionId(id);
    setSubmissionStatus(null);
    setActiveStatsUrl(statsUrl);
    setPhase(state.done ? "results" : "battling");
  }, []);

  // When the sort finishes, transition to results in a separate render cycle
  // so that sortState and phase are never out of sync.
  useEffect(() => {
    if (sortState && sortState.done && phase === "battling") {
      setPhase("results");
    }
  }, [sortState, phase]);

  // Submits the current rankings to global stats on demand.
  const handleSubmitResults = useCallback(() => {
    const rankings = importedRankings || (sortState ? getRankings(sortState) : null);
    if (!rankings) return;
    const id = sessionId;
    setSubmissionStatus("submitting");
    submitRanking(id, rankings, activeStatsUrl || undefined).then(result => {
      if (result.skipped)        setSubmissionStatus("skipped");
      else if (result.duplicate) setSubmissionStatus("submitted");
      else if (result.success)   setSubmissionStatus("submitted");
      else                       setSubmissionStatus("failed");
    });
  }, [sortState, importedRankings, sessionId, activeStatsUrl]);

  // Records the user's battle choice and advances the sort state.
  const handleBattleResult = useCallback((result) => {
    setSortState(prev => {
      setSortHistory(h => [...h, prev]);
      return applyComparison(prev, result);
    });
  }, []);

  // Reverts to the sort state before the last comparison.
  const handleUndo = useCallback(() => {
    setSortHistory(h => {
      if (h.length === 0) return h;
      setSortState(h[h.length - 1]);
      return h.slice(0, -1);
    });
  }, []);

  // Saves the current session to localStorage and shows brief feedback.
  const handleSave = useCallback(() => {
    const ok = saveSession(phase, sortState, imageCount, sessionId);
    if (ok) setHasSavedSession(true);
    setSaveStatus(ok ? "saved" : "failed");
    setTimeout(() => setSaveStatus(null), 2000);
  }, [phase, sortState, imageCount, sessionId]);

  // Restores a previously saved session from localStorage.
  const handleResume = useCallback(() => {
    const session = loadSession();
    if (!session) return;
    setSortState(session.sortState);
    setImageCount(session.imageCount);
    setSessionId(session.sessionId || generateSessionId());
    setSubmissionStatus(null);
    setPhase(session.phase);
  }, []);

  // Ends the battle phase early and shows a partial ranking.
  const handleFinishEarly = useCallback(() => {
    setPhase("results");
  }, []);

  // Randomly resolves all remaining comparisons and jumps straight to results.
  const handleRandomFinish = useCallback(() => {
    setSortState(prev => randomFinish(prev));
  }, []);

  // Accepts a pre-ranked list from an imported JSON/CSV file and jumps straight to results.
  const handleRankingsLoaded = useCallback((rankings) => {
    setImportedRankings(rankings);
    setSessionId(`imported_${Date.now()}`);
    setActiveStatsUrl(null);
    setSubmissionStatus(null);
    setPhase("results");
  }, []);

  // Clears all state, removes any saved session, and returns to the upload screen.
  const handleReset = useCallback(() => {
    clearSession();
    setSortState(null);
    setSortHistory([]);
    setImportedRankings(null);
    setActiveStatsUrl(null);
    setComparisonStats(null);
    setComparisonReady(false);
    setImageCount(0);
    setSessionId(null);
    setSubmissionStatus(null);
    setHasSavedSession(false);
    setPhase("upload");
  }, []);

  if (phase === "upload") {
    return (
      <ImageUpload
        onImagesSelected={handleImagesSelected}
        onRankingsLoaded={handleRankingsLoaded}
        hasSavedSession={hasSavedSession}
        onResume={handleResume}
      />
    );
  }

  if (phase === "battling" && sortState && sortState.mergeLeft) {
    const fighter1 = sortState.mergeLeft[sortState.leftIdx];
    const fighter2 = sortState.mergeRight[sortState.rightIdx];
    return (
      <ImageBattle
        fighter1={fighter1}
        fighter2={fighter2}
        onResult={handleBattleResult}
        onSave={handleSave}
        onQuit={handleFinishEarly}
        onUndo={handleUndo}
        canUndo={sortHistory.length > 0}
        onRandomFinish={handleRandomFinish}
        comparisons={sortState.comparisons}
        pass={sortState.pass}
        totalPasses={sortState.totalPasses}
        imageCount={imageCount}
        saveStatus={saveStatus}
      />
    );
  }

  if (phase === "results" && (sortState || importedRankings)) {
    const rankings = importedRankings || getRankings(sortState);
    return (
      <RankingResults
        rankings={rankings}
        isPartial={sortState ? !sortState.done : false}
        onReset={handleReset}
        onViewStats={() => setPhase("stats")}
        onSubmit={importedRankings || activeStatsUrl ? handleSubmitResults : null}
        submissionStatus={submissionStatus}
        comparisonStats={comparisonStats}
        comparisonReady={comparisonReady}
      />
    );
  }

  if (phase === "stats") {
    return <StatsView url={activeStatsUrl || undefined} onBack={() => setPhase("results")} />;
  }

  return null;
}
