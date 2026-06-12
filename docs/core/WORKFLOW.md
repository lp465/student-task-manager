# User Workflow

## Public entry flow

1. The user opens `/`.
2. If the user is not authenticated, the landing page is shown.
3. If the user is authenticated, the frontend redirects to `/dashboard`.

## Registration flow

1. The user opens the Register page.
2. The user enters name, email, and password.
3. The frontend sends `POST /api/users/register`.
4. The backend validates the payload, hashes the password with BCrypt, and saves the user.
5. The frontend redirects to the Login page.

## Login flow

1. The user opens the Login page.
2. The user enters email and password.
3. The frontend sends `POST /api/users/login`.
4. The backend checks the password, generates a JWT access token, and creates a refresh-token record.
5. The response body contains `{ token, user }`.
6. The login response also sets an HttpOnly `refreshToken` cookie.
7. The frontend stores the auth payload in `localStorage` and navigates to `/dashboard`.

## Session handling flow

1. Authenticated requests attach the access token as a Bearer token.
2. If the frontend receives a `401`, the API wrapper tries `POST /api/users/refresh` once.
3. If refresh succeeds, the wrapper stores the new access token and retries the original request.
4. If refresh fails, the frontend clears local auth state and redirects to `/login`.

This is the intended client flow. The current backend security configuration should be reviewed because only register, login, and actuator routes are explicitly whitelisted.

## Dashboard flow

1. The dashboard loads the authenticated user from context.
2. The frontend requests the task list from `/api/tasks`.
3. The frontend requests task summary data from `/api/tasks/summary`.
4. The frontend requests analytics data from `/api/analytics/summary`.
5. The dashboard renders summary cards, an insight message, upcoming deadlines, and Chart.js charts.

## Task creation flow

1. The user fills in task title, description, subject, due date, and priority.
2. The form submits `POST /api/tasks/create`.
3. The backend assigns the authenticated user as owner.
4. The backend defaults the task to `PENDING` when no status is supplied.
5. The frontend reloads the task list and summary cards.

## Task editing flow

1. The user clicks Edit on a task card.
2. `MyTasks.jsx` copies the task values into the form state.
3. The user changes the values and submits the form.
4. The frontend sends `PUT /api/tasks/update/{taskId}`.
5. The backend checks that the task belongs to the authenticated user.
6. If the task was previously completed, the backend rejects a change back to `PENDING`.
7. The frontend refreshes the task list and summary cards.

## Task completion flow

1. The user clicks Complete on a pending task.
2. The frontend asks for confirmation.
3. The frontend sends an update request with `status: COMPLETED`.
4. The backend stores the completed status and sets `completedAt`.
5. The dashboard summary and analytics update after the refresh.

## Task deletion flow

1. The user clicks Delete on a task card.
2. The frontend asks for confirmation.
3. The frontend sends `DELETE /api/tasks/delete/{taskId}`.
4. The backend checks ownership and removes the task.
5. The frontend reloads the list.

## Filtering and search flow

1. The user filters by status using the pending/completed buttons.
2. The user filters by priority using the low/medium/high buttons.
3. The user searches by title, description, or subject in the search box.
4. The frontend combines those filters locally before rendering the task cards.

Only the status filter is supported by the backend query parameter on `GET /api/tasks`.

## Analytics flow

1. The dashboard fetches analytics from `/api/analytics/summary`.
2. The backend counts completed, pending, high-priority-pending, overdue, and due-this-week tasks.
3. The backend also groups tasks by `subject` and priority.
4. The frontend renders completion, priority, category, and deadline visualizations.

## Logout flow

1. The user clicks Logout from the sidebar.
2. The frontend sends `POST /api/users/logout`.
3. The frontend clears local auth state and shows a logout message on the Login page.
4. The refresh cookie is cleared by the backend response when the route is reachable.

