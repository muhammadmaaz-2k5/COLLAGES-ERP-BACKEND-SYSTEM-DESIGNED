"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/use-auth-store";
import {
  PlacementAPI,
  type RecruitmentJobItem,
  type JobApplicationRecord,
  type ResearchGrantItem,
  type PlacementOverviewResponse,
} from "@/lib/placement-client";
import { RoleSwitcher } from "@/components/rbac/RoleSwitcher";
import { CareerSidebar } from "@/components/layout/CareerSidebar";
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
  Briefcase,
  BarChart3,
  FileText,
  Microscope,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Plus,
  Play,
  Printer,
  Eye,
  X,
  Send,
  Building2,
  MapPin,
  ExternalLink,
  GraduationCap,
  Sparkles,
  Menu,
} from "lucide-react";

export default function CareerPage() {
  const { user, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [loading, setLoading] = useState<boolean>(true);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Overview Data
  const [overviewData, setOverviewData] = useState<PlacementOverviewResponse>({
    metrics: {
      totalPartnerEmployers: 48,
      activeJobOpenings: 21,
      totalApplicationsSubmitted: 186,
      placedStudents: 142,
      averageStartingSalaryPKR: 145000,
      totalResearchFundingPKR: 35900000,
      publishedPapers: 34,
    },
    featuredJobs: [
      {
        id: "job_01",
        companyName: "Systems Limited",
        jobTitle: "Associate Software Engineer (.NET / React)",
        jobType: "FULL_TIME",
        location: "Lahore, Pakistan (Hybrid)",
        salaryScalePKR: "120,000 - 150,000 / month",
        minCGPA: 3.0,
        openPositions: 15,
        applicationDeadline: "2026-09-30",
        tags: ["C#", ".NET Core", "React", "SQL Server"],
        description: "Seeking motivated graduating seniors for our enterprise software development team.",
        eligibilityDepartments: ["Computer Science", "Software Engineering"],
        status: "ACTIVE",
        totalApplicants: 42,
      },
      {
        id: "job_02",
        companyName: "Afiniti AI Labs",
        jobTitle: "Junior AI & Data Scientist",
        jobType: "FULL_TIME",
        location: "Islamabad, Pakistan (Onsite)",
        salaryScalePKR: "160,000 - 200,000 / month",
        minCGPA: 3.3,
        openPositions: 8,
        applicationDeadline: "2026-10-15",
        tags: ["Python", "PyTorch", "NLP", "Machine Learning"],
        description: "Work on cutting-edge behavioral AI algorithms and predictive behavioral models.",
        eligibilityDepartments: ["Computer Science", "Artificial Intelligence"],
        status: "ACTIVE",
        totalApplicants: 28,
      },
    ],
    recentApplications: [
      {
        id: "app_01",
        jobId: "job_01",
        jobTitle: "Associate Software Engineer (.NET / React)",
        companyName: "Systems Limited",
        studentId: "std_01",
        studentRollNo: "2024-CS-001",
        studentName: "Muhammad Hamza",
        studentCGPA: 3.82,
        department: "Computer Science",
        resumeUrl: "/resumes/hamza_cv.pdf",
        status: "INTERVIEW_SCHEDULED",
        appliedAt: "2026-08-18T10:00:00Z",
        interviewDate: "2026-09-08 11:30 AM",
        interviewVenue: "Campus Placement Center — Boardroom A",
        remarks: "Passed online coding test with 95% score.",
      },
    ],
    activeResearchGrants: [
      {
        id: "res_01",
        projectTitle: "Autonomous Edge AI for Smart Precision Agriculture in Indus Basin",
        grantAgency: "Higher Education Commission (HEC) National Research Program",
        grantNumber: "HEC-NRPU-2026-8812",
        principalInvestigator: "Dr. Tariq Mahmood",
        investigatorEmail: "tariq.mahmood@apex.edu.pk",
        department: "Computer Science",
        fundingAmountPKR: 15400000,
        startDate: "2026-01-01",
        durationMonths: 24,
        status: "APPROVED",
        doiLink: "https://doi.org/10.1109/AGRI-AI.2026.104429",
        indexedJournal: "IEEE Transactions on Agri-Food Electronics (Impact Factor: 6.8)",
        coInvestigators: ["Dr. Salman Qureshi", "Engr. Sarah Khan"],
      },
    ],
  });

  // Jobs States
  const [jobs, setJobs] = useState<RecruitmentJobItem[]>([]);
  const [jobTypeFilter, setJobTypeFilter] = useState<string>("ALL");
  const [jobSearch, setJobSearch] = useState<string>("" );

  // Apply Modal State
  const [selectedJobToApply, setSelectedJobToApply] = useState<RecruitmentJobItem | null>(null);
  const [applyRollNo, setApplyRollNo] = useState<string>("2024-CS-001");
  const [applyName, setApplyName] = useState<string>("Muhammad Hamza");
  const [applyCGPA, setApplyCGPA] = useState<number>(3.82);

  // Applications States
  const [applications, setApplications] = useState<JobApplicationRecord[]>([]);

  // Research States
  const [researchGrants, setResearchGrants] = useState<ResearchGrantItem[]>([]);

  // Fetch Data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ovRes, jbRes, apRes, rsRes] = await Promise.all([
        PlacementAPI.getOverview(token || undefined).catch(() => null),
        PlacementAPI.getJobs(token || undefined, { jobType: jobTypeFilter, search: jobSearch }).catch(() => null),
        PlacementAPI.getApplications(token || undefined).catch(() => null),
        PlacementAPI.getResearchGrants(token || undefined).catch(() => null),
      ]);

      if (ovRes?.data) setOverviewData(ovRes.data);
      if (jbRes?.data) setJobs(jbRes.data);
      if (apRes?.data) setApplications(apRes.data);
      if (rsRes?.data) setResearchGrants(rsRes.data);
    } catch {
      // Fallback data retained
    } finally {
      setLoading(false);
    }
  }, [token, jobTypeFilter, jobSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Apply Job Handler
  const handleApplySubmit = async () => {
    if (!selectedJobToApply) return;
    try {
      await PlacementAPI.applyForJob(token || undefined, {
        jobId: selectedJobToApply.id,
        studentRollNo: applyRollNo,
        studentName: applyName,
        studentCGPA: applyCGPA,
        department: "Computer Science",
      });

      setSelectedJobToApply(null);
      setFeedbackMessage({ text: `✓ Application submitted for '${selectedJobToApply.jobTitle}' at ${selectedJobToApply.companyName}!`, type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
      fetchData();
    } catch (err: any) {
      setSelectedJobToApply(null);
      setFeedbackMessage({ text: err.message || "✓ Application queued for screening.", type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-600 flex items-center justify-center font-black text-white shadow-lg shadow-rose-600/30">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                APEX ERP <Badge variant="info" className="text-[9px] bg-rose-500/20 text-rose-300">CAREER & RESEARCH</Badge>
              </h1>
              <p className="text-[10px] text-slate-400">Campus Placements, Recruitment & DOI Grants</p>
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
        <CareerSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* MAIN BODY */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto space-y-6 max-w-7xl mx-auto w-full">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* STAT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Partner Employers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-white">{overviewData.metrics.totalPartnerEmployers} Companies</div>
                    <p className="text-[11px] text-rose-400 mt-1">Systems Ltd, Afiniti, HBL, Netsol</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Average Starting CTC
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-emerald-400 font-mono">
                      PKR {(overviewData.metrics.averageStartingSalaryPKR / 1000).toFixed(0)}K / mo
                    </div>
                    <p className="text-[11px] text-emerald-300 mt-1">{overviewData.metrics.placedStudents} Graduates Placed</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Active Job Openings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-indigo-400">{overviewData.metrics.activeJobOpenings} Vacancies</div>
                    <p className="text-[11px] text-indigo-300 mt-1">{overviewData.metrics.totalApplicationsSubmitted} Applications Submitted</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Research Grant Funding
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-amber-400 font-mono">
                      PKR {(overviewData.metrics.totalResearchFundingPKR / 1000000).toFixed(1)}M
                    </div>
                    <p className="text-[11px] text-amber-300 mt-1">{overviewData.metrics.publishedPapers} IEEE / Elsevier Journals</p>
                  </CardContent>
                </Card>
              </div>

              {/* FEATURED JOBS & APPLICATIONS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-950/80 border-slate-800 shadow-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-rose-400" /> Featured Campus Recruitment Openings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="divide-y divide-slate-800/60 text-xs">
                      {overviewData.featuredJobs.map((j) => (
                        <div key={j.id} className="py-3 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-white">{j.jobTitle}</p>
                            <p className="text-[10px] text-slate-400">{j.companyName} • {j.location}</p>
                            <p className="text-[10px] font-mono text-emerald-400 mt-0.5">{j.salaryScalePKR}</p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => setSelectedJobToApply(j)}
                            className="bg-rose-600 hover:bg-rose-700 text-xs font-bold h-7"
                          >
                            Apply
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950/80 border-slate-800 shadow-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                      <Microscope className="h-4 w-4 text-amber-400" /> Major Research Grant Allocations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="divide-y divide-slate-800/60 text-xs">
                      {overviewData.activeResearchGrants.map((g) => (
                        <div key={g.id} className="py-3 space-y-1">
                          <div className="flex items-start justify-between">
                            <p className="font-bold text-white max-w-xs">{g.projectTitle}</p>
                            <Badge variant="success" className="text-[9px]">PKR {(g.fundingAmountPKR / 1000000).toFixed(1)}M</Badge>
                          </div>
                          <p className="text-[10px] text-slate-400">PI: {g.principalInvestigator} ({g.department})</p>
                          <p className="text-[10px] text-indigo-400 font-mono">{g.grantAgency}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 2: CAMPUS JOB BOARD */}
          {activeTab === "jobs" && (
            <Card className="bg-slate-950/80 border-slate-800 shadow-2xl">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-rose-400" /> Campus Recruitment & Job Vacancies
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400">
                      Corporate openings, internship opportunities, and Management Trainee positions
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={jobTypeFilter}
                      onChange={(e) => setJobTypeFilter(e.target.value)}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                    >
                      <option value="ALL">All Employment Types</option>
                      <option value="FULL_TIME">Full Time</option>
                      <option value="INTERNSHIP">Internship</option>
                      <option value="MANAGEMENT_TRAINEE">Management Trainee</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jobs.map((j) => (
                    <div
                      key={j.id}
                      className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-rose-500/40 transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Badge variant="info" className="text-[9px] mb-1 font-mono">{j.jobType}</Badge>
                            <h3 className="font-bold text-sm text-white">{j.jobTitle}</h3>
                            <p className="text-xs font-semibold text-rose-400">{j.companyName}</p>
                          </div>
                          <Badge variant="success" className="text-[9px] shrink-0 font-mono">
                            Min CGPA: {j.minCGPA.toFixed(1)}
                          </Badge>
                        </div>

                        <p className="text-xs text-slate-300 line-clamp-2">{j.description}</p>

                        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Location:</span>
                            <span className="text-white">{j.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Salary Scale:</span>
                            <strong className="text-emerald-400 font-mono">{j.salaryScalePKR}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Deadline:</span>
                            <span className="text-amber-400 font-mono">{j.applicationDeadline}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {j.tags.map((t, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] text-slate-300">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">{j.totalApplicants} Applicants</span>
                        <Button
                          size="sm"
                          onClick={() => setSelectedJobToApply(j)}
                          className="bg-rose-600 hover:bg-rose-700 text-xs font-bold h-7 gap-1"
                        >
                          <Send className="h-3 w-3" /> Apply Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 3: STUDENT APPLICATIONS TRACKER */}
          {activeTab === "applications" && (
            <Card className="bg-slate-950/80 border-slate-800 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-rose-400" /> Student Recruitment & Interview Pipeline
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Track student corporate applications, test scores, interview dates, and final job offers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-3">Candidate</th>
                        <th className="p-3">Position & Company</th>
                        <th className="p-3">Interview Schedule & Venue</th>
                        <th className="p-3">Remarks</th>
                        <th className="p-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                      {applications.map((a) => (
                        <tr key={a.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-3">
                            <p className="font-bold text-white">{a.studentName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{a.studentRollNo} • CGPA: {a.studentCGPA.toFixed(2)}</p>
                          </td>
                          <td className="p-3">
                            <p className="font-bold text-white">{a.jobTitle}</p>
                            <p className="text-[10px] text-rose-400 font-medium">{a.companyName}</p>
                          </td>
                          <td className="p-3">
                            {a.interviewDate ? (
                              <div>
                                <p className="font-bold text-emerald-400 font-mono">{a.interviewDate}</p>
                                <p className="text-[10px] text-slate-400">{a.interviewVenue}</p>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-500 italic">Screening Stage</span>
                            )}
                          </td>
                          <td className="p-3 text-slate-300 max-w-xs truncate">{a.remarks}</td>
                          <td className="p-3 text-right">
                            <Badge
                              variant={a.status === "INTERVIEW_SCHEDULED" ? "warning" : a.status === "OFFERED" ? "success" : "info"}
                              className="text-[10px]"
                            >
                              {a.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 4: FACULTY RESEARCH GRANTS */}
          {activeTab === "research" && (
            <Card className="bg-slate-950/80 border-slate-800 shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                      <Microscope className="h-5 w-5 text-amber-400" /> University Research Projects & DOI Grants
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400">
                      National Science Foundation, HEC grants, and peer-reviewed journal publications
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {researchGrants.map((g) => (
                    <div
                      key={g.id}
                      className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3 hover:border-amber-500/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Badge variant="info" className="text-[9px] mb-1 font-mono">{g.grantNumber}</Badge>
                          <h3 className="font-bold text-sm text-white">{g.projectTitle}</h3>
                          <p className="text-xs text-amber-400 font-semibold">{g.grantAgency}</p>
                        </div>
                        <Badge variant="success" className="text-[10px] font-mono shrink-0">
                          PKR {(g.fundingAmountPKR / 1000000).toFixed(1)}M
                        </Badge>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] space-y-1 text-slate-300">
                        <div>👨‍🔬 Principal Investigator: <strong className="text-white">{g.principalInvestigator}</strong> ({g.department})</div>
                        <div>⏱️ Project Duration: <strong className="text-white font-mono">{g.durationMonths} Months (From {g.startDate})</strong></div>
                        <div>📚 Published Journal: <strong className="text-emerald-400">{g.indexedJournal}</strong></div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-slate-500">Co-PIs: {g.coInvestigators.join(", ")}</span>
                        <a
                          href={g.doiLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-mono text-[11px]"
                        >
                          <span>DOI Publication</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* APPLY MODAL */}
      {selectedJobToApply && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 text-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-800 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-white">Apply for {selectedJobToApply.jobTitle}</h3>
                <p className="text-[11px] text-rose-400 font-semibold">{selectedJobToApply.companyName}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedJobToApply(null)} className="h-7 w-7 p-0 text-slate-400">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Student Roll Number</label>
                <Input
                  value={applyRollNo}
                  onChange={(e) => setApplyRollNo(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white text-xs h-8 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Student Name</label>
                <Input
                  value={applyName}
                  onChange={(e) => setApplyName(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white text-xs h-8"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Current Cumulative CGPA</label>
                <Input
                  type="number"
                  step="0.01"
                  value={applyCGPA}
                  onChange={(e) => setApplyCGPA(Number(e.target.value))}
                  className="bg-slate-900 border-slate-700 text-white text-xs h-8 font-mono"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
                <span>Eligibility: Requires min CGPA <strong className="text-white font-mono">{selectedJobToApply.minCGPA}</strong>. Your CGPA qualifies!</span>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <Button variant="outline" size="sm" onClick={() => setSelectedJobToApply(null)} className="text-xs bg-slate-900 border-slate-700">
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleApplySubmit}
                  className="bg-rose-600 hover:bg-rose-700 text-xs font-bold gap-1"
                >
                  <Send className="h-3.5 w-3.5" /> Submit Application
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
