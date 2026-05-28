# Deployment Guide

## Prerequisites

- Java 21 installed on the server
- Node.js and npm installed for frontend build
- MySQL available on the target environment
- Optional: reverse proxy (Nginx) for serving frontend and routing API requests

## Backend Deployment

### Build the JAR

```bash
cd StudentTaskManager-backend
./mvnw clean package
```

### Run the backend

```bash
java -jar target/studenttaskmanager-0.0.1-SNAPSHOT.jar
```

### Environment Variables

Set these before starting the backend:

```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://<host>:<port>/<database>
export SPRING_DATASOURCE_USERNAME=<username>
export SPRING_DATASOURCE_PASSWORD=<password>
export SERVER_PORT=8080
```

### Notes

- Use `SERVER_PORT` to change the listen port.
- The backend exposes `/api/users` and `/api/tasks`.

## Frontend Deployment

### Build the frontend

```bash
cd Studenttaskmanager-frontend
npm install
npm run build
```

### Serve static files

- Copy the `dist/` folder to your static host or web server.
- Configure the web server to serve `index.html` and assets.

### Frontend environment

If the backend is hosted separately, set:

```env
VITE_API_BASE_URL=https://your-backend-host/api
```

## Recommended Hosting Options

- Backend: AWS EC2, Heroku, Azure App Service, or any JVM-compatible host
- Frontend: Netlify, Vercel, GitHub Pages, or any static hosting provider

## Troubleshooting

- `502` or `404` errors: verify backend URL and API proxy settings
- CORS issues: ensure backend `@CrossOrigin(origins = "*")` is enabled or configure a specific origin
- Database connection issues: verify MySQL endpoint, credentials, and schema access
- Build issues: run `npm run build` and check Vite output

## UI/UX deployment notes

- The v1.0.1 frontend improvements (landing page, `AppLayout` + `Sidebar`, dashboard polish) are included in the standard frontend build and require no special deployment steps. Build with `npm run build` and deploy `dist/` as before. Backend changes are limited to an optional `subject` field which is backward compatible with existing data.
