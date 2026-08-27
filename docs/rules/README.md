# Module-Specific Development Rules

This directory contains **Tier-2 Bounded Context Rules** that govern domain logic, validation constraints, calculation formulas, and state transition invariants.

---

## Rules Index

| Rule File | Domain / Module | Core Focus |
|---|---|---|
| [01_iam_security_rules.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/rules/01_iam_security_rules.md) | Identity & Security | JWT validation, RBAC enforcement, tenant scoping, and audit logs. |
| [02_academic_engine_rules.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/rules/02_academic_engine_rules.md) | Academic Core & GPA | Prerequisite DAG resolution, SGPA/CGPA formulas, repeat course logic. |
| [03_finance_rules.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/rules/03_finance_rules.md) | Finance & Billing | Challan generation, payment idempotency, double-entry ledger audits. |
| [04_lms_assessment_rules.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/rules/04_lms_assessment_rules.md) | LMS & Examination | Quiz timing guards, assignment submission rules, grade locking. |
| [05_frontend_ui_rules.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/rules/05_frontend_ui_rules.md) | UI/UX & Frontend | Design token usage, responsive breakpoints, error handling, a11y. |
| [06_database_prisma_rules.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/rules/06_database_prisma_rules.md) | Database & ORM | Frozen schema policies, transaction boundaries, indexing requirements. |

---

## Global Precedence
In case of any conflict, rules defined in [AGENTS.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/AGENTS.md) take precedence over module-level rules.
