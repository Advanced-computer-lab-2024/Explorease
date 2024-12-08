import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    TextField,
    Button,
    CircularProgress,
    Divider,
} from '@mui/material';

const SellerSalesReport = () => {
    const [data, setData] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // For filters
    const [productName, setProductName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    
    useEffect(() => {
        // Fetch initial data (all sales report)
        const fetchInitialData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/seller/salesReport', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const total = response.data.productRevenue.reduce(
                    (sum, item) => sum + item.totalRevenue,
                    0
                );

                setData(response.data.productRevenue);
                setTotalRevenue(total);
            } catch (err) {
                setError('Error fetching sales report');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const handleFilter = async () => {
        setLoading(true); // Show loading spinner
        try {
            const token = localStorage.getItem('token');
            const params = {
                productName: productName || undefined,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
            };

            const response = await axios.get('/seller/salesReport/filter', {
                headers: { Authorization: `Bearer ${token}` },
                params,
            });

            const total = response.data.productRevenue.reduce(
                (sum, item) => sum + item.totalRevenue,
                0
            );

            setData(response.data.productRevenue);
            setTotalRevenue(total);
        } catch (err) {
            setError('Error fetching filtered sales report');
            console.error(err);
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    const renderTable = (title, data) => (
        <Box sx={{ mb: 4 }}>
            <Typography
                variant="h5"
                sx={{
                    mb: 2,
                    fontWeight: 'bold',
                    color: '#111E56',
                }}
            >
                {title}
            </Typography>
            <TableContainer component={Paper}>
                <Table
                    sx={{
                        '& .MuiTableRow-root:hover': {
                            backgroundColor: '#f0f4ff', // Light blue hover effect
                        },
                        '& .MuiTableHead-root': {
                            backgroundColor: '#111E56',
                        },
                        '& .MuiTableCell-head': {
                            color: 'white',
                            fontWeight: 'bold',
                        },
                    }}
                >
                    <TableHead>
                    <TableRow
                            sx={{
                                pointerEvents: 'none', // Disable hover events
                                '&:hover': {
                                    backgroundColor: 'inherit', // Remove background color change
                                },
                            }}
                        >
                            <TableCell>Product Name</TableCell>
                            <TableCell align="right">Revenue ($)</TableCell>
                            <TableCell align="right">Quantity Sold</TableCell>
                            <TableCell align="right">Quantity Left</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.productName}</TableCell>
                                <TableCell align="right">${item.totalRevenue.toFixed(2)}</TableCell>
                                <TableCell align="right">{item.totalQuantitySold}</TableCell>
                                <TableCell align="right">{item.quantityLeft}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    return (
        <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2 }}>
            <Typography
                variant="h4"
                sx={{
                    mb: 4,
                    fontWeight: 'bold',
                    color: '#111E56',
                    textAlign: 'center',
                }}
            >
                Seller Sales Report
            </Typography>

            {/* Filters */}
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 4,
                }}
            >
                <TextField
                    label="Product Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    fullWidth
                />
                <TextField
                    type="date"
                    label="Start Date"
                    InputLabelProps={{ shrink: true }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    fullWidth
                />
                <TextField
                    type="date"
                    label="End Date"
                    InputLabelProps={{ shrink: true }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    fullWidth
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFilter}
                    sx={{
                        alignSelf: 'center',
                        height: 'fit-content',
                    }}
                >
                    Search
                </Button>
            </Box>

            {/* Table Section */}
            {renderTable('Product Sales', data)}

            <Typography
                variant="h6"
                sx={{
                    mt: 3,
                    fontWeight: 'bold',
                    color: '#111E56',
                }}
            >
                Total Revenue: ${totalRevenue.toFixed(2)}
            </Typography>
            <Divider sx={{ borderColor: '#ddd', my: 3 }} />
        </Box>
    );
};

export default SellerSalesReport;
