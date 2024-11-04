import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Card, CardContent, Button, TextField, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const BookActivity = () => {
    const [activities, setActivities] = useState([]);
    const [message, setMessage] = useState('');
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
    const navigate = useNavigate();
    const [walletBalance, setWalletBalance] = useState(0);
    const [selectedActivity, setSelectedActivity] = useState(null);

    useEffect(() => {
        fetchActivities();
        fetchWalletBalance();
    }, []);

    const fetchActivities = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/activities', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActivities(response.data);
        } catch (error) {
            setMessage('Error fetching activities');
            console.error('Error fetching activities:', error);
        }
    };

    const fetchWalletBalance = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/myProfile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWalletBalance(response.data.wallet);
        } catch (error) {
            console.error('Error fetching wallet balance:', error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
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
            const token = localStorage.getItem('token');
            const response = await axios.get(`/tourists/activities/filter-sort-search?${queryString}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActivities(response.data);
        } catch (error) {
            console.error('Error fetching activities:', error);
            setMessage('Error fetching activities');
        }
    };

   
    const handleBookActivity = (activityId) => {
        navigate(`/pay-for-activity/${activityId}`);
    };
    return (
        <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>Book an Activity</Typography>
            <form onSubmit={handleSearch} style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                <TextField
                    label="Search by Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    variant="outlined"
                    sx={{ flex: '1 1 200px' }}
                />
                <TextField
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    variant="outlined"
                    sx={{ flex: '1 1 200px' }}
                />
                <TextField
                    label="Tag"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    variant="outlined"
                    sx={{ flex: '1 1 200px' }}
                />
                <TextField
                    label="Min Price"
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    variant="outlined"
                    sx={{ flex: '1 1 100px' }}
                />
                <TextField
                    label="Max Price"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    variant="outlined"
                    sx={{ flex: '1 1 100px' }}
                />
                <TextField
                    label="Min Rating"
                    type="number"
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    variant="outlined"
                    sx={{ flex: '1 1 100px' }}
                />
                <TextField
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ flex: '1 1 150px' }}
                />
                <TextField
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ flex: '1 1 150px' }}
                />
                <FormControl sx={{ flex: '1 1 150px' }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        label="Sort By"
                    >
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value="price">Price</MenuItem>
                        <MenuItem value="ratings">Rating</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ flex: '1 1 150px' }}>
                    <InputLabel>Order</InputLabel>
                    <Select
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        label="Order"
                    >
                        <MenuItem value="asc">Ascending</MenuItem>
                        <MenuItem value="desc">Descending</MenuItem>
                    </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="primary" sx={{ 
                            backgroundColor: '#111E56', 
                            color: 'white', 
                            '&:hover': { 
                                backgroundColor: 'white', 
                                color: '#111E56',
                                border: '1px solid #111E56' // Optional: adds a border to match the dark blue on hover
                            }, 
                            mx: 1, 
                            px: 4 
                        }}>
                    Search & Filter
                </Button>
            </form>

            {message && <Typography color="error">{message}</Typography>}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                {activities.length > 0 ? activities.map((activity) => (
                    <Card key={activity._id} sx={{ width: '300px', boxShadow: 3, padding: 2, textAlign: 'center' }}>
                        <CardContent>
                            <Typography variant="h6">{activity.name}</Typography>
                            <Typography><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</Typography>
                            <Typography><strong>Time:</strong> {activity.time}</Typography>
                            <Typography><strong>Location:</strong> {activity.location}</Typography>
                            <Typography><strong>Price:</strong> ${activity.price}</Typography>
                            <Typography><strong>Category:</strong> {activity.category?.name}</Typography>
                            {activity.tags && (
                                <Typography><strong>Tags:</strong> {activity.tags.map(tag => tag.name).join(', ')}</Typography>
                            )}
                            <Typography><strong>Special Discounts:</strong> {activity.specialDiscounts}</Typography>
                        </CardContent>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleBookActivity(activity._id)}
                            sx={{ 
                                backgroundColor: '#111E56', 
                                color: 'white', 
                                '&:hover': { 
                                    backgroundColor: 'white', 
                                    color: '#111E56',
                                    border: '1px solid #111E56' // Optional: adds a border to match the dark blue on hover
                                }, 
                                mx: 1, 
                                px: 4 
                            }}
                        >
                            Book Now
                        </Button>
                    </Card>
                )) : (
                    <Typography>No activities available</Typography>
                )}
            </Box>
        </Box>
    );
};

export default BookActivity;
