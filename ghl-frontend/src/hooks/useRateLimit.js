import { useState, useCallback, useContext, createContext } from 'react';

/**
 * Context para Rate Limits - PLUS Feature
 * Permite compartir información de rate limits en toda la aplicación
 */
const RateLimitContext = createContext();

/**
 * Provider para Rate Limits
 */
export const RateLimitProvider = ({ children }) => {
  const [rateLimitData, setRateLimitData] = useState({
    remaining: 0,
    limit: 0,
    used: 0,
    daily_remaining: 0,
    daily_limit: 0,
    reset: null,
    lastUpdated: null
  });

  const updateRateLimit = useCallback((newData) => {
    if (newData && newData.rate_limit) {
      setRateLimitData({
        remaining: newData.rate_limit.remaining || 0,
        limit: newData.rate_limit.limit || 0,
        used: newData.rate_limit.used || 0,
        daily_remaining: newData.rate_limit.daily_remaining || 0,
        daily_limit: newData.rate_limit.daily_limit || 0,
        reset: newData.rate_limit.reset || null,
        lastUpdated: new Date().toISOString()
      });
    }
  }, []);

  const getRateLimitLevel = useCallback(() => {
    const { remaining, limit } = rateLimitData;
    if (limit === 0) return 'unknown';
    
    const percentage = (remaining / limit) * 100;
    if (percentage > 70) return 'good';      // Verde
    if (percentage > 30) return 'warning';   // Amarillo  
    if (percentage > 10) return 'danger';    // Naranja
    return 'critical';                       // Rojo
  }, [rateLimitData]);

  const getRateLimitColor = useCallback(() => {
    const level = getRateLimitLevel();
    switch (level) {
      case 'good': return '#4caf50';        // Verde
      case 'warning': return '#ff9800';     // Amarillo
      case 'danger': return '#f44336';      // Rojo
      case 'critical': return '#d32f2f';    // Rojo oscuro
      default: return '#9e9e9e';            // Gris
    }
  }, [getRateLimitLevel]);

  const value = {
    rateLimitData,
    updateRateLimit,
    getRateLimitLevel,
    getRateLimitColor
  };

  return (
    <RateLimitContext.Provider value={value}>
      {children}
    </RateLimitContext.Provider>
  );
};

/**
 * Hook personalizado para usar Rate Limits
 * PLUS Feature: Monitoreo avanzado de rate limits
 */
export const useRateLimit = () => {
  const context = useContext(RateLimitContext);
  
  if (!context) {
    throw new Error('useRateLimit must be used within a RateLimitProvider');
  }
  
  return context;
};

/**
 * Hook para hacer llamadas API con rate limit tracking
 */
export const useApiWithRateLimit = () => {
  const { updateRateLimit } = useRateLimit();
  
  const callApiWithRateLimit = useCallback(async (apiFunction) => {
    try {
      const result = await apiFunction();
      
      // Actualizar rate limits si están presentes en la respuesta
      updateRateLimit(result);
      
      return result;
    } catch (error) {
      console.error('API call with rate limit failed:', error);
      throw error;
    }
  }, [updateRateLimit]);
  
  return { callApiWithRateLimit };
};
