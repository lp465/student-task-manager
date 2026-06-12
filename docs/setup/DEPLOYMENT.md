# Deployment Guide

## Quick start

```bash
cd StudentTaskManager-backend
./mvnw clean package
java -jar target/studenttaskmanager-0.0.1-SNAPSHOT.jar
```

```bash
cd Studenttaskmanager-frontend
pnpm install
pnpm build
```

## What this repository currently supports

- Backend: Spring Boot application packaged with Maven
- Frontend: Vite React app
- Database: MySQL
- Static hosting: Netlify-style SPA fallback via `Studenttaskmanager-frontend/public/_redirects`

## Backend deployment

### Prerequisites

- Java 21
- MySQL 8 or compatible
- A valid `JWT_SECRET`

### Backend runtime configuration

The backend reads these values from environment variables:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION_MS`
- `JWT_REFRESH_EXPIRATION_MS`
- `PORT`

If a value is not supplied, the defaults from `application.properties` are used.

### Local or server run

```bash
cd StudentTaskManager-backend
./mvnw spring-boot:run
```

Package and run:

```bash
cd StudentTaskManager-backend
./mvnw clean package
java -jar target/studenttaskmanager-0.0.1-SNAPSHOT.jar
```

On Windows:

```powershell
cd StudentTaskManager-backend
.\mvnw.cmd spring-boot:run
```

## Frontend deployment

### Prerequisites

- Node.js 20+ or a compatible Node version
- pnpm or npm

### Frontend runtime configuration

- `VITE_API_BASE_URL` should point to the backend API root, for example `https://your-backend.example.com/api`

### Local or server run

```bash
cd Studenttaskmanager-frontend
pnpm install
pnpm dev
```

Production build:

```bash
pnpm build
```

## Production hosting notes

- The frontend repository already includes a Netlify redirect file for SPA routing.
- If you deploy to a different static host, make sure it rewrites unknown routes to `index.html`.
- The backend CORS origin list is hardcoded in `SecurityConfig.java`. If your frontend origin changes, update that file before release.
- The current login flow creates an HttpOnly refresh cookie, but the code does not set `Secure` or `SameSite`. That should be reviewed if the frontend and backend are served from different origins over HTTPS.
- The current security rules only explicitly permit register, login, and actuator routes. Review the refresh and logout routes before production use.

## Recommended deployment order

1. Provision MySQL.
2. Deploy the backend with the database and JWT settings.
3. Confirm the backend responds on its public URL.
4. Set `VITE_API_BASE_URL` in the frontend build environment.
5. Deploy the frontend.
6. Update `SecurityConfig.java` if the frontend origin changes from the one already listed in the code.
