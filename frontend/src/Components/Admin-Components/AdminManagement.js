import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, List, ListItem, ListItemText, IconButton, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CreateAdminForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [admins, setAdmins] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);  // Loading state to track data fetch status

    // Fetch admins on component mount
    useEffect(() => {
        loadAdmins();
    }, []);

    
    // Load all admins from the server
    const loadAdmins = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage("Authorization token missing. Please log in.");
            return;
        }

        try {
            setLoading(true); // Start loading
            const response = await axios.get('/admins/all', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setAdmins(response.data);
            setMessage(''); // Clear any previous error message
        } catch (error) {
            console.error("Error fetching admins:", error);
            setMessage('Error fetching admins. Please check the console for more details.');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Create a new admin
    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage("Authorization token missing. Please log in.");
            return;
        }

        try {
            await axios.post('/admins/add', {
                username,
                email,
                password,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setMessage('Admin created successfully!');
            setUsername('');
            setEmail('');
            setPassword('');
            loadAdmins(); // Refresh the admin list
        } catch (error) {
            console.error("Error creating admin:", error);
            setMessage('Error creating admin. Please check the console for more details.');
        }
    };

    // Delete an admin
    const handleDeleteAdmin = async (adminId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage("Authorization token missing. Please log in.");
            return;
        }

        try {
            await axios.delete(`/admins/delete/${adminId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setMessage('Admin deleted successfully!');
            loadAdmins(); // Refresh the admin list
        } catch (error) {
            console.error("Error deleting admin:", error);
            setMessage('Error deleting admin. Please check the console for more details.');
        }
    };

    return (
        <Box sx={{ maxWidth: 500, mx: 'auto', mt: 2, p: 3, boxShadow: 2, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
                Create New Admin
            </Typography>
            {message && (
                <Typography 
                    variant="body2" 
                    sx={{ color: message.includes('successfully') ? 'green' : 'red', mb: 2 }}
                >
                    {message}
                </Typography>
            )}
            <form onSubmit={handleCreateAdmin}>
                <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ backgroundColor: '#111E56', 
                            color: 'white', 
                            border: '2px solid #111E56',
                            '&:hover': { 
                                backgroundColor: 'white', 
                                color: '#111E56',
                                border: '2px solid #111E56', // Optional: adds a border to match the dark blue on hover
                            },mt: 2 }}>
                    Create Admin
                </Button>
            </form>

            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Manage Admins
            </Typography>
            <Divider />

            {loading ? (
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Loading admins...
                </Typography>
            ) : (
                <List>
                    {admins.length === 0 ? (
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            No admins found.
                        </Typography>
                    ) : (
                        admins.map((admin) => (
                            <ListItem
                                key={admin._id}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteAdmin(admin._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemText primary={admin.username} secondary={admin.email} />
                            </ListItem>
                        ))
                    )}
                </List>
            )}
        </Box>
    );
};

export default CreateAdminForm;
