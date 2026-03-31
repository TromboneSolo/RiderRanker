import React, { useState, useCallback, useEffect } from "react";
import ImageUpload from "../components/ImageUpload";
import ImageBattle from "../components/ImageBattle";
import RankingResults from "../components/RankingResults";

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
        // Active merge is complete — store result and clear merge slot
        passBuffer = [...passBuffer, mergeResult];
        mergeLeft = null; mergeRight = null; mergeResult = [];
        leftIdx = 0; rightIdx = 0;
        continue;
      }
      if (leftIdx >= mergeLeft.length) {
        // Left side exhausted — drain the remaining right items without comparing
        mergeResult = [...mergeResult, ...mergeRight.slice(rightIdx)];
        rightIdx = mergeRight.length;
        continue;
      }
      if (rightIdx >= mergeRight.length) {
        // Right side exhausted — drain the remaining left items without comparing
        mergeResult = [...mergeResult, ...mergeLeft.slice(leftIdx)];
        leftIdx = mergeLeft.length;
        continue;
      }
      // Both sides have items — a user comparison is required here
      return { runs, passBuffer, mergeLeft, mergeRight, mergeResult,
               leftIdx, rightIdx, comparisons, pass, totalPasses, done: false };
    }

    // No active merge; pick the next pair of runs to merge
    if (runs.length === 0) {
      if (passBuffer.length <= 1) {
        // All runs collapsed into one — sorting complete
        return { runs: passBuffer.length === 1 ? passBuffer : [],
                 passBuffer: [], mergeLeft: null, mergeRight: null,
                 mergeResult: [], leftIdx: 0, rightIdx: 0,
                 comparisons, pass, totalPasses, done: true };
      }
      // Start the next pass using the completed merges from this pass
      runs = passBuffer;
      passBuffer = [];
      pass = pass + 1;
      continue;
    }

    if (runs.length === 1) {
      // Odd run out — carry it forward to the next pass unchanged
      passBuffer = [...passBuffer, runs[0]];
      runs = [];
      continue;
    }

    // Take the next two runs and begin merging them
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
    // Tie: place both items together (left before right) and advance both indices
    mergeResult = [...mergeResult, mergeLeft[leftIdx], mergeRight[rightIdx]];
    leftIdx++;
    rightIdx++;
  }

  return advanceToNextComparison(
    { ...state, mergeResult, leftIdx, rightIdx, comparisons: comparisons + 1 }
  );
}

// Returns the ranked image array from a completed or partially-completed sort.
// For a finished sort this is exact; for an early finish it is a best-effort
// ordering using whatever sorted runs have been built so far.
function getRankings(sortState) {
  if (sortState.done) {
    return sortState.runs[0] || [];
  }
  // Partial: flatten completed runs, then the in-progress merge, then untouched runs
  const { runs, passBuffer, mergeLeft, mergeRight, mergeResult, leftIdx, rightIdx } = sortState;
  return [
    ...passBuffer.flat(),
    ...(mergeResult || []),
    ...(mergeLeft  ? mergeLeft.slice(leftIdx)   : []),
    ...(mergeRight ? mergeRight.slice(rightIdx) : []),
    ...runs.flat(),
  ];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MainLayout() {
  const [phase, setPhase] = useState("upload");
  const [sortState, setSortState] = useState(null);
  const [imageCount, setImageCount] = useState(0);

  // Initialises the merge-sort state from the uploaded images and begins battling.
  const handleImagesSelected = useCallback((images) => {
    const state = initSortState(images);
    setImageCount(images.length);
    setSortState(state);
    setPhase(state.done ? "results" : "battling");
  }, []);

  // When the sort finishes, transition to results in a separate render cycle
  // so that sortState and phase are never out of sync.
  useEffect(() => {
    if (sortState && sortState.done && phase === "battling") {
      setPhase("results");
    }
  }, [sortState, phase]);

  // Records the user's battle choice and advances the sort state.
  // Phase transition is handled by the useEffect above.
  const handleBattleResult = useCallback((result) => {
    setSortState(prev => applyComparison(prev, result));
  }, []);

  // Ends the battle phase early and shows a partial ranking.
  const handleFinishEarly = useCallback(() => {
    setPhase("results");
  }, []);

  // Clears all state and returns to the upload screen.
  const handleReset = useCallback(() => {
    setSortState(null);
    setImageCount(0);
    setPhase("upload");
  }, []);

  if (phase === "upload") {
    return <ImageUpload onImagesSelected={handleImagesSelected} />;
  }

  if (phase === "battling" && sortState && sortState.mergeLeft) {
    const fighter1 = sortState.mergeLeft[sortState.leftIdx];
    const fighter2 = sortState.mergeRight[sortState.rightIdx];
    return (
      <ImageBattle
        fighter1={fighter1}
        fighter2={fighter2}
        onResult={handleBattleResult}
        onQuit={handleFinishEarly}
        comparisons={sortState.comparisons}
        pass={sortState.pass}
        totalPasses={sortState.totalPasses}
        imageCount={imageCount}
      />
    );
  }

  if (phase === "results" && sortState) {
    return (
      <RankingResults
        rankings={getRankings(sortState)}
        isPartial={!sortState.done}
        onReset={handleReset}
      />
    );
  }

  return null;
}
