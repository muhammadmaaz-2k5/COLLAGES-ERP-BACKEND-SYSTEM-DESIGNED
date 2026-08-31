// ============================================================================
// 📋 APEX UNIVERSITY ERP — ADMISSIONS CLIENT
// ============================================================================
// Frontend REST API client for public admissions application wizard,
// live status tracking, and admissions officer workstations.
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface DegreeProgramItem {
  id: string;
  code: string;
  title: string;
  durationYears: number;
  totalSeats: number;
  filledSeats: number;
  eligibility: string;
  feePerSemester: number;
}

export interface ApplicationDocument {
  name: string;
  s3Key: string;
  verified: boolean;
}

export interface ApplicationRecord {
  id: string;
  trackingId: string;
  fullName: string;
  fatherName: string;
  email: string;
  phone: string;
  cnic: string;
  dob: string;
  gender: string;
  domicile: string;
  programId: string;
  programName: string;
  secondChoice: string;
  thirdChoice: string;
  matricMarks: number;
  matricTotal: number;
  matricPercentage: number;
  interMarks: number;
  interTotal: number;
  interPercentage: number;
  status: "SUBMITTED" | "UNDER_REVIEW" | "TEST_SCHEDULED" | "ACCEPTED" | "REJECTED" | "ENROLLED";
  documents: ApplicationDocument[];
  testSlot: {
    testDate: string;
    time: string;
    venue: string;
    rollNo: string;
  } | null;
  feePaid: boolean;
  challanNo: string;
  appliedAt: string;
  remarks: string;
}

export interface TrackApplicationResponse {
  application: ApplicationRecord;
  stages: {
    id: string;
    label: string;
    completed: boolean;
    date: string;
  }[];
  canDownloadTestSlip: boolean;
}

export interface AdminApplicationsResponse {
  metrics: {
    totalApplications: number;
    pendingReview: number;
    testScheduled: number;
    acceptedCount: number;
    totalSeats: number;
  };
  applications: ApplicationRecord[];
}

export interface MeritListCandidate {
  rank: number;
  trackingId: string;
  rollNo: string;
  candidateName: string;
  fatherName: string;
  matricPercentage: number;
  interPercentage: number;
  academicScore: number;
  entryTestScore: number;
  finalAggregate: number;
  status: "SELECTED" | "WAITING_LIST" | "REJECTED";
}

export interface MeritListResponse {
  id: string;
  programId: string;
  programCode: string;
  programTitle: string;
  termName: string;
  listRound: number;
  listTitle: string;
  publishedAt: string;
  feeDeadline: string;
  totalSeats: number;
  selectedCount: number;
  closingAggregate: number;
  candidates: MeritListCandidate[];
}

export class AdmissionsAPI {
  /**
   * Fetches available degree programs for applicant intake
   */
  static async getPrograms(): Promise<{ success: boolean; data: DegreeProgramItem[] }> {
    const res = await fetch(`${API_BASE_URL}/admissions/programs`);
    if (!res.ok) throw new Error("Failed to fetch degree programs");
    return res.json();
  }

  /**
   * Submits a new online admission application (Public)
   */
  static async submitApplication(payload: any): Promise<{ success: boolean; data: ApplicationRecord }> {
    const res = await fetch(`${API_BASE_URL}/admissions/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to submit application");
    return res.json();
  }

  /**
   * Tracks an application status by Tracking ID or CNIC (Public)
   */
  static async trackApplication(trackingId: string): Promise<{ success: boolean; data: TrackApplicationResponse }> {
    const res = await fetch(`${API_BASE_URL}/admissions/applications/${encodeURIComponent(trackingId)}`);
    if (!res.ok) throw new Error("Application record not found");
    return res.json();
  }

  /**
   * Fetches applications for Admissions Officers (Protected)
   */
  static async getAdminApplications(
    token?: string,
    filters?: { status?: string; programId?: string; search?: string }
  ): Promise<{ success: boolean; data: AdminApplicationsResponse }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const params = new URLSearchParams();
    if (filters?.status) params.set("status", filters.status);
    if (filters?.programId) params.set("programId", filters.programId);
    if (filters?.search) params.set("search", filters.search);

    const res = await fetch(`${API_BASE_URL}/admissions/admin/applications?${params.toString()}`, { headers });
    if (!res.ok) throw new Error("Failed to fetch applications");
    return res.json();
  }

  /**
   * Updates an application status / assigns test slot (Protected)
   */
  static async updateStatus(
    token: string | undefined,
    applicationId: string,
    payload: { status: string; remarks?: string; testDate?: string; testVenue?: string }
  ): Promise<{ success: boolean; data: ApplicationRecord }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/admissions/admin/applications/${applicationId}/status`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update application status");
    return res.json();
  }

  /**
   * Fetches published merit lists for public portal
   */
  static async getPublicMeritLists(programId?: string): Promise<{ success: boolean; data: MeritListResponse[] }> {
    const params = new URLSearchParams();
    if (programId && programId !== "ALL") params.set("programId", programId);

    const res = await fetch(`${API_BASE_URL}/admissions/merit-lists/public?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch merit lists");
    return res.json();
  }

  /**
   * Generates automated merit list for a degree program (Protected)
   */
  static async generateMeritList(
    token: string | undefined,
    payload: { programId: string; listRound: number; seatCapacity?: number }
  ): Promise<{ success: boolean; data: MeritListResponse }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/admissions/merit-lists/generate`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to generate merit list");
    return res.json();
  }

  /**
   * Bulk records entrance test scores (Protected)
   */
  static async recordTestScores(token: string | undefined, scores: any[]): Promise<any> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/admissions/tests/scores`, {
      method: "POST",
      headers,
      body: JSON.stringify({ scores }),
    });
    if (!res.ok) throw new Error("Failed to record test scores");
    return res.json();
  }
}

