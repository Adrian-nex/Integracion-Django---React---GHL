import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Grid,
  Chip,
  Alert,
  IconButton,
  Tooltip,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  Speed,
  Refresh,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Error,
  Timer
} from '@mui/icons-material';
import { useRateLimit } from '../hooks/useRateLimit';
import { apiCall, API_ENDPOINTS } from '../config/api';

/**
 * Dashboard de Rate Limits - PLUS Feature
 * Muestra información en tiempo real del consumo de la API de GoHighLevel
 */
const RateLimitDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const { rateLimitData, updateRateLimit, getRateLimitLevel, getRateLimitColor } = useRateLimit();

  const fetchRateLimitInfo = async () => {
    setLoading(true);
    try {
      const data = await apiCall(API_ENDPOINTS.RATE_LIMIT);
      updateRateLimit(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch rate limit info:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRateLimitInfo();
  }, []);

  const getPercentage = (used, total) => {
    if (total === 0) return 0;
    return Math.round((used / total) * 100);
  };

  const getRemainingPercentage = (remaining, total) => {
    if (total === 0) return 0;
    return Math.round((remaining / total) * 100);
  };

  const getLevelIcon = () => {
    const level = getRateLimitLevel();
    switch (level) {
      case 'good':
        return <CheckCircle color="success" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'danger':
      case 'critical':
        return <Error color="error" />;
      default:
        return <Speed color="disabled" />;
    }
  };

  const getLevelMessage = () => {
    const level = getRateLimitLevel();
    const { remaining, limit } = rateLimitData;
    
    switch (level) {
      case 'good':
        return '✅ Rate limits en estado óptimo';
      case 'warning':
        return `⚡ Atención: ${remaining} de ${limit} requests restantes`;
      case 'danger':
        return `⚠️ Advertencia: Pocas requests restantes (${remaining})`;
      case 'critical':
        return '🚨 ¡CRÍTICO! Rate limit casi agotado';
      default:
        return 'ℹ️ Información de rate limits no disponible';
    }
  };

  const formatTimeFromTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = new Date(timestamp * 1000);
      return date.toLocaleTimeString();
    } catch {
      return 'N/A';
    }
  };

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            🚦 PLUS: Dashboard de Rate Limits
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {lastUpdate && (
              <Chip
                icon={<Timer />}
                label={`Actualizado: ${lastUpdate.toLocaleTimeString()}`}
                size="small"
                variant="outlined"
              />
            )}
            
            <Tooltip title="Actualizar información">
              <IconButton onClick={fetchRateLimitInfo} disabled={loading}>
                {loading ? <CircularProgress size={20} /> : <Refresh />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Monitoreo en tiempo real del consumo de la API de GoHighLevel. 
          Sistema avanzado de alertas para prevenir límites.
        </Typography>

        {/* Alerta de estado general */}
        <Alert 
          severity={
            getRateLimitLevel() === 'good' ? 'success' :
            getRateLimitLevel() === 'warning' ? 'warning' :
            getRateLimitLevel() === 'unknown' ? 'info' : 'error'
          }
          icon={getLevelIcon()}
          sx={{ mb: 3 }}
        >
          <Typography variant="subtitle2">
            {getLevelMessage()}
          </Typography>
        </Alert>

        <Grid container spacing={3}>
          {/* Rate Limits por Ventana */}
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Speed color="primary" />
                Rate Limits por Ventana
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    Requests Restantes: <strong>{rateLimitData.remaining}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total: {rateLimitData.limit}
                  </Typography>
                </Box>
                
                <LinearProgress
                  variant="determinate"
                  value={getRemainingPercentage(rateLimitData.remaining, rateLimitData.limit)}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getRateLimitColor(),
                      borderRadius: 4
                    }
                  }}
                />
                
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {getRemainingPercentage(rateLimitData.remaining, rateLimitData.limit)}% disponible
                </Typography>
              </Box>

              {rateLimitData.used > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <TrendingUp fontSize="small" color="action" />
                  <Typography variant="caption">
                    Requests utilizadas: {rateLimitData.used}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Rate Limits Diarios */}
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingDown color="secondary" />
                Cuota Diaria
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    Diaria Restante: <strong>{rateLimitData.daily_remaining.toLocaleString()}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total: {rateLimitData.daily_limit.toLocaleString()}
                  </Typography>
                </Box>
                
                <LinearProgress
                  variant="determinate"
                  value={getRemainingPercentage(rateLimitData.daily_remaining, rateLimitData.daily_limit)}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: rateLimitData.daily_remaining > rateLimitData.daily_limit * 0.1 ? '#4caf50' : '#f44336',
                      borderRadius: 4
                    }
                  }}
                />
                
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {getRemainingPercentage(rateLimitData.daily_remaining, rateLimitData.daily_limit)}% de cuota diaria disponible
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Timer fontSize="small" color="action" />
                <Typography variant="caption">
                  Usadas hoy: {(rateLimitData.daily_limit - rateLimitData.daily_remaining).toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Información adicional */}
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" display="block" color="text.secondary">
                    Estado Actual
                  </Typography>
                  <Chip
                    label={getRateLimitLevel().toUpperCase()}
                    color={
                      getRateLimitLevel() === 'good' ? 'success' :
                      getRateLimitLevel() === 'warning' ? 'warning' : 'error'
                    }
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" display="block" color="text.secondary">
                    Reset en
                  </Typography>
                  <Typography variant="body2">
                    {formatTimeFromTimestamp(rateLimitData.reset)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" display="block" color="text.secondary">
                    Límite por Ventana
                  </Typography>
                  <Typography variant="body2">
                    {rateLimitData.limit} requests
                  </Typography>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" display="block" color="text.secondary">
                    Límite Diario
                  </Typography>
                  <Typography variant="body2">
                    {rateLimitData.daily_limit.toLocaleString()} requests
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* Explicación del PLUS */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
          <Typography variant="caption" display="block" gutterBottom>
            ✨ <strong>Funcionalidad PLUS - Rate Limit Monitoring</strong>
          </Typography>
          <Typography variant="caption" display="block">
            • Captura automática de headers X-RateLimit-* de GoHighLevel<br/>
            • Sistema de alertas por niveles (Verde/Amarillo/Rojo)<br/>
            • Monitoreo tanto de límites por ventana como diarios<br/>
            • Actualización en tiempo real con cada petición a la API<br/>
            • Prevención proactiva de interrupciones del servicio
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RateLimitDashboard;
