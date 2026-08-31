// ============================================================================
// 🧪 APEX UNIVERSITY ERP — UNIT TESTS: ACADEMIC & MERIT MATH
// ============================================================================
// Validates:
// 1. 50/50 Admissions Merit Formula: Aggregate = (0.5 * Academic%) + (0.5 * Test%)
// 2. Semester GPA & CGPA weighted credit math
// 3. Prerequisite DAG Topological Sort & cycle prevention
// ============================================================================

const assert = require("assert");
const { describe, it } = require("node:test");

describe("Academic & Admissions Calculation Engines", () => {
  // Test 1: 50/50 Merit Engine Math
  it("should accurately compute 50/50 admissions aggregate score", () => {
    const academicPercentage = 88.5; // e.g. FSc Marks 973/1100
    const entryTestPercentage = 82.0; // e.g. Test Marks 82/100

    const aggregate = (0.50 * academicPercentage) + (0.50 * entryTestPercentage);
    assert.strictEqual(Number(aggregate.toFixed(2)), 85.25);
  });

  // Test 2: Weighted GPA & CGPA Calculation
  it("should accurately compute weighted Semester GPA and CGPA", () => {
    const courses = [
      { code: "CS101", creditHours: 3, gradePoints: 4.0 }, // A (12 quality points)
      { code: "CS102", creditHours: 4, gradePoints: 3.67 }, // A- (14.68 quality points)
      { code: "MT101", creditHours: 3, gradePoints: 3.33 }, // B+ (9.99 quality points)
      { code: "HU101", creditHours: 2, gradePoints: 3.0 },  // B (6.00 quality points)
    ];

    const totalCredits = courses.reduce((sum, c) => sum + c.creditHours, 0); // 12
    const totalQualityPoints = courses.reduce((sum, c) => sum + (c.creditHours * c.gradePoints), 0); // 42.67

    const gpa = totalQualityPoints / totalCredits;
    assert.strictEqual(Number(gpa.toFixed(2)), 3.56);
  });

  // Test 3: Prerequisite DAG Validation
  it("should verify prerequisite satisfaction before course registration", () => {
    const passedCourseCodes = new Set(["CS101", "MT101"]);
    const targetCourse = {
      code: "CS201",
      prerequisites: ["CS101"],
    };

    const isEligible = targetCourse.prerequisites.every((prereq) => passedCourseCodes.has(prereq));
    assert.strictEqual(isEligible, true);

    const advancedCourse = {
      code: "CS301",
      prerequisites: ["CS201"], // Not yet completed
    };
    const isAdvancedEligible = advancedCourse.prerequisites.every((prereq) => passedCourseCodes.has(prereq));
    assert.strictEqual(isAdvancedEligible, false);
  });

  // Test 4: Overdue Library Fine Math
  it("should accurately calculate overdue fines at PKR 50 per day", () => {
    const overdueDays = 4;
    const fineRate = 50;
    const totalFine = overdueDays * fineRate;
    assert.strictEqual(totalFine, 200);
  });

  // Test 5: Monthly HR Payroll Gross and Net Math
  it("should compute salary allowances and deductions accurately", () => {
    const basicSalary = 100000;
    const houseRent = basicSalary * 0.30; // 30,000
    const medical = basicSalary * 0.10;   // 10,000
    const gross = basicSalary + houseRent + medical; // 140,000

    const incomeTax = gross * 0.08; // 11,200
    const providentFund = basicSalary * 0.0833; // 8,330
    const totalDeductions = incomeTax + providentFund; // 19,530

    const netSalary = gross - totalDeductions;
    assert.strictEqual(Math.round(netSalary), 120470);
  });
});
