# Backup, Disaster Recovery & High Availability Specification

This document defines the disaster recovery (DR) strategy, automated backup schedules, replication topologies, and business continuity protocols for the University / College ERP.

---

## 1. Recovery Objectives

* **Recovery Point Objective (RPO)**: $\le 5\text{ minutes}$ (Maximum tolerable data loss in disaster).
* **Recovery Time Objective (RTO)**: $\le 30\text{ minutes}$ (Maximum tolerable system downtime).

---

## 2. PostgreSQL Backup Strategy

### 2.1 Continuous Archiving & Point-in-Time Recovery (PITR)
* **Write-Ahead Logging (WAL)**: Continuous WAL streaming to off-site cloud object storage (AWS S3 Glacier / Cloudflare R2).
* Enables exact second-level point-in-time recovery for accidental data corruption or table drop scenarios.

### 2.2 Automated Snapshot Schedule
* **Daily Full Physical Backup**: Executed at 02:00 AM UTC with `pg_dump` compressed format.
* **Hourly Incremental Snapshots**: Volume-level storage snapshots retained for 30 days.
* **Monthly Archival Backups**: Stored in immutable, WORM-compliant storage retained for 7 years for academic compliance.

---

## 3. High Availability & Failover Topology

```
Primary Database (Write Master)
        │
        ├── Sync Stream ──> [ Standby Replica 1 ] (Same Region - Automatic Failover)
        │
        └── Async Stream ─> [ Read Replica 2 ]    (Analytics & Custom Reports)
        │
        └── Async Stream ─> [ Cross-Region Standby ] (Disaster Recovery Site)
```

* **Automated Failover**: Managed via Patroni / AWS RDS Multi-AZ.
* Health monitor initiates automatic master promotion within 60 seconds of hardware failure.

---

## 4. Disaster Recovery Runbook & Drill Procedures

1. **Detection & Triage**: PagerDuty alert triggered on 3 consecutive failed health checks.
2. **DNS Shift**: Global Traffic Manager switches DNS records to secondary DR cluster.
3. **Database Promotion**: Promote cross-region read replica to read-write primary.
4. **Validation**: Run automated smoke test suite to verify student, grade, and financial records integrity.
5. **Quarterly DR Simulation**: Mandated quarterly simulated recovery drill to validate RTO $\le 30\text{ minutes}$.
