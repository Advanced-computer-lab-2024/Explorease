import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { Box, Typography, Button, Card, CardContent, Divider, CircularProgress } from '@mui/material';

const TransitRoute = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSettingOrigin, setIsSettingOrigin] = useState(true);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDUP5fw3jw8bvJ7yj9OskV5wdm5sNUbII4', // Replace with your API key
    libraries: ['places'],
  });

  const fetchRoute = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/transit-route', {
        params: {
          origin: `${origin.lat},${origin.lng}`,
          destination: `${destination.lat},${destination.lng}`,
        },
      });
      setRouteData(response.data);
    } catch (error) {
      setError('Failed to fetch route information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (origin && destination) {
      fetchRoute();
    }
  }, [origin, destination]);

  const handleMapClick = (event) => {
    const clickedLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    if (isSettingOrigin) {
      setOrigin(clickedLocation);
    } else {
      setDestination(clickedLocation);
    }
  };

  const handleBook = (section) => {
    alert(`Booking for ${section.type} from ${section.departure.place.name || 'start'} to ${section.arrival.place.name || 'end'}`);
  };

  if (!isLoaded) return <Typography>Loading Maps...</Typography>;

  return (
    <Box sx={{ px: 3, py: 4, mx: 'auto', maxWidth: 1200, mt: 4 }}>
      <Typography
        variant="h4"
        sx={{ textAlign: 'center', fontWeight: 'bold', color: '#111E56', mb: 4 }}
      >
        Transit Route Planner
      </Typography>

      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="body1" gutterBottom>
          Select Origin and Destination by clicking on the map
        </Typography>
        <Button
          onClick={() => setIsSettingOrigin(!isSettingOrigin)}
          variant="contained"
          sx={{
            backgroundColor: '#111E56',
            color: 'white',
            '&:hover': {
              backgroundColor: 'white',
              color: '#111E56',
              border: '1px solid #111E56',
            },
            mb: 2,
          }}
        >
          {isSettingOrigin ? 'Set Destination' : 'Set Origin'}
        </Button>
      </Box>

      <GoogleMap
        mapContainerStyle={{
          width: '100%',
          marginLeft: '20px',
          height: '500px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
        center={{ lat: 40.7128, lng: -74.006 }} // Default to New York City
        zoom={10}
        onClick={handleMapClick}
      >
        {origin && <Marker position={origin} label="Origin" />}
        {destination && <Marker position={destination} label="Destination" />}
      </GoogleMap>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Button
          onClick={fetchRoute}
          disabled={!origin || !destination}
          variant="contained"
          sx={{
            backgroundColor: '#111E56',
            color: 'white',
            '&:hover': {
              backgroundColor: 'white',
              color: '#111E56',
              border: '1px solid #111E56',
            },
          }}
        >
          Get Route
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
          {error}
        </Typography>
      )}

      {routeData && !loading && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mt: 4 }}>
          {routeData.routes[0].sections
            .filter((section) => section.type !== 'pedestrian')
            .map((section, index) => (
              <Card
                key={index}
                sx={{
                  maxWidth: 500,
                  margin: 2,
                  padding: 2,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                    transform: 'scale(1.02)',
                    transition: 'all 0.3s ease-in-out',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {section.type === 'transit' ? 'Transit Section' : 'Other Section'}
                  </Typography>
                  <Typography>
                    <strong>Departure:</strong> {section.departure.place.name || 'Origin'}
                  </Typography>
                  <Typography>
                    <strong>Arrival:</strong> {section.arrival.place.name || 'Destination'}
                  </Typography>
                  <Typography>
                    <strong>Duration:</strong> {Math.round(section.travelSummary.duration / 60)} mins
                  </Typography>
                  <Typography>
                    <strong>Distance:</strong> {(section.travelSummary.length / 1000).toFixed(2)} km
                  </Typography>

                  {section.type === 'transit' && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" color="textSecondary">
                        <strong>Transport Mode:</strong> {section.transport.category}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Line:</strong> {section.transport.name} ({section.transport.shortName})
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Headsign:</strong> {section.transport.headsign}
                      </Typography>
                    </>
                  )}

                  <Button
                    onClick={() => handleBook(section)}
                    variant="contained"
                    sx={{
                      mt: 2,
                      backgroundColor: '#111E56',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'white',
                        color: '#111E56',
                        border: '1px solid #111E56',
                      },
                    }}
                  >
                    Book
                  </Button>
                </CardContent>
              </Card>
            ))}
        </Box>
      )}

      {!loading && !routeData && (
        <Typography sx={{ mt: 3, textAlign: 'center' }}>
          No route information available.
        </Typography>
      )}
    </Box>
  );
};

export default TransitRoute;
