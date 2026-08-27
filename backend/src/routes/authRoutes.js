const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const authGuard = require("../middleware/authGuard");

// Public authentication routes
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);

// Protected session route
router.get("/me", authGuard, AuthController.getMe);

module.exports = router;
