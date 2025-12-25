# Architecture Document

## High-Level Architecture

Browser
  ↓
Frontend (React + Vite)
  ↓ JWT
Backend (Node.js + Express)
  ↓ Prisma
PostgreSQL

## Multi-Tenant Isolation
- Each request contains a JWT
- tenantId is extracted from JWT
- All queries are filtered by tenantId
- tenantId is never trusted from request body

## Authentication Flow
1. User logs in
2. JWT issued with { userId, tenantId, role }
3. JWT validated on each request

## Docker Architecture
- database container (PostgreSQL)
- backend container (API)
- frontend container (UI)

All services communicate via Docker service names.
