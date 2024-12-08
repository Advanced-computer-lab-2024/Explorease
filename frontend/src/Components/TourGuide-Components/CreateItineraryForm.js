import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Checkbox,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
} from '@mui/material';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';


const CreateItineraryForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        activities: [], // Store selected activity IDs
        timeline: [], // Array of start/end times
        LanguageOfTour: [], // Array of languages
        AvailableDates: [], // Array of dates
        AvailableTimes: [], // Array of times
        accessibility: '',
        PickUpLocation: '',
        DropOffLocation: '',
        tags: [], // Add tags field
    });

    const [selectedImage, setSelectedImage] = useState(null); // State to store the uploaded image
    const [singleTime, setSingleTime] = useState(''); // Single input for AvailableTimes
    const [singleDate, setSingleDate] = useState(''); // Single input for AvailableDates
    // const [singleLanguage, setSingleLanguage] = useState('');
    const [availableActivities, setAvailableActivities] = useState([]); // List of available activities
    const [availableTags, setAvailableTags] = useState([]); // List of available tags
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [singleTimeline, setSingleTimeline] = useState(''); // New state for single timeline input

    const languages = ['English', 'Spanish', 'French', 'German', 'Chinese'];

    // Fetch available activities and tags
    useEffect(() => {
        const fetchData = async () => {
            try {
                const activityResponse = await axios.get('/tourguide/allActivities');
                const tagResponse = await axios.get('/tourguide/allTags'); // Adjust to your API endpoint for tags
                setAvailableActivities(activityResponse.data || []);
                setAvailableTags(tagResponse.data || []);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load activities or tags. Please try again.');
            }
        };

        fetchData();
    }, []);

   
    const handleAddTimeline = () => {
        if (!singleTimeline.includes('/')) {
            setError('Please enter a valid timeline in the format "HH:mm/HH:mm".');
            return;
        }

        const [startTime, endTime] = singleTimeline.split('/');
        if (!startTime || !endTime) {
            setError('Both start and end times must be provided in the format "HH:mm/HH:mm".');
            return;
        }

        setFormData((prevData) => ({
            ...prevData,
            timeline: [...prevData.timeline, singleTimeline],
        }));
        setSingleTimeline(''); // Clear the input
        setError(''); // Clear any previous error
    };

    const handleRemoveTimeline = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            timeline: prevData.timeline.filter((_, i) => i !== index),
        }));
    };

    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleMultiChange = (name) => (event) => {
        const {
            target: { value },
        } = event;
        setFormData((prevData) => ({
            ...prevData,
            [name]: typeof value === 'string' ? value.split(',') : value, // Handle multiple selections
        }));
    };

    const handleAddToArray = (field, value) => {
        if (!value) return; // Prevent adding empty values
        setFormData((prevData) => ({
            ...prevData,
            [field]: [...prevData[field], value],
        }));
    };

    const handleRemoveFromArray = (field, index) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: prevData[field].filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const token = localStorage.getItem('token');
        if (!token) {
            setError('You need to log in to create an itinerary.');
            return;
        }

        const formDataWithImage = new FormData();
        formDataWithImage.append('image', selectedImage); // This field must match 'image' in upload.single('image')
        Object.keys(formData).forEach((key) => {
            if (Array.isArray(formData[key])) {
                formData[key].forEach((item) => formDataWithImage.append(key, item));
            } else {
                formDataWithImage.append(key, formData[key]);
            }
        });
        
        console.log([...formDataWithImage.entries()]);


        try {
            await axios.post('/tourguide/createItinerary', formDataWithImage, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Required for file uploads
                    Authorization: `Bearer ${token}`,      // Include your token for authentication
                },
            });
            
            setMessage('Itinerary created successfully!');
            setFormData({
                name: '',
                activities: [],
                timeline: [],
                LanguageOfTour: [],
                AvailableDates: [],
                AvailableTimes: [],
                accessibility: '',
                PickUpLocation: '',
                DropOffLocation: '',
                tags: [],
            });
            setSelectedImage(null); // Reset the image input
        } catch (err) {
            console.error('Error creating itinerary:', err);
            setError('Failed to create itinerary. Please try again.');
        }
    };

    return (
        <Box
            sx={{
                maxWidth: '600px',
                margin: '0 auto',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'white',
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 'bold',
                    color: '#111E56',
                    marginBottom: '20px',
                    textAlign: 'center',
                }}
            >
                Create Itinerary
            </Typography>
            {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
                <TextField
                    label="Itinerary Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
                 

                <FormControl fullWidth margin="normal">
                    <InputLabel shrink>Activities</InputLabel>
                    <Select
                        multiple
                        name="activities"
                        value={formData.activities}
                        onChange={handleMultiChange('activities')}
                        renderValue={(selected) =>
                            selected
                                .map((id) => {
                                    const activity = availableActivities.find((a) => a._id === id);
                                    return activity ? activity.name : '';
                                })
                                .join(', ')
                        }
                        variant="outlined"
                    >
                        {availableActivities.map((activity) => (
                            <MenuItem key={activity._id} value={activity._id}>
                                <Checkbox checked={formData.activities.indexOf(activity._id) > -1} />
                                <ListItemText primary={activity.name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
    <InputLabel shrink>Language of Tour</InputLabel>
    <Select
        multiple
        name="LanguageOfTour"
        value={formData.LanguageOfTour}
        onChange={handleMultiChange('LanguageOfTour')}
        renderValue={(selected) => selected.join(', ')} // Display selected languages
        variant="outlined"
    >
        {languages.map((lang, index) => (
            <MenuItem key={index} value={lang}>
                <Checkbox checked={formData.LanguageOfTour.indexOf(lang) > -1} />
                <ListItemText primary={lang} />
            </MenuItem>
        ))}
    </Select>
</FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel shrink>Tags</InputLabel>
                    <Select
                        multiple
                        name="tags"
                        value={formData.tags}
                        onChange={handleMultiChange('tags')}
                        renderValue={(selected) =>
                            selected
                                .map((id) => {
                                    const tag = availableTags.find((t) => t._id === id);
                                    return tag ? tag.name : '';
                                })
                                .join(', ')
                        }
                        variant="outlined"
                    >
                        {availableTags.map((tag) => (
                            <MenuItem key={tag._id} value={tag._id}>
                                <Checkbox checked={formData.tags.indexOf(tag._id) > -1} />
                                <ListItemText primary={tag.name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                    {/* Timeline Input */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6">Timeline</Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <TextField
                            label="Add Timeline (e.g., 11:20/12:20)"
                            value={singleTimeline}
                            onChange={(e) => setSingleTimeline(e.target.value)}
                            fullWidth
                            variant="outlined"
                        />
                        <IconButton
                            onClick={handleAddTimeline}
                            color="primary"
                        >
                            <AddCircleOutlineIcon />
                        </IconButton>
                    </Box>
                    <List>
                        {formData.timeline.map((time, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={time} />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        onClick={() => handleRemoveTimeline(index)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </Box>
{/* Available Times */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6">Available Times</Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <TextField
                            label="Add Time"
                            type="time"
                            value={singleTime}
                            onChange={(e) => setSingleTime(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                        />
                        <IconButton
                            onClick={() => {
                                handleAddToArray('AvailableTimes', singleTime);
                                setSingleTime(''); // Clear input
                            }}
                            color="primary"
                        >
                            <AddCircleOutlineIcon />
                        </IconButton>
                    </Box>
                    <List>
                        {formData.AvailableTimes.map((time, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={time} />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        onClick={() => handleRemoveFromArray('AvailableTimes', index)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </Box>

                {/* Available Dates */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6">Available Dates</Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <TextField
                            label="Add Date"
                            type="date"
                            value={singleDate}
                            onChange={(e) => setSingleDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                        />
                        <IconButton
                            onClick={() => {
                                handleAddToArray('AvailableDates', singleDate);
                                setSingleDate(''); // Clear input
                            }}
                            color="primary"
                        >
                            <AddCircleOutlineIcon />
                        </IconButton>
                    </Box>
                    <List>
                        {formData.AvailableDates.map((date, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={date} />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        onClick={() => handleRemoveFromArray('AvailableDates', index)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <TextField
                    label="Accessibility Information"
                    name="accessibility"
                    value={formData.accessibility}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    label="Pickup Location"
                    name="PickUpLocation"
                    value={formData.PickUpLocation}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    label="Dropoff Location"
                    name="DropOffLocation"
                    value={formData.DropOffLocation}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
                 {/* Add Image Upload Field */}
                 <Box sx={{ mb: 3 }}>
                    <Typography variant="h6">Upload Image</Typography>
                    <Button
                        variant="contained"
                        component="label"
                        sx={{
                            backgroundColor: '#111E56',
                            color: 'white',
                            mt: 1,
                            '&:hover': {
                                backgroundColor: 'white',
                                color: '#111E56',
                                border: '2px solid #111E56',
                            },
                        }}
                    >
                        Choose File
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => setSelectedImage(e.target.files[0])}
                        />
                    </Button>
                    {selectedImage && (
                        <Typography sx={{ mt: 1 }}>{selectedImage.name}</Typography>
                    )}
                </Box>
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                        backgroundColor: '#111E56',
                        color: 'white',
                        border: '2px solid #111E56',
                        marginTop: '20px',
                        '&:hover': {
                            backgroundColor: 'white',
                            color: '#111E56',
                            border: '2px solid #111E56',
                        },
                    }}
                >
                    Submit
                </Button>
            </form>
        </Box>
    );
};

export default CreateItineraryForm;
