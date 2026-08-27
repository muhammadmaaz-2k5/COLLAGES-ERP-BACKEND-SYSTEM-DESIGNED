"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/use-auth-store";
import { RoleSwitcher } from "@/components/rbac/RoleSwitcher";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  GraduationCap,
  BookOpen,
  CreditCard,
  Award,
  Clock,
  Sparkles,
  ArrowUpRight,
  UserCheck,
  ChevronLeft,
  CheckCircle2,
  QrCode,
  Download,
  UploadCloud,
  X,
  Printer,
  ShieldCheck,
  MapPin,
  PlayCircle,
  Trash2,
  PlusCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Mock historical CGPA progression
const cgpaHistoryData = [
  { semester: "Sem 1", gpa: 3.65, cgpa: 3.65 },
  { semester: "Sem 2", gpa: 3.8, cgpa: 3.73 },
  { semester: "Sem 3", gpa: 3.9, cgpa: 3.79 },
  { semester: "Sem 4", gpa: 3.85, cgpa: 3.81 },
  { semester: "Sem 5", gpa: 3.95, cgpa: 3.84 },
  { semester: "Sem 6", gpa: 4.0, cgpa: 3.87 },
];

const attendanceSummaryData = [
  { subject: "CS-401 (Dist. Systems)", attendance: 94 },
  { subject: "CS-405 (Compilers)", attendance: 88 },
  { subject: "SE-410 (Cloud Arch)", attendance: 92 },
  { subject: "MT-302 (Stochastics)", attendance: 82 },
];

interface CourseRegistrationItem {
  id: string;
  code: string;
  title: string;
  credits: number;
  instructor: string;
  schedule: string;
  room: string;
  capacity: number;
  enrolled: number;
  prerequisites: string[];
  prereqSatisfied: boolean;
  isEnrolled: boolean;
}

const INITIAL_OFFERINGS: CourseRegistrationItem[] = [
  {
    id: "off_01",
    code: "CS-401",
    title: "Distributed Computing Systems",
    credits: 4,
    instructor: "Dr. Sarah Jenkins",
    schedule: "Mon/Wed 09:00 - 10:30",
    room: "Lab 304",
    capacity: 45,
    enrolled: 38,
    prerequisites: ["CS-201 (Data Structures)"],
    prereqSatisfied: true,
    isEnrolled: true,
  },
  {
    id: "off_02",
    code: "CS-405",
    title: "Compiler Construction & Design",
    credits: 3,
    instructor: "Prof. Alan Vance",
    schedule: "Tue/Thu 11:00 - 12:30",
    room: "Hall B",
    capacity: 40,
    enrolled: 32,
    prerequisites: ["CS-301 (Theory of Automata)"],
    prereqSatisfied: true,
    isEnrolled: true,
  },
  {
    id: "off_03",
    code: "SE-410",
    title: "Cloud Architecture & Microservices",
    credits: 3,
    instructor: "Dr. Michael Chen",
    schedule: "Mon/Wed 14:00 - 15:30",
    room: "Smart Room 102",
    capacity: 45,
    enrolled: 41,
    prerequisites: ["CS-230 (Operating Systems)"],
    prereqSatisfied: true,
    isEnrolled: true,
  },
  {
    id: "off_04",
    code: "MT-302",
    title: "Stochastic Processes & Analytics",
    credits: 3,
    instructor: "Dr. Emily Taylor",
    schedule: "Fri 09:00 - 12:00",
    room: "Room 205",
    capacity: 35,
    enrolled: 29,
    prerequisites: ["MT-210 (Probability & Stats)"],
    prereqSatisfied: true,
    isEnrolled: true,
  },
  {
    id: "off_05",
    code: "AI-401",
    title: "Deep Learning & Neural Architectures",
    credits: 3,
    instructor: "Dr. Hassan Tariq",
    schedule: "Tue/Thu 14:00 - 15:30",
    room: "AI Lab 1",
    capacity: 30,
    enrolled: 24,
    prerequisites: ["CS-320 (Artificial Intelligence)"],
    prereqSatisfied: true,
    isEnrolled: false,
  },
  {
    id: "off_06",
    code: "CS-499",
    title: "Senior Capstone Project",
    credits: 6,
    instructor: "Department Faculty Board",
    schedule: "Arranged with Advisor",
    room: "Project Lab",
    capacity: 50,
    enrolled: 15,
    prerequisites: ["SE-301 (Software Engineering)", "Earned Credits >= 90"],
    prereqSatisfied: false,
    isEnrolled: false,
  },
];

export default function CompleteStudentPortalPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");

  // Registration State
  const [offerings, setOfferings] = useState<CourseRegistrationItem[]>(INITIAL_OFFERINGS);
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);

  // Assignment Dropzone Modal State
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  // Quiz Modal State
  const [activeQuizModal, setActiveQuizModal] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

  // Fee Payment Simulator State
  const [feeStatus, setFeeStatus] = useState<"PAID" | "UNPAID">("PAID");
  const [isPayingFee, setIsPayingFee] = useState<boolean>(false);

  // Hall Ticket Modal State
  const [showHallTicket, setShowHallTicket] = useState<boolean>(false);

  // Handlers
  const handleRegisterCourse = (courseId: string) => {
    setOfferings((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          if (!c.prereqSatisfied) {
            setRegistrationMessage(`❌ Cannot register for ${c.code}: Hard prerequisite unsatisfied.`);
            return c;
          }
          setRegistrationMessage(`✓ Successfully registered for ${c.code}: ${c.title}`);
          return { ...c, isEnrolled: true, enrolled: c.enrolled + 1 };
        }
        return c;
      })
    );
  };

  const handleDropCourse = (courseId: string) => {
    setOfferings((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          setRegistrationMessage(`✓ Successfully dropped ${c.code}`);
          return { ...c, isEnrolled: false, enrolled: Math.max(0, c.enrolled - 1) };
        }
        return c;
      })
    );
  };

  const handleQuizSubmit = () => {
    setQuizScore(23); // Auto-graded 23 / 25
  };

  const handlePayChallan = () => {
    setIsPayingFee(true);
    setTimeout(() => {
      setIsPayingFee(false);
      setFeeStatus("PAID");
    }, 1000);
  };

  const enrolledCount = offerings.filter((c) => c.isEnrolled).length;
  const registeredCredits = offerings.filter((c) => c.isEnrolled).reduce((acc, curr) => acc + curr.credits, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Sticky App Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-600">
                <ChevronLeft className="h-4 w-4" /> Home
              </Button>
            </Link>
            <div className="h-5 w-px bg-slate-200" />
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 tracking-tight text-sm sm:text-base">
                  Apex Student Portal
                </span>
                <p className="text-[11px] text-slate-500">Module 1 • Fully Functional System</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RoleSwitcher />
            <div className="hidden md:flex items-center gap-3 pl-2 border-l border-slate-200">
              <Avatar className="h-9 w-9 border border-indigo-100">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 leading-none">{user?.name || "Alex Morgan"}</p>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">{user?.studentId || "STD-2026-042"}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto px-4 sm:px-8 pt-6 space-y-6 max-w-7xl">
        {/* Student Profile & Quick Overview Header */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-200 border border-indigo-500/30 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Single Source of Academic Truth Active</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Welcome, {user?.name || "Alex Morgan"}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                BS Computer Science • Semester 6 • Roll No: <span className="font-mono text-indigo-200">FA23-BCS-042</span> • Status:{" "}
                <span className="text-emerald-400 font-bold">Good Standing</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15 text-center min-w-[110px]">
                <p className="text-[11px] text-slate-300 font-medium">Cumulative GPA</p>
                <p className="text-2xl font-black text-white tracking-tight mt-0.5">3.87</p>
                <span className="text-[10px] text-emerald-400 font-semibold">Top 3% Class</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15 text-center min-w-[110px]">
                <p className="text-[11px] text-slate-300 font-medium">Earned Credits</p>
                <p className="text-2xl font-black text-white tracking-tight mt-0.5">96 / 134</p>
                <span className="text-[10px] text-indigo-200 font-semibold">71.6% Complete</span>
              </div>
            </div>
          </div>
        </section>

        {/* Global Notifications Banner if any */}
        {registrationMessage && (
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3.5 flex items-center justify-between text-xs font-semibold text-indigo-900 shadow-sm animate-in fade-in">
            <span>{registrationMessage}</span>
            <Button variant="ghost" size="sm" onClick={() => setRegistrationMessage(null)} className="h-6 w-6 p-0 text-slate-400 hover:text-slate-700">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* 10-Area Student Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-100 p-1 border border-slate-200/80 rounded-xl flex flex-wrap h-auto gap-1">
            <TabsTrigger value="overview" className="text-xs font-bold py-2 px-3">
              🏠 Dashboard
            </TabsTrigger>
            <TabsTrigger value="registration" className="text-xs font-bold py-2 px-3">
              📚 Course Registration ({enrolledCount})
            </TabsTrigger>
            <TabsTrigger value="transcript" className="text-xs font-bold py-2 px-3">
              📊 Transcript & CGPA
            </TabsTrigger>
            <TabsTrigger value="attendance" className="text-xs font-bold py-2 px-3">
              🕐 Attendance (89.2%)
            </TabsTrigger>
            <TabsTrigger value="lms" className="text-xs font-bold py-2 px-3">
              📝 LMS & Quizzes
            </TabsTrigger>
            <TabsTrigger value="exams" className="text-xs font-bold py-2 px-3">
              🎓 Exams & Hall Ticket
            </TabsTrigger>
            <TabsTrigger value="finance" className="text-xs font-bold py-2 px-3">
              💳 Fees & Challans
            </TabsTrigger>
            <TabsTrigger value="timetable" className="text-xs font-bold py-2 px-3">
              📅 Timetable
            </TabsTrigger>
            <TabsTrigger value="idcard" className="text-xs font-bold py-2 px-3">
              📄 Digital Student ID
            </TabsTrigger>
          </TabsList>

          {/* ========================================================================= */}
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {/* ========================================================================= */}
          <TabsContent value="overview" className="space-y-6">
            {/* Top KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Current Term SGPA
                  </CardTitle>
                  <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                    <Award className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black text-slate-900">4.00</div>
                  <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-semibold">
                    <ArrowUpRight className="h-3.5 w-3.5" /> +0.05 from Semester 5
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Overall Attendance
                  </CardTitle>
                  <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                    <UserCheck className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black text-slate-900">89.2%</div>
                  <div className="mt-2 space-y-1">
                    <Progress value={89.2} className="h-1.5" />
                    <p className="text-[11px] text-slate-500 font-medium">Safe (&gt; 75% minimum threshold)</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Fee Status (Fall 2026)
                  </CardTitle>
                  <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                    <CreditCard className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-slate-900">$2,950.00</span>
                    <Badge variant={feeStatus === "PAID" ? "success" : "destructive"}>{feeStatus}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Challan: CHL-2026-88192</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Registered Courses
                  </CardTitle>
                  <div className="rounded-lg bg-sky-50 p-2 text-sky-600">
                    <BookOpen className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black text-slate-900">{enrolledCount} Courses</div>
                  <p className="text-xs text-slate-500 mt-1">{registeredCredits} Credit Hours</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts & Graphs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900">
                        CGPA & SGPA Progression History
                      </CardTitle>
                      <CardDescription className="text-xs">Continuous progression across 6 completed semesters</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs font-mono">Max Scale: 4.00</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[260px] w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={cgpaHistoryData}>
                        <defs>
                          <linearGradient id="dashCgpaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="semester" stroke="#94a3b8" fontSize={11} />
                        <YAxis domain={[3.0, 4.0]} stroke="#94a3b8" fontSize={11} />
                        <RechartsTooltip />
                        <Area type="monotone" dataKey="cgpa" name="CGPA" stroke="#4f46e5" strokeWidth={2.5} fill="url(#dashCgpaGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Subject Attendance Gauge */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-bold text-slate-900">
                    Subject Attendance
                  </CardTitle>
                  <CardDescription className="text-xs">Current term attendance breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={attendanceSummaryData} layout="vertical" margin={{ left: 10, right: 10 }}>
                        <XAxis type="number" domain={[0, 100]} fontSize={10} stroke="#94a3b8" />
                        <YAxis type="category" dataKey="subject" width={110} fontSize={10} stroke="#64748b" />
                        <RechartsTooltip />
                        <Bar dataKey="attendance" fill="#10b981" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ========================================================================= */}
          {/* TAB 2: COURSE REGISTRATION & PREREQUISITE DAG */}
          {/* ========================================================================= */}
          <TabsContent value="registration" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900">
                      Fall 2026 Course Offerings & Prerequisite DAG Checker
                    </CardTitle>
                    <CardDescription className="text-xs">
                      The automated prerequisite DAG engine enforces academic roadmap validation prior to registration.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="info">Enrolled: {enrolledCount} Courses ({registeredCredits} Cr)</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {offerings.map((c) => (
                    <div
                      key={c.id}
                      className={`p-4 rounded-xl border transition-all ${
                        c.isEnrolled
                          ? "border-emerald-200 bg-emerald-50/40"
                          : "border-slate-200/80 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                              {c.code}
                            </span>
                            <Badge variant={c.isEnrolled ? "success" : "secondary"}>
                              {c.isEnrolled ? "Registered" : "Available"}
                            </Badge>
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 mt-1">{c.title}</h4>
                        </div>
                        <Badge variant="outline">{c.credits} Credits</Badge>
                      </div>

                      <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                        <p>👨‍🏫 Instructor: <span className="font-semibold text-slate-800">{c.instructor}</span></p>
                        <p>🕒 Schedule: {c.schedule} • {c.room}</p>
                        <p>👥 Capacity: {c.enrolled} / {c.capacity} seats filled</p>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-semibold text-slate-500">Prereq:</span>
                            {c.prerequisites.length > 0 ? (
                              <span className={`text-[11px] font-semibold ${c.prereqSatisfied ? "text-emerald-600" : "text-rose-600 flex items-center gap-1"}`}>
                                {c.prereqSatisfied ? "✓ Satisfied" : "❌ Unsatisfied"} ({c.prerequisites[0]})
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400">None (Open)</span>
                            )}
                          </div>

                          {c.isEnrolled ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDropCourse(c.id)}
                              className="text-xs h-7 gap-1"
                            >
                              <Trash2 className="h-3 w-3" /> Drop Course
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleRegisterCourse(c.id)}
                              disabled={!c.prereqSatisfied || c.enrolled >= c.capacity}
                              className="text-xs h-7 gap-1 bg-indigo-600 hover:bg-indigo-700"
                            >
                              <PlusCircle className="h-3 w-3" /> Register
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ========================================================================= */}
          {/* TAB 3: TRANSCRIPT & CGPA ENGINE */}
          {/* ========================================================================= */}
          <TabsContent value="transcript" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900">
                      Official Academic Transcript (Single Source of Truth)
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Verified grade quality points mathematically computed per institutional policy.
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <Printer className="h-4 w-4" /> Print Verified Transcript
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    term: "Semester 1 (Fall 2023)",
                    sgpa: 3.82,
                    credits: 15,
                    courses: [
                      { code: "CS-101", title: "Intro to Computing & Programming", cr: 4, grade: "A", gp: 4.0 },
                      { code: "MT-101", title: "Calculus & Analytical Geometry", cr: 3, grade: "A-", gp: 3.67 },
                      { code: "PH-101", title: "Applied Physics & Circuits", cr: 3, grade: "B+", gp: 3.33 },
                      { code: "HU-101", title: "English Composition", cr: 3, grade: "A", gp: 4.0 },
                      { code: "PK-101", title: "Pakistan Studies", cr: 2, grade: "A", gp: 4.0 },
                    ],
                  },
                  {
                    term: "Semester 2 (Spring 2024)",
                    sgpa: 3.93,
                    credits: 15,
                    courses: [
                      { code: "CS-102", title: "Object Oriented Programming", cr: 4, grade: "A", gp: 4.0 },
                      { code: "CS-105", title: "Discrete Structures & Logic", cr: 3, grade: "A", gp: 4.0 },
                      { code: "MT-102", title: "Linear Algebra & Matrices", cr: 3, grade: "A-", gp: 3.67 },
                      { code: "HU-102", title: "Communication Skills", cr: 3, grade: "A", gp: 4.0 },
                      { code: "IS-101", title: "Islamic Studies & Ethics", cr: 2, grade: "A", gp: 4.0 },
                    ],
                  },
                  {
                    term: "Semester 3 (Fall 2024)",
                    sgpa: 3.77,
                    credits: 15,
                    courses: [
                      { code: "CS-201", title: "Data Structures & Algorithms", cr: 4, grade: "A", gp: 4.0 },
                      { code: "CS-203", title: "Digital Logic Design", cr: 4, grade: "B+", gp: 3.33 },
                      { code: "MT-201", title: "Multivariable Calculus", cr: 3, grade: "A-", gp: 3.67 },
                      { code: "CS-205", title: "Computer Organization & Assembly", cr: 4, grade: "A", gp: 4.0 },
                    ],
                  },
                ].map((sem) => (
                  <div key={sem.term} className="rounded-xl border border-slate-200 overflow-hidden">
                    <div className="bg-slate-100/90 px-4 py-2.5 flex items-center justify-between border-b border-slate-200">
                      <span className="font-bold text-xs text-slate-900">{sem.term}</span>
                      <div className="flex items-center gap-3 text-xs">
                        <span>Credits: <strong className="font-mono">{sem.credits}</strong></span>
                        <Badge variant="success">SGPA: {sem.sgpa.toFixed(2)}</Badge>
                      </div>
                    </div>
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">Course Code</th>
                          <th className="p-2.5">Course Title</th>
                          <th className="p-2.5 text-center">Credit Hours</th>
                          <th className="p-2.5 text-center">Grade</th>
                          <th className="p-2.5 text-center">Grade Point</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {sem.courses.map((c) => (
                          <tr key={c.code} className="hover:bg-slate-50/50">
                            <td className="p-2.5 font-mono font-bold text-indigo-600">{c.code}</td>
                            <td className="p-2.5 text-slate-800">{c.title}</td>
                            <td className="p-2.5 text-center font-mono">{c.cr}</td>
                            <td className="p-2.5 text-center font-bold text-slate-900">{c.grade}</td>
                            <td className="p-2.5 text-center font-mono">{c.gp.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ========================================================================= */}
          {/* TAB 4: ATTENDANCE TRACKER */}
          {/* ========================================================================= */}
          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-900">
                  Subject-Wise Attendance Breakdown & Absence Log
                </CardTitle>
                <CardDescription className="text-xs">
                  Academic policy mandates minimum 75% attendance to qualify for terminal examinations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { code: "CS-401", title: "Distributed Systems", lectures: 28, attended: 26, pct: 92.8, status: "GOOD" },
                    { code: "CS-405", title: "Compiler Construction", lectures: 24, attended: 21, pct: 87.5, status: "GOOD" },
                    { code: "SE-410", title: "Cloud Architecture", lectures: 24, attended: 23, pct: 95.8, status: "GOOD" },
                    { code: "MT-302", title: "Stochastic Processes", lectures: 20, attended: 16, pct: 80.0, status: "WARNING" },
                  ].map((item) => (
                    <div key={item.code} className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="font-mono text-xs">{item.code}</Badge>
                        <Badge variant={item.pct >= 85 ? "success" : "warning"}>{item.pct}%</Badge>
                      </div>
                      <p className="font-bold text-sm text-slate-900">{item.title}</p>
                      <Progress value={item.pct} className="h-2" />
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Attended: {item.attended} / {item.lectures} lectures</span>
                        <span className={item.pct >= 75 ? "text-emerald-600 font-semibold" : "text-rose-600 font-semibold"}>
                          {item.pct >= 75 ? "Exam Eligible" : "Attendance Shortage"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ========================================================================= */}
          {/* TAB 5: LMS ASSIGNMENTS & QUIZZES */}
          {/* ========================================================================= */}
          <TabsContent value="lms" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Assignments Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-bold text-slate-900">
                    Coursework Assignments & Dropzone
                  </CardTitle>
                  <CardDescription className="text-xs">Submit homework projects and review instructor feedback</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { id: "asg_1", code: "CS-401", title: "Assignment 1: Raft Consensus Engine", due: "Sep 05, 2026", status: "GRADED", marks: "94 / 100" },
                    { id: "asg_2", code: "CS-405", title: "Assignment 2: Lexer & Parser Generator", due: "Sep 12, 2026", status: "SUBMITTED", marks: "Pending" },
                    { id: "asg_3", code: "SE-410", title: "Assignment 3: Kubernetes Deployment", due: "Sep 20, 2026", status: "PENDING", marks: "Pending" },
                  ].map((a) => (
                    <div key={a.id} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="font-mono text-[10px]">{a.code}</Badge>
                        <Badge variant={a.status === "GRADED" ? "success" : a.status === "SUBMITTED" ? "info" : "warning"}>
                          {a.status}
                        </Badge>
                      </div>
                      <p className="text-xs font-bold text-slate-900">{a.title}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Due: {a.due}</span>
                        <span>Score: <strong className="text-slate-900">{a.marks}</strong></span>
                      </div>
                      {a.status === "PENDING" && (
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                          <Button size="sm" onClick={() => { setSelectedAssignment(a.title); setSubmissionSuccess(false); }} className="text-xs h-7 gap-1 bg-indigo-600 hover:bg-indigo-700">
                            <UploadCloud className="h-3.5 w-3.5" /> Submit File
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quizzes Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-bold text-slate-900">
                    Online Timed Quizzes
                  </CardTitle>
                  <CardDescription className="text-xs">Attempt published online quizzes with automatic grading</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="font-mono text-xs">CS-401</Badge>
                      <Badge variant="success">Completed</Badge>
                    </div>
                    <p className="text-sm font-bold text-slate-900">Quiz 1: CAP Theorem & Vector Clocks</p>
                    <p className="text-xs text-slate-500">Duration: 20 mins • Score: <strong className="text-emerald-600">19 / 20 (95%)</strong></p>
                  </div>

                  <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="font-mono text-xs bg-white">CS-405</Badge>
                      <Badge variant="info">Available Now</Badge>
                    </div>
                    <p className="text-sm font-bold text-slate-900">Quiz 2: Context-Free Grammars & LL(1) Tables</p>
                    <p className="text-xs text-slate-600">Duration: 25 mins • Total Marks: 25</p>
                    <div className="pt-2">
                      <Button size="sm" onClick={() => { setActiveQuizModal(true); setQuizScore(null); }} className="text-xs gap-1.5 bg-indigo-600 hover:bg-indigo-700 w-full">
                        <PlayCircle className="h-4 w-4" /> Start Timed Quiz Attempt →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ========================================================================= */}
          {/* TAB 6: EXAMINATIONS & HALL TICKET */}
          {/* ========================================================================= */}
          <TabsContent value="exams" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900">
                      Fall 2026 Midterm Examination Datesheet & Hall Ticket
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Official terminal schedule published by the Examination Controller Office.
                    </CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setShowHallTicket(true)} className="gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700">
                    <QrCode className="h-4 w-4" /> Generate Digital Hall Ticket
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Course Code</th>
                        <th className="p-3">Course Name</th>
                        <th className="p-3">Exam Date</th>
                        <th className="p-3">Timing</th>
                        <th className="p-3">Venue</th>
                        <th className="p-3">Seat No.</th>
                        <th className="p-3">Invigilator</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {[
                        { code: "CS-401", title: "Distributed Computing Systems", date: "Oct 12, 2026", time: "09:00 - 12:00 PM", room: "Hall A", seat: "HA-042", inv: "Prof. Arthur Pendleton" },
                        { code: "CS-405", title: "Compiler Construction", date: "Oct 15, 2026", time: "09:00 - 12:00 PM", room: "Hall B", seat: "HB-018", inv: "Dr. Emily Blunt" },
                        { code: "SE-410", title: "Cloud Architecture", date: "Oct 18, 2026", time: "02:00 - 05:00 PM", room: "Hall A", seat: "HA-042", inv: "Dr. Sarah Jenkins" },
                        { code: "MT-302", title: "Stochastic Processes", date: "Oct 21, 2026", time: "09:00 - 12:00 PM", room: "Room 205", seat: "R2-009", inv: "Prof. Marcus Vance" },
                      ].map((item) => (
                        <tr key={item.code} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono font-bold text-indigo-600">{item.code}</td>
                          <td className="p-3 font-medium text-slate-900">{item.title}</td>
                          <td className="p-3 font-medium text-slate-700">{item.date}</td>
                          <td className="p-3 text-slate-600">{item.time}</td>
                          <td className="p-3 text-slate-600">{item.room}</td>
                          <td className="p-3 font-mono font-bold text-slate-900">{item.seat}</td>
                          <td className="p-3 text-slate-500">{item.inv}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ========================================================================= */}
          {/* TAB 7: FEES & CHALLANS */}
          {/* ========================================================================= */}
          <TabsContent value="finance" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900">
                      Semester Fee Billing & Printable Challan Voucher
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Itemized tuition, laboratory, and library fees with double-entry ledger reconciliation.
                    </CardDescription>
                  </div>
                  <Badge variant={feeStatus === "PAID" ? "success" : "destructive"}>
                    Fall 2026 Status: {feeStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-900">Voucher Number: </span>
                      <span className="font-mono text-xs font-bold text-indigo-600">CHL-2026-88192</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Due Date: <strong className="text-slate-800">September 15, 2026</strong>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Tuition Fee (13 Credit Hours)</span>
                      <span className="font-mono font-semibold">$2,500.00</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Laboratory & Computing Charges</span>
                      <span className="font-mono font-semibold">$300.00</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Library & Digital Journal Subscription</span>
                      <span className="font-mono font-semibold">$150.00</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                      <span>Total Payable Amount</span>
                      <span className="font-mono text-indigo-600">$2,950.00</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                      <Download className="h-3.5 w-3.5" /> Download PDF Challan Voucher
                    </Button>

                    {feeStatus === "UNPAID" ? (
                      <Button size="sm" onClick={handlePayChallan} disabled={isPayingFee} className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700">
                        <CreditCard className="h-3.5 w-3.5" /> {isPayingFee ? "Processing Gateway..." : "Pay Online via Card / Gateway"}
                      </Button>
                    ) : (
                      <Badge variant="success" className="text-xs py-1 px-3">
                        ✓ Payment Settled via Online Gateway (Txn #99812-VISA)
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ========================================================================= */}
          {/* TAB 8: WEEKLY TIMETABLE MATRIX */}
          {/* ========================================================================= */}
          <TabsContent value="timetable" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-900">
                  Weekly Class Timetable Matrix
                </CardTitle>
                <CardDescription className="text-xs">
                  Classroom assignments and lecture schedule for Fall 2026
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {[
                    { day: "Monday", slots: [{ course: "CS-401 Dist. Systems", time: "09:00 - 10:30 AM", room: "Lab 304" }, { course: "SE-410 Cloud Arch", time: "02:00 - 03:30 PM", room: "Room 102" }] },
                    { day: "Tuesday", slots: [{ course: "CS-405 Compilers", time: "11:00 - 12:30 PM", room: "Hall B" }, { course: "CS-405 Lab", time: "02:00 - 04:00 PM", room: "Software Lab 2" }] },
                    { day: "Wednesday", slots: [{ course: "CS-401 Dist. Systems", time: "09:00 - 10:30 AM", room: "Lab 304" }, { course: "SE-410 Cloud Arch", time: "02:00 - 03:30 PM", room: "Room 102" }] },
                    { day: "Thursday", slots: [{ course: "CS-405 Compilers", time: "11:00 - 12:30 PM", room: "Hall B" }] },
                    { day: "Friday", slots: [{ course: "MT-302 Stochastic", time: "09:00 - 12:00 PM", room: "Room 205" }] },
                  ].map((d) => (
                    <div key={d.day} className="rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col">
                      <div className="bg-slate-100 px-3 py-2 text-center font-bold text-xs text-slate-900 border-b border-slate-200">
                        {d.day}
                      </div>
                      <div className="p-2 space-y-2 flex-1">
                        {d.slots.map((s, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100 text-left space-y-1">
                            <p className="font-bold text-[11px] text-indigo-950 leading-tight">{s.course}</p>
                            <p className="text-[10px] text-slate-600 flex items-center gap-1">
                              <Clock className="h-3 w-3 text-indigo-600" /> {s.time}
                            </p>
                            <p className="text-[10px] text-slate-500 flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-slate-400" /> {s.room}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ========================================================================= */}
          {/* TAB 9: DIGITAL STUDENT ID */}
          {/* ========================================================================= */}
          <TabsContent value="idcard" className="space-y-4">
            <div className="flex justify-center">
              <div className="w-full max-w-md rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 p-6 text-white shadow-2xl border border-indigo-500/30 space-y-5 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center font-black">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm tracking-tight text-white">APEX UNIVERSITY</h4>
                      <p className="text-[10px] text-indigo-200 uppercase tracking-widest">Digital Student Credential</p>
                    </div>
                  </div>
                  <Badge variant="info" className="text-[9px]">VALID 2023 - 2027</Badge>
                </div>

                <div className="flex gap-4 items-center">
                  <Avatar className="h-20 w-20 rounded-xl ring-2 ring-indigo-500/50">
                    <AvatarImage src={user?.avatarUrl} alt="Alex Morgan" />
                    <AvatarFallback>AM</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-black text-lg text-white">{user?.name || "Alex Morgan"}</h3>
                    <p className="text-xs text-indigo-200">BS Computer Science</p>
                    <p className="text-xs font-mono text-slate-400">Roll: FA23-BCS-042</p>
                    <p className="text-[11px] text-emerald-400 font-semibold">Active Enrollment</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="space-y-0.5 text-[10px] text-slate-400">
                    <p>Security Hash: 0x88f1a92e</p>
                    <p>Issuing Registrar: Academic Council</p>
                  </div>
                  <div className="h-14 w-14 bg-white p-1 rounded-lg flex items-center justify-center">
                    <QrCode className="h-12 w-12 text-slate-900" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* ========================================================================= */}
      {/* INTERACTIVE MODAL: TIMED QUIZ ATTEMPT */}
      {/* ========================================================================= */}
      {activeQuizModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Quiz 2: Context-Free Grammars</h3>
                <p className="text-xs text-slate-500">Course: CS-405 • Time Remaining: 24:12 mins</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setActiveQuizModal(false)} className="h-7 w-7 p-0 text-slate-400">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {quizScore === null ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-900">
                    Question 1: Which parsing method constructs the parse tree from root to leaves?
                  </p>
                  <div className="space-y-1.5 text-xs">
                    {[
                      "A) Top-down Parsing",
                      "B) Bottom-up (Shift-Reduce) Parsing",
                      "C) LR(1) Parsing",
                      "D) Operator Precedence",
                    ].map((opt, idx) => (
                      <label key={idx} className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                        <input
                          type="radio"
                          name="q1"
                          checked={selectedAnswers[1] === opt}
                          onChange={() => setSelectedAnswers({ ...selectedAnswers, 1: opt })}
                          className="text-indigo-600"
                        />
                        <span className="text-slate-800">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setActiveQuizModal(false)}>Cancel</Button>
                  <Button size="sm" onClick={handleQuizSubmit} className="bg-indigo-600 hover:bg-indigo-700">Submit Quiz Attempt</Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="font-extrabold text-lg text-slate-900">Attempt Evaluated Successfully!</h4>
                <p className="text-xs text-slate-600">Your score has been recorded into the LMS gradebook.</p>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 font-bold text-emerald-800 text-sm">
                  Score: 23 / 25 Marks (92.0% - Grade A)
                </div>
                <Button size="sm" onClick={() => setActiveQuizModal(false)} className="w-full bg-indigo-600 hover:bg-indigo-700">Done</Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INTERACTIVE MODAL: DIGITAL HALL TICKET */}
      {/* ========================================================================= */}
      {showHallTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900">Digital Examination Hall Ticket</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowHallTicket(false)} className="h-7 w-7 p-0 text-slate-400">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Student Name:</span><span className="font-bold text-slate-900">Alex Morgan</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Roll Number:</span><span className="font-mono font-bold text-indigo-600">FA23-BCS-042</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Term:</span><span className="font-bold text-slate-900">Fall 2026 Midterm Examination</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Authorization Code:</span><span className="font-mono text-slate-700">HT-FA26-042-CS-AUTH</span></div>
            </div>

            <div className="flex items-center justify-center py-2">
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                <QrCode className="h-28 w-28 text-slate-900" />
              </div>
            </div>
            <p className="text-[11px] text-center text-slate-500">Scan QR Code at exam hall entrance for biometric invigilator validation.</p>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowHallTicket(false)}>Close</Button>
              <Button size="sm" onClick={() => setShowHallTicket(false)} className="gap-1 bg-indigo-600 hover:bg-indigo-700">
                <Download className="h-3.5 w-3.5" /> Download Hall Ticket PDF
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INTERACTIVE MODAL: ASSIGNMENT SUBMISSION */}
      {/* ========================================================================= */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Upload Coursework Submission</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedAssignment(null)} className="h-7 w-7 p-0 text-slate-400">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {!submissionSuccess ? (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-700">{selectedAssignment}</p>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center space-y-2 hover:border-indigo-500 transition-colors cursor-pointer bg-slate-50/50">
                  <UploadCloud className="h-8 w-8 mx-auto text-indigo-600" />
                  <p className="text-xs font-semibold text-slate-800">Drop PDF, ZIP or DOCX file here</p>
                  <p className="text-[10px] text-slate-400">Maximum file size: 25 MB</p>
                </div>
                <Input placeholder="Optional submission remarks or GitHub repo link..." className="text-xs" />
                <div className="pt-2 flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedAssignment(null)}>Cancel</Button>
                  <Button size="sm" onClick={() => setSubmissionSuccess(true)} className="bg-indigo-600 hover:bg-indigo-700">
                    Upload & Submit
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-3 space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <p className="font-bold text-sm text-slate-900">Assignment Uploaded Successfully!</p>
                <p className="text-xs text-slate-500">Timestamp logged in LMS and audit logs.</p>
                <Button size="sm" onClick={() => setSelectedAssignment(null)} className="w-full bg-indigo-600 hover:bg-indigo-700 mt-2">
                  Done
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
