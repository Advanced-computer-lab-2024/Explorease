import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

const ManageUsers = () => {
  const [tourists, setTourists] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [tourismGovernors, setTourismGovernors] = useState([]);
  const [tourGuides, setTourGuides] = useState([]);
  const [advertisers, setAdvertisers] = useState([]);
  const [userMessage, setUserMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [touristsRes, sellersRes, governorsRes, guidesRes, advertisersRes] = await Promise.all([
        axios.get('/admins/tourists', { headers }),
        axios.get('/admins/sellers', { headers }),
        axios.get('/admins/tourismGovernors', { headers }),
        axios.get('/admins/tourGuides', { headers }),
        axios.get('/admins/advertisers', { headers }),
      ]);

      setTourists(touristsRes.data);
      setSellers(sellersRes.data);
      setTourismGovernors(governorsRes.data);
      setTourGuides(guidesRes.data);
      setAdvertisers(advertisersRes.data);
    } catch (error) {
      setUserMessage('Error fetching users.');
      console.error(error);
    }
  };

  const deleteUser = async (id, userType) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/admins/deleteUser/${id}/${userType}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserMessage(`${userType} deleted successfully!`);
      fetchUsers();
    } catch (error) {
      console.error(`Error deleting ${userType}:`, error.response?.data || error.message);
      setUserMessage(`Error deleting ${userType}.`);
    }
  };

  const renderUserSection = (title, users, userType) => (
    <Box sx={{ marginBottom: 4 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {users.length === 0 ? (
        <Typography>No {title.toLowerCase()} found</Typography>
      ) : (
        <List>
          {users.map((user) => (
            <React.Fragment key={user._id}>
              <ListItem
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 2,
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  marginBottom: '10px',
                }}
              >
                <ListItemText primary={`${user.username} - ${user.email}`} />
                <Button
                  variant="outlined"
                  onClick={() => deleteUser(user._id, userType)}
                  sx={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: '1px solid #f44336',
                    '&:hover': {
                      backgroundColor: 'white',
                      color: '#f44336',
                      border: '1px solid #f44336',
                    },
                  }}
                >
                  Delete {title}
                </Button>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );

  return (
    <Box sx={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom>
        Manage Users
      </Typography>

      {userMessage && (
        <Alert severity={userMessage.includes('Error') ? 'error' : 'success'} sx={{ marginBottom: 4 }}>
          {userMessage}
        </Alert>
      )}

      {/* Render user sections */}
      {renderUserSection('Tourists', tourists, 'tourist')}
      {renderUserSection('Sellers', sellers, 'seller')}
      {renderUserSection('Tourism Governors', tourismGovernors, 'tourismGovernor')}
      {renderUserSection('Tour Guides', tourGuides, 'tourGuide')}
      {renderUserSection('Advertisers', advertisers, 'advertiser')}
    </Box>
  );
};

export default ManageUsers;
