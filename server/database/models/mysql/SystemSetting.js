/**
 * ============================================
 * MySQL Model: SystemSetting
 * ใช้เก็บ: การตั้งค่าระบบ (Admin Settings)
 * ============================================
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../mysql/connection');

const SystemSetting = sequelize.define('SystemSetting', {
  key: {
    type: DataTypes.STRING(100),
    primaryKey: true,
    allowNull: false,
    comment: 'ชื่อการตั้งค่า'
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'ค่าการตั้งค่า'
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'คำอธิบายการตั้งค่า'
  }
}, {
  tableName: 'system_settings',
  timestamps: false
});

module.exports = SystemSetting;
