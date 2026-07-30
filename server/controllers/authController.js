/**
 * ============================================
 * Auth Controller
 * Login, Logout, Get Current User
 * ข้อมูลผู้ใช้เก็บใน MySQL
 * ============================================
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../database/models/mysql/User');

// ========================
// ล็อกอิน
// POST /api/auth/login
// Body: { email, password }
// ========================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอก email และ password'
      });
    }

    // ค้นหาผู้ใช้ใน MySQL
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'email หรือ password ไม่ถูกต้อง'
      });
    }

    // ตรวจสอบ password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'email หรือ password ไม่ถูกต้อง'
      });
    }

    // อัปเดต lastLogin
    await user.update({ lastLogin: new Date() });

    // สร้าง JWT Token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          department: user.department,
          studentId: user.studentId
        }
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการล็อกอิน',
      error: error.message
    });
  }
};

// ========================
// Get Current User (จาก token)
// GET /api/auth/me
// ========================
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบผู้ใช้'
      });
    }

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
      }
    });
  } catch (error) {
    console.error('GetCurrentUser Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
};

module.exports = { login, getCurrentUser };
