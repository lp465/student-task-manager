# Archived: FEATURES.md (moved on 2026-06-10)

Original content preserved below.

# Features

## User Management

- User registration with email and password
- User login with credential validation
- Secure password storage using BCrypt
- Session persistence via localStorage

## Task Management

- Create tasks with title, description, priority, and due date
- Optional `subject`/category field per task (select in UI; persisted in backend)
- Edit tasks without changing their current status
- Mark tasks as completed with confirmation
- Delete tasks with removal from dashboard
- Tasks default to `PENDING` status on creation

## Filtering and Search

- Filter tasks by status: All, Pending, Completed
- Filter tasks by priority: All, Low, Medium, High
- Search tasks by title or description
- Combined filters and search work together

## Dashboard and Analytics

- Completed task count
- Pending task count
- High priority pending task count
- Responsive analytics cards for desktop and mobile

## UI and Responsiveness

- Mobile-first layout for small screens
- Horizontal desktop layout with stacked controls on mobile
- Accessible buttons and form fields
- Error and success notifications

## Implementation Status

- User authentication: complete
- Task CRUD: complete
- Filters and search: complete
- Dashboard analytics: complete
- Environment-based API config: complete
- Production build support: complete

## Future Improvements

- Add JWT token-based authorization for enhanced security
- Add task categories or labels
- Add drag-and-drop task ordering
- Add user profile settings
- Add pagination or infinite scroll for large task lists
