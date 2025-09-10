"""
URLs para la aplicación ghl_integration
"""
from django.urls import path
from . import views

urlpatterns = [
    # Debug endpoint
    path('debug/', views.debug_config, name='debug_config'),
    
    # Ejercicio 3: Ping/Test de conexión con GHL
    path('ping/', views.ghl_ping, name='ghl_ping'),
    
    # Ejercicio 4: Discovery de calendarios
    path('calendars/', views.ghl_calendars, name='ghl_calendars'),
    
    # Ejercicio 5: Crear citas
    path('appointments/create/', views.create_appointment, name='create_appointment'),
    path('appointments/', views.get_appointments, name='get_appointments'),
    
    # Endpoints adicionales útiles
    path('locations/', views.ghl_locations, name='ghl_locations'),
    path('contacts/create/', views.create_contact, name='create_contact'),
    path('contacts/', views.get_contacts, name='get_contacts'),
]
