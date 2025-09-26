import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, Grid, Card, CardContent,
  IconButton, Tooltip, Chip, Avatar, Divider, List, ListItem,
  ListItemText, ListItemIcon, ListItemButton, ListItemSecondaryAction,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
  FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, 
  Alert, Fab, useTheme, alpha, Fade, Collapse, Badge, Tabs, Tab, Grow
} from '@mui/material';
import FlowBuilder from '../components/whatsapp/FlowBuilder';
import TemplateManager from '../components/whatsapp/TemplateManager';
import {
  WhatsApp as WhatsAppIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Visibility as ViewIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Message as MessageIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Send as SendIcon,
  AutoAwesome as AutoAwesomeIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  Close as CloseIcon,
  Description as TemplateIcon,
  Dashboard as DashboardIcon,
  AccountTree as FlowsIcon,
  Description as TemplateIconTab,
  BarChart as AnalyticsIconTab,
  People as AudienceIcon,
  Settings as AutomationIcon
} from '@mui/icons-material';

const WhatsappFlow = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [flows, setFlows] = useState([]);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [createFlowDialog, setCreateFlowDialog] = useState(false);
  const [editFlowDialog, setEditFlowDialog] = useState(false);
  const [viewFlowDialog, setViewFlowDialog] = useState(false);
  const [analyticsDialog, setAnalyticsDialog] = useState(false);
  const [expandedFlow, setExpandedFlow] = useState(null);
  const [flowBuilderOpen, setFlowBuilderOpen] = useState(false);
  const [selectedFlowForEdit, setSelectedFlowForEdit] = useState(null);
  const [templateManagerOpen, setTemplateManagerOpen] = useState(false);
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false);

  const [newFlow, setNewFlow] = useState({
    name: '',
    description: '',
    type: 'marketing',
    status: 'draft',
    targetAudience: '',
    schedule: 'immediate'
  });

  // Set loaded state for animations
  useEffect(() => {
    setLoaded(true);
  }, []);

  // Mock data for WhatsApp flows
  useEffect(() => {
    const mockFlows = [
      {
        id: 1,
        name: 'Welcome Series',
        description: 'Automated welcome message sequence for new customers',
        type: 'onboarding',
        status: 'active',
        targetAudience: 'New Customers',
        schedule: 'trigger',
        messages: 3,
        recipients: 1250,
        delivered: 1180,
        opened: 945,
        replied: 234,
        lastRun: '2024-01-15T10:30:00Z',
        createdAt: '2024-01-10T09:00:00Z',
        performance: {
          deliveryRate: 94.4,
          openRate: 80.1,
          replyRate: 24.8
        }
      },
      {
        id: 2,
        name: 'Policy Renewal Reminder',
        description: 'Automated reminders for upcoming policy renewals',
        type: 'renewal',
        status: 'active',
        targetAudience: 'Renewal Due',
        schedule: 'scheduled',
        messages: 5,
        recipients: 890,
        delivered: 875,
        opened: 720,
        replied: 156,
        lastRun: '2024-01-14T14:00:00Z',
        createdAt: '2024-01-05T11:15:00Z',
        performance: {
          deliveryRate: 98.3,
          openRate: 82.3,
          replyRate: 21.7
        }
      },
      {
        id: 3,
        name: 'Customer Feedback Survey',
        description: 'Post-service feedback collection via WhatsApp',
        type: 'feedback',
        status: 'paused',
        targetAudience: 'Recent Customers',
        schedule: 'trigger',
        messages: 2,
        recipients: 450,
        delivered: 445,
        opened: 380,
        replied: 89,
        lastRun: '2024-01-12T16:45:00Z',
        createdAt: '2024-01-08T13:20:00Z',
        performance: {
          deliveryRate: 98.9,
          openRate: 85.4,
          replyRate: 23.4
        }
      },
      {
        id: 4,
        name: 'Promotional Campaign',
        description: 'Special offers and promotional messages',
        type: 'marketing',
        status: 'draft',
        targetAudience: 'All Customers',
        schedule: 'scheduled',
        messages: 1,
        recipients: 0,
        delivered: 0,
        opened: 0,
        replied: 0,
        lastRun: null,
        createdAt: '2024-01-16T08:30:00Z',
        performance: {
          deliveryRate: 0,
          openRate: 0,
          replyRate: 0
        }
      }
    ];
    setFlows(mockFlows);
  }, []);

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'warning';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircleIcon />;
      case 'paused': return <PauseIcon />;
      case 'draft': return <PendingIcon />;
      case 'completed': return <CheckCircleIcon />;
      default: return <PendingIcon />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'marketing': return 'primary';
      case 'renewal': return 'secondary';
      case 'onboarding': return 'info';
      case 'feedback': return 'warning';
      default: return 'default';
    }
  };

  const handleCreateFlow = () => {
    const flow = {
      id: flows.length + 1,
      ...newFlow,
      messages: 0,
      recipients: 0,
      delivered: 0,
      opened: 0,
      replied: 0,
      lastRun: null,
      createdAt: new Date().toISOString(),
      performance: {
        deliveryRate: 0,
        openRate: 0,
        replyRate: 0
      }
    };
    setFlows([...flows, flow]);
    setNewFlow({
      name: '',
      description: '',
      type: 'marketing',
      status: 'draft',
      targetAudience: '',
      schedule: 'immediate'
    });
    setCreateFlowDialog(false);
  };

  const handleOpenFlowBuilder = (flow = null) => {
    setSelectedFlowForEdit(flow);
    setFlowBuilderOpen(true);
  };

  const handleSaveFlow = (flowData) => {
    if (selectedFlowForEdit) {
      // Update existing flow
      setFlows(flows.map(flow => 
        flow.id === selectedFlowForEdit.id 
          ? { ...flow, ...flowData, updatedAt: new Date().toISOString() }
          : flow
      ));
    } else {
      // Create new flow
      const newFlow = {
        id: flows.length + 1,
        ...flowData,
        status: 'draft',
        messages: flowData.blocks?.length || 0,
        recipients: 0,
        delivered: 0,
        opened: 0,
        replied: 0,
        lastRun: null,
        createdAt: new Date().toISOString(),
        performance: {
          deliveryRate: 0,
          openRate: 0,
          replyRate: 0
        }
      };
      setFlows([...flows, newFlow]);
    }
    setSelectedFlowForEdit(null);
  };

  const handleToggleFlowStatus = (flowId) => {
    setFlows(flows.map(flow => {
      if (flow.id === flowId) {
        const newStatus = flow.status === 'active' ? 'paused' : 'active';
        return { ...flow, status: newStatus };
      }
      return flow;
    }));
  };

  const handleDeleteFlow = (flowId) => {
    setFlows(flows.filter(flow => flow.id !== flowId));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalStats = flows.reduce((acc, flow) => ({
    totalRecipients: acc.totalRecipients + (flow.recipients || 0),
    totalDelivered: acc.totalDelivered + (flow.delivered || 0),
    totalOpened: acc.totalOpened + (flow.opened || 0),
    totalReplied: acc.totalReplied + (flow.replied || 0)
  }), { totalRecipients: 0, totalDelivered: 0, totalOpened: 0, totalReplied: 0 });

  // TabPanel component
  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`whatsapp-tabpanel-${index}`}
      aria-labelledby={`whatsapp-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );

  // Dashboard Tab Component
  // StatCard component matching Renewal Dashboard styling
  const StatCard = ({ title, value, color, icon, index, subtitle }) => {
    // Create a gradient background
    const gradientFrom = alpha(color, theme.palette.mode === 'dark' ? 0.7 : 0.9);
    const gradientTo = alpha(color, theme.palette.mode === 'dark' ? 0.4 : 0.6);
    
    return (
      <Grow in={loaded} timeout={(index + 1) * 200}>
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
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ opacity: 0.9, color: 'white', mt: 1 }}>
                {subtitle}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grow>
    );
  };

  const DashboardTab = () => (
    <Box>
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Flows"
            value={flows.length}
            color={theme.palette.primary.main}
            icon={<TimelineIcon fontSize="inherit" />}
            index={0}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Recipients"
            value={totalStats.totalRecipients.toLocaleString()}
            color={theme.palette.success.main}
            icon={<GroupIcon fontSize="inherit" />}
            index={1}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Delivery Rate"
            value={`${((totalStats.totalDelivered / totalStats.totalRecipients) * 100 || 0).toFixed(1)}%`}
            color={theme.palette.info.main}
            icon={<SendIcon fontSize="inherit" />}
            index={2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Reply Rate"
            value={`${((totalStats.totalReplied / totalStats.totalOpened) * 100 || 0).toFixed(1)}%`}
            color={theme.palette.warning.main}
            icon={<TrendingUpIcon fontSize="inherit" />}
            index={3}
          />
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Recent Activity
        </Typography>
        <List>
          {flows.slice(0, 5).map((flow) => (
            <ListItem key={flow.id}>
              <ListItemIcon>
                <Avatar sx={{ bgcolor: getTypeColor(flow.type) + '.main' }}>
                  <MessageIcon />
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={flow.name}
                secondary={`${flow.status} • ${formatDate(flow.lastRun || flow.createdAt)}`}
              />
              <ListItemSecondaryAction>
                <Chip
                  label={flow.status}
                  color={getStatusColor(flow.status)}
                  size="small"
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );

  // Flow Management Tab Component
  const FlowManagementTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          WhatsApp Flows ({flows.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenFlowBuilder()}
          sx={{ borderRadius: 2 }}
        >
          Create New Flow
        </Button>
      </Box>

      <Grid container spacing={3}>
        {flows.map((flow) => (
          <Grid item xs={12} md={6} lg={4} key={flow.id}>
            <Card sx={{ 
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[8]
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {flow.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {flow.description}
                    </Typography>
                  </Box>
                  <Chip
                    label={flow.status}
                    color={getStatusColor(flow.status)}
                    size="small"
                    icon={getStatusIcon(flow.status)}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={flow.type}
                    color={getTypeColor(flow.type)}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  {flow.targetAudience && (
                    <Chip
                      label={flow.targetAudience}
                      variant="outlined"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Recipients
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {(flow.recipients || 0).toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Delivery Rate
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="success.main">
                      {flow.performance?.deliveryRate?.toFixed(1) || 0}%
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {flow.lastRun ? `Last run: ${formatDate(flow.lastRun)}` : 'Never run'}
                  </Typography>
                  <Box>
                    <Tooltip title="Edit Flow">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenFlowBuilder(flow)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View Analytics">
                      <IconButton 
                        size="small"
                        onClick={() => setAnalyticsDialogOpen(true)}
                      >
                        <AnalyticsIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={flow.status === 'active' ? 'Pause Flow' : 'Activate Flow'}>
                      <IconButton 
                        size="small"
                        onClick={() => handleToggleFlowStatus(flow.id)}
                      >
                        {flow.status === 'active' ? <PauseIcon /> : <PlayIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Flow">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteFlow(flow.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Additional tab components
  const TemplatesTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          WhatsApp Templates
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setTemplateManagerOpen(true)}
          sx={{ borderRadius: 2 }}
        >
          Create Template
        </Button>
      </Box>
      
      {/* Template Categories */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <MessageIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">Message Templates</Typography>
                  <Typography variant="body2" color="text.secondary">12 templates</Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Pre-approved message templates for marketing and notifications
              </Typography>
              <Button size="small" variant="outlined" fullWidth>
                Manage Templates
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <TimelineIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">Flow Templates</Typography>
                  <Typography variant="body2" color="text.secondary">8 templates</Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Complete flow templates for common use cases
              </Typography>
              <Button size="small" variant="outlined" fullWidth>
                Browse Templates
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <AutoAwesomeIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">AI Templates</Typography>
                  <Typography variant="body2" color="text.secondary">5 templates</Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                AI-generated templates based on your business needs
              </Typography>
              <Button size="small" variant="outlined" fullWidth>
                Generate New
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Recent Templates */}
      <Paper sx={{ mt: 3, p: 3 }}>
        <Typography variant="h6" gutterBottom>Recent Templates</Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <MessageIcon />
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary="Welcome Message Template"
              secondary="Last modified 2 hours ago • Marketing"
            />
            <ListItemSecondaryAction>
              <IconButton size="small">
                <EditIcon />
              </IconButton>
              <IconButton size="small">
                <ViewIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Avatar sx={{ bgcolor: 'warning.main' }}>
                <ScheduleIcon />
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary="Renewal Reminder Template"
              secondary="Last modified 1 day ago • Renewal"
            />
            <ListItemSecondaryAction>
              <IconButton size="small">
                <EditIcon />
              </IconButton>
              <IconButton size="small">
                <ViewIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );

  const AnalyticsTab = () => (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Flow Analytics & Performance
      </Typography>
      
      {/* Analytics Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">94.2%</Typography>
              <Typography variant="body2">Completion Rate</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">2.3s</Typography>
              <Typography variant="body2">Avg Response Time</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">12.5%</Typography>
              <Typography variant="body2">Drop-off Rate</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">87.8%</Typography>
              <Typography variant="body2">Click-through Rate</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Flow Heatmap */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Flow Heatmap - Drop-off Points</Typography>
          <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Interactive heatmap showing user drop-off points throughout the flow.
              Red areas indicate high drop-off rates, green areas show successful progression.
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Chip label="High Drop-off" color="error" size="small" />
              <Chip label="Medium Drop-off" color="warning" size="small" />
              <Chip label="Low Drop-off" color="success" size="small" />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Downloadable Reports */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Downloadable Reports</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AnalyticsIcon />}
                onClick={() => {
                  const csvData = 'Flow Name,Completion Rate,Drop-off Rate,Avg Response Time\nWelcome Series,94.2%,5.8%,2.3s\n';
                  const blob = new Blob([csvData], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'flow-analytics.csv';
                  a.click();
                }}
              >
                CSV Report
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AnalyticsIcon />}
                onClick={() => console.log('Generating PDF report...')}
              >
                PDF Report
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AnalyticsIcon />}
                onClick={() => console.log('Exporting to Excel...')}
              >
                Excel Export
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<SendIcon />}
                onClick={() => console.log('Syncing with CRM...')}
              >
                CRM Sync
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );

  const AudienceTab = () => (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Audience Management
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Manage your WhatsApp audience segments and targeting options.
      </Typography>
    </Box>
  );

  const AutomationTab = () => (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Automation & Triggers
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Set up automated triggers and workflow automation for your WhatsApp flows.
      </Typography>
    </Box>
  );



  return (
    <Fade in timeout={800}>
      <Box sx={{ px: 1 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center', 
          mb: 4
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ 
              bgcolor: 'success.main', 
              mr: 2, 
              width: 48, 
              height: 48 
            }}>
              <WhatsAppIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="600" gutterBottom>
                WhatsApp Flow Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Create and manage automated WhatsApp messaging flows
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() => handleOpenFlowBuilder()}
              sx={{ borderRadius: 2 }}
            >
              Create Flow
            </Button>
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
            <Tab icon={<FlowsIcon />} label="Flow Management" />
            <Tab icon={<TemplateIconTab />} label="Templates" />
            <Tab icon={<AnalyticsIconTab />} label="Analytics" />
            <Tab icon={<AudienceIcon />} label="Audience" />
            <Tab icon={<AutomationIcon />} label="Automation" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <TabPanel value={activeTab} index={0}>
          <DashboardTab />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <FlowManagementTab />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <TemplatesTab />
        </TabPanel>
        <TabPanel value={activeTab} index={3}>
          <AnalyticsTab />
        </TabPanel>
        <TabPanel value={activeTab} index={4}>
          <AudienceTab />
        </TabPanel>
        <TabPanel value={activeTab} index={5}>
          <AutomationTab />
        </TabPanel>

        {/* Dialogs */}

      {/* Create Flow Dialog */}
      <Dialog
        open={createFlowDialog}
        onClose={() => setCreateFlowDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AutoAwesomeIcon sx={{ mr: 1 }} />
            Create New WhatsApp Flow
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Flow Name"
                value={newFlow.name}
                onChange={(e) => setNewFlow({ ...newFlow, name: e.target.value })}
                placeholder="Enter flow name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={newFlow.description}
                onChange={(e) => setNewFlow({ ...newFlow, description: e.target.value })}
                placeholder="Describe the purpose of this flow"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Flow Type</InputLabel>
                <Select
                  value={newFlow.type}
                  label="Flow Type"
                  onChange={(e) => setNewFlow({ ...newFlow, type: e.target.value })}
                >
                  <MenuItem value="marketing">Marketing</MenuItem>
                  <MenuItem value="renewal">Renewal</MenuItem>
                  <MenuItem value="onboarding">Onboarding</MenuItem>
                  <MenuItem value="feedback">Feedback</MenuItem>
                  <MenuItem value="support">Support</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Schedule Type</InputLabel>
                <Select
                  value={newFlow.schedule}
                  label="Schedule Type"
                  onChange={(e) => setNewFlow({ ...newFlow, schedule: e.target.value })}
                >
                  <MenuItem value="immediate">Send Immediately</MenuItem>
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="trigger">Trigger-based</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Target Audience"
                value={newFlow.targetAudience}
                onChange={(e) => setNewFlow({ ...newFlow, targetAudience: e.target.value })}
                placeholder="e.g., New Customers, Renewal Due, All Customers"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setCreateFlowDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateFlow}
            disabled={!newFlow.name || !newFlow.description}
          >
            Create Flow
          </Button>
        </DialogActions>
      </Dialog>

      {/* Flow Builder */}
      <FlowBuilder
        open={flowBuilderOpen}
        onClose={() => {
          setFlowBuilderOpen(false);
          setSelectedFlowForEdit(null);
        }}
        flow={selectedFlowForEdit}
        onSave={handleSaveFlow}
      />

      {/* Template Manager */}
      <TemplateManager
        open={templateManagerOpen}
        onClose={() => setTemplateManagerOpen(false)}
        onSave={(template) => {
          console.log('Template saved:', template);
        }}
      />

      {/* Analytics Dashboard */}
      <Dialog
        open={analyticsDialogOpen}
        onClose={() => setAnalyticsDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { height: '90vh' } }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Flow Analytics & Heatmap</Typography>
            <IconButton onClick={() => setAnalyticsDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">94.2%</Typography>
                  <Typography variant="body2">Completion Rate</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">2.3s</Typography>
                  <Typography variant="body2">Avg Response Time</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">12.5%</Typography>
                  <Typography variant="body2">Drop-off Rate</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">87.8%</Typography>
                  <Typography variant="body2">Click-through Rate</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Flow Heatmap - Drop-off Points</Typography>
                  <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      Interactive heatmap showing user drop-off points throughout the flow.
                      Red areas indicate high drop-off rates, green areas show successful progression.
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                      <Chip label="High Drop-off" color="error" size="small" />
                      <Chip label="Medium Drop-off" color="warning" size="small" />
                      <Chip label="Low Drop-off" color="success" size="small" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Downloadable Reports</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<AnalyticsIcon />}
                        onClick={() => {
                          const csvData = 'Flow Name,Completion Rate,Drop-off Rate,Avg Response Time\nWelcome Series,94.2%,5.8%,2.3s\n';
                          const blob = new Blob([csvData], { type: 'text/csv' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'flow-analytics.csv';
                          a.click();
                        }}
                      >
                        CSV Report
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<AnalyticsIcon />}
                        onClick={() => console.log('Generating PDF report...')}
                      >
                        PDF Report
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<AnalyticsIcon />}
                        onClick={() => console.log('Exporting to Excel...')}
                      >
                        Excel Export
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<SendIcon />}
                        onClick={() => console.log('Syncing with CRM...')}
                      >
                        CRM Sync
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>




      </Box>
    </Fade>
  );
};

export default WhatsappFlow; 
