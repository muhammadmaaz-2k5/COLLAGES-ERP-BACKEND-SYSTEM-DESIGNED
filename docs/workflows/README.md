# University ERP — End-to-End Business Process Workflows

This directory contains sequence diagrams and flowcharts for all core business operations across the University / College Management ERP.

---

## Workflows Catalog

| # | Business Process Workflow | Diagram File | Primary Actors |
|---|---|---|---|
| 01 | **Student Course Registration & Prerequisite Validation** | [01_student_course_registration.mermaid](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/workflows/01_student_course_registration.mermaid) | Student, Academic Advisor, System Registrar |
| 02 | **Admission Intake, Entrance Exam & Merit Onboarding** | [02_admissions_pipeline.mermaid](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/workflows/02_admissions_pipeline.mermaid) | Applicant, Admissions Officer, Accountant |
| 03 | **Term Fee Challan Generation, Payment & Reconciliation** | [03_fee_billing_payment.mermaid](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/workflows/03_fee_billing_payment.mermaid) | Accountant, Student, Bank Gateway, Ledger |
| 04 | **Examinations, Invigilation, Grading & Transcript Release** | [04_grading_examination.mermaid](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/workflows/04_grading_examination.mermaid) | Exam Controller, Teacher, Student |
| 05 | **Faculty & Staff Leave Application & Quota Approval** | [05_faculty_leave_approval.mermaid](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/workflows/05_faculty_leave_approval.mermaid) | Employee, Department HOD, HR Manager |
| 06 | **Library Book Checkout, Overdue Tracking & Fine Settlement** | [06_library_circulation.mermaid](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/workflows/06_library_circulation.mermaid) | Student / Faculty Member, Librarian |

---

## State Transition Reference
For the exact state machine rules and validation guards accompanying these workflows, refer to [docs/state-machines.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/state-machines.md).
