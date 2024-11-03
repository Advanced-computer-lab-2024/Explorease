import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const BlockItinerary = () => {
    const [itineraries, setItineraries] = useState([]);
    const [message, setMessage] = useState('');

    // Fetch itineraries on component mount
    useEffect(() => {
        const fetchItineraries = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('/admins/itineraries', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setItineraries(response.data);
            } catch (error) {
                setMessage('Error fetching itineraries.');
            }
        };
        fetchItineraries();
    }, []);

    const handleFlagging = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(`/admins/flagItineraries/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage('Itinerary flagged successfully!');
            setItineraries(prevItineraries =>
                prevItineraries.map(itinerary =>
                    itinerary._id === id ? { ...itinerary, isFlagged: response.data.isFlagged } : itinerary
                )
            );
        } catch (error) {
            setMessage('Error updating itinerary status.');
        }
    };
    
    const handleUnFlagging = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(`/admins/unflagItineraries/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage('Itinerary unflagged successfully!');
            setItineraries(prevItineraries =>
                prevItineraries.map(itinerary =>
                    itinerary._id === id ? { ...itinerary, isFlagged: response.data.isFlagged } : itinerary
                )
            );
        } catch (error) {
            setMessage('Error updating itinerary status.');
        }
    };
    

    // Render itinerary cards
    const renderItineraryCards = () => {
        if (!Array.isArray(itineraries) || itineraries.length === 0) {
            return <p>No itineraries available</p>;
        }

        return itineraries.map((itinerary) => (
            <div key={itinerary._id} className="itinerary-card" style={cardStyle}>
                <h3>{itinerary.name}</h3>
                <p><strong>Total Price:</strong> ${itinerary.totalPrice}</p>
                <p><strong>Available Dates:</strong> {itinerary.AvailableDates.join(', ')}</p>
                <p><strong>Pick Up Location:</strong> {itinerary.PickUpLocation}</p>
                <p><strong>Drop Off Location:</strong> {itinerary.DropOffLocation}</p>
                <button

                    onClick={() => {
                    itinerary.isFlagged ? handleUnFlagging(itinerary._id) : handleFlagging(itinerary._id);
                }}
                    style={deleteButtonStyle}
                >
                    {itinerary.isFlagged ? 'Unblock' : 'Block'}
                </button>
            </div>
        ));
    };

    // Inline styles
    const cardStyle = {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '20px',
        maxWidth: '400px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        marginBottom: '20px',
    };

    const deleteButtonStyle = {
        padding: '10px 15px',
        backgroundColor: '#ff4d4d',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '5px',
        marginTop: '10px',
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>My Itineraries</h2>
            {message && <p>{message}</p>}
            <div className="itinerary-list">{renderItineraryCards()}</div>
        </div>
    );
};

export default BlockItinerary;
