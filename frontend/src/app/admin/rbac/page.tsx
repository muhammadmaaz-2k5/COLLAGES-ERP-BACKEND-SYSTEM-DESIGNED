"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuthStore, type SystemRole, DEMO_ROLE_ACCOUNTS } from "@/store/use-auth-store";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShieldCheck,
  Search,
  ChevronLeft,
  KeyRound,
} from "lucide-react";

const INITIAL_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "TEACHER",
  "STUDENT",
  "ACCOUNTANT",
  "LIBRARIAN",
  "HR_MANAGER",
  "WARDEN",
  "DRIVER",
  "ADMISSIONS_OFFICER",
  "EXAM_CONTROLLER",
  "STAFF",
];

const PERMISSIONS_LIST = [
  { code: "SYSTEM.SETTINGS.MANAGE", module: "SYSTEM", desc: "Manage global institutional settings" },
  { code: "SYSTEM.RBAC.MANAGE", module: "SYSTEM", desc: "Manage roles, permissions and assignments" },
  { code: "SYSTEM.AUDIT.VIEW", module: "SYSTEM", desc: "View immutable audit logs" },
  { code: "USER.ACCOUNT.MANAGE", module: "IAM", desc: "Create, deactivate, and reset user credentials" },
  { code: "ACADEMICS.PROGRAM.MANAGE", module: "ACADEMICS", desc: "Create degree programs and curricular roadmaps" },
  { code: "ACADEMICS.COURSE.MANAGE", module: "ACADEMICS", desc: "Manage course catalog and prerequisite DAGs" },
  { code: "ACADEMICS.OFFERING.SCHEDULE", module: "ACADEMICS", desc: "Schedule semester course offerings and room matrix" },
  { code: "LMS.COURSEWORK.SUBMIT", module: "LMS", desc: "Submit assignments and attempt timed quizzes" },
  { code: "LMS.ASSIGNMENT.MANAGE", module: "LMS", desc: "Publish assignments and evaluate student submissions" },
  { code: "LMS.QUIZ.MANAGE", module: "LMS", desc: "Create question banks and evaluate attempts" },
  { code: "LMS.ATTENDANCE.MARK", module: "LMS", desc: "Mark student daily lecture attendance" },
  { code: "EXAM.TERM.MANAGE", module: "EXAMINATION", desc: "Configure examination terms and datesheets" },
  { code: "EXAM.INVIGILATOR.ASSIGN", module: "EXAMINATION", desc: "Assign faculty and staff invigilators" },
  { code: "GRADE.SUBMIT_DRAFT", module: "EXAMINATION", desc: "Teachers submit provisional grades" },
  { code: "GRADE.APPROVE_FINAL", module: "EXAMINATION", desc: "Approve, lock, and publish official result cards" },
  { code: "TRANSCRIPT.GENERATE", module: "EXAMINATION", desc: "Generate official grade transcripts and recalculate CGPA" },
  { code: "FINANCE.STRUCTURE.MANAGE", module: "FINANCE", desc: "Configure program fee structures and templates" },
  { code: "FINANCE.CHALLAN.GENERATE", module: "FINANCE", desc: "Generate batch or student fee challan vouchers" },
  { code: "FINANCE.PAYMENT.VERIFY", module: "FINANCE", desc: "Verify bank receipts and approve payment transactions" },
  { code: "FINANCE.LEDGER.MANAGE", module: "FINANCE", desc: "Manage Chart of Accounts and General Ledger audits" },
  { code: "ADMISSIONS.APPLICATION.REVIEW", module: "ADMISSIONS", desc: "Screen candidate applications and documents" },
  { code: "ADMISSIONS.MERIT.PUBLISH", module: "ADMISSIONS", desc: "Calculate aggregate scores and publish merit lists" },
  { code: "HR.EMPLOYEE.MANAGE", module: "HR", desc: "Onboard employees, manage contracts and salary structures" },
  { code: "HR.LEAVE.APPROVE", module: "HR", desc: "Approve or reject employee leave requests" },
  { code: "LIBRARY.CIRCULATION.MANAGE", module: "LIBRARY", desc: "Issue, return, and renew library book copies" },
  { code: "HOSTEL.ALLOCATION.MANAGE", module: "HOSTEL", desc: "Allocate student hostel rooms and dorm beds" },
  { code: "TRANSPORT.ROUTE.MANAGE", module: "TRANSPORT", desc: "Manage vehicle fleet, routes, stops, and bus passes" },
];

const DEFAULT_MATRIX: Record<string, string[]> = {
  SUPER_ADMIN: PERMISSIONS_LIST.map((p) => p.code),
  ADMIN: [
    "USER.ACCOUNT.MANAGE",
    "ACADEMICS.PROGRAM.MANAGE",
    "ACADEMICS.COURSE.MANAGE",
    "ACADEMICS.OFFERING.SCHEDULE",
    "TRANSCRIPT.GENERATE",
    "ADMISSIONS.APPLICATION.REVIEW",
    "ADMISSIONS.MERIT.PUBLISH",
    "HR.LEAVE.APPROVE",
    "TRANSPORT.ROUTE.MANAGE",
  ],
  TEACHER: [
    "LMS.ASSIGNMENT.MANAGE",
    "LMS.QUIZ.MANAGE",
    "LMS.ATTENDANCE.MARK",
    "GRADE.SUBMIT_DRAFT",
  ],
  STUDENT: [
    "LMS.COURSEWORK.SUBMIT",
  ],
  EXAM_CONTROLLER: [
    "EXAM.TERM.MANAGE",
    "EXAM.INVIGILATOR.ASSIGN",
    "GRADE.APPROVE_FINAL",
    "TRANSCRIPT.GENERATE",
  ],
  ACCOUNTANT: [
    "FINANCE.STRUCTURE.MANAGE",
    "FINANCE.CHALLAN.GENERATE",
    "FINANCE.PAYMENT.VERIFY",
    "FINANCE.LEDGER.MANAGE",
  ],
  HR_MANAGER: [
    "HR.EMPLOYEE.MANAGE",
    "HR.LEAVE.APPROVE",
  ],
  ADMISSIONS_OFFICER: [
    "ADMISSIONS.APPLICATION.REVIEW",
    "ADMISSIONS.MERIT.PUBLISH",
  ],
  LIBRARIAN: [
    "LIBRARY.CIRCULATION.MANAGE",
  ],
  WARDEN: [
    "HOSTEL.ALLOCATION.MANAGE",
  ],
  DRIVER: [
    "TRANSPORT.ROUTE.MANAGE",
  ],
  STAFF: [],
};

const SAMPLE_AUDIT_LOGS = [
  { id: "aud_01", timestamp: "2026-08-26 22:50:12", user: "superadmin@university.edu", action: "RBAC.PERMISSION_GRANTED", target: "TEACHER -> LMS.QUIZ.MANAGE", ip: "192.168.1.10" },
  { id: "aud_02", timestamp: "2026-08-26 22:45:00", user: "admin@university.edu", action: "USER.ROLE_ASSIGNED", target: "Alex Morgan -> STUDENT", ip: "192.168.1.15" },
  { id: "aud_03", timestamp: "2026-08-26 22:30:19", user: "examcontroller@university.edu", action: "GRADE.LOCK_APPROVED", target: "CS-401 FA26 Result Card", ip: "192.168.1.22" },
  { id: "aud_04", timestamp: "2026-08-26 22:15:40", user: "accountant@university.edu", action: "FINANCE.CHALLAN_GENERATED", target: "CHL-2026-88192", ip: "192.168.1.08" },
];

export default function RBACManagementPage() {
  const { user } = useAuthStore();
  const [matrix, setMatrix] = useState<Record<string, string[]>>(DEFAULT_MATRIX);
  const [filterModule, setFilterModule] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const togglePermission = (role: string, permCode: string) => {
    if (role === "SUPER_ADMIN") return; // Super admin always has full capabilities
    setMatrix((prev) => {
      const current = prev[role] || [];
      const exists = current.includes(permCode);
      const updated = exists ? current.filter((c) => c !== permCode) : [...current, permCode];
      return { ...prev, [role]: updated };
    });
  };

  const filteredPermissions = PERMISSIONS_LIST.filter((p) => {
    const matchesModule = filterModule === "ALL" || p.module === filterModule;
    const matchesSearch = p.code.toLowerCase().includes(searchTerm.toLowerCase()) || p.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesModule && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 pb-16">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-600">
                <ChevronLeft className="h-4 w-4" /> Home
              </Button>
            </Link>
            <div className="h-5 w-px bg-slate-200" />
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm">RBAC & Security Console</span>
                <p className="text-[11px] text-slate-500">12 Roles • Granular Permission Matrix</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RoleSwitcher />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto px-4 sm:px-8 pt-8 space-y-6 max-w-7xl">
        {/* Active Role Notice */}
        <div className="rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">Current Session Persona:</span>
                <Badge variant="default" className="text-xs font-mono">
                  {user?.role}
                </Badge>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Logged in as <span className="font-semibold">{user?.name}</span> ({user?.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={user?.role === "SUPER_ADMIN" ? "success" : "secondary"} className="text-xs">
              {user?.role === "SUPER_ADMIN" ? "Full Matrix Super-Admin Access" : "Scoped Role Permissions"}
            </Badge>
          </div>
        </div>

        {/* Tabs for RBAC features */}
        <Tabs defaultValue="matrix" className="space-y-6">
          <TabsList className="bg-slate-100/80 p-1 border border-slate-200/80 rounded-xl">
            <TabsTrigger value="matrix" className="text-xs font-semibold px-4 py-2">
              🛡️ Role-Permission Matrix
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs font-semibold px-4 py-2">
              👥 12 Persona Accounts
            </TabsTrigger>
            <TabsTrigger value="audit" className="text-xs font-semibold px-4 py-2">
              📜 Security Audit Logs
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: ROLE-PERMISSION MATRIX */}
          <TabsContent value="matrix" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900">
                      Live Granular Role-Permission Matrix
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Click any checkbox to grant or revoke capabilities in real-time. Changes trigger audit records.
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search permissions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs w-56 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <select
                      value={filterModule}
                      onChange={(e) => setFilterModule(e.target.value)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="ALL">All Modules</option>
                      <option value="SYSTEM">System</option>
                      <option value="ACADEMICS">Academics</option>
                      <option value="LMS">LMS</option>
                      <option value="EXAMINATION">Examinations</option>
                      <option value="FINANCE">Finance</option>
                      <option value="HR">HR</option>
                      <option value="ADMISSIONS">Admissions</option>
                      <option value="LIBRARY">Library</option>
                      <option value="HOSTEL">Hostel</option>
                      <option value="TRANSPORT">Transport</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-slate-200 overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse min-w-[900px]">
                    <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="p-3 w-64 border-r border-slate-200">Permission Code & Description</th>
                        {INITIAL_ROLES.map((role) => (
                          <th key={role} className="p-2 text-center border-r border-slate-200 last:border-r-0">
                            <span className="text-[10px] font-mono font-bold block">{role}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredPermissions.map((perm) => (
                        <tr key={perm.code} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3 border-r border-slate-200 bg-white">
                            <p className="font-mono font-bold text-slate-900 text-[11px]">{perm.code}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{perm.desc}</p>
                          </td>
                          {INITIAL_ROLES.map((role) => {
                            const isGranted = (matrix[role] || []).includes(perm.code) || role === "SUPER_ADMIN";
                            return (
                              <td key={role} className="p-2 text-center border-r border-slate-200 last:border-r-0">
                                <input
                                  type="checkbox"
                                  checked={isGranted}
                                  disabled={role === "SUPER_ADMIN"}
                                  onChange={() => togglePermission(role, perm.code)}
                                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: PERSONA ACCOUNTS */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-900">
                  Pre-Configured Demo Accounts (12 Standard Roles)
                </CardTitle>
                <CardDescription className="text-xs">
                  All accounts are seeded in the database with password <code className="font-mono text-indigo-600">Password123!</code>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(DEMO_ROLE_ACCOUNTS).map(([role, acc]) => (
                    <div
                      key={role}
                      className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-sm hover:border-indigo-300 transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="font-mono text-[10px] font-bold">
                          {role}
                        </Badge>
                        {user?.role === role && (
                          <Badge variant="success" className="text-[10px]">
                            Active
                          </Badge>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{acc.name}</p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{acc.email}</p>
                      </div>
                      <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                        <span>Identifier: {acc.studentId || acc.employeeId || acc.id}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => useAuthStore.getState().switchRole(role as SystemRole)}
                          className="text-xs text-indigo-600 hover:text-indigo-700 h-7 px-2"
                        >
                          Switch to Role →
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: AUDIT LOGS */}
          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900">
                      Security & State Mutation Audit Trail
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Immutable WORM compliance logs capturing user identity, IP address, and operation parameters.
                    </CardDescription>
                  </div>
                  <Badge variant="info">Live Stream Connected</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">User Principal</th>
                        <th className="p-3">Action Code</th>
                        <th className="p-3">Target Entity</th>
                        <th className="p-3">Client IP</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {SAMPLE_AUDIT_LOGS.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono text-slate-500">{log.timestamp}</td>
                          <td className="p-3 font-medium text-slate-900">{log.user}</td>
                          <td className="p-3">
                            <Badge variant="outline" className="font-mono text-[10px]">
                              {log.action}
                            </Badge>
                          </td>
                          <td className="p-3 text-slate-700 font-mono">{log.target}</td>
                          <td className="p-3 font-mono text-slate-500">{log.ip}</td>
                          <td className="p-3">
                            <Badge variant="success">Recorded</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
