---
description: Repository Information Overview
alwaysApply: true
---

# Expense Management System Information

## Summary
A multi-tenant expense management application for small companies, firms, and malls built with Next.js. The system allows organizations to manage expenses, approvals, budgets, and policies with role-based access control.

## Structure
- **src/app**: Next.js application routes and pages
- **src/components**: Reusable React components
- **src/lib**: Utility functions and configuration
- **src/types**: TypeScript type definitions
- **prisma**: Database schema and seed scripts
- **public**: Static assets and uploaded files

## Language & Runtime
**Language**: TypeScript
**Version**: TypeScript 5.x
**Framework**: Next.js 15.5.4
**Build System**: Next.js with Turbopack
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- next: 15.5.4 (React framework)
- react: 19.1.0
- react-dom: 19.1.0
- @prisma/client: 6.16.3 (ORM)
- next-auth: 4.24.11 (Authentication)
- zod: 4.1.11 (Schema validation)
- recharts: 3.2.1 (Charting library)
- date-fns: 4.1.0 (Date utilities)

**Development Dependencies**:
- prisma: 6.16.3
- tailwindcss: 4.x
- eslint: 9.x
- typescript: 5.x

## Database
**ORM**: Prisma
**Database**: SQLite (development)
**Schema**: Multi-tenant with organizations, users, expenses, policies, budgets
**Models**: Organization, User, Expense, Policy, Budget, Category, Store, AuditLog

## Build & Installation
```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run db:push

# Seed database with initial data
npm run db:seed

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start
```

## Authentication
**Provider**: NextAuth.js
**Strategy**: JWT with credentials provider
**Roles**: ADMIN, MANAGER, EMPLOYEE, ACCOUNTANT
**Features**: Role-based access control, organization-specific permissions

## Features
- Multi-tenant architecture with organization isolation
- Role-based access control
- Expense submission and approval workflow
- Budget tracking and management
- Policy enforcement
- Reporting and analytics
- Team management
- Audit logging