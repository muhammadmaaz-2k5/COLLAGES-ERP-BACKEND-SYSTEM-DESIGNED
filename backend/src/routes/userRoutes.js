const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const authGuard = require("../middleware/authGuard");
const roleGuard = require("../middleware/roleGuard");
const permissionGuard = require("../middleware/permissionGuard");
const objectScopeGuard = require("../middleware/objectScopeGuard");

router.get(
  "/",
  authGuard,
  roleGuard(["SUPER_ADMIN", "ADMIN", "HR_MANAGER"]),
  permissionGuard("USER.ACCOUNT.MANAGE"),
  UserController.getUsers
);

router.get("/:id", authGuard, UserController.getUserById);

router.patch(
  "/:id/status",
  authGuard,
  roleGuard(["SUPER_ADMIN", "ADMIN"]),
  permissionGuard("USER.ACCOUNT.MANAGE"),
  UserController.toggleUserStatus
);

module.exports = router;
