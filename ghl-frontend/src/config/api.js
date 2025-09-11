/**
 * Configuración de la API para el frontend React
 * Conecta con el backend Django en localhost:8000
 */

export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000/api/ghl',
  TIMEOUT: 30000, // 30 segundos
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

/**
 * Función helper para hacer llamadas a la API
 * Maneja automáticamente rate limits y errores
 */
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      ...API_CONFIG.HEADERS,
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};

/**
 * Endpoints específicos de la API
 */
export const API_ENDPOINTS = {
  // Ejercicio 3: Conexión
  PING: '/ping/',
  DEBUG: '/debug/',
  
  // Ejercicio 4: Calendarios
  CALENDARS: '/calendars/',
  LOCATIONS: '/locations/',
  
  // Ejercicio 5: Citas
  APPOINTMENTS: '/appointments/',
  CREATE_APPOINTMENT: '/appointments/create/',
  
  // Auxiliares
  CONTACTS: '/contacts/',
  CREATE_CONTACT: '/contacts/create/',
  
  // PLUS: Rate Limits
  RATE_LIMIT: '/rate-limit/',
};
