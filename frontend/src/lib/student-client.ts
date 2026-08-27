import { useAuthStore } from "@/store/use-auth-store";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

function getAuthHeaders(explicitToken?: string) {
  const token = explicitToken || useAuthStore.getState().token || "live-demo-token";
  const role = useAuthStore.getState().user?.role || "STUDENT";
  return {
    Authorization: `Bearer ${token}`,
    "x-demo-role": role,
  };
}

export class StudentAPI {
  static async getDashboard(explicitToken?: string) {
    try {
      const res = await fetch(`${API_BASE}/student/dashboard`, {
        headers: getAuthHeaders(explicitToken),
      });
      if (!res.ok) throw new Error("API error");
      return res.json();
    } catch {
      return null;
    }
  }

  static async getAvailableCourses(explicitToken?: string) {
    try {
      const res = await fetch(`${API_BASE}/student/courses/available`, {
        headers: getAuthHeaders(explicitToken),
      });
      if (!res.ok) throw new Error("API error");
      return res.json();
    } catch {
      return null;
    }
  }

  static async registerCourse(explicitToken: string | undefined, offeringId: string) {
    const res = await fetch(`${API_BASE}/student/courses/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(explicitToken),
      },
      body: JSON.stringify({ offeringId }),
    });
    return res.json();
  }

  static async dropCourse(explicitToken: string | undefined, enrollmentId: string) {
    const res = await fetch(`${API_BASE}/student/courses/enrollments/${enrollmentId}`, {
      method: "DELETE",
      headers: getAuthHeaders(explicitToken),
    });
    return res.json();
  }

  static async getTranscript(explicitToken?: string) {
    try {
      const res = await fetch(`${API_BASE}/student/transcript`, {
        headers: getAuthHeaders(explicitToken),
      });
      if (!res.ok) throw new Error("API error");
      return res.json();
    } catch {
      return null;
    }
  }

  static async getAttendance(explicitToken?: string) {
    try {
      const res = await fetch(`${API_BASE}/student/attendance`, {
        headers: getAuthHeaders(explicitToken),
      });
      if (!res.ok) throw new Error("API error");
      return res.json();
    } catch {
      return null;
    }
  }

  static async getAssignments(explicitToken?: string) {
    try {
      const res = await fetch(`${API_BASE}/student/lms/assignments`, {
        headers: getAuthHeaders(explicitToken),
      });
      if (!res.ok) throw new Error("API error");
      return res.json();
    } catch {
      return null;
    }
  }

  static async submitAssignment(explicitToken: string | undefined, assignmentId: string, payload: { fileUrl: string; comments?: string }) {
    const res = await fetch(`${API_BASE}/student/lms/assignments/${assignmentId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(explicitToken),
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  }

  static async getQuizzes(explicitToken?: string) {
    try {
      const res = await fetch(`${API_BASE}/student/lms/quizzes`, {
        headers: getAuthHeaders(explicitToken),
      });
      if (!res.ok) throw new Error("API error");
      return res.json();
    } catch {
      return null;
    }
  }

  static async attemptQuiz(explicitToken: string | undefined, quizId: string, answers: Record<string, string>) {
    const res = await fetch(`${API_BASE}/student/lms/quizzes/${quizId}/attempt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(explicitToken),
      },
      body: JSON.stringify({ answers }),
    });
    return res.json();
  }

  static async getFeeChallans(explicitToken?: string) {
    try {
      const res = await fetch(`${API_BASE}/student/finance/challans`, {
        headers: getAuthHeaders(explicitToken),
      });
      if (!res.ok) throw new Error("API error");
      return res.json();
    } catch {
      return null;
    }
  }

  static async payFeeChallan(explicitToken: string | undefined, challanId: string, paymentMethod = "ONLINE_GATEWAY") {
    const res = await fetch(`${API_BASE}/student/finance/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(explicitToken),
      },
      body: JSON.stringify({ challanId, paymentMethod }),
    });
    return res.json();
  }

  static async getExamSchedule(explicitToken?: string) {
    try {
      const res = await fetch(`${API_BASE}/student/examinations`, {
        headers: getAuthHeaders(explicitToken),
      });
      if (!res.ok) throw new Error("API error");
      return res.json();
    } catch {
      return null;
    }
  }

  static async getWeeklyTimetable(explicitToken?: string) {
    try {
      const res = await fetch(`${API_BASE}/student/timetable`, {
        headers: getAuthHeaders(explicitToken),
      });
      if (!res.ok) throw new Error("API error");
      return res.json();
    } catch {
      return null;
    }
  }

  static async getAnnouncements(explicitToken?: string) {
    try {
      const res = await fetch(`${API_BASE}/student/announcements`, {
        headers: getAuthHeaders(explicitToken),
      });
      if (!res.ok) throw new Error("API error");
      return res.json();
    } catch {
      return null;
    }
  }
}
