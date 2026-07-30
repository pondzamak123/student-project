/**
 * ============================================
 * MongoDB Model: Project
 * ใช้เก็บข้อมูลโครงงานทั้งหมด รวมถึง sub-documents:
 *   - milestones, weeklyReports (มี comments embedded), files
 * ============================================
 */
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  id: { type: String, default: () => `c_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  authorRole: { type: String, enum: ['student', 'teacher', 'admin'], required: true },
  content: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString().slice(0, 10) }
});

const FileAttachmentSchema = new mongoose.Schema({
  id: { type: String, default: () => `f_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` },
  name: { type: String, required: true },
  size: { type: String, default: '0 KB' },
  type: { type: String, default: 'file' },
  uploadedAt: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  uploadedBy: { type: String, required: true }
});

const MilestoneSchema = new mongoose.Schema({
  id: { type: String, default: () => `m_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` },
  title: { type: String, required: true },
  dueDate: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const WeeklyReportSchema = new mongoose.Schema({
  id: { type: String, default: () => `wr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` },
  week: { type: Number, required: true },
  submittedAt: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  description: { type: String, required: true },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  issues: { type: String, default: '' },
  nextPlan: { type: String, default: '' },
  files: [FileAttachmentSchema],
  comments: [CommentSchema],
  status: { type: String, enum: ['pending', 'reviewed'], default: 'pending' }
});

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleEn: { type: String, required: true },
  description: { type: String, required: true },
  coverImage: { type: String, default: '' },
  studentIds: [{ type: String, required: true }],
  studentNames: [{ type: String, required: true }],
  courseCode: { type: String, required: true },
  courseName: { type: String, required: true },
  teacherId: { type: String, required: true },
  teacherName: { type: String, required: true },
  status: { type: String, enum: ['in_progress', 'submitted', 'reviewed', 'approved', 'overdue'], default: 'in_progress' },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  startDate: { type: String, required: true },
  dueDate: { type: String, required: true },
  grade: { type: String, default: null },
  tags: [{ type: String }],
  tools: [{ type: String }],
  milestones: [MilestoneSchema],
  weeklyReports: [WeeklyReportSchema],
  files: [FileAttachmentSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', ProjectSchema);
