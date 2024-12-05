import React, { useState } from 'react';
import axios from 'axios';
import { Button, Typography, Box, TextField, CircularProgress } from '@mui/material';

const UploadLogo = ({ setProfile }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [logoUrl, setLogoUrl] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a logo to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('photo', file);

        setUploading(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token'); // Assume JWT is stored in localStorage
            const response = await axios.post('/seller/upload-photo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessage('Logo uploaded successfully!');
            setProfile(prevProfile => ({ ...prevProfile, imageUrl: response.data.photoUrl }));
            setLogoUrl(response.data.photoUrl); // Save the uploaded logo URL to display
        } catch (error) {
            setMessage('Failed to upload logo. Please try again.');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 4, boxShadow: 3, borderRadius: 2, backgroundColor: '#fafafa' }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                Upload Your Logo
            </Typography>

            <TextField
                type="file"
                fullWidth
                margin="normal"
                inputProps={{ accept: 'image/*' }}
                onChange={handleFileChange}
                sx={{ backgroundColor: 'white' }}
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
                        border: '2px solid #111E56', // Optional: adds a border to match the dark blue on hover
                    },mt: 4, width: '100%', padding: '10px' }}
                disabled={uploading}
            >
                {uploading ? <CircularProgress size={24} /> : 'Upload Logo'}
            </Button>

            {message && (
                <Typography sx={{ mt: 2, color: message.includes('Failed') ? 'red' : 'green', textAlign: 'center' }}>
                    {message}
                </Typography>
            )}

            {logoUrl && (
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="h6">Uploaded Logo:</Typography>
                    <img src={logoUrl} alt="Uploaded Logo" style={{ maxWidth: '100%', marginTop: '10px', borderRadius: '8px' }} />
                </Box>
            )}
        </Box>
    );
};

export default UploadLogo;
