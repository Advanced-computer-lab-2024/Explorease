import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Box, Card, CardContent, Grid } from '@mui/material';
import { Navigate } from 'react-router-dom';

const UploadDocument = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [requiredDocuments, setRequiredDocuments] = useState([]);
    const [userType, setUserType] = useState('');
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState({});

    const checkUserStatus = async () => {
        try {
            const response = await axios.post('/check-user-status', { email });
            const { message, requiredDocuments, userType , isAccepted} = response.data;
            if(isAccepted){
                setMessage('Documents have been reviewed and you are accepted. Redirecting to login page.');
                Navigate(`/login`);
                return;
            }
            setMessage(message);
            setRequiredDocuments(requiredDocuments || []);
            setUserType(userType);
            setShowUploadForm(requiredDocuments && requiredDocuments.length > 0);
        } catch (error) {
            setMessage('Error checking user status');
        }
    };

    const handleFileChange = (e, docType) => {
        setSelectedFiles((prevFiles) => ({
            ...prevFiles,
            [docType]: e.target.files[0],
        }));
    };

    const handleUploadDocuments = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('email', email);

        requiredDocuments.forEach((docType) => {
            if (selectedFiles[docType]) {
                formData.append(docType, selectedFiles[docType]); // Use exact docType names
            }
        });

        for (let [key, value] of formData.entries()) {
            console.log(key, value); // Should display each formData entry: key and file
        }

        const uploadUrl = `/upload-documents/${userType}`;
        

        try {
            await axios.post(uploadUrl, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage('Documents uploaded successfully!');
        } catch (error) {
            setMessage('Error uploading documents.');
        }
    };

    return (
        
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 4, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' , color:'#111E56' }}>
                Upload Required Documents
            </Typography>
            <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                margin="normal"
                variant="outlined"
            />
            <Button
                variant="contained"
                color="primary"
                onClick={checkUserStatus}
                sx={{ backgroundColor: '#111E56', 
                    color: 'white', 
                    border: '2px solid #111E56',
                    '&:hover': { 
                        backgroundColor: 'white', 
                        color: '#111E56',
                        border: '2px solid #111E56', // Optional: adds a border to match the dark blue on hover
                    },mt: 2, width: '100%', padding: '10px' }}
            >
                Check Status
            </Button>
            {message && (
                <Typography sx={{ mt: 2, color: message.includes('Error') ? 'red' : 'green', textAlign: 'center' }}>
                    {message}
                </Typography>
            )}
            {showUploadForm && (
                <Box component="form" onSubmit={handleUploadDocuments} sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Required Documents
                    </Typography>
                    <Grid container spacing={2}>
                        {requiredDocuments.map((doc, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <Card sx={{ boxShadow: 2, borderRadius: 1 }}>
                                    <CardContent>
                                        <Typography variant="subtitle1" gutterBottom>
                                            {doc}
                                        </Typography>
                                        <TextField
                                            type="file"
                                            inputProps={{ accept: '.pdf' }}
                                            onChange={(e) => handleFileChange(e, doc)}
                                            required
                                            fullWidth
                                            margin="dense"
                                            variant="outlined"
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ backgroundColor: '#111E56', 
                            color: 'white', 
                            border: '2px solid #111E56',
                            '&:hover': { 
                                backgroundColor: 'white', 
                                color: '#111E56',
                                border: '2px solid #111E56', // Optional: adds a border to match the dark blue on hover
                            },mt: 4, width: '100%', padding: '10px', fontWeight: 'bold' }}
                    >
                        Upload Documents
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default UploadDocument;
