# Audit Logging & Compliance Protocol

This document establishes the audit logging taxonomy, security event monitoring, data immutability guarantees, and regulatory compliance standards for the University / College ERP.

---

## 1. Audit Taxonomy & Schema

All security-critical and financial operations automatically insert a record into the `AuditLog` model in [backend/schema.prisma](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/backend/schema.prisma):

```typescript
interface AuditLogPayload {
  userId: string;          // Authenticated Actor ID
  action: string;          // Action Code (e.g. "GRADE.UPDATED", "FEE.WAIVED")
  entityType: string;      // Target Model (e.g. "Enrollment", "FeeChallan")
  entityId: string;        // Target Record ID
  ipAddress: string;       // Client IP (IPv4 / IPv6)
  userAgent: string;       // Browser / Device User Agent
  metadata: {
    previousState?: Record<string, any>;
    newState?: Record<string, any>;
    reason?: string;
  };
  createdAt: Date;
}
```

---

## 2. Monitored Events Matrix

| Module | Action Identifier | Triggers & Severity |
|---|---|---|
| **Identity & Access** | `AUTH.LOGIN_FAILED` | 5+ consecutive login failures (Medium). |
| | `AUTH.ROLE_CHANGED` | Modifying user role permissions (High). |
| | `USER.DEACTIVATED` | Suspending or terminating user access (High). |
| **Academics & Grades**| `GRADE.SUBMITTED` | Teacher submits provisional grades (Low). |
| | `GRADE.APPROVED` | Exam Controller approves official result (High). |
| | `GRADE.ALTERED_POST_LOCK`| Changing grade after official publication (Critical). |
| **Finance & Billing** | `FEE.CHALLAN_GENERATED` | Batch billing run (Low). |
| | `FEE.PAYMENT_VERIFIED` | Reconciling bank payments (Medium). |
| | `FEE.WAIVER_APPLIED` | Applying scholarship / manual fee discount (Critical). |
| **HR & Payroll** | `PAYROLL.DISBURSED` | Executing salary disbursements (High). |
| | `LEAVE.APPROVED` | Approving employee leave quota (Low). |

---

## 3. Immutability & Anti-Tampering

* **Database Constraints**: `AuditLog` table has strict `INSERT`-only permissions. `UPDATE` and `DELETE` queries are revoked at the database role level.
* **WORM Log Shipping**: Audit logs are streamed in real-time to Amazon S3 Object Lock / Elasticsearch with Write Once, Read Many (WORM) retention for 7 years.
* **Cryptographic Chaining**: Weekly audit hashes computed and signed to verify log integrity.
