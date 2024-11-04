import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AdminLogin from './Components/Admin-Components/AdminLogin';
import MultiRoleRegister from './Components/MainPage-Components/MultiRoleRegister';
import AdminDashboard from './Components/Admin-Components/AdminDashboard';
import TouristDashboard from './Components/Tourist-Components/TouristDashboard';
import Activities from './Components/MainPage-Components/Activities';
import Itineraries from './Components/MainPage-Components/Itineraries';
import HistoricalPlaces from './Components/MainPage-Components/HistoricalPlace';
import TourGuideDashboard from './Components/TourGuide-Components/TourGuideDashboard';  // Import the new dashboard
import Login from './Components/MainPage-Components/Login';
import HomePage from './Components/MainPage-Components/HomePage';
import SellerDashboard from './Components/Seller-Components/SellerDashboard';  // Import SellerDashboard
import AdvertiserDashboard from './Components/Advertiser-Components/AdvertiserDashboard';
import TouristGovernorDashboard from './Components/TouristGoverner-Components/TouristGovernor';
import UploadDocuments from './Components/MainPage-Components/UploadDocuments';
function App() {
            // All paths needed
  return (
    <Router>

      <div className="App">
        <Routes>
          <Route path='/' element ={<HomePage />} />
          <Route path="/governor" element={<TouristGovernorDashboard />} />
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
          <Route path="/uploadDocuments" element={<UploadDocuments />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
