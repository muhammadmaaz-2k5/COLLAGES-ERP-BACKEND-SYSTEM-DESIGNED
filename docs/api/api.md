# University / College Management ERP — Complete REST API Specification

This document provides the complete API specification for the University / College Management ERP system, designed against the frozen Prisma schema ([backend/schema.prisma](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/backend/schema.prisma)) and the Master System ERD ([erd.mermaid](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/erd.mermaid)).

---

## 1. Global Conventions & Standards

### Base URL
```
https://api.university-erp.edu/api/v1
```

### Standard Headers
```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
Content-Type: application/json
Accept: application/json
X-Institution-Id: <INSTITUTION_ID>
```

### Standard Response Envelope

#### Success Response (`200 OK`, `201 Created`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Resource fetched successfully",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "totalRecords": 150,
    "totalPages": 8
  }
}
```

#### Error Response (`400`, `401`, `403`, `404`, `422`, `500`)
```json
{
  "success": false,
  "statusCode": 403,
  "error": {
    "code": "FORBIDDEN_SCOPE",
    "message": "You do not have permission to access records outside your assigned department.",
    "details": null
  },
  "timestamp": "2026-08-26T12:00:00.000Z"
}
```

---

## 2. API Endpoints by Domain Module

---

### Module 01: Identity, IAM & System Admin
**Path**: `/api/v1/auth`, `/api/v1/users`, `/api/v1/announcements`, `/api/v1/notifications`

| Method | Endpoint | RBAC Role | Description |
|---|---|---|---|
| `POST` | `/auth/login` | Public | Authenticates user with email & password; returns JWT token + user profile. |
| `POST` | `/auth/refresh` | Public | Refreshes expired access token using httpOnly refresh token. |
| `POST` | `/auth/logout` | Authenticated | Invalidates current refresh token session. |
| `GET` | `/auth/me` | Authenticated | Retrieves current authenticated identity, role, and permissions. |
| `POST` | `/auth/change-password`| Authenticated | Updates current user password. |
| `GET` | `/users` | `SUPER_ADMIN`, `ADMIN` | Lists users with role, status, and department filters. |
| `POST` | `/users` | `SUPER_ADMIN` | Creates user credentials and assigns role. |
| `PATCH` | `/users/:id/status` | `SUPER_ADMIN`, `ADMIN` | Activates / deactivates a user account. |
| `GET` | `/announcements` | Authenticated | Lists published announcements scoped to user's department/program/semester. |
| `POST` | `/announcements` | `ADMIN`, `SUPER_ADMIN`| Publishes a new announcement with target scope & attachment. |
| `GET` | `/notifications` | Authenticated | Fetches user's in-app notifications with unread counts. |
| `PATCH` | `/notifications/:id/read`| Authenticated | Marks notification as read. |
| `GET` | `/audit-logs` | `SUPER_ADMIN` | Queries immutable security audit trail with date/actor filters. |

---

### Module 02: Campus Infrastructure & Facilities
**Path**: `/api/v1/campuses`, `/api/v1/buildings`, `/api/v1/rooms`, `/api/v1/facilities`

| Method | Endpoint | RBAC Role | Description |
|---|---|---|---|
| `GET` | `/campuses` | Authenticated | Lists all institution campuses. |
| `POST` | `/campuses` | `SUPER_ADMIN` | Creates a new branch campus. |
| `GET` | `/buildings` | Authenticated | Lists buildings by campus. |
| `GET` | `/rooms` | Authenticated | Lists classrooms, labs, lecture halls, and offices with capacity filters. |
| `POST` | `/rooms/bookings` | `TEACHER`, `STAFF`, `ADMIN` | Reserves a room for a seminar, event, or thesis defense. |
| `GET` | `/rooms/bookings` | Authenticated | Lists room availability and reservations for a given date range. |
| `GET` | `/assets` | `ADMIN`, `STAFF` | Lists physical & IT assets by room location and category. |
| `POST` | `/maintenance` | Authenticated | Raises a maintenance request for facility or asset repairs. |
| `PATCH` | `/maintenance/:id/status`| `ADMIN`, `STAFF` | Updates work order progress (`IN_PROGRESS`, `RESOLVED`, `CLOSED`). |

---

### Module 03: Academic Core & Curriculum
**Path**: `/api/v1/departments`, `/api/v1/programs`, `/api/v1/courses`, `/api/v1/semesters`, `/api/v1/offerings`

| Method | Endpoint | RBAC Role | Description |
|---|---|---|---|
| `GET` | `/departments` | Authenticated | Lists academic departments. |
| `GET` | `/programs` | Authenticated | Lists degree programs (e.g. BSCS, BBA) by department. |
| `GET` | `/programs/:id/curriculum` | Authenticated | Gets complete degree roadmap & required courses by semester. |
| `GET` | `/courses` | Authenticated | Lists course catalog with credit hours & prerequisite DAG graph. |
| `POST` | `/courses` | `ADMIN`, `SUPER_ADMIN` | Creates course in catalog with lecture/lab hours and syllabus. |
| `POST` | `/courses/:id/prerequisites`| `ADMIN` | Sets hard or co-requisite course dependencies. |
| `GET` | `/semesters` | Authenticated | Lists academic terms (`Fall 2026`, `Spring 2027`) with active flag. |
| `GET` | `/offerings` | Authenticated | Lists scheduled course offerings for a semester with section capacities. |
| `POST` | `/offerings` | `ADMIN` | Opens a course offering section and assigns primary instructor. |
| `GET` | `/offerings/:id/timetable` | Authenticated | Gets weekly timetable slots (Day, Time, Room) for an offering. |
| `POST` | `/offerings/:id/materials` | `TEACHER` | Uploads lecture slides, syllabus, or course reading materials. |

---

### Module 04: HR & Workforce Management
**Path**: `/api/v1/employees`, `/api/v1/leaves`, `/api/v1/payroll`, `/api/v1/staff-attendance`

| Method | Endpoint | RBAC Role | Description |
|---|---|---|---|
| `GET` | `/employees` | `HR_MANAGER`, `ADMIN` | Lists faculty and administrative staff with department filters. |
| `GET` | `/employees/:id` | `HR_MANAGER`, Self | Gets complete employee record, specialization, and designation. |
| `POST` | `/employees` | `HR_MANAGER` | Onboards new faculty or staff member. |
| `GET` | `/leaves/balances` | Authenticated | Gets employee's annual leave quota (Annual, Sick, Casual). |
| `POST` | `/leaves/requests` | Authenticated | Submits employee leave request with reason & dates. |
| `PATCH` | `/leaves/requests/:id/approve` | `HR_MANAGER`, `ADMIN` | Approves or rejects pending leave request. |
| `POST` | `/staff-attendance/clock-in` | Authenticated | Records biometric / manual daily attendance check-in. |
| `GET` | `/payroll/slips` | `HR_MANAGER`, `ACCOUNTANT` | Lists monthly salary slips by department and year/month. |
| `GET` | `/payroll/slips/my` | Authenticated | Gets employee's personal salary slips and tax deductions. |

---

### Module 05: Student Profile & Lifecycle
**Path**: `/api/v1/students`

| Method | Endpoint | RBAC Role | Description |
|---|---|---|---|
| `GET` | `/students` | `ADMIN`, `TEACHER`, `ACCOUNTANT` | Lists students with program, semester, and standing filters. |
| `GET` | `/students/:id` | `ADMIN`, `TEACHER`, `STUDENT` (Self) | Gets full academic profile, roll number, CGPA, and admission date. |
| `PATCH` | `/students/:id/profile` | `STUDENT` (Self), `ADMIN` | Updates contact info, emergency contacts, and profile picture. |
| `GET` | `/students/:id/guardian` | `ADMIN`, `STUDENT` (Self) | Gets parent / guardian details and contact numbers. |
| `GET` | `/students/:id/documents` | `STUDENT` (Self), `ADMIN` | Lists official digital documents (ID Card, Admission Letter, Verification QR). |

---

### Module 06: Admissions & Merit Selection
**Path**: `/api/v1/admissions`

| Method | Endpoint | RBAC Role | Description |
|---|---|---|---|
| `POST` | `/admissions/apply` | Public | Submits prospective applicant admission application. |
| `GET` | `/admissions/applications` | `ADMISSIONS_OFFICER`, `ADMIN` | Lists candidate applications by program & status. |
| `GET` | `/admissions/tests` | `ADMISSIONS_OFFICER`, `ADMIN` | Lists entrance test schedules and venues. |
| `POST` | `/admissions/tests/results` | `ADMISSIONS_OFFICER` | Uploads entrance test scores for candidates. |
| `GET` | `/admissions/merit-list/:programId` | Public / `ADMISSIONS_OFFICER` | Computes and displays ranked merit list. |
| `POST` | `/admissions/applications/:id/admit` | `ADMISSIONS_OFFICER` | Converts accepted applicant into registered `Student` profile. |

---

### Module 07: LMS, Assessments & Examinations
**Path**: `/api/v1/lms`, `/api/v1/exams`, `/api/v1/grades`

| Method | Endpoint | RBAC Role | Description |
|---|---|---|---|
| `GET` | `/lms/enrollments/my` | `STUDENT` | Gets courses student is currently enrolled in. |
| `POST` | `/lms/enrollments/register` | `STUDENT` | Registers student for semester course sections (validates prerequisites). |
| `GET` | `/lms/attendance/my` | `STUDENT` | Gets subject-wise attendance percentage and absence log. |
| `POST` | `/lms/attendance/mark` | `TEACHER` | Marks daily class session attendance for enrolled students. |
| `GET` | `/lms/assignments` | Authenticated | Lists assignments for a course offering with due dates. |
| `POST` | `/lms/assignments` | `TEACHER` | Creates coursework assignment with rubric & attachments. |
| `POST` | `/lms/assignments/:id/submit` | `STUDENT` | Submits student homework file / text solution. |
| `POST` | `/lms/assignments/submissions/:id/grade`| `TEACHER` | Grades assignment submission and provides feedback. |
| `GET` | `/lms/quizzes` | Authenticated | Lists scheduled quizzes for an offering. |
| `POST` | `/lms/quizzes/:id/attempt` | `STUDENT` | Starts timed quiz attempt and fetches questions. |
| `POST` | `/lms/quizzes/attempts/:id/submit` | `STUDENT` | Submits answers for automated/manual grading. |
| `GET` | `/exams/datesheets` | Authenticated | Gets semester examination timetable schedule. |
| `GET` | `/exams/results/my` | `STUDENT` | Gets published examination result cards. |
| `GET` | `/grades/transcript/my` | `STUDENT` | Generates official full transcript across all 8+ semesters with CGPA. |
| `GET` | `/storage/s3/presigned-upload` | Authenticated | Generates pre-signed S3 upload URL for assignments & documents. |
| `GET` | `/storage/s3/presigned-download` | Authenticated | Generates pre-signed S3 download URL for private academic files. |
| `GET` | `/storage/cloudinary/signature` | Authenticated | Generates signed signature for client-side direct media uploads. |
| `GET` | `/storage/course-materials/:offeringId` | Authenticated | Lists AWS S3 course documents (Syllabus, Slides, Lab Handouts, Past Papers). |
| `GET` | `/storage/video-lectures/:offeringId` | Authenticated | Lists Cloudinary HD recorded video lectures and lab walkthrough streams. |

---

### Module 08: Finance, Billing & General Ledger
**Path**: `/api/v1/finance`

| Method | Endpoint | RBAC Role | Description |
|---|---|---|---|
| `GET` | `/finance/fee-structures` | `ACCOUNTANT`, `ADMIN` | Lists program semester fee breakdown templates. |
| `GET` | `/finance/challans/my` | `STUDENT` | Lists student's fee invoices (Paid, Unpaid, Overdue). |
| `GET` | `/finance/challans/:id` | Authenticated | Downloads itemized PDF Fee Challan voucher. |
| `POST` | `/finance/challans/generate-batch`| `ACCOUNTANT` | Generates term fee challans for all enrolled students. |
| `POST` | `/finance/payments` | `ACCOUNTANT`, `STUDENT` | Submits offline bank receipt reference or triggers online gateway. |
| `PATCH` | `/finance/payments/:id/verify` | `ACCOUNTANT` | Verifies bank deposit and marks challan as `PAID`. |
| `GET` | `/finance/scholarships` | `ACCOUNTANT`, `ADMIN` | Lists financial aid programs and awarded scholarships. |
| `GET` | `/finance/ledger/accounts` | `ACCOUNTANT` | Gets Chart of Accounts and General Ledger balance sheet. |
| `GET` | `/finance/ledger/transactions` | `ACCOUNTANT` | Lists double-entry income and expense ledger entries. |

---

### Module 09: Library Automation System
**Path**: `/api/v1/library`

| Method | Endpoint | RBAC Role | Description |
|---|---|---|---|
| `GET` | `/library/books` | Authenticated | Searches book catalog by title, author, ISBN, or category. |
| `POST` | `/library/books` | `LIBRARIAN` | Catalogs new book title and generates barcoded copies. |
| `GET` | `/library/memberships/my` | `STUDENT`, `TEACHER` | Gets borrowing status and currently checked-out books. |
| `POST` | `/library/issues/checkout` | `LIBRARIAN` | Issues book copy to library member. |
| `POST` | `/library/issues/return` | `LIBRARIAN` | Processes book return and calculates overdue fines if late. |
| `POST` | `/library/fines/:id/pay` | `LIBRARIAN` | Settles library overdue fine. |

---

### Module 10: Hostel & Residential Life
**Path**: `/api/v1/hostels`

| Method | Endpoint | RBAC Role | Description |
|---|---|---|---|
| `GET` | `/hostels` | Authenticated | Lists hostel buildings (Boys/Girls/Faculty) and capacities. |
| `GET` | `/hostels/:id/rooms` | `WARDEN`, `ADMIN` | Lists dormitory rooms and available bed slots. |
| `POST` | `/hostels/allocations` | `WARDEN` | Assigns student to a hostel room and bed number. |
| `GET` | `/hostels/allocations/my` | `STUDENT` | Gets student's active hostel room allocation and rent details. |
| `POST` | `/hostels/allocations/:id/checkout`| `WARDEN` | Processes checkout and vacates bed. |

---

### Module 11: Campus Transport Fleet
**Path**: `/api/v1/transport`

| Method | Endpoint | RBAC Role | Description |
|---|---|---|---|
| `GET` | `/transport/routes` | Authenticated | Lists transport bus routes, pickup stops, and schedules. |
| `GET` | `/transport/vehicles` | `ADMIN`, `DRIVER` | Lists fleet buses, seating capacities, and assigned drivers. |
| `POST` | `/transport/subscriptions` | `STUDENT`, `EMPLOYEE` | Subscribes to transport route bus pass for a semester. |
| `GET` | `/transport/subscriptions/my` | Authenticated | Gets active bus pass QR code and designated pickup stop. |

---

### Module 12: Career Placements & Research
**Path**: `/api/v1/placements`, `/api/v1/research`

| Method | Endpoint | RBAC Role | Description |
|---|---|---|---|
| `GET` | `/placements/jobs` | Authenticated | Lists on-campus job and internship recruitment postings. |
| `POST` | `/placements/jobs` | `ADMIN` | Posts company recruitment opening. |
| `POST` | `/placements/jobs/:id/apply` | `STUDENT` | Submits job application with resume & cover letter. |
| `GET` | `/placements/applications/my` | `STUDENT` | Tracks student's job interview & offer status. |
| `GET` | `/research/projects` | Authenticated | Lists university research projects and grant funding. |
| `GET` | `/research/publications` | Authenticated | Lists faculty & student publications with DOI links. |

---

## 3. Module 1: Student Portal Endpoint Mapping

The following endpoints directly support the **10 Phases of Module 1 (Student Portal)**:

```
STUDENT PORTAL API CONTRACT
├── Phase 1 (Auth & Profile)       -> GET  /api/v1/auth/me
│                                     GET  /api/v1/students/:id
│                                     PATCH/api/v1/students/:id/profile
├── Phase 2 (Dashboard Overview)    -> GET  /api/v1/students/:id
│                                     GET  /api/v1/lms/enrollments/my
│                                     GET  /api/v1/notifications
├── Phase 3 (Course Registration)   -> GET  /api/v1/offerings?semester=current
│                                     POST /api/v1/lms/enrollments/register
├── Phase 4 (Transcript & CGPA)     -> GET  /api/v1/grades/transcript/my
├── Phase 5 (Attendance Tracker)    -> GET  /api/v1/lms/attendance/my
├── Phase 6 (LMS Assessments)       -> GET  /api/v1/lms/assignments
│                                     POST /api/v1/lms/assignments/:id/submit
│                                     GET  /api/v1/lms/quizzes
│                                     POST /api/v1/lms/quizzes/:id/attempt
├── Phase 7 (Exams & Results)       -> GET  /api/v1/exams/datesheets
│                                     GET  /api/v1/exams/results/my
├── Phase 8 (Fee Management)        -> GET  /api/v1/finance/challans/my
│                                     GET  /api/v1/finance/challans/:id
│                                     POST /api/v1/finance/payments
├── Phase 9 (Timetable Grid)        -> GET  /api/v1/offerings/my/timetable
└── Phase 10 (Docs & Communication) -> GET  /api/v1/students/:id/documents
                                      GET  /api/v1/announcements
                                      GET  /api/v1/messages/inbox
```

---

## 4. Module 7: Faculty (Teacher) Portal API Mapping

```
FACULTY PORTAL API CONTRACT (/api/v1/faculty)
├── GET  /dashboard                                  -> Aggregated teaching workload & schedule
├── GET  /courses/:offeringId/roster                -> Enrolled student roster with attendance & marks
├── POST /attendance/mark                            -> Bulk mark session attendance (PRESENT/ABSENT/LATE)
├── POST /assessments/assignments                    -> Create coursework assignment
├── GET  /assessments/assignments/:id/submissions    -> View student submissions
├── POST /assessments/assignments/submissions/:id/grade -> Submit rubric score and feedback
├── POST /assessments/quizzes                        -> Create timed online quiz
└── POST /grades/submit-marks                        -> Transmit sessional marks to Exam Controller
```

---

## 5. Module 7: Examination Controller Portal API Mapping

```
EXAM CONTROLLER API CONTRACT (/api/v1/exam-controller)
├── GET  /dashboard                                  -> Exam terms, datesheets & grade submission status
├── POST /datesheets                                 -> Publish scheduled paper slot in semester datesheet
└── POST /grades/:offeringId/lock-approve            -> Officially approve and permanently lock final grades
```

