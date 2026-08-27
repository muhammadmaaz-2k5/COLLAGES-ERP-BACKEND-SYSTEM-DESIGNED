# Deployment, Infrastructure & DevOps Specification

This document details the containerization, cloud infrastructure, CI/CD deployment pipelines, environment configurations, and high-availability architecture for the University / College ERP.

---

## 1. Infrastructure Architecture

```
Internet / End Users
        │
        ▼
[ Cloudflare / AWS CloudFront ] ──> (DDoS Shield, SSL Termination, Static Asset CDN)
        │
        ▼
[ NGINX Ingress Controller / Reverse Proxy ]
        │
   ┌────┴──────────────────────────┐
   ▼                               ▼
[ Frontend Web App ]     [ Backend API Cluster ]
(Next.js / NGINX SPA)    (Node.js / Express Pods - Auto-scaled)
                                   │
                 ┌─────────────────┼──────────────────┐
                 ▼                 ▼                  ▼
          [ PostgreSQL 16 ]  [ Redis 7 Cluster ]  [ S3 Object Store ]
          (Primary + Replica)(Cache & Queues)     (Transcripts, PDFs, Photos)
```

---

## 2. Docker & Containerization

### 2.1 Backend Dockerfile (`backend/Dockerfile`)
* Multi-stage build (Builder stage $\rightarrow$ Production runner stage).
* Non-root user execution (`USER node`) for hardened security.
* Bundled with Prisma client binary engines.

### 2.2 Docker Compose for Local / Staging (`docker-compose.yml`)
* Services: `backend`, `frontend`, `postgres`, `redis`, `minio` (local S3 emulator).

---

## 3. Environment Variables Configuration

| Variable | Environment | Description |
|---|---|---|
| `DATABASE_URL` | Production / Staging | PostgreSQL connection string with SSL mode enabled. |
| `REDIS_URL` | Production / Staging | Redis cluster connection URI for BullMQ & session store. |
| `JWT_PRIVATE_KEY` | Production | PEM-encoded RSA Private key for access token signing. |
| `JWT_PUBLIC_KEY` | Production | PEM-encoded RSA Public key for access token verification. |
| `S3_BUCKET_NAME` | Production | AWS S3 / Cloudflare R2 bucket for official documents. |
| `SMTP_HOST` / `SMTP_PORT` | Production | SMTP credentials for automated email and alert notifications. |

---

## 4. Database Migration & Zero-Downtime Deployment Strategy

1. **Migration Pre-flight**: Run `prisma migrate deploy` in a separate initialization job before updating backend pods.
2. **Rolling Updates (Kubernetes / ECS)**:
   * Max Surge: $25\%$, Max Unavailable: $0\%$.
   * Zero downtime guaranteed by maintaining backwards-compatible database column migrations.
3. **Health Checks**:
   * Liveness Probe: `GET /api/v1/health/liveness` (returns 200 OK if server responsive).
   * Readiness Probe: `GET /api/v1/health/readiness` (verifies PostgreSQL and Redis connections active).
