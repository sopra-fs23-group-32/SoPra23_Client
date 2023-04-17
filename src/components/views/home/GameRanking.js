import React from "react";


function GameRanking(props) {
  const scores = [85, 92, 78, 88, 95, 80];
  const sortedScores = scores.sort((a, b) => a - b);
  const formattedScores = sortedScores.map((score, index) => {
    const rank = index + 1;
    const className = rank % 2 === 0 ? "even" : "odd";
    return (
      <li key={index} className={className}>
        <span className="rank">{rank}</span>
        <span className="score">{score}</span>
      </li>
    );
  });

  return (
    <div className="ranking-container">
      <h2>Other Players' Scores</h2>
      <ul className="ranking-list">{formattedScores}</ul>
    </div>
  );
}

export default GameRanking;