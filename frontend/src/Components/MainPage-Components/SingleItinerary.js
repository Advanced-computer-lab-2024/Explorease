import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import Navbar from  './GuestNavbar';


const SingleItinerary = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/tourists/itineraries/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setItinerary(response.data);
      } catch (err) {
        setError('Failed to load itinerary');
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return itinerary ? (
    <Box> 
        <Navbar />
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Card sx={{ maxWidth: 500, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4">{itinerary.name}</Typography>
          <Typography><strong>Price:</strong> ${itinerary.totalPrice}</Typography>
          <Typography><strong>Languages:</strong> {itinerary.LanguageOfTour.join(', ')}</Typography>
          <Typography><strong>Available Dates:</strong> {itinerary.AvailableDates.join(', ')}</Typography>
          <Typography variant="body2" color="text.secondary">{itinerary.description}</Typography>
        </CardContent>
      </Card>
    </Box>
    </Box>
  ) : (
    <Typography>No itinerary found</Typography>
  );
};

export default SingleItinerary;
