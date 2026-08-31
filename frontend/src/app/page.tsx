"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Layers,
  ShieldCheck,
  CreditCard,
  Award,
  Users,
  Building2,
  Bus,
  Library,
  Briefcase,
  FileCheck2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Compass,
  ArrowUpRight,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const erpModules = [
  {
    id: "01",
    name: "Identity, Access & Multi-Tenancy",
    category: "Security & IAM",
    icon: Lock,
    description: "Granular RBAC with 12 system roles, JWT RS256 token lifecycle, tenant isolation, and immutable audit logs.",
    entities: ["User", "RolePermission", "AuditLog", "Announcement"],
    color: "from-blue-600 to-indigo-600",
  },
  {
    id: "02",
    name: "Campus Infrastructure & Facilities",
    category: "Operations",
    icon: Building2,
    description: "Multi-campus building hierarchies, smart classroom allocations, event room bookings, assets, and maintenance work orders.",
    entities: ["Campus", "Building", "Room", "RoomBooking", "Asset"],
    color: "from-slate-700 to-slate-900",
  },
  {
    id: "03",
    name: "Academic Core & Curriculum DAG",
    category: "Academics",
    icon: Compass,
    description: "Degree program roadmaps, course catalogs, prerequisite DAG resolution, semester term scheduling, and timetable matrix.",
    entities: ["Program", "Course", "CoursePrerequisite", "CourseOffering"],
    color: "from-indigo-600 to-purple-600",
  },
  {
    id: "04",
    name: "HR Workforce & Master Employee Spine",
    category: "Human Resources",
    icon: Users,
    description: "Unified HR spine specialized into Faculty, Admin Staff, and Fleet Drivers with leave balance quotas and payroll slips.",
    entities: ["Employee", "Teacher", "Staff", "LeaveBalance", "SalarySlip"],
    color: "from-emerald-600 to-teal-700",
  },
  {
    id: "05",
    name: "Student Lifecycle & Verified Credentials",
    category: "Student Affairs",
    icon: GraduationCap,
    description: "Master student profiles, emergency contacts, guardian records, academic standings, and QR-verifiable digital diplomas.",
    entities: ["Student", "GuardianInfo", "EmergencyContact", "Document"],
    color: "from-indigo-500 to-blue-600",
  },
  {
    id: "06",
    name: "Admissions Intake & Merit Ranking",
    category: "Admissions",
    icon: FileCheck2,
    description: "Candidate applications, entrance examination slots, 50/50 aggregate calculation engine, and automated merit list publishing.",
    entities: ["Applicant", "Application", "AdmissionTest", "MeritListEntry"],
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "07",
    name: "Assessments, LMS & Exam Controller",
    category: "LMS & Exams",
    icon: Award,
    description: "Course section enrollments, class attendance, online timed quizzes, datesheet generator, exam invigilation, and single-source GPA.",
    entities: ["Enrollment", "Assignment", "Quiz", "ExamTerm", "ExamResult"],
    color: "from-rose-500 to-pink-600",
  },
  {
    id: "08",
    name: "Finance, Billing & General Ledger",
    category: "Finance",
    icon: CreditCard,
    description: "Itemized fee templates, Challan generation, online payment gateway hooks, scholarship awards, and double-entry General Ledger.",
    entities: ["FeeStructure", "FeeChallan", "Payment", "Account", "Transaction"],
    color: "from-emerald-500 to-green-700",
  },
  {
    id: "09",
    name: "Library Automation System",
    category: "Campus Operations",
    icon: Library,
    description: "Book cataloging, barcode copy tracking, membership checkout circulation, return inspections, and overdue fine settlements.",
    entities: ["Book", "BookCopy", "LibraryMember", "BookIssue", "Fine"],
    color: "from-cyan-600 to-blue-700",
  },
  {
    id: "10",
    name: "Hostel & Residential Housing",
    category: "Campus Operations",
    icon: Layers,
    description: "Dormitory building management, room types, bed allocation contracts, check-in/out workflows, and residency fee billing.",
    entities: ["Hostel", "HostelRoom", "HostelAllocation"],
    color: "from-violet-600 to-indigo-700",
  },
  {
    id: "11",
    name: "Transport Fleet & Commuter Passes",
    category: "Campus Operations",
    icon: Bus,
    description: "Fleet buses, driver assignments, route stops, pickup timings, and student/employee semester transit subscriptions.",
    entities: ["Vehicle", "Driver", "Route", "RouteStop", "TransportSubscription"],
    color: "from-amber-600 to-yellow-600",
  },
  {
    id: "12",
    name: "Career Placements & Research Grants",
    category: "Career & Research",
    icon: Briefcase,
    description: "Campus recruitment job postings, student candidate applications, grant-funded research projects, and publication citation tracking.",
    entities: ["Company", "JobPosting", "PlacementApplication", "ResearchProject", "Publication"],
    color: "from-fuchsia-600 to-purple-800",
  },
];

const portalsList = [
  {
    id: "student",
    title: "🎓 Student Portal",
    badge: "Module 1 Live",
    description: "Comprehensive learner dashboard for course registration, real-time attendance, LMS quizzes, 8-semester interactive transcript, and downloadable fee challans.",
    highlights: ["Interactive CGPA & SGPA Trend Engine", "Weekly Color-Coded Timetable Matrix", "Online Homework Dropzone & Quiz Attempt Engine", "Digital Student ID & PDF Fee Challan Voucher"],
    ctaLink: "/student/dashboard",
    ctaText: "Launch Student Portal Demo",
  },
  {
    id: "rbac",
    title: "🛡️ RBAC & IAM Admin Console",
    badge: "Live Interactive",
    description: "Centralized identity and access management console for role assignments, live permission matrix toggling, and security audit logs.",
    highlights: ["12 Standard System Roles Support", "Live Role-Permission Matrix Editor", "Immutable Audit Logging Records", "Active Persona Simulator"],
    ctaLink: "/admin/rbac",
    ctaText: "Open RBAC Console",
  },
  {
    id: "teacher",
    title: "👨‍🏫 Faculty & Teacher Portal",
    badge: "Milestone 2 Live",
    description: "Empowers professors and instructors to mark daily lecture attendance, create question banks, publish assignments, upload S3 course materials, and submit sessional grades.",
    highlights: ["Interactive Class Section Attendance Marker", "Timed Quiz & Question Bank Builder", "Assignment Submissions Desk & Rubric Grader", "AWS S3 Course Materials & Cloudinary Video Lectures"],
    ctaLink: "/faculty/dashboard",
    ctaText: "Launch Faculty Portal",
  },
  {
    id: "controller",
    title: "🏛️ Examination Controller Portal",
    badge: "Milestone 2 Live",
    description: "Centralized examination controller console for term datesheet generation, hall ticket authorization, invigilator assignments, and immutable grade locking.",
    highlights: ["Exam Term & Datesheet Publisher", "Invigilator Roster & Hall Allocations", "Grade Distribution Verification & Lock Engine", "Official Transcript Generation"],
    ctaLink: "/exam-controller/dashboard",
    ctaText: "Launch Exam Controller Portal",
  },
  {
    id: "admissions",
    title: "📋 Admissions & Applicant Intake",
    badge: "Phase 16 Live",
    description: "Public undergraduate online application wizard, multi-stage status tracker with test roll number slips, and Admissions Officer review desk.",
    highlights: ["5-Step Interactive Application Wizard", "Real-Time Application Status Stepper", "AWS S3 Certificate Upload Dropzone", "Admissions Officer Verification Desk"],
    ctaLink: "/admissions/apply",
    ctaText: "Apply Online for Fall 2026",
  },
  {
    id: "accountant",
    title: "💳 Finance & Accountant Portal",
    badge: "Phase 18 Live",
    description: "End-to-end billing and financial accounting platform with itemized fee templates, batch challan generator, bank scroll reconciliation, and GAAP General Ledger.",
    highlights: ["Batch Semester Challan Generator", "HBL & UBL Bank Scroll Reconciliation", "Itemized Fee Structure Pricing Engine", "Double-Entry Chart of Accounts & Trial Balance"],
    ctaLink: "/accountant/dashboard",
    ctaText: "Launch Accountant Portal",
  },
  {
    id: "hr",
    title: "👔 HR & Workforce Portal",
    badge: "Phase 19 Live",
    description: "Unified workforce management spine for Faculty, Administrative Staff, and Transport Drivers with leave approval desks and monthly payroll engine.",
    highlights: ["Unified Faculty & Staff Directory", "Leave Balance & Decision Workstation", "Automated Monthly Payroll Calculator", "Tax & Provident Fund Deductions"],
    ctaLink: "/hr/dashboard",
    ctaText: "Launch HR Manager Portal",
  },
  {
    id: "library",
    title: "📚 Library Circulation & OPAC",
    badge: "Phase 20 Live",
    description: "Dewey Decimal cataloging, barcoded copy inventory, instant student & faculty circulation loans, automated overdue fines, and public OPAC search.",
    highlights: ["Master DDC & ISBN Cataloging", "Barcode Circulation Loan & Return Desk", "Automated Overdue Fines (PKR 50/day)", "Real-Time Student OPAC Search"],
    ctaLink: "/librarian/dashboard",
    ctaText: "Launch Library Portal",
  },
  {
    id: "warden",
    title: "🏢 Hostel & Residential Life",
    badge: "Phase 21 Live",
    description: "Hostel building directories, interactive 2D/3D room and bed matrix grid, residential contract check-in desk, and room transfer approvals.",
    highlights: ["Iqbal & Fatima Jinnah Halls", "Interactive Room & Bed Slot Grid", "Check-In Contracts & Emergency Verification", "Room Change & Departure Approvals"],
    ctaLink: "/warden/dashboard",
    ctaText: "Launch Warden Portal",
  },
];

export default function UniversityLandingPage() {
  const [selectedPortal, setSelectedPortal] = useState("student");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Top Floating Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                Apex ERP
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                Enterprise v1.0
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Core Pillars</a>
            <a href="#modules" className="hover:text-indigo-600 transition-colors">12 Bounded Modules</a>
            <a href="#portals" className="hover:text-indigo-600 transition-colors">Role Portals</a>
            <Link href="/admin/rbac" className="hover:text-indigo-600 transition-colors flex items-center gap-1 font-bold text-indigo-600">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>RBAC Console</span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs border-slate-300">
                <KeyRound className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </Button>
            </Link>
            <Link href="/student/dashboard">
              <Button size="sm" className="gap-2 text-xs bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20">
                <span>Student Portal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50 to-slate-100/50">
        <div className="container mx-auto px-4 sm:px-8 max-w-7xl relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 border border-indigo-200/60 shadow-sm animate-pulse">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Universal University & College Management Operating System</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-950 leading-[1.1]">
              The Unified Operating System for{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Modern Universities
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Harmonize the entire collegiate lifecycle—from Admissions, Academics, LMS, and Examinations to Payroll, Itemized Billing, Fleet Transport, and Library Automation.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link href="/student/dashboard">
                <Button size="lg" className="gap-2 bg-slate-950 hover:bg-slate-900 text-white shadow-xl shadow-slate-900/10 font-semibold text-sm">
                  <span>Explore Student Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/admin/rbac">
                <Button variant="outline" size="lg" className="gap-2 border-indigo-300 bg-indigo-50/50 text-indigo-900 font-semibold text-sm hover:bg-indigo-100">
                  <ShieldCheck className="h-4 w-4 text-indigo-600" />
                  <span>Open RBAC Matrix Console</span>
                </Button>
              </Link>
            </div>

            {/* Micro Highlights */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Single Source of Academic GPA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>12 RBAC Personas & Token Guards</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>84 Frozen Normalized Entities</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section id="features" className="py-16 md:py-24 border-b border-slate-200/80 bg-white">
        <div className="container mx-auto px-4 sm:px-8 max-w-7xl space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="outline" className="text-xs font-mono font-semibold text-indigo-600">
              CORE PILLARS
            </Badge>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              Engineered for Enterprise Academic Rigor
            </h2>
            <p className="text-sm text-slate-600">
              Built upon mathematical guarantees, strict referential integrity, and domain-driven design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-slate-200/80 hover:border-indigo-300 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Unified Identity & Workforce Spine
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed text-slate-600">
                  A single `User` and `Employee` spine powers Teachers, Wardens, Librarians, and Drivers—eliminating duplications across payroll, attendance, and leave management.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-slate-200/80 hover:border-indigo-300 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
                  <Compass className="h-6 w-6" />
                </div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Academic Prerequisite DAG Engine
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed text-slate-600">
                  Automated directed acyclic graph (DAG) validates hard prerequisites and co-requisites, preventing illegal course registrations and automating transcript CGPAs.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-slate-200/80 hover:border-indigo-300 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                  <CreditCard className="h-6 w-6" />
                </div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Double-Entry General Ledger
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed text-slate-600">
                  Itemized fee structure templates, printable fee challans, payment gateways, and real-time Chart of Accounts general ledger audit trails.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* The 12 Bounded Context Modules Showcase */}
      <section id="modules" className="py-16 md:py-24 border-b border-slate-200/80 bg-slate-50/70">
        <div className="container mx-auto px-4 sm:px-8 max-w-7xl space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="outline" className="text-xs font-mono font-semibold text-indigo-600">
              12 BOUNDED CONTEXTS
            </Badge>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              Comprehensive Domain Subsystems
            </h2>
            <p className="text-sm text-slate-600">
              Every sub-system operates as a clean, loosely-coupled bounded context hanging off the master academic spine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {erpModules.map((m) => (
              <Card key={m.id} className="border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        Module {m.id}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        {m.category}
                      </span>
                    </div>
                    <div className={`h-8 w-8 rounded-lg bg-gradient-to-tr ${m.color} text-white flex items-center justify-center shadow-sm`}>
                      <m.icon className="h-4 w-4" />
                    </div>
                  </div>
                  <CardTitle className="text-base font-bold text-slate-900 leading-snug">
                    {m.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {m.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {m.entities.map((e) => (
                      <Badge key={e} variant="secondary" className="text-[10px] font-mono font-normal">
                        {e}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Role Portals Showcase */}
      <section id="portals" className="py-16 md:py-24 border-b border-slate-200/80 bg-white">
        <div className="container mx-auto px-4 sm:px-8 max-w-7xl space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="outline" className="text-xs font-mono font-semibold text-indigo-600">
              ROLE-TAILORED EXPERIENCES
            </Badge>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              Portals for Every Campus Stakeholder
            </h2>
            <p className="text-sm text-slate-600">
              Granular role-based portals designed specifically for the unique workflows of learners, faculty, and administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-2">
              {portalsList.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPortal(p.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedPortal === p.id
                      ? "border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-sm"
                      : "border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{p.title}</span>
                    <Badge variant={selectedPortal === p.id ? "default" : "secondary"} className="text-[10px]">
                      {p.badge}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>

            <div className="lg:col-span-3">
              {portalsList
                .filter((p) => p.id === selectedPortal)
                .map((p) => (
                  <Card key={p.id} className="border-indigo-200/70 bg-gradient-to-br from-white to-slate-50/50 shadow-md">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold text-slate-900">
                          {p.title}
                        </CardTitle>
                        <Badge variant="success">{p.badge}</Badge>
                      </div>
                      <CardDescription className="text-sm pt-1 leading-relaxed text-slate-600">
                        {p.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Key Capabilities & Workflows
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {p.highlights.map((h) => (
                            <div key={h} className="flex items-center gap-2.5 p-3 rounded-lg bg-white border border-slate-200/80 text-xs font-medium text-slate-800">
                              <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2">
                        {p.ctaLink.startsWith("/") ? (
                          <Link href={p.ctaLink}>
                            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md text-xs font-semibold">
                              <span>{p.ctaText}</span>
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        ) : (
                          <Button variant="outline" className="gap-2 text-xs font-semibold">
                            <span>{p.ctaText}</span>
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live Enterprise System Specs Bar */}
      <section id="architecture" className="py-12 bg-slate-950 text-white">
        <div className="container mx-auto px-4 sm:px-8 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-white font-mono">84</p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Prisma Data Models
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-indigo-400 font-mono">12</p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                RBAC System Roles
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">&lt; 150ms</p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                P95 API Response Time
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono">100%</p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Frozen Schema Compliance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 text-xs text-slate-600">
        <div className="container mx-auto px-4 sm:px-8 max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-indigo-600" />
            <span className="font-bold text-slate-900">Apex University ERP System Design</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-indigo-600 font-semibold">Sign In</Link>
            <Link href="/student/dashboard" className="hover:text-indigo-600 font-semibold">Student Portal</Link>
            <Link href="/admin/rbac" className="hover:text-indigo-600 font-semibold">RBAC Console</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
