"""
Servicio para interactuar con la API de GoHighLevel (GHL)
"""
import requests
from django.conf import settings
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)


class GHLService:
    """
    Servicio para manejar todas las interacciones con la API de GHL
    """
    
    def __init__(self):
        self.base_url = settings.GHL_BASE_URL
        self.private_token = settings.GHL_PRIVATE_TOKEN
        self.headers = {
            'Authorization': f'Bearer {self.private_token}',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    
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
        
        try:
            logger.info(f"Haciendo petición {method} a {url}")
            
            response = requests.request(
                method=method,
                url=url,
                headers=self.headers,
                json=data,
                timeout=30
            )
            
            logger.info(f"Respuesta recibida: Status {response.status_code}")
            
            # Si la respuesta es exitosa, retornamos el JSON
            if response.status_code in [200, 201]:
                return {
                    'success': True,
                    'data': response.json(),
                    'status_code': response.status_code
                }
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
    
    def test_connection(self) -> Dict:
        """
        Ejercicio 3: Prueba la conexión con GHL obteniendo las ubicaciones
        
        Returns:
            Dict: Resultado de la prueba de conexión
        """
        result = self._make_request('GET', '/locations/search')
        
        if result['success']:
            locations = result['data'].get('locations', [])
            return {
                'success': True,
                'message': f'Conexión exitosa! Se encontraron {len(locations)} ubicaciones.',
                'data': {
                    'total_locations': len(locations),
                    'locations': locations[:3]  # Solo mostramos las primeras 3 para no saturar
                }
            }
        else:
            return {
                'success': False,
                'message': 'Error al conectar con GHL API',
                'error': result['error']
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
            location_id: ID de la ubicación (opcional)
        
        Returns:
            Dict: Lista de calendarios
        """
        # Si no se proporciona location_id, usar el primer location disponible
        if not location_id:
            locations_result = self.get_locations()
            if locations_result['success'] and locations_result['locations']:
                location_id = locations_result['locations'][0]['id']
            else:
                return {
                    'success': False,
                    'error': {'message': 'No se pudo obtener una ubicación válida'}
                }
        
        # Obtener calendarios para la ubicación
        result = self._make_request('GET', f'/calendars/?locationId={location_id}')
        
        if result['success']:
            calendars = result['data'].get('calendars', [])
            return {
                'success': True,
                'calendars': calendars,
                'total_calendars': len(calendars),
                'location_id': location_id
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
