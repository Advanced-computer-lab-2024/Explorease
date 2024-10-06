import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Assuming you are using react-router for navigation

const UpdateAdvertiser = () => {
    const [formProfile, setFormProfile] = useState({
        username: '',
        email: '',
        password: '', // Will hold the original password as requested
        companyName: '',
        websiteLink: '',
        hotline: '',
        companyProfile: '',
    });
    const [updateMessage, setUpdateMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate(); // To redirect after update

      // Fetch the advertiser's profile to fill placeholders
      const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await axios.get('/advertiser/myProfile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data && response.data.advertiser) {
                // Pre-fill the form with existing profile data, including password
                setFormProfile({
                    username: response.data.advertiser.username || '',
                    email: response.data.advertiser.email || '',
                    password: response.data.advertiser.password || '', // Using the original password
                    companyName: response.data.advertiser.companyName || '',
                    websiteLink: response.data.advertiser.websiteLink || '',
                    hotline: response.data.advertiser.hotline || '',
                    companyProfile: response.data.advertiser.companyProfile || '',
                });
            }
        } catch (error) {
            setUpdateMessage('Error fetching profile');
        }
    };
    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormProfile({ ...formProfile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            
            const response = await axios.put('http://localhost:5000/advertiser/updateProfile', formProfile, {
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

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Edit Profile</h2>
            {updateMessage && <p style={{ color: success ? 'green' : 'red' }}>{updateMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formProfile.username || ''} // Default to empty string if undefined
                        onChange={handleChange}
                        placeholder="Enter username"
                        style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formProfile.email || ''} // Default to empty string if undefined
                        onChange={handleChange}
                        placeholder="Enter email"
                        style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                    />
                </div>
                <div>
                    <label>Password (leave blank to keep the same password)</label>
                    <input
                        type="password"
                        name="password"
                        value={formProfile.password || ''} // Original password as placeholder
                        onChange={handleChange}
                        placeholder={formProfile.password} // Original password displayed in placeholder
                        style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                    />
                </div>
                <div>
                    <label>Company Name</label>
                    <input
                        type="text"
                        name="companyName"
                        value={formProfile.companyName || ''} // Default to empty string if undefined
                        onChange={handleChange}
                        placeholder="Enter company name"
                        style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                    />
                </div>
                <div>
                    <label>Website Link</label>
                    <input
                        type="text"
                        name="websiteLink"
                        value={formProfile.websiteLink || ''} // Default to empty string if undefined
                        onChange={handleChange}
                        placeholder="Enter website link"
                        style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                    />
                </div>
                <div>
                    <label>Hotline</label>
                    <input
                        type="text"
                        name="hotline"
                        value={formProfile.hotline || ''} // Default to empty string if undefined
                        onChange={handleChange}
                        placeholder="Enter hotline"
                        style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                    />
                </div>
                <div>
                    <label>Company Profile</label>
                    <textarea
                        name="companyProfile"
                        value={formProfile.companyProfile || ''} // Default to empty string if undefined
                        onChange={handleChange}
                        placeholder="Enter company profile"
                        style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                    }}
                >
                    Update Profile
                </button>
            </form>
        </div>
    );
};

export default UpdateAdvertiser;
