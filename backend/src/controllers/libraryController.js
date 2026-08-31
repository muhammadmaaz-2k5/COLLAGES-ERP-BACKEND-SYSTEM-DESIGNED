// ============================================================================
// 📚 APEX UNIVERSITY ERP — LIBRARY CONTROLLER
// ============================================================================
// REST controller for cataloging, circulation desk loans, and public OPAC.
// ============================================================================

const LibraryService = require("../services/libraryService");

class LibraryController {
  /**
   * GET /api/v1/library/overview
   * Library inventory metrics, circulation totals, and overdue fines
   */
  static async getOverview(req, res, next) {
    try {
      const data = await LibraryService.getOverview();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/library/catalog
   * Master book catalog with category & text filtering
   */
  static async getCatalog(req, res, next) {
    try {
      const { category, search } = req.query;
      const data = await LibraryService.getCatalog({ category, search });
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/library/catalog
   * Adds a new book title and barcoded copies to the catalog
   */
  static async addBookTitle(req, res, next) {
    try {
      const { isbn, title, author, totalCopies } = req.body;
      if (!isbn || !title || !author) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "ISBN, Title, and Author are required" },
        });
      }

      const data = await LibraryService.addBookTitle(req.body, req);
      return res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/library/circulation
   * Active and historical circulation loans
   */
  static async getCirculationLoans(req, res, next) {
    try {
      const { status } = req.query;
      const data = await LibraryService.getCirculationLoans({ status });
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/library/circulation/checkout
   * Check out a book copy to a borrower
   */
  static async checkoutBook(req, res, next) {
    try {
      const { borrowerRollNo, borrowerName, borrowerType, isbn, copyBarcode } = req.body;
      if (!borrowerRollNo || !isbn) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "borrowerRollNo and ISBN are required" },
        });
      }

      const data = await LibraryService.checkoutBook(req.body, req);
      return res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/library/circulation/return
   * Return a book copy and calculate overdue fines
   */
  static async returnBook(req, res, next) {
    try {
      const { loanId, copyBarcode } = req.body;
      if (!loanId && !copyBarcode) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "loanId or copyBarcode is required" },
        });
      }

      const data = await LibraryService.returnBook(req.body, req);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/library/opac
   * Public OPAC search interface
   */
  static async opacSearch(req, res, next) {
    try {
      const { query, category } = req.query;
      const data = await LibraryService.opacSearch({ query, category });
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = LibraryController;
