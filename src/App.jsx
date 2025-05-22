import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ScanPage from './pages/ScanPage';
import ResultsPage from './pages/ResultsPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import AutoHackerPage from './pages/AutoHackerPage';
import AutoHackerInfoPage from './pages/AutoHackerInfoPage';
import AiAgentPage from './pages/AiAgentPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/results/:domain" element={<ResultsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/auto-hacker" element={<AutoHackerPage />} />
            <Route path="/auto-hacker-info" element={<AutoHackerInfoPage />} />
            <Route path="/ai-agent" element={<AiAgentPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 