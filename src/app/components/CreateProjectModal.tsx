import { useState, useRef, useCallback } from "react";
import {
  Project, User, MOCK_USERS, COURSES, SUGGESTED_TOOLS, Milestone, FileAttachment,
} from "./data";
import {
  X, ChevronRight, ChevronLeft, Check,
  Info, Users, Wrench, ImagePlus,
  Plus, Trash2, Search, UserPlus, Calendar,
  BookOpen, AlignLeft, Tag, Paperclip, Upload,
  GripVertical, AlertCircle, FolderPlus,
} from "lucide-react";

interface CreateProjectModalProps {
  currentUser: User;
  onClose: () => void;
  onSubmit: (project: Project) => void;
}

interface FormData {
  title: string;
  titleEn: string;
  description: string;
  courseCode: string;
  courseName: string;
  teacherId: string;
  teacherName: string;
  startDate: string;
  dueDate: string;
  memberIds: string[];
  memberNames: string[];
  milestones: { title: string; dueDate: string }[];
  tools: string[];
  tags: string[];
  coverImage: string;
  files: FileAttachment[];
}

const STEPS = [
  { id: 1, label: "ข้อมูลโครงงาน", icon: Info },
  { id: 2, label: "สมาชิกกลุ่ม", icon: Users },
  { id: 3, label: "งาน & เครื่องมือ", icon: Wrench },
  { id: 4, label: "รูปและไฟล์", icon: ImagePlus },
];

const TEACHERS = MOCK_USERS.filter(u => u.role === "teacher");
const STUDENTS = MOCK_USERS.filter(u => u.role === "student");

/* ─── Step 1 ─────────────────────────────────────────── */
function Step1({ data, onChange, errors }: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
  errors: Record<string, string>;
}) {
  const selectedCourse = COURSES.find(c => c.code === data.courseCode);

  const handleCourseChange = (code: string) => {
    const course = COURSES.find(c => c.code === code);
    onChange({ courseCode: code, courseName: course?.name ?? "" });
  };

  const handleTeacherChange = (id: string) => {
    const t = TEACHERS.find(u => u.id === id);
    onChange({ teacherId: id, teacherName: t?.name ?? "" });
  };

  return (
    <div className="space-y-5">
      <div>
        <label style={labelStyle}>ชื่อโครงงาน (ภาษาไทย) <span style={{ color: "var(--destructive)" }}>*</span></label>
        <input
          value={data.title}
          onChange={e => onChange({ title: e.target.value })}
          placeholder="เช่น ระบบแนะนำหนังสือด้วย Machine Learning"
          style={{ ...inputStyle, borderColor: errors.title ? "var(--destructive)" : "var(--border-strong)" }}
        />
        {errors.title && <p style={errorStyle}><AlertCircle size={12} />{errors.title}</p>}
      </div>

      <div>
        <label style={labelStyle}>ชื่อโครงงาน (ภาษาอังกฤษ)</label>
        <input
          value={data.titleEn}
          onChange={e => onChange({ titleEn: e.target.value })}
          placeholder="e.g. Book Recommendation System using Machine Learning"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>คำอธิบายโครงงาน <span style={{ color: "var(--destructive)" }}>*</span></label>
        <textarea
          rows={4}
          value={data.description}
          onChange={e => onChange({ description: e.target.value })}
          placeholder="อธิบายวัตถุประสงค์ ขอบเขต และวิธีการของโครงงาน…"
          style={{ ...inputStyle, resize: "none", borderColor: errors.description ? "var(--destructive)" : "var(--border-strong)" }}
        />
        {errors.description && <p style={errorStyle}><AlertCircle size={12} />{errors.description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}><BookOpen size={13} style={{ display: "inline" }} /> รายวิชา <span style={{ color: "var(--destructive)" }}>*</span></label>
          <select
            value={data.courseCode}
            onChange={e => handleCourseChange(e.target.value)}
            style={{ ...inputStyle, cursor: "pointer", borderColor: errors.courseCode ? "var(--destructive)" : "var(--border-strong)" }}
          >
            <option value="">— เลือกรายวิชา —</option>
            {COURSES.map(c => (
              <option key={c.code} value={c.code}>{c.code} · {c.name}</option>
            ))}
          </select>
          {errors.courseCode && <p style={errorStyle}><AlertCircle size={12} />{errors.courseCode}</p>}
        </div>

        <div>
          <label style={labelStyle}><Users size={13} style={{ display: "inline" }} /> อาจารย์ที่ปรึกษา <span style={{ color: "var(--destructive)" }}>*</span></label>
          <select
            value={data.teacherId}
            onChange={e => handleTeacherChange(e.target.value)}
            style={{ ...inputStyle, cursor: "pointer", borderColor: errors.teacherId ? "var(--destructive)" : "var(--border-strong)" }}
          >
            <option value="">— เลือกอาจารย์ —</option>
            {TEACHERS.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          {errors.teacherId && <p style={errorStyle}><AlertCircle size={12} />{errors.teacherId}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}><Calendar size={13} style={{ display: "inline" }} /> วันเริ่มต้น <span style={{ color: "var(--destructive)" }}>*</span></label>
          <input
            type="date"
            value={data.startDate}
            onChange={e => onChange({ startDate: e.target.value })}
            style={{ ...inputStyle, borderColor: errors.startDate ? "var(--destructive)" : "var(--border-strong)" }}
          />
          {errors.startDate && <p style={errorStyle}><AlertCircle size={12} />{errors.startDate}</p>}
        </div>
        <div>
          <label style={labelStyle}><Calendar size={13} style={{ display: "inline" }} /> กำหนดส่ง <span style={{ color: "var(--destructive)" }}>*</span></label>
          <input
            type="date"
            value={data.dueDate}
            onChange={e => onChange({ dueDate: e.target.value })}
            style={{ ...inputStyle, borderColor: errors.dueDate ? "var(--destructive)" : "var(--border-strong)" }}
          />
          {errors.dueDate && <p style={errorStyle}><AlertCircle size={12} />{errors.dueDate}</p>}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 2 ─────────────────────────────────────────── */
function Step2({ data, onChange, currentUser }: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
  currentUser: User;
}) {
  const [search, setSearch] = useState("");

  const candidates = STUDENTS.filter(
    s => s.id !== currentUser.id &&
      !data.memberIds.includes(s.id) &&
      (s.name.includes(search) || s.studentId?.includes(search) || s.department.includes(search) || s.email.includes(search))
  );

  const addMember = (student: User) => {
    onChange({
      memberIds: [...data.memberIds, student.id],
      memberNames: [...data.memberNames, student.name],
    });
    setSearch("");
  };

  const removeMember = (id: string) => {
    const idx = data.memberIds.indexOf(id);
    onChange({
      memberIds: data.memberIds.filter(mid => mid !== id),
      memberNames: data.memberNames.filter((_, i) => i !== idx),
    });
  };

  const allMembers = [currentUser, ...STUDENTS.filter(s => data.memberIds.includes(s.id))];

  return (
    <div className="space-y-5">
      {/* Current members */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label style={labelStyle}>สมาชิกในกลุ่ม ({allMembers.length} คน)</label>
          <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>รองรับสูงสุด 5 คน</span>
        </div>
        <div className="space-y-2">
          {allMembers.map((m, i) => (
            <div
              key={m.id}
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: i === 0 ? "#EFF6FF" : "var(--muted)", border: `1px solid ${i === 0 ? "#BFDBFE" : "var(--border)"}` }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ background: i === 0 ? "var(--primary)" : "var(--muted-foreground)", color: "#FFFFFF", fontSize: "12px", fontWeight: 700 }}
              >
                {m.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--foreground)" }}>{m.name}</p>
                <p style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>
                  {m.studentId && `รหัส ${m.studentId} · `}{m.department}
                </p>
              </div>
              {i === 0 ? (
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary)", background: "#DBEAFE", padding: "3px 10px", borderRadius: "999px" }}>เจ้าของ</span>
              ) : (
                <button
                  onClick={() => removeMember(m.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--destructive)", padding: "6px", borderRadius: "8px" }}
                  title="นำออก"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Search & add */}
      {allMembers.length < 5 && (
        <div>
          <label style={labelStyle}><UserPlus size={13} style={{ display: "inline" }} /> เพิ่มสมาชิก</label>
          <div className="relative mb-3">
            <Search size={15} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ค้นหาด้วยชื่อ, รหัสนักศึกษา, หรือภาควิชา…"
              style={{ ...inputStyle, paddingLeft: "40px" }}
            />
          </div>

          {(search || candidates.length > 0) && (
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)", maxHeight: "260px", overflowY: "auto" }}>
              {candidates.length === 0 ? (
                <div className="py-8 text-center">
                  <Search size={24} style={{ color: "var(--muted-foreground)", margin: "0 auto 8px" }} />
                  <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>ไม่พบนักศึกษาที่ตรงกัน</p>
                </div>
              ) : (
                candidates.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => addMember(s)}
                    className="w-full flex items-center gap-3 px-4 py-3 transition-all text-left"
                    style={{ background: "var(--card)", border: "none", borderTop: i > 0 ? "1px solid var(--border)" : "none", cursor: "pointer" }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "var(--secondary)", color: "var(--primary)", fontSize: "12px", fontWeight: 700 }}
                    >
                      {s.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--foreground)" }}>{s.name}</p>
                      <p style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>รหัส {s.studentId} · {s.department}</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg shrink-0" style={{ background: "var(--secondary)", color: "var(--primary)" }}>
                      <Plus size={13} />
                      <span style={{ fontSize: "12px", fontWeight: 600 }}>เพิ่ม</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {allMembers.length >= 5 && (
        <div className="flex items-center gap-2 rounded-xl px-4 py-3" style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}>
          <AlertCircle size={15} style={{ color: "#D97706", flexShrink: 0 }} />
          <p style={{ fontSize: "13px", color: "#92400E" }}>กลุ่มเต็มแล้ว (สูงสุด 5 คน)</p>
        </div>
      )}
    </div>
  );
}

/* ─── Step 3 ─────────────────────────────────────────── */
function Step3({ data, onChange }: { data: FormData; onChange: (patch: Partial<FormData>) => void; errors: Record<string, string> }) {
  const [newTask, setNewTask] = useState({ title: "", dueDate: "" });
  const [toolInput, setToolInput] = useState("");

  const addMilestone = () => {
    if (!newTask.title.trim()) return;
    onChange({ milestones: [...data.milestones, { ...newTask, title: newTask.title.trim() }] });
    setNewTask({ title: "", dueDate: "" });
  };

  const removeMilestone = (i: number) => {
    onChange({ milestones: data.milestones.filter((_, j) => j !== i) });
  };

  const updateMilestone = (i: number, patch: Partial<{ title: string; dueDate: string }>) => {
    onChange({ milestones: data.milestones.map((m, j) => j === i ? { ...m, ...patch } : m) });
  };

  const addTool = (tool: string) => {
    const t = tool.trim();
    if (!t || data.tools.includes(t)) return;
    onChange({ tools: [...data.tools, t] });
    setToolInput("");
  };

  const removeTool = (tool: string) => {
    onChange({ tools: data.tools.filter(t => t !== tool) });
  };

  const filteredSuggestions = SUGGESTED_TOOLS.filter(
    t => !data.tools.includes(t) && t.toLowerCase().includes(toolInput.toLowerCase())
  ).slice(0, 12);

  return (
    <div className="space-y-6">
      {/* Milestones */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <label style={{ ...labelStyle, margin: 0 }}>งานที่ต้องทำ (Milestones)</label>
          <span style={{ fontSize: "11px", color: "var(--muted-foreground)", background: "var(--muted)", padding: "2px 8px", borderRadius: "999px" }}>
            {data.milestones.length} รายการ
          </span>
        </div>

        {data.milestones.length > 0 && (
          <div className="space-y-2 mb-4">
            {data.milestones.map((m, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <GripVertical size={15} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, minWidth: "24px" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <input
                  value={m.title}
                  onChange={e => updateMilestone(i, { title: e.target.value })}
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "13.5px", color: "var(--foreground)", fontWeight: 500 }}
                />
                <input
                  type="date"
                  value={m.dueDate}
                  onChange={e => updateMilestone(i, { dueDate: e.target.value })}
                  style={{ fontSize: "12px", color: "var(--muted-foreground)", background: "var(--muted)", border: "none", outline: "none", borderRadius: "8px", padding: "4px 8px", cursor: "pointer" }}
                />
                <button
                  onClick={() => removeMilestone(i)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", padding: "4px", borderRadius: "6px", flexShrink: 0 }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add milestone */}
        <div className="flex gap-2 rounded-xl p-3" style={{ background: "var(--muted)", border: "1.5px dashed var(--border-strong)" }}>
          <input
            value={newTask.title}
            onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && addMilestone()}
            placeholder="ชื่องาน เช่น ออกแบบฐานข้อมูล…"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "13px", color: "var(--foreground)" }}
          />
          <input
            type="date"
            value={newTask.dueDate}
            onChange={e => setNewTask(p => ({ ...p, dueDate: e.target.value }))}
            style={{ fontSize: "12px", color: "var(--muted-foreground)", background: "var(--card)", border: "1px solid var(--border)", outline: "none", borderRadius: "8px", padding: "4px 8px", cursor: "pointer" }}
          />
          <button
            onClick={addMilestone}
            disabled={!newTask.title.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
            style={{ background: newTask.title.trim() ? "var(--primary)" : "var(--muted-foreground)", color: "#FFFFFF", border: "none", cursor: newTask.title.trim() ? "pointer" : "not-allowed", fontSize: "12px", fontWeight: 600, flexShrink: 0 }}
          >
            <Plus size={13} /> เพิ่ม
          </button>
        </div>
      </div>

      {/* Tools */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <label style={{ ...labelStyle, margin: 0 }}>เครื่องมือและเทคโนโลยีที่ใช้</label>
          <span style={{ fontSize: "11px", color: "var(--muted-foreground)", background: "var(--muted)", padding: "2px 8px", borderRadius: "999px" }}>
            {data.tools.length} รายการ
          </span>
        </div>

        {/* Selected tools chips */}
        {data.tools.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {data.tools.map(tool => (
              <span
                key={tool}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg"
                style={{ background: "var(--primary)", color: "#FFFFFF", fontSize: "12px", fontWeight: 600 }}
              >
                <Tag size={11} />
                {tool}
                <button
                  onClick={() => removeTool(tool)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", padding: "0 0 0 2px", lineHeight: 1 }}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="relative mb-3">
          <input
            value={toolInput}
            onChange={e => setToolInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { addTool(toolInput); e.preventDefault(); } }}
            placeholder="พิมพ์ชื่อเครื่องมือแล้วกด Enter เช่น Python, React, Docker…"
            style={inputStyle}
          />
        </div>

        {/* Suggestions */}
        <div>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--muted-foreground)", marginBottom: "8px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            คำแนะนำที่นิยม
          </p>
          <div className="flex flex-wrap gap-2">
            {filteredSuggestions.map(tool => (
              <button
                key={tool}
                onClick={() => addTool(tool)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all"
                style={{ background: "var(--secondary)", color: "var(--primary)", fontSize: "12px", fontWeight: 500, border: "1px solid var(--border)", cursor: "pointer" }}
              >
                <Plus size={11} /> {tool}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label style={labelStyle}><Tag size={13} style={{ display: "inline" }} /> คีย์เวิร์ด / แท็ก</label>
        <TagInput
          value={data.tags}
          onChange={tags => onChange({ tags })}
          placeholder="พิมพ์คีย์เวิร์ดแล้วกด Enter เช่น Machine Learning, Healthcare…"
        />
      </div>
    </div>
  );
}

function TagInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [input, setInput] = useState("");
  const add = () => {
    const t = input.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setInput("");
  };
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map(tag => (
          <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-lg" style={{ background: "var(--secondary)", color: "var(--secondary-foreground)", fontSize: "12px", fontWeight: 500, border: "1px solid var(--border)" }}>
            {tag}
            <button onClick={() => onChange(value.filter(t => t !== tag))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", padding: "0 0 0 2px" }}>
              <X size={11} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { add(); e.preventDefault(); } }}
          placeholder={placeholder}
          style={{ ...inputStyle, flex: 1 }}
        />
        <button onClick={add} disabled={!input.trim()} style={{ background: input.trim() ? "var(--secondary)" : "var(--muted)", color: "var(--primary)", border: "none", cursor: input.trim() ? "pointer" : "not-allowed", borderRadius: "12px", padding: "0 16px", fontSize: "12px", fontWeight: 700 }}>
          + เพิ่ม
        </button>
      </div>
    </div>
  );
}

/* ─── Step 4 ─────────────────────────────────────────── */
function Step4({ data, onChange }: { data: FormData; onChange: (patch: Partial<FormData>) => void }) {
  const coverRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [coverDrag, setCoverDrag] = useState(false);
  const [fileDrag, setFileDrag] = useState(false);

  const handleCoverFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => onChange({ coverImage: e.target?.result as string });
    reader.readAsDataURL(file);
  };

  const handleAttachFiles = (inputFiles: FileList | null) => {
    if (!inputFiles) return;
    const newFiles: FileAttachment[] = Array.from(inputFiles).map(f => ({
      id: `f_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name: f.name,
      size: f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : `${Math.round(f.size / 1024)} KB`,
      type: f.name.split(".").pop()?.toLowerCase() ?? "file",
      uploadedAt: new Date().toISOString().slice(0, 10),
      uploadedBy: "ผู้สร้างโครงงาน",
    }));
    onChange({ files: [...data.files, ...newFiles] });
  };

  const fileTypeColor: Record<string, string> = {
    pdf: "#DC2626", docx: "#1A56DB", pptx: "#D97706",
    ipynb: "#D97706", zip: "#7C3AED", xlsx: "#16A34A",
  };

  return (
    <div className="space-y-6">
      {/* Cover image */}
      <div>
        <label style={labelStyle}><ImagePlus size={13} style={{ display: "inline" }} /> ภาพปกโครงงาน (ไม่บังคับ)</label>

        {data.coverImage ? (
          <div className="relative rounded-xl overflow-hidden" style={{ height: "180px" }}>
            <img src={data.coverImage} alt="cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.3)" }}>
              <button
                onClick={() => onChange({ coverImage: "" })}
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: "rgba(255,255,255,0.9)", color: "var(--destructive)", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 700 }}
              >
                <Trash2 size={14} /> ลบภาพ
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => coverRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setCoverDrag(true); }}
            onDragLeave={() => setCoverDrag(false)}
            onDrop={e => { e.preventDefault(); setCoverDrag(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) handleCoverFile(f); }}
            className="flex flex-col items-center justify-center rounded-xl py-10 cursor-pointer transition-all"
            style={{
              border: `2px dashed ${coverDrag ? "var(--primary)" : "var(--border-strong)"}`,
              background: coverDrag ? "var(--secondary)" : "var(--input-background)",
            }}
          >
            <ImagePlus size={28} style={{ color: coverDrag ? "var(--primary)" : "var(--muted-foreground)", marginBottom: "10px" }} />
            <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--foreground)", marginBottom: "4px" }}>
              {coverDrag ? "วางรูปที่นี่" : "ลากรูปมาวาง หรือคลิกเพื่อเลือก"}
            </p>
            <p style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>JPG, PNG, WEBP — แนะนำขนาด 1200×630</p>
            <input
              ref={coverRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleCoverFile(f); e.target.value = ""; }}
            />
          </div>
        )}
      </div>

      {/* File attachments */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label style={{ ...labelStyle, margin: 0 }}><Paperclip size={13} style={{ display: "inline" }} /> เอกสารและไฟล์แนบ</label>
          <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{data.files.length} ไฟล์</span>
        </div>

        {/* Drop zone */}
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setFileDrag(true); }}
          onDragLeave={() => setFileDrag(false)}
          onDrop={e => { e.preventDefault(); setFileDrag(false); handleAttachFiles(e.dataTransfer.files); }}
          className="flex items-center gap-3 rounded-xl px-5 py-4 cursor-pointer transition-all mb-3"
          style={{
            border: `2px dashed ${fileDrag ? "var(--primary)" : "var(--border-strong)"}`,
            background: fileDrag ? "var(--secondary)" : "var(--input-background)",
          }}
        >
          <Upload size={20} style={{ color: fileDrag ? "var(--primary)" : "var(--muted-foreground)", flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)" }}>
              {fileDrag ? "วางไฟล์ที่นี่" : "ลากไฟล์มาวาง หรือคลิกเพื่อเลือก"}
            </p>
            <p style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: "2px" }}>
              รองรับ PDF, DOCX, PPTX, IPYNB, ZIP, XLSX และอื่นๆ
            </p>
          </div>
          <input ref={fileRef} type="file" multiple className="hidden" onChange={e => { handleAttachFiles(e.target.files); e.target.value = ""; }} />
        </div>

        {/* File list */}
        {data.files.length > 0 && (
          <div className="space-y-2">
            {data.files.map((file, i) => (
              <div key={file.id} className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${fileTypeColor[file.type] ?? "#6B7280"}18` }}
                >
                  <Paperclip size={15} style={{ color: fileTypeColor[file.type] ?? "var(--muted-foreground)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
                  <p style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{file.size} · .{file.type.toUpperCase()}</p>
                </div>
                <button
                  onClick={() => onChange({ files: data.files.filter((_, j) => j !== i) })}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--destructive)", padding: "6px", borderRadius: "8px", flexShrink: 0 }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Shared styles ──────────────────────────────────── */
const labelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "5px",
  fontSize: "13px",
  fontWeight: 700,
  color: "var(--foreground)",
  marginBottom: "7px",
};

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "10px 14px",
  borderRadius: "12px",
  background: "var(--input-background)",
  border: "1.5px solid var(--border-strong)",
  fontSize: "13.5px",
  color: "var(--foreground)",
  outline: "none",
  fontFamily: "inherit",
  lineHeight: 1.6,
  boxSizing: "border-box",
};

const errorStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "5px",
  marginTop: "5px",
  fontSize: "12px",
  color: "var(--destructive)",
};

/* ─── Main Modal ─────────────────────────────────────── */
export function CreateProjectModal({ currentUser, onClose, onSubmit }: CreateProjectModalProps) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [data, setData] = useState<FormData>({
    title: "",
    titleEn: "",
    description: "",
    courseCode: "",
    courseName: "",
    teacherId: "",
    teacherName: "",
    startDate: new Date().toISOString().slice(0, 10),
    dueDate: "",
    memberIds: [],
    memberNames: [],
    milestones: [],
    tools: [],
    tags: [],
    coverImage: "",
    files: [],
  });

  const onChange = useCallback((patch: Partial<FormData>) => {
    setData(prev => ({ ...prev, ...patch }));
    setErrors({});
  }, []);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!data.title.trim()) errs.title = "กรุณากรอกชื่อโครงงาน";
    if (!data.description.trim()) errs.description = "กรุณากรอกคำอธิบายโครงงาน";
    if (!data.courseCode) errs.courseCode = "กรุณาเลือกรายวิชา";
    if (!data.teacherId) errs.teacherId = "กรุณาเลือกอาจารย์ที่ปรึกษา";
    if (!data.startDate) errs.startDate = "กรุณาระบุวันเริ่มต้น";
    if (!data.dueDate) errs.dueDate = "กรุณาระบุกำหนดส่ง";
    if (data.dueDate && data.startDate && data.dueDate <= data.startDate) errs.dueDate = "กำหนดส่งต้องมาหลังวันเริ่มต้น";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validate()) return;
    setStep(s => Math.min(s + 1, 4));
  };

  const handleSubmit = () => {
    const allMembers = [currentUser, ...STUDENTS.filter(s => data.memberIds.includes(s.id))];
    const project: Project = {
      id: `p_${Date.now()}`,
      title: data.title.trim(),
      titleEn: data.titleEn.trim(),
      description: data.description.trim(),
      coverImage: data.coverImage || undefined,
      studentIds: allMembers.map(m => m.id),
      studentNames: allMembers.map(m => m.name),
      courseCode: data.courseCode,
      courseName: data.courseName,
      teacherId: data.teacherId,
      teacherName: data.teacherName,
      status: "in_progress",
      progress: 0,
      startDate: data.startDate,
      dueDate: data.dueDate,
      tags: data.tags,
      tools: data.tools,
      milestones: data.milestones.map((m, i) => ({ id: `m_${Date.now()}_${i}`, title: m.title, dueDate: m.dueDate, completed: false })),
      weeklyReports: [],
      files: data.files,
    };
    onSubmit(project);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(13,27,62,0.55)", backdropFilter: "blur(6px)" }}>
      <div
        className="flex flex-col rounded-2xl overflow-hidden w-full"
        style={{ maxWidth: "680px", maxHeight: "92vh", background: "var(--background)", boxShadow: "0 32px 80px rgba(13,27,62,0.22)" }}
      >
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between shrink-0" style={{ background: "var(--primary)", color: "#FFFFFF" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
              <FolderPlus size={18} />
            </div>
            <div>
              <p style={{ fontSize: "16px", fontWeight: 700 }}>สร้างโครงงานใหม่</p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>ขั้นตอนที่ {step} จาก {STEPS.length}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", color: "#FFFFFF", borderRadius: "10px", padding: "8px" }}>
            <X size={16} />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex px-6 py-4 gap-2 shrink-0" style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
          {STEPS.map((s, i) => {
            const done = s.id < step;
            const active = s.id === step;
            const Icon = s.icon;
            return (
              <div key={s.id} className="flex items-center gap-2 flex-1 min-w-0">
                <div
                  className="flex items-center gap-2 flex-1 rounded-xl px-3 py-2 min-w-0"
                  style={{ background: active ? "var(--primary)" : done ? "#D1FAE5" : "var(--muted)", transition: "all 0.2s" }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: active ? "rgba(255,255,255,0.2)" : done ? "#16A34A" : "var(--border)", color: active ? "#FFFFFF" : done ? "#FFFFFF" : "var(--muted-foreground)" }}
                  >
                    {done ? <Check size={12} /> : <Icon size={12} />}
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: active ? 700 : 500, color: active ? "#FFFFFF" : done ? "#065F46" : "var(--muted-foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <ChevronRight size={14} style={{ color: "var(--border-strong)", flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {step === 1 && <Step1 data={data} onChange={onChange} errors={errors} />}
          {step === 2 && <Step2 data={data} onChange={onChange} currentUser={currentUser} />}
          {step === 3 && <Step3 data={data} onChange={onChange} errors={errors} />}
          {step === 4 && <Step4 data={data} onChange={onChange} />}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-between shrink-0" style={{ borderTop: "1px solid var(--border)", background: "var(--card)" }}>
          <button
            onClick={() => setStep(s => Math.max(s - 1, 1))}
            disabled={step === 1}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{ background: step === 1 ? "transparent" : "var(--muted)", color: step === 1 ? "transparent" : "var(--foreground)", border: "none", cursor: step === 1 ? "default" : "pointer", fontSize: "13px", fontWeight: 600 }}
          >
            <ChevronLeft size={15} /> ย้อนกลับ
          </button>

          <div className="flex items-center gap-1.5">
            {STEPS.map(s => (
              <div key={s.id} className="rounded-full transition-all" style={{ width: s.id === step ? "20px" : "6px", height: "6px", background: s.id <= step ? "var(--primary)" : "var(--border-strong)" }} />
            ))}
          </div>

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl"
              style={{ background: "var(--primary)", color: "#FFFFFF", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 700 }}
            >
              ถัดไป <ChevronRight size={15} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl"
              style={{ background: "#16A34A", color: "#FFFFFF", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 700 }}
            >
              <Check size={15} /> สร้างโครงงาน
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
