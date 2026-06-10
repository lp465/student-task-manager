# Student Task Management System — Complete Overview

This repository contains a full-stack Student Task Manager application with authentication, task management, analytics, and a responsive frontend.

Contents

- `StudentTaskManager-backend/` — Spring Boot REST API (Java 21, Maven)
- `Studenttaskmanager-frontend/` — React + Vite frontend (pnpm)
- `docs/` — architecture, deployment notes, and archived docs

Core features (implemented)

- Secure user registration and login (BCrypt password hashing)
- JWT access tokens with server-issued refresh tokens (refresh stored server-side and sent as an HttpOnly cookie)
- Automatic access-token refresh flow (client calls `/api/users/refresh` using the refresh cookie)
- Logout that invalidates refresh token and clears cookie
- Task CRUD: create, edit, complete, delete tasks
- Task filtering (status, priority), search, and subject/category support (optional field)
- Dashboard analytics (completion rates, overdue, due-this-week, priority and subject distributions) — served by backend and rendered with Chart.js on the frontend
- Frontend session persistence (auth stored in `localStorage`), 401 handling with refresh-and-retry, and graceful logout UX
- Dev-ready CORS configuration to support local ports and an explicit production origin for deployment

Architecture summary

- Backend: layered controller → service → repository pattern, DTOs for API boundaries, Spring Security filter for JWT validation
- Frontend: React + Context API for auth state, fetch wrappers that attach Authorization header and perform refresh on 401

Run locally (recommended)

Backend (dev via Maven):

```bash
cd StudentTaskManager-backend
./mvnw spring-boot:run
```

Or run the packaged jar on an alternate port:

```bash
cd StudentTaskManager-backend
./mvnw clean package
java -jar target/studenttaskmanager-0.0.1-SNAPSHOT.jar --server.port=8081
```

Frontend:

```bash
cd Studenttaskmanager-frontend
pnpm install
pnpm dev
```

Default frontend port: 5175 (Vite may select a nearby port if busy).

Smoke tests

- A PowerShell smoke script exists (`temp-smoke.ps1`) at repo root. It registers a temp user, logs in, creates a task, calls analytics, tests refresh and logout flows. Run it after backend is running.

Important environment variables

- Backend:
  - `SPRING_DATASOURCE_URL` (default: `jdbc:mysql://localhost:3306/StudentTaskManagement`)
  - `SPRING_DATASOURCE_USERNAME`
  - `SPRING_DATASOURCE_PASSWORD`
  - `SERVER_PORT` (optional)
  - `JWT_SECRET` (REQUIRED in production — strong secret)
  - `JWT_EXPIRATION_MS`, `JWT_REFRESH_EXPIRATION_MS` (token lifetimes)
  - `frontend.origins` (dev comma-separated origins)
  - `frontend.production.origin` (production origin for strict CORS)
- Frontend:
  - `VITE_API_BASE_URL` — base URL for backend APIs (e.g. `http://localhost:8081/api`)

Deployment notes

- Frontend (Vercel):
  - Set `VITE_API_BASE_URL` to your deployed backend URL in Vercel project settings.
  - Build command: `pnpm build`.
- Backend (Railway / Render):
  - Configure DB connection and `JWT_SECRET` as secrets on the platform.
  - Set `frontend.production.origin` to your Vercel domain to lock CORS.

Git / security guidance

- Do NOT commit secrets. Keep `application.properties` using environment placeholders.
- Use `.env.example` (not included) to document required env vars.

What I changed in docs during cleanup

- Root README updated with this comprehensive overview.
- Frontend and backend READMEs were updated with run/deploy notes and feature highlights.
- An `docs/archived/` folder contains backups of previous README content.

Next recommended actions

1. Add a `.env.example` to the repo documenting required env vars for dev and prod.
2. Create a `DEPLOY.md` with step-by-step instructions for deploying frontend to Vercel and backend to Railway.
3. Review `docs/archived/` and remove any items you explicitly do not want kept.

If you want, I will now: scan and archive redundant `.md` files and create a single `docs/` index (proceed after your approval).
