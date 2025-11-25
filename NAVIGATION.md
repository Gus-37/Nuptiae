# Estructura de Navegación - Nuptiae App

## Jerarquía de Navegación

```
NavigationContainer
└── AppNavigator (Stack Navigator)
    ├── Auth Flow
    │   ├── Splash
    │   ├── Login
    │   ├── RegisterStep1
    │   ├── RegisterStep2
    │   └── RegisterPush
    │
    ├── HomeDrawer (Drawer Navigator) ← Principal
    │   ├── Home (Inicio)
    │   ├── Profile (Perfil)
    │   ├── Invitados
    │   ├── Promociones
    │   ├── Providers (Proveedores)
    │   ├── Forms (Comunidad)
    │   │
    │   └── Secondary Screens (Hidden from Drawer)
    │       ├── Agenda
    │       ├── Costos
    │       ├── Cuentas
    │       ├── Tareas
    │       ├── Roles
    │       ├── Pantalla
    │       └── Idioma
    │
    ├── Provider Categories (Modales desde Home)
    │   ├── Vestidos
    │   ├── Floristerias
    │   ├── Trajes
    │   ├── Accesorios
    │   ├── Fotografia
    │   └── Video
    │
    ├── Profile Stack Screens
    │   ├── ProfileDetail (editar perfil)
    │   ├── Notifications (notificaciones)
    │   ├── Language (idioma)
    │   └── DisplayScreen (pantalla)
    │
    ├── Tareas Stack Screens
    │   └── AddTarea (agregar tarea - modal)
    │
    ├── Invitados Stack Screens
    │   └── AddInvitado (agregar invitado - modal)
    │
    └── Agenda Stack Screens
        ├── AddItinerario (agregar evento - modal)
        ├── CalendarAgenda (vista calendario)
        └── Itinerario (lista de eventos)
```

## Navegación por Pantalla

### Pantallas Principales (Bottom Navigation)
Todas estas pantallas tienen barra de navegación inferior consistente:

1. **Home** - Pantalla principal
   - Ver categorías de proveedores
   - Navegar a Vestidos, Floristerias, etc.
   - Bottom Nav: Home | Costos | Agenda | Cuentas

2. **Costos** - Gestión de presupuesto
   - Tabs: Compras | Carrito | Presupuesto
   - Bottom Nav: Home | Costos | Agenda | Cuentas

3. **Agenda** - Calendario y eventos
   - Ver calendario mensual
   - Ver tareas pendientes
   - Navegar a Tareas
   - Bottom Nav: Home | Costos | Agenda | Cuentas

4. **Cuentas** - Gestión de usuarios
   - Ver cuentas (Novia/Novio)
   - Configuración por cuenta
   - Bottom Nav: Home | Costos | Agenda | Cuentas

### Pantallas del Drawer Menu

5. **Profile** - Perfil del usuario
   - Navega a:
     - ProfileDetail (editar perfil completo)
     - Notifications (configurar notificaciones)
     - Language (cambiar idioma)
     - DisplayScreen (configuración de pantalla)

6. **Invitados** - Lista de invitados
   - Ver invitados por rol
   - Agregar invitado → AddInvitado (modal)
   - Navegar a Roles
   - Bottom Nav: Home | Costos | Agenda | Cuentas

7. **Promociones** - Ofertas y promociones
   - Ver grid de promociones
   - Bottom Nav: Home | Costos | Agenda | Cuentas

8. **Providers** - Lista de proveedores
   - Ver proveedores recomendados

9. **Forms** - Comunidad
   - Formularios y comunidad

### Pantallas Secundarias

10. **Tareas** - Lista de tareas
    - Ver tareas por mes
    - Filtrar tareas
    - Agregar tarea → AddTarea (modal)
    - Bottom Nav: Home | Costos | Agenda | Cuentas

11. **Roles** - Gestión de roles
    - Asignar roles a invitados
    - Ver tareas por rol
    - Agregar rol → AddInvitado (modal)
    - Bottom Nav: Home | Costos | Agenda | Cuentas

### Pantallas Modales (Presentación desde abajo)

- **AddTarea** - Formulario para agregar tarea
- **AddInvitado** - Formulario para agregar invitado/rol
- **AddItinerario** - Formulario para agregar evento

### Pantallas de Detalle (Slide desde derecha)

- **ProfileDetail** - Editar perfil completo
- **Notifications** - Configuración de notificaciones
- **Language** - Selección de idioma
- **DisplayScreen** - Configuración de pantalla
- **CalendarAgenda** - Vista extendida del calendario
- **Itinerario** - Lista detallada de eventos

## Flujo de Navegación

### Desde Home:
```
Home → Categoría (Vestidos, Trajes, etc.) → Back to Home
Home → Bottom Nav (Costos, Agenda, Cuentas)
Home → Drawer Menu → Profile/Invitados/Promociones/Providers/Forms
```

### Desde Profile:
```
Profile → ProfileDetail → Back to Profile
Profile → Notifications → Back to Profile
Profile → Language → Back to Profile
Profile → DisplayScreen → Back to Profile
```

### Desde Invitados:
```
Invitados → AddInvitado (modal) → Save → Back to Invitados
Invitados → Roles → AddInvitado (modal) → Back to Roles
```

### Desde Agenda:
```
Agenda → Tareas → AddTarea (modal) → Back to Tareas
Agenda → AddItinerario (modal) → Back to Agenda
Agenda → CalendarAgenda → Back to Agenda
```

## Mejoras Implementadas

### 1. Navegación Consistente
- ✅ Todas las pantallas principales usan `getParent()?.navigate()` para navegar a modales
- ✅ Bottom Navigation Bar unificada en todas las pantallas principales
- ✅ Botón "Atrás" consistente con fallback a Home si no hay historial

### 2. Jerarquía Clara
- ✅ Stack principal (AppNavigator) contiene todas las pantallas
- ✅ Drawer Navigator solo para menú lateral
- ✅ Pantallas secundarias ocultas del Drawer pero accesibles

### 3. Animaciones Apropiadas
- ✅ Modales: `slide_from_bottom` con `presentation: 'modal'`
- ✅ Detalles: `slide_from_right`
- ✅ Navegación principal: `slide_from_right` (default)

### 4. Manejo de "Atrás"
- ✅ `navigation.canGoBack()` verifica si hay historial
- ✅ Fallback a `Home` si no hay historial
- ✅ Modales se cierran con `goBack()`
- ✅ CuentasScreen: botón atrás cierra vista de cuenta individual

### 5. Integración de Nuevas Pantallas
- ✅ ProfileDetail, Notifications, Language, DisplayScreen
- ✅ AddTarea, AddInvitado, AddItinerario
- ✅ CalendarAgenda, Itinerario
- ✅ Todas accesibles desde el Stack principal

## Componentes Reutilizables

### BottomNavigationBar
Componente personalizado para barra de navegación inferior:
- Auto-detecta ruta activa
- Iconos Lucide consistentes
- Color activo: `#ff6b6b`
- Color inactivo: `#666`

Uso:
```javascript
import BottomNavigationBar from '../components/custom/BottomNavigationBar';

// En el return del componente:
<BottomNavigationBar />
```

## Notas Técnicas

### Stack vs Drawer
- **Stack Navigator** (AppNavigator): Navegación principal con historial
- **Drawer Navigator** (DrawerNavigator): Solo menú lateral, no maneja historial global

### Navegación a pantallas del Stack desde Drawer
```javascript
// ❌ Incorrecto (busca en Drawer):
navigation.navigate('ProfileDetail')

// ✅ Correcto (busca en Stack padre):
navigation.getParent()?.navigate('ProfileDetail')
```

### Pasar parámetros a modales
```javascript
navigation.getParent()?.navigate('AddTarea', {
  onAddTarea: (newTarea) => {
    // Callback para recibir datos
    console.log('Nueva tarea:', newTarea);
  }
})
```

### Verificar si puede retroceder
```javascript
if (navigation.canGoBack()) {
  navigation.goBack();
} else {
  navigation.navigate('Home');
}
```

## Testing de Navegación

### Casos de prueba:
1. ✅ Home → Vestidos → Back → Home
2. ✅ Home → Agenda → Tareas → AddTarea → Back → Tareas
3. ✅ Home → Profile → ProfileDetail → Back → Profile
4. ✅ Invitados → AddInvitado → Save → Back → Invitados
5. ✅ Agenda → Bottom Nav (Costos) → Agenda
6. ✅ Drawer Menu → Invitados → Drawer Menu
7. ✅ Cuentas → Ver cuenta → Back → Lista de cuentas
8. ✅ Cualquier pantalla sin historial → Back → Home

## Próximos Pasos

### Opcional:
- [ ] Agregar transiciones personalizadas para Drawer
- [ ] Implementar Deep Linking para notificaciones
- [ ] Agregar Tab Navigator para secciones específicas
- [ ] Persistir navegación en AsyncStorage
- [ ] Implementar Back Handler para Android
