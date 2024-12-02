import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Divider,
    TextField,
    Button,
} from '@mui/material';

const SalesReport = () => {
    const [salesReport, setSalesReport] = useState(null);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({ productName: '', startDate: '', endDate: '' });

    useEffect(() => {
        const fetchSalesReport = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/admins/sales-report', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSalesReport(response.data);
            } catch (err) {
                setError('Error fetching sales report');
                console.error(err);
            }
        };

        fetchSalesReport();
    }, []);

    const handleFilter = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/admins/sales-report/filter', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    productName: filters.productName,
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                },
            });
            setSalesReport({ ...salesReport, giftShopSales: response.data.giftShopSales });
        } catch (err) {
            setError('No products match the filter criteria.');
            console.error(err);
        }
    };

    const renderTable = (title, data, showAppRevenue = false, showQuantities = false) => (
        <Box sx={{ mb: 4 }}>
            <Typography
                variant="h5"
                sx={{
                    mb: 2,
                    fontWeight: 'bold',
                    color: '#111E56',
                    position: 'relative',
                    display: 'inline-block',
                    cursor: 'pointer',
                    '&::after': {
                        content: "''",
                        position: 'absolute',
                        width: '0',
                        height: '2px',
                        bottom: '-4px',
                        left: '0',
                        backgroundColor: '#111E56',
                        transition: 'width 0.3s ease-in-out',
                    },
                    '&:hover::after': {
                        width: '100%',
                    },
                }}
            >
                {title}
            </Typography>
            <TableContainer component={Paper}>
                <Table
                    sx={{
                        '& .MuiTableRow-root:hover': {
                            backgroundColor: '#f0f4ff',
                        },
                        '& .MuiTableHead-root': {
                            backgroundColor: '#111E56',
                        },
                        '& .MuiTableCell-head': {
                            color: 'white',
                            fontWeight: 'bold',
                        },
                        borderRadius: 2,
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
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Total Sales</TableCell>
                            {showAppRevenue && <TableCell align="right">App Revenue</TableCell>}
                            {showQuantities && <TableCell align="right">Quantity Sold</TableCell>}
                            {showQuantities && <TableCell align="right">Quantity Left</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell align="right">${item.totalSales.toFixed(2)}</TableCell>
                                {showAppRevenue && <TableCell align="right">${item.appRevenue.toFixed(2)}</TableCell>}
                                {showQuantities && <TableCell align="right">{item.totalQuantitySold || '-'}</TableCell>}
                                {showQuantities && <TableCell align="right">{item.quantityLeft || '-'}</TableCell>}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!salesReport) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Loading sales report...</Typography>
            </Box>
        );
    }

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
                Sales Report
            </Typography>


            {/* Activities Section */}
            {renderTable('Activity Sales', salesReport.activitySales, true)}
            <Typography
                variant="h6"
                sx={{
                    mb: 4,
                    fontWeight: 'bold',
                    color: '#111E56',
                }}
            >
                Total Activity Revenue: ${salesReport.totalRevenue.activities.toFixed(2)}
            </Typography>
            <Divider sx={{ borderColor: '#ddd', my: 3 }} />

            {/* Itineraries Section */}
            {renderTable('Itinerary Sales', salesReport.itinerarySales, true)}
            <Typography
                variant="h6"
                sx={{
                    mb: 4,
                    fontWeight: 'bold',
                    color: '#111E56',
                }}
            >
                Total Itinerary Revenue: ${salesReport.totalRevenue.itineraries.toFixed(2)}
            </Typography>
            <Divider sx={{ borderColor: '#ddd', my: 3 }} />

            {/* Gift Shop Section */}
                        {/* Filter Options */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <TextField
                    label="Product Name"
                    variant="outlined"
                    value={filters.productName}
                    onChange={(e) => setFilters({ ...filters, productName: e.target.value })}
                />
                <TextField
                    label="Start Date"
                    variant="outlined"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                />
                <TextField
                    label="End Date"
                    variant="outlined"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                />
                <Button
                    variant="contained"
                    sx={{ backgroundColor: '#111E56', 
                        color: 'white', 
                        border: '2px solid #111E56',
                        '&:hover': { 
                            backgroundColor: 'white', 
                            color: '#111E56',
                            border: '2px solid #111E56', // Optional: adds a border to match the dark blue on hover
                        }, }}
                    onClick={handleFilter}
                >
                    Search
                </Button>
            </Box>

            {renderTable('Gift Shop Sales', salesReport.giftShopSales, false, true)}
            
            <Typography
                variant="h6"
                sx={{
                    mb: 4,
                    fontWeight: 'bold',
                    color: '#111E56',
                }}
            >
                Total Gift Shop Revenue: ${salesReport.totalRevenue.giftShop.toFixed(2)}
            </Typography>
            <Divider sx={{ borderColor: '#ddd', my: 3 }} />

            {/* App Revenue */}
            <Box
                sx={{
                    mt: 4,
                    p: 2,
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    backgroundColor: 'white',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        backgroundColor: 'white',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                        transform: 'scale(1.02)',
                    },
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 'bold',
                        color: '#111E56',
                        mb: 2,
                    }}
                >
                    Total App Revenue
                </Typography>
                <Typography variant="body1">
                    From Activities: ${salesReport.appRevenue.activities.toFixed(2)}
                </Typography>
                <Typography variant="body1">
                    From Itineraries: ${salesReport.appRevenue.itineraries.toFixed(2)}
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        mt: 2,
                        fontWeight: 'bold',
                        color: '#111E56',
                    }}
                >
                    Total App Revenue: ${salesReport.appRevenue.total.toFixed(2)}
                </Typography>
            </Box>
        </Box>
    );
};

export default SalesReport;
