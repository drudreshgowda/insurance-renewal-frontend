import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, Box, Drawer, Toolbar, Typography, Divider, 
  List, ListItem, ListItemIcon, ListItemText, IconButton,
  Avatar, Menu, MenuItem, Tooltip, Badge, useTheme,
  ListItemButton, Switch, styled
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
  Info as InfoIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../context/ThemeModeContext';
import { useNotifications } from '../../context/NotificationsContext';
import NotificationsDialog from '../notifications/Notifications';

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
  const { notifications, unreadCount } = useNotifications();

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
    { text: 'Case Tracking', icon: <CasesIcon />, path: '/cases' },
    { text: 'Logs', icon: <LogsIcon />, path: '/logs' },
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
        <ListItem disablePadding>
          <StyledListItemButton
            onClick={() => handleNavigate('/profile')}
            selected={location.pathname === '/profile'}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <ProfileIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </StyledListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <StyledListItemButton
            onClick={() => handleNavigate('/settings')}
            selected={location.pathname === '/settings'}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </StyledListItemButton>
        </ListItem>
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
        <ListItem disablePadding sx={{ display: 'block' }}>
          <StyledListItemButton
            onClick={() => handleNavigate('/profile')}
            selected={location.pathname === '/profile'}
            sx={{
              minHeight: 48,
              justifyContent: 'center',
              px: 2.5,
            }}
          >
            <Tooltip title="Profile" placement="right">
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 'auto',
                  justifyContent: 'center',
                }}
              >
                <ProfileIcon />
              </ListItemIcon>
            </Tooltip>
          </StyledListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <StyledListItemButton
            onClick={() => handleNavigate('/settings')}
            selected={location.pathname === '/settings'}
            sx={{
              minHeight: 48,
              justifyContent: 'center',
              px: 2.5,
            }}
          >
            <Tooltip title="Settings" placement="right">
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 'auto',
                  justifyContent: 'center',
                }}
              >
                <SettingsIcon />
              </ListItemIcon>
            </Tooltip>
          </StyledListItemButton>
        </ListItem>
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
              sx: { mt: 1.5, width: 320 }
            }}
          >
            {notifications.slice(0, 3).map((notification) => (
              <MenuItem key={notification.id}>
                <Box sx={{ display: 'flex', width: '100%' }}>
                  <Box sx={{ mr: 1.5, pt: 0.5 }}>
                    {notification.type === 'assignment' && <AssignmentIcon color="primary" />}
                    {notification.type === 'update' && <UpdateIcon color="info" />}
                    {notification.type === 'system' && <InfoIcon color="warning" />}
                  </Box>
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2">{notification.title}</Typography>
                      {!notification.read && (
                        <Badge color="error" variant="dot" sx={{ ml: 1 }} />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(notification.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={handleOpenNotificationsDialog}>
              <Typography variant="body2" color="primary" sx={{ width: '100%', textAlign: 'center' }}>
                View all notifications
              </Typography>
            </MenuItem>
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