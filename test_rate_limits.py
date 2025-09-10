#!/usr/bin/env python
"""
🚦 Script de prueba para demostrar el manejo de Rate Limits
===========================================================

Este script demuestra cómo el sistema captura y muestra los rate limits 
de la API de GoHighLevel en la consola de Django.

Ejecutar con: python test_rate_limits.py
"""

import os
import sys
import django
from pathlib import Path

# Configurar Django
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

import requests
import time
from ghl_integration.ghl_service import GHLService


def test_rate_limits_real_api():
    """Prueba rate limits con API real de GHL"""
    print("=" * 60)
    print("🚦 PROBANDO RATE LIMITS - API REAL DE GHL")
    print("=" * 60)
    
    service = GHLService()
    
    if service.mock:
        print("⚠️  Modo mock activado. Para probar API real, cambia GHL_MOCK=False en .env")
        return test_rate_limits_mock()
    
    print("📡 Realizando múltiples requests para ver rate limits...\n")
    
    for i in range(5):
        print(f"🔄 Request {i+1}/5:")
        result = service.test_connection()
        
        if result.get('rate_limit'):
            print(f"   Rate Limit Info: {result['rate_limit']}")
        else:
            print("   No se encontró info de rate limit en la respuesta")
        
        print(f"   Status: {'✅ Exitoso' if result.get('success') else '❌ Error'}")
        print()
        
        # Esperar un poco entre requests
        time.sleep(1)


def test_rate_limits_mock():
    """Prueba rate limits con modo mock activado"""
    print("=" * 60)
    print("🎭 PROBANDO RATE LIMITS - MODO MOCK")
    print("=" * 60)
    
    service = GHLService()
    
    print("📡 Realizando múltiples requests simulados...\n")
    
    endpoints_to_test = [
        ("Ping/Conexión", lambda: service.test_connection()),
        ("Calendarios", lambda: service.get_calendars()),
        ("Crear Contacto", lambda: service.create_contact({
            'firstName': 'Test',
            'lastName': 'User',
            'email': 'test@ejemplo.com'
        })),
        ("Crear Cita", lambda: service.create_appointment({
            'calendarId': 'cal_mock_001',
            'contactId': 'contact_mock_001',
            'startTime': '2025-01-15T14:00:00Z',
            'endTime': '2025-01-15T14:30:00Z',
            'title': 'Prueba Rate Limit'
        }))
    ]
    
    for i, (endpoint_name, endpoint_func) in enumerate(endpoints_to_test, 1):
        print(f"🔄 Test {i}/{len(endpoints_to_test)}: {endpoint_name}")
        
        try:
            result = endpoint_func()
            
            if result.get('rate_limit'):
                rate_info = result['rate_limit']
                print(f"   📊 Rate Limit:")
                print(f"      • Restantes: {rate_info.get('remaining', 'N/A')}")
                print(f"      • Límite total: {rate_info.get('limit', 'N/A')}")
                print(f"      • Usadas: {rate_info.get('used', 'N/A')}")
                print(f"      • Reset: {rate_info.get('reset', 'N/A')}")
            else:
                print("   ⚠️  No se encontró info de rate limit")
            
            print(f"   Status: {'✅ Exitoso' if result.get('success') else '❌ Error'}")
            
        except Exception as e:
            print(f"   ❌ Error: {str(e)}")
        
        print()
        time.sleep(0.5)


def test_with_direct_requests():
    """Prueba directa usando requests a los endpoints Django"""
    print("=" * 60)
    print("🌐 PROBANDO VÍA ENDPOINTS DJANGO")
    print("=" * 60)
    
    base_url = "http://localhost:8000/api/ghl"
    
    endpoints = [
        "/debug/",
        "/rate-limit/",
        "/ping/",
        "/calendars/"
    ]
    
    print("📡 Probando endpoints desde HTTP...\n")
    
    for endpoint in endpoints:
        print(f"🔄 GET {base_url}{endpoint}")
        
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Status: {response.status_code}")
                
                if 'rate_limit' in data:
                    print(f"   📊 Rate Limit: {data['rate_limit']}")
                elif 'rate_limit_info' in data:
                    print(f"   📊 Rate Limit Info: {data['rate_limit_info']}")
                else:
                    print("   ℹ️  Sin info de rate limit en respuesta")
            else:
                print(f"   ❌ Status: {response.status_code}")
                print(f"   Error: {response.text[:100]}...")
                
        except requests.exceptions.ConnectionError:
            print("   ❌ Error: No se puede conectar al servidor Django")
            print("   💡 Asegúrate de que Django esté corriendo en puerto 8000")
        except Exception as e:
            print(f"   ❌ Error: {str(e)}")
        
        print()


def main():
    print("🚦 DEMOSTRACIÓN DE RATE LIMIT MONITORING")
    print("=========================================")
    print("Este script prueba la funcionalidad de rate limits agregada al backend.\n")
    
    print("📋 Funcionalidades implementadas:")
    print("   • Captura automática de headers X-RateLimit-*")
    print("   • Logging detallado en consola de Django")
    print("   • Inclusión de rate limit info en respuestas JSON")
    print("   • Alertas cuando quedan pocas requests")
    print("   • Simulación realista en modo mock\n")
    
    # Probar con el servicio GHL directamente
    if "--mock" in sys.argv or "--all" in sys.argv:
        test_rate_limits_mock()
    
    if "--real" in sys.argv or "--all" in sys.argv:
        test_rate_limits_real_api()
    
    if "--http" in sys.argv or "--all" in sys.argv:
        test_with_direct_requests()
    
    if len(sys.argv) == 1:
        # Sin argumentos, ejecutar test mock por defecto
        test_rate_limits_mock()
        print("\n💡 Usa estos parámetros para más tests:")
        print("   python test_rate_limits.py --mock   # Solo modo mock")  
        print("   python test_rate_limits.py --real   # Solo API real")
        print("   python test_rate_limits.py --http   # Via endpoints HTTP")
        print("   python test_rate_limits.py --all    # Todos los tests")
    
    print("\n🎯 INSTRUCCIONES PARA VER RATE LIMITS:")
    print("1. Ejecuta el servidor Django: python manage.py runserver")
    print("2. Observa la consola de Django mientras haces requests")
    print("3. Busca mensajes que empiecen con '🚦 RATE LIMIT INFO'")
    print("4. Usa el endpoint /api/ghl/rate-limit/ para ver info en JSON")


if __name__ == "__main__":
    main()
