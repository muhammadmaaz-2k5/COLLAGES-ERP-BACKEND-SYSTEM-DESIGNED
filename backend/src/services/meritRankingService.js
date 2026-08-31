// ============================================================================
// 📊 APEX UNIVERSITY ERP — MERIT RANKING & ENTRANCE EXAM ENGINE
// ============================================================================
// Core business engine for 50/50 merit aggregate calculation, tie-breaking,
// seat quota partitioning, and multi-round merit list publication.
// ============================================================================

const AuditService = require("./auditService");

// Sample candidate test scores store
let candidateTestScores = [
  { trackingId: "ADM-2026-8491", rollNo: "ET-2026-0491", candidateName: "Muhammad Hamza", testScore: 88, testTotal: 100, programId: "prog_cs" },
  { trackingId: "ADM-2026-9204", rollNo: "ET-2026-0920", candidateName: "Zainab Fatima", testScore: 92, testTotal: 100, programId: "prog_ai" },
  { trackingId: "ADM-2026-1185", rollNo: "ET-2026-1185", candidateName: "Usman Ali", testScore: 74, testTotal: 100, programId: "prog_se" },
  { trackingId: "ADM-2026-5521", rollNo: "ET-2026-5521", candidateName: "Ayesha Malik", testScore: 95, testTotal: 100, programId: "prog_cs" },
  { trackingId: "ADM-2026-3419", rollNo: "ET-2026-3419", candidateName: "Bilal Hassan", testScore: 82, testTotal: 100, programId: "prog_cs" },
  { trackingId: "ADM-2026-7812", rollNo: "ET-2026-7812", candidateName: "Sara Ahmed", testScore: 86, testTotal: 100, programId: "prog_se" },
  { trackingId: "ADM-2026-6634", rollNo: "ET-2026-6634", candidateName: "Danyal Khan", testScore: 79, testTotal: 100, programId: "prog_bba" },
  { trackingId: "ADM-2026-2245", rollNo: "ET-2026-2245", candidateName: "Fatima Noor", testScore: 90, testTotal: 100, programId: "prog_cs" },
  { trackingId: "ADM-2026-4411", rollNo: "ET-2026-4411", candidateName: "Ali Raza", testScore: 68, testTotal: 100, programId: "prog_se" },
  { trackingId: "ADM-2026-9932", rollNo: "ET-2026-9932", candidateName: "Hira Tariq", testScore: 84, testTotal: 100, programId: "prog_bba" },
];

// Published Merit Lists Registry
let publishedMeritLists = [
  {
    id: "ml_cs_01",
    programId: "prog_cs",
    programCode: "BSCS",
    programTitle: "Bachelor of Science in Computer Science",
    termName: "Fall 2026",
    listRound: 1,
    listTitle: "1st Merit List (Open Merit)",
    publishedAt: "2026-08-30T10:00:00Z",
    feeDeadline: "2026-09-05",
    totalSeats: 120,
    selectedCount: 5,
    closingAggregate: 86.85,
    candidates: [
      {
        rank: 1,
        trackingId: "ADM-2026-5521",
        rollNo: "ET-2026-5521",
        candidateName: "Ayesha Malik",
        fatherName: "Tariq Malik",
        matricPercentage: 94.5,
        interPercentage: 93.0,
        academicScore: 93.45,
        entryTestScore: 95.0,
        finalAggregate: 94.23,
        status: "SELECTED",
      },
      {
        rank: 2,
        trackingId: "ADM-2026-2245",
        rollNo: "ET-2026-2245",
        candidateName: "Fatima Noor",
        fatherName: "Noor Ahmed",
        matricPercentage: 93.0,
        interPercentage: 91.5,
        academicScore: 91.95,
        entryTestScore: 90.0,
        finalAggregate: 90.98,
        status: "SELECTED",
      },
      {
        rank: 3,
        trackingId: "ADM-2026-8491",
        rollNo: "ET-2026-0491",
        candidateName: "Muhammad Hamza",
        fatherName: "Tariq Mahmood",
        matricPercentage: 92.7,
        interPercentage: 91.3,
        academicScore: 91.72,
        entryTestScore: 88.0,
        finalAggregate: 89.86,
        status: "SELECTED",
      },
      {
        rank: 4,
        trackingId: "ADM-2026-3419",
        rollNo: "ET-2026-3419",
        candidateName: "Bilal Hassan",
        fatherName: "Hassan Raza",
        matricPercentage: 88.0,
        interPercentage: 86.5,
        academicScore: 86.95,
        entryTestScore: 82.0,
        finalAggregate: 84.48,
        status: "WAITING_LIST",
      },
    ],
  },
  {
    id: "ml_ai_01",
    programId: "prog_ai",
    programCode: "BSAI",
    programTitle: "Bachelor of Science in Artificial Intelligence",
    termName: "Fall 2026",
    listRound: 1,
    listTitle: "1st Merit List (Open Merit)",
    publishedAt: "2026-08-30T10:00:00Z",
    feeDeadline: "2026-09-05",
    totalSeats: 60,
    selectedCount: 1,
    closingAggregate: 90.44,
    candidates: [
      {
        rank: 1,
        trackingId: "ADM-2026-9204",
        rollNo: "ET-2026-0920",
        candidateName: "Zainab Fatima",
        fatherName: "Dr. Asif Kamal",
        matricPercentage: 90.0,
        interPercentage: 88.4,
        academicScore: 88.88,
        entryTestScore: 92.0,
        finalAggregate: 90.44,
        status: "SELECTED",
      },
    ],
  },
];

class MeritRankingService {
  // ==========================================================================
  // 1. FORMULA ENGINE & AGGREGATE CALCULATION
  // ==========================================================================

  /**
   * Computes the official 50/50 academic and entrance test aggregate:
   * Academic % = (0.30 * Matric %) + (0.70 * Inter %)
   * Final Aggregate = (0.50 * Academic %) + (0.50 * Entry Test %)
   */
  static computeAggregate({ matricPercentage, interPercentage, entryTestPercentage }) {
    const academicScore = 0.3 * Number(matricPercentage) + 0.7 * Number(interPercentage);
    const finalAggregate = 0.5 * academicScore + 0.5 * Number(entryTestPercentage);
    return {
      academicScore: Number(academicScore.toFixed(2)),
      finalAggregate: Number(finalAggregate.toFixed(2)),
    };
  }

  // ==========================================================================
  // 2. BULK ENTRANCE TEST SCORE RECORDING
  // ==========================================================================

  /**
   * Bulk records or updates entrance test scores
   */
  static async recordTestScores(scoresArray, req) {
    for (const score of scoresArray) {
      const idx = candidateTestScores.findIndex(
        (c) => c.trackingId === score.trackingId || c.rollNo === score.rollNo
      );
      if (idx >= 0) {
        candidateTestScores[idx] = { ...candidateTestScores[idx], ...score };
      } else {
        candidateTestScores.push(score);
      }
    }

    await AuditService.logAction({
      userId: req?.user?.id || "admissions-officer",
      userEmail: req?.user?.email,
      action: "ADMISSIONS.TEST_SCORES_RECORDED",
      entityType: "EntranceTest",
      entityId: `BATCH_${Date.now()}`,
      details: { totalRecorded: scoresArray.length },
      ipAddress: req?.ip,
      userAgent: req?.headers ? req.headers["user-agent"] : null,
    });

    return {
      success: true,
      totalRecorded: scoresArray.length,
      scores: candidateTestScores,
    };
  }

  // ==========================================================================
  // 3. AUTOMATED MERIT LIST GENERATION & RANKING
  // ==========================================================================

  /**
   * Generates a ranked merit list for a degree program applying seat quotas and tie-breakers
   */
  static async generateMeritList({ programId, listRound = 1, seatCapacity = 60, req }) {
    // Mock candidate pool for computation
    const candidatePool = [
      { trackingId: "ADM-2026-5521", rollNo: "ET-2026-5521", candidateName: "Ayesha Malik", fatherName: "Tariq Malik", matricPct: 94.5, interPct: 93.0, testPct: 95.0 },
      { trackingId: "ADM-2026-2245", rollNo: "ET-2026-2245", candidateName: "Fatima Noor", fatherName: "Noor Ahmed", matricPct: 93.0, interPct: 91.5, testPct: 90.0 },
      { trackingId: "ADM-2026-8491", rollNo: "ET-2026-0491", candidateName: "Muhammad Hamza", fatherName: "Tariq Mahmood", matricPct: 92.7, interPct: 91.3, testPct: 88.0 },
      { trackingId: "ADM-2026-3419", rollNo: "ET-2026-3419", candidateName: "Bilal Hassan", fatherName: "Hassan Raza", matricPct: 88.0, interPct: 86.5, testPct: 82.0 },
      { trackingId: "ADM-2026-7812", rollNo: "ET-2026-7812", candidateName: "Sara Ahmed", fatherName: "Ahmed Ali", matricPct: 89.0, interPct: 87.0, testPct: 84.0 },
    ];

    // Compute aggregates and sort descending
    const rankedCandidates = candidatePool.map((c) => {
      const { academicScore, finalAggregate } = this.computeAggregate({
        matricPercentage: c.matricPct,
        interPercentage: c.interPct,
        entryTestPercentage: c.testPct,
      });

      return {
        trackingId: c.trackingId,
        rollNo: c.rollNo,
        candidateName: c.candidateName,
        fatherName: c.fatherName,
        matricPercentage: c.matricPct,
        interPercentage: c.interPct,
        academicScore,
        entryTestScore: c.testPct,
        finalAggregate,
      };
    });

    // Tie-breaker sort: finalAggregate DESC -> interPercentage DESC -> matricPercentage DESC
    rankedCandidates.sort((a, b) => {
      if (b.finalAggregate !== a.finalAggregate) return b.finalAggregate - a.finalAggregate;
      if (b.interPercentage !== a.interPercentage) return b.interPercentage - a.interPercentage;
      return b.matricPercentage - a.matricPercentage;
    });

    // Assign Ranks and Selection Status
    const quotaCutoff = 3; // First 3 selected for demo list
    const candidatesWithRanks = rankedCandidates.map((c, idx) => ({
      rank: idx + 1,
      ...c,
      status: idx < quotaCutoff ? "SELECTED" : "WAITING_LIST",
    }));

    const closingCandidate = candidatesWithRanks.filter((c) => c.status === "SELECTED").pop();

    const newMeritList = {
      id: `ml_${programId}_${Date.now()}`,
      programId,
      programCode: programId === "prog_cs" ? "BSCS" : programId === "prog_se" ? "BSSE" : "BSAI",
      programTitle: programId === "prog_cs" ? "BS Computer Science" : programId === "prog_se" ? "BS Software Engineering" : "BS Artificial Intelligence",
      termName: "Fall 2026",
      listRound: Number(listRound),
      listTitle: `${listRound}${listRound === 1 ? "st" : listRound === 2 ? "nd" : "rd"} Merit List (Open Merit)`,
      publishedAt: new Date().toISOString(),
      feeDeadline: "2026-09-08",
      totalSeats: seatCapacity,
      selectedCount: candidatesWithRanks.filter((c) => c.status === "SELECTED").length,
      closingAggregate: closingCandidate ? closingCandidate.finalAggregate : 0,
      candidates: candidatesWithRanks,
    };

    publishedMeritLists.unshift(newMeritList);

    await AuditService.logAction({
      userId: req?.user?.id || "admissions-officer",
      userEmail: req?.user?.email,
      action: "ADMISSIONS.MERIT_LIST_GENERATED",
      entityType: "MeritList",
      entityId: newMeritList.id,
      details: { programId, listRound, totalRanked: candidatesWithRanks.length, closingAggregate: newMeritList.closingAggregate },
      ipAddress: req?.ip,
      userAgent: req?.headers ? req.headers["user-agent"] : null,
    });

    return newMeritList;
  }

  // ==========================================================================
  // 4. PUBLIC MERIT LIST BROWSER
  // ==========================================================================

  /**
   * Fetches published merit lists for public access
   */
  static async getPublicMeritLists(programId = "ALL") {
    let lists = [...publishedMeritLists];
    if (programId && programId !== "ALL") {
      lists = lists.filter((l) => l.programId === programId);
    }
    return lists;
  }
}

module.exports = MeritRankingService;
