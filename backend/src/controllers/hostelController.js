// ============================================================================
// 🏢 APEX UNIVERSITY ERP — HOSTEL CONTROLLER
// ============================================================================
// REST controller for residential buildings, bed matrix, and room changes.
// ============================================================================

const HostelService = require("../services/hostelService");

class HostelController {
  /**
   * GET /api/v1/hostels/overview
   * Residential KPIs, occupancy percentages, and pending requests
   */
  static async getOverview(req, res, next) {
    try {
      const data = await HostelService.getOverview();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/hostels/buildings
   * Hostel buildings directory
   */
  static async getBuildings(req, res, next) {
    try {
      const data = await HostelService.getBuildings();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/hostels/rooms
   * Rooms with visual bed occupancy matrix
   */
  static async getRooms(req, res, next) {
    try {
      const { buildingCode, floor, tier } = req.query;
      const data = await HostelService.getRooms({ buildingCode, floor, tier });
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/hostels/allocations
   * Active student residential contracts
   */
  static async getAllocations(req, res, next) {
    try {
      const { status } = req.query;
      const data = await HostelService.getAllocations({ status });
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/hostels/allocations/assign
   * Assigns a student to a vacant bed
   */
  static async assignBedAllocation(req, res, next) {
    try {
      const { studentRollNo, buildingCode, roomNumber, bedNumber } = req.body;
      if (!studentRollNo || !buildingCode || !roomNumber || !bedNumber) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "studentRollNo, buildingCode, roomNumber, and bedNumber are required" },
        });
      }

      const data = await HostelService.assignBedAllocation(req.body, req);
      return res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/hostels/requests
   * Room change and clearance requests
   */
  static async getRequests(req, res, next) {
    try {
      const { status } = req.query;
      const data = await HostelService.getRequests({ status });
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/v1/hostels/requests/:id/review
   * Review room change or clearance request
   */
  static async reviewRequest(req, res, next) {
    try {
      const { id } = req.params;
      const { status, remarks } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "status is required" },
        });
      }

      const data = await HostelService.reviewRequest(id, { status, remarks }, req);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = HostelController;
