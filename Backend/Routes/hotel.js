const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_TOKEN = 'dbff005947c84451a8e8f71e5254d8b3';
const PARTNER_ID = '585688';

// Endpoint to fetch hotels by city name, check-in, and check-out dates
router.get('/search', async (req, res) => {
    const { location, checkIn, checkOut, currency = 'USD' } = req.query;

    if (!location || !checkIn || !checkOut) {
        return res.status(400).json({ error: 'Location, check-in, and check-out dates are required.' });
    }

    try {
        // Fetch hotel data based on location and dates
        const response = await axios.get('https://engine.hotellook.com/api/v2/cache.json', {
            params: {
                location,
                checkIn,
                checkOut,
                currency,
                limit: 10, // Number of hotels to retrieve (adjust as needed)
                token: API_TOKEN
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching hotels:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error fetching hotels data.' });
    }
});

module.exports = router;
