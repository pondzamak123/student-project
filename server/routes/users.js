/**
 * ============================================
 * User Routes (MySQL)
 * 
 * GET    /api/users           - ดึงรายชื่อผู้ใช้ทั้งหมด (Admin)
 * GET    /api/users/teachers  - ดึงรายชื่ออาจารย์
 * GET    /api/users/students  - ดึงรายชื่อนักศึกษา
 * GET    /api/users/:id       - ดึงข้อมูลผู้ใช้ตาม ID
 * POST   /api/users           - สร้างผู้ใช้ใหม่ (Admin)
 * PUT    /api/users/:id       - แก้ไขข้อมูลผู้ใช้
 * DELETE /api/users/:id       - ลบผู้ใช้ (Admin)
 * ============================================
 */
const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middleware/auth');
const { createUserValidation } = require('../middleware/validation');
const userCtrl = require('../controllers/userController');

router.get('/', authenticate, authorizeRole('admin'), userCtrl.getAllUsers);
router.get('/teachers', authenticate, userCtrl.getTeachers);
router.get('/students', authenticate, userCtrl.getStudents);
router.get('/:id', authenticate, userCtrl.getUserById);
router.post('/', authenticate, authorizeRole('admin'), createUserValidation, userCtrl.createUser);
router.put('/:id', authenticate, userCtrl.updateUser);
router.delete('/:id', authenticate, authorizeRole('admin'), userCtrl.deleteUser);

module.exports = router;
