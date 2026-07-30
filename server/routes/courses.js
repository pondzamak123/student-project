/**
 * ============================================
 * Course Routes (MySQL)
 * 
 * GET    /api/courses       - ดึงรายชื่อวิชาทั้งหมด
 * GET    /api/courses/:code - ดึงวิชาตามรหัส
 * POST   /api/courses       - เพิ่มวิชาใหม่ (Admin)
 * DELETE /api/courses/:code - ลบวิชา (Admin)
 * ============================================
 */
const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middleware/auth');
const { createCourseValidation } = require('../middleware/validation');
const courseCtrl = require('../controllers/courseController');

router.get('/', authenticate, courseCtrl.getAllCourses);
router.get('/:code', authenticate, courseCtrl.getCourseByCode);
router.post('/', authenticate, authorizeRole('admin'), createCourseValidation, courseCtrl.createCourse);
router.delete('/:code', authenticate, authorizeRole('admin'), courseCtrl.deleteCourse);

module.exports = router;
