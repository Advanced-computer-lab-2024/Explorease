import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const mapContainerStyle = {
    width: '100%',
    height: '200px',
};




const MyActivities = () => {
    const [activities, setActivities] = useState([]); // Ensure this is initialized as an array
    const [message, setMessage] = useState('');
    const [editingActivity, setEditingActivity] = useState(null);  // Track which activity is being edited
    const [updatedFields, setUpdatedFields] = useState({});  // Track updated fields
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('');
    const [tag, setTag] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minRating, setMinRating] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [order, setOrder] = useState('asc');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // Replace with your actual API key
    });

    // Fetch the activities when the component mounts
    const fetchActivities = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await axios.get('/advertiser/getMyActivities', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Ensure the response data is an array
            if (Array.isArray(response.data)) {
                setActivities(response.data);  // Set the activities in state
            } else {
                setMessage('No activities found');
                setActivities([]);  // Set an empty array if the response isn't an array
            }
        } catch (error) {
            setMessage('Error fetching activities');
            setActivities([]);  // Handle error by setting activities to an empty array
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    // Handle the Delete action
    const handleDelete = async (activityId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await axios.delete(`/advertiser/deleteActivity/${activityId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setMessage('Activity deleted successfully');
                // Remove the deleted activity from the list
                setActivities(activities.filter(activity => activity._id !== activityId));
            } else {
                setMessage('Error deleting activity');
            }
        } catch (error) {
            setMessage('Error deleting activity');
        }
    };

    // Handle the Update action (you can redirect to the update page or set up a modal)
    const handleUpdate = async (activityId) => {
        const token = localStorage.getItem('token');
        if (!token || !updatedFields[activityId]) return;

        try {
            const response = await axios.put(`/advertiser/updateActivity/${activityId}`, updatedFields[activityId], {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setMessage('Activity updated successfully');
                setEditingActivity(null);  // Exit edit mode
                // Update the activity in the list
                setActivities(activities.map(activity => activity._id === activityId ? response.data.updatedActivity : activity));
            } else {
                setMessage('Error updating activity');
            }
        } catch (error) {
            setMessage('Error updating activity');
        }
    };

    // Enable editing for a specific activity
    const enableEdit = (activityId) => {
        setEditingActivity(activityId);
        setUpdatedFields({ ...updatedFields, [activityId]: {} });  // Initialize updated fields for this activity
    };

    // Handle input changes for editable fields
    const handleFieldChange = (activityId, field, value) => {
        setUpdatedFields({
            ...updatedFields,
            [activityId]: {
                ...updatedFields[activityId],
                [field]: value,
            },
        });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        await filterSortSearchActivities();
    };

    const filterSortSearchActivities = async () => {
        const token = localStorage.getItem('token');

        let queryString = '';

        // Add parameters to query string
        if (searchQuery) queryString += `searchQuery=${searchQuery}&`;
        if (category) queryString += `category=${category}&`;
        if (tag) queryString += `tag=${tag}&`;
        if (minPrice) queryString += `minPrice=${minPrice}&`;
        if (maxPrice) queryString += `maxPrice=${maxPrice}&`;
        if (startDate) queryString += `startDate=${startDate}&`;
        if (endDate) queryString += `endDate=${endDate}&`;
        if (minRating) queryString += `minRating=${minRating}&`;
        if (sortBy) queryString += `sortBy=${sortBy}&order=${order}`;

        



        try {
            const response = await axios.get(`/advertiser/filter-sort-search?${queryString}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('API Response:', response.data);
            // Ensure the response data is an array
            if (Array.isArray(response.data)) {
                setActivities(response.data);
            } else {
                setMessage('No activities found');
                setActivities([]);  // Set an empty array if the response isn't an array
            }
        } catch (error) {
            setMessage('Error fetching activities');
            setActivities([]);  // Handle error by setting activities to an empty array
        }
    };

    return (
        <div>
            <h2>My Activities</h2>
            {message && <p>{message}</p>}

            <form onSubmit={handleSearch} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label>Search by Name:</label>
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }} />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label>Category:</label>
                    <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label>Start Date:</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label>End Date:</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label>Min Price:</label>
                    <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc', width: '100px' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label>Max Price:</label>
                    <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc', width: '100px' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label>Min Rating:</label>
                    <input type="number" value={minRating} onChange={(e) => setMinRating(e.target.value)} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc', width: '100px' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label>Tag:</label>
                    <input type="text" value={tag} onChange={(e) => setTag(e.target.value)} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc', width: '150px' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label>Sort By:</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}>
                        <option value="">Select</option>
                        <option value="price">Price</option>
                        <option value="ratings">Rating</option>
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label>Order:</label>
                    <select value={order} onChange={(e) => setOrder(e.target.value)} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>

                <button type="submit" style={{ padding: '10px 15px', borderRadius: '5px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    Search & Filter
                </button>
            </form>


            <div style={containerStyle}>
                {/* Ensure activities is an array before mapping */}
                {Array.isArray(activities) && activities.length > 0 ? (
                    activities.map((activity) => (
                        <div key={activity._id} style={cardStyle}>
                            {editingActivity === activity._id ? (
                                // Render input fields when editing
                                <>
                                    <input
                                        type="text"
                                        defaultValue={activity.name}
                                        onChange={(e) => handleFieldChange(activity._id, 'name', e.target.value)}
                                    />
                                    <input
                                        type="date"
                                        defaultValue={new Date(activity.date).toISOString().split('T')[0]}
                                        onChange={(e) => handleFieldChange(activity._id, 'date', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        defaultValue={activity.location}
                                        onChange={(e) => handleFieldChange(activity._id, 'location', e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        defaultValue={activity.price}
                                        onChange={(e) => handleFieldChange(activity._id, 'price', e.target.value)}
                                    />
                                    <div style={buttonContainerStyle}>
                                        <button onClick={() => handleUpdate(activity._id)} style={buttonStyle}>Save</button>
                                        <button onClick={() => setEditingActivity(null)} style={buttonStyle}>Cancel</button>
                                    </div>
                                </>
                            ) : (
                                // Render normal view when not editing
                                <>
                                    <h3>{activity.name}</h3>
                                    <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
                                    {isLoaded && activity.latitude && activity.longitude && (
                                        <GoogleMap
                                            mapContainerStyle={mapContainerStyle}
                                            zoom={10}
                                            center={{ lat: activity.latitude, lng: activity.longitude }}
                                        >
                                            <Marker position={{ lat: activity.latitude, lng: activity.longitude }} />
                                        </GoogleMap>
                                    )}

                                    <p><strong>Price:</strong> ${activity.price}</p>
                                    <div style={buttonContainerStyle}>
                                        <button onClick={() => enableEdit(activity._id)} style={buttonStyle}>Edit</button>
                                        <button onClick={() => handleDelete(activity._id)} style={deleteButtonStyle}>Delete</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No activities to display</p>
                )}
            </div>
        </div>
    );
};

// CSS for styling
const containerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
};

const cardStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
};

const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '10px',
};

const buttonStyle = {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
};

const deleteButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#dc3545',  // Red for delete button
};

export default MyActivities;
