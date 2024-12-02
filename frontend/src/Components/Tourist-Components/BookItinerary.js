import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Button, TextField, Typography, MenuItem, Select, InputLabel, FormControl, Alert } from '@mui/material';

const BookItinerariesPage = () => {
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
    const [walletBalance, setWalletBalance] = useState(0);
    const [activeComponent, setActiveComponent] = useState('BookItinerary');
    const [selectedItinerary, setSelectedItinerary] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [exchangeRates, setExchangeRates] = useState({});
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [promoCode, setPromoCode] = useState('');
    const [promoMessage, setPromoMessage] = useState('');
    const [discount, setDiscount] = useState(0); // Store discount value
    const [finalAmount, setFinalAmount] = useState(0); // Store final amount after discount

    const YOUR_API_KEY = "1b5f2effe7b482f6a6ba499d";

    useEffect(() => {
        fetchItineraries();
        fetchWalletBalance();
        fetchExchangeRates();
    }, []);

    const handleApplyPromo = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                '/tourists/promocode',
                { promoCode, cartTotal: selectedItinerary.totalPrice },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { discount } = response.data;
            setDiscount(discount);
            setFinalAmount(selectedItinerary.totalPrice - discount);
            setPromoMessage(`Promo code applied successfully! You saved $${discount.toFixed(2)}`);
        } catch (error) {
            console.error('Error applying promo code:', error);
            setPromoMessage(error.response?.data?.message || 'Failed to apply promo code.');
        }
    };

    const convertToUSD = (price) => {
        return (price / (exchangeRates[selectedCurrency] || 1)).toFixed(2);
    };

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

    const fetchWalletBalance = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/myProfile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const wallet = response.data.wallet;
            
            if (!isNaN(wallet)) { 
                setWalletBalance(wallet);
            } else {
                setWalletBalance(0);
            }
        } catch (error) {
            console.error('Error fetching wallet balance:', error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        let queryString = '';
        if (searchQuery) queryString += `searchQuery=${searchQuery}&`;
        if (minPrice) queryString += `minPrice=${convertToUSD(minPrice)}&`;  
        if (maxPrice) queryString += `maxPrice=${convertToUSD(maxPrice)}&`;  
        if (startDate) queryString += `startDate=${startDate}&`;
        if (endDate) queryString += `endDate=${endDate}&`;
        if (minRating) queryString += `minRating=${minRating}&`;
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

    const fetchExchangeRates = async () => {
        try {
            const response = await axios.get(`https://v6.exchangerate-api.com/v6/${YOUR_API_KEY}/latest/USD`);
            setExchangeRates(response.data.conversion_rates);
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
        }
    };

    const handleCurrencyChange = (e) => {
        setSelectedCurrency(e.target.value);
    };

    const convertPrice = (price) => {
        return (price * (exchangeRates[selectedCurrency] || 1)).toFixed(2);
    };

    const handleBookItinerary = (itinerary) => {
        if (walletBalance === null || isNaN(walletBalance)) {
            setErrorMessage('Error: Wallet balance is not available.');
            return;
        }
        
        setSelectedItinerary(itinerary);
        setActiveComponent('PayForItinerary');
    };

    const handleItineraryPayment = async (paymentMethod) => {
        try {
            const token = localStorage.getItem('token');
            const amountPaid = finalAmount || selectedItinerary.totalPrice; // Use discounted amount if applicable

            if (paymentMethod === 'wallet') {
                // Wallet Payment
                const response = await axios.post(
                    `/tourists/itineraries/book/${selectedItinerary._id}`,
                    { amountPaid, promoCode },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSuccessMessage('Payment successful! Itinerary booked.');
                setWalletBalance(response.data.walletBalance);
            } else if (paymentMethod === 'stripe') {
                // Stripe Payment
                const response = await axios.post(
                    `/tourists/itineraries/stripe-session`,
                    { itineraryId: selectedItinerary._id, amountPaid, promoCode },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.data.url) {
                    window.location.href = response.data.url; // Redirect to Stripe checkout
                } else {
                    setErrorMessage('Failed to create Stripe session.');
                }
            }

            setTimeout(() => {
                setActiveComponent('BookItinerary');
                setSelectedItinerary(null);
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error('Payment error:', error);
            setErrorMessage(error.response?.data?.message || 'Payment failed');
        }
    };
    
    
    if (activeComponent === 'PayForItinerary' && selectedItinerary) {
        return (
            <Box sx={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
                <Typography variant="h4" gutterBottom>Pay for Itinerary</Typography>

                {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
                {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
                {promoMessage && <Alert severity={promoMessage.includes('success') ? 'success' : 'error'} sx={{ mb: 2 }}>{promoMessage}</Alert>}

                <Typography variant="h6" gutterBottom>Itinerary Details</Typography>
                <Typography><strong>Itinerary:</strong> {selectedItinerary.name}</Typography>
                <Typography><strong>Total Price:</strong> ${selectedItinerary.totalPrice}</Typography>
                <Typography><strong>Discount:</strong> ${discount.toFixed(2)}</Typography>
                <Typography><strong>Final Price:</strong> ${finalAmount.toFixed(2)}</Typography>
                <Typography><strong>Wallet Balance:</strong> ${walletBalance}</Typography>

                <TextField
                    label="Promo Code"
                    variant="outlined"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    sx={{ mt: 2, width: '100%' }}
                />
                <Button
                    variant="contained"
                    onClick={handleApplyPromo}
                    sx={{
                        mt: 2,
                        backgroundColor: '#111E56',
                        color: 'white',
                        border: '2px solid #111E56',
                        '&:hover': {
                            backgroundColor: 'white',
                            color: '#111E56',
                            border: '2px solid #111E56',
                        },
                    }}
                >
                    Apply Promo
                </Button>

                <Typography variant="h6" sx={{ mt: 3 }}>Select Payment Method</Typography>
                {walletBalance >= finalAmount ? (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleItineraryPayment('wallet')}
                        sx={{
                            mt: 2,
                            mr: 2,
                            backgroundColor: '#111E56',
                            color: 'white',
                            border: '2px solid #111E56',
                            '&:hover': {
                                backgroundColor: 'white',
                                color: '#111E56',
                                border: '2px solid #111E56',
                            },
                        }}
                    >
                        Pay with Wallet
                    </Button>
                ) : (
                    <Typography color="error" sx={{ mt: 2 }}>Insufficient funds in wallet. Please choose another payment method.</Typography>
                )}
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleItineraryPayment('stripe')}
                    sx={{
                        mt: 2,
                        backgroundColor: '#FF5733',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'white',
                            color: '#FF5733',
                            border: '1px solid #FF5733',
                        },
                    }}
                >
                    Pay with Stripe
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setActiveComponent('BookItinerary')}
                    sx={{
                        mt: 2,
                        ml: 2,
                        backgroundColor: '#111E56',
                        color: 'white',
                        border: '2px solid #111E56',
                        '&:hover': {
                            backgroundColor: 'white',
                            color: '#111E56',
                            border: '2px solid #111E56',
                        },
                    }}
                >
                    Back to Itineraries
                </Button>
            </Box>
        
        );
    }

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

                <FormControl sx={{ marginBottom: 3, minWidth: 120 }}>
                <InputLabel>Currency</InputLabel>
                <Select value={selectedCurrency} onChange={handleCurrencyChange}>
                    {Object.keys(exchangeRates).map((currency) => (
                        <MenuItem key={currency} value={currency}>
                            {currency}
                        </MenuItem>
                    ))}
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
                            <Typography><strong>Total Price:</strong> {convertPrice(itinerary.totalPrice)} {selectedCurrency}</Typography>
                            <Typography><strong>Languages:</strong> {itinerary.LanguageOfTour.join(', ')}</Typography>
                            <Typography><strong>Date :</strong> {itinerary.AvailableDates[0]}</Typography>

                            {/* Add other itinerary details here */}
                        </CardContent>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleBookItinerary(itinerary)}
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

export default BookItinerariesPage;
