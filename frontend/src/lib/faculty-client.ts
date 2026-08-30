// ============================================================================
// 👨‍🏫 APEX UNIVERSITY ERP — FACULTY CLIENT
// ============================================================================
// REST API client for faculty workload, attendance marking, coursework grading,
// quiz builders, and sessional gradebook submissions.
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface FacultyProfile {
  name: string;
  designation: string;
  department: string;
  employeeId: string;
  email: string;
  officeRoom: string;
  activeTerm: string;
  workloadWeeklyHours: number;
}

export interface TeachingSlot {
  day: string;
  time: string;
  courseCode: string;
  courseTitle: string;
  section: string;
  room: string;
  status: "UPCOMING" | "SCHEDULED" | "COMPLETED";
}

export interface EnrolledStudentRosterItem {
  enrollmentId: string;
  studentId: string;
  regNo: string;
  rollNo: string;
  name: string;
  email: string;
  attendancePercentage: number;
  currentSessionalMarks: number;
  totalMarks: number;
  grade: string;
  status: string;
}

export interface FacultyDashboardResponse {
  profile: FacultyProfile;
  activeOfferings: any[];
  metrics: {
    assignedCoursesCount: number;
    totalEnrolledStudents: number;
    weeklyWorkloadHours: number;
    pendingGradingCount: number;
    attendanceAveragePct: number;
  };
  teachingSchedule: TeachingSlot[];
}

export class FacultyAPI {
  /**
   * Fetches consolidated faculty dashboard overview and teaching schedule
   */
  static async getDashboard(token?: string): Promise<{ success: boolean; data: FacultyDashboardResponse }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/faculty/dashboard`, { headers });
    if (!res.ok) throw new Error("Failed to fetch faculty dashboard");
    return res.json();
  }

  /**
   * Fetches enrolled student roster for a course section
   */
  static async getCourseRoster(
    offeringId: string,
    token?: string
  ): Promise<{ success: boolean; data: { offering: any; enrolledCount: number; roster: EnrolledStudentRosterItem[] } }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/faculty/courses/${offeringId}/roster`, { headers });
    if (!res.ok) throw new Error("Failed to fetch course roster");
    return res.json();
  }

  /**
   * Bulk marks daily attendance for enrolled students in a course offering
   */
  static async markAttendance(
    token: string | undefined,
    payload: {
      offeringId: string;
      date: string;
      sessionTopic: string;
      records: { studentId: string; status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED" }[];
    }
  ): Promise<any> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/faculty/attendance/mark`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to record attendance");
    return res.json();
  }

  /**
   * Creates a new Coursework Assignment
   */
  static async createAssignment(
    token: string | undefined,
    payload: {
      offeringId: string;
      title: string;
      description: string;
      dueDate: string;
      maxMarks: number;
      s3Key?: string;
    }
  ): Promise<any> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/faculty/assessments/assignments`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create assignment");
    return res.json();
  }

  /**
   * Scores and provides feedback on a student submission
   */
  static async gradeSubmission(
    token: string | undefined,
    submissionId: string,
    payload: { obtainedMarks: number; feedback: string }
  ): Promise<any> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/faculty/assessments/assignments/submissions/${submissionId}/grade`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to submit grade");
    return res.json();
  }

  /**
   * Creates a timed quiz with question bank
   */
  static async createQuiz(
    token: string | undefined,
    payload: {
      offeringId: string;
      title: string;
      durationMinutes: number;
      totalMarks: number;
      questions?: any[];
    }
  ): Promise<any> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/faculty/assessments/quizzes`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create quiz");
    return res.json();
  }

  /**
   * Bulk submits sessional marks and grades for a course section
   */
  static async submitSessionalMarks(
    token: string | undefined,
    payload: {
      offeringId: string;
      marksData: { studentId: string; sessionalMarks: number; midtermMarks?: number; finalExamMarks?: number }[];
    }
  ): Promise<any> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/faculty/grades/submit-marks`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to submit sessional marks");
    return res.json();
  }
}
