import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UpdateTouristGovernorProfile from './UpdateTouristGovernor';
import TouristNavbar from './TouristNavbar';

const TouristGovernorDashboard = () => {
    const [profile, setProfile] = useState({});
    const [historicalPlaces, setHistoricalPlaces] = useState([]);
    const [message, setMessage] = useState('');
    const [activeComponent, setActiveComponent] = useState('profile'); // To switch between views
    const [formProfile, setFormProfile] = useState(profile); // For editing profile
    const [updateMessage, setUpdateMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const [editMode, setEditMode] = useState({}); // To track edit mode for each place
    const [formValues, setFormValues] = useState({}); 

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

            console.log(response);

            if (response.data) {
                setProfile(response.data);
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
            const response = await axios.get('/governor/getMyHistoricalPlaces', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log(response.data);
    
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


    // Render historical places
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
            console.error('Error deleting historical place:', error);
            setMessage('Error deleting historical place');
        }
    };
    
    // Function to handle the update (This should ideally navigate to an update form/page)
    const handleUpdate = async (placeId, updatedPlace) => {
        const token = localStorage.getItem('token');
        if (!token) return;
    
        try {
            await axios.put(`/governor/updateHistoricalPlace/${placeId}`, updatedPlace, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Refetch the historical places after updating
            fetchHistoricalPlaces();
            setMessage('Historical place updated successfully');
        } catch (error) {
            console.error('Error updating historical place:', error);
            setMessage('Error updating historical place');
        }
    };
    
    // Handle form changes for historical places
    const handlePlaceChange = (e, placeId) => {
        const { name, value } = e.target;
        setHistoricalPlaces((prevPlaces) =>
            prevPlaces.map((place) =>
                place._id === placeId ? { ...place, [name]: value } : place
            )
        );
    };
    const renderHistoricalPlaces = () => (
        <div>
            <h2>My Historical Places</h2>
            {message && <p>{message}</p>}
            {historicalPlaces.length ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    {historicalPlaces.map((place) => (
                        <div key={place._id} style={cardStyle}>
                            <h3>Historical Place</h3>
                            {/* Input field for editing the name */}
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                placeholder={place.Name}
                                value={place.name || ''}
                                onChange={(e) => handlePlaceChange(e, place._id)}
                                style={inputStyle}
                            />
    
                            {/* Input field for editing the description */}
                            <label>Description:</label>
                            <input
                                type="text"
                                name="description"
                                placeholder={place.Description}
                                value={place.description || ''}
                                onChange={(e) => handlePlaceChange(e, place._id)}
                                style={inputStyle}
                            />
    
                            {/* Update and Delete buttons */}
                            <div style={{ marginTop: '10px' }}>
                                <button
                                    style={buttonStyle}
                                    onClick={() => handleUpdate(place._id, { name: place.name, description: place.description })}
                                >
                                    Update
                                </button>
                                <button
                                    style={{ ...buttonStyle, backgroundColor: 'red' }}
                                    onClick={() => handleDelete(place._id)}
                                >
                                    Delete
                                </button>
                            </div>
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
        case 'editProfile':
            return <UpdateTouristGovernorProfile />;
        case 'viewHistoricalPlaces':
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
    const inputStyle = {
        width: '100%',
        padding: '8px',
        margin: '5px 0',
        boxSizing: 'border-box',
    };

export default TouristGovernorDashboard;
