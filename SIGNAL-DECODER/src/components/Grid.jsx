import React from "react";
import Cell from "./Cell";

export default function Grid({
  gridSize,
  flashOn,
  flashingIndices,
  userSelections,
  revealed,
  onCellClick,
  correctSet,
}) {
  const total = gridSize * gridSize;

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        display: "grid",
        gap: "6px",
      }}
    >
      {Array.from({ length: total }, (_, i) => (
        <Cell
          key={i}
          index={i}
          isFlashing={flashOn && flashingIndices.has(i)}
          isSelected={userSelections.has(i)}
          revealed={revealed}
          correct={correctSet.has(i)}
          onClick={() => onCellClick(i)}
        />
      ))}
    </div>
  );
}
