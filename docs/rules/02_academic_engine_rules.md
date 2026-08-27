# Module Rules: Academic Core, Prerequisites & CGPA Engine

## 1. Course Prerequisite Validation
* Before registering a student in a `CourseOffering`, the system must query all `CoursePrerequisite` records for `offering.courseId`.
* For hard prerequisites (`type = HARD_PREREQUISITE`), the student must have an existing `Enrollment` for the prerequisite course with `isPassed = true` and `gradePoint >= minGradePoint`.
* If prerequisite checks fail, the API must reject the registration with `422 Unprocessable` and detail the unfulfilled course codes.

## 2. SGPA & CGPA Mathematical Formulas
* **Quality Points per Course**:
  $$\text{QualityPoints} = \text{Enrollment.gradePoint} \times \text{Course.creditHours}$$
* **Semester GPA (SGPA)**:
  $$\text{SGPA} = \frac{\sum_{\text{Term}} \text{QualityPoints}}{\sum_{\text{Term}} \text{Course.creditHours}}$$
* **Cumulative GPA (CGPA)**:
  $$\text{CGPA} = \frac{\sum_{\text{All Terms}} \text{QualityPoints}}{\sum_{\text{All Terms}} \text{Course.creditHours}}$$
* **Repeat Course Policy**: When a student repeats a course, only the highest grade point is counted in the cumulative CGPA calculation, while preserving the previous attempt history with `attemptNumber`.

## 3. Academic Standing Evaluation
* After official grade approval for a semester, the system evaluates:
  * If $\text{CGPA} < 2.00$: update `academicStanding = PROBATION`.
  * If on probation for 2 consecutive terms without $\text{CGPA} \ge 2.00$: update `academicStanding = SUSPENDED`.
  * If all degree requirements completed and $\text{CGPA} \ge 2.00$: update `academicStanding = GRADUATED`.
