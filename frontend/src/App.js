import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AdminLogin from './Components/AdminLogin';
import MultiRoleRegister from './Components/MultiRoleRegister';
import AdminDashboard from './Components/AdminDashboard';
import TouristDashboard from './Components/TouristDashboard';

import TourGuideDashboard from './Components/TourGuideDashboard';  // Import the new dashboard
import Login from './Components/Login';


import SellerDashboard from './Components/SellerDashboard';  // Import SellerDashboard

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/register" element={<MultiRoleRegister />} />
          <Route path="/tourist/dashboard" element={<TouristDashboard />} />
          <Route path="/tourguide/dashboard" element={<TourGuideDashboard />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />  {/* Seller Dashboard */}
          <Route path="/login" element={<Login />} />  {/* Login route */}

        </Routes>
      </div>
    </Router>
  );
}

export default App;
