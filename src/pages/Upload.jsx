import React, { useState,useEffect } from 'react';
import { useProviders } from '../context/ProvidersContext';
import { 
  Box, Typography, Paper, Button, Grid, 
  LinearProgress, Alert, AlertTitle, List, 
  ListItem, ListItemText, Divider, Chip,
  Card, CardContent, alpha, useTheme,
  Fade, Grow, Zoom, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent,
  TextField, FormControl, InputLabel, Select, MenuItem,
  Switch, FormControlLabel, Avatar,
  Stepper, Step, StepLabel, StepContent, Accordion,
  AccordionSummary, AccordionDetails, FormGroup, Checkbox
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
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  ExpandMore as ExpandMoreIcon,
  Notifications as NotificationsIcon,
  Timeline as TimelineIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { deduplicateContacts } from '../services/api';
import { UploadApI } from '../api/Upload';
import { Snackbar } from '@mui/material';
import { getDate } from 'date-fns';
import { id } from 'date-fns/locale';

//import Alert from '@mui/material/Alert';

const Upload = () => {
  const theme = useTheme();
  const { getProviders, getActiveProvider } = useProviders();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  //live api
  useEffect(() => {
    fetchUploads();
    fetchTemplates();
    fetchActiveCampaigns();
  }, []);
  const fetchUploads = async () => {
    const result = await UploadApI.GetFileUploads();
    if (result.success) {
      setUploadHistory(result.data.results);
    } else {
      console.error("Failed to fetch uploads:", result.message);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
  
    setUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);
  
    try {
      const result = await UploadApI.SelectFile(file);
  
      if (result.success) {
        setSnackbar({
          open: true,
          message: "File uploaded successfully!",
          severity: "success",
        });
        await fetchUploads();

      } else {
        const isTokenExpired = result.message && result.message.toLowerCase().includes("token expired");
        setSnackbar({
          open: true,
          message: isTokenExpired ? "Session expired, please login again." : result.message || "File upload failed!",
          severity: isTokenExpired ? "error" : "error",
        });
  
        if (isTokenExpired) {
          localStorage.removeItem("authToken");
        }
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "An unexpected error occurred!",
        severity: "error",
      });
    } finally {
      setUploading(false);
      setUploadProgress(100);
    }
  };


  // Campaign state
  const [campaignDialog, setCampaignDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [campaignData, setCampaignData] = useState({
    name: '',
    type: ['email'], // Changed to array to support multiple selections
    template: {}, // Changed to object to store templates for each type
    providers: {}, // Store selected providers for each channel
    scheduleType: 'immediate',
    scheduleDate: '',
    scheduleTime: '',
    targetAudience: 'all',
    advancedScheduling: {
      enabled: false,
      intervals: []
    }
  });
  
  // Dynamic templates from API
  const [dynamicTemplates, setDynamicTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templatesError, setTemplatesError] = useState(null);

  const fetchTemplates = async () => {
    setTemplatesLoading(true);
    setTemplatesError(null);
    
    try {
      console.log("Starting template fetch...");
      const result = await UploadApI.GetTemplates();
      
      if (result.success) {
        console.log("Templates API response:", result.data);
        
        // Handle different response formats
        let templates = [];
        if (Array.isArray(result.data)) {
          templates = result.data;
        } else if (result.data && typeof result.data === 'object') {
          // Try different possible keys
          templates = result.data.templates || 
                     result.data.results || 
                     result.data.data || 
                     result.data.items ||
                     Object.values(result.data).find(Array.isArray) || 
                     [];
        }
        
        console.log("Extracted templates:", templates);
        console.log("Number of templates found:", templates.length);
        
        if (templates.length > 0) {
          setDynamicTemplates(templates);
          setTemplatesError(null);
          console.log(`Successfully loaded ${templates.length} templates from API`);
          
          // Log first few templates to see their structure
          console.log('Sample templates:', templates.slice(0, 3).map(t => ({
            id: t.id,
            idType: typeof t.id,
            name: t.template_name || t.name,
            type: t.template_type || t.type || t.channel,
            subject: t.subject,
            content: t.template_content || t.content
          })));
        } else {
          console.warn("No templates found in API response");
          setTemplatesError("No templates found in API response");
          setDynamicTemplates([]);
        }
      } else {
        console.error("Failed to fetch templates:", result.message);
        setTemplatesError(result.message || "Failed to fetch templates");
        setDynamicTemplates([]);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      setTemplatesError(error.message || "Network error while fetching templates");
      setDynamicTemplates([]);
    } finally {
      setTemplatesLoading(false);
    }
  };

  const fetchActiveCampaigns = async () => {
    try {
      const result = await UploadApI.GetActiveCampaigns();
      
      if (result.success) {
        // Handle different response formats from campaigns API
        let campaigns = [];
        if (Array.isArray(result.data)) {
          campaigns = result.data;
        } else if (result.data && typeof result.data === 'object') {
          // Try different possible keys for campaigns data
          campaigns = result.data.campaigns || 
                     result.data.results || 
                     result.data.data || 
                     result.data.items ||
                     Object.values(result.data).find(Array.isArray) || 
                     [];
        }
        
        if (campaigns.length > 0) {
          // Transform the campaigns API response to match the expected format
          const transformedCampaigns = campaigns.map(campaign => ({
            id: campaign.id,
            name: campaign.campaign_name || campaign.name,
            type: campaign.campaign_type || campaign.type || campaign.channel,
            status: campaign.status || (campaign.is_active ? 'active' : 'paused'),
            uploadId: campaign.file_upload_id || `upload-${campaign.id}`,
            uploadFilename: campaign.upload_filename || `${(campaign.campaign_name || campaign.name).replace(/\s+/g, '_').toLowerCase()}.xlsx`,
            targetCount: campaign.target_count || campaign.targetCount || 0,
            sent: campaign.sent_count || campaign.sent || 0,
            opened: campaign.opened_count || campaign.opened || 0,
            clicked: campaign.clicked_count || campaign.clicked || 0,
            converted: campaign.converted_count || campaign.converted || 0,
            delivered: campaign.delivered_count || campaign.delivered || 0,
            read: campaign.read_count || campaign.read || 0,
            replied: campaign.replied_count || campaign.replied || 0,
            createdAt: campaign.created_at || campaign.createdAt,
            scheduledAt: campaign.scheduled_at || campaign.scheduledAt || campaign.updated_at,
            subject: campaign.subject,
            content: campaign.content,
            variables: campaign.variables
          }));
          
          setActiveCampaigns(transformedCampaigns);
        } else {
          setActiveCampaigns([]);
        }
      } else {
        console.error("Failed to fetch active campaigns:", result.message);
        setActiveCampaigns([]);
      }
    } catch (error) {
      console.error("Error fetching active campaigns:", error);
      setActiveCampaigns([]);
    }
  };

  // Force template refresh when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (dynamicTemplates.length === 0 && !templatesLoading) {
        console.log("No templates loaded, retrying...");
        fetchTemplates();
      }
    }, 2000); // Retry after 2 seconds if no templates loaded

    return () => clearTimeout(timer);
  }, [dynamicTemplates.length, templatesLoading]);
  
  // Fallback templates (in case API fails) - removed mock data
  const [templates] = useState({
    email: [],
    whatsapp: [],
    sms: [],
    call: []
  });
  
  // Active campaigns - now fetched dynamically from API
  const [activeCampaigns, setActiveCampaigns] = useState([]);

  const [uploadHistory, setUploadHistory] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      console.log("Selected file:", selectedFile);
      setFile(selectedFile);
    }
  };
  
  
  
  
  

  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = process.env.PUBLIC_URL + "/PolicyDataFormat.csv"; 
    link.download = "PolicyDataFormat.csv"; 
    link.click();
  };
  
  const handleDownloadFile = (upload) => {
    const link = document.createElement('a');
    link.href = upload.downloadUrl;
    link.download = upload.original_filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  };

  // Campaign handlers
  const handleCreateCampaign = (upload) => {
    setSelectedUpload(upload);
    setCampaignData({
      name: `${upload.original_filename.split('.')[0]} Campaign`,
      type: ['email'], // Initialize as array
      template: {}, // Initialize as empty object
      providers: {}, // Initialize as empty object
      scheduleType: 'immediate',
      scheduleDate: '',
      scheduleTime: '',
      targetAudience: 'all',
      advancedScheduling: {
        enabled: false,
        intervals: []
      }
    });
    setActiveStep(0);
    setCampaignDialog(true);
  };

  const handleCampaignSubmit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setSnackbar({
          open: true,
          message: "Please login first.",
          severity: "error"
        });
        return;
      }
  
      // Get the primary channel (first selected)
      const primaryChannel = campaignData.type[0];
      const selectedTemplateId = campaignData.template[primaryChannel];
      
      console.log('Campaign data:', campaignData);
      console.log('Primary channel:', primaryChannel);
      console.log('Selected template ID:', selectedTemplateId);
      console.log('Selected template ID type:', typeof selectedTemplateId);
      console.log('Template object:', campaignData.template);
      console.log('Available templates for channel:', getTemplatesForChannel(primaryChannel));
      
      // Log each template's ID and type
      const channelTemplates = getTemplatesForChannel(primaryChannel);
      channelTemplates.forEach(template => {
        console.log(`Template: ${template.template_name || template.name}, ID: ${template.id}, ID Type: ${typeof template.id}`);
      });
      
      if (!selectedTemplateId) {
        setSnackbar({
          open: true,
          message: `Please select a template for ${primaryChannel} campaign.`,
          severity: "error"
        });
        return;
      }
      
      // Handle different template ID formats
      let templateId;
      const isUsingFallbackTemplates = channelTemplates.some(t => typeof t.id === 'string' && t.id.includes('-'));
      
      console.log('Using fallback templates:', isUsingFallbackTemplates);
      
      if (isUsingFallbackTemplates) {
        // For fallback templates with string IDs, we need to map them to numeric IDs
        const fallbackTemplateMap = {
          'email-1': 1,
          'email-2': 2, 
          'email-3': 3,
          'wa-1': 4,
          'wa-2': 5,
          'sms-1': 6,
          'sms-2': 7,
          'call-1': 8,
          'call-2': 9
        };
        
        templateId = fallbackTemplateMap[selectedTemplateId];
        console.log('Mapped fallback template ID:', selectedTemplateId, '->', templateId);
      } else {
        // For dynamic templates from API
        if (typeof selectedTemplateId === 'number') {
          templateId = selectedTemplateId;
        } else if (typeof selectedTemplateId === 'string') {
          templateId = parseInt(selectedTemplateId, 10);
          if (isNaN(templateId)) {
            // If parsing fails, try to find the template by ID and use its numeric ID
            const selectedTemplate = channelTemplates.find(t => t.id.toString() === selectedTemplateId);
            if (selectedTemplate) {
              templateId = parseInt(selectedTemplate.id, 10);
            }
          }
        } else {
          templateId = parseInt(selectedTemplateId, 10);
        }
      }
      
      console.log('Final template ID:', templateId, 'Type:', typeof templateId);
      
      if (isNaN(templateId) || templateId <= 0) {
        console.error('Template ID validation failed:', {
          selectedTemplateId,
          templateId,
          isUsingFallbackTemplates,
          channelTemplates: channelTemplates.map(t => ({ id: t.id, name: t.template_name || t.name }))
        });
        
        setSnackbar({
          open: true,
          message: `Invalid template ID (${selectedTemplateId}). Please select a different template or refresh the templates.`,
          severity: "error"
        });
        return;
      }

      // Map target audience to ID (adjust based on your backend)
      const targetAudienceMap = {
        'all': 1,
        'pending': 2,
        'expired': 3
      };

      // Map campaign type to ID (adjust based on your backend)
      const campaignTypeMap = {
        'email': 1,
        'whatsapp': 2,
        'sms': 3,
        'call': 4
      };

      // Handle scheduled_at with proper timezone offset
      let scheduledAt = null;
      if (campaignData.scheduleType === 'scheduled') {
        if (campaignData.scheduleDate && campaignData.scheduleTime) {
          const date = new Date(`${campaignData.scheduleDate}T${campaignData.scheduleTime}`);
          scheduledAt = date.toISOString().replace('Z', '+00:00');
        } else {
          // Default: schedule for 1 hour from now
          const now = new Date();
          now.setHours(now.getHours() + 1);
          scheduledAt = now.toISOString().replace('Z', '+00:00');
        }
      }

      // Map trigger conditions from UI to backend format
      const mapTriggerConditions = (conditions) => {
        const conditionMap = [];
        if (conditions.sendIfNoResponse) conditionMap.push("no_response");
        if (conditions.sendIfNoAction) conditionMap.push("no_action");
        if (conditions.sendIfNoEngagement) conditionMap.push("no_engagement");
        return conditionMap;
      };

      const campaignPayload = {
        file_upload_id: selectedUpload.id,
        campaign_name: campaignData.name,
        campaign_type_id: campaignTypeMap[primaryChannel] || 1,
        template_id: templateId,  
        target_audience_id: targetAudienceMap[campaignData.targetAudience] || 1,
        communication_provider_id: parseInt(campaignData.providers[primaryChannel]) || 1,
        schedule_type: campaignData.scheduleType,
        scheduled_at: scheduledAt,
        enable_advanced_scheduling: campaignData.advancedScheduling.enabled,
        schedule_intervals: campaignData.advancedScheduling.enabled
          ? campaignData.advancedScheduling.intervals
              .filter(i => i.enabled)
              .map(interval => ({
                channel: interval.channel,
                delay_value: interval.delay,
                delay_unit: interval.delayUnit,
                trigger_conditions: mapTriggerConditions(interval.conditions),
                is_active: interval.enabled,
                template_id: parseInt(interval.template),
                communication_provider_id: parseInt(campaignData.providers[interval.channel]) || 1
              }))
          : []
      };
  
      console.log('Final Payload:', campaignPayload);
  
      const result = await UploadApI.Createcampaigns(campaignPayload);
  
      if (result.success) {
        setSnackbar({
          open: true,
          message: result.data.message || "Campaign created successfully!",
          severity: "success"
        });
        
        // Close dialog first
        setCampaignDialog(false);
        
        // Add a small delay to allow backend processing, then refresh campaigns
        setTimeout(async () => {
          await fetchActiveCampaigns();
        }, 1000);
        
        // Reset form state
        setCampaignData({
          name: '',
          type: [],
          targetAudience: 'all',
          providers: {},
          template: {},
          scheduleType: 'immediate',
          scheduleDate: '',
          scheduleTime: '',
          advancedScheduling: {
            enabled: false,
            intervals: []
          }
        });
        setActiveStep(0);
      } else {
        console.error("Campaign creation failed:", result);
        setSnackbar({
          open: true,
          message: result.message || "Failed to create campaign.",
          severity: "error"
        });
      }
    } catch (error) {
      console.error("Campaign submit error:", error);
      setSnackbar({
        open: true,
        message: error.message || "An unexpected error occurred!",
        severity: "error"
      });
    }
  };
  
  

  const handleCampaignAction = async (campaignId, action) => {
    // For now, just refresh the campaigns list from API
    // In a real implementation, you would call an API to update the campaign status
    await fetchActiveCampaigns();
  };

  const getCampaignIcon = (type) => {
    switch (type) {
      case 'email': return <EmailIcon />;
      case 'whatsapp': return <WhatsAppIcon />;
      case 'sms': return <SmsIcon />;
      case 'call': return <PhoneIcon />;
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

  // Helper function to get templates for a specific channel
  const getTemplatesForChannel = (channel) => {
    if (dynamicTemplates && dynamicTemplates.length > 0) {
      // Filter templates by channel type and log the IDs
      const channelTemplates = dynamicTemplates.filter(template => {
        const templateChannel = template.template_type?.toLowerCase() || 
                               template.channel?.toLowerCase() || 
                               template.type?.toLowerCase();
        return templateChannel === channel.toLowerCase();
      });
      
      console.log(`Templates for ${channel}:`, channelTemplates.map(t => ({ 
        id: t.id, 
        name: t.template_name || t.name,
        subject: t.subject,
        content: t.template_content || t.content
      })));
      
      // Return dynamic templates if found
      if (channelTemplates.length > 0) {
        return channelTemplates;
      }
    }
    
    // Fallback to static templates if no dynamic templates found
    console.log(`Using fallback templates for ${channel}`);
    return templates[channel] || [];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'warning';
      case 'fsailed': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckIcon color="success" />;
      case 'processing': return <PendingIcon color="warning" />;
      case 'failed': return <ErrorIcon color="error" />;
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
                                        {upload.original_filename}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {upload.file_size_formatted}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Tooltip title="Create Campaign">
                                        <IconButton
                                          size="small"
                                          onClick={() => handleCreateCampaign(upload)}
                                          disabled={upload.upload_status !== 'completed'}
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
                                        label={upload.upload_status} 
                                        color={getStatusColor(upload.upload_status)}
                                        size="small"
                                        icon={getStatusIcon(upload.upload_status)}
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
                                      {new Date(upload.created_at).toLocaleString()}
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
                                            {upload.total_records}
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                          <Typography variant="body2" color="success.main">
                                            Successful
                                          </Typography>
                                          <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                                            {upload.successful_records}
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                          <Typography variant="body2" color="error.main">
                                            Failed
                                          </Typography>
                                          <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
                                            {upload.failed_records}
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

        {/* Campaign Creation Dialog */}
        <Dialog
          open={campaignDialog}
          onClose={() => {
            setCampaignDialog(false);
            // Refresh campaigns when dialog closes
            setTimeout(() => fetchActiveCampaigns(), 500);
          }}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                <CampaignIcon />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Create New Campaign
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedUpload?.filename} • {selectedUpload?.successful} customers
                </Typography>
              </Box>
              <IconButton
                onClick={() => setCampaignDialog(false)}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
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
                                     value === 'sms' ? <SmsIcon fontSize="small" /> :
                                     <PhoneIcon fontSize="small" />
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
                           <MenuItem value="call">
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                               <PhoneIcon fontSize="small" />
                               Call Campaign
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

                  {/* Provider Selection */}
                  {campaignData.type.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                        Select Communication Providers
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Choose specific providers for each communication channel
                      </Typography>
                      
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        {campaignData.type.map((channel) => {
                          const availableProviders = getProviders(channel).filter(p => p.isActive);
                          const defaultProvider = getActiveProvider(channel);
                          
                          return (
                            <Grid item xs={12} md={6} key={channel}>
                              <FormControl fullWidth>
                                <InputLabel>
                                  {channel.charAt(0).toUpperCase() + channel.slice(1)} Provider
                                </InputLabel>
                                <Select
                                  value={campaignData.providers[channel] || defaultProvider?.id || ''}
                                  label={`${channel.charAt(0).toUpperCase() + channel.slice(1)} Provider`}
                                  onChange={(e) => setCampaignData(prev => ({
                                    ...prev,
                                    providers: { ...prev.providers, [channel]: e.target.value }
                                  }))}
                                  disabled={availableProviders.length === 0}
                                >
                                  {availableProviders.map((provider) => (
                                    <MenuItem key={provider.id} value={provider.id}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ 
                                          width: 8, 
                                          height: 8, 
                                          borderRadius: '50%', 
                                          bgcolor: provider.status === 'connected' ? 'success.main' : 'error.main' 
                                        }} />
                                        {provider.name}
                                        {provider.isDefault && (
                                          <Chip label="Default" size="small" sx={{ ml: 1 }} />
                                        )}
                                      </Box>
                                    </MenuItem> 
                                  ))}
                                  {availableProviders.length === 0 && (
                                    <MenuItem disabled>
                                      No active {channel} providers configured
                                    </MenuItem>
                                  )}
                                </Select>
                              </FormControl>
                              {availableProviders.length === 0 && (
                                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                                  Configure {channel} providers in Settings → Providers
                                </Typography>
                              )}
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Box>
                  )}
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button onClick={() => setCampaignDialog(false)}>
                      Cancel
                    </Button>
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
                                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                     <Box>
                       <Typography variant="body2" color="text.secondary">
                         {campaignData.type.length > 1 
                           ? 'Choose templates for each selected campaign type'
                           : 'Choose from predefined templates or create a custom one'
                         }
                       </Typography>

                       {dynamicTemplates.length === 0 && !templatesLoading && !templatesError && (
                         <Typography variant="caption" color="warning.main" sx={{ display: 'block', mt: 0.5 }}>
                           Using fallback templates (API not available)
                         </Typography>
                       )}
                     </Box>
                     <Box sx={{ display: 'flex', gap: 1 }}>



                     </Box>
                   </Box>
                   
                   {templatesError && (
                     <Alert severity="warning" sx={{ mb: 2 }}>
                       <Typography variant="body2">
                         {templatesError}. Using fallback templates.
                       </Typography>
                     </Alert>
                   )}
                   
                   {!templatesError && dynamicTemplates.length === 0 && !templatesLoading && (
                     <Alert severity="info" sx={{ mb: 2 }}>
                       <Typography variant="body2">
                         No templates loaded from API. Using fallback templates. Click "Refresh" to try loading from API again.
                       </Typography>
                     </Alert>
                   )}
                   
                   {campaignData.type.map((type) => (
                     <Box key={type} sx={{ mt: 3 }}>
                       <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                         {type === 'email' && <EmailIcon fontSize="small" />}
                         {type === 'whatsapp' && <WhatsAppIcon fontSize="small" />}
                         {type === 'sms' && <SmsIcon fontSize="small" />}
                         {type === 'call' && <PhoneIcon fontSize="small" />}
                         {type.charAt(0).toUpperCase() + type.slice(1)} Template

                       </Typography>
                       
                       <FormControl fullWidth>
                         <InputLabel>Select {type.charAt(0).toUpperCase() + type.slice(1)} Template</InputLabel>
                         <Select
                           value={campaignData.template[type] || ''}
                           label={`Select ${type.charAt(0).toUpperCase() + type.slice(1)} Template`}
                           onChange={(e) => {
                             console.log(`Template selected for ${type}:`, e.target.value, 'Type:', typeof e.target.value);
                             setCampaignData(prev => ({ 
                               ...prev, 
                               template: { ...prev.template, [type]: e.target.value }
                             }));
                           }}
                           disabled={templatesLoading}
                         >
                           {getTemplatesForChannel(type)?.map((template) => (
                             <MenuItem key={template.id} value={template.id}>
                               <Box sx={{ width: '100%' }}>
                                 <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                   {template.template_name || template.name}
                                 </Typography>
                                 <Typography variant="caption" color="text.secondary" sx={{ 
                                   display: 'block',
                                   overflow: 'hidden',
                                   textOverflow: 'ellipsis',
                                   whiteSpace: 'nowrap',
                                   maxWidth: '300px'
                                 }}>
                                   {template.subject || template.script || template.template_content || 'Template content...'}
                                 </Typography>
                                 {template.template_type && (
                                   <Chip 
                                     label={template.template_type} 
                                     size="small" 
                                     sx={{ mt: 0.5, fontSize: '0.7rem', height: '20px' }}
                                   />
                                 )}
                               </Box>
                             </MenuItem>
                           ))}
                           {templatesLoading && (
                             <MenuItem disabled>
                               <Typography variant="body2" color="text.secondary">
                                 Loading templates...
                               </Typography>
                             </MenuItem>
                           )}
                               {!templatesLoading && getTemplatesForChannel(type)?.length === 0 && (
                             <MenuItem disabled>
                               <Typography variant="body2" color="text.secondary">
                                 No templates available for {type}
                               </Typography>
                             </MenuItem>
                           )}
                           {!templatesLoading && getTemplatesForChannel(type)?.length > 0 && !campaignData.template[type] && (
                             <MenuItem disabled>
                               <Typography variant="body2" color="warning.main">
                                 Please select a template to continue
                               </Typography>
                             </MenuItem>
                           )}
                         </Select>
                       </FormControl>
                       
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
                       Next: Basic Schedule
                     </Button>
                  </Box>
                </StepContent>
              </Step>
              
              <Step>
                <StepLabel>Basic Schedule</StepLabel>
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
                    <Grid container spacing={2} sx={{ mb: 2 }}>
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

                  <FormControlLabel
                    control={
                      <Switch
                        checked={campaignData.advancedScheduling.enabled}
                        onChange={(e) => setCampaignData(prev => ({ 
                          ...prev, 
                          advancedScheduling: { ...prev.advancedScheduling, enabled: e.target.checked }
                        }))}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TimelineIcon fontSize="small" />
                        <Typography variant="body2">
                          Enable Advanced Scheduling (Multi-channel intervals)
                        </Typography>
                      </Box>
                    }
                    sx={{ mb: 2 }}
                  />

                  {campaignData.advancedScheduling.enabled && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        Advanced scheduling allows you to set up multiple communications at different intervals across various channels.
                        This will be configured in the next step.
                      </Typography>
                    </Alert>
                  )}
                  
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button onClick={() => setActiveStep(1)}>
                      Back
                    </Button>
                    {campaignData.advancedScheduling.enabled ? (
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(3)}
                        disabled={campaignData.scheduleType === 'scheduled' && (!campaignData.scheduleDate || !campaignData.scheduleTime)}
                      >
                        Next: Advanced Schedule
                      </Button>
                    ) : (
                    <Button
                      variant="contained"
                      onClick={handleCampaignSubmit}
                      disabled={
                        (campaignData.scheduleType === 'scheduled' && (!campaignData.scheduleDate || !campaignData.scheduleTime)) ||
                        !campaignData.type.every(type => campaignData.template[type])
                      }
                    >
                      Create Campaign
                    </Button>
                    )}
                  </Box>
                </StepContent>
              </Step>

              <Step>
                <StepLabel>Advanced Scheduling</StepLabel>
                <StepContent>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
                    Configure Multi-Channel Communication Intervals
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Set up automated follow-up communications across different channels at specific intervals to maximize customer engagement.
                  </Typography>

                  {/* Interval Configuration */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Communication Intervals</Typography>
                      <Button
                        startIcon={<AddIcon />}
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          const newInterval = {
                            id: Date.now(),
                            channel: 'email',
                            delay: 1,
                            delayUnit: 'days',
                            template: '',
                            enabled: true,
                            conditions: {
                              sendIfNoResponse: true,
                              sendIfNoAction: false
                            }
                          };
                          setCampaignData(prev => ({
                            ...prev,
                            advancedScheduling: {
                              ...prev.advancedScheduling,
                              intervals: [...prev.advancedScheduling.intervals, newInterval]
                            }
                          }));
                        }}
                      >
                        Add Interval
            </Button>
                    </Box>

                    {campaignData.advancedScheduling.intervals.length === 0 ? (
                      <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                        <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          No intervals configured yet. Add your first communication interval above.
                        </Typography>
                      </Paper>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {campaignData.advancedScheduling.intervals.map((interval, index) => (
                          <Accordion key={interval.id} defaultExpanded={index === 0}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                <Avatar sx={{ 
                                  width: 32, 
                                  height: 32, 
                                  bgcolor: interval.channel === 'email' ? '#1976d2' : 
                                           interval.channel === 'whatsapp' ? '#25d366' : 
                                           interval.channel === 'sms' ? '#ff9800' : '#9c27b0'
                                }}>
                                  {interval.channel === 'email' && <EmailIcon fontSize="small" />}
                                  {interval.channel === 'whatsapp' && <WhatsAppIcon fontSize="small" />}
                                  {interval.channel === 'sms' && <SmsIcon fontSize="small" />}
                                  {interval.channel === 'call' && <PhoneIcon fontSize="small" />}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {interval.channel.charAt(0).toUpperCase() + interval.channel.slice(1)} - 
                                    After {interval.delay} {interval.delayUnit}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {interval.template ? getTemplatesForChannel(interval.channel)?.find(t => t.id === interval.template)?.template_name || getTemplatesForChannel(interval.channel)?.find(t => t.id === interval.template)?.name : 'No template selected'}
                                  </Typography>
                                </Box>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={interval.enabled}
                                      onChange={(e) => {
                                        const updatedIntervals = campaignData.advancedScheduling.intervals.map(int => 
                                          int.id === interval.id ? { ...int, enabled: e.target.checked } : int
                                        );
                                        setCampaignData(prev => ({
                                          ...prev,
                                          advancedScheduling: {
                                            ...prev.advancedScheduling,
                                            intervals: updatedIntervals
                                          }
                                        }));
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  }
                                  label=""
                                  sx={{ mr: 1 }}
                                />
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                  <FormControl fullWidth>
                                    <InputLabel>Channel</InputLabel>
                                    <Select
                                      value={interval.channel}
                                      label="Channel"
                                      onChange={(e) => {
                                        const updatedIntervals = campaignData.advancedScheduling.intervals.map(int => 
                                          int.id === interval.id ? { ...int, channel: e.target.value, template: '' } : int
                                        );
                                        setCampaignData(prev => ({
                                          ...prev,
                                          advancedScheduling: {
                                            ...prev.advancedScheduling,
                                            intervals: updatedIntervals
                                          }
                                        }));
                                      }}
                                    >
                                      <MenuItem value="email">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <EmailIcon fontSize="small" />
                                          Email
                                        </Box>
                                      </MenuItem>
                                      <MenuItem value="whatsapp">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <WhatsAppIcon fontSize="small" />
                                          WhatsApp
                                        </Box>
                                      </MenuItem>
                                      <MenuItem value="sms">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <SmsIcon fontSize="small" />
                                          SMS
                                        </Box>
                                      </MenuItem>
                                      <MenuItem value="call">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <PhoneIcon fontSize="small" />
                                          Call
                                        </Box>
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    <TextField
                                      label="Delay"
                                      type="number"
                                      value={interval.delay}
                                      onChange={(e) => {
                                        const updatedIntervals = campaignData.advancedScheduling.intervals.map(int => 
                                          int.id === interval.id ? { ...int, delay: parseInt(e.target.value) || 1 } : int
                                        );
                                        setCampaignData(prev => ({
                                          ...prev,
                                          advancedScheduling: {
                                            ...prev.advancedScheduling,
                                            intervals: updatedIntervals
                                          }
                                        }));
                                      }}
                                      inputProps={{ min: 1 }}
                                      sx={{ width: '70px' }}
                                    />
                                    <FormControl sx={{ minWidth: 100 }}>
                                      <InputLabel>Unit</InputLabel>
                                      <Select
                                        value={interval.delayUnit}
                                        label="Unit"
                                        onChange={(e) => {
                                          const updatedIntervals = campaignData.advancedScheduling.intervals.map(int => 
                                            int.id === interval.id ? { ...int, delayUnit: e.target.value } : int
                                          );
                                          setCampaignData(prev => ({
                                            ...prev,
                                            advancedScheduling: {
                                              ...prev.advancedScheduling,
                                              intervals: updatedIntervals
                                            }
                                          }));
                                        }}
                                      >
                                        <MenuItem value="minutes">Minutes</MenuItem>
                                        <MenuItem value="hours">Hours</MenuItem>
                                        <MenuItem value="days">Days</MenuItem>
                                        <MenuItem value="weeks">Weeks</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <FormControl fullWidth>
                                    <InputLabel>Template</InputLabel>
                                    <Select
                                      value={interval.template}
                                      label="Template"
                                      onChange={(e) => {
                                        const updatedIntervals = campaignData.advancedScheduling.intervals.map(int => 
                                          int.id === interval.id ? { ...int, template: e.target.value } : int
                                        );
                                        setCampaignData(prev => ({
                                          ...prev,
                                          advancedScheduling: {
                                            ...prev.advancedScheduling,
                                            intervals: updatedIntervals
                                          }
                                        }));
                                      }}
                                    >
                                      {getTemplatesForChannel(interval.channel)?.map((template) => (
                                        <MenuItem key={template.id} value={template.id}>
                                          <Box sx={{ width: '100%' }}>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                              {template.template_name || template.name}
                                            </Typography>
                                            {template.subject && (
                                              <Typography variant="caption" color="text.secondary" sx={{ 
                                                display: 'block',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                maxWidth: '200px'
                                              }}>
                                                {template.subject}
                                              </Typography>
                                            )}
                                          </Box>
                                        </MenuItem>
                                      ))}
                                      {getTemplatesForChannel(interval.channel)?.length === 0 && (
                                        <MenuItem disabled>
                                          <Typography variant="body2" color="text.secondary">
                                            No templates available for {interval.channel}
                                          </Typography>
                                        </MenuItem>
                                      )}
                                    </Select>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    Trigger Conditions
                                  </Typography>
                                  <FormGroup row>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={interval.conditions.sendIfNoResponse}
                                          onChange={(e) => {
                                            const updatedIntervals = campaignData.advancedScheduling.intervals.map(int => 
                                              int.id === interval.id ? { 
                                                ...int, 
                                                conditions: { ...int.conditions, sendIfNoResponse: e.target.checked }
                                              } : int
                                            );
                                            setCampaignData(prev => ({
                                              ...prev,
                                              advancedScheduling: {
                                                ...prev.advancedScheduling,
                                                intervals: updatedIntervals
                                              }
                                            }));
                                          }}
                                        />
                                      }
                                      label="Send if no response to previous message"
                                    />
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={interval.conditions.sendIfNoAction}
                                          onChange={(e) => {
                                            const updatedIntervals = campaignData.advancedScheduling.intervals.map(int => 
                                              int.id === interval.id ? { 
                                                ...int, 
                                                conditions: { ...int.conditions, sendIfNoAction: e.target.checked }
                                              } : int
                                            );
                                            setCampaignData(prev => ({
                                              ...prev,
                                              advancedScheduling: {
                                                ...prev.advancedScheduling,
                                                intervals: updatedIntervals
                                              }
                                            }));
                                          }}
                                        />
                                      }
                                      label="Send if no action taken (click/conversion)"
                                    />
                                  </FormGroup>
                                </Grid>
                                <Grid item xs={12}>
                                  <Button
                                    startIcon={<DeleteIcon />}
                                    color="error"
                                    size="small"
                                    onClick={() => {
                                      const updatedIntervals = campaignData.advancedScheduling.intervals.filter(int => int.id !== interval.id);
                                      setCampaignData(prev => ({
                                        ...prev,
                                        advancedScheduling: {
                                          ...prev.advancedScheduling,
                                          intervals: updatedIntervals
                                        }
                                      }));
                                    }}
                                  >
                                    Remove Interval
                                  </Button>
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        ))}
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                    <Button onClick={() => setActiveStep(2)}>
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleCampaignSubmit}
                      disabled={campaignData.advancedScheduling.intervals.length === 0 || 
                               campaignData.advancedScheduling.intervals.some(int => int.enabled && !int.template)}
                    >
                      Create Advanced Campaign
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            </Stepper>
          </DialogContent>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default Upload; 