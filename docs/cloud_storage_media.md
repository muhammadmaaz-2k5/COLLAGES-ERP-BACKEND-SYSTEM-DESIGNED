# ☁️ Cloud Storage & Multimedia Streaming Architecture (AWS S3 & Cloudinary)

This document defines the architectural specification, security invariants, pre-signed URL lifecycle, and CDN delivery topologies for **AWS S3 Object Storage** and **Cloudinary Media Streaming** in the University ERP.

---

## 1. Dual-Provider Storage Topology

To optimize throughput, cost, and high-performance CDN delivery, the University ERP utilizes a dual-tier cloud storage architecture:

```
                            ┌─────────────────────────────────────────┐
                            │    UNIVERSITY ERP ACADEMIC ENGINE       │
                            │        (Express / Node.js API)          │
                            └────────────────────┬────────────────────┘
                                                 │
                   ┌─────────────────────────────┴─────────────────────────────┐
                   ▼                                                           ▼
    ┌─────────────────────────────┐                             ┌─────────────────────────────┐
    │       AWS S3 BUCKET         │                             │       CLOUDINARY CDN        │
    │  (Documents & Submissions)  │                             │  (Videos & Rich Media)      │
    └──────────────┬──────────────┘                             └──────────────┬──────────────┘
                   │                                                           │
     • Course Syllabus PDFs                                       • HD Recorded Video Lectures
     • Lecture Slide Decks                                        • Laboratory Video Replays
     • Student Assignment Submissions                             • Student & Faculty Avatars
     • Digital Transcripts & Vouchers                             • Verified Credential Badges
```

---

## 2. AWS S3 Object Storage Engine

### S3 Directory Structure
```
apex-university-erp-storage/
├── academic/
│   ├── materials/
│   │   └── {offeringId}/               # Course syllabi, slides, past papers, lab handouts
│   ├── submissions/
│   │   └── {studentId}/                # Student assignment submissions (PDF, ZIP, DOCX)
│   └── transcripts/
│       └── {studentId}/                # Cryptographically signed transcript PDFs
└── finance/
    └── challans/
        └── {challanNo}/                # Downloadable Fee Challan PDFs
```

### Pre-Signed URL Lifecycle & Security
1. **Direct Browser-to-S3 Uploads**:
   * Client requests upload authorization: `GET /api/v1/storage/s3/presigned-upload?fileName=...&fileType=...`
   * Backend generates a time-bounded (15 minutes), single-use pre-signed URL with `x-amz-acl: private`.
   * Client uploads payload directly to AWS S3, offloading server bandwidth.
2. **Time-Bounded Pre-Signed Downloads**:
   * Private academic documents are accessed via `GET /api/v1/storage/s3/presigned-download?fileKey=...` (expires in 1 hour).

---

## 3. Cloudinary High-Performance Video & Media Streaming

### Capabilities
* **Adaptive Video Streaming**: Delivers multi-bitrate HLS and MP4 streams based on client network bandwidth.
* **Automated Media Transcoding**: Codecs (H.264, VP9) and dynamic thumbnail generation (`/video/upload/so_5,w_640,h_360/`).
* **Profile Image Optimization**: Face-detection cropping and WebP/AVIF format auto-negotiation (`q_auto,f_auto`).

---

## 4. API Endpoints

### 1. `GET /api/v1/storage/s3/presigned-upload`
* **Access**: Authenticated (`STUDENT`, `TEACHER`, `ADMIN`).
* **Params**: `fileName`, `fileType`, `folder`.
* **Response**: Returns pre-signed S3 `uploadUrl`, `fileKey`, and upload headers.

### 2. `GET /api/v1/storage/s3/presigned-download`
* **Access**: Authenticated.
* **Params**: `fileKey`.
* **Response**: Returns pre-signed S3 `downloadUrl` with expiry.

### 3. `GET /api/v1/storage/course-materials/:offeringId`
* **Access**: Authenticated.
* **Response**: Returns list of S3 documents (title, category, file size, download URL).

### 4. `GET /api/v1/storage/video-lectures/:offeringId`
* **Access**: Authenticated.
* **Response**: Returns list of Cloudinary HD video streams, playlists, and timestamps.
