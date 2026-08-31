// ============================================================================
// 👔 APEX UNIVERSITY ERP — HR CLIENT
// ============================================================================
// Frontend REST API client for employee master directory, leave decision desk,
// and automated monthly payroll calculation.
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface EmployeeRecord {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string;
  cnic: string;
  type: "FACULTY" | "STAFF" | "DRIVER";
  department: string;
  designation: string;
  qualification: string;
  joiningDate: string;
  contractType: "PERMANENT" | "CONTRACTUAL" | "VISITING";
  status: "ACTIVE" | "ON_LEAVE" | "TERMINATED";
  basicSalary: number;
  leaveBalance: {
    casual: number;
    sick: number;
    annual: number;
  };
}

export interface LeaveApplicationRecord {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  leaveType: "CASUAL" | "SICK" | "ANNUAL" | "MATERNITY" | "SABBATICAL";
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  appliedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  remarks: string | null;
}

export interface SalarySlipRecord {
  id: string;
  monthYear: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  designation: string;
  department: string;
  basicSalary: number;
  houseRentAllowance: number;
  medicalAllowance: number;
  specialAllowance: number;
  grossSalary: number;
  incomeTax: number;
  providentFund: number;
  totalDeductions: number;
  netSalary: number;
  disbursementStatus: "PROCESSED" | "PAID";
  paymentMode: string;
  bankAccount: string;
  generatedAt: string;
}

export interface WorkforceOverviewResponse {
  metrics: {
    totalEmployees: number;
    facultyCount: number;
    staffCount: number;
    driverCount: number;
    pendingLeaves: number;
    activeOnLeave: number;
    monthlyPayrollBudgetPKR: number;
  };
  recentEmployees: EmployeeRecord[];
  recentLeaves: LeaveApplicationRecord[];
}

export class HRAPI {
  /**
   * Fetches workforce analytics & metrics
   */
  static async getOverview(token?: string): Promise<{ success: boolean; data: WorkforceOverviewResponse }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/hr/overview`, { headers });
    if (!res.ok) throw new Error("Failed to fetch workforce overview");
    return res.json();
  }

  /**
   * Fetches employee master directory
   */
  static async getEmployees(
    token?: string,
    filters?: { type?: string; department?: string; search?: string }
  ): Promise<{ success: boolean; data: EmployeeRecord[] }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const params = new URLSearchParams();
    if (filters?.type) params.set("type", filters.type);
    if (filters?.department) params.set("department", filters.department);
    if (filters?.search) params.set("search", filters.search);

    const res = await fetch(`${API_BASE_URL}/hr/employees?${params.toString()}`, { headers });
    if (!res.ok) throw new Error("Failed to fetch employees");
    return res.json();
  }

  /**
   * Onboards a new employee into the system
   */
  static async onboardEmployee(token: string | undefined, payload: any): Promise<{ success: boolean; data: EmployeeRecord }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/hr/employees`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to onboard employee");
    return res.json();
  }

  /**
   * Fetches leave applications queue
   */
  static async getLeaves(token?: string, status?: string): Promise<{ success: boolean; data: LeaveApplicationRecord[] }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const params = new URLSearchParams();
    if (status && status !== "ALL") params.set("status", status);

    const res = await fetch(`${API_BASE_URL}/hr/leaves?${params.toString()}`, { headers });
    if (!res.ok) throw new Error("Failed to fetch leave applications");
    return res.json();
  }

  /**
   * Reviews and approves or rejects a leave request
   */
  static async reviewLeave(
    token: string | undefined,
    leaveId: string,
    payload: { status: "APPROVED" | "REJECTED"; remarks?: string }
  ): Promise<{ success: boolean; data: LeaveApplicationRecord }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/hr/leaves/${leaveId}/review`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to review leave application");
    return res.json();
  }

  /**
   * Runs monthly payroll calculation
   */
  static async generatePayroll(
    token: string | undefined,
    monthYear: string
  ): Promise<{ success: boolean; data: { monthYear: string; totalEmployees: number; slips: SalarySlipRecord[] } }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/hr/payroll/generate-slips`, {
      method: "POST",
      headers,
      body: JSON.stringify({ monthYear }),
    });
    if (!res.ok) throw new Error("Failed to generate payroll");
    return res.json();
  }

  /**
   * Fetches monthly salary slips
   */
  static async getSalarySlips(token?: string, monthYear?: string): Promise<{ success: boolean; data: SalarySlipRecord[] }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const params = new URLSearchParams();
    if (monthYear && monthYear !== "ALL") params.set("monthYear", monthYear);

    const res = await fetch(`${API_BASE_URL}/hr/payroll/slips?${params.toString()}`, { headers });
    if (!res.ok) throw new Error("Failed to fetch salary slips");
    return res.json();
  }
}
