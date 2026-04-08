# Case Management CRM Backend

## Quick Start

1. `cd server`
2. `npm install`
3. Update `.env` with PostgreSQL credentials
4. `npm run prisma:migrate`
5. `npm run prisma:generate`
6. `npm run seed`
7. `npm run dev`

## Sample APIs

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/cases`
- `GET /api/cases`
- `POST /api/cases/:caseId/assign`
- `POST /api/documents/upload` (multipart/form-data, `file`)
- `GET /api/tasks/overdue/list`
- `POST /api/payments/invoice`
- `POST /api/payments`
- `GET /api/compliance/dashboard`
- `GET /api/dashboard/admin`

## RBAC Examples

- `checkAuth()` applied on protected routes
- `checkRole("Admin")` for admin-only endpoints
- `checkPermission("case:write")` for permission-scoped access
