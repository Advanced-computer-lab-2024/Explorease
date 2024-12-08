import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, Typography, Box} from '@mui/material';
import Navbar from './GuestNavBarforGuest';

const SingleItinerary = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await axios.get(`/tourists/itineraries/${id}`, {
        
        });
        setItinerary(response.data);
      } catch (err) {
        setError('Failed to load itinerary');
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [id]);

  if (loading) return <p className="tw-text-center tw-text-gray-500">Loading...</p>;
  if (error) return <p className="tw-text-center tw-text-red-500">{error}</p>;

  return itinerary ? (
    <div>
      <Navbar />
      <div className="tw-flex tw-justify-center tw-mt-10">
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

        
      
      </Card>
      </div>
    </div>
  ) : (
    <p className="tw-text-center tw-text-gray-500">No itinerary found</p>
  );
};

export default SingleItinerary;
