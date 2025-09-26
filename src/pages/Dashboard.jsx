import React, { useState, useEffect, useCallback } from 'react';
import { 
  Grid, Paper, Typography, Box, Card, CardContent, 
  FormControl, InputLabel, Select, MenuItem, alpha, useTheme,
  Fade, Grow, Chip, IconButton, Button, Collapse, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Switch, FormControlLabel, List, ListItem, ListItemText, ListItemIcon,
  ListItemSecondaryAction, Avatar, Accordion, AccordionSummary, AccordionDetails,
  Tabs, Tab, Badge, Tooltip, LinearProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  TreeMap, Sankey, RadialBarChart, RadialBar
} from 'recharts';
import { fetchDashboardStats, fetchTrendData, fetchBatchStatus, fetchTeams, fetchTeamMembers } from '../services/api';
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
  Visibility as ViewIcon,
  Group as TeamIcon,
  Person as MemberIcon,
  FileDownload as ExportIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  AccountTree as HierarchyIcon,
  Business as BusinessIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  SupervisorAccount as ManagerIcon,
  GroupWork as DepartmentIcon,
  Store as BranchIcon,
  Public as RegionIcon,
  Assessment as AnalyticsIcon,
  Speed as PerformanceIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as RemoveIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { channelAPI } from "../api/Renewal";
import { hierarchyAPI } from "../api/Hierarchy";

import { Snackbar } from '@mui/material';

import Alert from '@mui/material/Alert';

const Dashboard = () => {
//live api call
const [channels, setChannels] = useState([]);
const [loading, setLoading] = useState(true);
const [snackbar, setSnackbar] = useState({
  open: false,
  message: "",
  severity: "success"
});

useEffect(() => {
  const fetchChannels = async () => {
    const result = await channelAPI.ChannelPerformanceSummary();
    if (result.success) {
      setChannels(result.data.results || []);
    } else {
      console.error(result.message);
      setChannels([]);
    }
    setLoading(false);
  };
  fetchChannels();
}, []);

// const handleChannelSave = async () => {
//   if (channelDialog.mode === 'create') {
//     const newChannel = {
//       name: channelDialog.channelData.name,
//       channel_type: channelDialog.channelData.type,
//       description: channelDialog.channelData.description,
//       target_audience_name_input: channelDialog.channelData.targetAudience,
//       manager_name: channelDialog.channelData.manager,
//       cost_per_lead: channelDialog.channelData.costPerLead 
//         ? channelDialog.channelData.costPerLead.toFixed(2) 
//         : "0.00",
//       budget: channelDialog.channelData.budget 
//         ? channelDialog.channelData.budget.toFixed(2) 
//         : "0.00",
//       status: channelDialog.channelData.status,
//       priority: channelDialog.channelData.settings?.priority,
//       working_hours: channelDialog.channelData.settings?.workingHours,
//       max_capacity: channelDialog.channelData.settings?.maxCapacity,
//     };

//     const result = await channelAPI.CreateChannel(newChannel);

//     if (result.success) {
//       const refresh = await channelAPI.ChannelPerformanceSummary();
//       if (refresh.success) {
//         setChannels(refresh.data.results || []);
//       }

//       setSnackbar({
//         open: true,
//         message: "Channel created successfully",
//         severity: "success",
//       });
//     } else {
//       setSnackbar({
//         open: true,
//         message: result.message,
//         severity: "error",
//       });
//     }
//   }

//   setChannelDialog({ open: false, mode: "create", channelData: {} });
// };



const handleChannelSave = async () => {
  const payload = {
    name: channelDialog.channelData.name,
    channel_type: channelDialog.channelData.type,
    description: channelDialog.channelData.description,
    target_audience_name_input: channelDialog.channelData.targetAudience,
    manager_name: channelDialog.channelData.manager,
    cost_per_lead: channelDialog.channelData.costPerLead 
      ? channelDialog.channelData.costPerLead.toFixed(2) 
      : "0.00",
    budget: channelDialog.channelData.budget 
      ? channelDialog.channelData.budget.toFixed(2) 
      : "0.00",
    status: channelDialog.channelData.status,
    priority: channelDialog.channelData.settings?.priority,
    working_hours: channelDialog.channelData.settings?.workingHours,
    max_capacity: channelDialog.channelData.settings?.maxCapacity,
  };

  let result;
  if (channelDialog.mode === "create") {
    result = await channelAPI.CreateChannel(payload);
  } else if (channelDialog.mode === "edit" && channelDialog.channelData.id) {
    result = await channelAPI.UpdateChannel(channelDialog.channelData.id, payload);
  }

  if (result?.success) {
    const refresh = await channelAPI.ChannelPerformanceSummary();
    if (refresh.success) {
      setChannels(refresh.data.results || []);
    }

    setSnackbar({
      open: true,
      message: channelDialog.mode === "create" 
        ? "Channel created successfully" 
        : "Channel updated successfully",
      severity: "success",
    });
  } else {
    setSnackbar({
      open: true,
      message: result?.message || "Something went wrong",
      severity: "error",
    });
  }

  setChannelDialog({ open: false, mode: "create", channelData: {} });
};



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

  // Debug log to see current stats
  // eslint-disable-next-line no-console
  console.log('📊 Current stats state:', stats);
  
  const [trendData, setTrendData] = useState([]);
  const [batchData, setBatchData] = useState([]);
  const [dateRange, setDateRange] = useState('week');
  const [policyType, setPolicyType] = useState('all');
  const [caseStatus, setCaseStatus] = useState('all');
  const [loaded, setLoaded] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedTeamMember, setSelectedTeamMember] = useState('all');
  const [teams, setTeams] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  
  // MIS Export states
  const [exportExpanded, setExportExpanded] = useState(false);
  const [exportDateRange, setExportDateRange] = useState('month');
  const [exportDataType, setExportDataType] = useState('all');
  const [exportFormat, setExportFormat] = useState('excel');
  const [exporting, setExporting] = useState(false);
  const [exportStartDate, setExportStartDate] = useState(null);
  const [exportEndDate, setExportEndDate] = useState(null);
  const [exportPolicyType, setExportPolicyType] = useState('all');
  const [exportCaseStatus, setExportCaseStatus] = useState('all');

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
  
  // Channel and Hierarchy Management states
  const [activeManagementTab, setActiveManagementTab] = useState(0);
  const [channelManagementExpanded, setChannelManagementExpanded] = useState(false);
  const [hierarchyManagementExpanded, setHierarchyManagementExpanded] = useState(false);
  
  // Channel Management states
  //const [channels, setChannels] = useState([]);
  const [channelDialog, setChannelDialog] = useState({
    open: false,
    mode: 'create', // 'create', 'edit'
    channelData: {
      id: '',
      name: '',
      type: 'online',
      status: 'active',
      description: '',
      targetAudience: '',
      costPerLead: 0,
      conversionRate: 0,
      manager: '',
      budget: 0,
      settings: {
        autoAssignment: true,
        priority: 'medium',
        workingHours: '9-18',
        maxCapacity: 100
      }
    }
  });
  
  // Hierarchy Management states
  const [hierarchyData, setHierarchyData] = useState([]);
  const [hierarchyDialog, setHierarchyDialog] = useState({
    open: false,
    mode: 'create', // 'create', 'edit'
    nodeData: {
      id: '',
      name: '',
      type: 'department', // 'region', 'state', 'branch', 'department', 'team'
      parentId: '',
      managerId: '',
      description: '',
      budget: 0,
      targetCases: 0,
      status: 'active'
    }
  });
  
  const [channelPerformanceData, setChannelPerformanceData] = useState([]);
  const [hierarchyPerformanceData, setHierarchyPerformanceData] = useState([]);

  // Memoize the loadDashboardData function to avoid recreating it on every render
  const loadDashboardData = useCallback(async () => {
    try {
      const statsData = await fetchDashboardStats(dateRange, policyType, caseStatus, startDate, endDate, selectedTeam, selectedTeamMember);
      // eslint-disable-next-line no-console
      console.log('📈 Dashboard received stats data:', statsData);
      if (statsData) {
        setStats(prev => {
          const newStats = {
            ...prev,
            ...statsData
          };
          // eslint-disable-next-line no-console
          console.log('🔄 Setting new stats:', newStats);
          return newStats;
        });
      }
      
      const trends = await fetchTrendData(dateRange, policyType, caseStatus, startDate, endDate, selectedTeam, selectedTeamMember);
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
  }, [dateRange, policyType, caseStatus, startDate, endDate, selectedTeam, selectedTeamMember]);

  // Load teams on component mount
  useEffect(() => {
    const loadTeams = async () => {
      try {
        const teamsData = await fetchTeams();
        if (teamsData && Array.isArray(teamsData)) {
          setTeams(teamsData);
        }
      } catch (error) {
        console.error('Failed to load teams:', error);
      }
    };
    
    loadTeams();
  }, []);

  // Load team members when team is selected
  useEffect(() => {
    const loadTeamMembers = async () => {
      if (selectedTeam && selectedTeam !== 'all') {
        try {
          const membersData = await fetchTeamMembers(selectedTeam);
          if (membersData && Array.isArray(membersData)) {
            setTeamMembers(membersData);
          }
        } catch (error) {
          console.error('Failed to load team members:', error);
        }
      } else {
        setTeamMembers([]);
        setSelectedTeamMember('all');
      }
    };
    
    loadTeamMembers();
  }, [selectedTeam]);

  // MIS Export functionality
  const handleMISExport = async () => {
    setExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create export data based on selected filters
      const exportData = {
        dateRange: exportDateRange,
        customStartDate: exportStartDate,
        customEndDate: exportEndDate,
        dataType: exportDataType,
        format: exportFormat,
        policyType: exportPolicyType,
        caseStatus: exportCaseStatus,
        stats: stats,
        trends: trendData,
        timestamp: new Date().toISOString()
      };
      
      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0];
      const dateRangeStr = exportDateRange === 'custom' && exportStartDate && exportEndDate ? 
        `${exportStartDate.toISOString().split('T')[0]}_to_${exportEndDate.toISOString().split('T')[0]}` : 
        exportDateRange;
      
      // Build filename parts
      const filenameParts = ['MIS_Report', exportDataType];
      if (exportPolicyType !== 'all') filenameParts.push(exportPolicyType);
      if (exportCaseStatus !== 'all') filenameParts.push(exportCaseStatus);
      filenameParts.push(dateRangeStr, timestamp);
      
      const filename = `${filenameParts.join('_')}.${exportFormat === 'excel' ? 'xlsx' : exportFormat === 'csv' ? 'csv' : exportFormat === 'pdf' ? 'pdf' : 'json'}`;
      
      // Simulate file download
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Collapse the export panel after successful export
      setExportExpanded(false);
      
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

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
    
    // Mock data removed - now using live API via fetchDashboardStats
    
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
    const mockChannelChartData = [
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

    setChannelData(mockChannelChartData);
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

    // Mock Channel Management Data
    // const mockChannelData = [
    //   {
    //     id: 'ch-001',
    //     name: 'Online Portal',
    //     type: 'online',
    //     status: 'active',
    //     description: 'Web-based customer portal for policy renewals',
    //     targetAudience: 'Tech-savvy customers',
    //     costPerLead: 45,
    //     conversionRate: 68.5,
    //     manager: 'Rajesh Kumar',
    //     budget: 500000,
    //     currentCases: 1250,
    //     renewedCases: 856,
    //     revenue: 12450000,
    //     settings: {
    //       autoAssignment: true,
    //       priority: 'high',
    //       workingHours: '24/7',
    //       maxCapacity: 2000
    //     },
    //     performance: {
    //       efficiency: 85.2,
    //       customerSatisfaction: 4.3,
    //       avgResponseTime: 2.5
    //     }
    //   },
    //   {
    //     id: 'ch-002',
    //     name: 'Mobile Application',
    //     type: 'mobile',
    //     status: 'active',
    //     description: 'Mobile app for on-the-go policy management',
    //     targetAudience: 'Mobile-first users',
    //     costPerLead: 35,
    //     conversionRate: 72.3,
    //     manager: 'Priya Sharma',
    //     budget: 350000,
    //     currentCases: 890,
    //     renewedCases: 644,
    //     revenue: 8960000,
    //     settings: {
    //       autoAssignment: true,
    //       priority: 'high',
    //       workingHours: '24/7',
    //       maxCapacity: 1500
    //     },
    //     performance: {
    //       efficiency: 88.7,
    //       customerSatisfaction: 4.5,
    //       avgResponseTime: 1.8
    //     }
    //   },
    //   {
    //     id: 'ch-003',
    //     name: 'Branch Network',
    //     type: 'offline',
    //     status: 'active',
    //     description: 'Physical branch offices for in-person service',
    //     targetAudience: 'Traditional customers',
    //     costPerLead: 120,
    //     conversionRate: 78.9,
    //     manager: 'Amit Patel',
    //     budget: 800000,
    //     currentCases: 650,
    //     renewedCases: 513,
    //     revenue: 7150000,
    //     settings: {
    //       autoAssignment: false,
    //       priority: 'medium',
    //       workingHours: '9-18',
    //       maxCapacity: 800
    //     },
    //     performance: {
    //       efficiency: 79.2,
    //       customerSatisfaction: 4.7,
    //       avgResponseTime: 15.2
    //     }
    //   },
    //   {
    //     id: 'ch-004',
    //     name: 'Call Center',
    //     type: 'phone',
    //     status: 'active',
    //     description: 'Telephone-based customer support and renewals',
    //     targetAudience: 'All customer segments',
    //     costPerLead: 80,
    //     conversionRate: 65.4,
    //     manager: 'Sunita Verma',
    //     budget: 600000,
    //     currentCases: 1100,
    //     renewedCases: 719,
    //     revenue: 9570000,
    //     settings: {
    //       autoAssignment: true,
    //       priority: 'medium',
    //       workingHours: '8-20',
    //       maxCapacity: 1200
    //     },
    //     performance: {
    //       efficiency: 76.8,
    //       customerSatisfaction: 4.1,
    //       avgResponseTime: 8.5
    //     }
    //   },
    //   {
    //     id: 'ch-005',
    //     name: 'Agent Network',
    //     type: 'agent',
    //     status: 'active',
    //     description: 'Field agents for personalized customer service',
    //     targetAudience: 'High-value customers',
    //     costPerLead: 200,
    //     conversionRate: 82.1,
    //     manager: 'Vikash Singh',
    //     budget: 450000,
    //     currentCases: 380,
    //     renewedCases: 312,
    //     revenue: 5320000,
    //     settings: {
    //       autoAssignment: false,
    //       priority: 'high',
    //       workingHours: '10-19',
    //       maxCapacity: 500
    //     },
    //     performance: {
    //       efficiency: 92.3,
    //       customerSatisfaction: 4.8,
    //       avgResponseTime: 24.0
    //     }
    //   }
    // ];

    // Mock Hierarchy Data
    const mockHierarchyData = [
      {
        id: 'reg-001',
        name: 'North Region',
        type: 'region',
        parentId: null,
        managerId: 'mgr-001',
        managerName: 'Rajesh Kumar',
        description: 'Northern India operations',
        budget: 5000000,
        targetCases: 2500,
        currentCases: 2350,
        renewedCases: 2021,
        revenue: 28350000,
        status: 'active',
        children: ['st-001', 'st-002'],
        performance: {
          efficiency: 86.0,
          budgetUtilization: 78.5,
          targetAchievement: 94.0
        }
      },
      {
        id: 'st-001',
        name: 'Delhi State',
        type: 'state',
        parentId: 'reg-001',
        managerId: 'mgr-002',
        managerName: 'Priya Sharma',
        description: 'Delhi state operations',
        budget: 2500000,
        targetCases: 1200,
        currentCases: 1150,
        renewedCases: 1012,
        revenue: 14200000,
        status: 'active',
        children: ['br-001', 'br-002'],
        performance: {
          efficiency: 88.0,
          budgetUtilization: 82.3,
          targetAchievement: 95.8
        }
      },
      {
        id: 'br-001',
        name: 'Connaught Place Branch',
        type: 'branch',
        parentId: 'st-001',
        managerId: 'mgr-003',
        managerName: 'Amit Patel',
        description: 'Central Delhi branch office',
        budget: 1200000,
        targetCases: 600,
        currentCases: 580,
        renewedCases: 522,
        revenue: 7320000,
        status: 'active',
        children: ['dp-001', 'dp-002'],
        performance: {
          efficiency: 90.0,
          budgetUtilization: 85.7,
          targetAchievement: 96.7
        }
      },
      {
        id: 'dp-001',
        name: 'Renewals Department',
        type: 'department',
        parentId: 'br-001',
        managerId: 'mgr-004',
        managerName: 'Sunita Verma',
        description: 'Policy renewal processing department',
        budget: 600000,
        targetCases: 300,
        currentCases: 290,
        renewedCases: 267,
        revenue: 3750000,
        status: 'active',
        children: ['tm-001', 'tm-002'],
        performance: {
          efficiency: 92.1,
          budgetUtilization: 88.2,
          targetAchievement: 96.7
        }
      },
      {
        id: 'tm-001',
        name: 'Senior Renewal Team',
        type: 'team',
        parentId: 'dp-001',
        managerId: 'mgr-005',
        managerName: 'Vikash Singh',
        description: 'Senior team handling complex renewals',
        budget: 300000,
        targetCases: 150,
        currentCases: 145,
        renewedCases: 138,
        revenue: 1950000,
        status: 'active',
        children: [],
        teamMembers: [
          { id: 'emp-001', name: 'Ravi Kumar', role: 'Senior Executive', cases: 48, renewed: 45 },
          { id: 'emp-002', name: 'Neha Singh', role: 'Senior Executive', cases: 47, renewed: 46 },
          { id: 'emp-003', name: 'Arjun Patel', role: 'Executive', cases: 50, renewed: 47 }
        ],
        performance: {
          efficiency: 95.2,
          budgetUtilization: 92.1,
          targetAchievement: 96.7
        }
      }
    ];

    // Mock Channel Performance Data
    const mockChannelPerformanceData = [
      { channel: 'Online Portal', efficiency: 85.2, cost: 45, conversion: 68.5, satisfaction: 4.3 },
      { channel: 'Mobile App', efficiency: 88.7, cost: 35, conversion: 72.3, satisfaction: 4.5 },
      { channel: 'Branch Network', efficiency: 79.2, cost: 120, conversion: 78.9, satisfaction: 4.7 },
      { channel: 'Call Center', efficiency: 76.8, cost: 80, conversion: 65.4, satisfaction: 4.1 },
      { channel: 'Agent Network', efficiency: 92.3, cost: 200, conversion: 82.1, satisfaction: 4.8 }
    ];

    // Mock Hierarchy Performance Data
    const mockHierarchyPerformanceData = [
      { name: 'North Region', level: 'Region', efficiency: 86.0, budget: 78.5, target: 94.0, revenue: 28350000 },
      { name: 'West Region', level: 'Region', efficiency: 82.3, budget: 85.2, target: 91.5, revenue: 25680000 },
      { name: 'South Region', level: 'Region', efficiency: 89.1, budget: 79.8, target: 96.2, revenue: 31240000 },
      { name: 'East Region', level: 'Region', efficiency: 84.7, budget: 82.1, target: 88.9, revenue: 22150000 }
    ];

    //setChannels(mockChannelData);
    setHierarchyData(mockHierarchyData);
    setChannelPerformanceData(mockChannelPerformanceData);
    setHierarchyPerformanceData(mockHierarchyPerformanceData);

    // Set loaded state for animations
    const loadedTimer = setTimeout(() => {
      setLoaded(true);
    }, 400);

    // Cleanup timers
    return () => {
      clearTimeout(loadedTimer);
    };
  }, [loadDashboardData]); // Include the memoized function in dependencies

  // Channel Management Handlers
  const handleChannelCreate = () => {
    setChannelDialog({
      open: true,
      mode: 'create',
      channelData: {
        id: '',
        name: '',
        type: 'online',
        status: 'active',
        description: '',
        targetAudience: '',
        costPerLead: 0,
        conversionRate: 0,
        manager: '',
        budget: 0,
        settings: {
          autoAssignment: true,
          priority: 'medium',
          workingHours: '9-18',
          maxCapacity: 100
        }
      }
    });
  };

  const handleChannelEdit = async (channelId) => {
    try {
      const result = await channelAPI.GetChannelById(channelId);
      if (result.success) {
        const data = result.data;
        setChannelDialog({
          open: true,
          mode: 'edit',
          channelData: {
            id: data.id,
            name: data.name,
            type: data.channel_type,   // API has `channel_type`
            description: data.description,
            targetAudience: data.target_audience_name,
            manager: data.manager_name,
            costPerLead: Number(data.cost_per_lead),
            budget: Number(data.budget),
            status: data.status,
            settings: {
              priority: data.priority,
              workingHours: data.working_hours,
              maxCapacity: data.max_capacity,
              autoAssignment: data.is_active, // mapped from is_active
            },
          },
        });
      } else {
        console.error("Failed to fetch channel:", result.message);
      }
    } catch (error) {
      console.error("Error in handleChannelEdit:", error);
    }
  };
  

 

  const handleChannelDelete = async (channelId) => {
    try {
      const result = await channelAPI.DeleteChannel(channelId);
  
      if (result.success) {
        // refresh list from backend (recommended)
        const refresh = await channelAPI.ChannelPerformanceSummary();
        if (refresh.success) {
          setChannels(refresh.data.results || []);
        } else {
          // fallback: remove locally if refresh fails
          setChannels(prev => prev.filter(ch => ch.id !== channelId));
        }
  
        setSnackbar({
          open: true,
          message: "Channel deleted successfully",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || "Failed to delete channel",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      setSnackbar({
        open: true,
        message: "Unexpected error occurred",
        severity: "error",
      });
    }
  };
  

  // Hierarchy Management Handlers
  const handleHierarchyCreate = () => {
    setHierarchyDialog({
      open: true,
      mode: 'create',
      nodeData: {
        id: '',
        name: '',
        type: 'department',
        parentId: '',
        managerId: '',
        description: '',
        budget: 0,
        targetCases: 0,
        status: 'active'
      }
    });
  };

  const handleHierarchyEdit = (node) => {
    setHierarchyDialog({
      open: true,
      mode: 'edit',
      nodeData: { ...node }
    });
  };

  const handleHierarchySave = async () => {
    if (hierarchyDialog.mode === "create") {
      const payload = {
        unit_name: hierarchyDialog.nodeData.name,
        unit_type: hierarchyDialog.nodeData.type,
        description: hierarchyDialog.nodeData.description,
        parent_unit: hierarchyDialog.nodeData.parent_unit || null, // ✅ name not ID
        manager_id: hierarchyDialog.nodeData.managerId,
        budget: hierarchyDialog.nodeData.budget ? Number(hierarchyDialog.nodeData.budget) : 0,
        target_cases: hierarchyDialog.nodeData.targetCases ? Number(hierarchyDialog.nodeData.targetCases) : 0,
        status: hierarchyDialog.nodeData.status || "active",
      };
  
      const result = await hierarchyAPI.CreateUnit(payload);
  
      if (result.success) {
        setHierarchyData((prev) => [...prev, result.data]);
        setSnackbar({
          open: true,
          message: "Hierarchy unit created successfully",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || "Failed to create hierarchy unit",
          severity: "error",
        });
      }
    } else {
      setHierarchyData((prev) =>
        prev.map((node) =>
          node.id === hierarchyDialog.nodeData.id ? hierarchyDialog.nodeData : node
        )
      );
    }
  
    setHierarchyDialog({ open: false, mode: "create", nodeData: {} });
  };
  
  
  

  const handleHierarchyDelete = (nodeId) => {
    setHierarchyData(prev => prev.filter(node => node.id !== nodeId));
  };

  const getChannelTypeIcon = (type) => {
    switch (type) {
      case 'online': return <ChannelIcon />;
      case 'mobile': return <PhoneIcon />;
      case 'offline': return <BranchIcon />;
      case 'phone': return <PhoneIcon />;
      case 'agent': return <PersonIcon />;
      default: return <BusinessIcon />;
    }
  };

  const getHierarchyTypeIcon = (type) => {
    switch (type) {
      case 'region': return <RegionIcon />;
      case 'state': return <LocationIcon />;
      case 'branch': return <BranchIcon />;
      case 'department': return <DepartmentIcon />;
      case 'team': return <TeamIcon />;
      default: return <HierarchyIcon />;
    }
  };

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
              
              <FormControl sx={{ minWidth: 160 }} size="small">
                <InputLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TeamIcon fontSize="small" />
                    Team
            </Box>
                </InputLabel>
                <Select
                  value={selectedTeam}
                  label="Team"
                  onChange={(e) => {
                    setSelectedTeam(e.target.value);
                    setSelectedTeamMember('all'); // Reset team member when team changes
                  }}
                >
                  <MenuItem value="all">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TeamIcon fontSize="small" color="action" />
                      All Teams
                    </Box>
                  </MenuItem>
                  {teams.map((team) => (
                    <MenuItem key={team.id} value={team.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TeamIcon fontSize="small" color="primary" />
                        <Box>
                          <Typography variant="body2">{team.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {team.memberCount} members
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {selectedTeam !== 'all' && teamMembers.length > 0 && (
                <FormControl sx={{ minWidth: 180 }} size="small">
                  <InputLabel>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <MemberIcon fontSize="small" />
                      Team Member
                    </Box>
                  </InputLabel>
                  <Select
                    value={selectedTeamMember}
                    label="Team Member"
                    onChange={(e) => setSelectedTeamMember(e.target.value)}
                  >
                    <MenuItem value="all">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MemberIcon fontSize="small" color="action" />
                        All Members
                      </Box>
                    </MenuItem>
                    {teamMembers.map((member) => (
                      <MenuItem key={member.id} value={member.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <MemberIcon fontSize="small" color="primary" />
                          <Box>
                            <Typography variant="body2">{member.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {member.role}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
            
            {/* Active Filters Summary */}
            {(selectedTeam !== 'all' || selectedTeamMember !== 'all') && (
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary">
                  Active Filters:
                </Typography>
                {selectedTeam !== 'all' && (
                  <Chip
                    icon={<TeamIcon fontSize="small" />}
                    label={`Team: ${teams.find(t => t.id === selectedTeam)?.name || 'Unknown'}`}
                    variant="outlined"
                    color="primary"
                    size="small"
                    onDelete={() => {
                      setSelectedTeam('all');
                      setSelectedTeamMember('all');
                    }}
                  />
                )}
                {selectedTeamMember !== 'all' && (
                  <Chip
                    icon={<MemberIcon fontSize="small" />}
                    label={`Member: ${teamMembers.find(m => m.id === selectedTeamMember)?.name || 'Unknown'}`}
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onDelete={() => setSelectedTeamMember('all')}
                  />
                )}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* MIS Export Section */}
        <Card sx={{ mb: 4, boxShadow: 'none', border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}` }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: exportExpanded ? 2 : 0 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ExportIcon color="primary" />
                MIS Export
              </Typography>
              <Button
                variant={exportExpanded ? "contained" : "outlined"}
                color="primary"
                startIcon={<ExportIcon />}
                endIcon={exportExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                onClick={() => setExportExpanded(!exportExpanded)}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                {exportExpanded ? 'Collapse Export' : 'Export Data'}
              </Button>
            </Box>
            
            <Collapse in={exportExpanded} timeout="auto" unmountOnExit>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                {/* Date Range Filter */}
                <FormControl sx={{ minWidth: 160 }} size="small">
                  <InputLabel>Export Date Range</InputLabel>
                  <Select
                    value={exportDateRange}
                    label="Export Date Range"
                    onChange={(e) => {
                      setExportDateRange(e.target.value);
                      // Reset custom dates when switching to preset ranges
                      if (e.target.value !== 'custom') {
                        setExportStartDate(null);
                        setExportEndDate(null);
                      }
                    }}
                  >
                    <MenuItem value="day">Today</MenuItem>
                    <MenuItem value="week">This Week</MenuItem>
                    <MenuItem value="month">This Month</MenuItem>
                    <MenuItem value="quarter">This Quarter</MenuItem>
                    <MenuItem value="year">This Year</MenuItem>
                    <MenuItem value="custom">Custom Range</MenuItem>
                    <MenuItem value="all">All Time</MenuItem>
                  </Select>
                </FormControl>

                {/* Custom Date Pickers - Show when Custom Range is selected */}
                {exportDateRange === 'custom' && (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Export Start Date"
                      value={exportStartDate}
                      onChange={(newValue) => setExportStartDate(newValue)}
                      slotProps={{
                        textField: {
                          size: "small",
                          sx: {
                            minWidth: 160,
                            '& .MuiOutlinedInput-root': {
                              fontSize: '0.875rem'
                            }
                          }
                        }
                      }}
                    />
                    <DatePicker
                      label="Export End Date"
                      value={exportEndDate}
                      onChange={(newValue) => setExportEndDate(newValue)}
                      minDate={exportStartDate}
                      slotProps={{
                        textField: {
                          size: "small",
                          sx: {
                            minWidth: 160,
                            '& .MuiOutlinedInput-root': {
                              fontSize: '0.875rem'
                            }
                          }
                        }
                      }}
                    />
                  </LocalizationProvider>
                )}

                {/* Data Type Filter */}
                <FormControl sx={{ minWidth: 160 }} size="small">
                  <InputLabel>Data Type</InputLabel>
                  <Select
                    value={exportDataType}
                    label="Data Type"
                    onChange={(e) => setExportDataType(e.target.value)}
                  >
                    <MenuItem value="all">All Data</MenuItem>
                    <MenuItem value="cases">Cases Only</MenuItem>
                    <MenuItem value="payments">Payments Only</MenuItem>
                    <MenuItem value="trends">Trends Only</MenuItem>
                    <MenuItem value="teams">Team Performance</MenuItem>
                    <MenuItem value="channels">Channel Analytics</MenuItem>
                  </Select>
                </FormControl>

                {/* Policy Type Filter */}
                <FormControl sx={{ minWidth: 160 }} size="small">
                  <InputLabel>Policy Type</InputLabel>
                  <Select
                    value={exportPolicyType}
                    label="Policy Type"
                    onChange={(e) => setExportPolicyType(e.target.value)}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="life">Life Insurance</MenuItem>
                    <MenuItem value="health">Health Insurance</MenuItem>
                    <MenuItem value="motor">Motor Insurance</MenuItem>
                    <MenuItem value="home">Home Insurance</MenuItem>
                    <MenuItem value="travel">Travel Insurance</MenuItem>
                    <MenuItem value="business">Business Insurance</MenuItem>
                  </Select>
                </FormControl>

                {/* Case Status Filter */}
                <FormControl sx={{ minWidth: 160 }} size="small">
                  <InputLabel>Case Status</InputLabel>
                  <Select
                    value={exportCaseStatus}
                    label="Case Status"
                    onChange={(e) => setExportCaseStatus(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="renewed">Renewed</MenuItem>
                    <MenuItem value="lapsed">Lapsed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                    <MenuItem value="on_hold">On Hold</MenuItem>
                    <MenuItem value="follow_up">Follow Up Required</MenuItem>
                  </Select>
                </FormControl>

                {/* Export Format */}
                <FormControl sx={{ minWidth: 160 }} size="small">
                  <InputLabel>Export Format</InputLabel>
                  <Select
                    value={exportFormat}
                    label="Export Format"
                    onChange={(e) => setExportFormat(e.target.value)}
                  >
                    <MenuItem value="excel">Excel (.xlsx)</MenuItem>
                    <MenuItem value="csv">CSV (.csv)</MenuItem>
                    <MenuItem value="pdf">PDF Report</MenuItem>
                    <MenuItem value="json">JSON Data</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              {/* Validation Message for Custom Date Range */}
              {exportDateRange === 'custom' && (!exportStartDate || !exportEndDate) && (
                <Box sx={{ mb: 2, p: 1.5, bgcolor: alpha(theme.palette.warning.main, 0.1), borderRadius: 1, border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}` }}>
                  <Typography variant="body2" color="warning.main" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ErrorIcon fontSize="small" />
                    Please select both start and end dates for custom range export
                  </Typography>
                </Box>
              )}

              {/* Export Actions */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ExportIcon />}
                  onClick={handleMISExport}
                  disabled={exporting || (exportDateRange === 'custom' && (!exportStartDate || !exportEndDate))}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 120
                  }}
                >
                  {exporting ? 'Exporting...' : 'Generate Export'}
                </Button>
              </Box>
              
              {/* Export Info */}
              <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 2 }}>
                <Typography variant="body2" color="info.main" sx={{ fontWeight: 500, mb: 1 }}>
                  Export Preview:
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  • Date Range: {
                    exportDateRange === 'all' ? 'All Time' :
                    exportDateRange === 'custom' ? 
                      (exportStartDate && exportEndDate ? 
                        `${exportStartDate.toLocaleDateString()} - ${exportEndDate.toLocaleDateString()}` : 
                        'Custom Range (Please select dates)') :
                      exportDateRange.charAt(0).toUpperCase() + exportDateRange.slice(1)
                  }
                  <br />
                  • Data Type: {exportDataType === 'all' ? 'Complete Dataset' : exportDataType.charAt(0).toUpperCase() + exportDataType.slice(1)}
                  <br />
                  • Policy Type: {exportPolicyType === 'all' ? 'All Types' : exportPolicyType.charAt(0).toUpperCase() + exportPolicyType.slice(1).replace('_', ' ')}
                  <br />
                  • Case Status: {exportCaseStatus === 'all' ? 'All Status' : exportCaseStatus.charAt(0).toUpperCase() + exportCaseStatus.slice(1).replace('_', ' ')}
                  <br />
                  • Format: {exportFormat.toUpperCase()}
                  <br />
                  • Estimated Size: {exportDataType === 'all' && exportPolicyType === 'all' && exportCaseStatus === 'all' ? '~2.5MB' : '~500KB - 1.5MB'}
                </Typography>
              </Box>
            </Collapse>
          </CardContent>
        </Card>

        {/* Channel and Hierarchy Management Section */}
        <Card sx={{ mb: 4, boxShadow: 'none', border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}` }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SettingsIcon color="secondary" />
                Channel & Hierarchy Management
              </Typography>
              <Tabs
                value={activeManagementTab}
                onChange={(e, newValue) => setActiveManagementTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 120
                  }
                }}
              >
                <Tab icon={<ChannelIcon />} label="Channels" />
                <Tab icon={<HierarchyIcon />} label="Hierarchy" />
                <Tab icon={<AnalyticsIcon />} label="Analytics" />
              </Tabs>
            </Box>

            {activeManagementTab === 0 && (
              <Collapse in={true} timeout="auto">
                <Divider sx={{ mb: 3 }} />
                
                {/* Channel Management Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="h6" fontWeight="600">
                      Channel Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage and monitor all customer acquisition channels
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleChannelCreate}
                    sx={{ borderRadius: 2, fontWeight: 600 }}
                  >
                    Add Channel
                  </Button>
                </Box>

                {/* Channel Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {channels.map((channel, index) => (
                    <Grid item xs={12} md={6} lg={4} key={channel.id}>
                      <Grow in={loaded} timeout={(index + 1) * 200}>
                        <Card sx={{ 
                          height: '100%',
                          borderRadius: 3,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                          border: `1px solid ${theme.palette.divider}`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                          }
                        }}>
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ 
                                  bgcolor: channel.status === 'active' ? 'success.main' : 'warning.main',
                                  width: 40,
                                  height: 40
                                }}>
                                  {getChannelTypeIcon(channel.type)}
                                </Avatar>
                                <Box>
                                  <Typography variant="h6" fontWeight="600">
                                    {channel.name}
                                  </Typography>
                                  <Chip 
                                    label={channel.status} 
                                    color={channel.status === 'active' ? 'success' : 'warning'}
                                    size="small"
                                    sx={{ textTransform: 'capitalize' }}
                                  />
                                </Box>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <IconButton size="small" onClick={() => handleChannelEdit(channel.id)}>
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small" color="error" onClick={() => handleChannelDelete(channel.id)}>
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {channel.description}
                            </Typography>

                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary">Manager</Typography>
                              <Typography variant="body1" fontWeight="500">{channel.manager}</Typography>
                            </Box>

                            <Grid container spacing={2} sx={{ mb: 2 }}>
                              <Grid item xs={6}>
                                <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'background.default', borderRadius: 2 }}>
                                  <Typography variant="h6" fontWeight="600" color="primary.main">
                                    {channel.currentCases}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Current Cases
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={6}>
                                <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'background.default', borderRadius: 2 }}>
                                  <Typography variant="h6" fontWeight="600" color="success.main">
                                    {channel.renewedCases}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Renewed
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>

                            <Box sx={{ mb: 2 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Conversion Rate</Typography>
                                <Typography variant="body2" fontWeight="600">{channel.conversionRate}%</Typography>
                              </Box>
                              <LinearProgress 
                                variant="determinate" 
                                value={channel.conversionRate}
                                sx={{ height: 6, borderRadius: 3 }}
                              />
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={1}>
                              <Grid item xs={4}>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="body2" fontWeight="600">₹{channel.costPerLead}</Typography>
                                  <Typography variant="caption" color="text.secondary">Cost/Lead</Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={4}>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="body2" fontWeight="600">{channel.performance?.efficiency || 0}%</Typography>
                                  <Typography variant="caption" color="text.secondary">Efficiency</Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={4}>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="body2" fontWeight="600">₹{(channel.revenue / 100000).toFixed(1)}L</Typography>
                                  <Typography variant="caption" color="text.secondary">Revenue</Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grow>
                    </Grid>
                  ))}
                </Grid>

                {/* Channel Performance Summary */}
                <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                  Channel Performance Summary
                </Typography>
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><Typography fontWeight="600">Channel</Typography></TableCell>
                        <TableCell align="center"><Typography fontWeight="600">Type</Typography></TableCell>
                        <TableCell align="center"><Typography fontWeight="600">Cases</Typography></TableCell>
                        <TableCell align="center"><Typography fontWeight="600">Conversion</Typography></TableCell>
                        <TableCell align="center"><Typography fontWeight="600">Efficiency</Typography></TableCell>
                        <TableCell align="right"><Typography fontWeight="600">Revenue</Typography></TableCell>
                      </TableRow>
                    </TableHead>
                    {/* <TableBody>
                      {channels.map((channel) => (
                        <TableRow key={channel.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                                {getChannelTypeIcon(channel.channel_type)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight="600">{channel.name}</Typography>
                                <Typography variant="caption" color="text.secondary">{channel.manager}</Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={channel.type} 
                              size="small" 
                              variant="outlined"
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">{channel.currentCases}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <Typography variant="body2" fontWeight="600">{channel.conversionRate}%</Typography>
                              {channel.conversionRate >= 70 ? 
                                <TrendingUpIcon fontSize="small" color="success" /> : 
                                <TrendingDownIcon fontSize="small" color="error" />
                              }
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight="600">
                              {channel.performance?.efficiency || 0}%
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="600" color="primary.main">
                              ₹{(channel.revenue / 100000).toFixed(1)}L
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody> */}

<TableBody>
  {channels.map((channel) => (
    <TableRow key={channel.id}>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
            {getChannelTypeIcon(channel.channel_type)}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="600">
              {channel.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {channel.manager_name} 
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell align="center">
        <Chip
          label={channel.channel_type} 
          size="small"
          variant="outlined"
          sx={{ textTransform: 'capitalize' }}
        />
      </TableCell>

      <TableCell align="center">
        <Typography variant="body2">{channel.currentCases ?? 0}</Typography>
      </TableCell>
      <TableCell align="center">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <Typography variant="body2" fontWeight="600">{channel.conversionRate ?? 0}%</Typography>
          {(channel.conversionRate ?? 0) >= 70 ? 
            <TrendingUpIcon fontSize="small" color="success" /> : 
            <TrendingDownIcon fontSize="small" color="error" />
          }
        </Box>
      </TableCell>
      <TableCell align="center">
        <Typography variant="body2" fontWeight="600">
          {channel.performance?.efficiency || 0}%
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography variant="body2" fontWeight="600" color="primary.main">
          ₹{((channel.revenue ?? 0) / 100000).toFixed(1)}L
        </Typography>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

                  </Table>
                </TableContainer>
              </Collapse>
            )}

            {activeManagementTab === 1 && (
              <Collapse in={true} timeout="auto">
                <Divider sx={{ mb: 3 }} />
                
                {/* Hierarchy Management Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="h6" fontWeight="600">
                      Organizational Hierarchy
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage organizational structure and reporting hierarchy
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleHierarchyCreate}
                    sx={{ borderRadius: 2, fontWeight: 600 }}
                  >
                    Add Node
                  </Button>
                </Box>

                {/* Hierarchy Tree View */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {hierarchyData.filter(node => !node.parentId).map((rootNode, index) => (
                    <Grid item xs={12} key={rootNode.id}>
                      <Grow in={loaded} timeout={(index + 1) * 200}>
                        <Accordion 
                          defaultExpanded
                          sx={{ 
                            borderRadius: 2,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            '&:before': { display: 'none' }
                          }}
                        >
                          <AccordionSummary 
                            expandIcon={<ExpandMoreIcon />}
                            sx={{ 
                              bgcolor: alpha(theme.palette.primary.main, 0.05),
                              borderRadius: '8px 8px 0 0'
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                              <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                                {getHierarchyTypeIcon(rootNode.type)}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" fontWeight="600">{rootNode.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {rootNode.type.charAt(0).toUpperCase() + rootNode.type.slice(1)} • {rootNode.managerName}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="h6" fontWeight="600" color="primary.main">
                                    {rootNode.currentCases}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">Cases</Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="h6" fontWeight="600" color="success.main">
                                    {rootNode.performance?.efficiency || 0}%
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">Efficiency</Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="h6" fontWeight="600" color="info.main">
                                    ₹{(rootNode.revenue / 1000000).toFixed(1)}M
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">Revenue</Typography>
                                </Box>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleHierarchyEdit(rootNode); }}>
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleHierarchyDelete(rootNode.id); }}>
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails sx={{ p: 3 }}>
                            {/* Child Nodes */}
                            <Grid container spacing={2}>
                              {hierarchyData.filter(node => node.parentId === rootNode.id).map((childNode) => (
                                <Grid item xs={12} md={6} lg={4} key={childNode.id}>
                                  <Card sx={{ 
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: 2,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      transform: 'translateY(-2px)',
                                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                                    }
                                  }}>
                                    <CardContent sx={{ p: 2 }}>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                          <Avatar sx={{ 
                                            bgcolor: 'secondary.main', 
                                            width: 32, 
                                            height: 32 
                                          }}>
                                            {getHierarchyTypeIcon(childNode.type)}
                                          </Avatar>
                                          <Box>
                                            <Typography variant="subtitle2" fontWeight="600">
                                              {childNode.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                              {childNode.managerName}
                                            </Typography>
                                          </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                          <IconButton size="small" onClick={() => handleHierarchyEdit(childNode)}>
                                            <EditIcon fontSize="small" />
                                          </IconButton>
                                          <IconButton size="small" color="error" onClick={() => handleHierarchyDelete(childNode.id)}>
                                            <DeleteIcon fontSize="small" />
                                          </IconButton>
                                        </Box>
                                      </Box>

                                      <Grid container spacing={1}>
                                        <Grid item xs={4}>
                                          <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="body2" fontWeight="600">{childNode.currentCases}</Typography>
                                            <Typography variant="caption" color="text.secondary">Cases</Typography>
                                          </Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                          <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="body2" fontWeight="600">{childNode.performance?.efficiency || 0}%</Typography>
                                            <Typography variant="caption" color="text.secondary">Efficiency</Typography>
                                          </Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                          <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="body2" fontWeight="600">₹{(childNode.revenue / 100000).toFixed(1)}L</Typography>
                                            <Typography variant="caption" color="text.secondary">Revenue</Typography>
                                          </Box>
                                        </Grid>
                                      </Grid>

                                      {childNode.teamMembers && (
                                        <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                                          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                            Team Members ({childNode.teamMembers.length})
                                          </Typography>
                                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                            {childNode.teamMembers.slice(0, 3).map((member) => (
                                              <Tooltip key={member.id} title={`${member.name} - ${member.role}`}>
                                                <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                                  {member.name.charAt(0)}
                                                </Avatar>
                                              </Tooltip>
                                            ))}
                                            {childNode.teamMembers.length > 3 && (
                                              <Avatar sx={{ width: 24, height: 24, fontSize: '0.6rem', bgcolor: 'text.secondary' }}>
                                                +{childNode.teamMembers.length - 3}
                                              </Avatar>
                                            )}
                                          </Box>
                                        </Box>
                                      )}
                                    </CardContent>
                                  </Card>
                                </Grid>
                              ))}
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                      </Grow>
                    </Grid>
                  ))}
                </Grid>

                {/* Hierarchy Performance Summary */}
                <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                  Hierarchy Performance Summary
                </Typography>
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><Typography fontWeight="600">Unit</Typography></TableCell>
                        <TableCell align="center"><Typography fontWeight="600">Level</Typography></TableCell>
                        <TableCell align="center"><Typography fontWeight="600">Manager</Typography></TableCell>
                        <TableCell align="center"><Typography fontWeight="600">Cases</Typography></TableCell>
                        <TableCell align="center"><Typography fontWeight="600">Efficiency</Typography></TableCell>
                        <TableCell align="center"><Typography fontWeight="600">Budget Util.</Typography></TableCell>
                        <TableCell align="right"><Typography fontWeight="600">Revenue</Typography></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {hierarchyData.map((node) => (
                        <TableRow key={node.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                                {getHierarchyTypeIcon(node.type)}
                              </Avatar>
                              <Typography variant="body2" fontWeight="600">{node.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={node.type} 
                              size="small" 
                              variant="outlined"
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">{node.managerName}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">{node.currentCases}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <Typography variant="body2" fontWeight="600">{node.performance?.efficiency || 0}%</Typography>
                              {(node.performance?.efficiency || 0) >= 85 ? 
                                <CheckCircleIcon fontSize="small" color="success" /> : 
                                <WarningIcon fontSize="small" color="warning" />
                              }
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight="600">
                              {node.performance?.budgetUtilization || 0}%
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="600" color="primary.main">
                              ₹{(node.revenue / 100000).toFixed(1)}L
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Collapse>
            )}

            {activeManagementTab === 2 && (
              <Collapse in={true} timeout="auto">
                <Divider sx={{ mb: 3 }} />
                
                {/* Analytics Tab */}
                <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                  Channel & Hierarchy Analytics
                </Typography>

                <Grid container spacing={3}>
                  {/* Channel Performance Chart */}
                  <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 3, height: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                      <Typography variant="h6" gutterBottom fontWeight="600">
                        Channel Performance Comparison
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Efficiency vs Cost analysis across channels
                      </Typography>
                      <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={channelPerformanceData}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                          <XAxis dataKey="channel" angle={-45} textAnchor="end" height={80} />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                                              <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#fff',
                        borderRadius: 8,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                      }} 
                    />
                          <Legend />
                          <Bar yAxisId="left" dataKey="efficiency" fill={alpha(theme.palette.primary.main, 0.8)} name="Efficiency %" />
                          <Bar yAxisId="right" dataKey="cost" fill={alpha(theme.palette.error.main, 0.8)} name="Cost per Lead (₹)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>

                  {/* Hierarchy Performance Chart */}
                  <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 3, height: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                      <Typography variant="h6" gutterBottom fontWeight="600">
                        Regional Performance Overview
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Performance metrics across different regions
                      </Typography>
                      <ResponsiveContainer width="100%" height="85%">
                        <RadialBarChart data={hierarchyPerformanceData} innerRadius="20%" outerRadius="80%">
                          <RadialBar 
                            dataKey="efficiency" 
                            cornerRadius={10} 
                            fill={theme.palette.primary.main}
                            label={{ position: 'insideStart', fill: '#fff' }}
                          />
                          <RechartsTooltip 
                            formatter={(value) => [`${value}%`, 'Efficiency']}
                            contentStyle={{ 
                              backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#fff',
                              borderRadius: 8,
                              boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                            }}
                          />
                          <Legend />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>
                </Grid>
              </Collapse>
            )}
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
                    <RechartsTooltip 
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
                    <RechartsTooltip 
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
                      <RechartsTooltip 
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
                      <RechartsTooltip 
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
                    <RechartsTooltip formatter={(value) => `${value}%`} />
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
                    <RechartsTooltip 
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
                    <RechartsTooltip 
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
                    <RechartsTooltip 
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
                    <RechartsTooltip 
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
                    <RechartsTooltip 
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
                    <RechartsTooltip formatter={(value, name) => [`${value}%`, name]} />
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
                    <RechartsTooltip 
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
                    <RechartsTooltip 
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
                    <RechartsTooltip 
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
                    <RechartsTooltip 
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
                    <RechartsTooltip 
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

        {/* Channel Management Dialog */}
        <Dialog
          open={channelDialog.open}
          onClose={() => setChannelDialog({ open: false, mode: 'create', channelData: {} })}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <ChannelIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="600">
                  {channelDialog.mode === 'create' ? 'Create New Channel' : 'Edit Channel'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure channel settings and parameters
                </Typography>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Channel Name"
                  value={channelDialog.channelData.name || ''}
                  onChange={(e) => setChannelDialog(prev => ({
                    ...prev,
                    channelData: { ...prev.channelData, name: e.target.value }
                  }))}
                  placeholder="e.g., Online Portal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
  <InputLabel>Channel Type</InputLabel>
  <Select
    value={channelDialog.channelData.type || 'Online'}
    onChange={(e) =>
      setChannelDialog(prev => ({
        ...prev,
        channelData: { ...prev.channelData, type: e.target.value }
      }))
    }
    label="Channel Type"
  >
    <MenuItem value="Online">Online</MenuItem>
    <MenuItem value="Mobile">Mobile</MenuItem>
    <MenuItem value="Offline">Offline</MenuItem>
    <MenuItem value="Phone">Phone</MenuItem>
    <MenuItem value="Agent">Agent</MenuItem>
  </Select>
</FormControl>

              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={channelDialog.channelData.description || ''}
                  onChange={(e) => setChannelDialog(prev => ({
                    ...prev,
                    channelData: { ...prev.channelData, description: e.target.value }
                  }))}
                  multiline
                  rows={2}
                  placeholder="Brief description of the channel"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Target Audience"
                  value={channelDialog.channelData.targetAudience || ''}
                  onChange={(e) => setChannelDialog(prev => ({
                    ...prev,
                    channelData: { ...prev.channelData, targetAudience: e.target.value }
                  }))}
                  placeholder="e.g., Tech-savvy customers"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Manager"
                  value={channelDialog.channelData.manager || ''}
                  onChange={(e) => setChannelDialog(prev => ({
                    ...prev,
                    channelData: { ...prev.channelData, manager: e.target.value }
                  }))}
                  placeholder="Channel manager name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cost per Lead (₹)"
                  type="number"
                  value={channelDialog.channelData.costPerLead || 0}
                  onChange={(e) => setChannelDialog(prev => ({
                    ...prev,
                    channelData: { ...prev.channelData, costPerLead: Number(e.target.value) }
                  }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Budget (₹)"
                  type="number"
                  value={channelDialog.channelData.budget || 0}
                  onChange={(e) => setChannelDialog(prev => ({
                    ...prev,
                    channelData: { ...prev.channelData, budget: Number(e.target.value) }
                  }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={channelDialog.channelData.status || 'active'}
                    onChange={(e) => setChannelDialog(prev => ({
                      ...prev,
                      channelData: { ...prev.channelData, status: e.target.value }
                    }))}
                    label="Status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={channelDialog.channelData.settings?.priority || 'medium'}
                    onChange={(e) => setChannelDialog(prev => ({
                      ...prev,
                      channelData: { 
                        ...prev.channelData, 
                        settings: { ...prev.channelData.settings, priority: e.target.value }
                      }
                    }))}
                    label="Priority"
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Working Hours"
                  value={channelDialog.channelData.settings?.workingHours || '9-18'}
                  onChange={(e) => setChannelDialog(prev => ({
                    ...prev,
                    channelData: { 
                      ...prev.channelData, 
                      settings: { ...prev.channelData.settings, workingHours: e.target.value }
                    }
                  }))}
                  placeholder="e.g., 9-18 or 24/7"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Max Capacity"
                  type="number"
                  value={channelDialog.channelData.settings?.maxCapacity || 100}
                  onChange={(e) => setChannelDialog(prev => ({
                    ...prev,
                    channelData: { 
                      ...prev.channelData, 
                      settings: { ...prev.channelData.settings, maxCapacity: Number(e.target.value) }
                    }
                  }))}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={channelDialog.channelData.settings?.autoAssignment || false}
                      onChange={(e) => setChannelDialog(prev => ({
                        ...prev,
                        channelData: { 
                          ...prev.channelData, 
                          settings: { ...prev.channelData.settings, autoAssignment: e.target.checked }
                        }
                      }))}
                    />
                  }
                  label="Enable Auto Assignment"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={() => setChannelDialog({ open: false, mode: 'create', channelData: {} })}
              variant="outlined"
              startIcon={<CancelIcon />}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChannelSave}
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{ borderRadius: 2, minWidth: 120 }}
            >
              {channelDialog.mode === 'create' ? 'Create Channel' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
  open={snackbar.open}
  autoHideDuration={4000}
  onClose={() => setSnackbar({ ...snackbar, open: false })}
  anchorOrigin={{ vertical: "top", horizontal: "right" }}
>
  <Alert
    onClose={() => setSnackbar({ ...snackbar, open: false })}
    severity={snackbar.severity}
    sx={{ width: "100%" }}
  >
    {snackbar.message}
  </Alert>
</Snackbar>


        {/* Hierarchy Management Dialog */}
          <Dialog
            open={hierarchyDialog.open}
            onClose={() => setHierarchyDialog({ open: false, mode: 'create', nodeData: {} })}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}
          >
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <HierarchyIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="600">
                    {hierarchyDialog.mode === 'create' ? 'Create Hierarchy Node' : 'Edit Hierarchy Node'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Configure organizational unit details
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Unit Name"
                    value={hierarchyDialog.nodeData.name || ''}
                    onChange={(e) => setHierarchyDialog(prev => ({
                      ...prev,
                      nodeData: { ...prev.nodeData, name: e.target.value }
                    }))}
                    placeholder="e.g., North Region"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Unit Type</InputLabel>
                    <Select
                      value={hierarchyDialog.nodeData.type || 'department'}
                      onChange={(e) => setHierarchyDialog(prev => ({
                        ...prev,
                        nodeData: { ...prev.nodeData, type: e.target.value }
                      }))}
                      label="Unit Type"
                    >
                      <MenuItem value="region">Region</MenuItem>
                      <MenuItem value="state">State</MenuItem>
                      <MenuItem value="branch">Branch</MenuItem>
                      <MenuItem value="department">Department</MenuItem>
                      <MenuItem value="team">Team</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={hierarchyDialog.nodeData.description || ''}
                    onChange={(e) => setHierarchyDialog(prev => ({
                      ...prev,
                      nodeData: { ...prev.nodeData, description: e.target.value }
                    }))}
                    multiline
                    rows={2}
                    placeholder="Brief description of the organizational unit"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* <FormControl fullWidth>
                    <InputLabel>Parent Unit</InputLabel>
                    <Select
                      value={hierarchyDialog.nodeData.parentId || ''}
                      onChange={(e) => setHierarchyDialog(prev => ({
                        ...prev,
                        nodeData: { ...prev.nodeData, parentId: e.target.value }
                      }))}
                      label="Parent Unit"
                    >
                      <MenuItem value="">None (Root Level)</MenuItem>
                      {hierarchyData.map((node) => (
                        <MenuItem key={node.id} value={node.id}>
                          {node.name} ({node.type})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl> */}
                  <FormControl fullWidth>
  <InputLabel>Parent Unit</InputLabel>
  <Select
    value={hierarchyDialog.nodeData.parent_unit || ""}
    onChange={(e) =>
      setHierarchyDialog((prev) => ({
        ...prev,
        nodeData: { ...prev.nodeData, parent_unit: e.target.value },
      }))
    }
    label="Parent Unit"
  >
    <MenuItem value="">None (Root Level)</MenuItem>
    {hierarchyData.map((node) => (
      <MenuItem key={node.id} value={node.name}>
        {node.name} ({node.type})
      </MenuItem>
    ))}
  </Select>
</FormControl>

                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Manager ID"
                    value={hierarchyDialog.nodeData.managerId || ''}
                    onChange={(e) => setHierarchyDialog(prev => ({
                      ...prev,
                      nodeData: { ...prev.nodeData, managerId: e.target.value }
                    }))}
                    placeholder="Manager employee ID"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Budget (₹)"
                    type="number"
                    value={hierarchyDialog.nodeData.budget || 0}
                    onChange={(e) => setHierarchyDialog(prev => ({
                      ...prev,
                      nodeData: { ...prev.nodeData, budget: Number(e.target.value) }
                    }))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Target Cases"
                    type="number"
                    value={hierarchyDialog.nodeData.targetCases || 0}
                    onChange={(e) => setHierarchyDialog(prev => ({
                      ...prev,
                      nodeData: { ...prev.nodeData, targetCases: Number(e.target.value) }
                    }))}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={hierarchyDialog.nodeData.status || 'active'}
                      onChange={(e) => setHierarchyDialog(prev => ({
                        ...prev,
                        nodeData: { ...prev.nodeData, status: e.target.value }
                      }))}
                      label="Status"
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                      <MenuItem value="restructuring">Restructuring</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 1 }}>
              <Button
                onClick={() => setHierarchyDialog({ open: false, mode: 'create', nodeData: {} })}
                variant="outlined"
                startIcon={<CancelIcon />}
                sx={{ borderRadius: 2 }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleHierarchySave}
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{ borderRadius: 2, minWidth: 120 }}
              >
                {hierarchyDialog.mode === 'create' ? 'Create Node' : 'Save Changes'}
              </Button>
            </DialogActions>
          </Dialog>
      </Box>
    </Fade>
  );
};

export default Dashboard;
