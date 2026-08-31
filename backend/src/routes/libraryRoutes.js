// ============================================================================
// 📚 APEX UNIVERSITY ERP — LIBRARY & CIRCULATION ROUTES
// ============================================================================
// Route Mount: /api/v1/library
// Public   : /opac
// Protected: /overview, /catalog, /circulation, /circulation/checkout, /circulation/return
// ============================================================================

const express = require("express");
const router = express.Router();
const LibraryController = require("../controllers/libraryController");
const authGuard = require("../middleware/authGuard");
const roleGuard = require("../middleware/roleGuard");
const { SystemRoles } = require("../constants/roles");

const librarianAuth = [
  authGuard,
  roleGuard([SystemRoles.LIBRARIAN, SystemRoles.ADMIN, SystemRoles.SUPER_ADMIN]),
];

// Public OPAC (Online Public Access Catalog)
router.get("/opac", LibraryController.opacSearch);

// Overview & KPIs
router.get("/overview", ...librarianAuth, LibraryController.getOverview);

// Master Catalog
router.get("/catalog", ...librarianAuth, LibraryController.getCatalog);
router.post("/catalog", ...librarianAuth, LibraryController.addBookTitle);

// Circulation Desk
router.get("/circulation", ...librarianAuth, LibraryController.getCirculationLoans);
router.post("/circulation/checkout", ...librarianAuth, LibraryController.checkoutBook);
router.post("/circulation/return", ...librarianAuth, LibraryController.returnBook);

module.exports = router;
