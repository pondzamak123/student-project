/**
 * ============================================
 * Settings Routes (MySQL)
 * 
 * GET  /api/settings       - ดึงการตั้งค่าทั้งหมด
 * PUT  /api/settings/:key  - แก้ไขการตั้งค่า (Admin)
 * PUT  /api/settings/bulk  - แก้ไขหลายค่าพร้อมกัน (Admin)
 * ============================================
 */
const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middleware/auth');
const settingCtrl = require('../controllers/settingController');

router.get('/', authenticate, settingCtrl.getAllSettings);
router.put('/:key', authenticate, authorizeRole('admin'), settingCtrl.updateSetting);
router.put('/bulk', authenticate, authorizeRole('admin'), settingCtrl.bulkUpdateSettings);

module.exports = router;
