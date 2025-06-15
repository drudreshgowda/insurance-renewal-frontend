import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Card, CardContent, Divider,
  useTheme, alpha, Fade, Grow, Zoom,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  FormControl, InputLabel, Select, MenuItem, TextField, Button,
  IconButton, Tooltip, Chip, Link, Tabs, Tab
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
  FileDownload as FileDownloadIcon,
  Message as MessageIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Sms as SmsIcon
} from '@mui/icons-material';
import { useSettings } from '../context/SettingsContext';

const Billing = () => {
  const theme = useTheme();
  const { settings } = useSettings();
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
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
  
  // Sample communication statistics data
  const [communicationStats, setCommunicationStats] = useState({
    sms: [
      { date: '2024-01-01', count: 150, status: 'Delivered' },
      { date: '2024-01-02', count: 200, status: 'Delivered' },
      { date: '2024-01-03', count: 180, status: 'Delivered' }
    ],
    email: [
      { date: '2024-01-01', count: 75, status: 'Sent' },
      { date: '2024-01-02', count: 90, status: 'Sent' },
      { date: '2024-01-03', count: 85, status: 'Sent' }
    ],
    whatsapp: [
      { date: '2024-01-01', count: 120, status: 'Delivered' },
      { date: '2024-01-02', count: 150, status: 'Delivered' },
      { date: '2024-01-03', count: 130, status: 'Delivered' }
    ]
  });

  // Sample invoice data
  const [invoices, setInvoices] = useState([
    { 
      id: 'INV-2023-IN001', 
      date: '2023-10-01', 
      amount: 95000.00, 
      status: 'Paid', 
      pdfUrl: '#'
    },
    { 
      id: 'INV-2023-IN002', 
      date: '2023-11-01', 
      amount: 102500.50, 
      status: 'Paid', 
      pdfUrl: '#'
    },
    { 
      id: 'INV-2023-IN003', 
      date: '2023-12-01', 
      amount: 108750.75, 
      status: 'Pending', 
      pdfUrl: '#'
    },
    { 
      id: 'INV-2024-IN001', 
      date: '2024-01-01', 
      amount: 105000.25, 
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
              // Filtering for specific month and year
      } else {
        // Filtering by date range
      }
  }, [filterType, selectedMonth, selectedYear, startDate, endDate, settings.billing]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

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

  // Filter communication statistics based on date range
  const getFilteredCommunicationStats = () => {
    let filtered = {
      sms: [...communicationStats.sms],
      email: [...communicationStats.email],
      whatsapp: [...communicationStats.whatsapp]
    };

    if (filterType === 'month') {
      const startOfMonth = new Date(selectedYear, selectedMonth, 1);
      const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
      
      filtered = {
        sms: filtered.sms.filter(item => {
          const date = new Date(item.date);
          return date >= startOfMonth && date <= endOfMonth;
        }),
        email: filtered.email.filter(item => {
          const date = new Date(item.date);
          return date >= startOfMonth && date <= endOfMonth;
        }),
        whatsapp: filtered.whatsapp.filter(item => {
          const date = new Date(item.date);
          return date >= startOfMonth && date <= endOfMonth;
        })
      };
    } else if (startDate && endDate) {
      filtered = {
        sms: filtered.sms.filter(item => {
          const date = new Date(item.date);
          return date >= startDate && date <= endDate;
        }),
        email: filtered.email.filter(item => {
          const date = new Date(item.date);
          return date >= startDate && date <= endDate;
        }),
        whatsapp: filtered.whatsapp.filter(item => {
          const date = new Date(item.date);
          return date >= startDate && date <= endDate;
        })
      };
    }

    return filtered;
  };

  // Calculate totals for communication statistics
  const calculateCommunicationTotals = (stats) => {
    return {
      sms: stats.sms.reduce((sum, item) => sum + item.count, 0),
      email: stats.email.reduce((sum, item) => sum + item.count, 0),
      whatsapp: stats.whatsapp.reduce((sum, item) => sum + item.count, 0)
    };
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
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                aria-label="billing tabs"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 200
                  }
                }}
              >
                <Tab icon={<ReceiptIcon />} label="Billing Details" />
                <Tab icon={<MessageIcon />} label="Communication Statistics" />
              </Tabs>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FilterIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6" fontWeight="600">
                  Filter Options
                </Typography>
              </Box>
              <Box>
                <Tooltip title="Print information">
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

      {activeTab === 0 ? (
        <>
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
                          <TableCell align="right">₹{item.cost.toFixed(2)}</TableCell>
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
                          <TableCell align="right">₹{item.cost.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                        <TableCell><Typography fontWeight="600">Total Monthly Charges</Typography></TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="right"><Typography fontWeight="600">₹{filteredData.totalMonthly.toFixed(2)}</Typography></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grow>

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
                          <TableCell align="right">₹{invoice.amount.toFixed(2)}</TableCell>
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
        </>
      ) : (
        // Communication Statistics Tab
        <Grow in={loaded} timeout={1200}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
              overflow: 'visible'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <MessageIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6" fontWeight="600">
                  Communication Statistics
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {/* SMS Statistics */}
                <Grid item xs={12} md={4}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.05)
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SmsIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography variant="subtitle1" fontWeight="600">
                        SMS Messages
                      </Typography>
                    </Box>
                    <Typography variant="h4" fontWeight="700" sx={{ mb: 1 }}>
                      {calculateCommunicationTotals(getFilteredCommunicationStats()).sms.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total SMS sent
                    </Typography>
                  </Card>
                </Grid>

                {/* Email Statistics */}
                <Grid item xs={12} md={4}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.info.main, 0.05)
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <EmailIcon sx={{ mr: 1, color: theme.palette.info.main }} />
                      <Typography variant="subtitle1" fontWeight="600">
                        Email Messages
                      </Typography>
                    </Box>
                    <Typography variant="h4" fontWeight="700" sx={{ mb: 1 }}>
                      {calculateCommunicationTotals(getFilteredCommunicationStats()).email.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total emails sent
                    </Typography>
                  </Card>
                </Grid>

                {/* WhatsApp Statistics */}
                <Grid item xs={12} md={4}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.success.main, 0.05)
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <WhatsAppIcon sx={{ mr: 1, color: theme.palette.success.main }} />
                      <Typography variant="subtitle1" fontWeight="600">
                        WhatsApp Messages
                      </Typography>
                    </Box>
                    <Typography variant="h4" fontWeight="700" sx={{ mb: 1 }}>
                      {calculateCommunicationTotals(getFilteredCommunicationStats()).whatsapp.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total WhatsApp messages sent
                    </Typography>
                  </Card>
                </Grid>
              </Grid>

              {/* Detailed Statistics Table */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                  Detailed Communication Statistics
                </Typography>
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><Typography fontWeight="600">Date</Typography></TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <SmsIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                            <Typography fontWeight="600">SMS</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <EmailIcon fontSize="small" sx={{ mr: 1, color: theme.palette.info.main }} />
                            <Typography fontWeight="600">Email</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <WhatsAppIcon fontSize="small" sx={{ mr: 1, color: theme.palette.success.main }} />
                            <Typography fontWeight="600">WhatsApp</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center"><Typography fontWeight="600">Total</Typography></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getFilteredCommunicationStats().sms.map((item, index) => (
                        <TableRow key={item.date}>
                          <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                          <TableCell align="center">{item.count.toLocaleString()}</TableCell>
                          <TableCell align="center">
                            {getFilteredCommunicationStats().email[index]?.count.toLocaleString() || 0}
                          </TableCell>
                          <TableCell align="center">
                            {getFilteredCommunicationStats().whatsapp[index]?.count.toLocaleString() || 0}
                          </TableCell>
                          <TableCell align="center">
                            {(
                              item.count +
                              (getFilteredCommunicationStats().email[index]?.count || 0) +
                              (getFilteredCommunicationStats().whatsapp[index]?.count || 0)
                            ).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </CardContent>
          </Card>
        </Grow>
      )}
    </Box>
  );
};

export default Billing;