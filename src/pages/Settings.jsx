import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Switch,
  List, ListItem, ListItemIcon, ListItemText,
  ListItemSecondaryAction, Alert,
  FormControl, Select, MenuItem,
  Button, Card, CardContent, Divider,
  useTheme, alpha, Fade, Grow, Zoom, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
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
  School as SchoolIcon
} from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeModeContext';
import { useSettings } from '../context/SettingsContext';
import { Link } from 'react-router-dom';
import WelcomeModal from '../components/common/WelcomeModal';

const Settings = () => {
  const { mode, toggleMode } = useThemeMode();
  const { settings, updateSettings } = useSettings();
  const [successMessage, setSuccessMessage] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    // Set loaded state for animations
    setTimeout(() => {
      setLoaded(true);
    }, 100);
  }, []);

  const handleSettingChange = (setting, value) => {
    updateSettings({
      [setting]: value
    });
  };

  const handleSaveSettings = () => {
    // Settings are automatically saved via the context
    setSuccessMessage('Settings saved successfully!');
    
    // Auto-dismiss success message after 3 seconds
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

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Grow in={loaded} timeout={400}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  mb: 3,
                  overflow: 'visible',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PaletteIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">
                      Appearance
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <List disablePadding>
                    <ListItem 
                      sx={{ 
                        borderRadius: 2,
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        }
                      }}
                    >
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
            </Grow>

            <Grow in={loaded} timeout={600}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  overflow: 'visible',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <NotificationsIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">
                      Notifications
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <List disablePadding>
                    <ListItem 
                      sx={{ 
                        borderRadius: 2,
                        mb: 1,
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        }
                      }}
                    >
                      <ListItemIcon>
                        <EmailIcon color="info" />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography fontWeight="500">Email Notifications</Typography>}
                        secondary="Receive case updates via email"
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
                    <ListItem 
                      sx={{ 
                        borderRadius: 2,
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        }
                      }}
                    >
                      <ListItemIcon>
                        <SmsIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography fontWeight="500">SMS Notifications</Typography>}
                        secondary="Receive case updates via SMS"
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
            </Grow>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grow in={loaded} timeout={800}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  mb: 3,
                  overflow: 'visible',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LanguageIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">
                      Regional Settings
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <List disablePadding>
                    <ListItem 
                      sx={{ 
                        borderRadius: 2,
                        mb: 1,
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        }
                      }}
                    >
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
                            sx={{ 
                              borderRadius: 2,
                              '.MuiOutlinedInput-notchedOutline': {
                                borderColor: alpha(theme.palette.primary.main, 0.2),
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.primary.main,
                              },
                            }}
                          >
                            <MenuItem value="en">English</MenuItem>
                            <MenuItem value="es">Español</MenuItem>
                            <MenuItem value="fr">Français</MenuItem>
                          </Select>
                        </FormControl>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem 
                      sx={{ 
                        borderRadius: 2,
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        }
                      }}
                    >
                      <ListItemIcon>
                        <NotificationsIcon color="secondary" />
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
                            sx={{ 
                              borderRadius: 2,
                              '.MuiOutlinedInput-notchedOutline': {
                                borderColor: alpha(theme.palette.primary.main, 0.2),
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.primary.main,
                              },
                            }}
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
            </Grow>

            <Grow in={loaded} timeout={1000}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  overflow: 'visible',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SettingsIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">
                      System Settings
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <List disablePadding>
                    <ListItem 
                      sx={{ 
                        borderRadius: 2,
                        mb: 1,
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        }
                      }}
                    >
                      <ListItemIcon>
                        <SecurityIcon color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography fontWeight="500">Multi-Factor Authentication</Typography>}
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
                    
                    <ListItem 
                      sx={{ 
                        borderRadius: 2,
                        mb: 1,
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        }
                      }}
                    >
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
                    <ListItem 
                      sx={{ 
                        borderRadius: 2,
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        }
                      }}
                    >
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
            </Grow>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Grow in={loaded} timeout={1200}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  overflow: 'visible',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ReceiptIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography variant="h6" fontWeight="600">
                        Billing Information
                      </Typography>
                    </Box>
                    <Button 
                      component={Link} 
                      to="/billing"
                      variant="outlined" 
                      color="primary"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ 
                        borderRadius: 2,
                        fontWeight: 500,
                      }}
                    >
                      View Billing Details
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Typography variant="body1" color="text.secondary">
                    View your complete billing information, including utilization charges, platform charges, and payment history on the dedicated billing page.
                  </Typography>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
          
          {/* Help Section */}
          <Grid item xs={12}>
            <Grow in={loaded} timeout={1400}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  overflow: 'visible',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <HelpIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">
                      Help & Resources
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  <List disablePadding>
                    <ListItem 
                      button
                      onClick={handleOpenWelcomeGuide}
                      sx={{ 
                        borderRadius: 2,
                        mb: 1,
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        }
                      }}
                    >
                      <ListItemIcon>
                        <SchoolIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography fontWeight="500">Portal Welcome Guide</Typography>}
                        secondary="View the introduction guide to the portal features"
                      />
                    </ListItem>
                    
                    <ListItem 
                      component="a"
                      href="https://support.example.com" 
                      target="_blank"
                      sx={{ 
                        borderRadius: 2,
                        mb: 1,
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        }
                      }}
                    >
                      <ListItemIcon>
                        <HelpIcon color="info" />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography fontWeight="500">Support Center</Typography>}
                        secondary="Access our knowledge base and support articles"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>

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
        
        {/* Welcome Modal */}
        <WelcomeModal open={welcomeModalOpen} onClose={handleCloseWelcomeGuide} />
      </Box>
    </Fade>
  );
};

export default Settings;