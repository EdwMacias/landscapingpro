# D&D Landscaping Pro - Guía de Producción

## Arquitectura Docker

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Network                        │
│                   (ddland-network)                       │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Frontend   │  │   Backend    │  │   MongoDB    │  │
│  │   (Nginx)    │──│   (Node.js)  │──│   (Mongo 7)  │  │
│  │  :16262→:80  │  │  :8767→:8767 │  │   interno    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Puertos Expuestos

| Servicio | Puerto Externo | Puerto Interno |
|----------|----------------|----------------|
| Frontend | 16262          | 80             |
| Backend  | 8767           | 8767           |
| MongoDB  | (no expuesto)  | 27017          |

## Despliegue Rápido

### 1. Preparar variables de entorno

```bash
cd /home/websever/code/ddland
cp .env.production .env
```

### 2. Construir e iniciar contenedores

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### 3. Verificar estado

```bash
docker-compose -f docker-compose.prod.yml ps
```

Todos los servicios deben estar en estado `Up (healthy)`.

### 4. Cargar datos iniciales (solo primera vez)

```bash
docker exec ddland-backend node utils/seed.js
```

## Comandos de Gestión

```bash
# Ver logs de todos los servicios
docker-compose -f docker-compose.prod.yml logs -f

# Ver logs de un servicio específico
docker-compose -f docker-compose.prod.yml logs -f backend

# Reiniciar todos los servicios
docker-compose -f docker-compose.prod.yml restart

# Reiniciar solo el backend
docker-compose -f docker-compose.prod.yml restart backend

# Detener todos los servicios
docker-compose -f docker-compose.prod.yml down

# Detener y eliminar volúmenes (¡BORRA LA BASE DE DATOS!)
docker-compose -f docker-compose.prod.yml down -v

# Reconstruir un servicio específico
docker-compose -f docker-compose.prod.yml up -d --build backend
```

## Actualizar la Aplicación

```bash
# 1. Obtener últimos cambios
git pull

# 2. Reconstruir y reiniciar
docker-compose -f docker-compose.prod.yml up -d --build

# 3. Verificar logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Backup de Base de Datos

```bash
# Crear backup
docker exec ddland-mongodb mongodump --db ddland --out /data/backup

# Copiar backup al host
docker cp ddland-mongodb:/data/backup ./backup-$(date +%Y%m%d)

# Restaurar backup
docker cp ./backup ddland-mongodb:/data/backup
docker exec ddland-mongodb mongorestore --db ddland /data/backup/ddland
```

## URLs de Acceso

| Recurso | URL |
|---------|-----|
| Sitio web | http://tu-servidor:16262 |
| API | http://tu-servidor:8767/api |
| Panel Admin | http://tu-servidor:16262/admin |

## Credenciales por Defecto

Después de ejecutar el seed:

- **Admin:** admin@ddlandscaping.com / admin123
- **Worker:** worker@ddlandscaping.com / worker123

**IMPORTANTE:** Cambiar las contraseñas en producción.

## Solución de Problemas

### Frontend no carga
```bash
docker logs ddland-frontend
docker-compose -f docker-compose.prod.yml restart frontend
```

### Backend no conecta a MongoDB
```bash
docker logs ddland-backend
docker logs ddland-mongodb
# Verificar que MongoDB esté healthy
docker-compose -f docker-compose.prod.yml ps
```

### Limpiar todo y empezar de nuevo
```bash
docker-compose -f docker-compose.prod.yml down -v
docker system prune -f
docker-compose -f docker-compose.prod.yml up -d --build
docker exec ddland-backend node utils/seed.js
```
