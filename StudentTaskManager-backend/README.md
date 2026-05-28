# Student Task Manager Backend

This Spring Boot backend provides REST APIs for user authentication and task management.

## Features

- User registration and login
- BCrypt password hashing
- CRUD operations for tasks
- Task filtering by status and priority
- Task summary analytics
- Environment-based database and server configuration

## Tech Stack

- Java 21
- Spring Boot
- Spring Data JPA
- MySQL
- Hibernate
- Maven

## Getting Started

### Prerequisites

- Java 21
- Maven
- MySQL database

### Run Locally

```bash
cd StudentTaskManager-backend
./mvnw spring-boot:run
```

### Build

```bash
cd StudentTaskManager-backend
./mvnw clean package
```

### Test

```bash
cd StudentTaskManager-backend
./mvnw test
```

## Configuration

The backend reads configuration values from environment variables:

- `SPRING_DATASOURCE_URL` (default: `jdbc:mysql://localhost:3306/StudentTaskManagement`)
- `SPRING_DATASOURCE_USERNAME` (default: `root`)
- `SPRING_DATASOURCE_PASSWORD` (default: `mysql`)
- `SERVER_PORT` (default: `8080`)

## API Endpoints

### User Auth

- `POST /api/users/register` — register a new user
- `POST /api/users/login` — login existing user

### Tasks

- `GET /api/tasks/user/{userId}` — get tasks for user
- `GET /api/tasks/user/{userId}?status={status}` — filter tasks by status
- `GET /api/tasks/user/{userId}/summary` — get dashboard summary
- `POST /api/tasks/create/{userId}` — create a task
- `PUT /api/tasks/update/{taskId}?userId={userId}` — update a task
- `DELETE /api/tasks/delete/{taskId}?userId={userId}` — delete a task

## Recent backend notes (compatibility)

- An optional `subject` field has been added to the `Task` model and DTOs to support frontend category/subject tags. This field is optional and defaults to empty/null for existing tasks so there are no migration steps required for current data.
- No routes or request signatures were removed; the backend remains backward compatible with existing frontend clients.
