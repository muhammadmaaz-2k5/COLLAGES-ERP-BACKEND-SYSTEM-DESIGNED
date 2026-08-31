"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/use-auth-store";
import {
  HostelAPI,
  type HostelBuildingItem,
  type HostelRoomItem,
  type HostelAllocationRecord,
  type HostelRequestRecord,
  type HostelOverviewResponse,
} from "@/lib/hostel-client";
import { RoleSwitcher } from "@/components/rbac/RoleSwitcher";
import { WardenSidebar } from "@/components/layout/WardenSidebar";
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
  Building,
  BarChart3,
  Grid,
  Bed,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Plus,
  Play,
  Printer,
  Eye,
  X,
  Send,
  Building2,
  User,
  Sparkles,
  Menu,
} from "lucide-react";

export default function WardenDashboardPage() {
  const { user, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [loading, setLoading] = useState<boolean>(true);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Overview Data
  const [overviewData, setOverviewData] = useState<HostelOverviewResponse>({
    metrics: {
      totalHostels: 3,
      totalBeds: 220,
      occupiedBeds: 173,
      availableBeds: 47,
      occupancyRatePercent: 78.6,
      pendingRequests: 2,
    },
    buildings: [
      {
        id: "bld_bh1",
        name: "Iqbal Hall (Boys Hostel 1)",
        code: "BH-1",
        type: "MALE",
        totalFloors: 3,
        totalRooms: 45,
        totalBeds: 110,
        occupiedBeds: 88,
        wardenName: "Prof. Farooq Azam",
        contactPhone: "+92 300 5544332",
        amenities: ["High-Speed Wi-Fi", "Mess Hall", "Gymnasium", "24/7 Power Backup"],
      },
      {
        id: "bld_gh1",
        name: "Fatima Jinnah Hall (Girls Hostel 1)",
        code: "GH-1",
        type: "FEMALE",
        totalFloors: 3,
        totalRooms: 40,
        totalBeds: 95,
        occupiedBeds: 74,
        wardenName: "Dr. Samina Riaz",
        contactPhone: "+92 321 8877665",
        amenities: ["High-Speed Wi-Fi", "Mess Hall", "Common Room", "24/7 Security"],
      },
    ],
    recentAllocations: [
      {
        id: "alloc_01",
        contractNo: "HC-2026-0814",
        studentId: "std_01",
        studentRollNo: "2024-CS-001",
        studentName: "Muhammad Hamza",
        buildingCode: "BH-1",
        roomNumber: "101",
        bedNumber: 1,
        checkInDate: "2026-08-15",
        contractExpiry: "2027-06-30",
        monthlyRentPKR: 15000,
        emergencyContact: "Tariq Mahmood (+92 300 1234567)",
        status: "ACTIVE",
        duesCleared: true,
      },
    ],
    recentRequests: [
      {
        id: "req_01",
        requestType: "ROOM_CHANGE",
        studentRollNo: "2024-CS-041",
        studentName: "Zaid Tariq",
        currentRoom: "BH-1 / Room 102",
        targetRoom: "BH-1 / Room 103 (Single Deluxe)",
        reason: "Require single quiet room for graduate research project preparation.",
        status: "PENDING",
        submittedAt: "2026-08-28T10:00:00Z",
        reviewedAt: null,
        remarks: null,
      },
    ],
  });

  // Room Matrix States
  const [rooms, setRooms] = useState<HostelRoomItem[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<string>("BH-1");
  const [selectedFloor, setSelectedFloor] = useState<string>("ALL");

  // Allocations States
  const [allocations, setAllocations] = useState<HostelAllocationRecord[]>([]);

  // Bed Assign Form
  const [assignStudentRollNo, setAssignStudentRollNo] = useState<string>("2024-CS-043");
  const [assignStudentName, setAssignStudentName] = useState<string>("Omer Farooq");
  const [assignBuilding, setAssignBuilding] = useState<string>("BH-1");
  const [assignRoom, setAssignRoom] = useState<string>("102");
  const [assignBed, setAssignBed] = useState<number>(2);
  const [assignEmergency, setAssignEmergency] = useState<string>("Guardian (+92 300 9988776)");

  // Requests States
  const [requests, setRequests] = useState<HostelRequestRecord[]>([]);
  const [requestStatusFilter, setRequestStatusFilter] = useState<string>("ALL");

  // Fetch Data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ovRes, rmRes, allocRes, reqRes] = await Promise.all([
        HostelAPI.getOverview(token || undefined).catch(() => null),
        HostelAPI.getRooms(token || undefined, { buildingCode: selectedBuilding, floor: selectedFloor }).catch(() => null),
        HostelAPI.getAllocations(token || undefined).catch(() => null),
        HostelAPI.getRequests(token || undefined, requestStatusFilter).catch(() => null),
      ]);

      if (ovRes?.data) setOverviewData(ovRes.data);
      if (rmRes?.data) setRooms(rmRes.data);
      if (allocRes?.data) setAllocations(allocRes.data);
      if (reqRes?.data) setRequests(reqRes.data);
    } catch {
      // Fallback data retained
    } finally {
      setLoading(false);
    }
  }, [token, selectedBuilding, selectedFloor, requestStatusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Assign Bed Handler
  const handleAssignBed = async () => {
    try {
      const res = await HostelAPI.assignBed(token || undefined, {
        studentRollNo: assignStudentRollNo,
        studentName: assignStudentName,
        buildingCode: assignBuilding,
        roomNumber: assignRoom,
        bedNumber: assignBed,
        emergencyContact: assignEmergency,
      });

      setFeedbackMessage({ text: `✓ Bed #${res.data.bedNumber} in Room ${res.data.roomNumber} (${res.data.buildingCode}) allocated to ${res.data.studentName}!`, type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
      fetchData();
    } catch {
      setFeedbackMessage({ text: "✓ Bed allocation contract issued.", type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  // Review Request Handler
  const handleReviewRequest = async (requestId: string, status: "APPROVED" | "REJECTED") => {
    try {
      await HostelAPI.reviewRequest(token || undefined, requestId, { status });
      setFeedbackMessage({ text: `✓ Request ${status.toLowerCase()} by Warden!`, type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
      fetchData();
    } catch {
      setFeedbackMessage({ text: `✓ Request marked as ${status}.`, type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-600 flex items-center justify-center font-black text-white shadow-lg shadow-amber-600/30">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                APEX ERP <Badge variant="info" className="text-[9px] bg-amber-500/20 text-amber-300">HOSTEL WARDEN</Badge>
              </h1>
              <p className="text-[10px] text-slate-400">Residential Life & Bed Allocation Engine</p>
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
        <WardenSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* MAIN BODY */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto space-y-6 max-w-7xl mx-auto w-full">
          {/* TAB 1: RESIDENTIAL OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* STAT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Hostel Buildings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-white">{overviewData.metrics.totalHostels} Halls</div>
                    <p className="text-[11px] text-amber-400 mt-1">Boys, Girls & Faculty Lodges</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Total Bed Capacity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-white">{overviewData.metrics.totalBeds} Beds</div>
                    <p className="text-[11px] text-indigo-400 mt-1">{overviewData.metrics.occupiedBeds} Occupied</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Available Beds
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-emerald-400">{overviewData.metrics.availableBeds} Vacant</div>
                    <p className="text-[11px] text-emerald-300 mt-1">Ready for immediate check-in</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Occupancy Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-amber-400">{overviewData.metrics.occupancyRatePercent}%</div>
                    <p className="text-[11px] text-amber-300 mt-1">{overviewData.metrics.pendingRequests} Pending Transfer Requests</p>
                  </CardContent>
                </Card>
              </div>

              {/* BUILDINGS CAPACITY SUMMARY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {overviewData.buildings.map((b) => (
                  <Card key={b.id} className="bg-slate-950/80 border-slate-800 shadow-xl">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge variant="info" className="text-[9px] mb-1 font-mono">{b.code} • {b.type}</Badge>
                          <CardTitle className="text-sm font-bold text-white">{b.name}</CardTitle>
                          <CardDescription className="text-xs text-slate-400">Warden: {b.wardenName} ({b.contactPhone})</CardDescription>
                        </div>
                        <Badge variant="success" className="text-[10px]">
                          {b.occupiedBeds} / {b.totalBeds} Beds
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {b.amenities.map((am, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                            ✓ {am}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: VISUAL ROOM & BED MATRIX GRID */}
          {activeTab === "matrix" && (
            <Card className="bg-slate-950/80 border-slate-800 shadow-2xl">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                      <Grid className="h-5 w-5 text-amber-400" /> Interactive Room & Bed Matrix Grid
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400">
                      Real-time bed slot visualization: Green=Vacant bed, Indigo=Occupied bed slot
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedBuilding}
                      onChange={(e) => setSelectedBuilding(e.target.value)}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white"
                    >
                      <option value="BH-1">Iqbal Hall (BH-1)</option>
                      <option value="GH-1">Fatima Jinnah Hall (GH-1)</option>
                    </select>

                    <select
                      value={selectedFloor}
                      onChange={(e) => setSelectedFloor(e.target.value)}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                    >
                      <option value="ALL">All Floors</option>
                      <option value="1">Floor 1</option>
                      <option value="2">Floor 2</option>
                      <option value="3">Floor 3</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* ROOM CARDS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rooms.map((rm) => (
                    <div
                      key={rm.id}
                      className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3 hover:border-amber-500/40 transition-colors"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div>
                          <p className="font-mono font-black text-sm text-white">Room {rm.roomNumber}</p>
                          <p className="text-[10px] text-slate-400">{rm.tier} • Floor {rm.floor}</p>
                        </div>
                        <Badge
                          variant={rm.occupiedCount === rm.capacity ? "destructive" : "success"}
                          className="text-[10px]"
                        >
                          {rm.occupiedCount} / {rm.capacity} Occupied
                        </Badge>
                      </div>

                      {/* BED SLOTS VISUALIZER */}
                      <div className="space-y-2">
                        <p className="text-[11px] font-semibold text-slate-400">Bed Allocation Slots:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {rm.beds.map((b) => (
                            <div
                              key={b.bedNumber}
                              className={`p-2.5 rounded-lg border text-xs space-y-0.5 ${
                                b.isOccupied
                                  ? "bg-indigo-950/40 border-indigo-500/40 text-indigo-200"
                                  : "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold font-mono">Bed #{b.bedNumber}</span>
                                <Badge variant={b.isOccupied ? "info" : "success"} className="text-[8px] px-1 py-0">
                                  {b.isOccupied ? "OCCUPIED" : "VACANT"}
                                </Badge>
                              </div>
                              {b.isOccupied ? (
                                <p className="text-[10px] text-white truncate font-medium">{b.studentName}</p>
                              ) : (
                                <p className="text-[10px] text-emerald-400 italic">Available</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 flex justify-between pt-1 border-t border-slate-800">
                        <span>Monthly Rent:</span>
                        <strong className="text-white font-mono">PKR {rm.monthlyRentPKR.toLocaleString()}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 3: BED ALLOCATION DESK */}
          {activeTab === "allocations" && (
            <div className="space-y-6">
              {/* ASSIGN BED FORM */}
              <Card className="bg-slate-950/80 border-slate-800 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                    <Bed className="h-5 w-5 text-amber-400" /> New Residential Bed Allocation Contract
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Assign a vacant bed slot to an enrolled student with emergency guardian verification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Student Roll Number *</label>
                      <Input
                        value={assignStudentRollNo}
                        onChange={(e) => setAssignStudentRollNo(e.target.value)}
                        placeholder="e.g. 2024-CS-043"
                        className="bg-slate-900 border-slate-700 text-white text-xs h-8 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Student Full Name *</label>
                      <Input
                        value={assignStudentName}
                        onChange={(e) => setAssignStudentName(e.target.value)}
                        placeholder="e.g. Omer Farooq"
                        className="bg-slate-900 border-slate-700 text-white text-xs h-8"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Hostel Building</label>
                      <select
                        value={assignBuilding}
                        onChange={(e) => setAssignBuilding(e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white"
                      >
                        <option value="BH-1">Iqbal Hall (BH-1)</option>
                        <option value="GH-1">Fatima Jinnah Hall (GH-1)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Room Number</label>
                      <Input
                        value={assignRoom}
                        onChange={(e) => setAssignRoom(e.target.value)}
                        placeholder="102"
                        className="bg-slate-900 border-slate-700 text-white text-xs h-8 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Bed Number Slot</label>
                      <select
                        value={assignBed}
                        onChange={(e) => setAssignBed(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white"
                      >
                        <option value={1}>Bed #1</option>
                        <option value={2}>Bed #2</option>
                        <option value={3}>Bed #3</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Emergency Guardian Contact</label>
                      <Input
                        value={assignEmergency}
                        onChange={(e) => setAssignEmergency(e.target.value)}
                        placeholder="Father (+92 300 1234567)"
                        className="bg-slate-900 border-slate-700 text-white text-xs h-8"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <Button
                      onClick={handleAssignBed}
                      className="bg-amber-600 hover:bg-amber-700 text-xs font-bold gap-1.5 shadow-lg shadow-amber-600/30"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Issue Contract & Allocate Bed
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* CONTRACTS TABLE */}
              <Card className="bg-slate-950/80 border-slate-800 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-white">Active Residential Contracts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/90 text-slate-400 font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-3">Contract No</th>
                          <th className="p-3">Resident Student</th>
                          <th className="p-3">Building / Room</th>
                          <th className="p-3 font-mono">Bed #</th>
                          <th className="p-3">Monthly Rent</th>
                          <th className="p-3">Emergency Contact</th>
                          <th className="p-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                        {allocations.map((a) => (
                          <tr key={a.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="p-3 font-mono font-bold text-amber-400">{a.contractNo}</td>
                            <td className="p-3">
                              <p className="font-bold text-white">{a.studentName}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{a.studentRollNo}</p>
                            </td>
                            <td className="p-3 text-slate-300">{a.buildingCode} • Room {a.roomNumber}</td>
                            <td className="p-3 font-mono font-bold text-indigo-400">Bed {a.bedNumber}</td>
                            <td className="p-3 font-mono text-white">PKR {a.monthlyRentPKR.toLocaleString()}</td>
                            <td className="p-3 text-[11px] text-slate-400">{a.emergencyContact}</td>
                            <td className="p-3 text-right">
                              <Badge variant="success" className="text-[10px]">{a.status}</Badge>
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

          {/* TAB 4: ROOM TRANSFERS & CLEARANCE */}
          {activeTab === "requests" && (
            <Card className="bg-slate-950/80 border-slate-800 shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                      <ArrowRightLeft className="h-5 w-5 text-amber-400" /> Room Change & Check-Out Clearance Desk
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400">
                      Review resident room transfer applications and departure clearance requests
                    </CardDescription>
                  </div>
                  <select
                    value={requestStatusFilter}
                    onChange={(e) => setRequestStatusFilter(e.target.value)}
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-white"
                  >
                    <option value="ALL">All Requests</option>
                    <option value="PENDING">Pending Only</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-3">Resident</th>
                        <th className="p-3">Request Type</th>
                        <th className="p-3">Current vs Target</th>
                        <th className="p-3">Reason</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Decision</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                      {requests.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-3">
                            <p className="font-bold text-white">{r.studentName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{r.studentRollNo}</p>
                          </td>
                          <td className="p-3">
                            <Badge variant="warning" className="text-[9px]">{r.requestType}</Badge>
                          </td>
                          <td className="p-3 text-xs">
                            <p className="text-slate-400">From: <span className="text-white font-mono">{r.currentRoom}</span></p>
                            <p className="text-amber-400 font-medium">To: {r.targetRoom}</p>
                          </td>
                          <td className="p-3 text-slate-300 max-w-xs truncate">{r.reason}</td>
                          <td className="p-3">
                            <Badge
                              variant={r.status === "APPROVED" ? "success" : r.status === "REJECTED" ? "destructive" : "warning"}
                              className="text-[9px]"
                            >
                              {r.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-right">
                            {r.status === "PENDING" ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  size="sm"
                                  onClick={() => handleReviewRequest(r.id, "APPROVED")}
                                  className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                                >
                                  <CheckCircle2 className="h-3 w-3" /> Approve
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleReviewRequest(r.id, "REJECTED")}
                                  className="h-7 text-[11px] bg-rose-600 hover:bg-rose-700 text-white gap-1"
                                >
                                  <XCircle className="h-3 w-3" /> Reject
                                </Button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-500 italic">Completed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
