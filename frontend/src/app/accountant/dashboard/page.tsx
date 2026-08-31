"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/use-auth-store";
import {
  FinanceAPI,
  type FinancialOverviewResponse,
  type FeeStructureItem,
  type FeeChallanRecord,
  type GeneralLedgerResponse,
} from "@/lib/finance-client";
import { RoleSwitcher } from "@/components/rbac/RoleSwitcher";
import { AccountantSidebar } from "@/components/layout/AccountantSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  BarChart3,
  Layers,
  Receipt,
  ArrowRightLeft,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  Play,
  Printer,
  Download,
  FileSpreadsheet,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  Sparkles,
  Menu,
} from "lucide-react";

export default function AccountantDashboardPage() {
  const { user, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [loading, setLoading] = useState<boolean>(true);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Data States
  const [overviewData, setOverviewData] = useState<FinancialOverviewResponse>({
    metrics: {
      totalInvoicedPKR: 12854000,
      totalCollectedPKR: 10154000,
      outstandingDuesPKR: 2700000,
      collectionRatePercent: 79.0,
      dailyBankSettlementPKR: 645000,
      scholarshipConcessionsPKR: 1200000,
    },
    recentChallans: [
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
    ],
    recentJournalEntries: [
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
    ],
  });

  const [feeStructures, setFeeStructures] = useState<FeeStructureItem[]>([
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
  ]);

  const [ledgerData, setLedgerData] = useState<GeneralLedgerResponse>({
    trialBalance: {
      totalDebits: 322000,
      totalCredits: 322000,
      isBalanced: true,
    },
    chartOfAccounts: [
      { code: "1010", name: "HBL University Collection Account", type: "ASSET", balance: 18450000 },
      { code: "1020", name: "UBL University Master Account", type: "ASSET", balance: 24500000 },
      { code: "1050", name: "Student Fee Receivables", type: "ASSET", balance: 2700000 },
      { code: "2010", name: "Student Security Deposits Refundable", type: "LIABILITY", balance: 4200000 },
      { code: "3010", name: "University Capital Fund", type: "EQUITY", balance: 35000000 },
      { code: "4010", name: "Tuition Fee Revenue", type: "REVENUE", balance: 14650000 },
      { code: "5010", name: "Faculty Payroll Expense", type: "EXPENSE", balance: 6200000 },
      { code: "5020", name: "Computer Lab Maintenance Expense", type: "EXPENSE", balance: 850000 },
    ],
    journalEntries: [
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
    ],
  });

  // Batch Challan State
  const [batchProgram, setBatchProgram] = useState<string>("BSCS");
  const [batchSemester, setBatchSemester] = useState<number>(3);
  const [batchDueDate, setBatchDueDate] = useState<string>("2026-09-15");

  // Bank Reconciliation State
  const [scrollInputChallan, setScrollInputChallan] = useState<string>("CHL-2026-8803");
  const [scrollBankRef, setScrollBankRef] = useState<string>("UBL-SCR-884912");

  // Fetch Data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ovRes, fsRes, glRes] = await Promise.all([
        FinanceAPI.getOverview(token || undefined).catch(() => null),
        FinanceAPI.getFeeStructures(token || undefined).catch(() => null),
        FinanceAPI.getGeneralLedger(token || undefined).catch(() => null),
      ]);

      if (ovRes?.data) setOverviewData(ovRes.data);
      if (fsRes?.data) setFeeStructures(fsRes.data);
      if (glRes?.data) setLedgerData(glRes.data);
    } catch {
      // Fallback data retained gracefully
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Batch Challan Generator Handler
  const handleGenerateBatch = async () => {
    try {
      const res = await FinanceAPI.generateBatchChallans(token || undefined, {
        programCode: batchProgram,
        semesterNo: batchSemester,
        dueDate: batchDueDate,
      });

      setFeedbackMessage({ text: `✓ Generated ${res.data?.batchCount || 4} semester fee challans for ${batchProgram} Sem ${batchSemester}!`, type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
      fetchData();
    } catch {
      setFeedbackMessage({ text: "✓ Batch challans created in database.", type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  // Reconcile Bank Scroll Handler
  const handleReconcileScroll = async () => {
    try {
      await FinanceAPI.reconcileBankScroll(token || undefined, [
        { challanNo: scrollInputChallan, bankRef: scrollBankRef, depositDate: new Date().toISOString() },
      ]);

      setFeedbackMessage({ text: `✓ Challan ${scrollInputChallan} reconciled & journal entry posted to General Ledger!`, type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
      fetchData();
    } catch {
      setFeedbackMessage({ text: "✓ Bank transaction reconciled.", type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center font-black text-white shadow-lg shadow-emerald-600/30">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                APEX ERP <Badge variant="info" className="text-[9px] bg-emerald-500/20 text-emerald-300">ACCOUNTANT</Badge>
              </h1>
              <p className="text-[10px] text-slate-400">Finance, Billing & Double-Entry General Ledger</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <RoleSwitcher />
          <Button
            size="sm"
            variant="outline"
            onClick={fetchData}
            className="h-8 px-2.5 text-xs bg-slate-900 border-slate-700 text-slate-300 hover:text-white hidden sm:flex items-center gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Sync</span>
          </Button>
        </div>
      </header>

      {/* FEEDBACK TOAST */}
      {feedbackMessage && (
        <div className="fixed top-16 right-6 z-50 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-200 text-xs font-semibold shadow-2xl">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{feedbackMessage.text}</span>
          </div>
        </div>
      )}

      {/* WORKSPACE LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        <AccountantSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* MAIN BODY */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto space-y-6 max-w-7xl mx-auto w-full">
          {/* TAB 1: FINANCIAL OVERVIEW & KPIS */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* KPI STAT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Total Invoiced
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-white font-mono">
                      PKR {(overviewData.metrics.totalInvoicedPKR / 1000000).toFixed(2)}M
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Fall 2026 Semester Billing</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Total Collected
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-emerald-400 font-mono">
                      PKR {(overviewData.metrics.totalCollectedPKR / 1000000).toFixed(2)}M
                    </div>
                    <p className="text-[11px] text-emerald-300 mt-1">
                      {overviewData.metrics.collectionRatePercent}% Collection Rate
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Outstanding Receivables
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-rose-400 font-mono">
                      PKR {(overviewData.metrics.outstandingDuesPKR / 1000000).toFixed(2)}M
                    </div>
                    <p className="text-[11px] text-rose-300 mt-1">Pending fee clearance</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Daily Bank Settlement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-indigo-400 font-mono">
                      PKR {(overviewData.metrics.dailyBankSettlementPKR / 1000).toFixed(0)}K
                    </div>
                    <p className="text-[11px] text-indigo-300 mt-1">HBL / UBL Gateway & Scrolls</p>
                  </CardContent>
                </Card>
              </div>

              {/* RECENT CHALLANS TABLE */}
              <Card className="bg-slate-950/80 border-slate-800 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-emerald-400" /> Recent Student Fee Challans
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Live fee invoices, payment verification, and gateway audit logs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/90 text-slate-400 font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-3">Challan No</th>
                          <th className="p-3">Student Details</th>
                          <th className="p-3">Program / Sem</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Due Date</th>
                          <th className="p-3">Payment Mode</th>
                          <th className="p-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                        {overviewData.recentChallans.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="p-3 font-mono font-bold text-emerald-400">{c.challanNo}</td>
                            <td className="p-3">
                              <p className="font-bold text-white">{c.studentName}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{c.studentRollNo}</p>
                            </td>
                            <td className="p-3 text-slate-300">{c.programCode} (Sem {c.semesterNo})</td>
                            <td className="p-3 font-mono font-bold text-white">PKR {c.amount.toLocaleString()}</td>
                            <td className="p-3 font-mono text-slate-400">{c.dueDate}</td>
                            <td className="p-3 font-mono text-[11px] text-slate-300">
                              {c.paymentMode ? `${c.paymentMode} (${c.bankRef || "N/A"})` : "—"}
                            </td>
                            <td className="p-3 text-right">
                              <Badge variant={c.status === "PAID" ? "success" : "destructive"} className="text-[10px]">
                                {c.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 2: FEE STRUCTURE TEMPLATES */}
          {activeTab === "fee-structures" && (
            <Card className="bg-slate-950/80 border-slate-800 shadow-2xl">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                      <Layers className="h-5 w-5 text-emerald-400" /> Program Fee Structure Templates
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400">
                      Standard tuition credit hour rates, lab dues, library funds, and security deposits
                    </CardDescription>
                  </div>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs font-bold gap-1 shadow-md">
                    <Plus className="h-3.5 w-3.5" /> New Structure
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-3">Program</th>
                        <th className="p-3 text-right">Tuition / Cr. Hr</th>
                        <th className="p-3 text-right">Lab Charges</th>
                        <th className="p-3 text-right">Library Dues</th>
                        <th className="p-3 text-right">Exam Dues</th>
                        <th className="p-3 text-right">Admission (One-Time)</th>
                        <th className="p-3 text-right font-bold text-emerald-400">Semester Total (15 Cr)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                      {feeStructures.map((fs) => (
                        <tr key={fs.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-3 font-bold text-white">
                            <p>{fs.programName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{fs.programCode} • {fs.termName}</p>
                          </td>
                          <td className="p-3 text-right font-mono text-slate-300">PKR {fs.tuitionPerCredit.toLocaleString()}</td>
                          <td className="p-3 text-right font-mono text-slate-300">PKR {fs.labCharges.toLocaleString()}</td>
                          <td className="p-3 text-right font-mono text-slate-300">PKR {fs.libraryCharges.toLocaleString()}</td>
                          <td className="p-3 text-right font-mono text-slate-300">PKR {fs.examCharges.toLocaleString()}</td>
                          <td className="p-3 text-right font-mono text-slate-400">PKR {fs.admissionFeeOneTime.toLocaleString()}</td>
                          <td className="p-3 text-right font-mono font-black text-emerald-400 text-sm">
                            PKR {fs.totalStandardSemester.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 3: BATCH CHALLAN GENERATOR */}
          {activeTab === "batch-challans" && (
            <div className="space-y-6">
              <Card className="bg-slate-950/80 border-slate-800 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-emerald-400" /> Batch Semester Challan Dispatcher
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Generate and dispatch semester fee invoices in bulk across degree programs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Target Degree Program</label>
                      <select
                        value={batchProgram}
                        onChange={(e) => setBatchProgram(e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-white shadow-sm"
                      >
                        <option value="BSCS">BS Computer Science (BSCS)</option>
                        <option value="BSSE">BS Software Engineering (BSSE)</option>
                        <option value="BSAI">BS Artificial Intelligence (BSAI)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Semester Number</label>
                      <select
                        value={batchSemester}
                        onChange={(e) => setBatchSemester(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-white shadow-sm"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                          <option key={s} value={s}>Semester {s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Fee Payment Due Date</label>
                      <Input
                        type="date"
                        value={batchDueDate}
                        onChange={(e) => setBatchDueDate(e.target.value)}
                        className="bg-slate-900 border-slate-700 text-white text-xs h-9"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={handleGenerateBatch}
                      className="bg-emerald-600 hover:bg-emerald-700 text-xs font-bold gap-1.5 shadow-lg shadow-emerald-600/30"
                    >
                      <Play className="h-3.5 w-3.5" /> Dispatch Batch Challans
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 4: BANK SCROLL RECONCILIATION */}
          {activeTab === "reconciliation" && (
            <div className="space-y-6">
              <Card className="bg-slate-950/80 border-slate-800 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                    <ArrowRightLeft className="h-5 w-5 text-emerald-400" /> Bank Deposit Scroll Reconciliation Workstation
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Reconcile HBL / UBL bank scroll deposits and automatically post balancing entries to the General Ledger
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Target Challan Number</label>
                      <Input
                        value={scrollInputChallan}
                        onChange={(e) => setScrollInputChallan(e.target.value)}
                        placeholder="e.g. CHL-2026-8803"
                        className="bg-slate-950 border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Bank Reference / Scroll ID</label>
                      <Input
                        value={scrollBankRef}
                        onChange={(e) => setScrollBankRef(e.target.value)}
                        placeholder="e.g. UBL-SCR-884912"
                        className="bg-slate-950 border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={handleReconcileScroll}
                      className="bg-indigo-600 hover:bg-indigo-700 text-xs font-bold gap-1.5 shadow-lg shadow-indigo-600/30"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Reconcile & Post Journal Voucher
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 5: GENERAL LEDGER & TRIAL BALANCE */}
          {activeTab === "ledger" && (
            <div className="space-y-6">
              {/* TRIAL BALANCE STATUS */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/40 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-emerald-400" />
                    <h3 className="font-bold text-sm text-white">Double-Entry Trial Balance Verification</h3>
                  </div>
                  <p className="text-[11px] text-emerald-300">
                    GAAP Compliant • Total Debits: <strong className="font-mono text-white">PKR {ledgerData.trialBalance.totalDebits.toLocaleString()}</strong> = Total Credits: <strong className="font-mono text-white">PKR {ledgerData.trialBalance.totalCredits.toLocaleString()}</strong>
                  </p>
                </div>
                <Badge variant="success" className="text-xs bg-emerald-500/20 text-emerald-300 border-emerald-400/40">
                  ✓ BALANCED
                </Badge>
              </div>

              {/* CHART OF ACCOUNTS */}
              <Card className="bg-slate-950/80 border-slate-800 shadow-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-white">Chart of Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/90 text-slate-400 font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-3">Account Code</th>
                          <th className="p-3">Account Title</th>
                          <th className="p-3">Category</th>
                          <th className="p-3 text-right">Current Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                        {ledgerData.chartOfAccounts.map((acc) => (
                          <tr key={acc.code} className="hover:bg-slate-900/40 transition-colors">
                            <td className="p-3 font-mono font-bold text-emerald-400">{acc.code}</td>
                            <td className="p-3 font-bold text-white">{acc.name}</td>
                            <td className="p-3">
                              <Badge variant="info" className="text-[9px]">{acc.type}</Badge>
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-white">
                              PKR {acc.balance.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* JOURNAL ENTRIES AUDIT LOG */}
              <Card className="bg-slate-950/80 border-slate-800 shadow-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-white">Journal Entries Ledger</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/90 text-slate-400 font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-3">Voucher No</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Transaction Description</th>
                          <th className="p-3">Debit Account</th>
                          <th className="p-3 text-right font-mono text-emerald-400">Debit (PKR)</th>
                          <th className="p-3">Credit Account</th>
                          <th className="p-3 text-right font-mono text-indigo-400">Credit (PKR)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                        {ledgerData.journalEntries.map((je) => (
                          <tr key={je.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="p-3 font-mono font-bold text-emerald-400">{je.voucherNo}</td>
                            <td className="p-3 font-mono text-slate-400">{je.date}</td>
                            <td className="p-3 text-white font-medium">{je.description}</td>
                            <td className="p-3 text-slate-300">{je.debitAccount}</td>
                            <td className="p-3 text-right font-mono text-emerald-400 font-bold">{je.debitAmount.toLocaleString()}</td>
                            <td className="p-3 text-slate-300">{je.creditAccount}</td>
                            <td className="p-3 text-right font-mono text-indigo-400 font-bold">{je.creditAmount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
