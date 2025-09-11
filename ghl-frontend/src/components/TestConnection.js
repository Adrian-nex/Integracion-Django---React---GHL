import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Alert, 
  CircularProgress,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  PlayArrow, 
  CheckCircle, 
  Error,
  ExpandMore,
  Speed
} from '@mui/icons-material';
import { apiCall, API_ENDPOINTS } from '../config/api';
import { useApiWithRateLimit } from '../hooks/useRateLimit';

/**
 * Componente TestConnection - Ejercicio 3
 * Permite probar la conexión básica con la API de GoHighLevel
 */
const TestConnection = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { callApiWithRateLimit } = useApiWithRateLimit();

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await callApiWithRateLimit(() => 
        apiCall(API_ENDPOINTS.PING)
      );
      
      setResult(data);
    } catch (err) {
      setError(err.message);
      console.error('Connection test failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (loading) return <CircularProgress size={20} />;
    if (result?.success) return <CheckCircle color="success" />;
    if (error) return <Error color="error" />;
    return <PlayArrow />;
  };

  const getStatusColor = () => {
    if (result?.success) return 'success';
    if (error) return 'error';
    return 'primary';
  };

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          🎯 Ejercicio 3: Prueba de Conexión con GoHighLevel
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Este componente prueba la conexión básica con la API de GoHighLevel 
          usando el endpoint /ping/ del backend Django.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <Button
            variant="contained"
            color={getStatusColor()}
            onClick={testConnection}
            disabled={loading}
            startIcon={getStatusIcon()}
            size="large"
          >
            {loading ? 'Probando Conexión...' : 'Probar Conexión con GHL'}
          </Button>

          {result?.rate_limit && (
            <Chip
              icon={<Speed />}
              label={`${result.rate_limit.remaining}/${result.rate_limit.limit} requests`}
              color="info"
              variant="outlined"
              size="small"
            />
          )}
        </Box>

        {/* Resultado exitoso */}
        {result?.success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              ✅ ¡Conexión exitosa con GoHighLevel!
            </Typography>
            <Typography variant="body2">
              {result.message}
            </Typography>
            
            {result.data && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" display="block">
                  📊 Datos obtenidos: {result.data.total_locations || result.data.total_calendars || 0} registros
                </Typography>
              </Box>
            )}
          </Alert>
        )}

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              ❌ Error en la conexión
            </Typography>
            <Typography variant="body2">
              {error}
            </Typography>
          </Alert>
        )}

        {/* Detalles técnicos expandibles */}
        {(result || error) && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle2">
                🔍 Ver Detalles Técnicos
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ 
                bgcolor: 'grey.50', 
                p: 2, 
                borderRadius: 1,
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                maxHeight: 300,
                overflow: 'auto'
              }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {result 
                    ? JSON.stringify(result, null, 2)
                    : JSON.stringify({ error }, null, 2)
                  }
                </pre>
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Información educativa */}
        <Box sx={{ mt: 2, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
          <Typography variant="caption" display="block" gutterBottom>
            💡 <strong>¿Cómo funciona?</strong>
          </Typography>
          <Typography variant="caption" display="block">
            1. React hace petición a <code>/api/ghl/ping/</code><br/>
            2. Django backend prueba conexión con GoHighLevel<br/>
            3. Si /locations/ falla, usa fallback a /calendars/<br/>
            4. Devuelve JSON con datos reales + información de rate limits
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TestConnection;
