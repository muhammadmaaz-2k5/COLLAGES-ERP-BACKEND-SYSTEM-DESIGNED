const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export class StudentAPI {
  static async getDashboard(token: string) {
    try {
      const res = await fetch(`${API_BASE}/student/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("API error");
      return res.json();
    } catch {
      return null;
    }
  }

  static async getAvailableCourses(token: string) {
    try {
      const res = await fetch(`${API_BASE}/student/courses/available`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("API error");
      return res.json();
    } catch {
      return null;
    }
  }

  static async registerCourse(token: string, offeringId: string) {
    const res = await fetch(`${API_BASE}/student/courses/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ offeringId }),
    });
    return res.json();
  }

  static async dropCourse(token: string, enrollmentId: string) {
    const res = await fetch(`${API_BASE}/student/courses/enrollments/${enrollmentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  }

  static async getTranscript(token: string) {
    try {
      const res = await fetch(`${API_BASE}/student/transcript`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("API error");
      return res.json();
    } catch {
      return null;
    }
  }

  static async getAttendance(token: string) {
    try {
      const res = await fetch(`${API_BASE}/student/attendance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("API error");
      return res.json();
    } catch {
      return null;
    }
  }

  static async getAssignments(token: string) {
    try {
      const res = await fetch(`${API_BASE}/student/lms/assignments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("API error");
      return res.json();
    } catch {
      return null;
    }
  }

  static async submitAssignment(token: string, assignmentId: string, payload: { fileUrl: string; comments?: string }) {
    const res = await fetch(`${API_BASE}/student/lms/assignments/${assignmentId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  }

  static async getQuizzes(token: string) {
    try {
      const res = await fetch(`${API_BASE}/student/lms/quizzes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("API error");
      return res.json();
    } catch {
      return null;
    }
  }

  static async attemptQuiz(token: string, quizId: string, answers: Record<string, string>) {
    const res = await fetch(`${API_BASE}/student/lms/quizzes/${quizId}/attempt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ answers }),
    });
    return res.json();
  }

  static async getFeeChallans(token: string) {
    try {
      const res = await fetch(`${API_BASE}/student/finance/challans`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("API error");
      return res.json();
    } catch {
      return null;
    }
  }

  static async payFeeChallan(token: string, challanId: string, paymentMethod = "ONLINE_GATEWAY") {
    const res = await fetch(`${API_BASE}/student/finance/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ challanId, paymentMethod }),
    });
    return res.json();
  }

  static async getExamSchedule(token: string) {
    try {
      const res = await fetch(`${API_BASE}/student/examinations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("API error");
      return res.json();
    } catch {
      return null;
    }
  }

  static async getWeeklyTimetable(token: string) {
    try {
      const res = await fetch(`${API_BASE}/student/timetable`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("API error");
      return res.json();
    } catch {
      return null;
    }
  }

  static async getAnnouncements(token: string) {
    try {
      const res = await fetch(`${API_BASE}/student/announcements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("API error");
      return res.json();
    } catch {
      return null;
    }
  }
}
