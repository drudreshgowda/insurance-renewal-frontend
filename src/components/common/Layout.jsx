import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, Box, Drawer, Toolbar, Typography, Divider, 
  List, ListItem, ListItemIcon, ListItemText, IconButton,
  Avatar, Menu, MenuItem, Tooltip, Badge, useTheme,
  ListItemButton, Switch, styled, Button
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Dashboard as DashboardIcon, 
  CloudUpload as UploadIcon, 
  ViewList as CasesIcon, 
  History as LogsIcon,
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
  WhatsApp as WhatsAppIcon,
  CreditCard as CreditCardIcon,
  CheckCircle as CheckCircleIcon,
  Timeline as TimelineIcon,
  DoneAll as DoneAllIcon,
  Description as DocumentIcon,
  Alarm as ReminderIcon,
  Assessment as ReportIcon,
  Person as PersonIcon,
  List as ListIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../context/ThemeModeContext';
import { useNotifications } from '../../context/NotificationsContext';
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
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

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

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Upload', icon: <UploadIcon />, path: '/upload' },
    { text: 'Case Tracking', icon: <AssignmentIcon />, path: '/cases' },
    { text: 'Closed Cases', icon: <AssignmentTurnedInIcon />, path: '/closed-cases' },
    { text: 'Policy Timeline', icon: <TimelineIcon />, path: '/policy-timeline' },
    { text: 'Case Logs', icon: <ListIcon />, path: '/logs' },
  ];

  const secondaryMenuItems = [
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Billing', icon: <ReceiptIcon />, path: '/billing' },
  ];

  const drawer = (
    <div>
      <DrawerHeader>
        <Typography variant="h6" sx={{ flexGrow: 1, ml: 2, fontWeight: 600 }}>
          Policy Renewal
        </Typography>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List sx={{ px: 1 }}>
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
        {menuItems.map((item) => (
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
            Insurance Policy Renewal System
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
    </Box>
  );
};

export default Layout;