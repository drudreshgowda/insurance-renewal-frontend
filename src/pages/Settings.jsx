import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Card, CardContent, Switch,
  List, ListItem, ListItemIcon, ListItemText,
  ListItemSecondaryAction, Alert, Tabs, Tab,
  FormControl, Select, MenuItem, InputLabel,
  Button, Divider, TextField, Slider,
  useTheme, alpha, Fade, Grow, Zoom, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  FormControlLabel, Checkbox, RadioGroup, Radio, FormLabel,
  Chip, IconButton, Grid
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Save as SaveIcon,
  Settings as SettingsIcon,
  Palette as PaletteIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Security as SecurityIcon,
  Receipt as ReceiptIcon,
  ArrowForward as ArrowForwardIcon,
  Help as HelpIcon,
  School as SchoolIcon,
  Autorenew as AutorenewIcon,
  Campaign as CampaignIcon,
  Gavel as GavelIcon,
  Feedback as FeedbackIcon,
  Storage as StorageIcon,
  VolumeUp as VolumeUpIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Shield as ShieldIcon,
  AccessTime as AccessTimeIcon,
  Monitor as MonitorIcon,
  Cloud as CloudIcon,
  DataUsage as DataUsageIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Schedule as ScheduleIcon,
  Rule as RuleIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  AccountCircle as AccountCircleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Sync as SyncIcon,
  SyncDisabled as SyncDisabledIcon,
  Merge as MergeIcon,
  Speed as SpeedIcon,
  Description as DescriptionIcon,
  Analytics as AnalyticsIcon,
  Verified as VerifiedIcon,
  Timeline as TrackingIcon
} from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeModeContext';
import { useSettings } from '../context/SettingsContext';
import { Link, useSearchParams } from 'react-router-dom';
import WelcomeModal from '../components/common/WelcomeModal';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Settings = () => {
  const { mode, toggleMode } = useThemeMode();
  const { settings, updateSettings } = useSettings();
  const [searchParams] = useSearchParams();
  const [successMessage, setSuccessMessage] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);
  const theme = useTheme();

  // Email settings state moved to main component level
  const [emailSettings, setEmailSettings] = useState({
    pollingInterval: 5,
    autoTagging: true,
    fallbackTagging: true,
    imapConnected: true,
    webhookEnabled: false,
    webhookUrl: 'https://api.intelipro.com/webhooks/emails',
    emailsPerPage: 25,
    emailAutoRefresh: false,
    markAsReadOnOpen: true,
    aiIntentClassification: true,
    sentimentAnalysis: true,
    realTimeCollaboration: true
  });

  const [rules, setRules] = useState([
    { id: 1, keyword: 'refund', category: 'refund', priority: 'high', enabled: true },
    { id: 2, keyword: 'complaint', category: 'complaint', priority: 'high', enabled: true },
    { id: 3, keyword: 'appointment', category: 'appointment', priority: 'medium', enabled: true },
    { id: 4, keyword: 'feedback', category: 'feedback', priority: 'low', enabled: true }
  ]);

  const [ruleDialog, setRuleDialog] = useState({ open: false, rule: null, mode: 'add' });
  const [newRule, setNewRule] = useState({
    keyword: '', category: 'uncategorized', priority: 'medium', enabled: true
  });

  // Email accounts state
  const [emailAccounts, setEmailAccounts] = useState([
    {
      id: 1,
      name: 'Support Inbox',
      email: 'support@company.com',
      provider: 'gmail',
      status: 'connected',
      imapServer: 'imap.gmail.com',
      imapPort: 993,
      smtpServer: 'smtp.gmail.com',
      smtpPort: 587,
      useSSL: true,
      autoSync: true,
      syncInterval: 5,
      lastSync: '2024-07-14T10:30:00Z'
    },
    {
      id: 2,
      name: 'Sales Inquiries',
      email: 'sales@company.com',
      provider: 'outlook',
      status: 'error',
      imapServer: 'outlook.office365.com',
      imapPort: 993,
      smtpServer: 'smtp.office365.com',
      smtpPort: 587,
      useSSL: true,
      autoSync: false,
      syncInterval: 10,
      lastSync: '2024-07-13T15:45:00Z'
    }
  ]);

  const [accountDialog, setAccountDialog] = useState({ open: false, account: null, mode: 'add' });
  const [newAccount, setNewAccount] = useState({
    name: '',
    email: '',
    provider: 'gmail',
    imapServer: '',
    imapPort: 993,
    smtpServer: '',
    smtpPort: 587,
    useSSL: true,
    autoSync: true,
    syncInterval: 5
  });

  const tabsConfig = useMemo(() => [
    { label: 'General', icon: <SettingsIcon /> },
    { label: 'Renewals', icon: <AutorenewIcon /> },
    { label: 'Email', icon: <EmailIcon /> },
    { label: 'Campaigns', icon: <CampaignIcon /> },
    { label: 'Claims', icon: <GavelIcon /> },
    { label: 'Feedback', icon: <FeedbackIcon /> },
    { label: 'System', icon: <StorageIcon /> }
  ], []);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    // Set initial tab based on URL parameter
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      const tabIndex = tabsConfig.findIndex(tab => tab.label.toLowerCase() === tabParam.toLowerCase());
      if (tabIndex !== -1) {
        setTabValue(tabIndex);
      }
    }
  }, [searchParams, tabsConfig]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSettingChange = (setting, value) => {
    updateSettings({
      [setting]: value
    });
  };

  const handleSaveSettings = () => {
    setSuccessMessage('Settings saved successfully!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleToggleMfa = () => {
    handleSettingChange('mfaEnabled', !settings.mfaEnabled);
    setSuccessMessage(`Multi-Factor Authentication ${!settings.mfaEnabled ? 'enabled' : 'disabled'} successfully`);
  };

  const handleOpenWelcomeGuide = () => {
    setWelcomeModalOpen(true);
  };

  const handleCloseWelcomeGuide = () => {
    setWelcomeModalOpen(false);
  };

  const handleEmailSettingChange = (key, value) => {
    setEmailSettings(prev => ({ ...prev, [key]: value }));
    // Also update the main settings context for backward compatibility
    handleSettingChange(key, value);
  };

  const handleAddRule = () => {
    setRuleDialog({ open: true, rule: null, mode: 'add' });
    setNewRule({ keyword: '', category: 'uncategorized', priority: 'medium', enabled: true });
  };

  const handleEditRule = (rule) => {
    setRuleDialog({ open: true, rule, mode: 'edit' });
    setNewRule({ ...rule });
  };

  const handleDeleteRule = (ruleId) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  const handleSaveRule = () => {
    if (ruleDialog.mode === 'add') {
      const newRuleWithId = { ...newRule, id: Math.max(...rules.map(r => r.id), 0) + 1 };
      setRules(prev => [...prev, newRuleWithId]);
    } else {
      setRules(prev => prev.map(rule => rule.id === ruleDialog.rule.id ? { ...newRule } : rule));
    }
    setRuleDialog({ open: false, rule: null, mode: 'add' });
  };

  const handleToggleRule = (ruleId) => {
    setRules(prev => prev.map(rule => rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule));
  };

  // Email account handlers
  const handleAddAccount = () => {
    setAccountDialog({ open: true, account: null, mode: 'add' });
    setNewAccount({
      name: '',
      email: '',
      provider: 'gmail',
      imapServer: '',
      imapPort: 993,
      smtpServer: '',
      smtpPort: 587,
      useSSL: true,
      autoSync: true,
      syncInterval: 5
    });
  };

  const handleEditAccount = (account) => {
    setAccountDialog({ open: true, account, mode: 'edit' });
    setNewAccount({ ...account });
  };

  const handleDeleteAccount = (accountId) => {
    setEmailAccounts(prev => prev.filter(account => account.id !== accountId));
  };

  const handleSaveAccount = () => {
    if (accountDialog.mode === 'add') {
      const newAccountWithId = { 
        ...newAccount, 
        id: Math.max(...emailAccounts.map(a => a.id), 0) + 1,
        status: 'connected',
        lastSync: new Date().toISOString()
      };
      setEmailAccounts(prev => [...prev, newAccountWithId]);
    } else {
      setEmailAccounts(prev => prev.map(account => 
        account.id === accountDialog.account.id ? { ...newAccount } : account
      ));
    }
    setAccountDialog({ open: false, account: null, mode: 'add' });
  };

  const handleToggleAccountSync = (accountId) => {
    setEmailAccounts(prev => prev.map(account => 
      account.id === accountId ? { ...account, autoSync: !account.autoSync } : account
    ));
  };

  const handleTestConnection = (accountId) => {
    // In a real app, this would test the connection
    setEmailAccounts(prev => prev.map(account => 
      account.id === accountId ? { ...account, status: 'connected', lastSync: new Date().toISOString() } : account
    ));
    setSuccessMessage('Connection test successful!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'complaint': return 'error';
      case 'feedback': return 'info';
      case 'refund': return 'warning';
      case 'appointment': return 'success';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  // General Settings Tab Content
  const GeneralSettingsTab = () => (
    <Box>
      <Typography variant="h5" fontWeight="600" gutterBottom>
        General Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure your appearance, regional preferences, notifications, and security settings.
      </Typography>

      {/* Appearance Section */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PaletteIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6" fontWeight="600">Appearance</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List disablePadding>
            <ListItem sx={{ borderRadius: 2, '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.04) } }}>
              <ListItemIcon>
                <DarkModeIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary={<Typography fontWeight="500">Dark Mode</Typography>}
                secondary="Toggle between light and dark theme"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={mode === 'dark'}
                  onChange={() => toggleMode(mode === 'dark' ? 'light' : 'dark')}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Regional Settings Section */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LanguageIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6" fontWeight="600">Regional Settings</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List disablePadding>
            <ListItem sx={{ borderRadius: 2, mb: 1 }}>
              <ListItemIcon>
                <LanguageIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography fontWeight="500">Language</Typography>}
                secondary="Select your preferred language"
              />
              <ListItemSecondaryAction sx={{ width: '120px' }}>
                <FormControl fullWidth size="small">
                  <Select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Español</MenuItem>
                    <MenuItem value="fr">Français</MenuItem>
                  </Select>
                </FormControl>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem sx={{ borderRadius: 2 }}>
              <ListItemIcon>
                <AccessTimeIcon color="secondary" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography fontWeight="500">Time Zone</Typography>}
                secondary="Select your time zone"
              />
              <ListItemSecondaryAction sx={{ width: '120px' }}>
                <FormControl fullWidth size="small">
                  <Select
                    value={settings.timezone}
                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="UTC-8">UTC-8</MenuItem>
                    <MenuItem value="UTC-5">UTC-5</MenuItem>
                    <MenuItem value="UTC+0">UTC+0</MenuItem>
                    <MenuItem value="UTC+1">UTC+1</MenuItem>
                    <MenuItem value="UTC+8">UTC+8</MenuItem>
                  </Select>
                </FormControl>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <NotificationsIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6" fontWeight="600">Notifications</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List disablePadding>
            <ListItem sx={{ borderRadius: 2, mb: 1 }}>
              <ListItemIcon>
                <EmailIcon color="info" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography fontWeight="500">Email Notifications</Typography>}
                secondary="Receive updates via email"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem sx={{ borderRadius: 2 }}>
              <ListItemIcon>
                <SmsIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography fontWeight="500">SMS Notifications</Typography>}
                secondary="Receive updates via SMS"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.smsNotifications}
                  onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Multi-Factor Authentication Section */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SecurityIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6" fontWeight="600">Multi-Factor Authentication</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List disablePadding>
            <ListItem sx={{ borderRadius: 2 }}>
              <ListItemIcon>
                <ShieldIcon color="error" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography fontWeight="500">Enable MFA</Typography>}
                secondary={settings.mfaEnabled 
                  ? "Enabled - OTP required at login" 
                  : "Disabled - Enable for additional security"}
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.mfaEnabled === true}
                  onChange={handleToggleMfa}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );

  // Renewals Settings Tab Content
  const RenewalsSettingsTab = () => (
    <Box>
      <Typography variant="h5" fontWeight="600" gutterBottom>
        Renewals Module Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure settings for renewal management, case tracking, and policy processing.
      </Typography>

      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>Auto Refresh Settings</Typography>
          <Divider sx={{ mb: 2 }} />
          <List disablePadding>
            <ListItem sx={{ borderRadius: 2, mb: 1 }}>
              <ListItemIcon>
                <RefreshIcon color="info" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography fontWeight="500">Auto Refresh</Typography>}
                secondary="Automatically refresh case data every 5 minutes"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.autoRefresh}
                  onChange={(e) => handleSettingChange('autoRefresh', e.target.checked)}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem sx={{ borderRadius: 2 }}>
              <ListItemIcon>
                <EditIcon color="secondary" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography fontWeight="500">Show Edit Case Button</Typography>}
                secondary="Display the Edit Case button in case details view"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.showEditCaseButton !== false}
                  onChange={(e) => handleSettingChange('showEditCaseButton', e.target.checked)}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>Policy Processing</Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Default Renewal Period (Days)
            </Typography>
            <Slider
              value={settings.renewalPeriod || 30}
              onChange={(e, value) => handleSettingChange('renewalPeriod', value)}
              min={15}
              max={90}
              step={5}
              marks={[
                { value: 15, label: '15' },
                { value: 30, label: '30' },
                { value: 60, label: '60' },
                { value: 90, label: '90' }
              ]}
              valueLabelDisplay="auto"
              sx={{ mt: 2 }}
            />
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={settings.autoAssignCases || false}
                onChange={(e) => handleSettingChange('autoAssignCases', e.target.checked)}
                color="primary"
              />
            }
            label="Auto-assign cases to available agents"
          />
        </CardContent>
      </Card>
    </Box>
  );

  // Email Settings Tab Content
  const EmailSettingsTab = () => {

    return (
      <Box>
        <Typography variant="h5" fontWeight="600" gutterBottom>
          Email Module Settings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Configure email management, connection settings, processing rules, and AI features.
        </Typography>

        {/* Connection Settings */}
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SecurityIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="600">Connection Settings</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            {/* IMAP Connection Status */}
            <Box sx={{ 
              p: 2, 
              bgcolor: alpha(emailSettings.imapConnected ? theme.palette.success.main : theme.palette.error.main, 0.1),
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 3
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {emailSettings.imapConnected ? (
                  <WifiIcon sx={{ color: theme.palette.success.main }} />
                ) : (
                  <WifiOffIcon sx={{ color: theme.palette.error.main }} />
                )}
                <Box>
                  <Typography variant="subtitle2" fontWeight="600">
                    IMAP Connection
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {emailSettings.imapConnected ? 'Connected' : 'Disconnected'}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshIcon />}
                sx={{ borderRadius: 2 }}
              >
                Test Connection
              </Button>
            </Box>

            {/* Webhook Settings */}
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={emailSettings.webhookEnabled}
                    onChange={(e) => handleEmailSettingChange('webhookEnabled', e.target.checked)}
                  />
                }
                label="Enable Webhook Notifications"
              />
              
              {emailSettings.webhookEnabled && (
                <TextField
                  fullWidth
                  label="Webhook URL"
                  value={emailSettings.webhookUrl}
                  onChange={(e) => handleEmailSettingChange('webhookUrl', e.target.value)}
                  sx={{ mt: 2 }}
                  InputProps={{ sx: { borderRadius: 2 } }}
                />
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Mail Merge Configuration */}
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <MergeIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="600">
                Mail Merge Configuration
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Configure mail merge templates for automated document generation in bulk emails
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <List disablePadding>
                  <ListItem sx={{ borderRadius: 2, mb: 1, px: 0 }}>
                    <ListItemText
                      primary={<Typography fontWeight="500">Enable Mail Merge</Typography>}
                      secondary="Allow document generation with customer data"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={emailSettings.mailMergeEnabled || false}
                        onChange={(e) => handleEmailSettingChange('mailMergeEnabled', e.target.checked)}
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem sx={{ borderRadius: 2, mb: 1, px: 0 }}>
                    <ListItemText
                      primary={<Typography fontWeight="500">Auto-generate Documents</Typography>}
                      secondary="Automatically create documents during bulk email campaigns"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={emailSettings.autoGenerateDocuments || false}
                        onChange={(e) => handleEmailSettingChange('autoGenerateDocuments', e.target.checked)}
                        color="primary"
                        disabled={!emailSettings.mailMergeEnabled}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem sx={{ borderRadius: 2, mb: 1, px: 0 }}>
                    <ListItemText
                      primary={<Typography fontWeight="500">Attach to Emails</Typography>}
                      secondary="Automatically attach generated documents to emails"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={emailSettings.attachToEmail !== false}
                        onChange={(e) => handleEmailSettingChange('attachToEmail', e.target.checked)}
                        color="primary"
                        disabled={!emailSettings.mailMergeEnabled}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Available Merge Fields
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {[
                    'customerName', 'policyNumber', 'policyType', 'effectiveDate', 
                    'expiryDate', 'premiumAmount', 'agentName', 'companyName',
                    'renewalDate', 'currentPremium', 'paymentAmount', 'dueDate'
                  ].map((field) => (
                    <Chip key={field} label={`{{${field}}}`} size="small" variant="outlined" />
                  ))}
                </Box>
                
                <TextField
                  fullWidth
                  label="Document Storage Path"
                  value={emailSettings.documentStoragePath || '/documents/templates'}
                  onChange={(e) => handleEmailSettingChange('documentStoragePath', e.target.value)}
                  sx={{ mb: 2 }}
                  helperText="Path where mail merge templates are stored"
                  disabled={!emailSettings.mailMergeEnabled}
                />
                
                <TextField
                  fullWidth
                  label="Output Directory"
                  value={emailSettings.outputDirectory || '/documents/generated'}
                  onChange={(e) => handleEmailSettingChange('outputDirectory', e.target.value)}
                  helperText="Directory for generated documents"
                  disabled={!emailSettings.mailMergeEnabled}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Email Accounts */}
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountCircleIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6" fontWeight="600">
                  Email Accounts
                </Typography>
              </Box>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={handleAddAccount}
                sx={{ borderRadius: 2 }}
              >
                Add Account
              </Button>
            </Box>

            <List disablePadding>
              {emailAccounts.map((account) => (
                <ListItem
                  key={account.id}
                  sx={{ 
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    mb: 2,
                    bgcolor: 'background.paper',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    p: 2
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="600">
                          {account.name}
                        </Typography>
                        <Chip
                          icon={account.status === 'connected' ? <CheckCircleIcon /> : <ErrorIcon />}
                          label={account.status === 'connected' ? 'Connected' : 'Error'}
                          color={account.status === 'connected' ? 'success' : 'error'}
                          size="small"
                        />
                        {account.autoSync && (
                          <Chip
                            icon={<SyncIcon />}
                            label="Auto-sync"
                            color="info"
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {account.email}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Provider: {account.provider.charAt(0).toUpperCase() + account.provider.slice(1)} • 
                        Last sync: {new Date(account.lastSync).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={() => handleTestConnection(account.id)}
                        sx={{ borderRadius: 2 }}
                      >
                        Test
                      </Button>
                      <IconButton 
                        size="small"
                        onClick={() => handleEditAccount(account)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small"
                        onClick={() => handleDeleteAccount(account.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        IMAP: {account.imapServer}:{account.imapPort}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        SMTP: {account.smtpServer}:{account.smtpPort}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Sync: Every {account.syncInterval} min
                      </Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={account.autoSync}
                          onChange={() => handleToggleAccountSync(account.id)}
                          size="small"
                        />
                      }
                      label="Auto-sync"
                      sx={{ m: 0 }}
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Processing Settings */}
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ScheduleIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="600">Processing Settings</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <List disablePadding>
              {/* Polling Interval */}
              <ListItem sx={{ borderRadius: 2, mb: 1, px: 0 }}>
                <ListItemText
                  primary={<Typography fontWeight="500">Email Polling Interval</Typography>}
                  secondary="How often to check for new emails"
                />
                <ListItemSecondaryAction sx={{ width: '140px' }}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={emailSettings.pollingInterval}
                      onChange={(e) => handleEmailSettingChange('pollingInterval', e.target.value)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value={1}>1 minute</MenuItem>
                      <MenuItem value={5}>5 minutes</MenuItem>
                      <MenuItem value={10}>10 minutes</MenuItem>
                      <MenuItem value={15}>15 minutes</MenuItem>
                      <MenuItem value={30}>30 minutes</MenuItem>
                    </Select>
                  </FormControl>
                </ListItemSecondaryAction>
              </ListItem>

              {/* Auto-categorization */}
              <ListItem sx={{ borderRadius: 2, mb: 1, px: 0 }}>
                <ListItemText
                  primary={<Typography fontWeight="500">Auto-categorization</Typography>}
                  secondary="Automatically categorize emails based on classification rules"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={emailSettings.autoTagging}
                    onChange={(e) => handleEmailSettingChange('autoTagging', e.target.checked)}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>

              {/* Fallback Tagging */}
              <ListItem sx={{ borderRadius: 2, mb: 1, px: 0 }}>
                <ListItemText
                  primary={<Typography fontWeight="500">Fallback Tagging</Typography>}
                  secondary="Tag emails as 'Uncategorized' when no rules match"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={emailSettings.fallbackTagging}
                    onChange={(e) => handleEmailSettingChange('fallbackTagging', e.target.checked)}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Inbox Preferences */}
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>Inbox Preferences</Typography>
            <Divider sx={{ mb: 2 }} />
            <List disablePadding>
              <ListItem sx={{ borderRadius: 2, mb: 1, px: 0 }}>
                <ListItemText
                  primary={<Typography fontWeight="500">Emails Per Page</Typography>}
                  secondary="Number of emails displayed per page"
                />
                <ListItemSecondaryAction sx={{ width: '100px' }}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={emailSettings.emailsPerPage}
                      onChange={(e) => handleEmailSettingChange('emailsPerPage', e.target.value)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                    </Select>
                  </FormControl>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem sx={{ borderRadius: 2, mb: 1, px: 0 }}>
                <ListItemText
                  primary={<Typography fontWeight="500">Auto-refresh Inbox</Typography>}
                  secondary="Automatically check for new emails"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={emailSettings.emailAutoRefresh}
                    onChange={(e) => handleEmailSettingChange('emailAutoRefresh', e.target.checked)}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem sx={{ borderRadius: 2, px: 0 }}>
                <ListItemText
                  primary={<Typography fontWeight="500">Mark as Read on Open</Typography>}
                  secondary="Automatically mark emails as read when opened"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={emailSettings.markAsReadOnOpen}
                    onChange={(e) => handleEmailSettingChange('markAsReadOnOpen', e.target.checked)}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* AI Features */}
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>AI Features</Typography>
            <Divider sx={{ mb: 2 }} />
            <List disablePadding>
              <ListItem sx={{ borderRadius: 2, mb: 1, px: 0 }}>
                <ListItemText
                  primary={<Typography fontWeight="500">AI Intent Classification</Typography>}
                  secondary="Automatically classify email intent using AI"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={emailSettings.aiIntentClassification}
                    onChange={(e) => handleEmailSettingChange('aiIntentClassification', e.target.checked)}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem sx={{ borderRadius: 2, mb: 1, px: 0 }}>
                <ListItemText
                  primary={<Typography fontWeight="500">Sentiment Analysis</Typography>}
                  secondary="Analyze email sentiment for emotionally charged content"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={emailSettings.sentimentAnalysis}
                    onChange={(e) => handleEmailSettingChange('sentimentAnalysis', e.target.checked)}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem sx={{ borderRadius: 2, px: 0 }}>
                <ListItemText
                  primary={<Typography fontWeight="500">Real-time Collaboration</Typography>}
                  secondary="Show other agents viewing the same email"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={emailSettings.realTimeCollaboration}
                    onChange={(e) => handleEmailSettingChange('realTimeCollaboration', e.target.checked)}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Classification Rules */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <RuleIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6" fontWeight="600">
                  Classification Rules
                </Typography>
              </Box>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={handleAddRule}
                sx={{ borderRadius: 2 }}
              >
                Add Rule
              </Button>
            </Box>

            <List disablePadding>
              {rules.map((rule) => (
                <ListItem
                  key={rule.id}
                  sx={{ 
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    mb: 1,
                    bgcolor: rule.enabled ? 'transparent' : alpha(theme.palette.action.disabled, 0.08)
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="600">
                          Keyword: "{rule.keyword}"
                        </Typography>
                        {!rule.enabled && (
                          <Chip label="Disabled" size="small" color="default" />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={`Category: ${rule.category}`}
                          color={getCategoryColor(rule.category)}
                          size="small"
                        />
                        <Chip 
                          label={`Priority: ${rule.priority}`}
                          color={getPriorityColor(rule.priority)}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Switch
                        checked={rule.enabled}
                        onChange={() => handleToggleRule(rule.id)}
                        size="small"
                      />
                      <IconButton 
                        size="small"
                        onClick={() => handleEditRule(rule)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small"
                        onClick={() => handleDeleteRule(rule.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Rule Dialog */}
        <Dialog 
          open={ruleDialog.open} 
          onClose={() => setRuleDialog({ open: false, rule: null, mode: 'add' })}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle>
            {ruleDialog.mode === 'add' ? 'Add Classification Rule' : 'Edit Classification Rule'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Keyword"
                value={newRule.keyword}
                onChange={(e) => setNewRule(prev => ({ ...prev, keyword: e.target.value }))}
                InputProps={{ sx: { borderRadius: 2 } }}
                helperText="Enter keyword to match in email subject or content"
              />
              
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newRule.category}
                  label="Category"
                  onChange={(e) => setNewRule(prev => ({ ...prev, category: e.target.value }))}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="complaint">Complaint</MenuItem>
                  <MenuItem value="feedback">Feedback</MenuItem>
                  <MenuItem value="refund">Refund</MenuItem>
                  <MenuItem value="appointment">Appointment</MenuItem>
                  <MenuItem value="uncategorized">Uncategorized</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newRule.priority}
                  label="Priority"
                  onChange={(e) => setNewRule(prev => ({ ...prev, priority: e.target.value }))}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={newRule.enabled}
                    onChange={(e) => setNewRule(prev => ({ ...prev, enabled: e.target.checked }))}
                  />
                }
                label="Enable this rule"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button 
              onClick={() => setRuleDialog({ open: false, rule: null, mode: 'add' })}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained"
              onClick={handleSaveRule}
              disabled={!newRule.keyword.trim()}
              sx={{ borderRadius: 2 }}
            >
              {ruleDialog.mode === 'add' ? 'Add Rule' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Account Dialog */}
        <Dialog 
          open={accountDialog.open} 
          onClose={() => setAccountDialog({ open: false, account: null, mode: 'add' })}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle>
            {accountDialog.mode === 'add' ? 'Add Email Account' : 'Edit Email Account'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Basic Information */}
              <Box>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  Basic Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Account Name"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount(prev => ({ ...prev, name: e.target.value }))}
                    InputProps={{ sx: { borderRadius: 2 } }}
                    helperText="A friendly name for this email account"
                  />
                  
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={newAccount.email}
                    onChange={(e) => setNewAccount(prev => ({ ...prev, email: e.target.value }))}
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />

                  <FormControl fullWidth>
                    <InputLabel>Email Provider</InputLabel>
                    <Select
                      value={newAccount.provider}
                      label="Email Provider"
                      onChange={(e) => setNewAccount(prev => ({ ...prev, provider: e.target.value }))}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="gmail">Gmail</MenuItem>
                      <MenuItem value="outlook">Outlook/Office 365</MenuItem>
                      <MenuItem value="yahoo">Yahoo Mail</MenuItem>
                      <MenuItem value="custom">Custom IMAP/SMTP</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* IMAP Settings */}
              <Box>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  IMAP Settings (Incoming Mail)
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 2 }}>
                  <TextField
                    label="IMAP Server"
                    value={newAccount.imapServer}
                    onChange={(e) => setNewAccount(prev => ({ ...prev, imapServer: e.target.value }))}
                    InputProps={{ sx: { borderRadius: 2 } }}
                    placeholder="imap.gmail.com"
                  />
                  <TextField
                    label="Port"
                    type="number"
                    value={newAccount.imapPort}
                    onChange={(e) => setNewAccount(prev => ({ ...prev, imapPort: parseInt(e.target.value) }))}
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                </Box>
              </Box>

              {/* SMTP Settings */}
              <Box>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  SMTP Settings (Outgoing Mail)
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 2 }}>
                  <TextField
                    label="SMTP Server"
                    value={newAccount.smtpServer}
                    onChange={(e) => setNewAccount(prev => ({ ...prev, smtpServer: e.target.value }))}
                    InputProps={{ sx: { borderRadius: 2 } }}
                    placeholder="smtp.gmail.com"
                  />
                  <TextField
                    label="Port"
                    type="number"
                    value={newAccount.smtpPort}
                    onChange={(e) => setNewAccount(prev => ({ ...prev, smtpPort: parseInt(e.target.value) }))}
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                </Box>
              </Box>

              {/* Sync Settings */}
              <Box>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  Sync Settings
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={newAccount.useSSL}
                        onChange={(e) => setNewAccount(prev => ({ ...prev, useSSL: e.target.checked }))}
                      />
                    }
                    label="Use SSL/TLS encryption"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={newAccount.autoSync}
                        onChange={(e) => setNewAccount(prev => ({ ...prev, autoSync: e.target.checked }))}
                      />
                    }
                    label="Enable automatic synchronization"
                  />

                  {newAccount.autoSync && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Sync Interval: {newAccount.syncInterval} minutes
                      </Typography>
                      <Slider
                        value={newAccount.syncInterval}
                        onChange={(e, value) => setNewAccount(prev => ({ ...prev, syncInterval: value }))}
                        min={1}
                        max={60}
                        step={1}
                        marks={[
                          { value: 1, label: '1m' },
                          { value: 5, label: '5m' },
                          { value: 15, label: '15m' },
                          { value: 30, label: '30m' },
                          { value: 60, label: '1h' }
                        ]}
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button 
              onClick={() => setAccountDialog({ open: false, account: null, mode: 'add' })}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained"
              onClick={handleSaveAccount}
              disabled={!newAccount.name.trim() || !newAccount.email.trim()}
              sx={{ borderRadius: 2 }}
            >
              {accountDialog.mode === 'add' ? 'Add Account' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  // System Settings Tab Content
  const CampaignsSettingsTab = () => {
    const [campaignSettings, setCampaignSettings] = useState({
      // Integration Settings
      emailProvider: 'sendgrid',
      emailApiKey: '',
      whatsappProvider: 'meta',
      whatsappApiKey: '',
      whatsappPhoneId: '',
      smsProvider: 'msg91',
      smsApiKey: '',
      smsSenderId: '',
      
      // Compliance Settings
      consentRequired: true,
      dndCompliance: true,
      optInRequired: true,
      dataRetentionDays: 365,
      
      // Throttling & Limits
      emailRateLimit: 1000,
      smsRateLimit: 100,
      whatsappRateLimit: 80,
      batchSize: 50,
      retryAttempts: 3,
      
      // Template Settings
      templateApprovalRequired: false,
      dltTemplateRequired: true,
      autoSaveTemplates: true,
      
      // Analytics & Reporting
      trackingEnabled: true,
      webhookUrl: '',
      reportingInterval: 'daily',
      exportFormat: 'csv'
    });

    const handleCampaignSettingChange = (key, value) => {
      setCampaignSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
      <Box>
        <Typography variant="h5" fontWeight="600" gutterBottom>
          Campaign Management Settings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Configure multi-channel campaign settings, integrations, and compliance options
        </Typography>

        {/* Integration Settings */}
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon color="primary" />
              Channel Integrations
            </Typography>
            
            <Grid container spacing={3}>
              {/* Email Provider */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Email Provider</InputLabel>
                  <Select
                    value={campaignSettings.emailProvider}
                    onChange={(e) => handleCampaignSettingChange('emailProvider', e.target.value)}
                  >
                    <MenuItem value="sendgrid">SendGrid</MenuItem>
                    <MenuItem value="ses">Amazon SES</MenuItem>
                    <MenuItem value="mailgun">Mailgun</MenuItem>
                    <MenuItem value="smtp">Custom SMTP</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Email API Key"
                  type="password"
                  value={campaignSettings.emailApiKey}
                  onChange={(e) => handleCampaignSettingChange('emailApiKey', e.target.value)}
                  placeholder="Enter your email provider API key"
                />
              </Grid>

              {/* WhatsApp Provider */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>WhatsApp Provider</InputLabel>
                  <Select
                    value={campaignSettings.whatsappProvider}
                    onChange={(e) => handleCampaignSettingChange('whatsappProvider', e.target.value)}
                  >
                    <MenuItem value="meta">Meta WhatsApp Business API</MenuItem>
                    <MenuItem value="twilio">Twilio WhatsApp</MenuItem>
                    <MenuItem value="gupshup">Gupshup</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="WhatsApp API Key"
                  type="password"
                  value={campaignSettings.whatsappApiKey}
                  onChange={(e) => handleCampaignSettingChange('whatsappApiKey', e.target.value)}
                  placeholder="Enter WhatsApp API key"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="WhatsApp Phone Number ID"
                  value={campaignSettings.whatsappPhoneId}
                  onChange={(e) => handleCampaignSettingChange('whatsappPhoneId', e.target.value)}
                  placeholder="Enter phone number ID"
                />
              </Grid>

              {/* SMS Provider */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>SMS Provider</InputLabel>
                  <Select
                    value={campaignSettings.smsProvider}
                    onChange={(e) => handleCampaignSettingChange('smsProvider', e.target.value)}
                  >
                    <MenuItem value="msg91">MSG91</MenuItem>
                    <MenuItem value="airtel">Airtel IQ</MenuItem>
                    <MenuItem value="aws-sns">AWS SNS</MenuItem>
                    <MenuItem value="twilio">Twilio SMS</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="SMS API Key"
                  type="password"
                  value={campaignSettings.smsApiKey}
                  onChange={(e) => handleCampaignSettingChange('smsApiKey', e.target.value)}
                  placeholder="Enter SMS provider API key"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="SMS Sender ID"
                  value={campaignSettings.smsSenderId}
                  onChange={(e) => handleCampaignSettingChange('smsSenderId', e.target.value)}
                  placeholder="Enter sender ID (e.g., INTPRO)"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Compliance Settings */}
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShieldIcon color="primary" />
              Compliance & Consent
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Consent Required"
                  secondary="Require explicit consent before sending campaigns"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={campaignSettings.consentRequired}
                    onChange={(e) => handleCampaignSettingChange('consentRequired', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <ShieldIcon color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary="DND Compliance"
                  secondary="Check Do Not Disturb registry before sending SMS"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={campaignSettings.dndCompliance}
                    onChange={(e) => handleCampaignSettingChange('dndCompliance', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <PersonIcon color="info" />
                </ListItemIcon>
                <ListItemText
                  primary="Opt-in Required"
                  secondary="Require users to opt-in for marketing communications"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={campaignSettings.optInRequired}
                    onChange={(e) => handleCampaignSettingChange('optInRequired', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
            
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Data Retention (Days)"
                  type="number"
                  value={campaignSettings.dataRetentionDays}
                  onChange={(e) => handleCampaignSettingChange('dataRetentionDays', parseInt(e.target.value))}
                  inputProps={{ min: 30, max: 2555 }}
                  helperText="How long to retain campaign data (30-2555 days)"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Rate Limiting & Performance */}
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SpeedIcon color="primary" />
              Rate Limiting & Performance
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Email Rate Limit (per hour)"
                  type="number"
                  value={campaignSettings.emailRateLimit}
                  onChange={(e) => handleCampaignSettingChange('emailRateLimit', parseInt(e.target.value))}
                  inputProps={{ min: 100, max: 10000 }}
                  helperText="Maximum emails per hour"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="SMS Rate Limit (per hour)"
                  type="number"
                  value={campaignSettings.smsRateLimit}
                  onChange={(e) => handleCampaignSettingChange('smsRateLimit', parseInt(e.target.value))}
                  inputProps={{ min: 50, max: 1000 }}
                  helperText="Maximum SMS per hour"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="WhatsApp Rate Limit (per hour)"
                  type="number"
                  value={campaignSettings.whatsappRateLimit}
                  onChange={(e) => handleCampaignSettingChange('whatsappRateLimit', parseInt(e.target.value))}
                  inputProps={{ min: 20, max: 500 }}
                  helperText="Maximum WhatsApp messages per hour"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Batch Size"
                  type="number"
                  value={campaignSettings.batchSize}
                  onChange={(e) => handleCampaignSettingChange('batchSize', parseInt(e.target.value))}
                  inputProps={{ min: 10, max: 1000 }}
                  helperText="Messages per batch"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Retry Attempts"
                  type="number"
                  value={campaignSettings.retryAttempts}
                  onChange={(e) => handleCampaignSettingChange('retryAttempts', parseInt(e.target.value))}
                  inputProps={{ min: 1, max: 5 }}
                  helperText="Failed message retry attempts"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Template & Content Settings */}
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DescriptionIcon color="primary" />
              Template & Content Management
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary="Template Approval Required"
                  secondary="Require admin approval before using new templates"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={campaignSettings.templateApprovalRequired}
                    onChange={(e) => handleCampaignSettingChange('templateApprovalRequired', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <VerifiedIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="DLT Template Required"
                  secondary="Require DLT template ID for SMS/WhatsApp campaigns"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={campaignSettings.dltTemplateRequired}
                    onChange={(e) => handleCampaignSettingChange('dltTemplateRequired', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <SaveIcon color="info" />
                </ListItemIcon>
                <ListItemText
                  primary="Auto-save Templates"
                  secondary="Automatically save template drafts while editing"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={campaignSettings.autoSaveTemplates}
                    onChange={(e) => handleCampaignSettingChange('autoSaveTemplates', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Analytics & Reporting */}
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AnalyticsIcon color="primary" />
              Analytics & Reporting
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <TrackingIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Tracking Enabled"
                  secondary="Enable open, click, and delivery tracking"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={campaignSettings.trackingEnabled}
                    onChange={(e) => handleCampaignSettingChange('trackingEnabled', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
            
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Webhook URL"
                  value={campaignSettings.webhookUrl}
                  onChange={(e) => handleCampaignSettingChange('webhookUrl', e.target.value)}
                  placeholder="https://your-domain.com/webhook"
                  helperText="URL to receive campaign event notifications"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Reporting Interval</InputLabel>
                  <Select
                    value={campaignSettings.reportingInterval}
                    onChange={(e) => handleCampaignSettingChange('reportingInterval', e.target.value)}
                  >
                    <MenuItem value="realtime">Real-time</MenuItem>
                    <MenuItem value="hourly">Hourly</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Export Format</InputLabel>
                  <Select
                    value={campaignSettings.exportFormat}
                    onChange={(e) => handleCampaignSettingChange('exportFormat', e.target.value)}
                  >
                    <MenuItem value="csv">CSV</MenuItem>
                    <MenuItem value="xlsx">Excel (XLSX)</MenuItem>
                    <MenuItem value="pdf">PDF Report</MenuItem>
                    <MenuItem value="json">JSON</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setCampaignSettings({})}
            sx={{ borderRadius: 2 }}
          >
            Reset to Defaults
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handleSaveSettings();
              // Show success message
            }}
            startIcon={<SaveIcon />}
            sx={{ borderRadius: 2 }}
          >
            Save Campaign Settings
          </Button>
        </Box>
      </Box>
    );
  };

  const SystemSettingsTab = () => (
    <Box>
      <Typography variant="h5" fontWeight="600" gutterBottom>
        System Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Advanced system configurations, billing information, and user management.
      </Typography>

      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ReceiptIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="600">Billing Information</Typography>
            </Box>
            <Button 
              component={Link} 
              to="/billing"
              variant="outlined" 
              color="primary"
              endIcon={<ArrowForwardIcon />}
              sx={{ borderRadius: 2, fontWeight: 500 }}
            >
              View Billing Details
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            View your complete billing information, including utilization charges, platform charges, and payment history.
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <HelpIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6" fontWeight="600">Help & Resources</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List disablePadding>
            <ListItem 
              button
              onClick={handleOpenWelcomeGuide}
              sx={{ borderRadius: 2, mb: 1 }}
            >
              <ListItemIcon>
                <SchoolIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography fontWeight="500">Portal Welcome Guide</Typography>}
                secondary="View the introduction guide to the portal features"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>System Performance</Typography>
          <Divider sx={{ mb: 2 }} />
          <List disablePadding>
            <ListItem sx={{ borderRadius: 2, mb: 1 }}>
              <ListItemIcon>
                <DataUsageIcon color="info" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography fontWeight="500">Data Retention Period</Typography>}
                secondary="How long to keep archived data (months)"
              />
              <ListItemSecondaryAction sx={{ width: '100px' }}>
                <FormControl fullWidth size="small">
                  <Select
                    value={settings.dataRetentionPeriod || 12}
                    onChange={(e) => handleSettingChange('dataRetentionPeriod', e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value={6}>6 months</MenuItem>
                    <MenuItem value={12}>12 months</MenuItem>
                    <MenuItem value={24}>24 months</MenuItem>
                    <MenuItem value={36}>36 months</MenuItem>
                  </Select>
                </FormControl>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem sx={{ borderRadius: 2 }}>
              <ListItemIcon>
                <CloudIcon color="secondary" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography fontWeight="500">Auto Backup</Typography>}
                secondary="Automatically backup data to cloud storage"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.autoBackup !== false}
                  onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );

  // Module Settings Placeholder (for other modules)
  const ModuleSettingsTab = ({ moduleName, icon }) => (
    <Box>
      <Typography variant="h5" fontWeight="600" gutterBottom>
        {moduleName} Module Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure settings specific to the {moduleName.toLowerCase()} module.
      </Typography>

      <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {icon}
            <Typography variant="h6" fontWeight="600" sx={{ ml: 1 }}>
              {moduleName} Preferences
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            {moduleName} specific settings will be available here. Configure notifications, automation rules, 
            and module-specific preferences for optimal workflow management.
          </Typography>
          <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 2 }}>
            <Typography variant="body2" color="info.main">
              💡 More {moduleName.toLowerCase()} settings will be added based on your usage patterns and feedback.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ px: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4
        }}>
          <Typography variant="h4" fontWeight="600">
            Settings
          </Typography>
        </Box>

        {successMessage && (
          <Grow in={Boolean(successMessage)}>
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              {successMessage}
            </Alert>
          </Grow>
        )}

        <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 72,
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  '&.Mui-selected': {
                    fontWeight: 600,
                  }
                }
              }}
            >
              {tabsConfig.map((tab, index) => (
                <Tab
                  key={index}
                  icon={tab.icon}
                  label={tab.label}
                  iconPosition="start"
                  sx={{ gap: 1 }}
                />
              ))}
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            <TabPanel value={tabValue} index={0}>
              <GeneralSettingsTab />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <RenewalsSettingsTab />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <EmailSettingsTab />
            </TabPanel>
                    <TabPanel value={tabValue} index={3}>
          <CampaignsSettingsTab />
        </TabPanel>
            <TabPanel value={tabValue} index={4}>
              <ModuleSettingsTab moduleName="Claims" icon={<GavelIcon sx={{ color: theme.palette.primary.main }} />} />
            </TabPanel>
            <TabPanel value={tabValue} index={5}>
              <ModuleSettingsTab moduleName="Feedback" icon={<FeedbackIcon sx={{ color: theme.palette.primary.main }} />} />
            </TabPanel>
            <TabPanel value={tabValue} index={6}>
              <SystemSettingsTab />
            </TabPanel>
          </Box>
        </Card>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Zoom in={loaded} style={{ transitionDelay: '400ms' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(0,118,255,0.25)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,118,255,0.35)',
                }
              }}
            >
              Save Settings
            </Button>
          </Zoom>
        </Box>
        
        <WelcomeModal open={welcomeModalOpen} onClose={handleCloseWelcomeGuide} />
      </Box>
    </Fade>
  );
};

export default Settings;