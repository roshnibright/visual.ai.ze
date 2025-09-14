import React, { useState, useEffect, useCallback } from "react";
import "./AccessibleKeyboard.css";

const AccessibleKeyboard = () => {
  const [text, setText] = useState("");
  const [predictions, setPredictions] = useState({});
  const [focusedKey, setFocusedKey] = useState(null);
  const [keySizes, setKeySizes] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAccessibleMode, setIsAccessibleMode] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordsPerPage] = useState(8); // Number of words to display at once

  // Subject-specific word sets
  const subjectWords = {
    math: {
      name: 'Mathematics',
      icon: '🔢',
      words: [
        'addition', 'subtraction', 'multiplication', 'division', 'equation',
        'algebra', 'geometry', 'calculus', 'trigonometry', 'statistics',
        'probability', 'fraction', 'decimal', 'percentage', 'ratio',
        'polynomial', 'derivative', 'integral', 'matrix', 'vector',
        'theorem', 'proof', 'hypothesis', 'variable', 'constant',
        'function', 'domain', 'range', 'limit', 'infinity',
        'sine', 'cosine', 'tangent', 'logarithm', 'exponential',
        'quadratic', 'linear', 'parabola', 'circle', 'triangle',
        'rectangle', 'square', 'polygon', 'diameter', 'radius',
        'circumference', 'area', 'volume', 'perimeter', 'angle'
      ]
    },
    chemistry: {
      name: 'Chemistry',
      icon: '🧪',
      words: [
        'atom', 'molecule', 'element', 'compound', 'reaction',
        'electron', 'proton', 'neutron', 'nucleus', 'orbital',
        'periodic', 'table', 'hydrogen', 'oxygen', 'carbon',
        'nitrogen', 'sodium', 'chlorine', 'calcium', 'iron',
        'bond', 'ionic', 'covalent', 'metallic', 'polar',
        'solution', 'solvent', 'solute', 'concentration', 'molarity',
        'acid', 'base', 'pH', 'buffer', 'titration',
        'oxidation', 'reduction', 'catalyst', 'enzyme', 'polymer',
        'crystalline', 'amorphous', 'phase', 'equilibrium', 'kinetics',
        'thermodynamics', 'enthalpy', 'entropy', 'activation', 'energy',
        'isotope', 'radioactive', 'decay', 'fusion', 'fission'
      ]
    },
    english: {
      name: 'English',
      icon: '📚',
      words: [
        'literature', 'poetry', 'prose', 'novel', 'story',
        'character', 'plot', 'theme', 'setting', 'conflict',
        'metaphor', 'simile', 'alliteration', 'personification', 'imagery',
        'grammar', 'syntax', 'vocabulary', 'sentence', 'paragraph',
        'noun', 'verb', 'adjective', 'adverb', 'pronoun',
        'subject', 'predicate', 'clause', 'phrase', 'conjunction',
        'essay', 'thesis', 'argument', 'evidence', 'analysis',
        'narrative', 'exposition', 'dialogue', 'monologue', 'soliloquy',
        'tragedy', 'comedy', 'drama', 'satire', 'irony',
        'symbolism', 'allegory', 'foreshadowing', 'flashback', 'climax',
        'resolution', 'denouement', 'protagonist', 'antagonist', 'foil'
      ]
    }
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
  const generatePredictions = useCallback((currentText) => {
    const predictions = {};
    const lastChar = currentText.slice(-1).toLowerCase();

    if (lastChar && /[a-z\s.,!?;:'"-]/.test(lastChar)) {
      // Simulate backend response with random probabilities
      const allChars = "abcdefghijklmnopqrstuvwxyz .,!?;:'\"-";
      const numPredictions = Math.floor(Math.random() * 5) + 1; // 1-5 predictions
      const selectedChars = [];

      // Randomly select characters
      while (selectedChars.length < numPredictions) {
        const randomChar =
          allChars[Math.floor(Math.random() * allChars.length)];
        if (!selectedChars.includes(randomChar)) {
          selectedChars.push(randomChar);
        }
      }

      // Generate random probabilities that sum to 1
      const probabilities = [];
      let remaining = 1;
      for (let i = 0; i < selectedChars.length; i++) {
        if (i === selectedChars.length - 1) {
          probabilities.push(remaining);
        } else {
          const prob = Math.random() * remaining * 0.8; // Leave some for remaining
          probabilities.push(prob);
          remaining -= prob;
        }
      }

      // Create prediction object
      const charPredictions = {};
      selectedChars.forEach((char, index) => {
        charPredictions[char] = probabilities[index];
      });

      predictions[lastChar] = charPredictions;
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
            let key;
            if (predictedChar === " ") {
              key = "SPACE";
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

  // Calculate row heights based on largest key in each row
  const calculateRowHeights = useCallback(() => {
    if (!isAccessibleMode) return {};

    const rowHeights = {};
    const baseHeight = 60; // Base height in pixels
    const maxHeightMultiplier = 2.0;

    console.log("Calculating row heights, keySizes:", keySizes); // Debug log

    // Calculate height for main keyboard rows
    keyboardLayout.forEach((row, rowIndex) => {
      const maxSizeInRow = Math.max(...row.map((key) => keySizes[key] || 1));
      const heightMultiplier = Math.max(
        1.0,
        Math.min(maxHeightMultiplier, maxSizeInRow)
      );
      rowHeights[rowIndex] = baseHeight * heightMultiplier;
    });

    // Calculate height for punctuation row
    const punctuationKeys = [".", ",", "!", "?", ";", ":", "'", '"', "-"];
    const maxPunctuationSize = Math.max(
      ...punctuationKeys.map((key) => keySizes[key] || 1)
    );
    const punctuationHeightMultiplier = Math.max(
      1.0,
      Math.min(maxHeightMultiplier, maxPunctuationSize)
    );
    rowHeights[keyboardLayout.length] =
      baseHeight * punctuationHeightMultiplier;

    // Calculate height for special keys row
    const specialKeysList = ["SHIFT", "BACKSPACE", "ENTER"];
    const maxSpecialSize = Math.max(
      ...specialKeysList.map((key) => keySizes[key] || 1)
    );
    const specialHeightMultiplier = Math.max(
      1.0,
      Math.min(maxHeightMultiplier, maxSpecialSize)
    );
    rowHeights[keyboardLayout.length + 1] =
      baseHeight * specialHeightMultiplier;

    console.log("Calculated row heights:", rowHeights); // Debug log
    return rowHeights;
  }, [keySizes, isAccessibleMode, keyboardLayout]);

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
    console.log("=== handleKeyPress called ===");
    console.log("Key pressed:", key, "Current text before:", text);
    console.log("Key type:", typeof key, "Key value:", key);

    if (key === "SPACE") {
      console.log("Processing SPACE key");
      setText((prev) => {
        const newText = prev + " ";
        console.log("Adding space, new text:", newText);
        return newText;
      });
    } else if (key === "BACKSPACE") {
      console.log("Processing BACKSPACE key");
      setText((prev) => {
        const newText = prev.slice(0, -1);
        console.log("Backspace, new text:", newText);
        return newText;
      });
    } else if (key === "ENTER") {
      console.log("Processing ENTER key");
      setText((prev) => {
        const newText = prev + "\n";
        console.log("Enter, new text:", newText);
        return newText;
      });
    } else if (key === "SHIFT") {
      console.log("Processing SHIFT key - no action");
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
      console.log("Processing punctuation key:", key);
      setText((prev) => {
        const newText = prev + key;
        console.log("Adding punctuation", key, "new text:", newText);
        return newText;
      });
    } else {
      console.log("Processing letter key:", key);
      setText((prev) => {
        const newText = prev + key.toLowerCase();
        console.log("Adding letter", key, "new text:", newText);
        return newText;
      });
    }
    console.log("=== handleKeyPress finished ===");
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

    // Calculate width and height multipliers (1.0 to 3.0x)
    const widthMultiplier = Math.max(1.0, Math.min(3.0, keySize));
    const heightMultiplier = Math.max(1.0, Math.min(2.0, keySize));
    const baseWidth = 60; // Base width in pixels
    const baseHeight = 60; // Base height in pixels
    const calculatedWidth = baseWidth * widthMultiplier;
    const calculatedHeight = baseHeight * heightMultiplier;

    // Debug logging for key sizing
    if (keySize > 1.1) {
      console.log(
        `Key ${keyValue}: size=${keySize}, width=${calculatedWidth}px, height=${calculatedHeight}px`
      );
    }

    const handleClick = () => {
      console.log("Key clicked:", keyValue, "Current text:", text); // Debug log
      console.log("About to call handleKeyPress with:", keyValue);
      handleKeyPress(keyValue);
      console.log("handleKeyPress called for:", keyValue);
    };

    const handleTouch = (e) => {
      e.preventDefault();
      console.log("Key touched:", keyValue, "Current text:", text); // Debug log
      console.log("About to call handleKeyPress with:", keyValue);
      handleKeyPress(keyValue);
      console.log("handleKeyPress called for:", keyValue);
    };

    return (
      <button
        className={`key ${keyInfo.width} ${
          isAccessibleMode ? "accessible" : "regular"
        } ${className}`}
        style={{
          width: `${calculatedWidth}px`,
          height: `${calculatedHeight}px`,
          transition:
            "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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
    setText(prev => {
      const newText = prev + (prev && !prev.endsWith(' ') ? ' ' : '') + word + ' ';
      return newText;
    });
  };

  // Handle arrow navigation
  const handleScrollUp = () => {
    setCurrentWordIndex(prev => Math.max(0, prev - wordsPerPage));
  };

  const handleScrollDown = () => {
    const maxIndex = Math.max(0, subjectWords[selectedSubject].words.length - wordsPerPage);
    setCurrentWordIndex(prev => Math.min(maxIndex, prev + wordsPerPage));
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
  const canScrollDown = currentWordIndex + wordsPerPage < subjectWords[selectedSubject].words.length;

  return (
    <div
      className={`accessible-keyboard-container ${
        isDarkMode ? "dark-mode" : "light-mode"
      }`}
    >
      {/* Side Navigation */}
      <div className={`side-nav ${isNavOpen ? 'open' : 'closed'}`}>
        <div className="nav-header">
          <h3>Subjects</h3>
          <button 
            className="nav-toggle"
            onClick={() => setIsNavOpen(!isNavOpen)}
            aria-label={isNavOpen ? 'Close navigation' : 'Open navigation'}
          >
            {isNavOpen ? '←' : '→'}
          </button>
        </div>
        
        {isNavOpen && (
          <>
            <div className="subject-tabs">
              {Object.entries(subjectWords).map(([key, subject]) => (
                <button
                  key={key}
                  className={`subject-tab ${selectedSubject === key ? 'active' : ''}`}
                  onClick={() => handleSubjectChange(key)}
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
                  {Math.min(currentWordIndex + wordsPerPage, subjectWords[selectedSubject].words.length)} of {subjectWords[selectedSubject].words.length}
                </div>
              </div>
              
              <button 
                className={`nav-arrow nav-arrow-up ${!canScrollUp ? 'disabled' : ''}`}
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
                className={`nav-arrow nav-arrow-down ${!canScrollDown ? 'disabled' : ''}`}
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
      <div className={`main-content ${isNavOpen ? 'nav-open' : 'nav-closed'}`}>
      <div className="header-controls">
        <div className="app-header">
          <h1 className="app-title">easy keys</h1>
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

      <div
        className="keyboard"
        role="application"
        aria-label="Accessible keyboard"
      >
        {(() => {
          const rowHeights = calculateRowHeights();

          return (
            <>
              {keyboardLayout.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="keyboard-row"
                  style={{
                    height: rowHeights[rowIndex]
                      ? `${rowHeights[rowIndex]}px`
                      : "auto",
                    transition: "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
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

              <div
                className="keyboard-row punctuation-keys"
                style={{
                  height: rowHeights[keyboardLayout.length]
                    ? `${rowHeights[keyboardLayout.length]}px`
                    : "auto",
                  transition: "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {[".", ",", "!", "?", ";", ":", "'", '"', "-"].map((key) => (
                  <Key
                    key={key}
                    keyValue={key}
                    isFocused={focusedKey === key}
                    className="key-punctuation"
                  />
                ))}
              </div>

              <div
                className="keyboard-row special-keys"
                style={{
                  height: rowHeights[keyboardLayout.length + 1]
                    ? `${rowHeights[keyboardLayout.length + 1]}px`
                    : "auto",
                  transition: "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {["SHIFT", "BACKSPACE", "ENTER"].map((key) => (
                  <Key
                    key={key}
                    keyValue={key}
                    isFocused={focusedKey === key}
                    className="key-special"
                  />
                ))}
              </div>
            </>
          );
        })()}
      </div>
      </div>
    </div>
  );
};

export default AccessibleKeyboard;
