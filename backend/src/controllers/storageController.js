const StorageService = require("../services/storageService");
const AuditService = require("../services/auditService");

class StorageController {
  /**
   * GET /api/v1/storage/s3/presigned-upload
   * Generate pre-signed URL for direct browser-to-S3 document uploads
   */
  static async getS3UploadUrl(req, res, next) {
    try {
      const { fileName, fileType, folder } = req.query;

      if (!fileName) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "fileName query parameter is required" },
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
   * Generate pre-signed URL for downloading private S3 academic documents
   */
  static async getS3DownloadUrl(req, res, next) {
    try {
      const { fileKey } = req.query;

      if (!fileKey) {
        return res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "fileKey query parameter is required" },
        });
      }

      const result = StorageService.generateS3PresignedDownloadUrl({ fileKey });
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/storage/cloudinary/signature
   * Generate Cloudinary secure upload parameters for media & videos
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

  /**
   * GET /api/v1/storage/course-materials/:offeringId
   * Fetch all course documents (PDFs, slides, syllabi) in AWS S3 for a course offering
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
   * Fetch Cloudinary video lecture streams and media playlists for a course offering
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
          videos,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = StorageController;
