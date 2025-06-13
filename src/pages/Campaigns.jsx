import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Avatar,
  AvatarGroup,
  LinearProgress,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  Badge,
  useTheme,
  alpha,
  Fade,
  Grow,
  Collapse,
  Switch,
  RadioGroup,
  Radio,
  FormLabel,
  Autocomplete,
  FormHelperText
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Launch as LaunchIcon,
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  WhatsApp as WhatsAppIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Campaign as CampaignIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  MoreVert as MoreIcon,
  ContentCopy as CopyIcon,
  Preview as PreviewIcon,
  Send as SendIcon,
  Timer as TimerIcon,
  Group as GroupIcon,
  Security as SecurityIcon,
  Verified as VerifiedIcon,
  Block as BlockIcon,
  Assignment as TemplateIcon,
  Dashboard as DashboardIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  Map as MapIcon,
  Language as LanguageIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CampaignManager = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [audiences, setAudiences] = useState([]);
  
  // Dialog states
  const [createCampaignDialog, setCreateCampaignDialog] = useState(false);
  const [templateDialog, setTemplateDialog] = useState(false);
  const [audienceDialog, setAudienceDialog] = useState(false);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [analyticsDialog, setAnalyticsDialog] = useState(false);
  
  // Campaign creation states
  const [campaignStep, setCampaignStep] = useState(0);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
    type: 'promotional',
    channels: [],
    audience: '',
    template: '',
    schedule: 'immediate',
    scheduledDate: null,
    tags: [],
    status: 'draft'
  });
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  
  useEffect(() => {
    loadCampaigns();
    loadTemplates();
    loadAudiences();
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const loadCampaigns = () => {
    const mockCampaigns = [
      {
        id: 1,
        name: 'Q4 Policy Renewal Campaign',
        description: 'Multi-channel campaign for policy renewals',
        type: 'renewal',
        channels: ['email', 'sms', 'whatsapp'],
        audience: 'Policy Holders - Expiring Q4',
        audienceSize: 15420,
        status: 'active',
        progress: 67,
        createdDate: '2024-12-20',
        scheduledDate: '2024-12-25',
        lastModified: '2024-12-28',
        tags: ['renewal', 'urgent', 'multi-channel'],
        metrics: {
          sent: 10331,
          delivered: 9876,
          opened: 6543,
          clicked: 1234,
          converted: 456,
          bounced: 234,
          unsubscribed: 12
        },
        channelMetrics: {
          email: { sent: 5000, delivered: 4800, opened: 3200, clicked: 800 },
          sms: { sent: 3000, delivered: 2950, opened: 2100, clicked: 300 },
          whatsapp: { sent: 2331, delivered: 2126, opened: 1243, clicked: 134 }
        }
      },
      {
        id: 2,
        name: 'New Customer Welcome Series',
        description: 'Onboarding campaign for new customers',
        type: 'welcome',
        channels: ['email', 'whatsapp'],
        audience: 'New Customers - December',
        audienceSize: 2340,
        status: 'scheduled',
        progress: 0,
        createdDate: '2024-12-28',
        scheduledDate: '2025-01-01',
        lastModified: '2024-12-28',
        tags: ['welcome', 'onboarding'],
        metrics: {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          converted: 0,
          bounced: 0,
          unsubscribed: 0
        },
        channelMetrics: {
          email: { sent: 0, delivered: 0, opened: 0, clicked: 0 },
          whatsapp: { sent: 0, delivered: 0, opened: 0, clicked: 0 }
        }
      },
      {
        id: 3,
        name: 'Premium Payment Reminder',
        description: 'Automated reminders for pending payments',
        type: 'reminder',
        channels: ['sms', 'email'],
        audience: 'Pending Payments',
        audienceSize: 8760,
        status: 'completed',
        progress: 100,
        createdDate: '2024-12-15',
        scheduledDate: '2024-12-18',
        lastModified: '2024-12-22',
        tags: ['payment', 'reminder', 'automated'],
        metrics: {
          sent: 8760,
          delivered: 8654,
          opened: 5432,
          clicked: 2876,
          converted: 1234,
          bounced: 106,
          unsubscribed: 23
        },
        channelMetrics: {
          email: { sent: 4380, delivered: 4327, opened: 2716, clicked: 1438 },
          sms: { sent: 4380, delivered: 4327, opened: 2716, clicked: 1438 }
        }
      }
    ];
    setCampaigns(mockCampaigns);
  };

  const loadTemplates = () => {
    const mockTemplates = [
      {
        id: 1,
        name: 'Policy Renewal Reminder',
        type: 'email',
        category: 'renewal',
        subject: 'Your Policy Renewal - Action Required',
        preview: 'Dear {{Name}}, Your policy {{PolicyNumber}} is due for renewal...',
        lastModified: '2024-12-20',
        usage: 45
      },
      {
        id: 2,
        name: 'Welcome Message',
        type: 'whatsapp',
        category: 'welcome',
        subject: 'Welcome to Intelipro Insurance',
        preview: 'Hi {{Name}}! Welcome to our insurance family...',
        lastModified: '2024-12-18',
        usage: 23
      },
      {
        id: 3,
        name: 'Payment Reminder SMS',
        type: 'sms',
        category: 'payment',
        subject: 'Payment Due Reminder',
        preview: 'Hi {{Name}}, your premium payment of {{Amount}} is due...',
        lastModified: '2024-12-15',
        usage: 67
      }
    ];
    setTemplates(mockTemplates);
  };

  const loadAudiences = () => {
    const mockAudiences = [
      {
        id: 1,
        name: 'Policy Holders - Expiring Q4',
        description: 'Customers with policies expiring in Q4 2024',
        size: 15420,
        segments: ['Premium', 'Standard'],
        lastUpdated: '2024-12-28',
        consent: { email: 14200, sms: 13800, whatsapp: 12100 }
      },
      {
        id: 2,
        name: 'New Customers - December',
        description: 'Customers who joined in December 2024',
        size: 2340,
        segments: ['New'],
        lastUpdated: '2024-12-28',
        consent: { email: 2340, sms: 2100, whatsapp: 1890 }
      },
      {
        id: 3,
        name: 'High Value Customers',
        description: 'Customers with premium policies above $5000',
        size: 5670,
        segments: ['Premium', 'VIP'],
        lastUpdated: '2024-12-25',
        consent: { email: 5670, sms: 5200, whatsapp: 4800 }
      }
    ];
    setAudiences(mockAudiences);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'scheduled': return 'info';
      case 'paused': return 'warning';
      case 'completed': return 'primary';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'email': return <EmailIcon />;
      case 'sms': return <SmsIcon />;
      case 'whatsapp': return <WhatsAppIcon />;
      default: return <CampaignIcon />;
    }
  };

  const getChannelColor = (channel) => {
    switch (channel) {
      case 'email': return '#1976d2';
      case 'sms': return '#388e3c';
      case 'whatsapp': return '#25d366';
      default: return theme.palette.primary.main;
    }
  };

  const handleCreateCampaign = () => {
    setCreateCampaignDialog(true);
    setCampaignStep(0);
    setNewCampaign({
      name: '',
      description: '',
      type: 'promotional',
      channels: [],
      audience: '',
      template: '',
      schedule: 'immediate',
      scheduledDate: null,
      tags: [],
      status: 'draft'
    });
  };

  // Validation state
  const [validationErrors, setValidationErrors] = useState({});

  const validateStep = (step) => {
    const errors = {};
    
    switch (step) {
      case 0: // Campaign Details
        if (!newCampaign.name.trim()) {
          errors.name = 'Campaign name is required';
        }
        if (!newCampaign.description.trim()) {
          errors.description = 'Campaign description is required';
        }
        if (newCampaign.name.length > 100) {
          errors.name = 'Campaign name must be less than 100 characters';
        }
        break;
      case 1: // Channel Selection
        if (newCampaign.channels.length === 0) {
          errors.channels = 'Please select at least one channel';
        }
        break;
      case 2: // Audience Selection
        if (!newCampaign.audience) {
          errors.audience = 'Please select an audience';
        }
        break;
      case 3: // Scheduling
        if (newCampaign.schedule === 'scheduled' && !newCampaign.scheduledDate) {
          errors.scheduledDate = 'Please select a date and time for scheduling';
        }
        if (newCampaign.schedule === 'scheduled' && newCampaign.scheduledDate) {
          const selectedDate = new Date(newCampaign.scheduledDate);
          const now = new Date();
          if (selectedDate <= now) {
            errors.scheduledDate = 'Scheduled date must be in the future';
          }
        }
        break;
      default:
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCampaignStepNext = () => {
    if (validateStep(campaignStep)) {
      setCampaignStep(prev => prev + 1);
    }
  };

  const handleCampaignStepBack = () => {
    setCampaignStep(prev => prev - 1);
    setValidationErrors({});
  };

  const handleCloseDialog = () => {
    setCreateCampaignDialog(false);
    setCampaignStep(0);
    setValidationErrors({});
    setNewCampaign({
      name: '',
      description: '',
      type: 'promotional',
      channels: [],
      audience: '',
      template: '',
      schedule: 'immediate',
      scheduledDate: null,
      tags: [],
      status: 'draft'
    });
  };

  const handleSaveCampaignWithValidation = () => {
    if (validateStep(campaignStep)) {
      handleSaveCampaign();
      handleCloseDialog();
    }
  };

  const getStepProgress = () => {
    return ((campaignStep + 1) / 4) * 100;
  };

  // Memoized input handlers to prevent re-renders
  const handleCampaignNameChange = useCallback((e) => {
    setNewCampaign(prev => ({ ...prev, name: e.target.value }));
  }, []);

  const handleCampaignDescriptionChange = useCallback((e) => {
    setNewCampaign(prev => ({ ...prev, description: e.target.value }));
  }, []);

  const handleCampaignTypeChange = useCallback((e) => {
    setNewCampaign(prev => ({ ...prev, type: e.target.value }));
  }, []);

  const handleCampaignTagsChange = useCallback((e, value) => {
    setNewCampaign(prev => ({ ...prev, tags: value }));
  }, []);

  const handleChannelChange = useCallback((channel, checked) => {
    const channels = checked 
      ? [...newCampaign.channels, channel]
      : newCampaign.channels.filter(c => c !== channel);
    setNewCampaign(prev => ({ ...prev, channels }));
  }, [newCampaign.channels]);

  const handleAudienceChange = useCallback((e) => {
    setNewCampaign(prev => ({ ...prev, audience: e.target.value }));
  }, []);

  const handleScheduleChange = useCallback((e) => {
    setNewCampaign(prev => ({ ...prev, schedule: e.target.value }));
  }, []);

  const handleScheduledDateChange = useCallback((e) => {
    setNewCampaign(prev => ({ ...prev, scheduledDate: e.target.value }));
  }, []);

  const handleSaveCampaign = () => {
    const campaign = {
      id: campaigns.length + 1,
      ...newCampaign,
      audienceSize: 0, // Will be updated when audience is loaded
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      progress: 0,
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
        bounced: 0,
        unsubscribed: 0
      },
      channelMetrics: {}
    };
    setCampaigns(prev => [...prev, campaign]);
    setCreateCampaignDialog(false);
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesChannel = channelFilter === 'all' || campaign.channels.includes(channelFilter);
    return matchesSearch && matchesStatus && matchesChannel;
  });

  const CampaignCard = ({ campaign }) => (
    <Grow in={loaded} timeout={300}>
      <Card sx={{ 
        mb: 2, 
        borderRadius: 3,
        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
        }
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="h6" fontWeight="600">
                  {campaign.name}
                </Typography>
                <Chip 
                  label={campaign.status.toUpperCase()}
                  color={getStatusColor(campaign.status)}
                  size="small"
                />
                {campaign.status === 'active' && (
                  <Chip 
                    label={`${campaign.progress}%`}
                    color="info"
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {campaign.description}
              </Typography>
                             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                 {(campaign.tags || []).map((tag, index) => (
                   <Chip key={index} label={tag} size="small" variant="outlined" />
                 ))}
               </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="View Analytics">
                <IconButton size="small" onClick={() => setAnalyticsDialog(campaign)}>
                  <AnalyticsIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Campaign">
                <IconButton size="small">
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="More Actions">
                <IconButton size="small">
                  <MoreIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

                     <Grid container spacing={2} sx={{ mb: 2 }}>
             <Grid item xs={12} sm={6} md={3}>
               <Box sx={{ textAlign: 'center' }}>
                 <Typography variant="h5" fontWeight="600" color="primary">
                   {(campaign.audienceSize || 0).toLocaleString()}
                 </Typography>
                 <Typography variant="caption" color="text.secondary">
                   Audience Size
                 </Typography>
               </Box>
             </Grid>
             <Grid item xs={12} sm={6} md={3}>
               <Box sx={{ textAlign: 'center' }}>
                 <Typography variant="h5" fontWeight="600" color="success.main">
                   {(campaign.metrics?.sent || 0).toLocaleString()}
                 </Typography>
                 <Typography variant="caption" color="text.secondary">
                   Messages Sent
                 </Typography>
               </Box>
             </Grid>
             <Grid item xs={12} sm={6} md={3}>
               <Box sx={{ textAlign: 'center' }}>
                 <Typography variant="h5" fontWeight="600" color="info.main">
                   {(campaign.metrics?.opened || 0).toLocaleString()}
                 </Typography>
                 <Typography variant="caption" color="text.secondary">
                   Opened
                 </Typography>
               </Box>
             </Grid>
             <Grid item xs={12} sm={6} md={3}>
               <Box sx={{ textAlign: 'center' }}>
                 <Typography variant="h5" fontWeight="600" color="warning.main">
                   {(campaign.metrics?.clicked || 0).toLocaleString()}
                 </Typography>
                 <Typography variant="caption" color="text.secondary">
                   Clicked
                 </Typography>
               </Box>
             </Grid>
           </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <Box sx={{ display: 'flex', gap: 1 }}>
               {(campaign.channels || []).map((channel, index) => (
                 <Tooltip key={index} title={channel.toUpperCase()}>
                   <Avatar 
                     sx={{ 
                       width: 32, 
                       height: 32, 
                       bgcolor: getChannelColor(channel),
                       fontSize: '0.875rem'
                     }}
                   >
                     {getChannelIcon(channel)}
                   </Avatar>
                 </Tooltip>
               ))}
             </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {campaign.status === 'active' && (
                <Button
                  startIcon={<PauseIcon />}
                  variant="outlined"
                  size="small"
                  color="warning"
                >
                  Pause
                </Button>
              )}
              {campaign.status === 'paused' && (
                <Button
                  startIcon={<PlayIcon />}
                  variant="outlined"
                  size="small"
                  color="success"
                >
                  Resume
                </Button>
              )}
              {campaign.status === 'scheduled' && (
                <Button
                  startIcon={<LaunchIcon />}
                  variant="contained"
                  size="small"
                  color="primary"
                >
                  Launch Now
                </Button>
              )}
              <Button
                startIcon={<ViewIcon />}
                variant="outlined"
                size="small"
              >
                View Details
              </Button>
            </Box>
          </Box>

          {campaign.status === 'active' && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Campaign Progress
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {campaign.progress}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={campaign.progress} 
                sx={{ borderRadius: 1, height: 6 }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Grow>
  );

  const CampaignCreationDialog = () => (
      <Dialog 
        open={createCampaignDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, minHeight: '70vh' }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 600, 
          pb: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Box>
            <Typography variant="h6" fontWeight="600">
              Create New Campaign
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Step {campaignStep + 1} of 4 - {['Campaign Details', 'Select Channels', 'Choose Audience', 'Schedule Campaign'][campaignStep]}
            </Typography>
          </Box>
          <IconButton 
            onClick={handleCloseDialog}
            sx={{ 
              color: 'text.secondary',
              '&:hover': { 
                bgcolor: 'action.hover',
                color: 'text.primary'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* Progress Bar */}
        <Box sx={{ px: 3, pt: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={getStepProgress()} 
            sx={{ 
              borderRadius: 1, 
              height: 6,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 1
              }
            }}
          />
        </Box>

        <DialogContent dividers sx={{ minHeight: '400px' }}>
          {/* Validation Errors Alert */}
          {Object.keys(validationErrors).length > 0 && (
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={() => setValidationErrors({})}
            >
              <Typography variant="subtitle2" gutterBottom>
                Please fix the following errors:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {Object.values(validationErrors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}

          <Stepper activeStep={campaignStep} orientation="vertical">
            {/* Step 1: Basic Information */}
            <Step>
              <StepLabel>Campaign Details</StepLabel>
              <StepContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                                         <TextField
                       fullWidth
                       label="Campaign Name"
                       value={newCampaign.name}
                       onChange={handleCampaignNameChange}
                       placeholder="Enter campaign name"
                       error={!!validationErrors.name}
                       helperText={validationErrors.name || `${newCampaign.name.length}/100 characters`}
                       inputProps={{ maxLength: 100 }}
                     />
                  </Grid>
                  <Grid item xs={12}>
                                         <TextField
                       fullWidth
                       multiline
                       rows={3}
                       label="Description"
                       value={newCampaign.description}
                       onChange={handleCampaignDescriptionChange}
                       placeholder="Describe your campaign objectives and target audience"
                       error={!!validationErrors.description}
                       helperText={validationErrors.description || "Provide a clear description of your campaign"}
                     />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Campaign Type</InputLabel>
                                             <Select
                         value={newCampaign.type}
                         onChange={handleCampaignTypeChange}
                       >
                        <MenuItem value="promotional">
                          <Box>
                            <Typography variant="body2" fontWeight="500">Promotional</Typography>
                            <Typography variant="caption" color="text.secondary">Marketing and sales campaigns</Typography>
                          </Box>
                        </MenuItem>
                        <MenuItem value="renewal">
                          <Box>
                            <Typography variant="body2" fontWeight="500">Renewal</Typography>
                            <Typography variant="caption" color="text.secondary">Policy renewal reminders</Typography>
                          </Box>
                        </MenuItem>
                        <MenuItem value="welcome">
                          <Box>
                            <Typography variant="body2" fontWeight="500">Welcome</Typography>
                            <Typography variant="caption" color="text.secondary">New customer onboarding</Typography>
                          </Box>
                        </MenuItem>
                        <MenuItem value="reminder">
                          <Box>
                            <Typography variant="body2" fontWeight="500">Reminder</Typography>
                            <Typography variant="caption" color="text.secondary">Payment and deadline reminders</Typography>
                          </Box>
                        </MenuItem>
                        <MenuItem value="newsletter">
                          <Box>
                            <Typography variant="body2" fontWeight="500">Newsletter</Typography>
                            <Typography variant="caption" color="text.secondary">Regular updates and news</Typography>
                          </Box>
                        </MenuItem>
                        <MenuItem value="survey">
                          <Box>
                            <Typography variant="body2" fontWeight="500">Survey</Typography>
                            <Typography variant="caption" color="text.secondary">Feedback and research campaigns</Typography>
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                                         <Autocomplete
                       multiple
                       options={['renewal', 'urgent', 'promotional', 'seasonal', 'automated', 'high-priority', 'follow-up']}
                       value={newCampaign.tags}
                       onChange={handleCampaignTagsChange}
                       renderInput={(params) => (
                         <TextField {...params} label="Tags" placeholder="Add tags for organization" />
                       )}
                       renderTags={(value, getTagProps) =>
                         value.map((option, index) => (
                           <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                         ))
                       }
                     />
                  </Grid>
                </Grid>
                                 <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                   <Button
                     variant="contained"
                     onClick={handleCampaignStepNext}
                     disabled={!newCampaign.name || !newCampaign.description}
                   >
                     Continue
                   </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCloseDialog}
                  >
                    Cancel
                  </Button>
                </Box>
              </StepContent>
            </Step>

            {/* Step 2: Channel Selection */}
            <Step>
              <StepLabel>Select Channels</StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Choose the channels for your campaign. You can select multiple channels for better reach.
                </Typography>
                
                {validationErrors.channels && (
                  <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                    {validationErrors.channels}
                  </Alert>
                )}

                <FormGroup sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={
                                           <Checkbox
                       checked={newCampaign.channels.includes('email')}
                       onChange={(e) => handleChannelChange('email', e.target.checked)}
                     />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                        <Avatar sx={{ bgcolor: '#1976d2', width: 40, height: 40 }}>
                          <EmailIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="500">Email</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Rich HTML emails with tracking, attachments, and personalization
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    control={
                                           <Checkbox
                       checked={newCampaign.channels.includes('sms')}
                       onChange={(e) => handleChannelChange('sms', e.target.checked)}
                     />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                        <Avatar sx={{ bgcolor: '#388e3c', width: 40, height: 40 }}>
                          <SmsIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="500">SMS</Typography>
                          <Typography variant="caption" color="text.secondary">
                            DLT-compliant text messages with high delivery rates
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    control={
                                           <Checkbox
                       checked={newCampaign.channels.includes('whatsapp')}
                       onChange={(e) => handleChannelChange('whatsapp', e.target.checked)}
                     />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                        <Avatar sx={{ bgcolor: '#25d366', width: 40, height: 40 }}>
                          <WhatsAppIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="500">WhatsApp</Typography>
                          <Typography variant="caption" color="text.secondary">
                            WhatsApp Business API messages with media support
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </FormGroup>

                {newCampaign.channels.length > 0 && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      Selected channels: {newCampaign.channels.map(c => c.toUpperCase()).join(', ')}
                    </Typography>
                  </Alert>
                )}

                                 <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                   <Button onClick={handleCampaignStepBack}>
                     Back
                   </Button>
                   <Button
                     variant="contained"
                     onClick={handleCampaignStepNext}
                     disabled={newCampaign.channels.length === 0}
                   >
                     Continue
                   </Button>
                </Box>
              </StepContent>
            </Step>

            {/* Step 3: Audience Selection */}
            <Step>
              <StepLabel>Select Audience</StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Choose your target audience for this campaign.
                </Typography>

                {validationErrors.audience && (
                  <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                    {validationErrors.audience}
                  </Alert>
                )}

                <FormControl fullWidth sx={{ mb: 2 }} error={!!validationErrors.audience}>
                  <InputLabel>Choose Audience</InputLabel>
                                     <Select
                     value={newCampaign.audience}
                     onChange={handleAudienceChange}
                   >
                    {audiences.map((audience) => (
                      <MenuItem key={audience.id} value={audience.name}>
                        <Box sx={{ py: 1 }}>
                          <Typography variant="body2" fontWeight="500">
                            {audience.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {audience.size.toLocaleString()} contacts • {audience.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            <Chip size="small" label={`Email: ${audience.consent.email}`} />
                            <Chip size="small" label={`SMS: ${audience.consent.sms}`} />
                            <Chip size="small" label={`WhatsApp: ${audience.consent.whatsapp}`} />
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {validationErrors.audience && (
                    <FormHelperText>{validationErrors.audience}</FormHelperText>
                  )}
                </FormControl>

                <Button
                  startIcon={<UploadIcon />}
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Upload New Audience (CSV)
                </Button>

                {newCampaign.audience && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      Selected audience: {newCampaign.audience}
                    </Typography>
                  </Alert>
                )}

                                 <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                   <Button onClick={handleCampaignStepBack}>
                     Back
                   </Button>
                   <Button
                     variant="contained"
                     onClick={handleCampaignStepNext}
                     disabled={!newCampaign.audience}
                   >
                     Continue
                   </Button>
                </Box>
              </StepContent>
            </Step>

            {/* Step 4: Scheduling */}
            <Step>
              <StepLabel>Schedule Campaign</StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Choose when to send your campaign.
                </Typography>

                {validationErrors.scheduledDate && (
                  <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                    {validationErrors.scheduledDate}
                  </Alert>
                )}

                <FormControl component="fieldset" sx={{ mb: 2 }}>
                  <FormLabel component="legend">When to send?</FormLabel>
                                     <RadioGroup
                     value={newCampaign.schedule}
                     onChange={handleScheduleChange}
                   >
                    <FormControlLabel
                      value="immediate"
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body2" fontWeight="500">Send immediately</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Campaign will start as soon as it's created
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="scheduled"
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body2" fontWeight="500">Schedule for later</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Choose a specific date and time to send
                          </Typography>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </FormControl>
                
                {newCampaign.schedule === 'scheduled' && (
                                     <TextField
                     fullWidth
                     type="datetime-local"
                     label="Schedule Date & Time"
                     value={newCampaign.scheduledDate || ''}
                     onChange={handleScheduledDateChange}
                     InputLabelProps={{ shrink: true }}
                     error={!!validationErrors.scheduledDate}
                     helperText={validationErrors.scheduledDate || "Select when you want the campaign to be sent"}
                     inputProps={{
                       min: new Date().toISOString().slice(0, 16)
                     }}
                   />
                )}
                
                                 <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                   <Button onClick={handleCampaignStepBack}>
                     Back
                   </Button>
                   <Button
                     variant="contained"
                     onClick={handleSaveCampaignWithValidation}
                     startIcon={<CheckCircleIcon />}
                   >
                     Create Campaign
                   </Button>
                 </Box>
               </StepContent>
             </Step>
           </Stepper>
         </DialogContent>

         <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
           <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
             <Typography variant="body2" color="text.secondary">
               {campaignStep === 0 && "Fill in the basic campaign information"}
               {campaignStep === 1 && "Select communication channels"}
               {campaignStep === 2 && "Choose your target audience"}
               {campaignStep === 3 && "Set the campaign schedule"}
             </Typography>
             <Box sx={{ display: 'flex', gap: 1 }}>
               <Button
                 variant="outlined"
                 onClick={handleCloseDialog}
               >
                 Cancel
               </Button>
               {campaignStep > 0 && (
                 <Button
                   onClick={handleCampaignStepBack}
                 >
                   Back
                 </Button>
               )}
               {campaignStep < 3 ? (
                 <Button
                   variant="contained"
                   onClick={handleCampaignStepNext}
                 >
                   Next
                 </Button>
               ) : (
                 <Button
                   variant="contained"
                   onClick={handleSaveCampaignWithValidation}
                   startIcon={<CheckCircleIcon />}
                 >
                   Create Campaign
                 </Button>
               )}
             </Box>
           </Box>
         </DialogActions>
       </Dialog>
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
          <Box>
            <Typography variant="h4" fontWeight="600" gutterBottom>
              Campaign Manager
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create, manage, and track multi-channel marketing campaigns
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              startIcon={<TemplateIcon />}
              variant="outlined"
              onClick={() => setTemplateDialog(true)}
            >
              Templates
            </Button>
            <Button
              startIcon={<PeopleIcon />}
              variant="outlined"
              onClick={() => setAudienceDialog(true)}
            >
              Audiences
            </Button>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={handleCreateCampaign}
              sx={{ borderRadius: 2 }}
            >
              Create Campaign
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Grow in={loaded} timeout={200}>
              <Card sx={{ 
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                color: 'white'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" fontWeight="600">
                        {campaigns.length}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Campaigns
                      </Typography>
                    </Box>
                    <CampaignIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Grow in={loaded} timeout={300}>
              <Card sx={{ 
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                color: 'white'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" fontWeight="600">
                        {campaigns.filter(c => c.status === 'active').length}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Active Campaigns
                      </Typography>
                    </Box>
                    <PlayIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Grow in={loaded} timeout={400}>
              <Card sx={{ 
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
                color: 'white'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                         <Box>
                       <Typography variant="h4" fontWeight="600">
                         {campaigns.reduce((sum, c) => sum + (c.metrics?.sent || 0), 0).toLocaleString()}
                       </Typography>
                       <Typography variant="body2" sx={{ opacity: 0.9 }}>
                         Messages Sent
                       </Typography>
                     </Box>
                    <SendIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Grow in={loaded} timeout={500}>
              <Card sx={{ 
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                color: 'white'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                         <Box>
                       <Typography variant="h4" fontWeight="600">
                         {Math.round(campaigns.reduce((sum, c) => sum + (c.metrics?.clicked || 0), 0) / campaigns.reduce((sum, c) => sum + (c.metrics?.sent || 0), 0) * 100) || 0}%
                       </Typography>
                       <Typography variant="body2" sx={{ opacity: 0.9 }}>
                         Avg. Click Rate
                       </Typography>
                     </Box>
                    <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>

        {/* Filters and Search */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="paused">Paused</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Channel</InputLabel>
                <Select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                >
                  <MenuItem value="all">All Channels</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="sms">SMS</MenuItem>
                  <MenuItem value="whatsapp">WhatsApp</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  startIcon={<RefreshIcon />}
                  variant="outlined"
                  onClick={loadCampaigns}
                >
                  Refresh
                </Button>
                <Button
                  startIcon={<DownloadIcon />}
                  variant="outlined"
                >
                  Export
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Campaigns List */}
        <Box>
          {filteredCampaigns.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
              <CampaignIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No campaigns found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm || statusFilter !== 'all' || channelFilter !== 'all' 
                  ? 'Try adjusting your filters or search terms'
                  : 'Create your first campaign to get started'
                }
              </Typography>
              {!searchTerm && statusFilter === 'all' && channelFilter === 'all' && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateCampaign}
                >
                  Create Your First Campaign
                </Button>
              )}
            </Paper>
          ) : (
            filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))
          )}
        </Box>

        {/* Dialogs */}
        <CampaignCreationDialog />
      </Box>
    </Fade>
  );
};

export default CampaignManager; 