/**
 * ============================================
 * Weekly Report Controller
 * จัดการรายงานประจำสัปดาห์ (เก็บใน MongoDB)
 * ============================================
 */
const Project = require('../database/models/mongodb/Project');

// ========================
// POST /api/projects/:projectId/weekly-reports - ส่งรายงานสัปดาห์
// ========================
const submitWeeklyReport = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { week, description, progress, issues, nextPlan, files } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;

    if (!week || !description) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกสัปดาห์และคำอธิบาย'
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบโครงงาน'
      });
    }

    // ตรวจสอบว่าผู้ใช้เป็นส่วนหนึ่งของโครงงานนี้
    if (!project.studentIds.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: 'ไม่มีสิทธิ์ส่งรายงานสำหรับโครงงานนี้'
      });
    }

    // ตรวจสอบว่าสัปดาห์นี้เคยส่งไปแล้วหรือยัง
    const existingReport = project.weeklyReports.find(r => r.week === week);
    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: 'รายงานสัปดาห์ที่ ' + week + ' ถูกส่งไปแล้ว'
      });
    }

    const newReport = {
      week,
      description,
      progress: progress || 0,
      issues: issues || '',
      nextPlan: nextPlan || '',
      files: files || [],
      comments: [],
      status: 'pending',
      submittedAt: new Date().toISOString().slice(0, 10)
    };

    project.weeklyReports.push(newReport);
    project.progress = Math.max(project.progress, progress || 0);
    await project.save();

    res.status(201).json({
      success: true,
      data: newReport,
      message: 'ส่งรายงานสำเร็จ'
    });
  } catch (error) {
    console.error('SubmitReport Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

// ========================
// PUT /api/projects/:projectId/weekly-reports/:reportId - แก้ไขรายงาน
// ========================
const updateWeeklyReport = async (req, res) => {
  try {
    const { projectId, reportId } = req.params;
    const { description, progress, issues, nextPlan, files } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบโครงงาน'
      });
    }

    const reportIndex = project.weeklyReports.findIndex(r => r.id === reportId);
    if (reportIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบรายงาน'
      });
    }

    if (description) project.weeklyReports[reportIndex].description = description;
    if (progress !== undefined) project.weeklyReports[reportIndex].progress = progress;
    if (issues !== undefined) project.weeklyReports[reportIndex].issues = issues;
    if (nextPlan !== undefined) project.weeklyReports[reportIndex].nextPlan = nextPlan;
    if (files !== undefined) project.weeklyReports[reportIndex].files = files;

    await project.save();

    res.json({
      success: true,
      data: project.weeklyReports[reportIndex],
      message: 'แก้ไขรายงานสำเร็จ'
    });
  } catch (error) {
    console.error('UpdateReport Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

// ========================
// POST /api/projects/:projectId/weekly-reports/:reportId/comments - เพิ่มความคิดเห็น
// ========================
const addComment = async (req, res) => {
  try {
    const { projectId, reportId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกความคิดเห็น'
      });
    }

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

    const comment = {
      id: `c_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: req.user.id,
      authorName: req.user.name,
      authorRole: req.user.role,
      content: content.trim(),
      createdAt: new Date().toISOString().slice(0, 10)
    };

    report.comments.push(comment);

    // ถ้า teacher ตอบ กลับ status เป็น reviewed
    if (req.user.role === 'teacher') {
      report.status = 'reviewed';
    }

    await project.save();

    res.status(201).json({
      success: true,
      data: comment,
      message: 'เพิ่มความคิดเห็นสำเร็จ'
    });
  } catch (error) {
    console.error('AddComment Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

// ========================
// DELETE /api/projects/:projectId/weekly-reports/:reportId/comments/:commentId
// ลบความคิดเห็น
// ========================
const deleteComment = async (req, res) => {
  try {
    const { projectId, reportId, commentId } = req.params;

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

    const commentIndex = report.comments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบความคิดเห็น'
      });
    }

    report.comments.splice(commentIndex, 1);
    await project.save();

    res.json({
      success: true,
      message: 'ลบความคิดเห็นสำเร็จ'
    });
  } catch (error) {
    console.error('DeleteComment Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

// ========================
// GET /api/projects/:projectId/weekly-reports/:reportId/comments - ดึงความคิดเห็นทั้งหมด
// ========================
const getComments = async (req, res) => {
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
      data: report.comments
    });
  } catch (error) {
    console.error('GetComments Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

module.exports = {
  submitWeeklyReport,
  updateWeeklyReport,
  addComment,
  deleteComment,
  getComments
};
