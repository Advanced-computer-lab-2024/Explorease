import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
    Select,
    MenuItem,
    FormControl,
    InputLabel
  } from '@mui/material';
  
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';

const Itineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [language, setLanguage] = useState('');
  const [accessibility, setAccessibility] = useState('');
  const [tag, setTag] = useState('');

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    setLoading(true); // Start loading indicator
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/tourists/itineraries', {
      });
      setItineraries(response.data);
      setLoading(false); // Stop loading indicator
    } catch (error) {
      setMessage('Error fetching itineraries');
      setLoading(false); // Stop loading even if there's an error
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    let queryString = '';

    // Add parameters to query string
    if (searchQuery) queryString += `searchQuery=${searchQuery}&`;
    if (minPrice) queryString += `minPrice=${minPrice}&`;
    if (maxPrice) queryString += `maxPrice=${maxPrice}&`;
    if (startDate) queryString += `startDate=${startDate}&`;
    if (endDate) queryString += `endDate=${endDate}&`;
    if (minRating) queryString += `minRating=${minRating}&`;
    if (language) queryString += `language=${language}&`;
    if (accessibility) queryString += `accessibility=${accessibility}&`;
    if (tag) queryString += `tags=${tag}&`;
    if (sortBy) queryString += `sortBy=${sortBy}&order=${order}`;

    setLoading(true); // Start loading while searching
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/tourists/itineraries/filter-sort-search?${queryString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItineraries(response.data);
      setLoading(false); // Stop loading after fetching
    } catch (error) {
      console.error('Error fetching itineraries:', error.response ? error.response.data : error.message);
      setLoading(false); // Stop loading on error
    }
  };

  const handleCopyLink = (itineraryId) => {
    const link = `${window.location.origin}/itinerary/${itineraryId}`;
    navigator.clipboard.writeText(link)
      .then(() => alert('Link copied to clipboard!'))
      .catch((err) => console.error('Error copying link:', err));
  };

  const handleShareEmail = (itinerary) => {
    const subject = `Check out this itinerary: ${itinerary.name}`;
    const body = `Here is an itinerary you might be interested in:\n\nName: ${itinerary.name}\nTotal Price: $${itinerary.totalPrice}\nLanguages: ${itinerary.LanguageOfTour.join(', ')}\nPick-Up Location: ${itinerary.PickUpLocation}\nDrop-Off Location: ${itinerary.DropOffLocation}\n\nCheck it out here: ${window.location.origin}/itinerary/${itinerary._id}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <Box>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{color:'#111E56' , fontWeight:'bold'}}>
          Itineraries
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
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Search by Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

            {/* Language */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
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

            {/* Accessibility */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Accessibility"
                value={accessibility}
                onChange={(e) => setAccessibility(e.target.value)}
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
      <MenuItem value="date">Date</MenuItem>
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
            {itineraries.length > 0 ? (
              itineraries.map((itinerary) => (
                <Card
                  key={itinerary._id}
                  sx={{
                    width: '85%',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                    borderRadius: 2,
                    height: '280px',
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
                        {itinerary.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Total Price:</strong> ${itinerary.totalPrice}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Languages:</strong> {itinerary.LanguageOfTour.join(', ')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Pick-Up Location:</strong> {itinerary.PickUpLocation}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Drop-Off Location:</strong> {itinerary.DropOffLocation}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Accessibility:</strong> {itinerary.accessibility}
                      </Typography>
                      {itinerary.tags && (
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Tags:</strong> {itinerary.tags.map((tag) => tag.name).join(', ')}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Available Dates:</strong> {itinerary.AvailableDates.map((date) => new Date(date).toLocaleDateString()).join(', ')}
                      </Typography>
                      {/* Centered Buttons */}
                    <Box
                      sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                      }}
                    >
                      <Button
                        onClick={() => handleCopyLink(itinerary._id)}
                        variant="outlined"
                        startIcon={<LinkIcon />}
                        sx={{
                          backgroundColor: 'white',
                          color: '#5A8CFF',
                          border: '1px solid #5A8CFF',
                          '&:hover': {
                            backgroundColor: '#5A8CFF',
                            color: 'white',
                          },
                          textTransform: 'none',
                        }}
                      >
                        Copy Link
                      </Button>
                      <Button
                        onClick={() => handleShareEmail(itinerary)}
                        variant="outlined"
                        startIcon={<EmailIcon />}
                        sx={{
                          backgroundColor: 'white',
                          color: '#5A8CFF',
                          border: '1px solid #5A8CFF',
                          '&:hover': {
                            backgroundColor: '#5A8CFF',
                            color: 'white',
                          },
                          textTransform: 'none',
                        }}
                      >
                        Share via Email
                      </Button>
                    </Box>
                    </Box>

                    
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography>No itineraries available</Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Itineraries;
