// ============================================================================
// 💼 APEX UNIVERSITY ERP — CAREER PLACEMENTS & RESEARCH GRANTS SERVICE
// ============================================================================
// Core business engine for campus recruitment job postings, student application
// pipelines, faculty research projects, and DOI-indexed publication grants.
// ============================================================================

const AuditService = require("./auditService");

// Campus Recruitment Jobs Store
let recruitmentJobsStore = [
  {
    id: "job_01",
    companyName: "Systems Limited",
    companyLogoUrl: "/logos/systems.png",
    jobTitle: "Associate Software Engineer (.NET / React)",
    jobType: "FULL_TIME",
    location: "Lahore, Pakistan (Hybrid)",
    salaryScalePKR: "120,000 - 150,000 / month",
    minCGPA: 3.0,
    openPositions: 15,
    applicationDeadline: "2026-09-30",
    tags: ["C#", ".NET Core", "React", "SQL Server"],
    description: "Seeking motivated graduating seniors for our enterprise software development team.",
    eligibilityDepartments: ["Computer Science", "Software Engineering", "Information Technology"],
    status: "ACTIVE",
    totalApplicants: 42,
  },
  {
    id: "job_02",
    companyName: "Afiniti AI Labs",
    companyLogoUrl: "/logos/afiniti.png",
    jobTitle: "Junior AI & Data Scientist",
    jobType: "FULL_TIME",
    location: "Islamabad, Pakistan (Onsite)",
    salaryScalePKR: "160,000 - 200,000 / month",
    minCGPA: 3.3,
    openPositions: 8,
    applicationDeadline: "2026-10-15",
    tags: ["Python", "PyTorch", "NLP", "Machine Learning"],
    description: "Work on cutting-edge behavioral AI algorithms and predictive behavioral models.",
    eligibilityDepartments: ["Computer Science", "Artificial Intelligence", "Data Science"],
    status: "ACTIVE",
    totalApplicants: 28,
  },
  {
    id: "job_03",
    companyName: "Habib Bank Limited (HBL)",
    companyLogoUrl: "/logos/hbl.png",
    jobTitle: "FinTech Management Trainee Officer (MTO)",
    jobType: "MANAGEMENT_TRAINEE",
    location: "Karachi / Lahore, Pakistan",
    salaryScalePKR: "130,000 - 160,000 / month",
    minCGPA: 3.0,
    openPositions: 20,
    applicationDeadline: "2026-09-20",
    tags: ["FinTech", "Banking", "Business Analysis", "Financial Risk"],
    description: "Fast-track leadership program for business and technology graduates.",
    eligibilityDepartments: ["Computer Science", "Business Administration", "Accounting & Finance"],
    status: "ACTIVE",
    totalApplicants: 35,
  },
];

// Student Job Applications Store
let jobApplicationsStore = [
  {
    id: "app_01",
    jobId: "job_01",
    jobTitle: "Associate Software Engineer (.NET / React)",
    companyName: "Systems Limited",
    studentId: "std_01",
    studentRollNo: "2024-CS-001",
    studentName: "Muhammad Hamza",
    studentCGPA: 3.82,
    department: "Computer Science",
    resumeUrl: "/resumes/hamza_cv.pdf",
    status: "INTERVIEW_SCHEDULED",
    appliedAt: "2026-08-18T10:00:00Z",
    interviewDate: "2026-09-08 11:30 AM",
    interviewVenue: "Campus Placement Center — Boardroom A",
    remarks: "Passed online coding test with 95% score.",
  },
  {
    id: "app_02",
    jobId: "job_02",
    jobTitle: "Junior AI & Data Scientist",
    companyName: "Afiniti AI Labs",
    studentId: "std_02",
    studentRollNo: "2024-CS-002",
    studentName: "Ayesha Malik",
    studentCGPA: 3.91,
    department: "Computer Science",
    resumeUrl: "/resumes/ayesha_cv.pdf",
    status: "SHORTLISTED",
    appliedAt: "2026-08-20T14:30:00Z",
    interviewDate: null,
    interviewVenue: null,
    remarks: "Top 5% candidate for AI Research team.",
  },
];

// Faculty Research Grants & Projects Store
let researchGrantsStore = [
  {
    id: "res_01",
    projectTitle: "Autonomous Edge AI for Smart Precision Agriculture in Indus Basin",
    grantAgency: "Higher Education Commission (HEC) National Research Program",
    grantNumber: "HEC-NRPU-2026-8812",
    principalInvestigator: "Dr. Tariq Mahmood",
    investigatorEmail: "tariq.mahmood@apex.edu.pk",
    department: "Computer Science",
    fundingAmountPKR: 15400000,
    startDate: "2026-01-01",
    durationMonths: 24,
    status: "APPROVED",
    doiLink: "https://doi.org/10.1109/AGRI-AI.2026.104429",
    indexedJournal: "IEEE Transactions on Agri-Food Electronics (Impact Factor: 6.8)",
    coInvestigators: ["Dr. Salman Qureshi", "Engr. Sarah Khan"],
  },
  {
    id: "res_02",
    projectTitle: "Federated Learning for Privacy-Preserving Electronic Health Records (EHR)",
    grantAgency: "IGNITE National Technology Fund (R&D)",
    grantNumber: "IGNITE-NGIRI-2026-4411",
    principalInvestigator: "Dr. Samina Riaz",
    investigatorEmail: "samina.riaz@apex.edu.pk",
    department: "Software Engineering",
    fundingAmountPKR: 8500000,
    startDate: "2026-03-01",
    durationMonths: 18,
    status: "IN_PROGRESS",
    doiLink: "https://doi.org/10.1016/j.jbi.2026.103988",
    indexedJournal: "Elsevier Journal of Biomedical Informatics (Impact Factor: 4.5)",
    coInvestigators: ["Dr. Asim Jamil"],
  },
];

class PlacementService {
  // ==========================================================================
  // 1. PLACEMENT & RESEARCH OVERVIEW METRICS
  // ==========================================================================

  static async getOverview() {
    const totalPartnerEmployers = 48;
    const activeJobOpenings = recruitmentJobsStore.length + 18;
    const totalApplicationsSubmitted = jobApplicationsStore.length + 184;
    const placedStudents = 142;
    const averageStartingSalaryPKR = 145000;
    const totalResearchFundingPKR = researchGrantsStore.reduce((sum, g) => sum + g.fundingAmountPKR, 0) + 12000000;
    const publishedPapers = 34;

    return {
      metrics: {
        totalPartnerEmployers,
        activeJobOpenings,
        totalApplicationsSubmitted,
        placedStudents,
        averageStartingSalaryPKR,
        totalResearchFundingPKR,
        publishedPapers,
      },
      featuredJobs: recruitmentJobsStore.slice(0, 4),
      recentApplications: jobApplicationsStore.slice(0, 5),
      activeResearchGrants: researchGrantsStore.slice(0, 4),
    };
  }

  // ==========================================================================
  // 2. CAMPUS RECRUITMENT JOBS
  // ==========================================================================

  static async getJobs({ department, jobType, search } = {}) {
    let list = [...recruitmentJobsStore];

    if (jobType && jobType !== "ALL") {
      list = list.filter((j) => j.jobType === jobType);
    }
    if (department && department !== "ALL") {
      list = list.filter((j) => j.eligibilityDepartments.includes(department));
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (j) =>
          j.jobTitle.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q) ||
          j.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return list;
  }

  static async postJob(payload, req) {
    const newJob = {
      id: `job_${Date.now()}`,
      companyName: payload.companyName,
      companyLogoUrl: payload.companyLogoUrl || "/logos/generic-company.png",
      jobTitle: payload.jobTitle,
      jobType: payload.jobType || "FULL_TIME",
      location: payload.location || "Lahore, Pakistan",
      salaryScalePKR: payload.salaryScalePKR || "100,000 - 140,000 / month",
      minCGPA: Number(payload.minCGPA) || 3.0,
      openPositions: Number(payload.openPositions) || 5,
      applicationDeadline: payload.applicationDeadline || "2026-10-31",
      tags: payload.tags || ["Software", "Engineering"],
      description: payload.description || "Exciting career opportunity for graduating students.",
      eligibilityDepartments: payload.eligibilityDepartments || ["Computer Science"],
      status: "ACTIVE",
      totalApplicants: 0,
    };

    recruitmentJobsStore.unshift(newJob);

    await AuditService.logAction({
      userId: req?.user?.id || "placement_officer",
      userEmail: req?.user?.email,
      action: "PLACEMENT.JOB_POSTED",
      entityType: "RecruitmentJob",
      entityId: newJob.id,
      details: { companyName: newJob.companyName, jobTitle: newJob.jobTitle },
      ipAddress: req?.ip,
      userAgent: req?.headers ? req.headers["user-agent"] : null,
    });

    return newJob;
  }

  // ==========================================================================
  // 3. STUDENT APPLICATIONS PIPELINE
  // ==========================================================================

  static async getApplications({ jobId, status } = {}) {
    let list = [...jobApplicationsStore];
    if (jobId) {
      list = list.filter((a) => a.jobId === jobId);
    }
    if (status && status !== "ALL") {
      list = list.filter((a) => a.status === status);
    }
    return list;
  }

  static async applyForJob(payload, req) {
    const { jobId, studentRollNo, studentName, studentCGPA, department } = payload;
    const job = recruitmentJobsStore.find((j) => j.id === jobId);
    if (!job) throw new Error("Recruitment job not found");

    if (Number(studentCGPA) < job.minCGPA) {
      throw new Error(`Minimum CGPA requirement is ${job.minCGPA}. Your current CGPA is ${studentCGPA}.`);
    }

    const newApp = {
      id: `app_${Date.now()}`,
      jobId: job.id,
      jobTitle: job.jobTitle,
      companyName: job.companyName,
      studentId: `std_${Date.now()}`,
      studentRollNo,
      studentName: studentName || "Graduating Senior",
      studentCGPA: Number(studentCGPA),
      department: department || "Computer Science",
      resumeUrl: payload.resumeUrl || "/resumes/default_cv.pdf",
      status: "SUBMITTED",
      appliedAt: new Date().toISOString(),
      interviewDate: null,
      interviewVenue: null,
      remarks: "Application received and queued for corporate screening.",
    };

    jobApplicationsStore.unshift(newApp);
    job.totalApplicants += 1;

    await AuditService.logAction({
      userId: req?.user?.id || "student",
      userEmail: req?.user?.email,
      action: "PLACEMENT.JOB_APPLIED",
      entityType: "JobApplication",
      entityId: newApp.id,
      details: { studentRollNo, jobTitle: job.jobTitle, company: job.companyName },
      ipAddress: req?.ip,
      userAgent: req?.headers ? req.headers["user-agent"] : null,
    });

    return newApp;
  }

  // ==========================================================================
  // 4. FACULTY RESEARCH GRANTS & DOI PUBLICATIONS
  // ==========================================================================

  static async getResearchGrants() {
    return researchGrantsStore;
  }

  static async submitResearchGrant(payload, req) {
    const newGrant = {
      id: `res_${Date.now()}`,
      projectTitle: payload.projectTitle,
      grantAgency: payload.grantAgency || "Higher Education Commission (HEC)",
      grantNumber: payload.grantNumber || `HEC-NRPU-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      principalInvestigator: payload.principalInvestigator,
      investigatorEmail: payload.investigatorEmail || "pi@apex.edu.pk",
      department: payload.department || "Computer Science",
      fundingAmountPKR: Number(payload.fundingAmountPKR) || 5000000,
      startDate: payload.startDate || new Date().toISOString().split("T")[0],
      durationMonths: Number(payload.durationMonths) || 24,
      status: "APPROVED",
      doiLink: payload.doiLink || "https://doi.org/10.1109/APEX.2026.001",
      indexedJournal: payload.indexedJournal || "IEEE Access (Impact Factor: 3.9)",
      coInvestigators: payload.coInvestigators || [],
    };

    researchGrantsStore.unshift(newGrant);

    await AuditService.logAction({
      userId: req?.user?.id || "faculty",
      userEmail: req?.user?.email,
      action: "RESEARCH.GRANT_SUBMITTED",
      entityType: "ResearchGrant",
      entityId: newGrant.grantNumber,
      details: { projectTitle: newGrant.projectTitle, funding: newGrant.fundingAmountPKR },
      ipAddress: req?.ip,
      userAgent: req?.headers ? req.headers["user-agent"] : null,
    });

    return newGrant;
  }
}

module.exports = PlacementService;
