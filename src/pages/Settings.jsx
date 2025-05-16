import React, { useState } from 'react';
import {
  Box, Typography, Paper, Grid, Switch,
  List, ListItem, ListItemIcon, ListItemText,
  ListItemSecondaryAction, Alert,
  FormControl, Select, MenuItem,
  Button
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeModeContext';
import { useSettings } from '../context/SettingsContext';

const Settings = () => {
  const { mode, toggleMode } = useThemeMode();
  const { settings, updateSettings } = useSettings();
  const [successMessage, setSuccessMessage] = useState('');

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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Appearance
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <DarkModeIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Dark Mode"
                  secondary="Toggle between light and dark theme"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={mode === 'dark'}
                    onChange={toggleMode}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Email Notifications"
                  secondary="Receive case updates via email"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SmsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="SMS Notifications"
                  secondary="Receive case updates via SMS"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={settings.smsNotifications}
                    onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Regional Settings
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <LanguageIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Language"
                  secondary="Select your preferred language"
                />
                <ListItemSecondaryAction sx={{ width: '120px' }}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Español</MenuItem>
                      <MenuItem value="fr">Français</MenuItem>
                    </Select>
                  </FormControl>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Time Zone"
                  secondary="Select your time zone"
                />
                <ListItemSecondaryAction sx={{ width: '120px' }}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={settings.timezone}
                      onChange={(e) => handleSettingChange('timezone', e.target.value)}
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
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Settings
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Auto Refresh"
                  secondary="Automatically refresh case data every 5 minutes"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={settings.autoRefresh}
                    onChange={(e) => handleSettingChange('autoRefresh', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Show Edit Case Button"
                  secondary="Display the Edit Case button in case details view"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={settings.showEditCaseButton !== false}
                    onChange={(e) => handleSettingChange('showEditCaseButton', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
        >
          Save Settings
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;