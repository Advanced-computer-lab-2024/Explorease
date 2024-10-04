import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TouristDashboard = () => {
    const [activities, setActivities] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [profile, setProfile] = useState({});
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');  // Assuming JWT is stored in localStorage after login

        // Fetch tourist's profile with JWT token
        axios.get('/tourists/myProfile', {
            headers: {
                Authorization: `Bearer ${token}`  // Add JWT token to the request headers
            }
        })
        .then(response => setProfile(response.data))
        .catch(error => {
            setMessage('Error fetching profile');
            console.error('Error fetching profile:', error);  // Log the error for debugging
        });

        // Fetch tourist's booked activities
        axios.get('/tourists/activities', {
            headers: {
                Authorization: `Bearer ${token}`  // Add JWT token to the request headers
            }
        })
        .then(response => setActivities(response.data))
        .catch(error => setMessage('Error fetching activities'));

        // Fetch tourist's itineraries
        axios.get('/tourists/itineraries', {
            headers: {
                Authorization: `Bearer ${token}`  // Add JWT token to the request headers
            }
        })
        .then(response => setItineraries(response.data))
        .catch(error => setMessage('Error fetching itineraries'));

    }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            await axios.put('/tourists/myProfile', profile, {
                headers: {
                    Authorization: `Bearer ${token}`  // Add JWT token to the request headers
                }
            });
            setMessage('Profile updated successfully!');
        } catch (error) {
            setMessage('Error updating profile');
        }
    };

    return (
        <div>
            <h2>Tourist Dashboard</h2>

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
                <h3>Your Booked Activities</h3>
                <ul>
                    {activities.map(activity => (
                        <li key={activity._id}>
                            {activity.name} - {activity.date} - {activity.location}
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h3>Your Itineraries</h3>
                <ul>
                    {itineraries.map(itinerary => (
                        <li key={itinerary._id}>
                            {itinerary.name} - {itinerary.date} - {itinerary.totalPrice} USD
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default TouristDashboard;
