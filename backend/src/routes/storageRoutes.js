// ============================================================================
// ☁️ APEX UNIVERSITY ERP — STORAGE & MEDIA ROUTES
// ============================================================================
// Route Mount: /api/v1/storage
// Authentication: Protected via authGuard middleware
// ============================================================================

const express = require("express");
const router = express.Router();
const StorageController = require("../controllers/storageController");
const authGuard = require("../middleware/authGuard");

// Enforce authenticated sessions for all storage interactions
router.use(authGuard);

// ============================================================================
// 1. AWS S3 PRE-SIGNED UPLOAD & DOWNLOAD ENDPOINTS
// ============================================================================

// Generates time-bounded pre-signed URL for direct browser uploads to AWS S3
router.get("/s3/presigned-upload", StorageController.getS3UploadUrl);

// Generates time-bounded pre-signed URL for downloading private academic documents
router.get("/s3/presigned-download", StorageController.getS3DownloadUrl);

// ============================================================================
// 2. CLOUDINARY MEDIA SIGNATURE ENDPOINTS
// ============================================================================

// Generates signed payload for client-side direct media & video uploads
router.get("/cloudinary/signature", StorageController.getCloudinarySignature);

// ============================================================================
// 3. COURSE MATERIALS (AWS S3) & VIDEO LECTURES (CLOUDINARY) REPOSITORY
// ============================================================================

// Lists academic course documents (PDFs, slides, syllabi) stored in AWS S3
router.get("/course-materials/:offeringId", StorageController.getCourseMaterials);

// Lists high-definition video lecture streams and playlists via Cloudinary CDN
router.get("/video-lectures/:offeringId", StorageController.getVideoLectures);

module.exports = router;
