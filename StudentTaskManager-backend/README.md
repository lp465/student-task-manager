# Student Task Manager — Backend

Spring Boot REST API for authentication, task management, and analytics.

Tech stack

- Java 21, Spring Boot, Spring Data JPA, MySQL, Maven

Quick start (local)

```bash
cd StudentTaskManager-backend
./mvnw clean package
java -jar target/studenttaskmanager-0.0.1-SNAPSHOT.jar --server.port=8081
```

Or run with Maven during development:

```bash
cd StudentTaskManager-backend
./mvnw spring-boot:run
```

Configuration (important env vars)

- `SPRING_DATASOURCE_URL` — JDBC URL (default: `jdbc:mysql://localhost:3306/StudentTaskManagement`)
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `SERVER_PORT` — backend port (default 8080)
- `JWT_SECRET` — signing secret for access tokens (set in production)
- `JWT_EXPIRATION_MS` — access token lifetime in ms
- `JWT_REFRESH_EXPIRATION_MS` — refresh token lifetime in ms
- `frontend.origins` — comma-separated dev origins (default includes localhost ports)
- `frontend.production.origin` — set to your deployed frontend origin (e.g., `https://your-app.vercel.app`) for strict CORS in production

Security and auth notes

- Access tokens are JWTs returned by `/api/users/login` (also in login response body).
- Refresh tokens are persisted server-side and set as an HttpOnly cookie named `refreshToken`. The client should call `POST /api/users/refresh` (sending the cookie) to receive a new access token.

API highlights

- `POST /api/users/register` — register
- `POST /api/users/login` — login (returns access token + sets refresh cookie)
- `POST /api/users/refresh` — exchange refresh cookie for new access token
- `POST /api/users/logout` — clears refresh token server-side and cookie
- `POST /api/tasks/create` — create task (authenticated)
- `GET /api/tasks` — list tasks for authenticated user
- `GET /api/analytics/summary` — analytics for authenticated user

Deployment tips (Railway)

- Configure the above env vars in Railway. Use `SERVER_PORT` provided by Railway or let app pick default.
- Ensure `JWT_SECRET` is strong and never committed to git.

Testing

- Unit/integration tests can be run with `./mvnw test`.

Notes

- Do not commit secrets. Use environment variables or secret stores provided by your hosting platform.
