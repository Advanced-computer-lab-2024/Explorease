import React from 'react';
import { AppBar, Toolbar, IconButton, Box, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import logo from '../../Misc/logo.png';

const AdminNavBar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the admin token
    localStorage.removeItem('token');
    // Redirect to the homepage
    navigate('/');
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#111E56', zIndex: 1000 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Hamburger Menu */}
        <IconButton
          onClick={toggleSidebar}
          sx={{
            color: 'white',
            backgroundColor: 'transparent',
            '&:hover': { backgroundColor: 'transparent' },
            padding: 0,
            margin: 0,
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo and Logout */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Clickable Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            <img
              src={logo}
              alt="Admin Logo"
              style={{
                height: '50px', // Slightly larger logo
                marginLeft: '10px',
              }}
            />
          </Box>

          {/* Logout Icon */}
          <Tooltip title="Logout">
  <IconButton
    onClick={handleLogout}
    sx={{
      color: 'white',
      transition: 'transform 0.2s ease-in-out', // Smooth scaling and translation
      '&:hover': {
        transform: 'scale(1.2) translateY(2.5px)', // Increase size and move down slightly
        
      },
    }}
  >
    <LogoutIcon />
  </IconButton>
</Tooltip>


        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavBar;
