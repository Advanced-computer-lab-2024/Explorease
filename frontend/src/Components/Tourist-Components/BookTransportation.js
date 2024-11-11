import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { Box, Typography, Button, Card, CardContent, Divider } from '@mui/material';

const TransitRoute = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSettingOrigin, setIsSettingOrigin] = useState(true);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDUP5fw3jw8bvJ7yj9OskV5wdm5sNUbII4', // Replace with your API key
    libraries: ['places']
  });

  const fetchRoute = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/transit-route', {
        params: {
          origin: `${origin.lat},${origin.lng}`,
          destination: `${destination.lat},${destination.lng}`
        }
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

  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <Box sx={{ width: '100%', height: '600px', position: 'relative', textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>Select Origin and Destination by clicking on the map</Typography>

      <Button 
        onClick={() => setIsSettingOrigin(!isSettingOrigin)} 
        variant="contained" 
        sx={{ mb: 2 }}
      >
        {isSettingOrigin ? 'Set Destination' : 'Set Origin'}
      </Button>

      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '500px' }}
        center={{ lat: 40.7128, lng: -74.0060 }} // Default to New York City
        zoom={10}
        onClick={handleMapClick}
      >
        {origin && <Marker position={origin} label="Origin" />}
        {destination && <Marker position={destination} label="Destination" />}
      </GoogleMap>

      <Button onClick={fetchRoute} disabled={!origin || !destination} variant="contained" sx={{ mt: 2 }}>
        Get Route
      </Button>

      {loading ? (
        <Typography>Loading route information...</Typography>
      ) : routeData ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', mt: 3 }}>
          {routeData.routes[0].sections
            .filter(section => section.type !== 'pedestrian')
            .map((section, index) => (
              <Card key={index} sx={{ maxWidth: 500, m: 2, p: 2, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{section.type === 'transit' ? 'Transit' : 'Other'} Section</Typography>
                  <Typography><strong>Departure:</strong> {section.departure.place.name || 'Origin'}</Typography>
                  <Typography><strong>Arrival:</strong> {section.arrival.place.name || 'Destination'}</Typography>
                  <Typography><strong>Duration:</strong> {Math.round(section.travelSummary.duration / 60)} mins</Typography>
                  <Typography><strong>Distance:</strong> {(section.travelSummary.length / 1000).toFixed(2)} km</Typography>

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
                    color="primary" 
                    sx={{ mt: 2 }}
                  >
                    Book
                  </Button>
                </CardContent>
              </Card>
            ))
          }
        </Box>
      ) : (
        <Typography>No route information available</Typography>
      )}
    </Box>
  );
};

export default TransitRoute;
