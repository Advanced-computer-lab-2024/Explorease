// src/components/admin/ManageUsers.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageUsers = () => {
    const [tourists, setTourists] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [tourismGovernors, setTourismGovernors] = useState([]);
    const [tourGuides, setTourGuides] = useState([]);
    const [advertisers, setAdvertisers] = useState([]);
    const [userMessage, setUserMessage] = useState('');

    // Fetch all user types when component mounts
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        try {
            const [touristsRes, sellersRes, governorsRes, guidesRes, advertisersRes] = await Promise.all([
                axios.get('/admins/tourists', { headers }),
                axios.get('/admins/sellers', { headers }),
                axios.get('/admins/tourismGovernors', { headers }),
                axios.get('/admins/tourGuides', { headers }),
                axios.get('/admins/advertisers', { headers }),
            ]);

            setTourists(touristsRes.data);
            setSellers(sellersRes.data);
            setTourismGovernors(governorsRes.data);
            setTourGuides(guidesRes.data);
            setAdvertisers(advertisersRes.data);
        } catch (error) {
            setUserMessage('Error fetching users.');
            console.error(error);
        }
    };

    const deleteUser = async (id, userType) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/admins/deleteUser/${id}/${userType}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserMessage(`${userType} deleted successfully!`);
            fetchUsers(); // Refresh the user lists after deletion
        } catch (error) {
            console.error(`Error deleting ${userType}:`, error.response ? error.response.data : error.message);
            setUserMessage(`Error deleting ${userType}.`);
        }
    };

    return (
        <div className="section">
            <h2>Manage Users</h2>

            {userMessage && <p>{userMessage}</p>}

            {/* Tourists */}
            <h3>Tourists</h3>
            <ul className="admin-list">
                {tourists.length === 0 ? (
                    <p>No tourists found</p>
                ) : (
                    tourists.map(user => (
                        <li key={user._id}>
                            <p>{user.username} - {user.email}</p>
                            <button
                                onClick={() => deleteUser(user._id, 'tourist')}
                                style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Delete Tourist
                            </button>
                        </li>
                    ))
                )}
            </ul>

            {/* Sellers */}
            <h3>Sellers</h3>
            <ul className="admin-list">
                {sellers.length === 0 ? (
                    <p>No sellers found</p>
                ) : (
                    sellers.map(user => (
                        <li key={user._id}>
                            <p>{user.username} - {user.email}</p>
                            <button
                                onClick={() => deleteUser(user._id, 'seller')}
                                style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Delete Seller
                            </button>
                        </li>
                    ))
                )}
            </ul>

            {/* Tourism Governors */}
            <h3>Tourism Governors</h3>
            <ul className="admin-list">
                {tourismGovernors.length === 0 ? (
                    <p>No tourism governors found</p>
                ) : (
                    tourismGovernors.map(user => (
                        <li key={user._id}>
                            <p>{user.username} - {user.email}</p>
                            <button
                                onClick={() => deleteUser(user._id, 'tourismGovernor')}
                                style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Delete Tourism Governor
                            </button>
                        </li>
                    ))
                )}
            </ul>

            {/* Tour Guides */}
            <h3>Tour Guides</h3>
            <ul className="admin-list">
                {tourGuides.length === 0 ? (
                    <p>No tour guides found</p>
                ) : (
                    tourGuides.map(user => (
                        <li key={user._id}>
                            <p>{user.username} - {user.email}</p>
                            <button
                                onClick={() => deleteUser(user._id, 'tourGuide')}
                                style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Delete Tour Guide
                            </button>
                        </li>
                    ))
                )}
            </ul>

            {/* Advertisers */}
            <h3>Advertisers</h3>
            <ul className="admin-list">
                {advertisers.length === 0 ? (
                    <p>No advertisers found</p>
                ) : (
                    advertisers.map(user => (
                        <li key={user._id}>
                            <p>{user.username} - {user.email}</p>
                            <button
                                onClick={() => deleteUser(user._id, 'advertiser')}
                                style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Delete Advertiser
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default ManageUsers;
