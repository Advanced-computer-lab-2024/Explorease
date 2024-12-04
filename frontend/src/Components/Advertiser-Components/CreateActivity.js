import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import {
    Box,
    TextField,
    Button,
    Typography,
    Checkbox,
    FormControl,
    FormLabel,
    Select,
    MenuItem,
    InputLabel,
    Alert,
    CircularProgress,
} from '@mui/material';

const mapContainerStyle = {
    width: "100%",
    height: "400px",
};

const center = {
    lat: 31.205753, // Default latitude (e.g., Cairo, Egypt)
    lng: 29.924526, // Default longitude
};

const CreateActivity = () => {
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        time: '',
        location: '',
        latitude: 0,
        longitude: 0,
        price: '',
        category: '',
        tags: [],
        specialDiscounts: '',
        bookingOpen: false,
        duration: ''
    });

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyDUP5fw3jw8bvJ7yj9OskV5wdm5sNUbII4", // Replace with your API key
    });

    const handleMapClick = (event) => {
        setFormData({
            ...formData,
            latitude: event.latLng.lat(),
            longitude: event.latLng.lng(),
            location: `${event.latLng.lat()}, ${event.latLng.lng()}`, // Save location as a string
        });
    };

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchCategoriesAndTags = async () => {
            const token = localStorage.getItem('token');
            try {
                const categoriesResponse = await axios.get('/admins/getCategories', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCategories(categoriesResponse.data || []);
                const tagsResponse = await axios.get('/admins/getTags', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTags(tagsResponse.data || []);
            } catch (error) {
                setMessage('Error fetching categories or tags');
            }
        };
        fetchCategoriesAndTags();
    }, []);

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTagChange = (e) => {
        setFormData({ ...formData, tags: e.target.value });
    };

    const handleCheckboxChange = (e) => {
        setFormData({ ...formData, bookingOpen: e.target.checked });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!formData.latitude || !formData.longitude) {
            setMessage('Please select a location on the map.');
            return;
        }
        console.log(formData);
        try {
            const response = await axios.post('/advertiser/createActivity', formData, {
                headers: {  'Content-Type': 'multipart/form-data', 
                    Authorization: `Bearer ${token}` },
            });
            if (response.status === 201) {
                setMessage('Activity created successfully');
                setFormData({
                    name: '',
                    date: '',
                    time: '',
                    location: '',
                    latitude: 0,
                    longitude: 0,
                    price: '',
                    category: '',
                    tags: [],
                    specialDiscounts: '',
                    bookingOpen: false,
                    duration: ''
                });
            } else {
                setMessage('Error creating activity');
            }
        } catch (error) {
            setMessage('Error creating activity');
        }
    };

    return (
        <Box
    sx={{
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        marginTop: '30px',
        marginBottom: '30px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
            transform: 'scale(1.03)', // Adds a scaling effect
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)', // Enhances the shadow on hover
        },
    }}
>

            <Typography variant="h4" align="center" sx={{ marginTop:'5px', marginBottom: '20px', fontWeight: 'bold' , color:'#111E56' }}>
                Create Activity
            </Typography>
            {message && <Alert severity={message.includes('Error') ? 'error' : 'success'}>{message}</Alert>}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    fullWidth
                    sx={{ marginBottom: '20px' }}
                />
                <TextField
                    label="Date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{ marginBottom: '20px' }}
                />
                <TextField
                    label="Time"
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{ marginBottom: '20px' }}
                />
                <Box sx={{ marginBottom: '20px' }}>
                    <FormLabel>Select Location on Map</FormLabel>
                    {isLoaded ? (
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            zoom={10}
                            center={center}
                            onClick={handleMapClick}
                        >
                            {formData.latitude && formData.longitude && (
                                <Marker position={{ lat: formData.latitude, lng: formData.longitude }} />
                            )}
                        </GoogleMap>
                    ) : (
                        <CircularProgress />
                    )}
                </Box>
                <TextField
                    label="Price"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    fullWidth
                    sx={{ marginBottom: '20px' }}
                />
                <FormControl fullWidth sx={{ marginBottom: '20px' }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <MenuItem value="">Select a Category</MenuItem>
                        {categories.map((category) => (
                            <MenuItem key={category._id} value={category.name}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ marginBottom: '20px' }}>
                    <InputLabel>Tags</InputLabel>
                    <Select
                        name="tags"
                        value={formData.tags}
                        onChange={handleTagChange}
                        multiple
                    >
                        {tags.map((tag) => (
                            <MenuItem key={tag._id} value={tag.name}>
                                {tag.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Special Discounts"
                    name="specialDiscounts"
                    value={formData.specialDiscounts}
                    onChange={handleChange}
                    fullWidth
                    sx={{ marginBottom: '20px' }}
                />
                <TextField
                    label="Duration (hours)"
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    fullWidth
                    sx={{ marginBottom: '10px' }}
                />
                <FormControl fullWidth sx={{ marginBottom: '20px' }}>
    <FormLabel>Booking Open</FormLabel>
    <Checkbox
        name="bookingOpen"
        checked={formData.bookingOpen}
        onChange={handleCheckboxChange}
        sx={{ color: '#111E56',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
                transform: 'scale(1.03)', // Adds a scaling effect
                backgroundColor:'white'// Enhances the shadow on hover
            }, }}
    />
   
    {/* Add Image Upload */}
    <Box sx={{ marginBottom: '20px' }}>
        <Typography>Upload Image:</Typography>
        <input type="file" name="image" accept="image/*" onChange={handleFileChange} />
    </Box>
   
</FormControl>

                <Button type="submit" variant="contained" color="primary" fullWidth sx={{backgroundColor: '#111E56', 
                            color: 'white', 
                            '&:hover': { 
                                backgroundColor: 'white', 
                                color: '#111E56',
                                border: '1px solid #111E56' // Optional: adds a border to match the dark blue on hover
                            },}}>
                    Create Activity
                </Button>
            </form>
        </Box>
    );
};

export default CreateActivity;
