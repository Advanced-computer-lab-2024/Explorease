import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Card, CardContent, Button, TextField, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const BookItineraries = () => {
    const [itineraries, setItineraries] = useState([]);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minRating, setMinRating] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [order, setOrder] = useState('asc');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [language, setLanguage] = useState('');
    const [accessibility, setAccessibility] = useState('');
    const [tag, setTag] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchItineraries();
    }, []);

    const fetchItineraries = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/itineraries', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItineraries(response.data);
        } catch (error) {
            setMessage('Error fetching itineraries');
            console.error('Error fetching itineraries:', error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        let queryString = '';
        if (searchQuery) queryString += `searchQuery=${searchQuery}&`;
        if (minPrice) queryString += `minPrice=${minPrice}&`;
        if (maxPrice) queryString += `maxPrice=${maxPrice}&`;
        if (startDate) queryString += `startDate=${startDate}&`;
        if (endDate) queryString += `endDate=${endDate}&`;
        if (minRating) queryString += `minRating=${minRating}&`;
        if (language) queryString += `language=${language}&`;
        if (accessibility) queryString += `accessibility=${accessibility}&`;
        if (tag) queryString += `tags=${tag}&`;
        if (sortBy) queryString += `sortBy=${sortBy}&order=${order}`;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/tourists/itineraries/filter-sort-search?${queryString}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItineraries(response.data);
        } catch (error) {
            console.error('Error fetching itineraries:', error);
            setMessage('Error fetching itineraries');
        }
    };

    const handleBookItinerary = (itineraryId) => {
        navigate(`/payment/itinerary/${itineraryId}`);
    };

    return (
        <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>Book an Itinerary</Typography>
            <form onSubmit={handleSearch} style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                <TextField
                    label="Search by Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                    label="Language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    variant="outlined"
                    sx={{ flex: '1 1 150px' }}
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
                <Button type="submit" variant="contained" color="primary" sx={{ height: '56px', alignSelf: 'center' }}>
                    Search & Filter
                </Button>
            </form>

            {message && <Typography color="error">{message}</Typography>}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                {itineraries.length > 0 ? itineraries.map((itinerary) => (
                    <Card key={itinerary._id} sx={{ width: '300px', boxShadow: 3, padding: 2, textAlign: 'center' }}>
                        <CardContent>
                            <Typography variant="h6">{itinerary.name}</Typography>
                            <Typography><strong>Total Price:</strong> ${itinerary.totalPrice}</Typography>
                            <Typography><strong>Languages:</strong> {itinerary.LanguageOfTour.join(', ')}</Typography>
                            <Typography><strong>Pick-Up Location:</strong> {itinerary.PickUpLocation}</Typography>
                            <Typography><strong>Drop-Off Location:</strong> {itinerary.DropOffLocation}</Typography>
                            <Typography><strong>Accessibility:</strong> {itinerary.accessibility}</Typography>
                            {itinerary.tags && (
                                <Typography><strong>Tags:</strong> {itinerary.tags.map(tag => tag.name).join(', ')}</Typography>
                            )}
                            <Typography><strong>Available Dates:</strong> {itinerary.AvailableDates.map(date => new Date(date).toLocaleDateString()).join(', ')}</Typography>
                        </CardContent>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleBookItinerary(itinerary._id)}
                            sx={{ marginTop: 2 }}
                        >
                            Book Now
                        </Button>
                    </Card>
                )) : (
                    <Typography>No itineraries available</Typography>
                )}
            </Box>
        </Box>
    );
};

export default BookItineraries;
