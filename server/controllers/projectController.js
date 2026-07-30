/**
 * ============================================
 * Project Controller
 * CRUD โครงงาน (เก็บใน MongoDB)
 * ข้อมูลผู้ใช้ (studentIds, teacherId) อ้างอิงจาก MySQL
 * ============================================
 */
const Project = require('../database/models/mongodb/Project');
const User = require('../database/models/mysql/User');

// ========================
// GET /api/projects - ดึงโครงงานทั้งหมด (กรองตาม role)
// ========================
const getAllProjects = async (req, res) => {
  try {
    let projects;
    const { role, id } = req.user;

    if (role === 'admin') {
      projects = await Project.find();
    } else if (role === 'teacher') {
      projects = await Project.find({ teacherId: id });
    } else {
      projects = await Project.find({ studentIds: id });
    }

    res.json({
      success: true,
      data: projects,
      total: projects.length
    });
  } catch (error) {
    console.error('GetAllProjects Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลโครงงาน',
      error: error.message
    });
  }
};

// ========================
// GET /api/projects/:id - ดึงโครงงานตาม ID
// ========================
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบโครงงาน'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('GetProjectById Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

// ========================
// POST /api/projects - สร้างโครงงานใหม่
// ========================
const createProject = async (req, res) => {
  try {
    const {
      title, titleEn, description, coverImage,
      studentIds, studentNames, courseCode, courseName,
      teacherId, teacherName, startDate, dueDate,
      tags, tools, milestones
    } = req.body;

    if (!title || !titleEn || !studentIds?.length || !courseCode || !teacherId) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน'
      });
    }

    // ตรวจสอบว่า studentIds มีอยู่ใน MySQL
    const users = await User.findAll({ where: { id: studentIds } });
    if (users.length !== studentIds.length) {
      return res.status(400).json({
        success: false,
        message: 'รหัสนักศึกษาบางรายการไม่ถูกต้อง'
      });
    }

    const project = await Project.create({
      title,
      titleEn,
      description: description || '',
      coverImage: coverImage || '',
      studentIds,
      studentNames: studentNames || users.map(u => u.name),
      courseCode,
      courseName: courseName || courseCode,
      teacherId,
      teacherName: teacherName || '',
      status: 'in_progress',
      progress: 0,
      startDate,
      dueDate,
      tags: tags || [],
      tools: tools || [],
      milestones: milestones || [],
      weeklyReports: [],
      files: []
    });

    res.status(201).json({
      success: true,
      data: project,
      message: 'สร้างโครงงานสำเร็จ'
    });
  } catch (error) {
    console.error('CreateProject Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการสร้างโครงงาน',
      error: error.message
    });
  }
};

// ========================
// PUT /api/projects/:id - อัปเดตโครงงาน
// ========================
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบโครงงาน'
      });
    }

    res.json({
      success: true,
      data: project,
      message: 'อัปเดตโครงงานสำเร็จ'
    });
  } catch (error) {
    console.error('UpdateProject Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปเดต',
      error: error.message
    });
  }
};

// ========================
// PATCH /api/projects/:id/status - อัปเดตสถานะโครงงาน
// ========================
const updateProjectStatus = async (req, res) => {
  try {
    const { status, grade } = req.body;
    const allowedStatuses = ['in_progress', 'submitted', 'reviewed', 'approved', 'overdue'];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'สถานะไม่ถูกต้อง'
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (grade) updateData.grade = grade;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบโครงงาน'
      });
    }

    res.json({
      success: true,
      data: project,
      message: 'อัปเดตสถานะสำเร็จ'
    });
  } catch (error) {
    console.error('UpdateStatus Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

// ========================
// PATCH /api/projects/:id/milestones/:milestoneId - Toggle Milestone
// ========================
const toggleMilestone = async (req, res) => {
  try {
    const { id: projectId, milestoneId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบโครงงาน'
      });
    }

    const milestone = project.milestones.find(m => m.id === milestoneId);
    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบ Milestone'
      });
    }

    milestone.completed = !milestone.completed;
    await project.save();

    // คำนวณ progress ใหม่
    const completedCount = project.milestones.filter(m => m.completed).length;
    project.progress = Math.round((completedCount / project.milestones.length) * 100);
    await project.save();

    res.json({
      success: true,
      data: project,
      message: 'อัปเดต Milestone สำเร็จ'
    });
  } catch (error) {
    console.error('ToggleMilestone Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

// ========================
// DELETE /api/projects/:id - ลบโครงงาน
// ========================
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบโครงงาน'
      });
    }

    res.json({
      success: true,
      message: 'ลบโครงงานสำเร็จ'
    });
  } catch (error) {
    console.error('DeleteProject Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

// ========================
// GET /api/projects/stats - สถิติ Dashboard
// ========================
const getDashboardStats = async (req, res) => {
  try {
    const { role, id } = req.user;
    let filter = {};

    if (role === 'teacher') {
      filter = { teacherId: id };
    } else if (role === 'student') {
      filter = { studentIds: id };
    }

    const projects = await Project.find(filter);
    const total = projects.length;
    const inProgress = projects.filter(p => p.status === 'in_progress').length;
    const done = projects.filter(p => p.status === 'approved' || p.status === 'reviewed').length;
    const overdue = projects.filter(p => p.status === 'overdue').length;
    const submitted = projects.filter(p => p.status === 'submitted').length;
    const avgProgress = total ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / total) : 0;

    res.json({
      success: true,
      data: {
        total,
        inProgress,
        done,
        overdue,
        submitted,
        avgProgress
      }
    });
  } catch (error) {
    console.error('GetStats Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  updateProjectStatus,
  toggleMilestone,
  deleteProject,
  getDashboardStats
};
