import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, Box, Drawer, Toolbar, Typography, Divider, 
  List, ListItem, ListItemIcon, ListItemText, IconButton,
  Avatar, Menu, MenuItem, Tooltip, Badge, useTheme,
  ListItemButton, styled, Button, Collapse, Fab, Dialog, 
  DialogTitle, DialogContent, DialogActions, TextField, 
  InputAdornment, CircularProgress, Paper, Chip, Alert
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Dashboard as DashboardIcon, 
  CloudUpload as UploadIcon,
  ExitToApp as LogoutIcon,
  AccountCircle as ProfileIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Assignment as AssignmentIcon,
  Update as UpdateIcon,
  Info as InfoIcon,

  Timeline as TimelineIcon,
  DoneAll as DoneAllIcon,
  Description as DocumentIcon,
  Alarm as ReminderIcon,
  Assessment as ReportIcon,
  Person as PersonIcon,
  List as ListIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Receipt as ReceiptIcon,
  Group as GroupIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Autorenew as AutorenewIcon,
  Email as EmailIcon,
  Campaign as CampaignIcon,
  Feedback as FeedbackIcon,
  Gavel as GavelIcon,
  WhatsApp as WhatsAppIcon,
  SmartToy as AskAIIcon,
  Send as SendIcon,
  Close as CloseIcon,
  Build as PolicyServicingIcon,
  BusinessCenter as NewBusinessIcon,
  LocalHospital as MedicalManagementIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext.js';
import { useThemeMode } from '../../context/ThemeModeContext.js';
import { useNotifications } from '../../context/NotificationsContext.js';
import { usePermissions } from '../../context/PermissionsContext.jsx';
import NotificationsDialog from '../notifications/Notifications';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { initializeRenewalAgent, sendMessage } from '../../services/iRenewalAI';

const drawerWidth = 260;

// Styled components for modern navigation
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  '&.Mui-selected': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(144, 202, 249, 0.16)' 
      : 'rgba(25, 118, 210, 0.08)',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(144, 202, 249, 0.24)' 
        : 'rgba(25, 118, 210, 0.12)',
    },
  },
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.08)' 
      : 'rgba(0, 0, 0, 0.04)',
  },
}));

const Layout = ({ children }) => {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [notificationsDialogOpen, setNotificationsDialogOpen] = useState(false);
  const [renewalMenuOpen, setRenewalMenuOpen] = useState(true);
  const [emailMenuOpen, setEmailMenuOpen] = useState(true);
  const [askAIOpen, setAskAIOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [, setAiResponse] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);
  const [agentInitialized, setAgentInitialized] = useState(false);
  const [agentError, setAgentError] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [, setIsStreaming] = useState(false);
  const [aiSuggestions] = useState([
    "Analyze my current renewal portfolio performance",
    "What strategies can improve my renewal rates?", 
    "How can I optimize my digital channel performance?",
    "What are the key bottlenecks in my renewal process?",
    "Provide insights on my premium collection efficiency",
    "How can I reduce customer churn this quarter?",
    "What predictive insights do you see in my data?"
  ]);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { hasPermission, hasModuleAccess } = usePermissions();
  const { t } = useTranslation();

  // Initialize AI agent on component mount
  useEffect(() => {
    const initializeAgent = async () => {
      try {
        await initializeRenewalAgent();
        setAgentInitialized(true);
        setAgentError('');
      } catch (error) {
        console.error('Failed to initialize AI agent:', error);
        setAgentError(`Failed to initialize AI: ${error.message}`);
        setAgentInitialized(false);
      }
    };

    initializeAgent();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchorEl(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };
  
  const handleOpenNotificationsDialog = () => {
    handleNotificationsClose();
    setNotificationsDialogOpen(true);
  };
  
  const handleCloseNotificationsDialog = () => {
    setNotificationsDialogOpen(false);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleRenewalMenuClick = () => {
    setRenewalMenuOpen(!renewalMenuOpen);
  };

  const handleEmailMenuClick = () => {
    setEmailMenuOpen(!emailMenuOpen);
  };

  const handleAskAI = () => {
    setAskAIOpen(true);
  };

  const handleCloseAskAI = () => {
    setAskAIOpen(false);
    setAiQuery('');
    setAiResponse('');
    setIsAILoading(false);
    setIsStreaming(false);
    setChatHistory([]);
  };

  const handleSendAIQuery = async () => {
    if (!aiQuery.trim() || !agentInitialized) return;
    
    setIsAILoading(true);
    setIsStreaming(true);
    
    // Add user message to chat history
    const userMessage = { type: 'user', content: aiQuery, timestamp: new Date() };
    const aiMessage = { type: 'ai', content: '', timestamp: new Date(), streaming: true };
    
    setChatHistory(prev => [...prev, userMessage, aiMessage]);
    
    // Clear the input
    const currentQuery = aiQuery;
    setAiQuery('');
    
    try {
      // Filter chat history to only include user and AI messages for context
      const contextForAI = chatHistory.filter(msg => msg.type === 'user' || msg.type === 'ai');
      
      // Get current page context
      const currentPath = location.pathname;
      const pageContext = getPageContext(currentPath);
      
      // Get dashboard data for context (mock data for now)
      const dashboardData = {
        totalCases: 1250,
        inProgress: 470,
        renewed: 780,
        pendingAction: 125,
        collectionRate: 81.0,
        digitalUsage: 75,
        period: 'Q4 2024'
      };
      
      // Enhanced query with page and dashboard context
      const contextualQuery = `
CURRENT PAGE CONTEXT:
Page: ${pageContext.name}
Context: ${pageContext.context}
Focus Area: ${pageContext.focus}

USER QUERY: ${currentQuery}

Please provide a response specifically relevant to the ${pageContext.name} page context. Focus on ${pageContext.focus}.`;
      
      const response = await sendMessage(contextualQuery, contextForAI, (chunk, fullContent) => {
        // Update the last AI message with streaming content
        setChatHistory(prev => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          if (updated[lastIndex] && updated[lastIndex].type === 'ai') {
            updated[lastIndex] = {
              ...updated[lastIndex],
              content: fullContent,
              streaming: true
            };
          }
          return updated;
        });
      }, pageContext, dashboardData);
      
      // Mark streaming as complete
      setChatHistory(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex] && updated[lastIndex].type === 'ai') {
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: response.message.content,
            streaming: false
          };
        }
        return updated;
      });
      
      setAiResponse(response.message.content);
      
    } catch (error) {
      console.error('AI query failed:', error);
      const errorMessage = `Error: ${error.message}`;
      setAiResponse(errorMessage);
      
      // Update the last AI message with error
      setChatHistory(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex] && updated[lastIndex].type === 'ai') {
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: errorMessage,
            streaming: false
          };
        }
        return updated;
      });
    } finally {
      setIsAILoading(false);
      setIsStreaming(false);
    }
  };

  // Get page context information based on current location
  const getPageContext = (pathname) => {
    const pageContexts = {
      '/dashboard': {
        name: 'Dashboard',
        context: 'renewal performance overview, key metrics, and high-level insights',
        focus: 'overall portfolio performance, trends, and strategic recommendations'
      },
      '/upload': {
        name: 'Upload',
        context: 'file uploads, data processing, and document management',
        focus: 'data integrity, processing efficiency, and document organization'
      },
      '/cases': {
        name: 'Case Tracking',
        context: 'individual case management, status tracking, and workflow optimization',
        focus: 'case progression, bottlenecks, and process improvements'
      },
      '/closed-cases': {
        name: 'Closed Cases',
        context: 'archived cases, historical data, and performance analysis',
        focus: 'case history, performance metrics, and lessons learned'
      },
      '/policy-timeline': {
        name: 'Policy Timeline',
        context: 'policy lifecycle, renewal timing, and customer journey mapping',
        focus: 'policy progression, renewal timing, and customer experience'
      },
      '/logs': {
        name: 'Case Logs',
        context: 'detailed activity logs, system events, and operational data',
        focus: 'audit trails, troubleshooting, and performance monitoring'
      },
      '/renewals/email-manager': {
        name: 'Email Manager',
        context: 'email campaigns, communication strategies, and engagement metrics',
        focus: 'email effectiveness, open rates, and customer communication'
      },
      '/renewals/whatsapp-manager': {
        name: 'WhatsApp Manager',
        context: 'WhatsApp messaging, automated flows, and customer engagement',
        focus: 'messaging effectiveness, delivery rates, and conversation optimization'
      },
      '/email': {
        name: 'Email Dashboard',
        context: 'email performance metrics, inbox management, and communication analytics',
        focus: 'email campaign performance, response rates, and customer engagement'
      },
      '/whatsapp-flow': {
        name: 'WhatsApp Flow',
        context: 'WhatsApp automation, flow building, and message templates',
        focus: 'conversation flows, automation efficiency, and customer experience'
      },
      '/campaigns': {
        name: 'Campaign Management',
        context: 'marketing campaigns, performance tracking, and ROI analysis',
        focus: 'campaign effectiveness, conversion rates, and optimization strategies'
      },
      '/billing': {
        name: 'Billing',
        context: 'payment processing, collection rates, and financial management',
        focus: 'payment efficiency, collection optimization, and financial insights'
      }
    };

    return pageContexts[pathname] || {
      name: 'Renewal Management',
      context: 'general renewal management and insurance operations',
      focus: 'renewal optimization and customer retention strategies'
    };
  };

  const handleSuggestionClick = (suggestion) => {
    setAiQuery(suggestion);
    setTimeout(() => {
      handleSendAIQuery();
    }, 100);
  };

  // Function to render text with inline formatting (bold, etc.)
  const renderTextWithFormatting = (text) => {
    if (!text) return '';
    
    // Split text by ** markers to handle bold formatting
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    
    return parts.map((part, index) => {
      // Check if this part is bold (wrapped in **)
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        const boldText = part.replace(/^\*\*|\*\*$/g, '');
        // Only render as bold if there's actual content
        if (boldText.trim()) {
          return (
            <Box
              key={index}
              component="span"
              sx={{ 
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              {boldText}
            </Box>
          );
        }
      }
      
      // Regular text - filter out empty parts
      return part || null;
    }).filter(Boolean); // Remove null/empty elements
  };

  // Check if current page is renewal-related
  const isRenewalRelatedPage = () => {
    const renewalPaths = ['/dashboard/renewals', '/upload', '/cases', '/closed-cases', '/policy-timeline', '/logs'];
    return renewalPaths.some(path => location.pathname.startsWith(path));
  };

  // Helper function to determine if an email menu item should be selected
  const isEmailMenuItemSelected = (itemPath) => {
    if (itemPath === '/emails/dashboard') {
      return location.pathname === '/emails/dashboard';
    } else if (itemPath === '/emails/analytics') {
      return location.pathname === '/emails/analytics';
    } else if (itemPath === '/emails/bulk') {
      return location.pathname === '/emails/bulk';
    } else if (itemPath === '/emails') {
      // Select Email Inbox for /emails and email detail routes only
      return location.pathname === '/emails' || 
             location.pathname.startsWith('/emails/detail/');
    }
    return location.pathname === itemPath;
  };

  // Define all menu modules with strict permission checking
  const menuModules = {
    business: {
      items: [
        { text: 'Claims', icon: <GavelIcon />, path: '/claims', permission: 'claims' },
        { text: 'Policy Servicing', icon: <PolicyServicingIcon />, path: '/policy-servicing', permission: 'policy-servicing' },
        { text: 'New Business', icon: <NewBusinessIcon />, path: '/new-business', permission: 'new-business' },
        { text: 'Medical Mgmt', icon: <MedicalManagementIcon />, path: '/medical-management', permission: 'medical-management' },
      ],
      permissions: ['claims', 'policy-servicing', 'new-business', 'medical-management']
    },
    marketing: {
      items: [
        { text: t('navigation.campaigns'), icon: <CampaignIcon />, path: '/campaigns', permission: 'campaigns' },
      ],
      permissions: ['campaigns', 'templates']
    },
    survey: {
      items: [
        { text: 'Feedback & Surveys', icon: <FeedbackIcon />, path: '/feedback', permission: 'feedback' },
      ],
      permissions: ['feedback', 'survey-designer']
    },
    whatsapp: {
      items: [
        { text: t('navigation.whatsapp'), icon: <WhatsAppIcon />, path: '/whatsapp-flow', permission: 'whatsapp-flow' },
      ],
      permissions: ['whatsapp-flow']
    }
  };

  // Filter menu items based on strict permission checking
  const menuItems = Object.values(menuModules)
    .flatMap(module => module.items)
    .filter(item => hasPermission(item.permission));

  const renewalMenuItems = [
    { text: t('navigation.dashboard'), icon: <DashboardIcon />, path: '/dashboard/renewals', permission: 'dashboard' },
    { text: 'Upload', icon: <UploadIcon />, path: '/upload', permission: 'upload' },
    { text: 'Case Tracking', icon: <AssignmentIcon />, path: '/cases', permission: 'cases' },
    { text: 'Closed Cases', icon: <AssignmentTurnedInIcon />, path: '/closed-cases', permission: 'closed-cases' },
    { text: 'Policy Timeline', icon: <TimelineIcon />, path: '/policy-timeline', permission: 'policy-timeline' },
    { text: 'Case Logs', icon: <ListIcon />, path: '/logs', permission: 'logs' },
    { text: 'Email Manager', icon: <EmailIcon />, path: '/renewals/email-manager', permission: 'renewal-email-manager' },
    { text: 'WhatsApp Manager', icon: <WhatsAppIcon />, path: '/renewals/whatsapp-manager', permission: 'renewal-whatsapp-manager' },
  ].filter(item => hasPermission(item.permission));

  const emailMenuItems = [
    { text: t('navigation.email') + ' Dashboard', icon: <DashboardIcon />, path: '/emails/dashboard', permission: 'email-dashboard' },
    { text: t('navigation.email') + ' Inbox', icon: <EmailIcon />, path: '/emails', permission: 'emails' },
    { text: 'Bulk ' + t('navigation.email'), icon: <CampaignIcon />, path: '/emails/bulk', permission: 'bulk-email' },
    { text: t('navigation.email') + ' Analytics', icon: <ReportIcon />, path: '/emails/analytics', permission: 'email-analytics' },
  ].filter(item => hasPermission(item.permission));

  const secondaryMenuItems = [
    { text: t('navigation.profile'), icon: <PersonIcon />, path: '/profile', permission: 'profile' },
    { text: t('navigation.settings'), icon: <SettingsIcon />, path: '/settings', permission: 'settings' },
    { text: 'Billing', icon: <ReceiptIcon />, path: '/billing', permission: 'billing' },
    { text: t('navigation.users'), icon: <GroupIcon />, path: '/users', permission: 'users' },
  ].filter(item => hasPermission(item.permission));

  const drawer = (
    <div>
      <DrawerHeader>
        <Typography variant="h6" sx={{ flexGrow: 1, ml: 2, fontWeight: 600 }}>
          Intelipro
        </Typography>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List sx={{ px: 1 }}>
        {/* Renewal Management Menu - Only show if user has renewals module access */}
        {hasModuleAccess('renewals') && (
          <>
            <ListItem disablePadding>
              <StyledListItemButton onClick={handleRenewalMenuClick}>
                <ListItemIcon sx={{ minWidth: 40, color: theme.palette.text.secondary }}>
                  <AutorenewIcon />
                </ListItemIcon>
                <ListItemText 
                  primary={t('navigation.renewals', 'Renewals')} 
                  primaryTypographyProps={{ 
                    fontWeight: 500,
                    color: theme.palette.text.primary
                  }}
                />
                {renewalMenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </StyledListItemButton>
            </ListItem>

            {/* Renewal Management Submenu */}
            <Collapse in={renewalMenuOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renewalMenuItems.map((item) => (
                  <ListItem key={item.text} disablePadding>
                    <StyledListItemButton
                      onClick={() => handleNavigate(item.path)}
                      selected={location.pathname === item.path}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon sx={{ 
                        minWidth: 40,
                        color: location.pathname === item.path 
                          ? theme.palette.primary.main 
                          : theme.palette.text.secondary
                      }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.text} 
                        primaryTypographyProps={{ 
                          fontWeight: location.pathname === item.path ? 600 : 400,
                          color: location.pathname === item.path 
                            ? theme.palette.primary.main 
                            : theme.palette.text.primary
                        }}
                      />
                    </StyledListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </>
        )}

        {/* Email Management Menu - Only show if user has email module access */}
        {hasModuleAccess('email') && (
          <>
            <ListItem disablePadding>
              <StyledListItemButton onClick={handleEmailMenuClick}>
                <ListItemIcon sx={{ minWidth: 40, color: theme.palette.text.secondary }}>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText 
                  primary={t('navigation.email')} 
                  primaryTypographyProps={{ 
                    fontWeight: 500,
                    color: theme.palette.text.primary
                  }}
                />
                {emailMenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </StyledListItemButton>
            </ListItem>

            {/* Email Management Submenu */}
            <Collapse in={emailMenuOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {emailMenuItems.map((item) => (
                  <ListItem key={item.text} disablePadding>
                    <StyledListItemButton
                      onClick={() => handleNavigate(item.path)}
                      selected={isEmailMenuItemSelected(item.path)}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon sx={{ 
                        minWidth: 40,
                        color: isEmailMenuItemSelected(item.path)
                          ? theme.palette.primary.main 
                          : theme.palette.text.secondary
                      }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.text} 
                        primaryTypographyProps={{ 
                          fontWeight: isEmailMenuItemSelected(item.path) ? 600 : 400,
                          color: isEmailMenuItemSelected(item.path)
                            ? theme.palette.primary.main 
                            : theme.palette.text.primary
                        }}
                      />
                    </StyledListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </>
        )}

        {/* Main Menu Items */}
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <StyledListItemButton
              onClick={() => handleNavigate(item.path)}
              selected={location.pathname === item.path}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: location.pathname === item.path 
                  ? theme.palette.primary.main 
                  : theme.palette.text.secondary
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  color: location.pathname === item.path 
                    ? theme.palette.primary.main 
                    : theme.palette.text.primary
                }}
              />
            </StyledListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <List sx={{ px: 1 }}>
        {secondaryMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <StyledListItemButton
              onClick={() => handleNavigate(item.path)}
              selected={location.pathname === item.path}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: location.pathname === item.path 
                  ? theme.palette.primary.main 
                  : theme.palette.text.secondary
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  color: location.pathname === item.path 
                    ? theme.palette.primary.main 
                    : theme.palette.text.primary
                }}
              />
            </StyledListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const drawerCollapsed = (
    <div>
      <DrawerHeader>
        <IconButton onClick={handleDrawerOpen}>
          {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {/* Renewals Section - Only show if user has renewals module access */}
        {hasModuleAccess('renewals') && (
          <>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <Tooltip title="Renewals" placement="right">
                <StyledListItemButton
                  onClick={handleRenewalMenuClick}
                  sx={{
                    minHeight: 48,
                    justifyContent: 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 'auto',
                      justifyContent: 'center',
                      color: theme.palette.text.secondary
                    }}
                  >
                    <AutorenewIcon />
                  </ListItemIcon>
                </StyledListItemButton>
              </Tooltip>
            </ListItem>

            {/* Show renewal items when expanded or show main dashboard */}
            {renewalMenuItems.slice(0, 3).map((item) => (
              <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                <StyledListItemButton
                  onClick={() => handleNavigate(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    minHeight: 40,
                    justifyContent: 'center',
                    px: 2.5,
                    ml: 1,
                  }}
                >
                  <Tooltip title={item.text} placement="right">
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 'auto',
                        justifyContent: 'center',
                        color: location.pathname === item.path 
                          ? theme.palette.primary.main 
                          : theme.palette.text.secondary,
                        fontSize: '1.2rem'
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  </Tooltip>
                </StyledListItemButton>
              </ListItem>
            ))}
          </>
        )}

        {/* Emails Section - Only show if user has email module access */}
        {hasModuleAccess('email') && (
          <>
            <ListItem disablePadding sx={{ display: 'block', mt: 1 }}>
              <Tooltip title="Emails" placement="right">
                <StyledListItemButton
                  onClick={handleEmailMenuClick}
                  sx={{
                    minHeight: 48,
                    justifyContent: 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 'auto',
                      justifyContent: 'center',
                      color: theme.palette.text.secondary
                    }}
                  >
                    <EmailIcon />
                  </ListItemIcon>
                </StyledListItemButton>
              </Tooltip>
            </ListItem>

            {/* Show email items */}
            {emailMenuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                <StyledListItemButton
                  onClick={() => handleNavigate(item.path)}
                  selected={isEmailMenuItemSelected(item.path)}
                  sx={{
                    minHeight: 40,
                    justifyContent: 'center',
                    px: 2.5,
                    ml: 1,
                  }}
                >
                  <Tooltip title={item.text} placement="right">
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 'auto',
                        justifyContent: 'center',
                        color: isEmailMenuItemSelected(item.path)
                          ? theme.palette.primary.main 
                          : theme.palette.text.secondary,
                        fontSize: '1.2rem'
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  </Tooltip>
                </StyledListItemButton>
              </ListItem>
            ))}
          </>
        )}

        {/* Main Menu Items */}
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block', mt: 1 }}>
            <StyledListItemButton
              onClick={() => handleNavigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                minHeight: 48,
                justifyContent: 'center',
                px: 2.5,
              }}
            >
              <Tooltip title={item.text} placement="right">
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 'auto',
                    justifyContent: 'center',
                    color: location.pathname === item.path 
                      ? theme.palette.primary.main 
                      : theme.palette.text.secondary
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              </Tooltip>
            </StyledListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <List>
        {secondaryMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <StyledListItemButton
              onClick={() => handleNavigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                minHeight: 48,
                justifyContent: 'center',
                px: 2.5,
              }}
            >
              <Tooltip title={item.text} placement="right">
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 'auto',
                    justifyContent: 'center',
                    color: location.pathname === item.path 
                      ? theme.palette.primary.main 
                      : theme.palette.text.secondary
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              </Tooltip>
            </StyledListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: open ? `calc(100% - ${drawerWidth}px)` : `calc(100% - 70px)` },
          ml: { sm: open ? `${drawerWidth}px` : 70 },
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              color="inherit" 
              onClick={handleNotificationsOpen}
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <IconButton 
              color="inherit" 
              onClick={() => toggleMode(mode === 'light' ? 'dark' : 'light')}
              sx={{ mr: 2 }}
            >
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            
            {currentUser && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
                  {currentUser.name}
                </Typography>
                
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    size="small"
                    edge="end"
                    color="inherit"
                  >
                    <Avatar 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        bgcolor: theme.palette.primary.main,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    >
                      {currentUser.name.charAt(0)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
          
          <Menu
            anchorEl={profileMenuAnchorEl}
            open={Boolean(profileMenuAnchorEl)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 3,
              sx: { mt: 1.5, minWidth: 180 }
            }}
          >
            <MenuItem onClick={() => {
              handleProfileMenuClose();
              navigate('/profile');
            }}>
              <ListItemIcon>
                <ProfileIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={() => {
              handleProfileMenuClose();
              navigate('/settings');
            }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
          
          <Menu
            anchorEl={notificationsAnchorEl}
            open={Boolean(notificationsAnchorEl)}
            onClose={handleNotificationsClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 3,
              sx: { 
                mt: 1.5, 
                width: 350,
                borderRadius: 2,
                overflow: 'hidden'
              }
            }}
          >
            <Box sx={{ 
              p: 2, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              borderBottom: `1px solid ${theme.palette.divider}`
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Notifications
              </Typography>
              {unreadCount > 0 && (
                <Button 
                  size="small" 
                  onClick={() => handleOpenNotificationsDialog()}
                  startIcon={<DoneAllIcon fontSize="small" />}
                  sx={{ fontSize: '0.75rem' }}
                >
                  Mark all read
                </Button>
              )}
            </Box>
            
            {notifications.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No notifications
                </Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ maxHeight: 350, overflow: 'auto' }}>
                  {notifications.slice(0, 5).map((notification) => (
                    <MenuItem 
                      key={notification.id} 
                      sx={{ 
                        py: 1.5,
                        px: 2,
                        borderLeft: notification.read ? 'none' : `4px solid ${theme.palette.primary.main}`,
                        backgroundColor: notification.read ? 'transparent' : alpha(theme.palette.primary.main, 0.04)
                      }}
                    >
                      <Box sx={{ display: 'flex', width: '100%' }}>
                        <Box 
                          sx={{ 
                            mr: 1.5, 
                            mt: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            backgroundColor: alpha(
                              notification.type === 'assignment' ? theme.palette.primary.main :
                              notification.type === 'update' ? theme.palette.info.main :
                              notification.type === 'system' ? theme.palette.warning.main :
                              notification.type === 'document' ? theme.palette.success.main :
                              notification.type === 'reminder' ? theme.palette.error.main :
                              notification.type === 'report' ? theme.palette.secondary.main :
                              theme.palette.grey[500],
                              0.12
                            ),
                            color: 
                              notification.type === 'assignment' ? theme.palette.primary.main :
                              notification.type === 'update' ? theme.palette.info.main :
                              notification.type === 'system' ? theme.palette.warning.main :
                              notification.type === 'document' ? theme.palette.success.main :
                              notification.type === 'reminder' ? theme.palette.error.main :
                              notification.type === 'report' ? theme.palette.secondary.main :
                              theme.palette.grey[500]
                          }}
                        >
                          {notification.type === 'assignment' && <AssignmentIcon fontSize="small" />}
                          {notification.type === 'update' && <UpdateIcon fontSize="small" />}
                          {notification.type === 'system' && <InfoIcon fontSize="small" />}
                          {notification.type === 'document' && <DocumentIcon fontSize="small" />}
                          {notification.type === 'reminder' && <ReminderIcon fontSize="small" />}
                          {notification.type === 'report' && <ReportIcon fontSize="small" />}
                        </Box>
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                              {notification.title}
                            </Typography>
                            {!notification.read && (
                              <Box 
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  backgroundColor: theme.palette.error.main,
                                  ml: 1
                                }}
                              />
                            )}
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {notification.message}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(notification.timestamp).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Typography>
                            {!notification.read && (
                              <Button 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                sx={{ fontSize: '0.7rem', p: 0, minWidth: 'auto', color: theme.palette.text.secondary }}
                              >
                                Mark read
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Box>
                
                <Box sx={{ 
                  p: 1.5, 
                  borderTop: `1px solid ${theme.palette.divider}`,
                  textAlign: 'center' 
                }}>
                  <Button 
                    onClick={handleOpenNotificationsDialog}
                    fullWidth
                    color="primary"
                    size="small"
                  >
                    View all notifications
                  </Button>
                </Box>
              </>
            )}
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: open ? drawerWidth : 70 }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRadius: 0,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: open ? drawerWidth : 70,
              borderRadius: 0,
              overflowX: 'hidden',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
          open
        >
          {open ? drawer : drawerCollapsed}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${open ? drawerWidth : 70}px)` },
          marginTop: '64px',
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {children}
      </Box>
      
      {/* Notifications Dialog */}
      <NotificationsDialog 
        open={notificationsDialogOpen} 
        onClose={handleCloseNotificationsDialog} 
      />

      {/* Ask AI Floating Action Button - Only show on renewal pages */}
      {isRenewalRelatedPage() && (
        <Fab
          color="primary"
          aria-label="ask ai"
          onClick={handleAskAI}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            boxShadow: '0 8px 24px rgba(25, 118, 210, 0.3)',
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              transform: 'scale(1.1)',
              boxShadow: '0 12px 32px rgba(25, 118, 210, 0.4)',
            },
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <AskAIIcon sx={{ fontSize: '1.5rem' }} />
        </Fab>
      )}

      {/* Ask AI Dialog */}
      <Dialog
        open={askAIOpen}
        onClose={handleCloseAskAI}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          pb: 1,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
        }}>
          <AskAIIcon color="primary" sx={{ fontSize: '2rem' }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight="600">
              iRenewal AI Assistant
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {(() => {
                const pageContext = getPageContext(location.pathname);
                return `${pageContext.name} • ${agentInitialized ? 'Ready to help' : 'Initializing...'}`;
              })()}
            </Typography>
          </Box>
          <IconButton onClick={handleCloseAskAI} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {/* Agent Status */}
          {agentError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {agentError}
            </Alert>
          )}
          
          {!agentInitialized && !agentError && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              Initializing iRenewal AI Assistant...
            </Alert>
          )}

          {/* Chat History */}
          {chatHistory.length > 0 && (
            <Box sx={{ mb: 3, maxHeight: 400, overflowY: 'auto' }}>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                Chat History:
              </Typography>
              {chatHistory.map((message, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    bgcolor: message.type === 'user' 
                      ? alpha(theme.palette.primary.main, 0.1)
                      : alpha(theme.palette.secondary.main, 0.05),
                    border: `1px solid ${message.type === 'user' 
                      ? alpha(theme.palette.primary.main, 0.2)
                      : alpha(theme.palette.secondary.main, 0.1)}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    {message.type === 'user' ? (
                      <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>
                        <PersonIcon fontSize="small" />
                      </Avatar>
                    ) : (
                      <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 32, height: 32 }}>
                        <AskAIIcon fontSize="small" />
                      </Avatar>
                    )}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                        {message.type === 'user' ? 'You' : 'iRenewal AI'}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        whiteSpace: 'pre-wrap', 
                        wordBreak: 'break-word',
                        lineHeight: 1.6
                      }}>
                        {message.content.split('\n').map((line, lineIndex) => {
                          // Handle bold headers (full line with **)
                          if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
                            return (
                              <Typography
                                key={lineIndex}
                                variant="subtitle2"
                                component="div"
                                sx={{ 
                                  fontWeight: 700,
                                  color: theme.palette.primary.main,
                                  mt: lineIndex > 0 ? 2 : 0,
                                  mb: 1,
                                  fontSize: '0.95rem'
                                }}
                              >
                                {line.replace(/^\*\*|\*\*$/g, '')}
                              </Typography>
                            );
                          }
                          
                          // Handle bullet points
                          if (line.startsWith('•') || line.startsWith('  •')) {
                            const isSubBullet = line.startsWith('  •');
                            const bulletText = line.replace(/^\s*•\s*/, '');
                            
                            return (
                              <Typography
                                key={lineIndex}
                                variant="body2"
                                component="div"
                                sx={{ 
                                  ml: isSubBullet ? 3 : 1,
                                  mb: 0.5,
                                  display: 'flex',
                                  alignItems: 'flex-start'
                                }}
                              >
                                <Box component="span" sx={{ mr: 1, color: theme.palette.primary.main }}>
                                  {isSubBullet ? '◦' : '•'}
                                </Box>
                                <Box component="span" sx={{ flex: 1 }}>
                                  {renderTextWithFormatting(bulletText)}
                                </Box>
                              </Typography>
                            );
                          }
                          
                          // Handle numbered lists
                          if (/^\d+\./.test(line)) {
                            return (
                              <Typography
                                key={lineIndex}
                                variant="body2"
                                component="div"
                                sx={{ 
                                  ml: 1,
                                  mb: 0.5,
                                  fontWeight: 500
                                }}
                              >
                                {renderTextWithFormatting(line)}
                              </Typography>
                            );
                          }
                          
                          // Handle empty lines for spacing
                          if (line.trim() === '') {
                            return <Box key={lineIndex} sx={{ height: 8 }} />;
                          }
                          
                          // Regular text - check for inline formatting
                          return (
                            <Typography
                              key={lineIndex}
                              variant="body2"
                              component="div"
                              sx={{ mb: 0.5 }}
                            >
                              {renderTextWithFormatting(line)}
                            </Typography>
                          );
                        })}
                        {message.streaming && (
                          <Box component="span" sx={{ ml: 1 }}>
                            <CircularProgress size={12} />
                          </Box>
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}

          {/* Suggestions */}
          {chatHistory.length === 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
              Quick Suggestions:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {aiSuggestions.map((suggestion, index) => (
                <Chip
                  key={index}
                  label={suggestion}
                  variant="outlined"
                  clickable
                  onClick={() => handleSuggestionClick(suggestion)}
                  sx={{
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      borderColor: theme.palette.primary.main,
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
          )}

          {/* Query Input */}
          <TextField
            fullWidth
            multiline
            rows={3}
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="Ask me anything about renewal management, customer retention, process optimization, or best practices..."
            variant="outlined"
            disabled={!agentInitialized}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleSendAIQuery}
                    disabled={!aiQuery.trim() || isAILoading || !agentInitialized}
                    color="primary"
                  >
                    {isAILoading ? <CircularProgress size={20} /> : <SendIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseAskAI} color="inherit">
            Close
          </Button>
          {chatHistory.length > 0 && (
            <Button
              onClick={() => setChatHistory([])}
              color="inherit"
              variant="outlined"
              sx={{ mr: 1 }}
            >
              Clear Chat
            </Button>
          )}
          <Button
            onClick={handleSendAIQuery}
            variant="contained"
            disabled={!aiQuery.trim() || isAILoading || !agentInitialized}
            startIcon={isAILoading ? <CircularProgress size={16} /> : <SendIcon />}
            sx={{ borderRadius: 2 }}
          >
            {isAILoading ? 'Processing...' : 'Send to iRenewal'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Layout;