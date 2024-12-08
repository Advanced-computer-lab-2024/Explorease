import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import {
    Box,
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    IconButton,
    Alert,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
// import UploadLogo from './UploadLogo';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


const MyActivities = () => {
    const [activities, setActivities] = useState([]);
    const [message, setMessage] = useState('');
    const [editingActivity, setEditingActivity] = useState(null);
    const [updatedFields, setUpdatedFields] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('');
    const [tag, setTag] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minRating, setMinRating] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [order, setOrder] = useState('asc');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // const { isLoaded } = useLoadScript({
    //     googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
    // });

    const fetchActivities = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await axios.get('/advertiser/getMyActivities', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (Array.isArray(response.data)) {
                setActivities(response.data);
            } else {
                setMessage('No activities found');
                setActivities([]);
            }
        } catch (error) {
            setMessage('Error fetching activities');
            setActivities([]);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const handleDelete = async (activityId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await axios.delete(`/advertiser/deleteActivity/${activityId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                setMessage('Activity deleted successfully');
                setActivities(activities.filter((activity) => activity._id !== activityId));
            } else {
                setMessage('Error deleting activity');
            }
        } catch (error) {
            setMessage('Error deleting activity');
        }
    };

    const handleUpdate = async (activityId) => {
        const token = localStorage.getItem('token');
        if (!token || !updatedFields[activityId]) return;

        try {
            const response = await axios.put(
                `/advertiser/updateActivity/${activityId}`,
                updatedFields[activityId],
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200) {
                setMessage('Activity updated successfully');
                setEditingActivity(null);
                setActivities(
                    activities.map((activity) =>
                        activity._id === activityId ? response.data.updatedActivity : activity
                    )
                );
            } else {
                setMessage('Error updating activity');
            }
        } catch (error) {
            setMessage('Error updating activity');
        }
    };

    const enableEdit = (activityId) => {
        setEditingActivity(activityId);
        setUpdatedFields({ ...updatedFields, [activityId]: {} });
    };

    const handleFieldChange = (activityId, field, value) => {
        setUpdatedFields({
            ...updatedFields,
            [activityId]: {
                ...updatedFields[activityId],
                [field]: value,
            },
        });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        await filterSortSearchActivities();
    };

    const filterSortSearchActivities = async () => {
        const token = localStorage.getItem('token');

        let queryString = '';

        if (searchQuery) queryString += `searchQuery=${searchQuery}&`;
        if (category) queryString += `category=${category}&`;
        if (tag) queryString += `tag=${tag}&`;
        if (minPrice) queryString += `minPrice=${minPrice}&`;
        if (maxPrice) queryString += `maxPrice=${maxPrice}&`;
        if (startDate) queryString += `startDate=${startDate}&`;
        if (endDate) queryString += `endDate=${endDate}&`;
        if (minRating) queryString += `minRating=${minRating}&`;
        if (sortBy) queryString += `sortBy=${sortBy}&order=${order}`;

        try {
            const response = await axios.get(`/advertiser/filter-sort-search?${queryString}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (Array.isArray(response.data)) {
                setActivities(response.data);
            } else {
                setMessage('No activities found');
                setActivities([]);
            }
        } catch (error) {
            setMessage('Error fetching activities');
            setActivities([]);
        }
    };

    return (<Box sx={{ padding: '20px' }}>
    <Typography variant="h4" align="center" gutterBottom sx={{color:'#111E56' , fontWeight:'bold'}}>
        My Activities
    </Typography>
    {message && <Alert severity="error">{message}</Alert>}

    {/* Search and Filter Form */}
    <Box
        component="form"
        onSubmit={handleSearch}
        sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'space-between',
            marginBottom: '20px',
        }}
    >
        <Box sx={{ marginTop: '10px' }}>
            <TextField
                label="Search by Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                sx={{ marginBottom: 2 }}
            />
            <TextField
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                fullWidth
                sx={{ marginBottom: 2 }}
            />
            <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ marginBottom: 2 }}
            />
        </Box>
        <Box sx={{ marginTop: '10px' }}>
            <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ marginBottom: 2 }}
            />
            <TextField
                label="Min Price"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                fullWidth
                sx={{ marginBottom: 2 }}
            />
            <TextField
                label="Max Price"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                fullWidth
                sx={{ marginBottom: 2 }}
            />
        </Box>
        <Box>
            <TextField
                label="Tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                fullWidth
                sx={{ width: '590px', marginBottom: 2, marginRight: '10px' }}
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                    backgroundColor: '#111E56',
                    position: 'absolute',
                    height: '56px',
                    '&:hover': {
                        backgroundColor: 'white',
                        color: '#111E56',
                        border: '1px solid #111E56',
                    },
                }}
            >
                Search & Filter
            </Button>
        </Box>
    </Box>

    {/* Activities Display */}
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {Array.isArray(activities) && activities.length > 0 ? (
            activities.map((activity) => (
                <Card
        key={activity._id}
        sx={{
            display: 'flex',
            width: '800px',
            maxWidth: '1200px', // Set a max-width for larger screens
            boxShadow: 3,
            
            borderRadius: 2,
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
            },
            height: '300px',
        }}

    >
                        {editingActivity === activity._id ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%'  }}>
                            <Box sx={{ flex: '1 1 auto', overflowY: 'auto', marginBottom: 5, marginTop:3 , marginLeft:3 }}>
                                <TextField
                                    label="Name"
                                    defaultValue={activity.name}
                                    onChange={(e) => handleFieldChange(activity._id, 'name', e.target.value)}
                                    fullWidth
                                    sx={{ marginBottom: 1 }}
                                />
                                <TextField
                                    label="Date"
                                    type="date"
                                    defaultValue={new Date(activity.date).toISOString().split('T')[0]}
                                    onChange={(e) => handleFieldChange(activity._id, 'date', e.target.value)}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ marginBottom: 1 }}
                                />
                                <TextField
                                    label="Location"
                                    defaultValue={activity.location}
                                    onChange={(e) => handleFieldChange(activity._id, 'location', e.target.value)}
                                    fullWidth
                                    sx={{ marginBottom: 1 }}
                                />
                                <TextField
                                    label="Price"
                                    type="number"
                                    defaultValue={activity.price}
                                    onChange={(e) => handleFieldChange(activity._id, 'price', e.target.value)}
                                    fullWidth
                                    sx={{ marginBottom: 1 }}
                                />
                                <TextField
                                    label="Duration (hours)"
                                    type="number"
                                    defaultValue={activity.duration || ''}
                                    onChange={(e) => handleFieldChange(activity._id, 'duration', e.target.value)}
                                    fullWidth
                                    sx={{ marginBottom: 1 }}
                                />
                                <Box sx={{ marginBottom: 1 }}>
                                    <Typography variant="body1" sx={{ marginBottom: 1 }}>
                                        Upload Activity Image:
                                    </Typography>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = () => {
                                                    handleFieldChange(activity._id, 'imageUrl', reader.result);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        style={{ marginBottom: '10px' }}
                                    />
                                    {updatedFields[activity._id]?.imageUrl && (
                                        <img
                                            src={updatedFields[activity._id]?.imageUrl}
                                            alt="Preview"
                                            style={{
                                                width: '100%',
                                                maxHeight: '60px',
                                                objectFit: 'cover',
                                                borderRadius: '4px',
                                            }}
                                        />
                                    )}
                                </Box>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                updatedFields[activity._id]?.bookingOpen ?? activity.bookingOpen
                                            }
                                            onChange={(e) =>
                                                handleFieldChange(activity._id, 'bookingOpen', e.target.checked)
                                            }
                                        />
                                    }
                                    label="Booking Open"
                                />
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    
                                    paddingTop: 1,
                                    borderTop: '1px solid #e0e0e0',
                                    marginBottom:3,
                                }}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleUpdate(activity._id)}
                                    sx={{
                                        backgroundColor: '#111E56',
                                        color: 'white',
                                        border: '2px solid #111E56',
                                        '&:hover': {
                                            backgroundColor: 'white',
                                            color: '#111E56',
                                            border: '2px solid #111E56',
                                        },
                                        marginLeft:'10px',
                                    }}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => setEditingActivity(null)}
                                    sx={{
                                        backgroundColor: '#f44336',
                                        color: 'white',
                                        border:'2px solid #f44336',

                                        '&:hover': {
                                            backgroundColor: 'white',
                                            color: '#f44336',
                                            border:'2px solid #f44336',
                                        },
                                        marginRight:'10px'
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                        ) : (
                            <>
                                {/* Left Section: Image */}
        <Box 
                sx={{ 
                    flex: '1 1 35%', 
                    marginRight: 2, 
                    display: 'flex', 
                    alignItems: 'stretch' ,
                    height:'100%',
                    
                }}
            >
            {activity.imageUrl && (
                <img
                    src={activity.imageUrl}
                    alt={activity.name}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderBottomLeftRadius:'8px',
                        borderTopLeftRadius:'8px',
                    }}
                />
            )}
        </Box>
    
        {/* Center Section: Details and Action Buttons */}
        <Box 
                sx={{ 
                    flex: '1 1 30%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between' 
                }}
            >
            <CardContent sx={{ padding: 0 }}>
                <Typography
                    variant="h5"
                    sx={{
                        color: '#111E56',
                        fontWeight: 'bold',
                        marginBottom: '10px',
                        marginTop: '10px',
                        textAlign: 'center',
                    }}
                >
                    {activity.name}
                </Typography>
                <Typography sx={{marginBottom: '5px',}}><strong style={{fontWeight:'bold' , color:'#111E56'}}>Date:</strong> {new Date(activity.date).toLocaleDateString()}</Typography>
                <Typography sx={{marginBottom: '5px',}}><strong style={{fontWeight:'bold' , color:'#111E56'}}>Time:</strong> {activity.time}</Typography>
                <Typography sx={{marginBottom: '5px',}}><strong style={{fontWeight:'bold' , color:'#111E56'}}>Price:</strong> {activity.price} </Typography>
                <Typography sx={{marginBottom: '5px',}}><strong style={{fontWeight:'bold' , color:'#111E56'}}>Category:</strong> {activity.category?.name}</Typography>
                {activity.tags && (
                    <Typography sx={{marginBottom: '5px',}}><strong style={{fontWeight:'bold' , color:'#111E56'}}>Tags:</strong> {activity.tags.map(tag => tag.name).join(', ')}</Typography>
                )}
                <Typography sx={{marginBottom: '5px',}}><strong style={{fontWeight:'bold' , color:'#111E56'}}>Special Discounts:</strong> {activity.specialDiscounts}</Typography>
            </CardContent>
    
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    padding: 1,
                    marginTop: 0,
                    marginBottom: 1,
                }}
            >
                                        <IconButton
                                            color="primary"
                                            onClick={() => enableEdit(activity._id)}
                                            sx={{
                                                backgroundColor: 'white',
                                                color: '#5A8CFF',
                                                border: '2px solid #5A8CFF',
                                                '&:hover': {
                                                    backgroundColor: '#5A8CFF',
                                                    color: 'white',
                                                    border: '2px solid #5A8CFF',
                                                },
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(activity._id)}
                                            sx={{
                                                backgroundColor: 'white',
                                                color: '#FF5A5A',
                                                border: '2px solid #FF5A5A',
                                                '&:hover': {
                                                    backgroundColor: '#FF5A5A',
                                                    color: 'white',
                                                    border: '2px solid #FF5A5A',
                                                },
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>

                                {/* Right Section: Map */}
         <Box 
                sx={{ 
                    flex: '1 1 35%', 
                    marginLeft: 2, 
                    display: 'flex', 
                    alignItems: 'stretch', 
                    overflow: 'hidden', 
                    objectFit: 'cover',
                    height: '100%',
                }}
            >
                <iframe
                    title={activity.location}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 ,borderBottomRightRadius:'8px',
                        borderTopRightRadius:'8px', height:'100%'}}
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDUP5fw3jw8bvJ7yj9OskV5wdm5sNUbII4&q=${encodeURIComponent(
                        activity.location
                    )}`}
                    allowFullScreen
                ></iframe>
        </Box>
                            </>
                        )}
                    
                </Card>
            ))
        ) : (
            <Typography>No activities to display</Typography>
        )}
    </Box>
</Box>
    );
};

export default MyActivities;
