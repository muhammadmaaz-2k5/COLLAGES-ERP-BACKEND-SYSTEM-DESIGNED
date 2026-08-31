// ============================================================================
// 💳 APEX UNIVERSITY ERP — FINANCE & ACCOUNTANT CLIENT
// ============================================================================
// Frontend REST API client for billing, fee structures, batch challan generator,
// bank reconciliation scrolls, and double-entry General Ledger.
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface FeeStructureItem {
  id: string;
  programId: string;
  programCode: string;
  programName: string;
  termName: string;
  effectiveFrom: string;
  tuitionPerCredit: number;
  labCharges: number;
  libraryCharges: number;
  examCharges: number;
  admissionFeeOneTime: number;
  securityDepositRefundable: number;
  totalStandardSemester: number;
}

export interface FeeChallanRecord {
  id: string;
  challanNo: string;
  studentId: string;
  studentRollNo: string;
  studentName: string;
  programCode: string;
  semesterNo: number;
  issueDate: string;
  dueDate: string;
  amount: number;
  lateFee: number;
  status: "PAID" | "UNPAID" | "OVERDUE" | "CANCELLED";
  paidAt: string | null;
  paymentMode: string | null;
  bankRef: string | null;
}

export interface JournalEntryRecord {
  id: string;
  date: string;
  voucherNo: string;
  description: string;
  debitAccount: string;
  debitAmount: number;
  creditAccount: string;
  creditAmount: number;
  postedBy: string;
}

export interface FinancialOverviewResponse {
  metrics: {
    totalInvoicedPKR: number;
    totalCollectedPKR: number;
    outstandingDuesPKR: number;
    collectionRatePercent: number;
    dailyBankSettlementPKR: number;
    scholarshipConcessionsPKR: number;
  };
  recentChallans: FeeChallanRecord[];
  recentJournalEntries: JournalEntryRecord[];
}

export interface GeneralLedgerResponse {
  trialBalance: {
    totalDebits: number;
    totalCredits: number;
    isBalanced: boolean;
  };
  chartOfAccounts: {
    code: string;
    name: string;
    type: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";
    balance: number;
  }[];
  journalEntries: JournalEntryRecord[];
}

export class FinanceAPI {
  /**
   * Fetches financial overview & collection KPIs
   */
  static async getOverview(token?: string): Promise<{ success: boolean; data: FinancialOverviewResponse }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/finance/overview`, { headers });
    if (!res.ok) throw new Error("Failed to fetch financial overview");
    return res.json();
  }

  /**
   * Fetches active fee structures
   */
  static async getFeeStructures(token?: string): Promise<{ success: boolean; data: FeeStructureItem[] }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/finance/fee-structures`, { headers });
    if (!res.ok) throw new Error("Failed to fetch fee structures");
    return res.json();
  }

  /**
   * Creates a new fee structure template
   */
  static async createFeeStructure(token: string | undefined, payload: any): Promise<{ success: boolean; data: FeeStructureItem }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/finance/fee-structures`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create fee structure");
    return res.json();
  }

  /**
   * Generates batch semester fee challans
   */
  static async generateBatchChallans(
    token: string | undefined,
    payload: { programCode: string; semesterNo: number; dueDate: string }
  ): Promise<{ success: boolean; data: { batchCount: number; challans: FeeChallanRecord[] } }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/finance/challans/generate-batch`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to generate batch challans");
    return res.json();
  }

  /**
   * Reconciles bank deposit scroll transactions
   */
  static async reconcileBankScroll(
    token: string | undefined,
    transactions: { challanNo: string; depositDate?: string; bankRef?: string }[]
  ): Promise<{ success: boolean; data: { processed: number; reconciledCount: number; reconciled: FeeChallanRecord[] } }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/finance/payments/reconcile-bank`, {
      method: "POST",
      headers,
      body: JSON.stringify({ transactions }),
    });
    if (!res.ok) throw new Error("Failed to reconcile bank scroll");
    return res.json();
  }

  /**
   * Fetches General Ledger & Trial Balance
   */
  static async getGeneralLedger(token?: string): Promise<{ success: boolean; data: GeneralLedgerResponse }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/finance/general-ledger`, { headers });
    if (!res.ok) throw new Error("Failed to fetch general ledger");
    return res.json();
  }
}
