# Modular Database ERD Architecture

This directory breaks down the **Master ERP System Database Diagram** ([erd.mermaid](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/erd.mermaid)) into **12 Domain-Driven Bounded Contexts**.

Splitting the monolith into modular diagrams makes domain logic, onboarding, team ownership, and ongoing feature development drastically simpler to reason about and maintain.

---

## Bounded Contexts Index

| # | Bounded Context | Module File | Key Entities |
|---|---|---|---|
| 01 | **Identity, Access & Multi-Tenancy** | [01_identity_iam.mermaid](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/erd/01_identity_iam.mermaid) | `Institution`, `Campus`, `User`, `RolePermission`, `AuditLog`, `Announcement` |
| 02 | **Campus Infrastructure & Assets** | [02_campus_facilities.mermaid](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/erd/02_campus_facilities.mermaid) | `Building`, `Room`, `RoomBooking`, `Asset`, `MaintenanceRequest` |
| 03 | **Academic Core & Curriculum** | [03_academic_curriculum.mermaid](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/erd/03_academic_curriculum.mermaid) | `Department`, `Program`, `Course`, `CoursePrerequisite`, `Semester`, `CourseOffering`, `TimetableSlot` |
| 04 | **HR & Faculty Workforce** | [04_people_hr.mermaid](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/erd/04_people_hr.mermaid) | `Employee`, `Teacher`, `Staff`, `Driver`, `LeaveBalance`, `LeaveRequest`, `SalarySlip`, `StaffAttendance` |
| 05 | **Student Profile & Lifecycle** | [05_student_lifecycle.mermaid](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/erd/05_student_lifecycle.mermaid) | `Student`, `GuardianInfo`, `EmergencyContact`, `Document` |
| 06 | **Admissions & Merit Selection** | [06_admissions.mermaid](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/erd/06_admissions.mermaid) | `Applicant`, `Application`, `AdmissionTest`, `AdmissionTestResult`, `MeritListEntry` |
| 07 | **Assessments, LMS & Examinations** | [07_assessments_grading.mermaid](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/erd/07_assessments_grading.mermaid) | `Enrollment`, `Attendance`, `Assignment`, `Quiz`, `QuizAttempt`, `ExamTerm`, `Exam`, `ExamResult` |
| 08 | **Finance, Billing & Ledger** | [08_finance_billing.mermaid](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/erd/08_finance_billing.mermaid) | `FeeStructure`, `FeeChallan`, `Payment`, `ScholarshipAward`, `Account`, `Transaction` |
| 09 | **Library Automation** | [09_library.mermaid](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/erd/09_library.mermaid) | `Book`, `BookCopy`, `LibraryMember`, `BookIssue`, `Fine` |
| 10 | **Hostel & Residential Life** | [10_hostel.mermaid](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/erd/10_hostel.mermaid) | `Hostel`, `HostelRoom`, `HostelAllocation` |
| 11 | **Fleet Transport Management** | [11_transport.mermaid](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/erd/11_transport.mermaid) | `Vehicle`, `Driver`, `Route`, `RouteStop`, `TransportSubscription` |
| 12 | **Placement & Research** | [12_placement_research.mermaid](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/erd/12_placement_research.mermaid) | `Company`, `JobPosting`, `PlacementApplication`, `ResearchProject`, `Publication` |

---

## Architectural Principles

1. **One Master Identity Spine**: All actors authenticate via `User` and extend either `Student` (learners) or `Employee` (workforce).
2. **Loosely Coupled, Highly Cohesive**: Peripheral modules (Library, Transport, Hostel, Placements, Research) connect to the central spine through foreign key references, allowing any module to be isolated, mocked, or deployed modularly.
3. **Master ERD**: The complete holistic diagram across all 12 domains is located at [erd.mermaid](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/erd.mermaid).
