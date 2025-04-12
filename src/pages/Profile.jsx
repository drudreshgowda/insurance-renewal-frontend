import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Grid, Avatar, 
  TextField, Button, Divider, Card, CardContent,
  List, ListItem, ListItemText, ListItemIcon,
  Chip, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Email as EmailIcon, 
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Security as SecurityIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { currentUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'Client Admin',
    email: currentUser?.email || 'admin@client.com',
    phone: '+1 (555) 123-4567',
    company: 'Insurance Company Name',
    role: 'Client Administrator',
    department: 'Policy Management',
    joinDate: '2024-01-15'
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  const handleEditToggle = () => {
    setEditMode(!editMode);
    setSuccessMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleSaveProfile = () => {
    // In a real app, this would call an API to update the profile
    setEditMode(false);
    setSuccessMessage('Profile updated successfully!');
    
    // Auto-dismiss success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 120, 
                  height: 120, 
                  fontSize: 48,
                  bgcolor: 'primary.main',
                  mb: 2
                }}
              >
                {profileData.name.charAt(0).toUpperCase()}
              </Avatar>
              
              <Typography variant="h6" gutterBottom>
                {profileData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {profileData.role}
              </Typography>
              <Chip 
                label={profileData.department} 
                color="primary" 
                variant="outlined" 
                size="small" 
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Profile Information</Typography>
              <Button
                startIcon={<EditIcon />}
                onClick={handleEditToggle}
                color="primary"
                variant={editMode ? "contained" : "outlined"}
              >
                {editMode ? 'Cancel' : 'Edit Profile'}
              </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  InputProps={{
                    startAdornment: (
                      <EmailIcon color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  InputProps={{
                    startAdornment: (
                      <PhoneIcon color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company"
                  name="company"
                  value={profileData.company}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  InputProps={{
                    startAdornment: (
                      <BusinessIcon color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {editMode && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveProfile}
                >
                  Save Changes
                </Button>
              </Box>
            )}
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Account Security
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Password"
                  secondary="Last changed 30 days ago"
                />
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => {
                    setPasswordDialogOpen(true);
                    setPasswordError('');
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                >
                  Change Password
                </Button>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {passwordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {passwordError}
            </Alert>
          )}
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Current Password"
              type="password"
              fullWidth
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              // Validate password change
              if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
                setPasswordError('Please fill in all fields');
                return;
              }

              if (passwordData.newPassword !== passwordData.confirmPassword) {
                setPasswordError('New passwords do not match');
                return;
              }

              if (passwordData.newPassword.length < 8) {
                setPasswordError('New password must be at least 8 characters long');
                return;
              }

              // In a real app, this would call your API to change the password
              // For demo, we'll just show a success message
              setPasswordDialogOpen(false);
              setSuccessMessage('Password changed successfully!');
              
              // Auto-dismiss success message after 3 seconds
              setTimeout(() => {
                setSuccessMessage('');
              }, 3000);
            }}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;