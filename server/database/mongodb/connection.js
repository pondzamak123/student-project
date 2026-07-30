/**
 * ============================================
 * MongoDB Connection
 * ใช้เก็บ: โครงงาน (Projects), ความคิดเห็น (Comments), 
 *          ไฟล์ (Files), Weekly Reports, Milestones
 * ============================================
 */
const mongoose = require('mongoose');

const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectMongoDB;
