#!/usr/bin/env python
"""
Script para probar diferentes endpoints de GHL y encontrar cuáles funcionan
"""
import requests
import json


def test_ghl_endpoint(endpoint, description):
    """Probar un endpoint específico de GHL"""
    print(f"\n🔍 Probando: {description}")
    print(f"📡 Endpoint: {endpoint}")
    
    headers = {
        'Authorization': 'Bearer pit-3ff13585-dab4-4acf-b61a-aacfcd8c29fb',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Version': '2021-07-28',
    }
    
    try:
        response = requests.get(
            f"https://services.leadconnectorhq.com{endpoint}",
            headers=headers,
            timeout=30
        )
        
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ ¡ÉXITO! Respuesta:")
            print(json.dumps(data, indent=2)[:300] + "..." if len(str(data)) > 300 else json.dumps(data, indent=2))
            return True
        elif response.status_code == 401:
            error = response.json()
            print(f"❌ Error de autenticación: {error.get('message', 'Unknown')}")
            return False
        elif response.status_code == 403:
            print("❌ Error de permisos: No tienes acceso a este endpoint")
            return False
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print(f"💥 Error en petición: {e}")
        return False


def main():
    print("=" * 60)
    print("🧪 PROBANDO DIFERENTES ENDPOINTS DE GHL")
    print("=" * 60)
    
    # Lista de endpoints a probar (ordenados de más básico a más específico)
    endpoints_to_test = [
        ("/oauth/user/info", "Información del usuario"),
        ("/locations/search", "Buscar ubicaciones"),
        ("/locations", "Listar ubicaciones"),
        ("/users", "Listar usuarios"),
        ("/oauth/locationData", "Datos de ubicación OAuth"),
    ]
    
    successful_endpoints = []
    
    for endpoint, description in endpoints_to_test:
        if test_ghl_endpoint(endpoint, description):
            successful_endpoints.append((endpoint, description))
    
    print("\n" + "=" * 60)
    print("📊 RESUMEN DE RESULTADOS")
    print("=" * 60)
    
    if successful_endpoints:
        print("✅ Endpoints que funcionan:")
        for endpoint, description in successful_endpoints:
            print(f"   • {endpoint} - {description}")
        
        print(f"\n🎉 ¡{len(successful_endpoints)} endpoints funcionan correctamente!")
        print("💡 Podemos usar cualquiera de estos para implementar el Ejercicio 3")
    else:
        print("❌ Ningún endpoint funcionó.")
        print("💡 Posibles soluciones:")
        print("   • Verificar que el token tenga los scopes correctos")
        print("   • Revisar la configuración en GHL Dashboard")
        print("   • Contactar soporte de GoHighLevel")


if __name__ == "__main__":
    main()
