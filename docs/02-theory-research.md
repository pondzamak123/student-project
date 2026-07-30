# เนื้อหาส่วนที่ 2: ทฤษฎีการวิเคราะห์ การออกแบบระบบและงานวิจัยที่เกี่ยวข้อง

## 2.1 การวิเคราะห์และออกแบบระบบ

ทฤษฎีที่ใช้เป็นแนวทางสำหรับการดำเนินงานพัฒนาระบบ

### 2.1.1 วัฏจักรการพัฒนาซอฟต์แวร์ (SDLC)

โครงการนี้ใช้แนวคิด **Waterfall Model** ผสมกับ **Agile** ในการพัฒนา โดยแบ่งเป็น 5 ระยะ:

1. **Requirements Analysis** — วิเคราะห์ความต้องการจากผู้ใช้งาน (Student, Teacher, Admin)
2. **System Design** — ออกแบบ Architecture, Database Schema, API Endpoints
3. **Implementation** — พัฒนา Frontend (React) + Backend (Express) + Database
4. **Testing** — ทดสอบ API, UI, Integration, Security
5. **Deployment & Maintenance** — Deploy และบำรุงรักษา

### 2.1.2 Unified Modeling Language (UML)

ใช้ UML ในการออกแบบระบบ ได้แก่:
- **Use Case Diagram** — แสดง Actors และ Use Cases ของระบบ
- **Class Diagram** — แสดงโครงสร้าง Models, Controllers, Middleware
- **Sequence Diagram** — แสดงลำดับการทำงานระหว่าง Client → Server → Database
- **Activity Diagram** — แสดง Flow การทำงานของ Authentication
- **Deployment Diagram** — แสดง Environment (Dev / Production)

### 2.1.3 RESTful API Design

ระบบออกแบบตามหลัก RESTful Architecture:
- ใช้ HTTP Methods: GET, POST, PUT, PATCH, DELETE
- ใช้ JSON เป็น Format หลัก
- ใช้ JWT Bearer Token สำหรับ Authentication
- ใช้ HTTP Status Codes ตามมาตรฐาน (200, 201, 400, 401, 403, 404, 500)

### 2.1.4 MVC Architecture

ระบบใช้ **Model-View-Controller** Pattern:

| Layer | หน้าที่ | ตัวอย่างในโปรเจค |
|---|---|---|
| **Model** | ติดต่อ Database | Mongoose Models, Sequelize Models |
| **View** | แสดงผล UI | React Components |
| **Controller** | จัดการ Business Logic | authController, projectController |

### 2.1.5 Middleware Pattern

Express.js Middleware Chain:
```
Request → CORS → JSON Parser → Auth (JWT) → Validation → Controller → Response
```

### 2.1.6 Entity-Relationship Modeling

ใช้ ER Diagram ในการออกแบบ Database:
- **Entity** — Users, Courses, SystemSettings (MySQL) / Projects, Reports (MongoDB)
- **Relationship** — One-to-Many, Many-to-Many
- **Attributes** — Primary Key, Foreign Key, Unique Constraint

## 2.2 งานวิจัยที่เกี่ยวข้อง

### 2.2.1 Hybrid Database Architecture

การวิจัยเกี่ยวกับ **Polyglot Persistence** แสดงให้เห็นว่าการใช้ Database หลายประเภทร่วมกันสามารถเพิ่มประสิทธิภาพได้ โดย:
- **Relational Database (MySQL)** เหมาะกับข้อมูลที่มีโครงสร้างชัดเจน เช่น Users, Courses, Transactions
- **Document Database (MongoDB)** เหมาะกับข้อมูลที่มี Schema ยืดหยุ่น เช่น Projects ที่มี Subdocuments

### 2.2.2 Project Management Systems

ระบบติดตามโครงการที่ใช้กันทั่วไป เช่น Jira, Trello, Asana ใช้หลักการเดียวกันคือ:
- Task Tracking ด้วย Progress Bar
- Weekly/Monthly Reports
- Role-Based Access Control
- File Attachment Management

### 2.2.3 JWT Authentication

JSON Web Token (JWT) เป็นมาตรฐาน RFC 7519 ที่ใช้สำหรับการยืนยันตัวตนแบบ Stateless:
- **Header** — Algorithm Type (HS256)
- **Payload** — User Data (id, role, email)
- **Signature** — HMAC-SHA256 Signing

### 2.2.4 Frontend Frameworks

React.js เป็น Library ที่นิยมที่สุดสำหรับ Web Applications:
- **Component-Based Architecture** — แต่ละ Component มีความรับผิดชอบเดียว
- **Virtual DOM** — ทำให้ UI อัปเดตได้เร็ว
- **State Management** — ใช้ useState, useContext สำหรับ State

### 2.2.5 Input Validation

การใช้ **express-validator** สำหรับการตรวจสอบข้อมูลก่อนบันทึก:
- Server-side Validation ป้องกัน Injection Attacks
- Custom Validators สำหรับ Business Rules
- Sanitization ป้องกัน XSS

---

## งานวิจัยที่เกี่ยวข้อง

| หัวข้องานวิจัย | ผู้แต่ง | ปี | สรุป |
|---|---|---|---|
| Polyglot Persistence: Using Multiple Databases | Fowler, M. | 2011 | การใช้ DB หลายตัวร่วมกันตามลักษณะข้อมูล |
| RESTful Web Services | Richardson, L. | 2007 | หลักการออกแบบ REST API |
| JWT Best Practices | OWASP | 2020 | การใช้งาน JWT อย่างปลอดภัย |
| React Performance | Zhang et al. | 2022 | เทคนิคเพิ่มประสิทธิภาพ React App |
| MongoDB vs MySQL Performance | Gupta, R. | 2021 | เปรียบเทียบ Performance ของ NoSQL vs SQL |
