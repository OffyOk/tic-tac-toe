"use client";
import { useState, useEffect } from "react";

interface Game {
  squares: string[];
  isXNext: boolean;
}

const Board = () => {
  const [history, setHistory] = useState<Game[]>([
    { squares: Array(9).fill(null), isXNext: true },
  ]);
  const [stepNumber, setStepNumber] = useState(0);

  useEffect(() => {
    // Fetch the initial game state from the API
    fetch("/api/games")
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setHistory(data);
          setStepNumber(data.length - 1);
        }
      });
  }, []);

  const handleClick = async (index: number) => {
    const current = history[stepNumber];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[index]) return;

    squares[index] = current.isXNext ? "X" : "O";

    const newHistory = history.slice(0, stepNumber + 1);
    setHistory(newHistory.concat([{ squares, isXNext: !current.isXNext }]));
    setStepNumber(newHistory.length);

    // Update the game state in the backend
    await fetch("/api/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ squares, isXNext: !current.isXNext }),
    });
  };

  const jumpTo = (step: number) => {
    setStepNumber(step);
  };

  const calculateWinner = (squares: string[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(history[stepNumber].squares);
  const status = winner
    ? `Winner: ${winner}`
    : `Next player: ${history[stepNumber].isXNext ? "X" : "O"}`;

  const moves = history.map((step, move) => {
    const desc = move ? `Go to move #${move}` : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  const replayGame = () => {
    setStepNumber(0);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-xl mb-4">{status}</div>
      <div className="grid grid-cols-3 gap-4">
        {history[stepNumber].squares.map((value, index) => (
          <div
            key={index}
            className="w-24 h-24 flex items-center justify-center border-2 border-gray-500"
            onClick={() => handleClick(index)}
          >
            {value}
          </div>
        ))}
      </div>
      <div>
        <h3>Game History</h3>
        <ol>{moves}</ol>
        <button onClick={replayGame}>Replay Game</button>
      </div>
    </div>
  );
};

export default Board;
