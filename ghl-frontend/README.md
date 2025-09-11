# 🎨 Frontend React - Integración Django-React-GoHighLevel

Frontend completo en React que consume la API Django para gestionar calendarios y citas de GoHighLevel.

## 🚀 Características Implementadas

### ✅ **Ejercicios Base**
- **Ejercicio 3**: Componente TestConnection para probar conexión con GHL
- **Ejercicio 4**: CalendarsList con tabla de calendarios disponibles
- **Ejercicio 5**: CreateAppointment - formulario completo de citas

### ✨ **PLUS: Rate Limit Monitoring**
- Dashboard en tiempo real con barras de progreso
- Sistema de alertas por colores (Verde/Amarillo/Rojo)
- Monitoreo de límites por ventana y diarios
- Actualización automática con cada petición a la API

## 🛠️ **Instalación y Setup**

### **1. Instalar dependencias**
```bash
npm install
```

### **2. Iniciar servidor de desarrollo**
```bash
npm start
```
La aplicación estará disponible en: `http://localhost:3000`

### **3. Conectar con Backend**
Asegúrate de que el backend Django esté corriendo:
```bash
# En el directorio principal del proyecto
python manage.py runserver 8000
```

## 🏗️ **Arquitectura**

```
src/
├── components/           # Componentes React
│   ├── TestConnection.js        # Ejercicio 3
│   ├── CalendarsList.js         # Ejercicio 4  
│   ├── CreateAppointment.js     # Ejercicio 5
│   └── RateLimitDashboard.js    # PLUS Feature
├── hooks/               # Hooks personalizados
│   └── useRateLimit.js         # Context y hooks para rate limits
├── config/              # Configuración
│   └── api.js                  # Config API y endpoints
└── App.js              # Componente principal
```

## 🎯 **Funcionalidades Principales**

### **🎯 Ejercicio 3: Test Connection**
- Botón "Probar Conexión con GHL"
- Loading states y feedback visual
- Muestra respuesta JSON expandible
- Rate limit info automática

### **📅 Ejercicio 4: Discovery Calendarios**
- Tabla responsive con ID, nombre, estado
- Selección de calendario para citas
- Auto-refresh con botón actualizar
- Loading states y error handling

### **📝 Ejercicio 5: Crear Citas**
- Formulario completo con validación
- Auto-cálculo de hora de fin
- Selección de contactos de GHL
- Confirmación de creación exitosa

### **🚦 PLUS: Rate Limit Dashboard**
- Barras de progreso en tiempo real
- Sistema de alertas por colores
- Monitoreo de cuotas diarias
- Actualización automática

## 🧪 **Cómo Probarlo**

### **1. Setup completo**
```bash
# Terminal 1: Backend
cd "C:\Proyecto VM\Integracion-Django---React---GHL"
.\venv\Scripts\Activate.ps1
python manage.py runserver 8000

# Terminal 2: Frontend
cd ghl-frontend
npm start
```

### **2. Secuencia de pruebas**
1. **Dashboard Rate Limits**: Se actualiza automáticamente
2. **Test Connection**: Hacer clic en "Probar Conexión"
3. **Calendarios**: Ver lista automática, seleccionar uno
4. **Crear Cita**: Llenar formulario y crear

### **3. Validación**
- ✅ Rate limits se actualizan con cada petición
- ✅ Conexión muestra datos reales de GHL
- ✅ Calendarios se listan correctamente
- ✅ Formulario crea citas reales en GoHighLevel

## 🎨 **UI/UX Features**

- **Material-UI**: Design system profesional
- **Loading States**: En todas las interacciones
- **Error Handling**: Mensajes claros y útiles
- **Responsive Design**: Funciona en móvil y desktop
- **Feedback Visual**: Confirmaciones y alertas
- **Explicaciones Educativas**: En cada componente

## 📊 **Criterios de Aceptación**

### **✅ Ejercicio 3 - COMPLETADO**
- [x] Botón funcional "Probar Conexión con GHL"
- [x] Loading state durante petición
- [x] Respuesta JSON visible
- [x] Manejo de errores

### **✅ Ejercicio 4 - COMPLETADO**
- [x] Tabla con ID, nombre, estado
- [x] Carga automática de calendarios
- [x] Selección para crear citas
- [x] Error handling

### **✅ Ejercicio 5 - COMPLETADO**
- [x] Formulario completo funcional
- [x] Validación client-side
- [x] Integración con calendarios
- [x] Confirmación "Cita creada con éxito"

### **✨ PLUS - COMPLETADO**
- [x] Dashboard rate limits tiempo real
- [x] Sistema alertas por colores
- [x] Actualización automática
- [x] Monitoreo cuotas diarias

## 🔧 **Tecnologías Utilizadas**

- **React 18**: Framework frontend
- **Material-UI**: Componentes UI
- **@emotion**: Styling system
- **Fetch API**: Llamadas HTTP
- **React Hooks**: Estado y efectos
- **Context API**: Estado global rate limits

## 📞 **Soporte**

Para dudas sobre el frontend, revisar:
- **Componentes**: `/src/components/`
- **API Config**: `/src/config/api.js`
- **Rate Limits**: `/src/hooks/useRateLimit.js`

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
