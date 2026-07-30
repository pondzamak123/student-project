/**
 * ============================================
 * Project Routes (MongoDB)
 * 
 * GET    /api/projects                    - ดึงโครงงานทั้งหมด (กรองตาม role)
 * GET    /api/projects/stats              - สถิติ Dashboard
 * GET    /api/projects/:id                - ดึงโครงงานตาม ID
 * POST   /api/projects                    - สร้างโครงงานใหม่
 * PUT    /api/projects/:id                - อัปเดตโครงงาน
 * PATCH  /api/projects/:id/status         - อัปเดตสถานะ
 * PATCH  /api/projects/:id/milestones/:mid - Toggle Milestone
 * DELETE /api/projects/:id                - ลบโครงงาน
 * 
 * ==================== Weekly Reports ====================
 * POST   /api/projects/:id/weekly-reports          - ส่งรายงานสัปดาห์
 * PUT    /api/projects/:id/weekly-reports/:rid     - แก้ไขรายงาน
 * GET    /api/projects/:id/weekly-reports/:rid/comments - ดึงความคิดเห็น
 * POST   /api/projects/:id/weekly-reports/:rid/comments - เพิ่มความคิดเห็น
 * DELETE /api/projects/:id/weekly-reports/:rid/comments/:cid - ลบความคิดเห็น
 * 
 * ==================== Files ====================
 * GET    /api/projects/:id/files                     - ไฟล์โครงงาน
 * POST   /api/projects/:id/files                     - อัปโหลดไฟล์
 * DELETE /api/projects/:id/files/:fileId             - ลบไฟล์
 * ============================================
 */
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authenticate, authorizeRole } = require('../middleware/auth');
const {
  createProjectValidation,
  updateProjectStatusValidation,
  submitWeeklyReportValidation,
  addCommentValidation,
  mongoIdValidation
} = require('../middleware/validation');

const projectCtrl = require('../controllers/projectController');
const weeklyReportCtrl = require('../controllers/weeklyReportController');
const fileCtrl = require('../controllers/fileController');

// Stats (ต้องล็อกอิน)
router.get('/stats', authenticate, projectCtrl.getDashboardStats);

// CRUD Projects (ต้องล็อกอิน)
router.get('/', authenticate, projectCtrl.getAllProjects);
router.get('/:id', authenticate, mongoIdValidation, projectCtrl.getProjectById);
router.post('/', authenticate, authorizeRole('teacher', 'admin'), createProjectValidation, projectCtrl.createProject);
router.put('/:id', authenticate, mongoIdValidation, projectCtrl.updateProject);
router.patch('/:id/status', authenticate, authorizeRole('teacher', 'admin'), mongoIdValidation, updateProjectStatusValidation, projectCtrl.updateProjectStatus);
router.patch('/:id/milestones/:milestoneId', authenticate, authorizeRole('teacher', 'admin'), projectCtrl.toggleMilestone);
router.delete('/:id', authenticate, authorizeRole('admin'), mongoIdValidation, projectCtrl.deleteProject);

// Weekly Reports
router.post('/:projectId/weekly-reports', authenticate, authorizeRole('student'), submitWeeklyReportValidation, weeklyReportCtrl.submitWeeklyReport);
router.put('/:projectId/weekly-reports/:reportId', authenticate, weeklyReportCtrl.updateWeeklyReport);

// Comments on Weekly Reports
router.get('/:projectId/weekly-reports/:reportId/comments', authenticate, weeklyReportCtrl.getComments);
router.post('/:projectId/weekly-reports/:reportId/comments', authenticate, addCommentValidation, weeklyReportCtrl.addComment);
router.delete('/:projectId/weekly-reports/:reportId/comments/:commentId', authenticate, weeklyReportCtrl.deleteComment);

// Files
router.get('/:projectId/files', authenticate, fileCtrl.getAllFiles);
router.post('/:projectId/files', authenticate, upload.array('files', 5), fileCtrl.uploadFile);
router.delete('/:projectId/files/:fileId', authenticate, fileCtrl.deleteFile);

module.exports = router;
