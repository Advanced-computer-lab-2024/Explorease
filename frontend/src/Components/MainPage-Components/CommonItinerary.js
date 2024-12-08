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
  CircularProgress, IconButton, Tooltip
} from '@mui/material';
import {
    Select,
    MenuItem,
    FormControl,
    InputLabel
  } from '@mui/material';
  
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import FilterListIcon from '@mui/icons-material/FilterList'; // Filter Icon

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
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    setLoading(true); // Start loading indicator
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/tourists/itineraries', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      const response = await axios.get(`tourists/itineraries/filter-sort-search?${queryString}`, {
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
<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
  {itineraries.length > 0 ? (
    itineraries.map((itinerary) => (
      <Card
        key={itinerary._id}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: 'calc(33.33% - 20px)', // Adjust card width to 1/3rd of the container width
          boxShadow: 3,
          marginBottom: '20px',
          borderRadius: '12px',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        {/* Image */}
        {itinerary.imageUrl && (
          <img
            src={itinerary.imageUrl}
            alt={itinerary.name}
            style={{
              width: '100%',
              height: '60%',
              objectFit: 'cover',
              marginBottom: '10px',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
            }}
          />
        )}

        {/* Top Section: Image and Details */}
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <CardContent sx={{ padding: 0 }}>
            <Typography
              variant="h5"
              sx={{
                color: '#111E56',
                fontWeight: 'bold',
                marginBottom: '10px',
                textAlign: 'center',
              }}
            >
              {itinerary.name}
            </Typography>
            <Typography>
              <strong style={{ fontWeight: 'bold', color: '#111E56' }}>Total Price:</strong> ${itinerary.totalPrice}
            </Typography>
            <Typography>
              <strong style={{ fontWeight: 'bold', color: '#111E56' }}>Languages:</strong> {itinerary.LanguageOfTour.join(', ')}
            </Typography>
            <Typography>
              <strong style={{ fontWeight: 'bold', color: '#111E56' }}>Date :</strong> {new Date(itinerary.AvailableDates[0]).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Box>

        {/* Divider */}
        <Box sx={{ borderTop: '1px solid #ccc' }} />

        {/* Bottom Section: Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 2 }}>
          {/* Copy Link Button */}
          <Tooltip title="Copy Link">
            <IconButton
              onClick={() => handleCopyLink(itinerary._id)}
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

          {/* Share via Email Button */}
          <Tooltip title="Share via Email">
            <IconButton
              onClick={() => handleShareEmail(itinerary)}
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
