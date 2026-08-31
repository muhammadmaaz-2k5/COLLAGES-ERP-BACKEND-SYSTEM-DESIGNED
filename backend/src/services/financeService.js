// ============================================================================
// 💳 APEX UNIVERSITY ERP — FINANCE & GENERAL LEDGER SERVICE
// ============================================================================
// Core business engine for fee structures, batch semester challans,
// bank reconciliation scrolls, and double-entry Chart of Accounts ledger.
// ============================================================================

const AuditService = require("./auditService");

// In-Memory Financial Registry
let feeStructuresStore = [
  {
    id: "fs_cs_fall26",
    programId: "prog_cs",
    programCode: "BSCS",
    programName: "Bachelor of Science in Computer Science",
    termName: "Fall 2026",
    effectiveFrom: "2026-08-01",
    tuitionPerCredit: 4500,
    labCharges: 8000,
    libraryCharges: 2500,
    examCharges: 5000,
    admissionFeeOneTime: 25000,
    securityDepositRefundable: 10000,
    totalStandardSemester: 88500,
  },
  {
    id: "fs_se_fall26",
    programId: "prog_se",
    programCode: "BSSE",
    programName: "Bachelor of Science in Software Engineering",
    termName: "Fall 2026",
    effectiveFrom: "2026-08-01",
    tuitionPerCredit: 4500,
    labCharges: 8000,
    libraryCharges: 2500,
    examCharges: 5000,
    admissionFeeOneTime: 25000,
    securityDepositRefundable: 10000,
    totalStandardSemester: 88500,
  },
  {
    id: "fs_ai_fall26",
    programId: "prog_ai",
    programCode: "BSAI",
    programName: "Bachelor of Science in Artificial Intelligence",
    termName: "Fall 2026",
    effectiveFrom: "2026-08-01",
    tuitionPerCredit: 4800,
    labCharges: 10000,
    libraryCharges: 2500,
    examCharges: 5000,
    admissionFeeOneTime: 25000,
    securityDepositRefundable: 10000,
    totalStandardSemester: 93900,
  },
];

let generatedChallansStore = [
  {
    id: "chl_01",
    challanNo: "CHL-2026-8801",
    studentId: "std_01",
    studentRollNo: "2024-CS-001",
    studentName: "Muhammad Hamza",
    programCode: "BSCS",
    semesterNo: 3,
    issueDate: "2026-08-15",
    dueDate: "2026-09-05",
    amount: 88500,
    lateFee: 2000,
    status: "PAID",
    paidAt: "2026-08-20T11:30:00Z",
    paymentMode: "ONLINE_GATEWAY",
    bankRef: "HBL-ONL-994812",
  },
  {
    id: "chl_02",
    challanNo: "CHL-2026-8802",
    studentId: "std_02",
    studentRollNo: "2024-CS-002",
    studentName: "Ayesha Malik",
    programCode: "BSCS",
    semesterNo: 3,
    issueDate: "2026-08-15",
    dueDate: "2026-09-05",
    amount: 88500,
    lateFee: 2000,
    status: "PAID",
    paidAt: "2026-08-22T14:15:00Z",
    paymentMode: "BANK_SCROLL",
    bankRef: "UBL-SCR-771203",
  },
  {
    id: "chl_03",
    challanNo: "CHL-2026-8803",
    studentId: "std_03",
    studentRollNo: "2024-CS-003",
    studentName: "Bilal Hassan",
    programCode: "BSCS",
    semesterNo: 3,
    issueDate: "2026-08-15",
    dueDate: "2026-09-05",
    amount: 88500,
    lateFee: 2000,
    status: "UNPAID",
    paidAt: null,
    paymentMode: null,
    bankRef: null,
  },
  {
    id: "chl_04",
    challanNo: "CHL-2026-8804",
    studentId: "std_04",
    studentRollNo: "2024-SE-014",
    studentName: "Sara Ahmed",
    programCode: "BSSE",
    semesterNo: 3,
    issueDate: "2026-08-15",
    dueDate: "2026-09-05",
    amount: 88500,
    lateFee: 2000,
    status: "UNPAID",
    paidAt: null,
    paymentMode: null,
    bankRef: null,
  },
];

let generalLedgerStore = [
  {
    id: "je_01",
    date: "2026-08-20",
    voucherNo: "JV-2026-0142",
    description: "Student Tuition Collection - Online HBL Gateway (CHL-2026-8801)",
    debitAccount: "1010 - HBL University Collection Account",
    debitAmount: 88500,
    creditAccount: "4010 - Tuition Fee Revenue",
    creditAmount: 88500,
    postedBy: "System Gateway Daemon",
  },
  {
    id: "je_02",
    date: "2026-08-22",
    voucherNo: "JV-2026-0143",
    description: "Bank Scroll Reconciled Payment (CHL-2026-8802)",
    debitAccount: "1020 - UBL University Master Account",
    debitAmount: 88500,
    creditAccount: "4010 - Tuition Fee Revenue",
    creditAmount: 88500,
    postedBy: "Accountant Desk",
  },
  {
    id: "je_03",
    date: "2026-08-25",
    voucherNo: "JV-2026-0144",
    description: "Faculty Laboratory Equipment Procurement",
    debitAccount: "5020 - Computer Lab Maintenance Expense",
    debitAmount: 145000,
    creditAccount: "1010 - HBL University Collection Account",
    creditAmount: 145000,
    postedBy: "Procurement Desk",
  },
];

class FinanceService {
  // ==========================================================================
  // 1. FINANCIAL OVERVIEW & KPI ENGINE
  // ==========================================================================

  /**
   * Returns aggregated financial metrics and recent transactions
   */
  static async getFinancialOverview() {
    const totalInvoiced = generatedChallansStore.reduce((acc, c) => acc + c.amount, 0) + 12500000;
    const totalCollected = generatedChallansStore
      .filter((c) => c.status === "PAID")
      .reduce((acc, c) => acc + c.amount, 0) + 9800000;
    const outstandingDues = totalInvoiced - totalCollected;
    const collectionRate = totalInvoiced > 0 ? Number(((totalCollected / totalInvoiced) * 100).toFixed(1)) : 0;

    return {
      metrics: {
        totalInvoicedPKR: totalInvoiced,
        totalCollectedPKR: totalCollected,
        outstandingDuesPKR: outstandingDues,
        collectionRatePercent: collectionRate,
        dailyBankSettlementPKR: 645000,
        scholarshipConcessionsPKR: 1200000,
      },
      recentChallans: generatedChallansStore.slice(0, 10),
      recentJournalEntries: generalLedgerStore.slice(0, 5),
    };
  }

  // ==========================================================================
  // 2. FEE STRUCTURE TEMPLATES
  // ==========================================================================

  static async getFeeStructures() {
    return feeStructuresStore;
  }

  static async createFeeStructure(payload, req) {
    const totalStandard =
      Number(payload.tuitionPerCredit) * 15 +
      Number(payload.labCharges || 0) +
      Number(payload.libraryCharges || 0) +
      Number(payload.examCharges || 0);

    const newStructure = {
      id: `fs_${Date.now()}`,
      programId: payload.programId,
      programCode: payload.programCode || "BSCS",
      programName: payload.programName || "Undergraduate Program",
      termName: payload.termName || "Fall 2026",
      effectiveFrom: payload.effectiveFrom || new Date().toISOString().split("T")[0],
      tuitionPerCredit: Number(payload.tuitionPerCredit) || 4500,
      labCharges: Number(payload.labCharges) || 8000,
      libraryCharges: Number(payload.libraryCharges) || 2500,
      examCharges: Number(payload.examCharges) || 5000,
      admissionFeeOneTime: Number(payload.admissionFeeOneTime) || 25000,
      securityDepositRefundable: Number(payload.securityDepositRefundable) || 10000,
      totalStandardSemester: totalStandard,
    };

    feeStructuresStore.unshift(newStructure);

    await AuditService.logAction({
      userId: req?.user?.id || "accountant",
      userEmail: req?.user?.email,
      action: "FINANCE.FEE_STRUCTURE_CREATED",
      entityType: "FeeStructure",
      entityId: newStructure.id,
      details: { programCode: newStructure.programCode, total: totalStandard },
      ipAddress: req?.ip,
      userAgent: req?.headers ? req.headers["user-agent"] : null,
    });

    return newStructure;
  }

  // ==========================================================================
  // 3. BATCH SEMESTER CHALLAN GENERATOR
  // ==========================================================================

  static async generateBatchChallans({ programCode = "BSCS", semesterNo = 3, dueDate = "2026-09-15" }, req) {
    const sampleStudents = [
      { id: "std_05", rollNo: "2024-CS-041", name: "Zaid Tariq" },
      { id: "std_06", rollNo: "2024-CS-042", name: "Khadija Bibi" },
      { id: "std_07", rollNo: "2024-CS-043", name: "Omer Farooq" },
      { id: "std_08", rollNo: "2024-CS-044", name: "Suleman Shah" },
    ];

    const generated = [];
    const issueDate = new Date().toISOString().split("T")[0];

    for (const std of sampleStudents) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const challan = {
        id: `chl_${Date.now()}_${randomNum}`,
        challanNo: `CHL-2026-${randomNum}`,
        studentId: std.id,
        studentRollNo: std.rollNo,
        studentName: std.name,
        programCode,
        semesterNo: Number(semesterNo),
        issueDate,
        dueDate,
        amount: 88500,
        lateFee: 2000,
        status: "UNPAID",
        paidAt: null,
        paymentMode: null,
        bankRef: null,
      };

      generatedChallansStore.unshift(challan);
      generated.push(challan);
    }

    await AuditService.logAction({
      userId: req?.user?.id || "accountant",
      userEmail: req?.user?.email,
      action: "FINANCE.BATCH_CHALLANS_GENERATED",
      entityType: "FeeChallan",
      entityId: `BATCH_${Date.now()}`,
      details: { programCode, semesterNo, totalChallans: generated.length },
      ipAddress: req?.ip,
      userAgent: req?.headers ? req.headers["user-agent"] : null,
    });

    return {
      success: true,
      batchCount: generated.length,
      challans: generated,
    };
  }

  // ==========================================================================
  // 4. BANK SCROLL RECONCILIATION
  // ==========================================================================

  static async reconcileBankScroll(transactions, req) {
    const reconciled = [];

    for (const tx of transactions) {
      const match = generatedChallansStore.find((c) => c.challanNo === tx.challanNo);
      if (match && match.status === "UNPAID") {
        match.status = "PAID";
        match.paidAt = tx.depositDate || new Date().toISOString();
        match.paymentMode = "BANK_SCROLL";
        match.bankRef = tx.bankRef || `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

        // Automatically create double-entry General Ledger record
        generalLedgerStore.unshift({
          id: `je_${Date.now()}_${match.challanNo}`,
          date: new Date().toISOString().split("T")[0],
          voucherNo: `JV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          description: `Bank Scroll Reconciled (${match.challanNo} - ${match.studentName})`,
          debitAccount: "1020 - UBL University Master Account",
          debitAmount: match.amount,
          creditAccount: "4010 - Tuition Fee Revenue",
          creditAmount: match.amount,
          postedBy: req?.user?.email || "Accountant Desk",
        });

        reconciled.push(match);
      }
    }

    await AuditService.logAction({
      userId: req?.user?.id || "accountant",
      userEmail: req?.user?.email,
      action: "FINANCE.BANK_SCROLL_RECONCILED",
      entityType: "BankScroll",
      entityId: `SCROLL_${Date.now()}`,
      details: { totalProcessed: transactions.length, reconciledCount: reconciled.length },
      ipAddress: req?.ip,
      userAgent: req?.headers ? req.headers["user-agent"] : null,
    });

    return {
      success: true,
      processed: transactions.length,
      reconciledCount: reconciled.length,
      reconciled,
    };
  }

  // ==========================================================================
  // 5. DOUBLE-ENTRY GENERAL LEDGER & TRIAL BALANCE
  // ==========================================================================

  static async getGeneralLedger() {
    const totalDebits = generalLedgerStore.reduce((sum, e) => sum + e.debitAmount, 0);
    const totalCredits = generalLedgerStore.reduce((sum, e) => sum + e.creditAmount, 0);

    const chartOfAccounts = [
      { code: "1010", name: "HBL University Collection Account", type: "ASSET", balance: 18450000 },
      { code: "1020", name: "UBL University Master Account", type: "ASSET", balance: 24500000 },
      { code: "1050", name: "Student Fee Receivables", type: "ASSET", balance: 2700000 },
      { code: "2010", name: "Student Security Deposits Refundable", type: "LIABILITY", balance: 4200000 },
      { code: "3010", name: "University Capital Fund", type: "EQUITY", balance: 35000000 },
      { code: "4010", name: "Tuition Fee Revenue", type: "REVENUE", balance: 14650000 },
      { code: "5010", name: "Faculty Payroll Expense", type: "EXPENSE", balance: 6200000 },
      { code: "5020", name: "Computer Lab Maintenance Expense", type: "EXPENSE", balance: 850000 },
    ];

    return {
      trialBalance: {
        totalDebits,
        totalCredits,
        isBalanced: totalDebits === totalCredits,
      },
      chartOfAccounts,
      journalEntries: generalLedgerStore,
    };
  }
}

module.exports = FinanceService;
