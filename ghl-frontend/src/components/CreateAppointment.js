import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  MenuItem,
  Chip,
  Divider,
  Paper,
  InputAdornment
} from '@mui/material';
import {
  EventNote,
  Person,
  CalendarMonth,
  Schedule,
  Save,
  CheckCircle,
  Error,
  AccessTime
} from '@mui/icons-material';
import { apiCall, API_ENDPOINTS } from '../config/api';
import { useApiWithRateLimit } from '../hooks/useRateLimit';

/**
 * Componente CreateAppointment - Ejercicio 5
 * Formulario para crear citas en GoHighLevel
 */
const CreateAppointment = ({ selectedCalendar, onAppointmentCreated }) => {
  const [formData, setFormData] = useState({
    calendarId: '',
    contactId: '',
    startTime: '',
    endTime: '',
    title: '',
    appointmentStatus: 'confirmed'
  });
  
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  const { callApiWithRateLimit } = useApiWithRateLimit();

  // Cargar contactos al montar el componente
  useEffect(() => {
    fetchContacts();
  }, []);

  // Actualizar calendarId cuando se selecciona un calendario
  useEffect(() => {
    if (selectedCalendar) {
      setFormData(prev => ({ ...prev, calendarId: selectedCalendar.id }));
    }
  }, [selectedCalendar]);

  const fetchContacts = async () => {
    setLoadingContacts(true);
    try {
      const data = await callApiWithRateLimit(() =>
        apiCall(API_ENDPOINTS.CONTACTS)
      );
      
      if (data.success) {
        setContacts(data.contacts || []);
      }
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
      // En caso de error, crear contactos de ejemplo para testing
      setContacts([
        { id: 'contact_demo_1', firstName: 'Juan', lastName: 'Pérez', email: 'juan@demo.com' },
        { id: 'contact_demo_2', firstName: 'María', lastName: 'García', email: 'maria@demo.com' }
      ]);
    } finally {
      setLoadingContacts(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.calendarId) {
      errors.calendarId = 'Debes seleccionar un calendario';
    }
    
    if (!formData.contactId) {
      errors.contactId = 'Debes seleccionar un contacto';
    }
    
    if (!formData.startTime) {
      errors.startTime = 'La fecha y hora de inicio son requeridas';
    }
    
    if (!formData.endTime) {
      errors.endTime = 'La fecha y hora de fin son requeridas';
    }
    
    if (!formData.title.trim()) {
      errors.title = 'El título de la cita es requerido';
    }

    // Validar que la hora de fin sea posterior a la de inicio
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      
      if (end <= start) {
        errors.endTime = 'La hora de fin debe ser posterior a la de inicio';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-calcular hora de fin (1 hora después del inicio)
    if (field === 'startTime' && value) {
      const startDate = new Date(value);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 hora
      const endTimeString = endDate.toISOString().slice(0, 16);
      setFormData(prev => ({ ...prev, endTime: endTimeString }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const appointmentData = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString()
      };

      const data = await callApiWithRateLimit(() =>
        apiCall(API_ENDPOINTS.CREATE_APPOINTMENT, {
          method: 'POST',
          body: JSON.stringify(appointmentData)
        })
      );

      if (data.success) {
        setResult(data);
        
        // Limpiar formulario
        setFormData({
          calendarId: selectedCalendar?.id || '',
          contactId: '',
          startTime: '',
          endTime: '',
          title: '',
          appointmentStatus: 'confirmed'
        });

        // Notificar al componente padre
        if (onAppointmentCreated) {
          onAppointmentCreated(data.appointment);
        }
      } else {
        setError(data.message || 'Error al crear la cita');
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to create appointment:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedContact = () => {
    return contacts.find(contact => contact.id === formData.contactId);
  };

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          📝 Ejercicio 5: Crear Nueva Cita
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Formulario para crear citas directamente en GoHighLevel. 
          Los datos se envían al backend Django que los procesa y crea la cita real.
        </Typography>

        {/* Calendario seleccionado */}
        {selectedCalendar && (
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'success.50' }}>
            <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarMonth color="success" />
              Calendario Seleccionado: {selectedCalendar.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {selectedCalendar.id}
            </Typography>
          </Paper>
        )}

        {!selectedCalendar && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="subtitle2">
              ⚠️ Selecciona un calendario primero
            </Typography>
            <Typography variant="body2">
              Para crear una cita, primero debes seleccionar un calendario de la lista anterior.
            </Typography>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Información del contacto */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person color="primary" />
                Información del Contacto
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Seleccionar Contacto"
                value={formData.contactId}
                onChange={handleChange('contactId')}
                error={!!formErrors.contactId}
                helperText={formErrors.contactId}
                disabled={loading || loadingContacts}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  )
                }}
              >
                {loadingContacts ? (
                  <MenuItem disabled>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    Cargando contactos...
                  </MenuItem>
                ) : (
                  contacts.map((contact) => (
                    <MenuItem key={contact.id} value={contact.id}>
                      {contact.firstName} {contact.lastName} ({contact.email})
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              {getSelectedContact() && (
                <Paper sx={{ p: 2, bgcolor: 'info.50' }}>
                  <Typography variant="caption" display="block">
                    Contacto Seleccionado:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {getSelectedContact().firstName} {getSelectedContact().lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {getSelectedContact().email}
                  </Typography>
                </Paper>
              )}
            </Grid>

            {/* Información de la cita */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Schedule color="primary" />
                Detalles de la Cita
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título de la Cita"
                value={formData.title}
                onChange={handleChange('title')}
                error={!!formErrors.title}
                helperText={formErrors.title}
                disabled={loading}
                placeholder="Ej: Consulta médica, Revisión, Cita de seguimiento"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventNote />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Fecha y Hora de Inicio"
                value={formData.startTime}
                onChange={handleChange('startTime')}
                error={!!formErrors.startTime}
                helperText={formErrors.startTime}
                disabled={loading}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTime />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Fecha y Hora de Fin"
                value={formData.endTime}
                onChange={handleChange('endTime')}
                error={!!formErrors.endTime}
                helperText={formErrors.endTime}
                disabled={loading}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTime />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Estado de la Cita"
                value={formData.appointmentStatus}
                onChange={handleChange('appointmentStatus')}
                disabled={loading}
              >
                <MenuItem value="confirmed">Confirmada</MenuItem>
                <MenuItem value="pending">Pendiente</MenuItem>
                <MenuItem value="cancelled">Cancelada</MenuItem>
              </TextField>
            </Grid>

            {/* Botón de envío */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading || !selectedCalendar}
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                fullWidth
                sx={{ py: 1.5 }}
              >
                {loading ? 'Creando Cita...' : 'Crear Cita en GoHighLevel'}
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Resultado exitoso */}
        {result?.success && (
          <Alert severity="success" sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              ✅ ¡Cita creada exitosamente en GoHighLevel!
            </Typography>
            <Typography variant="body2">
              {result.message}
            </Typography>
            {result.appointment && (
              <Box sx={{ mt: 1 }}>
                <Chip
                  label={`ID: ${result.appointment.id}`}
                  size="small"
                  color="success"
                  variant="outlined"
                />
              </Box>
            )}
          </Alert>
        )}

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              ❌ Error al crear la cita
            </Typography>
            <Typography variant="body2">
              {error}
            </Typography>
          </Alert>
        )}

        {/* Información educativa */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
          <Typography variant="caption" display="block" gutterBottom>
            💡 <strong>¿Cómo funciona la creación de citas?</strong>
          </Typography>
          <Typography variant="caption" display="block">
            1. React valida el formulario y formatea las fechas a ISO<br/>
            2. Se envía POST a <code>/api/ghl/appointments/create/</code><br/>
            3. Django backend procesa y envía a GoHighLevel<br/>
            4. GHL crea la cita real y devuelve confirmación<br/>
            5. Se muestra el resultado + información de rate limits
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreateAppointment;
