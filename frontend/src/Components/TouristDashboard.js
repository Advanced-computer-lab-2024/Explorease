import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TouristNavbar from './TouristNavbar';
import Products from './Products'

const TouristDashboard = () => {
    const [profile, setProfile] = useState({});
    const [message, setMessage] = useState('');
    const [activeComponent, setActiveComponent] = useState('profile'); // State to manage active component
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');  
            }

            try {
                const response = await axios.get('/tourists/myProfile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data) {
                    setProfile(response.data);
                } else {
                    setMessage('No profile data found');
                }

            } catch (error) {
                console.error('Error fetching profile:', error.response ? error.response.data : error.message);
                setMessage('Error fetching profile');
            }
        };
    
        fetchProfile();
    }, [navigate]);

    // Function to handle updating the profile
    const UpdateProfile = () => {
        const [formProfile, setFormProfile] = useState(profile);
        const [updateMessage, setUpdateMessage] = useState('');
        const [success, setSuccess] = useState(false); // New state to manage success status

        const handleChange = (e) => {
            setFormProfile({ ...formProfile, [e.target.name]: e.target.value });
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('token');
            try {
                const response = await axios.put('/tourists/myProfile', formProfile, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUpdateMessage('Profile updated successfully');
                setProfile(response.data.tourist);  // Update main profile state
                setSuccess(true);
            } catch (error) {
                setUpdateMessage('Error updating profile');
                setSuccess(false);
            }
        };

        return (
            <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
                <h2>Update Profile</h2>
                {/* Display success message */}
                {updateMessage && (
                    <p style={{ color: success ? 'green' : 'red', marginBottom: '20px' }}>
                        {updateMessage}
                    </p>
                )}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formProfile.email || ''} 
                            onChange={handleChange} 
                            required
                            style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={formProfile.password || ''} 
                            onChange={handleChange} 
                            required
                            style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                        />
                    </div>
                    <div>
                        <label>Mobile Number</label>
                        <input 
                            type="text" 
                            name="mobileNumber" 
                            value={formProfile.mobileNumber || ''} 
                            onChange={handleChange} 
                            required
                            style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                        />
                    </div>
                    <div>
                        <label>Job or Student</label>
                        <select 
                            name="jobOrStudent" 
                            value={formProfile.jobOrStudent || ''} 
                            onChange={handleChange} 
                            required
                            style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                        >
                            <option value="Job">Job</option>
                            <option value="Student">Student</option>
                        </select>
                    </div>
                    <div>
                        <label>Preferences (comma separated)</label>
                        <input 
                            type="text" 
                            name="preferences" 
                            value={formProfile.preferences || ''} 
                            onChange={handleChange} 
                            placeholder="e.g. museum, adventure"
                            style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                        />
                    </div>
                    <button 
                        type="submit" 
                        style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer', width: '100%' }}>
                        Update Profile
                    </button>
                </form>
                
            </div>
        );
    }

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
        zIndex : '1'
    };

    const contentStyle = {
        marginLeft: '260px', // Space for the sidebar
        padding: '20px',
    };

    // Styling for the profile card
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

    const labelStyle = {
        fontWeight: 'bold',
        marginBottom: '10px',
        display: 'block',
        fontSize: '18px',
    };

    const valueStyle = {
        marginBottom: '20px',
        fontSize: '16px',
        color: '#555',
    };

    // Render content based on active component
    const renderContent = () => {
        console.log('Active Component:', activeComponent);  // Debug to check active component state
        switch (activeComponent) {
            case 'profile':
                return (
                    <>
                        <h2 style={{ textAlign: 'center', marginBottom: '20px'}}>Tourist Profile</h2>
                        {message && <p style={{ textAlign: 'center', color: 'red' }}>{message}</p>}
                        {profile && profile.username ? (
                            <div style={cardStyle}>
                                <p><span style={labelStyle}>Username:</span> <span style={valueStyle}>{profile.username}</span></p>
                                <p><span style={labelStyle}>Email:</span> <span style={valueStyle}>{profile.email}</span></p>
                                <p><span style={labelStyle}>Date of Birth:</span> <span style={valueStyle}>{new Date(profile.dob).toLocaleDateString()}</span></p>
                                <p><span style={labelStyle}>Nationality:</span> <span style={valueStyle}>{profile.nationality}</span></p>
                                <p><span style={labelStyle}>Wallet Balance:</span> <span style={valueStyle}>{profile.wallet} USD</span></p>
                            </div>
                        ) : (
                            <p>Loading profile...</p>
                        )}
                    </>
                );
            case 'viewProducts':
                return <Products />;  // Placeholder for the product list component
            case 'updateProfile':
                return <UpdateProfile />; // Show the Update Profile form when 'Update Profile' is selected
            default:
                return <h2>Welcome to the Dashboard</h2>;
        }
    };

    return (
        <div>
            <TouristNavbar /> 

            <div style={sidebarStyle}>
                <h3>Dashboard</h3>
                <ul style={{ listStyleType: 'none', padding: '0' }}>
                    <li onClick={() => setActiveComponent('profile')} style={{ cursor: 'pointer', marginBottom: '10px' }}>View Profile</li>
                    <li onClick={() => setActiveComponent('viewProducts')} style={{ cursor: 'pointer', marginBottom: '10px' }}>View All Products</li>
                    <li onClick={() => setActiveComponent('updateProfile')} style={{ cursor
                : 'pointer', marginBottom: '10px' }}>Update Profile</li>
                </ul>
            </div>
    
            <div style={contentStyle}>
                {renderContent()}
            </div>
        </div>
    );
};

export default TouristDashboard;