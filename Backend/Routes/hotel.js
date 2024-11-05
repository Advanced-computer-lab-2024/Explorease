// Import necessary modules
const express = require('express');
const axios = require('axios');
const { getAccessToken } = require('../utils/amadeusAPI');
const router = express.Router();

router.get('/search', async (req, res) => {
    const { checkInDate, checkOutDate, adults } = req.query;

    if (!checkInDate || !checkOutDate || !adults) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
            return res.status(500).json({ error: 'Failed to authenticate with Amadeus API' });
        }

        // Pass hotelIds as a string
        const response = await axios.get('https://test.api.amadeus.com/v3/shopping/hotel-offers', {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
                hotelIds: 'MCLONGHM', // Pass as string, not array
                checkInDate,
                checkOutDate,
                adults: parseInt(adults, 10),
            },
        });
        console.log('Amadeus API response:', response.data);
        res.json(response.data.data); // Ensure the data key exists in the response
    } catch (error) {
        console.error('Error in /api/hotels/search route:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error fetching hotel offers' });
    }
});

module.exports = router;
