import { useState, useEffect } from 'react';

const BehaviorAnalysis = () => {
  const [patterns, setPatterns] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('behaviorPatterns');
    if (stored) {
      setPatterns(JSON.parse(stored));
    }
  }, []);

  const getSeverityClass = (severity) => {
    return severity === 'serious' ? 'serious' : 'moderate';
  };

  const getIcon = (severity) => {
    return severity === 'serious' ? '❗' : '⚠️';
  };

  return (
    <div className="behavior-analysis">
      <h1>Behavior Analysis</h1>
      <div className="summary-card">
        <h2>Your weekly eating behavior insights</h2>
      </div>
      <div className="insights-section">
        <h2>Behavior Insights</h2>
        {patterns.length > 0 ? (
          <div className="insights-list">
            {patterns.map((pattern, index) => (
              <div key={index} className={`insight-card ${getSeverityClass(pattern.severity)} fade-in`}>
                <span className="icon">{getIcon(pattern.severity)}</span>
                <p>{pattern.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No behavior data available. Please analyze your diet first.</p>
        )}
      </div>
      {patterns.length > 0 && (
        <div className="bonus-section">
          <div className="score-card">
            <h3>Eating Behavior Score: 65%</h3>
          </div>
          <div className="tips">
            <h3>Tips</h3>
            <ul>
              <li>Try to eat breakfast daily</li>
              <li>Include more vegetables in your meals</li>
              <li>Limit junk food intake</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default BehaviorAnalysis;