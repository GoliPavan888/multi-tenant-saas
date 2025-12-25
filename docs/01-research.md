# Research Document

## Problem
Organizations need a project & task management system where multiple companies can coexist securely without data leakage.

## Multi-Tenancy Choice
We use a **shared database + shared schema** approach because:
- Lower operational cost
- Easier scaling
- Centralized migrations

Tenant isolation is enforced strictly at the **application layer** using tenant_id from JWT.

## Authentication
JWT-based authentication is used because it is:
- Stateless
- Scalable
- Well-suited for containerized environments

## Authorization
Role-Based Access Control (RBAC) ensures:
- super_admin has global visibility
- tenant_admin manages their tenant only
- users have limited access

## Why Docker
Docker ensures:
- One-command deployment
- Environment consistency
- Easy evaluation
