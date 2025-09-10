#!/usr/bin/env python
"""
Script para probar los endpoints de la API GHL sin necesidad de React
Ejecutar con: python test_endpoints.py
"""
import requests
import json
from datetime import datetime, timedelta


def test_endpoint(url, method='GET', data=None):
    """Función auxiliar para probar endpoints"""
    try:
        print(f"\n🚀 Probando {method} {url}")
        
        if method == 'GET':
            response = requests.get(url)
        elif method == 'POST':
            response = requests.post(url, json=data, headers={'Content-Type': 'application/json'})
        
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code in [200, 201]:
            result = response.json()
            print(f"✅ Respuesta exitosa:")
            print(json.dumps(result, indent=2, ensure_ascii=False))
            return result
        else:
            print(f"❌ Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"💥 Error en petición: {str(e)}")
        return None


def main():
    """Función principal para probar todos los endpoints"""
    base_url = "http://localhost:8000/api/ghl"
    
    print("=" * 60)
    print("🧪 PROBANDO ENDPOINTS DE LA API GHL")
    print("=" * 60)
    
    # Ejercicio 3: Probar conexión
    print("\n📌 EJERCICIO 3: Probar conexión con GHL")
    ping_result = test_endpoint(f"{base_url}/ping/")
    
    if not ping_result or not ping_result.get('success'):
        print("❌ La conexión falló. Verifica tu token GHL_PRIVATE_TOKEN en .env")
        return
    
    # Obtener ubicaciones
    print("\n📌 OBTENER UBICACIONES (LOCATIONS)")
    locations_result = test_endpoint(f"{base_url}/locations/")
    
    if not locations_result or not locations_result.get('success'):
        print("❌ No se pudieron obtener ubicaciones")
        return
    
    # Ejercicio 4: Obtener calendarios
    print("\n📌 EJERCICIO 4: Discovery de calendarios")
    calendars_result = test_endpoint(f"{base_url}/calendars/")
    
    if not calendars_result or not calendars_result.get('success'):
        print("❌ No se pudieron obtener calendarios")
        return
    
    # Ejercicio 5: Crear cita (ejemplo)
    print("\n📌 EJERCICIO 5: Crear cita (ejemplo)")
    
    # Para crear una cita necesitamos calendarId y contactId
    calendars = calendars_result.get('calendars', [])
    if calendars:
        calendar_id = calendars[0].get('id')
        print(f"📅 Usando calendario: {calendar_id}")
        
        # Datos de ejemplo para crear cita
        now = datetime.now()
        start_time = now + timedelta(days=1, hours=10)  # Mañana a las 10 AM
        end_time = start_time + timedelta(hours=1)  # 1 hora de duración
        
        appointment_data = {
            "calendarId": calendar_id,
            "contactId": "contact_example_123",  # Esto debería ser un contactId real
            "startTime": start_time.isoformat() + "Z",
            "endTime": end_time.isoformat() + "Z",
            "title": "Cita de prueba desde Django",
            "appointmentStatus": "confirmed"
        }
        
        print("📝 Datos de la cita:")
        print(json.dumps(appointment_data, indent=2, ensure_ascii=False))
        
        # NOTA: Comentamos esto porque necesitamos un contactId real
        # appointment_result = test_endpoint(f"{base_url}/appointments/create/", 'POST', appointment_data)
        print("⚠️  NOTA: Para crear citas reales necesitas un contactId válido de GHL")
        
    print("\n🎉 ¡PRUEBAS COMPLETADAS!")
    print("🔥 Si llegaste hasta aquí, el backend está funcionando correctamente.")


if __name__ == "__main__":
    print("⚡ IMPORTANTE: Asegúrate de que el servidor Django esté corriendo en otro terminal:")
    print("   python manage.py runserver")
    print("\nPresiona Enter para continuar o Ctrl+C para salir...")
    
    try:
        input()
        main()
    except KeyboardInterrupt:
        print("\n👋 Pruebas canceladas por el usuario")
