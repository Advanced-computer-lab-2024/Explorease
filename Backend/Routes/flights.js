// backend/routes/flights.js
const express = require('express');
const router = express.Router();
const { getAccessToken, getIATACode } = require('../utils/amadeusAPI');
const axios = require('axios');

// Route to get IATA code for a city
router.get('/iata-code', async (req, res) => {
    const { city } = req.query;

    try {
        const iataCode = await getIATACode(city);
        if (!iataCode) {
            return res.status(404).json({ error: 'IATA code not found for the specified city' });
        }
        res.json({ iataCode });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching IATA code' });
    }
});

// Route to search for flights
router.get('/search', async (req, res) => {
    const { origin, destination, departureDate, currency = 'USD' } = req.query;

    try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
            return res.status(500).json({ error: 'Failed to authenticate with Amadeus API' });
        }

        const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                originLocationCode: origin,
                destinationLocationCode: destination,
                departureDate,
                currencyCode: currency,
                adults: 1,
            },
        });

        res.json(response.data.data);
    } catch (error) {
        console.error('Error fetching flights:', error);
        res.status(500).json({ error: 'Error fetching flights' });
    }
});

module.exports = router;
