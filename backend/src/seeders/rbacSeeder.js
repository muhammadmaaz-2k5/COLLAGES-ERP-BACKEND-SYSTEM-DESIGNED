const { sequelize, Role, Permission, RolePermission, User } = require("../models");
const { SystemRoles, RoleHierarchyWeight } = require("../constants/roles");
const { PermissionCatalog, DefaultRolePermissions } = require("../constants/permissions");

async function seedRBAC() {
  console.log("[RBAC Seeder] Starting database sync & seed...");

  await sequelize.sync({ force: false, alter: true });
  console.log("✓ Database synchronized.");

  // 1. Seed Roles
  for (const [code, weight] of Object.entries(RoleHierarchyWeight)) {
    await Role.findOrCreate({
      where: { code },
      defaults: {
        code,
        name: code.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        description: `Standard system role for ${code}`,
        hierarchyWeight: weight,
        isSystemRole: true,
      },
    });
  }
  console.log("✓ 12 Standard Roles verified.");

  // 2. Seed Permissions
  for (const p of PermissionCatalog) {
    await Permission.findOrCreate({
      where: { code: p.code },
      defaults: {
        code: p.code,
        module: p.module,
        description: p.description,
      },
    });
  }
  console.log(`✓ ${PermissionCatalog.length} Granular Permissions verified.`);

  // 3. Seed Role-Permission Matrix
  for (const [roleCode, permCodes] of Object.entries(DefaultRolePermissions)) {
    const role = await Role.findOne({ where: { code: roleCode } });
    if (!role) continue;

    for (const pCode of permCodes) {
      const permission = await Permission.findOne({ where: { code: pCode } });
      if (!permission) continue;

      await RolePermission.findOrCreate({
        where: { roleId: role.id, permissionId: permission.id },
        defaults: { roleId: role.id, permissionId: permission.id },
      });
    }
  }
  console.log("✓ Default Role-Permission Matrix linked.");

  // 4. Seed Demo Users for each of the 12 roles
  const demoUsers = [
    { email: "superadmin@university.edu", firstName: "Super", lastName: "Administrator", roleCode: SystemRoles.SUPER_ADMIN },
    { email: "admin@university.edu", firstName: "Campus", lastName: "Admin", roleCode: SystemRoles.ADMIN },
    { email: "teacher@university.edu", firstName: "Sarah", lastName: "Jenkins", roleCode: SystemRoles.TEACHER, employeeId: "EMP-FAC-01" },
    { email: "student@university.edu", firstName: "Alex", lastName: "Morgan", roleCode: SystemRoles.STUDENT, studentId: "STD-2026-042" },
    { email: "accountant@university.edu", firstName: "Robert", lastName: "Sterling", roleCode: SystemRoles.ACCOUNTANT, employeeId: "EMP-FIN-01" },
    { email: "librarian@university.edu", firstName: "Emily", lastName: "Blunt", roleCode: SystemRoles.LIBRARIAN, employeeId: "EMP-LIB-01" },
    { email: "hrmanager@university.edu", firstName: "David", lastName: "Hassel", roleCode: SystemRoles.HR_MANAGER, employeeId: "EMP-HR-01" },
    { email: "warden@university.edu", firstName: "Marcus", lastName: "Vance", roleCode: SystemRoles.WARDEN, employeeId: "EMP-HST-01" },
    { email: "driver@university.edu", firstName: "James", lastName: "Miller", roleCode: SystemRoles.DRIVER, employeeId: "EMP-DRV-01" },
    { email: "admissions@university.edu", firstName: "Clara", lastName: "Oswald", roleCode: SystemRoles.ADMISSIONS_OFFICER, employeeId: "EMP-ADM-01" },
    { email: "examcontroller@university.edu", firstName: "Arthur", lastName: "Pendleton", roleCode: SystemRoles.EXAM_CONTROLLER, employeeId: "EMP-EXM-01" },
    { email: "staff@university.edu", firstName: "Hannah", lastName: "Abbott", roleCode: SystemRoles.STAFF, employeeId: "EMP-STF-01" },
  ];

  for (const u of demoUsers) {
    const existing = await User.findOne({ where: { email: u.email } });
    if (!existing) {
      await User.create({
        email: u.email,
        passwordHash: "Password123!",
        firstName: u.firstName,
        lastName: u.lastName,
        roleCode: u.roleCode,
        studentId: u.studentId,
        employeeId: u.employeeId,
      });
    }
  }
  console.log("✓ 12 Demo Accounts verified (password: Password123!).");

  console.log("=========================================");
  console.log("  RBAC SEEDING COMPLETED SUCCESSFULLY  ");
  console.log("=========================================");
}

if (require.main === module) {
  seedRBAC()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("[Seeder Error]:", err);
      process.exit(1);
    });
}

module.exports = seedRBAC;
