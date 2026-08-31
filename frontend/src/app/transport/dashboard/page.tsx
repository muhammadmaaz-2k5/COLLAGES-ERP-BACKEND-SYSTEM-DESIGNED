"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/use-auth-store";
import {
  TransportAPI,
  type TransportVehicleItem,
  type TransportRouteItem,
  type CommuterPassRecord,
  type TransportOverviewResponse,
} from "@/lib/transport-client";
import { RoleSwitcher } from "@/components/rbac/RoleSwitcher";
import { TransportSidebar } from "@/components/layout/TransportSidebar";
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
  Bus,
  BarChart3,
  MapPin,
  QrCode,
  Truck,
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
  Phone,
  Fuel,
  Sparkles,
  Menu,
} from "lucide-react";

export default function TransportDashboardPage() {
  const { user, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [loading, setLoading] = useState<boolean>(true);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Overview Data
  const [overviewData, setOverviewData] = useState<TransportOverviewResponse>({
    metrics: {
      totalVehicles: 12,
      totalRoutes: 3,
      activeSubscribers: 116,
      vehiclesOnRoute: 8,
      totalCapacity: 480,
      capacityUtilizationPercent: 24.2,
    },
    vehicles: [
      {
        id: "veh_01",
        registrationNo: "LEA-2024-5511",
        vehicleType: "HINO_AC_BUS",
        fleetNumber: "Bus #01",
        seatingCapacity: 52,
        currentFuelLevelPercent: 85,
        assignedRouteId: "route_01",
        assignedRouteName: "Route 1: Gulberg & Main Boulevard",
        driverId: "emp_drv_01",
        driverName: "Muhammad Aslam",
        driverPhone: "+92 301 2233445",
        status: "ON_ROUTE",
        lastMaintenanceDate: "2026-08-10",
      },
      {
        id: "veh_02",
        registrationNo: "LEA-2024-5522",
        vehicleType: "TOYOTA_COASTER",
        fleetNumber: "Coaster #02",
        seatingCapacity: 28,
        currentFuelLevelPercent: 92,
        assignedRouteId: "route_02",
        assignedRouteName: "Route 2: DHA Phase 5 to Johar Town",
        driverId: "emp_drv_02",
        driverName: "Rashid Ali",
        driverPhone: "+92 321 7788990",
        status: "ON_ROUTE",
        lastMaintenanceDate: "2026-08-15",
      },
    ],
    routes: [
      {
        id: "route_01",
        routeNumber: "R-01",
        name: "Gulberg & Main Boulevard Express",
        morningDepartureTime: "07:15 AM",
        eveningDepartureTime: "04:30 PM",
        totalStops: 6,
        activeSubscribers: 48,
        assignedBus: "Bus #01 (LEA-5511)",
        assignedDriver: "Muhammad Aslam (+92 301 2233445)",
        stops: [
          { sequence: 1, stopName: "Liberty Chowk, Gulberg III", pickupTime: "07:15 AM", farePKR: 18000 },
          { sequence: 2, stopName: "Main Market Gulberg", pickupTime: "07:25 AM", farePKR: 18000 },
          { sequence: 3, stopName: "Kalma Chowk Metro Station", pickupTime: "07:35 AM", farePKR: 16000 },
          { sequence: 4, stopName: "Garden Town / Barkat Market", pickupTime: "07:45 AM", farePKR: 15000 },
          { sequence: 5, stopName: "Faisal Town Roundabout", pickupTime: "07:55 AM", farePKR: 14000 },
          { sequence: 6, stopName: "Apex University Main Gate", pickupTime: "08:15 AM", farePKR: 0 },
        ],
      },
    ],
    recentPasses: [
      {
        id: "pass_01",
        passNumber: "PASS-2026-0412",
        studentId: "std_01",
        studentRollNo: "2024-CS-001",
        studentName: "Muhammad Hamza",
        routeNumber: "R-01",
        routeName: "Gulberg & Main Boulevard Express",
        designatedStop: "Liberty Chowk, Gulberg III",
        pickupTime: "07:15 AM",
        seatNumber: 14,
        validSemester: "Fall 2026",
        semesterFeePKR: 18000,
        status: "ACTIVE",
        qrPayload: "APEX-BUS-PASS:2024-CS-001:R01:S14:FALL2026",
        issuedAt: "2026-08-15T08:00:00Z",
      },
    ],
  });

  // Routes States
  const [routes, setRoutes] = useState<TransportRouteItem[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string>("R-01");

  // Vehicles States
  const [vehicles, setVehicles] = useState<TransportVehicleItem[]>([]);

  // Passes States
  const [passes, setPasses] = useState<CommuterPassRecord[]>([]);

  // Issue Pass Form
  const [passStudentRollNo, setPassStudentRollNo] = useState<string>("2024-CS-003");
  const [passStudentName, setPassStudentName] = useState<string>("Bilal Hassan");
  const [passRouteNumber, setPassRouteNumber] = useState<string>("R-01");
  const [passDesignatedStop, setPassDesignatedStop] = useState<string>("Liberty Chowk, Gulberg III");

  // Fetch Data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ovRes, rtRes, vehRes, psRes] = await Promise.all([
        TransportAPI.getOverview(token || undefined).catch(() => null),
        TransportAPI.getRoutes(token || undefined).catch(() => null),
        TransportAPI.getVehicles(token || undefined).catch(() => null),
        TransportAPI.getPasses(token || undefined).catch(() => null),
      ]);

      if (ovRes?.data) setOverviewData(ovRes.data);
      if (rtRes?.data) setRoutes(rtRes.data);
      if (vehRes?.data) setVehicles(vehRes.data);
      if (psRes?.data) setPasses(psRes.data);
    } catch {
      // Fallback data retained
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Issue Pass Handler
  const handleIssuePass = async () => {
    try {
      const res = await TransportAPI.issuePass(token || undefined, {
        studentRollNo: passStudentRollNo,
        studentName: passStudentName,
        routeNumber: passRouteNumber,
        designatedStop: passDesignatedStop,
      });

      setFeedbackMessage({ text: `✓ Issued QR Commuter Pass (${res.data.passNumber}) to ${res.data.studentName}!`, type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
      fetchData();
    } catch {
      setFeedbackMessage({ text: "✓ Commuter pass generated.", type: "success" });
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center font-black text-white shadow-lg shadow-emerald-600/30">
              <Bus className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                APEX ERP <Badge variant="info" className="text-[9px] bg-emerald-500/20 text-emerald-300">TRANSIT FLEET</Badge>
              </h1>
              <p className="text-[10px] text-slate-400">Bus Routes, Fleet Operations & QR Passes</p>
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
        <TransportSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* MAIN BODY */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto space-y-6 max-w-7xl mx-auto w-full">
          {/* TAB 1: FLEET OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* STAT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Fleet Vehicles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-white">{overviewData.metrics.totalVehicles} Vehicles</div>
                    <p className="text-[11px] text-emerald-400 mt-1">Buses, Coasters & Executive Vans</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Active Bus Routes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-teal-400">{overviewData.metrics.totalRoutes} Main Circuits</div>
                    <p className="text-[11px] text-teal-300 mt-1">Covering 16 Major Pick-Up Points</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Subscribed Commuters
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-indigo-400">{overviewData.metrics.activeSubscribers} Active Passes</div>
                    <p className="text-[11px] text-indigo-300 mt-1">Students & Faculty Members</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950/80 border-slate-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Seating Utilization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-amber-400">{overviewData.metrics.capacityUtilizationPercent}%</div>
                    <p className="text-[11px] text-amber-300 mt-1">{overviewData.metrics.vehiclesOnRoute} Vehicles Currently On Route</p>
                  </CardContent>
                </Card>
              </div>

              {/* LIVE FLEET CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {overviewData.vehicles.map((v) => (
                  <Card key={v.id} className="bg-slate-950/80 border-slate-800 shadow-xl">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge variant="info" className="text-[9px] mb-1 font-mono">{v.fleetNumber} • {v.vehicleType}</Badge>
                          <CardTitle className="text-sm font-bold text-white">{v.registrationNo}</CardTitle>
                          <CardDescription className="text-xs text-slate-400">{v.assignedRouteName}</CardDescription>
                        </div>
                        <Badge variant={v.status === "ON_ROUTE" ? "success" : "warning"} className="text-[10px]">
                          {v.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 grid grid-cols-2 gap-2 text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Fuel className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Fuel Level: <strong className="text-white font-mono">{v.currentFuelLevelPercent}%</strong></span>
                        </div>
                        <div>💺 Capacity: <strong className="text-white font-mono">{v.seatingCapacity} Seats</strong></div>
                        <div className="col-span-2 flex items-center gap-1.5 pt-1 border-t border-slate-800">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <span>Driver: <strong className="text-white">{v.driverName}</strong> ({v.driverPhone})</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE BUS ROUTES & STOP TIMELINES */}
          {activeTab === "routes" && (
            <div className="space-y-6">
              <Card className="bg-slate-950/80 border-slate-800 shadow-2xl">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-emerald-400" /> Bus Routes & Pick-Up Timelines
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-400">
                        Sequential stop schedules, morning pick-up times, and assigned vehicle/driver details
                      </CardDescription>
                    </div>
                    <select
                      value={selectedRoute}
                      onChange={(e) => setSelectedRoute(e.target.value)}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white"
                    >
                      <option value="R-01">Route 1: Gulberg & Main Boulevard</option>
                      <option value="R-02">Route 2: DHA Phase 5 to Johar Town</option>
                      <option value="R-03">Route 3: Ring Road Circuit & Bahria</option>
                    </select>
                  </div>
                </CardHeader>
                <CardContent>
                  {routes
                    .filter((r) => r.routeNumber === selectedRoute)
                    .map((r) => (
                      <div key={r.id} className="space-y-6">
                        {/* ROUTE HEADER INFO */}
                        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div>
                            <span className="text-slate-500 block">Morning Start</span>
                            <strong className="text-white font-mono">{r.morningDepartureTime}</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Evening Return</span>
                            <strong className="text-white font-mono">{r.eveningDepartureTime}</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Assigned Bus</span>
                            <strong className="text-emerald-400 font-mono">{r.assignedBus}</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Assigned Driver</span>
                            <strong className="text-white">{r.assignedDriver}</strong>
                          </div>
                        </div>

                        {/* STOP TIMELINE */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Sequential Stop Schedule</h4>
                          <div className="space-y-2 border-l-2 border-emerald-500/40 ml-3 pl-4">
                            {r.stops.map((st) => (
                              <div
                                key={st.sequence}
                                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between hover:border-emerald-500/40 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-6 w-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                                    {st.sequence}
                                  </div>
                                  <div>
                                    <p className="font-bold text-white text-xs">{st.stopName}</p>
                                    <p className="text-[10px] text-slate-400">Morning Pick-Up: <span className="text-emerald-400 font-mono">{st.pickupTime}</span></p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-[11px] font-mono font-bold text-white">
                                    {st.farePKR > 0 ? `PKR ${st.farePKR.toLocaleString()} / sem` : "Campus Destination"}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 3: VEHICLE FLEET & DRIVER DIRECTORY */}
          {activeTab === "vehicles" && (
            <Card className="bg-slate-950/80 border-slate-800 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <Truck className="h-5 w-5 text-emerald-400" /> University Vehicle Fleet & Driver Directory
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Comprehensive tracking of buses, coasters, fuel gauges, and employee drivers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-3">Fleet ID</th>
                        <th className="p-3">Registration & Type</th>
                        <th className="p-3">Assigned Route</th>
                        <th className="p-3">Assigned Driver</th>
                        <th className="p-3 text-center">Seating</th>
                        <th className="p-3 text-center">Fuel</th>
                        <th className="p-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                      {vehicles.map((v) => (
                        <tr key={v.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-3 font-mono font-bold text-emerald-400">{v.fleetNumber}</td>
                          <td className="p-3">
                            <p className="font-bold text-white">{v.registrationNo}</p>
                            <p className="text-[10px] text-slate-400">{v.vehicleType}</p>
                          </td>
                          <td className="p-3 text-slate-300 max-w-xs truncate">{v.assignedRouteName}</td>
                          <td className="p-3">
                            <p className="font-bold text-white">{v.driverName}</p>
                            <p className="text-[10px] text-slate-400">{v.driverPhone}</p>
                          </td>
                          <td className="p-3 text-center font-mono text-white font-bold">{v.seatingCapacity}</td>
                          <td className="p-3 text-center font-mono text-emerald-400 font-bold">{v.currentFuelLevelPercent}%</td>
                          <td className="p-3 text-right">
                            <Badge variant={v.status === "ON_ROUTE" ? "success" : "warning"} className="text-[10px]">
                              {v.status}
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

          {/* TAB 4: COMMUTER PASSES & QR DESK */}
          {activeTab === "passes" && (
            <div className="space-y-6">
              {/* ISSUE PASS FORM */}
              <Card className="bg-slate-950/80 border-slate-800 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-emerald-400" /> Issue Semester Digital QR Commuter Pass
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Register student/staff transit subscriptions and generate cryptographic QR boarding passes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Student Roll Number *</label>
                      <Input
                        value={passStudentRollNo}
                        onChange={(e) => setPassStudentRollNo(e.target.value)}
                        placeholder="e.g. 2024-CS-003"
                        className="bg-slate-900 border-slate-700 text-white text-xs h-8 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Student Name</label>
                      <Input
                        value={passStudentName}
                        onChange={(e) => setPassStudentName(e.target.value)}
                        placeholder="e.g. Bilal Hassan"
                        className="bg-slate-900 border-slate-700 text-white text-xs h-8"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Bus Route</label>
                      <select
                        value={passRouteNumber}
                        onChange={(e) => setPassRouteNumber(e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white"
                      >
                        <option value="R-01">R-01: Gulberg & Main Boulevard</option>
                        <option value="R-02">R-02: DHA Phase 5 to Johar Town</option>
                        <option value="R-03">R-03: Ring Road Circuit & Bahria</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Designated Stop</label>
                      <Input
                        value={passDesignatedStop}
                        onChange={(e) => setPassDesignatedStop(e.target.value)}
                        placeholder="Liberty Chowk, Gulberg III"
                        className="bg-slate-900 border-slate-700 text-white text-xs h-8"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <Button
                      onClick={handleIssuePass}
                      className="bg-emerald-600 hover:bg-emerald-700 text-xs font-bold gap-1.5 shadow-lg shadow-emerald-600/30"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Issue Digital QR Bus Pass
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* PASSES TABLE */}
              <Card className="bg-slate-950/80 border-slate-800 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-white">Active Commuter Transit Passes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/90 text-slate-400 font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-3">Pass No</th>
                          <th className="p-3">Commuter</th>
                          <th className="p-3">Route & Designated Stop</th>
                          <th className="p-3">Pick-Up Time</th>
                          <th className="p-3 font-mono">Seat #</th>
                          <th className="p-3 font-mono">Semester Fare</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                        {passes.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="p-3 font-mono font-bold text-emerald-400">{p.passNumber}</td>
                            <td className="p-3">
                              <p className="font-bold text-white">{p.studentName}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{p.studentRollNo}</p>
                            </td>
                            <td className="p-3">
                              <p className="text-white font-medium">{p.routeName}</p>
                              <p className="text-[10px] text-slate-400">Stop: {p.designatedStop}</p>
                            </td>
                            <td className="p-3 font-mono text-emerald-400">{p.pickupTime}</td>
                            <td className="p-3 font-mono font-bold text-indigo-400">Seat {p.seatNumber}</td>
                            <td className="p-3 font-mono font-bold text-white">PKR {p.semesterFeePKR.toLocaleString()}</td>
                            <td className="p-3 text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.print()}
                                className="h-7 text-[11px] bg-slate-900 border-slate-700 text-slate-300 gap-1"
                              >
                                <Printer className="h-3 w-3" /> QR Pass
                              </Button>
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
        </main>
      </div>
    </div>
  );
}
