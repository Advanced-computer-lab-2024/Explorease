import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HistoricalPlaces = () => {
    const [historicalPlaces, setHistoricalPlaces] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchHistoricalPlaces = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/historical-places', {
                    headers: {
                        Authorization: `Bearer ${token}`  // Send the JWT token if logged in
                    }
                });
                setHistoricalPlaces(response.data);
            } catch (error) {
                setMessage('Error fetching historical places');
                console.error('Error fetching historical places:', error);
            }
        };

        fetchHistoricalPlaces();
    }, []);

    return (
        <div>
            <h1>All Historical Places</h1>
            {message && <p>{message}</p>}
            <ul>
                {historicalPlaces.length > 0 ? (
                    historicalPlaces.map(place => (
                        <li key={place._id}>
                            {place.Name} - {place.Location}
                        </li>
                    ))
                ) : (
                    <p>No historical places available</p>
                )}
            </ul>
        </div>
    );
};

export default HistoricalPlaces;
