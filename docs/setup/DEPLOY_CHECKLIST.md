# Deployment Checklist

## Build checks

- Backend builds with `./mvnw clean package`
- Frontend builds with `pnpm build`
- No Markdown file claims `.env.example` exists unless it has actually been added
- No secrets are committed to the repository

## Backend configuration checks

- `SPRING_DATASOURCE_URL` points to a reachable MySQL instance
- `SPRING_DATASOURCE_USERNAME` is valid
- `SPRING_DATASOURCE_PASSWORD` is valid
- `JWT_SECRET` is set to a strong secret
- `JWT_EXPIRATION_MS` is set if custom access-token timing is needed
- `JWT_REFRESH_EXPIRATION_MS` is set if custom refresh-token timing is needed
- `PORT` is set only if the host requires a specific runtime port

## Frontend configuration checks

- `VITE_API_BASE_URL` points to the deployed backend API root
- The frontend build completes without runtime environment errors
- SPA route fallback is configured on the static host

## Security and routing checks

- The frontend origin matches one of the origins hardcoded in `SecurityConfig.java`
- CORS allows credentials when the frontend needs the refresh cookie
- The refresh and logout routes are reviewed because the current security configuration does not explicitly whitelist them
- Login responses set the `refreshToken` cookie as expected

## Functional verification checks

- Register a user
- Log in with the new user
- Load `/api/tasks` with a Bearer token
- Create a task
- Update a task
- Mark a task complete
- Delete a task
- Load `/api/tasks/summary`
- Load `/api/analytics/summary`

## Final sign-off

- Confirm the backend logs show a clean startup
- Confirm the frontend opens the dashboard after login
- Confirm task filtering and search still work after deployment

