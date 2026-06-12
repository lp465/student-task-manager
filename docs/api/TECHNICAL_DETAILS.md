# Technical Details

## Technology stack

### Backend

- Java 21
- Spring Boot 4.0.6
- Spring Web MVC
- Spring Data JPA
- Spring Security
- MySQL
- JWT via `io.jsonwebtoken`
- BCrypt password hashing

### Frontend

- React 19
- Vite
- React Router
- Chart.js
- `react-chartjs-2`

## Database schema

### `users`

| Field | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `Long` | Primary key, identity | Generated automatically |
| `name` | `String` | Not blank, not null | Stored in `users.name` |
| `email` | `String` | Not blank, not null, unique, valid email | Used for login lookup |
| `password` | `String` | Not blank, not null | BCrypt hash, not returned in responses |

### `tasks`

| Field | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `Long` | Primary key, identity | Generated automatically |
| `taskTitle` | `String` | Not blank, not null | Required on create and update |
| `description` | `TEXT` | Nullable | Optional free text |
| `status` | `TaskStatus` enum | Not null | Stored as string, defaults to `PENDING` |
| `priority` | `TaskPriority` enum | Not null | Stored as string, defaults to `MEDIUM` |
| `dueDate` | `LocalDate` | Not null | Used in due-date chips and analytics |
| `subject` | `String` | Nullable, length 60 | Optional category label |
| `user_id` | `Long` | Foreign key to `users.id`, not null | Task owner |
| `createdAt` | `LocalDateTime` | Populated on insert | Added with `@CreationTimestamp` |
| `completedAt` | `LocalDateTime` | Nullable | Set when a task becomes completed |

### `refresh_tokens`

| Field | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `Long` | Primary key, identity | Generated automatically |
| `token` | `String` | Not null, unique | Random UUID token |
| `user_id` | `Long` | Foreign key to `users.id`, not null | One token record per user at a time |
| `expiryDate` | `Instant` | Not null | Used by the refresh endpoint |

## Entity relationships

- One `User` has many `Task` records.
- One `User` can have many `RefreshToken` records over time, but the service deletes older refresh tokens when creating a new one.
- Each `Task` belongs to exactly one `User`.
- Each `RefreshToken` belongs to exactly one `User`.

## Enumerations

- `TaskStatus` values: `PENDING`, `COMPLETED`
- `TaskPriority` values: `LOW`, `MEDIUM`, `HIGH`

## Backend modules

| Package | Responsibility |
| --- | --- |
| `controller` | REST entry points |
| `service` | Business rules and aggregation |
| `repository` | Database access through Spring Data JPA |
| `model` | JPA entities and enums |
| `dto` | Request and response payloads |
| `security` | JWT creation, validation, and request filtering |
| `config` | Password encoder bean |
| `exception` | Structured error mapping |

## Frontend modules

| File | Responsibility |
| --- | --- |
| `App.jsx` | Router and route protection |
| `context/AuthContext.jsx` | Auth state and `localStorage` persistence |
| `api/auth.js` | Register, login, refresh, logout |
| `api/tasks.js` | Task CRUD client and 401 retry logic |
| `api/analytics.js` | Analytics client and 401 retry logic |
| `pages/Landing.jsx` | Public landing page |
| `pages/Login.jsx` | Login form |
| `pages/Register.jsx` | Registration form |
| `pages/Dashboard.jsx` | Summary cards and charts |
| `pages/MyTasks.jsx` | Task management workspace |
| `components/*` | Shared UI widgets |

## API documentation

All backend responses are wrapped in `ApiResponse<T>` unless the controller explicitly returns a different structure.

### Auth endpoints

| Method | Path | Request | Response | Auth |
| --- | --- | --- | --- | --- |
| `POST` | `/api/users/register` | `RegisterRequestDTO` with `name`, `email`, `password` | `ApiResponse<UserResponseDTO>` | No |
| `POST` | `/api/users/login` | `LoginRequestDTO` with `email`, `password` | `ApiResponse<LoginResponseDTO>` with `{ token, user }` | No |
| `POST` | `/api/users/refresh` | Refresh token is read from the `refreshToken` cookie | `ApiResponse<Map<String, String>>` with a new access token | JWT security still applies in the current configuration |
| `POST` | `/api/users/logout` | Refresh token cookie | `ApiResponse<String>` | JWT security still applies in the current configuration |

### Task endpoints

| Method | Path | Request | Response | Notes |
| --- | --- | --- | --- | --- |
| `POST` | `/api/tasks/create` | `TaskRequestDTO` | `ApiResponse<TaskResponseDTO>` | Creates a task for the authenticated user |
| `GET` | `/api/tasks` | Optional `status` query param (`PENDING` or `COMPLETED`) | `ApiResponse<List<TaskResponseDTO>>` | Filters by status only |
| `GET` | `/api/tasks/summary` | None | `ApiResponse<TaskSummaryDTO>` | Returns total, completed, pending, and high-priority-pending counts |
| `PUT` | `/api/tasks/update/{taskId}` | `TaskRequestDTO` | `ApiResponse<TaskResponseDTO>` | Requires ownership of the task |
| `DELETE` | `/api/tasks/delete/{taskId}` | None | `ApiResponse<String>` | Requires ownership of the task |

### Analytics endpoint

| Method | Path | Request | Response | Notes |
| --- | --- | --- | --- | --- |
| `GET` | `/api/analytics/summary` | None | `ApiResponse<AnalyticsSummaryDTO>` | Returns completion rate, overdue tasks, due-this-week tasks, category distribution, and priority distribution |

## Request and response shapes

### `TaskRequestDTO`

```json
{
  "taskTitle": "Submit project report",
  "description": "Final MCA report draft",
  "status": "PENDING",
  "priority": "HIGH",
  "dueDate": "2026-06-20",
  "subject": "Project Work"
}
```

`status` and `priority` are optional in the request body, but the service assigns defaults when they are omitted.

### `TaskResponseDTO`

Returned task objects include:

- `id`
- `taskTitle`
- `description`
- `status`
- `dueDate`
- `subject`
- `userId`
- `userName`
- `userEmail`
- `priority`
- `createdAt`
- `completedAt`

### `TaskSummaryDTO`

- `totalCount`
- `completedCount`
- `pendingCount`
- `highPriorityCount`

### `AnalyticsSummaryDTO`

- `totalTasks`
- `completedTasks`
- `pendingTasks`
- `completionPercentage`
- `highPriorityPending`
- `overdueTasks`
- `dueThisWeek`
- `categoryDistribution`
- `priorityDistribution`

## Error handling

- `DuplicateResourceException` maps to HTTP 409.
- `ResourceNotFoundException` maps to HTTP 404.
- `BadRequestException` maps to HTTP 400.
- Validation errors from `jakarta.validation` map to HTTP 400 with a field error map.
- Unhandled exceptions map to a generic HTTP 500 response.

## Important behavioral notes

- The frontend search box filters tasks locally by title, description, and subject.
- The frontend priority filter is also local; the backend does not accept priority as a task list query parameter.
- When a task is marked completed, the service sets `completedAt`.
- When a completed task is edited, the service prevents it from being reverted to `PENDING`.
- Analytics counts categories by `subject`, using `Uncategorized` when `subject` is null or blank.

