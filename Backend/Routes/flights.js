const express = require('express');
const axios = require('axios');
const { getAccessToken } = require('../utils/amadeusAPI');

const router = express.Router();

router.get('/search', async (req, res) => {
    const { origin, destination, departureDate } = req.query;
    try {
        const accessToken = await getAccessToken();
        console.log('Access Token:', accessToken); // Log to verify token

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
                adults: 1,
            },
        });

        res.json(response.data.data);
    } catch (error) {
        console.error('Error fetching flights:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error fetching flights' });
    }
});


module.exports = router;
