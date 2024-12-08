import React from 'react';
import { Box, Typography } from '@mui/material';

const DashboardWelcome = (profilee) => {
  return (
    <Box
      sx={{
        height: '90vh', // Full viewport height
        objectFit: 'cover',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 2,
        boxSizing: 'border-box',
        borderRadius: '8px', // Optional: rounded corners for the container
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Soft shadow for the container
      }}
    >
      <Typography
        variant="h2"
        sx={{
          color: 'white', // Text color
          fontWeight: 'bold',
          letterSpacing: '2px',
          fontSize: { xs: '2rem', sm: '3rem', md: '4rem' }, // Responsive font size
          textTransform: 'uppercase', // Uppercase text for emphasis
          lineHeight: '1.2',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', // Subtle text shadow for contrast
          padding: '10px 20px',
        }}
      >
        Welcome, {profilee.username || 'User'}!
      </Typography>
      
    </Box>
  );
};

export default DashboardWelcome;
