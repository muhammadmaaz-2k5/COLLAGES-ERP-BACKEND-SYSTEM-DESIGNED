# Module Rules: LMS, Assessments & Examinations

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
