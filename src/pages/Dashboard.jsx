import React, { useState, useEffect, useCallback } from 'react';
import { 
  Grid, Paper, Typography, Box, Card, CardContent, 
  FormControl, InputLabel, Select, MenuItem, alpha, useTheme,
  Fade, Grow
} from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { fetchDashboardStats, fetchTrendData } from '../services/api';
import { 
  Timeline as TimelineIcon,
  Policy as PolicyIcon, 
  AssignmentTurnedIn as CompletedIcon, 
  Watch as PendingIcon,
  ErrorOutline as ErrorIcon,
  Payments as PaymentsIcon,
  AccountBalance as AccountBalanceIcon
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
  const [dateRange, setDateRange] = useState('week');
  const [policyType, setPolicyType] = useState('all');
  const [caseStatus, setCaseStatus] = useState('all');
  const [loaded, setLoaded] = useState(false);

  // Memoize the loadDashboardData function to avoid recreating it on every render
  const loadDashboardData = useCallback(async () => {
    try {
      const statsData = await fetchDashboardStats(dateRange, policyType, caseStatus);
      if (statsData) {
        setStats(prev => ({
          ...prev,
          ...statsData
        }));
      }
      
      const trends = await fetchTrendData(dateRange, policyType, caseStatus);
      if (trends && Array.isArray(trends)) {
        setTrendData(trends);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  }, [dateRange, policyType, caseStatus]);

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
        paymentCollected: 185000,
        paymentPending: 42500
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
        displayValue = new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(numericValue);
      } else {
        displayValue = '$0'; // Default fallback for NaN values
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
          <CardContent sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h6" component="div" color="white" fontWeight="500" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" component="div" color="white" fontWeight="bold">
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
          Insurance Policy Renewal Dashboard
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
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <MenuItem value="day">Daily</MenuItem>
                  <MenuItem value="week">Weekly</MenuItem>
                  <MenuItem value="month">Monthly</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl sx={{ minWidth: 160 }} size="small">
                <InputLabel>Policy Type</InputLabel>
                <Select
                  value={policyType}
                  label="Policy Type"
                  onChange={(e) => setPolicyType(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="auto">Auto</MenuItem>
                  <MenuItem value="home">Home</MenuItem>
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
        </Grid>
      </Box>
    </Fade>
  );
};

export default Dashboard;