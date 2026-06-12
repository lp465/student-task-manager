# Student Task Manager Frontend

React + Vite frontend for the Student Task Manager application.

## What it does

- Public landing page at `/`
- Login and registration screens
- Authenticated dashboard at `/dashboard`
- Task management workspace at `/tasks`
- Sidebar navigation for authenticated users
- Local task search, status filtering, and priority filtering
- Dashboard summary cards, upcoming deadlines, and analytics charts

## Frontend structure

- `src/App.jsx` - route definitions
- `src/context/AuthContext.jsx` - auth state and `localStorage` persistence
- `src/api/auth.js` - register, login, refresh, logout
- `src/api/tasks.js` - task list and task CRUD requests
- `src/api/analytics.js` - analytics summary request
- `src/pages/` - page components
- `src/components/` - reusable UI components

## Authentication behavior

- Login stores `{ token, user }` in `localStorage`.
- The access token is attached as a Bearer token to authenticated API requests.
- The task and analytics clients try a refresh request once after a `401`.
- If refresh fails, the app clears local auth state and redirects to `/login`.
- Logout clears the local session and shows a logout message on the login screen.

## Setup

```bash
cd Studenttaskmanager-frontend
pnpm install
pnpm dev
```

You can also use npm:

```bash
npm install
npm run dev
```

## Environment variables

- `VITE_API_BASE_URL` - backend API root, for example `http://localhost:8080/api`

If the variable is not set, the frontend falls back to `http://localhost:8080/api`.

## Build

```bash
pnpm build
```

## Deployment note

- The repository includes `public/_redirects` for Netlify-style SPA routing.
- If you deploy the frontend on another domain, update the CORS origin list in `StudentTaskManager-backend/src/main/java/com/internship/studenttaskmanager/security/SecurityConfig.java`.

## Feature notes

- Search is local and checks title, description, and subject.
- Priority filtering is local.
- Status filtering uses the backend `/api/tasks?status=...` query parameter.
- Analytics charts use Chart.js and consume `/api/analytics/summary`.

