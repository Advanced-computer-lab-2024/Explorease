import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AdminLogin from './Components/AdminLogin';
import MultiRoleRegister from './Components/MultiRoleRegister';
import AdminDashboard from './Components/AdminDashboard';
import TouristDashboard from './Components/TouristDashboard';
import Activities from './Components/Activities';
import Itineraries from './Components/Itineraries';
import HistoricalPlaces from './Components/HistoricalPlace';
import TourGuideDashboard from './Components/TourGuideDashboard';  // Import the new dashboard
import Login from './Components/Login';
import HomePage from './Components/HomePage';
import SellerDashboard from './Components/SellerDashboard';  // Import SellerDashboard
import AdvertiserDashboard from './Components/AdvertiserDashboard';


function App() {
            // All paths needed
  return (
    <Router>

      <div className="App">
        <Routes>
          <Route path='/' element ={<HomePage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/register" element={<MultiRoleRegister />} />
          <Route path="/tourist/" element={<TouristDashboard />} />
          <Route path="/tourguide/" element={<TourGuideDashboard />} />
          <Route path="/seller/" element={<SellerDashboard />} />  {/* Seller Dashboard */}
          <Route path="/activities" element={<Activities />} />
          <Route path="/itineraries" element={<Itineraries />} />
          <Route path='/advertiser' element={<AdvertiserDashboard />} />
          <Route path="/historical-places" element={<HistoricalPlaces />} />
          <Route path="/login" element={<Login />} />  {/* Login route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
