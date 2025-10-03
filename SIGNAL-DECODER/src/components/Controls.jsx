import React from "react";

export default function Controls({ isFlashing, revealed, onSubmit, onNext }) {
  return (
    <div className="controls">
      <button onClick={onSubmit} disabled={isFlashing || revealed}>
        Submit Guess
      </button>
      <button onClick={onNext} disabled={!revealed}>
        Next Level
      </button>
    </div>
  );
}
