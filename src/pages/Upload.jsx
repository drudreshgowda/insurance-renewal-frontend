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
  AccordionSummary, AccordionDetails, FormGroup, Checkbox,
  CircularProgress
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
} from '@mui/icons-material';
import { UploadApI } from '../api/Upload';
import { Snackbar } from '@mui/material';

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
    fetchProviders();
    fetchTargetAudienceTypes();
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
  

  const fetchTemplates = async () => {
    try {
      const result = await UploadApI.GetTemplates();
      if (result.success && result.data) {
        // Handle different response structures
        let templatesData = result.data;
        
        // If data is nested in results or data property
        if (result.data.results && Array.isArray(result.data.results)) {
          templatesData = result.data.results;
        } else if (result.data.data && Array.isArray(result.data.data)) {
          templatesData = result.data.data;
        } else if (!Array.isArray(result.data)) {
          // If data is not an array, keep fallback templates
          return;
        }
        
        // Ensure we have an array to work with
        if (Array.isArray(templatesData)) {
          // Transform API data to match UI expectations
          const transformedTemplates = {
            email: templatesData.filter(t => {
              const type = t.template_type || t.type || t.channel;
              return type === 'email' || type === 1 || type === 'Email';
            }).map(t => ({
              id: t.id,
              template_name: t.template_name || t.name || t.title,
              name: t.template_name || t.name || t.title,
              subject: t.subject || t.email_subject,
              template_content: t.template_content || t.content || t.body,
              content: t.template_content || t.content || t.body,
              template_type: t.template_type || t.type || t.channel
            })),
            whatsapp: templatesData.filter(t => {
              const type = t.template_type || t.type || t.channel;
              return type === 'whatsapp' || type === 2 || type === 'WhatsApp';
            }).map(t => ({
              id: t.id,
              template_name: t.template_name || t.name || t.title,
              name: t.template_name || t.name || t.title,
              content: t.template_content || t.content || t.body,
              template_type: t.template_type || t.type || t.channel
            })),
            sms: templatesData.filter(t => {
              const type = t.template_type || t.type || t.channel;
              return type === 'sms' || type === 3 || type === 'SMS';
            }).map(t => ({
              id: t.id,
              template_name: t.template_name || t.name || t.title,
              name: t.template_name || t.name || t.title,
              content: t.template_content || t.content || t.body,
              template_type: t.template_type || t.type || t.channel
            })),
            call: templatesData.filter(t => {
              const type = t.template_type || t.type || t.channel;
              return type === 'call' || type === 4 || type === 'Call';
            }).map(t => ({
              id: t.id,
              template_name: t.template_name || t.name || t.title,
              name: t.template_name || t.name || t.title,
              content: t.template_content || t.content || t.body,
              script: t.template_content || t.content || t.body,
              template_type: t.template_type || t.type || t.channel
            }))
          };
          
          // Check if any templates were found
          const totalTemplates = Object.values(transformedTemplates).reduce((sum, arr) => sum + arr.length, 0);
          if (totalTemplates > 0) {
            setTemplates(transformedTemplates);
          }
        }
      }
    } catch (error) {
      // Keep fallback data if API fails
    }
  };

  const fetchActiveCampaigns = async () => {
    setCampaignsLoading(true);
    try {
      console.log('Fetching active campaigns...');
      const result = await UploadApI.ActiveCampaigns();
      console.log('ActiveCampaigns API result:', result);
      
      if (result.success && result.data) {
        console.log('API call successful, processing data:', result.data);
        
        // Handle different response structures
        let campaignsData = result.data;
        
        // If data is nested in results or data property
        if (result.data.results && Array.isArray(result.data.results)) {
          campaignsData = result.data.results;
          console.log('Using nested results data:', campaignsData);
        } else if (result.data.data && Array.isArray(result.data.data)) {
          campaignsData = result.data.data;
          console.log('Using nested data.data:', campaignsData);
        } else if (Array.isArray(result.data)) {
          campaignsData = result.data;
          console.log('Using direct array data:', campaignsData);
        } else {
          console.log('Data is not an array, structure:', typeof result.data, result.data);
          // Try to extract campaigns from the response object
          if (result.data.campaigns && Array.isArray(result.data.campaigns)) {
            campaignsData = result.data.campaigns;
            console.log('Using campaigns property:', campaignsData);
          } else if (result.data.list && Array.isArray(result.data.list)) {
            campaignsData = result.data.list;
            console.log('Using list property:', campaignsData);
          } else {
            console.log('No valid campaign data found in response');
            setActiveCampaigns([]);
            return;
          }
        }
        
        // Ensure we have an array to work with
        if (Array.isArray(campaignsData)) {
          console.log('Processing campaigns array with', campaignsData.length, 'items');
          
          // Transform API data to match UI expectations
          const transformedCampaigns = campaignsData.map(campaign => {
            console.log('Transforming campaign:', campaign);
            console.log('Campaign date fields:', {
              created_at: campaign.created_at,
              createdAt: campaign.createdAt,
              date_created: campaign.date_created,
              created_date: campaign.created_date
            });
            return {
              id: campaign.id || campaign.campaign_id || campaign.pk,
              name: campaign.campaign_name || campaign.name || campaign.title,
              type: campaign.campaign_type || campaign.type || campaign.channel || 'email',
              status: campaign.status || campaign.state || 'active',
              uploadId: campaign.file_upload_id || campaign.upload_id || campaign.file_id,
              uploadFilename: campaign.upload_filename || campaign.filename || campaign.file_name,
              targetCount: campaign.target_count || campaign.targetCount || campaign.total_records || 0,
              sent: campaign.sent_count || campaign.sent || campaign.sent_messages || 0,
              opened: campaign.opened_count || campaign.opened || campaign.opened_messages || 0,
              clicked: campaign.clicked_count || campaign.clicked || campaign.clicked_messages || 0,
              converted: campaign.converted_count || campaign.converted || campaign.conversions || 0,
              delivered: campaign.delivered_count || campaign.delivered || campaign.delivered_messages || 0,
              read: campaign.read_count || campaign.read || campaign.read_messages || 0,
              replied: campaign.replied_count || campaign.replied || campaign.replies || 0,
              createdAt: campaign.created_at || campaign.createdAt || campaign.date_created || campaign.created_date,
              scheduledAt: campaign.scheduled_at || campaign.scheduledAt || campaign.date_scheduled || campaign.scheduled_date
            };
          });
          
          console.log('Transformed campaigns:', transformedCampaigns);
          setActiveCampaigns(transformedCampaigns);
        } else {
          console.log('Campaigns data is not an array:', typeof campaignsData, campaignsData);
          setActiveCampaigns([]);
        }
      } else {
        console.error('Failed to fetch active campaigns:', result.message || 'Unknown error');
        setActiveCampaigns([]);
      }
    } catch (error) {
      console.error('Error fetching active campaigns:', error);
      setActiveCampaigns([]);
    } finally {
      setCampaignsLoading(false);
    }
  };

  const fetchProviders = async () => {
    setProvidersLoading(true);
    try {
      const result = await UploadApI.GetProviders();
      
      if (result.success && result.data) {
        // Handle different response structures
        let providersData = result.data;
        
        // If data is nested in results property
        if (result.data.results && Array.isArray(result.data.results)) {
          providersData = result.data.results;
        } else if (Array.isArray(result.data)) {
          providersData = result.data;
        } else {
          setProviders([]);
          return;
        }
        
        // Ensure we have an array to work with
        if (Array.isArray(providersData)) {
          // Transform API data to match UI expectations
          const transformedProviders = providersData.map(provider => ({
            id: provider.id,
            name: provider.name,
            provider_type: provider.provider_type,
            provider_type_display: provider.provider_type_display,
            is_active: provider.is_active,
            is_default: provider.is_default,
            priority: provider.priority,
            priority_display: provider.priority_display,
            health_status: provider.health_status,
            health_status_display: provider.health_status_display,
            daily_limit: provider.daily_limit,
            monthly_limit: provider.monthly_limit,
            emails_sent_today: provider.emails_sent_today,
            emails_sent_this_month: provider.emails_sent_this_month,
            from_email: provider.from_email,
            from_name: provider.from_name
          }));
          
          setProviders(transformedProviders);
        } else {
          setProviders([]);
        }
      } else {
        console.error('Failed to fetch providers:', result.message || 'Unknown error');
        setProviders([]);
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
      setProviders([]);
    } finally {
      setProvidersLoading(false);
    }
  };

  const fetchTargetAudienceTypes = async () => {
    setTargetAudienceLoading(true);
    try {
      const result = await UploadApI.GetTargetAudienceTypes();
      
      if (result.success && result.data) {
        // Handle different response structures
        let audienceData = result.data;
        
        // If data is nested in results property
        if (result.data.results && Array.isArray(result.data.results)) {
          audienceData = result.data.results;
        } else if (Array.isArray(result.data)) {
          audienceData = result.data;
        } else {
          setTargetAudienceTypes([]);
          return;
        }
        
        // Ensure we have an array to work with
        if (Array.isArray(audienceData)) {
          // Transform API data to match UI expectations
          const transformedAudienceTypes = audienceData.map(audience => {
            console.log('Raw audience data from API:', audience);
            const transformed = {
              id: audience.id,
              name: audience.name || audience.type_name || audience.display_name,
              value: audience.value || audience.type_value || audience.code || audience.id,
              description: audience.description || audience.type_description,
              is_active: audience.is_active !== false // Default to true if not specified
            };
            console.log('Transformed audience data:', transformed);
            return transformed;
          });
          
          setTargetAudienceTypes(transformedAudienceTypes);
        } else {
          // Fallback: use common target audience types if API data is not in expected format
          console.log('API data not in expected format, using fallback target audience types');
          setTargetAudienceTypes([
            { id: 1, name: 'All Customers', value: 'all', description: 'All customers in the database' },
            { id: 2, name: 'Pending Renewals', value: 'pending', description: 'Customers with pending renewals' },
            { id: 3, name: 'Expired Policies', value: 'expired', description: 'Customers with expired policies' }
          ]);
        }
      } else {
        console.error('Failed to fetch target audience types:', result.message || 'Unknown error');
        // Fallback: use common target audience types if API fails
        setTargetAudienceTypes([
          { id: 1, name: 'All Customers', value: 'all', description: 'All customers in the database' },
          { id: 2, name: 'Pending Renewals', value: 'pending', description: 'Customers with pending renewals' },
          { id: 3, name: 'Expired Policies', value: 'expired', description: 'Customers with expired policies' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching target audience types:', error);
      // Fallback: use common target audience types if API fails
      setTargetAudienceTypes([
        { id: 1, name: 'All Customers', value: 'all', description: 'All customers in the database' },
        { id: 2, name: 'Pending Renewals', value: 'pending', description: 'Customers with pending renewals' },
        { id: 3, name: 'Expired Policies', value: 'expired', description: 'Customers with expired policies' }
      ]);
    } finally {
      setTargetAudienceLoading(false);
    }
  };
  
  
  
  
  


  
  // Dynamic templates with fallback
  const [templates, setTemplates] = useState({
    email: [
      { id: 'email-1', name: 'Renewal Reminder', subject: 'Policy Renewal Due', content: 'Your policy is due for renewal...' },
      { id: 'email-2', name: 'Payment Link', subject: 'Secure Payment Link', content: 'Click here to make payment...' }
    ],
    whatsapp: [
      { id: 'whatsapp-1', name: 'Renewal Notice', content: '🔔 Your policy renewal is due...' },
      { id: 'whatsapp-2', name: 'Payment Reminder', content: '💳 Payment link for your policy...' }
    ],
    sms: [
      { id: 'sms-1', name: 'Renewal Alert', content: 'RENEWAL: Your policy expires soon...' },
      { id: 'sms-2', name: 'Payment Link', content: 'PAYMENT: Secure link for renewal...' }
    ],
    call: [
      { id: 'call-1', name: 'Renewal Call Script', content: 'Hello, this is regarding your policy renewal...' }
    ]
  });
  
  // Active campaigns - dynamic data from API
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [campaignsLoading, setCampaignsLoading] = useState(false);

  // Communication providers - dynamic data from API
  const [providers, setProviders] = useState([]);
  const [providersLoading, setProvidersLoading] = useState(false);

  // Target audience types - dynamic data from API
  const [targetAudienceTypes, setTargetAudienceTypes] = useState([]);
  const [targetAudienceLoading, setTargetAudienceLoading] = useState(false);

  const [uploadHistory, setUploadHistory] = useState([
    {
      id: 'upload-001',
      filename: 'health_renewal_q1.xlsx',
      uploadDate: '2024-01-15T10:30:00Z',
      recordCount: 1250,
      status: 'completed',
      campaigns: ['CAMP-001']
    },
    {
      id: 'upload-002',
      filename: 'life_insurance_leads.xlsx',
      uploadDate: '2024-01-14T14:20:00Z',
      recordCount: 850,
      status: 'completed',
      campaigns: ['CAMP-002']
    },
    {
      id: 'upload-003',
      filename: 'motor_insurance_data.xlsx',
      uploadDate: '2024-01-13T09:15:00Z',
      recordCount: 2100,
      status: 'completed',
      campaigns: ['CAMP-003']
    }
  ]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
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
      
      const channelTemplates = getTemplatesForChannel(primaryChannel);
      
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
      
      if (isNaN(templateId) || templateId <= 0) {
        
        setSnackbar({
          open: true,
          message: `Invalid template ID (${selectedTemplateId}). Please select a different template or refresh the templates.`,
          severity: "error"
        });
        return;
      }

      // Target audience is now sent as string directly to match API expectations

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

      console.log('Selected target audience:', campaignData.targetAudience);
      console.log('Available target audience types:', targetAudienceTypes);
      
      // Find the selected audience type to verify we have the correct value
      const selectedAudience = targetAudienceTypes.find(audience => audience.value === campaignData.targetAudience);
      console.log('Selected audience object:', selectedAudience);
      
      const campaignPayload = {
        file_upload_id: selectedUpload.id,
        campaign_name: campaignData.name,
        campaign_type_id: campaignTypeMap[primaryChannel] || 1,
        template_id: templateId,  
        target_audience_type: selectedAudience ? selectedAudience.value : campaignData.targetAudience,
        communication_provider_id: parseInt(campaignData.providers[primaryChannel]) || (() => {
          // Fallback: get the first available provider for the channel
          const availableProviders = providers.filter(p => 
            p.is_active && 
            (p.provider_type === primaryChannel || 
             (primaryChannel === 'email' && (p.provider_type === 'sendgrid' || p.provider_type === 'mailgun' || p.provider_type === 'aws_ses')))
          );
          return availableProviders.length > 0 ? availableProviders[0].id : 1;
        })(),
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
      
      console.log('Campaign payload being sent:', campaignPayload);

      
      // Validate required fields
      if (!campaignPayload.communication_provider_id || campaignPayload.communication_provider_id <= 0) {
        setSnackbar({
          open: true,
          message: "Please select a communication provider from the dropdown.",
          severity: "error"
        });
        return;
      }
      
      // Validate that the selected provider exists in the API data
      const validProvider = providers.find(provider => provider.id === campaignPayload.communication_provider_id);
      if (!validProvider) {
        setSnackbar({
          open: true,
          message: "Selected communication provider is not valid. Please refresh and try again.",
          severity: "error"
        });
        return;
      }
      
      if (!campaignPayload.target_audience_type) {
        setSnackbar({
          open: true,
          message: "Please select a target audience type from the dropdown.",
          severity: "error"
        });
        return;
      }
      
      // Validate that the selected target audience type exists in the API data
      const validAudienceType = targetAudienceTypes.find(audience => audience.value === campaignPayload.target_audience_type);
      if (!validAudienceType) {
        setSnackbar({
          open: true,
          message: "Selected target audience type is not valid. Please refresh and try again.",
          severity: "error"
        });
        return;
      }
  
      const result = await UploadApI.Createcampaigns(campaignPayload);
  
      if (result.success) {
        setSnackbar({
          open: true,
          message: result.data.message || "Campaign created successfully!",
          severity: "success"
        });
        
        // Close dialog first
        setCampaignDialog(false);
        
        // Refresh active campaigns list
        await fetchActiveCampaigns();
        
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
        setSnackbar({
          open: true,
          message: result.message || "Failed to create campaign.",
          severity: "error"
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "An unexpected error occurred!",
        severity: "error"
      });
    }
  };
  
  

  const handleCampaignAction = async (_campaignId, _action) => {
    // Mock action - in a real implementation, you would call an API to update the campaign status
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
                                      {new Date(upload.created_at).toLocaleDateString()}
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
                    {campaignsLoading ? (
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: '100%',
                        textAlign: 'center'
                      }}>
                        <LinearProgress sx={{ width: '100%', mb: 2 }} />
                        <Typography variant="body2" color="text.secondary">
                          Loading active campaigns...
                        </Typography>
                      </Box>
                    ) : activeCampaigns.length === 0 ? (
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
                                        Created: {(() => {
                                          try {
                                            console.log('Displaying date for campaign:', campaign.id, 'createdAt value:', campaign.createdAt);
                                            if (!campaign.createdAt) return 'N/A';
                                            
                                            // Try different date parsing approaches
                                            let date;
                                            if (typeof campaign.createdAt === 'string') {
                                              // Handle different date string formats
                                              if (campaign.createdAt.includes('T')) {
                                                // ISO format
                                                date = new Date(campaign.createdAt);
                                              } else if (campaign.createdAt.includes('-')) {
                                                // Date format YYYY-MM-DD
                                                date = new Date(campaign.createdAt + 'T00:00:00');
                                              } else if (campaign.createdAt.includes('/')) {
                                                // Handle DD/MM/YYYY HH:MM:SS format
                                                const datePart = campaign.createdAt.split(' ')[0]; // Get just the date part
                                                const [day, month, year] = datePart.split('/');
                                                date = new Date(year, month - 1, day); // month is 0-indexed
                                              } else {
                                                // Try direct parsing
                                                date = new Date(campaign.createdAt);
                                              }
                                            } else {
                                              date = new Date(campaign.createdAt);
                                            }
                                            
                                            if (isNaN(date.getTime())) {
                                              console.log('Invalid date parsed:', campaign.createdAt);
                                              // Try to extract just the date part if it's in DD/MM/YYYY HH:MM:SS format
                                              if (typeof campaign.createdAt === 'string' && campaign.createdAt.includes('/') && campaign.createdAt.includes(' ')) {
                                                const datePart = campaign.createdAt.split(' ')[0];
                                                const [day, month, year] = datePart.split('/');
                                                const fallbackDate = new Date(year, month - 1, day);
                                                if (!isNaN(fallbackDate.getTime())) {
                                                  return fallbackDate.toLocaleDateString();
                                                }
                                              }
                                              return 'Invalid Date';
                                            }
                                            
                                            console.log('Successfully parsed date:', date.toLocaleDateString());
                                            return date.toLocaleDateString();
                                          } catch (error) {
                                            console.log('Date parsing error:', error, 'for value:', campaign.createdAt);
                                            // Try to extract just the date part if it's in DD/MM/YYYY HH:MM:SS format
                                            if (typeof campaign.createdAt === 'string' && campaign.createdAt.includes('/') && campaign.createdAt.includes(' ')) {
                                              const datePart = campaign.createdAt.split(' ')[0];
                                              const [day, month, year] = datePart.split('/');
                                              const fallbackDate = new Date(year, month - 1, day);
                                              if (!isNaN(fallbackDate.getTime())) {
                                                return fallbackDate.toLocaleDateString();
                                              }
                                            }
                                            return 'Invalid Date';
                                          }
                                        })()}
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
                          disabled={targetAudienceLoading}
                        >
                          {targetAudienceLoading ? (
                            <MenuItem disabled>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircularProgress size={16} />
                                Loading target audience types...
                              </Box>
                            </MenuItem>
                          ) : (
                            targetAudienceTypes.map((audience) => (
                              <MenuItem key={audience.id} value={audience.value}>
                                <Box sx={{ width: '100%' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {audience.name}
                                  </Typography>
                                  {audience.description && (
                                    <Typography variant="caption" color="text.secondary">
                                      {audience.description}
                                    </Typography>
                                  )}
                                </Box>
                              </MenuItem>
                            ))
                          )}
                          {!targetAudienceLoading && targetAudienceTypes.length === 0 && (
                            <MenuItem disabled>
                              No target audience types available
                            </MenuItem>
                          )}
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
                          // Filter providers by channel type and active status
                          // For email channel, show all email providers (sendgrid, mailgun, aws_ses)
                          // For other channels, show providers that match the channel type
                          let availableProviders = providers.filter(p => {
                            if (!p.is_active) return false;
                            
                            // For email channel, show all email providers
                            if (channel === 'email') {
                              return p.provider_type === 'sendgrid' || 
                                     p.provider_type === 'mailgun' || 
                                     p.provider_type === 'aws_ses' ||
                                     p.provider_type === 'email';
                            }
                            
                            // For other channels, match the provider type
                            return p.provider_type === channel;
                          });
                          
                          // If no providers found for the channel, show all active providers as fallback
                          if (availableProviders.length === 0) {
                            availableProviders = providers.filter(p => p.is_active);
                          }
                          
                          
                          const defaultProvider = availableProviders.find(p => p.is_default) || availableProviders[0];
                          
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
                                  disabled={availableProviders.length === 0 || providersLoading}
                                >
                                  {providersLoading ? (
                                    <MenuItem disabled>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CircularProgress size={16} />
                                        Loading providers...
                                      </Box>
                                    </MenuItem>
                                  ) : (
                                    availableProviders.map((provider) => (
                                      <MenuItem key={provider.id} value={provider.id}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                          <Box sx={{ 
                                            width: 8, 
                                            height: 8, 
                                            borderRadius: '50%', 
                                            bgcolor: provider.health_status === 'healthy' ? 'success.main' : 
                                                     provider.health_status === 'unhealthy' ? 'error.main' : 'warning.main'
                                          }} />
                                          <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                              {provider.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                              {provider.provider_type_display} • {provider.from_email}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                              Daily: {provider.emails_sent_today}/{provider.daily_limit} • Monthly: {provider.emails_sent_this_month}/{provider.monthly_limit}
                                            </Typography>
                                          </Box>
                                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                            {provider.is_default && (
                                              <Chip label="Default" size="small" color="primary" />
                                            )}
                                            {provider.priority_display && (
                                              <Chip label={provider.priority_display} size="small" variant="outlined" />
                                            )}
                                            {!provider.is_active && (
                                              <Chip label="Inactive" size="small" color="error" />
                                            )}
                                          </Box>
                                        </Box>
                                      </MenuItem>
                                    ))
                                  )}
                                  {!providersLoading && availableProviders.length === 0 && (
                                    <MenuItem disabled>
                                      No active {channel} providers configured
                                    </MenuItem>
                                  )}
                                </Select>
                              </FormControl>
                              {!providersLoading && availableProviders.length === 0 && (
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

                     </Box>
                     <Box sx={{ display: 'flex', gap: 1 }}>



                     </Box>
                   </Box>
                   
                   
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
                             setCampaignData(prev => ({ 
                               ...prev, 
                               template: { ...prev.template, [type]: e.target.value }
                             }));
                           }}
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
                           {getTemplatesForChannel(type)?.length === 0 && (
                             <MenuItem disabled>
                               <Typography variant="body2" color="text.secondary">
                                 No templates available for {type}
                               </Typography>
                             </MenuItem>
                           )}
                           {getTemplatesForChannel(type)?.length > 0 && !campaignData.template[type] && (
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