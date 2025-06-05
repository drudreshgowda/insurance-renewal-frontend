import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Card, CardContent, Divider,
  useTheme, alpha, Fade, Grow, Zoom,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  FormControl, InputLabel, Select, MenuItem, TextField, Button,
  IconButton, Tooltip, Chip, Link
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import {
  Receipt as ReceiptIcon,
  FilterList as FilterIcon,
  CalendarMonth as CalendarIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  PictureAsPdf as PdfIcon,
  Payment as PaymentIcon,
  Visibility as VisibilityIcon,
  FileDownload as FileDownloadIcon
} from '@mui/icons-material';
import { useSettings } from '../context/SettingsContext';

const Billing = () => {
  const theme = useTheme();
  const { settings } = useSettings();
  const [loaded, setLoaded] = useState(false);
  const [filterType, setFilterType] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState({
    utilization: [],
    platform: [],
    totalMonthly: 0
  });
  
  // Sample invoice data
  const [invoices, setInvoices] = useState([
    { 
      id: 'INV-2023-001', 
      date: '2023-10-01', 
      amount: 1250.00, 
      status: 'Paid', 
      pdfUrl: '#'
    },
    { 
      id: 'INV-2023-002', 
      date: '2023-11-01', 
      amount: 1320.50, 
      status: 'Paid', 
      pdfUrl: '#'
    },
    { 
      id: 'INV-2023-003', 
      date: '2023-12-01', 
      amount: 1450.75, 
      status: 'Pending', 
      pdfUrl: '#'
    },
    { 
      id: 'INV-2024-001', 
      date: '2024-01-01', 
      amount: 1380.25, 
      status: 'Pending', 
      pdfUrl: '#'
    }
  ]);

  // Months array for dropdown
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Years array for dropdown (current year and 2 previous years)
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];

  // Load animation effect
  useEffect(() => {
    setLoaded(true);
  }, []);

  // Apply filters and update data
  useEffect(() => {
    // In a real app, this would fetch filtered data from an API
    // For this demo, we'll just use the sample data from settings
    
    // Simulate filtered data based on selected filters
    // In a real app, you would fetch this data from your backend
    setFilteredData({
      utilization: settings.billing.utilization,
      platform: settings.billing.platform,
      totalMonthly: settings.billing.totalMonthly
    });
    
    // Just for demonstration, we'll log the filter criteria
    if (filterType === 'month') {
      console.log(`Filtering for ${months[selectedMonth]} ${selectedYear}`);
    } else {
      console.log(`Filtering from ${startDate?.toLocaleDateString()} to ${endDate?.toLocaleDateString()}`);
    }
  }, [filterType, selectedMonth, selectedYear, startDate, endDate, settings.billing]);

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF or CSV
    alert('Download functionality would be implemented here');
  };

  // Handle view invoice
  const handleViewInvoice = (invoiceId) => {
    // In a real app, this would open a modal or navigate to an invoice detail page
    alert(`Viewing invoice ${invoiceId}`);
  };

  // Handle download invoice
  const handleDownloadInvoice = (invoiceId) => {
    // In a real app, this would download the invoice PDF
    alert(`Downloading invoice ${invoiceId}`);
  };

  // Handle pay invoice
  const handlePayInvoice = (invoiceId) => {
    // In a real app, this would navigate to a payment gateway
    alert(`Paying invoice ${invoiceId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Fade in={loaded} timeout={800}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="700" gutterBottom>
            Billing Information
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage your billing information and usage charges
          </Typography>
        </Box>
      </Fade>

      <Grow in={loaded} timeout={1000}>
        <Card 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            mb: 4,
            boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
            overflow: 'visible'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FilterIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6" fontWeight="600">
                  Filter Options
                </Typography>
              </Box>
              <Box>
                <Tooltip title="Print billing information">
                  <IconButton onClick={handlePrint} sx={{ mr: 1 }}>
                    <PrintIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download as PDF">
                  <IconButton onClick={handleDownload}>
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="filter-type-label">Filter Type</InputLabel>
                  <Select
                    labelId="filter-type-label"
                    id="filter-type"
                    value={filterType}
                    onChange={handleFilterTypeChange}
                    label="Filter Type"
                  >
                    <MenuItem value="month">By Month</MenuItem>
                    <MenuItem value="custom">Custom Date Range</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {filterType === 'month' ? (
                <>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="month-label">Month</InputLabel>
                      <Select
                        labelId="month-label"
                        id="month-select"
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        label="Month"
                      >
                        {months.map((month, index) => (
                          <MenuItem key={index} value={index}>{month}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="year-label">Year</InputLabel>
                      <Select
                        labelId="year-label"
                        id="year-select"
                        value={selectedYear}
                        onChange={handleYearChange}
                        label="Year"
                      >
                        {years.map((year) => (
                          <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} md={3}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                        minDate={startDate}
                      />
                    </LocalizationProvider>
                  </Grid>
                </>
              )}

              <Grid item xs={12} md={3}>
                <Button 
                  variant="contained" 
                  color="primary"
                  fullWidth
                  sx={{ 
                    py: 1.7,
                    borderRadius: 2,
                    fontWeight: 600,
                    boxShadow: '0 4px 14px rgba(0,118,255,0.25)'
                  }}
                >
                  Apply Filters
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grow>

      <Grow in={loaded} timeout={1200}>
        <Card 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
            overflow: 'visible',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
            },
            mb: 4
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ReceiptIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="600">
                Billing Information
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="subtitle1" fontWeight="500" sx={{ mb: 2 }}>
              Portal Usage - Utilization Charges
            </Typography>
            
            <TableContainer component={Paper} elevation={0} sx={{ mb: 3, borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><Typography fontWeight="600">Service</Typography></TableCell>
                    <TableCell align="center"><Typography fontWeight="600">Count</Typography></TableCell>
                    <TableCell align="right"><Typography fontWeight="600">Cost</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.utilization.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.service}</TableCell>
                      <TableCell align="center">{item.count.toLocaleString()}</TableCell>
                      <TableCell align="right">${item.cost.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Typography variant="subtitle1" fontWeight="500" sx={{ mb: 2 }}>
              Platform Charges
            </Typography>
            
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><Typography fontWeight="600">Service</Typography></TableCell>
                    <TableCell align="center"><Typography fontWeight="600">Period</Typography></TableCell>
                    <TableCell align="right"><Typography fontWeight="600">Cost</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.platform.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.service}</TableCell>
                      <TableCell align="center">{item.period}</TableCell>
                      <TableCell align="right">${item.cost.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                    <TableCell><Typography fontWeight="600">Total Monthly Charges</Typography></TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="right"><Typography fontWeight="600">${filteredData.totalMonthly.toFixed(2)}</Typography></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grow>

      {/* New Invoice Section */}
      <Grow in={loaded} timeout={1400}>
        <Card 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
            overflow: 'visible',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PdfIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="600">
                Invoices
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              View, download, and pay your invoices directly from the portal
            </Typography>
            
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><Typography fontWeight="600">Invoice #</Typography></TableCell>
                    <TableCell><Typography fontWeight="600">Date</Typography></TableCell>
                    <TableCell align="right"><Typography fontWeight="600">Amount</Typography></TableCell>
                    <TableCell align="center"><Typography fontWeight="600">Status</Typography></TableCell>
                    <TableCell align="center"><Typography fontWeight="600">Actions</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ReceiptIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                          {invoice.id}
                        </Box>
                      </TableCell>
                      <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                      <TableCell align="right">${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={invoice.status} 
                          size="small"
                          color={invoice.status === 'Paid' ? 'success' : 'warning'}
                          sx={{ 
                            fontWeight: 500,
                            minWidth: 80
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Tooltip title="View Invoice">
                            <IconButton 
                              size="small" 
                              onClick={() => handleViewInvoice(invoice.id)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Download Invoice">
                            <IconButton 
                              size="small" 
                              onClick={() => handleDownloadInvoice(invoice.id)}
                            >
                              <FileDownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          {invoice.status === 'Pending' && (
                            <Tooltip title="Pay Now">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => handlePayInvoice(invoice.id)}
                              >
                                <PaymentIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grow>
    </Box>
  );
};

export default Billing;