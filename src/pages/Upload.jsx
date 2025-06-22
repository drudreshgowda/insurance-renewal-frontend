import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Button, Grid, 
  LinearProgress, Alert, AlertTitle, List, 
  ListItem, ListItemText, Divider, Chip,
  Card, CardContent, alpha, useTheme,
  Fade, Grow, Zoom, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem,
  Switch, FormControlLabel, Tab, Tabs, Avatar,
  Stepper, Step, StepLabel, StepContent
} from '@mui/material';
import { 
  CloudUpload as UploadIcon, 
  Download as DownloadIcon,
  CheckCircleOutline as CheckIcon,
  ErrorOutline as ErrorIcon,
  HourglassEmpty as PendingIcon,
  GetApp as FileDownloadIcon,
  Campaign as CampaignIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Sms as SmsIcon,
  Schedule as ScheduleIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { uploadPolicyData } from '../services/api';

const Upload = () => {
  const theme = useTheme();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  
  // Campaign state
  const [campaignDialog, setCampaignDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [campaignData, setCampaignData] = useState({
    name: '',
    type: ['email'], // Changed to array to support multiple selections
    template: {}, // Changed to object to store templates for each type
    scheduleType: 'immediate',
    scheduleDate: '',
    scheduleTime: '',
    targetAudience: 'all'
  });
  
  // Predefined templates
  const [templates] = useState({
    email: [
      { id: 'email-1', name: 'Renewal Reminder - 30 Days', subject: 'Your Policy Renewal is Due Soon', content: 'Dear {name}, your policy expires in 30 days...' },
      { id: 'email-2', name: 'Renewal Reminder - 7 Days', subject: 'Urgent: Policy Renewal Required', content: 'Dear {name}, your policy expires in 7 days...' },
      { id: 'email-3', name: 'Welcome New Customer', subject: 'Welcome to Our Insurance Family', content: 'Dear {name}, thank you for choosing us...' }
    ],
    whatsapp: [
      { id: 'wa-1', name: 'Quick Renewal Reminder', content: 'Hi {name}! Your policy {policy_number} expires on {expiry_date}. Renew now: {renewal_link}' },
      { id: 'wa-2', name: 'Payment Confirmation', content: 'Thank you {name}! Your payment of ₹{amount} has been received. Policy renewed successfully.' }
    ],
    sms: [
      { id: 'sms-1', name: 'Renewal Alert', content: 'Dear {name}, your policy expires on {expiry_date}. Renew at {link} or call {phone}' },
      { id: 'sms-2', name: 'Payment Due', content: 'Payment of ₹{amount} due for policy {policy_number}. Pay now: {payment_link}' }
    ]
  });
  
  // Active campaigns
  const [activeCampaigns, setActiveCampaigns] = useState([
    {
      id: 'camp-1',
      name: 'May Renewals Email Campaign',
      type: 'email',
      status: 'active',
      uploadId: 'upload-128',
      uploadFilename: 'may_renewals_batch1.xlsx',
      targetCount: 238,
      sent: 156,
      opened: 89,
      clicked: 34,
      converted: 12,
      createdAt: '2025-05-15T11:00:00',
      scheduledAt: '2025-05-15T14:00:00'
    },
    {
      id: 'camp-2',
      name: 'April Follow-up WhatsApp',
      type: 'whatsapp',
      status: 'paused',
      uploadId: 'upload-127',
      uploadFilename: 'april_end_policies.xlsx',
      targetCount: 175,
      sent: 98,
      delivered: 94,
      read: 67,
      replied: 23,
      createdAt: '2025-04-30T16:30:00',
      scheduledAt: '2025-05-01T09:00:00'
    }
  ]);

  const [uploadHistory, setUploadHistory] = useState([
    {
      id: 'upload-128',
      filename: 'may_renewals_batch1.xlsx',
      timestamp: '2025-05-15T10:45:00',
      status: 'Completed',
      records: 245,
      successful: 238,
      failed: 7,
      fileSize: '2.4 MB',
      downloadUrl: '/api/downloads/may_renewals_batch1.xlsx'
    },
    {
      id: 'upload-127',
      filename: 'april_end_policies.xlsx',
      timestamp: '2025-04-30T16:20:00',
      status: 'Completed',
      records: 189,
      successful: 175,
      failed: 14,
      fileSize: '1.8 MB',
      downloadUrl: '/api/downloads/april_end_policies.xlsx'
    },
    {
      id: 'upload-126',
      filename: 'quarterly_review_q1.csv',
      timestamp: '2025-04-28T11:30:00',
      status: 'Processing',
      records: 312,
      successful: '...',
      failed: '...',
      fileSize: '3.1 MB',
      downloadUrl: '/api/downloads/quarterly_review_q1.csv'
    },
    {
      id: 'upload-125',
      filename: 'branch_mumbai_renewals.xlsx',
      timestamp: '2025-04-25T14:15:00',
      status: 'Completed',
      records: 167,
      successful: 159,
      failed: 8,
      fileSize: '1.5 MB',
      downloadUrl: '/api/downloads/branch_mumbai_renewals.xlsx'
    },
    {
      id: 'upload-124',
      filename: 'corporate_policies_april.xlsx',
      timestamp: '2025-04-22T09:45:00',
      status: 'Failed',
      records: 95,
      successful: 0,
      failed: 95,
      fileSize: '890 KB',
      downloadUrl: '/api/downloads/corporate_policies_april.xlsx'
    },
    {
      id: 'upload-123',
      filename: 'april_renewals.xlsx',
      timestamp: '2025-04-10T09:30:00',
      status: 'Completed',
      records: 156,
      successful: 142,
      failed: 14,
      fileSize: '1.2 MB',
      downloadUrl: '/api/downloads/april_renewals.xlsx'
    },
    {
      id: 'upload-122',
      filename: 'march_end_batch.xlsx',
      timestamp: '2025-03-28T14:15:00',
      status: 'Completed',
      records: 203,
      successful: 189,
      failed: 14,
      fileSize: '1.9 MB',
      downloadUrl: '/api/downloads/march_end_batch.xlsx'
    },
    {
      id: 'upload-121',
      filename: 'regional_data_south.csv',
      timestamp: '2025-03-25T13:20:00',
      status: 'Completed',
      records: 278,
      successful: 265,
      failed: 13,
      fileSize: '2.7 MB',
      downloadUrl: '/api/downloads/regional_data_south.csv'
    },
    {
      id: 'upload-120',
      filename: 'bulk_import_march.xlsx',
      timestamp: '2025-03-20T10:10:00',
      status: 'Completed',
      records: 445,
      successful: 421,
      failed: 24,
      fileSize: '4.2 MB',
      downloadUrl: '/api/downloads/bulk_import_march.xlsx'
    },
    {
      id: 'upload-119',
      filename: 'agent_submissions_week12.csv',
      timestamp: '2025-03-18T15:30:00',
      status: 'Completed',
      records: 134,
      successful: 128,
      failed: 6,
      fileSize: '1.1 MB',
      downloadUrl: '/api/downloads/agent_submissions_week12.csv'
    }
  ]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, 500);
    
    try {
      // In a real app, this would call your API
      // const result = await uploadPolicyData(file);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Mock successful upload
      const newUpload = {
        id: `upload-${Date.now()}`,
        filename: file.name,
        timestamp: new Date().toISOString(),
        status: 'Processing',
        records: 178,
        successful: '...',
        failed: '...',
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        downloadUrl: '/api/downloads/' + file.name
      };
      
      setUploadHistory([newUpload, ...uploadHistory]);
      
      setUploadStatus({
        type: 'success',
        message: 'File uploaded successfully. Processing has begun.'
      });
      
      // Simulate status change after processing
      setTimeout(() => {
        setUploadHistory(prev => {
          const updated = [...prev];
          updated[0] = {
            ...updated[0],
            status: 'Completed',
            successful: 165,
            failed: 13
          };
          return updated;
        });
      }, 8000);
      
    } catch (error) {
      clearInterval(progressInterval);
      setUploadStatus({
        type: 'error',
        message: error.message || 'Failed to upload file. Please try again.'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    // In a real app, this would download a template file
    alert('Template download would start here');
  };

  const handleDownloadFile = (upload) => {
    // In a real app, this would trigger the actual file download
    const link = document.createElement('a');
    link.href = upload.downloadUrl;
    link.download = upload.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    console.log(`Downloading ${upload.filename}...`);
  };

  // Campaign handlers
  const handleCreateCampaign = (upload) => {
    setSelectedUpload(upload);
    setCampaignData({
      name: `${upload.filename.split('.')[0]} Campaign`,
      type: ['email'], // Initialize as array
      template: {}, // Initialize as empty object
      scheduleType: 'immediate',
      scheduleDate: '',
      scheduleTime: '',
      targetAudience: 'all'
    });
    setActiveStep(0);
    setCampaignDialog(true);
  };

  const handleCampaignSubmit = () => {
    // Create separate campaigns for each selected type
    const newCampaigns = campaignData.type.map((type, index) => ({
      id: `camp-${Date.now()}-${index}`,
      name: campaignData.type.length > 1 
        ? `${campaignData.name} (${type.charAt(0).toUpperCase() + type.slice(1)})`
        : campaignData.name,
      type: type,
      status: campaignData.scheduleType === 'immediate' ? 'active' : 'scheduled',
      uploadId: selectedUpload.id,
      uploadFilename: selectedUpload.filename,
      targetCount: selectedUpload.successful,
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      createdAt: new Date().toISOString(),
      scheduledAt: campaignData.scheduleType === 'scheduled' 
        ? `${campaignData.scheduleDate}T${campaignData.scheduleTime}:00`
        : new Date().toISOString()
    }));
    
    setActiveCampaigns([...newCampaigns, ...activeCampaigns]);
    setCampaignDialog(false);
    
    // Show success message
    const campaignCount = newCampaigns.length;
    const campaignText = campaignCount > 1 ? `${campaignCount} campaigns` : 'campaign';
    setUploadStatus({
      type: 'success',
      message: `${campaignText} created successfully! (${campaignData.type.join(', ').toUpperCase()})`
    });
    
    // Clear the success message after 5 seconds
    setTimeout(() => {
      setUploadStatus(null);
    }, 5000);
  };

  const handleCampaignAction = (campaignId, action) => {
    setActiveCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, status: action === 'pause' ? 'paused' : 'active' }
          : campaign
      )
    );
  };

  const getCampaignIcon = (type) => {
    switch (type) {
      case 'email': return <EmailIcon />;
      case 'whatsapp': return <WhatsAppIcon />;
      case 'sms': return <SmsIcon />;
      default: return <CampaignIcon />;
    }
  };

  const getCampaignStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'scheduled': return 'info';
      case 'completed': return 'default';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Processing': return 'warning';
      case 'Failed': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckIcon color="success" />;
      case 'Processing': return <PendingIcon color="warning" />;
      case 'Failed': return <ErrorIcon color="error" />;
      default: return null;
    }
  };

  return (
    <Fade in={true} timeout={800}>
      <Box>
        <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          Upload Policy Data
        </Typography>
        
                <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Grow in={true} timeout={800}>
              <Card 
                elevation={0} 
                sx={{ 
                  mb: 3, 
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  overflow: 'visible',
                  height: '600px'
                }}
              >
                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    Upload New File
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      Upload cases using our template format. Only Excel (.xlsx) or CSV files are supported.
                    </Typography>
                    
                    <Button 
                      variant="outlined" 
                      startIcon={<DownloadIcon />}
                      onClick={handleDownloadTemplate}
                      sx={{ 
                        mt: 2, 
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      Download Template
                    </Button>
                  </Box>
                  
                  <Box 
                    sx={{ 
                      border: `2px dashed ${theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.3) : alpha(theme.palette.primary.main, 0.2)}`,
                      borderRadius: 3, 
                      p: 4, 
                      textAlign: 'center',
                      mb: 3,
                      backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.05) : alpha(theme.palette.primary.main, 0.03),
                      transition: 'all 0.2s ease',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      minHeight: '300px',
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.08) : alpha(theme.palette.primary.main, 0.05),
                        borderColor: theme.palette.primary.main,
                      }
                    }}
                  >
                    <input
                      accept=".xlsx,.csv"
                      style={{ display: 'none' }}
                      id="upload-file-button"
                      type="file"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                    <label htmlFor="upload-file-button">
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <UploadIcon 
                          sx={{ 
                            fontSize: 60, 
                            color: theme.palette.primary.main,
                            opacity: 0.7,
                            mb: 2
                          }} 
                        />
                        <Button
                          variant="contained"
                          component="span"
                          startIcon={<UploadIcon />}
                          disabled={uploading}
                          sx={{
                            px: 3,
                            py: 1,
                            borderRadius: 2,
                            boxShadow: '0 4px 14px rgba(0,118,255,0.25)',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 20px rgba(0,118,255,0.35)',
                            }
                          }}
                        >
                          {file ? 'Change File' : 'Select File'}
                        </Button>
                        
                        <Typography variant="body2" sx={{ mt: 2, color: theme.palette.text.secondary }}>
                          Drag and drop or click to select
                        </Typography>
                      </Box>
                    </label>
                    
                    {file && (
                      <Zoom in={Boolean(file)}>
                        <Box sx={{ 
                          mt: 3, 
                          p: 2, 
                          borderRadius: 2, 
                          backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : alpha(theme.palette.background.paper, 0.8),
                          border: `1px solid ${theme.palette.divider}`
                        }}>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {file.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {(file.size / 1024).toFixed(2)} KB • {file.type}
                          </Typography>
                        </Box>
                      </Zoom>
                    )}
                  </Box>
                  
                  {file && !uploading && (
                    <Fade in={Boolean(file && !uploading)}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleUpload}
                        fullWidth
                        size="large"
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: 600,
                          boxShadow: '0 4px 14px rgba(0,118,255,0.25)',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(0,118,255,0.35)',
                          }
                        }}
                      >
                        Upload and Process File
                      </Button>
                    </Fade>
                  )}
                  
                  {uploading && (
                    <Box sx={{ width: '100%', mt: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={uploadProgress} 
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: alpha(theme.palette.primary.main, 0.2),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                          }
                        }}
                      />
                      <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', fontWeight: 500 }}>
                        Uploading... {uploadProgress}%
                      </Typography>
                    </Box>
                  )}
                  
                  {uploadStatus && (
                    <Grow in={Boolean(uploadStatus)}>
                      <Alert 
                        severity={uploadStatus.type} 
                        sx={{ 
                          mt: 3,
                          borderRadius: 2,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                        icon={uploadStatus.type === 'success' ? <CheckIcon /> : <ErrorIcon />}
                      >
                        <AlertTitle>{uploadStatus.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
                        {uploadStatus.message}
                      </Alert>
                    </Grow>
                  )}
                </CardContent>
              </Card>
            </Grow>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Grow in={true} timeout={1000}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
              >
                <CardContent sx={{ p: 3, height: '600px', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                    Recent Uploads ({uploadHistory.length})
                  </Typography>
                  
                  <Box sx={{ 
                    flex: 1, 
                    overflow: 'auto',
                    pr: 1,
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.1) : alpha(theme.palette.common.black, 0.1),
                      borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '3px',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      }
                    }
                  }}>
                    <List sx={{ px: 1 }}>
                      {uploadHistory.map((upload, index) => (
                        <Grow key={upload.id} in={true} timeout={(index + 1) * 200}>
                          <Box>
                            {index > 0 && <Divider sx={{ my: 2 }} />}
                            <ListItem 
                              alignItems="flex-start" 
                              disableGutters
                              sx={{ px: 1 }}
                            >
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Box sx={{ flex: 1, mr: 2 }}>
                                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                        {upload.filename}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {upload.fileSize}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Tooltip title="Create Campaign">
                                        <IconButton
                                          size="small"
                                          onClick={() => handleCreateCampaign(upload)}
                                          disabled={upload.status !== 'Completed'}
                                          sx={{
                                            color: theme.palette.success.main,
                                            '&:hover': {
                                              backgroundColor: alpha(theme.palette.success.main, 0.1),
                                              transform: 'scale(1.1)'
                                            },
                                            '&:disabled': {
                                              color: theme.palette.action.disabled
                                            }
                                          }}
                                        >
                                          <CampaignIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Download File">
                                        <IconButton
                                          size="small"
                                          onClick={() => handleDownloadFile(upload)}
                                          sx={{
                                            color: theme.palette.primary.main,
                                            '&:hover': {
                                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                              transform: 'scale(1.1)'
                                            }
                                          }}
                                        >
                                          <FileDownloadIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <Chip 
                                        label={upload.status} 
                                        color={getStatusColor(upload.status)}
                                        size="small"
                                        icon={getStatusIcon(upload.status)}
                                        sx={{ 
                                          fontWeight: 500,
                                          '& .MuiChip-icon': { fontSize: '0.8rem' }
                                        }}
                                      />
                                    </Box>
                                  </Box>
                                }
                                secondary={
                                  <>
                                    <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                      {new Date(upload.timestamp).toLocaleString()}
                                    </Typography>
                                    <Box sx={{ 
                                      mt: 1, 
                                      p: 1.5, 
                                      borderRadius: 2, 
                                      backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.4) : alpha(theme.palette.background.default, 0.8),
                                      border: `1px solid ${theme.palette.divider}`
                                    }}>
                                      <Grid container spacing={2}>
                                        <Grid item xs={4}>
                                          <Typography variant="body2" color="text.secondary">
                                            Total Records
                                          </Typography>
                                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {upload.records}
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                          <Typography variant="body2" color="success.main">
                                            Successful
                                          </Typography>
                                          <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                                            {upload.successful}
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                          <Typography variant="body2" color="error.main">
                                            Failed
                                          </Typography>
                                          <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
                                            {upload.failed}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    </Box>
                                  </>
                                }
                              />
                            </ListItem>
                          </Box>
                        </Grow>
                      ))}
                    </List>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
          
          <Grid item xs={12}>
            <Grow in={true} timeout={1200}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
              >
                <CardContent sx={{ p: 3, height: '600px', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                    Active Campaigns ({activeCampaigns.length})
                  </Typography>
                  
                  <Box sx={{ 
                    flex: 1, 
                    overflow: 'auto',
                    pr: 1,
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.1) : alpha(theme.palette.common.black, 0.1),
                      borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '3px',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      }
                    }
                  }}>
                    {activeCampaigns.length === 0 ? (
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: '100%',
                        textAlign: 'center'
                      }}>
                        <CampaignIcon sx={{ fontSize: 64, color: theme.palette.text.secondary, mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No Active Campaigns
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Create campaigns from completed uploads to engage with your customers
                        </Typography>
                      </Box>
                    ) : (
                      <List sx={{ px: 1 }}>
                        {activeCampaigns.map((campaign, index) => (
                          <Grow key={campaign.id} in={true} timeout={(index + 1) * 200}>
                            <Box>
                              {index > 0 && <Divider sx={{ my: 2 }} />}
                              <ListItem 
                                alignItems="flex-start" 
                                disableGutters
                                sx={{ px: 1 }}
                              >
                                <ListItemText
                                  primary={
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                      <Box sx={{ flex: 1, mr: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                          <Avatar sx={{ 
                                            width: 24, 
                                            height: 24, 
                                            mr: 1, 
                                            bgcolor: theme.palette.primary.main 
                                          }}>
                                            {getCampaignIcon(campaign.type)}
                                          </Avatar>
                                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {campaign.name}
                                          </Typography>
                                        </Box>
                                        <Typography variant="caption" color="text.secondary">
                                          {campaign.uploadFilename}
                                        </Typography>
                                      </Box>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        {campaign.status === 'active' ? (
                                          <Tooltip title="Pause Campaign">
                                            <IconButton
                                              size="small"
                                              onClick={() => handleCampaignAction(campaign.id, 'pause')}
                                              sx={{ color: theme.palette.warning.main }}
                                            >
                                              <PauseIcon fontSize="small" />
                                            </IconButton>
                                          </Tooltip>
                                        ) : (
                                          <Tooltip title="Resume Campaign">
                                            <IconButton
                                              size="small"
                                              onClick={() => handleCampaignAction(campaign.id, 'resume')}
                                              sx={{ color: theme.palette.success.main }}
                                            >
                                              <PlayIcon fontSize="small" />
                                            </IconButton>
                                          </Tooltip>
                                        )}
                                        <Tooltip title="View Details">
                                          <IconButton
                                            size="small"
                                            sx={{ color: theme.palette.primary.main }}
                                          >
                                            <ViewIcon fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                        <Chip 
                                          label={campaign.status} 
                                          color={getCampaignStatusColor(campaign.status)}
                                          size="small"
                                          sx={{ 
                                            fontWeight: 500,
                                            textTransform: 'capitalize'
                                          }}
                                        />
                                      </Box>
                                    </Box>
                                  }
                                  secondary={
                                    <>
                                      <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                        Created: {new Date(campaign.createdAt).toLocaleDateString()}
                                      </Typography>
                                      <Box sx={{ 
                                        mt: 1, 
                                        p: 1.5, 
                                        borderRadius: 2, 
                                        backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.4) : alpha(theme.palette.background.default, 0.8),
                                        border: `1px solid ${theme.palette.divider}`
                                      }}>
                                        <Grid container spacing={2}>
                                          <Grid item xs={6}>
                                            <Typography variant="body2" color="text.secondary">
                                              Target
                                            </Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                              {campaign.targetCount}
                                            </Typography>
                                          </Grid>
                                          <Grid item xs={6}>
                                            <Typography variant="body2" color="primary.main">
                                              Sent
                                            </Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                              {campaign.sent}
                                            </Typography>
                                          </Grid>
                                          {campaign.type === 'email' && (
                                            <>
                                              <Grid item xs={6}>
                                                <Typography variant="body2" color="success.main">
                                                  Opened
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                                                  {campaign.opened}
                                                </Typography>
                                              </Grid>
                                              <Grid item xs={6}>
                                                <Typography variant="body2" color="warning.main">
                                                  Clicked
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.main' }}>
                                                  {campaign.clicked}
                                                </Typography>
                                              </Grid>
                                            </>
                                          )}
                                          {campaign.type === 'whatsapp' && (
                                            <>
                                              <Grid item xs={6}>
                                                <Typography variant="body2" color="success.main">
                                                  Delivered
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                                                  {campaign.delivered}
                                                </Typography>
                                              </Grid>
                                              <Grid item xs={6}>
                                                <Typography variant="body2" color="info.main">
                                                  Read
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: 'info.main' }}>
                                                  {campaign.read}
                                                </Typography>
                                              </Grid>
                                            </>
                                          )}
                                        </Grid>
                                      </Box>
                                    </>
                                  }
                                />
                              </ListItem>
                            </Box>
                          </Grow>
                        ))}
                      </List>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>

        {/* Campaign Creation Dialog */}
        <Dialog
          open={campaignDialog}
          onClose={() => setCampaignDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                <CampaignIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Create New Campaign
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedUpload?.filename} • {selectedUpload?.successful} customers
                </Typography>
              </Box>
            </Box>
          </DialogTitle>
          
          <DialogContent sx={{ pt: 2 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              <Step>
                <StepLabel>Campaign Details</StepLabel>
                <StepContent>
                  <Grid container spacing={3} sx={{ mt: 0.5 }}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Campaign Name"
                        value={campaignData.name}
                        onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </Grid>
                                         <Grid item xs={12} sm={6}>
                       <FormControl fullWidth>
                         <InputLabel>Campaign Type</InputLabel>
                         <Select
                           multiple
                           value={campaignData.type}
                           label="Campaign Type"
                           onChange={(e) => setCampaignData(prev => ({ ...prev, type: e.target.value, template: {} }))}
                           renderValue={(selected) => (
                             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                               {selected.map((value) => (
                                 <Chip 
                                   key={value} 
                                   label={value.charAt(0).toUpperCase() + value.slice(1)}
                                   size="small"
                                   icon={
                                     value === 'email' ? <EmailIcon fontSize="small" /> :
                                     value === 'whatsapp' ? <WhatsAppIcon fontSize="small" /> :
                                     <SmsIcon fontSize="small" />
                                   }
                                   sx={{ 
                                     height: 24,
                                     '& .MuiChip-icon': { fontSize: '0.8rem' }
                                   }}
                                 />
                               ))}
                             </Box>
                           )}
                         >
                           <MenuItem value="email">
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                               <EmailIcon fontSize="small" />
                               Email Campaign
                             </Box>
                           </MenuItem>
                           <MenuItem value="whatsapp">
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                               <WhatsAppIcon fontSize="small" />
                               WhatsApp Campaign
                             </Box>
                           </MenuItem>
                           <MenuItem value="sms">
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                               <SmsIcon fontSize="small" />
                               SMS Campaign
                             </Box>
                           </MenuItem>
                         </Select>
                       </FormControl>
                     </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Target Audience</InputLabel>
                        <Select
                          value={campaignData.targetAudience}
                          label="Target Audience"
                          onChange={(e) => setCampaignData(prev => ({ ...prev, targetAudience: e.target.value }))}
                        >
                          <MenuItem value="all">All Customers</MenuItem>
                          <MenuItem value="pending">Pending Renewals Only</MenuItem>
                          <MenuItem value="expired">Expired Policies Only</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      onClick={() => setActiveStep(1)}
                      disabled={!campaignData.name || !campaignData.type}
                    >
                      Next: Select Template
                    </Button>
                  </Box>
                </StepContent>
              </Step>
              
              <Step>
                <StepLabel>Template Selection</StepLabel>
                <StepContent>
                                     <Typography variant="body2" color="text.secondary" gutterBottom>
                     {campaignData.type.length > 1 
                       ? 'Choose templates for each selected campaign type'
                       : 'Choose from predefined templates or create a custom one'
                     }
                   </Typography>
                   
                   {campaignData.type.map((type) => (
                     <Box key={type} sx={{ mt: 3 }}>
                       <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                         {type === 'email' && <EmailIcon fontSize="small" />}
                         {type === 'whatsapp' && <WhatsAppIcon fontSize="small" />}
                         {type === 'sms' && <SmsIcon fontSize="small" />}
                         {type.charAt(0).toUpperCase() + type.slice(1)} Template
                       </Typography>
                       
                       <FormControl fullWidth>
                         <InputLabel>Select {type.charAt(0).toUpperCase() + type.slice(1)} Template</InputLabel>
                         <Select
                           value={campaignData.template[type] || ''}
                           label={`Select ${type.charAt(0).toUpperCase() + type.slice(1)} Template`}
                           onChange={(e) => setCampaignData(prev => ({ 
                             ...prev, 
                             template: { ...prev.template, [type]: e.target.value }
                           }))}
                         >
                           {templates[type]?.map((template) => (
                             <MenuItem key={template.id} value={template.id}>
                               <Box>
                                 <Typography variant="body1">{template.name}</Typography>
                                 <Typography variant="caption" color="text.secondary">
                                   {template.subject || template.content.substring(0, 50) + '...'}
                                 </Typography>
                               </Box>
                             </MenuItem>
                           ))}
                         </Select>
                       </FormControl>
                       
                       {campaignData.template[type] && (
                         <Box sx={{ 
                           mt: 2, 
                           p: 2, 
                           borderRadius: 2, 
                           backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.4) : alpha(theme.palette.background.default, 0.8),
                           border: `1px solid ${theme.palette.divider}`
                         }}>
                           <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                             Template Preview:
                           </Typography>
                           {(() => {
                             const template = templates[type]?.find(t => t.id === campaignData.template[type]);
                             return (
                               <Box>
                                 {template?.subject && (
                                   <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                                     Subject: {template.subject}
                                   </Typography>
                                 )}
                                 <Typography variant="body2" color="text.secondary">
                                   {template?.content}
                                 </Typography>
                               </Box>
                             );
                           })()}
                         </Box>
                       )}
                     </Box>
                   ))}
                  
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button onClick={() => setActiveStep(0)}>
                      Back
                    </Button>
                                         <Button
                       variant="contained"
                       onClick={() => setActiveStep(2)}
                       disabled={!campaignData.type.every(type => campaignData.template[type])}
                     >
                       Next: Schedule
                     </Button>
                  </Box>
                </StepContent>
              </Step>
              
              <Step>
                <StepLabel>Schedule Campaign</StepLabel>
                <StepContent>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Schedule Type</InputLabel>
                    <Select
                      value={campaignData.scheduleType}
                      label="Schedule Type"
                      onChange={(e) => setCampaignData(prev => ({ ...prev, scheduleType: e.target.value }))}
                    >
                      <MenuItem value="immediate">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PlayIcon fontSize="small" />
                          Send Immediately
                        </Box>
                      </MenuItem>
                      <MenuItem value="scheduled">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ScheduleIcon fontSize="small" />
                          Schedule for Later
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                  
                  {campaignData.scheduleType === 'scheduled' && (
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          type="date"
                          label="Schedule Date"
                          value={campaignData.scheduleDate}
                          onChange={(e) => setCampaignData(prev => ({ ...prev, scheduleDate: e.target.value }))}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ min: new Date().toISOString().split('T')[0] }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          type="time"
                          label="Schedule Time"
                          value={campaignData.scheduleTime}
                          onChange={(e) => setCampaignData(prev => ({ ...prev, scheduleTime: e.target.value }))}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  )}
                  
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button onClick={() => setActiveStep(1)}>
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleCampaignSubmit}
                      disabled={campaignData.scheduleType === 'scheduled' && (!campaignData.scheduleDate || !campaignData.scheduleTime)}
                    >
                      Create Campaign
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            </Stepper>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={() => setCampaignDialog(false)}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default Upload;