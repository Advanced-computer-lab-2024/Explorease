import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TouristNavbar from './TouristNavbar'; 
import { useNavigate } from 'react-router-dom';
import UpdateAdvertiser from './UpdateAdvertiser';
import MyActivities from './MyActivities';  // Import the new component
import CreateActivity from './CreateActivity';

const AdvertiserDashboard = () => {
    const [profile, setProfile] = useState({});
    const [message, setMessage] = useState('');
    const [activeComponent, setActiveComponent] = useState('profile'); 
    const navigate = useNavigate(); // Import useNavigate

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await axios.get('/advertiser/myProfile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if (response.data && response.data.advertiser) {
                setProfile(response.data.advertiser); 
            } else {
                setMessage('No profile data found');
            }
        } catch (error) {
            setMessage('Error fetching profile');
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const sidebarStyle = {
        width: '250px',
        backgroundColor: '#f1f1f1',
        padding: '15px',
        position: 'fixed',
        height: '100%',
        top: '45px',
        left: '0',
        display: 'flex',
        flexDirection: 'column',
        zIndex: '1',
    };

    const contentStyle = {
        marginLeft: '260px',
        padding: '20px',
    };

    const cardStyle = {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '20px',
        maxWidth: '400px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
    };

    const renderContent = () => {
        switch (activeComponent) {
            case 'profile':
                return (
                    <div>
                        <h2>Advertiser Profile</h2>
                        {message && <p>{message}</p>}
                        {profile && profile.username ? (
                            <div style={cardStyle}>
                                <p><strong>Username:</strong> {profile.username}</p>
                                <p><strong>Email:</strong> {profile.email}</p>
                                <p><strong>Company Name:</strong> {profile.companyName}</p>
                                <p><strong>Website Link:</strong> <a href={profile.websiteLink} target="_blank" rel="noopener noreferrer">{profile.websiteLink}</a></p>
                                <p><strong>Hotline:</strong> {profile.hotline}</p>
                                <p><strong>Company Profile:</strong> {profile.companyProfile}</p>
                            </div>
                        ) : (
                            <p>Loading profile...</p>
                        )}
                    </div>
                );
            case 'viewActivities':
                return <MyActivities />; 
            case 'createActivity':  // New case for Create Activity
                return <CreateActivity />;
            case 'updateAdvertiser':
                return <UpdateAdvertiser profile={profile} setProfile={setProfile} />;
            default:
                return <h2>Welcome to Advertiser Dashboard</h2>;
        }
    };

    return (
        <div>
            <TouristNavbar />
            <div style={sidebarStyle}>
                <h3>Dashboard</h3>
                <ul style={{ listStyleType: 'none', padding: '0' }}>
                    <li onClick={() => setActiveComponent('profile')} style={{ cursor: 'pointer', marginBottom: '10px' }}>View Profile</li>
                    <li onClick={() => setActiveComponent('updateAdvertiser')} style={{ cursor: 'pointer', marginBottom: '10px' }}>Edit Profile</li>
                    <li onClick={() => setActiveComponent('viewActivities')} style={{ cursor: 'pointer', marginBottom: '10px' }}>Get My Activities</li>
                    <li onClick={() => setActiveComponent('createActivity')} style={{ cursor: 'pointer', marginBottom: '10px' }}>Create Activity</li> {/* New Create Activity option */}
                </ul>
            </div>
            <div style={contentStyle}>
                {renderContent()}
            </div>
        </div>
    );
};

export default AdvertiserDashboard;
