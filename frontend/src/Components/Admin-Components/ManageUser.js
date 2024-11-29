import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  IconButton,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import Delete from '@mui/icons-material/Delete';

const ManageUsers = () => {
  const [tourists, setTourists] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [tourismGovernors, setTourismGovernors] = useState([]);
  const [tourGuides, setTourGuides] = useState([]);
  const [advertisers, setAdvertisers] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [monthlyAccounts, setMonthlyAccounts] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      setLoading(true);
      const [touristsRes, sellersRes, governorsRes, guidesRes, advertisersRes] = await Promise.all([
        axios.get('/admins/tourists', { headers }),
        axios.get('/admins/sellers', { headers }),
        axios.get('/admins/tourismGovernors', { headers }),
        axios.get('/admins/tourGuides', { headers }),
        axios.get('/admins/advertisers', { headers }),
      ]);

      const allUsers = [
        ...touristsRes.data,
        ...sellersRes.data,
        ...governorsRes.data,
        ...guidesRes.data,
        ...advertisersRes.data,
      ];

      setTourists(touristsRes.data);
      setSellers(sellersRes.data);
      setTourismGovernors(governorsRes.data);
      setTourGuides(guidesRes.data);
      setAdvertisers(advertisersRes.data);

      setTotalAccounts(allUsers.length);

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyCount = allUsers.filter((user) => {
        const createdAt = new Date(user.createdAt);
        return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
      }).length;

      setMonthlyAccounts(monthlyCount);
    } catch (error) {
      setUserMessage('Error fetching users.');
      console.error(error);
    } finally {
      setLoading(false);
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
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <ListItemText primary={`${user.username} - ${user.email}`} />
                <IconButton
                  onClick={() => deleteUser(user._id, userType)}
                  sx={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    transition: 'background-color 0.3s, transform 0.3s',
                    '&:hover': {
                      backgroundColor: 'white',
                      color: '#f44336',
                      border: '1px solid #f44336',
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <Delete />
                </IconButton>
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
        Manage Users Accounts
      </Typography>

      {userMessage && (
        <Alert severity={userMessage.includes('Error') ? 'error' : 'success'} sx={{ marginBottom: 4 }}>
          {userMessage}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', gap: 2, marginBottom: 4 }}>
            <Card
              sx={{
                flex: 1,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)',
                },
              }}
            >
              <CardContent>
                <Typography variant="h6">Total Accounts</Typography>
                <Typography variant="h4" color="primary">
                  {totalAccounts}
                </Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                flex: 1,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)',
                },
              }}
            >
              <CardContent>
                <Typography variant="h6">Accounts This Month</Typography>
                <Typography variant="h4" color="secondary">
                  {monthlyAccounts}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {renderUserSection('Tourists', tourists, 'tourist')}
          {renderUserSection('Sellers', sellers, 'seller')}
          {renderUserSection('Tourism Governors', tourismGovernors, 'tourismGovernor')}
          {renderUserSection('Tour Guides', tourGuides, 'tourGuide')}
          {renderUserSection('Advertisers', advertisers, 'advertiser')}
        </>
      )}
    </Box>
  );
};

export default ManageUsers;
