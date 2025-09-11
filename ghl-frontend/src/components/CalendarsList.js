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
  Button
} from '@mui/material';
import {
  CalendarMonth,
  CheckCircle,
  Cancel,
  Refresh,
  Info,
  Schedule
} from '@mui/icons-material';
import { apiCall, API_ENDPOINTS } from '../config/api';
import { useApiWithRateLimit } from '../hooks/useRateLimit';

/**
 * Componente CalendarsList - Ejercicio 4
 * Muestra la lista de calendarios disponibles en GoHighLevel
 */
const CalendarsList = ({ onCalendarSelect }) => {
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
        label={status}
        color={isActive ? 'success' : 'error'}
        size="small"
        variant={isActive ? 'filled' : 'outlined'}
      />
    );
  };

  if (loading) {
    return (
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Cargando calendarios de GoHighLevel...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            📅 Ejercicio 4: Calendarios Disponibles
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Actualizar calendarios">
              <IconButton onClick={fetchCalendars} disabled={loading}>
                <Refresh />
              </IconButton>
            </Tooltip>
            
            <Chip 
              icon={<CalendarMonth />}
              label={`${calendars.length} calendarios`}
              color="primary"
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Lista de calendarios obtenidos desde GoHighLevel. Selecciona uno para crear citas.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              ❌ Error al cargar calendarios
            </Typography>
            <Typography variant="body2">{error}</Typography>
          </Alert>
        )}

        {calendars.length === 0 && !error ? (
          <Alert severity="info">
            <Typography variant="subtitle2">
              ℹ️ No se encontraron calendarios
            </Typography>
            <Typography variant="body2">
              Verifica que tu cuenta de GoHighLevel tenga calendarios configurados.
            </Typography>
          </Alert>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.50' }}>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      ID del Calendario
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Nombre
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Estado
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Acciones
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {calendars.map((calendar, index) => (
                  <TableRow 
                    key={calendar.id} 
                    hover
                    sx={{ 
                      '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                      ...(selectedCalendarId === calendar.id && {
                        bgcolor: 'primary.50',
                        '&:hover': { bgcolor: 'primary.100' }
                      })
                    }}
                  >
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          color: 'text.secondary'
                        }}
                      >
                        {calendar.id}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {calendar.name || `Calendario ${index + 1}`}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      {getStatusChip(calendar.status)}
                    </TableCell>
                    
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant={selectedCalendarId === calendar.id ? "contained" : "outlined"}
                        startIcon={<Schedule />}
                        onClick={() => handleCalendarSelect(calendar)}
                        disabled={calendar.status !== 'active'}
                      >
                        {selectedCalendarId === calendar.id ? 'Seleccionado' : 'Seleccionar'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Información adicional */}
        {calendars.length > 0 && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
            <Typography variant="caption" display="block" gutterBottom>
              💡 <strong>¿Cómo funciona el Discovery?</strong>
            </Typography>
            <Typography variant="caption" display="block">
              1. React consulta <code>/api/ghl/calendars/</code><br/>
              2. Django obtiene calendarios desde GoHighLevel<br/>
              3. Se muestran con ID, nombre y estado<br/>
              4. Solo calendarios activos pueden usarse para crear citas
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarsList;
