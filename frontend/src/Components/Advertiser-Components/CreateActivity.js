import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const mapContainerStyle = {
    width: "100%",
    height: "400px",
};

const center = {
    lat: 31.205753, // Default latitude (e.g., Cairo, Egypt)
    lng: 29.924526, // Default longitude
};

const CreateActivity = () => {
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        time: '', 
        location: '',
        latitude: 0,
        longitude: 0,
        price: '',
        category: '',
        tags: '',
        specialDiscounts: '',
        bookingOpen: false,
        duration: ''
    });

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // Replace with your API key
    });

    const handleMapClick = (event) => {
        setFormData({
            ...formData,
            latitude: event.latLng.lat(),
            longitude: event.latLng.lng(),
            location: `${event.latLng.lat()}, ${event.latLng.lng()}`, // Save location as a string
        });
    };

    const [categories, setCategories] = useState([]);  // Initialize categories as an empty array
    const [tags, setTags] = useState([]);  // Initialize tags as an empty array
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchCategoriesAndTags = async () => {
            const token = localStorage.getItem('token');

            try {
                // Fetch categories
                const categoriesResponse = await axios.get('/admins/getCategories', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log('Categories Response:', categoriesResponse.data);  // Log the response
                if (Array.isArray(categoriesResponse.data)) {
                    setCategories(categoriesResponse.data);  // Set the fetched categories only if it's an array
                } else {
                    setCategories([]);  // Fallback to an empty array if it's not an array
                }

                // Fetch tags
                const tagsResponse = await axios.get('/admins/getTags', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log('Tags Response:', tagsResponse.data);  // Log the response
                if (Array.isArray(tagsResponse.data)) {
                    setTags(tagsResponse.data);  // Set the fetched tags only if it's an array
                } else {
                    setTags([]);  // Fallback to an empty array if it's not an array
                }

            } catch (error) {
                setMessage('Error fetching categories or tags');
            }
        };

        fetchCategoriesAndTags();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTagChange = (e) => {
        const selectedTags = Array.from(e.target.selectedOptions, option => option.value);  // Convert selected options into an array of tag names
        setFormData({ ...formData, tags: selectedTags });  // Set the tags as an array of selected values
    };
    
    const handleCheckboxChange = (e) => {
        setFormData({ ...formData, bookingOpen: e.target.checked });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) return;

        if (!formData.latitude || !formData.longitude) {
            setMessage('Please select a location on the map.');
            return;
        }

        try {
            const response = await axios.post('/advertiser/createActivity', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 201) {
                setMessage('Activity created successfully');
                setFormData({
                    name: '',
                    date: '',
                    time: '',
                    location: '',
                    latitude: 0,
                    longitude: 0,
                    price: '',
                    category: '',
                    tags: '',
                    specialDiscounts: '',
                    bookingOpen: false,
                    duration: ''
                });
            } else {
                setMessage('Error creating activity');
            }
        } catch (error) {
            setMessage('Error creating activity');
        }
    };

    const formStyle = {
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    };
    
    const formGroupStyle = {
        marginBottom: '15px',
        display: 'flex',
        flexDirection: 'column'
    };
    
    const labelStyle = {
        marginBottom: '5px',
        fontWeight: 'bold',
        fontSize: '14px',
        color: '#333'
    };
    
    const inputStyle = {
        padding: '10px',
        fontSize: '14px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box'
    };
    
    const selectStyle = {
        padding: '10px',
        fontSize: '14px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box'
    };
    
    const buttonStyle = {
        padding: '10px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        width: '100%',
        boxSizing: 'border-box',
        marginTop: '20px'
    };
    
    const errorStyle = {
        marginBottom: '15px',
        color: 'red',
        fontWeight: 'bold'
    };
    
    const successStyle = {
        marginBottom: '15px',
        color: 'green',
        fontWeight: 'bold'
    };

    return (
        <div style={formStyle}>
            <h2>Create Activity</h2>
            {message && <p style={message.includes("Error") ? errorStyle : successStyle}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Date:</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required style={inputStyle} />
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Time:</label>
                    <input type="time" name="time" value={formData.time} onChange={handleChange} required style={inputStyle} />
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Select Location on Map:</label>
                    {isLoaded ? (
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            zoom={10}
                            center={center}
                            onClick={handleMapClick}
                        >
                            {formData.latitude && formData.longitude && (
                                <Marker position={{ lat: formData.latitude, lng: formData.longitude }} />
                            )}
                        </GoogleMap>
                    ) : (
                        <p>Loading map...</p>
                    )}
                </div>
                
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Price:</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} required style={inputStyle} />
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Category:</label>
                    <select name="category" value={formData.category} onChange={handleChange} required style={selectStyle}>
                        <option value="">Select a Category</option>
                        {Array.isArray(categories) && categories.map(category => (
                            <option key={category._id} value={category.name}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Tags (select multiple):</label>
                    <select multiple={true} name="tags" value={formData.tags} onChange={handleTagChange} required style={selectStyle}>
                        <option value="">Select Tags</option>
                        {Array.isArray(tags) && tags.map(tag => (
                            <option key={tag._id} value={tag.name}>{tag.name}</option>
                        ))}
                    </select>
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Special Discounts:</label>
                    <input type="text" name="specialDiscounts" value={formData.specialDiscounts} onChange={handleChange} style={inputStyle} />
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Duration (hours):</label>
                    <input type="number" name="duration" value={formData.duration} onChange={handleChange} required style={inputStyle} />
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Booking Open:</label>
                    <input type="checkbox" name="bookingOpen" checked={formData.bookingOpen} onChange={handleCheckboxChange} />
                </div>
                <button type="submit" style={buttonStyle}>Create Activity</button>
            </form>
        </div>
    );
};

export default CreateActivity;
