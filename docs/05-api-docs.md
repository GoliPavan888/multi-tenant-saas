# API Documentation

## Authentication
POST /api/auth/register-tenant  
POST /api/auth/login  
GET  /api/auth/me  

## Health
GET /api/health  

## Tenants
GET /api/tenants  

## Users
POST   /api/users  
GET    /api/users  
DELETE /api/users/:id  

## Projects
POST   /api/projects  
GET    /api/projects  
GET    /api/projects/:id  
DELETE /api/projects/:id  

## Tasks
POST   /api/tasks  
GET    /api/tasks/project/:projectId  
PATCH  /api/tasks/:id  

## Audit Logs
GET /api/audit-logs  

## Super Admin
GET /api/super-admin/tenants  
GET /api/super-admin/tenants/:tenantId/users  
GET /api/super-admin/tenants/:tenantId/projects  

All APIs return:
{
  success,
  message?,
  data?
}
