from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .ghl_service import GHLService


@api_view(['GET'])
def ghl_ping(request):
    """
    Ejercicio 3: Endpoint para probar la conexión con GHL usando el Private Integration Token
    """
    service = GHLService()
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
