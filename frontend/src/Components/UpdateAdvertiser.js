import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Assuming you are using react-router for navigation
import { set } from 'mongoose';

const UpdateAdvertiser = ({ profile, setProfile }) => {
    const [formProfile, setFormProfile] = useState({
        username: '',
        companyName: '',
        websiteLink: '',
        hotline: '',
        companyProfile: '',
        // currentPassword: '',  // Added current password field
        // newPassword: '',      // Added new password field
        // confirmPassword: '',  // New confirmation password field
    });
    const [updateMessage, setUpdateMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate(); // To redirect after update

    useEffect(() => {
        if (profile) {
            setFormProfile(profile);  // Only update formProfile if profile exists
        }
    }, [profile]);

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
        console.log('FormProfile Data:', formProfile);

        const cleanedProfile = { ...formProfile };
        Object.keys(cleanedProfile).forEach(key => {
            if (cleanedProfile[key] === '') delete cleanedProfile[key];
        });

        const urlPattern = new RegExp(/^(https?:\/\/)?([\w\-]+\.)+[a-z]{2,6}(\/[^\s]*)?$/);
if (formProfile.websiteLink && !urlPattern.test(formProfile.websiteLink)) {
    setUpdateMessage('Please enter a valid website URL');
    return;
}

    
        // Log cleaned profile
        console.log('Cleaned Profile being sent:', cleanedProfile);
        try {
            

            // const response = await axios.put('/advertiser/updateProfile', formProfile, {

            const response = await axios.put('/advertiser/updateProfile', cleanedProfile, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProfile(response.data.updatedAdvertiser); // Update the profile

            setUpdateMessage('Profile updated successfully');
            setSuccess(true);
            
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

                {/* <div>
                    <label>Current Password (required to change password)</label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={formProfile.currentPassword || ''}
                        onChange={handleChange}
                        placeholder="Enter current password"
                        style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                    />
                </div>
                <div>
                    <label>New Password</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={formProfile.newPassword || ''}
                        onChange={handleChange}
                        placeholder="Enter new password"
                        style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                    />
                </div>

                <div>
                    <label>Confirm New Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formProfile.confirmPassword || ''}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                        style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                    />
                </div> */}

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
