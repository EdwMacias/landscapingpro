# D&D Landscaping Pro — Progress Log

**Fecha de última actualización:** 2026-02-19
**Branch activo:** `master`

---

## Estado General

El proyecto está **funcional en entorno Docker** con comunicación verificada entre el contenedor frontend y el contenedor backend. La aplicación completa (frontend + backend + MongoDB) corre con `docker-compose.prod.yml`.

---

## Stack Técnico Implementado

| Capa | Tecnología |
|------|-----------|
| Frontend | Vue.js 3 (Composition API) + Vite |
| Estilos | Tailwind CSS (responsive, mobile-first) |
| Backend | Node.js + Express |
| Base de datos | MongoDB (Mongoose) via Docker |
| Autenticación | JWT |
| Storage de imágenes | Cloudinary |
| Email | Nodemailer |
| Deployment | Docker Compose (producción) |

---

## Estructura del Proyecto

```
landscapingpro/
├── frontend/               # Vue.js 3 app
│   ├── src/
│   │   ├── views/
│   │   │   ├── public/     # Sitio público
│   │   │   └── admin/      # Panel de administración
│   │   ├── components/
│   │   │   └── layout/     # Navbar, Footer
│   │   ├── stores/         # Pinia (auth, projects, categories)
│   │   ├── router/         # Vue Router
│   │   └── utils/          # api.js, helpers.js
│   └── public/             # Assets estáticos
├── backend/                # Node.js API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── utils/
└── docker-compose.prod.yml
```

---

## Páginas Públicas — Completadas

### `HomePage.vue`
- Hero section con imagen de fondo y CTA ("Get a Free Quote" / "View Projects")
- Sección de 6 servicios con íconos (Garden Design, Landscaping, Maintenance, Irrigation, Hardscaping, Tree Pruning)
- Grilla de proyectos destacados (carga dinámica desde API, con skeleton loading)
- Sección "Why Choose Us" con lista de 6 puntos clave
- Sección de testimonios de clientes (carga dinámica desde API)
- CTA final en fondo naranja/acento

### `AboutPage.vue`
- Hero con fondo oscuro y subtítulo
- Sección "Who We Are" con descripción de la empresa D&D Landscaping Pro LLC
- Grilla de 9 servicios ofrecidos con íconos
- Sección de 4 valores (Quality, Reliability, Integrity, Results)
- Tarjeta del fundador **Diego Peñaranda** con foto (`/founder.jpeg`) y cargo Founder & CEO
- Estadísticas: 10+ años, 500+ proyectos, 98% clientes satisfechos, 9 servicios
- CTA final

### `ContactPage.vue`
- Información de contacto: dirección Miami FL, teléfono `(407) 267-2978`, dos emails (`infolandscaping@ddlandscapingpro.com`, `diegopenaranda@ddlandscapingpro.com`), horarios de atención
- Mapa embebido de Google Maps (Miami, FL)
- Formulario de contacto: nombre, email, teléfono, mensaje, adjuntos (imagen/PDF)
- Envío vía API con manejo de éxito y error
- Subida de archivos via `multipart/form-data`

### `QuotePage.vue`
- Formulario completo de cotización: nombre, email, teléfono, dirección del proyecto
- Selector de tipo de servicio (8 opciones)
- Selector de presupuesto estimado (6 rangos)
- Selector de timeline (5 opciones)
- Descripción del proyecto (textarea)
- Adjuntos de archivos (fotos, PDFs)
- Pantalla de éxito post-envío

### `ProjectsPage.vue`
- Grilla de proyectos con filtro por categoría (select) y búsqueda de texto
- Filtros reactivos con watch (recarga automática al cambiar)
- Botón "Load more" con paginación
- Cards con imagen, badge de categoría, badge "In progress" si aplica, título y descripción corta
- Skeleton loading mientras carga

### `ProjectDetailPage.vue`
- Imagen principal grande (h-96 / h-[500px]) con hover zoom
- Thumbnails en grid (hasta 6 columnas) para navegar imágenes
- Lightbox con navegación prev/next y contador
- Sección de descripción con tags
- Metadata: ubicación, fecha de completación, categoría
- CTA al final para solicitar cotización similar

### `GalleryPage.vue`
- Grid responsivo de imágenes (2/3/4 columnas según breakpoint)
- Filtro por categoría (pills de colores)
- Filtro sticky debajo del navbar
- Lightbox al hacer clic en imagen
- Skeleton loading con 12 placeholders

### `LoginPage.vue`
- Formulario de login (email + password)
- Redirección post-login a `/admin` o a la ruta original
- Enlace "Back to site"

### `NotFoundPage.vue`
- Página 404 con número grande, mensaje y botón "Back to Home"

---

## Layout / Componentes Compartidos

### `Navbar.vue`
- Logo (`/logo puro.png`) + nombre de la empresa
- Links de navegación: Home, Projects, Gallery, About Us, Contact
- Botón CTA "Get a Free Quote" en desktop
- Menú hamburguesa animado en mobile
- Marca de ruta activa con color primario
- Sticky top con z-index 50

### `Footer.vue`
- Logo + descripción de la empresa
- Links de redes sociales (Facebook, Instagram — íconos SVG)
- Links rápidos: Home, Projects, Gallery, About Us
- Información de contacto: Miami FL, teléfono, email
- Copyright dinámico con `new Date().getFullYear()`

---

## Panel de Administración — Estructura Implementada

Los siguientes archivos están creados bajo `/frontend/src/views/admin/`:

| Vista | Descripción |
|-------|-------------|
| `AdminLayout.vue` | Layout principal del panel con sidebar |
| `DashboardPage.vue` | Dashboard con estadísticas generales |
| `ProjectsPage.vue` | Lista y gestión de proyectos |
| `ProjectFormPage.vue` | Formulario crear/editar proyecto con subida de fotos |
| `GalleryPage.vue` | Gestión de la galería principal |
| `QuotesPage.vue` | Vista de cotizaciones recibidas |
| `ContactsPage.vue` | Vista de mensajes de contacto |
| `TestimonialsPage.vue` | Gestión y aprobación de testimonios |
| `CategoriesPage.vue` | Gestión de categorías |
| `UsersPage.vue` | Gestión de usuarios (solo Admin) |

---

## Backend API — Completado

### Servidor (`server.js`)
- Express con CORS configurado
- Body parser hasta 10mb
- Servicio de archivos estáticos `/uploads`
- Error handler global con stack trace en dev
- Handler 404

### Rutas API disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | Login con JWT |
| GET/POST | `/api/projects` | Listar / crear proyectos |
| GET/PUT/DELETE | `/api/projects/:slug` | Detalle / editar / eliminar proyecto |
| GET/POST | `/api/categories` | Categorías |
| GET/POST | `/api/testimonials` | Testimonios |
| POST | `/api/contact` | Enviar mensaje de contacto |
| POST | `/api/quotes` | Enviar solicitud de cotización |
| GET/POST | `/api/gallery` | Galería de imágenes |
| GET/POST/DELETE | `/api/users` | Gestión de usuarios |
| GET | `/api/health` | Health check |

### Modelos MongoDB

| Modelo | Campos principales |
|--------|-------------------|
| `User` | email, password (hash), role (admin/worker), name |
| `Project` | title, slug, description, shortDescription, images[], category, location, completionDate, status, featured, tags[] |
| `Category` | name, slug, description |
| `Gallery` | title, description, image, category, featured |
| `Testimonial` | name, location, content, rating, featured, approved |
| `Contact` | name, email, phone, message, attachments[], read |
| `Quote` | name, email, phone, address, serviceType, budget, timeline, description, attachments[], status |

### Configuraciones
- **Cloudinary** — `config/cloudinary.js`: configuración de SDK y upload
- **Email** — `config/email.js`: Nodemailer transporter
- **Database** — `config/database.js`: conexión MongoDB via Mongoose
- **Auth middleware** — `middleware/auth.js`: verificación JWT y roles
- **Validators** — `middleware/validators.js`: validación de inputs
- **Seed** — `utils/seed.js`: datos de ejemplo para inicializar la DB

---

## Assets Agregados

| Archivo | Descripción |
|---------|-------------|
| `frontend/public/founder.jpeg` | Foto del fundador Diego Peñaranda |
| `frontend/public/logo puro.png` | Logo de la empresa (sin fondo) |
| `frontend/public/logo.ico` | Favicon |
| `frontend/public/logo.svg` | Logo en formato SVG |

---

## Configuración Docker (Producción)

**`docker-compose.prod.yml`** define 3 servicios:

| Servicio | Imagen | Puerto | Detalle |
|----------|--------|--------|---------|
| `mongodb` | mongo:7 | interno | healthcheck integrado, volumen persistente |
| `backend` | Dockerfile local | 8767 (interno) | variables de entorno vía `.env` |
| `frontend` | Dockerfile + build Vite | **16262:80** | proxy `/api` → backend |

**Variables de entorno requeridas en `.env`:**
```
JWT_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
EMAIL_HOST / EMAIL_PORT / EMAIL_SECURE / EMAIL_USER / EMAIL_PASS / EMAIL_FROM
FRONTEND_URL
VITE_API_URL
```

---

## Identidad de Marca Actualizada

| Campo | Valor |
|-------|-------|
| Empresa | D&D Landscaping Pro LLC |
| Fundador | Diego Peñaranda |
| Teléfono | (407) 267-2978 |
| Email info | infolandscaping@ddlandscapingpro.com |
| Email directo | diegopenaranda@ddlandscapingpro.com |
| Ubicación | Miami, Florida |
| Servicios | 9 servicios especializados de paisajismo |
| Idioma del sitio | Inglés (sitio público) |

---

## Commits Registrados

| Hash | Descripción |
|------|-------------|
| `436ba10` | Verified connection between backend and frontend containers |
| `52f2123` | Updated ports |
| `9e6050c` | First commit after working on local |

---

## Pendiente / Próximos Pasos

- [ ] Verificar funcionamiento completo del panel de administración (rutas protegidas, CRUD de proyectos)
- [ ] Configurar variables de entorno reales (Cloudinary, email SMTP)
- [ ] Seed de datos iniciales en producción (`utils/seed.js`)
- [ ] Agregar dirección real de la empresa en `ContactPage.vue` (actualmente placeholder "123 Landscaping Way")
- [ ] Configurar enlaces reales de redes sociales en `Footer.vue` (actualmente `href="#"`)
- [ ] Configurar Nginx Proxy Manager para dominio `ddlandscapingpro.com` (ver `NGINX-PROXY-MANAGER-SETUP.md`)
- [ ] Revisar SEO: meta tags dinámicos por página
- [ ] Pruebas end-to-end de formularios (Contact y Quote) con email real
