import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';

const ManageContent = () => {
  const [itineraries, setItineraries] = useState([]);
  const [activities, setActivities] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch itineraries and activities on component mount
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        setLoading(true);

        // Fetch itineraries
        const itinerariesRes = await axios.get('/admins/itineraries', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch activities
        const activitiesRes = await axios.get('/admins/activities', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setItineraries(itinerariesRes.data);
        setActivities(activitiesRes.data);
      } catch (error) {
        setMessage('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Flag an itinerary
  const handleFlagItinerary = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`/admins/flagItineraries/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Itinerary flagged successfully!');
      setItineraries((prev) =>
        prev.map((itinerary) =>
          itinerary._id === id ? { ...itinerary, isFlagged: response.data.isFlagged } : itinerary
        )
      );
    } catch (error) {
      setMessage('Error updating itinerary status.');
    }
  };

  // Unflag an itinerary
  const handleUnflagItinerary = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`/admins/unflagItineraries/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Itinerary unflagged successfully!');
      setItineraries((prev) =>
        prev.map((itinerary) =>
          itinerary._id === id ? { ...itinerary, isFlagged: response.data.isFlagged } : itinerary
        )
      );
    } catch (error) {
      setMessage('Error updating itinerary status.');
    }
  };

  // Flag an activity
  const handleFlagActivity = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`/admins/flagActivity/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Activity flagged successfully!');
      setActivities((prev) =>
        prev.map((activity) =>
          activity._id === id ? { ...activity, isFlagged: response.data.isFlagged } : activity
        )
      );
    } catch (error) {
      setMessage('Error updating activity status.');
    }
  };

  // Unflag an activity
  const handleUnflagActivity = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`/admins/unflagActivity/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Activity unflagged successfully!');
      setActivities((prev) =>
        prev.map((activity) =>
          activity._id === id ? { ...activity, isFlagged: response.data.isFlagged } : activity
        )
      );
    } catch (error) {
      setMessage('Error updating activity status.');
    }
  };

  // Render cards for itineraries or activities
  const renderCards = (items, isItinerary = true) => {
    if (!Array.isArray(items) || items.length === 0) {
      return <Typography>No {isItinerary ? 'itineraries' : 'activities'} available</Typography>;
    }

    return items.map((item) => (
      <Card
        key={item._id}
        sx={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '20px',
          width: '500px',
          margin: '10px auto',
          backgroundColor: '#white',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            transform: 'scale(1.02)',
            transition: 'transform 0.2s ease-in-out',
          },
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {item.name}
          </Typography>
          {isItinerary ? (
            <>
              <Typography>
                <strong>Total Price:</strong> ${item.totalPrice}
              </Typography>
              <Typography>
                <strong>Available Dates:</strong> {item.AvailableDates.join(', ')}
              </Typography>
              <Typography>
                <strong>Pick Up Location:</strong> {item.PickUpLocation}
              </Typography>
              <Typography>
                <strong>Drop Off Location:</strong> {item.DropOffLocation}
              </Typography>
            </>
          ) : (
            <>
              <Typography>
                <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}
              </Typography>
              <Typography>
                <strong>Location:</strong> {item.location}
              </Typography>
              <Typography>
                <strong>Price:</strong> ${item.price}
              </Typography>
            </>
          )}
          <Button
            onClick={() => {
              isItinerary
                ? item.isFlagged
                  ? handleUnflagItinerary(item._id)
                  : handleFlagItinerary(item._id)
                : item.isFlagged
                ? handleUnflagActivity(item._id)
                : handleFlagActivity(item._id);
            }}
            sx={{
              marginTop: '20px',
              padding: '10px 15px',
              backgroundColor: item.isFlagged ? '#111E56' : '#f44336',
              color: 'white',
              '&:hover': {
                backgroundColor: 'white',
                color: item.isFlagged ? '#111E56' : '#f44336',
                border: `1px solid ${item.isFlagged ? '#111E56' : '#f44336'}`,
              },
            }}
          >
            {item.isFlagged ? 'Unblock' : 'Block'}
          </Button>
        </CardContent>
      </Card>
    ));
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{
          color: '#111E56',
          position: 'relative',
          display: 'inline-block',
          '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            bottom: -4,
            width: '100%',
            height: '2px',
            backgroundColor: '#111E56',
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.3s ease-in-out',
          },
          '&:hover::after': {
            transform: 'scaleX(1)',
          },
        }}
      >
        Manage Itineraries and Activities
      </Typography>
      {message && <Alert severity="info" sx={{ marginBottom: '20px' }}>{message}</Alert>}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ marginBottom: '30px' }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: '#111E56',
                position: 'relative',
                display: 'inline-block',
                fontWeight: 'bold', // Make the text bold
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  bottom: -4,
                  width: '100%',
                  height: '2px',
                  backgroundColor: '#111E56',
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.3s ease-in-out',
                },
                '&:hover::after': {
                  transform: 'scaleX(1)',
                },
              }}
            >
              Itineraries
            </Typography>
            {renderCards(itineraries, true)}
          </Box>
          <Box>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: '#111E56',
                position: 'relative',
                display: 'inline-block',
                fontWeight: 'bold', // Make the text bold
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  bottom: -4,
                  width: '100%',
                  height: '2px',
                  backgroundColor: '#111E56',
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.3s ease-in-out',
                },
                '&:hover::after': {
                  transform: 'scaleX(1)',
                },
              }}
            >
              Activities
            </Typography>
            {renderCards(activities, false)}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ManageContent;
