// ============================================================================
// 👔 APEX UNIVERSITY ERP — HR & WORKFORCE MANAGEMENT SERVICE
// ============================================================================
// Unified workforce spine managing Faculty, Staff, and Drivers,
// leave quotas & decision desk, and automated monthly payroll calculation.
// ============================================================================

const AuditService = require("./auditService");

// Master Employee Registry Store
let employeesStore = [
  {
    id: "emp_01",
    employeeCode: "EMP-2024-0012",
    fullName: "Dr. Tariq Mahmood",
    email: "tariq.mahmood@apex.edu.pk",
    phone: "+92 300 8491201",
    cnic: "35201-1122334-1",
    type: "FACULTY",
    department: "Computer Science",
    designation: "Professor & Department Chair",
    qualification: "Ph.D. in Computer Science (Univ of Edinburgh)",
    joiningDate: "2018-08-15",
    contractType: "PERMANENT",
    status: "ACTIVE",
    basicSalary: 250000,
    leaveBalance: { casual: 10, sick: 8, annual: 18 },
  },
  {
    id: "emp_02",
    employeeCode: "EMP-2024-0045",
    fullName: "Engr. Sarah Khan",
    email: "sarah.khan@apex.edu.pk",
    phone: "+92 321 4455667",
    cnic: "35202-5566778-2",
    type: "FACULTY",
    department: "Software Engineering",
    designation: "Assistant Professor",
    qualification: "M.S. in Software Engineering (NUST)",
    joiningDate: "2021-02-01",
    contractType: "PERMANENT",
    status: "ACTIVE",
    basicSalary: 160000,
    leaveBalance: { casual: 12, sick: 10, annual: 20 },
  },
  {
    id: "emp_03",
    employeeCode: "EMP-2024-0089",
    fullName: "Muhammad Asif",
    email: "asif.admin@apex.edu.pk",
    phone: "+92 333 9988771",
    cnic: "35201-9988112-3",
    type: "STAFF",
    department: "Registrar Office",
    designation: "Senior Admissions Officer",
    qualification: "MBA in Public Administration",
    joiningDate: "2019-11-10",
    contractType: "PERMANENT",
    status: "ACTIVE",
    basicSalary: 95000,
    leaveBalance: { casual: 8, sick: 6, annual: 15 },
  },
  {
    id: "emp_04",
    employeeCode: "EMP-2024-0104",
    fullName: "Rashid Ali",
    email: "rashid.transport@apex.edu.pk",
    phone: "+92 345 7766554",
    cnic: "35202-3344556-4",
    type: "DRIVER",
    department: "Campus Transport Fleet",
    designation: "Senior Heavy Bus Driver (Route #4)",
    qualification: "HTV Licensed Professional",
    joiningDate: "2020-05-12",
    contractType: "CONTRACTUAL",
    status: "ACTIVE",
    basicSalary: 45000,
    leaveBalance: { casual: 9, sick: 7, annual: 14 },
  },
];

// Leave Applications Store
let leaveApplicationsStore = [
  {
    id: "leave_01",
    employeeId: "emp_01",
    employeeCode: "EMP-2024-0012",
    employeeName: "Dr. Tariq Mahmood",
    department: "Computer Science",
    leaveType: "CASUAL",
    startDate: "2026-09-02",
    endDate: "2026-09-04",
    daysCount: 3,
    reason: "Attending International ACM Conference keynote session.",
    status: "PENDING",
    appliedAt: "2026-08-28T09:30:00Z",
    reviewedAt: null,
    reviewedBy: null,
    remarks: null,
  },
  {
    id: "leave_02",
    employeeId: "emp_03",
    employeeCode: "EMP-2024-0089",
    employeeName: "Muhammad Asif",
    department: "Registrar Office",
    leaveType: "SICK",
    startDate: "2026-08-26",
    endDate: "2026-08-27",
    daysCount: 2,
    reason: "Medical procedure and doctor-advised rest.",
    status: "APPROVED",
    appliedAt: "2026-08-24T11:00:00Z",
    reviewedAt: "2026-08-25T10:00:00Z",
    reviewedBy: "HR Director",
    remarks: "Medical certificate verified.",
  },
];

// Monthly Salary Slips Registry
let salarySlipsStore = [
  {
    id: "slip_01_aug26",
    monthYear: "August 2026",
    employeeId: "emp_01",
    employeeCode: "EMP-2024-0012",
    employeeName: "Dr. Tariq Mahmood",
    designation: "Professor & Chair",
    department: "Computer Science",
    basicSalary: 250000,
    houseRentAllowance: 75000,
    medicalAllowance: 25000,
    specialAllowance: 15000,
    grossSalary: 365000,
    incomeTax: 45000,
    providentFund: 20825,
    totalDeductions: 65825,
    netSalary: 299175,
    disbursementStatus: "PAID",
    paymentMode: "BANK_TRANSFER",
    bankAccount: "HBL-PK77HABB000123456789",
    generatedAt: "2026-08-30T10:00:00Z",
  },
  {
    id: "slip_02_aug26",
    monthYear: "August 2026",
    employeeId: "emp_02",
    employeeCode: "EMP-2024-0045",
    employeeName: "Engr. Sarah Khan",
    designation: "Assistant Professor",
    department: "Software Engineering",
    basicSalary: 160000,
    houseRentAllowance: 48000,
    medicalAllowance: 16000,
    specialAllowance: 10000,
    grossSalary: 234000,
    incomeTax: 22000,
    providentFund: 13328,
    totalDeductions: 35328,
    netSalary: 198672,
    disbursementStatus: "PAID",
    paymentMode: "BANK_TRANSFER",
    bankAccount: "UBL-PK33UNIL000987654321",
    generatedAt: "2026-08-30T10:00:00Z",
  },
];

class HRService {
  // ==========================================================================
  // 1. WORKFORCE OVERVIEW & KPIS
  // ==========================================================================

  static async getWorkforceOverview() {
    const totalEmployees = employeesStore.length + 142;
    const facultyCount = employeesStore.filter((e) => e.type === "FACULTY").length + 84;
    const staffCount = employeesStore.filter((e) => e.type === "STAFF").length + 42;
    const driverCount = employeesStore.filter((e) => e.type === "DRIVER").length + 16;
    const pendingLeaves = leaveApplicationsStore.filter((l) => l.status === "PENDING").length;

    return {
      metrics: {
        totalEmployees,
        facultyCount,
        staffCount,
        driverCount,
        pendingLeaves,
        activeOnLeave: 4,
        monthlyPayrollBudgetPKR: 18450000,
      },
      recentEmployees: employeesStore.slice(0, 8),
      recentLeaves: leaveApplicationsStore.slice(0, 5),
    };
  }

  // ==========================================================================
  // 2. EMPLOYEE DIRECTORY & ONBOARDING
  // ==========================================================================

  static async getEmployees({ type, department, search } = {}) {
    let list = [...employeesStore];

    if (type && type !== "ALL") {
      list = list.filter((e) => e.type === type);
    }
    if (department && department !== "ALL") {
      list = list.filter((e) => e.department === department);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.fullName.toLowerCase().includes(q) ||
          e.employeeCode.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.designation.toLowerCase().includes(q)
      );
    }

    return list;
  }

  static async onboardEmployee(payload, req) {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const employeeCode = `EMP-2026-${randomCode}`;

    const newEmp = {
      id: `emp_${Date.now()}`,
      employeeCode,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      cnic: payload.cnic,
      type: payload.type || "STAFF",
      department: payload.department || "Administration",
      designation: payload.designation || "Officer",
      qualification: payload.qualification || "Bachelors Degree",
      joiningDate: payload.joiningDate || new Date().toISOString().split("T")[0],
      contractType: payload.contractType || "PERMANENT",
      status: "ACTIVE",
      basicSalary: Number(payload.basicSalary) || 80000,
      leaveBalance: { casual: 12, sick: 10, annual: 20 },
    };

    employeesStore.unshift(newEmp);

    await AuditService.logAction({
      userId: req?.user?.id || "hr-manager",
      userEmail: req?.user?.email,
      action: "HR.EMPLOYEE_ONBOARDED",
      entityType: "Employee",
      entityId: employeeCode,
      details: { employeeCode, fullName: newEmp.fullName, type: newEmp.type, department: newEmp.department },
      ipAddress: req?.ip,
      userAgent: req?.headers ? req.headers["user-agent"] : null,
    });

    return newEmp;
  }

  // ==========================================================================
  // 3. LEAVE WORKSTATION & QUOTA MANAGEMENT
  // ==========================================================================

  static async getLeaveApplications({ status } = {}) {
    let list = [...leaveApplicationsStore];
    if (status && status !== "ALL") {
      list = list.filter((l) => l.status === status);
    }
    return list;
  }

  static async reviewLeave(leaveId, { status, remarks }, req) {
    const leave = leaveApplicationsStore.find((l) => l.id === leaveId);
    if (!leave) throw new Error("Leave application record not found");

    leave.status = status;
    leave.reviewedAt = new Date().toISOString();
    leave.reviewedBy = req?.user?.email || "HR Manager";
    leave.remarks = remarks || (status === "APPROVED" ? "Leave authorized." : "Leave declined.");

    // If approved, deduct leave balance
    if (status === "APPROVED") {
      const emp = employeesStore.find((e) => e.id === leave.employeeId);
      if (emp && emp.leaveBalance) {
        const key = leave.leaveType.toLowerCase();
        if (emp.leaveBalance[key] !== undefined) {
          emp.leaveBalance[key] = Math.max(0, emp.leaveBalance[key] - leave.daysCount);
        }
      }
    }

    await AuditService.logAction({
      userId: req?.user?.id || "hr-manager",
      userEmail: req?.user?.email,
      action: "HR.LEAVE_REVIEWED",
      entityType: "LeaveApplication",
      entityId: leave.id,
      details: { employeeCode: leave.employeeCode, status, days: leave.daysCount },
      ipAddress: req?.ip,
      userAgent: req?.headers ? req.headers["user-agent"] : null,
    });

    return leave;
  }

  // ==========================================================================
  // 4. MONTHLY PAYROLL & SALARY SLIPS
  // ==========================================================================

  static async generateMonthlyPayroll({ monthYear = "September 2026" }, req) {
    const generatedSlips = [];

    for (const emp of employeesStore) {
      const basic = emp.basicSalary;
      const houseRent = Math.round(basic * 0.3); // 30% House Rent
      const medical = Math.round(basic * 0.1); // 10% Medical
      const special = 10000;
      const gross = basic + houseRent + medical + special;

      // Tax bracket simulation
      const tax = gross > 200000 ? Math.round(gross * 0.12) : gross > 100000 ? Math.round(gross * 0.08) : 0;
      const providentFund = Math.round(basic * 0.0833); // 8.33% PF
      const totalDeductions = tax + providentFund;
      const net = gross - totalDeductions;

      const slip = {
        id: `slip_${emp.id}_${Date.now()}`,
        monthYear,
        employeeId: emp.id,
        employeeCode: emp.employeeCode,
        employeeName: emp.fullName,
        designation: emp.designation,
        department: emp.department,
        basicSalary: basic,
        houseRentAllowance: houseRent,
        medicalAllowance: medical,
        specialAllowance: special,
        grossSalary: gross,
        incomeTax: tax,
        providentFund,
        totalDeductions,
        netSalary: net,
        disbursementStatus: "PROCESSED",
        paymentMode: "BANK_TRANSFER",
        bankAccount: `PK-APEX-${emp.employeeCode}`,
        generatedAt: new Date().toISOString(),
      };

      salarySlipsStore.unshift(slip);
      generatedSlips.push(slip);
    }

    await AuditService.logAction({
      userId: req?.user?.id || "hr-manager",
      userEmail: req?.user?.email,
      action: "HR.PAYROLL_GENERATED",
      entityType: "PayrollRun",
      entityId: `PAYROLL_${monthYear.replace(/\s+/g, "_")}`,
      details: { monthYear, totalEmployees: generatedSlips.length },
      ipAddress: req?.ip,
      userAgent: req?.headers ? req.headers["user-agent"] : null,
    });

    return {
      monthYear,
      totalEmployees: generatedSlips.length,
      slips: generatedSlips,
    };
  }

  static async getSalarySlips(monthYear) {
    let list = [...salarySlipsStore];
    if (monthYear && monthYear !== "ALL") {
      list = list.filter((s) => s.monthYear === monthYear);
    }
    return list;
  }
}

module.exports = HRService;
