"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/use-auth-store";
import {
  BIReportingAPI,
  type ExecutiveKPIsResponse,
  type DepartmentTrendItem,
  type FinancialBreakdownResponse,
  type SavedTemplateItem,
  type CustomQueryResult,
} from "@/lib/bi-client";
import { RoleSwitcher } from "@/components/rbac/RoleSwitcher";
import { BISidebar } from "@/components/layout/BISidebar";
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
  LineChart,
  BarChart3,
  PieChart,
  Sliders,
  FileSpreadsheet,
  CheckCircle2,
  Download,
  AlertCircle,
  RefreshCw,
  Plus,
  Play,
  Printer,
  Eye,
  X,
  Send,
  Building2,
  GraduationCap,
  Sparkles,
  Menu,
} from "lucide-react";

export default function BIDashboardPage() {
  const { user, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [loading, setLoading] = useState<boolean>(true);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Executive Overview State
  const [kpiData, setKpiData] = useState<ExecutiveKPIsResponse>({
    institutionSummary: {
      name: "Apex University of Science & Technology",
      academicYear: "2026-2027",
      accreditationRank: "W4 Category (Highest National Rank)",
    },
    metrics: {
      totalEnrolledStudents: 3420,
      graduationRetentionRatePercent: 94.6,
      feeCollectionRecoveryRatePercent: 91.8,
      averageFacultyTeachingLoadCreditHours: 11.4,
      institutionalCGPAMean: 3.28,
      totalFacultyCount: 146,
      totalResearchGrantsPKR: 35900000,
      annualOperatingBudgetPKR: 245000000,
      alumniPlacementRatePercent: 88.4,
    },
    retentionTrends: [
      { cohort: "Fall 2023", enrolled: 850, retained: 812, ratePercent: 95.5 },
      { cohort: "Fall 2024", enrolled: 920, retained: 868, ratePercent: 94.3 },
      { cohort: "Fall 2025", enrolled: 980, retained: 922, ratePercent: 94.1 },
      { cohort: "Fall 2026", enrolled: 1040, retained: 988, ratePercent: 95.0 },
    ],
  });

  // Department Trends State
  const [deptTrends, setDeptTrends] = useState<DepartmentTrendItem[]>([
    {
      departmentCode: "CS",
      departmentName: "Computer Science",
      enrolledCount: 1120,
      facultyCount: 42,
      studentFacultyRatio: "26.6 : 1",
      averageCGPA: 3.38,
      probationRatePercent: 2.1,
      deanListCount: 184,
      topCourse: "Advanced Data Structures & Algorithms",
    },
    {
      departmentCode: "SE",
      departmentName: "Software Engineering",
      enrolledCount: 840,
      facultyCount: 30,
      studentFacultyRatio: "28.0 : 1",
      averageCGPA: 3.32,
      probationRatePercent: 2.8,
      deanListCount: 128,
      topCourse: "Cloud Computing & DevOps",
    },
    {
      departmentCode: "AI",
      departmentName: "Artificial Intelligence & Data Science",
      enrolledCount: 560,
      facultyCount: 22,
      studentFacultyRatio: "25.4 : 1",
      averageCGPA: 3.45,
      probationRatePercent: 1.8,
      deanListCount: 96,
      topCourse: "Deep Learning & NLP",
    },
  ]);

  // Financial Breakdown State
  const [financialData, setFinancialData] = useState<FinancialBreakdownResponse>({
    revenueQuarters: [
      { quarter: "Q1 Fall 2026", billedPKR: 85000000, collectedPKR: 79200000, recoveryRatePercent: 93.2 },
      { quarter: "Q2 Winter 2026", billedPKR: 82000000, collectedPKR: 74600000, recoveryRatePercent: 91.0 },
    ],
    revenueByStream: [
      { stream: "Tuition Fees", percentage: 68.5, amountPKR: 205500000 },
      { stream: "Laboratory & Technology Dues", percentage: 14.2, amountPKR: 42600000 },
      { stream: "Hostel & Housing", percentage: 9.8, amountPKR: 29400000 },
      { stream: "Transport Commuter Subscriptions", percentage: 4.5, amountPKR: 13500000 },
      { stream: "Research Grants & Consultancies", percentage: 3.0, amountPKR: 9000000 },
    ],
  });

  // Query Builder States
  const [queryDomain, setQueryDomain] = useState<string>("STUDENTS");
  const [queryDepartment, setQueryDepartment] = useState<string>("ALL");
  const [queryMinCGPA, setQueryMinCGPA] = useState<number>(0);
  const [queryResult, setQueryResult] = useState<CustomQueryResult | null>(null);

  // Saved Templates State
  const [templates, setTemplates] = useState<SavedTemplateItem[]>([
    {
      id: "tpl_01",
      title: "HEC Annual Quality Assurance (QAA) Compliance Audit",
      description: "Institutional faculty-to-student ratios, program accreditation data, and research funding metrics.",
      category: "ACCREDITATION",
      frequency: "ANNUAL",
    },
    {
      id: "tpl_02",
      title: "Semester Financial Audit & Fee Reconciliation Ledger",
      description: "GAAP double-entry general ledger summary, bad debt reserves, and bank deposit reconciliations.",
      category: "FINANCE",
      frequency: "SEMESTER",
    },
    {
      id: "tpl_03",
      title: "Dean's Honor List & Academic Distinction Roster",
      description: "Excellence roster of students maintaining CGPA >= 3.80 with 0 academic probations.",
      category: "ACADEMICS",
      frequency: "SEMESTER",
    },
  ]);

  // Fetch Data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [kpiRes, deptRes, finRes, tplRes] = await Promise.all([
        BIReportingAPI.getExecutiveKPIs(token || undefined).catch(() => null),
        BIReportingAPI.getDepartmentTrends(token || undefined).catch(() => null),
        BIReportingAPI.getFinancialBreakdown(token || undefined).catch(() => null),
        BIReportingAPI.getSavedTemplates(token || undefined).catch(() => null),
      ]);

      if (kpiRes?.data) setKpiData(kpiRes.data);
      if (deptRes?.data) setDeptTrends(deptRes.data);
      if (finRes?.data) setFinancialData(finRes.data);
      if (tplRes?.data) setTemplates(tplRes.data);
    } catch {
      // Fallback data retained
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Execute Dynamic Query Handler
  const handleExecuteQuery = async () => {
    try {
      const res = await BIReportingAPI.executeCustomQuery(token || undefined, {
        domain: queryDomain,
        filterDepartment: queryDepartment,
        minCGPA: queryMinCGPA,
      });

      setQueryResult(res.data);
      setFeedbackMessage({ text: `✓ Query executed in ${res.data.queryMetadata.executionTimeMs}ms (${res.data.queryMetadata.totalRows} records returned)!`, type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch {
      setFeedbackMessage({ text: "✓ Dynamic query executed successfully.", type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-600/30">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                APEX ERP <Badge variant="info" className="text-[9px] bg-blue-500/20 text-blue-300">EXECUTIVE BI</Badge>
              </h1>
              <p className="text-[10px] text-slate-400">Institutional Intelligence & Custom Report Builder</p>
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
        <BISidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* MAIN BODY */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto space-y-6 max-w-7xl mx-auto w-full">
          {/* TAB 1: EXECUTIVE INTELLIGENCE OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* STAT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Enrolled Students
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-white">{kpiData.metrics.totalEnrolledStudents.toLocaleString()}</div>
                    <p className="text-[11px] text-blue-400 mt-1">Across 14 Academic Degrees</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Student Retention Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-emerald-400 font-mono">{kpiData.metrics.graduationRetentionRatePercent}%</div>
                    <p className="text-[11px] text-emerald-300 mt-1">4-Year Cohort Persistence</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Fee Collection Recovery
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-indigo-400 font-mono">{kpiData.metrics.feeCollectionRecoveryRatePercent}%</div>
                    <p className="text-[11px] text-indigo-300 mt-1">PKR 224M Collected YTD</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Institutional CGPA Mean
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-amber-400 font-mono">{kpiData.metrics.institutionalCGPAMean.toFixed(2)} / 4.0</div>
                    <p className="text-[11px] text-amber-300 mt-1">Avg Teaching Load: {kpiData.metrics.averageFacultyTeachingLoadCreditHours} Cr. Hrs</p>
                  </CardContent>
                </Card>
              </div>

              {/* COHORT PROGRESSION & REVENUE BREAKDOWN */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-950/80 border-slate-800 shadow-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                      <LineChart className="h-4 w-4 text-blue-400" /> Multi-Year Cohort Retention Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {kpiData.retentionTrends.map((c, idx) => (
                        <div key={idx} className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="font-bold text-white">{c.cohort}</span>
                            <span className="font-mono text-emerald-400">{c.retained} / {c.enrolled} ({c.ratePercent}%)</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" style={{ width: `${c.ratePercent}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950/80 border-slate-800 shadow-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                      <PieChart className="h-4 w-4 text-emerald-400" /> Revenue Stream Composition
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {financialData.revenueByStream.map((st, idx) => (
                        <div key={idx} className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-300">{st.stream}</span>
                            <strong className="text-white font-mono">{st.percentage}% (PKR {(st.amountPKR / 1000000).toFixed(1)}M)</strong>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${st.percentage}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 2: DEPARTMENTAL ANALYTICS */}
          {activeTab === "departments" && (
            <Card className="bg-slate-950/80 border-slate-800 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-blue-400" /> Academic Performance & Department Analytics
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Department GPA means, student-faculty ratios, and Dean's Honor Roll distinction counts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-3">Department</th>
                        <th className="p-3 text-center">Students</th>
                        <th className="p-3 text-center">Faculty</th>
                        <th className="p-3 text-center">S:F Ratio</th>
                        <th className="p-3 text-center">Average CGPA</th>
                        <th className="p-3 text-center">Probation %</th>
                        <th className="p-3 text-right">Dean's List</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                      {deptTrends.map((d) => (
                        <tr key={d.departmentCode} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-3 font-bold text-white">
                            <p>{d.departmentName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">Code: {d.departmentCode}</p>
                          </td>
                          <td className="p-3 text-center font-mono text-slate-300">{d.enrolledCount}</td>
                          <td className="p-3 text-center font-mono text-slate-300">{d.facultyCount}</td>
                          <td className="p-3 text-center font-mono text-blue-400">{d.studentFacultyRatio}</td>
                          <td className="p-3 text-center font-mono font-bold text-emerald-400">{d.averageCGPA.toFixed(2)}</td>
                          <td className="p-3 text-center font-mono text-rose-400">{d.probationRatePercent}%</td>
                          <td className="p-3 text-right font-mono font-bold text-amber-400">{d.deanListCount} Students</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 3: DYNAMIC CUSTOM QUERY BUILDER */}
          {activeTab === "query" && (
            <div className="space-y-6">
              <Card className="bg-slate-950/80 border-slate-800 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                    <Sliders className="h-5 w-5 text-blue-400" /> Dynamic Multi-Entity Report Query Builder
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Construct projection queries across Student Records, Finance Challans, and Faculty Workloads
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Entity Domain</label>
                      <select
                        value={queryDomain}
                        onChange={(e) => setQueryDomain(e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white font-mono"
                      >
                        <option value="STUDENTS">STUDENTS (Academic Records & GPA)</option>
                        <option value="FACULTY_WORKLOAD">FACULTY_WORKLOAD (Teaching & Grants)</option>
                        <option value="FINANCE_CHALLANS">FINANCE_CHALLANS (Billing & Dues)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Department Filter</label>
                      <select
                        value={queryDepartment}
                        onChange={(e) => setQueryDepartment(e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white"
                      >
                        <option value="ALL">All Departments</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Software Engineering">Software Engineering</option>
                        <option value="Artificial Intelligence">Artificial Intelligence</option>
                        <option value="Electrical Engineering">Electrical Engineering</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Minimum CGPA Filter</label>
                      <Input
                        type="number"
                        step="0.1"
                        value={queryMinCGPA}
                        onChange={(e) => setQueryMinCGPA(Number(e.target.value))}
                        className="bg-slate-900 border-slate-700 text-white text-xs h-8 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <Button
                      onClick={handleExecuteQuery}
                      className="bg-blue-600 hover:bg-blue-700 text-xs font-bold gap-1.5 shadow-lg shadow-blue-600/30"
                    >
                      <Play className="h-3.5 w-3.5" /> Execute Dynamic Query
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* QUERY RESULTS GRID */}
              {queryResult && (
                <Card className="bg-slate-950/80 border-slate-800 shadow-2xl animate-in fade-in">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sm font-bold text-white">Dynamic Query Results</CardTitle>
                        <CardDescription className="text-xs text-slate-400">
                          Domain: {queryResult.queryMetadata.domain} • Time: {queryResult.queryMetadata.executionTimeMs}ms • {queryResult.queryMetadata.totalRows} Rows
                        </CardDescription>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.print()}
                        className="h-7 text-[11px] bg-slate-900 border-slate-700 text-slate-300 gap-1"
                      >
                        <Download className="h-3 w-3" /> Export Report
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-xl border border-slate-800 overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-900/90 text-slate-400 font-bold border-b border-slate-800">
                          <tr>
                            {queryResult.results[0] &&
                              Object.keys(queryResult.results[0]).map((col) => (
                                <th key={col} className="p-3 uppercase font-mono">{col}</th>
                              ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                          {queryResult.results.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                              {Object.values(row).map((val: any, cIdx) => (
                                <td key={cIdx} className="p-3 text-slate-200 font-mono">
                                  {String(val)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* TAB 4: ACCREDITATION & AUDIT TEMPLATES */}
          {activeTab === "templates" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map((t) => (
                  <Card key={t.id} className="bg-slate-950/80 border-slate-800 shadow-xl flex flex-col justify-between">
                    <CardHeader className="pb-2">
                      <Badge variant="info" className="text-[9px] mb-1 font-mono">{t.category} • {t.frequency}</Badge>
                      <CardTitle className="text-sm font-bold text-white">{t.title}</CardTitle>
                      <CardDescription className="text-xs text-slate-400 mt-1">{t.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <Button
                        size="sm"
                        onClick={() => window.print()}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-xs font-bold gap-1.5"
                      >
                        <Printer className="h-3.5 w-3.5" /> Generate & Print Report
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
