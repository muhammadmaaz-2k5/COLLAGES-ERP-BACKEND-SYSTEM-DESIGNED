// ============================================================================
// 🏢 APEX UNIVERSITY ERP — HOSTEL & RESIDENTIAL LIFE SERVICE
// ============================================================================
// Core business engine for hostel buildings, room tiers, bed allocations,
// student check-in/out contracts, and room change requests.
// ============================================================================

const AuditService = require("./auditService");

// Hostel Buildings Store
let hostelBuildingsStore = [
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
  {
    id: "bld_fl1",
    name: "Executive Faculty Residence",
    code: "FR-1",
    type: "FACULTY",
    totalFloors: 2,
    totalRooms: 15,
    totalBeds: 15,
    occupiedBeds: 11,
    wardenName: "Engr. Khalid Usman",
    contactPhone: "+92 333 1122334",
    amenities: ["Furnished Studio", "Attached Kitchen", "Covered Parking"],
  },
];

// Room Inventory Store
let hostelRoomsStore = [
  {
    id: "rm_101",
    buildingId: "bld_bh1",
    buildingCode: "BH-1",
    roomNumber: "101",
    floor: 1,
    tier: "DOUBLE_STANDARD",
    capacity: 2,
    occupiedCount: 2,
    monthlyRentPKR: 15000,
    amenities: ["Attached Bath", "Twin Study Desks", "Ceiling Fan", "Cupboards"],
    beds: [
      { bedNumber: 1, isOccupied: true, studentRollNo: "2024-CS-001", studentName: "Muhammad Hamza" },
      { bedNumber: 2, isOccupied: true, studentRollNo: "2024-CS-003", studentName: "Bilal Hassan" },
    ],
  },
  {
    id: "rm_102",
    buildingId: "bld_bh1",
    buildingCode: "BH-1",
    roomNumber: "102",
    floor: 1,
    tier: "DOUBLE_STANDARD",
    capacity: 2,
    occupiedCount: 1,
    monthlyRentPKR: 15000,
    amenities: ["Attached Bath", "Twin Study Desks", "Ceiling Fan", "Cupboards"],
    beds: [
      { bedNumber: 1, isOccupied: true, studentRollNo: "2024-CS-041", studentName: "Zaid Tariq" },
      { bedNumber: 2, isOccupied: false, studentRollNo: null, studentName: null },
    ],
  },
  {
    id: "rm_103",
    buildingId: "bld_bh1",
    buildingCode: "BH-1",
    roomNumber: "103",
    floor: 1,
    tier: "SINGLE_DELUXE",
    capacity: 1,
    occupiedCount: 0,
    monthlyRentPKR: 25000,
    amenities: ["Air Conditioned", "Attached Bath", "Executive Desk", "Balcony"],
    beds: [
      { bedNumber: 1, isOccupied: false, studentRollNo: null, studentName: null },
    ],
  },
  {
    id: "rm_201",
    buildingId: "bld_gh1",
    buildingCode: "GH-1",
    roomNumber: "201",
    floor: 2,
    tier: "DOUBLE_STANDARD",
    capacity: 2,
    occupiedCount: 2,
    monthlyRentPKR: 15000,
    amenities: ["Attached Bath", "Twin Desks", "Ceiling Fan"],
    beds: [
      { bedNumber: 1, isOccupied: true, studentRollNo: "2024-CS-002", studentName: "Ayesha Malik" },
      { bedNumber: 2, isOccupied: true, studentRollNo: "2024-SE-014", studentName: "Sara Ahmed" },
    ],
  },
  {
    id: "rm_202",
    buildingId: "bld_gh1",
    buildingCode: "GH-1",
    roomNumber: "202",
    floor: 2,
    tier: "TRIPLE_ECONOMY",
    capacity: 3,
    occupiedCount: 2,
    monthlyRentPKR: 11000,
    amenities: ["Shared Bath", "Study Table", "Storage Lockers"],
    beds: [
      { bedNumber: 1, isOccupied: true, studentRollNo: "2024-AI-005", studentName: "Zainab Fatima" },
      { bedNumber: 2, isOccupied: true, studentRollNo: "2024-CS-042", studentName: "Khadija Bibi" },
      { bedNumber: 3, isOccupied: false, studentRollNo: null, studentName: null },
    ],
  },
];

// Active Allocations Store
let hostelAllocationsStore = [
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
  {
    id: "alloc_02",
    contractNo: "HC-2026-0815",
    studentId: "std_02",
    studentRollNo: "2024-CS-002",
    studentName: "Ayesha Malik",
    buildingCode: "GH-1",
    roomNumber: "201",
    bedNumber: 1,
    checkInDate: "2026-08-15",
    contractExpiry: "2027-06-30",
    monthlyRentPKR: 15000,
    emergencyContact: "Tariq Malik (+92 321 9876543)",
    status: "ACTIVE",
    duesCleared: true,
  },
];

// Room Change / Check-Out Requests Store
let hostelRequestsStore = [
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
  {
    id: "req_02",
    requestType: "CHECK_OUT_CLEARANCE",
    studentRollNo: "2024-CS-003",
    studentName: "Bilal Hassan",
    currentRoom: "BH-1 / Room 101",
    targetRoom: "N/A (Off-Campus Accommodation)",
    reason: "Family relocated to city residence.",
    status: "APPROVED",
    submittedAt: "2026-08-25T14:30:00Z",
    reviewedAt: "2026-08-26T11:00:00Z",
    remarks: "Room keys deposited and inventory verified intact.",
  },
];

class HostelService {
  // ==========================================================================
  // 1. RESIDENTIAL OVERVIEW & METRICS
  // ==========================================================================

  static async getOverview() {
    const totalHostels = hostelBuildingsStore.length;
    const totalBeds = hostelBuildingsStore.reduce((sum, b) => sum + b.totalBeds, 0);
    const occupiedBeds = hostelBuildingsStore.reduce((sum, b) => sum + b.occupiedBeds, 0);
    const availableBeds = totalBeds - occupiedBeds;
    const occupancyRate = totalBeds > 0 ? Number(((occupiedBeds / totalBeds) * 100).toFixed(1)) : 0;
    const pendingRequests = hostelRequestsStore.filter((r) => r.status === "PENDING").length;

    return {
      metrics: {
        totalHostels,
        totalBeds,
        occupiedBeds,
        availableBeds,
        occupancyRatePercent: occupancyRate,
        pendingRequests,
      },
      buildings: hostelBuildingsStore,
      recentAllocations: hostelAllocationsStore.slice(0, 5),
      recentRequests: hostelRequestsStore.slice(0, 5),
    };
  }

  // ==========================================================================
  // 2. BUILDINGS & ROOM INVENTORY MATRIX
  // ==========================================================================

  static async getBuildings() {
    return hostelBuildingsStore;
  }

  static async getRooms({ buildingCode, floor, tier } = {}) {
    let list = [...hostelRoomsStore];

    if (buildingCode && buildingCode !== "ALL") {
      list = list.filter((r) => r.buildingCode === buildingCode);
    }
    if (floor && floor !== "ALL") {
      list = list.filter((r) => r.floor === Number(floor));
    }
    if (tier && tier !== "ALL") {
      list = list.filter((r) => r.tier === tier);
    }

    return list;
  }

  // ==========================================================================
  // 3. BED ALLOCATION & CONTRACT ASSIGNMENT
  // ==========================================================================

  static async getAllocations({ status } = {}) {
    let list = [...hostelAllocationsStore];
    if (status && status !== "ALL") {
      list = list.filter((a) => a.status === status);
    }
    return list;
  }

  static async assignBedAllocation({ studentRollNo, studentName, buildingCode, roomNumber, bedNumber, emergencyContact }, req) {
    const room = hostelRoomsStore.find((r) => r.buildingCode === buildingCode && r.roomNumber === String(roomNumber));
    if (!room) throw new Error(`Room '${roomNumber}' in building '${buildingCode}' not found`);

    const bed = room.beds.find((b) => b.bedNumber === Number(bedNumber));
    if (!bed) throw new Error(`Bed #${bedNumber} does not exist in room ${roomNumber}`);
    if (bed.isOccupied) throw new Error(`Bed #${bedNumber} is already occupied by ${bed.studentName}`);

    // Update bed occupancy
    bed.isOccupied = true;
    bed.studentRollNo = studentRollNo;
    bed.studentName = studentName || "Enrolled Resident";
    room.occupiedCount += 1;

    // Update building metrics
    const bld = hostelBuildingsStore.find((b) => b.code === buildingCode);
    if (bld) bld.occupiedBeds += 1;

    const contractNo = `HC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAllocation = {
      id: `alloc_${Date.now()}`,
      contractNo,
      studentId: `std_${Date.now()}`,
      studentRollNo,
      studentName: bed.studentName,
      buildingCode,
      roomNumber: String(roomNumber),
      bedNumber: Number(bedNumber),
      checkInDate: new Date().toISOString().split("T")[0],
      contractExpiry: "2027-06-30",
      monthlyRentPKR: room.monthlyRentPKR,
      emergencyContact: emergencyContact || "Guardian (+92 300 0000000)",
      status: "ACTIVE",
      duesCleared: true,
    };

    hostelAllocationsStore.unshift(newAllocation);

    await AuditService.logAction({
      userId: req?.user?.id || "warden",
      userEmail: req?.user?.email,
      action: "HOSTEL.BED_ALLOCATED",
      entityType: "HostelAllocation",
      entityId: contractNo,
      details: { studentRollNo, buildingCode, roomNumber, bedNumber },
      ipAddress: req?.ip,
      userAgent: req?.headers ? req.headers["user-agent"] : null,
    });

    return newAllocation;
  }

  // ==========================================================================
  // 4. ROOM CHANGE & CHECK-OUT REQUESTS
  // ==========================================================================

  static async getRequests({ status } = {}) {
    let list = [...hostelRequestsStore];
    if (status && status !== "ALL") {
      list = list.filter((r) => r.status === status);
    }
    return list;
  }

  static async reviewRequest(requestId, { status, remarks }, req) {
    const reqItem = hostelRequestsStore.find((r) => r.id === requestId);
    if (!reqItem) throw new Error("Hostel request record not found");

    reqItem.status = status;
    reqItem.reviewedAt = new Date().toISOString();
    reqItem.remarks = remarks || (status === "APPROVED" ? "Request authorized by Warden." : "Request rejected.");

    await AuditService.logAction({
      userId: req?.user?.id || "warden",
      userEmail: req?.user?.email,
      action: "HOSTEL.REQUEST_REVIEWED",
      entityType: "HostelRequest",
      entityId: reqItem.id,
      details: { studentRollNo: reqItem.studentRollNo, requestType: reqItem.requestType, status },
      ipAddress: req?.ip,
      userAgent: req?.headers ? req.headers["user-agent"] : null,
    });

    return reqItem;
  }
}

module.exports = HostelService;
