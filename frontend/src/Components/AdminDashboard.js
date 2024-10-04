import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import axios from 'axios';

const AdminDashboard = () => {
    const [newAdminUsername, setNewAdminUsername] = useState('');
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [newAdminPassword, setNewAdminPassword] = useState('');
    const [admins, setAdmins] = useState([]);  // State for storing admins only
    const [message, setMessage] = useState('');
    const navigate = useNavigate();  // For redirecting the user

    // Function to create a new admin
    const createNewAdmin = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('/admins/add', {
                username: newAdminUsername,
                email: newAdminEmail,
                password: newAdminPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setMessage('New admin created successfully!');
            fetchAdmins();  // Refresh the list of admins after creation
        } catch (error) {
            setMessage('Error creating new admin.');
        }
    };

    // Fetch all admins
    const fetchAdmins = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('/admins/all', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setAdmins(response.data);
        } catch (error) {
            setMessage('Error fetching admins.');
        }
    };

    // Function to delete an admin
    const deleteAdmin = async (adminId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/admins/delete/${adminId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setMessage('Admin deleted successfully!');
            fetchAdmins();  // Refresh the list of admins after deletion
        } catch (error) {
            setMessage('Error deleting admin.');
        }
    };

    // // Logout function: Clears token and redirects to login page
    // const handleLogout = () => {
    //     localStorage.removeItem('token');  // Clear the JWT token
    //     navigate('/admin/login');  // Redirect to login page
    // };

    // // Protect the dashboard route by checking if the token exists
    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     if (!token) {
    //         navigate('/admin/login');  // If no token, redirect to login page
    //     } else {
    //         fetchAdmins();  // Fetch admins if token exists
    //     }
    // }, [navigate]);

    return (
        <div>
            <h1>Welcome to the Admin Dashboard</h1>
            {message && <p>{message}</p>}



            <h2>Create New Admin</h2>
            <form onSubmit={createNewAdmin}>
                <div>
                    <label>New Admin Username:</label>
                    <input
                        type="text"
                        value={newAdminUsername}
                        onChange={(e) => setNewAdminUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>New Admin Email:</label>
                    <input
                        type="email"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>New Admin Password:</label>
                    <input
                        type="password"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Admin</button>
            </form>

            <h2>Manage Admins</h2>
            {admins.length === 0 ? (
                <p>No admins found.</p>
            ) : (
                <ul>
                    {admins.map(admin => (
                        <li key={admin._id}>
                            {admin.username} ({admin.email})
                            <button onClick={() => deleteAdmin(admin._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminDashboard;
