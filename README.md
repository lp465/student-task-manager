# Student Task Management System

A full-stack web application for managing student academic tasks with authentication, task prioritization, filtering, analytics, and responsive UI.

## Tech Stack

- Backend: Java, Spring Boot, MySQL, JPA/Hibernate
- Frontend: React, Vite, React Router, Context API
- Security: BCrypt password hashing
- Deployment: Maven, Vite build

## Features

- User registration and login
- Secure password storage with BCrypt
- Create, update, delete tasks
- Task status tracking (Pending / Completed)
- Search and filter by task status and priority
- Dashboard analytics for completed, pending, and high-priority pending tasks
- Mobile-first responsive UI
- Environment-based API configuration

## Recent UI/UX improvements (v1.0.1)

- Added a modern landing page served at `/` with clear CTAs for Login and Create account.
- Introduced a persistent application layout (`AppLayout`) and `Sidebar` component used by authenticated routes to improve navigation and hierarchy.
- Dashboard visual polish: overview cards, upcoming-deadlines panel, and a concise insight card to surface urgency.
- Task card micro-UX: due-date chips with states (overdue / due soon / today / later), consistent priority and subject badges.
- Frontend styling refactor: centralized CSS tokens (colors, radii, shadows, spacing) in `src/index.css` for consistent theming and easier maintenance.
- Added optional persisted `subject`/category field on tasks (backward compatible; API unchanged for existing clients).
- No backend API routes or flows were removed; all changes are UI-focused and preserve existing CRUD endpoints.

## Project Structure

- `StudentTaskManager-backend/` — Spring Boot backend service
- `Studenttaskmanager-frontend/` — React frontend application
- `SETUP.md` — Setup and environment instructions
- `ARCHITECTURE.md` — Architecture overview
- `WORKFLOW.md` — User flow descriptions

## Getting Started

### Backend

```bash
cd StudentTaskManager-backend
./mvnw spring-boot:run
```

Default backend port: `8080`

### Frontend

```bash
cd Studenttaskmanager-frontend
npm install
npm run dev
```

Default frontend port: `5173`

### Production Builds

Backend:

```bash
cd StudentTaskManager-backend
./mvnw clean package
```

Frontend:

```bash
cd Studenttaskmanager-frontend
npm run build
```

## Environment Variables

The backend reads database and server settings from environment variables.

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `SERVER_PORT`

The frontend uses `VITE_API_BASE_URL` to point to the backend API.

## Notes

This project includes documentation for deployment, setup, and workflow in `SETUP.md`, `ARCHITECTURE.md`, and `WORKFLOW.md`. For frontend-specific details, see `Studenttaskmanager-frontend/README.md`.
