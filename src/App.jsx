import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/common/Layout';
import WelcomeModal from './components/common/WelcomeModal';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import CaseTracking from './pages/CaseTracking';
import ClosedCases from './pages/ClosedCases';
import PolicyTimeline from './pages/PolicyTimeline';
import CaseDetails from './pages/CaseDetails';
import Logs from './pages/Logs';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Billing from './pages/Billing';
import ProtectedRoute from './components/common/ProtectedRoute';
import { AuthProvider } from './context/AuthContext.js';
import { ThemeModeProvider, useThemeMode } from './context/ThemeModeContext.js';
import { NotificationsProvider } from './context/NotificationsContext.js';
import SettingsProvider from './context/SettingsContext';

function AppWithTheme() {
  const { mode } = useThemeMode();
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);
  
  // Check if the user is a first-time user
  useEffect(() => {
    const hasSeenWelcomeScreen = localStorage.getItem('welcomeScreenSeen');
    if (!hasSeenWelcomeScreen) {
      setWelcomeModalOpen(true);
    }
  }, []);

  const handleCloseWelcomeModal = () => {
    setWelcomeModalOpen(false);
  };
  
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      // More vibrant primary blue
      primary: {
        light: mode === 'dark' ? '#92cbff' : '#4dabff',
        main: mode === 'dark' ? '#62b3ff' : '#1e88e5',
        dark: mode === 'dark' ? '#3d8aff' : '#0d47a1',
        contrastText: '#ffffff',
      },
      // Vibrant accent color
      secondary: {
        light: mode === 'dark' ? '#ffb3d4' : '#ff6090',
        main: mode === 'dark' ? '#ff80ab' : '#ec407a',
        dark: mode === 'dark' ? '#c94f7c' : '#c2185b',
        contrastText: '#ffffff',
      },
      success: {
        main: mode === 'dark' ? '#69f0ae' : '#2e7d32',
        light: mode === 'dark' ? '#b9f6ca' : '#4caf50',
        dark: mode === 'dark' ? '#00c853' : '#1b5e20',
        contrastText: mode === 'dark' ? '#000000' : '#ffffff',
      },
      info: {
        main: mode === 'dark' ? '#40c4ff' : '#0288d1',
        light: mode === 'dark' ? '#80d8ff' : '#03a9f4',
        dark: mode === 'dark' ? '#00b0ff' : '#01579b',
        contrastText: mode === 'dark' ? '#000000' : '#ffffff',
      },
      warning: {
        main: mode === 'dark' ? '#ffab40' : '#f57c00',
        light: mode === 'dark' ? '#ffd180' : '#ff9800',
        dark: mode === 'dark' ? '#ff9100' : '#e65100',
        contrastText: mode === 'dark' ? '#000000' : '#ffffff',
      },
      error: {
        main: mode === 'dark' ? '#ff5252' : '#d32f2f',
        light: mode === 'dark' ? '#ff867f' : '#f44336',
        dark: mode === 'dark' ? '#ff1744' : '#b71c1c',
        contrastText: '#ffffff',
      },
      grey: {
        main: mode === 'dark' ? '#424242' : '#e0e0e0',
        contrastText: mode === 'dark' ? '#ffffff' : '#000000',
      },
      background: {
        default: mode === 'dark' ? '#0a1929' : '#f8fafc',
        paper: mode === 'dark' ? '#101f33' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        letterSpacing: '-0.5px',
      },
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.5px',
      },
      h3: {
        fontWeight: 700,
        letterSpacing: '-0.5px',
      },
      h4: {
        fontWeight: 600,
        letterSpacing: '-0.2px',
      },
      h5: {
        fontWeight: 600,
        letterSpacing: '-0.1px',
      },
      h6: {
        fontWeight: 600,
      },
      subtitle1: {
        fontWeight: 500,
      },
      subtitle2: {
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 16, // More curved edges for a modern look
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: mode === 'dark' ? '#1e1e1e' : '#f1f1f1',
            },
            '&::-webkit-scrollbar-thumb': {
              background: mode === 'dark' ? '#555' : '#ccc',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: mode === 'dark' ? '#777' : '#aaa',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: mode === 'dark' ? 'none' : '0 4px 14px 0 rgba(0,118,255,0.15)',
            transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: mode === 'dark' ? '0 6px 20px rgba(0,0,0,0.4)' : '0 6px 20px rgba(0,118,255,0.25)',
            }
          },
          contained: {
            fontWeight: 600,
          },
          outlined: {
            fontWeight: 600,
          }
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: mode === 'dark' 
              ? '0 8px 24px rgba(0,0,0,0.5)' 
              : '0 10px 28px rgba(0,0,0,0.08)',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              boxShadow: mode === 'dark' 
                ? '0 10px 30px rgba(0,0,0,0.7)' 
                : '0 14px 40px rgba(0,0,0,0.12)',
            }
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            overflow: 'hidden',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: mode === 'dark' 
                ? '0 8px 24px rgba(0,0,0,0.6)' 
                : '0 12px 32px rgba(0,0,0,0.1)',
            }
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: '16px',
          },
          head: {
            fontWeight: 600,
            backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
          }
        }
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
            }
          }
        }
      },
    },
  }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <SettingsProvider>
          <Router>
            <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/upload" element={
              <ProtectedRoute>
                <Layout>
                  <Upload />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/cases" element={
              <ProtectedRoute>
                <Layout>
                  <CaseTracking />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/closed-cases" element={
              <ProtectedRoute>
                <Layout>
                  <ClosedCases />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/policy-timeline" element={
              <ProtectedRoute>
                <Layout>
                  <PolicyTimeline />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/cases/:caseId" element={
              <ProtectedRoute>
                <Layout>
                  <CaseDetails />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/logs" element={
              <ProtectedRoute>
                <Layout>
                  <Logs />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/billing" element={
              <ProtectedRoute>
                <Layout>
                  <Billing />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Redirect any unknown routes to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <WelcomeModal open={welcomeModalOpen} onClose={handleCloseWelcomeModal} />
          </Router>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <ThemeModeProvider>
      <NotificationsProvider>
        <AppWithTheme />
      </NotificationsProvider>
    </ThemeModeProvider>
  );
}

export default App;