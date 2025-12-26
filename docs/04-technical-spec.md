# Technical Specification

## Tech Stack
- Frontend: React, Vite
- Backend: Node.js, Express
- Database: PostgreSQL
- ORM: Prisma
- Auth: JWT
- Containers: Docker, docker-compose

## Database Design
Tables:
- tenants
- users
- projects
- tasks
- audit_logs

All tenant-specific tables include tenant_id.

## Security Rules
- JWT expiry: 24 hours
- RBAC enforced at API level
- Cross-tenant access blocked
- super_admin has tenant_id = NULL

## Subscription Enforcement
- User & project limits checked before creation
- Exceeding limits returns HTTP 403
