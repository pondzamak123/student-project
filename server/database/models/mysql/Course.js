/**
 * ============================================
 * MySQL Model: Course
 * ใช้เก็บ: รายวิชาที่เปิดสอน
 * ============================================
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../mysql/connection');

const Course = sequelize.define('Course', {
  code: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    allowNull: false,
    comment: 'รหัสวิชา (เช่น CS4820)'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'ชื่อวิชา'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'สถานะเปิดใช้งาน'
  }
}, {
  tableName: 'courses',
  timestamps: false
});

module.exports = Course;
