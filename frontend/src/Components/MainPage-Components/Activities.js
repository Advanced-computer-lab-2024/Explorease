import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Container, Stack,
  CircularProgress, Tooltip, IconButton} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import Navbar from './GuestNavBarforGuest';
import FilterListIcon from '@mui/icons-material/FilterList'; // Filter Icon
import { Link } from 'react-router-dom';
import logo2 from '../../Misc/image.png';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
const [loading, setLoading] = useState(true); // For loading state
  const [showFilters, setShowFilters] = useState(false);
  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true); // Start loading
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/tourists/activities', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setActivities(response.data);
    } catch (error) {
        setMessage('Error fetching activities');
    } finally {
        setLoading(false); // Stop loading regardless of success or error
    }
};


const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    let queryString = '';

    if (searchQuery) queryString += `searchQuery=${searchQuery}&`;
    if (category) queryString += `category=${category}&`;
    if (tag) queryString += `tag=${tag}&`;
    if (minPrice) queryString += `minPrice=${minPrice}&`;
    if (maxPrice) queryString += `maxPrice=${maxPrice}&`;
    if (startDate) queryString += `startDate=${startDate}&`;
    if (endDate) queryString += `endDate=${endDate}&`;
    if (minRating) queryString += `minRating=${minRating}&`;
    if (sortBy) queryString += `sortBy=${sortBy}&order=${order}`;

    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/tourists/activities/filter-sort-search?${queryString}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setActivities(response.data);
    } catch (error) {
        setMessage('Error applying filters');
    } finally {
        setLoading(false); // Stop loading regardless of success or error
    }
};


  const handleCopyLink = (activityId) => {
    const link = `${window.location.origin}/activity/${activityId}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Error copying link:', err);
      });
  };

  const handleShareEmail = (activity) => {
    const subject = `Check out this activity: ${activity.name}`;
    const body = `Here is an activity you might be interested in:\n\nName: ${activity.name}\nDate: ${new Date(activity.date).toLocaleDateString()}\nLocation: ${activity.location}\nPrice: $${activity.price}\n\nCheck it out here: ${window.location.origin}/activity/${activity._id}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <Box>
      <Navbar />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{color:'#111E56' , fontWeight:'bold'}}>
          Activities
        </Typography>

        <form onSubmit={handleSearch} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                {/* Search Fields */}
                <TextField
                    label="Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    variant="outlined"
                    sx={{ flex: '1 1 200px' }}
                />
                <TextField
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    variant="outlined"
                    sx={{ flex: '1 1 200px' }}
                />
                <TextField
                    label="Tag"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    variant="outlined"
                    sx={{ flex: '1 1 200px' }}
                />

                {/* Filter Icon Button */}
                <IconButton
                    onClick={() => setShowFilters(!showFilters)} // Toggle filter visibility
                    sx={{ backgroundColor: '#111E56', color: 'white', borderRadius: 1 , height:'2.2em'}}
                >
                    <FilterListIcon />
                </IconButton>
            </div>

            {/* Filter Fields - Conditionally Rendered */}
            {showFilters && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <TextField
                        label="Min Price"
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        variant="outlined"
                        sx={{ flex: '1 1 100px' }}
                    />
                    <TextField
                        label="Max Price"
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        variant="outlined"
                        sx={{ flex: '1 1 100px' }}
                    />
                    <TextField
                        label="Min Rating"
                        type="number"
                        value={minRating}
                        onChange={(e) => setMinRating(e.target.value)}
                        variant="outlined"
                        sx={{ flex: '1 1 100px' }}
                    />
                    <TextField
                        label="Start Date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        sx={{ flex: '1 1 150px' }}
                    />
                    <TextField
                        label="End Date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        sx={{ flex: '1 1 150px' }}
                    />
                    <FormControl sx={{ flex: '1 1 150px' }}>
                        <InputLabel>Sort By</InputLabel>
                        <Select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            label="Sort By"
                        >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value="price">Price</MenuItem>
                            <MenuItem value="ratings">Rating</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ flex: '1 1 150px' }}>
                        <InputLabel>Order</InputLabel>
                        <Select
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            label="Order"
                        >
                            <MenuItem value="asc">Ascending</MenuItem>
                            <MenuItem value="desc">Descending</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            )}

            {/* Submit Button */}
            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                    backgroundColor: '#111E56',
                    color: 'white',
                    border: '2px solid #111E56',
                    '&:hover': {
                        backgroundColor: 'white',
                        color: '#111E56',
                        border: '2px solid #111E56',
                    },
                    mx: 1,
                    ml : -1,
                    px: 4,
                    width: '101%'
                }}
            >
                Search & Filter
            </Button>
        </form>

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
    
{activities.length > 0 ? activities.map((activity) => (
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
      <Tooltip title="Copy Link">
        <IconButton
          onClick={() => handleCopyLink(activity._id)}
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
          onClick={() => handleShareEmail(activity)}
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
)) 
   : (
    <Typography>No activities available</Typography>
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

export default Activities;
