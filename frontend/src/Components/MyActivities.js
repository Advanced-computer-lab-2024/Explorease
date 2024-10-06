import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyActivities = () => {
    const [activities, setActivities] = useState([]);
    const [message, setMessage] = useState('');
    const [editingActivity, setEditingActivity] = useState(null);  // Track which activity is being edited
    const [updatedFields, setUpdatedFields] = useState({});  // Track updated fields

    // Fetch the activities when the component mounts
    useEffect(() => {
        const fetchActivities = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await axios.get('/advertiser/getMyActivities', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data) {
                    setActivities(response.data);  // Set the activities in state
                } else {
                    setMessage('No activities found');
                }
            } catch (error) {
                setMessage('Error fetching activities');
            }
        };

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

    return (
        <div>
            <h2>My Activities</h2>
            {message && <p>{message}</p>}
            <div style={containerStyle}>
                {activities.length > 0 ? (
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
                                    <p><strong>Location:</strong> {activity.location}</p>
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
