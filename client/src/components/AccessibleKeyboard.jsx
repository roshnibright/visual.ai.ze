import React, { useState, useEffect, useCallback } from "react";
import "./AccessibleKeyboard.css";

const AccessibleKeyboard = () => {
  const [text, setText] = useState("");
  const [predictions, setPredictions] = useState({});
  const [focusedKey, setFocusedKey] = useState(null);
  const [keySizes, setKeySizes] = useState({});
  const [animatedScales, setAnimatedScales] = useState({});
  const [animatedFlex, setAnimatedFlex] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAccessibleMode, setIsAccessibleMode] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("math");
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordsPerPage] = useState(8); // Number of words to display at once

  // Subject-specific word sets
  const subjectWords = {
    math: {
      name: "Mathematics",
      icon: "🔢",
      words: [
        "addition",
        "subtraction",
        "multiplication",
        "division",
        "equation",
        "algebra",
        "geometry",
        "calculus",
        "trigonometry",
        "statistics",
        "probability",
        "fraction",
        "decimal",
        "percentage",
        "ratio",
        "polynomial",
        "derivative",
        "integral",
        "matrix",
        "vector",
        "theorem",
        "proof",
        "hypothesis",
        "variable",
        "constant",
        "function",
        "domain",
        "range",
        "limit",
        "infinity",
        "sine",
        "cosine",
        "tangent",
        "logarithm",
        "exponential",
        "quadratic",
        "linear",
        "parabola",
        "circle",
        "triangle",
        "rectangle",
        "square",
        "polygon",
        "diameter",
        "radius",
        "circumference",
        "area",
        "volume",
        "perimeter",
        "angle",
      ],
    },
    chemistry: {
      name: "Chemistry",
      icon: "🧪",
      words: [
        "atom",
        "molecule",
        "element",
        "compound",
        "reaction",
        "electron",
        "proton",
        "neutron",
        "nucleus",
        "orbital",
        "periodic",
        "table",
        "hydrogen",
        "oxygen",
        "carbon",
        "nitrogen",
        "sodium",
        "chlorine",
        "calcium",
        "iron",
        "bond",
        "ionic",
        "covalent",
        "metallic",
        "polar",
        "solution",
        "solvent",
        "solute",
        "concentration",
        "molarity",
        "acid",
        "base",
        "pH",
        "buffer",
        "titration",
        "oxidation",
        "reduction",
        "catalyst",
        "enzyme",
        "polymer",
        "crystalline",
        "amorphous",
        "phase",
        "equilibrium",
        "kinetics",
        "thermodynamics",
        "enthalpy",
        "entropy",
        "activation",
        "energy",
        "isotope",
        "radioactive",
        "decay",
        "fusion",
        "fission",
      ],
    },
    english: {
      name: "English",
      icon: "📚",
      words: [
        "literature",
        "poetry",
        "prose",
        "novel",
        "story",
        "character",
        "plot",
        "theme",
        "setting",
        "conflict",
        "metaphor",
        "simile",
        "alliteration",
        "personification",
        "imagery",
        "grammar",
        "syntax",
        "vocabulary",
        "sentence",
        "paragraph",
        "noun",
        "verb",
        "adjective",
        "adverb",
        "pronoun",
        "subject",
        "predicate",
        "clause",
        "phrase",
        "conjunction",
        "essay",
        "thesis",
        "argument",
        "evidence",
        "analysis",
        "narrative",
        "exposition",
        "dialogue",
        "monologue",
        "soliloquy",
        "tragedy",
        "comedy",
        "drama",
        "satire",
        "irony",
        "symbolism",
        "allegory",
        "foreshadowing",
        "flashback",
        "climax",
        "resolution",
        "denouement",
        "protagonist",
        "antagonist",
        "foil",
      ],
    },
  };

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
    ".": { label: ".", width: "normal" },
    ",": { label: ",", width: "normal" },
    "!": { label: "!", width: "normal" },
    "?": { label: "?", width: "normal" },
    ";": { label: ";", width: "normal" },
    ":": { label: ":", width: "normal" },
    "'": { label: "'", width: "normal" },
    '"': { label: '"', width: "normal" },
    "-": { label: "-", width: "normal" },
  };

  // Simulate backend prediction API call
  // Expected backend JSON format:
  // {
  //   "a": { "e": 0.3, "n": 0.2, "t": 0.15, "r": 0.1, "s": 0.1 },
  //   "b": { "e": 0.4, "a": 0.2, "i": 0.15, "o": 0.1, "u": 0.1 }
  // }
  const predictChar = async (text) => {
    try {
      // Determine API URL based on environment
      const apiUrl = import.meta.env.DEV
        ? "http://localhost:8000/predict-char" // Development (Python server)
        : "https://visual-ai-ze-8ccp.onrender.com/api/predict-char"; // Production (Python server)

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      console.log("Character Predictions:", data);

      // Parse the data if it's a string
      if (typeof data === "string") {
        return JSON.parse(data);
      }

      return data;
    } catch (error) {
      console.error("Error fetching predictions:", error);
      return []; // Return empty array if API fails
    }
  };

  const generatePredictions = useCallback(async (currentText) => {
    if (!currentText || currentText.length === 0) return {};

    const lastChar = currentText[currentText.length - 1];
    const predictions = await predictChar(currentText);
    console.log("Raw API Predictions:", predictions);

    // Convert array format to object format
    const predictionObj = {};
    console.log("Is array?", Array.isArray(predictions));
    console.log("Predictions type:", typeof predictions);
    console.log("Predictions length:", predictions?.length);

    if (Array.isArray(predictions)) {
      predictions.forEach((pred) => {
        console.log("Processing pred:", pred);
        console.log(
          "Character:",
          pred.character,
          "Confidence:",
          pred.confidence
        );
        predictionObj[pred.character] = pred.confidence;
      });
    }

    console.log("Converted predictions:", predictionObj);
    return { [lastChar]: predictionObj };
  }, []);

  // Calculate key sizes based on predictions with same-row width adjustment
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

      // Also set base sizes for special keys
      Object.keys(specialKeys).forEach((key) => {
        sizes[key] = baseSize;
      });

      // Set base sizes for additional special keys that appear in the keyboard
      ["SHIFT", "BACKSPACE", "ENTER"].forEach((key) => {
        sizes[key] = baseSize;
      });

      // Only apply dynamic sizing in accessible mode
      if (isAccessibleMode) {
        console.log("Processing predictions for key sizing:", predictions);
        // First pass: Calculate desired sizes for predicted keys
        Object.entries(predictions).forEach(([char, charPredictions]) => {
          console.log(
            `Processing character '${char}' with predictions:`,
            charPredictions
          );
          Object.entries(charPredictions).forEach(
            ([predictedChar, confidence]) => {
              console.log(
                `  Predicted char: '${predictedChar}', confidence: ${confidence}`
              );
              let key;
              if (predictedChar === "SPACE") {
                key = "SPACE";
              } else if (predictedChar === "BACKSPACE") {
                key = "BACKSPACE";
              } else if (
                predictedChar === "." ||
                predictedChar === "," ||
                predictedChar === "!" ||
                predictedChar === "?" ||
                predictedChar === ";" ||
                predictedChar === ":" ||
                predictedChar === "'" ||
                predictedChar === '"' ||
                predictedChar === "-"
              ) {
                key = predictedChar;
              } else {
                key = predictedChar.toUpperCase();
              }

              if (sizes[key] !== undefined) {
                const newSize = Math.max(
                  minSize,
                  Math.min(maxSize, baseSize + confidence * 1.5)
                );
                console.log(
                  `  Setting key '${key}' size from ${sizes[key]} to ${newSize} (confidence: ${confidence})`
                );
                sizes[key] = newSize;
              }
            }
          );
        });

        // No complex algorithm needed - CSS will handle the distribution
      }

      return sizes;
    },
    [keyboardLayout, isAccessibleMode]
  );

  // Row heights are fixed - no dynamic height adjustment
  const calculateRowHeights = useCallback(() => {
    // Return empty object - rows maintain their fixed height
    return {};
  }, []);

  //   useEffect(() => {
  //     const ws = connectWebSocket((data) => {
  //       setPredictions(data.predictions || []);
  //     });

  //     return () => ws?.close();
  //   }, []);

  // Update predictions and key sizes when text changes
  useEffect(() => {
    const updatePredictions = async () => {
      console.log("Text changed:", text);
      const newPredictions = await generatePredictions(text);
      console.log("API Predictions received:", newPredictions);
      setPredictions(newPredictions);
      const newSizes = calculateKeySizes(newPredictions);
      console.log("Calculated key sizes:", newSizes);
      setKeySizes(newSizes);

      // Animate scale and flex changes
      if (isAccessibleMode) {
        const targetScales = {};
        const targetFlex = {};
        Object.entries(newSizes).forEach(([key, size]) => {
          const heightMultiplier = Math.max(1.0, Math.min(2.0, size));
          const flexValue = Math.max(1.0, Math.min(3.0, size));
          targetScales[key] = heightMultiplier;
          targetFlex[key] = flexValue;
        });

        // Start animation
        const startTime = Date.now();
        const duration = 1000; // 1 second

        // Easing function for smooth animation
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const rawProgress = Math.min(elapsed / duration, 1);
          const progress = easeOutCubic(rawProgress); // Apply easing

          const currentScales = {};
          const currentFlex = {};

          Object.entries(animatedScales).forEach(([key, currentScale]) => {
            const targetScale = targetScales[key] || 1;
            currentScales[key] =
              currentScale + (targetScale - currentScale) * progress;
          });

          Object.entries(animatedFlex).forEach(([key, currentFlexValue]) => {
            const targetFlexValue = targetFlex[key] || 1;
            currentFlex[key] =
              currentFlexValue +
              (targetFlexValue - currentFlexValue) * progress;
          });

          // Initialize missing keys
          Object.entries(targetScales).forEach(([key, targetScale]) => {
            if (currentScales[key] === undefined) {
              currentScales[key] = 1 + (targetScale - 1) * progress;
            }
          });

          Object.entries(targetFlex).forEach(([key, targetFlexValue]) => {
            if (currentFlex[key] === undefined) {
              currentFlex[key] = 1 + (targetFlexValue - 1) * progress;
            }
          });

          setAnimatedScales(currentScales);
          setAnimatedFlex(currentFlex);

          if (rawProgress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      }
    };

    updatePredictions();
  }, [text, isAccessibleMode]);

  // Handle key press
  const handleKeyPress = (key) => {
    // sendMessage(key);

    if (key === "SPACE") {
      setText((prev) => {
        const newText = prev + " ";
        return newText;
      });
    } else if (key === "BACKSPACE") {
      setText((prev) => {
        const newText = prev.slice(0, -1);
        return newText;
      });
    } else if (key === "ENTER") {
      setText((prev) => {
        const newText = prev + "\n";
        return newText;
      });
    } else if (key === "SHIFT") {
      return;
    } else if (
      key === "." ||
      key === "," ||
      key === "!" ||
      key === "?" ||
      key === ";" ||
      key === ":" ||
      key === "'" ||
      key === '"' ||
      key === "-"
    ) {
      setText((prev) => {
        const newText = prev + key;
        return newText;
      });
    } else {
      setText((prev) => {
        const newText = prev + key.toLowerCase();
        return newText;
      });
    }
  };

  // Handle regular keyboard events
  const handleKeyDown = (e) => {
    // Only handle keyboard navigation, not mouse clicks
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
  const Key = ({ keyValue, size = 1, isFocused = false, className = "" }) => {
    const keyInfo = specialKeys[keyValue] || {
      label: keyValue,
      width: "normal",
    };
    const keySize = isAccessibleMode ? keySizes[keyValue] || size : 1;

    // Calculate flex value based on key size (1.0 to 3.0x)
    const flexValue = Math.max(1.0, Math.min(3.0, keySize));
    const heightMultiplier = Math.max(1.0, Math.min(2.0, keySize));
    const baseHeight = 60; // Base height in pixels
    const calculatedHeight = baseHeight * heightMultiplier;

    const handleClick = () => {
      handleKeyPress(keyValue);
    };

    const handleTouch = (e) => {
      e.preventDefault();
      handleKeyPress(keyValue);
    };

    return (
      <button
        className={`key ${keyInfo.width} ${
          isAccessibleMode ? "accessible" : "regular"
        } ${isAccessibleMode ? "dynamic-size" : ""} ${className}`}
        style={{
          flex: isAccessibleMode ? animatedFlex[keyValue] || 1 : 1,
          height: isAccessibleMode
            ? `${60 * (animatedScales[keyValue] || 1)}px`
            : "60px",
        }}
        onClick={handleClick}
        onTouchStart={handleTouch}
        aria-label={`Key ${keyInfo.label}`}
        tabIndex={0}
      >
        {keyInfo.label}
      </button>
    );
  };

  // Handle word click to add to text
  const handleWordClick = (word) => {
    setText((prev) => {
      const newText =
        prev + (prev && !prev.endsWith(" ") ? " " : "") + word + " ";
      return newText;
    });
  };

  // Handle arrow navigation
  const handleScrollUp = () => {
    setCurrentWordIndex((prev) => Math.max(0, prev - wordsPerPage));
  };

  const handleScrollDown = () => {
    const maxIndex = Math.max(
      0,
      subjectWords[selectedSubject].words.length - wordsPerPage
    );
    setCurrentWordIndex((prev) => Math.min(maxIndex, prev + wordsPerPage));
  };

  // Reset word index when subject changes
  const handleSubjectChange = (subjectKey) => {
    setSelectedSubject(subjectKey);
    setCurrentWordIndex(0);
  };

  // Get currently visible words
  const getVisibleWords = () => {
    const words = subjectWords[selectedSubject].words;
    return words.slice(currentWordIndex, currentWordIndex + wordsPerPage);
  };

  // Check if navigation arrows should be enabled
  const canScrollUp = currentWordIndex > 0;
  const canScrollDown =
    currentWordIndex + wordsPerPage <
    subjectWords[selectedSubject].words.length;

  return (
    <div
      className={`accessible-keyboard-container ${
        isDarkMode ? "dark-mode" : "light-mode"
      }`}
    >
      {/* Side Navigation */}
      <div className={`side-nav ${isNavOpen ? "open" : "closed"}`}>
        <div className="nav-header">
          <h3>Subjects</h3>
          <button
            className="nav-toggle"
            onClick={() => setIsNavOpen(!isNavOpen)}
            aria-label={isNavOpen ? "Close navigation" : "Open navigation"}
          >
            {isNavOpen ? "←" : "→"}
          </button>
        </div>

        {isNavOpen && (
          <>
            <div className="subject-tabs">
              {Object.entries(subjectWords).map(([key, subject]) => (
                <button
                  key={key}
                  className={`subject-tab ${
                    selectedSubject === key ? "active" : ""
                  }`}
                  onClick={() => setSelectedSubject(key)}
                  aria-label={`Switch to ${subject.name}`}
                >
                  <span className="subject-icon">{subject.icon}</span>
                  <span className="subject-name">{subject.name}</span>
                </button>
              ))}
            </div>

            <div className="word-display">
              <div className="word-header">
                <h4>{subjectWords[selectedSubject].name} Words</h4>
                <div className="word-counter">
                  {Math.min(
                    currentWordIndex + wordsPerPage,
                    subjectWords[selectedSubject].words.length
                  )}{" "}
                  of {subjectWords[selectedSubject].words.length}
                </div>
              </div>

              <button
                className={`nav-arrow nav-arrow-up ${
                  !canScrollUp ? "disabled" : ""
                }`}
                onClick={handleScrollUp}
                disabled={!canScrollUp}
                aria-label="Show previous words"
              >
                ↑
              </button>

              <div className="word-list-fixed">
                {getVisibleWords().map((word, index) => (
                  <button
                    key={currentWordIndex + index}
                    className="word-item"
                    onClick={() => handleWordClick(word)}
                    aria-label={`Add word: ${word}`}
                  >
                    {word}
                  </button>
                ))}
              </div>

              <button
                className={`nav-arrow nav-arrow-down ${
                  !canScrollDown ? "disabled" : ""
                }`}
                onClick={handleScrollDown}
                disabled={!canScrollDown}
                aria-label="Show next words"
              >
                ↓
              </button>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className={`main-content ${isNavOpen ? "nav-open" : "nav-closed"}`}>
        <div className="header-controls">
          <div className="app-header">
            <h1 className="app-title">Easy Key-Z</h1>
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
              <span className="mode-icon">
                {isAccessibleMode ? "🧠" : "⌨️"}
              </span>
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
          <div className="text-input" aria-label="Text input area">
            {text}
            <span className="cursor">|</span>
          </div>
          {isAccessibleMode && (
            <div className="prediction-display">
              {Object.entries(predictions).map(([char, preds]) => (
                <div key={char} className="prediction-group">
                  <span className="prediction-label">After "{char}":</span>
                  {Object.entries(preds)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([predictedChar, confidence]) => (
                      <span
                        key={predictedChar}
                        className="prediction-item"
                        style={{ opacity: Math.max(0.3, confidence) }}
                      >
                        {predictedChar === " "
                          ? "SPACE"
                          : predictedChar.toUpperCase()}{" "}
                        ({Math.round(confidence * 100)}%)
                      </span>
                    ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="keyboard-container">
          <div
            className="keyboard main-keyboard"
            role="application"
            aria-label="Accessible keyboard"
          >
            {(() => {
              const rowHeights = calculateRowHeights();

              return (
                <>
                  {keyboardLayout.map((row, rowIndex) => (
                    <div key={rowIndex} className="keyboard-row">
                      {row.map((key) => (
                        <Key
                          key={key}
                          keyValue={key}
                          isFocused={focusedKey === key}
                          className="key-main"
                        />
                      ))}
                    </div>
                  ))}
                </>
              );
            })()}
          </div>

          <div className="punctuation-sidebar">
            <div className="punctuation-title">Punctuation</div>
            <div className="punctuation-keys">
              {[".", ",", "!", "?", ";", ":", "'", '"', "-"].map((key) => (
                <Key
                  key={key}
                  keyValue={key}
                  isFocused={focusedKey === key}
                  className="key-punctuation"
                />
              ))}
            </div>

            <div className="special-keys-section">
              <div className="punctuation-title">Actions</div>
              <div className="special-keys">
                {["SHIFT", "BACKSPACE", "ENTER"].map((key) => (
                  <Key
                    key={key}
                    keyValue={key}
                    isFocused={focusedKey === key}
                    className="key-special"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibleKeyboard;
