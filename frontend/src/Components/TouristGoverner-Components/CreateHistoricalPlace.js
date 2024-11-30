import React, { useState } from 'react';
import axios from 'axios';
import {
    Box,
    TextField,
    Typography,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Alert,
} from '@mui/material';

const CreateHistoricalPlace = () => {
    const [formData, setFormData] = useState({
        Name: '',
        Description: '',
        Location: '',
        OpeningHours: '',
        ClosingHours: '',
        TicketPrices: {
            foreigner: '',
            native: '',
            student: ''
        },
        Period: '',
        Type: '',
        tags: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleTicketPriceChange = (e) => {
        setFormData({
            ...formData,
            TicketPrices: {
                ...formData.TicketPrices,
                [e.target.name]: e.target.value
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('Please log in first.');
            return;
        }

        const tagsArray = formData.tags.split(',').map(tag => tag.trim());

        const finalFormData = {
            ...formData,
            tags: tagsArray
        };

        try {
            const response = await axios.post('/governor/createHistoricalPlace', finalFormData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201) {
                setMessage('Historical Place created successfully!');
                setFormData({
                    Name: '',
                    Description: '',
                    Location: '',
                    OpeningHours: '',
                    ClosingHours: '',
                    TicketPrices: {
                        foreigner: '',
                        native: '',
                        student: ''
                    },
                    Period: '',
                    Type: '',
                    tags: ''
                });
            } else {
                setMessage('Failed to create Historical Place.');
            }
        } catch (error) {
            setMessage(`Error creating Historical Place: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, margin: 'auto', marginTop:'30px',marginBottom:'50px' ,padding: '20px', boxShadow: 3, borderRadius: '8px', backgroundColor: 'white',transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
            }, }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ color: '#111E56', fontWeight: 'bold' }}>
                Create Historical Place
            </Typography>
            {message && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    {message}
                </Alert>
            )}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    name="Name"
                    value={formData.Name}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Description"
                    name="Description"
                    value={formData.Description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Location"
                    name="Location"
                    value={formData.Location}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Opening Hours"
                    name="OpeningHours"
                    value={formData.OpeningHours}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Closing Hours"
                    name="ClosingHours"
                    value={formData.ClosingHours}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                        label="Ticket Price (Foreigner)"
                        name="foreigner"
                        value={formData.TicketPrices.foreigner}
                        onChange={handleTicketPriceChange}
                        type="number"
                        fullWidth
                        required
                    />
                    <TextField
                        label="Ticket Price (Native)"
                        name="native"
                        value={formData.TicketPrices.native}
                        onChange={handleTicketPriceChange}
                        type="number"
                        fullWidth
                        required
                    />
                    <TextField
                        label="Ticket Price (Student)"
                        name="student"
                        value={formData.TicketPrices.student}
                        onChange={handleTicketPriceChange}
                        type="number"
                        fullWidth
                        required
                    />
                </Box>
                <TextField
                    label="Historical Period"
                    name="Period"
                    value={formData.Period}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />
                <FormControl fullWidth required sx={{ mb: 2 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                        name="Type"
                        value={formData.Type}
                        onChange={handleChange}
                    >
                        <MenuItem value="">Select Type</MenuItem>
                        <MenuItem value="Monument">Monument</MenuItem>
                        <MenuItem value="Museum">Museum</MenuItem>
                        <MenuItem value="Religious Site">Religious Site</MenuItem>
                        <MenuItem value="Palace">Palace</MenuItem>
                        <MenuItem value="Castle">Castle</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Tags (comma-separated)"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="e.g., Monument, Museum, Palace"
                    fullWidth
                    sx={{ mb: 3 }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                        textTransform: 'none',
                        marginBottom: '10px',   
                        backgroundColor: '#111E56',
                        '&:hover': {
                            backgroundColor: 'white',
                            color: '#111E56',
                            border: '1px solid #111E56',
                        },
                    }}
                >
                    Create Historical Place
                </Button>
            </form>
        </Box>
    );
};

export default CreateHistoricalPlace;
