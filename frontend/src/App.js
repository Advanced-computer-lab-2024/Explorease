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
import SingleItinerary from './Components/MainPage-Components/SingleItinerary';
import SingleActivity from './Components/MainPage-Components/SingleActivity';
import Success from './Components/Tourist-Components/Success';
import PaymentStatus from './Components/Tourist-Components/PaymentStatus';
import ActivitySuccess from './Components/Tourist-Components/ActivitySuccess';
import ItinerarySuccess from './Components/Tourist-Components/ItinerarySuccess';
import { CurrencyProvider } from './Components/Tourist-Components/CurrencyContext';
import TouristGuide from './Guide/guidetourist';

function App() {
            // All paths needed
  return (
    <CurrencyProvider>
    <Router>

      <div className="App">
        <Routes>
          <Route path='/' element ={<HomePage />} />
          <Route path="/governor" element={<TouristGovernorDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/register" element={<MultiRoleRegister />} />
          <Route path='/touristguide' element={<TouristGuide />} />
          
          <Route path="/tourist/" element={<TouristDashboard />} />

          <Route path="/tourguide/" element={<TourGuideDashboard />} />
          <Route path="/seller/" element={<SellerDashboard />} />  {/* Seller Dashboard */}
          <Route path="/activities" element={<Activities />} />
          <Route path="/itineraries" element={<Itineraries />} />
          <Route path='/advertiser' element={<AdvertiserDashboard />} />
          <Route path="/historical-places" element={<HistoricalPlaces />} />
          <Route path="/login" element={<Login />} />  {/* Login route */}
          <Route path="/uploadDocuments" element={<UploadDocuments />} />
          <Route path="/itinerary/:id" element={<SingleItinerary />} />
          <Route path="/activity/:id" element={<SingleActivity />} />
          <Route path="/success" element={<Success />} />
          <Route path="/payment-status" element={<PaymentStatus />} />
          <Route path="/activity-success" element={<ActivitySuccess />} />
          <Route path='/itinerary-success' element={<ItinerarySuccess />} />

        </Routes>
      </div>
    </Router>
    </CurrencyProvider>
  );
}

export default App;
