# Security Verification

## Positive controls present in the code

- Passwords are hashed with BCrypt before being stored.
- User password fields are write-only in the entity model.
- Login credentials are checked against the stored password hash.
- JWT access tokens are signed with HS256.
- Task update and delete operations verify task ownership.
- Validation annotations are present on request DTOs and entities.
- A global exception handler normalizes validation and business errors.
- The refresh token value is stored server-side in the database rather than only in the browser.
- The refresh token is sent as an HttpOnly cookie.

## Security boundaries

- Register and login are public routes.
- Task and analytics routes require JWT authentication.
- The authentication principal is the JWT subject, which is the user email.

## Current gaps and limitations

- The refresh and logout routes are not explicitly whitelisted in `SecurityConfig.java`.
- The login controller does not set `Secure` or `SameSite` flags on the refresh cookie.
- CORS allowed origins are hardcoded in the security configuration.
- No role-based access control or admin separation is implemented.
- Access-token revocation is not tracked beyond expiration.

## Deployment recommendations

- Set a strong `JWT_SECRET` in the deployment environment.
- Update `SecurityConfig.java` if the frontend origin changes.
- Review cookie settings if the frontend and backend are hosted on different origins over HTTPS.
- Consider adding automated tests for login, refresh, logout, and task ownership checks.

## Audit note

This document reflects the current code as written. It does not claim a hardened production security posture, because the code still contains the limitations listed above.

