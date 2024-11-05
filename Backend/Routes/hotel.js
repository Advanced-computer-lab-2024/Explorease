// Import necessary modules
const express = require('express');
const axios = require('axios');
const { getAccessToken } = require('../utils/amadeusAPI');
const router = express.Router();

router.get('/search', async (req, res) => {
    const { cityName, radius = 5, radiusUnit = 'KM' } = req.query;

    if (!cityName) {
        return res.status(400).json({ error: 'City name is required' });
    }

    try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
            return res.status(500).json({ error: 'Failed to authenticate with Amadeus API' });
        }

        // First, get the IATA code for the city
        const iataResponse = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations', {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { keyword: cityName, subType: 'CITY' },
        });

        const cityCode = iataResponse.data.data[0]?.iataCode;
        if (!cityCode) {
            return res.status(404).json({ error: 'City not found' });
        }

        // Use the cityCode to search for hotels
        const hotelResponse = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city', {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { cityCode, radius, radiusUnit },
        });

        res.json(hotelResponse.data.data || []);
    } catch (error) {
        console.error('Error in /api/hotels/search route:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error fetching hotels' });
    }
});

module.exports = router;
