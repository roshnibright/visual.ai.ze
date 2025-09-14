import React, { useState } from "react";
import "./AccessibleKeyboard.css";

// QWERTY layout
const layout = [
  "qwertyuiop".split(""),
  "asdfghjkl".split(""),
  "zxcvbnm".split(""),
];

// Simple probability model
function predict(nextChar) {
  let probs = {};
  layout.flat().forEach((l) => (probs[l] = 0.01));
  if (nextChar === "q") probs["u"] = 0.7; // Q → U
  else ["a", "e", "i", "o", "u"].forEach((v) => (probs[v] += 0.1));
  return probs;
}

// Neighborhood spreading
function applyNeighborhood(probs) {
  const spread = {};
  layout.forEach((rowLetters, r) => {
    rowLetters.forEach((letter, c) => {
      spread[letter] = 0;
      layout.forEach((nbrRow, nr) => {
        nbrRow.forEach((nbr, nc) => {
          const dist = Math.abs(r - nr) + Math.abs(c - nc); // Manhattan distance
          spread[letter] += probs[nbr] * Math.exp(-dist);
        });
      });
    });
  });
  return spread;
}

// Normalize and clamp weights
function normalize(weights) {
  let total = Object.values(weights).reduce((a, b) => a + b, 0);
  const out = {};
  for (let k in weights) {
    let w = (weights[k] / total) * 50; // scaling factor
    out[k] = Math.max(1, w); // minimum weight
    out[k] = Math.min(20, w); // maximum weight
  }
  return out;
}

export default function App() {
  const [typed, setTyped] = useState("");
  const [weights, setWeights] = useState(
    normalize(applyNeighborhood(predict("")))
  );

  const onKeyPress = (letter) => {
    setTyped((prev) => prev + letter);
    const probs = predict(letter);
    const spread = applyNeighborhood(probs);
    setWeights(normalize(spread));
  };

  return (
    <div className="container">
      <div id="typed">{typed}</div>

      <div className="keyboard">
        {layout.map((row, r) => (
          <div key={r} className="row">
            {row.map((letter) => (
              <button
                key={letter}
                className={`key ${weights[letter] > 5 ? "active" : "inactive"}`}
                style={{
                  flexGrow: weights[letter], // controls width
                  height: `${weights[letter] * 10}px`, // controls height
                }}
                onClick={() => onKeyPress(letter)}
              >
                {letter}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
