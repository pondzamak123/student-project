export type Role = "student" | "teacher" | "admin";

export type ProjectStatus = "in_progress" | "submitted" | "reviewed" | "approved" | "overdue";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar: string;
  department: string;
  studentId?: string;
}

export interface WeeklyReport {
  id: string;
  week: number;
  submittedAt: string;
  description: string;
  progress: number;
  issues: string;
  nextPlan: string;
  files: FileAttachment[];
  comments: Comment[];
  status: "pending" | "reviewed";
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
  content: string;
  createdAt: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface Project {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  coverImage?: string;
  studentIds: string[];
  studentNames: string[];
  courseCode: string;
  courseName: string;
  teacherId: string;
  teacherName: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  dueDate: string;
  grade?: string;
  tags: string[];
  tools: string[];
  milestones: Milestone[];
  weeklyReports: WeeklyReport[];
  files: FileAttachment[];
}

export const COURSES = [
  { code: "CS4820", name: "Machine Learning ขั้นสูง" },
  { code: "CS3540", name: "ปฏิสัมพันธ์ระหว่างมนุษย์และคอมพิวเตอร์" },
  { code: "DS4120", name: "วิทยาศาสตร์ข้อมูลและสังคม" },
  { code: "CS4710", name: "ระบบกระจาย" },
  { code: "AI4880", name: "การประยุกต์ใช้ AI เชิงสร้างสรรค์" },
  { code: "SE3210", name: "วิศวกรรมซอฟต์แวร์" },
  { code: "CS4310", name: "ความมั่นคงไซเบอร์" },
  { code: "IT3020", name: "การพัฒนาเว็บแอปพลิเคชัน" },
  { code: "DS3010", name: "การวิเคราะห์ข้อมูลขนาดใหญ่" },
  { code: "CS5010", name: "โครงงานวิจัยคอมพิวเตอร์" },
];

export const SUGGESTED_TOOLS = [
  "Python", "JavaScript", "TypeScript", "React", "Vue.js", "Next.js",
  "Node.js", "FastAPI", "Django", "Flask", "TensorFlow", "PyTorch",
  "scikit-learn", "Pandas", "NumPy", "OpenCV", "MediaPipe", "Figma",
  "Docker", "PostgreSQL", "MongoDB", "Firebase", "AWS", "Google Cloud",
  "React Native", "Flutter", "Swift", "Kotlin", "Arduino", "Raspberry Pi",
  "Solidity", "Web3.js", "Unity", "Blender", "MATLAB",
];

export const MOCK_USERS: User[] = [
  {
    id: "s001",
    name: "นายธนกร วงษ์สุวรรณ",
    email: "thanakorn.w@student.uni.ac.th",
    password: "student123",
    role: "student",
    avatar: "ธว",
    department: "วิศวกรรมคอมพิวเตอร์",
    studentId: "65010001",
  },
  {
    id: "s002",
    name: "นางสาวพิมพ์ชนก ศรีสมบัติ",
    email: "pimchanok.s@student.uni.ac.th",
    password: "student123",
    role: "student",
    avatar: "พศ",
    department: "วิทยาการคอมพิวเตอร์",
    studentId: "65010042",
  },
  {
    id: "s003",
    name: "นายวรุตม์ ชัยเจริญ",
    email: "warut.c@student.uni.ac.th",
    password: "student123",
    role: "student",
    avatar: "วช",
    department: "เทคโนโลยีสารสนเทศ",
    studentId: "65010078",
  },
  {
    id: "s004",
    name: "นางสาวกนกวรรณ ลิ้มสกุล",
    email: "kanokwan.l@student.uni.ac.th",
    password: "student123",
    role: "student",
    avatar: "กล",
    department: "วิศวกรรมคอมพิวเตอร์",
    studentId: "65010093",
  },
  {
    id: "s005",
    name: "นายภูมิรพี สิงห์ทอง",
    email: "phumrapi.s@student.uni.ac.th",
    password: "student123",
    role: "student",
    avatar: "ภส",
    department: "วิทยาการคอมพิวเตอร์",
    studentId: "65010115",
  },
  {
    id: "s006",
    name: "นางสาวนภัสสร เพชรรัตน์",
    email: "naphatsorn.p@student.uni.ac.th",
    password: "student123",
    role: "student",
    avatar: "นพ",
    department: "เทคโนโลยีสารสนเทศ",
    studentId: "65010132",
  },
  {
    id: "s007",
    name: "นายอานนท์ ดาวเรือง",
    email: "arnon.d@student.uni.ac.th",
    password: "student123",
    role: "student",
    avatar: "อด",
    department: "วิศวกรรมคอมพิวเตอร์",
    studentId: "65010158",
  },
  {
    id: "s008",
    name: "นางสาวชนาภา ฤทธิรงค์",
    email: "chanapa.r@student.uni.ac.th",
    password: "student123",
    role: "student",
    avatar: "ชร",
    department: "วิทยาการคอมพิวเตอร์",
    studentId: "65010174",
  },
  {
    id: "t001",
    name: "รศ.ดร.สมชาย ใจดี",
    email: "somchai.j@uni.ac.th",
    password: "teacher123",
    role: "teacher",
    avatar: "สจ",
    department: "วิศวกรรมคอมพิวเตอร์",
  },
  {
    id: "t002",
    name: "ผศ.ดร.วิภาวดี ทองคำ",
    email: "wipawadee.t@uni.ac.th",
    password: "teacher123",
    role: "teacher",
    avatar: "วท",
    department: "วิทยาการคอมพิวเตอร์",
  },
  {
    id: "admin1",
    name: "นายอภิชาต ระบบดี",
    email: "admin@uni.ac.th",
    password: "admin123",
    role: "admin",
    avatar: "อร",
    department: "ฝ่ายเทคโนโลยีสารสนเทศ",
  },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: "p1",
    title: "ระบบตรวจจับโรคพืชด้วย Machine Learning",
    titleEn: "Plant Disease Detection using Machine Learning",
    description: "พัฒนาระบบตรวจจับโรคพืชจากภาพถ่ายใบไม้โดยใช้โมเดล CNN และ Transfer Learning บน ResNet50 ฝึกสอนด้วยชุดข้อมูล PlantVillage",
    studentIds: ["s001"],
    studentNames: ["นายธนกร วงษ์สุวรรณ"],
    courseCode: "CS4820",
    courseName: "Machine Learning ขั้นสูง",
    teacherId: "t001",
    teacherName: "รศ.ดร.สมชาย ใจดี",
    status: "in_progress",
    progress: 65,
    startDate: "2025-11-01",
    dueDate: "2026-07-31",
    tags: ["Python", "TensorFlow", "CNN", "Computer Vision"],
    tools: ["Python", "TensorFlow", "Google Colab", "OpenCV", "Matplotlib"],
    milestones: [
      { id: "m1", title: "ทบทวนวรรณกรรมและเก็บรวบรวมข้อมูล", dueDate: "2025-12-01", completed: true },
      { id: "m2", title: "ออกแบบสถาปัตยกรรมโมเดล", dueDate: "2026-01-15", completed: true },
      { id: "m3", title: "ฝึกสอนและทดสอบโมเดล", dueDate: "2026-03-01", completed: true },
      { id: "m4", title: "ประเมินผลและปรับปรุงโมเดล", dueDate: "2026-05-01", completed: false },
      { id: "m5", title: "จัดทำรายงานฉบับสมบูรณ์", dueDate: "2026-07-20", completed: false },
    ],
    weeklyReports: [
      {
        id: "wr1",
        week: 1,
        submittedAt: "2025-11-08",
        description: "ศึกษาและทบทวนวรรณกรรมที่เกี่ยวข้อง ค้นคว้าโมเดล CNN ที่นิยมใช้ในการจำแนกโรคพืช",
        progress: 10,
        issues: "ยังไม่มีปัญหาในขั้นตอนนี้",
        nextPlan: "เริ่มดาวน์โหลดและเตรียมชุดข้อมูล PlantVillage",
        files: [{ id: "f1", name: "สัปดาห์1_รายงาน.pdf", size: "1.2 MB", type: "pdf", uploadedAt: "2025-11-08", uploadedBy: "นายธนกร วงษ์สุวรรณ" }],
        comments: [
          { id: "c1", authorId: "t001", authorName: "รศ.ดร.สมชาย ใจดี", authorRole: "teacher", content: "ดีมาก ขอให้เพิ่มการอ้างอิงในรายงานให้ครบถ้วน และระบุ gap ของงานวิจัยที่พบด้วย", createdAt: "2025-11-10" },
        ],
        status: "reviewed",
      },
      {
        id: "wr2",
        week: 2,
        submittedAt: "2025-11-15",
        description: "ดาวน์โหลดชุดข้อมูล PlantVillage จำนวน 54,306 ภาพ แบ่งเป็น 38 class และเริ่มทำ Data Augmentation",
        progress: 18,
        issues: "พบปัญหา class imbalance ในบางโรค ต้องหาวิธีแก้ไข",
        nextPlan: "ออกแบบโครงสร้าง CNN และ transfer learning pipeline",
        files: [
          { id: "f2", name: "สัปดาห์2_รายงาน.pdf", size: "2.1 MB", type: "pdf", uploadedAt: "2025-11-15", uploadedBy: "นายธนกร วงษ์สุวรรณ" },
          { id: "f3", name: "data_analysis.ipynb", size: "450 KB", type: "ipynb", uploadedAt: "2025-11-15", uploadedBy: "นายธนกร วงษ์สุวรรณ" },
        ],
        comments: [],
        status: "reviewed",
      },
      {
        id: "wr3",
        week: 8,
        submittedAt: "2026-01-10",
        description: "ฝึกสอนโมเดล ResNet50 ได้ความแม่นยำ 87.3% บน validation set และเริ่ม fine-tuning",
        progress: 45,
        issues: "การ fine-tuning ใช้เวลานาน GPU มีข้อจำกัด",
        nextPlan: "ทดสอบกับข้อมูลจริงจากภาพถ่ายในสภาพแสงต่างกัน",
        files: [{ id: "f4", name: "สัปดาห์8_รายงาน.pdf", size: "3.4 MB", type: "pdf", uploadedAt: "2026-01-10", uploadedBy: "นายธนกร วงษ์สุวรรณ" }],
        comments: [
          { id: "c2", authorId: "t001", authorName: "รศ.ดร.สมชาย ใจดี", authorRole: "teacher", content: "ผลลัพธ์ดีเกินคาด 87.3% ถือว่าดีมาก ขั้นต่อไปลองทดสอบกับ EfficientNet เพื่อเปรียบเทียบด้วย", createdAt: "2026-01-12" },
        ],
        status: "reviewed",
      },
      {
        id: "wr4",
        week: 12,
        submittedAt: "2026-02-07",
        description: "เปรียบเทียบ EfficientNet-B3 vs ResNet50 พบว่า EfficientNet ให้ผลดีกว่าที่ 91.2% พร้อมทดสอบในสภาพจริง",
        progress: 65,
        issues: "ภาพที่ถ่ายในสภาพแสงน้อยยังให้ความแม่นยำต่ำ ประมาณ 72%",
        nextPlan: "ปรับ preprocessing และทดสอบ data augmentation เพิ่มเติม",
        files: [{ id: "f5", name: "สัปดาห์12_รายงาน.pdf", size: "4.1 MB", type: "pdf", uploadedAt: "2026-02-07", uploadedBy: "นายธนกร วงษ์สุวรรณ" }],
        comments: [],
        status: "pending",
      },
    ],
    files: [
      { id: "pf1", name: "เค้าโครงโครงงาน.pdf", size: "2.4 MB", type: "pdf", uploadedAt: "2025-11-03", uploadedBy: "นายธนกร วงษ์สุวรรณ" },
    ],
  },
  {
    id: "p2",
    title: "แอปพลิเคชันแปลภาษามือเป็นข้อความแบบเรียลไทม์",
    titleEn: "Real-Time Sign Language to Text Translation App",
    description: "พัฒนาแอปพลิเคชันมือถือที่ใช้ MediaPipe และ LSTM แปลภาษามืออเมริกัน (ASL) เป็นข้อความและเสียงแบบเรียลไทม์",
    studentIds: ["s002"],
    studentNames: ["นางสาวพิมพ์ชนก ศรีสมบัติ"],
    courseCode: "CS3540",
    courseName: "ปฏิสัมพันธ์ระหว่างมนุษย์และคอมพิวเตอร์",
    teacherId: "t002",
    teacherName: "ผศ.ดร.วิภาวดี ทองคำ",
    status: "reviewed",
    progress: 100,
    startDate: "2025-11-01",
    dueDate: "2026-05-31",
    grade: "A",
    tags: ["React Native", "MediaPipe", "LSTM", "Accessibility"],
    tools: ["React Native", "Python", "MediaPipe", "TensorFlow Lite", "Expo"],
    milestones: [
      { id: "m6", title: "รวบรวมชุดข้อมูลท่าทาง ASL", dueDate: "2025-12-01", completed: true },
      { id: "m7", title: "ฝึกสอนโมเดล LSTM", dueDate: "2026-01-31", completed: true },
      { id: "m8", title: "พัฒนาต้นแบบแอปมือถือ", dueDate: "2026-03-15", completed: true },
      { id: "m9", title: "ทดสอบกับผู้ใช้งานจริง", dueDate: "2026-04-30", completed: true },
      { id: "m10", title: "ส่งรายงานฉบับสมบูรณ์", dueDate: "2026-05-30", completed: true },
    ],
    weeklyReports: [
      {
        id: "wr5",
        week: 20,
        submittedAt: "2026-05-15",
        description: "ทดสอบแอปกับกลุ่มผู้ใช้งาน 30 คน ได้ความแม่นยำ 93.2% และได้รับคะแนนความพึงพอใจ 4.6/5.0",
        progress: 95,
        issues: "ไม่มีปัญหา",
        nextPlan: "จัดทำรายงานฉบับสมบูรณ์และส่งโครงงาน",
        files: [{ id: "f6", name: "สัปดาห์20_รายงาน.pdf", size: "5.2 MB", type: "pdf", uploadedAt: "2026-05-15", uploadedBy: "นางสาวพิมพ์ชนก ศรีสมบัติ" }],
        comments: [
          { id: "c3", authorId: "t002", authorName: "ผศ.ดร.วิภาวดี ทองคำ", authorRole: "teacher", content: "ยอดเยี่ยมมาก! ผลการทดสอบ 93.2% ดีเกินเป้าหมาย และมีศักยภาพในการตีพิมพ์เป็นบทความวิจัยได้", createdAt: "2026-05-17" },
        ],
        status: "reviewed",
      },
    ],
    files: [
      { id: "pf2", name: "รายงานฉบับสมบูรณ์.pdf", size: "8.7 MB", type: "pdf", uploadedAt: "2026-05-30", uploadedBy: "นางสาวพิมพ์ชนก ศรีสมบัติ" },
    ],
  },
  {
    id: "p3",
    title: "ระบบวิเคราะห์ความเสี่ยงการออกกลางคันของนักศึกษา",
    titleEn: "Student Dropout Risk Analysis System",
    description: "ใช้ Ensemble Learning วิเคราะห์ข้อมูลนักศึกษาเพื่อคาดการณ์ความเสี่ยงการออกกลางคัน และแนะนำการแทรกแซงเชิงรุก",
    studentIds: ["s003"],
    studentNames: ["นายวรุตม์ ชัยเจริญ"],
    courseCode: "DS4120",
    courseName: "วิทยาศาสตร์ข้อมูลและสังคม",
    teacherId: "t002",
    teacherName: "ผศ.ดร.วิภาวดี ทองคำ",
    status: "overdue",
    progress: 30,
    startDate: "2025-11-01",
    dueDate: "2026-05-31",
    tags: ["Python", "scikit-learn", "Data Analytics", "Education"],
    tools: ["Python", "scikit-learn", "Pandas", "R", "Tableau"],
    milestones: [
      { id: "m11", title: "ขอใช้ข้อมูลนักศึกษา (IRB)", dueDate: "2025-12-01", completed: true },
      { id: "m12", title: "สำรวจและวิเคราะห์ข้อมูลเบื้องต้น", dueDate: "2026-01-31", completed: true },
      { id: "m13", title: "สร้าง Feature Engineering", dueDate: "2026-03-15", completed: false },
      { id: "m14", title: "เปรียบเทียบโมเดล", dueDate: "2026-04-30", completed: false },
      { id: "m15", title: "จัดทำรายงาน", dueDate: "2026-05-31", completed: false },
    ],
    weeklyReports: [
      {
        id: "wr6",
        week: 10,
        submittedAt: "2026-01-17",
        description: "วิเคราะห์ข้อมูลนักศึกษา 5 ปีย้อนหลัง พบ pattern สำคัญเกี่ยวกับ GPA และการขาดเรียน",
        progress: 28,
        issues: "ข้อมูลมีความไม่สมบูรณ์ประมาณ 15% ต้องทำ data cleaning",
        nextPlan: "ทำ feature engineering และสร้าง baseline model",
        files: [],
        comments: [
          { id: "c4", authorId: "t002", authorName: "ผศ.ดร.วิภาวดี ทองคำ", authorRole: "teacher", content: "ยังไม่เห็น progress ที่ชัดเจน กรุณานำส่งผล EDA และ notebook ด้วย และขอให้ติดต่ออาจารย์เพื่อนัดหารือด่วน", createdAt: "2026-01-20" },
        ],
        status: "reviewed",
      },
    ],
    files: [],
  },
];

export const getProjectsByRole = (role: Role, userId: string, projects: Project[]): Project[] => {
  if (role === "admin") return projects;
  if (role === "teacher") return projects.filter(p => p.teacherId === userId);
  return projects.filter(p => p.studentIds.includes(userId));
};
