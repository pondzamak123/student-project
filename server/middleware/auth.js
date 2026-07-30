/**
 * ============================================
 * Authentication Middleware
 * ตรวจสอบ JWT Token จาก header
 * ============================================
 */
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    // ดึง token จาก header (Bearer token)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'ไม่มี token กรุณาล็อกอินใหม่'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // เก็บข้อมูลผู้ใช้ใน req.user
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token ไม่ถูกต้อง'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token หมดอายุ กรุณาล็อกอินใหม่'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'ข้อผิดพลาดในการตรวจสอบ token'
    });
  }
};

// Middleware ตรวจสอบบทบาท
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'ยังไม่ได้ล็อกอิน'
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'ไม่มีสิทธิ์เข้าถึงหน้านี้'
      });
    }
    next();
  };
};

module.exports = { authenticate, authorizeRole };
