import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  Grid,
  Tooltip,
  IconButton,
  CircularProgress, CardMedia, Container, Stack
} from '@mui/material';
import { Link } from 'react-router-dom';
import logo2 from '../../Misc/image.png';

import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import Navbar from './GuestNavBarforGuest';

const HistoricalPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [tag, setTag] = useState('');

  useEffect(() => {
    fetchHistoricalPlaces();
  }, []);

  const fetchHistoricalPlaces = async () => {
    setLoading(true); // Set loading to true while fetching
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/tourists/historical-places', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlaces(response.data);
      setLoading(false); // Data fetched, stop loading
    } catch (error) {
      setMessage('Error fetching historical places');
      setLoading(false); // Stop loading even if there's an error
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    let queryString = '';

    if (searchQuery) queryString += `name=${searchQuery}&`;
    if (tag) queryString += `tag=${tag}&`;

    setLoading(true); // Start loading while filtering
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/tourists/historical-places/filter-sort-search?${queryString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlaces(response.data);
      setLoading(false); // Stop loading after filtering
    } catch (error) {
      setMessage('Error applying filters');
      setLoading(false); // Stop loading even if there's an error
    }
  };

  const handleCopyLink = (placeId) => {
    const link = `${window.location.origin}/historical-place/${placeId}`;
    navigator.clipboard.writeText(link)
      .then(() => alert('Link copied to clipboard!'))
      .catch((err) => console.error('Error copying link:', err));
  };

  const handleShareEmail = (place) => {
    const subject = `Check out this historical place: ${place.Name}`;
    const body = `Here is a historical place you might be interested in:\n\nName: ${place.Name}\nLocation: ${place.Location}\nDescription: ${place.Description}\nPeriod: ${place.Period}\nManaged By: ${place.managedBy?.username}\n\nCheck it out here: ${window.location.origin}/historical-place/${place._id}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <Box>
      <Navbar />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{color:'#111E56' , fontWeight:'bold'}}>
          Historical Places
        </Typography>

        {/* Search Form */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            maxWidth: 'calc(100% - 200px)',
            mx: 'auto',
            mb: 4,
          }}
        >
          <Grid container spacing={2}>
            {/* Search by Name */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Search by Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
              />
            </Grid>

            {/* Tag */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Tags"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                fullWidth
              />
            </Grid>

            {/* Search Button */}
            <Grid item xs={12} sm={6} md={1}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: '#111E56',
                  color: 'white',
                  height: '54px',
                  width: '100px',
                  flexWrap: 'wrap',
                  border: '2px solid #111E56',
                  '&:hover': {
                    backgroundColor: 'white',
                    color: '#111E56',
                    border: '2px solid #111E56',
                  },
                }}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box
    sx={{
        display: 'flex',
        justifyContent: 'flex-end', // Align to the right
        padding: '8px',
        marginRight: '6em'            // Add padding around the box
    }}
>
    <Typography variant="body1" sx={{ marginRight: '8px' }}>
        Interested in booking?
    </Typography>
    <Link
        to="/register"
        style={{
            textDecoration: 'none', 
            color: '#111E56', 
            fontWeight: 'bold',
        }}
    >
        Sign-Up Now
    </Link>
</Box>    
        {/* Loading Indicator */}
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}
          >
            {places.length > 0 ? (
              places.map((place) => (
                <Card
                key={place._id}
                sx={{
                  display: 'flex', // Use Flexbox for horizontal layout
                  width: '85%',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  height: 'auto', // Let the height adjust to content
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                    transform: 'scale(1.02)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                  marginBottom: '20px', // Space between cards
                }}
              >
                <CardMedia
                  component="img"
                  image={place.imageUrl} 
                  alt={place.Name || 'Historical Place Image'}
                  sx={{
                    width: '40%',
                    height: 'auto',
                    objectFit: 'cover',
                    borderTopLeftRadius: '12px',
                    borderBottomLeftRadius: '12px'
                  }}
                />
              
                {/* Right Section: Content */}
                <Box sx={{ flex: 1, padding: '16px' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#111E56', marginBottom: '10px' }}>
                    {place.Name || 'Untitled'}
                  </Typography>
              
                  {/* Description, Location, and other details */}
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Description:</strong> {place.Description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Location:</strong> {place.Location}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Period:</strong> {place.Period}
                  </Typography>
                  {place.tags && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Tags:</strong> {place.tags.map((tag) => tag.name).join(', ')}
                    </Typography>
                  )}
                  {place.managedBy && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Managed By:</strong> {place.managedBy.username}
                    </Typography>
                  )}
              
                  {/* Action buttons */}
                  <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: 1,
        marginTop: 0,
        marginBottom: 1,
      }}
    >
      <Tooltip title="Copy Link">
        <IconButton
          onClick={() => handleCopyLink(place._id)}
          sx={{
            backgroundColor: 'white',
            color: '#5A8CFF',
            border: '1px solid #5A8CFF',
            '&:hover': {
              backgroundColor: '#5A8CFF',
              color: 'white',
            },
          }}
        >
          <LinkIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Share via Email">
        <IconButton
          onClick={() => handleShareEmail(place)}
          sx={{
            backgroundColor: 'white',
            color: '#5A8CFF',
            border: '1px solid #5A8CFF',
            '&:hover': {
              backgroundColor: '#5A8CFF',
              color: 'white',
            },
          }}
        >
          <EmailIcon />
        </IconButton>
      </Tooltip>
    </Box>
                </Box>
              </Card>
              


              
              ))
            ) : (
              <Typography>No historical places available</Typography>
            )}
          </Box>
        )}
      </Box>
      <footer style={{ backgroundColor: '#111E56', color: 'white', padding: '30px 0' }}>
                <Container>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                        sx={{ textAlign: { xs: 'center', sm: 'left' } }}
                    >
                        <img
                            src={logo2}
                            alt="Explorease"
                            style={{ height: '3em', marginLeft: '5px' }}
                        />
                        <Typography variant="body2">© 2024. All rights reserved.</Typography>
                        <Stack direction="row" spacing={3}>
                            <Link
                                to="/admin/login"
                                style={{
                                    color: 'white',
                                    textDecoration: 'none',
                                    fontSize: '16px',
                                }}
                            >
                                Admin Login
                            </Link>
                            <Link
                                to="/uploadDocuments"
                                style={{
                                    color: 'white',
                                    textDecoration: 'none',
                                    fontSize: '16px',
                                }}
                            >
                                Upload Documents
                            </Link>
                        </Stack>
                    </Stack>
                </Container>
            </footer>
    </Box>
  );
};

export default HistoricalPlaces;
