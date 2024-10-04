import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AdminLogin from './Components/AdminLogin';
import AdminDashboard from './Components/AdminDashboard';  // Import AdminDashboard component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />   {/* Admin Login route */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} /> {/* Admin Dashboard route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
