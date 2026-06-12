# Deployment Viva Card

## One-line project summary

Student Task Manager is a React, Spring Boot, and MySQL web app for student task tracking with JWT login, task CRUD, and productivity analytics.

## Stack

- Frontend: React + Vite
- Backend: Spring Boot 4
- Database: MySQL
- Auth: JWT access token plus server-stored refresh token
- Charts: Chart.js

## Core modules to mention

- `UserController`, `TaskController`, `AnalyticsController`
- `UserService`, `TaskService`, `AnalyticsService`, `RefreshTokenService`
- `AuthContext`, `Dashboard`, `MyTasks`, `TaskForm`, `TaskCard`, `AnalyticsCharts`

## Database tables

- `users`
- `tasks`
- `refresh_tokens`

## Key endpoints

- `POST /api/users/register`
- `POST /api/users/login`
- `POST /api/users/refresh`
- `POST /api/users/logout`
- `POST /api/tasks/create`
- `GET /api/tasks`
- `GET /api/tasks/summary`
- `PUT /api/tasks/update/{taskId}`
- `DELETE /api/tasks/delete/{taskId}`
- `GET /api/analytics/summary`

## Demo flow

1. Register a user.
2. Log in.
3. Show the dashboard.
4. Create a task.
5. Show status and priority filters.
6. Mark a task as completed.
7. Show analytics charts and upcoming deadlines.
8. Edit or delete a task.

## Environment variables

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION_MS`
- `JWT_REFRESH_EXPIRATION_MS`
- `PORT`
- `VITE_API_BASE_URL`

## Important caveat

The current code creates a refresh-token cookie, but the refresh and logout routes are not explicitly whitelisted in the Spring Security configuration. Mention that accurately if asked about production readiness.

