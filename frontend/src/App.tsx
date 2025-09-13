import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Universities from './pages/Universities';
import AdminUniversities from './pages/AdminUniversities';
import Applications from './pages/Applications';

const Home: React.FC = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>Welcome to EduX</h1>
    <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
      Your university application management platform
    </p>
    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
      <h2>Features:</h2>
      <ul style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
        <li>Browse and explore universities</li>
        <li>Manage your university applications</li>
        <li>Track application status</li>
        <li>Admin tools for university management</li>
      </ul>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/universities"
              element={
                <ProtectedRoute>
                  <Universities />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-universities"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminUniversities />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications"
              element={
                <ProtectedRoute>
                  <Applications />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;