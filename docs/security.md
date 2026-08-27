# Security & Compliance Specification

This document details the security architecture, authentication mechanisms, authorization policies, data protection protocols, and compliance standards for the University / College Management ERP.

---

## 1. Authentication & Session Management

### 1.1 JWT Token Lifecycle
* **Access Tokens**: Short-lived (15 minutes), signed with `RS256` (Asymmetric Private Key).
  * Payload: `{ userId, email, role, institutionId, campusId, permissions[] }`
* **Refresh Tokens**: Long-lived (7 days), stored in secure `httpOnly`, `SameSite=Strict`, `Secure` cookies.
* **Token Invalidation**: Server-side token blacklisting in Redis upon logout or password reset.

### 1.2 Password & Credential Security
* **Hashing Algorithm**: `Argon2id` or `bcrypt` (work factor 12+).
* **Password Policy**: Minimum 10 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.
* **Rate Limiting & Brute-Force Prevention**:
  * Max 5 failed login attempts per IP/Email within 15 minutes before temporary 30-minute lockout.
  * Captcha challenge enabled after 3 consecutive failures.

---

## 2. Authorization & Tenant Isolation (RBAC + ABAC)

### 2.1 Multi-Tenant Isolation
* Every request is verified against `X-Institution-Id` and `X-Campus-Id` headers.
* Prisma middleware automatically injects tenant and campus filters into database queries to prevent cross-tenant data leakage.

### 2.2 Attribute-Based & Object-Level Scoping
* **Student Isolation**: Queries strictly enforce `studentId === currentSession.student.id`.
* **Teacher Isolation**: Grade and assessment mutations require `courseOffering.teacherId === currentSession.teacher.id`.
* **Warden Isolation**: Hostel allocations restricted to hostels where `hostel.wardenId === currentSession.staff.id`.

---

## 3. Data Protection & Cryptography

### 3.1 Encryption at Rest & in Transit
* **In Transit**: Enforced TLS 1.3 with strict HSTS (`max-age=31536000; includeSubDomains; preload`).
* **At Rest**: Transparent Data Encryption (TDE) on PostgreSQL database volumes (AES-256).
* **Sensitive Columns**: National ID numbers (CNIC/SSN), passport details, and financial bank account numbers encrypted at the application layer using `AES-256-GCM` with envelope encryption.

### 3.2 Digital Credential Verification
* Official transcripts, degree certificates, and ID cards embed cryptographic hashes (`SHA-256`) and signed verification QR codes linking to public verification endpoints (`/verify/:verificationCode`).

---

## 4. Network & Application Defense

* **CORS Policy**: Strict origin allowlist (`https://*.university-erp.edu`).
* **Content Security Policy (CSP)**: `default-src 'self'; script-src 'self' 'nonce-...'; object-src 'none'; frame-ancestors 'none';`
* **SQL Injection Prevention**: Parameterized queries enforced 100% via Prisma ORM.
* **XSS & CSRF Defense**: Input sanitization with DOMPurify on rich text and Double Submit Cookie CSRF tokens for mutating requests.
* **API Rate Limiting**: Global rate limit of 100 requests per minute per IP via Redis token bucket.

---

## 5. Vulnerability Management & Auditing

* **Dependency Scanning**: Automated CI/CD dependency vulnerability scans (`npm audit`, Snyk).
* **SAST / DAST**: Static application security testing integrated into deployment pipelines.
* **Immutable Audit Trail**: All privileged administrative and financial actions logged to `AuditLog`.
