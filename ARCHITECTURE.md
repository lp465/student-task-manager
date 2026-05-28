# Architecture Overview

## System Overview

The Student Task Management System is a full-stack application with a Java Spring Boot backend and a React frontend.

## Backend Architecture

- **Controller layer**: handles REST API requests for authentication and tasks.
- **Service layer**: contains business logic for user and task operations.
- **Repository layer**: interacts with the database using Spring Data JPA.
- **DTOs**: transfer request and response payloads between frontend and backend.
- **Database**: MySQL stores users and tasks.

## Frontend Architecture

- **Pages**: user-facing routes such as `Login`, `Register`, and `Dashboard`.
- **Components**: reusable UI blocks like `TaskForm`, `TaskCard`, `TaskFilters`, and `TaskStats`.
- **Context**: `AuthContext` stores authenticated user details and session persistence.
- **API clients**: `auth.js` and `tasks.js` wrap backend API calls.

## Data Flow

1. User signs in or registers via the frontend form.
2. Frontend sends auth requests to backend `/api/users` endpoints.
3. Backend validates credentials and responds with user data.
4. Dashboard loads tasks and summary data from `/api/tasks` endpoints.
5. Frontend applies filters and renders task cards.
6. Task actions (create, update, delete) refresh the task list and summary.

## Authentication Flow

- User registers with name, email, and password.
- Password is stored as a BCrypt hash in the database.
- User logs in with email and password.
- Authenticated user data is stored in localStorage and React context.

## Component Hierarchy

- `App.jsx`
  - `AuthProvider`
  - `Routes`
    - `Register`
    - `Login`
    - `Dashboard`
      - `TaskStats`
      - `TaskForm`
      - `TaskFilters`
      - `TaskCard`

## API Flow

- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/tasks/user/{userId}`
- `GET /api/tasks/user/{userId}/summary`
- `POST /api/tasks/create/{userId}`
- `PUT /api/tasks/update/{taskId}`
- `DELETE /api/tasks/delete/{taskId}`
