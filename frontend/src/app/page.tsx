"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { useUIStore } from "@/store/use-ui-store";
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
import {
  GraduationCap,
  BookOpen,
  Calendar,
  CreditCard,
  Award,
  Bell,
  CheckCircle2,
  Clock,
  FileText,
  Layers,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  UserCheck,
  Building2,
  ShieldCheck,
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
  { subject: "HU-201 (Tech Writing)", attendance: 96 },
];

const enrolledCourses = [
  {
    code: "CS-401",
    name: "Distributed Computing Systems",
    credits: 4,
    instructor: "Dr. Sarah Jenkins",
    schedule: "Mon/Wed 09:00 - 10:30",
    room: "Lab 304",
    attendancePct: 94,
    grade: "A",
  },
  {
    code: "CS-405",
    name: "Compiler Construction & Design",
    credits: 3,
    instructor: "Prof. Alan Vance",
    schedule: "Tue/Thu 11:00 - 12:30",
    room: "Hall B",
    attendancePct: 88,
    grade: "A-",
  },
  {
    code: "SE-410",
    name: "Cloud Architecture & Microservices",
    credits: 3,
    instructor: "Dr. Michael Chen",
    schedule: "Mon/Wed 14:00 - 15:30",
    room: "Smart Room 102",
    attendancePct: 92,
    grade: "A",
  },
  {
    code: "MT-302",
    name: "Stochastic Processes & Analytics",
    credits: 3,
    instructor: "Dr. Emily Taylor",
    schedule: "Fri 09:00 - 12:00",
    room: "Room 205",
    attendancePct: 82,
    grade: "B+",
  },
];

export default function StudentPortalDashboard() {
  const { user } = useAuthStore();
  const { activeTheme, setTheme } = useUIStore();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 pb-16">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-lg">
                  Apex University ERP
                </span>
                <Badge variant="info" className="text-[10px] uppercase font-bold tracking-wider">
                  Module 1 Active
                </Badge>
              </div>
              <p className="text-xs text-slate-500">Student Academic & Campus Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Fall 2026 Active Session</span>
            </div>

            <Button variant="ghost" size="icon" className="relative text-slate-600 hover:text-slate-900">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600" />
            </Button>

            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <Avatar className="h-9 w-9 border border-indigo-100">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-900 leading-none">{user?.name}</p>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">{user?.studentId}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 sm:px-8 pt-8 space-y-8 max-w-7xl">
        {/* Hero Welcome Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-200 border border-indigo-500/30 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Next-Gen Frontend Stack Connected</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-sm text-slate-300">
                BS Computer Science • Semester 6 • Academic Standing:{" "}
                <span className="text-emerald-400 font-semibold">Good Standing</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 text-center min-w-[120px]">
                <p className="text-xs text-slate-300 font-medium">Cumulative GPA</p>
                <p className="text-2xl font-bold text-white tracking-tight mt-0.5">3.87</p>
                <div className="flex items-center justify-center gap-1 text-[11px] text-emerald-400 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>Top 3%</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 text-center min-w-[120px]">
                <p className="text-xs text-slate-300 font-medium">Earned Credits</p>
                <p className="text-2xl font-bold text-white tracking-tight mt-0.5">96 / 134</p>
                <p className="text-[11px] text-slate-300 mt-1">71.6% Complete</p>
              </div>
            </div>
          </div>
        </section>

        {/* Top KPI Metrics Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Current Term SGPA
              </CardTitle>
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                <Award className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">4.00</div>
              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                <ArrowUpRight className="h-3.5 w-3.5" /> +0.05 from last semester
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Term Attendance
              </CardTitle>
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                <UserCheck className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">90.8%</div>
              <div className="mt-2 space-y-1">
                <Progress value={90.8} className="h-1.5" />
                <p className="text-[11px] text-slate-500">Threshold: 75% required</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Fee Status (FA26)
              </CardTitle>
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                <CreditCard className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-slate-900">$0.00</span>
                <Badge variant="success">PAID</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">Challan: CHL-2026-88192</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Courses
              </CardTitle>
              <div className="rounded-lg bg-sky-50 p-2 text-sky-600">
                <BookOpen className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">4 Courses</div>
              <p className="text-xs text-slate-500 mt-1">13 Credit Hours Registered</p>
            </CardContent>
          </Card>
        </section>

        {/* Tabbed Interactive Sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-100/80 p-1 border border-slate-200/80 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg px-4 py-2 text-xs font-semibold">
              📊 Academic Overview & Charts
            </TabsTrigger>
            <TabsTrigger value="courses" className="rounded-lg px-4 py-2 text-xs font-semibold">
              📚 Enrolled Courses ({enrolledCourses.length})
            </TabsTrigger>
            <TabsTrigger value="transcript" className="rounded-lg px-4 py-2 text-xs font-semibold">
              📜 8-Semester Transcript
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="rounded-lg px-4 py-2 text-xs font-semibold">
              🎯 Module 1 Roadmap Phases
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: ACADEMIC OVERVIEW */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* CGPA Progression Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900">
                        CGPA & SGPA Progression History
                      </CardTitle>
                      <CardDescription>Continuous trend over 6 completed semesters</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Max Scale: 4.00
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px] w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={cgpaHistoryData}>
                        <defs>
                          <linearGradient id="cgpaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="semester" stroke="#94a3b8" fontSize={12} />
                        <YAxis domain={[3.0, 4.0]} stroke="#94a3b8" fontSize={12} />
                        <RechartsTooltip />
                        <Area
                          type="monotone"
                          dataKey="cgpa"
                          name="CGPA"
                          stroke="#4f46e5"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#cgpaGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Attendance Subject-wise Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-bold text-slate-900">
                    Subject Attendance
                  </CardTitle>
                  <CardDescription>Current term live attendance gauge</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px] w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={attendanceSummaryData}
                        layout="vertical"
                        margin={{ left: 20, right: 20 }}
                      >
                        <XAxis type="number" domain={[0, 100]} fontSize={11} stroke="#94a3b8" />
                        <YAxis
                          type="category"
                          dataKey="subject"
                          width={110}
                          fontSize={11}
                          stroke="#64748b"
                        />
                        <RechartsTooltip />
                        <Bar dataKey="attendance" fill="#10b981" radius={[0, 6, 6, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 2: ENROLLED COURSES */}
          <TabsContent value="courses" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {enrolledCourses.map((course) => (
                <Card key={course.code} className="hover:border-indigo-200 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="outline" className="font-mono text-xs">
                          {course.code}
                        </Badge>
                        <CardTitle className="text-base font-bold mt-1 text-slate-900">
                          {course.name}
                        </CardTitle>
                      </div>
                      <Badge variant="success">{course.credits} Credits</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span>{course.schedule} • {course.room}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-slate-400" />
                      <span>Instructor: {course.instructor}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-slate-500">Attendance: {course.attendancePct}%</span>
                      <span className="font-bold text-slate-900">Current Grade: {course.grade}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* TAB 3: TRANSCRIPT VIEW */}
          <TabsContent value="transcript">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold">Official Student Grade Record</CardTitle>
                    <CardDescription>
                      Verified Single Source of GPA across all semesters
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 text-xs">
                    <FileText className="h-4 w-4" /> Download Official PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-slate-200 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Semester</th>
                        <th className="p-3">Term Code</th>
                        <th className="p-3">Courses Passed</th>
                        <th className="p-3">Credits Earned</th>
                        <th className="p-3">SGPA</th>
                        <th className="p-3">Cumulative CGPA</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {cgpaHistoryData.map((sem, idx) => (
                        <tr key={sem.semester} className="hover:bg-slate-50/50">
                          <td className="p-3 font-semibold text-slate-900">{sem.semester}</td>
                          <td className="p-3 font-mono text-slate-600">FA{21 + idx}</td>
                          <td className="p-3">5 / 5</td>
                          <td className="p-3">16 Cr</td>
                          <td className="p-3 font-mono font-bold text-slate-900">{sem.gpa.toFixed(2)}</td>
                          <td className="p-3 font-mono font-bold text-indigo-600">{sem.cgpa.toFixed(2)}</td>
                          <td className="p-3">
                            <Badge variant="success">Completed</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: ROADMAP PHASES */}
          <TabsContent value="roadmap">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">
                  Module 1 (Student Portal) Build Status
                </CardTitle>
                <CardDescription>
                  10 Implementation Phases under the Frozen Architecture Contract
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { phase: "Phase 1", title: "Authentication & Student Profile", status: "Active / Configured", icon: ShieldCheck },
                    { phase: "Phase 2", title: "Student Dashboard Overview", status: "Active / Rendered", icon: Layers },
                    { phase: "Phase 3", title: "Course Registration & Prereqs", status: "Ready for Integration", icon: BookOpen },
                    { phase: "Phase 4", title: "Transcript & CGPA Engine", status: "Ready for Integration", icon: Award },
                    { phase: "Phase 5", title: "Attendance Tracker", status: "Ready for Integration", icon: UserCheck },
                    { phase: "Phase 6", title: "LMS Assessments (Quizzes/Assign)", status: "Ready for Integration", icon: FileText },
                    { phase: "Phase 7", title: "Examinations & Results", status: "Ready for Integration", icon: Calendar },
                    { phase: "Phase 8", title: "Fee & Billing Management", status: "Ready for Integration", icon: CreditCard },
                    { phase: "Phase 9", title: "Weekly Timetable Matrix", status: "Ready for Integration", icon: Clock },
                    { phase: "Phase 10", title: "Official Documents & Comms", status: "Ready for Integration", icon: Bell },
                  ].map((p, idx) => (
                    <div
                      key={p.phase}
                      className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <p.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-semibold text-indigo-600">
                            {p.phase}
                          </span>
                          <Badge variant={idx <= 1 ? "success" : "secondary"} className="text-[10px]">
                            {p.status}
                          </Badge>
                        </div>
                        <p className="text-xs font-bold text-slate-900 truncate mt-0.5">{p.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
