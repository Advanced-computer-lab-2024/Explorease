import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
    const [newAdminUsername, setNewAdminUsername] = useState('');
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [newAdminPassword, setNewAdminPassword] = useState('');
    const [admins, setAdmins] = useState([]);  // State for storing admins only
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    // State for storing new tourist governor details
    const [governorUsername, setGovernorUsername] = useState('');
    const [governorEmail, setGovernorEmail] = useState('');
    const [governorPassword, setGovernorPassword] = useState('');

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

    // Function to add a new tourist governor
    const handleAddGovernor = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('/admins/addGovernor', {
                username: governorUsername,
                email: governorEmail,
                password: governorPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setMessage('New tourist governor created successfully!');
            setGovernorUsername('');  // Clear the form
            setGovernorEmail('');
            setGovernorPassword('');
        } catch (error) {
            console.error('Error creating tourist governor:', error.response ? error.response.data : error.message);
            setMessage('Error creating tourist governor.');
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
            setAdmins(response.data);  // Set the admins after the fetch is complete
            setLoading(false);  // Turn off loading state
        } catch (error) {
            setMessage('Error fetching admins.');
            setLoading(false);  // Turn off loading state in case of an error
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

    // Protect the dashboard route by checking if the token exists
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/admin/login');  // If no token, redirect to login page
        } else {
            fetchAdmins();  // Fetch admins if token exists
        }
    }, [navigate]);

    if (loading) {
        return <p>Loading admins...</p>;
    }

    return (
        <div>
            <h1>Welcome to the Admin Dashboard</h1>
            

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
                <p>{message}</p>
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

            {/* Section to add a new Tourist Governor */}
            <div>
                <h2>Add Tourist Governor</h2>
                <form onSubmit={handleAddGovernor}>
                    <div>
                        <label>Governor Username:</label>
                        <input
                            type="text"
                            value={governorUsername}
                            onChange={(e) => setGovernorUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Governor Email:</label>
                        <input
                            type="email"
                            value={governorEmail}
                            onChange={(e) => setGovernorEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Governor Password:</label>
                        <input
                            type="password"
                            value={governorPassword}
                            onChange={(e) => setGovernorPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Add Tourist Governor</button>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;
