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
import CalendarsList from './components/CalendarsList';
import CreateAppointment from './components/CreateAppointment';
import RateLimitDashboard from './components/RateLimitDashboard';
import { RateLimitProvider } from './hooks/useRateLimit';

// Tema personalizado para Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
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
          {/* App Bar */}
          <AppBar position="static" elevation={2}>
            <Toolbar>
              <Api sx={{ mr: 2 }} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Integración Django-React-GoHighLevel
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  icon={<Code />}
                  label="Backend 100%"
                  color="success"
                  variant="outlined"
                  size="small"
                  sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                />
                <Chip
                  icon={<Speed />}
                  label="PLUS: Rate Limits"
                  color="secondary"
                  variant="outlined"
                  size="small"
                  sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                />
              </Box>
            </Toolbar>
          </AppBar>

          <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Encabezado del proyecto */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: 'primary.50' }}>
              <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
                🏥 Sistema de Gestión de Citas Médicas
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Proyecto completo de integración que conecta React con Django y la API de GoHighLevel 
                para gestionar calendarios y citas médicas. Incluye sistema avanzado de monitoreo de rate limits.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="✅ Ejercicio 3: Conexión GHL" color="success" size="small" />
                <Chip label="✅ Ejercicio 4: Discovery Calendarios" color="success" size="small" />
                <Chip label="✅ Ejercicio 5: Crear Citas" color="success" size="small" />
                <Chip label="✨ PLUS: Rate Limit Monitoring" color="secondary" size="small" />
              </Box>
            </Paper>

            {/* Dashboard de Rate Limits - PLUS Feature */}
            <RateLimitDashboard />

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
