import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Chip,
  Paper
} from '@mui/material';
import {
  Api,
  Speed,
  Code
} from '@mui/icons-material';

// Componentes personalizados
import TestConnection from './components/TestConnection';
import CalendarsList from './components/CalendarsListImproved';
import CreateAppointment from './components/CreateAppointment';
import RateLimitDashboard from './components/RateLimitDashboard';
import { RateLimitProvider } from './hooks/useRateLimit';

// Tema moderno y profesional para Material-UI
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb', // Azul más vibrante
      light: '#60a5fa',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7c3aed', // Morado moderno
      light: '#a78bfa',
      dark: '#5b21b6',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#047857',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    background: {
      default: '#f8fafc', // Gris más suave
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3.5rem',
      lineHeight: 1.1,
    },
    h4: {
      fontWeight: 700,
      fontSize: '2.125rem',
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    subtitle1: {
      fontSize: '1.1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease-in-out',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: '0.875rem',
        },
        contained: {
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

/**
 * Aplicación principal - Integración Django-React-GHL
 * Incluye todos los ejercicios + funcionalidad PLUS
 */
function App() {
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [createdAppointments, setCreatedAppointments] = useState([]);

  const handleCalendarSelect = (calendar) => {
    setSelectedCalendar(calendar);
  };

  const handleAppointmentCreated = (appointment) => {
    setCreatedAppointments(prev => [appointment, ...prev]);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RateLimitProvider>
        <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
          {/* Header moderno con gradiente */}
          <AppBar 
            position="static" 
            elevation={0}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <Toolbar sx={{ py: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                <Api sx={{ mr: 1, fontSize: '2rem' }} />
                <Box>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    GHL Integration
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem' }}>
                    Django + React + GoHighLevel
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ flexGrow: 1 }} />
              
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip
                  icon={<Code />}
                  label="Backend Ready"
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(16, 185, 129, 0.2)',
                    color: '#10b981',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    fontWeight: 600
                  }}
                />
                <Chip
                  icon={<Speed />}
                  label="Rate Monitoring"
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(124, 58, 237, 0.2)',
                    color: '#7c3aed',
                    border: '1px solid rgba(124, 58, 237, 0.3)',
                    fontWeight: 600
                  }}
                />
              </Box>
            </Toolbar>
          </AppBar>

          <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Hero Section moderna */}
            <Box 
              sx={{ 
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                borderRadius: 3,
                p: 4,
                mb: 4,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100px',
                  height: '100px',
                  background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(124, 58, 237, 0.2) 100%)',
                  borderRadius: '50%',
                  transform: 'translate(30px, -30px)'
                }
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography 
                  variant="h4" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2
                  }}
                >
                  🏥 Sistema de Gestión de Citas Médicas
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'text.secondary',
                    mb: 3,
                    fontWeight: 400,
                    maxWidth: '800px',
                    lineHeight: 1.6
                  }}
                >
                  Plataforma completa que integra <strong>React</strong>, <strong>Django</strong> y la <strong>API de GoHighLevel</strong> 
                  para gestionar calendarios y citas médicas con monitoreo avanzado de rate limits.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                  <Chip 
                    label="✅ Ejercicio 3: Conexión GHL" 
                    color="success" 
                    variant="filled"
                    sx={{ fontWeight: 600, px: 1 }} 
                  />
                  <Chip 
                    label="✅ Ejercicio 4: Discovery Calendarios" 
                    color="success" 
                    variant="filled"
                    sx={{ fontWeight: 600, px: 1 }} 
                  />
                  <Chip 
                    label="✅ Ejercicio 5: Crear Citas" 
                    color="success" 
                    variant="filled"
                    sx={{ fontWeight: 600, px: 1 }} 
                  />
                  <Chip 
                    label="✨ PLUS: Rate Limit Monitoring" 
                    color="secondary" 
                    variant="filled"
                    sx={{ fontWeight: 600, px: 1 }} 
                  />
                </Box>
                
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: 'success.main', borderRadius: '50%' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Backend Django Ready
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      React Frontend Active
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: 'warning.main', borderRadius: '50%' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      GoHighLevel Connected
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Dashboard de Rate Limits - PLUS Feature */}
            <Box sx={{ mb: 4 }}>
              <RateLimitDashboard />
            </Box>

            {/* Grid de componentes principales */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Ejercicio 3: Prueba de Conexión */}
              <TestConnection />

              {/* Ejercicio 4: Lista de Calendarios */}
              <CalendarsList 
                onCalendarSelect={handleCalendarSelect}
              />

              {/* Ejercicio 5: Crear Citas */}
              <CreateAppointment 
                selectedCalendar={selectedCalendar}
                onAppointmentCreated={handleAppointmentCreated}
              />
            </Box>

            {/* Resumen de citas creadas */}
            {createdAppointments.length > 0 && (
              <Paper elevation={3} sx={{ p: 3, bgcolor: 'success.50' }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'success.main' }}>
                  ✅ Citas Creadas Exitosamente ({createdAppointments.length})
                </Typography>
                {createdAppointments.slice(0, 3).map((appointment, index) => (
                  <Box key={appointment.id || index} sx={{ mb: 1 }}>
                    <Chip
                      label={`${appointment.title || 'Cita'} - ID: ${appointment.id}`}
                      color="success"
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                ))}
              </Paper>
            )}

            {/* Footer informativo */}
            <Box sx={{ mt: 6, p: 3, textAlign: 'center', color: 'text.secondary' }}>
              <Typography variant="body2">
                🚀 Proyecto desarrollado con metodología Scrum • Django 5.0.6 + React 18 + Material-UI
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Backend: Django REST Framework + GoHighLevel API • Frontend: React + Material-UI • 
                PLUS: Rate Limit Monitoring System
              </Typography>
            </Box>
          </Container>
        </Box>
      </RateLimitProvider>
    </ThemeProvider>
  );
}

export default App;
