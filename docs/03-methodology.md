# เนื้อหาส่วนที่ 3: วิธีดำเนินการโครงงาน

## 3.1 System Architecture

ระบบออกแบบด้วยสถาปัตยกรรมแบบ **Three-Tier Architecture** แบ่งเป็น 3 ชั้น:

### Layer 1: Presentation Layer (Frontend)

```
┌─────────────────────────────────────────────────────────┐
│  React 18 + Vite + TailwindCSS + Material UI            │
│                                                         │
│  Components: Login, Dashboard, ProjectList,             │
│  ProgressBar, StatusBadge, WeeklyProgress,              │
│  CreateProjectModal, AdminView, Sidebar                 │
│                                                         │
│  API Client: fetch() with JWT Bearer Token              │
└─────────────────────────────────────────────────────────┘
```

### Layer 2: Application Layer (Backend)

```
┌─────────────────────────────────────────────────────────┐
│  Node.js + Express.js (Port 5000)                       │
│                                                         │
│  Middleware: CORS → JSON → JWT Auth → Validation        │
│  Routes: /api/auth, /api/projects, /api/users,          │
│          /api/courses, /api/settings                    │
│  Controllers: 7 Controllers (Business Logic)            │
└─────────────────────────────────────────────────────────┘
```

### Layer 3: Data Layer (Database)

```
┌──────────────────┬──────────────────────────────────────┐
│  MySQL           │  MongoDB                             │
│  (Sequelize ORM) │  (Mongoose ODM)                      │
│  ─────────────── │  ───────────────                     │
│  Users Table     │  Projects Collection                 │
│  Courses Table   │  WeeklyReports (Embedded)            │
│  SystemSettings  │  Comments (Embedded)                 │
│                  │  Files Metadata                      │
└──────────────────┴──────────────────────────────────────┘
```

### ข้อมูลการไหล (Data Flow)

```
User (Browser)
    ↓ HTTP Request + JWT Token
Frontend (React :3000)
    ↓ Proxy /api → localhost:5000
Backend (Express :5000)
    ↓ JWT Validation → Role Check → Input Validation
    ├──→ MySQL (Users, Courses, Settings)
    └──→ MongoDB (Projects, Reports, Comments, Files)
         ↓ Response JSON
    ←─── Backend
←─────── Frontend
←─────── User (Browser)
```

---

## 3.2 Use Case Diagram

![Use Case Diagram](../diagrams/usecase_diagram.png)

### Actors และ Use Cases

| Actor | Use Cases |
|---|---|
| **Student** | Login, View Dashboard, View Projects, Submit Weekly Report, Upload Files, Download Files |
| **Teacher** | Login, View Dashboard, View Projects, Update Status, Add Comment, Give Grade |
| **Admin** | Login, View Dashboard, View Projects, Create Project, Update Project, Update Status, Submit Report, Add Comment, Upload Files, Download Files, Manage Users, Manage Courses, Give Grade, System Settings, View Statistics |

### Use Case Descriptions

| UC ID | ชื่อ Use Case | Description |
|---|---|---|
| UC-01 | Login | ผู้ใช้กรอก Email + Password → ระบบตรวจสอบ → ส่ง JWT Token |
| UC-02 | View Dashboard | แสดงภาพรวมโครงงานทั้งหมดพร้อม Stats |
| UC-03 | View Projects | แสดงรายการโครงงาน + Detail |
| UC-04 | Create Project | Admin สร้างโครงงานใหม่ กำหนด Student + Teacher + Course |
| UC-05 | Update Project | แก้ไขข้อมูลโครงงาน (ชื่อ, description, milestones) |
| UC-06 | Update Status | Teacher เปลี่ยนสถานะโครงงาน + ให้เกรด |
| UC-07 | Submit Weekly Report | นักศึกษากรอกรายงานสัปดาห์ + Progress + Tasks |
| UC-08 | Add Comment | อาจารย์คอมเมนต์รายงานนักศึกษา |
| UC-09 | Upload Files | นักศึกษาอัปโหลดไฟล์ PDF/DOCX/ZIP (max 10MB, 5 files) |
| UC-10 | Download Files | ดาวน์โหลดไฟล์แนบจากโครงงาน |
| UC-11 | Manage Users | Admin CRUD ผู้ใช้ |
| UC-12 | Manage Courses | Admin CRUD รายวิชา |
| UC-13 | Give Grade | อาจารย์ให้เกรดโครงงาน (A, B+, B, C+, C, D, F) |
| UC-14 | System Settings | Admin ตั้งค่าปีการศึกษา, เทอม, คะแนนตัดเกรด |
| UC-15 | View Statistics | แสดงสถิติภาพรวม (จำนวนโครงงาน, อัตราความสำเร็จ) |

---

## 3.3 Sequence Diagram

### 3.3.1 Authentication Flow

![Sequence Login & Project](../diagrams/sequence_login_project.png)

**ขั้นตอนการทำงาน:**

| Step | Actor → System | Description |
|---|---|---|
| 1 | User → Frontend | กรอก Email + Password |
| 2 | Frontend → Backend | POST /api/auth/login |
| 3 | Backend → MySQL | ค้นหา User ตาม Email |
| 4 | Backend → Backend | ตรวจสอบ Password (bcrypt.compare) |
| 5 | Backend → Backend | สร้าง JWT Token (id, role, email) |
| 6 | Backend → Frontend | Return { token, user } |
| 7 | Frontend → Frontend | บันทึก Token → localStorage |
| 8 | Frontend → User | Redirect → Dashboard |

### 3.3.2 CRUD Operations Flow

![Sequence CRUD Operations](../diagrams/sequence_crud_operations.png)

**Admin สร้าง Project:**
1. Admin กรอกข้อมูล → POST /api/projects
2. Backend ตรวจสอบ JWT → Role = Admin
3. Backend ตรวจสอบ Course + Student ใน MySQL
4. Backend สร้าง Project ใน MongoDB
5. Backend อัปเดต User.assignedProject ใน MySQL
6. Return Project → แสดงใน Dashboard

**Teacher เปลี่ยน Status:**
1. Teacher เลือก Project → PATCH /api/projects/:id/status
2. Backend ตรวจสอบ JWT → Role = Teacher + Ownership
3. Backend อัปเดต status + grade ใน MongoDB
4. Return → แสดง Status Badge สีใหม่

**Student ส่ง Weekly Report:**
1. Student กรอกรายงาน → POST /api/projects/:id/weekly-reports
2. Backend ตรวจสอบ JWT → Ownership Check
3. Backend Validate input (week, description, progress, tasks)
4. Backend เพิ่ม Report ใน MongoDB
5. Backend คำนวณ Progress ใหม่
6. Return → แสดง Progress Bar อัปเดต

---

## 3.4 Class Diagram

![Class Diagram](../diagrams/class_diagram.png)

### Models

| Model | Database | Type | Fields Count |
|---|---|---|---|
| User | MySQL | Sequelize Model | 12 fields |
| Course | MySQL | Sequelize Model | 5 fields |
| SystemSetting | MySQL | Sequelize Model | 5 fields |
| Project | MongoDB | Mongoose Model | 18 fields + Subdocuments |
| WeeklyReport | MongoDB | Embedded Document | 10 fields |
| Comment | MongoDB | Embedded Document | 7 fields |
| File | MongoDB | Embedded Document | 9 fields |

### Controllers

| Controller | Routes | Methods |
|---|---|---|
| authController | /api/auth/* | login(), getMe() |
| projectController | /api/projects/* | getAll(), getById(), create(), update(), updateStatus(), delete(), getStats() |
| weeklyReportController | /api/projects/:id/weekly-reports/* | submitReport(), updateReport(), addComment(), deleteComment() |
| fileController | /api/projects/:id/files/* | uploadFiles(), deleteFile(), downloadFile() |
| userController | /api/users/* | getAll(), getTeachers(), getStudents(), create(), delete() |
| courseController | /api/courses/* | getAll(), create(), delete() |
| settingController | /api/settings/* | getAll(), updateBulk() |

### Middleware

| Middleware | หน้าที่ |
|---|---|
| authenticate | ตรวจสอบ JWT Token, เพิ่ม req.user |
| authorizeRole | ตรวจสอบ Role (student/teacher/admin) |
| validateLogin | ตรวจสอบ Email format + Password |
| validateProject | ตรวจสอบ required fields |
| validateReport | ตรวจสอบ week, description, progress |
| uploadFiles | Multer config + file type validation |

---

## 3.5 Sequence Diagram (เพิ่มเติม)

### 3.5.1 File Upload Flow

```
Student → Frontend → Backend → Multer → /uploads/ → MongoDB → Response
```

1. Student เลือกไฟล์ (PDF/DOCX/ZIP)
2. Frontend ส่ง multipart/form-data → POST /api/projects/:id/files
3. Backend ตรวจสอบ JWT → Ownership Check
4. Multer ตรวจสอบ File Type + Size (max 10MB)
5. Multer บันทึกไฟล์ → /uploads/{timestamp}_{originalName}
6. Backend เพิ่ม File entry → Project.files (MongoDB)
7. Return → Frontend แสดงไฟล์พร้อม Link ดาวน์โหลด

### 3.5.2 Comment Flow

```
Teacher → Frontend → Backend → MongoDB → Response
```

1. Teacher กรอกคอมเมนต์ → POST /api/projects/:id/weekly-reports/:rid/comments
2. Backend ตรวจสอบ JWT → Role = Teacher
3. Backend ค้นหา Report ที่ตรงกับ :rid
4. Backend เพิ่ม Comment → Report.comments (MongoDB)
5. Return → Frontend แสดงคอมเมนต์ใหม่

---

## 3.6 Data Schema (NoSQL/SQL)

### MySQL Schema

#### Table: users

| Column | Type | Constraint | Description |
|---|---|---|---|
| id | INT | PK, Auto Increment | รหัสผู้ใช้ |
| name | VARCHAR(100) | NOT NULL | ชื่อ-นามสกุล |
| email | VARCHAR(150) | UNIQUE, NOT NULL | อีเมล |
| password | VARCHAR(255) | NOT NULL | Hashed Password (bcrypt) |
| role | ENUM | NOT NULL | student/teacher/admin |
| avatar | VARCHAR(10) | - | Initials (เช่น TW) |
| department | VARCHAR(100) | - | แผนก/คณะ |
| studentId | VARCHAR(20) | NULLABLE | รหัสนักศึกษา |
| isActive | BOOLEAN | DEFAULT true | สถานะใช้งาน |
| lastLogin | DATETIME | NULLABLE | ล็อกอินล่าสุด |
| createdAt | DATETIME | DEFAULT NOW() | สร้างเมื่อ |
| updatedAt | DATETIME | DEFAULT NOW() | อัปเดตเมื่อ |

#### Table: courses

| Column | Type | Constraint | Description |
|---|---|---|---|
| code | VARCHAR(10) | PK | รหัสวิชา (CS302) |
| name | VARCHAR(100) | NOT NULL | ชื่อวิชา |
| credits | INT | NOT NULL | หน่วยกิต |
| description | TEXT | - | รายละเอียดวิชา |
| createdAt | DATETIME | DEFAULT NOW() | สร้างเมื่อ |
| updatedAt | DATETIME | DEFAULT NOW() | อัปเดตเมื่อ |

#### Table: system_settings

| Column | Type | Constraint | Description |
|---|---|---|---|
| key | VARCHAR(50) | PK | ค่า setting key |
| value | TEXT | NOT NULL | ค่า setting value |
| type | VARCHAR(20) | NOT NULL | string/number/boolean |
| description | VARCHAR(200) | - | คำอธิบาย |
| createdAt | DATETIME | DEFAULT NOW() | สร้างเมื่อ |
| updatedAt | DATETIME | DEFAULT NOW() | อัปเดตเมื่อ |

### MongoDB Schema

#### Collection: projects

```javascript
{
  _id: ObjectId,                    // MongoDB Auto ID (PK)
  title: String,                    // ชื่อโครงงาน (ไทย)
  titleEn: String,                  // ชื่อโครงงาน (อังกฤษ)
  description: String,              // รายละเอียด
  status: Enum,                     // in_progress/submitted/reviewed/approved/overdue
  progress: Number,                 // 0-100
  studentIds: [Number],             // FK → users.id []
  studentNames: [String],           // ชื่อนักศึกษา
  courseCode: String,               // FK → courses.code
  courseName: String,               // ชื่อวิชา
  teacherId: Number,                // FK → users.id
  teacherName: String,              // ชื่ออาจารย์
  startDate: Date,                  // วันที่เริ่ม
  dueDate: Date,                    // กำหนดส่ง
  tags: [String],                   // tags
  tools: [String],                  // เครื่องมือที่ใช้
  milestones: [{                    // Milestone subdocument
    title: String,
    description: String,
    completed: Boolean,
    dueDate: Date
  }],
  weeklyReports: [{                 // Embedded reports
    week: Number,
    description: String,
    progress: Number,
    tasks: [{ task: String, done: Boolean }],
    submittedBy: Number,
    submittedAt: Date,
    status: String,
    comments: [{
      content: String,
      authorId: Number,
      authorName: String,
      authorRole: String,
      createdAt: Date
    }]
  }],
  files: [{                         // Embedded files
    originalName: String,
    storedName: String,
    path: String,
    mimeType: String,
    size: Number,
    uploadedBy: Number,
    uploadedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 3.7 Data Dictionary

### MySQL Tables

#### users

| Field | Data Type | Length | PK/FK | Constraint | Sample Data |
|---|---|---|---|---|---|
| id | INT | 11 | PK | Auto Increment | 1 |
| name | VARCHAR | 100 | - | NOT NULL | ธนกร วงศ์สุวรรณ |
| email | VARCHAR | 150 | UNIQUE | NOT NULL | thanakorn.w@student.uni.ac.th |
| password | VARCHAR | 255 | - | NOT NULL | $2b$10$N9qo8uLOickgx2ZMRZoM |
| role | ENUM | - | - | student/teacher/admin | student |
| avatar | VARCHAR | 10 | - | - | TW |
| department | VARCHAR | 100 | - | - | วิทยาการคอมพิวเตอร์ |
| studentId | VARCHAR | 20 | - | NULLABLE | 65010001 |
| isActive | BOOLEAN | 1 | - | DEFAULT true | true |
| lastLogin | DATETIME | - | - | NULLABLE | 2025-07-29 10:30:00 |
| createdAt | DATETIME | - | - | DEFAULT NOW() | 2025-01-15 08:00:00 |
| updatedAt | DATETIME | - | - | ON UPDATE NOW() | 2025-07-29 10:30:00 |

#### courses

| Field | Data Type | Length | PK/FK | Constraint | Sample Data |
|---|---|---|---|---|---|
| code | VARCHAR | 10 | PK | - | CS302 |
| name | VARCHAR | 100 | - | NOT NULL | ฐานข้อมูลและระบบฐานข้อมูล |
| credits | INT | 11 | - | NOT NULL | 3 |
| description | TEXT | - | - | - | เรียนรู้การออกแบบฐานข้อมูล |
| createdAt | DATETIME | - | - | DEFAULT NOW() | 2025-01-01 00:00:00 |
| updatedAt | DATETIME | - | - | ON UPDATE NOW() | 2025-01-01 00:00:00 |

#### system_settings

| Field | Data Type | Length | PK/FK | Constraint | Sample Data |
|---|---|---|---|---|---|
| key | VARCHAR | 50 | PK | - | academicYear |
| value | TEXT | - | - | NOT NULL | 2568 |
| type | VARCHAR | 20 | - | NOT NULL | string |
| description | VARCHAR | 200 | - | - | ปีการศึกษาปัจจุบัน |
| createdAt | DATETIME | - | - | DEFAULT NOW() | 2025-01-01 00:00:00 |
| updatedAt | DATETIME | - | - | ON UPDATE NOW() | 2025-01-01 00:00:00 |

### MongoDB Collections

#### projects

| Field | Type | Required | Sample Data |
|---|---|---|---|
| _id | ObjectId | Yes | 65a1b2c3d4e5f6g7h8i9j0 |
| title | String | Yes | ระบบจัดการหอพักนักศึกษา |
| titleEn | String | Yes | Student Dormitory Management System |
| description | String | Yes | ระบบจัดการข้อมูลหอพัก... |
| status | Enum | Yes | in_progress |
| progress | Number | Yes | 65 |
| studentIds | Array[Number] | Yes | [1, 2, 3] |
| courseCode | String | Yes | CS302 |
| teacherId | Number | Yes | 4 |
| startDate | Date | Yes | 2025-02-01 |
| dueDate | Date | Yes | 2025-08-30 |
| tags | Array[String] | No | ["web", "mysql", "react"] |
| tools | Array[String] | No | ["VS Code", "Git", "Figma"] |
| milestones | Array[Object] | No | [{title: "ออกแบบ DB", completed: true}] |
| weeklyReports | Array[Object] | No | [{week: 1, progress: 10}] |
| files | Array[Object] | No | [{originalName: "design.pdf"}] |

---

## 3.8 Microservices Architecture Design (Server Services)

แม้โปรเจคนี้จะใช้สถาปัตยกรรมแบบ **Monolithic** (Express.js เดียว) แต่ได้ออกแบบให้สามารถแยกเป็น Microservices ในอนาคตได้ โดยแบ่งตาม Domain:

| Service | Port | หน้าที่ | Database |
|---|---|---|---|
| Auth Service | 5001 | Login, Register, JWT Management | MySQL |
| Project Service | 5002 | CRUD Projects, Reports, Comments | MongoDB |
| User Service | 5003 | CRUD Users, Roles | MySQL |
| Course Service | 5004 | CRUD Courses | MySQL |
| File Service | 5005 | Upload, Download, Delete Files | MongoDB + Local Storage |
| Notification Service | 5006 | Email Notifications, In-app Alerts | MongoDB |

### Service Communication

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Auth    │────▶│  User    │────▶│  Project │
│ Service  │     │ Service  │     │ Service  │
└──────────┘     └──────────┘     └──────────┘
      │                │                │
      ▼                ▼                ▼
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Course  │     │   File   │     │  Notif   │
│ Service  │     │ Service  │     │ Service  │
└──────────┘     └──────────┘     └──────────┘
```

### API Gateway (ปัจจุบัน)

ปัจจุบัน Express.js ทำหน้าที่เป็น API Gateway รวมทุก Service ไว้ในไฟล์เดียว โดยแบ่งตาม Routes:

```javascript
// server.js
app.use('/api/auth', authRoutes);          // → Auth Service
app.use('/api/projects', projectRoutes);   // → Project Service
app.use('/api/users', userRoutes);         // → User Service
app.use('/api/courses', courseRoutes);     // → Course Service
app.use('/api/settings', settingRoutes);   // → Admin/Settings
```

---

## 3.9 API Checklist

### Authentication APIs

| # | Method | Endpoint | Auth Required | Role | Status |
|---|---|---|---|---|---|
| 1 | POST | /api/auth/login | No | All | ✅ |
| 2 | GET | /api/auth/me | Yes (JWT) | All | ✅ |

### Project APIs (MongoDB)

| # | Method | Endpoint | Auth Required | Role | Status |
|---|---|---|---|---|---|
| 3 | GET | /api/projects | Yes | All | ✅ |
| 4 | GET | /api/projects/stats | Yes | All | ✅ |
| 5 | GET | /api/projects/:id | Yes | All | ✅ |
| 6 | POST | /api/projects | Yes | Admin | ✅ |
| 7 | PUT | /api/projects/:id | Yes | Admin, Teacher | ✅ |
| 8 | PATCH | /api/projects/:id/status | Yes | Teacher | ✅ |
| 9 | DELETE | /api/projects/:id | Yes | Admin | ✅ |

### Weekly Report APIs (MongoDB)

| # | Method | Endpoint | Auth Required | Role | Status |
|---|---|---|---|---|---|
| 10 | POST | /api/projects/:id/weekly-reports | Yes | Student | ✅ |
| 11 | PUT | /api/projects/:id/weekly-reports/:rid | Yes | Student | ✅ |
| 12 | POST | /api/projects/:id/weekly-reports/:rid/comments | Yes | Teacher | ✅ |
| 13 | DELETE | /api/projects/:id/weekly-reports/:rid/comments/:cid | Yes | Teacher | ✅ |

### File APIs (MongoDB + Multer)

| # | Method | Endpoint | Auth Required | Role | Status |
|---|---|---|---|---|---|
| 14 | POST | /api/projects/:id/files | Yes | Student | ✅ |
| 15 | DELETE | /api/projects/:id/files/:fid | Yes | Student | ✅ |
| 16 | GET | /api/projects/:id/files/:fid/download | Yes | All | ✅ |

### User APIs (MySQL)

| # | Method | Endpoint | Auth Required | Role | Status |
|---|---|---|---|---|---|
| 17 | GET | /api/users | Yes | Admin | ✅ |
| 18 | GET | /api/users/teachers | Yes | Admin | ✅ |
| 19 | GET | /api/users/students | Yes | Admin | ✅ |
| 20 | POST | /api/users | Yes | Admin | ✅ |
| 21 | DELETE | /api/users/:id | Yes | Admin | ✅ |

### Course APIs (MySQL)

| # | Method | Endpoint | Auth Required | Role | Status |
|---|---|---|---|---|---|
| 22 | GET | /api/courses | Yes | All | ✅ |
| 23 | POST | /api/courses | Yes | Admin | ✅ |
| 24 | DELETE | /api/courses/:code | Yes | Admin | ✅ |

### Settings APIs (MySQL)

| # | Method | Endpoint | Auth Required | Role | Status |
|---|---|---|---|---|---|
| 25 | GET | /api/settings | Yes | Admin | ✅ |
| 26 | PUT | /api/settings/bulk | Yes | Admin | ✅ |

### Summary

| Total Endpoints | 26 |
|---|---|
| MongoDB Endpoints | 16 |
| MySQL Endpoints | 10 |
| Authentication Required | 24 |
| Public Endpoints | 1 (login) |
| Swagger Documented | 26 |
