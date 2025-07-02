import React, { useState, useEffect, useCallback } from 'react';
import { 
  Grid, Paper, Typography, Box, Card, CardContent, 
  FormControl, InputLabel, Select, MenuItem, alpha, useTheme,
  Fade, Grow, Chip, IconButton
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { fetchDashboardStats, fetchTrendData, fetchBatchStatus } from '../services/api';
import { 
  Timeline as TimelineIcon,
  Policy as PolicyIcon, 
  AssignmentTurnedIn as CompletedIcon, 
  Watch as PendingIcon,
  ErrorOutline as ErrorIcon,
  Payments as PaymentsIcon,
  AccountBalance as AccountBalanceIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  CreditCard as PaymentModeIcon,
  TrendingUp as CostIcon,
  Hub as ChannelIcon,
  Campaign as CampaignIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Sms as SmsIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';

const Dashboard = () => {
  const theme = useTheme();
  const [stats, setStats] = useState({
    totalCases: 0,
    inProgress: 0,
    renewed: 0,
    pendingAction: 0,
    errors: 0,
    paymentCollected: 0,
    paymentPending: 0
  });
  
  const [trendData, setTrendData] = useState([]);
  const [batchData, setBatchData] = useState([]);
  const [dateRange, setDateRange] = useState('week');
  const [policyType, setPolicyType] = useState('all');
  const [caseStatus, setCaseStatus] = useState('all');
  const [loaded, setLoaded] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // New chart data states
  const [channelData, setChannelData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [managerData, setManagerData] = useState([]);
  const [communicationData, setCommunicationData] = useState([]);
  const [paymentModeData, setPaymentModeData] = useState([]);
  const [costData, setCostData] = useState([]);
  
  // Payment analysis chart data states
  const [paymentTypeData, setPaymentTypeData] = useState([]);
  const [paymentTimelineData, setPaymentTimelineData] = useState([]);
  const [dueDateAnalysisData, setDueDateAnalysisData] = useState([]);
  const [policyRenewalData, setPolicyRenewalData] = useState([]);
  const [channelCollectionData, setChannelCollectionData] = useState([]);
  const [collectionModeData, setCollectionModeData] = useState([]);
  
  // Campaign data state
  const [campaignData, setCampaignData] = useState([]);

  // Memoize the loadDashboardData function to avoid recreating it on every render
  const loadDashboardData = useCallback(async () => {
    try {
      const statsData = await fetchDashboardStats(dateRange, policyType, caseStatus, startDate, endDate);
      if (statsData) {
        setStats(prev => ({
          ...prev,
          ...statsData
        }));
      }
      
      const trends = await fetchTrendData(dateRange, policyType, caseStatus, startDate, endDate);
      if (trends && Array.isArray(trends)) {
        setTrendData(trends);
      }

      // Fetch batch status data
      const batchStatusData = await fetchBatchStatus();
      if (batchStatusData && Array.isArray(batchStatusData)) {
        setBatchData(batchStatusData);
      }
    } catch (error) {
              // Failed to load dashboard data
    }
  }, [dateRange, policyType, caseStatus, startDate, endDate]);

  useEffect(() => {
    // Initialize with default values to prevent NaN issues
    const initialStats = {
      totalCases: 0,
      inProgress: 0,
      renewed: 0,
      pendingAction: 0,
      errors: 0,
      paymentCollected: 0,
      paymentPending: 0
    };
    
    setStats(initialStats);
    
    // Load dashboard data
    loadDashboardData();
    
    // For demo purposes, let's set some mock data with a slight delay to simulate API fetch
    const mockTimer = setTimeout(() => {
      setStats({
        totalCases: 1250,
        inProgress: 320,
        renewed: 780,
        pendingAction: 95,
        errors: 55,
        paymentCollected: 13850000,
        paymentPending: 3250000
      });
    }, 300);
    
    const mockTrendData = [
      { name: 'Mon', newCases: 65, renewals: 42, successRate: 0.85 },
      { name: 'Tue', newCases: 59, renewals: 38, successRate: 0.82 },
      { name: 'Wed', newCases: 80, renewals: 56, successRate: 0.88 },
      { name: 'Thu', newCases: 81, renewals: 61, successRate: 0.91 },
      { name: 'Fri', newCases: 56, renewals: 48, successRate: 0.89 },
      { name: 'Sat', newCases: 25, renewals: 20, successRate: 0.92 },
      { name: 'Sun', newCases: 15, renewals: 12, successRate: 0.90 },
    ];
    
    setTrendData(mockTrendData);
    
    // Mock data for new charts
    const mockChannelData = [
      { name: 'Online Portal', value: 45, color: '#8884d8' },
      { name: 'Mobile App', value: 30, color: '#82ca9d' },
      { name: 'Branch Office', value: 15, color: '#ffc658' },
      { name: 'Agent Visit', value: 10, color: '#ff7300' }
    ];

    const mockRegionData = [
      { region: 'North', state: 'Delhi', branch: 'CP Branch', cases: 120, renewed: 95 },
      { region: 'North', state: 'Punjab', branch: 'Chandigarh', cases: 85, renewed: 70 },
      { region: 'West', state: 'Maharashtra', branch: 'Mumbai Central', cases: 200, renewed: 165 },
      { region: 'West', state: 'Gujarat', branch: 'Ahmedabad', cases: 90, renewed: 75 },
      { region: 'South', state: 'Karnataka', branch: 'Bangalore', cases: 180, renewed: 150 },
      { region: 'South', state: 'Tamil Nadu', branch: 'Chennai', cases: 150, renewed: 125 },
      { region: 'East', state: 'West Bengal', branch: 'Kolkata', cases: 110, renewed: 90 }
    ];

    const mockManagerData = [
      { name: 'Sales Manager', type: 'Sales', cases: 450, renewed: 380, efficiency: 84.4 },
      { name: 'Regional Manager', type: 'Regional', cases: 320, renewed: 275, efficiency: 85.9 },
      { name: 'Area Manager', type: 'Area', cases: 280, renewed: 245, efficiency: 87.5 },
      { name: 'State Manager', type: 'State', cases: 200, renewed: 170, efficiency: 85.0 }
    ];

    const mockCommunicationData = [
      { mode: 'AI Call', count: 520, success: 78, cost: 2.5 },
      { mode: 'WhatsApp', count: 380, success: 85, cost: 0.5 },
      { mode: 'Tele Caller', count: 250, success: 65, cost: 8.0 },
      { mode: 'SMS', count: 150, success: 45, cost: 0.2 }
    ];

    const mockPaymentModeData = [
      { mode: 'UPI/Digital', value: 40, amount: 5520000, color: '#00C49F' },
      { mode: 'Net Banking', value: 25, amount: 3450000, color: '#0088FE' },
      { mode: 'Credit Card', value: 20, amount: 2760000, color: '#FFBB28' },
      { mode: 'Debit Card', value: 10, amount: 1380000, color: '#FF8042' },
      { mode: 'Cash', value: 5, amount: 690000, color: '#8884D8' }
    ];

    const mockCostData = [
      { channel: 'Online Portal', costPerRenewal: 45, volume: 450, totalCost: 20250 },
      { channel: 'Mobile App', costPerRenewal: 35, volume: 300, totalCost: 10500 },
      { channel: 'Branch Office', costPerRenewal: 120, volume: 150, totalCost: 18000 },
      { channel: 'Agent Visit', costPerRenewal: 200, volume: 100, totalCost: 20000 },
      { channel: 'Phone Call', costPerRenewal: 80, volume: 250, totalCost: 20000 }
    ];

    setChannelData(mockChannelData);
    setRegionData(mockRegionData);
    setManagerData(mockManagerData);
    setCommunicationData(mockCommunicationData);
    setPaymentModeData(mockPaymentModeData);
    setCostData(mockCostData);

    // Mock data for new payment analysis charts
    const mockPaymentTypeData = [
      { type: 'Annual Premium', value: 45, amount: 6210000, color: '#8884d8' },
      { type: 'Quarterly Premium', value: 30, amount: 4140000, color: '#82ca9d' },
      { type: 'Monthly Premium', value: 15, amount: 2070000, color: '#ffc658' },
      { type: 'One-time Payment', value: 10, amount: 1380000, color: '#ff7300' }
    ];

    const mockPaymentTimelineData = [
      { month: 'Jan', avgDays: 12, totalPayments: 145, onTimePayments: 125 },
      { month: 'Feb', avgDays: 8, totalPayments: 132, onTimePayments: 118 },
      { month: 'Mar', avgDays: 15, totalPayments: 168, onTimePayments: 142 },
      { month: 'Apr', avgDays: 10, totalPayments: 156, onTimePayments: 140 },
      { month: 'May', avgDays: 7, totalPayments: 174, onTimePayments: 162 },
      { month: 'Jun', avgDays: 11, totalPayments: 148, onTimePayments: 130 }
    ];

    const mockDueDateAnalysisData = [
      { category: 'Before Due Date', count: 680, percentage: 68, amount: 9380000, color: '#4caf50' },
      { category: 'On Due Date', count: 180, percentage: 18, amount: 2484000, color: '#ff9800' },
      { category: 'After Due Date', count: 140, percentage: 14, amount: 1932000, color: '#f44336' }
    ];

    const mockPolicyRenewalData = [
      { policyType: 'Auto Insurance', pending: 245, collected: 680, total: 925, collectionRate: 73.5, amount: 8520000 },
      { policyType: 'Health Insurance', pending: 180, collected: 520, total: 700, collectionRate: 74.3, amount: 7240000 },
      { policyType: 'Life Insurance', pending: 120, collected: 380, total: 500, collectionRate: 76.0, amount: 5700000 },
      { policyType: 'Home Insurance', pending: 85, collected: 215, total: 300, collectionRate: 71.7, amount: 3180000 }
    ];

    const mockChannelCollectionData = [
      { channel: 'Online Portal', collected: 4250000, target: 5000000, percentage: 85, policies: 425 },
      { channel: 'Mobile App', collected: 3180000, target: 3500000, percentage: 90.9, policies: 318 },
      { channel: 'Branch Office', collected: 2840000, target: 3200000, percentage: 88.8, policies: 284 },
      { channel: 'Agent Network', collected: 2460000, target: 3000000, percentage: 82.0, policies: 246 },
      { channel: 'Call Center', collected: 1870000, target: 2200000, percentage: 85.0, policies: 187 }
    ];

    const mockCollectionModeData = [
      { mode: 'Credit Card', amount: 3850000, count: 385, percentage: 28, avgAmount: 10000, color: '#2196f3' },
      { mode: 'UPI/Digital', amount: 3300000, count: 550, percentage: 24, avgAmount: 6000, color: '#4caf50' },
      { mode: 'Net Banking', amount: 2750000, count: 275, percentage: 20, avgAmount: 10000, color: '#ff9800' },
      { mode: 'Branch Cash', amount: 2200000, count: 220, percentage: 16, avgAmount: 10000, color: '#9c27b0' },
      { mode: 'Agent Collection', amount: 1650000, count: 165, percentage: 12, avgAmount: 10000, color: '#f44336' }
    ];

    setPaymentTypeData(mockPaymentTypeData);
    setPaymentTimelineData(mockPaymentTimelineData);
    setDueDateAnalysisData(mockDueDateAnalysisData);
    setPolicyRenewalData(mockPolicyRenewalData);
    setChannelCollectionData(mockChannelCollectionData);
    setCollectionModeData(mockCollectionModeData);

    // Mock campaign data
    const mockCampaignData = [
      {
        id: 'camp-1',
        name: 'May Renewals Email Campaign',
        type: 'email',
        status: 'active',
        uploadFilename: 'may_renewals_batch1.xlsx',
        targetCount: 238,
        sent: 156,
        opened: 89,
        clicked: 34,
        converted: 12,
        createdAt: '2025-05-15T11:00:00',
        scheduledAt: '2025-05-15T14:00:00',
        openRate: 57.1,
        clickRate: 21.8,
        conversionRate: 7.7
      },
      {
        id: 'camp-2',
        name: 'April Follow-up WhatsApp',
        type: 'whatsapp',
        status: 'active',
        uploadFilename: 'april_end_policies.xlsx',
        targetCount: 175,
        sent: 98,
        delivered: 94,
        read: 67,
        replied: 23,
        converted: 18,
        createdAt: '2025-04-30T16:30:00',
        scheduledAt: '2025-05-01T09:00:00',
        deliveryRate: 95.9,
        readRate: 71.3,
        replyRate: 34.3,
        conversionRate: 18.4
      },
      {
        id: 'camp-3',
        name: 'Urgent Renewal SMS Blast',
        type: 'sms',
        status: 'completed',
        uploadFilename: 'urgent_renewals.xlsx',
        targetCount: 120,
        sent: 120,
        delivered: 118,
        clicked: 45,
        converted: 28,
        createdAt: '2025-05-10T09:00:00',
        scheduledAt: '2025-05-10T10:00:00',
        deliveryRate: 98.3,
        clickRate: 38.1,
        conversionRate: 23.3
      },
      {
        id: 'camp-4',
        name: 'Premium Policy Email Series',
        type: 'email',
        status: 'paused',
        uploadFilename: 'premium_customers.xlsx',
        targetCount: 89,
        sent: 45,
        opened: 32,
        clicked: 18,
        converted: 8,
        createdAt: '2025-05-08T15:30:00',
        scheduledAt: '2025-05-09T11:00:00',
        openRate: 71.1,
        clickRate: 56.3,
        conversionRate: 17.8
      }
    ];
    
    setCampaignData(mockCampaignData);

    // Set loaded state for animations
    const loadedTimer = setTimeout(() => {
      setLoaded(true);
    }, 400);

    // Cleanup timers
    return () => {
      clearTimeout(mockTimer);
      clearTimeout(loadedTimer);
    };
  }, [loadDashboardData]); // Include the memoized function in dependencies

  const StatCard = ({ title, value, color, icon, index, isCurrency }) => {
    // Create a gradient background
    const gradientFrom = alpha(color, theme.palette.mode === 'dark' ? 0.7 : 0.9);
    const gradientTo = alpha(color, theme.palette.mode === 'dark' ? 0.4 : 0.6);
    
    // Safe number conversion and formatting
    let displayValue = value;
    if (isCurrency) {
      // Ensure we have a valid number before formatting
      const numericValue = Number(value);
      if (!isNaN(numericValue)) {
        displayValue = new Intl.NumberFormat('en-IN', { 
          style: 'currency', 
          currency: 'INR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(numericValue);
      } else {
        displayValue = '₹0'; // Default fallback for NaN values
      }
    }
    
    return (
      <Grow in={loaded} style={{ transformOrigin: '0 0 0' }} timeout={(index + 1) * 200}>
        <Card 
          sx={{ 
            height: '100%', 
            background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
            borderRadius: 4,
            boxShadow: `0 10px 20px ${alpha(color, 0.2)}`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -20,
              right: -20,
              opacity: 0.15,
              transform: 'rotate(25deg)',
              fontSize: '8rem'
            }}
          >
            {icon}
          </Box>
          <CardContent sx={{ position: 'relative', zIndex: 1, textAlign: 'center', py: 2 }}>
            <Typography variant="h6" component="div" color="white" fontWeight="500" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" color="white" fontWeight="bold">
              {displayValue}
            </Typography>
          </CardContent>
        </Card>
      </Grow>
    );
  };

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ px: 1 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Renewal Dashboard
        </Typography>
        
        {/* Filters */}
        <Card sx={{ mb: 4, boxShadow: 'none', p: 1 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <FormControl sx={{ minWidth: 160 }} size="small">
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={dateRange}
                  label="Date Range"
                  onChange={(e) => {
                    setDateRange(e.target.value);
                    // Reset custom date range when switching to preset ranges
                    if (e.target.value !== 'custom') {
                      setStartDate(null);
                      setEndDate(null);
                    }
                  }}
                >
                  <MenuItem value="day">Daily</MenuItem>
                  <MenuItem value="week">Weekly</MenuItem>
                  <MenuItem value="month">Monthly</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </Select>
              </FormControl>
              
              {dateRange === 'custom' && (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={(newValue) => setStartDate(newValue)}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          sx: {
                            minWidth: 160,
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                              '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                              },
                              '&.Mui-focused': {
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: theme.palette.text.secondary,
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.primary.main,
                            },
                          }
                        }
                      }}
                    />
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      onChange={(newValue) => setEndDate(newValue)}
                      minDate={startDate}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          sx: {
                            minWidth: 160,
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                              '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                              },
                              '&.Mui-focused': {
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: theme.palette.text.secondary,
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.primary.main,
                            },
                          }
                        }
                      }}
                    />
                  </Box>
                </LocalizationProvider>
              )}
              
              <FormControl sx={{ minWidth: 160 }} size="small">
                <InputLabel>Policy Type</InputLabel>
                <Select
                  value={policyType}
                  label="Policy Type"
                  onChange={(e) => setPolicyType(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="vehicle">Vehicle</MenuItem>
                  <MenuItem value="health">Health</MenuItem>
                  <MenuItem value="life">Life</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl sx={{ minWidth: 160 }} size="small">
                <InputLabel>Case Status</InputLabel>
                <Select
                  value={caseStatus}
                  label="Case Status"
                  onChange={(e) => setCaseStatus(e.target.value)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="inProgress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>
        
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatCard 
              title="Total Cases" 
              value={stats.totalCases} 
              color={theme.palette.primary.main} 
              icon={<TimelineIcon fontSize="inherit" />}
              index={0}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatCard 
              title="In Progress" 
              value={stats.inProgress} 
              color={theme.palette.warning.main} 
              icon={<PolicyIcon fontSize="inherit" />}
              index={1}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatCard 
              title="Renewed" 
              value={stats.renewed} 
              color={theme.palette.success.main} 
              icon={<CompletedIcon fontSize="inherit" />}
              index={2}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatCard 
              title="Pending Action" 
              value={stats.pendingAction} 
              color="#9c27b0" 
              icon={<PendingIcon fontSize="inherit" />}
              index={3}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatCard 
              title="Failed" 
              value={stats.errors} 
              color={theme.palette.error.main} 
              icon={<ErrorIcon fontSize="inherit" />}
              index={4}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatCard 
              title="Payments Collected" 
              value={stats.paymentCollected} 
              color="#00897b" 
              icon={<PaymentsIcon fontSize="inherit" />}
              index={5}
              isCurrency={true}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatCard 
              title="Payments Pending" 
              value={stats.paymentPending} 
              color="#ff9800" 
              icon={<AccountBalanceIcon fontSize="inherit" />}
              index={6}
              isCurrency={true}
            />
          </Grid>
        </Grid>
        
        {/* Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Grow in={loaded} style={{ transformOrigin: '0 0 0' }} timeout={400}>
              <Paper sx={{ p: 3, height: 380, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Case Volume
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Comparison of new cases and completed renewals
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={trendData} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#fff',
                        borderRadius: 8,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                      }} 
                    />
                    <Legend />
                    <Bar 
                      dataKey="newCases" 
                      fill={alpha(theme.palette.primary.main, 0.8)} 
                      name="New Cases" 
                      radius={[4, 4, 0, 0]} 
                    />
                    <Bar 
                      dataKey="renewals" 
                      fill={alpha(theme.palette.success.main, 0.8)}  
                      name="Completed Renewals" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grow>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Grow in={loaded} style={{ transformOrigin: '0 0 0' }} timeout={600}>
              <Paper sx={{ p: 3, height: 380, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Success Rate Trend
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Percentage of successful renewals over time
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 1]} tickFormatter={(tick) => `${(tick * 100).toFixed(0)}%`} />
                    <Tooltip 
                      formatter={(value) => `${(value * 100).toFixed(2)}%`} 
                      contentStyle={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#fff',
                        borderRadius: 8,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                      }} 
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="successRate" 
                      stroke={theme.palette.success.main} 
                      fillOpacity={1}
                      fill="url(#successGradient)"
                      name="Success Rate"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Paper>
            </Grow>
          </Grid>

          {/* Batch Status and Payment Status Charts */}
          <Grid item xs={12} md={6}>
            <Grow in={loaded} style={{ transformOrigin: '0 0 0' }} timeout={800}>
              <Paper sx={{ p: 3, height: 450, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom fontWeight="600" sx={{ mb: 0 }}>
                      Batch Upload Status
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status breakdown of cases by batch upload
                    </Typography>
                  </Box>
                  
                  <FormControl sx={{ minWidth: 200 }} size="small">
                    <InputLabel>Select Batch</InputLabel>
                    <Select
                      value={selectedBatch}
                      label="Select Batch"
                      onChange={(e) => setSelectedBatch(e.target.value)}
                    >
                      <MenuItem value="all">All Batches</MenuItem>
                      {batchData.map((batch) => (
                        <MenuItem key={batch.id} value={batch.id}>
                          {batch.fileName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                
                <Box sx={{ height: '85%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={selectedBatch === 'all' ? batchData : batchData.filter(batch => batch.id === selectedBatch)}
                      layout="vertical"
                      barGap={0}
                      barCategoryGap="15%"
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
                      <XAxis type="number" />
                      <YAxis 
                        dataKey="fileName" 
                        type="category" 
                        width={150}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#fff',
                          borderRadius: 8,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="status.renewed" 
                        stackId="a" 
                        fill={theme.palette.success.main} 
                        name="Renewed" 
                      />
                      <Bar 
                        dataKey="status.inProgress" 
                        stackId="a" 
                        fill={theme.palette.warning.main} 
                        name="In Progress" 
                      />
                      <Bar 
                        dataKey="status.pending" 
                        stackId="a" 
                        fill={theme.palette.info.main} 
                        name="Pending" 
                      />
                      <Bar 
                        dataKey="status.failed" 
                        stackId="a" 
                        fill={theme.palette.error.main} 
                        name="Failed" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grow>
          </Grid>

          {/* Payment Status Chart */}
          <Grid item xs={12} md={6}>
            <Grow in={loaded} style={{ transformOrigin: '0 0 0' }} timeout={900}>
              <Paper sx={{ p: 3, height: 450, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom fontWeight="600" sx={{ mb: 0 }}>
                      Payment Status
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Payment trends over time
                    </Typography>
                  </Box>
                  
                  <FormControl sx={{ minWidth: 200 }} size="small">
                    <InputLabel>Select Batch</InputLabel>
                    <Select
                      value={selectedBatch}
                      label="Select Batch"
                      onChange={(e) => setSelectedBatch(e.target.value)}
                    >
                      <MenuItem value="all">All Batches</MenuItem>
                      {batchData.map((batch) => (
                        <MenuItem key={batch.id} value={batch.id}>
                          {batch.fileName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                
                <Box sx={{ height: '85%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={selectedBatch === 'all' ? batchData : batchData.filter(batch => batch.id === selectedBatch)}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis 
                        dataKey="fileName" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis 
                        tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                      />
                      <Tooltip 
                        formatter={(value) => new Intl.NumberFormat('en-IN', { 
                          style: 'currency', 
                          currency: 'INR',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        }).format(value)}
                        contentStyle={{ 
                          backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#fff',
                          borderRadius: 8,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="payment.received" 
                        stroke={theme.palette.success.main} 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Payment Received"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="payment.pending" 
                        stroke={theme.palette.warning.main} 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Payment Pending"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grow>
          </Grid>
        </Grid>

        {/* New Charts Section */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 600 }}>
          Advanced Analytics
        </Typography>

        <Grid container spacing={3}>
          {/* Channel Wise Case Bifurcation */}
          <Grid item xs={12} lg={6}>
            <Grow in={loaded} style={{ transformOrigin: '0 0 0' }} timeout={1000}>
              <Paper sx={{ p: 3, height: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <Typography variant="h6" gutterBottom fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ChannelIcon color="primary" />
                  Channel Wise Case Bifurcation
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Distribution of renewal cases across different channels
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grow>
          </Grid>

          {/* Region/State/Branch wise */}
          <Grid item xs={12} lg={6}>
            <Grow in={loaded} style={{ transformOrigin: '0 0 0' }} timeout={1100}>
              <Paper sx={{ p: 3, height: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <Typography variant="h6" gutterBottom fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon color="primary" />
                  Region/State/Branch Performance
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Renewal performance across different geographical locations
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={regionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis 
                      dataKey="branch" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={10}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [value, name]}
                      labelFormatter={(label) => {
                        const item = regionData.find(r => r.branch === label);
                        return item ? `${item.state} - ${label}` : label;
                      }}
                      contentStyle={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#fff',
                        borderRadius: 8,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="cases" fill={alpha(theme.palette.info.main, 0.8)} name="Total Cases" />
                    <Bar dataKey="renewed" fill={alpha(theme.palette.success.main, 0.8)} name="Renewed" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grow>
          </Grid>

          {/* Sales/Regional/Area/State Manager Performance */}
          <Grid item xs={12} lg={6}>
            <Grow in={loaded} style={{ transformOrigin: '0 0 0' }} timeout={1200}>
              <Paper sx={{ p: 3, height: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <Typography variant="h6" gutterBottom fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon color="primary" />
                  Manager Performance Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Performance metrics across different management levels
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={managerData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="type" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" domain={[80, 90]} />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'Efficiency') return [`${value}%`, name];
                        return [value, name];
                      }}
                      contentStyle={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#fff',
                        borderRadius: 8,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="cases" fill={alpha(theme.palette.primary.main, 0.8)} name="Total Cases" />
                    <Bar yAxisId="left" dataKey="renewed" fill={alpha(theme.palette.success.main, 0.8)} name="Renewed" />
                    <Bar yAxisId="right" dataKey="efficiency" fill={alpha(theme.palette.warning.main, 0.8)} name="Efficiency %" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grow>
          </Grid>

          {/* Mode of Communication */}
          <Grid item xs={12} lg={6}>
            <Grow in={loaded} style={{ transformOrigin: '0 0 0' }} timeout={1300}>
              <Paper sx={{ p: 3, height: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <Typography variant="h6" gutterBottom fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon color="primary" />
                  Communication Mode Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Success rate and cost analysis by communication method
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={communicationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="mode" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'Success Rate') return [`${value}%`, name];
                        if (name === 'Cost per Contact') return [`₹${value}`, name];
                        return [value, name];
                      }}
                      contentStyle={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#fff',
                        borderRadius: 8,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="count" fill={alpha(theme.palette.info.main, 0.8)} name="Contact Count" />
                    <Bar yAxisId="left" dataKey="success" fill={alpha(theme.palette.success.main, 0.8)} name="Success Rate %" />
                    <Bar yAxisId="right" dataKey="cost" fill={alpha(theme.palette.error.main, 0.8)} name="Cost per Contact (₹)" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grow>
          </Grid>

          {/* Payment Mode Distribution */}
          <Grid item xs={12} lg={6}>
            <Grow in={loaded} style={{ transformOrigin: '0 0 0' }} timeout={1400}>
              <Paper sx={{ p: 3, height: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <Typography variant="h6" gutterBottom fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PaymentModeIcon color="primary" />
                  Payment Mode Distribution
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Payment preferences and amounts by payment method
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie
                      data={paymentModeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ mode, value, amount }) => `${mode}: ${value}% (₹${(amount/100000).toFixed(1)}L)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentModeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `${value}% (₹${new Intl.NumberFormat('en-IN').format(props.payload.amount)})`,
                        'Share'
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grow>
          </Grid>

          {/* Cost per Renewal */}
          <Grid item xs={12} lg={6}>
            <Grow in={loaded} style={{ transformOrigin: '0 0 0' }} timeout={1500}>
              <Paper sx={{ p: 3, height: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <Typography variant="h6" gutterBottom fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CostIcon color="primary" />
                  Cost per Renewal Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Cost efficiency analysis across different channels
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={costData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="channel" angle={-45} textAnchor="end" height={80} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'Cost per Renewal') return [`₹${value}`, name];
                        if (name === 'Total Cost') return [`₹${new Intl.NumberFormat('en-IN').format(value)}`, name];
                        return [value, name];
                      }}
                      contentStyle={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#fff',
                        borderRadius: 8,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="volume" fill={alpha(theme.palette.info.main, 0.8)} name="Volume" />
                    <Bar yAxisId="left" dataKey="costPerRenewal" fill={alpha(theme.palette.warning.main, 0.8)} name="Cost per Renewal (₹)" />
                    <Bar yAxisId="right" dataKey="totalCost" fill={alpha(theme.palette.error.main, 0.8)} name="Total Cost (₹)" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grow>
          </Grid>
        </Grid>

        {/* Payment Analysis Charts */}
        <Typography variant="h5" gutterBottom sx={{ mt: 6, mb: 3, fontWeight: 600 }}>
          Payment & Collection Analysis
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {/* Payment Type Breakdown */}
          <Grid item xs={12} md={6}>
            <Grow in={loaded} style={{ transformOrigin: '0 0 0' }} timeout={1200}>
              <Paper sx={{ p: 3, height: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Payment Type Breakdown
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Distribution of premium payment frequencies
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie
                      data={paymentTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, value }) => `${type}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grow>
          </Grid>

          {/* Average Payment Timeline */}
          <Grid item xs={12} md={6}>
            <Grow in={loaded} style={{ transformOrigin: '0 0 0' }} timeout={1300}>
              <Paper sx={{ p: 3, height: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Average Payment Timeline
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Average days to receive payment from due date
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <LineChart data={paymentTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#fff',
                        borderRadius: 8,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                      }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="avgDays" 
                      stroke={theme.palette.primary.main} 
                      strokeWidth={3}
                      name="Avg Days to Payment"
                      dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grow>
          </Grid>

          {/* Due Date Analysis */}
          <Grid item xs={12} md={6}>
            <Grow in={loaded} style={{ transformOrigin: '0 0 0' }} timeout={1400}>
              <Paper sx={{ p: 3, height: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Payment Due Date Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Payment timing relative to due dates
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={dueDateAnalysisData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis type="number" />
                    <YAxis dataKey="category" type="category" width={120} />
                    <Tooltip 
                      formatter={(value, name) => [value, name]}
                      contentStyle={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#fff',
                        borderRadius: 8,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                      }} 
                    />
                    <Legend />
                    <Bar 
                      dataKey="count" 
                      fill={({ payload }) => payload?.color || '#8884d8'}
                      name="Payment Count"
                      radius={[0, 4, 4, 0]}
                    >
                      {dueDateAnalysisData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grow>
          </Grid>

          {/* Policy-wise Renewal & Collection */}
          <Grid item xs={12} md={6}>
            <Grow in={loaded} style={{ transformOrigin: '0 0 0' }} timeout={1500}>
              <Paper sx={{ p: 3, height: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Policy-wise Renewal & Collection
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Collection rates by insurance policy type
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={policyRenewalData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="policyType" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#fff',
                        borderRadius: 8,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                      }} 
                    />
                    <Legend />
                    <Bar 
                      dataKey="pending" 
                      stackId="a"
                      fill={alpha(theme.palette.warning.main, 0.8)} 
                      name="Pending" 
                      radius={[0, 0, 0, 0]} 
                    />
                    <Bar 
                      dataKey="collected" 
                      stackId="a"
                      fill={alpha(theme.palette.success.main, 0.8)} 
                      name="Collected" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grow>
          </Grid>

          {/* Channel-wise Collection */}
          <Grid item xs={12} md={6}>
            <Grow in={loaded} style={{ transformOrigin: '0 0 0' }} timeout={1600}>
              <Paper sx={{ p: 3, height: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Channel-wise Collection Performance
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Collection achievement vs targets by channel
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={channelCollectionData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="channel" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [`₹${(value/100000).toFixed(1)}L`, name]}
                      contentStyle={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#fff',
                        borderRadius: 8,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                      }} 
                    />
                    <Legend />
                    <Bar 
                      dataKey="target" 
                      fill={alpha(theme.palette.info.main, 0.3)} 
                      name="Target (₹)" 
                      radius={[4, 4, 0, 0]} 
                    />
                    <Bar 
                      dataKey="collected" 
                      fill={alpha(theme.palette.success.main, 0.8)} 
                      name="Collected (₹)" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grow>
          </Grid>

          {/* Collection Mode Analysis */}
          <Grid item xs={12} md={6}>
            <Grow in={loaded} style={{ transformOrigin: '0 0 0' }} timeout={1700}>
              <Paper sx={{ p: 3, height: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Collection Mode Distribution
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Payment methods used by customers (CC, Branch, Bank, Agent)
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie
                      data={collectionModeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ mode, percentage }) => `${mode}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {collectionModeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value}%`, name]}
                      contentStyle={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#fff',
                        borderRadius: 8,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                      }} 
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grow>
          </Grid>
        </Grid>

        {/* Renewals Campaign Tracking */}
        <Typography variant="h5" gutterBottom sx={{ mt: 6, mb: 3, fontWeight: 600 }}>
          Renewals Campaign Tracking
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grow in={loaded} style={{ transformOrigin: '0 0 0' }} timeout={1600}>
              <Paper sx={{ p: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CampaignIcon color="primary" />
                      Active Renewal Campaigns
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Real-time tracking of all renewal marketing campaigns
                    </Typography>
                  </Box>
                </Box>
                
                <Grid container spacing={3}>
                  {campaignData.map((campaign, index) => (
                    <Grid item xs={12} md={6} lg={3} key={campaign.id}>
                      <Grow in={loaded} timeout={(index + 1) * 200}>
                        <Card sx={{ 
                          height: '100%',
                          borderRadius: 3,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                          border: `1px solid ${theme.palette.divider}`,
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              height: 4,
                              background: campaign.status === 'active' 
                                ? 'linear-gradient(90deg, #4caf50, #66bb6a)'
                                : campaign.status === 'paused'
                                ? 'linear-gradient(90deg, #ff9800, #ffb74d)'
                                : 'linear-gradient(90deg, #2196f3, #64b5f6)'
                            }}
                          />
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                              <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <Box sx={{ 
                                    width: 32, 
                                    height: 32, 
                                    borderRadius: '50%', 
                                    bgcolor: theme.palette.primary.main,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 1
                                  }}>
                                    {campaign.type === 'email' && <EmailIcon sx={{ fontSize: 16, color: 'white' }} />}
                                    {campaign.type === 'whatsapp' && <WhatsAppIcon sx={{ fontSize: 16, color: 'white' }} />}
                                    {campaign.type === 'sms' && <SmsIcon sx={{ fontSize: 16, color: 'white' }} />}
                                  </Box>
                                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                                    {campaign.name}
                                  </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                  {campaign.uploadFilename}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Chip 
                                    label={campaign.status} 
                                    color={
                                      campaign.status === 'active' ? 'success' :
                                      campaign.status === 'paused' ? 'warning' : 'info'
                                    }
                                    size="small"
                                    sx={{ 
                                      fontWeight: 500,
                                      textTransform: 'capitalize',
                                      fontSize: '0.75rem'
                                    }}
                                  />
                                </Box>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                {campaign.status === 'active' && (
                                  <IconButton size="small" sx={{ color: theme.palette.warning.main }}>
                                    <PauseIcon fontSize="small" />
                                  </IconButton>
                                )}
                                {campaign.status === 'paused' && (
                                  <IconButton size="small" sx={{ color: theme.palette.success.main }}>
                                    <PlayIcon fontSize="small" />
                                  </IconButton>
                                )}
                                <IconButton size="small" sx={{ color: theme.palette.primary.main }}>
                                  <ViewIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                            
                            <Box sx={{ 
                              mt: 2, 
                              p: 2, 
                              borderRadius: 2, 
                              backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.4) : alpha(theme.palette.background.default, 0.8),
                              border: `1px solid ${theme.palette.divider}`
                            }}>
                              <Grid container spacing={2}>
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="text.secondary">
                                    Target
                                  </Typography>
                                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                                    {campaign.targetCount}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="primary.main">
                                    Sent
                                  </Typography>
                                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', fontSize: '1.1rem' }}>
                                    {campaign.sent}
                                  </Typography>
                                </Grid>
                                
                                {campaign.type === 'email' && (
                                  <>
                                    <Grid item xs={6}>
                                      <Typography variant="body2" color="success.main">
                                        Open Rate
                                      </Typography>
                                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main', fontSize: '1.1rem' }}>
                                        {campaign.openRate}%
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography variant="body2" color="warning.main">
                                        Click Rate
                                      </Typography>
                                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.main', fontSize: '1.1rem' }}>
                                        {campaign.clickRate}%
                                      </Typography>
                                    </Grid>
                                  </>
                                )}
                                
                                {campaign.type === 'whatsapp' && (
                                  <>
                                    <Grid item xs={6}>
                                      <Typography variant="body2" color="success.main">
                                        Delivery Rate
                                      </Typography>
                                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main', fontSize: '1.1rem' }}>
                                        {campaign.deliveryRate}%
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography variant="body2" color="info.main">
                                        Read Rate
                                      </Typography>
                                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'info.main', fontSize: '1.1rem' }}>
                                        {campaign.readRate}%
                                      </Typography>
                                    </Grid>
                                  </>
                                )}
                                
                                {campaign.type === 'sms' && (
                                  <>
                                    <Grid item xs={6}>
                                      <Typography variant="body2" color="success.main">
                                        Delivery Rate
                                      </Typography>
                                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main', fontSize: '1.1rem' }}>
                                        {campaign.deliveryRate}%
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography variant="body2" color="warning.main">
                                        Click Rate
                                      </Typography>
                                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.main', fontSize: '1.1rem' }}>
                                        {campaign.clickRate}%
                                      </Typography>
                                    </Grid>
                                  </>
                                )}
                                
                                <Grid item xs={12}>
                                  <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    mt: 1,
                                    pt: 1,
                                    borderTop: `1px solid ${theme.palette.divider}`
                                  }}>
                                    <Typography variant="body2" color="text.secondary">
                                      Conversions
                                    </Typography>
                                    <Box sx={{ textAlign: 'right' }}>
                                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main', fontSize: '1.1rem' }}>
                                        {campaign.converted}
                                      </Typography>
                                      <Typography variant="caption" color="error.main">
                                        {campaign.conversionRate}%
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Box>
                            
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                              Created: {new Date(campaign.createdAt).toLocaleDateString()}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grow>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grow>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default Dashboard;