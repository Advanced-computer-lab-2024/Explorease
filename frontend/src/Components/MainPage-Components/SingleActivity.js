import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, Typography, Box } from '@mui/material';
import Navbar from './GuestNavBarforGuest.js';


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
    <Card
  key={activity._id}
  sx={{
    display: 'flex',
    width: '800px',
    maxWidth: '1200px', // Max-width for larger screens
    boxShadow: 3,
    borderRadius: 2,
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.03)',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
    },
    height: '300px',
  }}
>
  {/* Left Section: Image */}
  <Box 
    sx={{ 
      flex: '1 1 35%', 
      marginRight: 2, 
      display: 'flex', 
      alignItems: 'stretch',
      height: '100%',
    }}
  >
    {activity.imageUrl && (
      <img
        src={activity.imageUrl}
        alt={activity.name}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderBottomLeftRadius: '8px',
          borderTopLeftRadius: '8px',
        }}
      />
    )}
  </Box>

  {/* Center Section: Details and Share Buttons */}
  <Box 
    sx={{ 
      flex: '1 1 30%', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'space-between' 
    }}
  >
    <CardContent sx={{ padding: 0 }}>
      <Typography
        variant="h5"
        sx={{
          color: '#111E56',
          fontWeight: 'bold',
          marginBottom: '10px',
          marginTop: '10px',
          textAlign: 'center',
        }}
      >
        {activity.name}
      </Typography>
      <Typography sx={{ marginBottom: '5px' }}>
        <strong style={{ fontWeight: 'bold', color: '#111E56' }}>Date:</strong> {new Date(activity.date).toLocaleDateString()}
      </Typography>
      <Typography sx={{ marginBottom: '5px' }}>
        <strong style={{ fontWeight: 'bold', color: '#111E56' }}>Time:</strong> {activity.time}
      </Typography>
      <Typography sx={{ marginBottom: '5px' }}>
        <strong style={{ fontWeight: 'bold', color: '#111E56' }}>Price:</strong> ${activity.price}
      </Typography>
      <Typography sx={{ marginBottom: '5px' }}>
        <strong style={{ fontWeight: 'bold', color: '#111E56' }}>Category:</strong> {activity.category?.name}
      </Typography>
      {activity.tags && (
        <Typography sx={{ marginBottom: '5px' }}>
          <strong style={{ fontWeight: 'bold', color: '#111E56' }}>Tags:</strong> {activity.tags.map(tag => tag.name).join(', ')}
        </Typography>
      )}
      <Typography sx={{ marginBottom: '5px' }}>
        <strong style={{ fontWeight: 'bold', color: '#111E56' }}>Special Discounts:</strong> {activity.specialDiscounts}
      </Typography>
    </CardContent>

    {/* Share Buttons */}
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: 1,
        marginTop: 0,
        marginBottom: 1,
      }}
    >
  
    </Box>
  </Box>

  {/* Right Section: Google Map */}
  <Box 
    sx={{ 
      flex: '1 1 35%', 
      marginLeft: 2, 
      display: 'flex', 
      alignItems: 'stretch', 
      overflow: 'hidden', 
      height: '100%',
    }}
  >
    <iframe
      title="activity-location"
      width="100%"
      height="100%"
      frameBorder="0"
      style={{
        border: 0,
        borderBottomRightRadius: '8px',
        borderTopRightRadius: '8px',
      }}
      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDUP5fw3jw8bvJ7yj9OskV5wdm5sNUbII4&q=${encodeURIComponent(activity.location)}`}
      allowFullScreen
    ></iframe>
  </Box>
</Card>
    </Box>
    </Box>
  ) : (
    <Typography>No activity found</Typography>
  );
};

export default SingleActivity;
