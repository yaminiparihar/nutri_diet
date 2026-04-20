import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AnalyzeDiet from '../components/AnalyzeDiet';
import BehaviorAnalysis from '../components/BehaviorAnalysis';
import './Dashboard.css';

const Dashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any session data if needed
    navigate('/login');
  };

  const renderContent = () => {
    switch (activePage) {
      case 'analyze':
        return <AnalyzeDiet />;
      case 'behavior':
        return <BehaviorAnalysis />;
      default:
        return (
          <div className="dashboard-home">
            <h2>Welcome to Your Nutrition Dashboard</h2>
            <p>Select an option from the sidebar to get started.</p>
          </div>
        );
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h3>Navigation</h3>
        <ul>
          <li className={activePage === 'dashboard' ? 'active' : ''} onClick={() => setActivePage('dashboard')}>
            🏠 Dashboard
          </li>
          <li className={activePage === 'analyze' ? 'active' : ''} onClick={() => setActivePage('analyze')}>
            🍎 Analyze Diet
          </li>
          <li className={activePage === 'behavior' ? 'active' : ''} onClick={() => setActivePage('behavior')}>
            📊 Behavior Analysis
          </li>
          <li onClick={handleLogout}>
            🚪 Logout
          </li>
        </ul>
      </aside>
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;