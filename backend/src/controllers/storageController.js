// ============================================================================
// ☁️ APEX UNIVERSITY ERP — STORAGE & MEDIA CONTROLLER
// ============================================================================
// Endpoints for AWS S3 pre-signed upload/download URLs and Cloudinary streaming
// ============================================================================

const StorageService = require("../services/storageService");
const AuditService = require("../services/auditService");

class StorageController {
  // ==========================================================================
  // 1. AWS S3 PRE-SIGNED UPLOAD & DOWNLOAD CONTROLLERS
  // ==========================================================================

  /**
   * GET /api/v1/storage/s3/presigned-upload
   * Generates a pre-signed URL for direct browser-to-S3 document uploads
   */
  static async getS3UploadUrl(req, res, next) {
    try {
      const { fileName, fileType, folder } = req.query;

      if (!fileName) {
        return res.status(400).json({
          success: false,
          error: {
            code: "BAD_REQUEST",
            message: "Parameter 'fileName' is required to generate an S3 pre-signed URL",
          },
        });
      }

      const result = StorageService.generateS3PresignedUploadUrl({
        fileName,
        fileType,
        folder: folder || "submissions",
        studentId: req.user?.id || "guest",
      });

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/storage/s3/presigned-download
   * Generates a secure, time-bounded URL for downloading private S3 academic documents
   */
  static async getS3DownloadUrl(req, res, next) {
    try {
      const { fileKey } = req.query;

      if (!fileKey) {
        return res.status(400).json({
          success: false,
          error: {
            code: "BAD_REQUEST",
            message: "Parameter 'fileKey' is required to generate a download URL",
          },
        });
      }

      const result = StorageService.generateS3PresignedDownloadUrl({ fileKey });
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  // ==========================================================================
  // 2. CLOUDINARY MEDIA SIGNATURE CONTROLLER
  // ==========================================================================

  /**
   * GET /api/v1/storage/cloudinary/signature
   * Generates a signed payload for client-side direct media & video uploads
   */
  static async getCloudinarySignature(req, res, next) {
    try {
      const { folder, tags } = req.query;
      const result = StorageService.generateCloudinarySignature({ folder, tags });
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  // ==========================================================================
  // 3. COURSE MATERIALS & VIDEO LECTURE REPOSITORY CONTROLLERS
  // ==========================================================================

  /**
   * GET /api/v1/storage/course-materials/:offeringId
   * Fetches academic course documents (PDFs, slides, syllabi) stored in AWS S3
   */
  static async getCourseMaterials(req, res, next) {
    try {
      const { offeringId } = req.params;
      const materials = await StorageService.getCourseMaterials(offeringId);

      return res.status(200).json({
        success: true,
        data: {
          offeringId,
          storageProvider: "AWS_S3",
          bucket: StorageService.getS3Config().bucket,
          materials,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/storage/video-lectures/:offeringId
   * Fetches high-definition video lecture streams and playlists via Cloudinary CDN
   */
  static async getVideoLectures(req, res, next) {
    try {
      const { offeringId } = req.params;
      const videos = await StorageService.getCourseVideoLectures(offeringId);

      return res.status(200).json({
        success: true,
        data: {
          offeringId,
          cdnProvider: "CLOUDINARY",
          cloudName: StorageService.getCloudinaryConfig().cloudName,
          uploadPreset: StorageService.getCloudinaryConfig().uploadPreset,
          videos,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = StorageController;
