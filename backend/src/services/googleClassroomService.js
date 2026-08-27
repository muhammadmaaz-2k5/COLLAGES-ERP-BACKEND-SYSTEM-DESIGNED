const https = require("https");
const { URL, URLSearchParams } = require("url");
const { CourseOffering, Course, Assignment, AssignmentSubmission, User, Student } = require("../models");
const AuditService = require("./auditService");

class GoogleClassroomService {
  static getClientId() {
    return process.env.GOOGLE_CLIENT_ID || "";
  }

  static getClientSecret() {
    return process.env.GOOGLE_CLIENT_SECRET || "";
  }

  static getApiKey() {
    return process.env.GOOGLE_API_KEY || "";
  }

  static getRedirectUri() {
    return process.env.GOOGLE_REDIRECT_URI || "http://localhost:5000/api/v1/google-classroom/callback";
  }

  static getFrontendOrigin() {
    return process.env.GOOGLE_FRONTEND_ORIGIN || "http://localhost:3000";
  }

  /**
   * Generates standard Google OAuth 2.0 Authorization URL with Classroom Scopes
   */
  static getAuthorizationUrl(state = "") {
    const scopes = [
      "https://www.googleapis.com/auth/classroom.courses",
      "https://www.googleapis.com/auth/classroom.rosters",
      "https://www.googleapis.com/auth/classroom.coursework.students",
      "https://www.googleapis.com/auth/classroom.announcements",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ];

    const params = new URLSearchParams({
      client_id: this.getClientId(),
      redirect_uri: this.getRedirectUri(),
      response_type: "code",
      scope: scopes.join(" "),
      access_type: "offline",
      prompt: "consent",
      state: state || "google-classroom-erp-sync",
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * Helper: HTTP request wrapper for Google OAuth & Classroom APIs
   */
  static makeHttpRequest(options, bodyData = null) {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let rawData = "";
        res.on("data", (chunk) => {
          rawData += chunk;
        });
        res.on("end", () => {
          try {
            const parsed = rawData ? JSON.parse(rawData) : {};
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(parsed);
            } else {
              resolve({
                error: true,
                statusCode: res.statusCode,
                message: parsed.error_description || parsed.error?.message || "Google API Error",
                details: parsed,
              });
            }
          } catch (e) {
            resolve({ error: true, statusCode: res.statusCode, raw: rawData });
          }
        });
      });

      req.on("error", (err) => reject(err));
      if (bodyData) req.write(bodyData);
      req.end();
    });
  }

  /**
   * Exchanges Authorization Code for Access & Refresh Tokens
   */
  static async exchangeCodeForTokens(code) {
    const postData = new URLSearchParams({
      code,
      client_id: this.getClientId(),
      client_secret: this.getClientSecret(),
      redirect_uri: this.getRedirectUri(),
      grant_type: "authorization_code",
    }).toString();

    const options = {
      hostname: "oauth2.googleapis.com",
      path: "/token",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    return await this.makeHttpRequest(options, postData);
  }

  /**
   * Fetch courses for authenticated teacher/student from Google Classroom API
   */
  static async listClassroomCourses(accessToken) {
    const apiKey = this.getApiKey();
    const options = {
      hostname: "classroom.googleapis.com",
      path: "/v1/courses?courseStates=ACTIVE",
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-goog-api-key": apiKey,
        Accept: "application/json",
      },
    };

    return await this.makeHttpRequest(options);
  }

  /**
   * Provision or sync an ERP CourseOffering into Google Classroom
   */
  static async syncOfferingToClassroom(offeringId, accessToken) {
    const offering = await CourseOffering.findByPk(offeringId, {
      include: [{ model: Course, as: "course" }],
    });

    if (!offering) throw new Error("Course offering not found");

    const apiKey = this.getApiKey();
    const coursePayload = JSON.stringify({
      name: `${offering.course?.title || "University Course"} (${offering.course?.code || "CS-401"})`,
      section: `Section ${offering.section || "A"} • ${offering.semesterName || "Fall 2026"}`,
      descriptionHeading: "Apex University Management ERP Synced Course",
      description: `Course offering managed via Enterprise ERP. Lecture Schedule: ${offering.schedule || "TBA"} • Room: ${offering.room || "TBA"}`,
      room: offering.room || "Lab 304",
      ownerId: "me",
      courseState: "ACTIVE",
    });

    const options = {
      hostname: "classroom.googleapis.com",
      path: "/v1/courses",
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-goog-api-key": apiKey,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(coursePayload),
      },
    };

    const res = await this.makeHttpRequest(options, coursePayload);
    return res;
  }

  /**
   * Synchronize an Assignment to Google Classroom CourseWork stream
   */
  static async syncCourseWork(assignmentId, classroomCourseId, accessToken) {
    const assignment = await Assignment.findByPk(assignmentId);
    if (!assignment) throw new Error("Assignment not found");

    const apiKey = this.getApiKey();
    const dueDate = new Date(assignment.dueDate);

    const workPayload = JSON.stringify({
      title: assignment.title,
      description: assignment.description || "Coursework submission required via ERP portal or Classroom.",
      maxPoints: assignment.maxMarks || 100,
      workType: "ASSIGNMENT",
      state: "PUBLISHED",
      dueDate: {
        year: dueDate.getFullYear(),
        month: dueDate.getMonth() + 1,
        day: dueDate.getDate(),
      },
      dueTime: {
        hours: 23,
        minutes: 59,
      },
    });

    const options = {
      hostname: "classroom.googleapis.com",
      path: `/v1/courses/${classroomCourseId}/courseWork`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-goog-api-key": apiKey,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(workPayload),
      },
    };

    return await this.makeHttpRequest(options, workPayload);
  }
}

module.exports = GoogleClassroomService;
