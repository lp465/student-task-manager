# Student Task Manager Backend

Spring Boot REST API for authentication, task management, and analytics.

## Stack

- Java 21
- Spring Boot 4.0.6
- Spring Web MVC
- Spring Data JPA
- Spring Security
- MySQL

## What it implements

- User registration
- User login with JWT access-token issuance
- Server-side refresh-token storage
- Logout route that removes stored refresh tokens
- Task CRUD for the authenticated user
- Task summary counts
- Analytics summary counts and distributions

## Package layout

- `controller` - REST endpoints
- `service` - business logic
- `repository` - JPA repositories
- `model` - entities and enums
- `dto` - request and response objects
- `security` - JWT filter and token utilities
- `config` - password encoder bean
- `exception` - centralized error handling

## Local run

```bash
cd StudentTaskManager-backend
./mvnw spring-boot:run
```

On Windows:

```powershell
cd StudentTaskManager-backend
.\mvnw.cmd spring-boot:run
```

Package and run:

```bash
./mvnw clean package
java -jar target/studenttaskmanager-0.0.1-SNAPSHOT.jar
```

## Runtime configuration

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION_MS`
- `JWT_REFRESH_EXPIRATION_MS`
- `PORT`

Defaults are defined in `src/main/resources/application.properties`.

## API endpoints

### Public

- `POST /api/users/register`
- `POST /api/users/login`

### Auth-related

- `POST /api/users/refresh`
- `POST /api/users/logout`

### Tasks

- `POST /api/tasks/create`
- `GET /api/tasks`
- `GET /api/tasks/summary`
- `PUT /api/tasks/update/{taskId}`
- `DELETE /api/tasks/delete/{taskId}`

### Analytics

- `GET /api/analytics/summary`

## Data model

- `users`
- `tasks`
- `refresh_tokens`

## Security notes

- Passwords are hashed with BCrypt.
- JWT tokens are signed with HS256.
- Task update and delete operations enforce task ownership.
- The current security configuration explicitly whitelists only register, login, and actuator routes.
- The refresh and logout routes should be reviewed before production use because they are not explicitly whitelisted in `SecurityConfig.java`.
- CORS origins are hardcoded in `SecurityConfig.java`.

## Testing

The repository includes a default Spring Boot context test in `src/test/java/.../StudentTaskManagerApplicationTests.java`.

