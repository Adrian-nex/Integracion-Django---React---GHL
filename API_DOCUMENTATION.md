# 📚 API Documentation - Integración Django-React-GHL

## 🚀 Base URL
```
http://localhost:8000/api/ghl/
```

## 🔧 Headers Requeridos
```json
{
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

---

## 📋 Endpoints Disponibles

### 1. **Debug/Configuración**
```http
GET /api/ghl/debug/
```
**Respuesta:**
```json
{
  "ghl_base_url": "https://services.leadconnectorhq.com",
  "ghl_token_configured": true,
  "ghl_token_prefix": "pit-3ff135...",
  "default_location_configured": true,
  "default_location_id": "r3UrTfNuQviYjKT9vfVz",
  "mock_mode": false,
  "rate_limit_monitoring": "Activado - Revisa la consola de Django para ver rate limits"
}
```

### 1.1. **✨ Rate Limit Monitoring**
```http
GET /api/ghl/rate-limit/
```
**Respuesta:**
```json
{
  "success": true,
  "message": "Petición realizada para obtener rate limit info",
  "rate_limit_info": {
    "limit": 1000,
    "remaining": 856,
    "used": 144,
    "reset": 1704985200
  },
  "note": "Revisa la consola de Django para ver los logs detallados de rate limits"
}
```

### 2. **🎯 Ejercicio 3: Probar Conexión**
```http
GET /api/ghl/ping/
GET /api/ghl/ping/?locationId=LOCATION_ID_ESPECIFICO
```
**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Conexión exitosa! Se encontraron 2 ubicaciones.",
  "data": {
    "total_locations": 2,
    "locations": [...]
  },
  "rate_limit": {
    "limit": 1000,
    "remaining": 856,
    "used": 144,
    "reset": 1704985200
  }
}
```

### 3. **🎯 Ejercicio 4: Listar Calendarios**
```http
GET /api/ghl/calendars/
GET /api/ghl/calendars/?locationId=LOCATION_ID_ESPECIFICO
```
**Respuesta exitosa:**
```json
{
  "success": true,
  "calendars": [
    {
      "id": "cal_123456",
      "name": "Calendario General",
      "status": "active"
    },
    {
      "id": "cal_789012", 
      "name": "Odontología",
      "status": "active"
    }
  ],
  "total_calendars": 2,
  "location_id": "r3UrTfNuQviYjKT9vfVz",
  "rate_limit": {
    "limit": 1000,
    "remaining": 854,
    "used": 146,
    "reset": 1704985200
  }
}
```

### 4. **Listar Ubicaciones**
```http
GET /api/ghl/locations/
```
**Respuesta exitosa:**
```json
{
  "success": true,
  "locations": [
    {
      "id": "r3UrTfNuQviYjKT9vfVz",
      "name": "Clínica Principal",
      "status": "active"
    }
  ]
}
```

### 5. **Gestión de Contactos**

#### Listar Contactos
```http
GET /api/ghl/contacts/
GET /api/ghl/contacts/?locationId=LOCATION_ID_ESPECIFICO
```

#### Crear Contacto
```http
POST /api/ghl/contacts/create/
Content-Type: application/json
```
**Body:**
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@ejemplo.com",
  "phone": "+1234567890",
  "locationId": "r3UrTfNuQviYjKT9vfVz"  // Opcional si hay default en .env
}
```

### 6. **🎯 Ejercicio 5: Gestión de Citas**

#### Listar Citas
```http
GET /api/ghl/appointments/
GET /api/ghl/appointments/?locationId=LOCATION_ID&calendarId=CALENDAR_ID
```

#### Crear Cita
```http
POST /api/ghl/appointments/create/
Content-Type: application/json
```
**Body:**
```json
{
  "calendarId": "cal_123456",
  "contactId": "contact_789012",
  "startTime": "2025-01-15T14:00:00Z",
  "endTime": "2025-01-15T14:30:00Z",
  "title": "Consulta médica",
  "appointmentStatus": "confirmed"
}
```

---

## 🎨 Componentes Frontend Sugeridos

### Ejercicio 3: Componente de Conexión
```jsx
// TestConnection.jsx
function TestConnection() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/ghl/ping/');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, message: error.message });
    }
    setLoading(false);
  };

  return (
    <div>
      <button onClick={testConnection} disabled={loading}>
        {loading ? 'Probando...' : 'Probar Conexión con GHL'}
      </button>
      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
```

### Ejercicio 4: Tabla de Calendarios
```jsx
// CalendarsList.jsx
function CalendarsList() {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchCalendars = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/ghl/calendars/');
      const data = await response.json();
      if (data.success) {
        setCalendars(data.calendars);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCalendars();
  }, []);

  return (
    <div>
      <h2>Calendarios Disponibles</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {calendars.map((calendar) => (
              <tr key={calendar.id}>
                <td>{calendar.id}</td>
                <td>{calendar.name}</td>
                <td>{calendar.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

### Ejercicio 5: Formulario de Citas
```jsx
// CreateAppointment.jsx
function CreateAppointment() {
  const [formData, setFormData] = useState({
    calendarId: '',
    contactId: '',
    startTime: '',
    endTime: '',
    title: '',
    appointmentStatus: 'confirmed'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/ghl/appointments/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          startTime: new Date(formData.startTime).toISOString(),
          endTime: new Date(formData.endTime).toISOString(),
        })
      });
      
      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        alert('¡Cita creada con éxito!');
        // Reset form
        setFormData({
          calendarId: '',
          contactId: '',
          startTime: '',
          endTime: '',
          title: '',
          appointmentStatus: 'confirmed'
        });
      }
    } catch (error) {
      setResult({ success: false, message: error.message });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear Nueva Cita</h2>
      
      <input
        type="text"
        placeholder="Calendar ID"
        value={formData.calendarId}
        onChange={(e) => setFormData({...formData, calendarId: e.target.value})}
        required
      />
      
      <input
        type="text"
        placeholder="Contact ID"
        value={formData.contactId}
        onChange={(e) => setFormData({...formData, contactId: e.target.value})}
        required
      />
      
      <input
        type="datetime-local"
        placeholder="Fecha y hora inicio"
        value={formData.startTime}
        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
        required
      />
      
      <input
        type="datetime-local"
        placeholder="Fecha y hora fin"
        value={formData.endTime}
        onChange={(e) => setFormData({...formData, endTime: e.target.value})}
        required
      />
      
      <input
        type="text"
        placeholder="Título de la cita"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Cita'}
      </button>
      
      {result && (
        <div>
          {result.success ? (
            <p style={{color: 'green'}}>✅ {result.message}</p>
          ) : (
            <p style={{color: 'red'}}>❌ {result.message || 'Error al crear cita'}</p>
          )}
        </div>
      )}
    </form>
  );
}
```

---

## 🚦 **Rate Limit Monitoring**

### **Funcionalidades de Rate Limiting**

✨ **Captura Automática**: Todos los endpoints capturan headers `X-RateLimit-*`
📊 **Logging en Consola**: Información detallada en la consola de Django
📡 **Incluido en Respuestas**: Rate limit info agregada al JSON de respuesta
⚠️ **Alertas**: Advertencias cuando quedan pocas requests
🎭 **Mock Realista**: Simulación de rate limits en modo mock

### **Headers Soportados**
- `X-RateLimit-Limit` / `X-Rate-Limit-Limit` / `RateLimit-Limit`
- `X-RateLimit-Remaining` / `X-Rate-Limit-Remaining` / `RateLimit-Remaining`
- `X-RateLimit-Reset` / `X-Rate-Limit-Reset` / `RateLimit-Reset`
- `X-RateLimit-Used`

### **Ejemplo de Log en Consola**
```
🚦 RATE LIMIT INFO | Requests restantes: 856 | Límite total: 1000 | Usadas: 144 | Se resetea: 14:30:00
⚡ ATENCIÓN: Rate limit aproximándose
```

### **Alertas por Nivel**
- **✅ Normal**: > 50 requests restantes
- **⚡ Atención**: ≤ 50 requests restantes  
- **⚠️ Advertencia**: ≤ 10 requests restantes
- **🚨 Crítico**: ≤ 5 requests restantes

### **Testing de Rate Limits**
```bash
# Script de prueba incluido
python test_rate_limits.py --mock   # Modo mock
python test_rate_limits.py --real   # API real  
python test_rate_limits.py --http   # Vía HTTP
python test_rate_limits.py --all    # Todos los tests
```

---

## 🚨 Manejo de Errores

### Respuestas de Error Comunes
```json
{
  "success": false,
  "message": "Error al conectar con GHL API",
  "error": {
    "statusCode": 401,
    "message": "Unauthorized"
  }
}
```

```json
{
  "success": false,
  "message": "Faltan campos requeridos",
  "missing_fields": ["calendarId", "contactId"]
}
```

---

## ⚙️ Configuración CORS

El backend ya tiene CORS configurado para:
- `http://localhost:3000` (React dev server)
- `http://127.0.0.1:3000`

---

## 🧪 Testing con cURL/Postman

### Ejemplo completo con cURL:
```bash
# Probar conexión
curl -X GET "http://localhost:8000/api/ghl/ping/"

# Listar calendarios
curl -X GET "http://localhost:8000/api/ghl/calendars/"

# Crear contacto
curl -X POST "http://localhost:8000/api/ghl/contacts/create/" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@test.com",
    "phone": "+1234567890"
  }'

# Crear cita
curl -X POST "http://localhost:8000/api/ghl/appointments/create/" \
  -H "Content-Type: application/json" \
  -d '{
    "calendarId": "cal_123456",
    "contactId": "contact_789012",
    "startTime": "2025-01-15T14:00:00Z",
    "endTime": "2025-01-15T14:30:00Z",
    "title": "Consulta médica",
    "appointmentStatus": "confirmed"
  }'
```

---

## 🎯 Criterios de Aceptación Cumplidos

✅ **Ejercicio 3**: Endpoint `/ping/` devuelve JSON real de GHL  
✅ **Ejercicio 4**: Endpoint `/calendars/` devuelve tabla con id, name, status  
✅ **Ejercicio 5**: Endpoint `/appointments/create/` crea citas reales en GHL  

---

## 📞 Soporte
Para cualquier duda sobre la API, contactar al equipo de backend.
