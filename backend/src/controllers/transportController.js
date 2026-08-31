// ============================================================================
// 🚌 APEX UNIVERSITY ERP — TRANSPORT CONTROLLER
// ============================================================================
// REST controller for fleet vehicles, routes, stop schedules, and QR passes.
// ============================================================================

const TransportService = require("../services/transportService");

class TransportController {
  /**
   * GET /api/v1/transport/overview
   * Fleet metrics, active routes, and capacity utilization
   */
  static async getOverview(req, res, next) {
    try {
      const data = await TransportService.getOverview();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/transport/routes
   * Bus route schedules and pickup stops
   */
  static async getRoutes(req, res, next) {
    try {
      const data = await TransportService.getRoutes();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/transport/routes
   * Adds a new bus route to the fleet
   */
  static async addRoute(req, res, next) {
    try {
      const { name, stops } = req.body;
      if (!name) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "Route name is required" },
        });
      }

      const data = await TransportService.addRoute(req.body, req);
      return res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/transport/vehicles
   * Fleet vehicle inventory and driver assignments
   */
  static async getVehicles(req, res, next) {
    try {
      const data = await TransportService.getVehicles();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/transport/passes
   * Commuter transit passes list
   */
  static async getPasses(req, res, next) {
    try {
      const { status } = req.query;
      const data = await TransportService.getPasses({ status });
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/transport/passes/issue
   * Issues a semester digital QR commuter pass
   */
  static async issuePass(req, res, next) {
    try {
      const { studentRollNo, routeNumber, designatedStop } = req.body;
      if (!studentRollNo || !routeNumber || !designatedStop) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "studentRollNo, routeNumber, and designatedStop are required" },
        });
      }

      const data = await TransportService.issueCommuterPass(req.body, req);
      return res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TransportController;
