const express = require("express");
const router = express.Router();
const StorageController = require("../controllers/storageController");
const authGuard = require("../middleware/authGuard");

// All storage operations require authenticated sessions
router.use(authGuard);

// 1. AWS S3 Pre-signed Upload & Download URLs
router.get("/s3/presigned-upload", StorageController.getS3UploadUrl);
router.get("/s3/presigned-download", StorageController.getS3DownloadUrl);

// 2. Cloudinary Media Signatures
router.get("/cloudinary/signature", StorageController.getCloudinarySignature);

// 3. Course Materials (S3) & Video Lecture Streams (Cloudinary)
router.get("/course-materials/:offeringId", StorageController.getCourseMaterials);
router.get("/video-lectures/:offeringId", StorageController.getVideoLectures);

module.exports = router;
