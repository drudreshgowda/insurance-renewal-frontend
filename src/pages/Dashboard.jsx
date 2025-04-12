import React, { useState, useEffect } from 'react';
import { 
  Grid, Paper, Typography, Box, Card, CardContent, 
  FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { fetchDashboardStats, fetchTrendData } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCases: 0,
    inProgress: 0,
    renewed: 0,
    pendingAction: 0,
    errors: 0
  });
  
  const [trendData, setTrendData] = useState([]);
  const [dateRange, setDateRange] = useState('week');
  const [policyType, setPolicyType] = useState('all');
  const [caseStatus, setCaseStatus] = useState('all');

  useEffect(() => {
    // In a real app, these would fetch from your API
    const loadDashboardData = async () => {
      try {
        const statsData = await fetchDashboardStats(dateRange, policyType, caseStatus);
        setStats(statsData);
        
        const trends = await fetchTrendData(dateRange, policyType, caseStatus);
        setTrendData(trends);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };
    
    loadDashboardData();
    
    // For demo purposes, let's set some mock data
    setStats({
      totalCases: 1250,
      inProgress: 320,
      renewed: 780,
      pendingAction: 95,
      errors: 55
    });
    
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
  }, [dateRange, policyType, caseStatus]);

  const StatCard = ({ title, value, color }) => (
    <Card sx={{ height: '100%', backgroundColor: color }}>
      <CardContent>
        <Typography variant="h6" component="div" color="white">
          {title}
        </Typography>
        <Typography variant="h3" component="div" color="white">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
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
        
        <FormControl sx={{ minWidth: 120 }}>
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
        
        <FormControl sx={{ minWidth: 120 }}>
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
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard title="Total Cases" value={stats.totalCases} color="#1976d2" />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard title="In Progress" value={stats.inProgress} color="#ff9800" />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard title="Renewed" value={stats.renewed} color="#4caf50" />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard title="Pending Action" value={stats.pendingAction} color="#9c27b0" />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard title="Errors" value={stats.errors} color="#f44336" />
        </Grid>
      </Grid>
      
      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Case Volume
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="newCases" fill="#8884d8" name="New Cases" />
                <Bar dataKey="renewals" fill="#82ca9d" name="Completed Renewals" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Success Rate Trend
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 1]} tickFormatter={(tick) => `${(tick * 100).toFixed(0)}%`} />
                <Tooltip formatter={(value) => `${(value * 100).toFixed(2)}%`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="successRate" 
                  stroke="#ff7300" 
                  name="Success Rate"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;