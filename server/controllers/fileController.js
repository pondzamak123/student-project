/**
 * ============================================
 * File Controller
 * จัดการไฟล์แนบ (เก็บใน MongoDB + ไฟล์จริงใน ./uploads)
 * ============================================
 */
const Project = require('../database/models/mongodb/Project');
const path = require('path');
const fs = require('fs');

// ========================
// POST /api/projects/:projectId/files - อัปโหลดไฟล์
// ========================
const uploadFile = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'ไม่มีไฟล์ที่อัปโหลด'
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบโครงงาน'
      });
    }

    // ตรวจสอบว่าเป็น student ของโครงงานนี้หรือไม่
    if (req.user.role === 'student' && !project.studentIds.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'ไม่มีสิทธิ์อัปโหลดไฟล์'
      });
    }

    const newFiles = req.files.map(file => ({
      id: `f_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.originalname,
      size: file.size > 1024 * 1024
        ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`,
      type: path.extname(file.originalname).slice(1),
      uploadedAt: new Date().toISOString().slice(0, 10),
      uploadedBy: req.user.name
    }));

    project.files.push(...newFiles);
    await project.save();

    res.status(201).json({
      success: true,
      data: newFiles,
      message: 'อัปโหลดไฟล์สำเร็จ'
    });
  } catch (error) {
    console.error('UploadFile Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปโหลด',
      error: error.message
    });
  }
};

// ========================
// DELETE /api/projects/:projectId/files/:fileId - ลบไฟล์
// ========================
const deleteFile = async (req, res) => {
  try {
    const { projectId, fileId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบโครงงาน'
      });
    }

    const fileIndex = project.files.findIndex(f => f.id === fileId);
    if (fileIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบไฟล์'
      });
    }

    project.files.splice(fileIndex, 1);
    await project.save();

    res.json({
      success: true,
      message: 'ลบไฟล์สำเร็จ'
    });
  } catch (error) {
    console.error('DeleteFile Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

// ========================
// GET /api/files - ดึงไฟล์ทั้งหมด (สำหรับ FilesView)
// ========================
const getAllFiles = async (req, res) => {
  try {
    const { role, id } = req.user;
    let filter = {};

    if (role === 'teacher') {
      filter = { teacherId: id };
    } else if (role === 'student') {
      filter = { studentIds: id };
    }

    const projects = await Project.find(filter);
    const allFiles = projects.flatMap(p =>
      p.files.map(f => ({
        ...f.toObject(),
        projectTitle: p.title,
        projectId: p._id.toString()
      }))
    );

    res.json({
      success: true,
      data: allFiles,
      total: allFiles.length
    });
  } catch (error) {
    console.error('GetAllFiles Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

// ========================
// GET /api/projects/:projectId/weekly-reports/:reportId/files - ไฟล์ใน weekly report
// ========================
const getReportFiles = async (req, res) => {
  try {
    const { projectId, reportId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบโครงงาน'
      });
    }

    const report = project.weeklyReports.find(r => r.id === reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบรายงาน'
      });
    }

    res.json({
      success: true,
      data: report.files
    });
  } catch (error) {
    console.error('GetReportFiles Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

module.exports = {
  uploadFile,
  deleteFile,
  getAllFiles,
  getReportFiles
};
