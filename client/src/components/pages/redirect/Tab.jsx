import React, { useState } from 'react';
import "./Tab.css";

const TabBar = () => {
  const [activeTab, setActiveTab] = useState('math');

  // Sample data for different subjects
  const subjects = {
    math: {
      name: 'Mathematics',
      content: [
        'Algebra basics',
        'Geometry fundamentals',
        'Calculus introduction',
        'Statistics overview'
      ]
    },
    science: {
      name: 'Science',
      content: [
        'Physics principles',
        'Chemistry reactions',
        'Biology concepts',
        'Earth science facts'
      ]
    },
    history: {
      name: 'History',
      content: [
        'Ancient civilizations',
        'World wars',
        'Renaissance period',
        'Modern history'
      ]
    }
  };

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
  };

  return (
    <div className="tab-container">
      {/* Tab Navigation */}
      <div className="tab-nav">
        {Object.keys(subjects).map((subjectKey) => (
          <button
            key={subjectKey}
            className={`tab-button ${activeTab === subjectKey ? 'active' : ''}`}
            onClick={() => handleTabClick(subjectKey)}
          >
            {subjects[subjectKey].name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        <h2>{subjects[activeTab].name}</h2>
        <ul className="content-list">
          {subjects[activeTab].content.map((item, index) => (
            <li key={index} className="content-item">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TabBar;