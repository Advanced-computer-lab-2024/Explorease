import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TouristNavbar from './TouristNavbar';

const TouristDashboard = () => {
    const [profile, setProfile] = useState({});
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');  
            console.log(token);
    
            if (!token) {
                navigate('/login');  
            }
    
            try {
                // Use relative path, proxy will forward the request
                const response = await axios.get('/tourists/myProfile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
    
                // Log the response to see if it contains the "tourist" object
                console.log('Response:', response.data);
    
                // Check if response contains the expected "tourist" field
                if (response.data) {
                    setProfile(response.data);
                } else {
                    console.error('No tourist data in the response:', response.data);
                    setMessage('No profile data found');
                }
    
            } catch (error) {
                console.error('Error fetching profile:', error.response ? error.response.data : error.message);
                setMessage('Error fetching profile');
            }
        };
    
        fetchProfile();
    }, [navigate]);
    
// Card styling
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

    return (
        
        <div>
            <TouristNavbar /> 
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

        </div>
    );
};

export default TouristDashboard;
