import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Button,
  Avatar,
  Fade,
  Grow
} from '@mui/material';
import {
  CalendarMonth,
  CheckCircle,
  Cancel,
  Refresh,
  Schedule,
  AccessTime,
  Event,
  TrendingUp
} from '@mui/icons-material';
import { apiCall, API_ENDPOINTS } from '../config/api';
import { useApiWithRateLimit } from '../hooks/useRateLimit';

/**
 * Componente CalendarsList mejorado - Ejercicio 4
 * Muestra la lista de calendarios con diseño moderno y animaciones
 */
const CalendarsListImproved = ({ onCalendarSelect }) => {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCalendarId, setSelectedCalendarId] = useState(null);
  const { callApiWithRateLimit } = useApiWithRateLimit();

  const fetchCalendars = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await callApiWithRateLimit(() =>
        apiCall(API_ENDPOINTS.CALENDARS)
      );

      if (data.success) {
        setCalendars(data.calendars || []);
      } else {
        setError(data.message || 'Error al obtener calendarios');
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch calendars:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendars();
  }, []);

  const handleCalendarSelect = (calendar) => {
    setSelectedCalendarId(calendar.id);
    if (onCalendarSelect) {
      onCalendarSelect(calendar);
    }
  };

  const getStatusChip = (status) => {
    const isActive = status === 'active';
    return (
      <Chip
        icon={isActive ? <CheckCircle /> : <Cancel />}
        label={isActive ? 'Activo' : 'Inactivo'}
        color={isActive ? 'success' : 'error'}
        size="small"
        variant="filled"
        sx={{
          fontWeight: 600,
          textTransform: 'capitalize',
          minWidth: 85
        }}
      />
    );
  };

  const getCalendarAvatar = (calendar, index) => {
    const colors = ['#2563eb', '#7c3aed', '#10b981', '#f59e0b', '#ef4444'];
    const bgColor = colors[index % colors.length];
    
    return (
      <Avatar
        sx={{
          bgcolor: bgColor,
          width: 40,
          height: 40,
          fontSize: '1.2rem',
          fontWeight: 700
        }}
      >
        {calendar.name ? calendar.name.charAt(0).toUpperCase() : 'C'}
      </Avatar>
    );
  };

  if (loading) {
    return (
      <Fade in={loading}>
        <Card 
          elevation={0} 
          sx={{ 
            mb: 3,
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 3
          }}
        >
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <CircularProgress size={50} thickness={4} />
            <Typography variant="h6" sx={{ mt: 3, fontWeight: 600 }}>
              Cargando calendarios
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Conectando con GoHighLevel...
            </Typography>
          </CardContent>
        </Card>
      </Fade>
    );
  }

  return (
    <Grow in={!loading} timeout={500}>
      <Card 
        elevation={0} 
        sx={{ 
          mb: 3,
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        {/* Header del componente */}
        <Box 
          sx={{ 
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            p: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                <CalendarMonth />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                  📅 Discovery de Calendarios
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ejercicio 4 - Lista de calendarios disponibles en GoHighLevel
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Chip 
                icon={<Event />}
                label={`${calendars.length} calendarios`}
                color="primary"
                variant="outlined"
                size="medium"
                sx={{ fontWeight: 600 }}
              />
              <Tooltip title="Actualizar calendarios">
                <IconButton 
                  onClick={fetchCalendars} 
                  disabled={loading}
                  sx={{ 
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark'
                    }
                  }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        <CardContent sx={{ p: 0 }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                m: 3,
                borderRadius: 2,
                '& .MuiAlert-message': {
                  width: '100%'
                }
              }}
            >
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                ❌ Error al cargar calendarios
              </Typography>
              <Typography variant="body2">{error}</Typography>
            </Alert>
          )}

          {calendars.length === 0 && !error ? (
            <Alert 
              severity="info" 
              sx={{ 
                m: 3,
                borderRadius: 2
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                ℹ️ No se encontraron calendarios
              </Typography>
              <Typography variant="body2">
                Verifica que tu cuenta de GoHighLevel tenga calendarios configurados.
              </Typography>
            </Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow 
                    sx={{ 
                      bgcolor: 'rgba(0,0,0,0.02)',
                      '& .MuiTableCell-head': {
                        fontWeight: 700,
                        color: 'text.primary',
                        borderBottom: '2px solid rgba(0,0,0,0.1)',
                        py: 2
                      }
                    }}
                  >
                    <TableCell width="60px"></TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Schedule color="primary" fontSize="small" />
                        Calendario
                      </Box>
                    </TableCell>
                    <TableCell width="150px">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUp color="primary" fontSize="small" />
                        Estado
                      </Box>
                    </TableCell>
                    <TableCell width="200px" align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                        <AccessTime color="primary" fontSize="small" />
                        Acciones
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {calendars.map((calendar, index) => (
                    <Grow in={true} timeout={300 + index * 100} key={calendar.id}>
                      <TableRow 
                        hover
                        sx={{ 
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          ...(selectedCalendarId === calendar.id && {
                            bgcolor: 'rgba(37, 99, 235, 0.08)',
                            transform: 'scale(1.01)',
                            boxShadow: '0 4px 8px rgba(37, 99, 235, 0.15)'
                          }),
                          '&:hover': {
                            bgcolor: selectedCalendarId === calendar.id 
                              ? 'rgba(37, 99, 235, 0.12)'
                              : 'rgba(0,0,0,0.04)',
                          },
                          '& .MuiTableCell-root': {
                            borderBottom: '1px solid rgba(0,0,0,0.05)',
                            py: 2
                          }
                        }}
                        onClick={() => calendar.status === 'active' && handleCalendarSelect(calendar)}
                      >
                        <TableCell>
                          {getCalendarAvatar(calendar, index)}
                        </TableCell>
                        
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {calendar.name || `Calendario ${index + 1}`}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                fontFamily: 'monospace',
                                fontSize: '0.7rem',
                                color: 'text.secondary',
                                bgcolor: 'rgba(0,0,0,0.05)',
                                px: 1,
                                py: 0.25,
                                borderRadius: 1
                              }}
                            >
                              {calendar.id}
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          {getStatusChip(calendar.status)}
                        </TableCell>
                        
                        <TableCell align="center">
                          <Button
                            size="medium"
                            variant={selectedCalendarId === calendar.id ? "contained" : "outlined"}
                            startIcon={<Schedule />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCalendarSelect(calendar);
                            }}
                            disabled={calendar.status !== 'active'}
                            sx={{
                              borderRadius: 2,
                              fontWeight: 600,
                              minWidth: 140,
                              textTransform: 'none',
                              ...(selectedCalendarId === calendar.id && {
                                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
                              })
                            }}
                          >
                            {selectedCalendarId === calendar.id ? 'Seleccionado' : 'Seleccionar'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    </Grow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Información adicional */}
          {calendars.length > 0 && (
            <Box sx={{ m: 3, p: 3, bgcolor: 'rgba(16, 185, 129, 0.05)', borderRadius: 2, border: '1px solid rgba(16, 185, 129, 0.1)' }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700, color: 'success.main', mb: 1 }}>
                💡 ¿Cómo funciona el Discovery de Calendarios?
              </Typography>
              <Box component="ol" sx={{ m: 0, pl: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                  React consulta el endpoint <code>/api/ghl/calendarios/</code>
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                  Django obtiene calendarios desde GoHighLevel API
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                  Se muestran con ID, nombre y estado en tiempo real
                </Typography>
                <Typography component="li" variant="body2">
                  Solo calendarios activos pueden usarse para crear citas
                </Typography>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Grow>
  );
};

export default CalendarsListImproved;
