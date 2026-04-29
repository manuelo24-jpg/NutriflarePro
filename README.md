# 🔥 NutriFlare — Guía de Ejecución

## 📋 Requisitos Previos

Asegúrate de tener instalado:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (incluye Docker Compose)
- [Git](https://git-scm.com/)
- [Node.js 20+](https://nodejs.org/) (solo necesario si trabajas fuera de Docker)

---

## 🚀 Arrancar el Proyecto (Desarrollo)

### 1. Clonar el repositorio

```bash
git clone https://github.com/manuelo24-jpg/frontend.git NutriflarePro
cd NutriflarePro
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

> Edita `.env` si necesitas cambiar credenciales o puertos. Por defecto funciona sin cambios.

### 3. Levantar todos los servicios

```bash
docker compose up -d --build
```

Esto arrancará:
| Servicio   | URL                        | Puerto |
|------------|----------------------------|--------|
| Frontend   | http://localhost           | 80     |
| Frontend   | http://localhost:3000      | 3000   |
| Backend    | http://localhost:3001      | 3001   |
| PostgreSQL | localhost:5432             | 5432   |
| Redis      | localhost:6379             | 6379   |

### 4. Aplicar migraciones de base de datos

La primera vez que arranques el proyecto, ejecuta las migraciones:

```bash
docker compose exec backend npx prisma migrate dev --name init
```

### 5. (Opcional) Ver logs en tiempo real

```bash
# Todos los servicios
docker compose logs -f

# Solo el backend
docker compose logs -f backend

# Solo el frontend
docker compose logs -f frontend
```

---

## 🛑 Parar el Proyecto

```bash
docker compose down
```

Para también eliminar los volúmenes (base de datos, redis):

```bash
docker compose down -v
```

---

## 🔄 Workflow de Desarrollo

### Reiniciar un servicio

```bash
docker compose restart backend
docker compose restart frontend
```

### Reconstruir tras instalar dependencias

```bash
docker compose up -d --build backend
docker compose up -d --build frontend
```

### Ejecutar comandos en el backend (NestJS)

```bash
# Generar Prisma Client
docker compose exec backend npx prisma generate

# Abrir Prisma Studio (GUI de la base de datos)
docker compose exec backend npx prisma studio

# Ejecutar seed de datos
docker compose exec backend npx ts-node prisma/seed.ts
```

### Ejecutar comandos en el frontend (Next.js)

```bash
# Instalar una dependencia
docker compose exec frontend npm install <paquete>

# Linter
docker compose exec frontend npm run lint
```

---

## 🗄️ Acceder a la Base de Datos

### Desde Prisma Studio (recomendado)

```bash
docker compose exec backend npx prisma studio
```

Se abre en http://localhost:5555

### Desde psql

```bash
docker compose exec postgres psql -U nutriflare -d nutriflare
```

---

## 🏗️ Estructura del Proyecto

```
NutriflarePro/
├── frontend/          # Next.js 15 + TypeScript + Tailwind CSS
├── backend/           # NestJS + Prisma + PostgreSQL
│   └── prisma/        # Schema y migraciones
├── nginx/             # Configuración del reverse proxy
├── docker-compose.yml # Desarrollo
├── docker-compose.prod.yml # Producción
└── .env               # Variables de entorno (no subir a git)
```

---

## 🔒 Variables de Entorno Importantes

| Variable              | Descripción                          | Valor por defecto     |
|-----------------------|--------------------------------------|-----------------------|
| `DB_USER`             | Usuario PostgreSQL                   | `nutriflare`          |
| `DB_PASSWORD`         | Contraseña PostgreSQL                | `changeme`            |
| `DB_NAME`             | Nombre de la base de datos           | `nutriflare`          |
| `JWT_SECRET`          | Secreto para access tokens           | (cambiar en producción) |
| `JWT_REFRESH_SECRET`  | Secreto para refresh tokens          | (cambiar en producción) |
| `SMTP_HOST`           | Servidor SMTP para emails            | Mailtrap (desarrollo)  |

---

## ⚠️ Solución de Problemas Comunes

### Error: Prisma Client no encuentra el query engine

```bash
docker compose exec backend npx prisma generate
docker compose restart backend
```

### El frontend muestra error 500

```bash
# Limpiar caché de Next.js
docker compose exec frontend rm -rf /app/.next
docker compose restart frontend
```

### Puerto ya en uso

```bash
# Ver qué proceso usa el puerto 80
netstat -ano | findstr :80
```

### Resetear completamente la base de datos

```bash
docker compose down -v
docker compose up -d --build
docker compose exec backend npx prisma migrate dev --name init
```

---

## 📦 Producción

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

> ⚠️ Cambia todos los valores del `.env` antes de desplegar en producción, especialmente `JWT_SECRET`, `JWT_REFRESH_SECRET` y las credenciales de base de datos.
