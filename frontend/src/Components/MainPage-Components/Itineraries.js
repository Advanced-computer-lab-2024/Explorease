import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Itineraries = () => {
    const [itineraries, setItineraries] = useState([]);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minRating, setMinRating] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [order, setOrder] = useState('asc');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [language, setLanguage] = useState('');
    const [accessibility, setAccessibility] = useState('');
    const [tag, setTag] = useState('');

    useEffect(() => {
        fetchItineraries();
    }, []);

    const fetchItineraries = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('tourists/itineraries', {
                headers: {
                    Authorization: `Bearer ${token}`  // Send the JWT token if logged in
                }
            });

            console.log('API Response:', response.data);

            if (Array.isArray(response.data)) {
                setItineraries(response.data);
            } else {
                setMessage('Invalid data format');
                console.error('Expected an array but received:', typeof response.data);
            }
        } catch (error) {
            setMessage('Error fetching itineraries');
            console.error('Error fetching itineraries:', error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
    
        let queryString = '';
    
        // Add parameters to query string
        if (searchQuery) queryString += `searchQuery=${searchQuery}&`;
        if (minPrice) queryString += `minPrice=${minPrice}&`;
        if (maxPrice) queryString += `maxPrice=${maxPrice}&`;
        if (startDate) queryString += `startDate=${startDate}&`;
        if (endDate) queryString += `endDate=${endDate}&`;
        if (minRating) queryString += `minRating=${minRating}&`;
        if (language) queryString += `language=${language}&`;
        if (accessibility) queryString += `accessibility=${accessibility}&`;
        if (tag) queryString += `tags=${tag}&`;
        if (sortBy) queryString += `sortBy=${sortBy}&order=${order}`;
    
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`tourists/itineraries/filter-sort-search?${queryString}`, {
                headers: {
                    Authorization: `Bearer ${token}`  // Send the JWT token if logged in
                }
            });
            console.log('API Response:', response.data);
            setItineraries(response.data);
        } catch (error) {
            console.error('Error fetching itineraries:', error.response ? error.response.data : error.message);
        }
    };

    // Helper function to render the list of itineraries
    const renderItineraryCards = () => {
        const itineraryCards = [];

        for (let i = 0; i < itineraries.length; i++) {
            const itinerary = itineraries[i];
            itineraryCards.push(
                <div key={itinerary._id} className="itinerary-card" style={cardStyle}>
                    <h3>{itinerary.name}</h3>
                    <p><strong>Total Price:</strong> ${itinerary.totalPrice}</p>
                    <p><strong>Languages:</strong> {itinerary.LanguageOfTour.join(', ')}</p>
                    <p><strong>Pick-Up Location:</strong> {itinerary.PickUpLocation}</p>
                    <p><strong>Drop-Off Location:</strong> {itinerary.DropOffLocation}</p>
                    <p><strong>Accessibility:</strong> {itinerary.accessibility}</p>
                    {itinerary.tags && (
                        <p><strong>Tags:</strong> {itinerary.tags.map(tag => tag.name).join(', ')}</p>
                    )}
                    <p><strong>Available Dates:</strong> {itinerary.AvailableDates.map(date => new Date(date).toLocaleDateString()).join(', ')}</p>
                </div>
            );
        }

        return itineraryCards;
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
            <h1>All Itineraries</h1>
            <form onSubmit={handleSearch} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label>Search by Name:</label>
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }} />
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
                    <label>Language:</label>
                    <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc', width: '150px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label>Accessibility:</label>
                    <input type="text" value={accessibility} onChange={(e) => setAccessibility(e.target.value)} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc', width: '150px' }} />
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
            <div className="itinerary-list">
                {itineraries.length > 0 ? renderItineraryCards() : <p>No itineraries available</p>}
            </div>
        </div>
    );
};

export default Itineraries;

