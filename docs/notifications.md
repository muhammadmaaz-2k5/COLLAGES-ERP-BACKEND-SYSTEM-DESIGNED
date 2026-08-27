# Multi-Channel Notification & Messaging Specification

This document details the event-driven notification architecture, user preferences, delivery channels (In-App, Email, SMS, Push), and direct peer messaging system for the University / College ERP.

---

## 1. Notification Architecture

```
Domain Event Trigger (e.g. "Fee Challan Generated", "Grade Published")
                    │
                    ▼
       [ Notification Dispatcher ]
                    │
   ┌────────────────┼────────────────┐
   ▼                ▼                ▼
[ In-App Alert ]  [ Email Queue ]  [ SMS / Push Queue ]
(PostgreSQL DB)   (BullMQ Worker)  (BullMQ Worker)
   │                │                │
   ▼                ▼                ▼
WebSockets / SSE    SMTP / SendGrid  Twilio / FCM
```

---

## 2. Notification Channels & Provider Matrix

| Channel | Provider / Protocol | Latency Target | Use Cases |
|---|---|---|---|
| **In-App Alerts** | PostgreSQL `Notification` + Server-Sent Events (SSE) | Real-time ($< 500\text{ms}$) | General updates, coursework comments, schedule adjustments. |
| **Email** | SMTP / SendGrid / AWS SES | Delivery within 60s | Official result cards, PDF fee challans, admission offer letters. |
| **SMS** | Twilio / MessageBird / Local Gateway | High Priority ($< 10\text{s}$) | Emergency campus closures, OTP logins, overdue fee warnings. |
| **Mobile Push** | Firebase Cloud Messaging (FCM) / Apple APNs | Real-time ($< 2\text{s}$) | Lecture room changes, assignment due date reminders. |

---

## 3. User Notification Preferences (`NotificationSetting`)

Users configure granular opt-ins stored in `NotificationSetting`:
* `emailEnabled`: Global email toggle.
* `smsEnabled`: Critical SMS alert toggle.
* `pushEnabled`: Mobile push notifications toggle.
* Category toggles: `examAlerts`, `feeAlerts`, `resultAlerts`, `attendanceAlerts`, `leaveAlerts`.

---

## 4. Direct Peer Messaging (`Message`)

* **Scope**: Secure student-to-teacher, student-to-student, and staff-to-faculty internal messaging.
* **Features**:
  * Rich-text support, file attachments, read receipts (`isRead`, `sentAt`).
  * Threaded conversations and inbox categorization.
  * Role-based spam protection (students cannot blast mass messages to all faculty).

---

## 5. Campus Announcements Engine (`Announcement`)

* **Targeted Broadcasting**: Scoped to `UNIVERSITY`, `CAMPUS`, `DEPARTMENT`, `PROGRAM`, `SEMESTER`, or `ROLE`.
* **Lifecycle**: `publishedAt` with optional automatic expiration via `expiresAt`.
* **Attachments**: Supports official circular PDFs, flyers, and event banners.
