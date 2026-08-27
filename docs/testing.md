# Testing Strategy & Quality Assurance Specification

This document details the multi-tiered testing strategy, automated test suites, code coverage targets, and validation pipelines for the University / College Management ERP.

---

## 1. Testing Pyramid

```
            / \
           /   \        E2E Tests (Playwright / Cypress)
          / E2E \       - Student Registration & Fee Payment Flow
         /-------\      - Grade Submission to Transcript Flow
        /         \
       /Integration\    Integration & API Tests (Supertest + Jest/Vitest)
      /             \   - Endpoints, RBAC Guards, DB Transactions
     /---------------\
    /                 \  Unit Tests (Vitest / Jest)
   /    Unit Tests     \ - CGPA Math, Prerequisite DAG, Fee Breakdowns
  /---------------------\
```

---

## 2. Unit Testing Scope

### Critical Business Logic Target Modules
1. **CGPA & GPA Calculator**:
   * Grade point conversion ($A = 4.0, B+ = 3.5, C = 2.0, F = 0.0$).
   * Semester GPA: $\text{SGPA} = \frac{\sum (\text{GradePoint} \times \text{CreditHours})}{\sum \text{CreditHours}}$.
   * Cumulative GPA: $\text{CGPA} = \frac{\sum_{\text{All Terms}} (\text{GradePoint} \times \text{CreditHours})}{\sum_{\text{All Terms}} \text{CreditHours}}$.
   * Repeat course grade replacement logic (best attempt policy).
2. **Prerequisite DAG Resolver**:
   * Circular dependency prevention.
   * Hard vs. Co-requisite validation against completed transcript history.
3. **Fee Calculation Engine**:
   * Itemized fee sums, percentage-based scholarship deductions, and daily overdue fine calculations.

---

## 3. Integration & API Testing

* **Tooling**: `Vitest` / `Jest` + `Supertest` against a dedicated test PostgreSQL container.
* **Coverage Rules**:
  * Every API route tested for positive response (`200`/`201`).
  * Authentication failure (`401 Unauthorized`) on missing/invalid tokens.
  * RBAC failure (`403 Forbidden`) on unauthorized roles.
  * DTO validation error (`422 Unprocessable`) on missing or malformed inputs.
  * Multi-tenancy leakage checks (verifying cross-campus isolation).

---

## 4. End-to-End (E2E) Test Scenarios

1. **Student Registration Workflow**:
   * Login as Student $\rightarrow$ View Offerings $\rightarrow$ Select Courses $\rightarrow$ Prerequisite Check $\rightarrow$ Confirm Registration $\rightarrow$ Verify Timetable updated.
2. **Faculty Grading & Transcript Workflow**:
   * Teacher marks Midterm & Final marks $\rightarrow$ Submits draft $\rightarrow$ Controller approves $\rightarrow$ Student transcript reflects updated CGPA and credit totals.
3. **Fee Challan Settlement**:
   * Accountant issues Challan $\rightarrow$ Student submits online payment $\rightarrow$ Challan updates to `PAID` $\rightarrow$ General ledger records transaction.

---

## 5. Coverage Benchmarks & CI Pipeline

* **Code Coverage Requirement**: Minimum **85% Line Coverage** across domain services and controllers.
* **CI Integration (GitHub Actions)**:
  * Step 1: `npm run lint` & TypeScript type-checking.
  * Step 2: `npx prisma validate` & `prisma format --check`.
  * Step 3: Run Unit & Integration Tests.
  * Step 4: Run E2E Test Suite against preview staging environment.
