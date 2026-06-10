# Deployment Checklist

This checklist collects the exact steps and env vars needed to deploy the project and verify readiness.

1. Pre-deployment checklist

- Backend builds successfully: `cd StudentTaskManager-backend && ./mvnw clean package` (or `./mvnw clean install`)
- Frontend builds successfully: `cd Studenttaskmanager-frontend && pnpm build`
- `.env.example` present and complete
- No secrets committed to the repository (check `git status` for `.env` or secret files)
- CORS configured: backend lets your frontend origin (set `frontend.production.origin`)

2. Backend deployment (Railway / Render / similar)

Environment variables (examples)

- `JWT_SECRET=your_jwt_secret`
- `DB_URL=jdbc:mysql://...` or `SPRING_DATASOURCE_URL=jdbc:mysql://...`
- `DB_USERNAME=your_username` or `SPRING_DATASOURCE_USERNAME`
- `DB_PASSWORD=your_password` or `SPRING_DATASOURCE_PASSWORD`
- `JWT_EXPIRATION_MS=3600000`
- `JWT_REFRESH_EXPIRATION_MS=604800000`
- `frontend.production.origin=https://your-frontend.vercel.app`

Steps

- Connect the backend repo to the platform (or upload the repo).
- Set build command: `./mvnw clean package` (or `mvn clean install`).
- Set runtime/start command: `java -jar target/studenttaskmanager-0.0.1-SNAPSHOT.jar` (platforms often detect this automatically).
- Configure the environment variables above in the platform UI.
- Ensure the platform's network/DB settings allow connections from the backend.

Quick run commands (if running manually on a VM):

```bash
./mvnw clean package
java -jar target/studenttaskmanager-0.0.1-SNAPSHOT.jar --server.port=8081
```

3. Frontend deployment (Vercel)

Environment variables

- `VITE_API_BASE_URL=https://your-backend-url/api`

Steps

- Import the frontend project into Vercel (Git integration).
- Framework: Vite (React). Build command: `pnpm build`.
- Output directory: `dist`.
- Set the `VITE_API_BASE_URL` env var in Vercel project settings.
- Deploy (Vercel will run the build and publish the site).

4. Post-deploy verification

- Open frontend URL and attempt to register/login; check browser devtools network tab for requests to backend.
- Verify backend responses include CORS headers: `Access-Control-Allow-Origin` (should be your Vercel origin) and `Access-Control-Allow-Credentials: true`.
- Check that `Set-Cookie: refreshToken=...; HttpOnly; Path=/; SameSite=None; Secure` is present on login responses (production over HTTPS).
- Run the smoke checks (register, login, create task, refresh token, logout) against deployed URLs.

5. Important production notes & troubleshooting

- CORS: use `frontend.production.origin` to lock allowed origins. Avoid `*` when cookies/credentials are used.
- Cookies: for cross-site cookie usage, ensure `SameSite=None` and `Secure=true` (HTTPS required).
- If refresh fails:
  - Confirm cookie is present in browser (devtools → Application → Cookies).
  - Confirm backend `refresh` endpoint reads cookie and that DB contains the refresh token record.
- If frontend cannot reach backend: check that backend is publicly reachable (DNS), and the `VITE_API_BASE_URL` is correct.
- Logs: check platform logs for authentication/refresh errors (stack traces, DB connection errors).

6. Minimal health check endpoints to enable on the backend

- `GET /actuator/health` (Spring actuator) or `GET /api/health` — use platform health checks pointing to this URL.

7. Final submission checklist

- All build steps green locally and on CI
- `.env.example` present and accurate
- No secrets committed
- README, DEPLOY.md, DEPLOY_CHECKLIST.md present and linkable in project root
