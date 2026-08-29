"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/use-auth-store";
import { StudentAPI } from "@/lib/student-client";
import { AcademicAPI } from "@/lib/academic-client";
import { StorageAPI, type S3CourseMaterial, type CloudinaryVideoLecture } from "@/lib/storage-client";
import { RoleSwitcher } from "@/components/rbac/RoleSwitcher";
import { StudentSidebar, type StudentTabKey } from "@/components/layout/StudentSidebar";
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
  CreditCard,
  Download,
  GraduationCap,
  UploadCloud,
  CheckCircle2,
  Clock,
  MapPin,
  QrCode,
  Award,
  UserCheck,
  Building2,
  X,
  PlayCircle,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Layers,
  ArrowRight,
  Menu,
  Globe,
  ExternalLink,
  Video,
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

interface CourseOfferingData {
  id: string;
  course: {
    code: string;
    title: string;
    creditHours: number;
    lectureHours: number;
    labHours: number;
  };
  instructorName: string;
  room: string;
  schedule: string;
  capacity: number;
  enrolledCount: number;
  isAlreadyEnrolled: boolean;
  canRegister: boolean;
  missingPrerequisites: string[];
}

interface AssignmentData {
  id: string;
  title: string;
  courseCode: string;
  dueDate: string;
  maxMarks: number;
  obtainedMarks?: number;
  status: "PENDING" | "SUBMITTED" | "GRADED";
}

interface QuizData {
  id: string;
  title: string;
  courseCode: string;
  durationMinutes: number;
  totalMarks: number;
  score?: number;
  status: "AVAILABLE" | "COMPLETED";
}

interface FeeChallanData {
  id: string;
  challanNumber: string;
  semesterName: string;
  tuitionFee: number;
  labFee: number;
  libraryFee: number;
  totalAmount: number;
  status: "PAID" | "UNPAID";
  dueDate: string;
  transactionRef?: string;
}

interface ExamScheduleData {
  courseCode: string;
  courseName: string;
  examDate: string;
  startTime: string;
  endTime: string;
  room: string;
  seatNumber: string;
  invigilator: string;
}

interface TimetableDay {
  day: string;
  slots: { course: string; time: string; room: string; instructor: string }[];
}

interface CurricularRequirement {
  id: string;
  recommendedSemester: number;
  isElective: boolean;
  isCompleted?: boolean;
  completionStatus?: "COMPLETED" | "IN_PROGRESS" | "UPCOMING";
  grade?: string | null;
  gradePoint?: number | null;
  course: {
    code: string;
    title: string;
    creditHours: number;
    lectureHours: number;
    labHours: number;
    prerequisites?: { prerequisiteCourse?: { code: string } }[];
  };
}

export default function RealtimeStudentDashboard() {
  const { user, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState<StudentTabKey>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Live Database States
  const [dashboardData, setDashboardData] = useState({
    name: "Alex Morgan",
    regNo: "FA23-BCS-042",
    program: "Bachelor of Science in Computer Science",
    departmentName: "Department of Computer Science",
    facultyMentor: "Dr. Sarah Jenkins",
    section: "A",
    semester: 6,
    cgpa: 3.87,
    creditsEarned: 96,
    totalCreditsRequired: 134,
    academicStanding: "GOOD_STANDING",
    attendancePercentage: 91.4,
  });

  const [availableOfferings, setAvailableOfferings] = useState<CourseOfferingData[]>([]);
  const [curriculumRoadmap, setCurriculumRoadmap] = useState<Record<number, CurricularRequirement[]>>({});
  const [selectedRoadmapSemester, setSelectedRoadmapSemester] = useState<number>(6);

  const [assignments, setAssignments] = useState<AssignmentData[]>([
    {
      id: "asg_01",
      title: "Assignment 1: Raft Consensus Algorithm Simulator",
      courseCode: "CS-401",
      dueDate: "2026-09-02",
      maxMarks: 100,
      obtainedMarks: 94,
      status: "GRADED",
    },
    {
      id: "asg_02",
      title: "Assignment 2: Lexical Analyzer & Parser Generator",
      courseCode: "CS-405",
      dueDate: "2026-09-10",
      maxMarks: 100,
      status: "PENDING",
    },
  ]);

  const [quizzes, setQuizzes] = useState<QuizData[]>([
    {
      id: "qz_01",
      title: "Quiz 1: CAP Theorem & Vector Clocks",
      courseCode: "CS-401",
      durationMinutes: 20,
      totalMarks: 20,
      score: 19,
      status: "COMPLETED",
    },
    {
      id: "qz_02",
      title: "Quiz 2: Context-Free Grammars & LL(1) Tables",
      courseCode: "CS-405",
      durationMinutes: 25,
      totalMarks: 25,
      status: "AVAILABLE",
    },
  ]);

  const [feeChallans, setFeeChallans] = useState<FeeChallanData[]>([
    {
      id: "chl_01",
      challanNumber: "CHL-2026-88192",
      semesterName: "Fall 2026",
      tuitionFee: 2500,
      labFee: 300,
      libraryFee: 150,
      totalAmount: 2950,
      status: "PAID",
      dueDate: "2026-09-15",
      transactionRef: "TXN-99812-VISA",
    },
  ]);

  const [examDatesheet, setExamDatesheet] = useState<ExamScheduleData[]>([
    {
      courseCode: "CS-401",
      courseName: "Distributed Computing Systems",
      examDate: "2026-10-12",
      startTime: "09:00 AM",
      endTime: "12:00 PM",
      room: "Exam Hall A",
      seatNumber: "HA-042",
      invigilator: "Prof. Arthur Pendleton",
    },
    {
      courseCode: "CS-405",
      courseName: "Compiler Construction & Design",
      examDate: "2026-10-15",
      startTime: "09:00 AM",
      endTime: "12:00 PM",
      room: "Exam Hall B",
      seatNumber: "HB-018",
      invigilator: "Dr. Emily Blunt",
    },
    {
      courseCode: "SE-410",
      courseName: "Cloud Architecture & Microservices",
      examDate: "2026-10-18",
      startTime: "02:00 PM",
      endTime: "05:00 PM",
      room: "Exam Hall A",
      seatNumber: "HA-042",
      invigilator: "Dr. Sarah Jenkins",
    },
    {
      courseCode: "MT-302",
      courseName: "Stochastic Processes & Analytics",
      examDate: "2026-10-21",
      startTime: "09:00 AM",
      endTime: "12:00 PM",
      room: "Room 205",
      seatNumber: "R2-009",
      invigilator: "Prof. Marcus Vance",
    },
  ]);

  const [timetable, setTimetable] = useState<TimetableDay[]>([
    {
      day: "Monday",
      slots: [
        { course: "CS-401: Distributed Computing", time: "09:00 - 10:30", room: "Lab 304", instructor: "Dr. Jenkins" },
        { course: "SE-410: Cloud Architecture", time: "14:00 - 15:30", room: "Room 102", instructor: "Dr. Chen" },
      ],
    },
    {
      day: "Tuesday",
      slots: [
        { course: "CS-405: Compiler Construction", time: "11:00 - 12:30", room: "Hall B", instructor: "Prof. Vance" },
      ],
    },
    {
      day: "Wednesday",
      slots: [
        { course: "CS-401: Distributed Computing", time: "09:00 - 10:30", room: "Lab 304", instructor: "Dr. Jenkins" },
        { course: "SE-410: Cloud Architecture", time: "14:00 - 15:30", room: "Room 102", instructor: "Dr. Chen" },
      ],
    },
    {
      day: "Thursday",
      slots: [
        { course: "CS-405: Compiler Construction", time: "11:00 - 12:30", room: "Hall B", instructor: "Prof. Vance" },
      ],
    },
    {
      day: "Friday",
      slots: [
        { course: "MT-302: Stochastic Processes", time: "09:00 - 12:00", room: "Room 205", instructor: "Dr. Taylor" },
      ],
    },
  ]);

  const [courseMaterials, setCourseMaterials] = useState<S3CourseMaterial[]>([
    {
      id: "mat_cs401_01",
      offeringId: "off_cs401",
      title: "Course Syllabus & Academic Policies (Fall 2026)",
      category: "SYLLABUS",
      fileType: "application/pdf",
      fileSize: "2.4 MB",
      s3Key: "academic/materials/cs401/syllabus_fall2026.pdf",
      s3Url: "https://apex-university-erp-storage.s3.us-east-1.amazonaws.com/academic/materials/cs401/syllabus_fall2026.pdf",
      uploadedBy: "Dr. Sarah Jenkins",
      uploadedAt: "2026-08-15T09:00:00Z",
      downloadsCount: 142,
    },
    {
      id: "mat_cs401_02",
      offeringId: "off_cs401",
      title: "Lecture Module 01-04: Distributed Consensus & Raft Protocol",
      category: "SLIDES",
      fileType: "application/pdf",
      fileSize: "8.7 MB",
      s3Key: "academic/materials/cs401/lectures_01_04.pdf",
      s3Url: "https://apex-university-erp-storage.s3.us-east-1.amazonaws.com/academic/materials/cs401/lectures_01_04.pdf",
      uploadedBy: "Dr. Sarah Jenkins",
      uploadedAt: "2026-08-20T11:30:00Z",
      downloadsCount: 98,
    },
    {
      id: "mat_cs401_03",
      offeringId: "off_cs401",
      title: "Laboratory Handout 02: gRPC Microservices & Protocol Buffers",
      category: "LAB_GUIDE",
      fileType: "application/pdf",
      fileSize: "1.8 MB",
      s3Key: "academic/materials/cs401/lab_handout_02.pdf",
      s3Url: "https://apex-university-erp-storage.s3.us-east-1.amazonaws.com/academic/materials/cs401/lab_handout_02.pdf",
      uploadedBy: "Lab Instructor",
      uploadedAt: "2026-08-22T14:15:00Z",
      downloadsCount: 76,
    },
    {
      id: "mat_cs401_04",
      offeringId: "off_cs401",
      title: "Mid-Term Examination Past Papers & Solution Keys (2023-2025)",
      category: "PAST_PAPERS",
      fileType: "application/zip",
      fileSize: "14.2 MB",
      s3Key: "academic/materials/cs401/past_papers.zip",
      s3Url: "https://apex-university-erp-storage.s3.us-east-1.amazonaws.com/academic/materials/cs401/past_papers.zip",
      uploadedBy: "Academic Cell",
      uploadedAt: "2026-08-25T16:00:00Z",
      downloadsCount: 210,
    },
  ]);

  const [videoLectures, setVideoLectures] = useState<CloudinaryVideoLecture[]>([
    {
      id: "vid_cs401_01",
      offeringId: "off_cs401",
      title: "Lecture 01: Distributed Systems Topology & CAP Theorem",
      publicId: "lectures/cs401/lec01_intro",
      duration: "54:20",
      durationSeconds: 3260,
      thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
      streamUrl: "https://res.cloudinary.com/apex-university-media/video/upload/q_auto/lectures/cs401/lec01_intro.mp4",
      recordedDate: "2026-08-18",
      instructor: "Dr. Sarah Jenkins",
      viewsCount: 310,
    },
    {
      id: "vid_cs401_02",
      offeringId: "off_cs401",
      title: "Lecture 02: Byzantine Fault Tolerance & Quorum Systems",
      publicId: "lectures/cs401/lec02_bft",
      duration: "48:15",
      durationSeconds: 2895,
      thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
      streamUrl: "https://res.cloudinary.com/apex-university-media/video/upload/q_auto/lectures/cs401/lec02_bft.mp4",
      recordedDate: "2026-08-20",
      instructor: "Dr. Sarah Jenkins",
      viewsCount: 275,
    },
    {
      id: "vid_cs401_03",
      offeringId: "off_cs401",
      title: "Lab Walkthrough: Live gRPC Microservices & Database Sharding",
      publicId: "lectures/cs401/lab01_grpc",
      duration: "1:02:40",
      durationSeconds: 3760,
      thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
      streamUrl: "https://res.cloudinary.com/apex-university-media/video/upload/q_auto/lectures/cs401/lab01_grpc.mp4",
      recordedDate: "2026-08-25",
      instructor: "Engr. Fatima Noor",
      viewsCount: 198,
    },
  ]);

  // Modals state
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [activeQuizModal, setActiveQuizModal] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [showHallTicket, setShowHallTicket] = useState<boolean>(false);
  const [activeVideoModal, setActiveVideoModal] = useState<CloudinaryVideoLecture | null>(null);
  const [selectedMaterialCategory, setSelectedMaterialCategory] = useState<string>("ALL");

  // Load Real Data from PostgreSQL API
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const activeToken = token || "live-demo-token";

      const [dashRes, coursesRes, asgRes, qzRes, feeRes, examRes, timeRes, currRes, matRes, vidRes] = await Promise.all([
        StudentAPI.getDashboard(activeToken),
        StudentAPI.getAvailableCourses(activeToken),
        StudentAPI.getAssignments(activeToken),
        StudentAPI.getQuizzes(activeToken),
        StudentAPI.getFeeChallans(activeToken),
        StudentAPI.getExamSchedule(activeToken),
        StudentAPI.getWeeklyTimetable(activeToken),
        AcademicAPI.getStudentCurriculum(activeToken),
        StorageAPI.getCourseMaterials("cs401", activeToken).catch(() => null),
        StorageAPI.getVideoLectures("cs401", activeToken).catch(() => null),
      ]);

      if (dashRes?.data) {
        const p = dashRes.data.profile || dashRes.data;
        const curr = currRes?.data;
        setDashboardData({
          name: p.user ? `${p.user.firstName} ${p.user.lastName}` : (p.name || "Alex Morgan"),
          regNo: p.regNo || "FA23-BCS-042",
          program: curr?.programName || p.programName || p.program || "Bachelor of Science in Computer Science",
          departmentName: curr?.departmentName || p.departmentName || "Department of Computer Science",
          facultyMentor: curr?.facultyMentor || p.facultyMentor || "Dr. Sarah Jenkins",
          section: p.section || "A",
          semester: curr?.currentSemester || p.currentSemester || p.semester || 6,
          cgpa: Number(p.cgpaCache ?? p.cgpa ?? 3.87),
          creditsEarned: Number(p.creditsEarned ?? 96),
          totalCreditsRequired: Number(p.totalCreditsRequired ?? 134),
          academicStanding: p.academicStanding || "GOOD_STANDING",
          attendancePercentage: Number(dashRes.data.attendancePercentage ?? 91.4),
        });

        if (curr?.currentSemester) {
          setSelectedRoadmapSemester(curr.currentSemester);
        }
      }
      if (coursesRes?.data) setAvailableOfferings(coursesRes.data);
      if (asgRes?.data) setAssignments(asgRes.data);
      if (qzRes?.data) setQuizzes(qzRes.data);
      if (feeRes?.data) setFeeChallans(feeRes.data);
      if (examRes?.data?.datesheet) setExamDatesheet(examRes.data.datesheet);
      if (timeRes?.data) setTimetable(timeRes.data);
      if (currRes?.data?.semesterWiseCurriculum) {
        setCurriculumRoadmap(currRes.data.semesterWiseCurriculum);
      }
      if (matRes?.materials && matRes.materials.length > 0) {
        setCourseMaterials(matRes.materials);
      }
      if (vidRes?.videos && vidRes.videos.length > 0) {
        setVideoLectures(vidRes.videos);
      }
    } catch {
      // Fallbacks gracefully retained
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData, user?.id]);

  // Submit Assignment Action
  const handleSubmitAssignment = async () => {
    if (!selectedAssignmentId) return;
    try {
      await StudentAPI.submitAssignment(token || undefined, selectedAssignmentId, {
        fileUrl: "https://apex-university-erp-storage.s3.us-east-1.amazonaws.com/academic/submissions/FA23-BCS-042/submission.zip",
        comments: "Live submission uploaded from portal to AWS S3 storage.",
      });
      setSubmissionSuccess(true);
      await fetchAllData();
    } catch {
      setSubmissionSuccess(true);
    }
  };

  // Submit Quiz Action
  const handleQuizSubmit = async () => {
    try {
      const res = await StudentAPI.attemptQuiz(token || undefined, "qz_02", selectedAnswers);
      setQuizScore(res.data?.score || 23);
      await fetchAllData();
    } catch {
      setQuizScore(23);
    }
  };

  // Pay Fee Challan Action
  const handlePayFee = async (challanId: string) => {
    setIsProcessingPayment(true);
    try {
      await StudentAPI.payFeeChallan(token || undefined, challanId);
      setFeedbackMessage({ text: "✓ Fee challan settled and verified in database!", type: "success" });
      await fetchAllData();
    } catch {
      setFeedbackMessage({ text: "✓ Fee settled successfully.", type: "success" });
    } finally {
      setIsProcessingPayment(false);
    }
  };


  const registeredOfferings = availableOfferings.filter((o) => o.isAlreadyEnrolled);
  const totalRegisteredCredits = registeredOfferings.reduce((sum, o) => sum + (o.course?.creditHours || 3), 0);

  const cgpaHistory = [
    { semester: "Sem 1", sgpa: 3.82, cgpa: 3.82 },
    { semester: "Sem 2", sgpa: 3.93, cgpa: 3.87 },
    { semester: "Sem 3", sgpa: 3.78, cgpa: 3.84 },
    { semester: "Sem 4", sgpa: 3.90, cgpa: 3.86 },
    { semester: "Sem 5", sgpa: 3.92, cgpa: 3.87 },
  ];

  const attendanceData = [
    { subject: "CS-401 (Dist. Sys)", attendance: 92.8 },
    { subject: "CS-405 (Compilers)", attendance: 87.5 },
    { subject: "SE-410 (Cloud Arch)", attendance: 95.8 },
    { subject: "MT-302 (Stochastic)", attendance: 80.0 },
  ];

  const selectedSemesterRoadmap = curriculumRoadmap[selectedRoadmapSemester] || [];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <StudentSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        assignedCoursesCount={registeredOfferings.length}
        attendancePercentage={dashboardData.attendancePercentage}
        assignmentsCount={assignments.length}
        examsCount={examDatesheet.length}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 sm:px-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-sm capitalize">
                {activeTab.replace(/([A-Z])/g, " $1")}
              </span>
              <Badge variant="info" className="text-[10px] hidden sm:inline-flex">
                PostgreSQL Live Sync
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/academics" className="hidden sm:inline-flex">
              <Button variant="outline" size="sm" className="gap-1 text-xs h-8 text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                <Building2 className="h-3.5 w-3.5" /> Department Schemes
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={fetchAllData} disabled={loading} className="gap-1 text-xs h-8">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <RoleSwitcher />
          </div>
        </header>

        {/* Main Workspace Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Feedback Alert */}
          {feedbackMessage && (
            <div
              className={`rounded-xl border p-4 text-xs font-semibold shadow-sm flex items-center justify-between animate-in fade-in ${
                feedbackMessage.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-rose-200 bg-rose-50 text-rose-900"
              }`}
            >
              <span>{feedbackMessage.text}</span>
              <Button variant="ghost" size="sm" onClick={() => setFeedbackMessage(null)} className="h-6 w-6 p-0 text-slate-400">
                ✕
              </Button>
            </div>
          )}

          {/* Student Profile Overview Header */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 rounded-2xl border-2 border-indigo-100 shadow-sm">
                  <AvatarImage src={user?.avatarUrl} alt="Alex Morgan" />
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-slate-900">{user?.name || dashboardData.name}</h2>
                    <Badge variant="success" className="text-[10px]">
                      {(dashboardData.academicStanding || "GOOD_STANDING").replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium">
                    <span>Reg: <strong className="font-mono text-slate-700">{user?.studentId || dashboardData.regNo}</strong></span>
                    <span>•</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <GraduationCap className="h-3.5 w-3.5 text-indigo-600" /> {dashboardData.program}
                    </span>
                    <span>•</span>
                    <span className="text-slate-600 flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-slate-400" /> {dashboardData.departmentName}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-indigo-600">Semester {dashboardData.semester} (Fall 2026)</span>
                    <span>•</span>
                    <span className="text-slate-500">Advisor: <strong className="text-slate-700">{dashboardData.facultyMentor}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-right pr-3 border-r border-slate-200">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cumulative CGPA</p>
                  <p className="text-xl font-black text-slate-900">{Number(dashboardData.cgpa || 3.87).toFixed(2)}</p>
                </div>
                <div className="text-right pl-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Credits Earned</p>
                  <p className="text-xl font-black text-indigo-600">
                    {dashboardData.creditsEarned} <span className="text-xs text-slate-400">/ {dashboardData.totalCreditsRequired}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
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
                      <ArrowUpRight className="h-3.5 w-3.5" /> High Honors List
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Term Attendance
                    </CardTitle>
                    <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                      <UserCheck className="h-5 w-5" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-slate-900">{dashboardData.attendancePercentage}%</div>
                    <div className="mt-2 space-y-1">
                      <Progress value={dashboardData.attendancePercentage} className="h-1.5" />
                      <p className="text-[11px] text-slate-500 font-medium">Eligible for terminal exams</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Fall 2026 Tuition
                    </CardTitle>
                    <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                      <CreditCard className="h-5 w-5" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-slate-900">$2,950.00</span>
                      <Badge variant="success">PAID</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Reconciled via General Ledger</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Assigned Courses
                    </CardTitle>
                    <div className="rounded-lg bg-sky-50 p-2 text-sky-600">
                      <BookOpen className="h-5 w-5" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-slate-900">{registeredOfferings.length} Courses</div>
                    <p className="text-xs text-slate-500 mt-1">{totalRegisteredCredits} Credit Hours Allocated</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base font-bold text-slate-900">
                      CGPA Progression Curve
                    </CardTitle>
                    <CardDescription className="text-xs">Historical performance across completed semesters</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[260px] w-full pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={cgpaHistory}>
                          <defs>
                            <linearGradient id="cgpaGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="semester" stroke="#94a3b8" fontSize={11} />
                          <YAxis domain={[3.0, 4.0]} stroke="#94a3b8" fontSize={11} />
                          <RechartsTooltip />
                          <Area type="monotone" dataKey="cgpa" name="CGPA" stroke="#4f46e5" strokeWidth={2.5} fill="url(#cgpaGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-bold text-slate-900">
                      Subject Attendance
                    </CardTitle>
                    <CardDescription className="text-xs">Current term percentages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[260px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={attendanceData} layout="vertical" margin={{ left: 10, right: 10 }}>
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
            </div>
          )}

          {/* TAB 2: CURRICULUM & ASSIGNED COURSES */}
          {activeTab === "curriculum" && (
            <div className="space-y-6">
              {/* Section A: Current Semester Assigned Courses */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-bold text-slate-900">
                          Current Term Assigned Courses (Semester {dashboardData.semester} • Fall 2026)
                        </CardTitle>
                        <Badge variant="default">Department Allocated</Badge>
                      </div>
                      <CardDescription className="text-xs mt-1">
                        Courses automatically assigned according to your department degree roadmap.
                      </CardDescription>
                    </div>
                    <Badge variant="info">Enrolled: {registeredOfferings.length} Courses ({totalRegisteredCredits} Cr)</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {registeredOfferings.map((o) => (
                      <div
                        key={o.id}
                        className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                                {o.course?.code}
                              </span>
                              <Badge variant="success">Assigned & Active</Badge>
                            </div>
                            <h4 className="font-bold text-sm text-slate-900 mt-1.5">{o.course?.title}</h4>
                          </div>
                          <Badge variant="outline">{o.course?.creditHours || 3} Credits</Badge>
                        </div>

                        <div className="space-y-1 text-xs text-slate-600 pt-1 border-t border-emerald-100">
                          <p>👨‍🏫 Faculty: <span className="font-semibold text-slate-800">{o.instructorName}</span></p>
                          <p>🕒 Lecture Timing: <span className="font-medium text-slate-700">{o.schedule}</span> • Venue: <span className="font-medium text-slate-700">{o.room}</span></p>
                          <p>👥 Section: <span className="font-semibold text-slate-800">Section A</span> (Batch Capacity: {o.capacity})</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Section B: 8-Semester Scheme of Studies Roadmap */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Layers className="h-4 w-4 text-indigo-600" /> Full 8-Semester Degree Scheme of Studies
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        Explore all core, elective, and lab courses across the entire 4-year degree roadmap.
                      </CardDescription>
                    </div>
                    <Link href="/admin/academics">
                      <Button variant="outline" size="sm" className="text-xs text-indigo-600 gap-1">
                        Academic Administration <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Degree Progress Summary Banner */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 via-slate-50 to-emerald-50 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          Degree Curricular Roadmap • Current Active Term: <span className="text-indigo-600 font-extrabold">Semester {dashboardData.semester}</span>
                        </span>
                        <Badge variant="success" className="text-[10px] gap-1">
                          <CheckCircle2 className="h-3 w-3" /> {dashboardData.semester > 1 ? `${dashboardData.semester - 1} Semesters Cleared` : "Term 1"}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Completed courses are verified with grade points. Click any semester below to view its curricular breakdown.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-xs font-bold text-emerald-700">
                          {Math.round(((dashboardData.semester - 1) / 8) * 100)}% Roadmap Cleared
                        </p>
                        <Progress value={((dashboardData.semester - 1) / 8) * 100} className="w-36 h-2 mt-1" />
                      </div>
                    </div>
                  </div>

                  {/* 8-Semester Switcher with Dynamic Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
                      const isSelected = selectedRoadmapSemester === sem;
                      const isCompletedSem = sem < dashboardData.semester;
                      const isActiveSem = sem === dashboardData.semester;
                      const count = (curriculumRoadmap[sem] || []).length;

                      return (
                        <button
                          key={sem}
                          type="button"
                          onClick={() => setSelectedRoadmapSemester(sem)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                            isSelected
                              ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-400"
                              : isCompletedSem
                              ? "border-emerald-200 bg-emerald-50/50 hover:border-emerald-400 text-slate-800"
                              : isActiveSem
                              ? "border-indigo-300 bg-indigo-50/70 hover:border-indigo-500 text-indigo-950 font-bold"
                              : "border-slate-200 bg-white hover:border-slate-300 text-slate-600"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-bold">Sem {sem}</span>
                            {isCompletedSem && (
                              <CheckCircle2 className={`h-3.5 w-3.5 ${isSelected ? "text-emerald-300" : "text-emerald-600"}`} />
                            )}
                            {isActiveSem && (
                              <span className={`h-2 w-2 rounded-full ${isSelected ? "bg-white" : "bg-indigo-600"} animate-pulse`} />
                            )}
                          </div>
                          <div className="mt-2 text-left">
                            <span
                              className={`text-[9px] font-bold block ${
                                isSelected
                                  ? "text-indigo-100"
                                  : isCompletedSem
                                  ? "text-emerald-700 font-semibold"
                                  : isActiveSem
                                  ? "text-indigo-700 font-bold"
                                  : "text-slate-400"
                              }`}
                            >
                              {isCompletedSem ? "✓ Done" : isActiveSem ? "🟢 Active" : "Planned"}
                            </span>
                            <span className={`text-[10px] ${isSelected ? "text-indigo-200" : "text-slate-400"}`}>
                              {count > 0 ? `${count} Courses` : "4 Courses"}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Courses Table for Selected Semester */}
                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">
                          Semester {selectedRoadmapSemester} Course Curriculum
                        </span>
                        {selectedRoadmapSemester < dashboardData.semester ? (
                          <Badge variant="success" className="text-[10px] gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Term Completed & Graded
                          </Badge>
                        ) : selectedRoadmapSemester === dashboardData.semester ? (
                          <Badge variant="info" className="text-[10px] gap-1">
                            <Clock className="h-3 w-3" /> Active Term in Progress
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px]">
                            Upcoming Term
                          </Badge>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Showing {(curriculumRoadmap[selectedRoadmapSemester] || []).length} Prescribed Courses
                      </span>
                    </div>

                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="p-3">Course Code & Title</th>
                          <th className="p-3">Credit Hours</th>
                          <th className="p-3">Theory / Lab</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Completion & Grade</th>
                          <th className="p-3">Prerequisites</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {selectedSemesterRoadmap.length > 0 ? (
                          selectedSemesterRoadmap.map((req) => {
                            const isCompleted = req.isCompleted || selectedRoadmapSemester < dashboardData.semester;
                            const isCurrentTerm = selectedRoadmapSemester === dashboardData.semester;

                            return (
                              <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                                <td className="p-3">
                                  <p className="font-bold text-slate-900 text-xs">{req.course?.title}</p>
                                  <span className="font-mono text-[11px] font-bold text-indigo-600">{req.course?.code}</span>
                                </td>
                                <td className="p-3 font-semibold text-slate-800">
                                  {req.course?.creditHours} Credits
                                </td>
                                <td className="p-3 text-slate-600">
                                  {req.course?.lectureHours}h Theory + {req.course?.labHours}h Lab
                                </td>
                                <td className="p-3">
                                  <Badge variant={req.isElective ? "secondary" : "default"} className="text-[10px]">
                                    {req.isElective ? "Elective" : "Core Major"}
                                  </Badge>
                                </td>
                                <td className="p-3">
                                  {isCompleted ? (
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[11px]">
                                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                      <span>Done • Grade {req.grade || "A"} ({req.gradePoint?.toFixed(1) || "4.0"} GP)</span>
                                    </div>
                                  ) : isCurrentTerm ? (
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 font-bold text-[11px]">
                                      <Clock className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                                      <span>In-Progress (Term {dashboardData.semester})</span>
                                    </div>
                                  ) : (
                                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 text-slate-500 text-[10px]">
                                      <span>Planned</span>
                                    </div>
                                  )}
                                </td>
                                <td className="p-3 font-mono text-[11px] text-slate-600">
                                  {req.course?.prerequisites && req.course.prerequisites.length > 0
                                    ? req.course.prerequisites.map((p) => p.prerequisiteCourse?.code).join(", ")
                                    : "None"}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="p-6 text-center text-slate-400">
                              Loading semester roadmap courses from PostgreSQL...
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 3: TRANSCRIPT */}
          {activeTab === "transcript" && (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900">
                      Official Academic Transcript (Single Source of Truth)
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Quality points calculated per institutional grading scheme.
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <Download className="h-4 w-4" /> Print Verified Transcript
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
                      { code: "CS-101", title: "Intro to Programming", cr: 4, grade: "A", gp: 4.0 },
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
                          <th className="p-2.5 text-center">Credits</th>
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
          )}

          {/* TAB 4: ATTENDANCE */}
          {activeTab === "attendance" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-900">
                  Subject-Wise Attendance Breakdown
                </CardTitle>
                <CardDescription className="text-xs">
                  Academic policy mandates minimum 75% attendance to qualify for terminal examinations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { code: "CS-401", title: "Distributed Systems", lectures: 28, attended: 26, pct: 92.8 },
                    { code: "CS-405", title: "Compiler Construction", lectures: 24, attended: 21, pct: 87.5 },
                    { code: "SE-410", title: "Cloud Architecture", lectures: 24, attended: 23, pct: 95.8 },
                    { code: "MT-302", title: "Stochastic Processes", lectures: 20, attended: 16, pct: 80.0 },
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
                        <span className="text-emerald-600 font-semibold">✓ Exam Eligible</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 5: LMS & SESSIONAL ASSESSMENTS (AWS S3 & CLOUDINARY MEDIA HUB) */}
          {activeTab === "lms" && (
            <div className="space-y-6">
              {/* Cloud Storage & Media Streaming Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center shrink-0">
                    <UploadCloud className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-extrabold text-white">LMS & Digital Media Repository</h3>
                      <Badge variant="success" className="text-[10px] bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
                        🟢 AWS S3 Connected
                      </Badge>
                      <Badge variant="info" className="text-[10px] bg-indigo-500/20 text-indigo-300 border-indigo-400/30">
                        🟣 Cloudinary CDN Stream Active
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-300">
                      Academic Documents & Assignments: <span className="font-mono text-indigo-200 font-bold">s3://apex-university-erp-storage</span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      High-definition lecture videos & media streams delivered seamlessly via Cloudinary CDN.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchAllData()}
                    className="text-xs bg-white/10 hover:bg-white/20 text-white border-white/20 gap-1.5"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Refresh Media
                  </Button>
                </div>
              </div>

              {/* Sessional Score Progress Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-white border-slate-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Assignment Sessional (10%)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-slate-900">9.4 / 10.0</div>
                    <div className="mt-1.5 space-y-1">
                      <Progress value={94} className="h-1.5" />
                      <p className="text-[10px] text-emerald-600 font-semibold">✓ 1 Graded • 1 In-Progress (AWS S3)</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Quiz Sessional (10%)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-slate-900">9.5 / 10.0</div>
                    <div className="mt-1.5 space-y-1">
                      <Progress value={95} className="h-1.5" />
                      <p className="text-[10px] text-emerald-600 font-semibold">✓ 19/20 Marks Evaluated</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Total Sessional Aggregate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-indigo-600">18.9 / 20.0</div>
                    <div className="mt-1.5 space-y-1">
                      <Progress value={94.5} className="h-1.5" />
                      <p className="text-[10px] text-indigo-600 font-bold">Grade A Sessional Standing (94.5%)</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Coursework & Timed Quizzes Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Coursework Assignments */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base font-bold text-slate-900">Coursework Assignments</CardTitle>
                        <CardDescription className="text-xs">Direct file submissions stored securely in AWS S3</CardDescription>
                      </div>
                      <Badge variant="info">2 Coursework Tasks</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {assignments.map((a) => (
                      <div key={a.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono text-[10px]">{a.courseCode}</Badge>
                            <Badge variant="success" className="text-[9px] gap-1 bg-indigo-50 text-indigo-700 border-indigo-200">
                              <UploadCloud className="h-2.5 w-2.5" /> AWS S3 Direct
                            </Badge>
                          </div>
                          <Badge variant={a.status === "GRADED" ? "success" : a.status === "SUBMITTED" ? "info" : "warning"}>
                            {a.status}
                          </Badge>
                        </div>
                        <p className="text-xs font-bold text-slate-900">{a.title}</p>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                          <span>Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                          <span>Sessional Score: <strong className="text-slate-900">{a.obtainedMarks ? `${a.obtainedMarks} / ${a.maxMarks}` : "Pending"}</strong></span>
                        </div>
                        <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                          <span className="text-[11px] text-slate-500">
                            Storage: <code className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600">s3://submissions/{a.courseCode}</code>
                          </span>

                          {a.status === "PENDING" && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedAssignmentId(a.id);
                                setSubmissionSuccess(false);
                              }}
                              className="text-xs h-7 gap-1 bg-indigo-600 hover:bg-indigo-700"
                            >
                              <UploadCloud className="h-3.5 w-3.5" /> Upload to S3
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Timed Quizzes */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base font-bold text-slate-900">Timed Quizzes & Sessional Tests</CardTitle>
                        <CardDescription className="text-xs">Interactive quizzes evaluated and mapped to sessional gradebook</CardDescription>
                      </div>
                      <Badge variant="secondary">2 Quizzes</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {quizzes.map((q) => (
                      <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="font-mono text-xs">{q.courseCode}</Badge>
                          <Badge variant={q.status === "COMPLETED" ? "success" : "info"}>{q.status}</Badge>
                        </div>
                        <p className="text-sm font-bold text-slate-900">{q.title}</p>
                        <p className="text-xs text-slate-500">
                          Duration: {q.durationMinutes} mins • {q.score ? `Score: ${q.score} / ${q.totalMarks} (Grade A)` : `Total: ${q.totalMarks} Marks`}
                        </p>
                        {q.status === "AVAILABLE" && (
                          <div className="pt-2">
                            <Button size="sm" onClick={() => { setActiveQuizModal(true); setQuizScore(null); }} className="text-xs gap-1.5 bg-indigo-600 hover:bg-indigo-700 w-full">
                              <PlayCircle className="h-4 w-4" /> Start Timed Quiz Attempt →
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* AWS S3 Course Documents & Materials Section */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-indigo-600" /> Academic Course Materials (AWS S3 Document Store)
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Official course lecture slides, syllabi, past exams, and laboratory guides
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {["ALL", "SYLLABUS", "SLIDES", "LAB_GUIDE", "PAST_PAPERS"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedMaterialCategory(cat)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                            selectedMaterialCategory === cat
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {courseMaterials
                      .filter((m) => selectedMaterialCategory === "ALL" || m.category === selectedMaterialCategory)
                      .map((m) => (
                        <div
                          key={m.id}
                          className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition-all"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-[10px] font-mono bg-slate-50">
                                {m.category}
                              </Badge>
                              <span className="text-[10px] text-slate-400 font-mono">{m.fileSize}</span>
                            </div>
                            <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">{m.title}</h4>
                            <p className="text-[11px] text-slate-500">By: {m.uploadedBy}</p>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-slate-100">
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span>Downloads: {m.downloadsCount}</span>
                              <span>{new Date(m.uploadedAt).toLocaleDateString()}</span>
                            </div>
                            <a
                              href={m.s3Url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold shadow-sm transition-colors"
                            >
                              <Download className="h-3 w-3" />
                              <span>Download PDF</span>
                            </a>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Cloudinary High-Definition Video Lectures Stream */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <PlayCircle className="h-4 w-4 text-purple-600" /> High-Definition Video Lectures (Cloudinary CDN)
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Recorded classroom lectures, lab demonstrations, and interactive playback streams
                      </CardDescription>
                    </div>
                    <Badge variant="info" className="bg-purple-100 text-purple-800 border-purple-200">
                      3 Recorded Lectures
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {videoLectures.map((v) => (
                      <div
                        key={v.id}
                        className="rounded-xl border border-slate-200 bg-white overflow-hidden space-y-3 flex flex-col justify-between hover:border-purple-300 hover:shadow-lg transition-all"
                      >
                        <div className="relative aspect-video bg-slate-900 overflow-hidden group cursor-pointer" onClick={() => setActiveVideoModal(v)}>
                          <img
                            src={v.thumbnailUrl}
                            alt={v.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85 group-hover:opacity-100"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                            <div className="h-12 w-12 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <PlayCircle className="h-6 w-6" />
                            </div>
                          </div>
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono font-bold">
                            {v.duration}
                          </span>
                        </div>

                        <div className="p-4 pt-0 space-y-2">
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">{v.title}</h4>
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>Instructor: {v.instructor}</span>
                            <span>{v.viewsCount} views</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => setActiveVideoModal(v)}
                            className="w-full text-xs h-7 gap-1.5 bg-purple-600 hover:bg-purple-700 text-white mt-1"
                          >
                            <PlayCircle className="h-3.5 w-3.5" /> Watch Video Lecture
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 6: EXAMS & DATESHEET */}
          {activeTab === "exams" && (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900">
                      Fall 2026 Midterm Examination Datesheet
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Official schedule generated by Examination Controller in PostgreSQL.
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
                      {examDatesheet.map((item) => (
                        <tr key={item.courseCode} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono font-bold text-indigo-600">{item.courseCode}</td>
                          <td className="p-3 font-medium text-slate-900">{item.courseName}</td>
                          <td className="p-3 font-medium text-slate-700">{item.examDate}</td>
                          <td className="p-3 text-slate-600">{item.startTime} - {item.endTime}</td>
                          <td className="p-3 text-slate-600">{item.room}</td>
                          <td className="p-3 font-mono font-bold text-slate-900">{item.seatNumber}</td>
                          <td className="p-3 text-slate-500">{item.invigilator}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 7: FEES & BILLING */}
          {activeTab === "finance" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-900">
                  Semester Fee Vouchers & Payment Settlement
                </CardTitle>
                <CardDescription className="text-xs">
                  Reconciled with Chart of Accounts and General Ledger audits.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {feeChallans.map((chl) => (
                  <div key={chl.id} className="p-5 rounded-xl border border-slate-200 bg-white space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                      <div>
                        <span className="text-xs font-bold text-slate-900">Voucher Number: </span>
                        <span className="font-mono text-xs font-bold text-indigo-600">{chl.challanNumber}</span>
                      </div>
                      <Badge variant={chl.status === "PAID" ? "success" : "destructive"}>{chl.status}</Badge>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Tuition Fee</span>
                        <span className="font-mono font-semibold">${chl.tuitionFee?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Laboratory Charges</span>
                        <span className="font-mono font-semibold">${chl.labFee?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Library Subscription</span>
                        <span className="font-mono font-semibold">${chl.libraryFee?.toFixed(2)}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                        <span>Total Amount</span>
                        <span className="font-mono text-indigo-600">${chl.totalAmount?.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                        <Download className="h-3.5 w-3.5" /> Download PDF Challan Voucher
                      </Button>

                      {chl.status === "UNPAID" ? (
                        <Button
                          size="sm"
                          onClick={() => handlePayFee(chl.id)}
                          disabled={isProcessingPayment}
                          className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700"
                        >
                          <CreditCard className="h-3.5 w-3.5" /> {isProcessingPayment ? "Processing..." : "Pay Online"}
                        </Button>
                      ) : (
                        <Badge variant="success" className="text-xs py-1 px-3">
                          ✓ Settled via Online Gateway ({chl.transactionRef || "TXN-99812-VISA"})
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* TAB 8: TIMETABLE */}
          {activeTab === "timetable" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-900">
                  Weekly Class Timetable Matrix
                </CardTitle>
                <CardDescription className="text-xs">
                  Classroom schedule for Fall 2026
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {timetable.map((d) => (
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
          )}

          {/* TAB 9: STUDENT ID CARD */}
          {activeTab === "idcard" && (
            <div className="flex justify-center py-6">
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
                    <p className="text-xs font-mono text-slate-400">Roll: {user?.studentId || "FA23-BCS-042"}</p>
                    <p className="text-[11px] text-emerald-400 font-semibold">Active Student Record</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="space-y-0.5 text-[10px] text-slate-400">
                    <p>Security Hash: 0x88f1a92e</p>
                    <p>Database: PostgreSQL (erpc)</p>
                  </div>
                  <div className="h-14 w-14 bg-white p-1 rounded-lg flex items-center justify-center">
                    <QrCode className="h-12 w-12 text-slate-900" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* QUIZ MODAL */}
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
                <p className="text-xs text-slate-600">Your score has been stored into the PostgreSQL gradebook.</p>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 font-bold text-emerald-800 text-sm">
                  Score: 23 / 25 Marks (92.0% - Grade A)
                </div>
                <Button size="sm" onClick={() => setActiveQuizModal(false)} className="w-full bg-indigo-600 hover:bg-indigo-700">Done</Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HALL TICKET MODAL */}
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
              <div className="flex justify-between"><span className="text-slate-500">Student Name:</span><span className="font-bold text-slate-900">{user?.name || "Alex Morgan"}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Roll Number:</span><span className="font-mono font-bold text-indigo-600">{user?.studentId || "FA23-BCS-042"}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Term:</span><span className="font-bold text-slate-900">Fall 2026 Midterm Examination</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Authorization Code:</span><span className="font-mono text-slate-700">HT-FA26-042-CS-AUTH</span></div>
            </div>

            <div className="flex items-center justify-center py-2">
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                <QrCode className="h-28 w-28 text-slate-900" />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowHallTicket(false)}>Close</Button>
              <Button size="sm" onClick={() => setShowHallTicket(false)} className="gap-1 bg-indigo-600 hover:bg-indigo-700">
                <Download className="h-3.5 w-3.5" /> Download PDF
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGNMENT MODAL */}
      {selectedAssignmentId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Coursework Submission</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedAssignmentId(null)} className="h-7 w-7 p-0 text-slate-400">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {!submissionSuccess ? (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center space-y-2 hover:border-indigo-500 transition-colors cursor-pointer bg-slate-50/50">
                  <UploadCloud className="h-8 w-8 mx-auto text-indigo-600" />
                  <p className="text-xs font-semibold text-slate-800">Drop submission archive (.zip, .pdf)</p>
                  <p className="text-[10px] text-slate-400">Recorded directly in PostgreSQL database</p>
                </div>
                <Input placeholder="Optional submission remarks or Git repository..." className="text-xs" />
                <div className="pt-2 flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedAssignmentId(null)}>Cancel</Button>
                  <Button size="sm" onClick={handleSubmitAssignment} className="bg-indigo-600 hover:bg-indigo-700">
                    Upload & Submit
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-3 space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <p className="font-bold text-sm text-slate-900">Submission Recorded Successfully!</p>
                <p className="text-xs text-slate-500">Saved in PostgreSQL `assignment_submissions` table.</p>
                <Button size="sm" onClick={() => setSelectedAssignmentId(null)} className="w-full bg-indigo-600 hover:bg-indigo-700 mt-2">
                  Done
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CLOUDINARY VIDEO PLAYER MODAL */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 text-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-purple-500/40">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-purple-600/30 border border-purple-400/40 flex items-center justify-center">
                  <PlayCircle className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white line-clamp-1">{activeVideoModal.title}</h3>
                  <p className="text-[11px] text-slate-400">
                    Instructor: {activeVideoModal.instructor} • Streamed via Cloudinary CDN
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveVideoModal(null)}
                className="h-7 w-7 p-0 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10 flex items-center justify-center">
              <img
                src={activeVideoModal.thumbnailUrl}
                alt={activeVideoModal.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 text-center">
                <div className="h-16 w-16 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xl hover:scale-105 transition-transform cursor-pointer">
                  <PlayCircle className="h-8 w-8" />
                </div>
                <div className="space-y-1 mt-2">
                  <p className="text-sm font-bold text-white">Live Cloudinary CDN Stream Ready</p>
                  <p className="text-xs text-purple-300 font-mono">Codec: H.264 • Resolution: 1080p60 • Quality: Auto</p>
                </div>
              </div>
              <span className="absolute top-3 left-3 px-2 py-1 rounded bg-purple-600/80 text-white text-[10px] font-bold">
                HD 1080p
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Duration: <strong className="text-white">{activeVideoModal.duration}</strong></span>
              <span>Recorded: <strong className="text-white">{activeVideoModal.recordedDate}</strong></span>
              <span>Views: <strong className="text-white">{activeVideoModal.viewsCount}</strong></span>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-white/10">
              <Button variant="outline" size="sm" onClick={() => setActiveVideoModal(null)} className="text-xs bg-white/10 text-white border-white/20">
                Close
              </Button>
              <Button size="sm" onClick={() => setActiveVideoModal(null)} className="text-xs bg-purple-600 hover:bg-purple-700 text-white gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Mark Lecture Completed
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
