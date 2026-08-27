# Role-Based Access Control (RBAC) & Security Specification

This document defines the **Identity & Access Management (IAM)** and **Role-Based Access Control (RBAC)** architecture for the University / College Management ERP.

The visual ERD for this module is located at [rbac_erd.mermaid](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/rbac_erd/rbac_erd.mermaid).

---

## 1. System Roles Overview

The system defines **12 Standard System Roles** mapped to the `SystemRole` enum in [backend/schema.prisma](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/backend/schema.prisma):

| Role | Role Code | Primary Domain & Description |
|---|---|---|
| **Super Admin** | `SUPER_ADMIN` | Global institutional access, system configuration, tenant settings, role management. |
| **Campus Admin** | `ADMIN` | Campus-level operations, facility allocation, cross-department coordination. |
| **Faculty / Teacher** | `TEACHER` | Course instruction, syllabus management, assignment/quiz creation, student grading. |
| **Student** | `STUDENT` | Course enrollment, attendance tracking, LMS coursework, fee payments, transcript access. |
| **Accountant** | `ACCOUNTANT` | Fee challan generation, payment verification, payroll processing, General Ledger audits. |
| **Librarian** | `LIBRARIAN` | Book cataloging, barcode management, membership issuance, checkout/return circulation. |
| **HR Manager** | `HR_MANAGER` | Employee onboarding, designation tracking, leave approvals, salary structure setup. |
| **Hostel Warden** | `WARDEN` | Dormitory room configuration, student bed allocations, hostel maintenance requests. |
| **Transport Driver** | `DRIVER` | Fleet vehicle route navigation, passenger verification, maintenance logging. |
| **Admissions Officer** | `ADMISSIONS_OFFICER` | Applicant intake, entrance test scheduling, verification, merit list generation. |
| **Exam Controller** | `EXAM_CONTROLLER` | Examination term scheduling, datesheets, invigilator assignments, official results. |
| **Staff / Support** | `STAFF` | General administrative support, front desk inquiries, maintenance work orders. |

---

## 2. Granular Permission Catalog

Permissions use a namespaced code syntax: `<MODULE>.<RESOURCE>.<ACTION>`.

### Academic & LMS Module
- `ACADEMICS.PROGRAM.MANAGE`: Create and configure degree programs and requirements.
- `ACADEMICS.COURSE.MANAGE`: Manage course catalog, credit hours, and prerequisite DAGs.
- `ACADEMICS.OFFERING.SCHEDULE`: Create semester course offerings, assign faculty, set section capacity.
- `LMS.ASSIGNMENT.MANAGE`: Create, publish, and grade assignments for enrolled sections.
- `LMS.QUIZ.MANAGE`: Create online quizzes, question banks, and evaluate attempts.
- `LMS.ATTENDANCE.MARK`: Mark daily lecture/lab attendance for enrolled students.
- `LMS.COURSEWORK.SUBMIT`: Student permission to submit assignments and attempt quizzes.

### Examination & Grading Module
- `EXAM.TERM.MANAGE`: Configure Midterm/Final/Practical exam terms and datesheets.
- `EXAM.INVIGILATOR.ASSIGN`: Assign faculty/staff invigilators to examination halls.
- `GRADE.SUBMIT_DRAFT`: Teachers submit provisional course grades.
- `GRADE.APPROVE_FINAL`: Exam controller locks, approves, and publishes official result cards.
- `TRANSCRIPT.GENERATE`: Generate official academic transcripts and verify graduation status.

### Finance & Billing Module
- `FINANCE.STRUCTURE.MANAGE`: Configure program/semester fee templates.
- `FINANCE.CHALLAN.GENERATE`: Generate batch or single student fee challans.
- `FINANCE.PAYMENT.VERIFY`: Verify offline bank receipts, challan settlements, and online transactions.
- `FINANCE.SCHOLARSHIP.GRANT`: Approve need-based or merit scholarships and fee waivers.
- `FINANCE.LEDGER.MANAGE`: Manage Chart of Accounts, payroll disbursements, and financial reporting.

### Admissions Module
- `ADMISSIONS.APPLICATION.REVIEW`: Screen prospective applicant submissions and documents.
- `ADMISSIONS.TEST.GRADE`: Input admission entrance test scores.
- `ADMISSIONS.MERIT.PUBLISH`: Calculate aggregate formulas and publish official merit lists.

### HR & Workforce Module
- `HR.EMPLOYEE.MANAGE`: Onboard employees, manage contracts, designations, and base salaries.
- `HR.LEAVE.APPROVE`: Approve or reject subordinate leave requests.
- `HR.PAYROLL.GENERATE`: Generate monthly salary slips and tax/deduction calculations.

### Campus Operations (Library, Hostel, Transport, Facilities)
- `LIBRARY.CIRCULATION.MANAGE`: Issue, renew, and return book copies; collect fines.
- `HOSTEL.ALLOCATION.MANAGE`: Assign students to hostel rooms and manage check-in/out.
- `TRANSPORT.ROUTE.MANAGE`: Manage vehicles, route stops, and student bus subscriptions.
- `FACILITIES.ROOM.BOOK`: Reserve lecture halls, auditoriums, and seminar rooms.
- `FACILITIES.MAINTENANCE.MANAGE`: Create and resolve asset/facility work orders.

---

## 3. Comprehensive Role-Permission Matrix

| Permission Code | `SUPER_ADMIN` | `ADMIN` | `TEACHER` | `STUDENT` | `ACCOUNTANT` | `LIBRARIAN` | `HR_MANAGER` | `WARDEN` | `EXAM_CONTROLLER` | `ADMISSIONS_OFFICER` |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `SYSTEM.SETTINGS.MANAGE` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `ACADEMICS.PROGRAM.MANAGE` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `ACADEMICS.COURSE.MANAGE` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `ACADEMICS.OFFERING.SCHEDULE`| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `LMS.COURSEWORK.SUBMIT` | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `LMS.ASSIGNMENT.MANAGE` | ✅ | ❌ | ✅ (Scoped) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `LMS.QUIZ.MANAGE` | ✅ | ❌ | ✅ (Scoped) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `LMS.ATTENDANCE.MARK` | ✅ | ❌ | ✅ (Scoped) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `GRADE.SUBMIT_DRAFT` | ✅ | ❌ | ✅ (Scoped) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `GRADE.APPROVE_FINAL` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| `TRANSCRIPT.GENERATE` | ✅ | ✅ | ❌ | ✅ (Self) | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| `FINANCE.CHALLAN.GENERATE` | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `FINANCE.PAYMENT.VERIFY` | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `FINANCE.LEDGER.MANAGE` | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `ADMISSIONS.MERIT.PUBLISH`| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `HR.EMPLOYEE.MANAGE` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `HR.LEAVE.APPROVE` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `LIBRARY.CIRCULATION.MANAGE`| ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `HOSTEL.ALLOCATION.MANAGE` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| `TRANSPORT.ROUTE.MANAGE` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 4. Contextual (Object-Level / Tenant-Scoped) Authorization Rules

In addition to static role checks, the ERP enforces strict **Object-Level Scoping**:

1. **Student Context**:
   - `Student` can only read records where `studentId === currentSession.student.id` (Transcript, Attendance, Enrollments, FeeChallans, Submissions).
2. **Teacher / Faculty Context**:
   - `Teacher` can only create assignments, quizzes, and grade enrollments for `CourseOffering` records where `offering.teacherId === currentSession.teacher.id`.
3. **Hostel Warden Context**:
   - `Warden` can only allocate rooms and beds within `Hostel` facilities assigned to them (`hostel.wardenId === currentSession.staff.id`).
4. **Campus Admin Context**:
   - `Campus Admin` operations are constrained to buildings, departments, and programs within their assigned `campusId`.

---

## 5. Security & Audit Logging Protocol

All state mutations on protected resources automatically trigger an immutable record in `AuditLog`:
* **User Identity**: `userId`, `ipAddress`, `userAgent`.
* **Action Identifier**: `action` (e.g. `GRADE_UPDATED`, `FEE_WAIVED`, `STUDENT_PROBATION_SET`).
* **Entity Target**: `entityType` and `entityId`.
* **Metadata Diff**: JSON snapshot containing previous values and updated values for compliance review.
