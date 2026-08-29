# Module Rules: LMS, Assessments & Cloud Storage / Media Streaming

## 1. Coursework Submissions
* **Due Date Enforcement**: If `submittedAt > Assignment.dueDate`, the submission must be flagged as `isLate = true`.
* **AWS S3 File Storage**: All submission attachments must be validated for allowed MIME types (PDF, ZIP, DOCX) and maximum size ($25\text{ MB}$). Files are stored with pre-signed S3 keys under `academic/submissions/{studentId}/`.

## 2. Timed Online Quizzes
* When a student begins a quiz (`POST /quizzes/:id/attempt`):
  * Check that `isPublished = true` and current time is within quiz window.
  * Initialize `QuizAttempt` with `startedAt = now()`.
* When submitting quiz answers:
  * Validate that elapsed time ($\text{submittedAt} - \text{startedAt}$) does not exceed $\text{durationMinutes} + 2\text{ min grace period}$.
  * Auto-grade MCQ / True-False questions against `QuizOption.isCorrect`.

## 3. Grade Weighting & Approval Invariants
* The total components of course evaluation must equal $100\%$:
  $$\text{Total Weight} = \text{Assignments}(10\%) + \text{Quizzes}(10\%) + \text{Midterm}(30\%) + \text{Final}(50\%) = 100\%$$
* Marks submitted by teachers remain in draft status until the `Exam Controller` executes `POST /grades/approve-final`, which locks all records and prevents post-publication tampering.

## 4. Cloud Storage (AWS S3) & Multimedia Streaming (Cloudinary) Invariants
* **AWS S3 Pre-Signed Upload Invariant**: All file uploads must be authorized via time-bounded (15 minutes) pre-signed PUT URLs. S3 secret credentials must never be exposed to the client application.
* **Pre-Signed Download Authorization**: Academic course materials (lecture PDFs, lab guides, past exams) require authenticated pre-signed GET requests with a 1-hour expiration window.
* **Cloudinary Streaming Delivery**: High-definition video lectures and lab walkthroughs must be transcoded with adaptive HLS/MP4 streaming and cached globally across Cloudinary CDN edge nodes.
* **Student File Submission Verification**: When a student records an assignment submission (`POST /api/v1/student/lms/assignments/:id/submit`), verify that the S3 file key belongs to the authenticated student's tenant path before persisting into PostgreSQL.
