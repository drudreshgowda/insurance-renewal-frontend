import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, 
  CircularProgress, Alert, Container, Link,
  Card, CardContent, InputAdornment, IconButton,
  alpha, useTheme, Fade, Grow, Dialog, DialogTitle,
  DialogContent, DialogActions, DialogContentText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  Email as EmailIcon, 
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext'; // ✅ use AuthContext instead of loginAPI

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ get login function from context

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Password reset state
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(email, password); // ✅ call AuthContext login

      if (result.success) {
        navigate('/'); // ✅ redirect on success
      } else {
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Password reset handlers
  const handleResetDialogOpen = () => {
    setResetDialogOpen(true);
    setResetEmail(email || '');
    setResetError('');
    setResetSuccess(false);
  };

  const handleResetDialogClose = () => {
    setResetDialogOpen(false);
    if (resetSuccess) setResetEmail('');
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!resetEmail) {
      setResetError('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      setResetError('Please enter a valid email address');
      return;
    }

    setResetLoading(true);
    setResetError('');

    // Simulate password reset API call
    setTimeout(() => {
      setResetSuccess(true);
      setResetLoading(false);
    }, 1500);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.mode === 'dark' 
          ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.6)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`
          : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
        padding: 2
      }}
    >
      <Fade in={true} timeout={800}>
        <Container maxWidth="sm">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <SecurityIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
            <Typography 
              variant="h3" 
              component="h1"
              sx={{ 
                fontWeight: 700,
                background: theme.palette.mode === 'dark'
                  ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                  : `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Policy Renewal
            </Typography>
          </Box>

          <Grow in={true} timeout={1000}>
            <Card elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 1 }}>Welcome</Typography>
                  <Typography variant="body1" color="text.secondary">Sign in to access your account</Typography>
                </Box>

                {error && (
                  <Grow in={Boolean(error)}>
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(211, 47, 47, 0.1)' }}>{error}</Alert>
                  </Grow>
                )}

                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Email Address"
                    type="email"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon color="primary" /></InputAdornment> }}
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />

                  <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><LockIcon color="primary" /></InputAdornment>,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading}
                    sx={{ py: 1.5, mt: 1, mb: 3, borderRadius: 2, fontWeight: 600 }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Sign In'}
                  </Button>

                  <Box sx={{ textAlign: 'center' }}>
                    <Link 
                      onClick={handleResetDialogOpen}
                      variant="body2" 
                      sx={{ cursor: 'pointer', color: theme.palette.primary.main, textDecoration: 'none', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}
                    >
                      Forgot password?
                    </Link>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grow>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Veriright Management Solutions Pvt Ltd. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Fade>

      {/* Password Reset Dialog */}
      <Dialog 
        open={resetDialogOpen} 
        onClose={handleResetDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 10px 40px rgba(0,0,0,0.15)' } }}
      >
        <DialogTitle sx={{ px: 3, pt: 3, pb: 1, fontWeight: 600 }}>Reset Password</DialogTitle>
        <DialogContent sx={{ px: 3, py: 2 }}>
          {resetSuccess ? (
            <Box>
              <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>Password reset link sent successfully!</Alert>
              <DialogContentText>
                We've sent a password reset link to <strong>{resetEmail}</strong>. Please check your email and follow the instructions.
              </DialogContentText>
            </Box>
          ) : (
            <Box>
              <DialogContentText sx={{ mb: 2 }}>
                Enter your email address below and we'll send you a link to reset your password.
              </DialogContentText>

              {resetError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{resetError}</Alert>
              )}

              <form onSubmit={handleResetPassword}>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon color="primary" /></InputAdornment> }}
                  sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </form>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleResetDialogClose} color={resetSuccess ? "primary" : "secondary"} variant="outlined" sx={{ borderRadius: 2, px: 3 }}>
            {resetSuccess ? 'Close' : 'Cancel'}
          </Button>
          {!resetSuccess && (
            <Button onClick={handleResetPassword} color="primary" variant="contained" disabled={resetLoading} sx={{ borderRadius: 2, px: 3 }}>
              {resetLoading ? <CircularProgress size={24} thickness={4} sx={{ color: 'white' }} /> : 'Send Reset Link'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
