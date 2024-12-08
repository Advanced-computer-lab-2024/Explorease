import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, Typography, Box } from '@mui/material';
import Navbar from './GuestNavbar';


const SingleActivity = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/tourists/activities/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setActivity(response.data);
      } catch (err) {
        setError('Failed to load activity');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return activity ? (
    <Box>
        <Navbar />
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Card sx={{ maxWidth: 500, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4">{activity.name}</Typography>
          <Typography><strong>Price:</strong> ${activity.price}</Typography>
          <Typography><strong>Location:</strong> {activity.location}</Typography>
          <Typography><strong>Category:</strong> {activity.category}</Typography>
          <Typography variant="body2" color="text.secondary">{activity.description}</Typography>
          <Typography variant="body2" color="text.secondary"><strong>Available Dates:</strong> {activity.date}</Typography>
        </CardContent>
      </Card>
    </Box>
    </Box>
  ) : (
    <Typography>No activity found</Typography>
  );
};

export default SingleActivity;
