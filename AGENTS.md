# AGENTS.md — Global Architecture, Security & Development Rules

This document defines the **binding global rules, architectural standards, and constraints** for all AI agents and developers building and maintaining the University / College Management ERP.

---

## 1. Frozen Architecture & Schema Policy

### ⚠️ RULE #1: NEVER ALTER THE SCHEMA FOR AD-HOC UI FEATURES
* The database schema in [backend/schema.prisma](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/backend/schema.prisma) and master diagram in [erd.mermaid](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/erd.mermaid) are **FROZEN**.
* Every feature across all 12 modules must map directly into existing models and relationships.
* Do **NOT** create new tables or modify foreign keys without explicit user authorization and a verified migration plan.

### Data Model Mapping Contract
* **Student Academic Records**: `Student` $\rightarrow$ `Enrollment` $\rightarrow$ `CourseOffering` $\rightarrow$ `Course` / `Semester`.
* **Assessments & LMS**: `Assignment` $\rightarrow$ `AssignmentSubmission`, `Quiz` $\rightarrow$ `QuizAttempt` $\rightarrow$ `QuizAnswer`.
* **Examinations & GPA**: `ExamTerm` $\rightarrow$ `Exam` $\rightarrow$ `ExamResult`, single source of GPA in `Enrollment` & `Student.cgpaCache`.
* **Finance & Billing**: `FeeStructure` $\rightarrow$ `FeeChallan` $\rightarrow$ `FeeChallanItem` $\rightarrow$ `Payment` $\rightarrow$ `Account` / `Transaction`.
* **Workforce & HR**: Single `Employee` spine specialized into `Teacher`, `Staff`, and `Driver`.

---

## 2. Technology Stack & Coding Standards

### Backend (Node.js / Express / Prisma / PostgreSQL)
* **Language**: TypeScript (Strict Mode enabled).
* **Data Access**: Use `Prisma` with explicit atomic transactions (`prisma.$transaction`) on multi-entity mutations.
* **Validation**: All incoming HTTP payloads must be validated using `zod` schemas before touching services.
* **Error Handling**: Throw typed domain exceptions; global error handler returns standard `{ success: false, error: { code, message } }` envelope.
* **Security & Auth**:
  * Extract authenticated identity from JWT via `AuthGuard`.
  * Validate granular capability via `RoleGuard` and `PermissionGuard`.
  * Enforce object-level isolation (e.g. students can only access their own records).

### Frontend (React / TypeScript / Vanilla CSS Design System)
* **Component Design**: Build reusable UI components adhering to [docs/ui-ux.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/ui-ux.md).
* **Styling**: Vanilla CSS / CSS Modules using semantic design tokens (`Plus Jakarta Sans` typography, academic color palettes). Avoid Tailwind unless explicitly requested.
* **State Management**:
  * Server State: `@tanstack/react-query` for queries, mutations, and cache invalidation.
  * Client UI State: `Zustand` for global modal toggles, active theme, and session cache.
* **No Placeholders**: Never use broken image URLs or empty placeholder text; provide working demonstration state.

---

## 3. Implementation Order & Phasing

All work must follow the phased implementation roadmap in [docs/roadmap.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/roadmap.md):
1. **Milestone 1**: Student Portal (Phases 1 through 10)
2. **Milestone 2**: Faculty & Examination Controller Portal (Phases 11 through 15)
3. **Milestone 3**: Admissions, Finance & HR Management (Phases 16 through 19)
4. **Milestone 4**: Campus Operations, Facilities & BI Analytics (Phases 20 through 24)

---

## 4. Two-Tier Rules Hierarchy

* **Tier 1 (Global Rules)**: This file (`AGENTS.md`) governs system-wide architecture, security, and coding integrity.
* **Tier 2 (Module Rules)**: Domain-specific rules located under `docs/rules/`:
  * [docs/rules/01_iam_security_rules.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/rules/01_iam_security_rules.md)
  * [docs/rules/02_academic_engine_rules.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/rules/02_academic_engine_rules.md)
  * [docs/rules/03_finance_rules.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/rules/03_finance_rules.md)
  * [docs/rules/04_lms_assessment_rules.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/rules/04_lms_assessment_rules.md)
  * [docs/rules/05_frontend_ui_rules.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/rules/05_frontend_ui_rules.md)
  * [docs/rules/06_database_prisma_rules.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/rules/06_database_prisma_rules.md)
