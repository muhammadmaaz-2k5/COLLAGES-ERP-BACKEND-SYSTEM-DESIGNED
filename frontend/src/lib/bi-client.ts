// ============================================================================
// 📈 APEX UNIVERSITY ERP — BI & REPORTING CLIENT
// ============================================================================
// Frontend REST API client for institutional executive intelligence,
// departmental analytics, and dynamic custom query execution.
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface ExecutiveKPIsResponse {
  institutionSummary: {
    name: string;
    academicYear: string;
    accreditationRank: string;
  };
  metrics: {
    totalEnrolledStudents: number;
    graduationRetentionRatePercent: number;
    feeCollectionRecoveryRatePercent: number;
    averageFacultyTeachingLoadCreditHours: number;
    institutionalCGPAMean: number;
    totalFacultyCount: number;
    totalResearchGrantsPKR: number;
    annualOperatingBudgetPKR: number;
    alumniPlacementRatePercent: number;
  };
  retentionTrends: {
    cohort: string;
    enrolled: number;
    retained: number;
    ratePercent: number;
  }[];
}

export interface DepartmentTrendItem {
  departmentCode: string;
  departmentName: string;
  enrolledCount: number;
  facultyCount: number;
  studentFacultyRatio: string;
  averageCGPA: number;
  probationRatePercent: number;
  deanListCount: number;
  topCourse: string;
}

export interface FinancialBreakdownResponse {
  revenueQuarters: {
    quarter: string;
    billedPKR: number;
    collectedPKR: number;
    recoveryRatePercent: number;
  }[];
  revenueByStream: {
    stream: string;
    percentage: number;
    amountPKR: number;
  }[];
}

export interface SavedTemplateItem {
  id: string;
  title: string;
  description: string;
  category: string;
  frequency: string;
}

export interface CustomQueryResult {
  queryMetadata: {
    domain: string;
    executionTimeMs: number;
    totalRows: number;
    timestamp: string;
  };
  results: Record<string, any>[];
}

export class BIReportingAPI {
  /**
   * Fetches institutional executive KPIs
   */
  static async getExecutiveKPIs(token?: string): Promise<{ success: boolean; data: ExecutiveKPIsResponse }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/reporting/executive-kpis`, { headers });
    if (!res.ok) throw new Error("Failed to fetch executive KPIs");
    return res.json();
  }

  /**
   * Fetches department GPA & workload trends
   */
  static async getDepartmentTrends(token?: string): Promise<{ success: boolean; data: DepartmentTrendItem[] }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/reporting/department-trends`, { headers });
    if (!res.ok) throw new Error("Failed to fetch department trends");
    return res.json();
  }

  /**
   * Fetches revenue stream breakdown
   */
  static async getFinancialBreakdown(token?: string): Promise<{ success: boolean; data: FinancialBreakdownResponse }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/reporting/financial-breakdown`, { headers });
    if (!res.ok) throw new Error("Failed to fetch financial breakdown");
    return res.json();
  }

  /**
   * Executes a custom dynamic projection query
   */
  static async executeCustomQuery(token: string | undefined, payload: any): Promise<{ success: boolean; data: CustomQueryResult }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/reporting/custom-query`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to execute custom query");
    return res.json();
  }

  /**
   * Fetches saved accreditation and audit templates
   */
  static async getSavedTemplates(token?: string): Promise<{ success: boolean; data: SavedTemplateItem[] }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/reporting/saved-templates`, { headers });
    if (!res.ok) throw new Error("Failed to fetch saved templates");
    return res.json();
  }
}
