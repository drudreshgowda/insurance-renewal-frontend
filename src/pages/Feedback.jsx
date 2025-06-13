import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, FormControl, InputLabel, Select,
  MenuItem, Tabs, Tab, List, ListItem, ListItemText, ListItemIcon, Divider,
  Alert, useTheme, Fade, Grow, IconButton, Tooltip, Avatar, Badge,
  Paper, Switch, FormControlLabel, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, LinearProgress, AvatarGroup
} from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area, LineChart, Line,
  PieChart, Pie, Cell
} from 'recharts';
import { alpha } from '@mui/material/styles';
import {
  Dashboard as DashboardIcon, Inbox as InboxIcon, Campaign as CampaignIcon,
  Create as DesignIcon, TableChart as ResponsesIcon, Analytics as AnalyticsIcon,
  People as PeopleIcon, Send as SendIcon, AutoMode as AutomationIcon,
  Settings as SettingsIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Visibility as ViewIcon, TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon,
  Star as StarIcon, ThumbUp as ThumbUpIcon, ThumbDown as ThumbDownIcon,
  Flag as FlagIcon, CheckCircle as CheckCircleIcon, Schedule as ScheduleIcon,
  Email as EmailIcon, Sms as SmsIcon, WhatsApp as WhatsAppIcon,
  QrCode as QrCodeIcon, Link as LinkIcon, Refresh as RefreshIcon,
  FilterList as FilterIcon, GetApp as GetAppIcon, Close as CloseIcon,
  SentimentSatisfied as SentimentSatisfiedIcon, SentimentDissatisfied as SentimentDissatisfiedIcon,
  SentimentNeutral as SentimentNeutralIcon, Assignment as SurveyIcon,
  TextFields as TextFieldsIcon, CheckBox as CheckBoxIcon, LinearScale as LinearScaleIcon,
  Category as CategoryIcon, SentimentSatisfied as SentimentIcon
} from '@mui/icons-material';

const Feedback = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  // Dialog states
  const [createSurveyDialog, setCreateSurveyDialog] = useState(false);
  const [feedbackDetailDialog, setFeedbackDetailDialog] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyDialog, setReplyDialog] = useState(false);
  const [assignDialog, setAssignDialog] = useState(false);
  const [templateDialog, setTemplateDialog] = useState(false);
  const [automationDialog, setAutomationDialog] = useState(false);
  const [settingsDialog, setSettingsDialog] = useState(false);
  
  // Form states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [assignedAgent, setAssignedAgent] = useState('');
  
  // Survey form states
  const [surveyForm, setSurveyForm] = useState({
    name: '',
    type: 'CSAT',
    description: '',
    targetResponses: 100,
    channels: [],
    questions: []
  });

  // Mock data
  const [dashboardStats] = useState({
    overallSatisfaction: 4.2,
    npsScore: 42,
    totalFeedback: 1247,
    unaddressed: 23,
    negativeFeedback: 45,
    flaggedFeedback: 12,
    surveyCompletionRate: 78.5,
    sentimentScore: 82,
    recentTrends: {
      satisfaction: 2.3,
      feedback: 15.2,
      completion: -3.1
    }
  });

  // Additional feedback dashboard data
  const [feedbackTrends] = useState([
    { name: 'Mon', satisfaction: 4.1, nps: 65, responses: 45 },
    { name: 'Tue', satisfaction: 4.3, nps: 68, responses: 52 },
    { name: 'Wed', satisfaction: 4.2, nps: 67, responses: 38 },
    { name: 'Thu', satisfaction: 4.4, nps: 71, responses: 61 },
    { name: 'Fri', satisfaction: 4.1, nps: 64, responses: 43 },
    { name: 'Sat', satisfaction: 4.5, nps: 73, responses: 29 },
    { name: 'Sun', satisfaction: 4.3, nps: 69, responses: 31 },
  ]);

  const [feedbackCategories] = useState([
    { name: 'Service Quality', value: 45, color: theme.palette.primary.main },
    { name: 'Response Time', value: 28, color: theme.palette.warning.main },
    { name: 'Policy Information', value: 18, color: theme.palette.info.main },
    { name: 'Pricing', value: 9, color: theme.palette.success.main }
  ]);

  const [sentimentData] = useState([
    { name: 'Positive', value: 68, color: '#4caf50' },
    { name: 'Neutral', value: 22, color: '#ff9800' },
    { name: 'Negative', value: 10, color: '#f44336' }
  ]);

  const [recentFeedback] = useState([
    {
      id: 1,
      customer: 'John Smith',
      rating: 5,
      category: 'Service Quality',
      message: 'Excellent service! Very satisfied with the claim process.',
      date: '2024-12-28',
      status: 'resolved',
      sentiment: 'positive',
      channel: 'email'
    },
    {
      id: 2,
      customer: 'Sarah Johnson',
      rating: 2,
      category: 'Response Time',
      message: 'Took too long to get a response. Very disappointed.',
      date: '2024-12-28',
      status: 'unaddressed',
      sentiment: 'negative',
      channel: 'survey',
      flagged: true
    },
    {
      id: 3,
      customer: 'Mike Davis',
      rating: 4,
      category: 'Policy Information',
      message: 'Good information provided, but could be clearer.',
      date: '2024-12-27',
      status: 'in_progress',
      sentiment: 'positive',
      channel: 'whatsapp'
    }
  ]);

  const [surveys, setSurveys] = useState([
    {
      id: 1,
      name: 'Customer Satisfaction Survey Q4',
      type: 'CSAT',
      status: 'active',
      responses: 342,
      targetResponses: 500,
      completionRate: 68.4,
      createdDate: '2024-12-15',
      endDate: '2024-12-31',
      channels: ['email', 'sms'],
      questions: [
        { id: 1, text: 'How satisfied are you with our service?', type: 'rating', required: true },
        { id: 2, text: 'What can we improve?', type: 'text', required: false }
      ]
    },
    {
      id: 2,
      name: 'NPS Survey - Policy Holders',
      type: 'NPS',
      status: 'draft',
      responses: 0,
      targetResponses: 1000,
      completionRate: 0,
      createdDate: '2024-12-20',
      endDate: '2025-01-15',
      channels: ['email'],
      questions: [
        { id: 1, text: 'How likely are you to recommend us?', type: 'nps', required: true }
      ]
    },
    {
      id: 3,
      name: 'Claims Experience Survey',
      type: 'CES',
      status: 'completed',
      responses: 156,
      targetResponses: 200,
      completionRate: 78.0,
      createdDate: '2024-11-01',
      endDate: '2024-11-30',
      channels: ['email', 'sms', 'whatsapp'],
      questions: [
        { id: 1, text: 'How easy was it to file your claim?', type: 'rating', required: true },
        { id: 2, text: 'How satisfied are you with the claim process?', type: 'rating', required: true }
      ]
    }
  ]);

  // Additional mock data
  const [contacts] = useState([
    { id: 1, name: 'John Smith', email: 'john@example.com', phone: '+1234567890', segment: 'Premium Customers' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1234567891', segment: 'New Customers' },
    { id: 3, name: 'Mike Davis', email: 'mike@example.com', phone: '+1234567892', segment: 'Loyal Customers' }
  ]);

  const [templates] = useState([
    { id: 1, name: 'Thank You Response', category: 'positive', content: 'Thank you for your positive feedback!' },
    { id: 2, name: 'Issue Resolution', category: 'negative', content: 'We apologize for the inconvenience and will resolve this immediately.' },
    { id: 3, name: 'Follow-up Request', category: 'neutral', content: 'Could you provide more details about your experience?' }
  ]);

  const [agents] = useState([
    { id: 1, name: 'Alice Cooper', email: 'alice@company.com', department: 'Customer Service' },
    { id: 2, name: 'Bob Wilson', email: 'bob@company.com', department: 'Technical Support' },
    { id: 3, name: 'Carol Brown', email: 'carol@company.com', department: 'Sales' }
  ]);

  const [surveyResponses] = useState([
    { id: 1, surveyId: 1, respondent: 'John Smith', responses: { 1: 5, 2: 'Great service!' }, submittedAt: '2024-12-28' },
    { id: 2, surveyId: 1, respondent: 'Sarah Johnson', responses: { 1: 4, 2: 'Good overall' }, submittedAt: '2024-12-27' },
    { id: 3, surveyId: 3, respondent: 'Mike Davis', responses: { 1: 5, 2: 5 }, submittedAt: '2024-11-25' }
  ]);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  // Handler functions
  const handleViewFeedback = (feedback) => {
    setSelectedFeedback(feedback);
    setFeedbackDetailDialog(true);
  };

  const handleReplyFeedback = (feedback) => {
    setSelectedFeedback(feedback);
    setReplyDialog(true);
  };

  const handleAssignFeedback = (feedback) => {
    setSelectedFeedback(feedback);
    setAssignDialog(true);
  };

  const handleResolveFeedback = (feedbackId) => {
    // Update feedback status to resolved
    console.log('Resolving feedback:', feedbackId);
    // In real app, this would call an API
  };

  const handleCreateSurvey = () => {
    setCreateSurveyDialog(true);
  };

  const handleSaveSurvey = () => {
    const newSurvey = {
      id: surveys.length + 1,
      ...surveyForm,
      status: 'draft',
      responses: 0,
      completionRate: 0,
      createdDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setSurveys([...surveys, newSurvey]);
    setCreateSurveyDialog(false);
    setSurveyForm({
      name: '',
      type: 'CSAT',
      description: '',
      targetResponses: 100,
      channels: [],
      questions: []
    });
  };

  const handleSendReply = () => {
    console.log('Sending reply:', replyText, 'to:', selectedFeedback?.customer);
    setReplyDialog(false);
    setReplyText('');
    setSelectedFeedback(null);
  };

  const handleAssignAgent = () => {
    console.log('Assigning agent:', assignedAgent, 'to feedback:', selectedFeedback?.id);
    setAssignDialog(false);
    setAssignedAgent('');
    setSelectedFeedback(null);
  };

  const handleExportData = (format) => {
    console.log('Exporting data in format:', format);
    // In real app, this would generate and download the file
  };

  const handleLaunchSurvey = (surveyId) => {
    setSurveys(surveys.map(survey => 
      survey.id === surveyId ? { ...survey, status: 'active' } : survey
    ));
  };

  const handlePauseSurvey = (surveyId) => {
    setSurveys(surveys.map(survey => 
      survey.id === surveyId ? { ...survey, status: 'paused' } : survey
    ));
  };

  const filteredFeedback = recentFeedback.filter(feedback => {
    const matchesSearch = feedback.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || feedback.status === statusFilter;
    const matchesRating = ratingFilter === 'all' || 
                         (ratingFilter === 'negative' && feedback.rating <= 2) ||
                         (ratingFilter === 'neutral' && feedback.rating === 3) ||
                         (ratingFilter === 'positive' && feedback.rating >= 4);
    return matchesSearch && matchesStatus && matchesRating;
  });

  // StatCard component similar to other modules
  const StatCard = ({ title, value, color, icon, index, subtitle, trend }) => {
    const gradientFrom = alpha(color, theme.palette.mode === 'dark' ? 0.7 : 0.9);
    const gradientTo = alpha(color, theme.palette.mode === 'dark' ? 0.4 : 0.6);
    
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
              fontSize: '8rem',
              color: 'white'
            }}
          >
            {icon}
          </Box>
          <CardContent sx={{ position: 'relative', zIndex: 1, color: 'white', py: 3 }}>
            <Typography variant="h6" component="div" fontWeight="500" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold" sx={{ mb: 1 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {trend > 0 ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  {trend > 0 ? '+' : ''}{trend}% from last month
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grow>
    );
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <SentimentSatisfiedIcon color="success" />;
      case 'negative': return <SentimentDissatisfiedIcon color="error" />;
      default: return <SentimentNeutralIcon color="warning" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'success';
      case 'in_progress': return 'warning';
      case 'unaddressed': return 'error';
      default: return 'default';
    }
  };

  const getSurveyStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'warning';
      case 'completed': return 'info';
      case 'paused': return 'error';
      default: return 'default';
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'email': return <EmailIcon />;
      case 'sms': return <SmsIcon />;
      case 'whatsapp': return <WhatsAppIcon />;
      case 'survey': return <SurveyIcon />;
      default: return <InboxIcon />;
    }
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`feedback-tabpanel-${index}`}
      aria-labelledby={`feedback-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  const DashboardTab = () => (
    <Box>
      {/* Enhanced Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard 
            title="Overall Satisfaction"
            value={`${dashboardStats.overallSatisfaction}/5.0`}
            color="#ff6b35"
            icon={<StarIcon />}
            index={0}
            subtitle="CSAT Score"
            trend={dashboardStats.recentTrends.satisfaction}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard 
            title="NPS Score"
            value={dashboardStats.npsScore}
            color="#4caf50"
            icon={<TrendingUpIcon />}
            index={1}
            subtitle="Net Promoter Score"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard 
            title="Survey Completion Rate"
            value={`${dashboardStats.surveyCompletionRate}%`}
            color="#2196f3"
            icon={<SurveyIcon />}
            index={2}
            subtitle="Completion Rate"
            trend={dashboardStats.recentTrends.completion}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard 
            title="Total Feedback"
            value={dashboardStats.totalFeedback.toLocaleString()}
            color="#9c27b0"
            icon={<CategoryIcon />}
            index={3}
            subtitle="This Month"
            trend={dashboardStats.recentTrends.feedback}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard 
            title="Sentiment Score"
            value={`${dashboardStats.sentimentScore}%`}
            color="#00bcd4"
            icon={<SentimentIcon />}
            index={4}
            subtitle="AI Analysis"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard 
            title="Flagged Feedback"
            value={dashboardStats.flaggedFeedback}
            color="#ff5722"
            icon={<FlagIcon />}
            index={5}
            subtitle="Needs Attention"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard 
            title="Negative Feedback"
            value={dashboardStats.negativeFeedback}
            color="#f44336"
            icon={<ThumbDownIcon />}
            index={6}
            subtitle="Requires Action"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Feedback Trends Chart */}
        <Grid item xs={12} md={6}>
          <Grow in={loaded} style={{ transformOrigin: '0 0 0' }} timeout={1000}>
            <Paper sx={{ p: 3, height: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Recent Feedback Trends
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Satisfaction scores and NPS trends over time
              </Typography>
              <Box sx={{ width: '100%', height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={feedbackTrends}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: theme.palette.divider }}
                    />
                    <YAxis 
                      yAxisId="left" 
                      domain={[0, 5]} 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: theme.palette.divider }}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      domain={[0, 100]} 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: theme.palette.divider }}
                    />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#fff',
                        borderRadius: 8,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        border: 'none'
                      }} 
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="satisfaction" 
                      stroke="#ff6b35" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      name="Satisfaction Score"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="nps" 
                      stroke="#4caf50" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      name="NPS Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grow>
        </Grid>

        {/* Top Feedback Categories */}
        <Grid item xs={12} md={6}>
          <Grow in={loaded} style={{ transformOrigin: '0 0 0' }} timeout={1100}>
            <Paper sx={{ p: 3, height: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Top Feedback Categories
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Distribution of feedback by category
              </Typography>
              <Box sx={{ width: '100%', height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <Pie
                      data={feedbackCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                      fontSize={12}
                    >
                      {feedbackCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#fff',
                        borderRadius: 8,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        border: 'none'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grow>
        </Grid>

        {/* Sentiment Analysis Overview */}
        <Grid item xs={12} md={6}>
          <Grow in={loaded} style={{ transformOrigin: '0 0 0' }} timeout={1200}>
            <Paper sx={{ p: 3, height: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Sentiment Analysis Overview
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                AI-powered sentiment breakdown of customer feedback
              </Typography>
              <Box sx={{ display: 'flex', height: 280, alignItems: 'center' }}>
                {/* Pie Chart */}
                <Box sx={{ width: '50%', height: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value) => [`${value}%`, 'Percentage']}
                        contentStyle={{ 
                          backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#fff',
                          borderRadius: 8,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                          border: 'none'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                
                {/* Legend and Stats */}
                <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', pl: 2 }}>
                  {sentimentData.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <Box 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          backgroundColor: item.color, 
                          borderRadius: '50%', 
                          mr: 1.5 
                        }} 
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight="600" fontSize="0.875rem">
                          {item.name}
                        </Typography>
                        <Typography variant="h5" color={item.color} fontWeight="bold">
                          {item.value}%
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                  
                  <Box sx={{ mt: 2, p: 1.5, backgroundColor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom fontSize="0.75rem">
                      Overall Sentiment Score
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {dashboardStats.sentimentScore}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                      Based on AI analysis of {dashboardStats.totalFeedback} entries
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grow>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, height: 400 }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              <Grid container spacing={2} sx={{ flex: 1 }}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setActiveTab(3)}
                    sx={{ borderRadius: 2, py: 1.5, height: '100%' }}
                  >
                    Create Survey
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<InboxIcon />}
                    onClick={() => setActiveTab(1)}
                    sx={{ borderRadius: 2, py: 1.5, height: '100%' }}
                  >
                    View Feedback
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AnalyticsIcon />}
                    onClick={() => setActiveTab(5)}
                    sx={{ borderRadius: 2, py: 1.5, height: '100%' }}
                  >
                    Analytics
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<SendIcon />}
                    onClick={() => setActiveTab(7)}
                    sx={{ borderRadius: 2, py: 1.5, height: '100%' }}
                  >
                    Distribution
                  </Button>
                </Grid>
              </Grid>
              
              {/* Attention Required Section */}
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Attention Required</Typography>
                  <Badge badgeContent={dashboardStats.unaddressed + dashboardStats.flaggedFeedback} color="error">
                    <FlagIcon />
                  </Badge>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <ThumbDownIcon color="error" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Negative Feedback"
                      secondary={`${dashboardStats.negativeFeedback} items need attention`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <FlagIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Flagged Items"
                      secondary={`${dashboardStats.flaggedFeedback} items flagged for follow-up`}
                    />
                  </ListItem>
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Feedback */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Recent Feedback</Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setActiveTab(1)}
            >
              View All
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentFeedback.slice(0, 5).map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getSentimentIcon(feedback.sentiment)}
                        {feedback.customer}
                        {feedback.flagged && <FlagIcon color="error" fontSize="small" />}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            fontSize="small"
                            sx={{ 
                              color: i < feedback.rating ? '#ffc107' : '#e0e0e0' 
                            }}
                          />
                        ))}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {feedback.rating}/5
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={feedback.category} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ 
                        maxWidth: 200, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {feedback.message}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={feedback.status.replace('_', ' ').toUpperCase()}
                        color={getStatusColor(feedback.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleViewFeedback(feedback)}>
                        <ViewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );

  const FeedbackInboxTab = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Feedback Inbox</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Real-time view of all incoming feedback and customer responses
      </Typography>
      
      {/* Filters and Actions */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search feedback..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ sx: { borderRadius: 2 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="unaddressed">Unaddressed</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Rating</InputLabel>
              <Select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
                <MenuItem value="all">All Ratings</MenuItem>
                <MenuItem value="negative">1-2 Stars</MenuItem>
                <MenuItem value="neutral">3 Stars</MenuItem>
                <MenuItem value="positive">4-5 Stars</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button startIcon={<FilterIcon />} variant="outlined" size="small">
                Advanced Filters
              </Button>
              <Button startIcon={<GetAppIcon />} variant="outlined" size="small">
                Export
              </Button>
              <Button startIcon={<RefreshIcon />} variant="outlined" size="small">
                Refresh
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Feedback List */}
      <Grid container spacing={2}>
        {filteredFeedback.map((feedback) => (
          <Grid item xs={12} key={feedback.id}>
            <Card sx={{ borderRadius: 2, border: feedback.flagged ? `2px solid ${theme.palette.error.main}` : 'none' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      {feedback.customer.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="600">
                        {feedback.customer}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              fontSize="small"
                              sx={{ 
                                color: i < feedback.rating ? '#ffc107' : '#e0e0e0' 
                              }}
                            />
                          ))}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(feedback.date).toLocaleDateString()}
                        </Typography>
                        {getChannelIcon(feedback.channel)}
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {feedback.flagged && <FlagIcon color="error" />}
                    <Chip 
                      label={feedback.status.replace('_', ' ').toUpperCase()}
                      color={getStatusColor(feedback.status)}
                      size="small"
                    />
                  </Box>
                </Box>
                
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {feedback.message}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip label={feedback.category} variant="outlined" size="small" />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => handleViewFeedback(feedback)}
                    >
                      View
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => handleReplyFeedback(feedback)}
                    >
                      Reply
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => handleAssignFeedback(feedback)}
                    >
                      Assign
                    </Button>
                    <Button 
                      size="small" 
                      variant="contained"
                      onClick={() => handleResolveFeedback(feedback.id)}
                      disabled={feedback.status === 'resolved'}
                    >
                      Resolve
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const SurveyCampaignsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>Survey Campaigns</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and monitor survey creation, deployment, and results
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateSurvey}
          sx={{ borderRadius: 2 }}
        >
          Create Survey
        </Button>
      </Box>

      <Grid container spacing={3}>
        {surveys.map((survey) => (
          <Grid item xs={12} md={6} lg={4} key={survey.id}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" fontWeight="600">
                    {survey.name}
                  </Typography>
                  <Chip 
                    label={survey.status.toUpperCase()}
                    color={getSurveyStatusColor(survey.status)}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Type: {survey.type} • Created: {new Date(survey.createdDate).toLocaleDateString()}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Progress</Typography>
                    <Typography variant="body2">
                      {survey.responses}/{survey.targetResponses}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(survey.responses / survey.targetResponses) * 100}
                    sx={{ borderRadius: 1, height: 8 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {survey.completionRate}% completion rate
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  {survey.channels.map((channel) => (
                    <Tooltip key={channel} title={channel.toUpperCase()}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                        {getChannelIcon(channel)}
                      </Avatar>
                    </Tooltip>
                  ))}
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {survey.status === 'draft' && (
                    <Button 
                      size="small" 
                      variant="contained" 
                      startIcon={<SendIcon />}
                      onClick={() => handleLaunchSurvey(survey.id)}
                    >
                      Launch
                    </Button>
                  )}
                  {survey.status === 'active' && (
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="warning"
                      onClick={() => handlePauseSurvey(survey.id)}
                    >
                      Pause
                    </Button>
                  )}
                  <Button 
                    size="small" 
                    variant="outlined" 
                    startIcon={<ViewIcon />}
                    onClick={() => setActiveTab(4)}
                  >
                    View
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    startIcon={<EditIcon />}
                    onClick={() => setActiveTab(3)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    startIcon={<AnalyticsIcon />}
                    onClick={() => setActiveTab(5)}
                  >
                    Results
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const SurveyDesignerTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>Survey Designer</Typography>
          <Typography variant="body2" color="text.secondary">
            Create and customize surveys with intuitive form builder
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateSurvey}
          sx={{ borderRadius: 2 }}
        >
          New Survey
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>Survey Form</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Survey Name"
                  value={surveyForm.name}
                  onChange={(e) => setSurveyForm({...surveyForm, name: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Survey Type</InputLabel>
                  <Select
                    value={surveyForm.type}
                    onChange={(e) => setSurveyForm({...surveyForm, type: e.target.value})}
                  >
                    <MenuItem value="CSAT">Customer Satisfaction (CSAT)</MenuItem>
                    <MenuItem value="NPS">Net Promoter Score (NPS)</MenuItem>
                    <MenuItem value="CES">Customer Effort Score (CES)</MenuItem>
                    <MenuItem value="Custom">Custom Survey</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Target Responses"
                  type="number"
                  value={surveyForm.targetResponses}
                  onChange={(e) => setSurveyForm({...surveyForm, targetResponses: parseInt(e.target.value)})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={surveyForm.description}
                  onChange={(e) => setSurveyForm({...surveyForm, description: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Distribution Channels</InputLabel>
                  <Select
                    multiple
                    value={surveyForm.channels}
                    onChange={(e) => setSurveyForm({...surveyForm, channels: e.target.value})}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value.toUpperCase()} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="sms">SMS</MenuItem>
                    <MenuItem value="whatsapp">WhatsApp</MenuItem>
                    <MenuItem value="web">Web Link</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={handleSaveSurvey}>
                Save Survey
              </Button>
              <Button variant="outlined">
                Preview
              </Button>
              <Button variant="outlined" color="error">
                Cancel
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>Question Types</Typography>
            <List>
              <ListItem button>
                <ListItemIcon><StarIcon /></ListItemIcon>
                <ListItemText primary="Rating Scale" secondary="1-5 or 1-10 scale" />
              </ListItem>
              <ListItem button>
                <ListItemIcon><TextFieldsIcon /></ListItemIcon>
                <ListItemText primary="Text Input" secondary="Open-ended response" />
              </ListItem>
              <ListItem button>
                <ListItemIcon><CheckBoxIcon /></ListItemIcon>
                <ListItemText primary="Multiple Choice" secondary="Single or multiple selection" />
              </ListItem>
              <ListItem button>
                <ListItemIcon><LinearScaleIcon /></ListItemIcon>
                <ListItemText primary="NPS Scale" secondary="0-10 recommendation scale" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const SurveyResponsesTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>Survey Responses</Typography>
          <Typography variant="body2" color="text.secondary">
            View and analyze collected survey data
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<GetAppIcon />}
            onClick={() => handleExportData('csv')}
          >
            Export CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<GetAppIcon />}
            onClick={() => handleExportData('pdf')}
          >
            Export PDF
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {surveyResponses.map((response) => {
          const survey = surveys.find(s => s.id === response.surveyId);
          return (
            <Grid item xs={12} key={response.id}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6">{survey?.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Response from {response.respondent} • {new Date(response.submittedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Chip label={survey?.type} size="small" />
                  </Box>
                  
                  <Box sx={{ mt: 2 }}>
                    {survey?.questions.map((question) => (
                      <Box key={question.id} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {question.text}
                        </Typography>
                        <Typography variant="body1" sx={{ pl: 2 }}>
                          {question.type === 'rating' || question.type === 'nps' ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="h6" color="primary">
                                {response.responses[question.id]}
                              </Typography>
                              {question.type === 'rating' && (
                                <Box sx={{ display: 'flex' }}>
                                  {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                      key={i}
                                      fontSize="small"
                                      sx={{ 
                                        color: i < response.responses[question.id] ? '#ffc107' : '#e0e0e0' 
                                      }}
                                    />
                                  ))}
                                </Box>
                              )}
                            </Box>
                          ) : (
                            response.responses[question.id]
                          )}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );

  const InsightsAnalyticsTab = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Insights & Analytics</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Deep dive into aggregated metrics and sentiment analysis
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Avg. CSAT Score"
            value="4.2"
            color={theme.palette.primary.main}
            icon={<StarIcon />}
            index={0}
            subtitle="Out of 5.0"
            trend="+0.3 from last month"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="NPS Score"
            value="67"
            color={theme.palette.success.main}
            icon={<TrendingUpIcon />}
            index={1}
            subtitle="Promoters - Detractors"
            trend="+12 from last month"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Response Rate"
            value="73%"
            color={theme.palette.info.main}
            icon={<ResponsesIcon />}
            index={2}
            subtitle="Survey completion"
            trend="+5% from last month"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Sentiment Score"
            value="82%"
            color={theme.palette.warning.main}
            icon={<SentimentSatisfiedIcon />}
            index={3}
            subtitle="Positive sentiment"
            trend="+7% from last month"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>Feedback Categories</Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Service Quality" 
                  secondary="45% of feedback"
                />
                <LinearProgress 
                  variant="determinate" 
                  value={45} 
                  sx={{ width: 100, ml: 2 }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Product Features" 
                  secondary="28% of feedback"
                />
                <LinearProgress 
                  variant="determinate" 
                  value={28} 
                  sx={{ width: 100, ml: 2 }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Support Experience" 
                  secondary="18% of feedback"
                />
                <LinearProgress 
                  variant="determinate" 
                  value={18} 
                  sx={{ width: 100, ml: 2 }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Pricing" 
                  secondary="9% of feedback"
                />
                <LinearProgress 
                  variant="determinate" 
                  value={9} 
                  sx={{ width: 100, ml: 2 }}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>Sentiment Trends</Typography>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <TrendingUpIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" color="success.main" gutterBottom>
                +15%
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Positive sentiment increase this month
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const AudienceManagementTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>Audience Management</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage contacts and customer segments for targeted surveys
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2 }}
        >
          Add Contact
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Segment</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      {contact.name.charAt(0)}
                    </Avatar>
                    {contact.name}
                  </Box>
                </TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>
                  <Chip label={contact.segment} size="small" />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined">Edit</Button>
                    <Button size="small" variant="outlined" color="error">Delete</Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );

  const DistributionChannelsTab = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Distribution Channels</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure how surveys and feedback forms are distributed
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ borderRadius: 3, textAlign: 'center', p: 3 }}>
            <EmailIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>Email Campaigns</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Send surveys via email with customizable templates
            </Typography>
            <Button variant="contained" fullWidth>
              Configure Email
            </Button>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ borderRadius: 3, textAlign: 'center', p: 3 }}>
            <SmsIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>SMS Surveys</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Quick feedback collection via text messages
            </Typography>
            <Button variant="contained" fullWidth>
              Setup SMS
            </Button>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ borderRadius: 3, textAlign: 'center', p: 3 }}>
            <WhatsAppIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>WhatsApp</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Engage customers through WhatsApp messaging
            </Typography>
            <Button variant="contained" fullWidth>
              Connect WhatsApp
            </Button>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ borderRadius: 3, textAlign: 'center', p: 3 }}>
            <LinkIcon sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>Web Links</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Share survey links on websites and social media
            </Typography>
            <Button variant="contained" fullWidth>
              Generate Links
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const AutomationTriggersTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>Automation & Triggers</Typography>
          <Typography variant="body2" color="text.secondary">
            Set up automated workflows for proactive feedback management
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAutomationDialog(true)}
          sx={{ borderRadius: 2 }}
        >
          Create Automation
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <AutomationIcon color="primary" />
                <Typography variant="h6">Post-Purchase Survey</Typography>
                <Chip label="Active" color="success" size="small" />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Automatically send CSAT survey 24 hours after purchase completion
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant="outlined">Edit</Button>
                <Button size="small" variant="outlined" color="warning">Pause</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <AutomationIcon color="warning" />
                <Typography variant="h6">Negative Feedback Alert</Typography>
                <Chip label="Active" color="success" size="small" />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Notify support team immediately when rating is 2 stars or below
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant="outlined">Edit</Button>
                <Button size="small" variant="outlined" color="warning">Pause</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <AutomationIcon color="info" />
                <Typography variant="h6">Follow-up Reminder</Typography>
                <Chip label="Draft" color="default" size="small" />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Send reminder for incomplete surveys after 3 days
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant="contained">Activate</Button>
                <Button size="small" variant="outlined">Edit</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <AutomationIcon color="success" />
                <Typography variant="h6">Thank You Response</Typography>
                <Chip label="Active" color="success" size="small" />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Auto-reply with thank you message for positive feedback
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant="outlined">Edit</Button>
                <Button size="small" variant="outlined" color="warning">Pause</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );



  return (
    <Fade in timeout={800}>
      <Box sx={{ px: 1 }}>
        {/* Dialogs */}
        
        {/* Create Survey Dialog */}
        <Dialog open={createSurveyDialog} onClose={() => setCreateSurveyDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Create New Survey</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Survey Name"
                  value={surveyForm.name}
                  onChange={(e) => setSurveyForm({...surveyForm, name: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Survey Type</InputLabel>
                  <Select
                    value={surveyForm.type}
                    onChange={(e) => setSurveyForm({...surveyForm, type: e.target.value})}
                  >
                    <MenuItem value="CSAT">Customer Satisfaction (CSAT)</MenuItem>
                    <MenuItem value="NPS">Net Promoter Score (NPS)</MenuItem>
                    <MenuItem value="CES">Customer Effort Score (CES)</MenuItem>
                    <MenuItem value="Custom">Custom Survey</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Target Responses"
                  type="number"
                  value={surveyForm.targetResponses}
                  onChange={(e) => setSurveyForm({...surveyForm, targetResponses: parseInt(e.target.value)})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={surveyForm.description}
                  onChange={(e) => setSurveyForm({...surveyForm, description: e.target.value})}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateSurveyDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveSurvey} variant="contained">Create Survey</Button>
          </DialogActions>
        </Dialog>

        {/* Feedback Detail Dialog */}
        <Dialog open={feedbackDetailDialog} onClose={() => setFeedbackDetailDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Feedback Details</DialogTitle>
          <DialogContent>
            {selectedFeedback && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>Customer</Typography>
                    <Typography variant="body1">{selectedFeedback.customer}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>Rating</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          fontSize="small"
                          sx={{ color: i < selectedFeedback.rating ? '#ffc107' : '#e0e0e0' }}
                        />
                      ))}
                      <Typography variant="body2">({selectedFeedback.rating}/5)</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>Category</Typography>
                    <Chip label={selectedFeedback.category} size="small" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>Status</Typography>
                    <Chip 
                      label={selectedFeedback.status.replace('_', ' ').toUpperCase()}
                      color={getStatusColor(selectedFeedback.status)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>Message</Typography>
                    <Typography variant="body1">{selectedFeedback.message}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>Date</Typography>
                    <Typography variant="body1">{new Date(selectedFeedback.date).toLocaleDateString()}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>Channel</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getChannelIcon(selectedFeedback.channel)}
                      <Typography variant="body1">{selectedFeedback.channel.toUpperCase()}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFeedbackDetailDialog(false)}>Close</Button>
            <Button onClick={() => {
              setFeedbackDetailDialog(false);
              handleReplyFeedback(selectedFeedback);
            }} variant="outlined">Reply</Button>
            <Button onClick={() => {
              setFeedbackDetailDialog(false);
              handleAssignFeedback(selectedFeedback);
            }} variant="outlined">Assign</Button>
          </DialogActions>
        </Dialog>

        {/* Reply Dialog */}
        <Dialog open={replyDialog} onClose={() => setReplyDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Reply to Feedback</DialogTitle>
          <DialogContent>
            {selectedFeedback && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Replying to: {selectedFeedback.customer}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  "{selectedFeedback.message}"
                </Typography>
                <TextField
                  fullWidth
                  label="Your Reply"
                  multiline
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response here..."
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReplyDialog(false)}>Cancel</Button>
            <Button onClick={handleSendReply} variant="contained" disabled={!replyText.trim()}>
              Send Reply
            </Button>
          </DialogActions>
        </Dialog>

        {/* Assign Dialog */}
        <Dialog open={assignDialog} onClose={() => setAssignDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Assign Feedback</DialogTitle>
          <DialogContent>
            {selectedFeedback && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Assigning feedback from: {selectedFeedback.customer}
                </Typography>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Assign to Agent</InputLabel>
                  <Select
                    value={assignedAgent}
                    onChange={(e) => setAssignedAgent(e.target.value)}
                  >
                    {agents.map((agent) => (
                      <MenuItem key={agent.id} value={agent.id}>
                        {agent.name} - {agent.department}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAssignDialog(false)}>Cancel</Button>
            <Button onClick={handleAssignAgent} variant="contained" disabled={!assignedAgent}>
              Assign
            </Button>
          </DialogActions>
        </Dialog>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center', 
          mb: 4
        }}>
          <Box>
            <Typography variant="h4" fontWeight="600" gutterBottom>
              Feedback & Surveys
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Comprehensive feedback management and survey platform
            </Typography>
          </Box>
        </Box>

        {/* Navigation Tabs */}
        <Paper sx={{ mb: 3, borderRadius: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 2 }}
          >
            <Tab icon={<DashboardIcon />} label="Dashboard" />
            <Tab icon={<InboxIcon />} label="Feedback Inbox" />
            <Tab icon={<CampaignIcon />} label="Survey Campaigns" />
            <Tab icon={<DesignIcon />} label="Survey Designer" />
            <Tab icon={<ResponsesIcon />} label="Survey Responses" />
            <Tab icon={<AnalyticsIcon />} label="Insights & Analytics" />
            <Tab icon={<PeopleIcon />} label="Audience Management" />
            <Tab icon={<SendIcon />} label="Distribution Channels" />
            <Tab icon={<AutomationIcon />} label="Automation & Triggers" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <TabPanel value={activeTab} index={0}>
          <DashboardTab />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <FeedbackInboxTab />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <SurveyCampaignsTab />
        </TabPanel>
        <TabPanel value={activeTab} index={3}>
          <SurveyDesignerTab />
        </TabPanel>
        <TabPanel value={activeTab} index={4}>
          <SurveyResponsesTab />
        </TabPanel>
        <TabPanel value={activeTab} index={5}>
          <InsightsAnalyticsTab />
        </TabPanel>
        <TabPanel value={activeTab} index={6}>
          <AudienceManagementTab />
        </TabPanel>
        <TabPanel value={activeTab} index={7}>
          <DistributionChannelsTab />
        </TabPanel>
        <TabPanel value={activeTab} index={8}>
          <AutomationTriggersTab />
        </TabPanel>
      </Box>
    </Fade>
  );
};

export default Feedback; 