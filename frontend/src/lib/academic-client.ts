import { useAuthStore } from "@/store/use-auth-store";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

function getAuthHeaders(explicitToken?: string) {
  const token = explicitToken || useAuthStore.getState().token || "live-demo-token";
  const role = useAuthStore.getState().user?.role || "ADMIN";
  return {
    Authorization: `Bearer ${token}`,
    "x-demo-role": role,
  };
}

export class AcademicAPI {
  static async getDepartments(explicitToken?: string) {
    try {
      const res = await fetch(`${API_BASE}/academics/departments`, {
        headers: getAuthHeaders(explicitToken),
      });
      return res.json();
    } catch {
      return null;
    }
  }

  static async getProgramCurriculum(explicitToken: string | undefined, programId: string) {
    try {
      const res = await fetch(`${API_BASE}/academics/programs/${programId}/curriculum`, {
        headers: getAuthHeaders(explicitToken),
      });
      return res.json();
    } catch {
      return null;
    }
  }

  static async assignSemesterCourses(
    explicitToken: string | undefined,
    payload: { departmentCode?: string; programCode?: string; semesterNumber: number; termCode?: string }
  ) {
    const res = await fetch(`${API_BASE}/academics/assign-semester-courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(explicitToken),
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  }

  static async getStudentCurriculum(explicitToken?: string) {
    try {
      const res = await fetch(`${API_BASE}/academics/student/curriculum`, {
        headers: getAuthHeaders(explicitToken),
      });
      return res.json();
    } catch {
      return null;
    }
  }
}
