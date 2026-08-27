# Module Rules: LMS, Assessments & Google Classroom Integration

## 1. Coursework Submissions
* **Due Date Enforcement**: If `submittedAt > Assignment.dueDate`, the submission must be flagged as `isLate = true`.
* **File Uploads**: All submission attachments must be validated for allowed MIME types (PDF, ZIP, DOCX) and maximum size ($25\text{ MB}$).

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

## 4. Google Classroom Integration & Security Invariants
* **OAuth 2.0 Token Isolation**: Refresh tokens and access tokens must never be sent to the client browser. All token exchanges must occur strictly within the backend server.
* **API Key Transport**: Google API keys must never be exposed in query parameters; they must be provided via the `x-goog-api-key` HTTP header or backend server SDK.
* **Idempotent Synchronization**: Syncing a course offering (`POST /google-classroom/sync-offering`) multiple times must update the existing Google Classroom class without creating duplicates.
* **Grade Passback Reconciliation**: When importing grades from Google Classroom into PostgreSQL, verify that the student email matches an active `Enrollment` before updating `AssignmentSubmission.obtainedMarks`.
