import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [responseText, setResponseText] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState('newest');

    useEffect(() => {
        fetchComplaints();
    }, []);

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

    const handleComplaintClick = (complaint) => {
        setSelectedComplaint(complaint);
        setResponseText('');
    };

    const closeComplaintDetails = () => {
        setSelectedComplaint(null);
    };

    const handleResponseSubmit = async (complaintId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`/admins/adminRespondToComplaint/${complaintId}`, 
                { response: responseText},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setComplaints(prevComplaints => 
                prevComplaints.map(complaint => 
                    complaint._id === complaintId 
                        ? {...complaint, status: 'Resolved'} 
                        : complaint
                )
            );
            setSelectedComplaint(null);
        } catch (error) {
            setErrorMessage('Error submitting response.');
        }
    };

    const containerStyle = {
        padding: '20px',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto',
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
        width: '100%',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'left',
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

    const textareaStyle = {
        width: '80%',
        minHeight: '100px',
        padding: '10px',
        marginTop: '10px',
        marginBottom: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    };

    const submitButtonStyle = {
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    };

    const filterSortStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
    };

    const selectStyle = {
        padding: '5px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    };

    const filteredComplaints = complaints
        .filter(complaint => statusFilter === 'All' || complaint.status === statusFilter)
        .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

    return (
        <div style={containerStyle}>
            <h2>Complaints</h2>
            {errorMessage && <p style={errorMessageStyle}>{errorMessage}</p>}
            
            <div style={filterSortStyle}>
                <select 
                    style={selectStyle}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Resolved</option>
                </select>
                <select 
                    style={selectStyle}
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>
            
            <div style={listStyle}>
                {filteredComplaints.map((complaint) => (
                    <div
                        key={complaint._id}
                        style={cardStyle}
                        onClick={() => handleComplaintClick(complaint)}
                    >
                        <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                        <textarea
                            style={textareaStyle}
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            placeholder="Type your response here..."
                        />
                        <button
                            style={submitButtonStyle}
                            onClick={() => handleResponseSubmit(selectedComplaint._id)}
                        >
                            Submit Response
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Complaints;