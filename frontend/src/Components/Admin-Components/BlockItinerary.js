import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
} from '@mui/material';

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
      setItineraries((prevItineraries) =>
        prevItineraries.map((itinerary) =>
          itinerary._id === id
            ? { ...itinerary, isFlagged: response.data.isFlagged }
            : itinerary
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
      setItineraries((prevItineraries) =>
        prevItineraries.map((itinerary) =>
          itinerary._id === id
            ? { ...itinerary, isFlagged: response.data.isFlagged }
            : itinerary
        )
      );
    } catch (error) {
      setMessage('Error updating itinerary status.');
    }
  };

  // Render itinerary cards
  const renderItineraryCards = () => {
    if (!Array.isArray(itineraries) || itineraries.length === 0) {
      return <Typography>No itineraries available</Typography>;
    }

    return itineraries.map((itinerary) => (
      <Card
        key={itinerary._id}
        sx={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '20px',
          width: '500px', // Fixed width for all cards
          margin: '10px auto', // Center card and add space between
          backgroundColor: '#f9f9f9',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            transform: 'scale(1.02)', // Subtle scale effect on hover
            transition: 'transform 0.2s ease-in-out',
          },
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {itinerary.name}
          </Typography>
          <Typography>
            <strong>Total Price:</strong> ${itinerary.totalPrice}
          </Typography>
          <Typography>
            <strong>Available Dates:</strong> {itinerary.AvailableDates.join(', ')}
          </Typography>
          <Typography>
            <strong>Pick Up Location:</strong> {itinerary.PickUpLocation}
          </Typography>
          <Typography>
            <strong>Drop Off Location:</strong> {itinerary.DropOffLocation}
          </Typography>
          <Button
            onClick={() => {
              itinerary.isFlagged
                ? handleUnFlagging(itinerary._id)
                : handleFlagging(itinerary._id);
            }}
            sx={{
              marginTop: '20px',
              padding: '10px 15px',
              backgroundColor: itinerary.isFlagged ? '#111E56' : '#f44336',
              color: 'white',
              '&:hover': {
                backgroundColor: 'white',
                color: itinerary.isFlagged ? '#111E56' : '#f44336',
                border: `1px solid ${itinerary.isFlagged ? '#111E56' : '#f44336'}`,
              },
            }}
          >
            {itinerary.isFlagged ? 'Unblock' : 'Block'}
          </Button>
        </CardContent>
      </Card>
    ));
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom align="center">
        My Itineraries
      </Typography>
      {message && <Alert severity="info" sx={{ marginBottom: '20px' }}>{message}</Alert>}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {renderItineraryCards()}
      </Box>
    </Box>
  );
};

export default BlockItinerary;
