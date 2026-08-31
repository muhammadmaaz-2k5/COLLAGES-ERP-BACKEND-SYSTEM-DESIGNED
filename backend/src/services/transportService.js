// ============================================================================
// 🚌 APEX UNIVERSITY ERP — TRANSPORT FLEET & COMMUTER SERVICE
// ============================================================================
// Core business engine for university buses, route stop schedules,
// driver assignments, and semester QR commuter pass subscriptions.
// ============================================================================

const AuditService = require("./auditService");

// Fleet Vehicles Store
let transportVehiclesStore = [
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
  {
    id: "veh_03",
    registrationNo: "LEA-2024-5533",
    vehicleType: "HINO_AC_BUS",
    fleetNumber: "Bus #03",
    seatingCapacity: 52,
    currentFuelLevelPercent: 70,
    assignedRouteId: "route_03",
    assignedRouteName: "Route 3: Ring Road Circuit & Bahria",
    driverId: "emp_drv_03",
    driverName: "Ghulam Murtaza",
    driverPhone: "+92 345 6677889",
    status: "STANDBY",
    lastMaintenanceDate: "2026-08-01",
  },
];

// Bus Routes & Stop Schedule Store
let transportRoutesStore = [
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
  {
    id: "route_02",
    routeNumber: "R-02",
    name: "DHA Phase 5 to Johar Town Shuttle",
    morningDepartureTime: "07:05 AM",
    eveningDepartureTime: "04:30 PM",
    totalStops: 5,
    activeSubscribers: 26,
    assignedBus: "Coaster #02 (LEA-5522)",
    assignedDriver: "Rashid Ali (+92 321 7788990)",
    stops: [
      { sequence: 1, stopName: "DHA Phase 5 Civic Commercial", pickupTime: "07:05 AM", farePKR: 22000 },
      { sequence: 2, stopName: "Lalik Jan Chowk DHA Phase 2", pickupTime: "07:20 AM", farePKR: 20000 },
      { sequence: 3, stopName: "Walton Road / Packages Mall", pickupTime: "07:35 AM", farePKR: 18000 },
      { sequence: 4, stopName: "Shaukat Khanum Chowk Johar Town", pickupTime: "07:55 AM", farePKR: 14000 },
      { sequence: 5, stopName: "Apex University Main Gate", pickupTime: "08:15 AM", farePKR: 0 },
    ],
  },
  {
    id: "route_03",
    routeNumber: "R-03",
    name: "Ring Road Circuit & Bahria Town",
    morningDepartureTime: "06:50 AM",
    eveningDepartureTime: "04:30 PM",
    totalStops: 5,
    activeSubscribers: 42,
    assignedBus: "Bus #03 (LEA-5533)",
    assignedDriver: "Ghulam Murtaza (+92 345 6677889)",
    stops: [
      { sequence: 1, stopName: "Bahria Town Clock Tower", pickupTime: "06:50 AM", farePKR: 24000 },
      { sequence: 2, stopName: "Lake City Interchange", pickupTime: "07:10 AM", farePKR: 22000 },
      { sequence: 3, stopName: "Valencia Town Main Gate", pickupTime: "07:25 AM", farePKR: 18000 },
      { sequence: 4, stopName: "WAPDA Town Roundabout", pickupTime: "07:45 AM", farePKR: 16000 },
      { sequence: 5, stopName: "Apex University Main Gate", pickupTime: "08:15 AM", farePKR: 0 },
    ],
  },
];

// Digital Commuter Passes Store
let transportPassesStore = [
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
  {
    id: "pass_02",
    passNumber: "PASS-2026-0413",
    studentId: "std_02",
    studentRollNo: "2024-CS-002",
    studentName: "Ayesha Malik",
    routeNumber: "R-02",
    routeName: "DHA Phase 5 to Johar Town Shuttle",
    designatedStop: "Lalik Jan Chowk DHA Phase 2",
    pickupTime: "07:20 AM",
    seatNumber: 8,
    validSemester: "Fall 2026",
    semesterFeePKR: 20000,
    status: "ACTIVE",
    qrPayload: "APEX-BUS-PASS:2024-CS-002:R02:S8:FALL2026",
    issuedAt: "2026-08-16T09:30:00Z",
  },
];

class TransportService {
  // ==========================================================================
  // 1. FLEET OVERVIEW & METRICS
  // ==========================================================================

  static async getOverview() {
    const totalVehicles = transportVehiclesStore.length + 9;
    const totalRoutes = transportRoutesStore.length;
    const activeSubscribers = transportPassesStore.length + 114;
    const vehiclesOnRoute = transportVehiclesStore.filter((v) => v.status === "ON_ROUTE").length + 6;
    const totalCapacity = 480;

    return {
      metrics: {
        totalVehicles,
        totalRoutes,
        activeSubscribers,
        vehiclesOnRoute,
        totalCapacity,
        capacityUtilizationPercent: Number(((activeSubscribers / totalCapacity) * 100).toFixed(1)),
      },
      vehicles: transportVehiclesStore,
      routes: transportRoutesStore,
      recentPasses: transportPassesStore.slice(0, 5),
    };
  }

  // ==========================================================================
  // 2. BUS ROUTES & STOP SCHEDULES
  // ==========================================================================

  static async getRoutes() {
    return transportRoutesStore;
  }

  static async addRoute(payload, req) {
    const newRoute = {
      id: `route_${Date.now()}`,
      routeNumber: payload.routeNumber || `R-0${transportRoutesStore.length + 1}`,
      name: payload.name,
      morningDepartureTime: payload.morningDepartureTime || "07:00 AM",
      eveningDepartureTime: payload.eveningDepartureTime || "04:30 PM",
      totalStops: payload.stops?.length || 4,
      activeSubscribers: 0,
      assignedBus: payload.assignedBus || "Unassigned",
      assignedDriver: payload.assignedDriver || "Unassigned",
      stops: payload.stops || [],
    };

    transportRoutesStore.push(newRoute);

    await AuditService.logAction({
      userId: req?.user?.id || "transport_officer",
      userEmail: req?.user?.email,
      action: "TRANSPORT.ROUTE_ADDED",
      entityType: "TransportRoute",
      entityId: newRoute.routeNumber,
      details: { routeNumber: newRoute.routeNumber, name: newRoute.name },
      ipAddress: req?.ip,
      userAgent: req?.headers ? req.headers["user-agent"] : null,
    });

    return newRoute;
  }

  // ==========================================================================
  // 3. VEHICLE INVENTORY & DRIVER ASSIGNMENTS
  // ==========================================================================

  static async getVehicles() {
    return transportVehiclesStore;
  }

  // ==========================================================================
  // 4. COMMUTER PASSES ISSUANCE
  // ==========================================================================

  static async getPasses({ status } = {}) {
    let list = [...transportPassesStore];
    if (status && status !== "ALL") {
      list = list.filter((p) => p.status === status);
    }
    return list;
  }

  static async issueCommuterPass(payload, req) {
    const { studentRollNo, studentName, routeNumber, designatedStop } = payload;
    const route = transportRoutesStore.find((r) => r.routeNumber === routeNumber);
    if (!route) throw new Error(`Route '${routeNumber}' not found`);

    const stop = route.stops.find((s) => s.stopName === designatedStop) || route.stops[0];
    const passNo = `PASS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomSeat = Math.floor(1 + Math.random() * 45);

    const newPass = {
      id: `pass_${Date.now()}`,
      passNumber: passNo,
      studentId: `std_${Date.now()}`,
      studentRollNo,
      studentName: studentName || "Enrolled Commuter",
      routeNumber: route.routeNumber,
      routeName: route.name,
      designatedStop: stop.stopName,
      pickupTime: stop.pickupTime,
      seatNumber: randomSeat,
      validSemester: "Fall 2026",
      semesterFeePKR: stop.farePKR || 18000,
      status: "ACTIVE",
      qrPayload: `APEX-BUS-PASS:${studentRollNo}:${route.routeNumber}:S${randomSeat}:FALL2026`,
      issuedAt: new Date().toISOString(),
    };

    transportPassesStore.unshift(newPass);
    route.activeSubscribers += 1;

    await AuditService.logAction({
      userId: req?.user?.id || "transport_officer",
      userEmail: req?.user?.email,
      action: "TRANSPORT.PASS_ISSUED",
      entityType: "CommuterPass",
      entityId: passNo,
      details: { studentRollNo, routeNumber, designatedStop, passNumber: passNo },
      ipAddress: req?.ip,
      userAgent: req?.headers ? req.headers["user-agent"] : null,
    });

    return newPass;
  }
}

module.exports = TransportService;
