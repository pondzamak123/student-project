/**
 * ============================================
 * MySQL Model: User
 * ใช้เก็บ: ข้อมูลผู้ใช้, บทบาท, สถานะ
 * ============================================
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../mysql/connection');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    allowNull: false,
    comment: 'รหัสผู้ใช้ (เช่น s001, t001, admin1)'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'ชื่อ-นามสกุล'
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    comment: 'อีเมล'
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'รหัสผ่าน (hash)'
  },
  role: {
    type: DataTypes.ENUM('student', 'teacher', 'admin'),
    allowNull: false,
    comment: 'บทบาท: student, teacher, admin'
  },
  avatar: {
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: 'อักษรย่อสำหรับ avatar'
  },
  department: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'คณะ/ภาควิชา'
  },
  studentId: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'รหัสนักศึกษา (สำหรับ role=student)'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'สถานะเปิดใช้งาน'
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'เวลาล็อกอินล่าสุด'
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = User;
