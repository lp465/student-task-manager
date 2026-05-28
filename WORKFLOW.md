# User Workflow

## Registration

1. User opens the Register page.
2. User enters name, email, and password.
3. Frontend sends `POST /api/users/register`.
4. Backend validates input and creates the user.
5. User is redirected to login.

## Login

1. User opens the Login page.
2. User enters email and password.
3. Frontend sends `POST /api/users/login`.
4. Backend validates credentials and returns user data.
5. User data is stored in localStorage and React context.
6. User is redirected to the dashboard.

## Dashboard

1. Dashboard requests tasks and summary using the authenticated user ID.
2. Backend returns task list and dashboard analytics.
3. Frontend renders tasks, filter controls, and metric cards.

## Task Creation

1. User fills task title, description, due date, and priority.
2. Frontend sends `POST /api/tasks/create/{userId}`.
3. Backend creates the task with `PENDING` status.
4. Dashboard reloads tasks and statistics.

## Task Editing

1. User clicks Edit on a task card.
2. Form pre-fills with existing task values.
3. User updates details and submits.
4. Frontend sends `PUT /api/tasks/update/{taskId}?userId={userId}`.
5. Backend updates the task.
6. Dashboard refreshes task list and summary.

## Completing a Task

1. User clicks Complete on a pending task.
2. Frontend confirms the action.
3. Task status is updated to `COMPLETED`.
4. Dashboard summary and task list reflect the completed status.

## Filtering and Search

- Status filter toggles between All, Pending, and Completed.
- Priority filter toggles between All, Low, Medium, and High.
- Search input filters tasks by title or description.
- Combined filters and search work together to refine results.
