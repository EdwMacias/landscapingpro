# D&D Landscaping Pro

Aplicación web completa para una empresa de paisajismo con sitio público y panel de administración.

## Stack Técnico

- **Frontend**: Vue.js 3 (Composition API) + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Base de datos**: MongoDB con Mongoose
- **Autenticación**: JWT
- **Almacenamiento de imágenes**: Cloudinary
- **Envío de emails**: Nodemailer

## Estructura del Proyecto

```
ddland/
├── backend/
│   ├── config/          # Configuraciones (DB, Cloudinary, Email)
│   ├── controllers/     # Controladores de la API
│   ├── middleware/      # Middlewares (auth, validación)
│   ├── models/          # Modelos de Mongoose
│   ├── routes/          # Rutas de la API
│   ├── utils/           # Utilidades y scripts
│   └── server.js        # Punto de entrada
├── frontend/
│   ├── public/          # Archivos estáticos
│   └── src/
│       ├── assets/      # CSS y recursos
│       ├── components/  # Componentes Vue
│       ├── router/      # Configuración de rutas
│       ├── stores/      # Stores de Pinia
│       ├── utils/       # Utilidades
│       └── views/       # Páginas
└── uploads/             # Archivos temporales
```

## Requisitos

- Node.js 18+
- MongoDB (local o Atlas)
- Cuenta de Cloudinary
- Cuenta de email (Gmail u otro SMTP)

## Instalación

### 1. Clonar el repositorio

```bash
cd ddland
```

### 2. Configurar el Backend

```bash
cd backend
npm install

# Copiar archivo de configuración
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ddland

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password
EMAIL_FROM=D&D Landscaping Pro <noreply@ddlandscaping.com>

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 3. Configurar el Frontend

```bash
cd frontend
npm install
```

### 4. Inicializar la Base de Datos (Seed)

```bash
cd backend
npm run seed
```

Esto creará:
- Usuario admin: `admin@ddlandscaping.com` / `admin123`
- Usuario trabajador: `worker@ddlandscaping.com` / `worker123`
- Categorías de ejemplo
- Proyectos de ejemplo
- Testimonios de ejemplo
- Imágenes de galería de ejemplo

## Ejecución

### Desarrollo

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

El frontend estará en `http://localhost:5173` y el backend en `http://localhost:5000`.

### Producción

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## Funcionalidades

### Sitio Público

- **Página de inicio** con servicios, proyectos destacados y testimonios
- **Proyectos** con filtros por categoría y búsqueda
- **Galería** de imágenes con lightbox
- **Sobre Nosotros** con información de la empresa
- **Contacto** con formulario y adjuntos
- **Solicitud de Cotización** con detalles del proyecto

### Panel de Administración

- **Dashboard** con estadísticas y accesos rápidos
- **Proyectos** - CRUD completo con múltiples imágenes
- **Galería** - Gestión de imágenes destacadas
- **Categorías** - Administración de categorías
- **Testimonios** - Aprobar/rechazar comentarios
- **Cotizaciones** - Ver y gestionar solicitudes
- **Mensajes** - Ver mensajes de contacto
- **Usuarios** - Gestión de usuarios (solo admin)

### Roles

- **Admin**: Acceso total, puede gestionar usuarios
- **Worker**: Acceso a gestión de contenido (sin usuarios)

## API Endpoints

### Públicos

```
GET  /api/projects          # Lista de proyectos
GET  /api/projects/:slug    # Detalle de proyecto
GET  /api/categories        # Lista de categorías
GET  /api/testimonials      # Testimonios aprobados
GET  /api/gallery           # Imágenes de galería
POST /api/contact           # Enviar mensaje
POST /api/quotes            # Solicitar cotización
POST /api/auth/login        # Iniciar sesión
```

### Protegidos (requieren JWT)

```
GET    /api/projects/admin/all    # Todos los proyectos
POST   /api/projects              # Crear proyecto
PUT    /api/projects/:id          # Actualizar proyecto
DELETE /api/projects/:id          # Eliminar proyecto

# Similar para: categories, testimonials, gallery, quotes, contact, users
```

## Características Técnicas

- Diseño 100% responsive (mobile-first)
- Lazy loading de imágenes
- Optimización automática de imágenes en Cloudinary
- Validación de formularios (frontend y backend)
- Manejo de errores robusto
- SEO básico optimizado
- Animaciones suaves con CSS

## Variables de Entorno de Producción

Para Gmail, necesitas crear una "App Password":
1. Ir a tu cuenta de Google
2. Seguridad > Verificación en 2 pasos (activar si no está)
3. Contraseñas de aplicaciones > Crear nueva

Para Cloudinary:
1. Crear cuenta gratuita en cloudinary.com
2. Copiar credenciales del dashboard

## Licencia

MIT
