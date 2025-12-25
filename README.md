# Multi-Tenant Project & Task Management SaaS

A production-ready, multi-tenant SaaS application where multiple organizations can manage teams, projects, and tasks with strict tenant isolation, RBAC, and subscription plan limits.

---

## 🚀 Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- ORM: Prisma
- Authentication: JWT
- Containers: Docker & Docker Compose

---

## 🏗 Architecture Overview

- Shared Database + Shared Schema multi-tenancy
- Tenant isolation enforced at API level using `tenantId` from JWT
- Role-Based Access Control (RBAC)
- Subscription plan enforcement
- Fully containerized services

---

## 🧩 Services

| Service | Port |
|------|------|
| Frontend | 3000 |
| Backend API | 5000 |
| PostgreSQL | 5432 |

---

## ▶️ How to Run (One Command)

### Prerequisites
- Docker
- Docker Compose

### Start the application
```bash
docker-compose up -d