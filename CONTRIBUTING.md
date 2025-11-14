# Guía de Contribución - Nuptiae

¡Gracias por tu interés en contribuir al proyecto Nuptiae! Esta guía te ayudará a mantener un registro ordenado de todos los avances.

## 📋 Cómo Documentar Avances

### 1. Antes de Empezar
- Revisa `PROGRESS.md` para conocer el estado actual del proyecto
- Revisa los avances anteriores en `docs/progress/` para mantener consistencia

### 2. Durante el Desarrollo
- Toma notas de los cambios que realizas
- Captura pantallas si hay cambios visuales
- Documenta problemas encontrados y sus soluciones

### 3. Al Completar un Avance

#### Paso 1: Crea un Documento de Avance
1. Copia la plantilla `docs/progress/TEMPLATE.md`
2. Nómbralo con el formato: `YYYY-MM-DD-descripcion-corta.md`
   - Ejemplo: `2025-11-14-implementacion-login.md`
3. Completa todas las secciones relevantes

#### Paso 2: Actualiza PROGRESS.md
1. Añade un resumen del avance en la sección "Registro de Avances"
2. Actualiza el historial de versiones si corresponde

#### Paso 3: Actualiza el README (si es necesario)
- Si cambió la estructura del proyecto
- Si hay nueva información relevante para usuarios

### 4. Estructura de un Buen Documento de Avance

Un buen documento de avance debe incluir:

✅ **Título descriptivo**
✅ **Fecha y autor**
✅ **Resumen claro y conciso**
✅ **Lista de funcionalidades implementadas**
✅ **Detalles técnicos de los cambios**
✅ **Problemas encontrados y soluciones**
✅ **Capturas de pantalla (cuando aplique)**
✅ **Próximos pasos claros**

❌ Evita:
- Documentos demasiado vagos o genéricos
- Omitir problemas encontrados
- No documentar decisiones técnicas importantes

## 💻 Flujo de Trabajo con Git

```bash
# 1. Crear/cambiar a una rama de trabajo
git checkout -b feature/nombre-funcionalidad

# 2. Realizar cambios y commits
git add .
git commit -m "Descripción clara del cambio"

# 3. Documentar el avance
# (Crear archivo en docs/progress/ y actualizar PROGRESS.md)

# 4. Commit de la documentación
git add docs/progress/*.md PROGRESS.md
git commit -m "docs: Documentar avance de [funcionalidad]"

# 5. Push a GitHub
git push origin feature/nombre-funcionalidad

# 6. Crear Pull Request
```

## 📝 Convenciones

### Mensajes de Commit
Usa el formato [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `docs:` - Solo cambios en documentación
- `style:` - Cambios de formato (no afectan código)
- `refactor:` - Refactorización de código
- `test:` - Añadir o corregir tests
- `chore:` - Cambios en build, configuración, etc.

Ejemplos:
```
feat: Implementar pantalla de login
fix: Corregir error en validación de formulario
docs: Actualizar documentación de API
```

### Nombres de Archivos
- Documentos de avance: `YYYY-MM-DD-descripcion-kebab-case.md`
- Código: Sigue las convenciones del framework elegido

### Estructura de Ramas
- `main` - Código estable y probado
- `develop` - Rama de desarrollo activo
- `feature/nombre` - Nuevas funcionalidades
- `fix/nombre` - Corrección de bugs
- `docs/nombre` - Actualizaciones de documentación

## 🧪 Testing y Calidad

Antes de documentar un avance como completado:

- [ ] El código compila sin errores
- [ ] Se han ejecutado las pruebas relevantes
- [ ] La funcionalidad ha sido probada manualmente
- [ ] El código sigue las convenciones del proyecto
- [ ] La documentación está actualizada

## 🤝 Comunicación

- Usa Issues para reportar bugs o proponer nuevas funcionalidades
- Usa Pull Requests para enviar cambios
- Documenta las decisiones importantes en los archivos de avance

## 📞 Preguntas

Si tienes dudas sobre cómo documentar un avance, revisa:
1. La plantilla en `docs/progress/TEMPLATE.md`
2. Ejemplos anteriores en `docs/progress/`
3. El archivo `PROGRESS.md`

---

**¡Gracias por contribuir al proyecto Nuptiae!** 🎉
