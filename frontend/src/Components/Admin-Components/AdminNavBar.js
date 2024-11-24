import React from 'react';
import { AppBar, Toolbar, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../../Misc/logo.png';

const AdminNavBar = ({ toggleSidebar }) => {
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

        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Admin Logo" style={{ height: '40px', marginLeft: '10px' }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavBar;
