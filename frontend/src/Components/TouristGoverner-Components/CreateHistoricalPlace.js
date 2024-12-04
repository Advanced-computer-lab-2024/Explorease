import React, { useState } from 'react';
import axios from 'axios';
import {
    Box,
    TextField,
    Typography,
    Button,
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
        tags: '',
    });

    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null); // To store the image file

    // Handle text input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle ticket price changes
    const handleTicketPriceChange = (e) => {
        setFormData({
            ...formData,
            TicketPrices: {
                ...formData.TicketPrices,
                [e.target.name]: e.target.value
            }
        });
    };

    // Handle image file selection
    const handleImageChange = (e) => {
        setImage(e.target.files[0]); // Set the selected image file
    };

    // Submit form data including the image
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check for a valid token (authentication)
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('Please log in first.');
            return;
        }

        // Prepare the form data
        const formDataToSend = new FormData();
        formDataToSend.append('Name', formData.Name);
        formDataToSend.append('Description', formData.Description);
        formDataToSend.append('Location', formData.Location);
        formDataToSend.append('OpeningHours', formData.OpeningHours);
        formDataToSend.append('ClosingHours', formData.ClosingHours);
        formDataToSend.append('Period', formData.Period);
        formDataToSend.append('Type', formData.Type);
        formDataToSend.append('tags', formData.tags); // You might need to adjust this if it's an array
        formDataToSend.append('TicketPrices[foreigner]', formData.TicketPrices.foreigner);
        formDataToSend.append('TicketPrices[native]', formData.TicketPrices.native);
        formDataToSend.append('TicketPrices[student]', formData.TicketPrices.student);

        // Append the image to form data
        if (image) {
            formDataToSend.append('image', image);
        }

        try {
            const response = await axios.post('/governor/createHistoricalPlace', formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Handle success response
            setMessage('Historical place created successfully!');
            console.log(response.data);
        } catch (error) {
            // Handle error response
            setMessage('Error creating historical place.');
            console.error(error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, margin: 'auto', marginTop:'30px',marginBottom:'50px' ,padding: '20px', boxShadow: 3, borderRadius: '8px', backgroundColor: 'white',transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
            }, }}>

            <Typography variant="h5">Create Historical Place</Typography>
            {message && <Alert severity="info">{message}</Alert>}

            <TextField
                label="Name"
                fullWidth
                required
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                sx={{ mt: 2 }}
            />
            <TextField
                label="Description"
                fullWidth
                required
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                sx={{ mt: 2 }}
            />
            <TextField
                label="Location"
                fullWidth
                required
                name="Location"
                value={formData.Location}
                onChange={handleChange}
                sx={{ mt: 2 }}
            />
            <TextField
                label="Opening Hours"
                fullWidth
                name="OpeningHours"
                value={formData.OpeningHours}
                onChange={handleChange}
                sx={{ mt: 2 }}
            />
            <TextField
                label="Closing Hours"
                fullWidth
                name="ClosingHours"
                value={formData.ClosingHours}
                onChange={handleChange}
                sx={{ mt: 2 }}
            />
            <TextField
                label="Period"
                fullWidth
                name="Period"
                value={formData.Period}
                onChange={handleChange}
                sx={{ mt: 2 }}
            />
            <TextField
                label="Type"
                fullWidth
                name="Type"
                value={formData.Type}
                onChange={handleChange}
                sx={{ mt: 2 }}
            />
            <TextField
                label="Tags"
                fullWidth
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                sx={{ mt: 2 }}
            />
            <TextField
                label="Foreign Ticket Price"
                fullWidth
                name="foreigner"
                value={formData.TicketPrices.foreigner}
                onChange={handleTicketPriceChange}
                sx={{ mt: 2 }}
            />
            <TextField
                label="Native Ticket Price"
                fullWidth
                name="native"
                value={formData.TicketPrices.native}
                onChange={handleTicketPriceChange}
                sx={{ mt: 2 }}
            />
            <TextField
                label="Student Ticket Price"
                fullWidth
                name="student"
                value={formData.TicketPrices.student}
                onChange={handleTicketPriceChange}
                sx={{ mt: 2 }}
            />

            {/* Image Upload */}
            <Button
                variant="contained"
                component="label"
                sx={{ mt: 2, mr : 3 }}
            >
                Upload Image
                <input
                    type="file"
                    hidden
                    onChange={handleImageChange}
                />
            </Button>

            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
            >
                Create Historical Place
            </Button>
        </Box>
    );
};

export default CreateHistoricalPlace;
