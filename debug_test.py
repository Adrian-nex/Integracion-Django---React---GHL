#!/usr/bin/env python
"""
Script de debug simple para probar la configuración paso a paso
"""
import requests
import json


def test_debug_endpoint():
    """Primero probamos nuestro endpoint de debug"""
    try:
        print("🔍 Probando configuración...")
        response = requests.get("http://localhost:8000/api/ghl/debug/")
        if response.status_code == 200:
            config = response.json()
            print("✅ Configuración:")
            print(json.dumps(config, indent=2))
            return config
        else:
            print(f"❌ Error al obtener configuración: {response.status_code}")
            return None
    except Exception as e:
        print(f"💥 Error: {e}")
        return None


def test_direct_ghl():
    """Probar directamente contra GHL API"""
    print("\n🔗 Probando directamente contra GHL API...")
    
    headers = {
        'Authorization': 'Bearer pit-3ff13585-dab4-4acf-b61a-aacfcd8c29fb',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Version': '2021-07-28',
    }
    
    try:
        response = requests.get(
            "https://services.leadconnectorhq.com/locations/search",
            headers=headers,
            timeout=30
        )
        
        print(f"📊 Status Code: {response.status_code}")
        print(f"📋 Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Respuesta exitosa de GHL:")
            print(json.dumps(data, indent=2)[:500] + "..." if len(str(data)) > 500 else json.dumps(data, indent=2))
        else:
            print(f"❌ Error de GHL: {response.text}")
            
    except Exception as e:
        print(f"💥 Error en petición directa: {e}")


def test_django_ping():
    """Probar nuestro endpoint ping"""
    print("\n🏓 Probando endpoint ping de Django...")
    
    try:
        response = requests.get("http://localhost:8000/api/ghl/ping/")
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code in [200, 400]:  # 400 también puede tener información útil
            result = response.json()
            print("📋 Respuesta:")
            print(json.dumps(result, indent=2))
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"💥 Error: {e}")


if __name__ == "__main__":
    print("=" * 50)
    print("🛠️  DEBUG SCRIPT - DIAGNÓSTICO GHL")
    print("=" * 50)
    
    # Paso 1: Verificar configuración Django
    config = test_debug_endpoint()
    if not config:
        print("❌ No se pudo verificar la configuración. ¿Está corriendo el servidor Django?")
        exit(1)
    
    # Paso 2: Probar directamente contra GHL
    test_direct_ghl()
    
    # Paso 3: Probar nuestro endpoint
    test_django_ping()
    
    print("\n🔍 Análisis completo")
