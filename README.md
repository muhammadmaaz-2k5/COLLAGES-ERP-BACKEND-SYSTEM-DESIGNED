# 🎓 Enterprise University & College Management ERP

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20.x%20LTS-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x%2F6.x-2D3748.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.x-336791.svg)](https://www.postgresql.org/)

A production-grade, enterprise-scale **University & College Management Enterprise Resource Planning (ERP)** backend and system architecture. Built with a unified identity and workforce spine, multi-tenant multi-campus support, granular Role-Based Access Control (RBAC), and 12 loosely-coupled domain modules.

---

## 🏛️ Core Architecture Principles

1. **One Spine, Many Modules**:
   * **`User` Spine**: Unified authentication and identity for all actors (`SUPER_ADMIN`, `ADMIN`, `TEACHER`, `STUDENT`, `ACCOUNTANT`, `LIBRARIAN`, `HR_MANAGER`, `WARDEN`, `DRIVER`, etc.).
   * **`Employee` Spine**: Single HR master record specialized into `Teacher` (faculty workload & research), `Staff` (wardens & operations), and `Driver` (fleet navigation)—eliminating duplication in payroll, attendance, and leave management.
   * **`Student` Spine**: Master academic record managing admissions, course enrollments, CGPA caching, transcripts, and verified digital credentials.
2. **Three-Tier Architecture Alignment**:
   * **Master Prisma Schema** ([backend/schema.prisma](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/backend/schema.prisma)) $\rightarrow$ Source of truth for database implementation.
   * **Master System ERD** ([erd.mermaid](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/erd.mermaid)) $\rightarrow$ Complete relational blueprint (84 entity definitions).
   * **12 Bounded Context ERDs** ([docs/erd/](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/erd/README.md)) $\rightarrow$ Domain-driven module diagrams for seamless maintenance.
3. **Two-Tier Governance Rules**:
   * **Tier 1 (Global Rules)**: [AGENTS.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/AGENTS.md) governs frozen schema laws, tech stack standards, and system security.
   * **Tier 2 (Module Rules)**: [docs/rules/](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/rules/README.md) details calculation math, prerequisite DAGs, financial idempotency, and UI standards.

---

## 📂 System Documentation Index

| Documentation Area | Description & Direct Links |
|---|---|
| 📐 **Master Database ERD** | [erd.mermaid](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/erd.mermaid) — Holistic visual database relationship diagram. |
| 🗄️ **Master Prisma Schema** | [backend/schema.prisma](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/backend/schema.prisma) — Centralized Prisma ORM schema with indexes and cascade rules. |
| 🔐 **RBAC & IAM Architecture** | [docs/rbac_erd/](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/rbac_erd/README.md) — 12 System Roles, Permission Matrix, and Contextual Scoping. |
| 🔄 **Business Process Workflows** | [docs/workflows/](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/workflows/README.md) — 6 End-to-End Sequence Diagrams (Registration, Admissions, Fees, Exams). |
| 🚦 **State Machines** | [docs/state-machines.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/state-machines.md) — Visual transitions and guards for Application, Enrollment, Fee, and Leave states. |
| 🌐 **REST API Specification** | [docs/api/api.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/api/api.md) — Complete endpoint documentation across all 12 modules. |
| 🗺️ **Engineering Roadmap** | [docs/roadmap.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/roadmap.md) — 4 Implementation Milestones and phase release sequence. |
| 📋 **Master TODO & Checklist** | [docs/todo.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/todo.md) — Granular feature checklist and gap analysis across all 12 modules. |
| 🔒 **Security & Cryptography** | [docs/security.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/security.md) — JWT RS256 lifecycle, tenant isolation, and QR code verification. |
| ⚙️ **Backend Architecture** | [docs/backend.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/backend.md) — Layered architecture, atomic `$transaction` rules, and BullMQ queues. |
| 💻 **Frontend Architecture** | [docs/frontend.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/frontend.md) — React/TypeScript structure, React Query caching, and Zustand UI state. |
| 🎨 **UI/UX Design System** | [docs/ui-ux.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/ui-ux.md) — Design tokens, Plus Jakarta Sans typography, and transcript/timetable UX. |
| 🧪 **Testing & QA** | [docs/testing.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/testing.md) — Vitest unit tests, Supertest API suites, and CGPA math verification. |
| 🚀 **DevOps & Deployment** | [docs/deployment.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/deployment.md) — Docker containerization, rolling updates, and health checks. |
| 🛡️ **Disaster Recovery** | [docs/backup-recovery.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/backup-recovery.md) — Continuous WAL archiving, PITR recovery, and failover topologies. |
| 📜 **Audit & Compliance** | [docs/audit-logging.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/audit-logging.md) — Mutation auditing, security event matrix, and WORM log immutability. |
| 📊 **BI & Analytics Engine** | [docs/reporting.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/reporting.md) — Read replica query routing, KPI dashboards, and custom report builder. |
| ☁️ **Cloud Storage & Media** | [docs/cloud_storage_media.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/cloud_storage_media.md) — AWS S3 object storage for documents & Cloudinary CDN video streaming. |
| 🔔 **Notifications & Comms** | [docs/notifications.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/notifications.md) — Multi-channel SSE, Email, SMS, Push, and direct messaging. |

---

## 🧩 The 12 Bounded Context Modules

```
                        ┌───────────────────────────────┐
                        │   INSTITUTION & MULTI-CAMPUS  │
                        │    (IAM, Security & Auditing) │
                        └──────────────┬────────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
     ┌──────────────────────┐                      ┌──────────────────────┐
     │     STUDENT SPINE    │                      │    EMPLOYEE SPINE    │
     │  (Learner Lifecycle) │                      │   (Faculty & Staff)  │
     └──────────┬───────────┘                      └──────────┬───────────┘
                │                                             │
 ┌──────────────┼──────────────┬──────────────┬───────────────┼──────────────┐
 ▼              ▼              ▼              ▼               ▼              ▼
ACADEMICS &   ASSESSMENTS    FINANCE &      ADMISSIONS &   CAMPUS OPS &   CAREER &
CURRICULUM     & GRADING      BILLING        ENROLLMENT     FACILITIES    RESEARCH
```

1. **[01. Identity & Access Management](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/erd/01_identity_iam.mermaid)**: Multi-tenancy, authentication, role permissions, announcements, and audit logging.
2. **[02. Campus Infrastructure](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/erd/02_campus_facilities.mermaid)**: Buildings, smart classrooms, laboratories, room bookings, and maintenance tickets.
3. **[03. Academic Core & Curriculum](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/erd/03_academic_curriculum.mermaid)**: Departments, degree programs, prerequisite DAG engine, semester offerings, and timetables.
4. **[04. Workforce & HR](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/erd/04_people_hr.mermaid)**: Employee profiles, leave quota tracking, biometric attendance, and itemized monthly payroll slips.
5. **[05. Student Lifecycle](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/erd/05_student_lifecycle.mermaid)**: Student master profile, guardian info, emergency contacts, and verified digital credentials.
6. **[06. Admissions & Merit](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/erd/06_admissions.mermaid)**: Candidate applications, entrance exams, 50/50 aggregate computation, and merit list publication.
7. **[07. LMS, Assessments & Exams](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/erd/07_assessments_grading.mermaid)**: Assignment submissions, timed online quizzes, exam terms, invigilation, and single-source GPA calculation.
8. **[08. Finance & Billing](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/erd/08_finance_billing.mermaid)**: Fee structure templates, Challan vouchers, online payment gateway, scholarships, and General Ledger.
9. **[09. Library Automation](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/erd/09_library.mermaid)**: Book title catalog, barcoded copy inventory, circulation checkouts, returns, and overdue fines.
10. **[10. Hostel & Housing](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/erd/10_hostel.mermaid)**: Dormitories, room capacities, bed allocations, check-ins/outs, and residential fee billing.
11. **[11. Transport Fleet](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/erd/11_transport.mermaid)**: Vehicles, driver assignments, route stops, pickup timings, and student transit subscriptions.
12. **[12. Placement & Research](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/erd/12_placement_research.mermaid)**: Campus recruitment job postings, student applications, research grants, and publications.

---

## 🎯 Implementation Roadmap: Module 1 (Student Portal)

All development follows the official implementation roadmap in [docs/roadmap.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/roadmap.md):

```
MODULE 1: STUDENT PORTAL BUILD SEQUENCE
├── Phase 1: Authentication & Student Profile Setup (JWT, RBAC Guards, Profile)
├── Phase 2: Student Dashboard Overview (CGPA Meter, Enrolled Courses, Attendance Gauge)
├── Phase 3: Academic Roadmap & Course Registration (Prerequisite DAG validation)
├── Phase 4: Complete Transcript Engine (8+ Semesters, CGPA calculation)
├── Phase 5: Attendance Tracker (Subject-wise breakdown, absence log)
├── Phase 6: LMS Assessments (Assignment dropzone, timed quiz attempts)
├── Phase 7: Examination & Results (Datesheets, digital hall tickets, result cards)
├── Phase 8: Fee & Billing Management (Downloadable Challan PDFs, payment status)
├── Phase 9: Weekly Timetable Matrix (Interactive schedule with room allocations)
└── Phase 10: Official Documents & Communication (Digital ID, announcements, inbox)
```

---

## 🚀 Quickstart & Setup

### Prerequisites
* **Node.js**: `v20.x` or higher
* **PostgreSQL**: `v16.x`
* **Prisma CLI**: `v5.x` or `v6.x`

### 1. Clone the Repository
```bash
git clone https://github.com/muhammadmaaz-2k5/COLLAGES-ERP-BACKEND-SYSTEM-DESIGNED.git
cd COLLAGES-ERP-BACKEND-SYSTEM-DESIGNED
```

### 2. Install Dependencies & Validate Schema
```bash
cd backend
npm install
npx prisma validate
npx prisma format
```

### 3. Setup Environment Variables
Create a `.env` file in `backend/`:
```env
DATABASE_URL="postgresql://postgres:maaz@localhost:5432/erpc"
JWT_SECRET="your-super-secret-key-change-in-production"
PORT=5000

# AWS S3 Storage (Documents & Submissions)
AWS_ACCESS_KEY_ID="your-aws-access-key-id"
AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"
AWS_REGION="eu-north-1"
AWS_S3_BUCKET="collage-management-erp-storage"

# Cloudinary CDN (Video Lectures & Media)
CLOUDINARY_CLOUD_NAME="itomku0j"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
CLOUDINARY_UPLOAD_PRESET="FOODPANDA"
```

### 4. Live Role Portals & Workstations
* **🎓 Student Portal**: [http://localhost:3000/student/dashboard](http://localhost:3000/student/dashboard)
* **👨‍🏫 Faculty & Teacher Portal**: [http://localhost:3000/faculty/dashboard](http://localhost:3000/faculty/dashboard)
* **🏛️ Examination Controller Portal**: [http://localhost:3000/exam-controller/dashboard](http://localhost:3000/exam-controller/dashboard)
* **🛡️ RBAC & IAM Admin Matrix**: [http://localhost:3000/admin/rbac](http://localhost:3000/admin/rbac)
* **📚 Academic Programs & Curricula**: [http://localhost:3000/admin/academics](http://localhost:3000/admin/academics)


---

## 📄 License
This project is licensed under the MIT License — see the LICENSE file for details.
