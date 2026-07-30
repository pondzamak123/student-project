/**
 * ============================================
 * Validation Middleware
 * ใช้ express-validator ตรวจสอบข้อมูล input
 * ============================================
 */
const { validationResult, body, param, query } = require('express-validator');

// ========================
// Middleware: ตรวจสอบ validation result
// ========================
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'ข้อมูลไม่ถูกต้อง',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// ========================
// Auth Validations
// ========================
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('รูปแบบ email ไม่ถูกต้อง')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('กรุณากรอกรหัสผ่าน')
    .isLength({ min: 6 })
    .withMessage('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'),
  handleValidationErrors
];

// ========================
// Project Validations
// ========================
const createProjectValidation = [
  body('title')
    .notEmpty()
    .withMessage('กรุณาระบุชื่อโครงงาน')
    .isLength({ min: 5, max: 200 })
    .withMessage('ชื่อโครงงานต้องมีความยาว 5-200 ตัวอักษร'),
  body('titleEn')
    .notEmpty()
    .withMessage('กรุณาระบุชื่อโครงงานภาษาอังกฤษ')
    .isLength({ min: 5, max: 200 })
    .withMessage('ชื่อโครงงานภาษาอังกฤษต้องมีความยาว 5-200 ตัวอักษร'),
  body('studentIds')
    .isArray({ min: 1 })
    .withMessage('ต้องระบุนักศึกษาอย่างน้อย 1 คน'),
  body('courseCode')
    .notEmpty()
    .withMessage('กรุณาระบุรหัสวิชา')
    .isLength({ min: 4, max: 10 })
    .withMessage('รหัสวิชาต้องมีความยาว 4-10 ตัวอักษร'),
  body('teacherId')
    .notEmpty()
    .withMessage('กรุณาระบุอาจารย์ที่ปรึกษา'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('รูปแบบวันที่เริ่มต้นไม่ถูกต้อง'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('รูปแบบวันที่สิ้นสุดไม่ถูกต้อง'),
  handleValidationErrors
];

const updateProjectStatusValidation = [
  body('status')
    .optional()
    .isIn(['in_progress', 'submitted', 'reviewed', 'approved', 'overdue'])
    .withMessage('สถานะต้องเป็น in_progress, submitted, reviewed, approved หรือ overdue'),
  body('grade')
    .optional()
    .isIn(['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'])
    .withMessage('เกรดต้องเป็น A, B+, B, C+, C, D+, D หรือ F'),
  handleValidationErrors
];

// ========================
// Weekly Report Validations
// ========================
const submitWeeklyReportValidation = [
  body('week')
    .notEmpty()
    .withMessage('กรุณาระบุสัปดาห์ที่')
    .isInt({ min: 1, max: 52 })
    .withMessage('สัปดาห์ที่ต้องเป็นตัวเลข 1-52'),
  body('description')
    .notEmpty()
    .withMessage('กรุณาระบุรายละเอียดความคืบหน้า')
    .isLength({ min: 10 })
    .withMessage('รายละเอียดต้องมีความยาวอย่างน้อย 10 ตัวอักษร'),
  body('progress')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('ความคืบหน้าต้องเป็น 0-100'),
  handleValidationErrors
];

// ========================
// Comment Validations
// ========================
const addCommentValidation = [
  body('content')
    .notEmpty()
    .withMessage('กรุณาระบุความคิดเห็น')
    .isLength({ min: 1, max: 1000 })
    .withMessage('ความคิดเห็นต้องมีความยาว 1-1000 ตัวอักษร'),
  handleValidationErrors
];

// ========================
// User Validations
// ========================
const createUserValidation = [
  body('name')
    .notEmpty()
    .withMessage('กรุณาระบุชื่อ-นามสกุล')
    .isLength({ min: 3, max: 100 })
    .withMessage('ชื่อ-นามสกุลต้องมีความยาว 3-100 ตัวอักษร'),
  body('email')
    .isEmail()
    .withMessage('รูปแบบ email ไม่ถูกต้อง')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('กรุณากรอกรหัสผ่าน')
    .isLength({ min: 6 })
    .withMessage('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'),
  body('role')
    .isIn(['student', 'teacher', 'admin'])
    .withMessage('บทบาทต้องเป็น student, teacher หรือ admin'),
  body('department')
    .notEmpty()
    .withMessage('กรุณาระบุแผนก/ภาควิชา'),
  handleValidationErrors
];

// ========================
// Course Validations
// ========================
const createCourseValidation = [
  body('code')
    .notEmpty()
    .withMessage('กรุณาระบุรหัสวิชา')
    .isLength({ min: 4, max: 10 })
    .withMessage('รหัสวิชาต้องมีความยาว 4-10 ตัวอักษร')
    .isAlphanumeric()
    .withMessage('รหัสวิชาต้องเป็นตัวอักษรและตัวเลขเท่านั้น'),
  body('name')
    .notEmpty()
    .withMessage('กรุณาระบุชื่อวิชา')
    .isLength({ min: 5, max: 200 })
    .withMessage('ชื่อวิชาต้องมีความยาว 5-200 ตัวอักษร'),
  handleValidationErrors
];

// ========================
// ID Validation (Parameter)
// ========================
const mongoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID ไม่ถูกต้อง'),
  handleValidationErrors
];

module.exports = {
  loginValidation,
  createProjectValidation,
  updateProjectStatusValidation,
  submitWeeklyReportValidation,
  addCommentValidation,
  createUserValidation,
  createCourseValidation,
  mongoIdValidation,
  handleValidationErrors
};
