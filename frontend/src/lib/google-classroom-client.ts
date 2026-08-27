const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface GoogleClassroomCourse {
  id: string;
  name: string;
  section: string;
  room?: string;
  alternateLink: string;
  enrollmentCode?: string;
  courseState: string;
  teacherName?: string;
  pendingCoursework?: number;
}

export interface GoogleClassroomData {
  connected: boolean;
  googleAccountEmail: string;
  courses: GoogleClassroomCourse[];
}

export class GoogleClassroomAPI {
  static async getAuthUrl(): Promise<{ success: boolean; data: { authUrl: string; clientId: string } }> {
    const res = await fetch(`${API_BASE_URL}/google-classroom/auth-url`);
    if (!res.ok) throw new Error("Failed to get Google Classroom authorization URL");
    return res.json();
  }

  static async getCourses(token?: string): Promise<{ success: boolean; data: GoogleClassroomData }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/google-classroom/courses`, { headers });
    if (!res.ok) throw new Error("Failed to fetch Google Classroom courses");
    return res.json();
  }

  static async syncOffering(token: string, offeringId: string) {
    const res = await fetch(`${API_BASE_URL}/google-classroom/sync-offering`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ offeringId }),
    });
    return res.json();
  }
}
