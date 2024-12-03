import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, Typography, Box } from '@mui/material';
import Navbar from './GuestNavbar';

const SingleItinerary = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/tourists/itineraries/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
          sx={{
            width: '100%',
            maxWidth: 500,
            boxShadow: 3,
            borderRadius: 3,
            padding: 3,
            backgroundColor: 'white',
          }}
          className="tw-shadow-lg tw-rounded-lg"
        >
          <CardContent>
            <Typography variant="h4" className="tw-text-2xl tw-font-bold tw-text-gray-800">
              {itinerary.name}
            </Typography>
            <Typography className="tw-text-lg tw-text-gray-700 tw-mt-2">
              <strong>Price:</strong> ${itinerary.totalPrice}
            </Typography>
            <Typography className="tw-text-lg tw-text-gray-700 tw-mt-2">
              <strong>Languages:</strong>{' '}
              {Array.isArray(itinerary.LanguageOfTour)
                ? itinerary.LanguageOfTour.join(', ')
                : 'N/A'}
            </Typography>
            <Typography className="tw-text-lg tw-text-gray-700 tw-mt-2">
              <strong>Available Dates:</strong>{' '}
              {Array.isArray(itinerary.AvailableDates)
                ? itinerary.AvailableDates.join(', ')
                : 'N/A'}
            </Typography>
            <Typography className="tw-text-gray-600 tw-mt-4">
              {itinerary.description || 'No description available.'}
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  ) : (
    <p className="tw-text-center tw-text-gray-500">No itinerary found</p>
  );
};

export default SingleItinerary;
