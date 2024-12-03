import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';

const FileComplaint = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [date, setDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        const token = localStorage.getItem('token');

        try {
             await axios.post(
                '/tourists/addComplaint',
                { title, body, date },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccessMessage('Complaint filed successfully!');
            setTitle('');
            setBody('');
            setDate('');
            setIsLoading(false);

            
        
        } catch (error) {
            console.error('Error details:', error.response ? error.response.data : error.message);
            setErrorMessage(error.response?.data?.message || 'Error filing complaint');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>File a Complaint</h2>
            {successMessage && (
                <Typography color="primary" sx={{ mb: 2 }}>
                    {successMessage}
                    {isLoading && <CircularProgress size={20} sx={{ ml: 1 }} />}
                </Typography>
            )}
            {errorMessage && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {errorMessage}
                </Typography>
            )}

            <form onSubmit={handleSubmit}>
                <TextField
                    label="Title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                
                <TextField
                    label="Problem Description"
                    name="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    required
                />
                
                <TextField
                    label="Date"
                    name="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    required
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                        backgroundColor: '#111E56',
                        color: 'white',
                        border: '2px solid #111E56',
                        '&:hover': {
                            backgroundColor: 'white',
                            color: '#111E56',
                            border: '2px solid #111E56',
                        },
                        mt: 2
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress size={24} /> : 'Submit Complaint'}
                </Button>
            </form>
        </Box>
    );
};

export default FileComplaint;