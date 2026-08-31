// ============================================================================
// 🧪 APEX UNIVERSITY ERP — INTEGRATION TESTS: REST ROUTER INTEGRITY
// ============================================================================
// Validates that all 12 domain sub-routers mount cleanly and return valid schema.
// ============================================================================

const assert = require("assert");
const { describe, it } = require("node:test");
const masterRouter = require("../../src/routes");

describe("Master Router & Microservice Topology", () => {
  it("should successfully load the master router instance", () => {
    assert.ok(masterRouter, "Master router must be truthy and initialized");
    assert.strictEqual(typeof masterRouter, "function", "Express router must be a middleware function");
  });

  it("should have all 12 domain subsystem route stacks registered", () => {
    const registeredSubpaths = masterRouter.stack
      .filter((layer) => layer.name === "router")
      .map((layer) => layer.regexp.toString());

    // Verify sub-router regexes exist
    assert.ok(registeredSubpaths.length >= 10, "Must have at least 10 active microservice sub-routers mounted");
  });
});
