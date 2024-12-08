import React, { useState, useEffect, useMemo , useCallback} from 'react';
import axios from 'axios';
import { Button, Typography, Box, Card, CardContent, Stack } from '@mui/material';


export default function DeleteRequests() {
  const [deleteRequests, setDeleteRequests] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const axiosConfig = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }), [token]);

  const fetchDeleteRequests = useCallback(async () => {
    try {
      const response = await axios.get('/admins/getRequesteddeleteUsers', axiosConfig);
      const allUsers = [
        ...response.data.sellers.map(user => ({ ...user, userType: 'seller' })),
        ...response.data.advertisers.map(user => ({ ...user, userType: 'advertiser' })),
        ...response.data.tourGuides.map(user => ({ ...user, userType: 'tourGuide' })),
        ...response.data.tourists.map(user => ({ ...user, userType: 'tourist' }))
      ];
      setDeleteRequests(allUsers);
    } catch (error) {
      console.error('Error fetching delete requests:', error);
      setMessage(error.response?.data?.message || 'Failed to fetch delete requests');
    }
  }, [axiosConfig]);  // Use axiosConfig as a dependency
  
  useEffect(() => {
    if (token) {
      fetchDeleteRequests();
    } else {
      setMessage('Authentication token is missing. Please log in.');
    }
  }, [token, fetchDeleteRequests]);  // Now safe to add fetchDeleteRequests
  

  // useEffect(() => {
  //   if (token) {
  //     fetchDeleteRequests();
  //   } else {
  //     setMessage('Authentication token is missing. Please log in.');
  //   }
  // }, [token]);

  // const fetchDeleteRequests = async () => {
  //   try {
  //     const response = await axios.get('/admins/getRequesteddeleteUsers', axiosConfig);
  //     const allUsers = [
  //       ...response.data.sellers.map(user => ({ ...user, userType: 'seller' })),
  //       ...response.data.advertisers.map(user => ({ ...user, userType: 'advertiser' })),
  //       ...response.data.tourGuides.map(user => ({ ...user, userType: 'tourGuide' })),
  //       ...response.data.tourists.map(user => ({ ...user, userType: 'tourist' }))
  //     ];
  //     setDeleteRequests(allUsers);
  //   } catch (error) {
  //     console.error('Error fetching delete requests:', error);
  //     setMessage(error.response?.data?.message || 'Failed to fetch delete requests');
  //   }
  // };

  const handleDeleteRequest = async (userId, userType) => {
    try {
      if (userType === 'tourGuide') {
        try {
          await axios.delete(`/tourguide/deleteItinerary2/${userId}`, axiosConfig);
        } catch (error) {
          console.error(`No itineraries found or error deleting itineraries for tourGuide with ID: ${userId}`);
        }
      }

      if (userType === 'seller') {
        try {
          await axios.delete(`/seller/productsBySeller/${userId}`, axiosConfig);
        } catch (error) {
          console.error(`No products found or error deleting products for seller with ID: ${userId}`);
        }
      }

      if (userType === 'advertiser') {
        try {
          await axios.delete(`/advertiser/deleteActivity2/${userId}`, axiosConfig);
        } catch (error) {
          console.error(`No activities found or error deleting activities for advertiser with ID: ${userId}`);
        }
      }

      await axios.delete(`/admins/deleteUser/${userId}/${userType}`, axiosConfig);

      setMessage('User and associated data deleted successfully.');
      fetchDeleteRequests(); // Refresh the list after update
    } catch (error) {
      console.error('Error handling delete request:', error);
      setMessage(error.response?.data?.message || 'Failed to process delete request');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 6, p: 4, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' , color:'#111E56' }}>
        User Delete Requests
      </Typography>
      {message && (
        <Typography
          sx={{
            mt: 2,
            color: message.includes('Failed') ? 'error.main' : 'success.main',
            textAlign: 'center',
          }}
        >
          {message}
        </Typography>
      )}
      <Stack spacing={3} sx={{ mt: 3 }}>
        {deleteRequests.length === 0 ? (
          <Typography variant="body1" align="center">
            No delete requests at this time.
          </Typography>
        ) : (
          deleteRequests.map((request) => (
            <Card
              key={request._id}
              sx={{
                boxShadow: 2,
                borderRadius: 1,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{color:'#111E56' , fontWeight:'bold'}}>{request.username}</Typography>
                <Typography variant="body2" gutterBottom>{request.email}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  User Type: {request.userType.charAt(0).toUpperCase() + request.userType.slice(1)}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#f44336',
                                color: 'white',
                                border: '2px solid #f44336',
                                '&:hover': {
                                    backgroundColor: 'white',
                                    color: '#f44336',
                                    border: '2px solid #f44336',
                                },
                    }}
                    onClick={() => handleDeleteRequest(request._id, request.userType)}
                  >
                    Approve Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
    </Box>
  );
}
