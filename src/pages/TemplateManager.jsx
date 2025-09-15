import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, FormControl, InputLabel, Select,
  MenuItem, Tabs, Tab,
  Alert, useTheme, Fade, Grow, IconButton, Tooltip, Avatar,
  Paper, Switch,
  FormControlLabel, Autocomplete, Stepper, Step, StepLabel, StepContent
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, ContentCopy as CopyIcon,
  Preview as PreviewIcon, Save as SaveIcon, Email as EmailIcon, Sms as SmsIcon,
  WhatsApp as WhatsAppIcon, Campaign as CampaignIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon, GetApp as GetAppIcon, Verified as VerifiedIcon,
  Security as SecurityIcon, Assignment as AssignmentIcon,
  Analytics as AnalyticsIcon, FilterList as FilterIcon, Search as SearchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const TemplateManager = () => {
  const theme = useTheme();
  const [loaded, setLoaded] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  
  // Dialog states
  const [createTemplateDialog, setCreateTemplateDialog] = useState(false);
  const [editTemplateDialog, setEditTemplateDialog] = useState(false);
  const [previewDialog, setPreviewDialog] = useState(false);
  
  // Template editor states
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateStep, setTemplateStep] = useState(0);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: 'email',
    category: 'promotional',
    subject: '',
    content: '',
    variables: [],
    dltTemplateId: '',
    dltApproved: false,
    tags: [],
    status: 'draft'
  });
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Editor states
  const [editorMode, setEditorMode] = useState('visual');
  const [previewData, setPreviewData] = useState({});
  
  useEffect(() => {
    loadTemplates();
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const filterTemplates = useCallback(() => {
    let filtered = templates;

    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(template => template.type === typeFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(template => template.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(template => template.status === statusFilter);
    }

    setFilteredTemplates(filtered);
  }, [templates, searchTerm, typeFilter, categoryFilter, statusFilter]);

  useEffect(() => {
    filterTemplates();
  }, [filterTemplates]);

  const loadTemplates = () => {
    const mockTemplates = [
      {
        id: 1,
        name: 'Policy Renewal Email Template',
        type: 'email',
        category: 'renewal',
        subject: 'Your {{PolicyType}} Policy Renewal - Action Required',
        content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Dear {{CustomerName}},</h2>
          <p>Your {{PolicyType}} policy is due for renewal on {{ExpiryDate}}.</p>
          <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3>Policy Details:</h3>
            <p><strong>Policy Number:</strong> {{PolicyNumber}}</p>
            <p><strong>Premium Amount:</strong> ₹{{PremiumAmount}}</p>
            <p><strong>Coverage:</strong> {{Coverage}}</p>
          </div>
          <a href="{{RenewalLink}}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Renew Now</a>
        </div>`,
        variables: ['CustomerName', 'PolicyType', 'PolicyNumber', 'ExpiryDate', 'PremiumAmount', 'Coverage', 'RenewalLink'],
        dltTemplateId: 'DLT001234567',
        dltApproved: true,
        tags: ['renewal', 'policy', 'email'],
        status: 'active',
        lastModified: '2024-12-20',
        usage: 45,
        createdBy: 'Admin'
      },
      {
        id: 2,
        name: 'Welcome WhatsApp Template',
        type: 'whatsapp',
        category: 'welcome',
        subject: 'Welcome to {{CompanyName}}',
        content: `Hi {{CustomerName}}! 👋

Welcome to {{CompanyName}}! We're excited to have you as our valued customer.

Your policy details:
📋 Policy Number: {{PolicyNumber}}
💰 Premium: ₹{{PremiumAmount}}
📅 Start Date: {{StartDate}}

Need help? Contact us at {{SupportPhone}}

Thank you for choosing us! 🙏`,
        variables: ['CustomerName', 'CompanyName', 'PolicyNumber', 'PremiumAmount', 'StartDate', 'SupportPhone'],
        dltTemplateId: 'DLT001234568',
        dltApproved: true,
        tags: ['welcome', 'onboarding', 'whatsapp'],
        status: 'active',
        lastModified: '2024-12-18',
        usage: 23,
        createdBy: 'Marketing Team'
      }
    ];
    setTemplates(mockTemplates);
  };

  const getChannelIcon = (type) => {
    switch (type) {
      case 'email': return <EmailIcon />;
      case 'sms': return <SmsIcon />;
      case 'whatsapp': return <WhatsAppIcon />;
      default: return <CampaignIcon />;
    }
  };

  const getChannelColor = (type) => {
    switch (type) {
      case 'email': return '#1976d2';
      case 'sms': return '#388e3c';
      case 'whatsapp': return '#25d366';
      default: return theme.palette.primary.main;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  const extractVariables = (content) => {
    const regex = /\{\{([^}]+)\}\}/g;
    const variables = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }
    return variables;
  };

  const handleCreateTemplate = () => {
    setNewTemplate({
      name: '',
      type: 'email',
      category: 'promotional',
      subject: '',
      content: '',
      variables: [],
      dltTemplateId: '',
      dltApproved: false,
      tags: [],
      status: 'draft'
    });
    setTemplateStep(0);
    setCreateTemplateDialog(true);
  };

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setNewTemplate({ ...template });
    setTemplateStep(0);
    setEditTemplateDialog(true);
  };

  const handleSaveTemplate = () => {
    const variables = extractVariables(newTemplate.content);
    const template = {
      ...newTemplate,
      variables,
      id: selectedTemplate ? selectedTemplate.id : templates.length + 1,
      lastModified: new Date().toISOString().split('T')[0],
      usage: selectedTemplate ? selectedTemplate.usage : 0,
      createdBy: 'Current User'
    };

    if (selectedTemplate) {
      setTemplates(prev => prev.map(t => t.id === selectedTemplate.id ? template : t));
    } else {
      setTemplates(prev => [...prev, template]);
    }

    setCreateTemplateDialog(false);
    setEditTemplateDialog(false);
    setSelectedTemplate(null);
  };

  const handleDuplicateTemplate = (template) => {
    const duplicated = {
      ...template,
      id: templates.length + 1,
      name: `${template.name} (Copy)`,
      status: 'draft',
      usage: 0,
      lastModified: new Date().toISOString().split('T')[0],
      createdBy: 'Current User'
    };
    setTemplates(prev => [...prev, duplicated]);
  };

  const handleDeleteTemplate = (templateId) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const handlePreviewTemplate = (template) => {
    setSelectedTemplate(template);
    setPreviewData({
      CustomerName: 'Arjun Sharma',
      PolicyType: 'Health Insurance',
      PolicyNumber: 'POL123456789',
      ExpiryDate: '2025-03-15',
      PremiumAmount: '25,000',
      Coverage: '₹5,00,000',
      CompanyName: 'Intelipro Insurance',
      SupportPhone: '+91-9876543210'
    });
    setPreviewDialog(true);
  };

  const processTemplate = (content, data) => {
    let processed = content;
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      processed = processed.replace(regex, data[key]);
    });
    return processed;
  };

  const TemplateCard = ({ template }) => (
    <Grow in={loaded} timeout={300}>
      <Card sx={{ 
        mb: 2, 
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
        }
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Avatar 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    bgcolor: getChannelColor(template.type)
                  }}
                >
                  {getChannelIcon(template.type)}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="600">
                    {template.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {template.type?.toUpperCase()} • {template.category}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip 
                  label={template.status?.toUpperCase()}
                  color={getStatusColor(template.status)}
                  size="small"
                />
                {template.dltApproved && (
                  <Chip 
                    icon={<VerifiedIcon />}
                    label="DLT Approved"
                    color="success"
                    size="small"
                    variant="outlined"
                  />
                )}
                <Chip 
                  label={`Used ${template.usage} times`}
                  size="small"
                  variant="outlined"
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {template.subject || 'No subject'}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {template.tags.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" variant="outlined" />
                ))}
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Preview Template">
                <IconButton size="small" onClick={() => handlePreviewTemplate(template)}>
                  <PreviewIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Template">
                <IconButton size="small" onClick={() => handleEditTemplate(template)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Duplicate Template">
                <IconButton size="small" onClick={() => handleDuplicateTemplate(template)}>
                  <CopyIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Template">
                <IconButton size="small" color="error" onClick={() => handleDeleteTemplate(template.id)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="caption" color="text.secondary">
              Modified: {new Date(template.lastModified).toLocaleDateString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              By: {template.createdBy}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );

  const CreateTemplateDialog = () => (
    <Dialog 
      open={createTemplateDialog || editTemplateDialog} 
      onClose={() => {
        setCreateTemplateDialog(false);
        setEditTemplateDialog(false);
      }}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, minHeight: '80vh' }
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
            {selectedTemplate ? 'Edit Template' : 'Create New Template'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Step {templateStep + 1} of 3 - {['Basic Information', 'Content Editor', 'Review & Save'][templateStep]}
          </Typography>
        </Box>
        <IconButton 
          onClick={() => {
            setCreateTemplateDialog(false);
            setEditTemplateDialog(false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ minHeight: '500px' }}>
        <Stepper activeStep={templateStep} orientation="vertical">
          {/* Step 1: Basic Information */}
          <Step>
            <StepLabel>Template Information</StepLabel>
            <StepContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Template Name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter template name"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Channel Type</InputLabel>
                    <Select
                      value={newTemplate.type}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, type: e.target.value }))}
                    >
                      <MenuItem value="email">Email</MenuItem>
                      <MenuItem value="sms">SMS</MenuItem>
                      <MenuItem value="whatsapp">WhatsApp</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={newTemplate.category}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
                    >
                      <MenuItem value="promotional">Promotional</MenuItem>
                      <MenuItem value="transactional">Transactional</MenuItem>
                      <MenuItem value="renewal">Renewal</MenuItem>
                      <MenuItem value="welcome">Welcome</MenuItem>
                      <MenuItem value="payment">Payment</MenuItem>
                      <MenuItem value="claims">Claims</MenuItem>
                      <MenuItem value="reminder">Reminder</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="DLT Template ID"
                    value={newTemplate.dltTemplateId}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, dltTemplateId: e.target.value }))}
                    placeholder="Enter DLT template ID"
                    helperText="Required for SMS and WhatsApp templates"
                  />
                </Grid>
                {newTemplate.type === 'email' && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject Line"
                      value={newTemplate.subject}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Enter email subject"
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={['renewal', 'promotional', 'urgent', 'welcome', 'payment', 'claims']}
                    value={newTemplate.tags}
                    onChange={(e, value) => setNewTemplate(prev => ({ ...prev, tags: value }))}
                    renderInput={(params) => (
                      <TextField {...params} label="Tags" placeholder="Add tags" />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                      ))
                    }
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={() => setTemplateStep(1)}
                  disabled={!newTemplate.name || !newTemplate.type}
                >
                  Continue to Content Editor
                </Button>
              </Box>
            </StepContent>
          </Step>

          {/* Step 2: Content Editor */}
          <Step>
            <StepLabel>Content Editor</StepLabel>
            <StepContent>
              <Box sx={{ mb: 2 }}>
                <Tabs value={editorMode} onChange={(e, value) => setEditorMode(value)}>
                  <Tab label="Visual Editor" value="visual" />
                  <Tab label="Code Editor" value="code" />
                </Tabs>
              </Box>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                Use double curly braces for variables: {`{{VariableName}}`}
              </Alert>
              
              <TextField
                fullWidth
                multiline
                rows={15}
                label="Template Content"
                value={newTemplate.content}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                placeholder={
                  newTemplate.type === 'email' 
                    ? 'Enter your email template content with HTML...'
                    : 'Enter your message template content...'
                }
              />
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Detected Variables:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {extractVariables(newTemplate.content).map((variable, index) => (
                    <Chip key={index} label={variable} size="small" color="primary" variant="outlined" />
                  ))}
                </Box>
              </Box>
              
              <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                <Button onClick={() => setTemplateStep(0)}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setTemplateStep(2)}
                  disabled={!newTemplate.content}
                >
                  Continue to Review
                </Button>
              </Box>
            </StepContent>
          </Step>

          {/* Step 3: Review & Save */}
          <Step>
            <StepLabel>Review & Save</StepLabel>
            <StepContent>
              <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
                <Typography variant="h6" gutterBottom>Template Summary</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Name:</Typography>
                    <Typography variant="body1">{newTemplate.name}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Type:</Typography>
                    <Typography variant="body1">{newTemplate.type?.toUpperCase()}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Category:</Typography>
                    <Typography variant="body1">{newTemplate.category}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Variables:</Typography>
                    <Typography variant="body1">{extractVariables(newTemplate.content).length}</Typography>
                  </Grid>
                </Grid>
              </Paper>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={newTemplate.dltApproved}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, dltApproved: e.target.checked }))}
                  />
                }
                label="Mark as DLT Approved"
              />
              
              <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                <Button onClick={() => setTemplateStep(1)}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSaveTemplate}
                  startIcon={<SaveIcon />}
                >
                  Save Template
                </Button>
              </Box>
            </StepContent>
          </Step>
        </Stepper>
      </DialogContent>
    </Dialog>
  );

  const PreviewDialog = () => (
    <Dialog 
      open={previewDialog} 
      onClose={() => setPreviewDialog(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Template Preview</DialogTitle>
      <DialogContent>
        {selectedTemplate && (
          <Box>
            <Typography variant="h6" gutterBottom>
              {selectedTemplate.name}
            </Typography>
            {selectedTemplate.type === 'email' && selectedTemplate.subject && (
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Subject: {processTemplate(selectedTemplate.subject, previewData)}
              </Typography>
            )}
            <Paper sx={{ p: 2, mt: 2, bgcolor: 'background.default' }}>
              {selectedTemplate.type === 'email' ? (
                <div dangerouslySetInnerHTML={{ 
                  __html: processTemplate(selectedTemplate.content, previewData) 
                }} 
                style={{ 
                  maxWidth: '100%', 
                  wordWrap: 'break-word',
                  /* Add basic security styling */
                  '& script': { display: 'none' },
                  '& iframe': { display: 'none' }
                }} />
              ) : (
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {processTemplate(selectedTemplate.content, previewData)}
                </Typography>
              )}
            </Paper>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setPreviewDialog(false)}>Close</Button>
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
              Template Manager
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create and manage templates for email, SMS, and WhatsApp campaigns
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              startIcon={<CloudUploadIcon />}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Import Templates
            </Button>
            <Button
              startIcon={<GetAppIcon />}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Export Templates
            </Button>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={handleCreateTemplate}
              sx={{ borderRadius: 2 }}
            >
              Create Template
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="600" color="primary">
                      {templates.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Templates
                    </Typography>
                  </Box>
                  <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="600" color="success.main">
                      {templates.filter(t => t.status === 'active').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Templates
                    </Typography>
                  </Box>
                  <VerifiedIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="600" color="info.main">
                      {templates.filter(t => t.dltApproved).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      DLT Approved
                    </Typography>
                  </Box>
                  <SecurityIcon sx={{ fontSize: 40, color: 'info.main', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="600" color="warning.main">
                      {templates.reduce((sum, t) => sum + t.usage, 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Usage
                    </Typography>
                  </Box>
                  <AnalyticsIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="sms">SMS</MenuItem>
                  <MenuItem value="whatsapp">WhatsApp</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="promotional">Promotional</MenuItem>
                  <MenuItem value="transactional">Transactional</MenuItem>
                  <MenuItem value="renewal">Renewal</MenuItem>
                  <MenuItem value="welcome">Welcome</MenuItem>
                  <MenuItem value="payment">Payment</MenuItem>
                  <MenuItem value="claims">Claims</MenuItem>
                </Select>
              </FormControl>
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
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="archived">Archived</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  startIcon={<FilterIcon />}
                  variant="outlined"
                >
                  Advanced
                </Button>
                <Button
                  startIcon={<RefreshIcon />}
                  variant="outlined"
                  onClick={loadTemplates}
                >
                  Refresh
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Templates List */}
        <Box>
          {filteredTemplates.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
              <AssignmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No templates found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm || typeFilter !== 'all' || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters or search terms'
                  : 'Create your first template to get started'
                }
              </Typography>
              {!searchTerm && typeFilter === 'all' && categoryFilter === 'all' && statusFilter === 'all' && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateTemplate}
                >
                  Create Your First Template
                </Button>
              )}
            </Paper>
          ) : (
            filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))
          )}
        </Box>

        {/* Dialogs */}
        <CreateTemplateDialog />
        <PreviewDialog />
      </Box>
    </Fade>
  );
};

export default TemplateManager; 