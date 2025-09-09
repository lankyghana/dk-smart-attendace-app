# Smart Attendance Routing & Access Control Documentation

## Route Table

| Route           | Purpose                        | Allowed Roles         | Fallback/Redirect      |
|-----------------|--------------------------------|----------------------|------------------------|
| `/`             | Main dashboard                 | Authenticated users  | `/auth`                |
| `/auth`         | Login/Signup page              | All                  | -                      |
| `/signup`       | Signup for teachers/students   | teacher, student     | `/login`               |
| `/admin`        | Admin dashboard & management   | admin                | `/login`               |
| `/reset-password`| Password reset                | All                  | -                      |
| `*`             | 404 Not Found                  | All                  | -                      |

## Role-Based Route Guard
- Implemented in `src/components/ui/RoleGuard.tsx`.
- Usage: Wrap any route or component to restrict access by role.
- Redirects unauthorized users to the specified fallback (default: `/login`).

## Admin Permissions
- Only the **main admin** (email: `mainadmin@domain.com`) can add new admins via the Admin Management panel.
- New admins can have restricted permissions (enforced in backend and UI).

## Adding New Routes
1. Create your page/component in `src/pages` or `src/components`.
2. Add a `<Route>` in `src/App.tsx`.
3. Use `<RoleGuard allowedRoles={[...]} fallback="/some-path">...</RoleGuard>` for protected routes.
4. Document the new route here.

## Updating Role-Based Access
- Update allowed roles in `RoleGuard` usage for each route.
- Update backend API endpoints to check user roles/permissions on every request.

## Backend Validation
- All sensitive actions (e.g., adding admins, managing users) must be validated server-side.
- Never trust only frontend checks for security.

## Error Handling
- Unauthorized access triggers a redirect and can show a meaningful error message (see `RoleGuard`).
- All undefined routes show the custom 404 page (`src/pages/NotFound.tsx`).

## Testing
- See `src/pages/Index.test.tsx` and related test files for integration/unit tests.
- Add tests for new routes and role-guarded logic.

---

For questions or to extend the routing system, see `src/components/ui/RoleGuard.tsx` and this file.
