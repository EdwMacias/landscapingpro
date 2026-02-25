Necesito crear una aplicación web completa para una empresa de paisajismo llamado D&D landscaping pro con las siguientes características:

## Stack Técnico
- Frontend: Vue.js 3 (Composition API) con Vite
- Backend: Node.js con Express
- Base de datos: PostgreSQL o MongoDB
- Autenticación: JWT
- Storage: Cloudinary o similar para imágenes
- Email: Nodemailer para notificaciones
- UI: Tailwind CSS para diseño responsive

## Funcionalidades Principales

### 1. Sitio Público (Responsive)
- Página de inicio con galería destacada de proyectos
- Sección "Nuestro Trabajo" con filtros por categoría/tipo de obra
- Galería de fotos con lightbox y categorización
- Sección "Sobre Nosotros" con información de la empresa
- Formulario de contacto con:
  * Campos: nombre, email, teléfono, mensaje
  * Opción para subir archivos (planos, referencias)
  * Envío de notificación por email
- Sección de comentarios/testimonios de clientes
- Formulario de solicitud de cotización con:
  * Detalles del proyecto
  * Adjuntar archivos
  * Notificación automática por email

### 2. Panel de Administración para Trabajadores
- Sistema de login seguro (email/contraseña)
- Roles: Admin y Trabajador
- Dashboard para gestionar:
  * Crear/editar/eliminar proyectos
  * Subir múltiples fotos por proyecto
  * Agregar detalles: título, descripción, fecha, categoría, ubicación
  * Estado del proyecto (en progreso/completado)
  * Gestionar comentarios (aprobar/rechazar)
  * Ver cotizaciones recibidas
  * Gestionar galería principal del sitio

### 3. Características Técnicas
- Diseño 100% responsive (mobile-first)
- Lazy loading de imágenes
- Optimización de imágenes automática
- Formularios con validación
- Manejo de errores robusto
- SEO básico optimizado
- Animaciones suaves y profesionales

## Estructura de Carpetas
Organiza el proyecto con:
- /frontend (Vue.js app)
- /backend (Node.js API)
- /uploads (gestión de archivos temporales)
- Configuración de variables de entorno

## Entregables
1. Código completo y funcional
2. README con instrucciones de instalación
3. Scripts de base de datos
4. Configuración de deployment básico
5. Ejemplos de datos seed

Prioriza un diseño moderno, limpio y profesional que inspire confianza. Usa componentes reutilizables y código bien documentado.

---

## Entorno de Producción — Estado Actual

### Identidad del Cliente

| Campo | Valor |
|-------|-------|
| Empresa | D&D Landscaping Pro LLC |
| Fundador | Diego Peñaranda |
| Teléfono | (407) 267-2978 |
| Email info | infolandscaping@ddlandscapingpro.com |
| Email directo | diegopenaranda@ddlandscapingpro.com |
| Ubicación | Orlando, Florida |
| Idioma del sitio | Inglés (todo el sitio público está en inglés) |

### Docker — Reglas Importantes

- **NUNCA exponer puertos al exterior** con `0.0.0.0`. Todos los servicios deben ser solo internos o usar `127.0.0.1`.
- El frontend (`ddland-frontend`) se conecta a la red externa `scoobydoo` para que el **Nginx Proxy Manager** (`desktop-app-1`) lo pueda alcanzar por nombre de contenedor (`ddland-frontend:80`).
- **No usar `ports:`** en el frontend, usar `expose:` + red `scoobydoo`.
- La red `scoobydoo` es **external: true** — ya existe en el host, no crearla.
- **Usar `docker-compose` (v1.29.2)** para gestionar este proyecto, NO `docker compose` (v2). El v2 tiene incompatibilidades con las imágenes actuales (naming con guiones vs underscores).

### Comandos de Producción

```bash
# Levantar producción (sin rebuild)
docker-compose -f docker-compose.prod.yml up -d --no-build

# Bajar producción
docker-compose -f docker-compose.prod.yml down

# Rebuild del frontend (tras cambios en código)
docker-compose -f docker-compose.prod.yml build --no-cache frontend
docker-compose -f docker-compose.prod.yml up -d --no-build

# Rebuild del backend (tras cambios en código)
docker-compose -f docker-compose.prod.yml build --no-cache backend
docker-compose -f docker-compose.prod.yml up -d --no-build

# Ver estado de contenedores
docker ps --filter "name=ddland"
```

### Contenedores del Proyecto

| Contenedor | Imagen | Puerto | Acceso |
|------------|--------|--------|--------|
| `ddland-frontend` | `landscapingpro_frontend` | 80 (interno) | Via red `scoobydoo` → NPM |
| `ddland-backend` | `landscapingpro_backend` | 8767 (interno) | Solo red `ddland-network` |
| `ddland-mongodb` | `mongo:7` | 27017 (interno) | Solo red `ddland-network` |

### Redes Docker

| Red | Tipo | Uso |
|-----|------|-----|
| `landscapingpro_ddland-network` | bridge (interna) | Comunicación frontend ↔ backend ↔ mongodb |
| `scoobydoo` | bridge (external) | Expone el frontend al Nginx Proxy Manager |

### Otros Proyectos en el Mismo Host

El host corre múltiples proyectos bajo el mismo Nginx Proxy Manager (`desktop-app-1`):
- `inventorycheck-modern-*` — todos en `127.0.0.1` (no expuestos)
- `cedac-frontend` — puerto 3000 expuesto
- `desktop-portainer-1` — gestión de contenedores

### Nota sobre el Error de Red al Bajar Producción

Al ejecutar `docker-compose down`, aparece el error:
```
error while removing network: network landscapingpro_ddland-network has active endpoints
```
Esto es **normal e inofensivo** — ocurre porque la red `scoobydoo` tiene otros contenedores conectados. Los contenedores de ddland se detienen y eliminan correctamente.