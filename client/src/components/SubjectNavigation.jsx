import React, { useState } from "react";
import "./SubjectNavigation.css";

const SubjectNavigation = ({
  isOpen,
  onToggle,
  selectedSubject,
  onSubjectChange,
  subjectWords,
  onWordAdd,
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordsPerPage] = useState(8); // Number of words to display at once

  // Handle word click to add to text
  const handleWordClick = (word) => {
    if (onWordAdd) {
      onWordAdd(word);
    }
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
    onSubjectChange(subjectKey);
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
    <div className={`side-nav ${isOpen ? "open" : "closed"}`}>
      <div className="nav-header">
        {isOpen && <h3>Subjects</h3>}
        <button
          className="nav-toggle"
          onClick={onToggle}
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          type="button"
        >
          {isOpen ? "←" : "→"}
        </button>
      </div>

      {isOpen ? (
        <>
          <div className="subject-tabs">
            {Object.entries(subjectWords).map(([key, subject]) => (
              <button
                key={key}
                className={`subject-tab ${
                  selectedSubject === key ? "active" : ""
                }`}
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
      ) : (
        <div className="nav-closed-content" onClick={onToggle}>
          <div className="nav-closed-icon">📚</div>
          <div className="nav-closed-text">Subjects</div>
        </div>
      )}
    </div>
  );
};

export default SubjectNavigation;
