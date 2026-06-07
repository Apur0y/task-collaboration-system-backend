# Smart Project & Task Collaboration System API

A robust, scalable RESTful API built with **Node.js**, **Express**, **PostgreSQL**, and **Prisma ORM** — following clean architecture principles with strict TypeScript typing, RBAC, and comprehensive business logic validation.

---

## 📁 Project Structure

```
smart-collab-api/
├── prisma/
│   ├── schema.prisma          # Full DB schema (7 models)
│   └── seed.ts                # Database seeder with test accounts
├── src/
│   ├── config/
│   │   └── database.ts        # Prisma client singleton
│   ├── controllers/           # HTTP layer — parse req, call service, send res
│   │   ├── auth.controller.ts
│   │   ├── project.controller.ts
│   │   ├── task.controller.ts
│   │   ├── dashboard.controller.ts
│   │   └── activity.controller.ts
│   ├── services/              # Business logic layer
│   │   ├── auth.service.ts
│   │   ├── project.service.ts
│   │   └── task.service.ts
│   ├── repositories/          # Data access layer (Prisma queries)
│   │   ├── auth.repository.ts
│   │   ├── project.repository.ts
│   │   ├── task.repository.ts
│   │   ├── activity.repository.ts
│   │   └── dashboard.repository.ts
│   ├── middleware/
│   │   ├── authenticate.ts    # JWT verification
│   │   ├── checkRole.ts       # RBAC middleware factory
│   │   ├── validate.ts        # Zod schema runner
│   │   └── errorHandler.ts    # Centralized error handler
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── project.routes.ts  # Includes nested /:projectId/tasks
│   │   ├── task.routes.ts     # mergeParams router
│   │   ├── dashboard.routes.ts
│   │   └── activity.routes.ts
│   ├── validators/            # Zod schemas
│   │   ├── auth.validator.ts
│   │   ├── project.validator.ts
│   │   └── task.validator.ts
│   ├── types/
│   │   └── index.ts           # AuthRequest, ApiResponse, etc.
│   ├── utils/
│   │   ├── AppError.ts        # Custom error class
│   │   ├── response.ts        # sendSuccess / sendError helpers
│   │   └── jwt.ts             # Token sign/verify
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Entry point with graceful shutdown
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET
```

### 3. Run database migrations
```bash
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Apply migrations
npm run db:seed       # Seed with test data (optional)
```

### 4. Start development server
```bash
npm run dev
```

Server runs at `http://localhost:3000`

---

## 🔐 Authentication

All protected routes require:
```
Authorization: Bearer <jwt_token>
```

### Role Hierarchy
| Role | Permissions |
|------|-------------|
| `ADMIN` | Full CRUD bypass on all resources |
| `PROJECT_MANAGER` | Create/update/delete **own** projects; fully manage tasks within those projects |
| `TEAM_MEMBER` | Read assigned projects; update **status** of tasks assigned to them only |

---

## 📡 API Endpoints

### Base URL: `http://localhost:3000/api`

### Auth Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/auth/signup` | Register new user | Public |
| `POST` | `/auth/login` | Login and get JWT | Public |

**Signup payload:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "role": "TEAM_MEMBER"
}
```

**Login payload:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

---

### Project Routes `/api/projects`
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/` | List projects (search, filter, paginate) | Authenticated |
| `POST` | `/` | Create project | ADMIN, PROJECT_MANAGER |
| `GET` | `/:id` | Get project + progress % | Authenticated |
| `PUT` | `/:id` | Update project | ADMIN, PM (owner only) |
| `DELETE` | `/:id` | Delete project | ADMIN, PM (owner only) |

**Query parameters for `GET /`:**
```
?search=ecommerce       # Text search by name
?status=ACTIVE          # Filter: ACTIVE | COMPLETED | ON_HOLD
?page=1&limit=10        # Pagination
```

**Create project payload:**
```json
{
  "name": "New Project",
  "description": "Project description",
  "deadline": "2025-12-31T00:00:00.000Z",
  "status": "ACTIVE"
}
```

**Project detail response includes:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "E-Commerce Platform",
    "progress": { "total": 5, "completed": 2, "progress": 40 },
    "tasks": [...],
    "members": [...]
  }
}
```

---

### Task Routes `/api/projects/:projectId/tasks`
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/` | List tasks (filter by priority, status, assignee, deadline) | Authenticated |
| `POST` | `/` | Create task | ADMIN, PROJECT_MANAGER |
| `GET` | `/:id` | Get task with comments & attachments | Authenticated |
| `PUT` | `/:id` | Update task | ADMIN, PROJECT_MANAGER |
| `PATCH` | `/:id/status` | Quick status update | Authenticated (RBAC in service) |
| `DELETE` | `/:id` | Delete task | ADMIN, PROJECT_MANAGER |
| `POST` | `/:id/comments` | Add comment | Authenticated |
| `POST` | `/:id/attachments` | Add attachment | Authenticated |

**Query parameters for `GET /`:**
```
?priority=HIGH                  # HIGH | MEDIUM | LOW
?status=IN_PROGRESS             # TODO | IN_PROGRESS | COMPLETED
?assignedMember=<userId>        # Filter by assignee UUID
?deadlineStatus=overdue         # Tasks past dueDate, not completed
?page=1&limit=10
```

**Create task payload:**
```json
{
  "title": "Implement Login",
  "description": "JWT-based authentication",
  "projectId": "<uuid>",
  "assignedMemberId": "<uuid>",
  "dueDate": "2025-06-30T00:00:00.000Z",
  "priority": "HIGH",
  "status": "TODO"
}
```

**Add comment payload:**
```json
{ "text": "Great progress on this task!" }
```

**Add attachment payload:**
```json
{
  "fileName": "design-mockup.pdf",
  "fileUrl": "https://storage.example.com/files/design-mockup.pdf"
}
```

---

### Dashboard Route
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/dashboard/stats` | Aggregated analytics | Authenticated |

**Response structure:**
```json
{
  "success": true,
  "data": {
    "counts": {
      "totalProjects": 5,
      "totalTasks": 24,
      "completedTasks": 10,
      "pendingTasks": 14,
      "overdueTasks": 3
    },
    "charts": {
      "tasksByPriority": [
        { "priority": "HIGH", "count": 8 },
        { "priority": "MEDIUM", "count": 12 },
        { "priority": "LOW", "count": 4 }
      ],
      "tasksByStatus": [
        { "status": "TODO", "count": 7 },
        { "status": "IN_PROGRESS", "count": 7 },
        { "status": "COMPLETED", "count": 10 }
      ]
    },
    "workloadSummary": [
      {
        "id": "...",
        "name": "Carol Dev",
        "email": "member1@example.com",
        "total": 6,
        "completed": 3,
        "pending": 3
      }
    ]
  }
}
```

---

### Activity Log Route
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/activities` | Latest 10 system activities | ADMIN, PROJECT_MANAGER |

---

## ⚙️ Business Rules Enforced

### Rule 1 — No Duplicate Titles
Creating or updating a task with a title that already exists in the same project returns:
```json
{ "success": false, "error": "This task already exists in the project." }
```

### Rule 2 — No Past Deadlines
Project deadlines and task `dueDate` must be present or future dates:
```json
{ "success": false, "error": "Please select a valid deadline." }
```

### Rule 3 — Reassignment Lockdown
Any mutation attempt on a `COMPLETED` task returns:
```json
{ "success": false, "error": "Completed tasks cannot be reassigned." }
```

---

## 🛡️ Standard Response Format

All API responses follow:
```json
{
  "success": true | false,
  "data": { ... },
  "error": "Error message (only on failure)",
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

---

## 🗄️ Database Schema Summary

```
User ──< ProjectMember >── Project ──< Task ──< Comment
                                          └──< Attachment
ActivityLog ──> User
ActivityLog ──> Project
```

---

## 🌱 Test Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| ADMIN | admin@example.com | password123 |
| PROJECT_MANAGER | pm@example.com | password123 |
| TEAM_MEMBER | member1@example.com | password123 |
| TEAM_MEMBER | member2@example.com | password123 |

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js + TypeScript |
| Framework | Express.js |
| ORM | Prisma v5 |
| Database | PostgreSQL |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | Zod |
| Security | Helmet, CORS, express-rate-limit |
| Logging | Morgan |
