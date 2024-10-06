import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TouristNavbar from './TouristNavbar';

const TouristGovernorDashboard = () => {
    const [profile, setProfile] = useState({});
    const [historicalPlaces, setHistoricalPlaces] = useState([]);
    const [message, setMessage] = useState('');
    const [activeComponent, setActiveComponent] = useState('profile'); // To switch between views
    const [formProfile, setFormProfile] = useState(profile); // For editing profile
    const [updateMessage, setUpdateMessage] = useState('');
    const [success, setSuccess] = useState(false);

    // Fetch the tourist governor profile
    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await axios.get('/governor/myProfile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data && response.data.touristGovernor) {
                setProfile(response.data.touristGovernor);
                setFormProfile(response.data.touristGovernor); // Set form profile for edit
            } else {
                setMessage('No profile data found');
            }
        } catch (error) {
            setMessage('Error fetching profile');
        }
    };

    // Fetch the tourist governor's historical places
    const fetchHistoricalPlaces = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await axios.get('/governor/myHistoricalPlaces', {
                headers: {
                    Authorization: `Bearer ${token}`,   
                },
            });

            if (response.data && response.data.historicalPlaces) {
                setHistoricalPlaces(response.data.historicalPlaces);
            } else {
                setMessage('No historical places found');
            }
        } catch (error) {
            setMessage('Error fetching historical places');
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // Handle form changes for updating profile
    const handleChange = (e) => {
        setFormProfile({ ...formProfile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put('/touristgovernor/updateProfile', formProfile, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUpdateMessage('Profile updated successfully');
            setSuccess(true);
            fetchProfile();
        } catch (error) {
            setUpdateMessage('Error updating profile');
            setSuccess(false);
        }
    };

    // Render the profile
    const renderProfile = () => (
        <div>
            <h2>Tourist Governor Profile</h2>
            {message && <p>{message}</p>}
            {profile && profile.username ? (
                <div>
                    <p><strong>Username:</strong> {profile.username}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                </div>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    );

    // Render form to update profile
    const renderEditProfile = () => (
        <div>
            <h2>Edit Profile</h2>
            {updateMessage && <p style={{ color: success ? 'green' : 'red' }}>{updateMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formProfile.username || ''}
                        onChange={handleChange}
                        style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formProfile.email || ''}
                        onChange={handleChange}
                        style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff', width: '100%' }}>
                    Update Profile
                </button>
            </form>
        </div>
    );

    // Render historical places
    const renderHistoricalPlaces = () => (
        <div>
            <h2>My Historical Places</h2>
            {message && <p>{message}</p>}
            {historicalPlaces.length ? (
                <ul>
                    {historicalPlaces.map((place) => (
                        <li key={place._id}>
                            <p><strong>Name:</strong> {place.name}</p>
                            <p><strong>Description:</strong> {place.description}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No historical places to display</p>
            )}
        </div>
    );

    const renderContent = () => {
        switch (activeComponent) {
            case 'profile':
                return renderProfile();
            case 'editProfile':
                return renderEditProfile();
            case 'viewHistoricalPlaces':
                fetchHistoricalPlaces();
                return renderHistoricalPlaces();
            default:
                return <h2>Welcome to the Tourist Governor Dashboard</h2>;
        }
    };

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

    return (
        <div>
            <TouristNavbar />
            <div style={sidebarStyle}>
                <h3>Dashboard</h3>
                <ul style={{ listStyleType: 'none', padding: '0' }}>
                    <li onClick={() => setActiveComponent('profile')} style={{ cursor: 'pointer', marginBottom: '10px' }}>View Profile</li>
                    <li onClick={() => setActiveComponent('editProfile')} style={{ cursor: 'pointer', marginBottom: '10px' }}>Edit Profile</li>
                    <li onClick={() => setActiveComponent('viewHistoricalPlaces')} style={{ cursor: 'pointer', marginBottom: '10px' }}>View Historical Places</li>
                </ul>
            </div>
            <div style={contentStyle}>
                {renderContent()}
            </div>
        </div>
    );
};

export default TouristGovernorDashboard;
