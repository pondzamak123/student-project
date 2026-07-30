/**
 * ============================================
 * User Controller (MySQL)
 * จัดการข้อมูลผู้ใช้
 * ============================================
 */
const User = require('../database/models/mysql/User');
const bcrypt = require('bcryptjs');

// ========================
// GET /api/users - ดึงรายชื่อผู้ใช้ทั้งหมด (Admin only)
// ========================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'avatar', 'department', 'studentId', 'isActive', 'lastLogin', 'createdAt']
    });

    res.json({
      success: true,
      data: users,
      total: users.length
    });
  } catch (error) {
    console.error('GetAllUsers Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

// ========================
// GET /api/users/teachers - ดึงรายชื่ออาจารย์ (สำหรับเลือกใน Create Project)
// ========================
const getTeachers = async (req, res) => {
  try {
    const teachers = await User.findAll({
      where: { role: 'teacher', isActive: true },
      attributes: ['id', 'name', 'email', 'department']
    });

    res.json({
      success: true,
      data: teachers
    });
  } catch (error) {
    console.error('GetTeachers Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

// ========================
// GET /api/users/students - ดึงรายชื่อนักศึกษา (สำหรับเลือกสมาชิกโครงงาน)
// ========================
const getStudents = async (req, res) => {
  try {
    const students = await User.findAll({
      where: { role: 'student', isActive: true },
      attributes: ['id', 'name', 'email', 'studentId', 'department']
    });

    res.json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error('GetStudents Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

// ========================
// GET /api/users/:id - ดึงข้อมูลผู้ใช้ตาม ID
// ========================
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'role', 'avatar', 'department', 'studentId', 'isActive', 'lastLogin']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบผู้ใช้'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('GetUserById Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

// ========================
// POST /api/users - สร้างผู้ใช้ใหม่ (Admin only)
// ========================
const createUser = async (req, res) => {
  try {
    const { id, name, email, password, role, department, studentId } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน'
      });
    }

    // ตรวจสอบว่า email ซ้ำหรือไม่
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'อีเมลนี้ถูกใช้งานแล้ว'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const avatar = name.slice(-2);

    const user = await User.create({
      id: id || `${role[0]}${Date.now()}`,
      name,
      email,
      password: hashedPassword,
      role,
      avatar,
      department: department || '',
      studentId: studentId || null,
      isActive: true
    });

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        department: user.department,
        studentId: user.studentId
      },
      message: 'สร้างผู้ใช้สำเร็จ'
    });
  } catch (error) {
    console.error('CreateUser Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

// ========================
// PUT /api/users/:id - แก้ไขข้อมูลผู้ใช้
// ========================
const updateUser = async (req, res) => {
  try {
    const { name, email, role, department, studentId, isActive, password } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบผู้ใช้'
      });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (department) updateData.department = department;
    if (studentId !== undefined) updateData.studentId = studentId;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await user.update(updateData);

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        department: user.department,
        studentId: user.studentId
      },
      message: 'แก้ไขข้อมูลสำเร็จ'
    });
  } catch (error) {
    console.error('UpdateUser Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

// ========================
// DELETE /api/users/:id - ลบผู้ใช้ (Admin only)
// ========================
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบผู้ใช้'
      });
    }

    // ไม่ให้ลบตัวเอง
    if (req.user.id === user.id) {
      return res.status(400).json({
        success: false,
        message: 'ไม่สามารถลบตัวเองได้'
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'ลบผู้ใช้สำเร็จ'
    });
  } catch (error) {
    console.error('DeleteUser Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getTeachers,
  getStudents,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
