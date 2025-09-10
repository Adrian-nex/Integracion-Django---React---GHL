"""
URLs para la aplicación ghl_integration
"""
from django.urls import path
from . import views

urlpatterns = [
    # Ejercicio 3: Ping/Test de conexión con GHL
    path('ping/', views.ghl_ping, name='ghl_ping'),
    
    # Ejercicio 4: Discovery de calendarios
    path('calendars/', views.ghl_calendars, name='ghl_calendars'),
    
    # Ejercicio 5: Crear citas
    path('appointments/create/', views.create_appointment, name='create_appointment'),
    
    # Endpoints adicionales útiles
    path('locations/', views.ghl_locations, name='ghl_locations'),
]
