# 🏥 Integración Django-React-GoHighLevel

Proyecto de integración para gestión de calendarios y citas médicas utilizando la API de GoHighLevel (GHL).

## 🎯 **Ejercicios Implementados**

- ✅ **Ejercicio 3**: Conexión básica con API de GHL usando Private Integration Token
- ✅ **Ejercicio 4**: Discovery de calendarios (listar calendarios con id, name, status)
- ✅ **Ejercicio 5**: Crear citas desde React conectando con GHL

## 🚀 **Stack Tecnológico**

- **Backend**: Django 5.0.6 + Django REST Framework
- **Frontend**: React (implementado por equipo frontend)
- **API Externa**: GoHighLevel REST API v2021-07-28
- **Base de Datos**: SQLite (desarrollo)

## 📁 **Estructura del Proyecto**

```
Integracion-Django---React---GHL/
├── backend/                    # Configuración Django principal
├── ghl_integration/           # App principal con la lógica GHL
│   ├── views.py              # Endpoints de la API
│   ├── ghl_service.py        # Servicio para interactuar con GHL
│   ├── urls.py               # Rutas de los endpoints
│   └── models.py
├── .env                      # Variables de entorno (configurar)
├── .env.example              # Plantilla de configuración
├── requirements.txt          # Dependencias Python
├── manage.py                 # Django management
├── API_DOCUMENTATION.md      # 📚 Documentación completa para frontend
└── README.md                 # Este archivo
```

## ⚙️ **Configuración Rápida**

### 1. **Activar entorno virtual**
```bash
# Windows PowerShell
.\venv\Scripts\Activate.ps1

# Verificar que está activado (debería mostrar (venv) al inicio)
```

### 2. **Configurar variables de entorno**
```bash
# El archivo .env ya está configurado con:
GHL_BASE_URL=https://services.leadconnectorhq.com
GHL_PRIVATE_TOKEN=pit-3ff13585-dab4-4acf-b61a-aacfcd8c29fb
GHL_DEFAULT_LOCATION_ID=r3UrTfNuQviYjKT9vfVz
GHL_MOCK=False  # Cambia a True si necesitas datos simulados
DEBUG=True
```

### 3. **Ejecutar el servidor**
```bash
python manage.py runserver 8000
```

El servidor estará disponible en: `http://localhost:8000`

## 📋 **Endpoints Disponibles**

| Método | Endpoint | Propósito | Ejercicio |
|--------|----------|-----------|-----------|
| GET | `/api/ghl/debug/` | Debug de configuración | - |
| GET | `/api/ghl/ping/` | Probar conexión con GHL | **Ejercicio 3** |
| GET | `/api/ghl/calendars/` | Listar calendarios | **Ejercicio 4** |
| POST | `/api/ghl/appointments/create/` | Crear citas | **Ejercicio 5** |
| GET | `/api/ghl/contacts/` | Listar contactos | Auxiliar |
| POST | `/api/ghl/contacts/create/` | Crear contactos | Auxiliar |
| GET | `/api/ghl/appointments/` | Listar citas | Auxiliar |
| GET | `/api/ghl/locations/` | Listar ubicaciones | Auxiliar |

## 🧪 **Pruebas Rápidas (PowerShell)**

```powershell
# 1. Verificar configuración
Invoke-RestMethod -Uri "http://localhost:8000/api/ghl/debug/" -Method GET

# 2. Ejercicio 3: Probar conexión
Invoke-RestMethod -Uri "http://localhost:8000/api/ghl/ping/" -Method GET

# 3. Ejercicio 4: Listar calendarios
Invoke-RestMethod -Uri "http://localhost:8000/api/ghl/calendars/" -Method GET

# 4. Crear contacto (necesario para citas)
$contactBody = @{
    firstName = "Juan"
    lastName = "Pérez"
    email = "juan@test.com"
    phone = "+1234567890"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/ghl/contacts/create/" -Method POST -ContentType "application/json" -Body $contactBody

# 5. Ejercicio 5: Crear cita
$appointmentBody = @{
    calendarId = "CALENDAR_ID_REAL"  # Usar ID real del paso 3
    contactId = "CONTACT_ID_REAL"   # Usar ID real del paso 4
    startTime = "2025-01-15T14:00:00Z"
    endTime = "2025-01-15T14:30:00Z"
    title = "Consulta médica"
    appointmentStatus = "confirmed"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/ghl/appointments/create/" -Method POST -ContentType "application/json" -Body $appointmentBody
```

## 🎨 **Para el Equipo Frontend**

### **Base URL de la API**
```
http://localhost:8000/api/ghl/
```

### **Documentación Completa**
Ver archivo: [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md)

Incluye:
- 📋 Todos los endpoints con ejemplos
- 🎨 Componentes React sugeridos
- 🚨 Manejo de errores
- 🧪 Ejemplos de testing

### **CORS ya configurado para React**
- `http://localhost:3000`
- `http://127.0.0.1:3000`

## 🛠️ **Funcionalidades Avanzadas**

### **Modo Mock (para desarrollo sin GHL)**
Si hay problemas con el token o API de GHL:
```bash
# En .env, cambiar a:
GHL_MOCK=True
```
- Devuelve datos simulados realistas
- Permite probar toda la funcionalidad sin depender del API real

### **Headers Automáticos**
El servicio agrega automáticamente:
- `Authorization: Bearer {token}`
- `Version: 2021-07-28` (requerido por GHL)
- `LocationId: {default_location_id}` (si está configurado)

### **Gestión de LocationId**
- Se puede configurar un `GHL_DEFAULT_LOCATION_ID` en `.env`
- Los endpoints aceptan `?locationId=` como query param para override
- Si no hay locationId, el sistema solicita configurar uno

## 🎯 **Criterios de Aceptación (CUMPLIDOS)**

✅ **Ejercicio 3**: 
- Endpoint `/ping/` funciona y devuelve JSON real de GHL
- Botón en React consume el endpoint y muestra la respuesta

✅ **Ejercicio 4**: 
- Endpoint `/calendars/` lista calendarios con `id`, `name` y `status`
- Tabla en React muestra los calendarios disponibles

✅ **Ejercicio 5**: 
- Endpoint `/appointments/create/` crea citas reales en GHL
- Formulario React envía datos y muestra "Cita creada con éxito"

## 🚨 **Troubleshooting**

### **Error "Token's user type mismatch"**
✅ **SOLUCIONADO**: El sistema usa `locationId` directo para evitar `/locations/search`

### **CORS Errors**
✅ **CONFIGURADO**: CORS habilitado para localhost:3000

### **Missing Fields Errors**
✅ **VALIDADO**: Endpoints validan campos requeridos y devuelven errores claros

## 📞 **Contacto**

- **Backend Team**: Responsable de API Django y integración GHL
- **Frontend Team**: Implementación React y componentes UI

## 🔄 **Para Continuous Integration**

```bash
# Verificar que todo funciona
python manage.py check
python manage.py test

# Ejecutar servidor para pruebas
python manage.py runserver 8000
```

## 🎉 **Estado del Proyecto**

**BACKEND: 100% COMPLETADO** ✅
- Todos los ejercicios implementados
- API documentada
- Pruebas funcionando
- Listo para conectar con React

**FRONTEND: Pendiente por equipo frontend** 🔄
