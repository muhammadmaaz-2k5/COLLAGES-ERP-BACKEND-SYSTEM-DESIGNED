// ============================================================================
// 🚌 APEX UNIVERSITY ERP — TRANSPORT CLIENT
// ============================================================================
// Frontend REST API client for fleet inventory, bus routes & timelines,
// and digital QR commuter passes.
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface TransportVehicleItem {
  id: string;
  registrationNo: string;
  vehicleType: string;
  fleetNumber: string;
  seatingCapacity: number;
  currentFuelLevelPercent: number;
  assignedRouteId: string;
  assignedRouteName: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  status: "ON_ROUTE" | "STANDBY" | "MAINTENANCE";
  lastMaintenanceDate: string;
}

export interface RouteStopItem {
  sequence: number;
  stopName: string;
  pickupTime: string;
  farePKR: number;
}

export interface TransportRouteItem {
  id: string;
  routeNumber: string;
  name: string;
  morningDepartureTime: string;
  eveningDepartureTime: string;
  totalStops: number;
  activeSubscribers: number;
  assignedBus: string;
  assignedDriver: string;
  stops: RouteStopItem[];
}

export interface CommuterPassRecord {
  id: string;
  passNumber: string;
  studentId: string;
  studentRollNo: string;
  studentName: string;
  routeNumber: string;
  routeName: string;
  designatedStop: string;
  pickupTime: string;
  seatNumber: number;
  validSemester: string;
  semesterFeePKR: number;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
  qrPayload: string;
  issuedAt: string;
}

export interface TransportOverviewResponse {
  metrics: {
    totalVehicles: number;
    totalRoutes: number;
    activeSubscribers: number;
    vehiclesOnRoute: number;
    totalCapacity: number;
    capacityUtilizationPercent: number;
  };
  vehicles: TransportVehicleItem[];
  routes: TransportRouteItem[];
  recentPasses: CommuterPassRecord[];
}

export class TransportAPI {
  /**
   * Fetches transport overview & fleet metrics
   */
  static async getOverview(token?: string): Promise<{ success: boolean; data: TransportOverviewResponse }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/transport/overview`, { headers });
    if (!res.ok) throw new Error("Failed to fetch transport overview");
    return res.json();
  }

  /**
   * Fetches bus routes & schedules
   */
  static async getRoutes(token?: string): Promise<{ success: boolean; data: TransportRouteItem[] }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/transport/routes`, { headers });
    if (!res.ok) throw new Error("Failed to fetch routes");
    return res.json();
  }

  /**
   * Adds a new bus route
   */
  static async addRoute(token: string | undefined, payload: any): Promise<{ success: boolean; data: TransportRouteItem }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/transport/routes`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to add route");
    return res.json();
  }

  /**
   * Fetches fleet vehicles
   */
  static async getVehicles(token?: string): Promise<{ success: boolean; data: TransportVehicleItem[] }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/transport/vehicles`, { headers });
    if (!res.ok) throw new Error("Failed to fetch vehicles");
    return res.json();
  }

  /**
   * Fetches commuter transit passes
   */
  static async getPasses(token?: string, status?: string): Promise<{ success: boolean; data: CommuterPassRecord[] }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const params = new URLSearchParams();
    if (status && status !== "ALL") params.set("status", status);

    const res = await fetch(`${API_BASE_URL}/transport/passes?${params.toString()}`, { headers });
    if (!res.ok) throw new Error("Failed to fetch passes");
    return res.json();
  }

  /**
   * Issues a semester digital QR commuter pass
   */
  static async issuePass(
    token: string | undefined,
    payload: { studentRollNo: string; studentName?: string; routeNumber: string; designatedStop: string }
  ): Promise<{ success: boolean; data: CommuterPassRecord }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/transport/passes/issue`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to issue commuter pass");
    return res.json();
  }
}
