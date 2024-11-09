import React, { useEffect, useState } from 'react';
import axios from 'axios';
const Activities = () => {
    const [activities, setActivities] = useState([]);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('');
    const [tag, setTag] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minRating, setMinRating] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [order, setOrder] = useState('asc');
    const[startDate, setStartDate] = useState('');
    const[endDate, setEndDate] = useState('');
    useEffect(() => {
        fetchActivities();
    }, []);
    const fetchActivities = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('tourists/activities', {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
            console.log('API Response:', response.data);
            if (Array.isArray(response.data)) {
                setActivities(response.data);
            } else {
                setMessage('Invalid data format');
                console.error('Expected an array but received:', typeof response.data);
            }
        } catch (error) {
            setMessage('Error fetching activities');
            console.error('Error fetching activities:', error);
        }
    };

        // New function to handle copying link (Added lines)
        const handleCopyLink = (activityId) => {  
            const link = `${window.location.origin}/activity/${activityId}`;  
            navigator.clipboard.writeText(link)  
                .then(() => {  
                    alert('Link copied to clipboard!');  
                })  
                .catch((err) => {  
                    console.error('Error copying link:', err);  
                });  
        };  
    
        // New function to handle sharing via email (Added lines)
        const handleShareEmail = (activity) => {  
            const subject = `Check out this activity: ${activity.name}`;  
            const body = `Here is an activity you might be interested in:\n\nName: ${activity.name}\nDate: ${new Date(activity.date).toLocaleDateString()}\nLocation: ${activity.location}\nPrice: $${activity.price}\n\nCheck it out here: ${window.location.origin}/activity/${activity._id}`;  
            const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;  
            window.location.href = mailtoLink;  
        };  
    
    const handleSearch = async (e) => {
        e.preventDefault();
    
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
            const token = localStorage.getItem('token');
            const response = await axios.get(`tourists/activities/filter-sort-search?${queryString}`, {
                headers: {
                    Authorization: `Bearer ${token}`  // Send the JWT token if logged in
                }
            });
            console.log('API Response:', response.data);
            setActivities(response.data);
        } catch (error) {
            console.error('Error fetching activities:', error.response ? error.response.data : error.message);
        }
    };
    
    
    // Helper function to render the list of activities without using map()
    const renderActivityCards = () => {
        const activityCards = [];
    
        for (let i = 0; i < activities.length; i++) {
            const activity = activities[i];
            activityCards.push(
                <div key={activity._id} className="activity-card" style={cardStyle}>
                    <h3>{activity.name}</h3>
                    <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {activity.time}</p>
                    <p><strong>Location:</strong> {activity.location}</p>
                    <p><strong>Price:</strong> ${activity.price}</p>
                    <p><strong>Category:</strong> {activity.category?.name}</p>
                    {activity.tags && (
                        <p><strong>Tags:</strong> {activity.tags.map(tag => tag.name).join(', ')}</p>
                    )}
                    <p><strong>Special Discounts:</strong> {activity.specialDiscounts}</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button onClick={() => handleCopyLink(activity._id)} title="Copy Link" style={shareButtonStyle}>
                            <span role="img" aria-label="link">🔗</span> <span>Copy Link</span>
                        </button>
                        <button onClick={() => handleShareEmail(activity)} title="Share via Email" style={shareButtonStyle}>
                            <span role="img" aria-label="email">📧</span> <span>Share via Email</span>
                        </button>
                    </div>
                </div>
            );
        }
    
        return activityCards;
    };
    
            // Styling for the share buttons (Added lines)
            const shareButtonStyle = {
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                cursor: 'pointer',
                fontSize: '14px',
                backgroundColor: '#f9f9f9',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                color: '#333',
                opacity: 1, // Ensure text is fully opaque
                visibility: 'visible' // Ensure the text is visible
            };
            
            

    // Styling for the card layout
    
    const cardStyle = {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        margin: '16px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    };
    return (
        
        <div>
                        <h1>All Activities</h1>
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
            
            {message && <p>{message}</p>}
            <div className="activity-list">
                {activities.length > 0 ? renderActivityCards() : <p>No activities available</p>}
            </div>
        </div>
    );
};
export default Activities;