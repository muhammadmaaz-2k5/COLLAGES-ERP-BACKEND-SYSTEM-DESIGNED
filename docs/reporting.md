# Analytics, BI & Custom Reporting Engine Specification

This document details the dynamic reporting architecture, data aggregation queries, custom report builder, export formats, and analytics dashboards for the University / College ERP.

---

## 1. Analytics Architecture & Design Principle

1. **Single Source of Truth**: Standard operational analytics (CGPA distributions, fee collection totals, attendance percentages) are computed on-demand from operational tables to avoid data drift.
2. **Dynamic Custom Reports**: The `CustomReport` entity persists user-configured dimensions, filters, groupings, and visualization chart types without requiring schema alterations.
3. **Read Replica Routing**: All heavy analytical queries are routed to dedicated PostgreSQL Read Replicas to protect primary transactional throughput.

---

## 2. Standard Analytics Dashboards

### 2.1 Academic & Student Success Dashboard
* **Metrics**: Average CGPA by Department, Grade Distribution Curves, Course Drop Rates, At-Risk Student Early Warning (CGPA $< 2.00$, Attendance $< 75\%$).
* **Semester Progression Funnel**: Retention rates from Semester 1 through Graduation.

### 2.2 Financial & Revenue Dashboard
* **Metrics**: Total Receivables vs. Collected Revenue, Overdue Challan Aging (30/60/90 days), Department-wise Tuition Income vs. Operational Expenses.
* **Scholarship Impact**: Total Aid Disbursed vs. Academic Performance correlation.

### 2.3 Faculty & Operational Performance
* **Metrics**: Student-to-Teacher Ratio, Average Workload Hours per Faculty Rank, Room Utilization Heatmaps (classrooms/labs occupancy per day of week).

---

## 3. Dynamic Custom Report Builder (`CustomReport`)

### Query Configuration Schema (`CustomReport.config`)
```json
{
  "domain": "STUDENT",
  "dimensions": ["program.name", "currentSemester.name", "gender"],
  "metrics": [
    { "field": "cgpaCache", "aggregation": "AVG" },
    { "field": "id", "aggregation": "COUNT" }
  ],
  "filters": [
    { "field": "academicStanding", "operator": "EQUALS", "value": "GOOD_STANDING" },
    { "field": "admissionDate", "operator": "GTE", "value": "2024-01-01" }
  ],
  "sortBy": [{ "field": "avg_cgpa", "direction": "DESC" }],
  "chartType": "BAR"
}
```

---

## 4. Export Formats & Automated Delivery

* **Export Formats**: PDF (with official letterhead), CSV, Excel (`.xlsx`), JSON.
* **Scheduled Cron Reports**: Custom reports can be scheduled for automated weekly / monthly email delivery to Deans, HODs, and Accountants via background worker.
