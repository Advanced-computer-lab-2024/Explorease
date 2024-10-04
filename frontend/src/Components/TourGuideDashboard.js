import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TourGuideDashboard = () => {
    const [itineraries, setItineraries] = useState([]);
    const [profile, setProfile] = useState({});
    const [message, setMessage] = useState('');
    const [newItinerary, setNewItinerary] = useState({ name: '', date: '', price: '' });

    useEffect(() => {
        const token = localStorage.getItem('token');

        // Fetch tour guide's itineraries
        axios.get('/tourguide/myItineraries', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setItineraries(response.data))
        .catch(error => {
            setMessage('Error fetching itineraries');
            console.error('Error fetching itineraries:', error);
        });

        // Fetch tour guide's profile
        axios.get('/tourguide/myProfile', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setProfile(response.data))
        .catch(error => {
            setMessage('Error fetching profile');
            console.error('Error fetching profile:', error);
        });
    }, []);

    // Handle profile update
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            await axios.put('/tourguide/updateProfile', profile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Profile updated successfully!');
        } catch (error) {
            setMessage('Error updating profile');
        }
    };

    // Handle creating a new itinerary
    const handleItineraryCreate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            await axios.post('/tourguide/createItinerary', newItinerary, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Itinerary created successfully!');
            setNewItinerary({ name: '', date: '', price: '' });
            // Optionally, fetch updated itineraries
            const response = await axios.get('/tour-guides/myItineraries', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItineraries(response.data);
        } catch (error) {
            setMessage('Error creating itinerary');
        }
    };

    return (
        <div>
            <h2>Tour Guide Dashboard</h2>

            {message && <p>{message}</p>}

            <section>
                <h3>Your Profile</h3>
                <form onSubmit={handleProfileUpdate}>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={profile.username || ''}
                            onChange={e => setProfile({ ...profile, username: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={profile.email || ''}
                            onChange={e => setProfile({ ...profile, email: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit">Update Profile</button>
                </form>
            </section>

            <section>
                <h3>Create New Itinerary</h3>
                <form onSubmit={handleItineraryCreate}>
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={newItinerary.name}
                            onChange={e => setNewItinerary({ ...newItinerary, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label>Date:</label>
                        <input
                            type="date"
                            value={newItinerary.date}
                            onChange={e => setNewItinerary({ ...newItinerary, date: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label>Price:</label>
                        <input
                            type="number"
                            value={newItinerary.price}
                            onChange={e => setNewItinerary({ ...newItinerary, price: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit">Create Itinerary</button>
                </form>
            </section>

            <section>
                <h3>Your Itineraries</h3>
                <ul>
                    {itineraries.map(itinerary => (
                        <li key={itinerary._id}>
                            {itinerary.name} - {itinerary.date} - ${itinerary.price}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default TourGuideDashboard;
