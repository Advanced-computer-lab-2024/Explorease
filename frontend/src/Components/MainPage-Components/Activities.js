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
  Grid,
  CircularProgress,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import Navbar from './GuestNavBarforGuest';

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

  const sharedWidth = { xs: '100%', sm: 'calc(100% - 200px)' };

  return (
    <Box>
      <Navbar />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{color:'#111E56' , fontWeight:'bold'}}>
          Activities
        </Typography>

        <Box
  component="form"
  onSubmit={handleSearch}
  sx={{
    maxWidth: 'calc(100% - 200px)', // Matches the card width (100% - 200px)
    mx: 'auto', // Centers the form
    mb: 4}}
>
  <Grid container spacing={2}>
    {/* Search by Name */}
    <Grid item xs={12} sm={6} md={3}>
      <TextField
        label="Search by Name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
      />
    </Grid>

    {/* Category */}
    <Grid item xs={12} sm={6} md={3}>
      <TextField
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        fullWidth
      />
    </Grid>

    {/* Tag */}
    <Grid item xs={12} sm={6} md={3}>
      <TextField
        label="Tag"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        fullWidth
      />
    </Grid>

    {/* Min Rating */}
    <Grid item xs={12} sm={6} md={3}>
      <TextField
        label="Min Rating"
        type="number"
        value={minRating}
        onChange={(e) => setMinRating(e.target.value)}
        fullWidth
      />
    </Grid>

    {/* Min Price */}
    <Grid item xs={12} sm={6} md={3}>
      <TextField
        label="Min Price"
        type="number"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        fullWidth
      />
    </Grid>

    {/* Max Price */}
    <Grid item xs={12} sm={6} md={3}>
      <TextField
        label="Max Price"
        type="number"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        fullWidth
      />
    </Grid>

    {/* Start Date */}
    <Grid item xs={12} sm={6} md={3}>
      <TextField
        label="Start Date"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
    </Grid>

    {/* End Date */}
    <Grid item xs={12} sm={6} md={3}>
      <TextField
        label="End Date"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
    </Grid>

    {/* Sort By */}
    <Grid item xs={12} sm={6} md={3}>
      <FormControl fullWidth>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          label="Sort By"
        >
          <MenuItem value="">Select</MenuItem>
          <MenuItem value="price">Price</MenuItem>
          <MenuItem value="ratings">Ratings</MenuItem>
        </Select>
      </FormControl>
    </Grid>

    {/* Order */}
    <Grid item xs={12} sm={6} md={3}>
      <FormControl fullWidth>
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
    </Grid>

    {/* Search Button */}
    <Grid item xs={11} sm={1} md={1}>
    <Button
      type="submit"
      variant="contained"
      fullWidth
      sx={{
        backgroundColor: '#111E56',
        color: 'white',
        width: '90px',
        height: '54px',
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
    
  {activities.length > 0 ? (
    activities.map((activity) => (
      <Card
        key={activity._id}
        sx={{
          width: '85%',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
          height: '235px',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
            transform: 'scale(1.02)',
            transition: 'transform 0.2s ease-in-out',
          },
        }}
      >
        <CardContent
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          {/* Left Section */}
          <Box sx={{ flex: 2, paddingRight: 2 }}>
            <Typography variant="h6" gutterBottom sx={{color:'#111E56' , fontWeight:'bold'}}>
              {activity.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Price:</strong> ${activity.price}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Category:</strong> {activity.category?.name || 'N/A'}
            </Typography>
            {activity.tags && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Tags:</strong> {activity.tags.map((tag) => tag.name).join(', ')}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 2, marginTop: 2 , marginLeft: '250px'}}>
              <Button
                onClick={() => handleCopyLink(activity._id)}
                variant="outlined"
                startIcon={<LinkIcon />}
                sx={{ backgroundColor: 'white', 
                    color: '#5A8CFF', 
                    border: '1px solid #5A8CFF', // Optional: adds a border to match the dark blue on hover
                    '&:hover': { 
                        backgroundColor: '#5A8CFF', 
                        color: 'white',
                        
                    },textTransform: 'none' }}
              >
                Copy Link
              </Button>
              <Button
                onClick={() => handleShareEmail(activity)}
                variant="outlined"
                startIcon={<EmailIcon />}
                sx={{  backgroundColor: 'white', 
                    color: '#5A8CFF', 
                    border: '1px solid #5A8CFF', // Optional: adds a border to match the dark blue on hover
                    '&:hover': { 
                        backgroundColor: '#5A8FFF', 
                        color: 'white',
                        
                    },textTransform: 'none' }}
              >
                Share via Email
              </Button>
            </Box>
          </Box>

          {/* Right Section */}
          <Box
            sx={{
              flex: 1,
              minWidth: '200px',
              height: '200px',
              border: '1px solid #ccc',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDUP5fw3jw8bvJ7yj9OskV5wdm5sNUbII4&q=${encodeURIComponent(
                activity.location
              )}`}
              allowFullScreen
            ></iframe>
          </Box>
        </CardContent>
      </Card>
    ))
  ) : (
    <Typography>No activities available</Typography>
  )}
</Box>
)}


      </Box>
    </Box>
  );
};

export default Activities;
