# Archived: Demo Guide (moved on 2026-06-10)

Original content preserved below.

## Demo Guide

## Demo Flow

1. Open the application in the browser.
2. Register a new user.
3. Login with the registered credentials.
4. Show the dashboard with task summary cards.
5. Create a new task with title, description, due date, and high priority.
6. Demonstrate search by task title.
7. Use status filters to show all, pending, and completed tasks.
8. Use priority filters to show low, medium, and high tasks.
9. Mark a task as completed and show analytics update.

### Demo notes for v1.0.1 UI/UX

- When demonstrating the app, open `/` first to show the landing page CTAs. After login, point out the persistent `Sidebar` and how the dashboard overview (`TaskStats`, `UpcomingDeadlines`) surfaces urgent tasks. Show the optional `subject` field on the Task form and the due-date chips on task cards.

10. Edit an existing task and save changes.

- Mobile-first UI with responsive dashboard layout.
- Environment-based API configuration for deployment.
- Clean separation between frontend and backend.

## Time Estimates

- Registration/Login demo: 2 minutes
- Dashboard overview: 2 minutes
- Task creation and filtering demo: 4 minutes
- Task completion and analytics update: 2 minutes
- Final summary and deployment notes: 2 minutes

## Anticipated Questions

- **How is data stored?** In MySQL using Spring Data JPA.
- **How is authentication handled?** The backend validates credentials and returns user data; the frontend stores auth state in localStorage.
- **Can tasks be filtered?** Yes, by status, priority, and search terms.
- **Is this ready for deployment?** Yes, both frontend and backend support production builds and env-based config.
