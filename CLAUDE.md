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