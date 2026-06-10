# Security Verification — Basic Checks

Date: 2026-06-10

Summary

- Performed basic security checks to ensure the app is safe for deployment and that obvious misconfigurations are documented.

Findings

- `application.properties` uses an env-backed placeholder for `jwt.secret` with a dev default `ChangeThisSecretForDev`. Ensure `JWT_SECRET` is set in the production environment and is a strong random secret.
- Refresh token cookie is set as `HttpOnly` in the login controller. In production ensure the cookie uses `Secure=true` and `SameSite=None` so it works cross-site over HTTPS.
- Global CORS configuration reads `frontend.production.origin` and supports explicit origin patterns — set this to your deployed frontend origin (e.g., `https://your-app.vercel.app`) to restrict access.

Recommendations

- Set `JWT_SECRET` in Railway/Render secrets and never commit it to git.
- Configure `frontend.production.origin` on the backend environment to your frontend domain.
- Ensure the platform uses HTTPS so cookies with `Secure` are accepted.
- Consider enabling Spring Actuator and locking access to health endpoints via IAM or network rules in production.
- Consider rotating the `JWT_SECRET` periodically and keeping refresh-token revocation capabilities if immediate logout invalidation is needed.

Next actions (optional)

- Add automated security checks (Snyk, Dependabot) to CI.
- Add brief instructions to `DEPLOY.md` about setting `JWT_SECRET` and how to set cookie `Secure` flag in production (code already designed to set Secure when production origin is HTTPS).
