import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    IconButton,
    Divider,
} from '@mui/material';
import { Delete, Edit, Save, Cancel } from '@mui/icons-material';

const PromoCodes = () => {
    const [name, setName] = useState('');
    const [percentage, setPercentage] = useState('');
    const [activeUntil, setActiveUntil] = useState('');
    const [promoCodes, setPromoCodes] = useState([]);
    const [editPromoId, setEditPromoId] = useState(null);
    const [editFields, setEditFields] = useState({});

    // Fetch all promo codes
    const fetchPromoCodes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/admins/getPromoCodes', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPromoCodes(response.data.promoCodes);
        } catch (error) {
            console.error('Error fetching promo codes:', error);
        }
    };

    // Create a new promo code
    const handleCreatePromo = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                '/admins/createPromoCode',
                { name, percentage, activeUntil },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setName('');
            setPercentage('');
            setActiveUntil('');
            fetchPromoCodes();
        } catch (error) {
            console.error('Error creating promo code:', error);
        }
    };

    // Save updated promo code
    const handleSaveEdit = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `/admins/updatePromoCode/${id}`,
                editFields,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEditPromoId(null);
            fetchPromoCodes();
        } catch (error) {
            console.error('Error saving promo code edits:', error);
        }
    };

    // Delete a promo code
    const handleDeletePromo = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/admins/deletePromoCode/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchPromoCodes();
        } catch (error) {
            console.error('Error deleting promo code:', error);
        }
    };

    // Start editing a promo code
    const handleEditPromo = (promo) => {
        setEditPromoId(promo._id);
        setEditFields({ ...promo });
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditPromoId(null);
        setEditFields({});
    };

    // Handle changes in editable fields
    const handleFieldChange = (field, value) => {
        setEditFields((prev) => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    return (
        <Box sx={{ p: 4 }}>
            {/* Create Promo Code Section */}
            <Box
                sx={{
                    textAlign: 'center',
                    maxWidth: 500,
                    margin: '0 auto',
                    padding: 3,
                    backgroundColor: '#f9f9f9',
                    borderRadius: 2,
                    boxShadow: 3,
                    mb: 4,
                }}
            >
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Create Promo Code
                </Typography>
                <TextField
                    label="Promo Code Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Discount Percentage"
                    type="number"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Active Until"
                    type="date"
                    value={activeUntil}
                    onChange={(e) => setActiveUntil(e.target.value)}
                    fullWidth
                    sx={{ mb: 3 }}
                    InputLabelProps={{ shrink: true }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreatePromo}
                    sx={{
                        backgroundColor: '#111E56',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'white',
                            color: '#111E56',
                            border: '1px solid #111E56',
                        },
                    }}
                >
                    Create Promo Code
                </Button>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Manage Promo Codes Section */}
            <Typography variant="h5" sx={{ mb: 3 }}>
                Manage Promo Codes
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {promoCodes.map((promo) => (
                    <Card
                        key={promo._id}
                        sx={{
                            width: 300,
                            boxShadow: 3,
                            borderRadius: 2,
                            position: 'relative',
                        }}
                    >
                        <CardContent>
                            {/* Check if this promo is being edited */}
                            {editPromoId === promo._id ? (
                                <>
                                    <TextField
                                        label="Promo Code Name"
                                        value={editFields.name || ''}
                                        onChange={(e) =>
                                            handleFieldChange('name', e.target.value)
                                        }
                                        fullWidth
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        label="Discount Percentage"
                                        type="number"
                                        value={editFields.percentage || ''}
                                        onChange={(e) =>
                                            handleFieldChange('percentage', e.target.value)
                                        }
                                        fullWidth
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        label="Active Until"
                                        type="date"
                                        value={
                                            editFields.activeUntil
                                                ? editFields.activeUntil.slice(0, 10)
                                                : ''
                                        }
                                        onChange={(e) =>
                                            handleFieldChange('activeUntil', e.target.value)
                                        }
                                        fullWidth
                                        sx={{ mb: 2 }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            gap: 1,
                                            marginTop: 2,
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleSaveEdit(promo._id)}
                                            sx={{
                                                backgroundColor: '#111E56',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'white',
                                                    color: '#111E56',
                                                    border: '1px solid #111E56',
                                                },
                                            }}
                                        >
                                            <Save /> Save
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={handleCancelEdit}
                                        >
                                            <Cancel /> Cancel
                                        </Button>
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        {promo.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Discount:</strong> {promo.percentage}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Active Until:</strong>{' '}
                                        {new Date(promo.activeUntil).toLocaleDateString()}
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            gap: 1,
                                            marginTop: 2,
                                        }}
                                    >
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleEditPromo(promo)}
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeletePromo(promo._id)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                </>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default PromoCodes;
