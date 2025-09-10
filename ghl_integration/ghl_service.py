"""
Servicio para interactuar con la API de GoHighLevel (GHL)
"""
import requests
from django.conf import settings
from typing import Dict, List, Optional
import logging
from datetime import datetime

logger = logging.getLogger(__name__)


class GHLService:
    """
    Servicio para manejar todas las interacciones con la API de GHL
    """
    
    def __init__(self):
        self.base_url = settings.GHL_BASE_URL
        self.private_token = settings.GHL_PRIVATE_TOKEN
        self.default_location_id = getattr(settings, 'GHL_DEFAULT_LOCATION_ID', None)
        self.mock = getattr(settings, 'GHL_MOCK', False)
        self.headers = {
            'Authorization': f'Bearer {self.private_token}' if self.private_token else '',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Version': '2021-07-28',  # Header de versión requerido por GHL
        }
        # Algunos entornos requieren LocationId como header además del query param
        if self.default_location_id:
            self.headers['LocationId'] = self.default_location_id
    
    def _make_request(self, method: str, endpoint: str, data: Optional[Dict] = None) -> Dict:
        """
        Método privado para hacer peticiones HTTP a la API de GHL
        
        Args:
            method: Método HTTP (GET, POST, PUT, DELETE)
            endpoint: Endpoint de la API (sin el base URL)
            data: Datos para enviar en el body (opcional)
        
        Returns:
            Dict: Respuesta de la API
        """
        url = f"{self.base_url}/{endpoint.lstrip('/')}"

        # Si está activado el modo mock, devolvemos datos simulados según el endpoint
        if self.mock:
            return self._mock_response(method, endpoint, data)
        
        try:
            logger.info(f"Haciendo petición {method} a {url}")
            logger.info(f"Headers: {self.headers}")
            if data:
                logger.info(f"Datos: {data}")
            
            response = requests.request(
                method=method,
                url=url,
                headers=self.headers,
                json=data,
                timeout=30
            )
            
            logger.info(f"Respuesta recibida: Status {response.status_code}")
            logger.info(f"Respuesta headers: {dict(response.headers)}")
            
            # ✨ NUEVO: Capturar y loggear rate limits
            self._log_rate_limits(response.headers)
            
            # Si la respuesta es exitosa, retornamos el JSON
            if response.status_code in [200, 201]:
                result_data = {
                    'success': True,
                    'data': response.json(),
                    'status_code': response.status_code
                }
                
                # ✨ Incluir info de rate limits en la respuesta
                rate_limit_info = self._extract_rate_limit_info(response.headers)
                if rate_limit_info:
                    result_data['rate_limit'] = rate_limit_info
                    
                return result_data
            else:
                # Si hay error, retornamos información del error
                error_data = {}
                try:
                    error_data = response.json()
                except:
                    error_data = {'message': response.text}
                
                return {
                    'success': False,
                    'error': error_data,
                    'status_code': response.status_code
                }
        
        except requests.exceptions.RequestException as e:
            logger.error(f"Error en petición a GHL API: {str(e)}")
            return {
                'success': False,
                'error': {'message': f'Error de conexión: {str(e)}'},
                'status_code': 500
            }
    
    def _mock_response(self, method: str, endpoint: str, data: Optional[Dict]) -> Dict:
        """Respuestas simuladas para desarrollo sin depender de GHL real"""
        endpoint = endpoint.split('?')[0].rstrip('/')  # normalizar
        
        # Simular rate limits realistas
        import random
        import time
        mock_rate_limit = {
            'limit': 1000,
            'remaining': random.randint(750, 950),  # Simular consumo variable
            'used': None,  # Se calculará dinámicamente
            'reset': int(time.time()) + 3600  # Timestamp Unix: 1 hora desde ahora
        }
        mock_rate_limit['used'] = mock_rate_limit['limit'] - mock_rate_limit['remaining']
        
        # Loggear rate limits simulados
        logger.info(f"🚦 RATE LIMIT MOCK | Requests restantes: {mock_rate_limit['remaining']} | Límite total: {mock_rate_limit['limit']} | Usadas: {mock_rate_limit['used']} | Se resetea: {datetime.fromtimestamp(mock_rate_limit['reset']).strftime('%H:%M:%S')}")
        
        # Mock de /locations/search
        if method == 'GET' and endpoint.endswith('/locations/search'):
            locations = [{
                'id': self.default_location_id or 'loc_mock_001',
                'name': 'Clínica Demo',
                'status': 'active'
            }]
            return {
                'success': True, 
                'data': {'locations': locations}, 
                'status_code': 200,
                'rate_limit': mock_rate_limit
            }
        
        # Mock de /calendars
        if method == 'GET' and endpoint.endswith('/calendars'):
            calendars = [
                {'id': 'cal_mock_001', 'name': 'Calendario General', 'status': 'active'},
                {'id': 'cal_mock_002', 'name': 'Odontología', 'status': 'active'},
            ]
            return {
                'success': True, 
                'data': {'calendars': calendars}, 
                'status_code': 200,
                'rate_limit': mock_rate_limit
            }
        
        # Mock crear cita
        if method == 'POST' and endpoint.endswith('/calendars/events/appointments'):
            appointment = {
                'id': 'apt_mock_001',
                'calendarId': data.get('calendarId') if data else 'cal_mock_001',
                'contactId': data.get('contactId') if data else 'contact_mock_001',
                'startTime': data.get('startTime') if data else '2025-01-01T10:00:00Z',
                'endTime': data.get('endTime') if data else '2025-01-01T10:30:00Z',
                'status': data.get('appointmentStatus', 'confirmed') if data else 'confirmed',
                'title': data.get('title', 'Cita de prueba (mock)') if data else 'Cita de prueba (mock)'
            }
            # Simular que crear citas consume más rate limit
            mock_rate_limit['remaining'] = max(0, mock_rate_limit['remaining'] - 2)
            mock_rate_limit['used'] = mock_rate_limit['limit'] - mock_rate_limit['remaining']
            return {
                'success': True, 
                'data': appointment, 
                'status_code': 201,
                'rate_limit': mock_rate_limit
            }
        
        # Mock crear contacto
        if method == 'POST' and endpoint.endswith('/contacts'):
            contact = {
                'id': 'contact_mock_001',
                'firstName': data.get('firstName', 'Nombre'),
                'lastName': data.get('lastName', 'Apellido'),
                'email': data.get('email', 'contacto@demo.com'),
                'phone': data.get('phone', '+10000000000'),
            }
            return {
                'success': True, 
                'data': contact, 
                'status_code': 201,
                'rate_limit': mock_rate_limit
            }
        
        # Respuesta por defecto con rate limit
        return {
            'success': False, 
            'error': {'message': 'Mock no definido para este endpoint'}, 
            'status_code': 404,
            'rate_limit': mock_rate_limit
        }
    
    def _extract_rate_limit_info(self, headers) -> Optional[Dict]:
        """Extrae información de rate limits de los headers de respuesta"""
        rate_limit_info = {}
        
        # Headers comunes de rate limiting
        rate_limit_headers = {
            'X-RateLimit-Limit': 'limit',
            'X-RateLimit-Remaining': 'remaining', 
            'X-RateLimit-Reset': 'reset',
            'X-RateLimit-Used': 'used',
            'X-Rate-Limit-Limit': 'limit',  # Variante con guiones
            'X-Rate-Limit-Remaining': 'remaining',
            'X-Rate-Limit-Reset': 'reset',
            'RateLimit-Limit': 'limit',  # Sin X-
            'RateLimit-Remaining': 'remaining',
            'RateLimit-Reset': 'reset'
        }
        
        for header_name, key in rate_limit_headers.items():
            if header_name in headers:
                value = headers[header_name]
                try:
                    # Intentar convertir a int si es posible
                    rate_limit_info[key] = int(value)
                except ValueError:
                    rate_limit_info[key] = value
        
        return rate_limit_info if rate_limit_info else None
    
    def _log_rate_limits(self, headers):
        """Loggea información de rate limits en la consola de Django"""
        rate_info = self._extract_rate_limit_info(headers)
        
        if rate_info:
            # Construir mensaje informativo
            msg_parts = ["🚦 RATE LIMIT INFO"]
            
            if 'remaining' in rate_info:
                remaining = rate_info['remaining']
                msg_parts.append(f"Requests restantes: {remaining}")
                
                # Advertencia si quedan pocas requests
                if remaining <= 10:
                    msg_parts.append("⚠️  ADVERTENCIA: Pocas requests restantes!")
                elif remaining <= 50:
                    msg_parts.append("⚡ ATENCIÓN: Rate limit aproximándose")
            
            if 'limit' in rate_info:
                msg_parts.append(f"Límite total: {rate_info['limit']}")
            
            if 'used' in rate_info:
                msg_parts.append(f"Requests usadas: {rate_info['used']}")
            
            if 'reset' in rate_info:
                reset_time = rate_info['reset']
                try:
                    # Si es timestamp Unix, convertir a fecha legible
                    if isinstance(reset_time, int) and reset_time > 1000000000:
                        reset_datetime = datetime.fromtimestamp(reset_time)
                        msg_parts.append(f"Se resetea: {reset_datetime.strftime('%H:%M:%S')}")
                    else:
                        msg_parts.append(f"Se resetea en: {reset_time} segundos")
                except:
                    msg_parts.append(f"Reset: {reset_time}")
            
            # Log con nivel INFO para que aparezca en consola
            logger.info(" | ".join(msg_parts))
            
            # Si quedan muy pocas requests, usar WARNING para mayor visibilidad
            if rate_info.get('remaining', float('inf')) <= 10:
                logger.warning(f"🚨 RATE LIMIT CRÍTICO: Solo {rate_info['remaining']} requests restantes!")
        else:
            logger.debug("No se encontraron headers de rate limit en la respuesta")
    
    def test_connection(self) -> Dict:
        """
        Ejercicio 3: Prueba la conexión con GHL.
        Estrategia: si /locations/search falla (401), intentamos listar calendarios con un locationId conocido.
        """
        # Primer intento: listar locations (puede requerir permisos específicos)
        locations_try = self._make_request('GET', '/locations/search')
        if locations_try['success']:
            locations = locations_try['data'].get('locations', [])
            return {
                'success': True,
                'message': f'Conexión exitosa! Se encontraron {len(locations)} ubicaciones.',
                'data': {
                    'total_locations': len(locations),
                    'locations': locations[:3]
                }
            }
        
        # Segundo intento: usar locationId por defecto (si está configurado)
        if self.default_location_id:
            calendars_try = self._make_request('GET', f'/calendars/?locationId={self.default_location_id}')
            if calendars_try['success']:
                calendars = calendars_try['data'].get('calendars', [])
                return {
                    'success': True,
                    'message': f'Conexión exitosa usando locationId preconfigurado. {len(calendars)} calendarios disponibles.',
                    'data': {
                        'location_id': self.default_location_id,
                        'total_calendars': len(calendars),
                        'calendars_sample': calendars[:3]
                    }
                }
        
        return {
            'success': False,
            'message': 'Error al conectar con GHL API',
            'error': locations_try.get('error', {'message': 'Unknown error'})
        }
    
    def get_locations(self) -> Dict:
        """
        Obtiene todas las ubicaciones (subcuentas) disponibles
        
        Returns:
            Dict: Lista de ubicaciones
        """
        result = self._make_request('GET', '/locations/search')
        
        if result['success']:
            return {
                'success': True,
                'locations': result['data'].get('locations', [])
            }
        else:
            return result
    
    def get_calendars(self, location_id: Optional[str] = None) -> Dict:
        """
        Ejercicio 4: Obtiene los calendarios disponibles
        
        Args:
            location_id: ID de la ubicación. Si no se proporciona, se usa GHL_DEFAULT_LOCATION_ID.
        
        Returns:
            Dict: Lista de calendarios
        """
        # Resolver locationId: query param o .env
        effective_location_id = location_id or self.default_location_id
        if not effective_location_id:
            return {
                'success': False,
                'error': {'message': 'Se requiere locationId. Proporciónalo en la query o configura GHL_DEFAULT_LOCATION_ID en .env'}
            }
        
        # Obtener calendarios para la ubicación
        result = self._make_request('GET', f'/calendars/?locationId={effective_location_id}')
        
        if result['success']:
            calendars = result['data'].get('calendars', [])
            return {
                'success': True,
                'calendars': calendars,
                'total_calendars': len(calendars),
                'location_id': effective_location_id
            }
        else:
            return result
    
    def create_appointment(self, appointment_data: Dict) -> Dict:
        """
        Ejercicio 5: Crea una nueva cita en GHL
        
        Args:
            appointment_data: Datos de la cita a crear
            
        Expected format:
        {
            "calendarId": "calendar_id_here",
            "contactId": "contact_id_here", 
            "startTime": "2024-01-15T10:00:00Z",
            "endTime": "2024-01-15T11:00:00Z",
            "title": "Cita médica",
            "appointmentStatus": "confirmed"
        }
        
        Returns:
            Dict: Resultado de la creación
        """
        result = self._make_request('POST', '/calendars/events/appointments', appointment_data)
        
        if result['success']:
            return {
                'success': True,
                'message': 'Cita creada exitosamente',
                'appointment': result['data']
            }
        else:
            return {
                'success': False,
                'message': 'Error al crear la cita',
                'error': result['error']
            }
    
    def create_contact(self, contact_data: Dict) -> Dict:
        """
        Crea un nuevo contacto en GHL (útil para las citas)
        
        Args:
            contact_data: Datos del contacto
            
        Expected format:
        {
            "firstName": "Juan",
            "lastName": "Pérez", 
            "email": "juan@example.com",
            "phone": "+1234567890",
            "locationId": "location_id_here"
        }
        
        Returns:
            Dict: Resultado de la creación
        """
        result = self._make_request('POST', '/contacts/', contact_data)
        
        if result['success']:
            return {
                'success': True,
                'message': 'Contacto creado exitosamente',
                'contact': result['data']
            }
        else:
            return result
