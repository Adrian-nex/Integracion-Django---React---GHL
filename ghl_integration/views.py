from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .ghl_service import GHLService


@api_view(['GET'])
def ghl_ping(request):
    """
    Ejercicio 3: Endpoint para probar la conexión con GHL usando el Private Integration Token.
    Comportamiento:
    - Si se pasa ?locationId=, intenta listar calendarios de esa location (para mostrar JSON real inmediatamente).
    - Si no, intenta /locations/search y, si falla, usa GHL_DEFAULT_LOCATION_ID para listar calendarios.
    """
    service = GHLService()

    # Priorizar locationId de la query si está presente para devolver JSON real de calendarios
    q_location_id = request.query_params.get('locationId')
    if q_location_id:
        calendars_result = service.get_calendars(q_location_id)
        return Response(calendars_result, status=status.HTTP_200_OK if calendars_result.get('success') else status.HTTP_400_BAD_REQUEST)

    # Fallback a prueba general de conexión
    result = service.test_connection()
    return Response(result, status=status.HTTP_200_OK if result.get('success') else status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def ghl_locations(request):
    """
    Endpoint auxiliar: obtener todas las ubicaciones (locations) disponibles
    """
    service = GHLService()
    result = service.get_locations()
    return Response(result, status=status.HTTP_200_OK if result.get('success') else status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def ghl_calendars(request):
    """
    Ejercicio 4: Endpoint para listar calendarios de una location
    Query param opcional: locationId
    """
    location_id = request.query_params.get('locationId')
    service = GHLService()
    result = service.get_calendars(location_id)
    return Response(result, status=status.HTTP_200_OK if result.get('success') else status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def debug_config(request):
    """
    Endpoint de debug para verificar configuración
    """
    from django.conf import settings
    return Response({
        'ghl_base_url': getattr(settings, 'GHL_BASE_URL', 'No configurado'),
        'ghl_token_configured': bool(getattr(settings, 'GHL_PRIVATE_TOKEN', None)),
        'ghl_token_prefix': getattr(settings, 'GHL_PRIVATE_TOKEN', '')[:10] + '...' if getattr(settings, 'GHL_PRIVATE_TOKEN', None) else 'No token',
        'default_location_configured': bool(getattr(settings, 'GHL_DEFAULT_LOCATION_ID', None)),
        'default_location_id': getattr(settings, 'GHL_DEFAULT_LOCATION_ID', None) or 'No configurado',
        'mock_mode': getattr(settings, 'GHL_MOCK', False),
    })


@api_view(['POST'])
def create_appointment(request):
    """
    Ejercicio 5: Endpoint para crear una cita
    Body esperado (JSON):
    {
        "calendarId": "...",
        "contactId": "...",
        "startTime": "2024-01-15T10:00:00Z",
        "endTime": "2024-01-15T11:00:00Z",
        "title": "Cita médica",
        "appointmentStatus": "confirmed"
    }
    """
    data = request.data
    required_fields = ["calendarId", "contactId", "startTime", "endTime"]
    missing = [f for f in required_fields if f not in data]
    if missing:
        return Response({
            'success': False,
            'message': 'Faltan campos requeridos',
            'missing_fields': missing
        }, status=status.HTTP_400_BAD_REQUEST)

    service = GHLService()
    result = service.create_appointment(data)
    return Response(result, status=status.HTTP_200_OK if result.get('success') else status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def create_contact(request):
    """
    Endpoint auxiliar: crear un contacto en GHL (necesario antes de crear citas)
    Body esperado (JSON):
    {
        "firstName": "Juan",
        "lastName": "Pérez",
        "email": "juan@ejemplo.com",
        "phone": "+1234567890",
        "locationId": "..." // opcional, usará GHL_DEFAULT_LOCATION_ID si no se especifica
    }
    """
    data = request.data.copy()
    required_fields = ["firstName", "lastName", "email"]
    missing = [f for f in required_fields if f not in data]
    if missing:
        return Response({
            'success': False,
            'message': 'Faltan campos requeridos',
            'missing_fields': missing
        }, status=status.HTTP_400_BAD_REQUEST)

    # Si no se especifica locationId, usar el por defecto
    service = GHLService()
    if 'locationId' not in data and service.default_location_id:
        data['locationId'] = service.default_location_id
    elif 'locationId' not in data:
        return Response({
            'success': False,
            'message': 'Se requiere locationId o configurar GHL_DEFAULT_LOCATION_ID'
        }, status=status.HTTP_400_BAD_REQUEST)

    result = service.create_contact(data)
    return Response(result, status=status.HTTP_201_CREATED if result.get('success') else status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_contacts(request):
    """
    Endpoint auxiliar: obtener contactos de GHL (útil para debugging)
    Query param opcional: locationId
    """
    location_id = request.query_params.get('locationId')
    service = GHLService()
    
    # Para modo mock, devolvemos contactos simulados
    if service.mock:
        contacts = [
            {'id': 'contact_mock_001', 'firstName': 'Juan', 'lastName': 'Pérez', 'email': 'juan@demo.com', 'phone': '+1234567890'},
            {'id': 'contact_mock_002', 'firstName': 'María', 'lastName': 'García', 'email': 'maria@demo.com', 'phone': '+1234567891'},
        ]
        return Response({
            'success': True,
            'contacts': contacts,
            'total_contacts': len(contacts)
        })
    
    # Para API real (si está disponible)
    effective_location_id = location_id or service.default_location_id
    if not effective_location_id:
        return Response({
            'success': False,
            'error': {'message': 'Se requiere locationId o configurar GHL_DEFAULT_LOCATION_ID'}
        }, status=status.HTTP_400_BAD_REQUEST)
    
    result = service._make_request('GET', f'/contacts/?locationId={effective_location_id}')
    return Response(result, status=status.HTTP_200_OK if result.get('success') else status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_appointments(request):
    """
    Endpoint auxiliar: obtener citas de GHL (útil para debugging)
    Query params opcionales: locationId, calendarId
    """
    location_id = request.query_params.get('locationId')
    calendar_id = request.query_params.get('calendarId')
    service = GHLService()
    
    # Para modo mock, devolvemos citas simuladas
    if service.mock:
        appointments = [
            {
                'id': 'apt_mock_001',
                'calendarId': calendar_id or 'cal_mock_001',
                'contactId': 'contact_mock_001',
                'startTime': '2025-01-15T14:00:00Z',
                'endTime': '2025-01-15T14:30:00Z',
                'title': 'Cita de prueba (mock)',
                'status': 'confirmed'
            }
        ]
        return Response({
            'success': True,
            'appointments': appointments,
            'total_appointments': len(appointments)
        })
    
    # Para API real (si está disponible)
    effective_location_id = location_id or service.default_location_id
    if not effective_location_id:
        return Response({
            'success': False,
            'error': {'message': 'Se requiere locationId o configurar GHL_DEFAULT_LOCATION_ID'}
        }, status=status.HTTP_400_BAD_REQUEST)
    
    endpoint = f'/calendars/events?locationId={effective_location_id}'
    if calendar_id:
        endpoint += f'&calendarId={calendar_id}'
    
    result = service._make_request('GET', endpoint)
    return Response(result, status=status.HTTP_200_OK if result.get('success') else status.HTTP_400_BAD_REQUEST)
