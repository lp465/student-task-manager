# Deployment Guide

This file contains concise deployment steps for the frontend (Vercel) and backend (Railway / Render / similar).

Backend (Railway / Render)

1. Build the Spring Boot JAR

```bash
cd StudentTaskManager-backend
./mvnw clean package
# the packaged jar will be in target/
```

2. Configure environment variables on the host (Railway / Render):

- `JWT_SECRET` — a strong secret (required)
- `JWT_EXPIRATION_MS` — access token lifetime (ms)
- `JWT_REFRESH_EXPIRATION_MS` — refresh token lifetime (ms)
- `SPRING_DATASOURCE_URL` or `DB_URL` — JDBC URL
- `SPRING_DATASOURCE_USERNAME` or `DB_USERNAME`
- `SPRING_DATASOURCE_PASSWORD` or `DB_PASSWORD`
- `frontend.production.origin` — your frontend origin (e.g. `https://your-app.vercel.app`) to restrict CORS
- `SERVER_PORT` — if the platform provides a port, prefer platform settings

3. Run (or let platform run) the jar

```bash
java -jar target/studenttaskmanager-0.0.1-SNAPSHOT.jar --server.port=8081
```

Notes for Railway/Render

- Use the platform's recommended deployment method (Railway: connect repo + set build command and envs; Render: create a service and set envs).
- Ensure the database is accessible from the platform (set firewall rules or use the platform-managed DB).

Frontend (Vercel)

1. Configure project

- Framework: Vite (React)
- Build command: `pnpm build`
- Output directory: `dist`

2. Add environment variable in Vercel project settings:

- `VITE_API_BASE_URL` — set to `https://your-backend-url/api`

3. Deploy

- Push the frontend repo/branch to Vercel (via Git integration) and Vercel will run the build.

Important deployment notes

- CORS: backend must allow the frontend origin. In production, set `frontend.production.origin` to your Vercel domain so CORS is strict.
- Cookies: refresh cookie is `HttpOnly`. For cross-site cookies in production, use:
  - `SameSite=None` and `Secure=true` (only over HTTPS)

  - Ensure the backend sets the cookie `Secure` flag when `frontend.production.origin` uses HTTPS.

- Public URL: backend must be reachable from the browser (Vercel frontend will call the backend URL). Verify DNS and firewall settings.

Optional: health checks and monitoring

- Add a basic health endpoint (e.g., `/actuator/health` or `/api/health`) and configure the platform health check.
- Configure logging and error reporting (e.g., external logs or platform-provided logs) to monitor refresh/login flows.
