import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    

    return (
        <div>
            <h2>Tourist Profile</h2>

            {message && <p>{message}</p>}

            {profile && profile.username ? (
    <div>
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Date of Birth:</strong> {profile.dob}</p>
        <p><strong>Nationality:</strong> {profile.nationality}</p>
        <p><strong>Wallet Balance:</strong> {profile.wallet} USD</p>
    </div>
) : (
    <p>Loading profile...</p>
)}

        </div>
    );
};

export default TouristDashboard;
