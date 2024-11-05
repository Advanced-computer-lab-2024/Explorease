// src/utils/amadeusAPI.js
const axios = require('axios');

// Function to get access token
async function getAccessToken() {
    try {
        const response = await axios.post(
            'https://test.api.amadeus.com/v1/security/oauth2/token',
            new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: process.env.AMADEUS_API_KEY,
                client_secret: process.env.AMADEUS_API_SECRET,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Error obtaining access token:', error);
        return null;
    }
}

// Function to get IATA code for a city
async function getIATACode(city) {
    const accessToken = await getAccessToken();
    if (!accessToken) return null;

    try {
        const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                keyword: city,
                subType: 'CITY',
            },
        });

        return response.data.data[0]?.iataCode || null;
    } catch (error) {
        console.error('Error fetching IATA code:', error);
        return null;
    }
}


module.exports = { getAccessToken, getIATACode};
