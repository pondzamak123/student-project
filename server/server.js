/**
 * ============================================
 * Student Project Tracking Dashboard
 * Backend Server - Node.js + Express
 * 
 * Database:
 *   MySQL   → Users, Courses, SystemSettings
 *   MongoDB → Projects, WeeklyReports, Comments, Files
 * ============================================
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Database connections
const connectMongoDB = require('./database/mongodb/connection');
const { connectMySQL, sequelize } = require('./database/mysql/connection');

// Import Routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const settingRoutes = require('./routes/settings');

const app = express();
const PORT = process.env.PORT || 5000;

// ========================
// Middleware
// ========================
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files (สำหรับดาวน์โหลดไฟล์)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ========================
// Swagger API Documentation
// ========================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Student Project Tracking API Docs'
}));

// JSON spec endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ========================
// Health Check
// ========================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Student Project Tracking API',
    version: '1.0.0',
    docs: 'http://localhost:' + PORT + '/api-docs',
    databases: {
      mysql: 'Connected',
      mongodb: 'Connected'
    },
    endpoints: {
      auth: '/api/auth/login',
      projects: '/api/projects',
      users: '/api/users',
      courses: '/api/courses',
      settings: '/api/settings',
      swagger: '/api-docs'
    }
  });
});

// ========================
// API Routes
// ========================
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/settings', settingRoutes);

// ========================
// Error Handler
// ========================
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'ไม่พบ API ที่ร้องขอ'
  });
});

// ========================
// Start Server
// ========================
const startServer = async () => {
  try {
    // เชื่อมต่อ Database ทั้ง 2 ตัว
    console.log('🔄 กำลังเชื่อมต่อ Database...');
    await Promise.all([
      connectMongoDB(),
      connectMySQL()
    ]);

    // สร้างตาราง MySQL ถ้ายังไม่มี
    await sequelize.sync();
    console.log('✅ MySQL Tables synced');

    // Start Express Server
    app.listen(PORT, () => {
      console.log(`\n============================================`);
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📖 API Docs:   http://localhost:${PORT}/api-docs`);
      console.log(`============================================`);
      console.log(`\n📋 API Endpoints:`);
      console.log(`   GET  http://localhost:${PORT}/              - Health Check`);
      console.log(`   POST http://localhost:${PORT}/api/auth/login  - ล็อกอิน`);
      console.log(`   GET  http://localhost:${PORT}/api/projects   - ดึงโครงงาน`);
      console.log(`   GET  http://localhost:${PORT}/api/users      - ดึงผู้ใช้ (Admin)`);
      console.log(`   GET  http://localhost:${PORT}/api/courses    - ดึงรายวิชา`);
      console.log(`   GET  http://localhost:${PORT}/api/settings   - ดึงการตั้งค่า`);
      console.log(`   GET  http://localhost:${PORT}/api-docs       - Swagger API Docs`);
      console.log(`\n📊 Databases:`);
      console.log(`   MySQL   → Users, Courses, Settings`);
      console.log(`   MongoDB → Projects, Reports, Comments, Files`);
      console.log(`\n============================================`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
