# Student Project Tracking System

> Full-Stack Web Application สำหรับติดตามและจัดการความคืบหน้าโครงงานนักศึกษา

ระบบสำหรับช่วยให้นักศึกษา อาจารย์ และผู้ดูแลระบบสามารถจัดการโครงงาน ติดตามความคืบหน้า ส่งรายงานรายสัปดาห์ แสดงความคิดเห็น และจัดการไฟล์ของโครงงานผ่านระบบเดียว

โปรเจกต์นี้พัฒนาขึ้นเพื่อฝึกการออกแบบและพัฒนา **Full-Stack Web Application** ตั้งแต่ Frontend, Backend, Database, Authentication ไปจนถึง REST API และ System Architecture

---

## 🚀 Project Overview

ระบบรองรับผู้ใช้งาน 3 บทบาท:

* **Student** — ดูข้อมูลโครงงาน อัปเดต Progress ส่ง Weekly Report และ Upload ไฟล์
* **Teacher** — ติดตามความคืบหน้าของโครงงาน แสดงความคิดเห็น และจัดการสถานะ/เกรด
* **Admin** — จัดการผู้ใช้งาน รายวิชา โครงงาน และ System Settings

### Key Features

* 📊 Project Dashboard และ Progress Tracking
* 📝 Weekly Progress Report
* 💬 Teacher Comment & Feedback
* 📁 Project File Management
* 🔐 JWT Authentication
* 👥 Role-Based Access Control
* 🗄️ Hybrid Database: MySQL + MongoDB
* 🔌 RESTful API
* 📚 Swagger / OpenAPI API Documentation
* ✅ Request Validation
* 📐 System Architecture & UML Diagrams

---

## 🛠️ Tech Stack

### Frontend

* React 18
* TypeScript
* Vite
* Tailwind CSS
* Material UI
* Lucide React

### Backend

* Node.js
* Express.js
* REST API
* JWT Authentication
* bcrypt
* express-validator
* Multer
* Swagger / OpenAPI

### Database

* **MySQL** — structured data such as Users, Courses และ System Settings
* **MongoDB** — flexible project data such as Projects, Weekly Reports, Comments และ Files
* Sequelize ORM
* Mongoose ODM

### Development Tools

* Git / GitHub
* Postman
* Swagger
* Mermaid

---

## 💡 Why Hybrid Database?

โปรเจกต์นี้เลือกใช้ MySQL และ MongoDB ร่วมกันเพื่อให้เหมาะกับลักษณะของข้อมูลแต่ละประเภท

**MySQL**

ใช้สำหรับข้อมูลที่มีโครงสร้างชัดเจนและมีความสัมพันธ์ เช่น:

* Users
* Courses
* System Settings

**MongoDB**

ใช้สำหรับข้อมูลโครงงานที่มีโครงสร้างยืดหยุ่นและมีข้อมูล nested เช่น:

* Projects
* Weekly Reports
* Comments
* File Metadata

การออกแบบนี้ช่วยให้เห็นแนวคิดในการเลือก Database ให้เหมาะสมกับลักษณะของข้อมูล แทนที่จะใช้ Database เพียงรูปแบบเดียวกับทุกส่วนของระบบ

---

## 👨‍💻 My Responsibilities

ในโปรเจกต์นี้ ผมมีส่วนร่วมในการพัฒนาระบบ Full-Stack โดยเน้นงานด้าน:

### Frontend

* พัฒนา UI ด้วย React + Vite
* สร้าง Dashboard สำหรับแสดงข้อมูลโครงงาน
* พัฒนา Project List และ Project Detail
* สร้าง Weekly Progress / Report Interface
* พัฒนา Role-based Views สำหรับ Student, Teacher และ Admin
* เชื่อมต่อ Frontend กับ Backend REST API

### Backend

* พัฒนา REST API ด้วย Node.js และ Express.js
* จัดการ Authentication ด้วย JWT
* จัดการ Role-Based Access Control
* พัฒนา API สำหรับ Projects, Users, Courses และ Reports
* ทำ Input Validation ด้วย express-validator
* รองรับ File Upload ด้วย Multer
* จัดทำ API Documentation ด้วย Swagger / OpenAPI

### Database

* ออกแบบและเชื่อมต่อ MySQL ผ่าน Sequelize
* ออกแบบ MongoDB Schema ผ่าน Mongoose
* แบ่งประเภทข้อมูลให้เหมาะสมกับ Relational และ NoSQL Database
* จัดการข้อมูล Users, Courses, Projects, Reports และ Comments

### System Design

* ออกแบบ System Architecture
* ออกแบบ ER Diagram
* ออกแบบ Sequence Diagram
* ออกแบบ Class Diagram
* ออกแบบ Use Case Diagram
* ออกแบบ User Flow และ Activity Diagram
* จัดเตรียม Postman Collection สำหรับทดสอบ API

---

## 🏗️ System Architecture

```text
┌───────────────────────────────────────────┐
│                 Frontend                  │
│       React + Vite + Tailwind CSS        │
└───────────────────┬───────────────────────┘
                    │
                    │ REST API
                    │ JWT Bearer Token
                    ▼
┌───────────────────────────────────────────┐
│                  Backend                  │
│             Node.js + Express             │
│                                           │
│  Authentication | Authorization | API     │
│  Validation | File Upload | Swagger       │
└───────────────┬───────────────┬───────────┘
                │               │
                ▼               ▼
        ┌──────────────┐ ┌──────────────┐
        │    MySQL     │ │   MongoDB    │
        │              │ │              │
        │ Users        │ │ Projects     │
        │ Courses      │ │ Reports      │
        │ Settings     │ │ Comments     │
        │              │ │ Files        │
        └──────────────┘ └──────────────┘
```

---

## 🔐 Authentication & Authorization

ระบบใช้ **JWT Authentication** สำหรับยืนยันตัวตนของผู้ใช้งาน

หลังจาก Login สำเร็จ ระบบจะส่ง JWT Token เพื่อใช้ในการเรียก API ที่ต้องมีการยืนยันตัวตน

นอกจากนี้ยังมี **Role-Based Access Control** เพื่อกำหนดสิทธิ์ของผู้ใช้งานแต่ละประเภท

```text
Student
 ├── View Projects
 ├── Submit Weekly Reports
 └── Upload Files

Teacher
 ├── View Projects
 ├── Review Progress
 ├── Comment on Reports
 └── Update Project Status

Admin
 ├── Manage Users
 ├── Manage Courses
 ├── Manage Projects
 └── Manage System Settings
```

---

## 📡 REST API

ตัวอย่าง API ที่พัฒนาขึ้น:

| Method | Endpoint                           | Description              |
| ------ | ---------------------------------- | ------------------------ |
| POST   | `/api/auth/login`                  | User Authentication      |
| GET    | `/api/auth/me`                     | Get Current User         |
| GET    | `/api/projects`                    | Get Projects             |
| GET    | `/api/projects/stats`              | Get Dashboard Statistics |
| GET    | `/api/projects/:id`                | Get Project Details      |
| POST   | `/api/projects`                    | Create Project           |
| PUT    | `/api/projects/:id`                | Update Project           |
| PATCH  | `/api/projects/:id/status`         | Update Project Status    |
| POST   | `/api/projects/:id/weekly-reports` | Submit Weekly Report     |
| POST   | `/api/projects/:id/files`          | Upload Project File      |
| GET    | `/api/users`                       | Get Users                |
| GET    | `/api/courses`                     | Get Courses              |

API Documentation สามารถดูผ่าน Swagger ได้เมื่อรัน Backend:

```text
http://localhost:5000/api-docs
```

---

## 📐 System Design

ภายใน Repository มีเอกสารและ Diagram สำหรับอธิบายระบบ ได้แก่:

* Architecture Diagram
* ER Diagram
* Class Diagram
* Sequence Diagram
* Use Case Diagram
* User Flow Diagram
* Activity Diagram
* Deployment Diagram

---

## 📁 Project Structure

```text
student-project/
│
├── src/                         # Frontend
│   ├── app/
│   │   ├── App.tsx
│   │   └── components/
│   │       ├── Login.tsx
│   │       ├── Dashboard.tsx
│   │       ├── ProjectList.tsx
│   │       ├── WeeklyProgress.tsx
│   │       ├── AdminView.tsx
│   │       └── ...
│   │
│   └── main.tsx
│
├── server/                      # Backend
│   ├── controllers/
│   ├── routes/
│   ├── database/
│   │   ├── models/mysql/
│   │   ├── models/mongodb/
│   │   └── seed.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── upload.js
│   └── server.js
│
├── diagrams/                    # System Diagrams
├── StudentProjectTracking-Postman.json
├── package.json
├── vite.config.ts
└── README.md
```

---

## ⚙️ Getting Started

### Requirements

* Node.js 18+
* MySQL 8+
* MongoDB 7+

### Installation

Clone repository:

```bash
git clone https://github.com/pondzamak123/student-project.git
cd student-project
```

Install dependencies:

```bash
npm install
cd server
npm install
```

Create and configure `.env` in the backend:

```env
MYSQL_PASSWORD=your_password
MONGODB_URI=mongodb://localhost:27017/student_project_db
```

Create MySQL database:

```sql
CREATE DATABASE student_project_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Seed sample data:

```bash
cd server
node database/seed.js
```

Run Backend:

```bash
npm run dev
```

Run Frontend in another terminal:

```bash
npm run dev
```

---

## 🎯 What I Learned

จากโปรเจกต์นี้ ผมได้ฝึกและพัฒนาทักษะด้าน:

* Full-Stack Web Development
* REST API Development
* Authentication & Authorization
* Relational Database Design
* NoSQL Database Design
* API Integration
* System Architecture
* Database Modeling
* Input Validation
* File Upload Management
* API Testing
* Technical Documentation

โปรเจกต์นี้ช่วยให้ผมเข้าใจการทำงานของ Web Application ตั้งแต่ **Frontend → API → Backend → Database** และการออกแบบระบบให้แต่ละส่วนสามารถทำงานร่วมกันได้

---

## 📌 Project Status

**Educational / Portfolio Project**

โปรเจกต์นี้พัฒนาขึ้นเพื่อใช้ในการเรียนรู้และแสดงทักษะด้าน Software Development และ Full-Stack Development

---

## 📄 License

MIT License
