import React from "react";

export default function LevelInfo({ level }) {
  return (
    <div className="level-info">
      <h2>Level {level.id}: {level.title}</h2>
      <p>{level.description}</p>
    </div>
  );
}
