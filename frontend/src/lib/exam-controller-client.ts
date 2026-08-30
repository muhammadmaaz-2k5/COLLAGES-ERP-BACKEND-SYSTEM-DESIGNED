// ============================================================================
// 📝 APEX UNIVERSITY ERP — EXAMINATION CONTROLLER CLIENT
// ============================================================================
// Frontend client for exam terms, datesheet scheduling, invigilation duty,
// official result approvals, and grade locking.
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface ExamTermInfo {
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface PendingGradeApprovalItem {
  offeringId: string;
  courseCode: string;
  courseTitle: string;
  instructor: string;
  totalEnrolled: number;
  sessionalSubmitted: boolean;
  midtermSubmitted: boolean;
  finalExamSubmitted: boolean;
  gradeStatus: "PENDING_APPROVAL" | "IN_PROGRESS" | "LOCKED_OFFICIALLY";
  averageGpa: number | null;
}

export interface InvigilatorDutyItem {
  id: string;
  name: string;
  department: string;
  dutiesCount: number;
  room: string;
}

export interface ExamControllerDashboardData {
  activeTerm: ExamTermInfo;
  metrics: {
    totalScheduledExams: number;
    totalExaminees: number;
    pendingGradeLocks: number;
    lockedCourseSections: number;
    totalInvigilators: number;
  };
  datesheets: any[];
  pendingGradeApprovals: PendingGradeApprovalItem[];
  invigilationStaff: InvigilatorDutyItem[];
}

export class ExamControllerAPI {
  /**
   * Fetches exam controller dashboard metrics, active datesheets, and pending grade locks
   */
  static async getDashboard(token?: string): Promise<{ success: boolean; data: ExamControllerDashboardData }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/exam-controller/dashboard`, { headers });
    if (!res.ok) throw new Error("Failed to fetch exam controller dashboard");
    return res.json();
  }

  /**
   * Schedules a new exam paper slot in the semester datesheet
   */
  static async scheduleExamSlot(
    token: string | undefined,
    payload: {
      termName?: string;
      courseCode: string;
      courseTitle: string;
      examDate: string;
      startTime: string;
      endTime: string;
      room: string;
    }
  ): Promise<any> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/exam-controller/datesheets`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to schedule exam slot");
    return res.json();
  }

  /**
   * Officially approves and permanently locks the final semester grades for a course section
   */
  static async lockAndApproveGrades(token: string | undefined, offeringId: string): Promise<any> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/exam-controller/grades/${offeringId}/lock-approve`, {
      method: "POST",
      headers,
    });
    if (!res.ok) throw new Error("Failed to lock and approve grades");
    return res.json();
  }
}
