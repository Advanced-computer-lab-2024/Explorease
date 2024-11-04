// backend/routes/hotels.js
const express = require('express');
const router = express.Router();
const { getAccessToken } = require('../utils/amadeusAPI'); // Assuming you already have this function set up in amadeusAPI.js
const axios = require('axios');

// Route to search for hotel offers
router.get('/search', async (req, res) => {
    const { cityCode, checkInDate, checkOutDate, currency = 'USD' } = req.query;

    try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
            return res.status(500).json({ error: 'Failed to authenticate with Amadeus API' });
        }

        const response = await axios.get('https://test.api.amadeus.com/v3/shopping/hotel-offers', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                cityCode,
                checkInDate,
                checkOutDate,
                currency,
                adults: 1,
            },
        });

        console.log('Amadeus API Response:', response.data); // Log the response data

        res.json(response.data.data);
    } catch (error) {
        console.error('Error fetching hotel offers:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error fetching hotel offers' });
    }
});

module.exports = router;
