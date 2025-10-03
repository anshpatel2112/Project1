import { useEffect, useMemo, useState } from "react";
import Grid from "./components/Grid";
import Controls from "./components/Controls";

const GRID_SIZE = 5;
const CELL_COUNT = GRID_SIZE * GRID_SIZE;

const levels = [
  {
    id: 1,
    rule: (i) => i % 2 === 0,
  },
  {
    id: 2,
    rule: (i) => {
      const r = Math.floor(i / GRID_SIZE);
      const c = i % GRID_SIZE;
      return r === c || r + c === GRID_SIZE - 1;
    },
  },
  {
    id: 3,
    rule: (i) => {
      if (i < 2) return false;
      for (let d = 2; d * d <= i; d++) if (i % d === 0) return false;
      return true;
    },
  },
  {
    id: 4,
    rule: (i) => {
      const center = 12;
      const r = Math.floor(i / GRID_SIZE);
      const c = i % GRID_SIZE;
      const cr = Math.floor(center / GRID_SIZE);
      const cc = center % GRID_SIZE;
      if (i === center) return true;
      if (r === cr && Math.abs(c - cc) === 1) return true;
      if (c === cc && Math.abs(r - cr) === 1) return true;
      return false;
    },
  },
  {
    id: 5,
    rule: (i) => {
      const r = Math.floor(i / GRID_SIZE);
      const c = i % GRID_SIZE;
      return (r + c) % 3 === 0;
    },
  },
];

const FLASH_DURATION_MS = 10000;
const FLASH_INTERVAL_MS = 600;

function computeCorrectSet(rule) {
  const s = new Set();
  for (let i = 0; i < CELL_COUNT; i++) if (rule(i)) s.add(i);
  return s;
}

export default function App() {
  const [levelIndex, setLevelIndex] = useState(0);
  const level = levels[levelIndex];

  const [isFlashing, setIsFlashing] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [userSelections, setUserSelections] = useState(new Set());
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState(null);

  const correctSet = useMemo(() => computeCorrectSet(level.rule), [level]);

  useEffect(() => {
    setUserSelections(new Set());
    setRevealed(false);
    setMessage(null);
    setIsFlashing(true);

    const interval = setInterval(() => setFlashOn((s) => !s), FLASH_INTERVAL_MS);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setIsFlashing(false);
      setFlashOn(false);
    }, FLASH_DURATION_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [levelIndex]);

  const toggleSelect = (i) => {
    if (isFlashing || revealed) return;
    setUserSelections((prev) => {
      const copy = new Set(prev);
      if (copy.has(i)) copy.delete(i);
      else copy.add(i);
      return copy;
    });
  };

  const submit = () => {
    setRevealed(true);
    let correctPicks = 0;
    let incorrectPicks = 0;
    for (const pick of userSelections) {
      if (correctSet.has(pick)) correctPicks++;
      else incorrectPicks++;
    }
    const missed = Array.from(correctSet).filter((i) => !userSelections.has(i)).length;
    const delta = correctPicks * 2 - incorrectPicks - missed;
    setScore((s) => Math.max(0, s + delta));
    setMessage(`Correct: ${correctPicks}, Wrong: ${incorrectPicks}, Missed: ${missed}`);
  };

  return (
    <div className="app">
      {/* Score at top-left */}
      <div className="score">Score: {score}</div>

      {/* Title center */}
      <h1 className="title">Signal Decoder</h1>
      <h2 className="level-title">Level {level.id}</h2>

      {/* Grid */}
      <Grid
        gridSize={GRID_SIZE}
        flashOn={flashOn && isFlashing}
        flashingIndices={isFlashing ? correctSet : new Set()}
        userSelections={userSelections}
        revealed={revealed}
        onCellClick={toggleSelect}
        correctSet={correctSet}
      />

      {/* Controls */}
      <Controls
        isFlashing={isFlashing}
        revealed={revealed}
        onSubmit={submit}
        onNext={() => setLevelIndex((i) => (i + 1) % levels.length)}
        onReset={() => setLevelIndex((i) => i)}
      />

      {/* Footer */}
      <footer className="footer">Built by Ansh Patel</footer>

      {message && <div className="feedback">{message}</div>}
    </div>
  );
}
