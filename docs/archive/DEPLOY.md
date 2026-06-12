# Deployment Quick Start

## Backend

```bash
cd StudentTaskManager-backend
./mvnw clean package
java -jar target/studenttaskmanager-0.0.1-SNAPSHOT.jar
```

Set these environment variables before starting the backend:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`
- `PORT`

## Frontend

```bash
cd Studenttaskmanager-frontend
pnpm install
pnpm build
pnpm dev
```

Set `VITE_API_BASE_URL` to the backend API root, for example `http://localhost:8080/api`.

## Notes

- The frontend uses client-side routing and includes a Netlify `_redirects` file for SPA fallback.
- If you deploy the frontend on a different domain than the one already listed in `SecurityConfig.java`, update the CORS origin list in the backend code.

