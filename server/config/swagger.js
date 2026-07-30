/**
 * ============================================
 * Swagger / OpenAPI Configuration
 * เอกสาร API อัตโนมัติ
 * ============================================
 */
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Student Project Tracking Dashboard API',
    version: '1.0.0',
    description: `
      ระบบติดตามความคืบหน้าโครงงานนักศึกษา

      ## สถาปัตยกรรมฐานข้อมูล
      - **MySQL** (Sequelize) → เก็บข้อมูลผู้ใช้, รายวิชา, การตั้งค่าระบบ
      - **MongoDB** (Mongoose) → เก็บโครงงาน, รายงานสัปดาห์, ความคิดเห็น, ไฟล์

      ## Authentication
      ใช้ JWT Token (Bearer Token) สำหรับทุก endpoint ที่ต้องการสิทธิ์
      ล็อกอินที่ POST /api/auth/login เพื่อรับ token

      ## บทบาทผู้ใช้
      - **student** → นักศึกษา (ดู/แก้ไขโครงงานของตัวเอง, ส่งรายงาน)
      - **teacher** → อาจารย์ (ดูโครงงานตัวเอง, ตรวจรายงาน, เปลี่ยนสถานะ)
      - **admin** → ผู้ดูแลระบบ (จัดการผู้ใช้, วิชา, โครงงานทั้งหมด)
    `,
    contact: {
      name: 'Student Project Team'
    },
    license: {
      name: 'MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development Server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'ใส่ token ที่ได้จากการล็อกอิน'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'thanakorn Wongsakul' },
          email: { type: 'string', example: 'thanakorn.w@student.uni.ac.th' },
          password: { type: 'string', format: 'password' },
          role: { type: 'string', enum: ['student', 'teacher', 'admin'] },
          avatar: { type: 'string', example: 'TW' },
          department: { type: 'string', example: 'Computer Science' },
          studentId: { type: 'string', example: '65010001' },
          isActive: { type: 'boolean', example: true },
          lastLogin: { type: 'string', format: 'date-time' }
        }
      },
      Project: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '65a1b2c3d4e5f6789012345' },
          title: { type: 'string', example: 'ระบบจัดการสต็อกสินค้า' },
          titleEn: { type: 'string', example: 'Inventory Management System' },
          description: { type: 'string', example: 'ระบบจัดการสต็อกสินค้าสำหรับร้านค้าออนไลน์' },
          status: { type: 'string', enum: ['in_progress', 'submitted', 'reviewed', 'approved', 'overdue'] },
          progress: { type: 'integer', minimum: 0, maximum: 100, example: 45 },
          studentIds: { type: 'array', items: { type: 'integer' } },
          courseCode: { type: 'string', example: 'CS302' },
          teacherId: { type: 'integer', example: 3 },
          startDate: { type: 'string', format: 'date' },
          dueDate: { type: 'string', format: 'date' },
          weeklyReports: { type: 'array', items: { type: 'object' } },
          files: { type: 'array', items: { type: 'object' } }
        }
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'เกิดข้อผิดพลาด' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'thanakorn.w@student.uni.ac.th' },
          password: { type: 'string', format: 'password', example: 'student123' }
        }
      },
      LoginResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
              user: { $ref: '#/components/schemas/User' }
            }
          }
        }
      }
    }
  },
  security: [
    { bearerAuth: [] }
  ],
  tags: [
    { name: 'Auth', description: 'การล็อกอินและจัดการ session' },
    { name: 'Projects', description: 'จัดการโครงงาน (MongoDB)' },
    { name: 'Weekly Reports', description: 'รายงานสัปดาห์และความคืบหน้า' },
    { name: 'Comments', description: 'ความคิดเห็นในรายงาน' },
    { name: 'Files', description: 'จัดการไฟล์แนบ' },
    { name: 'Users', description: 'จัดการผู้ใช้ (MySQL)' },
    { name: 'Courses', description: 'จัดการรายวิชา (MySQL)' },
    { name: 'Settings', description: 'ตั้งค่าระบบ (MySQL)' }
  ]
};

const options = {
  definition: swaggerDefinition,
  apis: [
    './routes/*.js',
    './controllers/*.js'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
