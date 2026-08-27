# Module Rules: Identity, Access & IAM

## 1. Authentication Invariants
* All protected endpoints must execute `AuthGuard` middleware to verify Bearer JWT tokens.
* Expired access tokens must return `401 Unauthorized` with error code `TOKEN_EXPIRED`.
* Password hashes must never be exposed in API responses; always omit `passwordHash` in Prisma `select` projections.

## 2. Authorization & Scoping Rules
* **Role Check**: Endpoints requiring specific roles must enforce `RoleGuard([SystemRole.TEACHER, ...])`.
* **Object-Level Check**:
  * Students can only query/mutate resources where `studentId === req.user.student.id`.
  * Faculty can only mutate coursework and grades for sections where `teacherId === req.user.teacher.id`.
* **Multi-Tenant Filter**: Always inject `institutionId` and `campusId` from the authenticated user token into where clauses.

## 3. Audit Logging Requirement
* Any mutation affecting permissions, user active status, academic standing, or financial balances must invoke `AuditService.logMutation(...)` within the same execution cycle.
