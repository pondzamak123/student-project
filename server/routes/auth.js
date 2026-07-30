/**
 * ============================================
 * Auth Routes
 * POST /api/auth/login    - ล็อกอิน
 * GET  /api/auth/me       - ดึงข้อมูลผู้ใช้ปัจจุบัน (ต้องล็อกอิน)
 * ============================================
 */
const express = require('express');
const router = express.Router();
const { login, getCurrentUser } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { loginValidation } = require('../middleware/validation');

router.post('/login', loginValidation, login);
router.get('/me', authenticate, getCurrentUser);

module.exports = router;
