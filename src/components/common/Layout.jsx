import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, Box, Drawer, Toolbar, Typography, Divider, 
  List, ListItem, ListItemIcon, ListItemText, IconButton,
  Avatar, Menu, MenuItem, Tooltip, Badge, useTheme,
  ListItemButton, styled, Button, Collapse, Fab, Dialog, 
  DialogTitle, DialogContent, DialogActions, TextField, 
  InputAdornment, CircularProgress, Paper, Chip
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
  const [aiResponse, setAiResponse] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiSuggestions] = useState([
    "How can I improve renewal rates?",
    "What are the common reasons for renewal failures?",
    "Show me best practices for customer retention",
    "How to optimize the renewal process?",
    "What communication strategies work best?"
  ]);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { hasPermission } = usePermissions();

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
  };

  const handleSendAIQuery = async () => {
    if (!aiQuery.trim()) return;
    
    setIsAILoading(true);
    
    // Simulate AI response (in real implementation, this would call an AI service)
    setTimeout(() => {
      const mockResponses = {
        "improve renewal rates": "To improve renewal rates, focus on: 1) Proactive communication 30-45 days before expiry, 2) Personalized offers based on customer history, 3) Simplified renewal process, 4) Multi-channel reminders (email, SMS, calls), 5) Incentives for early renewal.",
        "renewal failures": "Common reasons for renewal failures include: 1) Lack of timely communication, 2) Complex renewal process, 3) Price increases without explanation, 4) Poor customer service experience, 5) Competitive offers, 6) Changed customer needs.",
        "customer retention": "Best practices for customer retention: 1) Regular check-ins and relationship building, 2) Value-added services, 3) Loyalty programs, 4) Feedback collection and action, 5) Personalized communication, 6) Proactive issue resolution.",
        "optimize renewal process": "To optimize the renewal process: 1) Automate reminders and notifications, 2) Simplify forms and paperwork, 3) Offer multiple payment options, 4) Provide online self-service options, 5) Use AI for predictive analytics, 6) Streamline approval workflows.",
        "communication strategies": "Effective communication strategies: 1) Use multiple channels (email, SMS, calls), 2) Personalize messages based on customer data, 3) Time communications appropriately, 4) Use clear, simple language, 5) Include value propositions, 6) Follow up consistently."
      };
      
      const queryLower = aiQuery.toLowerCase();
      let response = "I can help you with renewal management strategies, process optimization, customer retention techniques, and communication best practices. Could you please provide more specific details about your question?";
      
      for (const [key, value] of Object.entries(mockResponses)) {
        if (queryLower.includes(key)) {
          response = value;
          break;
        }
      }
      
      setAiResponse(response);
      setIsAILoading(false);
    }, 2000);
  };

  const handleSuggestionClick = (suggestion) => {
    setAiQuery(suggestion);
  };

  // Check if current page is renewal-related
  const isRenewalRelatedPage = () => {
    const renewalPaths = ['/', '/upload', '/cases', '/closed-cases', '/policy-timeline', '/logs'];
    return renewalPaths.some(path => 
      path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
    );
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

  const menuItems = [
    { text: 'Campaigns', icon: <CampaignIcon />, path: '/campaigns', permission: 'campaigns' },
    { text: 'Feedback & Surveys', icon: <FeedbackIcon />, path: '/feedback', permission: 'feedback' },
    { text: 'Claims', icon: <GavelIcon />, path: '/claims', permission: 'claims' },
    { text: 'Policy Servicing', icon: <PolicyServicingIcon />, path: '/policy-servicing', permission: 'policy-servicing' },
    { text: 'New Business', icon: <NewBusinessIcon />, path: '/new-business', permission: 'new-business' },
    { text: 'Medical Mgmt', icon: <MedicalManagementIcon />, path: '/medical-management', permission: 'medical-management' },
    { text: 'Whatsapp flow', icon: <WhatsAppIcon />, path: '/whatsapp-flow', permission: 'whatsapp-flow' },
  ].filter(item => hasPermission(item.permission));

  const renewalMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/', permission: 'dashboard' },
    { text: 'Upload', icon: <UploadIcon />, path: '/upload', permission: 'upload' },
    { text: 'Case Tracking', icon: <AssignmentIcon />, path: '/cases', permission: 'cases' },
    { text: 'Closed Cases', icon: <AssignmentTurnedInIcon />, path: '/closed-cases', permission: 'closed-cases' },
    { text: 'Policy Timeline', icon: <TimelineIcon />, path: '/policy-timeline', permission: 'policy-timeline' },
    { text: 'Case Logs', icon: <ListIcon />, path: '/logs', permission: 'logs' },
  ].filter(item => hasPermission(item.permission));

  const emailMenuItems = [
    { text: 'Email Dashboard', icon: <DashboardIcon />, path: '/emails/dashboard', permission: 'email-dashboard' },
    { text: 'Email Inbox', icon: <EmailIcon />, path: '/emails', permission: 'emails' },
    { text: 'Bulk Email', icon: <CampaignIcon />, path: '/emails/bulk', permission: 'bulk-email' },
    { text: 'Email Analytics', icon: <ReportIcon />, path: '/emails/analytics', permission: 'email-analytics' },
  ].filter(item => hasPermission(item.permission));

  const secondaryMenuItems = [
    { text: 'Profile', icon: <PersonIcon />, path: '/profile', permission: 'profile' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings', permission: 'settings' },
    { text: 'Billing', icon: <ReceiptIcon />, path: '/billing', permission: 'billing' },
    { text: 'Users', icon: <GroupIcon />, path: '/users', permission: 'users' },
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
        {/* Renewal Management Menu */}
        <ListItem disablePadding>
          <StyledListItemButton onClick={handleRenewalMenuClick}>
            <ListItemIcon sx={{ minWidth: 40, color: theme.palette.text.secondary }}>
              <AutorenewIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Renewals" 
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

        {/* Email Management Menu */}
        <ListItem disablePadding>
          <StyledListItemButton onClick={handleEmailMenuClick}>
            <ListItemIcon sx={{ minWidth: 40, color: theme.palette.text.secondary }}>
              <EmailIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Emails" 
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
        {/* Renewals Section - Show main renewal items */}
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

        {/* Emails Section */}
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
              Ask AI Assistant
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Get intelligent insights about renewal management
            </Typography>
          </Box>
          <IconButton onClick={handleCloseAskAI} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {/* Suggestions */}
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

          {/* Query Input */}
          <TextField
            fullWidth
            multiline
            rows={3}
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="Ask me anything about renewal management, customer retention, process optimization, or best practices..."
            variant="outlined"
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
                    disabled={!aiQuery.trim() || isAILoading}
                    color="primary"
                  >
                    {isAILoading ? <CircularProgress size={20} /> : <SendIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* AI Response */}
          {(aiResponse || isAILoading) && (
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <AskAIIcon color="primary" />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight="600" color="primary" gutterBottom>
                    AI Assistant Response:
                  </Typography>
                  {isAILoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CircularProgress size={20} />
                      <Typography variant="body2" color="text.secondary">
                        Analyzing your query and generating insights...
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      {aiResponse}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseAskAI} color="inherit">
            Close
          </Button>
          <Button
            onClick={handleSendAIQuery}
            variant="contained"
            disabled={!aiQuery.trim() || isAILoading}
            startIcon={isAILoading ? <CircularProgress size={16} /> : <SendIcon />}
            sx={{ borderRadius: 2 }}
          >
            {isAILoading ? 'Processing...' : 'Ask AI'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Layout;