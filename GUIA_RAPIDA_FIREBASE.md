# 🚀 Guía Rápida: Configurar Base de Datos de Proveedores

## ✅ Checklist de Configuración

### 1️⃣ Crear Proyecto en Firebase (5 minutos)

- [ ] Ir a https://console.firebase.google.com/
- [ ] Clic en "Agregar proyecto"
- [ ] Nombre: `nuptiae-providers`
- [ ] Desactivar Google Analytics
- [ ] Clic en "Crear proyecto"

### 2️⃣ Configurar Realtime Database (3 minutos)

- [ ] Ir a "Realtime Database" en el menú
- [ ] Clic en "Crear base de datos"
- [ ] Ubicación: United States (us-central1)
- [ ] Modo: "Modo de prueba"
- [ ] Clic en "Habilitar"

### 3️⃣ Obtener Credenciales (2 minutos)

- [ ] Ir a Configuración del proyecto (⚙️)
- [ ] En "Tus apps", clic en ícono Web (</>)
- [ ] Nombre: "Nuptiae Providers"
- [ ] Clic en "Registrar app"
- [ ] Copiar los valores de configuración

### 4️⃣ Actualizar Código (1 minuto)

Abrir: `src/config/firebaseConfig.js`

Buscar la sección `firebaseProvidersConfig` y reemplazar:

```javascript
const firebaseProvidersConfig = {
  apiKey: "PEGAR_TU_API_KEY",
  authDomain: "nuptiae-providers.firebaseapp.com",
  databaseURL: "https://nuptiae-providers-default-rtdb.firebaseio.com",
  projectId: "nuptiae-providers",
  storageBucket: "nuptiae-providers.firebasestorage.app",
  messagingSenderId: "PEGAR_TU_SENDER_ID",
  appId: "PEGAR_TU_APP_ID"
};
```

### 5️⃣ Configurar Reglas de Seguridad (1 minuto)

En Firebase Console del proyecto `nuptiae-providers`:
- [ ] Ir a "Realtime Database" → "Reglas"
- [ ] Copiar y pegar estas reglas:

```json
{
  "rules": {
    "products": {
      ".read": true,
      "$category": {
        "$productId": {
          ".write": true
        }
      }
    }
  }
}
```

- [ ] Clic en "Publicar"

### 6️⃣ Inicializar Productos (2 minutos)

En tu app, ejecutar una sola vez:

```javascript
import { initializeSampleProducts } from './src/services/productsService';

// Puedes llamar esto desde cualquier pantalla o un botón temporal
initializeSampleProducts()
  .then(() => console.log('✅ Productos creados'))
  .catch(error => console.error('❌ Error:', error));
```

### 7️⃣ Verificar (1 minuto)

- [ ] Reiniciar la app: `npx expo start -c`
- [ ] Navegar a cualquier pantalla de proveedores
- [ ] Verificar que los productos se carguen correctamente

---

## 📊 Estructura Final

Después de completar estos pasos, tendrás:

```
📦 Firebase Projects
│
├── 🔐 nuptiae-login
│   ├── Users (authentication)
│   └── Accounts (parejas compartidas)
│
└── 🏪 nuptiae-providers
    └── Products
        ├── vestidos (2 productos)
        ├── floristerias (1 producto)
        ├── trajes (1 producto)
        ├── accesorios (1 producto)
        ├── fotografia (1 producto)
        └── video (1 producto)
```

---

## 🎯 Valores que necesitas copiar

Cuando registres la app en Firebase, verás algo como esto:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAbC...xyz123",           // ← COPIAR ESTO
  authDomain: "nuptiae-providers.firebaseapp.com",
  projectId: "nuptiae-providers",
  storageBucket: "nuptiae-providers.firebasestorage.app",
  messagingSenderId: "123456789",        // ← COPIAR ESTO
  appId: "1:123456789:web:abc123def",    // ← COPIAR ESTO
  measurementId: "G-XXXXXXXXXX"          // (No necesario)
};
```

**IMPORTANTE**: También necesitas la `databaseURL`. La encuentras en:
- Realtime Database → Pestaña "Datos"
- URL aparece en la parte superior: `https://nuptiae-providers-default-rtdb.firebaseio.com`

---

## ❓ Troubleshooting

### No aparecen los productos
1. Verifica que las credenciales estén correctas en `firebaseConfig.js`
2. Asegúrate de haber ejecutado `initializeSampleProducts()`
3. Verifica las reglas en Firebase Console
4. Reinicia la app con `npx expo start -c`

### Error de permisos
- Verifica que las reglas estén publicadas en Firebase Console
- Asegúrate de estar usando `providersDatabase` no `database`

### Error de conexión
- Verifica que `databaseURL` sea correcta
- Debe incluir `-default-rtdb.firebaseio.com`

---

## 🎉 ¡Listo!

Una vez completado, podrás:
- ✅ Ver productos en todas las pantallas de proveedores
- ✅ Agregar nuevos productos desde Firebase Console
- ✅ Editar productos en tiempo real
- ✅ Eliminar productos cuando lo necesites

**Tiempo total estimado: 15 minutos**
