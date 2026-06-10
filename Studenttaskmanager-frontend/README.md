# Student Task Manager — Frontend

React + Vite frontend for the Student Task Manager application.

Key highlights

- Authentication (works with backend JWT + refresh cookie)
- Task CRUD, filtering, search, and dashboard analytics
- Responsive, mobile-first UI built with Vite and React

Tech stack

- React
- Vite (dev server)
- React Router
- Context API

Run locally (this project uses `pnpm`):

```bash
cd Studenttaskmanager-frontend
pnpm install
pnpm dev
```

Default dev port: `5175` (Vite may pick an adjacent port if 5175 is busy). The app reads `VITE_API_BASE_URL` to contact the backend API.

Build for production:

```bash
pnpm build
```

Environment variables

- `VITE_API_BASE_URL` — base URL for backend APIs (example: `http://localhost:8081/api`).

Key files

- `src/pages/Dashboard.jsx` — dashboard and analytics
- `src/components/TaskForm.jsx` — task create/edit UI
- `src/api/auth.js` — authentication client (login, refresh, logout)
- `src/context/AuthContext.jsx` — auth state and localStorage persistence

Notes for deployment

- Vercel works well for static/frontend deployment. Point `VITE_API_BASE_URL` to your backend URL in Vercel environment variables.
- Do not commit client-side secrets to Git. Only store non-sensitive runtime endpoints in env.

Smoke tests

- There is a PowerShell smoke script (`temp-smoke.ps1`) at repo root that exercises register/login/create-task/refresh/logout flows against the backend. Run it from the repo root after starting the backend.

Compatibility

- The frontend expects the backend to expose `/api/users` and `/api/tasks` endpoints. The `subject` field in tasks is optional and backward compatible.

If you want, I can add a short `deploy-vercel.md` with step-by-step instructions for production deployment.
