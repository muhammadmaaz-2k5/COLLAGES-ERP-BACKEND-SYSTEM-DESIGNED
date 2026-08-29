const crypto = require("crypto");
const AuditService = require("./auditService");

class StorageService {
  /**
   * Configuration getters for AWS S3 and Cloudinary
   */
  static getS3Config() {
    return {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "mock-s3-access-key",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "mock-s3-secret",
      region: process.env.AWS_REGION || "eu-north-1",
      bucket: process.env.AWS_S3_BUCKET || "apex-university-erp-storage",
      endpoint: process.env.AWS_S3_ENDPOINT || null,
    };
  }

  static getCloudinaryConfig() {
    return {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || "apex-university-media",
      apiKey: process.env.CLOUDINARY_API_KEY || "mock-cloudinary-key",
      apiSecret: process.env.CLOUDINARY_API_SECRET || "mock-cloudinary-secret",
      secure: process.env.CLOUDINARY_SECURE !== "false",
    };
  }

  /**
   * Generates a pre-signed S3 Upload URL / Direct Post URL for documents & submissions
   */
  static generateS3PresignedUploadUrl({ fileName, fileType, folder = "submissions", studentId = "student" }) {
    const s3 = this.getS3Config();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `academic/${folder}/${studentId}/${Date.now()}-${sanitizedFileName}`;
    
    // In production with AWS SDK: s3.getSignedUrlPromise('putObject', { ... })
    // Deterministic pre-signed upload URL simulation:
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const mockUploadUrl = `https://${s3.bucket}.s3.${s3.region}.amazonaws.com/${key}`;

    return {
      success: true,
      data: {
        uploadUrl: mockUploadUrl,
        fileKey: key,
        bucket: s3.bucket,
        region: s3.region,
        publicUrl: `https://${s3.bucket}.s3.${s3.region}.amazonaws.com/${key}`,
        expiresAt,
        headers: {
          "Content-Type": fileType || "application/octet-stream",
          "x-amz-acl": "private",
        },
      },
    };
  }

  /**
   * Generates a pre-signed S3 Download URL for secure document access
   */
  static generateS3PresignedDownloadUrl({ fileKey, expiresInSeconds = 3600 }) {
    const s3 = this.getS3Config();
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();
    const downloadUrl = `https://${s3.bucket}.s3.${s3.region}.amazonaws.com/${fileKey}?X-Amz-Expires=${expiresInSeconds}`;

    return {
      success: true,
      data: {
        fileKey,
        downloadUrl,
        expiresAt,
      },
    };
  }

  /**
   * Generates signed Cloudinary upload params for high-resolution video & media
   */
  static generateCloudinarySignature({ folder = "lectures", tags = "academic,erp" }) {
    const config = this.getCloudinaryConfig();
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    const paramsToSign = `folder=${folder}&tags=${tags}&timestamp=${timestamp}${config.apiSecret}`;
    const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

    return {
      success: true,
      data: {
        cloudName: config.cloudName,
        apiKey: config.apiKey,
        timestamp,
        signature,
        folder,
        tags,
        uploadEndpoint: `https://api.cloudinary.com/v1_1/${config.cloudName}/auto/upload`,
      },
    };
  }

  /**
   * Generates optimized Cloudinary streaming video URL with transformations
   */
  static getOptimizedCloudinaryVideoUrl(publicId, { quality = "auto", format = "mp4", width = null } = {}) {
    const config = this.getCloudinaryConfig();
    let transformation = `q_${quality},f_${format}`;
    if (width) transformation += `,w_${width}`;

    return `https://res.cloudinary.com/${config.cloudName}/video/upload/${transformation}/${publicId}.${format}`;
  }

  /**
   * Get Academic Course Materials stored in AWS S3 for a given course offering
   */
  static async getCourseMaterials(offeringId) {
    const s3 = this.getS3Config();
    
    // Standard mock course materials stored in S3 for academic offerings
    return [
      {
        id: `mat-${offeringId}-01`,
        offeringId,
        title: "Course Syllabus & Academic Policies (Fall 2026)",
        category: "SYLLABUS",
        fileType: "application/pdf",
        fileSize: "2.4 MB",
        s3Key: `academic/materials/${offeringId}/syllabus_fall2026.pdf`,
        s3Url: `https://${s3.bucket}.s3.${s3.region}.amazonaws.com/academic/materials/${offeringId}/syllabus_fall2026.pdf`,
        uploadedBy: "Dr. Asim Farooq",
        uploadedAt: "2026-08-15T09:00:00Z",
        downloadsCount: 142,
      },
      {
        id: `mat-${offeringId}-02`,
        offeringId,
        title: "Lecture Module 01-04: Architecture & Design Patterns",
        category: "SLIDES",
        fileType: "application/pdf",
        fileSize: "8.7 MB",
        s3Key: `academic/materials/${offeringId}/lectures_01_04.pdf`,
        s3Url: `https://${s3.bucket}.s3.${s3.region}.amazonaws.com/academic/materials/${offeringId}/lectures_01_04.pdf`,
        uploadedBy: "Dr. Asim Farooq",
        uploadedAt: "2026-08-20T11:30:00Z",
        downloadsCount: 98,
      },
      {
        id: `mat-${offeringId}-03`,
        offeringId,
        title: "Laboratory Handout 02: RESTful Services & Database Migration",
        category: "LAB_GUIDE",
        fileType: "application/pdf",
        fileSize: "1.8 MB",
        s3Key: `academic/materials/${offeringId}/lab_handout_02.pdf`,
        s3Url: `https://${s3.bucket}.s3.${s3.region}.amazonaws.com/academic/materials/${offeringId}/lab_handout_02.pdf`,
        uploadedBy: "Lab Instructor",
        uploadedAt: "2026-08-22T14:15:00Z",
        downloadsCount: 76,
      },
      {
        id: `mat-${offeringId}-04`,
        offeringId,
        title: "Mid-Term Examination Past Papers & Solution Keys (2023-2025)",
        category: "PAST_PAPERS",
        fileType: "application/zip",
        fileSize: "14.2 MB",
        s3Key: `academic/materials/${offeringId}/past_papers_midterms.zip`,
        s3Url: `https://${s3.bucket}.s3.${s3.region}.amazonaws.com/academic/materials/${offeringId}/past_papers_midterms.zip`,
        uploadedBy: "Academic Cell",
        uploadedAt: "2026-08-25T16:00:00Z",
        downloadsCount: 210,
      },
    ];
  }

  /**
   * Get High-Definition Video Lectures streamed via Cloudinary CDN
   */
  static async getCourseVideoLectures(offeringId) {
    const config = this.getCloudinaryConfig();

    return [
      {
        id: `vid-${offeringId}-01`,
        offeringId,
        title: "Lecture 01: Enterprise System Design & Microservice Topology",
        publicId: `lectures/${offeringId}/lec01_arch_intro`,
        duration: "54:20",
        durationSeconds: 3260,
        thumbnailUrl: `https://res.cloudinary.com/${config.cloudName}/video/upload/so_5,w_640,h_360,c_fill/lectures/${offeringId}/lec01_arch_intro.jpg`,
        streamUrl: `https://res.cloudinary.com/${config.cloudName}/video/upload/q_auto,f_mp4/lectures/${offeringId}/lec01_arch_intro.mp4`,
        hlsPlaylistUrl: `https://res.cloudinary.com/${config.cloudName}/video/upload/sp_auto/lectures/${offeringId}/lec01_arch_intro.m3u8`,
        recordedDate: "2026-08-18",
        instructor: "Dr. Asim Farooq",
        viewsCount: 310,
      },
      {
        id: `vid-${offeringId}-02`,
        offeringId,
        title: "Lecture 02: Relational Schema Modeling & Strict Foreign Key DAGs",
        publicId: `lectures/${offeringId}/lec02_schema_dag`,
        duration: "48:15",
        durationSeconds: 2895,
        thumbnailUrl: `https://res.cloudinary.com/${config.cloudName}/video/upload/so_10,w_640,h_360,c_fill/lectures/${offeringId}/lec02_schema_dag.jpg`,
        streamUrl: `https://res.cloudinary.com/${config.cloudName}/video/upload/q_auto,f_mp4/lectures/${offeringId}/lec02_schema_dag.mp4`,
        hlsPlaylistUrl: `https://res.cloudinary.com/${config.cloudName}/video/upload/sp_auto/lectures/${offeringId}/lec02_schema_dag.m3u8`,
        recordedDate: "2026-08-20",
        instructor: "Dr. Asim Farooq",
        viewsCount: 275,
      },
      {
        id: `vid-${offeringId}-03`,
        offeringId,
        title: "Lab Walkthrough: Live API Integration & JWT RS256 Guard Validation",
        publicId: `lectures/${offeringId}/lab01_jwt_auth`,
        duration: "1:02:40",
        durationSeconds: 3760,
        thumbnailUrl: `https://res.cloudinary.com/${config.cloudName}/video/upload/so_15,w_640,h_360,c_fill/lectures/${offeringId}/lab01_jwt_auth.jpg`,
        streamUrl: `https://res.cloudinary.com/${config.cloudName}/video/upload/q_auto,f_mp4/lectures/${offeringId}/lab01_jwt_auth.mp4`,
        hlsPlaylistUrl: `https://res.cloudinary.com/${config.cloudName}/video/upload/sp_auto/lectures/${offeringId}/lab01_jwt_auth.m3u8`,
        recordedDate: "2026-08-25",
        instructor: "Engr. Fatima Noor",
        viewsCount: 198,
      },
    ];
  }
}

module.exports = StorageService;
