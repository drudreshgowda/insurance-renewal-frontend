import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePermissions } from '../../context/PermissionsContext';
import { useAuth } from '../../context/AuthContext';
import { Box, Typography, Alert } from '@mui/material';

const ProtectedRoute = ({ children, requiredPermission, fallbackPath = '/' }) => {
  const { isAuthenticated } = useAuth();
  const { hasPermission, canAccessRoute, loading } = usePermissions();
  const location = useLocation();

  // Show loading while permissions are being loaded
  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check specific permission if provided
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Alert severity="error" sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Typography variant="h6" gutterBottom>Access Denied</Typography>
          <Typography variant="body2">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </Typography>
        </Alert>
      </Box>
    );
  }

  // Check route-based permissions
  if (!canAccessRoute(location.pathname)) {
    // Find a route the user can access as fallback
    const accessibleRoutes = [
      '/', '/profile', '/dashboard'
    ].filter(route => canAccessRoute(route));
    
    const redirectTo = accessibleRoutes.length > 0 ? accessibleRoutes[0] : fallbackPath;
    
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;