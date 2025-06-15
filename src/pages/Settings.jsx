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
  Chip, IconButton, Grid, Avatar
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
  Restore as RestoreIcon,
  AccountCircle as AccountCircleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Sync as SyncIcon,
  SyncDisabled as SyncDisabledIcon,
  Merge as MergeIcon,
  Speed as SpeedIcon,
  Description as DescriptionIcon,
  Analytics as AnalyticsIcon,
  Verified as VerifiedIcon,
  Timeline as TrackingIcon,
  WhatsApp as WhatsAppIcon
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

  // WhatsApp Flow Settings State
  const [whatsappSettings, setWhatsappSettings] = useState({
    businessApiEnabled: true,
    webhookUrl: 'https://api.intelipro.com/webhooks/whatsapp',
    phoneNumberId: '',
    accessToken: '',
    verifyToken: 'whatsapp_verify_token_2024',
    messageTemplatesEnabled: true,
    flowBuilderEnabled: true,
    analyticsEnabled: true,
    autoResponseEnabled: true,
    businessHours: {
      enabled: true,
      start: '09:00',
      end: '18:00',
      timezone: 'Asia/Kolkata'
    },
    fallbackMessage: 'Thank you for your message. We will get back to you soon.',
    maxRetries: 3,
    retryDelay: 300,
    rateLimiting: {
      enabled: true,
      messagesPerMinute: 60,
      messagesPerHour: 1000
    }
  });

  // User Management State
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh@client.com',
      role: 'admin',
      status: 'active',
      lastLogin: new Date().toISOString(),
      permissions: [
        // Core Pages
        'dashboard', 'upload', 'cases', 'closed-cases', 'policy-timeline', 'logs', 'claims',
        // Email Pages  
        'emails', 'email-dashboard', 'email-analytics', 'bulk-email',
        // Marketing Pages
        'campaigns', 'templates',
        // Survey Pages
        'feedback', 'survey-designer',
        // WhatsApp Pages
        'whatsapp-flow',
        // Admin Pages
        'settings', 'billing', 'users',
        // Personal Pages
        'profile'
      ],
      createdAt: '2024-01-15T08:00:00Z'
    },
    {
      id: 2,
      name: 'John Smith',
      email: 'john.smith@company.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-07-14T10:30:00Z',
      permissions: [
        // Core Pages
        'dashboard', 'upload', 'cases', 'closed-cases', 'policy-timeline', 'logs', 'claims',
        // Email Pages  
        'emails', 'email-dashboard', 'email-analytics', 'bulk-email',
        // Marketing Pages
        'campaigns', 'templates',
        // Survey Pages
        'feedback', 'survey-designer',
        // WhatsApp Pages
        'whatsapp-flow',
        // Admin Pages
        'settings', 'billing', 'users',
        // Personal Pages
        'profile'
      ],
      createdAt: '2024-01-15T08:00:00Z'
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'manager',
      status: 'active',
      lastLogin: '2024-07-14T09:15:00Z',
      permissions: [
        // Core Pages
        'dashboard', 'upload', 'cases', 'closed-cases', 'policy-timeline', 'logs', 'claims',
        // Email Pages
        'emails', 'email-dashboard', 'email-analytics', 'bulk-email',
        // Marketing Pages
        'campaigns', 'templates',
        // Survey Pages
        'feedback', 'survey-designer',
        // WhatsApp Pages
        'whatsapp-flow',
        // Personal Pages
        'profile'
      ],
      createdAt: '2024-02-10T10:30:00Z'
    },
    {
      id: 4,
      name: 'Mike Wilson',
      email: 'mike.wilson@company.com',
      role: 'agent',
      status: 'active',
      lastLogin: '2024-07-13T16:45:00Z',
      permissions: [
        // Core Pages
        'dashboard', 'cases', 'closed-cases', 'policy-timeline', 'logs',
        // Email Pages
        'emails', 'email-dashboard',
        // WhatsApp Pages
        'whatsapp-flow',
        // Personal Pages
        'profile'
      ],
      createdAt: '2024-03-05T14:20:00Z'
    },
    {
      id: 5,
      name: 'Lisa Brown',
      email: 'lisa.brown@company.com',
      role: 'viewer',
      status: 'inactive',
      lastLogin: '2024-07-10T11:20:00Z',
      permissions: [
        // Core Pages (read-only)
        'dashboard', 'cases', 'closed-cases', 'policy-timeline',
        // Personal Pages
        'profile'
      ],
      createdAt: '2024-04-12T09:45:00Z'
    }
  ]);

  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'admin',
      displayName: 'Administrator',
      description: 'Full access to all features and settings',
      permissions: [
        // Core Pages
        'dashboard', 'upload', 'cases', 'closed-cases', 'policy-timeline', 'logs', 'claims',
        // Email Pages  
        'emails', 'email-dashboard', 'email-analytics', 'bulk-email',
        // Marketing Pages
        'campaigns', 'templates',
        // Survey Pages
        'feedback', 'survey-designer',
        // WhatsApp Pages
        'whatsapp-flow',
        // Admin Pages
        'settings', 'billing', 'users',
        // Personal Pages
        'profile'
      ],
      isSystem: true,
      userCount: 1
    },
    {
      id: 2,
      name: 'manager',
      displayName: 'Manager',
      description: 'Access to most features except system administration',
      permissions: [
        // Core Pages
        'dashboard', 'upload', 'cases', 'closed-cases', 'policy-timeline', 'logs', 'claims',
        // Email Pages
        'emails', 'email-dashboard', 'email-analytics', 'bulk-email',
        // Marketing Pages
        'campaigns', 'templates',
        // Survey Pages
        'feedback', 'survey-designer',
        // WhatsApp Pages
        'whatsapp-flow',
        // Personal Pages
        'profile'
        // Note: Excludes admin pages (settings, billing, users)
      ],
      isSystem: true,
      userCount: 1
    },
    {
      id: 3,
      name: 'agent',
      displayName: 'Agent',
      description: 'Access to case management and email features',
      permissions: [
        // Core Pages
        'dashboard', 'cases', 'closed-cases', 'policy-timeline', 'logs',
        // Email Pages
        'emails', 'email-dashboard',
        // Personal Pages
        'profile'
      ],
      isSystem: true,
      userCount: 1
    },
    {
      id: 4,
      name: 'viewer',
      displayName: 'Viewer',
      description: 'Read-only access to basic features',
      permissions: [
        // Core Pages (read-only)
        'dashboard', 'cases', 'closed-cases', 'policy-timeline',
        // Personal Pages
        'profile'
      ],
      isSystem: true,
      userCount: 1
    }
  ]);

  const [availablePermissions] = useState([
    // Core Insurance & Case Management Pages
    { id: 'dashboard', name: 'Dashboard', description: 'View main dashboard with analytics and overview', category: 'Core Pages', route: '/' },
    { id: 'upload', name: 'Upload Data', description: 'Upload policy and case data files', category: 'Core Pages', route: '/upload' },
    { id: 'cases', name: 'Case Tracking', description: 'View and manage active cases', category: 'Core Pages', route: '/cases' },
    { id: 'closed-cases', name: 'Closed Cases', description: 'View and manage closed cases', category: 'Core Pages', route: '/closed-cases' },
    { id: 'policy-timeline', name: 'Policy Timeline', description: 'View policy timeline and history', category: 'Core Pages', route: '/policy-timeline' },
    { id: 'logs', name: 'Case Logs', description: 'View system and case logs', category: 'Core Pages', route: '/logs' },
    { id: 'claims', name: 'Claims Management', description: 'Manage insurance claims processing', category: 'Core Pages', route: '/claims' },
    
    // Email Management Pages
    { id: 'emails', name: 'Email Inbox', description: 'Access email inbox and management', category: 'Email Pages', route: '/emails' },
    { id: 'email-dashboard', name: 'Email Dashboard', description: 'View email analytics and dashboard', category: 'Email Pages', route: '/emails/dashboard' },
    { id: 'email-analytics', name: 'Email Analytics', description: 'View detailed email analytics and reports', category: 'Email Pages', route: '/emails/analytics' },
    { id: 'bulk-email', name: 'Bulk Email', description: 'Send bulk emails and campaigns', category: 'Email Pages', route: '/emails/bulk' },
    
    // Campaign & Marketing Pages
    { id: 'campaigns', name: 'Campaigns', description: 'Manage marketing campaigns', category: 'Marketing Pages', route: '/campaigns' },
    { id: 'templates', name: 'Template Manager', description: 'Manage email and document templates', category: 'Marketing Pages', route: '/templates' },
    
    // Feedback & Survey Pages
    { id: 'feedback', name: 'Feedback & Surveys', description: 'Manage customer feedback and surveys', category: 'Survey Pages', route: '/feedback' },
    { id: 'survey-designer', name: 'Survey Designer', description: 'Create and design custom surveys', category: 'Survey Pages', route: '/survey-designer' },
    
    // WhatsApp Pages
    { id: 'whatsapp-flow', name: 'WhatsApp Flow', description: 'Manage automated WhatsApp messaging flows', category: 'Communication Pages', route: '/whatsapp-flow' },
    
    // Administration Pages
    { id: 'settings', name: 'Settings', description: 'Access system settings and configuration', category: 'Admin Pages', route: '/settings' },
    { id: 'billing', name: 'Billing', description: 'View billing information and invoices', category: 'Admin Pages', route: '/billing' },
    { id: 'users', name: 'User Management', description: 'Manage users and permissions', category: 'Admin Pages', route: '/users' },
    
    // Personal Pages
    { id: 'profile', name: 'Profile', description: 'Manage personal profile and account settings', category: 'Personal Pages', route: '/profile' }
  ]);

  // User Management Dialog States
  const [userDialog, setUserDialog] = useState({ open: false, user: null, mode: 'add' });
  const [roleDialog, setRoleDialog] = useState({ open: false, role: null, mode: 'add' });
  const [permissionDialog, setPermissionDialog] = useState({ open: false, user: null });
  const [resetRoleDialog, setResetRoleDialog] = useState({ open: false, role: null });
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    jobTitle: '',
    role: 'viewer',
    status: 'active',
    permissions: [],
    sendWelcomeEmail: true,
    requirePasswordChange: true
  });

  const [newRole, setNewRole] = useState({
    name: '',
    displayName: '',
    description: '',
    permissions: []
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Default role permissions for reset functionality
  const defaultRolePermissions = {
    admin: [
      // Core Pages
      'dashboard', 'upload', 'cases', 'closed-cases', 'policy-timeline', 'logs', 'claims',
      // Email Pages  
      'emails', 'email-dashboard', 'email-analytics', 'bulk-email',
      // Marketing Pages
      'campaigns', 'templates',
      // Survey Pages
      'feedback', 'survey-designer',
      // WhatsApp Pages
      'whatsapp-flow',
      // Admin Pages
      'settings', 'billing', 'users',
      // Personal Pages
      'profile'
    ],
    manager: [
      // Core Pages
      'dashboard', 'upload', 'cases', 'closed-cases', 'policy-timeline', 'logs', 'claims',
      // Email Pages
      'emails', 'email-dashboard', 'email-analytics', 'bulk-email',
      // Marketing Pages
      'campaigns', 'templates',
      // Survey Pages
      'feedback', 'survey-designer',
      // WhatsApp Pages
      'whatsapp-flow',
      // Personal Pages
      'profile'
    ],
    agent: [
      // Core Pages
      'dashboard', 'cases', 'closed-cases', 'policy-timeline', 'logs',
      // Email Pages
      'emails', 'email-dashboard',
      // WhatsApp Pages
      'whatsapp-flow',
      // Personal Pages
      'profile'
    ],
    viewer: [
      // Core Pages (read-only)
      'dashboard', 'cases', 'closed-cases', 'policy-timeline',
      // Personal Pages
      'profile'
    ]
  };

  const tabsConfig = useMemo(() => [
    { label: 'General', icon: <SettingsIcon /> },
    { label: 'Renewals', icon: <AutorenewIcon /> },
    { label: 'Email', icon: <EmailIcon /> },
    { label: 'Campaigns', icon: <CampaignIcon /> },
    { label: 'WhatsApp Flow', icon: <WhatsAppIcon /> },
    { label: 'Claims', icon: <GavelIcon /> },
    { label: 'Feedback', icon: <FeedbackIcon /> },
    { label: 'User Management', icon: <GroupIcon /> },
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

  const handleWhatsappSettingChange = (key, value) => {
    if (key.includes('.')) {
      const [parentKey, childKey] = key.split('.');
      setWhatsappSettings(prev => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [childKey]: value
        }
      }));
    } else {
      setWhatsappSettings(prev => ({ ...prev, [key]: value }));
    }
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

  // User Management Handlers
  const handleAddUser = () => {
    setUserDialog({ open: true, user: null, mode: 'add' });
    setNewUser({
      name: '',
      email: '',
      phone: '',
      department: '',
      jobTitle: '',
      role: 'viewer',
      status: 'active',
      permissions: [],
      sendWelcomeEmail: true,
      requirePasswordChange: true
    });
  };

  const handleEditUser = (user) => {
    setUserDialog({ open: true, user, mode: 'edit' });
    setNewUser({ 
      ...user,
      phone: user.phone || '',
      department: user.department || '',
      jobTitle: user.jobTitle || '',
      sendWelcomeEmail: user.sendWelcomeEmail || false,
      requirePasswordChange: user.requirePasswordChange || false
    });
  };

  const handleDeleteUser = (userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    setSuccessMessage('User deleted successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSaveUser = () => {
    if (userDialog.mode === 'add') {
      const newUserWithId = { 
        ...newUser, 
        id: Math.max(...users.map(u => u.id), 0) + 1,
        createdAt: new Date().toISOString(),
        lastLogin: null
      };
      setUsers(prev => [...prev, newUserWithId]);
      setSuccessMessage('User created successfully!');
    } else {
      setUsers(prev => prev.map(user => 
        user.id === userDialog.user.id ? { ...newUser } : user
      ));
      setSuccessMessage('User updated successfully!');
    }
    setUserDialog({ open: false, user: null, mode: 'add' });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleToggleUserStatus = (userId) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } : user
    ));
  };

  const handleAddRole = () => {
    setRoleDialog({ open: true, role: null, mode: 'add' });
    setNewRole({
      name: '',
      displayName: '',
      description: '',
      permissions: []
    });
  };

  const handleEditRole = (role) => {
    setRoleDialog({ open: true, role, mode: 'edit' });
    setNewRole({ ...role });
  };

  const handleDeleteRole = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    if (role.isSystem) {
      setSuccessMessage('System roles cannot be deleted');
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }
    if (role.userCount > 0) {
      setSuccessMessage('Cannot delete role with assigned users');
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }
    setRoles(prev => prev.filter(role => role.id !== roleId));
    setSuccessMessage('Role deleted successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSaveRole = () => {
    if (roleDialog.mode === 'add') {
      const newRoleWithId = { 
        ...newRole, 
        id: Math.max(...roles.map(r => r.id), 0) + 1,
        isSystem: false,
        userCount: 0
      };
      setRoles(prev => [...prev, newRoleWithId]);
      setSuccessMessage('Role created successfully!');
    } else {
      // When editing, preserve system properties and update the role
      const updatedRole = {
        ...newRole,
        id: roleDialog.role.id,
        isSystem: roleDialog.role.isSystem,
        userCount: roleDialog.role.userCount
      };
      
      setRoles(prev => prev.map(role => 
        role.id === roleDialog.role.id ? updatedRole : role
      ));
      
      // Update all users with this role to have the new permissions
      setUsers(prev => prev.map(user => 
        user.role === newRole.name ? { ...user, permissions: newRole.permissions } : user
      ));
      
      setSuccessMessage('Role updated successfully!');
    }
    setRoleDialog({ open: false, role: null, mode: 'add' });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleResetRole = (role) => {
    setResetRoleDialog({ open: true, role });
  };

  const handleConfirmResetRole = () => {
    const role = resetRoleDialog.role;
    if (role && defaultRolePermissions[role.name]) {
      const defaultPermissions = defaultRolePermissions[role.name];
      
      // Update the role with default permissions
      setRoles(prev => prev.map(r => 
        r.id === role.id ? { ...r, permissions: defaultPermissions } : r
      ));
      
      // Update all users with this role to have the default permissions
      setUsers(prev => prev.map(user => 
        user.role === role.name ? { ...user, permissions: defaultPermissions } : user
      ));
      
      setResetRoleDialog({ open: false, role: null });
      setSuccessMessage(`${role.displayName} role has been reset to default permissions.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleOpenPermissionDialog = (user) => {
    setSelectedUser(user);
    setPermissionDialog({ open: true, user });
  };

  const handleUpdateUserPermissions = (userId, permissions) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, permissions } : user
    ));
    setPermissionDialog({ open: false, user: null });
    setSuccessMessage('User permissions updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleRoleChange = (userId, newRole) => {
    const roleData = roles.find(r => r.name === newRole);
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole, permissions: roleData?.permissions || [] } : user
    ));
    setSuccessMessage('User role updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const getFilteredUsers = () => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(userSearchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  };

  const getRoleDisplayName = (roleName) => {
    const role = roles.find(r => r.name === roleName);
    return role ? role.displayName : roleName;
  };

  const getPermissionsByCategory = () => {
    const categories = {};
    availablePermissions.forEach(permission => {
      if (!categories[permission.category]) {
        categories[permission.category] = [];
      }
      categories[permission.category].push(permission);
    });
    return categories;
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

  // WhatsApp Flow Settings Tab
  const WhatsAppFlowSettingsTab = () => (
    <Box>
      <Typography variant="h5" fontWeight="600" gutterBottom>
        WhatsApp Flow Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure WhatsApp Business API, flow builder, templates, and automation settings
      </Typography>

      <Grid container spacing={3}>
        {/* API Configuration */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WhatsAppIcon sx={{ mr: 1, color: theme.palette.success.main }} />
                <Typography variant="h6" fontWeight="600">WhatsApp Business API</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number ID"
                    value={whatsappSettings.phoneNumberId}
                    onChange={(e) => handleWhatsappSettingChange('phoneNumberId', e.target.value)}
                    placeholder="Enter your WhatsApp Business Phone Number ID"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Access Token"
                    type="password"
                    value={whatsappSettings.accessToken}
                    onChange={(e) => handleWhatsappSettingChange('accessToken', e.target.value)}
                    placeholder="Enter your WhatsApp Business API Access Token"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Webhook URL"
                    value={whatsappSettings.webhookUrl}
                    onChange={(e) => handleWhatsappSettingChange('webhookUrl', e.target.value)}
                    placeholder="https://your-domain.com/webhook"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Verify Token"
                    value={whatsappSettings.verifyToken}
                    onChange={(e) => handleWhatsappSettingChange('verifyToken', e.target.value)}
                    placeholder="Enter webhook verify token"
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={whatsappSettings.businessApiEnabled}
                      onChange={(e) => handleWhatsappSettingChange('businessApiEnabled', e.target.checked)}
                      color="success"
                    />
                  }
                  label="Enable WhatsApp Business API"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Flow Builder Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Flow Builder</Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List disablePadding>
                <ListItem sx={{ borderRadius: 2, mb: 1 }}>
                  <ListItemText 
                    primary={<Typography fontWeight="500">Visual Flow Builder</Typography>}
                    secondary="Enable drag-and-drop flow creation"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={whatsappSettings.flowBuilderEnabled}
                      onChange={(e) => handleWhatsappSettingChange('flowBuilderEnabled', e.target.checked)}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem sx={{ borderRadius: 2, mb: 1 }}>
                  <ListItemText 
                    primary={<Typography fontWeight="500">Message Templates</Typography>}
                    secondary="Enable WhatsApp message templates"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={whatsappSettings.messageTemplatesEnabled}
                      onChange={(e) => handleWhatsappSettingChange('messageTemplatesEnabled', e.target.checked)}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem sx={{ borderRadius: 2, mb: 1 }}>
                  <ListItemText 
                    primary={<Typography fontWeight="500">Auto Response</Typography>}
                    secondary="Enable automatic responses"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={whatsappSettings.autoResponseEnabled}
                      onChange={(e) => handleWhatsappSettingChange('autoResponseEnabled', e.target.checked)}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem sx={{ borderRadius: 2 }}>
                  <ListItemText 
                    primary={<Typography fontWeight="500">Analytics & Reporting</Typography>}
                    secondary="Track flow performance and metrics"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={whatsappSettings.analyticsEnabled}
                      onChange={(e) => handleWhatsappSettingChange('analyticsEnabled', e.target.checked)}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Business Hours */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Business Hours</Typography>
              <Divider sx={{ mb: 2 }} />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={whatsappSettings.businessHours.enabled}
                    onChange={(e) => handleWhatsappSettingChange('businessHours.enabled', e.target.checked)}
                    color="primary"
                  />
                }
                label="Enable Business Hours"
                sx={{ mb: 2 }}
              />

              {whatsappSettings.businessHours.enabled && (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Start Time"
                      type="time"
                      value={whatsappSettings.businessHours.start}
                      onChange={(e) => handleWhatsappSettingChange('businessHours.start', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="End Time"
                      type="time"
                      value={whatsappSettings.businessHours.end}
                      onChange={(e) => handleWhatsappSettingChange('businessHours.end', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Timezone</InputLabel>
                      <Select
                        value={whatsappSettings.businessHours.timezone}
                        label="Timezone"
                        onChange={(e) => handleWhatsappSettingChange('businessHours.timezone', e.target.value)}
                      >
                        <MenuItem value="Asia/Kolkata">Asia/Kolkata (IST)</MenuItem>
                        <MenuItem value="America/New_York">America/New_York (EST)</MenuItem>
                        <MenuItem value="Europe/London">Europe/London (GMT)</MenuItem>
                        <MenuItem value="Asia/Dubai">Asia/Dubai (GST)</MenuItem>
                        <MenuItem value="Asia/Singapore">Asia/Singapore (SGT)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Message Settings */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Message Settings</Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Fallback Message"
                    value={whatsappSettings.fallbackMessage}
                    onChange={(e) => handleWhatsappSettingChange('fallbackMessage', e.target.value)}
                    placeholder="Message to send when flow fails or user input is invalid"
                    helperText="This message will be sent when automated flows encounter errors"
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Max Retries"
                    value={whatsappSettings.maxRetries}
                    onChange={(e) => handleWhatsappSettingChange('maxRetries', parseInt(e.target.value))}
                    inputProps={{ min: 1, max: 10 }}
                    helperText="Maximum retry attempts for failed messages"
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Retry Delay (seconds)"
                    value={whatsappSettings.retryDelay}
                    onChange={(e) => handleWhatsappSettingChange('retryDelay', parseInt(e.target.value))}
                    inputProps={{ min: 30, max: 3600 }}
                    helperText="Delay between retry attempts"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Rate Limiting */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Rate Limiting</Typography>
              <Divider sx={{ mb: 2 }} />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={whatsappSettings.rateLimiting.enabled}
                    onChange={(e) => handleWhatsappSettingChange('rateLimiting.enabled', e.target.checked)}
                    color="primary"
                  />
                }
                label="Enable Rate Limiting"
                sx={{ mb: 2 }}
              />

              {whatsappSettings.rateLimiting.enabled && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Messages per Minute"
                      value={whatsappSettings.rateLimiting.messagesPerMinute}
                      onChange={(e) => handleWhatsappSettingChange('rateLimiting.messagesPerMinute', parseInt(e.target.value))}
                      inputProps={{ min: 1, max: 100 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Messages per Hour"
                      value={whatsappSettings.rateLimiting.messagesPerHour}
                      onChange={(e) => handleWhatsappSettingChange('rateLimiting.messagesPerHour', parseInt(e.target.value))}
                      inputProps={{ min: 10, max: 10000 }}
                    />
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Integration Status */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Integration Status</Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List disablePadding>
                <ListItem sx={{ borderRadius: 2, mb: 1 }}>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography fontWeight="500">WhatsApp Business API</Typography>}
                    secondary="Connected and verified"
                  />
                </ListItem>
                
                <ListItem sx={{ borderRadius: 2, mb: 1 }}>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography fontWeight="500">Webhook Configuration</Typography>}
                    secondary="Active and receiving messages"
                  />
                </ListItem>

                <ListItem sx={{ borderRadius: 2, mb: 1 }}>
                  <ListItemIcon>
                    <WarningIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography fontWeight="500">Message Templates</Typography>}
                    secondary="2 templates pending approval"
                  />
                </ListItem>

                <ListItem sx={{ borderRadius: 2 }}>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography fontWeight="500">Flow Builder</Typography>}
                    secondary="Ready to create flows"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button
          variant="outlined"
          onClick={() => setWhatsappSettings({
            businessApiEnabled: true,
            webhookUrl: 'https://api.intelipro.com/webhooks/whatsapp',
            phoneNumberId: '',
            accessToken: '',
            verifyToken: 'whatsapp_verify_token_2024',
            messageTemplatesEnabled: true,
            flowBuilderEnabled: true,
            analyticsEnabled: true,
            autoResponseEnabled: true,
            businessHours: {
              enabled: true,
              start: '09:00',
              end: '18:00',
              timezone: 'Asia/Kolkata'
            },
            fallbackMessage: 'Thank you for your message. We will get back to you soon.',
            maxRetries: 3,
            retryDelay: 300,
            rateLimiting: {
              enabled: true,
              messagesPerMinute: 60,
              messagesPerHour: 1000
            }
          })}
          sx={{ borderRadius: 2 }}
        >
          Reset to Defaults
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            handleSaveSettings();
            setSuccessMessage('WhatsApp Flow settings saved successfully!');
          }}
          startIcon={<SaveIcon />}
          sx={{ borderRadius: 2 }}
        >
          Save WhatsApp Settings
        </Button>
      </Box>
    </Box>
  );

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

  // Feedback Settings Tab
  const FeedbackSettingsTab = () => (
    <Box>
      <Typography variant="h5" fontWeight="600" gutterBottom>
        Feedback & Surveys Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure feedback collection, survey preferences, and integrations
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>General Settings</Typography>
              <Divider sx={{ mb: 2 }} />
              <List disablePadding>
                <ListItem sx={{ borderRadius: 2, mb: 1 }}>
                  <ListItemText 
                    primary={<Typography fontWeight="500">Default Survey Language</Typography>}
                    secondary="Language for new surveys and feedback forms"
                  />
                  <ListItemSecondaryAction>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={settings.feedbackLanguage || 'en-US'}
                        onChange={(e) => handleSettingChange('feedbackLanguage', e.target.value)}
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="en-US">English (US)</MenuItem>
                        <MenuItem value="en-GB">English (UK)</MenuItem>
                        <MenuItem value="es">Spanish</MenuItem>
                        <MenuItem value="fr">French</MenuItem>
                        <MenuItem value="de">German</MenuItem>
                      </Select>
                    </FormControl>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem sx={{ borderRadius: 2, mb: 1 }}>
                  <ListItemText 
                    primary={<Typography fontWeight="500">Data Retention Period</Typography>}
                    secondary="How long to keep feedback and survey responses"
                  />
                  <ListItemSecondaryAction>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={settings.feedbackRetention || 24}
                        onChange={(e) => handleSettingChange('feedbackRetention', e.target.value)}
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value={12}>12 months</MenuItem>
                        <MenuItem value={24}>24 months</MenuItem>
                        <MenuItem value={36}>36 months</MenuItem>
                        <MenuItem value={60}>5 years</MenuItem>
                      </Select>
                    </FormControl>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem sx={{ borderRadius: 2 }}>
                  <ListItemText 
                    primary={<Typography fontWeight="500">Auto-Archive Responses</Typography>}
                    secondary="Automatically archive old survey responses"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.autoArchiveFeedback !== false}
                      onChange={(e) => handleSettingChange('autoArchiveFeedback', e.target.checked)}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Notifications</Typography>
              <Divider sx={{ mb: 2 }} />
              <List disablePadding>
                <ListItem sx={{ borderRadius: 2, mb: 1 }}>
                  <ListItemText 
                    primary={<Typography fontWeight="500">Email Notifications</Typography>}
                    secondary="Receive alerts for new feedback submissions"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.feedbackEmailNotifications !== false}
                      onChange={(e) => handleSettingChange('feedbackEmailNotifications', e.target.checked)}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem sx={{ borderRadius: 2, mb: 1 }}>
                  <ListItemText 
                    primary={<Typography fontWeight="500">SMS Alerts</Typography>}
                    secondary="Critical feedback notifications via SMS"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.feedbackSmsAlerts === true}
                      onChange={(e) => handleSettingChange('feedbackSmsAlerts', e.target.checked)}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem sx={{ borderRadius: 2, mb: 1 }}>
                  <ListItemText 
                    primary={<Typography fontWeight="500">Weekly Reports</Typography>}
                    secondary="Automated feedback summary emails"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.feedbackWeeklyReports !== false}
                      onChange={(e) => handleSettingChange('feedbackWeeklyReports', e.target.checked)}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem sx={{ borderRadius: 2 }}>
                  <ListItemText 
                    primary={<Typography fontWeight="500">Real-time Alerts</Typography>}
                    secondary="Instant notifications for negative feedback"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.feedbackRealTimeAlerts === true}
                      onChange={(e) => handleSettingChange('feedbackRealTimeAlerts', e.target.checked)}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Integrations</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#4A154B', mx: 'auto', mb: 1 }}>
                        <Typography variant="h6" color="white">S</Typography>
                      </Avatar>
                    </Box>
                    <Typography variant="h6" gutterBottom>Slack</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Send feedback notifications to Slack channels
                    </Typography>
                    <Button 
                      variant={settings.slackIntegration ? "contained" : "outlined"} 
                      fullWidth
                      onClick={() => handleSettingChange('slackIntegration', !settings.slackIntegration)}
                    >
                      {settings.slackIntegration ? "Connected" : "Connect"}
                    </Button>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#00A1C9', mx: 'auto', mb: 1 }}>
                        <Typography variant="h6" color="white">SF</Typography>
                      </Avatar>
                    </Box>
                    <Typography variant="h6" gutterBottom>Salesforce</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Sync customer feedback with CRM records
                    </Typography>
                    <Button 
                      variant={settings.salesforceIntegration ? "contained" : "outlined"} 
                      fullWidth
                      onClick={() => handleSettingChange('salesforceIntegration', !settings.salesforceIntegration)}
                    >
                      {settings.salesforceIntegration ? "Connected" : "Connect"}
                    </Button>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#FF7A59', mx: 'auto', mb: 1 }}>
                        <Typography variant="h6" color="white">H</Typography>
                      </Avatar>
                    </Box>
                    <Typography variant="h6" gutterBottom>HubSpot</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Integrate with marketing automation workflows
                    </Typography>
                    <Button 
                      variant={settings.hubspotIntegration ? "contained" : "outlined"} 
                      fullWidth
                      onClick={() => handleSettingChange('hubspotIntegration', !settings.hubspotIntegration)}
                    >
                      {settings.hubspotIntegration ? "Connected" : "Connect"}
                    </Button>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#FF4A00', mx: 'auto', mb: 1 }}>
                        <Typography variant="h6" color="white">Z</Typography>
                      </Avatar>
                    </Box>
                    <Typography variant="h6" gutterBottom>Zapier</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Connect feedback to 1000+ apps and services
                    </Typography>
                    <Button 
                      variant={settings.zapierIntegration ? "contained" : "outlined"} 
                      fullWidth
                      onClick={() => handleSettingChange('zapierIntegration', !settings.zapierIntegration)}
                    >
                      {settings.zapierIntegration ? "Connected" : "Connect"}
                    </Button>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Survey Automation</Typography>
              <Divider sx={{ mb: 2 }} />
              <List disablePadding>
                <ListItem sx={{ borderRadius: 2, mb: 1 }}>
                  <ListItemText 
                    primary={<Typography fontWeight="500">Auto-send Post-Purchase Surveys</Typography>}
                    secondary="Automatically send satisfaction surveys after policy purchases"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.autoPostPurchaseSurvey === true}
                      onChange={(e) => handleSettingChange('autoPostPurchaseSurvey', e.target.checked)}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem sx={{ borderRadius: 2, mb: 1 }}>
                  <ListItemText 
                    primary={<Typography fontWeight="500">Follow-up Reminders</Typography>}
                    secondary="Send reminders for incomplete survey responses"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.surveyReminders !== false}
                      onChange={(e) => handleSettingChange('surveyReminders', e.target.checked)}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem sx={{ borderRadius: 2 }}>
                  <ListItemText 
                    primary={<Typography fontWeight="500">Smart Response Routing</Typography>}
                    secondary="Automatically route negative feedback to support team"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.smartRouting === true}
                      onChange={(e) => handleSettingChange('smartRouting', e.target.checked)}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // User Management Tab
  const UserManagementTab = () => {
    const filteredUsers = getFilteredUsers();
    const permissionCategories = getPermissionsByCategory();

    return (
      <Box>
        <Typography variant="h5" fontWeight="600" gutterBottom>
          User Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Manage users, roles, and permissions for your organization.
        </Typography>

        {/* Users Section */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)', mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="600">
                Users ({filteredUsers.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddUser}
                sx={{ borderRadius: 2 }}
              >
                Add User
              </Button>
            </Box>

            {/* Filters */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search users..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    label="Role"
                  >
                    <MenuItem value="all">All Roles</MenuItem>
                    {roles.map(role => (
                      <MenuItem key={role.id} value={role.name}>{role.displayName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Users Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Permissions</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                            {user.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="500">
                              {user.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {user.email}
                            </Typography>
                            {user.jobTitle && (
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                {user.jobTitle}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {user.department ? user.department.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not specified'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            variant="outlined"
                          >
                            {roles.map(role => (
                              <MenuItem key={role.id} value={role.name}>
                                {role.displayName}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          color={user.status === 'active' ? 'success' : 'default'}
                          size="small"
                          onClick={() => handleToggleUserStatus(user.id)}
                          sx={{ cursor: 'pointer' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleOpenPermissionDialog(user)}
                          sx={{ borderRadius: 2 }}
                        >
                          {user.permissions.length} permissions
                        </Button>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleEditUser(user)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteUser(user.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Roles Section */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="600">
                Roles & Permissions
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddRole}
                sx={{ borderRadius: 2 }}
              >
                Create Role
              </Button>
            </Box>

            <Grid container spacing={3}>
              {roles.map((role) => (
                <Grid item xs={12} md={6} key={role.id}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      borderRadius: 2,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" fontWeight="600">
                            {role.displayName}
                            {role.isSystem && (
                              <Chip 
                                label="System" 
                                size="small" 
                                color="primary" 
                                sx={{ ml: 1 }} 
                              />
                            )}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {role.description}
                          </Typography>
                        </Box>
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => handleEditRole(role)}
                            sx={{ mr: 1 }}
                            title={role.isSystem ? "Edit system role" : "Edit role"}
                          >
                            <EditIcon />
                          </IconButton>
                          {!role.isSystem && (
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteRole(role.id)}
                              color="error"
                              title="Delete role"
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                          {role.isSystem && (
                            <IconButton
                              size="small"
                              onClick={() => handleResetRole(role)}
                              color="warning"
                              title="Reset to default permissions"
                            >
                              <RestoreIcon />
                            </IconButton>
                          )}
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {role.userCount} user(s) • {role.permissions.length} permissions
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {role.permissions.slice(0, 5).map((permission) => {
                          const permData = availablePermissions.find(p => p.id === permission);
                          return (
                            <Chip
                              key={permission}
                              label={permData?.name || permission}
                              size="small"
                              variant="outlined"
                            />
                          );
                        })}
                        {role.permissions.length > 5 && (
                          <Chip
                            label={`+${role.permissions.length - 5} more`}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* User Dialog */}
        <Dialog open={userDialog.open} onClose={() => setUserDialog({ open: false, user: null, mode: 'add' })} maxWidth="md" fullWidth>
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon color="primary" />
              <Typography variant="h6" fontWeight="600">
                {userDialog.mode === 'add' ? 'Add New User' : 'Edit User'}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {userDialog.mode === 'add' 
                ? 'Create a new user account with appropriate permissions and access levels.'
                : 'Update user information and access permissions.'
              }
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Personal Information Section */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="600" color="primary" sx={{ mb: 2 }}>
                  Personal Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                  helperText="Enter the user's full name"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                  helperText="Primary email for login and notifications"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  helperText="Contact phone number (optional)"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Job Title"
                  value={newUser.jobTitle}
                  onChange={(e) => setNewUser({ ...newUser, jobTitle: e.target.value })}
                  helperText="User's position or role title"
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    label="Department"
                  >
                    <MenuItem value="">Select Department</MenuItem>
                    <MenuItem value="claims">Claims Processing</MenuItem>
                    <MenuItem value="underwriting">Underwriting</MenuItem>
                    <MenuItem value="customer_service">Customer Service</MenuItem>
                    <MenuItem value="sales">Sales & Marketing</MenuItem>
                    <MenuItem value="it">Information Technology</MenuItem>
                    <MenuItem value="finance">Finance & Accounting</MenuItem>
                    <MenuItem value="legal">Legal & Compliance</MenuItem>
                    <MenuItem value="management">Management</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Access & Permissions Section */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="600" color="primary" sx={{ mb: 2, mt: 2 }}>
                  Access & Permissions
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={newUser.role}
                    onChange={(e) => {
                      const selectedRole = roles.find(r => r.name === e.target.value);
                      setNewUser({ 
                        ...newUser, 
                        role: e.target.value,
                        permissions: selectedRole?.permissions || []
                      });
                    }}
                    label="Role"
                  >
                    {roles.map(role => (
                      <MenuItem key={role.id} value={role.name}>
                        <Box>
                          <Typography variant="body2" fontWeight="500">
                            {role.displayName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {role.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Account Status</InputLabel>
                  <Select
                    value={newUser.status}
                    onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                    label="Account Status"
                  >
                    <MenuItem value="active">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                        Active
                      </Box>
                    </MenuItem>
                    <MenuItem value="inactive">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'grey.400' }} />
                        Inactive
                      </Box>
                    </MenuItem>
                    <MenuItem value="pending">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main' }} />
                        Pending Activation
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Security Options Section */}
              {userDialog.mode === 'add' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="600" color="primary" sx={{ mb: 2, mt: 2 }}>
                      Security Options
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={newUser.sendWelcomeEmail}
                          onChange={(e) => setNewUser({ ...newUser, sendWelcomeEmail: e.target.checked })}
                          color="primary"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" fontWeight="500">
                            Send Welcome Email
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Send login credentials and welcome information to the user's email
                          </Typography>
                        </Box>
                      }
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={newUser.requirePasswordChange}
                          onChange={(e) => setNewUser({ ...newUser, requirePasswordChange: e.target.checked })}
                          color="primary"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" fontWeight="500">
                            Require Password Change on First Login
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Force user to change their password when they first log in
                          </Typography>
                        </Box>
                      }
                    />
                  </Grid>
                </>
              )}

              {/* Permission Preview */}
              {newUser.permissions.length > 0 && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="600" color="primary" sx={{ mb: 2, mt: 2 }}>
                      Permission Preview ({newUser.permissions.length} permissions)
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {newUser.permissions.slice(0, 8).map((permission) => {
                        const permData = availablePermissions.find(p => p.id === permission);
                        return (
                          <Chip
                            key={permission}
                            label={permData?.name || permission}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        );
                      })}
                      {newUser.permissions.length > 8 && (
                        <Chip
                          label={`+${newUser.permissions.length - 8} more`}
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
                      )}
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            <Button 
              onClick={() => setUserDialog({ open: false, user: null, mode: 'add' })}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSaveUser}
              disabled={!newUser.name || !newUser.email}
              startIcon={userDialog.mode === 'add' ? <AddIcon /> : <EditIcon />}
              sx={{ borderRadius: 2, minWidth: 140 }}
            >
              {userDialog.mode === 'add' ? 'Create User' : 'Update User'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Role Dialog */}
        <Dialog open={roleDialog.open} onClose={() => setRoleDialog({ open: false, role: null, mode: 'add' })} maxWidth="md" fullWidth>
          <DialogTitle>
            {roleDialog.mode === 'add' ? 'Create New Role' : 'Edit Role'}
          </DialogTitle>
          <DialogContent>
            {roleDialog.mode === 'edit' && roleDialog.role?.isSystem && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>System Role:</strong> You are editing a predefined system role. 
                  Changes will affect all users assigned to this role. You can use the "Reset" button 
                  to restore default permissions if needed.
                </Typography>
              </Alert>
            )}
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Role Name"
                  value={newRole.displayName}
                  onChange={(e) => setNewRole({ 
                    ...newRole, 
                    displayName: e.target.value,
                    name: e.target.value.toLowerCase().replace(/\s+/g, '_')
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Role ID"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  disabled={roleDialog.mode === 'edit'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                  Permissions
                </Typography>
                {Object.entries(getPermissionsByCategory()).map(([category, permissions]) => (
                  <Box key={category} sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                      {category}
                    </Typography>
                    <Grid container spacing={1}>
                      {permissions.map((permission) => (
                        <Grid item xs={12} sm={6} md={4} key={permission.id}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={newRole.permissions.includes(permission.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewRole({
                                      ...newRole,
                                      permissions: [...newRole.permissions, permission.id]
                                    });
                                  } else {
                                    setNewRole({
                                      ...newRole,
                                      permissions: newRole.permissions.filter(p => p !== permission.id)
                                    });
                                  }
                                }}
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="body2" fontWeight="500">
                                  {permission.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {permission.description}
                                </Typography>
                              </Box>
                            }
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ))}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRoleDialog({ open: false, role: null, mode: 'add' })}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSaveRole}
              disabled={!newRole.displayName || !newRole.name}
            >
              {roleDialog.mode === 'add' ? 'Create Role' : 'Update Role'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Permission Dialog */}
        <Dialog open={permissionDialog.open} onClose={() => setPermissionDialog({ open: false, user: null })} maxWidth="md" fullWidth>
          <DialogTitle>
            Manage Permissions - {selectedUser?.name}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select the specific permissions for this user. These will override the default role permissions.
            </Typography>
            {Object.entries(getPermissionsByCategory()).map(([category, permissions]) => (
              <Box key={category} sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                  {category}
                </Typography>
                <Grid container spacing={1}>
                  {permissions.map((permission) => (
                    <Grid item xs={12} sm={6} md={4} key={permission.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedUser?.permissions.includes(permission.id) || false}
                            onChange={(e) => {
                              if (!selectedUser) return;
                              const newPermissions = e.target.checked
                                ? [...selectedUser.permissions, permission.id]
                                : selectedUser.permissions.filter(p => p !== permission.id);
                              setSelectedUser({ ...selectedUser, permissions: newPermissions });
                            }}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2" fontWeight="500">
                              {permission.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {permission.description}
                            </Typography>
                          </Box>
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPermissionDialog({ open: false, user: null })}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={() => handleUpdateUserPermissions(selectedUser?.id, selectedUser?.permissions)}
            >
              Update Permissions
            </Button>
          </DialogActions>
        </Dialog>

        {/* Reset Role Confirmation Dialog */}
        <Dialog 
          open={resetRoleDialog.open} 
          onClose={() => setResetRoleDialog({ open: false, role: null })}
          maxWidth="sm" 
          fullWidth
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon color="warning" />
              <Typography variant="h6" fontWeight="600">
                Reset Role to Default
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Are you sure you want to reset the <strong>{resetRoleDialog.role?.displayName}</strong> role to its default permissions?
            </Typography>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                This action will:
              </Typography>
              <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
                <li>Reset all permissions for this role to system defaults</li>
                <li>Update permissions for all users assigned to this role</li>
                <li>Cannot be undone</li>
              </Box>
            </Alert>
            {resetRoleDialog.role && defaultRolePermissions[resetRoleDialog.role.name] && (
              <Box>
                <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
                  Default permissions ({defaultRolePermissions[resetRoleDialog.role.name].length}):
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {defaultRolePermissions[resetRoleDialog.role.name].slice(0, 6).map((permission) => {
                    const permData = availablePermissions.find(p => p.id === permission);
                    return (
                      <Chip
                        key={permission}
                        label={permData?.name || permission}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    );
                  })}
                  {defaultRolePermissions[resetRoleDialog.role.name].length > 6 && (
                    <Chip
                      label={`+${defaultRolePermissions[resetRoleDialog.role.name].length - 6} more`}
                      size="small"
                      variant="outlined"
                      color="secondary"
                    />
                  )}
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            <Button 
              onClick={() => setResetRoleDialog({ open: false, role: null })}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="warning"
              onClick={handleConfirmResetRole}
              startIcon={<RestoreIcon />}
              sx={{ borderRadius: 2, minWidth: 140 }}
            >
              Reset Role
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

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
              <WhatsAppFlowSettingsTab />
            </TabPanel>
            <TabPanel value={tabValue} index={5}>
              <ModuleSettingsTab moduleName="Claims" icon={<GavelIcon sx={{ color: theme.palette.primary.main }} />} />
            </TabPanel>
            <TabPanel value={tabValue} index={6}>
              <FeedbackSettingsTab />
            </TabPanel>
            <TabPanel value={tabValue} index={7}>
              <UserManagementTab />
            </TabPanel>
            <TabPanel value={tabValue} index={8}>
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