import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UpdateTouristGovernorProfile from './UpdateTouristGovernor';
import TouristNavbar from './TouristNavbar';
import CreateHistoricalPlace from './CreateHistoricalPlace'; // Ensure this matches the actual file name



const TouristGovernorDashboard = () => {
    const [profile, setProfile] = useState({});
    const [historicalPlaces, setHistoricalPlaces] = useState([]);
    const [message, setMessage] = useState('');
    const [activeComponent, setActiveComponent] = useState('profile'); // To switch between views
    const [formProfile, setFormProfile] = useState(profile); // For editing profile
    const [updateMessage, setUpdateMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const [governorId, setGovernorId] = useState(null);

    const [editingPlaceId, setEditingPlaceId] = useState(null); // Track the place being edited
    const [updatedPlaceData, setUpdatedPlaceData] = useState({}); // Store updated place data

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

            if (response.data) {
                setProfile(response.data);
                setFormProfile(response.data.touristGovernor); // Set form profile for edit
                setGovernorId(response.data._id); 
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
            const response = await axios.get('/governor/getMyHistoricalPlaces', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data && response.data.length) {
                setHistoricalPlaces(response.data);
                setMessage('');
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

    // Handle input change for historical place editing
    const handleInputChange = (e, field) => {
        setUpdatedPlaceData({ ...updatedPlaceData, [field]: e.target.value });
    };

    // Enable edit mode for a specific historical place
    const handleEditPlace = (place) => {
        setEditingPlaceId(place._id); // Set the place to be edited
        setUpdatedPlaceData(place);   // Pre-fill the form with current place data
    };

    // Handle submitting the updated historical place data
    const handleUpdateSubmit = async (placeId) => {
        const token = localStorage.getItem('token');
        console.log('Updated Place Data:', updatedPlaceData);
        console.log('Place ID:', placeId);
        console.log('Governor ID:', governorId); // Log the governor ID for debugging
        try {
            const response = await axios.put(`/governor/updateHistoricalPlace/${placeId}`, updatedPlaceData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
    
            console.log('Response:', response); // Log the response
            setMessage('Historical place updated successfully');
            setEditingPlaceId(null); // Exit edit mode
            fetchHistoricalPlaces(); // Refetch places to update UI
        } catch (error) {
            setMessage('Error updating historical place');
        }
    };

    const handleDelete = async (placeId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await axios.delete(`/governor/deleteHistoricalPlace/:id/${placeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Refetch the historical places after deletion
            fetchHistoricalPlaces();
        } catch (error) {
            setMessage('Error deleting historical place');
        }
    };

    // Render historical places
    const renderHistoricalPlaces = () => (
        <div>
            <h2>My Historical Places</h2>
            {message && <p>{message}</p>}
            {historicalPlaces.length ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    {historicalPlaces.map((place) => (
                        <div key={place._id} style={cardStyle}>
                            {editingPlaceId === place._id ? (
                                <>
                                    {/* Render editable fields */}
                                    <input
                                        type="text"
                                        value={updatedPlaceData.Name || ''}
                                        onChange={(e) => handleInputChange(e, 'Name')}
                                        style={inputStyle}
                                    />
                                    <textarea
                                        value={updatedPlaceData.Description || ''}
                                        onChange={(e) => handleInputChange(e, 'Description')}
                                        style={inputStyle}
                                    />
                                    <input
                                        type="text"
                                        value={updatedPlaceData.Location || ''}
                                        onChange={(e) => handleInputChange(e, 'Location')}
                                        style={inputStyle}
                                    />
                                    {/* Additional fields can be added here */}
                                    <button
                                        onClick={() => handleUpdateSubmit(place._id)}
                                        style={saveButtonStyle}
                                    >
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <>
                                    {/* Render normal fields */}
                                    <h3>{place.Name}</h3>
                                    <p><strong>Description:</strong> {place.Description}</p>
                                    <p><strong>Location:</strong> {place.Location}</p>
                                    {/* Additional fields can be shown here */}
                                    <button
                                        onClick={() => handleEditPlace(place)}
                                        style={buttonStyle}
                                    >
                                        Edit Place
                                    </button>
                                </>
                            )}
                            <button
                                style={{ ...buttonStyle, backgroundColor: 'red' }}
                                onClick={() => handleDelete(place._id)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No historical places to display</p>
            )}
        </div>
    );

    // Add useEffect to fetch historical places when activeComponent changes
    useEffect(() => {
        if (activeComponent === 'viewHistoricalPlaces') {
            fetchHistoricalPlaces();
        }
    }, [activeComponent]);

    const renderContent = () => {
        switch (activeComponent) {
            case 'profile':
                return renderProfile();
            case 'viewHistoricalPlaces':
                return renderHistoricalPlaces();
            case 'createHistoricalPlaces':
                return <CreateHistoricalPlace />;
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
                    <li onClick={() => setActiveComponent('viewHistoricalPlaces')} style={{ cursor: 'pointer', marginBottom: '10px' }}>View Historical Places</li>
                    <li onClick={() => setActiveComponent('createHistoricalPlaces')} style={{ cursor: 'pointer', marginBottom: '10px' }}>Create Historical Places</li>
                </ul>
            </div>
            <div style={contentStyle}>
                {renderContent()}
            </div>
        </div>
    );
};

// Styles for the card and buttons
const cardStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '20px',
    width: '250px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
};

const buttonStyle = {
    padding: '10px',
    marginRight: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
};

const saveButtonStyle = {
    padding: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
};

const inputStyle = {
    width: '100%',
    padding: '8px',
    margin: '5px 0',
    boxSizing: 'border-box',
};

export default TouristGovernorDashboard;
