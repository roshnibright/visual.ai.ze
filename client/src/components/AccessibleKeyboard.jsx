import React, { useState, useEffect, useCallback } from "react";
import "./AccessibleKeyboard.css";

const AccessibleKeyboard = () => {
  const [text, setText] = useState("");
  const [predictions, setPredictions] = useState({});
  const [focusedKey, setFocusedKey] = useState(null);
  const [keySizes, setKeySizes] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAccessibleMode, setIsAccessibleMode] = useState(true);

  // QWERTY keyboard layout
  const keyboardLayout = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
    ["SPACE"],
  ];

  // Special keys
  const specialKeys = {
    SPACE: { label: "Space", width: "large" },
    BACKSPACE: { label: "⌫", width: "medium" },
    ENTER: { label: "Enter", width: "medium" },
    SHIFT: { label: "⇧", width: "medium" },
  };

  // Simple prediction algorithm (can be enhanced with ML models)
  const generatePredictions = useCallback((currentText) => {
    const predictions = {};
    const lastChar = currentText.slice(-1).toLowerCase();

    // Simple character frequency-based predictions
    const charFrequencies = {
      a: { e: 0.3, n: 0.2, t: 0.15, r: 0.1, s: 0.1, i: 0.05, o: 0.05, u: 0.05 },
      b: { e: 0.4, a: 0.2, i: 0.15, o: 0.1, u: 0.1, y: 0.05 },
      c: { a: 0.3, e: 0.25, h: 0.2, i: 0.1, o: 0.1, u: 0.05 },
      d: { e: 0.4, a: 0.2, i: 0.15, o: 0.1, u: 0.1, y: 0.05 },
      e: { r: 0.3, n: 0.2, t: 0.15, a: 0.1, s: 0.1, i: 0.05, o: 0.05, u: 0.05 },
      f: { e: 0.4, a: 0.2, i: 0.15, o: 0.1, u: 0.1, y: 0.05 },
      g: { e: 0.4, a: 0.2, i: 0.15, o: 0.1, u: 0.1, y: 0.05 },
      h: { e: 0.4, a: 0.2, i: 0.15, o: 0.1, u: 0.1, y: 0.05 },
      i: { n: 0.3, t: 0.2, s: 0.15, a: 0.1, e: 0.1, o: 0.05, u: 0.05, r: 0.05 },
      j: { e: 0.4, a: 0.2, i: 0.15, o: 0.1, u: 0.1, y: 0.05 },
      k: { e: 0.4, a: 0.2, i: 0.15, o: 0.1, u: 0.1, y: 0.05 },
      l: { e: 0.4, a: 0.2, i: 0.15, o: 0.1, u: 0.1, y: 0.05 },
      m: { e: 0.4, a: 0.2, i: 0.15, o: 0.1, u: 0.1, y: 0.05 },
      n: { e: 0.4, a: 0.2, i: 0.15, o: 0.1, u: 0.1, y: 0.05 },
      o: { n: 0.3, r: 0.2, t: 0.15, a: 0.1, e: 0.1, i: 0.05, u: 0.05, s: 0.05 },
      p: { e: 0.4, a: 0.2, i: 0.15, o: 0.1, u: 0.1, y: 0.05 },
      q: { u: 0.8, a: 0.1, e: 0.05, i: 0.05 },
      r: { e: 0.4, a: 0.2, i: 0.15, o: 0.1, u: 0.1, y: 0.05 },
      s: { e: 0.4, a: 0.2, i: 0.15, o: 0.1, u: 0.1, y: 0.05 },
      t: { e: 0.4, a: 0.2, i: 0.15, o: 0.1, u: 0.1, y: 0.05 },
      u: { n: 0.3, t: 0.2, s: 0.15, a: 0.1, e: 0.1, i: 0.05, o: 0.05, r: 0.05 },
      v: { e: 0.4, a: 0.2, i: 0.15, o: 0.1, u: 0.1, y: 0.05 },
      w: { e: 0.4, a: 0.2, i: 0.15, o: 0.1, u: 0.1, y: 0.05 },
      x: { e: 0.4, a: 0.2, i: 0.15, o: 0.1, u: 0.1, y: 0.05 },
      y: { e: 0.4, a: 0.2, i: 0.15, o: 0.1, u: 0.1, s: 0.05 },
      z: { e: 0.4, a: 0.2, i: 0.15, o: 0.1, u: 0.1, y: 0.05 },
    };

    if (lastChar && charFrequencies[lastChar]) {
      predictions[lastChar] = charFrequencies[lastChar];
    }

    return predictions;
  }, []);

  // Calculate key sizes based on predictions
  const calculateKeySizes = useCallback(
    (predictions) => {
      const sizes = {};
      const baseSize = 1;
      const maxSize = 2.5;
      const minSize = 0.7;

      // Set base sizes for all keys
      keyboardLayout.flat().forEach((key) => {
        sizes[key] = baseSize;
      });

      // Only apply dynamic sizing in accessible mode
      if (isAccessibleMode) {
        // Increase size for predicted keys
        Object.entries(predictions).forEach(([char, predictions]) => {
          Object.entries(predictions).forEach(([predictedChar, confidence]) => {
            const key = predictedChar.toUpperCase();
            if (sizes[key] !== undefined) {
              sizes[key] = Math.max(
                minSize,
                Math.min(maxSize, baseSize + confidence * 1.5)
              );
            }
          });
        });
      }

      return sizes;
    },
    [keyboardLayout, isAccessibleMode]
  );

  // Update predictions and key sizes when text changes
  useEffect(() => {
    console.log("Text updated:", text); // Debug log
    const newPredictions = generatePredictions(text);
    setPredictions(newPredictions);
    const newSizes = calculateKeySizes(newPredictions);
    setKeySizes(newSizes);
  }, [text, isAccessibleMode]);

  // Handle key press
  const handleKeyPress = (key) => {
    console.log("Key pressed:", key, "Current text before:", text); // Debug log
    if (key === "SPACE") {
      setText((prev) => {
        const newText = prev + " ";
        console.log("Adding space, new text:", newText);
        return newText;
      });
    } else if (key === "BACKSPACE") {
      setText((prev) => {
        const newText = prev.slice(0, -1);
        console.log("Backspace, new text:", newText);
        return newText;
      });
    } else if (key === "ENTER") {
      setText((prev) => {
        const newText = prev + "\n";
        console.log("Enter, new text:", newText);
        return newText;
      });
    } else if (key === "SHIFT") {
      // Shift functionality can be added later
      console.log("Shift pressed, no action");
      return;
    } else {
      setText((prev) => {
        const newText = prev + key.toLowerCase();
        console.log("Adding letter", key, "new text:", newText);
        return newText;
      });
    }
  };

  // Handle regular keyboard events
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      // Focus management for keyboard navigation
      const keys = keyboardLayout.flat();
      const currentIndex = keys.indexOf(focusedKey);
      const nextIndex = e.shiftKey
        ? (currentIndex - 1 + keys.length) % keys.length
        : (currentIndex + 1) % keys.length;
      setFocusedKey(keys[nextIndex]);
    } else if (e.key === "Enter" && focusedKey) {
      e.preventDefault();
      handleKeyPress(focusedKey);
    }
  };

  // Key component
  const Key = ({ keyValue, size = 1, isFocused = false }) => {
    const keyInfo = specialKeys[keyValue] || {
      label: keyValue,
      width: "normal",
    };
    const scale = isAccessibleMode ? keySizes[keyValue] || size : 1;

    const handleClick = () => {
      console.log("Key clicked:", keyValue, "Current text:", text); // Debug log
      handleKeyPress(keyValue);
    };

    return (
      <button
        className={`key ${keyInfo.width} ${isFocused ? "focused" : ""} ${
          isAccessibleMode ? "accessible" : "regular"
        }`}
        style={{
          transform: `scale(${scale})`,
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Button clicked directly:", keyValue);
          handleClick();
        }}
        onFocus={() => setFocusedKey(keyValue)}
        onBlur={() => setFocusedKey(null)}
        aria-label={`Key ${keyInfo.label}`}
        tabIndex={0}
      >
        {keyInfo.label}
      </button>
    );
  };

  return (
    <div
      className={`accessible-keyboard-container ${
        isDarkMode ? "dark-mode" : "light-mode"
      }`}
      onKeyDown={handleKeyDown}
    >
      <div className="header-controls">
        <div className="app-header">
          <h1 className="app-title">Smart Keyboard</h1>
          <p className="app-subtitle">
            Accessible typing with intelligent predictions
          </p>
        </div>
        <div className="control-buttons">
          <button
            className={`mode-toggle ${isAccessibleMode ? "active" : ""}`}
            onClick={() => setIsAccessibleMode(!isAccessibleMode)}
            aria-label={`Switch to ${
              isAccessibleMode ? "regular" : "accessible"
            } keyboard mode`}
          >
            <span className="mode-icon">{isAccessibleMode ? "🧠" : "⌨️"}</span>
            <span className="mode-label">
              {isAccessibleMode ? "Smart" : "Regular"}
            </span>
          </button>
          <button
            className="theme-toggle"
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label={`Switch to ${isDarkMode ? "light" : "dark"} theme`}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      <div className="text-display">
        <textarea
          value={text}
          placeholder={
            isAccessibleMode
              ? "Type with smart predictions below..."
              : "Type with regular keyboard below..."
          }
          className="text-input"
          aria-label="Text input area"
          readOnly={true}
        />
        {isAccessibleMode && (
          <div className="prediction-display">
            {Object.entries(predictions).map(([char, preds]) => (
              <div key={char} className="prediction-group">
                <span className="prediction-label">After "{char}":</span>
                {Object.entries(preds)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 3)
                  .map(([predictedChar, confidence]) => (
                    <span
                      key={predictedChar}
                      className="prediction-item"
                      style={{ opacity: confidence }}
                    >
                      {predictedChar} ({Math.round(confidence * 100)}%)
                    </span>
                  ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        className="keyboard"
        role="application"
        aria-label="Accessible keyboard"
      >
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((key) => (
              <Key key={key} keyValue={key} isFocused={focusedKey === key} />
            ))}
          </div>
        ))}

        <div className="keyboard-row special-keys">
          <Key keyValue="SHIFT" />
          <Key keyValue="BACKSPACE" />
          <Key keyValue="ENTER" />
        </div>

        <div className="keyboard-row test-keys">
          <button
            onClick={() => {
              console.log("Test button clicked");
              setText((prev) => prev + "A");
            }}
            style={{
              padding: "12px 24px",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              margin: "8px",
            }}
          >
            Test A
          </button>
          <Key keyValue="T" isFocused={false} />
        </div>
      </div>
    </div>
  );
};

export default AccessibleKeyboard;
