# Deployment Viva Card — Quick Reference

Purpose: single-page checklist for viva/demo to prove deployment readiness.

Pre-deploy checks (yes/no)

- Backend builds: `./mvnw clean package` ✅
- Frontend builds: `pnpm build` ✅
- `.env.example` present ✅
- No secrets committed (check `.gitignore`) ✅
- CORS configured for production origin ✅

Essential env vars (show these in viva)

- `JWT_SECRET=your_jwt_secret`
- `JWT_EXPIRATION_MS=3600000`
- `JWT_REFRESH_EXPIRATION_MS=604800000`
- `SPRING_DATASOURCE_URL=jdbc:mysql://...`
- `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD`
- `frontend.production.origin=https://your-frontend.vercel.app`
- `VITE_API_BASE_URL=https://your-backend-url/api`

Key commands to run live (copy/paste)

- Backend build: `cd StudentTaskManager-backend && ./mvnw clean package`
- Run backend (jar): `java -jar target/studenttaskmanager-0.0.1-SNAPSHOT.jar --server.port=8081`
- Frontend build: `cd Studenttaskmanager-frontend && pnpm build`

Quick verification steps (1–2 minutes)

1. Open frontend URL and attempt register/login.
2. In browser devtools → Network: confirm requests go to backend and login response contains `Set-Cookie: refreshToken=...; HttpOnly; SameSite=None; Secure`.
3. Verify `Access-Control-Allow-Origin` equals your frontend origin and `Access-Control-Allow-Credentials: true`.
4. Run smoke script (if available) or perform a manual sequence: register → login → create task → refresh → logout.

Troubleshoot cheat-sheet

- If refresh fails: check cookie present and backend DB has refresh token record.
- If CORS error: ensure `frontend.production.origin` matches frontend domain; do not use `*` when cookies are used.
- If backend unreachable: verify `VITE_API_BASE_URL` and platform firewall/DNS settings.

Presentation tip

- Mention security: JWT short-lived, refresh stored server-side and set as HttpOnly cookie, secrets injected via env (not committed).
