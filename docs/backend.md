# Backend Architecture & API Service Specification

This document details the backend engineering standards, layered service architecture, database access patterns, error handling, background processing, and API design for the University / College ERP.

---

## 1. Technology Stack

* **Runtime**: Node.js 20+ (LTS) / TypeScript
* **Web Framework**: Express.js / Fastify / NestJS (REST API)
* **ORM & Database Client**: Prisma 5.x / 6.x
* **Primary Database**: PostgreSQL 16+
* **Caching & Message Broker**: Redis 7.x
* **Validation & DTOs**: `zod`
* **Logging & Monitoring**: `winston` / `pino` with OpenTelemetry tracing

---

## 2. Layered Architecture

```
HTTP Request
     │
     ▼
[ Middleware Layer ]       ──> (CORS, Rate Limiter, Auth JWT, Tenant Context, Audit Logger)
     │
     ▼
[ Controller Layer ]       ──> (DTO Validation, HTTP Status Codes, Response Formatting)
     │
     ▼
[ Service / Domain Layer ] ──> (Business Logic, Prerequisite Checks, CGPA Calculation, State Transitions)
     │
     ▼
[ Repository / Prisma ORM] ──> (Atomic Transactions, Parameterized SQL, Relation Queries)
     │
     ▼
[ PostgreSQL Database ]
```

---

## 3. Directory Structure

```
backend/
├── src/
│   ├── config/             # Environment variables, database connection, redis client
│   ├── constants/          # Error codes, permission constants, enum definitions
│   ├── middleware/         # AuthGuard, RoleGuard, TenantContext, AuditLogger, ErrorHandler
│   ├── modules/            # Bounded context modules
│   │   ├── auth/           # Login, JWT signing, refresh tokens
│   │   ├── academics/      # Programs, courses, prerequisites, course offerings, timetables
│   │   ├── students/       # Profiles, enrollments, transcripts, GPA computation
│   │   ├── lms/            # Assignments, submissions, quizzes, class attendance
│   │   ├── exams/          # Exam terms, datesheets, result cards, invigilators
│   │   ├── finance/        # Fee structures, challan generation, payments, ledger
│   │   ├── hr/             # Employees, leave requests, attendance, payroll
│   │   ├── admissions/     # Applications, entry tests, merit calculation
│   │   ├── library/        # Books, circulation, barcode scanning, fines
│   │   ├── hostel/         # Dorms, room allocations, checkout
│   │   ├── transport/      # Routes, stops, bus subscriptions
│   │   └── reports/        # Custom report query builder & exports
│   ├── utils/              # Calculation helpers (CGPA math, date formatters, PDF generation)
│   ├── types/              # Express Request extensions, DTO types
│   ├── server.ts           # Server initialization & lifecycle hooks
│   └── app.ts              # Express application setup
├── prisma/
│   └── schema.prisma       # Centralized Master Prisma Schema
└── package.json
```

---

## 4. Transaction Management & Business Integrity

* **Atomic Multi-Table Transactions**: All complex mutations (e.g. course registration with capacity checks, fee challan settlements with ledger double-entries, admissions onboarding) use `prisma.$transaction`.
* **Optimistic Locking**: Handled using version numbers on high-contention resources (e.g. section capacities, bed allocations).
* **Idempotency**: Critical endpoints (e.g. fee payments, refund processing) support `X-Idempotency-Key` headers stored in Redis.

---

## 5. Background Jobs & Asynchronous Processing

* **Job Queue**: `BullMQ` running on Redis for non-blocking asynchronous tasks:
  * Bulk Fee Challan PDF generation and batch email dispatch.
  * Nightly aggregate jobs (CGPA cache refresh, library overdue fine calculation, attendance summaries).
  * Automated SMS/Email emergency notifications.
