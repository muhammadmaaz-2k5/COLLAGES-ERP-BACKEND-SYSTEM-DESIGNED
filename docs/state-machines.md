# University / College ERP — Complete State Machines Specification

This document defines the lifecycle states, transition triggers, guards, validation rules, and side-effects for all stateful business entities in the University / College Management ERP system.

---

## 1. Admissions Application Lifecycle (`ApplicationStatus`)

```mermaid
stateDiagram-v2
    [*] --> DRAFT : Candidate initiates application
    DRAFT --> APPLIED : Candidate submits with fee & documents
    APPLIED --> UNDER_REVIEW : Admissions officer screens credentials
    UNDER_REVIEW --> SHORTLISTED : Meets minimum eligibility criteria
    UNDER_REVIEW --> REJECTED : Fails eligibility criteria
    SHORTLISTED --> TEST_SCHEDULED : Entrance test slot allocated
    TEST_SCHEDULED --> INTERVIEWED : Test cleared & interview conducted
    INTERVIEWED --> ADMITTED : Appears in published Merit List
    INTERVIEWED --> WAITLISTED : Merit cutoff waitlist
    WAITLISTED --> ADMITTED : Seats available in next merit round
    INTERVIEWED --> REJECTED : Aggregate below threshold
    ADMITTED --> ENROLLED : Admission fee paid & Student profile created
    ADMITTED --> FEES_PENDING : Admission offer sent, awaiting payment
    FEES_PENDING --> ENROLLED : Payment confirmed
    FEES_PENDING --> REJECTED : Offer deadline expired without payment
    ENROLLED --> [*]
    REJECTED --> [*]
```

### Transition Rules & Guards
* **`DRAFT` $\rightarrow$ `APPLIED`**: Requires mandatory fields (CNIC/Passport, prior transcripts, program choice).
* **`ADMITTED` $\rightarrow$ `ENROLLED`**: Triggers atomic creation of `User` (with `STUDENT` role), `Student` profile, and initial semester enrollment.

---

## 2. Course Enrollment & Academic Standing (`EnrollmentStatus` & `AcademicStanding`)

```mermaid
stateDiagram-v2
    [*] --> ENROLLED : Student registers course section
    ENROLLED --> IN_PROGRESS : Semester term commences
    IN_PROGRESS --> PASSED : Final Grade >= D and Total Marks >= 50%
    IN_PROGRESS --> FAILED : Total Marks < 50% or Final Grade = F
    IN_PROGRESS --> WITHDRAWN : Course dropped before withdrawal census date
    IN_PROGRESS --> INCOMPLETE : Extenuating medical / official leave granted
    INCOMPLETE --> PASSED : Supplementary exam / coursework cleared within 1 term
    INCOMPLETE --> FAILED : Incomplete deadline expired without clearance
    FAILED --> REPEATED : Student re-registers in subsequent term
    PASSED --> [*]
    WITHDRAWN --> [*]
```

### Academic Standing Progression
* **`GOOD_STANDING`**: Semester GPA $\ge 2.00$ and CGPA $\ge 2.00$.
* **`PROBATION`**: CGPA drops below $2.00$. Warning issued; max credit hours capped to 12.
* **`SUSPENDED`**: 2 consecutive terms on probation without achieving CGPA $\ge 2.00$.
* **`GRADUATED`**: All degree requirements fulfilled ($100\%$ required credits earned, CGPA $\ge 2.00$).

---

## 3. Fee Billing & Challan Lifecycle (`FeeStatus`)

```mermaid
stateDiagram-v2
    [*] --> UNPAID : Challan generated (Tuition/Hostel/Transport)
    UNPAID --> PARTIAL : Partial payment verified (Paid < Total)
    PARTIAL --> PAID : Remaining balance paid before due date
    UNPAID --> PAID : Full amount verified
    UNPAID --> OVERDUE : Current Date > Due Date (Late fee applied)
    OVERDUE --> PAID : Full amount + Late fee verified
    OVERDUE --> WAIVED : Competent authority approves fee waiver
    UNPAID --> WAIVED : Full scholarship / financial aid applied
    PAID --> REFUNDED : Excess fee deposit / course drop refund approved
    UNPAID --> CANCELLED : Erroneous duplicate voucher voided
    PAID --> [*]
    WAIVED --> [*]
    CANCELLED --> [*]
    REFUNDED --> [*]
```

### Side-Effects & Event Hooks
* **`PAID` Event**: Automatically updates student account ledger, increments `Account` balance, and unlocks course registration / transcript generation.
* **`OVERDUE` Event**: Triggers fine calculation and automated SMS/Email reminders via `Notification`.

---

## 4. Employee Leave Workflow (`LeaveStatus`)

```mermaid
stateDiagram-v2
    [*] --> PENDING : Employee submits leave application
    PENDING --> APPROVED : HOD / HR Manager approves request
    PENDING --> REJECTED : Manager rejects with formal reason
    PENDING --> CANCELLED : Employee cancels prior to start date
    APPROVED --> CANCELLED : Approved leave revoked before start date
    APPROVED --> [*]
    REJECTED --> [*]
    CANCELLED --> [*]
```

### Transition Guards
* **Balance Check**: `totalDays` requested must be $\le$ `LeaveBalance.remainingDays` for that specific `LeaveType` in the current year.
* **Approval Hook**: On `APPROVED`, atomic transaction deducts `totalDays` from `LeaveBalance.usedDays` and `remainingDays`.

---

## 5. Facility Maintenance Work Orders (`MaintenanceStatus`)

```mermaid
stateDiagram-v2
    [*] --> OPEN : Request raised by faculty / staff
    OPEN --> IN_PROGRESS : Work order assigned to technician / contractor
    IN_PROGRESS --> RESOLVED : Repair completed & verified
    RESOLVED --> CLOSED : Facility manager inspects and signs off
    OPEN --> CANCELLED : Duplicate or invalid issue reported
    IN_PROGRESS --> CANCELLED : Replaced by capital asset procurement
    CLOSED --> [*]
    CANCELLED --> [*]
```

---

## 6. Library Book Circulation & Fines (`BookIssueStatus`)

```mermaid
stateDiagram-v2
    [*] --> ISSUED : Librarian checks out available copy to member
    ISSUED --> RETURNED : Book returned on or before due date
    ISSUED --> OVERDUE : Book not returned past due date
    OVERDUE --> RETURNED : Overdue book returned (Generates Fine)
    ISSUED --> LOST : Member / Library flags copy as lost
    OVERDUE --> LOST : Replacement cost + penalty billed
    RETURNED --> [*]
    LOST --> [*]
```

### Fine Calculation Rule
$$\text{Fine Amount} = (\text{Return Date} - \text{Due Date}) \times \text{Daily Fine Rate}$$
Book copy transitions back to `AVAILABLE` upon inspection unless damaged.

---

## 7. Career Placement & Internship Lifecycle (`PlacementStatus`)

```mermaid
stateDiagram-v2
    [*] --> APPLIED : Student applies to company job posting
    APPLIED --> SHORTLISTED : Company recruiter screens resume
    APPLIED --> REJECTED : Application screened out
    SHORTLISTED --> INTERVIEWED : On-campus / virtual interview conducted
    INTERVIEWED --> OFFERED : Official employment offer issued
    INTERVIEWED --> REJECTED : Candidate not selected post-interview
    OFFERED --> JOINED : Student signs and accepts offer
    OFFERED --> DECLINED : Student declines offer for another opportunity
    JOINED --> [*]
    DECLINED --> [*]
    REJECTED --> [*]
```
