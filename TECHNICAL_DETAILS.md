# Technical Details

## Database Schema

### Tables

- `users`
  - `id` (PK)
  - `name`
  - `email`
  - `password`

- `tasks`
  - `id` (PK)
  - `task_title`
  - `description`
  - `status`
  - `priority`
  - `due_date`
  - `user_id` (FK -> users.id)

### Relationships

- One `User` can have many `Task` records.
- Each `Task` belongs to one `User`.

## Entity and Class Structure

### Backend

- `TaskController` — REST endpoints for task operations
- `UserController` — REST endpoints for authentication
- `TaskService` — task business logic and validation
- `UserService` — registration and login logic
- `TaskRepository` — JPA repository for task queries
- `UserRepository` — JPA repository for user operations
- `GlobalExceptionHandler` — unified API error responses

### Frontend

- `App.jsx` — routing and top-level app provider
- `AuthContext.jsx` — stores auth state and localStorage persistence
- `Login.jsx` / `Register.jsx` — user auth pages
- `Dashboard.jsx` — main workspace with tasks, filters, and summary
- `TaskForm.jsx` — create/update task form
- `TaskFilters.jsx` — status and priority filtering controls
- `TaskStats.jsx` — dashboard analytics cards
- `TaskCard.jsx` — task display and action buttons

## API Request / Response Examples

### Register

Request:

```http
POST /api/users/register
Content-Type: application/json

{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "Password123"
}
```

Response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com"
  }
}
```

### Login

Request:

```http
POST /api/users/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "Password123"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com"
  }
}
```

### Get Tasks

Request:

```http
GET /api/tasks/user/1
```

Response:

```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "id": 1,
      "taskTitle": "Study math",
      "description": "Complete chapter 7",
      "status": "PENDING",
      "priority": "HIGH",
      "dueDate": "2026-06-15",
      "userId": 1,
      "userName": "Alice",
      "userEmail": "alice@example.com"
    }
  ]
}
```

## Frontend State Management

- Auth state is held in `AuthContext`.
- Task list state is stored in `Dashboard.jsx`.
- Filters and search are maintained with React state.
- API calls are encapsulated in `src/api/auth.js` and `src/api/tasks.js`.

## Performance Notes

- The frontend bundle is optimized by Vite for production.
- The backend uses Spring Data JPA with query methods for efficient data access.
- `spring.jpa.open-in-view=false` prevents unnecessary session use.

## Frontend/UX technical notes (v1.0.1)

- `AppLayout` and `Sidebar` were added to provide a consistent navigation shell for authenticated pages. `Landing.jsx` now serves the root route. Styling was refactored to centralize tokens in `src/index.css` (colors, radii, shadows, spacing) to simplify theming and reduce duplicated rules.
