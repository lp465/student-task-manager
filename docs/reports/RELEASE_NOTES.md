# Archived: RELEASE_NOTES.md (moved on 2026-06-10)

Original content preserved below.

# Release Notes

## Student Task Manager v1.0.1

### Release Date

- 2026-05-28

### Summary

Incremental UI/UX polish and minor persisted data additions to improve usability for students without changing existing API flows.

### Highlights

- Landing page added at `/` with clear primary CTAs (Login / Create account).
- Application layout (`AppLayout`) and `Sidebar` introduced for consistent navigation across authenticated routes.
- Dashboard reflow and overview components: `TaskStats`, `UpcomingDeadlines`, and a compact insight card.
- Task card enhancements: due-date chips (overdue / today / soon / later), consolidated badges for priority and subject.
- CSS tokens and style refactor for consistent theming and easier maintenance.
- Added optional `subject` field persisted with tasks (backward compatible).

### Impact

- No breaking API changes. Frontend and backend remain compatible with existing endpoints.

## Student Task Manager v1.0

### Release Date

- 2026-06-18

### Summary

This release delivers a full-stack Student Task Management System with user authentication, task CRUD operations, filtering, priority handling, analytics, and responsive UI.

### Features

- User registration and login
- Secure password hashing
- Task creation, editing, completion, and deletion
- Status filtering: All, Pending, Completed
- Priority filtering: All, Low, Medium, High
- Search by task title and description
- Dashboard analytics for completed, pending, and high-priority pending tasks
- Mobile-first responsive frontend design
- Environment-based production configuration

### Fixes

- Corrected high-priority count to show only pending tasks
- Improved task filter layout for desktop and mobile
- Fixed dashboard data synchronization after task operations
- Added backend exception logging for easier debugging

### Known Issues

- No dedicated JWT-based auth token management in current release
- No automated frontend end-to-end tests included yet

### Future Planned Features

- Add JWT token security and refresh tokens
- Add task categories, labels, or deadlines reminders
- Add automated UI test coverage
- Add user profile and settings pages
