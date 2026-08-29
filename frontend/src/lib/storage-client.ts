// ============================================================================
// ☁️ APEX UNIVERSITY ERP — STORAGE & MEDIA CLIENT
// ============================================================================
// Frontend client for AWS S3 document pre-signed URLs & Cloudinary video streaming
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// ============================================================================
// 1. DATA CONTRACTS & TYPE DEFINITIONS
// ============================================================================

export interface S3CourseMaterial {
  id: string;
  offeringId: string | number;
  title: string;
  category: "SYLLABUS" | "SLIDES" | "LAB_GUIDE" | "PAST_PAPERS" | "NOTES";
  fileType: string;
  fileSize: string;
  s3Key: string;
  s3Url: string;
  uploadedBy: string;
  uploadedAt: string;
  downloadsCount: number;
}

export interface CloudinaryVideoLecture {
  id: string;
  offeringId: string | number;
  title: string;
  publicId: string;
  duration: string;
  durationSeconds: number;
  thumbnailUrl: string;
  streamUrl: string;
  hlsPlaylistUrl?: string;
  recordedDate: string;
  instructor: string;
  viewsCount: number;
}

export interface StorageResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

// ============================================================================
// 2. STORAGE & MEDIA API SERVICE CLIENT
// ============================================================================

export class StorageAPI {
  /**
   * Fetches academic course documents (PDFs, slides, past exams) stored in AWS S3
   * @param offeringId - Target Course Offering Identifier
   * @param token - Bearer Authorization Token
   */
  static async getCourseMaterials(
    offeringId: string | number,
    token?: string
  ): Promise<{ materials: S3CourseMaterial[]; bucket: string }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/storage/course-materials/${offeringId}`, { headers });
    if (!res.ok) {
      // Graceful fallback for offline demo simulations
      return {
        bucket: "collage-management-erp-storage",
        materials: [
          {
            id: `mat-${offeringId}-01`,
            offeringId,
            title: "Course Syllabus & Academic Policies (Fall 2026)",
            category: "SYLLABUS",
            fileType: "application/pdf",
            fileSize: "2.4 MB",
            s3Key: `academic/materials/${offeringId}/syllabus.pdf`,
            s3Url: `https://collage-management-erp-storage.s3.eu-north-1.amazonaws.com/academic/materials/${offeringId}/syllabus.pdf`,
            uploadedBy: "Dr. Sarah Jenkins",
            uploadedAt: "2026-08-15T09:00:00Z",
            downloadsCount: 142,
          },
          {
            id: `mat-${offeringId}-02`,
            offeringId,
            title: "Lecture Module 01-04: System Architecture & Consensus Protocols",
            category: "SLIDES",
            fileType: "application/pdf",
            fileSize: "8.7 MB",
            s3Key: `academic/materials/${offeringId}/lectures_01_04.pdf`,
            s3Url: `https://collage-management-erp-storage.s3.eu-north-1.amazonaws.com/academic/materials/${offeringId}/lectures_01_04.pdf`,
            uploadedBy: "Dr. Sarah Jenkins",
            uploadedAt: "2026-08-20T11:30:00Z",
            downloadsCount: 98,
          },
          {
            id: `mat-${offeringId}-03`,
            offeringId,
            title: "Laboratory Handout 02: gRPC Microservices & Database Sharding",
            category: "LAB_GUIDE",
            fileType: "application/pdf",
            fileSize: "1.8 MB",
            s3Key: `academic/materials/${offeringId}/lab_02.pdf`,
            s3Url: `https://collage-management-erp-storage.s3.eu-north-1.amazonaws.com/academic/materials/${offeringId}/lab_02.pdf`,
            uploadedBy: "Lab Instructor",
            uploadedAt: "2026-08-22T14:15:00Z",
            downloadsCount: 76,
          },
          {
            id: `mat-${offeringId}-04`,
            offeringId,
            title: "Mid-Term Examination Past Papers & Solutions (2023-2025)",
            category: "PAST_PAPERS",
            fileType: "application/zip",
            fileSize: "14.2 MB",
            s3Key: `academic/materials/${offeringId}/past_papers.zip`,
            s3Url: `https://collage-management-erp-storage.s3.eu-north-1.amazonaws.com/academic/materials/${offeringId}/past_papers.zip`,
            uploadedBy: "Academic Cell",
            uploadedAt: "2026-08-25T16:00:00Z",
            downloadsCount: 210,
          },
        ],
      };
    }

    const data = await res.json();
    return data.data;
  }

  /**
   * Fetches high-definition video lecture streams and playlists powered by Cloudinary CDN
   * @param offeringId - Target Course Offering Identifier
   * @param token - Bearer Authorization Token
   */
  static async getVideoLectures(
    offeringId: string | number,
    token?: string
  ): Promise<{ videos: CloudinaryVideoLecture[]; cloudName: string; uploadPreset?: string }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/storage/video-lectures/${offeringId}`, { headers });
    if (!res.ok) {
      // Graceful fallback for offline demo simulations
      return {
        cloudName: "itomku0j",
        uploadPreset: "FOODPANDA",
        videos: [
          {
            id: `vid-${offeringId}-01`,
            offeringId,
            title: "Lecture 01: Enterprise System Design & Microservice Topology",
            publicId: `lectures/${offeringId}/lec01`,
            duration: "54:20",
            durationSeconds: 3260,
            thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
            streamUrl: "https://res.cloudinary.com/itomku0j/video/upload/q_auto/lectures/cs401/lec01.mp4",
            recordedDate: "2026-08-18",
            instructor: "Dr. Sarah Jenkins",
            viewsCount: 310,
          },
          {
            id: `vid-${offeringId}-02`,
            offeringId,
            title: "Lecture 02: Relational Schema Modeling & Strict Foreign Key DAGs",
            publicId: `lectures/${offeringId}/lec02`,
            duration: "48:15",
            durationSeconds: 2895,
            thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
            streamUrl: "https://res.cloudinary.com/itomku0j/video/upload/q_auto/lectures/cs401/lec02.mp4",
            recordedDate: "2026-08-20",
            instructor: "Dr. Sarah Jenkins",
            viewsCount: 275,
          },
          {
            id: `vid-${offeringId}-03`,
            offeringId,
            title: "Lab Walkthrough: Live API Integration & JWT RS256 Guard Validation",
            publicId: `lectures/${offeringId}/lab01`,
            duration: "1:02:40",
            durationSeconds: 3760,
            thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
            streamUrl: "https://res.cloudinary.com/itomku0j/video/upload/q_auto/lectures/cs401/lab01.mp4",
            recordedDate: "2026-08-25",
            instructor: "Engr. Fatima Noor",
            viewsCount: 198,
          },
        ],
      };
    }

    const data = await res.json();
    return data.data;
  }

  /**
   * Requests a time-bounded AWS S3 Pre-signed Upload URL for Assignment File Dropzone
   */
  static async getS3UploadUrl(
    fileName: string,
    fileType: string,
    folder: string = "submissions",
    token?: string
  ): Promise<any> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(
      `${API_BASE_URL}/storage/s3/presigned-upload?fileName=${encodeURIComponent(fileName)}&fileType=${encodeURIComponent(fileType)}&folder=${encodeURIComponent(folder)}`,
      { headers }
    );
    if (!res.ok) throw new Error("Failed to generate AWS S3 upload signature");
    return res.json();
  }
}
