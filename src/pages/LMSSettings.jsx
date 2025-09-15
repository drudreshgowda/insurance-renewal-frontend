import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Tabs, Tab,
  Switch, FormControlLabel, TextField, Button, Divider,
  Select, MenuItem, FormControl, InputLabel, Alert,
  List, ListItem, ListItemText, ListItemSecondaryAction,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, useTheme, alpha, Fade, Grow
} from '@mui/material';
import {
  Settings as SettingsIcon,
  WhatsApp as WhatsAppIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Phone as PhoneIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Key as KeyIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Schedule as ScheduleIcon,
  Message as MessageIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

const LMSSettings = () => {
  const theme = useTheme();
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [templateDialog, setTemplateDialog] = useState({ open: false, mode: 'create', data: {} });
  
  // Settings State
  const [settings, setSettings] = useState({
    // Communication Settings
    whatsappApiKey: 'wa_api_key_123456789',
    smsGateway: 'twilio',
    emailServer: 'smtp.gmail.com',
    emailPort: '587',
    emailUsername: 'admin@company.com',
    emailPassword: '••••••••',
    
    // Auto-assignment Settings
    autoAssignBySpecialization: true,
    balanceWorkload: true,
    considerPerformance: false,
    maxLeadsPerAgent: 50,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    whatsappNotifications: true,
    followUpReminders: true,
    
    // Business Hours
    workingHours: {
      start: '09:00',
      end: '18:00',
      timezone: 'Asia/Kolkata',
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    },
    
    // Lead Scoring
    leadScoringEnabled: true,
    scoringCriteria: {
      sourceWeight: 20,
      engagementWeight: 30,
      budgetWeight: 25,
      timelineWeight: 25
    }
  });
  
  // Message Templates
  const [messageTemplates, setMessageTemplates] = useState([
    {
      id: 1,
      name: 'Welcome Message',
      type: 'whatsapp',
      subject: 'Welcome to Our Services',
      content: 'Hi {name}, welcome to our insurance services! We\'re excited to help you find the perfect policy.',
      variables: ['name'],
      active: true
    },
    {
      id: 2,
      name: 'Follow-up Reminder',
      type: 'email',
      subject: 'Following up on your insurance inquiry',
      content: 'Dear {name}, I wanted to follow up on your interest in {policyType}. Do you have any questions?',
      variables: ['name', 'policyType'],
      active: true
    },
    {
      id: 3,
      name: 'Policy Information',
      type: 'sms',
      subject: '',
      content: 'Hi {name}, here are the details for your {policyType} policy. Premium: ₹{premium}/year.',
      variables: ['name', 'policyType', 'premium'],
      active: true
    }
  ]);
  
  // Integration Settings
  const [integrations, setIntegrations] = useState([
    {
      name: 'WhatsApp Business API',
      status: 'connected',
      lastSync: '2025-01-15T10:30:00Z',
      config: { apiKey: 'wa_***', webhookUrl: 'https://api.company.com/webhook/whatsapp' }
    },
    {
      name: 'Twilio SMS',
      status: 'connected',
      lastSync: '2025-01-15T09:15:00Z',
      config: { accountSid: 'AC***', authToken: '***' }
    },
    {
      name: 'Email Server',
      status: 'connected',
      lastSync: '2025-01-15T08:45:00Z',
      config: { server: 'smtp.gmail.com', port: 587 }
    },
    {
      name: 'CRM Integration',
      status: 'disconnected',
      lastSync: null,
      config: {}
    }
  ]);

  React.useEffect(() => {
    setLoaded(true);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNestedSettingChange = (parent, key, value) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [key]: value
      }
    }));
  };

  const handleTemplateCreate = () => {
    setTemplateDialog({
      open: true,
      mode: 'create',
      data: {
        name: '',
        type: 'email',
        subject: '',
        content: '',
        variables: [],
        active: true
      }
    });
  };

  const handleTemplateEdit = (template) => {
    setTemplateDialog({
      open: true,
      mode: 'edit',
      data: { ...template }
    });
  };

  const handleTemplateSave = () => {
    if (templateDialog.mode === 'create') {
      const newTemplate = {
        ...templateDialog.data,
        id: messageTemplates.length + 1
      };
      setMessageTemplates(prev => [...prev, newTemplate]);
    } else {
      setMessageTemplates(prev => prev.map(template => 
        template.id === templateDialog.data.id ? templateDialog.data : template
      ));
    }
    setTemplateDialog({ open: false, mode: 'create', data: {} });
  };

  const handleTemplateDelete = (templateId) => {
    setMessageTemplates(prev => prev.filter(template => template.id !== templateId));
  };

  const getIntegrationStatusColor = (status) => {
    return status === 'connected' ? 'success' : 'error';
  };

  const getTemplateTypeIcon = (type) => {
    switch (type) {
      case 'email': return <EmailIcon />;
      case 'sms': return <SmsIcon />;
      case 'whatsapp': return <WhatsAppIcon />;
      default: return <MessageIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Fade in={loaded} timeout={800}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="700" gutterBottom>
            LMS Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure your Lead Management System settings and integrations
          </Typography>
        </Box>
      </Fade>

      <Grow in={loaded} timeout={1000}>
        <Card 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
            overflow: 'visible'
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                aria-label="lms settings tabs"
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 160,
                    px: 3
                  }
                }}
              >
                <Tab icon={<SettingsIcon />} label="General" />
                <Tab icon={<MessageIcon />} label="Templates" />
                <Tab icon={<BusinessIcon />} label="Integrations" />
                <Tab icon={<NotificationsIcon />} label="Notifications" />
                <Tab icon={<SecurityIcon />} label="Security" />
              </Tabs>
            </Box>

            {activeTab === 0 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  General Settings
                </Typography>
                
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Auto-Assignment Rules</Typography>
                        
                        <Box sx={{ mb: 3 }}>
                          <FormControlLabel
                            control={
                              <Switch 
                                checked={settings.autoAssignBySpecialization}
                                onChange={(e) => handleSettingChange('autoAssignBySpecialization', e.target.checked)}
                              />
                            }
                            label="Auto-assign by specialization"
                          />
                        </Box>
                        
                        <Box sx={{ mb: 3 }}>
                          <FormControlLabel
                            control={
                              <Switch 
                                checked={settings.balanceWorkload}
                                onChange={(e) => handleSettingChange('balanceWorkload', e.target.checked)}
                              />
                            }
                            label="Balance workload across agents"
                          />
                        </Box>
                        
                        <Box sx={{ mb: 3 }}>
                          <FormControlLabel
                            control={
                              <Switch 
                                checked={settings.considerPerformance}
                                onChange={(e) => handleSettingChange('considerPerformance', e.target.checked)}
                              />
                            }
                            label="Consider agent performance"
                          />
                        </Box>
                        
                        <TextField
                          fullWidth
                          label="Max leads per agent"
                          type="number"
                          value={settings.maxLeadsPerAgent}
                          onChange={(e) => handleSettingChange('maxLeadsPerAgent', parseInt(e.target.value))}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Business Hours</Typography>
                        
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="Start Time"
                              type="time"
                              value={settings.workingHours.start}
                              onChange={(e) => handleNestedSettingChange('workingHours', 'start', e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="End Time"
                              type="time"
                              value={settings.workingHours.end}
                              onChange={(e) => handleNestedSettingChange('workingHours', 'end', e.target.value)}
                            />
                          </Grid>
                        </Grid>
                        
                        <FormControl fullWidth sx={{ mb: 3 }}>
                          <InputLabel>Timezone</InputLabel>
                          <Select
                            value={settings.workingHours.timezone}
                            onChange={(e) => handleNestedSettingChange('workingHours', 'timezone', e.target.value)}
                            label="Timezone"
                          >
                            <MenuItem value="Asia/Kolkata">Asia/Kolkata (IST)</MenuItem>
                            <MenuItem value="America/New_York">America/New_York (EST)</MenuItem>
                            <MenuItem value="Europe/London">Europe/London (GMT)</MenuItem>
                            <MenuItem value="Asia/Tokyo">Asia/Tokyo (JST)</MenuItem>
                          </Select>
                        </FormControl>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Working Days
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                            <Chip 
                              key={day}
                              label={day}
                              color={settings.workingHours.workingDays.includes(day.toLowerCase()) ? 'primary' : 'default'}
                              onClick={() => {
                                const dayLower = day.toLowerCase();
                                const newWorkingDays = settings.workingHours.workingDays.includes(dayLower)
                                  ? settings.workingHours.workingDays.filter(d => d !== dayLower)
                                  : [...settings.workingHours.workingDays, dayLower];
                                handleNestedSettingChange('workingHours', 'workingDays', newWorkingDays);
                              }}
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Lead Scoring Configuration</Typography>
                        
                        <Box sx={{ mb: 3 }}>
                          <FormControlLabel
                            control={
                              <Switch 
                                checked={settings.leadScoringEnabled}
                                onChange={(e) => handleSettingChange('leadScoringEnabled', e.target.checked)}
                              />
                            }
                            label="Enable automatic lead scoring"
                          />
                        </Box>
                        
                        {settings.leadScoringEnabled && (
                          <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={3}>
                              <TextField
                                fullWidth
                                label="Source Weight (%)"
                                type="number"
                                value={settings.scoringCriteria.sourceWeight}
                                onChange={(e) => handleNestedSettingChange('scoringCriteria', 'sourceWeight', parseInt(e.target.value))}
                                inputProps={{ min: 0, max: 100 }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                              <TextField
                                fullWidth
                                label="Engagement Weight (%)"
                                type="number"
                                value={settings.scoringCriteria.engagementWeight}
                                onChange={(e) => handleNestedSettingChange('scoringCriteria', 'engagementWeight', parseInt(e.target.value))}
                                inputProps={{ min: 0, max: 100 }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                              <TextField
                                fullWidth
                                label="Budget Weight (%)"
                                type="number"
                                value={settings.scoringCriteria.budgetWeight}
                                onChange={(e) => handleNestedSettingChange('scoringCriteria', 'budgetWeight', parseInt(e.target.value))}
                                inputProps={{ min: 0, max: 100 }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                              <TextField
                                fullWidth
                                label="Timeline Weight (%)"
                                type="number"
                                value={settings.scoringCriteria.timelineWeight}
                                onChange={(e) => handleNestedSettingChange('scoringCriteria', 'timelineWeight', parseInt(e.target.value))}
                                inputProps={{ min: 0, max: 100 }}
                              />
                            </Grid>
                          </Grid>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button variant="outlined">
                    Reset to Defaults
                  </Button>
                  <Button variant="contained" startIcon={<SaveIcon />}>
                    Save Settings
                  </Button>
                </Box>
              </Box>
            )}

            {activeTab === 1 && (
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="600">
                    Message Templates
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleTemplateCreate}
                  >
                    Add Template
                  </Button>
                </Box>
                
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Template Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Subject</TableCell>
                        <TableCell>Variables</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {messageTemplates.map((template) => (
                        <TableRow key={template.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getTemplateTypeIcon(template.type)}
                              <Typography variant="body2" fontWeight="600" sx={{ ml: 1 }}>
                                {template.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={template.type} 
                              size="small" 
                              color={template.type === 'email' ? 'info' : 
                                     template.type === 'sms' ? 'primary' : 'success'}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {template.subject || 'No subject'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {template.variables.map((variable) => (
                                <Chip key={variable} label={`{${variable}}`} size="small" variant="outlined" />
                              ))}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={template.active ? 'Active' : 'Inactive'} 
                              size="small" 
                              color={template.active ? 'success' : 'default'}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton size="small" onClick={() => handleTemplateEdit(template)}>
                                <EditIcon />
                              </IconButton>
                              <IconButton size="small" color="error" onClick={() => handleTemplateDelete(template.id)}>
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {activeTab === 2 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Integration Settings
                </Typography>
                
                <Grid container spacing={3}>
                  {integrations.map((integration, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">{integration.name}</Typography>
                            <Chip 
                              label={integration.status} 
                              color={getIntegrationStatusColor(integration.status)}
                              size="small"
                            />
                          </Box>
                          
                          {integration.lastSync && (
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Last sync: {new Date(integration.lastSync).toLocaleString()}
                            </Typography>
                          )}
                          
                          <Box sx={{ mt: 2 }}>
                            {integration.status === 'connected' ? (
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button size="small" variant="outlined">
                                  Configure
                                </Button>
                                <Button size="small" variant="outlined" color="error">
                                  Disconnect
                                </Button>
                              </Box>
                            ) : (
                              <Button size="small" variant="contained">
                                Connect
                              </Button>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                
                <Box sx={{ mt: 4 }}>
                  <Alert severity="info">
                    <Typography variant="body2">
                      <strong>Note:</strong> Integration settings require proper API keys and configuration. 
                      Contact your system administrator for assistance with setting up integrations.
                    </Typography>
                  </Alert>
                </Box>
              </Box>
            )}

            {activeTab === 3 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Notification Settings
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Communication Notifications</Typography>
                        
                        <Box sx={{ mb: 3 }}>
                          <FormControlLabel
                            control={
                              <Switch 
                                checked={settings.emailNotifications}
                                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                              />
                            }
                            label="Email notifications"
                          />
                        </Box>
                        
                        <Box sx={{ mb: 3 }}>
                          <FormControlLabel
                            control={
                              <Switch 
                                checked={settings.smsNotifications}
                                onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                              />
                            }
                            label="SMS notifications"
                          />
                        </Box>
                        
                        <Box sx={{ mb: 3 }}>
                          <FormControlLabel
                            control={
                              <Switch 
                                checked={settings.whatsappNotifications}
                                onChange={(e) => handleSettingChange('whatsappNotifications', e.target.checked)}
                              />
                            }
                            label="WhatsApp notifications"
                          />
                        </Box>
                        
                        <Box sx={{ mb: 3 }}>
                          <FormControlLabel
                            control={
                              <Switch 
                                checked={settings.followUpReminders}
                                onChange={(e) => handleSettingChange('followUpReminders', e.target.checked)}
                              />
                            }
                            label="Follow-up reminders"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Communication Settings</Typography>
                        
                        <TextField
                          fullWidth
                          label="SMS Gateway"
                          value={settings.smsGateway}
                          onChange={(e) => handleSettingChange('smsGateway', e.target.value)}
                          sx={{ mb: 2 }}
                        />
                        
                        <TextField
                          fullWidth
                          label="Email Server"
                          value={settings.emailServer}
                          onChange={(e) => handleSettingChange('emailServer', e.target.value)}
                          sx={{ mb: 2 }}
                        />
                        
                        <TextField
                          fullWidth
                          label="Email Port"
                          value={settings.emailPort}
                          onChange={(e) => handleSettingChange('emailPort', e.target.value)}
                          sx={{ mb: 2 }}
                        />
                        
                        <TextField
                          fullWidth
                          label="WhatsApp API Key"
                          type="password"
                          value={settings.whatsappApiKey}
                          onChange={(e) => handleSettingChange('whatsappApiKey', e.target.value)}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeTab === 4 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Security Settings
                </Typography>
                
                <Alert severity="warning" sx={{ mb: 3 }}>
                  Security settings should only be modified by system administrators.
                </Alert>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Access Control</Typography>
                        
                        <List>
                          <ListItem>
                            <ListItemText 
                              primary="Two-Factor Authentication"
                              secondary="Require 2FA for all users"
                            />
                            <ListItemSecondaryAction>
                              <Switch defaultChecked />
                            </ListItemSecondaryAction>
                          </ListItem>
                          
                          <ListItem>
                            <ListItemText 
                              primary="Session Timeout"
                              secondary="Auto-logout after inactivity"
                            />
                            <ListItemSecondaryAction>
                              <Switch defaultChecked />
                            </ListItemSecondaryAction>
                          </ListItem>
                          
                          <ListItem>
                            <ListItemText 
                              primary="IP Restrictions"
                              secondary="Limit access by IP address"
                            />
                            <ListItemSecondaryAction>
                              <Switch />
                            </ListItemSecondaryAction>
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Data Protection</Typography>
                        
                        <List>
                          <ListItem>
                            <ListItemText 
                              primary="Data Encryption"
                              secondary="Encrypt sensitive data at rest"
                            />
                            <ListItemSecondaryAction>
                              <Switch defaultChecked disabled />
                            </ListItemSecondaryAction>
                          </ListItem>
                          
                          <ListItem>
                            <ListItemText 
                              primary="Audit Logging"
                              secondary="Log all user activities"
                            />
                            <ListItemSecondaryAction>
                              <Switch defaultChecked />
                            </ListItemSecondaryAction>
                          </ListItem>
                          
                          <ListItem>
                            <ListItemText 
                              primary="Data Backup"
                              secondary="Automatic daily backups"
                            />
                            <ListItemSecondaryAction>
                              <Switch defaultChecked disabled />
                            </ListItemSecondaryAction>
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grow>

      {/* Template Dialog */}
      <Dialog
        open={templateDialog.open}
        onClose={() => setTemplateDialog({ open: false, mode: 'create', data: {} })}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="600">
            {templateDialog.mode === 'create' ? 'Create Message Template' : 'Edit Message Template'}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Template Name"
                value={templateDialog.data.name || ''}
                onChange={(e) => setTemplateDialog(prev => ({
                  ...prev,
                  data: { ...prev.data, name: e.target.value }
                }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Message Type</InputLabel>
                <Select
                  value={templateDialog.data.type || 'email'}
                  onChange={(e) => setTemplateDialog(prev => ({
                    ...prev,
                    data: { ...prev.data, type: e.target.value }
                  }))}
                  label="Message Type"
                >
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="sms">SMS</MenuItem>
                  <MenuItem value="whatsapp">WhatsApp</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {templateDialog.data.type !== 'sms' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subject"
                  value={templateDialog.data.subject || ''}
                  onChange={(e) => setTemplateDialog(prev => ({
                    ...prev,
                    data: { ...prev.data, subject: e.target.value }
                  }))}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message Content"
                multiline
                rows={6}
                value={templateDialog.data.content || ''}
                onChange={(e) => setTemplateDialog(prev => ({
                  ...prev,
                  data: { ...prev.data, content: e.target.value }
                }))}
                placeholder="Use {variableName} for dynamic content"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Variables (comma-separated)"
                value={templateDialog.data.variables?.join(', ') || ''}
                onChange={(e) => setTemplateDialog(prev => ({
                  ...prev,
                  data: { 
                    ...prev.data, 
                    variables: e.target.value.split(',').map(v => v.trim()).filter(v => v)
                  }
                }))}
                placeholder="name, email, company, policyType"
                helperText="Enter variable names that can be used in the template content"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={templateDialog.data.active !== false}
                    onChange={(e) => setTemplateDialog(prev => ({
                      ...prev,
                      data: { ...prev.data, active: e.target.checked }
                    }))}
                  />
                }
                label="Active Template"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setTemplateDialog({ open: false, mode: 'create', data: {} })}
            variant="outlined"
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleTemplateSave}
            variant="contained"
            startIcon={<SaveIcon />}
          >
            {templateDialog.mode === 'create' ? 'Create Template' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LMSSettings;