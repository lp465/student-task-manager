# Student Task Manager Frontend

This React + Vite frontend is the presentation layer for the Student Task Management System.

## Features

- User authentication and protected dashboard
- Add, edit, complete, and delete tasks
- Search tasks by title or description
- Filter tasks by status and priority
- Dashboard summary cards for completed, pending, and high-priority pending counts
- Fully responsive, mobile-first design
- Environment-based backend API configuration

## Tech Stack

- React
- Vite
- React Router
- Context API
- ESLint

## Run Locally

```bash
cd Studenttaskmanager-frontend
npm install
npm run dev
```

Open `http://localhost:5173` after the server starts.

## Build for Production

```bash
npm run build
```

## Environment Variables

Create a `.env` file in `Studenttaskmanager-frontend/` if you need a custom backend URL.

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Key Files

- `src/pages/Dashboard.jsx` — main dashboard, task list, filters, summary
- `src/components/TaskForm.jsx` — task create/edit form
- `src/components/TaskFilters.jsx` — status and priority filters
- `src/components/TaskStats.jsx` — dashboard metrics
- `src/components/TaskCard.jsx` — individual task display controls
- `src/api/auth.js` — auth API client
- `src/api/tasks.js` — task API client
- `src/context/AuthContext.jsx` — auth state and localStorage persistence

## Notes

This frontend connects to the backend API using `VITE_API_BASE_URL` and expects the backend to expose auth and task routes under `/api/users` and `/api/tasks`.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
