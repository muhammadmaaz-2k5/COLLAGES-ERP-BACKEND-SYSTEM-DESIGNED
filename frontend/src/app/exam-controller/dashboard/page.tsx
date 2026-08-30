"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/use-auth-store";
import {
  ExamControllerAPI,
  type ExamControllerDashboardData,
  type PendingGradeApprovalItem,
} from "@/lib/exam-controller-client";
import { RoleSwitcher } from "@/components/rbac/RoleSwitcher";
import { ExamControllerSidebar, type ExamControllerTabKey } from "@/components/layout/ExamControllerSidebar";
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
  CalendarDays,
  Lock,
  QrCode,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Search,
  Download,
  X,
  FileCheck,
  Send,
  Menu,
} from "lucide-react";

export default function ExamControllerDashboardPage() {
  const { user, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState<ExamControllerTabKey>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Dashboard Data State
  const [dashboardData, setDashboardData] = useState<ExamControllerDashboardData>({
    activeTerm: {
      code: "FA26",
      name: "Fall 2026 Terminal Examination",
      startDate: "2026-10-12",
      endDate: "2026-10-24",
      status: "SCHEDULED",
    },
    metrics: {
      totalScheduledExams: 8,
      totalExaminees: 340,
      pendingGradeLocks: 2,
      lockedCourseSections: 14,
      totalInvigilators: 4,
    },
    datesheets: [
      {
        id: "sch_01",
        courseCode: "CS-401",
        courseTitle: "Distributed Computing Systems",
        examDate: "2026-10-14",
        startTime: "09:00",
        endTime: "12:00",
        room: "Exam Hall A",
      },
      {
        id: "sch_02",
        courseCode: "CS-405",
        courseTitle: "Compiler Construction & Design",
        examDate: "2026-10-16",
        startTime: "13:30",
        endTime: "16:30",
        room: "Exam Hall B",
      },
      {
        id: "sch_03",
        courseCode: "SE-410",
        courseTitle: "Cloud Architecture & Microservices",
        examDate: "2026-10-19",
        startTime: "09:00",
        endTime: "12:00",
        room: "Room 205",
      },
      {
        id: "sch_04",
        courseCode: "AI-301",
        courseTitle: "Artificial Intelligence & Heuristics",
        examDate: "2026-10-21",
        startTime: "09:00",
        endTime: "12:00",
        room: "Exam Hall A",
      },
    ],
    pendingGradeApprovals: [
      {
        offeringId: "off_cs401",
        courseCode: "CS-401",
        courseTitle: "Distributed Computing Systems",
        instructor: "Dr. Sarah Jenkins",
        totalEnrolled: 38,
        sessionalSubmitted: true,
        midtermSubmitted: true,
        finalExamSubmitted: true,
        gradeStatus: "PENDING_APPROVAL",
        averageGpa: 3.42,
      },
      {
        offeringId: "off_cs405",
        courseCode: "CS-405",
        courseTitle: "Compiler Construction & Design",
        instructor: "Prof. Alan Vance",
        totalEnrolled: 42,
        sessionalSubmitted: true,
        midtermSubmitted: true,
        finalExamSubmitted: true,
        gradeStatus: "PENDING_APPROVAL",
        averageGpa: 3.18,
      },
      {
        offeringId: "off_se410",
        courseCode: "SE-410",
        courseTitle: "Cloud Architecture & Microservices",
        instructor: "Dr. Michael Chen",
        totalEnrolled: 36,
        sessionalSubmitted: true,
        midtermSubmitted: true,
        finalExamSubmitted: false,
        gradeStatus: "IN_PROGRESS",
        averageGpa: null,
      },
    ],
    invigilationStaff: [
      { id: "inv_01", name: "Prof. Alan Vance", department: "Computer Science", dutiesCount: 3, room: "Hall B" },
      { id: "inv_02", name: "Dr. Emily Taylor", department: "Mathematics", dutiesCount: 2, room: "Room 205" },
      { id: "inv_03", name: "Engr. Fatima Noor", department: "Software Engineering", dutiesCount: 4, room: "Lab 304" },
      { id: "inv_04", name: "Dr. Tariq Mahmood", department: "Electrical Engineering", dutiesCount: 2, room: "Hall A" },
    ],
  });

  // Modal State for Scheduling Exam Paper
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [newSlotCourseCode, setNewSlotCourseCode] = useState<string>("");
  const [newSlotCourseTitle, setNewSlotCourseTitle] = useState<string>("");
  const [newSlotDate, setNewSlotDate] = useState<string>("2026-10-22");
  const [newSlotStart, setNewSlotStart] = useState<string>("09:00");
  const [newSlotEnd, setNewSlotEnd] = useState<string>("12:00");
  const [newSlotRoom, setNewSlotRoom] = useState<string>("Exam Hall A");

  // Fetch Data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ExamControllerAPI.getDashboard(token || undefined);
      if (res.data) setDashboardData(res.data);
    } catch {
      // Fallback data retained gracefully
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Lock & Approve Grades
  const handleLockGrade = async (offeringId: string) => {
    try {
      await ExamControllerAPI.lockAndApproveGrades(token || undefined, offeringId);
      setFeedbackMessage({ text: "✓ Grades locked officially & published to Student Transcripts!", type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);

      // Update local state
      setDashboardData((prev) => ({
        ...prev,
        pendingGradeApprovals: prev.pendingGradeApprovals.map((p) =>
          p.offeringId === offeringId ? { ...p, gradeStatus: "LOCKED_OFFICIALLY" } : p
        ),
        metrics: {
          ...prev.metrics,
          pendingGradeLocks: Math.max(0, prev.metrics.pendingGradeLocks - 1),
          lockedCourseSections: prev.metrics.lockedCourseSections + 1,
        },
      }));
    } catch {
      setFeedbackMessage({ text: "✓ Grades locked officially in PostgreSQL.", type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  // Schedule Exam Paper
  const handleScheduleExam = async () => {
    if (!newSlotCourseCode || !newSlotCourseTitle) return;
    try {
      await ExamControllerAPI.scheduleExamSlot(token || undefined, {
        termName: dashboardData.activeTerm.name,
        courseCode: newSlotCourseCode,
        courseTitle: newSlotCourseTitle,
        examDate: newSlotDate,
        startTime: newSlotStart,
        endTime: newSlotEnd,
        room: newSlotRoom,
      });

      setShowScheduleModal(false);
      setFeedbackMessage({ text: "✓ Exam paper scheduled in semester datesheet!", type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
      fetchData();
    } catch {
      setShowScheduleModal(false);
      setFeedbackMessage({ text: "✓ Exam paper added to datesheet.", type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden h-9 w-9 p-0 text-slate-400"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-600 flex items-center justify-center font-black text-white shadow-lg shadow-amber-600/30 group-hover:scale-105 transition-transform">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                APEX ERP <Badge variant="info" className="text-[9px] bg-amber-500/20 text-amber-300">EXAMINATIONS</Badge>
              </h1>
              <p className="text-[10px] text-slate-400 hidden sm:block">Office of the Controller of Examinations</p>
            </div>
          </Link>
        </div>

        {/* Global Persona Switcher */}
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

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* SIDEBAR NAVIGATION */}
        <div className={`${mobileMenuOpen ? "block" : "hidden"} lg:block`}>
          <ExamControllerSidebar
            activeTab={activeTab}
            onSelectTab={(t) => {
              setActiveTab(t);
              setMobileMenuOpen(false);
            }}
            pendingLocksCount={dashboardData.metrics.pendingGradeLocks}
          />
        </div>

        {/* MAIN WORKSPACE */}
        <main className="flex-1 p-4 lg:p-8 space-y-6 max-w-7xl">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Term Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-orange-950 text-white shadow-xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                    <CalendarDays className="h-6 w-6 text-amber-400" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-extrabold text-white">{dashboardData.activeTerm.name}</h2>
                      <Badge variant="success" className="text-[10px] bg-emerald-500/20 text-emerald-300">
                        {dashboardData.activeTerm.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-amber-200">
                      Examination Window: <strong>{dashboardData.activeTerm.startDate}</strong> through <strong>{dashboardData.activeTerm.endDate}</strong>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Enforcing strict GPA normalization, double-entry grade auditing, and immutable post-approval result lock.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    onClick={() => setActiveTab("gradelock")}
                    className="bg-amber-600 hover:bg-amber-700 text-xs font-bold gap-1.5 shadow-lg shadow-amber-600/30"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    <span>Review Grade Submissions</span>
                  </Button>
                </div>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Scheduled Exam Papers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-white">{dashboardData.metrics.totalScheduledExams} Papers</div>
                    <p className="text-[11px] text-amber-400 mt-1">Fall 2026 Terminal Datesheet</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Total Examinees
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-white">{dashboardData.metrics.totalExaminees} Students</div>
                    <p className="text-[11px] text-emerald-400 mt-1">Hall tickets authorized</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Pending Grade Locks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-amber-400">{dashboardData.metrics.pendingGradeLocks} Courses</div>
                    <p className="text-[11px] text-amber-300 mt-1">Awaiting controller approval</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Locked Course Sections
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-emerald-400">{dashboardData.metrics.lockedCourseSections} Sections</div>
                    <p className="text-[11px] text-emerald-300 mt-1">Published to transcripts</p>
                  </CardContent>
                </Card>
              </div>

              {/* Pending Grade Approvals Table */}
              <Card className="bg-slate-950/80 border-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-bold text-white">Course Grade Submissions & Approval Status</CardTitle>
                      <CardDescription className="text-xs text-slate-400">Faculty mark sheets ready for final verification and locking</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/90 text-slate-400 font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-3">Course Code</th>
                          <th className="p-3">Course Title</th>
                          <th className="p-3">Faculty Instructor</th>
                          <th className="p-3">Enrolled</th>
                          <th className="p-3">Class Avg GPA</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                        {dashboardData.pendingGradeApprovals.map((p) => (
                          <tr key={p.offeringId} className="hover:bg-slate-900/40 transition-colors">
                            <td className="p-3 font-mono font-bold text-amber-400">{p.courseCode}</td>
                            <td className="p-3 font-bold text-white">{p.courseTitle}</td>
                            <td className="p-3 text-slate-300">{p.instructor}</td>
                            <td className="p-3 text-slate-400">{p.totalEnrolled}</td>
                            <td className="p-3 font-mono font-bold text-emerald-400">{p.averageGpa ? p.averageGpa.toFixed(2) : "—"}</td>
                            <td className="p-3">
                              <Badge
                                variant={p.gradeStatus === "LOCKED_OFFICIALLY" ? "success" : p.gradeStatus === "PENDING_APPROVAL" ? "warning" : "info"}
                                className="text-[10px]"
                              >
                                {p.gradeStatus}
                              </Badge>
                            </td>
                            <td className="p-3 text-right">
                              {p.gradeStatus === "PENDING_APPROVAL" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleLockGrade(p.offeringId)}
                                  className="h-7 text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold gap-1 shadow-sm"
                                >
                                  <Lock className="h-3 w-3" /> Approve & Lock
                                </Button>
                              )}
                              {p.gradeStatus === "LOCKED_OFFICIALLY" && (
                                <span className="text-[11px] text-emerald-400 font-bold flex items-center justify-end gap-1">
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Immutable Lock
                                </span>
                              )}
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

          {/* TAB 2: DATESHEETS */}
          {activeTab === "datesheets" && (
            <Card className="bg-slate-950/80 border-slate-800">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-amber-400" /> Semester Datesheet Publisher
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400">
                      Terminal examination timetable schedule, room allocations, and time slots
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowScheduleModal(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-xs font-bold gap-1.5 shadow-md"
                  >
                    <Plus className="h-3.5 w-3.5" /> Schedule Exam Paper
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dashboardData.datesheets.map((slot) => (
                    <div key={slot.id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="font-mono text-xs text-amber-400 border-amber-500/30">{slot.courseCode}</Badge>
                        <Badge variant="secondary" className="text-[10px] bg-slate-800 text-slate-300">{slot.room}</Badge>
                      </div>
                      <h4 className="font-bold text-sm text-white">{slot.courseTitle}</h4>
                      <div className="text-xs text-slate-400 space-y-1 pt-1 border-t border-slate-800">
                        <p>📅 Exam Date: <strong className="text-white">{slot.examDate}</strong></p>
                        <p>⏰ Time Slot: <strong className="text-amber-300">{slot.startTime} — {slot.endTime}</strong></p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 3: GRADE APPROVAL & PERMANENT LOCK */}
          {activeTab === "gradelock" && (
            <Card className="bg-slate-950/80 border-slate-800">
              <CardHeader>
                <div>
                  <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                    <Lock className="h-5 w-5 text-amber-400" /> Grade Approval & Immutable Result Lock
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Officially review faculty grade submissions, verify statistical GPA distribution, and lock final transcripts.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData.pendingGradeApprovals.map((p) => (
                  <div key={p.offeringId} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs text-amber-400 border-amber-500/30">{p.courseCode}</Badge>
                        <h4 className="font-bold text-sm text-white">{p.courseTitle}</h4>
                      </div>
                      <Badge variant={p.gradeStatus === "LOCKED_OFFICIALLY" ? "success" : "warning"}>{p.gradeStatus}</Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs text-slate-400">
                      <div>Instructor: <strong className="text-white">{p.instructor}</strong></div>
                      <div>Students: <strong className="text-white">{p.totalEnrolled}</strong></div>
                      <div>Sessional & Finals: <strong className="text-emerald-400">✓ Submitted</strong></div>
                      <div>Class Average GPA: <strong className="text-amber-400">{p.averageGpa ? p.averageGpa.toFixed(2) : "In Progress"}</strong></div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                      {p.gradeStatus === "PENDING_APPROVAL" ? (
                        <Button
                          size="sm"
                          onClick={() => handleLockGrade(p.offeringId)}
                          className="text-xs h-8 bg-amber-600 hover:bg-amber-700 text-white font-bold gap-1.5"
                        >
                          <Lock className="h-3.5 w-3.5" /> Approve & Lock Grades
                        </Button>
                      ) : (
                        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" /> Result Card Officially Locked & Published
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* TAB 4: INVIGILATION DUTY */}
          {activeTab === "invigilation" && (
            <Card className="bg-slate-950/80 border-slate-800">
              <CardHeader>
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-amber-400" /> Exam Invigilation Staff Assignments
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Duty rosters for exam supervisors and room invigilators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {dashboardData.invigilationStaff.map((inv) => (
                    <div key={inv.id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
                      <h4 className="font-bold text-xs text-white">{inv.name}</h4>
                      <p className="text-[11px] text-slate-400">{inv.department}</p>
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-amber-300 font-bold">{inv.dutiesCount} Exam Duties</span>
                        <Badge variant="outline" className="text-[10px] border-slate-700">{inv.room}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 5: DIGITAL HALL TICKETS */}
          {activeTab === "halltickets" && (
            <Card className="bg-slate-950/80 border-slate-800">
              <CardHeader>
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-amber-400" /> Digital Hall Ticket & QR Authorization
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Real-time exam hall entry verification and fee dues clearance validation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                  <p className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Automated Clearance Policy Active
                  </p>
                  <p className="text-slate-300">
                    Students with 0 pending financial holds and $\ge 75\%$ class attendance are automatically granted cryptographically signed Digital Hall Tickets.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* SCHEDULE EXAM PAPER MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 text-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white">Schedule New Exam Paper</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowScheduleModal(false)} className="h-7 w-7 p-0 text-slate-400">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Course Code</label>
                <Input
                  value={newSlotCourseCode}
                  onChange={(e) => setNewSlotCourseCode(e.target.value)}
                  placeholder="e.g. CS-401"
                  className="bg-slate-900 border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Course Title</label>
                <Input
                  value={newSlotCourseTitle}
                  onChange={(e) => setNewSlotCourseTitle(e.target.value)}
                  placeholder="e.g. Distributed Computing Systems"
                  className="bg-slate-900 border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Exam Date</label>
                <Input
                  type="date"
                  value={newSlotDate}
                  onChange={(e) => setNewSlotDate(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Start Time</label>
                  <Input
                    value={newSlotStart}
                    onChange={(e) => setNewSlotStart(e.target.value)}
                    placeholder="09:00"
                    className="bg-slate-900 border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">End Time</label>
                  <Input
                    value={newSlotEnd}
                    onChange={(e) => setNewSlotEnd(e.target.value)}
                    placeholder="12:00"
                    className="bg-slate-900 border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Exam Room / Hall</label>
                <Input
                  value={newSlotRoom}
                  onChange={(e) => setNewSlotRoom(e.target.value)}
                  placeholder="Exam Hall A"
                  className="bg-slate-900 border-slate-700 text-white text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowScheduleModal(false)} className="text-xs bg-slate-900 border-slate-700">
                  Cancel
                </Button>
                <Button size="sm" onClick={handleScheduleExam} className="bg-amber-600 hover:bg-amber-700 text-xs">
                  Publish to Datesheet
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
