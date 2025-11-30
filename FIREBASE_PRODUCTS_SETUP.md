# Configuración de Firebase para Productos

## 📋 Resumen
Se ha implementado una **base de datos separada** en Firebase exclusivamente para almacenar y gestionar los productos de proveedores. Esto mantiene los datos de usuarios/login completamente aislados de los datos de productos.

## 🆕 Crear Nuevo Proyecto de Firebase

### Paso 1: Crear el proyecto en Firebase Console

1. Ve a https://console.firebase.google.com/
2. Haz clic en **"Agregar proyecto"**
3. Nombre del proyecto: **`nuptiae-providers`** (o el nombre que prefieras)
4. Desactiva Google Analytics (opcional para este proyecto)
5. Haz clic en **"Crear proyecto"**

### Paso 2: Configurar Realtime Database

1. En el menú lateral, selecciona **"Realtime Database"**
2. Haz clic en **"Crear base de datos"**
3. Selecciona la ubicación: **United States (us-central1)** (recomendado)
4. Modo de seguridad: **"Modo de prueba"** (lo configuraremos después)
5. Haz clic en **"Habilitar"**

### Paso 3: Obtener la configuración del proyecto

1. Ve a **Configuración del proyecto** (ícono de engranaje)
2. En la sección **"Tus apps"**, haz clic en el ícono **</>** (Web)
3. Nombre de la app: **"Nuptiae Providers"**
4. **NO** marques "Firebase Hosting"
5. Haz clic en **"Registrar app"**
6. Copia los valores de configuración que aparecen

### Paso 4: Actualizar firebaseConfig.js

Abre `src/config/firebaseConfig.js` y reemplaza los valores en `firebaseProvidersConfig`:

```javascript
const firebaseProvidersConfig = {
  apiKey: "TU_API_KEY_AQUI",                    // Copia de Firebase
  authDomain: "nuptiae-providers.firebaseapp.com",
  databaseURL: "https://nuptiae-providers-default-rtdb.firebaseio.com",
  projectId: "nuptiae-providers",
  storageBucket: "nuptiae-providers.firebasestorage.app",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",  // Copia de Firebase
  appId: "TU_APP_ID"                            // Copia de Firebase
};
```

## 🔧 Configuración de Reglas de Seguridad

### En el proyecto nuptiae-providers

1. Ve a **Realtime Database** → **Reglas**
2. Reemplaza con las siguientes reglas:

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

**Nota**: Estas reglas permiten lectura pública y escritura completa. Para producción, considera autenticar usuarios admin.

3. Haz clic en **"Publicar"**

## 📊 Inicializar Productos en la Base de Datos

Para cargar los productos iniciales en Firebase, necesitas ejecutar la función de inicialización una sola vez.

**Opción 1: Usar la pantalla de inicialización (Recomendado)**

1. Agrega temporalmente la ruta en `AppNavigator.js`:
```javascript
<Stack.Screen name="InitializeProducts" component={InitializeProductsScreen} />
```

2. Navega a esta pantalla desde cualquier parte de la app (puedes agregar un botón temporal en HomeScreen)

3. Presiona el botón "Inicializar Productos"

4. Una vez completado, puedes eliminar la ruta y el botón temporal

**Opción 2: Usar la consola de desarrollador**

En cualquier pantalla de la app, puedes importar y ejecutar:
```javascript
import { initializeSampleProducts } from '../services/productsService';

// Ejecutar en useEffect o al presionar un botón
initializeSampleProducts()
  .then(() => console.log('Productos inicializados'))
  .catch(error => console.error(error));
```

## 📊 Estructura de Datos en Firebase

Los productos se organizan en la siguiente estructura:

```
products/
├── vestidos/
│   ├── -N1x2y3z4/
│   │   ├── name: "Vestido Elegante"
│   │   ├── price: "$3,000"
│   │   ├── image: "url"
│   │   ├── description: "Descripción"
│   │   ├── provider: "Nombre del proveedor"
│   │   ├── rating: 5
│   │   ├── location: "Aguascalientes"
│   │   ├── createdAt: "2025-11-28T..."
│   │   └── updatedAt: "2025-11-28T..."
├── floristerias/
├── trajes/
├── accesorios/
├── fotografia/
└── video/
```

## 🔨 Funciones Disponibles

### Servicios (src/services/productsService.js)

```javascript
// Obtener todos los productos de una categoría
const products = await getProductsByCategory('vestidos');

// Escuchar cambios en tiempo real
const unsubscribe = listenToProducts('vestidos', (products) => {
  console.log('Productos actualizados:', products);
});

// Agregar un nuevo producto
await addProduct('vestidos', {
  name: "Vestido Nuevo",
  price: "$5,000",
  image: "https://...",
  description: "Descripción del vestido",
  provider: "Boutique XYZ",
  rating: 5,
  location: "Aguascalientes"
});

// Actualizar un producto
await updateProduct('vestidos', productId, {
  price: "$3,500"
});

// Eliminar un producto
await deleteProduct('vestidos', productId);

// Obtener un producto específico
const product = await getProductById('vestidos', productId);
```

## 🎨 Categorías Disponibles

- `vestidos` - Vestidos de novia
- `floristerias` - Arreglos florales
- `trajes` - Trajes de novio
- `accesorios` - Accesorios de boda
- `fotografia` - Servicios de fotografía
- `video` - Servicios de videografía

## 📱 Pantallas Actualizadas

Todas las pantallas de proveedores ahora obtienen los datos de Firebase en tiempo real:

- ✅ VestidosScreen
- ✅ FloristeriasScreen
- ✅ TrajesScreen
- ✅ AccesoriosScreen
- ✅ FotografiaScreen
- ✅ VideoScreen

### Características implementadas:

- **Carga en tiempo real**: Los productos se actualizan automáticamente cuando cambian en Firebase
- **Loading state**: Muestra un indicador de carga mientras se obtienen los datos
- **Empty state**: Muestra un mensaje cuando no hay productos disponibles
- **Error handling**: Manejo de errores en las consultas

## 🚀 Próximos Pasos

### Agregar nuevos productos:

1. **Manualmente en Firebase Console**:
   - Ve a Realtime Database
   - Navega a `products/[categoria]`
   - Click en "+" para agregar un nuevo nodo
   - Completa los campos: name, price, image, description, provider, rating, location

2. **Mediante código**:
```javascript
import { addProduct } from '../services/productsService';

await addProduct('vestidos', {
  name: "Vestido Premium",
  price: "$6,000",
  image: "https://images.pexels.com/...",
  description: "Vestido exclusivo con detalles únicos",
  provider: "Alta Costura",
  rating: 5,
  location: "Aguascalientes"
});
```

### Crear pantalla de administración:

Puedes crear una pantalla donde los usuarios autenticados puedan:
- Ver todos los productos
- Agregar nuevos productos
- Editar productos existentes
- Eliminar productos

## 🔐 Seguridad

- **Base de datos de usuarios (nuptiae-login)**: Contiene cuentas, usuarios, autenticación
- **Base de datos de proveedores (nuptiae-providers)**: Contiene solo productos y proveedores
- Los productos son **públicos** (cualquiera puede leerlos)
- **Escritura abierta** en modo de desarrollo (cambiar para producción)
- Las bases de datos están completamente aisladas entre sí

## 🏗️ Arquitectura

```
Firebase Projects:
│
├── nuptiae-login
│   ├── Authentication (email/password)
│   └── Realtime Database
│       ├── users/
│       └── accounts/
│
└── nuptiae-providers
    └── Realtime Database
        └── products/
            ├── vestidos/
            ├── floristerias/
            ├── trajes/
            ├── accesorios/
            ├── fotografia/
            └── video/
```

## 💡 Ventajas de usar 2 proyectos Firebase

1. **Separación de datos**: Usuarios y productos completamente aislados
2. **Seguridad mejorada**: Diferentes reglas para cada tipo de dato
3. **Escalabilidad**: Cada base de datos crece independientemente
4. **Gestión más fácil**: Administra proveedores sin afectar usuarios
5. **Costos optimizados**: Puedes aplicar diferentes límites a cada proyecto
6. **Datos en tiempo real**: Los cambios se reflejan instantáneamente
7. **Sin servidor**: No necesitas mantener un backend
8. **Offline support**: Los datos se cachean localmente

## 📝 Notas

- Las URLs de imágenes actualmente usan Pexels (gratis)
- Puedes subir imágenes a Firebase Storage y usar esas URLs
- Los IDs de productos se generan automáticamente con Firebase
- Todos los timestamps se guardan en formato ISO
