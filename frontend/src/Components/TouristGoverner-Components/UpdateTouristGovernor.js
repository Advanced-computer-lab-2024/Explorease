import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateTouristGovernorProfile = ({ profile, setProfile, fetchProfile }) => {
    const [formProfile, setFormProfile] = useState({
        email: '',
        password: '',
        mobileNumber: '',
        yearsOfExperience: '',
        previousWork: '',
    }); // Initialize with empty values
    const [updateMessage, setUpdateMessage] = useState('');
    const [success, setSuccess] = useState(false); // New state to manage success status

    // UseEffect to populate formProfile with profile state once it's available
    useEffect(() => {
        if (profile && profile.email) {
            setFormProfile({
                email: profile.email || '',
                password: '', // Do not prefill the password for security reasons
                mobileNumber: profile.mobileNumber || '',
                yearsOfExperience: profile.yearsOfExperience || '',
                previousWork: profile.previousWork || '',
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        setFormProfile({ ...formProfile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put('/governor/updateProfile', formProfile, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUpdateMessage('Profile updated successfully');
            setSuccess(true);
            
            // Refetch the profile after successful update
            setProfile(response.data);
            fetchProfile();
        } catch (error) {
            setUpdateMessage('Error updating profile');
            setSuccess(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Update Tourist Governor Profile</h2>
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
                        value={formProfile.email} 
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
                        value={formProfile.password} 
                        onChange={handleChange} 
                        style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                    />
                </div>
                <div>
                    <label>Mobile Number</label>
                    <input 
                        type="text" 
                        name="mobileNumber" 
                        value={formProfile.mobileNumber} 
                        onChange={handleChange} 
                        style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                    />
                </div>
                <div>
                    <label>Years of Experience</label>
                    <input 
                        type="number" 
                        name="yearsOfExperience" 
                        value={formProfile.yearsOfExperience} 
                        onChange={handleChange} 
                        style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                    />
                </div>
                <div>
                    <label>Previous Work</label>
                    <input 
                        type="text" 
                        name="previousWork" 
                        value={formProfile.previousWork} 
                        onChange={handleChange} 
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
};

export default UpdateTouristGovernorProfile;
