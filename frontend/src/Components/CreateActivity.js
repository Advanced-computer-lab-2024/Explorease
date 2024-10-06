import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateActivity = () => {
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        time: '',
        location: '',
        price: '',
        category: '',
        tags: '',  // Single tag selection
        specialDiscounts: '',
        bookingOpen: false,
        duration: ''
    });
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
        const selectedTag = e.target.value;  // Get the selected tag value
        setFormData({ ...formData, tags: selectedTag });  // Update formData with a single tag
    };

    const handleCheckboxChange = (e) => {
        setFormData({ ...formData, bookingOpen: e.target.checked });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) return;
        console.log('Form Data:', formData);

        try {
            const response = await axios.post('/advertiser/createActivity', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 201) {
                setMessage('Activity created successfully');
            } else {
                setMessage('Error creating activity');
            }
        } catch (error) {
            setMessage('Error creating activity');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Create Activity</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Date:</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                </div>
                <div>
                    <label>Time:</label>
                    <input type="time" name="time" value={formData.time} onChange={handleChange} required />
                </div>
                <div>
                    <label>Location:</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} required />
                </div>
                <div>
                    <label>Price:</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                </div>
                <div>
                    <label>Category:</label>
                    <select name="category" value={formData.category} onChange={handleChange} required>
                        <option value="">Select a Category</option>
                        {Array.isArray(categories) && categories.map(category => (
                            <option key={category._id} value={category.name}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Tag:</label> {/* Modified label for single tag */}
                    <select name="tags" value={formData.tags} onChange={handleTagChange} required>
                        <option value="">Select a Tag</option>
                        {Array.isArray(tags) && tags.map(tag => (
                            <option key={tag._id} value={tag.name}>{tag.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Special Discounts:</label>
                    <input type="text" name="specialDiscounts" value={formData.specialDiscounts} onChange={handleChange} />
                </div>
                <div>
                    <label>Duration (hours):</label>
                    <input type="number" name="duration" value={formData.duration} onChange={handleChange} required />
                </div>
                <div>
                    <label>Booking Open:</label>
                    <input type="checkbox" name="bookingOpen" checked={formData.bookingOpen} onChange={handleCheckboxChange} />
                </div>
                <button type="submit" style={{ padding: '10px', marginTop: '10px' }}>Create Activity</button>
            </form>
        </div>
    );
};

export default CreateActivity;
