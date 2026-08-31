// ============================================================================
// 🏢 APEX UNIVERSITY ERP — HOSTEL CLIENT
// ============================================================================
// Frontend REST API client for hostel buildings, room & bed matrix,
// residential contracts, and room change/checkout requests.
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface HostelBuildingItem {
  id: string;
  name: string;
  code: string;
  type: "MALE" | "FEMALE" | "FACULTY";
  totalFloors: number;
  totalRooms: number;
  totalBeds: number;
  occupiedBeds: number;
  wardenName: string;
  contactPhone: string;
  amenities: string[];
}

export interface BedSlot {
  bedNumber: number;
  isOccupied: boolean;
  studentRollNo: string | null;
  studentName: string | null;
}

export interface HostelRoomItem {
  id: string;
  buildingId: string;
  buildingCode: string;
  roomNumber: string;
  floor: number;
  tier: "SINGLE_DELUXE" | "DOUBLE_STANDARD" | "TRIPLE_ECONOMY";
  capacity: number;
  occupiedCount: number;
  monthlyRentPKR: number;
  amenities: string[];
  beds: BedSlot[];
}

export interface HostelAllocationRecord {
  id: string;
  contractNo: string;
  studentId: string;
  studentRollNo: string;
  studentName: string;
  buildingCode: string;
  roomNumber: string;
  bedNumber: number;
  checkInDate: string;
  contractExpiry: string;
  monthlyRentPKR: number;
  emergencyContact: string;
  status: "ACTIVE" | "EXPIRED" | "TERMINATED";
  duesCleared: boolean;
}

export interface HostelRequestRecord {
  id: string;
  requestType: "ROOM_CHANGE" | "CHECK_OUT_CLEARANCE" | "MAINTENANCE";
  studentRollNo: string;
  studentName: string;
  currentRoom: string;
  targetRoom: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
  reviewedAt: string | null;
  remarks: string | null;
}

export interface HostelOverviewResponse {
  metrics: {
    totalHostels: number;
    totalBeds: number;
    occupiedBeds: number;
    availableBeds: number;
    occupancyRatePercent: number;
    pendingRequests: number;
  };
  buildings: HostelBuildingItem[];
  recentAllocations: HostelAllocationRecord[];
  recentRequests: HostelRequestRecord[];
}

export class HostelAPI {
  /**
   * Fetches residential life overview & metrics
   */
  static async getOverview(token?: string): Promise<{ success: boolean; data: HostelOverviewResponse }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/hostels/overview`, { headers });
    if (!res.ok) throw new Error("Failed to fetch hostel overview");
    return res.json();
  }

  /**
   * Fetches hostel buildings
   */
  static async getBuildings(token?: string): Promise<{ success: boolean; data: HostelBuildingItem[] }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/hostels/buildings`, { headers });
    if (!res.ok) throw new Error("Failed to fetch buildings");
    return res.json();
  }

  /**
   * Fetches rooms with bed slots
   */
  static async getRooms(
    token?: string,
    filters?: { buildingCode?: string; floor?: string; tier?: string }
  ): Promise<{ success: boolean; data: HostelRoomItem[] }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const params = new URLSearchParams();
    if (filters?.buildingCode) params.set("buildingCode", filters.buildingCode);
    if (filters?.floor) params.set("floor", filters.floor);
    if (filters?.tier) params.set("tier", filters.tier);

    const res = await fetch(`${API_BASE_URL}/hostels/rooms?${params.toString()}`, { headers });
    if (!res.ok) throw new Error("Failed to fetch rooms");
    return res.json();
  }

  /**
   * Fetches active residential contracts
   */
  static async getAllocations(token?: string, status?: string): Promise<{ success: boolean; data: HostelAllocationRecord[] }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const params = new URLSearchParams();
    if (status && status !== "ALL") params.set("status", status);

    const res = await fetch(`${API_BASE_URL}/hostels/allocations?${params.toString()}`, { headers });
    if (!res.ok) throw new Error("Failed to fetch allocations");
    return res.json();
  }

  /**
   * Assigns a student to a vacant bed
   */
  static async assignBed(token: string | undefined, payload: any): Promise<{ success: boolean; data: HostelAllocationRecord }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/hostels/allocations/assign`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to assign bed");
    return res.json();
  }

  /**
   * Fetches room change and checkout requests
   */
  static async getRequests(token?: string, status?: string): Promise<{ success: boolean; data: HostelRequestRecord[] }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const params = new URLSearchParams();
    if (status && status !== "ALL") params.set("status", status);

    const res = await fetch(`${API_BASE_URL}/hostels/requests?${params.toString()}`, { headers });
    if (!res.ok) throw new Error("Failed to fetch requests");
    return res.json();
  }

  /**
   * Reviews and approves or rejects a request
   */
  static async reviewRequest(
    token: string | undefined,
    requestId: string,
    payload: { status: "APPROVED" | "REJECTED"; remarks?: string }
  ): Promise<{ success: boolean; data: HostelRequestRecord }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/hostels/requests/${requestId}/review`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to review request");
    return res.json();
  }
}
