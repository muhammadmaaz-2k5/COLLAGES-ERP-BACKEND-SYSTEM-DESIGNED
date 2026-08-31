// ============================================================================
// 💼 APEX UNIVERSITY ERP — CAREER PLACEMENTS & RESEARCH CLIENT
// ============================================================================
// Frontend REST API client for corporate job postings, student applications,
// and faculty research grants & DOI-indexed publications.
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface RecruitmentJobItem {
  id: string;
  companyName: string;
  companyLogoUrl?: string;
  jobTitle: string;
  jobType: "FULL_TIME" | "INTERNSHIP" | "MANAGEMENT_TRAINEE" | "REMOTE";
  location: string;
  salaryScalePKR: string;
  minCGPA: number;
  openPositions: number;
  applicationDeadline: string;
  tags: string[];
  description: string;
  eligibilityDepartments: string[];
  status: "ACTIVE" | "CLOSED";
  totalApplicants: number;
}

export interface JobApplicationRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  studentId: string;
  studentRollNo: string;
  studentName: string;
  studentCGPA: number;
  department: string;
  resumeUrl: string;
  status: "SUBMITTED" | "SHORTLISTED" | "INTERVIEW_SCHEDULED" | "OFFERED" | "REJECTED";
  appliedAt: string;
  interviewDate: string | null;
  interviewVenue: string | null;
  remarks: string | null;
}

export interface ResearchGrantItem {
  id: string;
  projectTitle: string;
  grantAgency: string;
  grantNumber: string;
  principalInvestigator: string;
  investigatorEmail: string;
  department: string;
  fundingAmountPKR: number;
  startDate: string;
  durationMonths: number;
  status: "APPROVED" | "IN_PROGRESS" | "COMPLETED";
  doiLink: string;
  indexedJournal: string;
  coInvestigators: string[];
}

export interface PlacementOverviewResponse {
  metrics: {
    totalPartnerEmployers: number;
    activeJobOpenings: number;
    totalApplicationsSubmitted: number;
    placedStudents: number;
    averageStartingSalaryPKR: number;
    totalResearchFundingPKR: number;
    publishedPapers: number;
  };
  featuredJobs: RecruitmentJobItem[];
  recentApplications: JobApplicationRecord[];
  activeResearchGrants: ResearchGrantItem[];
}

export class PlacementAPI {
  /**
   * Fetches placement & research overview & metrics
   */
  static async getOverview(token?: string): Promise<{ success: boolean; data: PlacementOverviewResponse }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/placements/overview`, { headers });
    if (!res.ok) throw new Error("Failed to fetch placement overview");
    return res.json();
  }

  /**
   * Fetches job vacancies
   */
  static async getJobs(
    token?: string,
    filters?: { department?: string; jobType?: string; search?: string }
  ): Promise<{ success: boolean; data: RecruitmentJobItem[] }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const params = new URLSearchParams();
    if (filters?.department) params.set("department", filters.department);
    if (filters?.jobType) params.set("jobType", filters.jobType);
    if (filters?.search) params.set("search", filters.search);

    const res = await fetch(`${API_BASE_URL}/placements/jobs?${params.toString()}`, { headers });
    if (!res.ok) throw new Error("Failed to fetch jobs");
    return res.json();
  }

  /**
   * Posts a new job vacancy
   */
  static async postJob(token: string | undefined, payload: any): Promise<{ success: boolean; data: RecruitmentJobItem }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/placements/jobs`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to post job");
    return res.json();
  }

  /**
   * Fetches student applications
   */
  static async getApplications(token?: string, status?: string): Promise<{ success: boolean; data: JobApplicationRecord[] }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const params = new URLSearchParams();
    if (status && status !== "ALL") params.set("status", status);

    const res = await fetch(`${API_BASE_URL}/placements/applications?${params.toString()}`, { headers });
    if (!res.ok) throw new Error("Failed to fetch applications");
    return res.json();
  }

  /**
   * Submits a job application
   */
  static async applyForJob(token: string | undefined, payload: any): Promise<{ success: boolean; data: JobApplicationRecord }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/placements/applications/apply`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to apply for job");
    return res.json();
  }

  /**
   * Fetches faculty research grants
   */
  static async getResearchGrants(token?: string): Promise<{ success: boolean; data: ResearchGrantItem[] }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/placements/research/grants`, { headers });
    if (!res.ok) throw new Error("Failed to fetch research grants");
    return res.json();
  }

  /**
   * Submits a new research grant proposal
   */
  static async submitResearchGrant(token: string | undefined, payload: any): Promise<{ success: boolean; data: ResearchGrantItem }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/placements/research/grants`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to submit research grant");
    return res.json();
  }
}
