import React, { useState, useCallback } from "react";
import ImageUpload from "../components/ImageUpload";
import ImageBattle from "../components/ImageBattle";
import RankingResults from "../components/RankingResults";

// Builds every unique pair from the images array (N*(N-1)/2 total) and
// shuffles them so the order feels random rather than sequential.
function generateAllPairs(images) {
  const pairs = [];
  for (let i = 0; i < images.length; i++) {
    for (let j = i + 1; j < images.length; j++) {
      pairs.push({ fighter1: images[i].id, fighter2: images[j].id, result: null });
    }
  }
  // Shuffle so adjacent images don't always battle first
  return pairs.sort(() => Math.random() - 0.5);
}

// Tallies each image's score from the completed battles (1 pt for a win,
// 0.5 pt each for a tie) and returns the images array sorted high-to-low.
function computeRankings(images, battles) {
  const scores = {};
  images.forEach(img => { scores[img.id] = 0; });
  battles.forEach(battle => {
    if (battle.result === "fighter1") scores[battle.fighter1] += 1;
    else if (battle.result === "fighter2") scores[battle.fighter2] += 1;
    else if (battle.result === "tie") {
      scores[battle.fighter1] += 0.5;
      scores[battle.fighter2] += 0.5;
    }
  });
  return [...images]
    .map(img => ({ ...img, score: scores[img.id] }))
    .sort((a, b) => b.score - a.score);
}

// Top-level state machine that owns all session data and routes between
// the three phases: upload → battling → results.
export default function MainLayout() {
  const [phase, setPhase] = useState("upload");
  const [images, setImages] = useState([]);
  const [battles, setBattles] = useState([]);
  const [currentBattleIndex, setCurrentBattleIndex] = useState(0);

  // Called when the user confirms their image selection on the upload screen.
  // Generates the full battle list and transitions to the battling phase.
  const handleImagesSelected = useCallback((selectedImages) => {
    const pairs = generateAllPairs(selectedImages);
    setImages(selectedImages);
    setBattles(pairs);
    setCurrentBattleIndex(0);
    setPhase("battling");
  }, []);

  // Called after each battle with the outcome ("fighter1", "fighter2", or "tie").
  // Records the result on the current battle, then either advances to the next
  // battle or transitions to the results phase if all battles are done.
  const handleBattleResult = useCallback((result) => {
    setBattles(prev => {
      const updated = [...prev];
      updated[currentBattleIndex] = { ...updated[currentBattleIndex], result };
      return updated;
    });
    const next = currentBattleIndex + 1;
    if (next >= battles.length) {
      setPhase("results");
    } else {
      setCurrentBattleIndex(next);
    }
  }, [currentBattleIndex, battles.length]);

  // Skips remaining battles and goes straight to the results phase,
  // scoring only the battles that have already been completed.
  const handleFinishEarly = useCallback(() => {
    setPhase("results");
  }, []);

  // Clears all session state and returns to the upload screen.
  const handleReset = useCallback(() => {
    setImages([]);
    setBattles([]);
    setCurrentBattleIndex(0);
    setPhase("upload");
  }, []);

  if (phase === "upload") {
    return <ImageUpload onImagesSelected={handleImagesSelected} />;
  }

  if (phase === "battling") {
    const currentBattle = battles[currentBattleIndex];
    const fighter1 = images.find(img => img.id === currentBattle.fighter1);
    const fighter2 = images.find(img => img.id === currentBattle.fighter2);
    return (
      <ImageBattle
        fighter1={fighter1}
        fighter2={fighter2}
        onResult={handleBattleResult}
        onQuit={handleFinishEarly}
        currentBattle={currentBattleIndex + 1}
        totalBattles={battles.length}
      />
    );
  }

  if (phase === "results") {
    const completedBattles = battles.filter(b => b.result !== null);
    const rankings = computeRankings(images, completedBattles);
    return <RankingResults rankings={rankings} onReset={handleReset} />;
  }

  return null;
}
