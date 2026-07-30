/**
 * ============================================
 * Course Controller (MySQL)
 * จัดการรายวิชา
 * ============================================
 */
const Course = require('../database/models/mysql/Course');

// ========================
// GET /api/courses - ดึงรายชื่อวิชาทั้งหมด
// ========================
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: { isActive: true }
    });

    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error('GetAllCourses Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

// ========================
// GET /api/courses/:code - ดึงวิชาตามรหัส
// ========================
const getCourseByCode = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.code);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบวิชา'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('GetCourseByCode Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

// ========================
// POST /api/courses - เพิ่มวิชาใหม่ (Admin)
// ========================
const createCourse = async (req, res) => {
  try {
    const { code, name } = req.body;

    if (!code || !name) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกรหัสและชื่อวิชา'
      });
    }

    const existing = await Course.findByPk(code);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'รหัสวิชานี้มีอยู่แล้ว'
      });
    }

    const course = await Course.create({ code, name, isActive: true });

    res.status(201).json({
      success: true,
      data: course,
      message: 'เพิ่มวิชาสำเร็จ'
    });
  } catch (error) {
    console.error('CreateCourse Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

// ========================
// DELETE /api/courses/:code - ลบวิชา (Admin)
// ========================
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.code);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบวิชา'
      });
    }

    await course.update({ isActive: false });

    res.json({
      success: true,
      message: 'ลบวิชาสำเร็จ'
    });
  } catch (error) {
    console.error('DeleteCourse Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

module.exports = {
  getAllCourses,
  getCourseByCode,
  createCourse,
  deleteCourse
};
