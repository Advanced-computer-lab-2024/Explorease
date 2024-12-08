import React, { useState } from 'react';
import axios from 'axios';
import { Button, Typography, Box, TextField, CircularProgress } from '@mui/material';

const AddPhoto = ({ setProfile }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a photo to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('photo', file);

        setUploading(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/tourguide/upload-photo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            const newPhotoUrl = response.data.photoUrl;
            setMessage('Photo uploaded successfully!');
            setPhotoUrl(newPhotoUrl);
            setProfile(prevProfile => ({ ...prevProfile, imageUrl: newPhotoUrl }));
        } catch (error) {
            setMessage('Failed to upload photo. Please try again.');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 4, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color:'#111E56' }}>
                Upload Your Photo
            </Typography>

            <TextField
                type="file"
                fullWidth
                margin="normal"
                inputProps={{ accept: 'image/*' }}
                onChange={handleFileChange}
            />

            <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                sx={{ backgroundColor: '#111E56', 
                    color: 'white',
                    border: '2px solid #111E56', 
                    '&:hover': { 
                        backgroundColor: 'white', 
                        color: '#111E56',
                        border: '2px solid #111E56' // Optional: adds a border to match the dark blue on hover
                    },mt: 2, width: '100%', padding: '10px' }}
                disabled={uploading}
            >
                {uploading ? <CircularProgress size={24} /> : 'Upload Photo'}
            </Button>

            {message && (
                <Typography sx={{ mt: 2, color: message.includes('Failed') ? 'red' : 'green', textAlign: 'center' }}>
                    {message}
                </Typography>
            )}

            {photoUrl && (
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="h6">Uploaded Photo:</Typography>
                    <img src={photoUrl} alt="Uploaded" style={{ maxWidth: '100%', marginTop: '10px', borderRadius: '8px' }} />
                </Box>
            )}
        </Box>
    );
};

export default AddPhoto;
