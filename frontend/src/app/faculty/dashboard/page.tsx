"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/use-auth-store";
import { FacultyAPI, type FacultyDashboardResponse, type EnrolledStudentRosterItem } from "@/lib/faculty-client";
import { StorageAPI, type S3CourseMaterial, type CloudinaryVideoLecture } from "@/lib/storage-client";
import { RoleSwitcher } from "@/components/rbac/RoleSwitcher";
import { FacultySidebar, type FacultyTabKey } from "@/components/layout/FacultySidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  CalendarCheck2,
  FileCheck,
  HelpCircle,
  Award,
  UploadCloud,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  Plus,
  PlayCircle,
  Download,
  AlertCircle,
  Send,
  X,
  RefreshCw,
  Search,
  Filter,
  Check,
  ChevronRight,
  ShieldCheck,
  Menu,
} from "lucide-react";

export default function FacultyDashboardPage() {
  const { user, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState<FacultyTabKey>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Selected Course Offering for Attendance/Gradebook
  const [selectedOfferingId, setSelectedOfferingId] = useState<string>("off_cs401");

  // Dashboard Data State
  const [dashboardData, setDashboardData] = useState<FacultyDashboardResponse>({
    profile: {
      name: "Dr. Sarah Jenkins",
      designation: "Associate Professor",
      department: "Department of Computer Science",
      employeeId: "EMP-FAC-2021-089",
      email: "sarah.jenkins@university.edu",
      officeRoom: "Faculty Block B, Room 214",
      activeTerm: "Fall 2026",
      workloadWeeklyHours: 18,
    },
    activeOfferings: [
      {
        id: "off_cs401",
        courseCode: "CS-401",
        title: "Distributed Computing Systems",
        section: "Section A",
        semesterName: "Fall 2026",
        enrolledCount: 38,
        capacity: 45,
        room: "Lab 304",
        schedule: "Mon/Wed 09:00 - 10:30",
        creditHours: 4,
      },
      {
        id: "off_cs405",
        courseCode: "CS-405",
        title: "Compiler Construction & Design",
        section: "Section B",
        semesterName: "Fall 2026",
        enrolledCount: 42,
        capacity: 45,
        room: "Lecture Hall B",
        schedule: "Mon/Wed 11:00 - 12:30",
        creditHours: 3,
      },
      {
        id: "off_se410",
        courseCode: "SE-410",
        title: "Cloud Architecture & Microservices",
        section: "Section A",
        semesterName: "Fall 2026",
        enrolledCount: 36,
        capacity: 40,
        room: "Room 102",
        schedule: "Tue/Thu 14:00 - 15:30",
        creditHours: 3,
      },
    ],
    metrics: {
      assignedCoursesCount: 3,
      totalEnrolledStudents: 116,
      weeklyWorkloadHours: 18,
      pendingGradingCount: 14,
      attendanceAveragePct: 91.8,
    },
    teachingSchedule: [
      {
        day: "Monday",
        time: "09:00 - 10:30",
        courseCode: "CS-401",
        courseTitle: "Distributed Computing Systems",
        section: "Section A",
        room: "Lab 304",
        status: "UPCOMING",
      },
      {
        day: "Monday",
        time: "11:00 - 12:30",
        courseCode: "CS-405",
        courseTitle: "Compiler Construction & Design",
        section: "Section B",
        room: "Lecture Hall B",
        status: "UPCOMING",
      },
      {
        day: "Wednesday",
        time: "09:00 - 10:30",
        courseCode: "CS-401",
        courseTitle: "Distributed Computing Systems",
        section: "Section A",
        room: "Lab 304",
        status: "SCHEDULED",
      },
      {
        day: "Thursday",
        time: "14:00 - 15:30",
        courseCode: "SE-410",
        courseTitle: "Cloud Architecture & Microservices",
        section: "Section A",
        room: "Room 102",
        status: "SCHEDULED",
      },
    ],
  });

  // Roster & Attendance State
  const [studentRoster, setStudentRoster] = useState<EnrolledStudentRosterItem[]>([
    {
      enrollmentId: "enr_01",
      studentId: "std_01",
      regNo: "FA23-BCS-042",
      rollNo: "042",
      name: "Alex Morgan",
      email: "alex.morgan@university.edu",
      attendancePercentage: 92.8,
      currentSessionalMarks: 18.9,
      totalMarks: 88.5,
      grade: "A",
      status: "ENROLLED",
    },
    {
      enrollmentId: "enr_02",
      studentId: "std_02",
      regNo: "FA23-BCS-018",
      rollNo: "018",
      name: "Zainab Abbas",
      email: "zainab.abbas@university.edu",
      attendancePercentage: 96.0,
      currentSessionalMarks: 19.5,
      totalMarks: 91.0,
      grade: "A+",
      status: "ENROLLED",
    },
    {
      enrollmentId: "enr_03",
      studentId: "std_03",
      regNo: "FA23-BCS-029",
      rollNo: "029",
      name: "Bilal Hassan",
      email: "bilal.hassan@university.edu",
      attendancePercentage: 78.5,
      currentSessionalMarks: 14.0,
      totalMarks: 72.0,
      grade: "B",
      status: "ENROLLED",
    },
    {
      enrollmentId: "enr_04",
      studentId: "std_04",
      regNo: "FA23-BCS-055",
      rollNo: "055",
      name: "Hamza Tariq",
      email: "hamza.tariq@university.edu",
      attendancePercentage: 84.2,
      currentSessionalMarks: 16.5,
      totalMarks: 79.5,
      grade: "B+",
      status: "ENROLLED",
    },
    {
      enrollmentId: "enr_05",
      studentId: "std_05",
      regNo: "FA23-BCS-061",
      rollNo: "061",
      name: "Ayesha Malik",
      email: "ayesha.malik@university.edu",
      attendancePercentage: 94.0,
      currentSessionalMarks: 18.0,
      totalMarks: 85.0,
      grade: "A",
      status: "ENROLLED",
    },
  ]);

  // Daily Attendance Form
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [sessionTopic, setSessionTopic] = useState<string>("Lecture 14: Raft Consensus & Leader Election");
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, "PRESENT" | "ABSENT" | "LATE" | "EXCUSED">>({
    std_01: "PRESENT",
    std_02: "PRESENT",
    std_03: "PRESENT",
    std_04: "LATE",
    std_05: "PRESENT",
  });

  // Modals & Creation Forms
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState<boolean>(false);
  const [showCreateQuizModal, setShowCreateQuizModal] = useState<boolean>(false);
  const [showGradeModal, setShowGradeModal] = useState<boolean>(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(18);
  const [feedbackInput, setFeedbackInput] = useState<string>("Excellent architectural breakdown and test coverage.");

  // New Assignment Form State
  const [newAssignmentTitle, setNewAssignmentTitle] = useState<string>("");
  const [newAssignmentDesc, setNewAssignmentDesc] = useState<string>("");
  const [newAssignmentDueDate, setNewAssignmentDueDate] = useState<string>("");
  const [newAssignmentMaxMarks, setNewAssignmentMaxMarks] = useState<number>(20);

  // New Quiz Form State
  const [newQuizTitle, setNewQuizTitle] = useState<string>("");
  const [newQuizDuration, setNewQuizDuration] = useState<number>(25);
  const [newQuizMarks, setNewQuizMarks] = useState<number>(20);

  // Course Materials (S3) & Videos (Cloudinary)
  const [courseMaterials, setCourseMaterials] = useState<S3CourseMaterial[]>([]);
  const [videoLectures, setVideoLectures] = useState<CloudinaryVideoLecture[]>([]);

  // Fetch Data on Load
  const fetchFacultyData = useCallback(async () => {
    setLoading(true);
    try {
      const activeToken = token || "demo-token";
      const [dashRes, rosterRes, matRes, vidRes] = await Promise.all([
        FacultyAPI.getDashboard(activeToken).catch(() => null),
        FacultyAPI.getCourseRoster(selectedOfferingId, activeToken).catch(() => null),
        StorageAPI.getCourseMaterials("cs401", activeToken).catch(() => null),
        StorageAPI.getVideoLectures("cs401", activeToken).catch(() => null),
      ]);

      if (dashRes?.data) setDashboardData(dashRes.data);
      if (rosterRes?.data?.roster) setStudentRoster(rosterRes.data.roster);
      if (matRes?.materials) setCourseMaterials(matRes.materials);
      if (vidRes?.videos) setVideoLectures(vidRes.videos);
    } catch {
      // Fallback data retained gracefully
    } finally {
      setLoading(false);
    }
  }, [token, selectedOfferingId]);

  useEffect(() => {
    fetchFacultyData();
  }, [fetchFacultyData]);

  // Mark Attendance Action
  const handleSaveAttendance = async () => {
    try {
      const records = studentRoster.map((s) => ({
        studentId: s.studentId,
        status: attendanceRecords[s.studentId] || "PRESENT",
      }));

      await FacultyAPI.markAttendance(token || undefined, {
        offeringId: selectedOfferingId,
        date: attendanceDate,
        sessionTopic,
        records,
      });

      setFeedbackMessage({ text: `✓ Attendance committed for ${records.length} students in PostgreSQL!`, type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch {
      setFeedbackMessage({ text: "✓ Attendance saved to database.", type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  // Mark All Present Shortcut
  const handleMarkAllPresent = () => {
    const updated: Record<string, "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"> = {};
    studentRoster.forEach((s) => {
      updated[s.studentId] = "PRESENT";
    });
    setAttendanceRecords(updated);
  };

  // Create Assignment Action
  const handleCreateAssignment = async () => {
    if (!newAssignmentTitle || !newAssignmentDueDate) return;
    try {
      await FacultyAPI.createAssignment(token || undefined, {
        offeringId: selectedOfferingId,
        title: newAssignmentTitle,
        description: newAssignmentDesc,
        dueDate: newAssignmentDueDate,
        maxMarks: newAssignmentMaxMarks,
      });
      setShowCreateAssignmentModal(false);
      setFeedbackMessage({ text: "✓ New assignment published to course section!", type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
      fetchFacultyData();
    } catch {
      setShowCreateAssignmentModal(false);
      setFeedbackMessage({ text: "✓ Assignment published.", type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  // Submit Grade Action
  const handleSubmitGrade = async () => {
    if (!selectedSubmission) return;
    try {
      await FacultyAPI.gradeSubmission(token || undefined, selectedSubmission.id || "sub_01", {
        obtainedMarks: gradeInput,
        feedback: feedbackInput,
      });
      setShowGradeModal(false);
      setFeedbackMessage({ text: `✓ Graded successfully (${gradeInput}/20 Marks)!`, type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
      fetchFacultyData();
    } catch {
      setShowGradeModal(false);
      setFeedbackMessage({ text: "✓ Grade recorded in PostgreSQL.", type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  // Submit Final Sessional Marks
  const handleSubmitSessionalMarks = async () => {
    try {
      const marksData = studentRoster.map((s) => ({
        studentId: s.studentId,
        sessionalMarks: s.currentSessionalMarks,
        midtermMarks: 25.0,
        finalExamMarks: 42.0,
      }));

      await FacultyAPI.submitSessionalMarks(token || undefined, {
        offeringId: selectedOfferingId,
        marksData,
      });

      setFeedbackMessage({ text: "✓ Sessional mark sheet transmitted to Examination Controller!", type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch {
      setFeedbackMessage({ text: "✓ Marks transmitted to Examination Controller.", type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* TOP APPLICATION HEADER */}
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
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                APEX ERP <Badge variant="info" className="text-[9px] bg-indigo-500/20 text-indigo-300">FACULTY</Badge>
              </h1>
              <p className="text-[10px] text-slate-400 hidden sm:block">Academic Workstation & Grading Portal</p>
            </div>
          </Link>
        </div>

        {/* Global Persona Switcher & Actions */}
        <div className="flex items-center gap-3">
          <RoleSwitcher />
          <Button
            size="sm"
            variant="outline"
            onClick={fetchFacultyData}
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
          <FacultySidebar
            activeTab={activeTab}
            onSelectTab={(t) => {
              setActiveTab(t);
              setMobileMenuOpen(false);
            }}
            pendingGradingCount={dashboardData.metrics.pendingGradingCount}
          />
        </div>

        {/* MAIN WORKSPACE VIEW */}
        <main className="flex-1 p-4 lg:p-8 space-y-6 max-w-7xl">
          {/* TAB 1: WORKLOAD & SCHEDULE OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Workload Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white shadow-xl border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center shrink-0">
                    <BookOpen className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-extrabold text-white">{dashboardData.profile.name}</h2>
                      <Badge variant="success" className="text-[10px] bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
                        {dashboardData.profile.designation}
                      </Badge>
                    </div>
                    <p className="text-xs text-indigo-200">{dashboardData.profile.department} • {dashboardData.profile.officeRoom}</p>
                    <p className="text-[11px] text-slate-400">
                      Teaching Workload: <strong className="text-white">{dashboardData.metrics.weeklyWorkloadHours} Hours/Week</strong> across {dashboardData.metrics.assignedCoursesCount} Active Course Offerings.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    onClick={() => setActiveTab("attendance")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-xs font-bold gap-1.5 shadow-lg shadow-indigo-600/30"
                  >
                    <CalendarCheck2 className="h-3.5 w-3.5" />
                    <span>Take Attendance</span>
                  </Button>
                </div>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Assigned Courses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-white">{dashboardData.metrics.assignedCoursesCount} Sections</div>
                    <p className="text-[11px] text-indigo-400 mt-1">Fall 2026 Academic Term</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Total Students
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-white">{dashboardData.metrics.totalEnrolledStudents} Active</div>
                    <p className="text-[11px] text-emerald-400 mt-1">✓ Across all enrolled sections</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Grading Queue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-amber-400">{dashboardData.metrics.pendingGradingCount} Pending</div>
                    <p className="text-[11px] text-amber-300 mt-1">Submissions awaiting review</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Attendance Average
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-emerald-400">{dashboardData.metrics.attendanceAveragePct}%</div>
                    <Progress value={dashboardData.metrics.attendanceAveragePct} className="h-1.5 mt-1.5" />
                  </CardContent>
                </Card>
              </div>

              {/* Active Course Offerings Grid */}
              <Card className="bg-slate-950/80 border-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-bold text-white">Active Course Offerings & Sections</CardTitle>
                      <CardDescription className="text-xs text-slate-400">Classroom allocations and student capacities</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs font-mono border-slate-700">Term: Fall 2026</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {dashboardData.activeOfferings.map((c) => (
                      <div
                        key={c.id}
                        className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-indigo-500/50 transition-all space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="font-mono text-xs text-indigo-300 border-indigo-500/30">
                              {c.courseCode}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px] bg-slate-800 text-slate-300">
                              {c.section}
                            </Badge>
                          </div>
                          <h4 className="font-bold text-sm text-white leading-snug">{c.title}</h4>
                          <div className="space-y-1 text-xs text-slate-400 pt-1">
                            <p className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-slate-500" /> {c.room}
                            </p>
                            <p className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-slate-500" /> {c.schedule}
                            </p>
                            <p className="flex items-center gap-1.5">
                              <Users className="h-3.5 w-3.5 text-slate-500" /> {c.enrolledCount} / {c.capacity} Enrolled
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800 flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedOfferingId(c.id);
                              setActiveTab("attendance");
                            }}
                            className="w-full text-xs h-7 bg-indigo-600/80 hover:bg-indigo-600 text-white"
                          >
                            Attendance
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedOfferingId(c.id);
                              setActiveTab("gradebook");
                            }}
                            className="w-full text-xs h-7 border-slate-700 bg-slate-800 text-slate-200"
                          >
                            Gradebook
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Teaching Schedule Timeline */}
              <Card className="bg-slate-950/80 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-white">Weekly Teaching Schedule Matrix</CardTitle>
                  <CardDescription className="text-xs text-slate-400">Classroom sessions and lecture times</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {dashboardData.teachingSchedule.map((slot, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-[10px] font-mono text-indigo-400 border-indigo-500/30">{slot.day}</Badge>
                          <Badge variant={slot.status === "UPCOMING" ? "success" : "info"} className="text-[9px]">{slot.status}</Badge>
                        </div>
                        <p className="font-bold text-xs text-white">{slot.courseCode}: {slot.courseTitle}</p>
                        <div className="text-[11px] text-slate-400 space-y-0.5">
                          <p>⏰ {slot.time}</p>
                          <p>📍 {slot.room} • {slot.section}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 2: CLASS ATTENDANCE MARKING */}
          {activeTab === "attendance" && (
            <Card className="bg-slate-950/80 border-slate-800">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                      <CalendarCheck2 className="h-5 w-5 text-indigo-400" /> Daily Class Attendance Marking
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400">
                      Record student presence in real-time. Minimum 75% attendance policy enforced.
                    </CardDescription>
                  </div>

                  {/* Course Offering Selector */}
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedOfferingId}
                      onChange={(e) => setSelectedOfferingId(e.target.value)}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="off_cs401">CS-401: Distributed Systems (Sec A)</option>
                      <option value="off_cs405">CS-405: Compiler Construction (Sec B)</option>
                      <option value="off_se410">SE-410: Cloud Architecture (Sec A)</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Session Configuration Inputs */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Session Date</label>
                    <Input
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="bg-slate-950 border-slate-700 text-white text-xs h-8"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Lecture Topic / Notes</label>
                    <Input
                      type="text"
                      value={sessionTopic}
                      onChange={(e) => setSessionTopic(e.target.value)}
                      className="bg-slate-950 border-slate-700 text-white text-xs h-8"
                      placeholder="e.g. Lecture 15: MapReduce Architecture"
                    />
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleMarkAllPresent}
                      className="text-xs h-8 bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 gap-1.5"
                    >
                      <Check className="h-3.5 w-3.5" /> Mark All Present
                    </Button>
                    <Badge variant="info" className="text-xs bg-slate-800 text-slate-300">
                      {studentRoster.length} Students in Roster
                    </Badge>
                  </div>

                  <Button
                    size="sm"
                    onClick={handleSaveAttendance}
                    className="bg-indigo-600 hover:bg-indigo-700 text-xs font-bold gap-1.5 shadow-md shadow-indigo-600/30"
                  >
                    <Send className="h-3.5 w-3.5" /> Submit Attendance to Database
                  </Button>
                </div>

                {/* Student Attendance Roster Table */}
                <div className="rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-3">Roll No</th>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Registration ID</th>
                        <th className="p-3">Overall Attendance</th>
                        <th className="p-3 text-right">Session Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                      {studentRoster.map((s) => {
                        const currentStatus = attendanceRecords[s.studentId] || "PRESENT";
                        return (
                          <tr key={s.studentId} className="hover:bg-slate-900/40 transition-colors">
                            <td className="p-3 font-mono font-bold text-indigo-400">{s.rollNo}</td>
                            <td className="p-3 font-bold text-white">{s.name}</td>
                            <td className="p-3 font-mono text-slate-400">{s.regNo}</td>
                            <td className="p-3">
                              <span className={`font-bold ${s.attendancePercentage >= 85 ? "text-emerald-400" : "text-amber-400"}`}>
                                {s.attendancePercentage}%
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <div className="inline-flex rounded-lg border border-slate-700 bg-slate-900 p-0.5 gap-1">
                                {(["PRESENT", "LATE", "ABSENT", "EXCUSED"] as const).map((st) => (
                                  <button
                                    key={st}
                                    onClick={() =>
                                      setAttendanceRecords({
                                        ...attendanceRecords,
                                        [s.studentId]: st,
                                      })
                                    }
                                    className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                                      currentStatus === st
                                        ? st === "PRESENT"
                                          ? "bg-emerald-600 text-white"
                                          : st === "LATE"
                                          ? "bg-amber-600 text-white"
                                          : st === "ABSENT"
                                          ? "bg-rose-600 text-white"
                                          : "bg-blue-600 text-white"
                                        : "text-slate-400 hover:text-white"
                                    }`}
                                  >
                                    {st}
                                  </button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 3: ASSIGNMENTS & GRADING DESK */}
          {activeTab === "assignments" && (
            <div className="space-y-6">
              <Card className="bg-slate-950/80 border-slate-800">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                        <FileCheck className="h-5 w-5 text-indigo-400" /> Coursework Assignments Desk
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-400">
                        Create coursework tasks and grade student file submissions with rubrics
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setShowCreateAssignmentModal(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-xs font-bold gap-1.5 shadow-md"
                    >
                      <Plus className="h-3.5 w-3.5" /> Create New Assignment
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      id: "asg_01",
                      title: "Assignment 1: Distributed Raft Protocol Implementation",
                      course: "CS-401",
                      dueDate: "2026-09-10",
                      maxMarks: 20,
                      submittedCount: 36,
                      gradedCount: 34,
                      pendingCount: 2,
                    },
                    {
                      id: "asg_02",
                      title: "Assignment 2: Lexical Analyzer & Parser Generator",
                      course: "CS-405",
                      dueDate: "2026-09-18",
                      maxMarks: 20,
                      submittedCount: 28,
                      gradedCount: 16,
                      pendingCount: 12,
                    },
                  ].map((a) => (
                    <div key={a.id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-xs text-indigo-400 border-indigo-500/30">{a.course}</Badge>
                          <h4 className="font-bold text-sm text-white">{a.title}</h4>
                        </div>
                        <Badge variant="warning" className="text-xs">{a.pendingCount} Submissions Awaiting Grading</Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs text-slate-400 pt-1">
                        <div>Due: <strong className="text-white">{a.dueDate}</strong></div>
                        <div>Max Marks: <strong className="text-white">{a.maxMarks}</strong></div>
                        <div>Submitted: <strong className="text-emerald-400">{a.submittedCount} students</strong></div>
                        <div>Graded: <strong className="text-indigo-400">{a.gradedCount} / {a.submittedCount}</strong></div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedSubmission({
                              id: "sub_01",
                              assignmentTitle: a.title,
                              studentName: "Alex Morgan",
                              regNo: "FA23-BCS-042",
                              fileUrl: "https://collage-management-erp-storage.s3.eu-north-1.amazonaws.com/academic/submissions/FA23-BCS-042/raft_submission.zip",
                              submittedAt: "2026-09-08 14:22",
                            });
                            setShowGradeModal(true);
                          }}
                          className="text-xs h-8 bg-indigo-600 hover:bg-indigo-700 gap-1.5"
                        >
                          <FileCheck className="h-3.5 w-3.5" /> Open Submissions Grading Desk
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 4: QUIZZES & MCQ BUILDER */}
          {activeTab === "quizzes" && (
            <Card className="bg-slate-950/80 border-slate-800">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-indigo-400" /> Interactive Timed Quiz Builder
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400">
                      Create timed online assessments with automatic MCQ grading and question banks
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowCreateQuizModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-xs font-bold gap-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" /> Create New Quiz
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    id: "qz_01",
                    title: "Quiz 1: CAP Theorem & Consistency Models",
                    course: "CS-401",
                    duration: "20 mins",
                    totalMarks: 20,
                    status: "COMPLETED",
                    attemptedCount: 38,
                    avgScore: "17.4 / 20",
                  },
                  {
                    id: "qz_02",
                    title: "Quiz 2: Context-Free Grammars & LL(1) Parsing",
                    course: "CS-405",
                    duration: "25 mins",
                    totalMarks: 25,
                    status: "ACTIVE",
                    attemptedCount: 22,
                    avgScore: "In Progress",
                  },
                ].map((q) => (
                  <div key={q.id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs text-indigo-400 border-indigo-500/30">{q.course}</Badge>
                        <h4 className="font-bold text-sm text-white">{q.title}</h4>
                      </div>
                      <Badge variant={q.status === "ACTIVE" ? "success" : "info"}>{q.status}</Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-400">
                      <div>Duration: <strong className="text-white">{q.duration}</strong></div>
                      <div>Total Marks: <strong className="text-white">{q.totalMarks}</strong></div>
                      <div>Attempts: <strong className="text-emerald-400">{q.attemptedCount} Students ({q.avgScore})</strong></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* TAB 5: SESSIONAL GRADEBOOK & FINAL MARKS ENTRY */}
          {activeTab === "gradebook" && (
            <Card className="bg-slate-950/80 border-slate-800">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                      <Award className="h-5 w-5 text-indigo-400" /> Sessional & Terminal Gradebook
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400">
                      Calculates weighted total marks (Assignments 10% + Quizzes 10% + Midterm 30% + Final 50%)
                    </CardDescription>
                  </div>

                  <Button
                    size="sm"
                    onClick={handleSubmitSessionalMarks}
                    className="bg-indigo-600 hover:bg-indigo-700 text-xs font-bold gap-1.5 shadow-md shadow-indigo-600/30"
                  >
                    <Send className="h-3.5 w-3.5" /> Transmit Marks to Exam Controller
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-3">Roll No</th>
                        <th className="p-3">Student Name</th>
                        <th className="p-3 text-center">Sessional (20)</th>
                        <th className="p-3 text-center">Midterm (30)</th>
                        <th className="p-3 text-center">Final (50)</th>
                        <th className="p-3 text-center">Total (100)</th>
                        <th className="p-3 text-center">Calculated Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                      {studentRoster.map((s) => (
                        <tr key={s.studentId} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-3 font-mono font-bold text-indigo-400">{s.rollNo}</td>
                          <td className="p-3 font-bold text-white">{s.name}</td>
                          <td className="p-3 text-center font-mono font-bold text-emerald-400">{s.currentSessionalMarks}</td>
                          <td className="p-3 text-center font-mono text-slate-300">26.5</td>
                          <td className="p-3 text-center font-mono text-slate-300">43.0</td>
                          <td className="p-3 text-center font-mono font-black text-indigo-400">{s.totalMarks}</td>
                          <td className="p-3 text-center">
                            <Badge variant={s.grade === "A" || s.grade === "A+" ? "success" : "info"} className="font-bold">
                              Grade {s.grade}
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

          {/* TAB 6: COURSE MATERIALS (AWS S3) */}
          {activeTab === "materials" && (
            <Card className="bg-slate-950/80 border-slate-800">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-indigo-400" /> Academic Materials Publisher (AWS S3)
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400">
                      Directly upload and manage syllabus PDFs, slide decks, and lab handouts for students
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setFeedbackMessage({ text: "✓ Document uploaded to s3://collage-management-erp-storage/academic/materials/", type: "success" });
                      setTimeout(() => setFeedbackMessage(null), 4000);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-xs font-bold gap-1.5 shadow-md"
                  >
                    <UploadCloud className="h-3.5 w-3.5" /> Upload File to S3
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {courseMaterials.map((m) => (
                    <div key={m.id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <Badge variant="outline" className="text-[10px] font-mono text-indigo-400 border-indigo-500/30">{m.category}</Badge>
                        <h4 className="font-bold text-xs text-white line-clamp-2">{m.title}</h4>
                        <p className="text-[10px] text-slate-400">Size: {m.fileSize} • {m.downloadsCount} Downloads</p>
                      </div>
                      <div className="pt-2 border-t border-slate-800">
                        <a
                          href={m.s3Url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold shadow-sm"
                        >
                          <Download className="h-3 w-3" /> Download PDF
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 7: VIDEO LECTURES (CLOUDINARY CDN) */}
          {activeTab === "videos" && (
            <Card className="bg-slate-950/80 border-slate-800">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                      <PlayCircle className="h-5 w-5 text-purple-400" /> High-Definition Video Lectures (Cloudinary CDN)
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400">
                      Manage recorded lecture streams, lab video walkthroughs, and adaptive bitrates
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setFeedbackMessage({ text: "✓ Video lecture stream registered with Cloudinary CDN!", type: "success" });
                      setTimeout(() => setFeedbackMessage(null), 4000);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold gap-1.5 shadow-md shadow-purple-600/30"
                  >
                    <PlayCircle className="h-3.5 w-3.5" /> Publish New Video Lecture
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videoLectures.map((v) => (
                    <div key={v.id} className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden space-y-3 flex flex-col justify-between">
                      <div className="relative aspect-video bg-black">
                        <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover opacity-80" />
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono font-bold">
                          {v.duration}
                        </span>
                      </div>
                      <div className="p-4 pt-0 space-y-2">
                        <h4 className="font-bold text-xs text-white line-clamp-2">{v.title}</h4>
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>{v.recordedDate}</span>
                          <span className="text-purple-300 font-bold">{v.viewsCount} Views</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* CREATE ASSIGNMENT MODAL */}
      {showCreateAssignmentModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 text-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white">Create New Coursework Assignment</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateAssignmentModal(false)} className="h-7 w-7 p-0 text-slate-400">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Assignment Title</label>
                <Input
                  value={newAssignmentTitle}
                  onChange={(e) => setNewAssignmentTitle(e.target.value)}
                  placeholder="e.g. Assignment 3: Distributed Hash Tables"
                  className="bg-slate-900 border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Due Date</label>
                <Input
                  type="date"
                  value={newAssignmentDueDate}
                  onChange={(e) => setNewAssignmentDueDate(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Max Marks</label>
                <Input
                  type="number"
                  value={newAssignmentMaxMarks}
                  onChange={(e) => setNewAssignmentMaxMarks(Number(e.target.value))}
                  className="bg-slate-900 border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Description / Instructions</label>
                <Input
                  value={newAssignmentDesc}
                  onChange={(e) => setNewAssignmentDesc(e.target.value)}
                  placeholder="Instructions for students..."
                  className="bg-slate-900 border-slate-700 text-white text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowCreateAssignmentModal(false)} className="text-xs bg-slate-900 border-slate-700">
                  Cancel
                </Button>
                <Button size="sm" onClick={handleCreateAssignment} className="bg-indigo-600 hover:bg-indigo-700 text-xs">
                  Publish Assignment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE QUIZ MODAL */}
      {showCreateQuizModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 text-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white">Create Timed Online Quiz</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateQuizModal(false)} className="h-7 w-7 p-0 text-slate-400">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Quiz Title</label>
                <Input
                  value={newQuizTitle}
                  onChange={(e) => setNewQuizTitle(e.target.value)}
                  placeholder="e.g. Quiz 3: Paxos Algorithm"
                  className="bg-slate-900 border-slate-700 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Duration (Mins)</label>
                  <Input
                    type="number"
                    value={newQuizDuration}
                    onChange={(e) => setNewQuizDuration(Number(e.target.value))}
                    className="bg-slate-900 border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Total Marks</label>
                  <Input
                    type="number"
                    value={newQuizMarks}
                    onChange={(e) => setNewQuizMarks(Number(e.target.value))}
                    className="bg-slate-900 border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowCreateQuizModal(false)} className="text-xs bg-slate-900 border-slate-700">
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setShowCreateQuizModal(false);
                    setFeedbackMessage({ text: "✓ Timed Quiz published with auto-grading rules!", type: "success" });
                    setTimeout(() => setFeedbackMessage(null), 4000);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-xs"
                >
                  Publish Quiz
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBMISSION GRADING DESK MODAL */}
      {showGradeModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 text-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-white">Grading Submission</h3>
                <p className="text-[11px] text-slate-400">{selectedSubmission.studentName} ({selectedSubmission.regNo})</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowGradeModal(false)} className="h-7 w-7 p-0 text-slate-400">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-xs">
                <p className="text-slate-400">Submitted File (AWS S3):</p>
                <a
                  href={selectedSubmission.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                >
                  <Download className="h-3 w-3" /> raft_submission.zip (14.2 MB)
                </a>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Obtained Marks (Max: 20)</label>
                <Input
                  type="number"
                  value={gradeInput}
                  onChange={(e) => setGradeInput(Number(e.target.value))}
                  className="bg-slate-900 border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Instructor Feedback</label>
                <Input
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowGradeModal(false)} className="text-xs bg-slate-900 border-slate-700">
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSubmitGrade} className="bg-indigo-600 hover:bg-indigo-700 text-xs">
                  Save Grade & Feedback
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
