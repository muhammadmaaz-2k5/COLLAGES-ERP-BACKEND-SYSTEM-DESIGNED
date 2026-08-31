"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AdmissionsAPI, type MeritListResponse, type MeritListCandidate } from "@/lib/admissions-client";
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
  GraduationCap,
  Award,
  Search,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Users,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function PublicMeritListsPage() {
  const [selectedProgram, setSelectedProgram] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [meritLists, setMeritLists] = useState<MeritListResponse[]>([
    {
      id: "ml_cs_01",
      programId: "prog_cs",
      programCode: "BSCS",
      programTitle: "Bachelor of Science in Computer Science",
      termName: "Fall 2026",
      listRound: 1,
      listTitle: "1st Merit List (Open Merit)",
      publishedAt: "2026-08-30T10:00:00Z",
      feeDeadline: "2026-09-05",
      totalSeats: 120,
      selectedCount: 5,
      closingAggregate: 86.85,
      candidates: [
        {
          rank: 1,
          trackingId: "ADM-2026-5521",
          rollNo: "ET-2026-5521",
          candidateName: "Ayesha Malik",
          fatherName: "Tariq Malik",
          matricPercentage: 94.5,
          interPercentage: 93.0,
          academicScore: 93.45,
          entryTestScore: 95.0,
          finalAggregate: 94.23,
          status: "SELECTED",
        },
        {
          rank: 2,
          trackingId: "ADM-2026-2245",
          rollNo: "ET-2026-2245",
          candidateName: "Fatima Noor",
          fatherName: "Noor Ahmed",
          matricPercentage: 93.0,
          interPercentage: 91.5,
          academicScore: 91.95,
          entryTestScore: 90.0,
          finalAggregate: 90.98,
          status: "SELECTED",
        },
        {
          rank: 3,
          trackingId: "ADM-2026-8491",
          rollNo: "ET-2026-0491",
          candidateName: "Muhammad Hamza",
          fatherName: "Tariq Mahmood",
          matricPercentage: 92.7,
          interPercentage: 91.3,
          academicScore: 91.72,
          entryTestScore: 88.0,
          finalAggregate: 89.86,
          status: "SELECTED",
        },
        {
          rank: 4,
          trackingId: "ADM-2026-3419",
          rollNo: "ET-2026-3419",
          candidateName: "Bilal Hassan",
          fatherName: "Hassan Raza",
          matricPercentage: 88.0,
          interPercentage: 86.5,
          academicScore: 86.95,
          entryTestScore: 82.0,
          finalAggregate: 84.48,
          status: "WAITING_LIST",
        },
      ],
    },
  ]);

  const fetchMeritLists = useCallback(async () => {
    setLoading(true);
    try {
      const res = await AdmissionsAPI.getPublicMeritLists(selectedProgram);
      if (res.data && res.data.length > 0) setMeritLists(res.data);
    } catch {
      // Fallback data retained
    } finally {
      setLoading(false);
    }
  }, [selectedProgram]);

  useEffect(() => {
    fetchMeritLists();
  }, [fetchMeritLists]);

  const activeList = meritLists[0];

  const filteredCandidates = activeList?.candidates.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.candidateName.toLowerCase().includes(q) ||
      c.trackingId.toLowerCase().includes(q) ||
      c.rollNo.toLowerCase().includes(q)
    );
  }) || [];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-600 flex items-center justify-center font-black text-white shadow-lg shadow-amber-600/30">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
              APEX UNIVERSITY <Badge variant="info" className="text-[9px] bg-amber-500/20 text-amber-300">MERIT LISTS</Badge>
            </h1>
            <p className="text-[10px] text-slate-400">Official Undergraduate Selection & Cutoff Rosters</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/admissions/apply"
            className="text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 px-3 py-1.5 rounded-lg shadow-md shadow-amber-600/30 flex items-center gap-1.5"
          >
            <span>Apply Now</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* HERO BANNER */}
      <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-orange-950 text-white shadow-xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">Fall 2026 Official Merit Lists</h2>
              <Badge variant="success" className="text-[10px] bg-emerald-500/20 text-emerald-300">
                50/50 Weightage Formula
              </Badge>
            </div>
            <p className="text-xs text-amber-200">
              {"Final Aggregate = 0.50 × (0.30 × Matric + 0.70 × Inter) + 0.50 × Entry Test"}
            </p>
            <p className="text-[11px] text-slate-400">
              Selected candidates must deposit admission dues before the fee deadline to secure their seat allocation.
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => window.print()}
            className="bg-amber-600 hover:bg-amber-700 text-xs font-bold gap-1.5 shadow-md shrink-0"
          >
            <Printer className="h-3.5 w-3.5" /> Print Official List
          </Button>
        </div>

        {/* METRICS & DEADLINE */}
        {activeList && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-slate-950/80 border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Degree Program
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-black text-amber-400">{activeList.programCode}</div>
                <p className="text-[11px] text-slate-300 truncate">{activeList.programTitle}</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-950/80 border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Closing Aggregate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-emerald-400">{activeList.closingAggregate}%</div>
                <p className="text-[11px] text-emerald-300 mt-0.5">Cutoff for {activeList.listTitle}</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-950/80 border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Seat Quota
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-white">{activeList.selectedCount} / {activeList.totalSeats}</div>
                <p className="text-[11px] text-indigo-400 mt-0.5">Allocated seats</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-950/80 border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Fee Payment Deadline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-black text-rose-400">{activeList.feeDeadline}</div>
                <p className="text-[11px] text-slate-400 mt-0.5">Strict bank clearance date</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* PROGRAM SELECTOR & SEARCH FILTER */}
        <Card className="bg-slate-950/80 border-slate-800 shadow-2xl">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="ALL">All Degree Programs</option>
                  <option value="prog_cs">BS Computer Science (BSCS)</option>
                  <option value="prog_ai">BS Artificial Intelligence (BSAI)</option>
                  <option value="prog_se">BS Software Engineering (BSSE)</option>
                </select>
              </div>

              <div className="w-full sm:w-72">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search candidate name or tracking ID..."
                  className="bg-slate-900 border-slate-700 text-white text-xs h-8"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* CANDIDATES MERIT TABLE */}
            <div className="rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Tracking ID</th>
                    <th className="p-3">Candidate Name</th>
                    <th className="p-3">Father Name</th>
                    <th className="p-3 text-center">Matric %</th>
                    <th className="p-3 text-center">Inter %</th>
                    <th className="p-3 text-center">Entry Test</th>
                    <th className="p-3 text-center font-bold text-amber-400">Final Aggregate</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                  {filteredCandidates.map((c) => (
                    <tr key={c.trackingId} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3 font-mono font-black text-amber-400">#{c.rank}</td>
                      <td className="p-3 font-mono text-slate-300">{c.trackingId}</td>
                      <td className="p-3 font-bold text-white">{c.candidateName}</td>
                      <td className="p-3 text-slate-400">{c.fatherName}</td>
                      <td className="p-3 text-center font-mono text-slate-300">{c.matricPercentage}%</td>
                      <td className="p-3 text-center font-mono text-slate-300">{c.interPercentage}%</td>
                      <td className="p-3 text-center font-mono font-bold text-indigo-400">{c.entryTestScore} / 100</td>
                      <td className="p-3 text-center font-mono font-black text-emerald-400 text-sm">{c.finalAggregate}%</td>
                      <td className="p-3 text-right">
                        <Badge
                          variant={c.status === "SELECTED" ? "success" : "warning"}
                          className="text-[10px]"
                        >
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
      </main>
    </div>
  );
}
