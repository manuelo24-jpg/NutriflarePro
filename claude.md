# 🚀 NutriFlare - Plan de Trabajo y División de Tareas

Este documento define la estructura general del proyecto **NutriFlare** y propone una estrategia de división de tareas para que múltiples agentes o modelos de IA puedan colaborar de manera eficiente sin generar conflictos en el código base.

## 🏗️ Estructura General

El proyecto es un monorepo que contiene el frontend (Next.js), el backend (NestJS) y la configuración de infraestructura (Docker, Nginx, Postgres, Redis).

```text
nutriflare/
├── frontend/             # Next.js App (React 19, Tailwind v4, Zustand, React Query)
├── backend/              # NestJS API (Prisma, PostgreSQL, Redis, JWT auth)
├── nginx/                # Reverse proxy
└── docker-compose.yml    # Orquestación de contenedores
```

## 📋 División de Tareas por Agentes (Modelos de IA)

Para paralelizar el desarrollo, dividiremos el proyecto en **4 Dominios de Trabajo**. Cada agente (o sesión) debe enfocarse estrictamente en su dominio para evitar conflictos de git o sobrescribir archivos mutuamente.

### 🤖 Agente 1: Infraestructura y Backend Core
**Responsabilidad:** Base de datos, autenticación, y arquitectura base del backend.
- Configurar y mantener `docker-compose.yml`, Redis y PostgreSQL.
- Gestionar el esquema de Prisma (`schema.prisma`) y migraciones.
- Implementar el módulo de Autenticación en NestJS (Login, Registro, JWT Refresh, Role Guards).
- Implementar el módulo de Usuarios (CRUD básico de perfil).

### 🤖 Agente 2: Frontend Core y Diseño Base
**Responsabilidad:** Componentes UI compartidos, store global y páginas públicas.
- Diseñar la Landing Page, Login y Register (`/(auth)`).
- Configurar Tailwind CSS, Shadcn/ui y layout general del dashboard (`/(app)/layout.tsx`).
- Configurar `axios` interceptors y Zustand store (`useAuthStore`).
- Asegurar la responsividad general y diseño estético premium (Glassmorphism, dark mode).

### 🤖 Agente 3: Feature Dominio - Rutinas y Nutrición
**Responsabilidad:** Funcionalidades de entrenamiento y alimentación (Full-stack).
- **Backend:** Crear endpoints REST para `/api/routines`, `/api/exercises`, `/api/dishes` y `/api/meal-plans`.
- **Frontend:** Implementar las vistas `/routines` y `/nutrition`.
- **Frontend:** Desarrollar el `RoutineBuilder` (drag&drop de ejercicios) y el `MealPlanBuilder`.
- Implementar la exportación a PDF de las rutinas (`@react-pdf/renderer`).

### 🤖 Agente 4: Feature Dominio - Progreso, Comunidad y Admin
**Responsabilidad:** Dashboard de métricas, parte social y administración (Full-stack).
- **Backend:** Crear endpoints para `/api/progress` (logs diarios, metas) y `/api/admin` (moderación).
- **Frontend:** Construir el `DashboardPage` con gráficas `recharts`.
- **Frontend:** Implementar la vista `/progress` con el formulario diario.
- **Frontend:** Implementar `/community` (feed, valoraciones, copiar rutinas).
- **Frontend:** Construir `/admin` (tabla de aprobaciones, gestión de usuarios).

## ⚠️ Reglas de Colaboración
1. **Evitar solapamientos:** El Agente 3 no debe modificar el `schema.prisma` a menos que sea estrictamente necesario y se haya coordinado con el Agente 1.
2. **Mocking inicial:** Si el Agente 3 o 4 necesitan datos para el frontend antes de que el backend esté listo, usarán mocks estáticos en el frontend.
3. **Comunicación de Cambios Core:** Si un agente modifica una interfaz global (como un DTO, variable de entorno o un componente UI compartido), debe dejar constancia en este archivo o en el README.
