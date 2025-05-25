import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ScanPage from './pages/ScanPage';
import ResultsPage from './pages/ResultsPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import AutoHackerInfoPage from './pages/AutoHackerInfoPage';
import AiAgentPage from './pages/AiAgentPage';
import DocumentationPage from './pages/DocumentationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/scan" element={<ScanPage />} />
              <Route path="/results/:domain" element={<ResultsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              } />
              <Route path="/admin" element={
                <PrivateRoute adminOnly={true}>
                  <AdminPage />
                </PrivateRoute>
              } />
              <Route path="/auto-hacker-info" element={<AutoHackerInfoPage />} />
              <Route path="/ai-agent" element={<AiAgentPage />} />
              <Route path="/documentation" element={<DocumentationPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 