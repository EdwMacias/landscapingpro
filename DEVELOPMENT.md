# D&D Landscaping Pro - Guía de Desarrollo

## Requisitos Previos

- Node.js 18+
- Docker y Docker Compose
- Git

## Puertos del Sistema

| Servicio | Puerto |
|----------|--------|
| Frontend | 16262  |
| Backend  | 8767   |
| MongoDB  | 16261  |

## Inicio Rápido (Desarrollo)

### 1. Iniciar MongoDB

```bash
cd /home/websever/code/ddland
docker-compose up -d
```

Verificar: `docker ps` - debe mostrar `ddland-mongodb`

### 2. Configurar Backend

```bash
cd backend
npm install
```

Verificar que `.env` tenga:
```env
PORT=8767
MONGODB_URI=mongodb://localhost:16261/ddland
```

### 3. Cargar Datos de Prueba

```bash
cd backend
npm run seed
```

Credenciales creadas:
- **Admin:** admin@ddlandscaping.com / admin123
- **Worker:** worker@ddlandscaping.com / worker123

### 4. Iniciar Backend

```bash
cd backend
npm run dev
```

API disponible en: `http://localhost:8767`

### 5. Configurar Frontend

```bash
cd frontend
npm install
```

### 6. Iniciar Frontend

```bash
cd frontend
npm run dev -- --port 16262
```

App disponible en: `http://localhost:16262`

## Comandos Útiles

```bash
# Ver logs de MongoDB
docker logs ddland-mongodb

# Reiniciar MongoDB
docker-compose restart

# Detener MongoDB
docker-compose down

# Limpiar base de datos y reiniciar
docker-compose down -v && docker-compose up -d
```

## Estructura de Archivos Clave

```
backend/
├── .env              # Variables de entorno
├── server.js         # Punto de entrada
└── utils/seed.js     # Script de datos iniciales

frontend/
├── .env              # Variables (opcional)
└── vite.config.js    # Configuración Vite
```

## Endpoints de Prueba

```bash
# Health check
curl http://localhost:8767/api/health

# Obtener categorías
curl http://localhost:8767/api/categories

# Login
curl -X POST http://localhost:8767/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ddlandscaping.com","password":"admin123"}'
```
