# Release Notes Snapshot

This file records the current implemented feature set rather than a historical versioned release train.

## Implemented features

- React landing page, login page, register page, dashboard, and task workspace
- Sidebar navigation for authenticated users
- JWT login with token persistence in the frontend
- Server-side refresh-token storage
- Task creation, editing, completion, and deletion
- Status filtering by backend query parameter
- Priority filtering and text search in the frontend
- Dashboard task counters
- Upcoming deadline highlights
- Chart.js analytics for completion, priority, category, and deadline status
- Optional subject field on tasks

## Behavioral notes

- Task updates and deletes are ownership-checked.
- Completed tasks cannot be reverted to pending in the current service logic.
- The backend currently hardcodes allowed CORS origins in `SecurityConfig.java`.
- The refresh and logout routes should be reviewed against the current security rules before production deployment.

