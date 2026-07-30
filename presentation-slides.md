# Student Project Tracking Dashboard — Presentation Slides

## Slide 1: Title Slide
**Title:** Student Project Tracking Dashboard
**Subtitle:** ระบบติดตามความคืบหน้าโครงงานนักศึกษา
**Footer:** Full-Stack Web Application | Node.js + Express + MongoDB + MySQL

---

## Slide 2: ปัญหาและที่มา
**Heading:** ปัญหาการติดตามโครงงานนักศึกษาแบบดั้งเดิม
- นักศึกษาหลายทีมทำงานพร้อมกัน อาจารย์ตรวจติดตามยาก
- ใช้ Email / Line แจ้งความคืบหน้า → ข้อมูลกระจัดกระจาย ไม่มีประวัติ
- ไม่มีการประเมิน progress ที่เป็นระบบ ทำให้เห็นภาพรวมยาก
- ไฟล์ส่งงานปนกัน ไม่มี central repository
- ไม่มีการ feedback loop ระหว่างอาจารย์และนักศึกษา

---

## Slide 3: แนวทางแก้ไข
**Heading:** Dashboard แบบ Real-time ติดตามโครงงานทุกทีม
- ระบบ Dashboard แสดงภาพรวมโครงงานทั้งหมด พร้อมสถานะและ progress bar
- ระบบ Weekly Report → นักศึกษาอัปเดตทุกสัปดาห์ อาจารย์คอมเมนต์ได้
- ไฟล์ส่งงานรวมศูนย์ อัปโหลดได้ 5 ไฟล์/ครั้ง รองรับ PDF, DOCX, PPTX
- Multi-role Access → นักศึกษา / อาจารย์ / Admin เห็นข้อมูลตามสิทธิ์
- Hybrid Database → MySQL (Users, Courses) + MongoDB (Projects, Reports)

---

## Slide 4: สถาปัตยกรรมระบบ
**Heading:** Full-Stack Architecture ด้วย 4 ชั้น
- **Frontend:** React + Vite + TailwindCSS + Material UI (จาก Figma Design)
- **Backend:** Node.js + Express.js (RESTful API)
- **MySQL (Sequelize):** เก็บ Users (11 คน), Courses (10 วิชา), SystemSettings
- **MongoDB (Mongoose):** เก็บ Projects (3 โปรเจค), WeeklyReports, Comments, Files
- **Authentication:** JWT Token + Role-Based Access Control (RBAC)
- **API Docs:** Swagger/OpenAPI 3.0 + Postman Collection

---

## Slide 5: ฐานข้อมูล 2 ตัว
**Heading:** เลือก DB ตามลักษณะข้อมูล — MySQL vs MongoDB
- **MySQL** เหมาะกับข้อมูลที่มีโครงสร้างชัดเจน → Users, Courses, Settings (ใช้ Sequelize ORM)
- **MongoDB** เหมาะกับข้อมูล flexible schema → Projects มี weekly reports, comments, files ที่ซ้อนกัน (ใช้ Mongoose ODM)
- ทั้ง 2 DB เชื่อมต่อพร้อมกัน → API เดียวเข้าถึงข้อมูลจากทั้ง 2 แหล่ง
- MySQL Sync Tables อัตโนมัติ → sequelize.sync()
- MongoDB ใช้ Subdocument → nested reports + comments ใน project เดียว

---

## Slide 6: API Endpoints
**Heading:** RESTful API — 15 Endpoints ครอบคลุมทุกฟีเจอร์
| Tag | Endpoints |
|---|---|
| Auth | POST /login, GET /me |
| Projects | GET, POST, PUT, PATCH, DELETE |
| Weekly Reports | POST submit, PUT update |
| Comments | POST add, GET list, DELETE |
| Files | POST upload, DELETE |
| Users | GET all, GET teachers/students, POST, DELETE |
| Courses | GET, POST, DELETE |
| Settings | GET, PUT bulk |

ทุก endpoint มี JWT Auth + Validation + Role Check

---

## Slide 7: Validation & Security
**Heading:** ตรวจสอบข้อมูลเข้มงวดทุกระดับ
- **express-validator** ตรวจสอบ input ทุก endpoint (email format, password length, enum values)
- **JWT Token** → ล็อกอินรับ token, ทุก request ต้องส่ง Bearer token
- **Role-Based Access** → student เห็นเฉพาะตัวเอง, teacher เห็นทีมตัวเอง, admin เห็นทั้งหมด
- **File Upload Validation** → จำกัดประเภทไฟล์ (PDF, DOCX, PPTX, ipynb, zip), จำกัดขนาด 10MB, จำกัด 5 ไฟล์/ครั้ง
- **Ownership Check** → ตรวจสอบว่าเป็น student ของโครงงานก่อนอัปโหลดไฟล์

---

## Slide 8: หน้า Dashboard
**Heading:** หน้าแรกแสดงภาพรวมแบบ Real-time
- แสดงสถิติรวม: โครงงานทั้งหมด, กำลังทำ, ส่งแล้ว, ตรวจแล้ว, อนุมัติแล้ว, ล่าช้า
- Progress Bar แสดง % ความคืบหน้าเฉลี่ย
- Cards แสดงโครงงานแต่ละโปรเจค พร้อม status badge สี
- กรองตาม role → อาจารย์เห็นเฉพาะทีมตัวเอง, นักศึกษาเห็นเฉพาะตัวเอง
- Sidebar Navigation → Dashboard, โครงงาน, รายงาน, ไฟล์, ตั้งค่า

---

## Slide 9: หน้าโครงงาน & รายงาน
**Heading:** จัดการโครงงานครบวงจรในหน้าเดียว
- แสดงรายละเอียดโครงงาน: ชื่อ, นักเรียน, อาจารย์, รายวิชา, dates
- Milestone Checklist → คำนวณ progress อัตโนมัติ
- Weekly Reports Timeline → แสดงรายงานแต่ละสัปดาห์พร้อม progress
- Comments → อาจารย์คอมเมนต์ให้ feedback ได้ทันที
- Files Section → อัปโหลด/ลบไฟล์แนบ

---

## Slide 10: ผลลัพธ์
**Heading:** ระบบทำงานได้จริงครบทุกฟังก์ชัน
- 3 Roles ทำงานได้ถูกต้อง: Student, Teacher, Admin
- CRUD ครบทั้ง Projects, Users, Courses, Settings
- Weekly Report + Comments ทำงาน end-to-end
- File Upload + Download ทำงานได้
- API Documentation ครบ: Swagger UI + Postman Collection
- Validation ทุก endpoint ป้องกันข้อมูลผิดพลาด

---

## Slide 11: เทคโนโลยีที่ใช้
**Heading:** Tech Stack — Modern Full-Stack
| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TailwindCSS, Material UI, Lucide Icons |
| Backend | Node.js, Express.js, JWT, express-validator |
| Database | MySQL (Sequelize), MongoDB (Mongoose) |
| File Upload | Multer |
| API Docs | Swagger/OpenAPI 3.0, Postman Collection |
| Dev Tools | nodemon, dotenv |

---

## Slide 12: สรุป
**Heading:** Student Project Tracking Dashboard — เสร็จสมบูรณ์
- Frontend + Backend + 2 Databases ทำงานครบถ้วน
- RESTful API + Validation + JWT Auth + RBAC
- Swagger API Docs + Postman Collection พร้อมใช้งาน
- ใช้งานได้จริง — npm install แล้วรันได้ทันที
- เหมาะสมกับการนำส่งเป็นโครงงานเรียน
