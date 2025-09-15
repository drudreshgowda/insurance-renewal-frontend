import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
  alpha,
  Fade
} from '@mui/material';
import {
  BusinessCenter as NewBusinessIcon,
  Construction as ConstructionIcon
} from '@mui/icons-material';

const NewBusiness = () => {
  const theme = useTheme();

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ px: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh'
        }}>
          <Card sx={{ 
            maxWidth: 500, 
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ 
                p: 3, 
                bgcolor: alpha(theme.palette.success.main, 0.1),
                borderRadius: 3,
                mb: 3,
                display: 'inline-block'
              }}>
                <NewBusinessIcon sx={{ fontSize: 60, color: theme.palette.success.main }} />
              </Box>
              
              <Typography variant="h4" fontWeight="600" gutterBottom>
                New Business
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                This feature is coming soon! We're developing a comprehensive new business acquisition and onboarding system.
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: 1,
                color: 'text.secondary'
              }}>
                <ConstructionIcon fontSize="small" />
                <Typography variant="body2">
                  Under Development
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Fade>
  );
};

export default NewBusiness; 