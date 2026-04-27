import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Devices } from './pages/Devices';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/security" element={<div className="p-8 text-textMuted">Security page under construction.</div>} />
          <Route path="/analytics" element={<div className="p-8 text-textMuted">Analytics page under construction.</div>} />
          <Route path="/settings" element={<div className="p-8 text-textMuted">Settings page under construction.</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
