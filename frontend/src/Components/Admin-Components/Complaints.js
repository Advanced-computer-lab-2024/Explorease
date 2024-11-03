import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch complaints on component mount
    useEffect(() => {
        const fetchComplaints = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('/admins/getAllComplaints', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setComplaints(response.data);
            } catch (error) {
                setErrorMessage('Error fetching complaints.');
            }
        };

        fetchComplaints();
    }, []);

    const handleComplaintClick = (complaint) => {
        setSelectedComplaint(complaint);
    };

    const closeComplaintDetails = () => {
        setSelectedComplaint(null);
    };

    const containerStyle = {
        padding: '20px',
        textAlign: 'center',
    };

    const listStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginTop: '20px',
    };

    const cardStyle = {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '20px',
        maxWidth: '400px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        cursor: 'pointer',
    };

    const statusStyle = {
        display: 'inline-block',
        padding: '5px 10px',
        borderRadius: '5px',
        marginLeft: '10px',
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#fff',
    };

    const pendingStyle = {
        ...statusStyle,
        backgroundColor: '#007bff', // Blue for Pending
    };

    const resolvedStyle = {
        ...statusStyle,
        backgroundColor: '#28a745', // Green for Resolved
    };

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    };

    const modalStyle = {
        backgroundColor: '#fff',
        padding: '20px',
        width: '90%',
        maxWidth: '500px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        position: 'relative',
    };

    const closeButtonStyle = {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'none',
        border: 'none',
        fontSize: '18px',
        cursor: 'pointer',
        color: '#888',
    };

    const errorMessageStyle = {
        color: 'red',
        marginBottom: '20px',
    };

    return (
        <div style={containerStyle}>
            <h2>Complaints</h2>
            {errorMessage && <p style={errorMessageStyle}>{errorMessage}</p>}
            
            <div style={listStyle}>
                {complaints.map((complaint) => (
                    <div
                        key={complaint._id}
                        style={cardStyle}
                        onClick={() => handleComplaintClick(complaint)}
                    >
                        <h3>
                            {complaint.title}
                            <span
                                style={complaint.status === 'Pending' ? pendingStyle : resolvedStyle}
                            >
                                {complaint.status}
                            </span>
                        </h3>
                       
                    </div>
                ))}
            </div>

            {selectedComplaint && (
                <div style={overlayStyle}>
                    <div style={modalStyle}>
                        <button style={closeButtonStyle} onClick={closeComplaintDetails}>X</button>
                        <h3>{selectedComplaint.title}</h3>
                        <p><strong>Status:</strong> {selectedComplaint.status}</p>
                        <p><strong>Details:</strong> {selectedComplaint.body}</p>
                        <p><strong>Submitted by:</strong> {selectedComplaint.touristId.username}</p>
                        <p><strong>Date:</strong> {new Date(selectedComplaint.date).toLocaleString()}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Complaints;
