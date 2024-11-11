import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './GuestNavbar';

const HistoricalPlaces = () => {
    const [places, setPlaces] = useState([]);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [type, setType] = useState('');
    const [tag, setTag] = useState('');

    useEffect(() => {
        fetchHistoricalPlaces();
    }, []);

    const fetchHistoricalPlaces = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('tourists/historical-places', {
                headers: {
                    Authorization: `Bearer ${token}`  // Send the JWT token if logged in
                }
            });

            console.log('API Response:', response.data);

            if (Array.isArray(response.data)) {
                setPlaces(response.data);
            } else {
                setMessage('Invalid data format');
                console.error('Expected an array but received:', typeof response.data);
            }
        } catch (error) {
            setMessage('Error fetching historical places');
            console.error('Error fetching historical places:', error);
        }
    };

    const handleCopyLink = (placeId) => {
        const link = `${window.location.origin}/historical-place/${placeId}`;
        navigator.clipboard.writeText(link)
            .then(() => {
                alert('Link copied to clipboard!');
            })
            .catch((err) => {
                console.error('Error copying link:', err);
            });
    };

    // New function to handle sharing via email
    const handleShareEmail = (place) => {
        const subject = `Check out this historical place: ${place.Name}`;
        const body = `Here is a historical place you might be interested in:\n\nName: ${place.Name}\nLocation: ${place.Location}\nPeriod: ${place.Period}\n\nCheck it out here: ${window.location.origin}/historical-place/${place._id}`;
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        // Construct query string for filtering, searching, and sorting
        let queryString = '';

        if (searchQuery) queryString += `name=${searchQuery}&`;
        if (type) queryString += `type=${type}&`;
        if (tag) queryString += `tag=${tag}&`;  // Assuming tags are comma-separated in the input

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/tourists/historical-places/filter-sort-search?${queryString}`, {
                headers: {
                    Authorization: `Bearer ${token}`  // Send the JWT token if logged in
                }
            });
            console.log('API Response:', response.data);
            setPlaces(response.data); // Update the state with the response data
        } catch (error) {
            console.error('Error fetching historical places:', error.response ? error.response.data : error.message);
        }
    };


    const renderHistoricalPlaceCards = () => {
        if (!Array.isArray(places)) {
            return <p>No historical places available</p>;
        }

        return places.map(place => (
            <div key={place._id} className="place-card" style={cardStyle}>
                <h3>{place.Name}</h3>
                <p><strong>Description:</strong> {place.Description}</p>
                <p><strong>Location:</strong> {place.Location}</p>
                <p><strong>Period:</strong> {place.Period}</p>
                {place.tags && (
                    <p><strong>Tags:</strong> {place.tags.map(tag => tag.name).join(', ')}</p>
                )}
                {place.managedBy && (
                    <p><strong>Managed By:</strong> {place.managedBy.username}</p>
                )}
                 {/* New share functionality added here */}
                 <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button onClick={() => handleCopyLink(place._id)} title="Copy Link" style={shareButtonStyle}>
                        <span role="img" aria-label="link">🔗</span> <span>Copy Link</span>
                    </button>
                    <button onClick={() => handleShareEmail(place)} title="Share via Email" style={shareButtonStyle}>
                        <span role="img" aria-label="email">📧</span> <span>Share via Email</span>
                    </button>
                </div>
            </div>
        ));
    };

    // Styling for the card layout
    const cardStyle = {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        margin: '16px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    };
    // Styling for the share buttons
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

    // Styling for the search form
    const formStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '20px',
    };

    const inputStyle = {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        width: '250px',
        marginRight: '10px',
    };

    const buttonStyle = {
        padding: '10px 15px',
        borderRadius: '5px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        marginLeft: '10px',
    };

    return (
        <div>
            <Navbar />
            <h1>All Historical Places</h1>

            <form onSubmit={handleSearch} style={formStyle}>
                <div>
                    <label>Search by Name:</label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={inputStyle}
                        placeholder="Enter historical place name"
                    />
                </div>

                <div>
                    <label>Tags:</label>
                    <input
                        type="text"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        style={inputStyle}
                        placeholder="Enter tags"
                    />
                </div>

                <button type="submit" style={buttonStyle}>Search</button>
            </form>

            {message && <p>{message}</p>}
            <div className="place-list">
                {renderHistoricalPlaceCards()}
            </div>
        </div>
    );
};

export default HistoricalPlaces;
