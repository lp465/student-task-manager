# Project Setup

## Prerequisites

- Java 21
- Maven
- Node.js and npm
- MySQL

## Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd StudentTaskManager-backend
   ```
2. Configure MySQL connection in environment variables or use defaults in `src/main/resources/application.properties`.
3. Start the backend:
   ```bash
   ./mvnw spring-boot:run
   ```
4. The backend runs on `http://localhost:8080` by default.

## Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd Studenttaskmanager-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```
4. The frontend runs on `http://localhost:5173` by default.

## Production Build

### Backend

```bash
cd StudentTaskManager-backend
./mvnw clean package
```

### Frontend

```bash
cd Studenttaskmanager-frontend
npm run build
```

## Environment Variables

### Backend

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `SERVER_PORT`

### Frontend

- `VITE_API_BASE_URL`

## Database Setup

Create the schema in MySQL:

```sql
CREATE DATABASE StudentTaskManagement;
```

The application uses `spring.jpa.hibernate.ddl-auto=update` by default to manage schema updates.
