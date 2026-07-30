/**
 * ============================================
 * Setting Controller (MySQL)
 * จัดการการตั้งค่าระบบ (Admin)
 * ============================================
 */
const SystemSetting = require('../database/models/mysql/SystemSetting');

// ========================
// GET /api/settings - ดึงการตั้งค่าทั้งหมด
// ========================
const getAllSettings = async (req, res) => {
  try {
    const settings = await SystemSetting.findAll();

    res.json({
      success: true,
      data: settings.reduce((acc, s) => {
        acc[s.key] = s.value;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('GetSettings Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

// ========================
// PUT /api/settings/:key - แก้ไขการตั้งค่า
// ========================
const updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value, description } = req.body;

    if (value === undefined) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุค่า'
      });
    }

    let setting = await SystemSetting.findByPk(key);
    if (setting) {
      await setting.update({ value });
      if (description !== undefined) await setting.update({ description });
    } else {
      setting = await SystemSetting.create({ key, value, description: description || '' });
    }

    res.json({
      success: true,
      data: setting,
      message: 'บันทึกการตั้งค่าสำเร็จ'
    });
  } catch (error) {
    console.error('UpdateSetting Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

// ========================
// PUT /api/settings/bulk - แก้ไขหลายค่าพร้อมกัน
// ========================
const bulkUpdateSettings = async (req, res) => {
  try {
    const settings = req.body; // { key1: value1, key2: value2, ... }

    for (const [key, value] of Object.entries(settings)) {
      await SystemSetting.upsert({ key, value: String(value) });
    }

    res.json({
      success: true,
      message: 'บันทึกการตั้งค่าทั้งหมดสำเร็จ'
    });
  } catch (error) {
    console.error('BulkUpdateSettings Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

module.exports = {
  getAllSettings,
  updateSetting,
  bulkUpdateSettings
};
