import { useState, useRef } from "react";
import { Project, WeeklyReport, Comment, FileAttachment, Role, User } from "./data";
import { ProgressBar } from "./ProgressBar";
import {
  ClipboardList, ChevronDown, ChevronRight, Send, Paperclip, X,
  CheckCircle2, Clock, MessageSquare, FileText, AlertCircle, Plus
} from "lucide-react";

interface WeeklyProgressProps {
  projects: Project[];
  role: Role;
  currentUser: User;
  onUpdateProject: (project: Project) => void;
}

function FileChip({ file, onRemove }: { file: FileAttachment; onRemove?: () => void }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
      <FileText size={13} style={{ color: "var(--primary)" }} />
      <span style={{ fontSize: "12px", color: "var(--foreground)", fontWeight: 500 }}>{file.name}</span>
      <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{file.size}</span>
      {onRemove && (
        <button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", padding: "0 2px" }}>
          <X size={12} />
        </button>
      )}
    </div>
  );
}

function CommentSection({ report, project, currentUser, role, onUpdate }: {
  report: WeeklyReport;
  project: Project;
  currentUser: User;
  role: Role;
  onUpdate: (r: WeeklyReport) => void;
}) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    const newComment: Comment = {
      id: `c_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: role,
      content: text.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    onUpdate({ ...report, comments: [...report.comments, newComment] });
    setText("");
  };

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare size={14} style={{ color: "var(--muted-foreground)" }} />
        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)" }}>
          ความคิดเห็น ({report.comments.length})
        </span>
      </div>
      {report.comments.length > 0 && (
        <div className="space-y-3 mb-3">
          {report.comments.map(c => (
            <div key={c.id} className="flex gap-2.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  background: c.authorRole === "teacher" ? "var(--primary)" : "var(--muted-foreground)",
                  color: "#FFFFFF",
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              >
                {c.authorName.slice(-2)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--foreground)" }}>{c.authorName}</span>
                  {c.authorRole === "teacher" && (
                    <span className="px-1.5 py-0.5 rounded" style={{ fontSize: "10px", fontWeight: 600, background: "#DBEAFE", color: "#1D4ED8" }}>อาจารย์</span>
                  )}
                  <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>
                    {new Date(c.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <div className="rounded-xl px-3 py-2.5" style={{ background: c.authorRole === "teacher" ? "#EFF6FF" : "var(--muted)", border: c.authorRole === "teacher" ? "1px solid #BFDBFE" : "1px solid var(--border)" }}>
                  <p style={{ fontSize: "13px", color: "var(--foreground)", lineHeight: 1.65 }}>{c.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1"
          style={{ background: "var(--primary)", color: "#FFFFFF", fontSize: "10px", fontWeight: 700 }}
        >
          {currentUser.avatar}
        </div>
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="เขียนความคิดเห็น…"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            className="flex-1 px-3 py-2 rounded-xl outline-none"
            style={{ background: "var(--input-background)", border: "1.5px solid var(--border)", fontSize: "13px", color: "var(--foreground)" }}
          />
          <button
            onClick={submit}
            className="px-3 py-2 rounded-xl flex items-center gap-1.5"
            style={{ background: "var(--primary)", color: "#FFFFFF", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}
          >
            <Send size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ReportCard({ report, project, currentUser, role, expanded, onToggle, onUpdate }: {
  report: WeeklyReport;
  project: Project;
  currentUser: User;
  role: Role;
  expanded: boolean;
  onToggle: () => void;
  onUpdate: (r: WeeklyReport) => void;
}) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 transition-all"
        style={{ background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--secondary)" }}>
          <ClipboardList size={18} style={{ color: "var(--primary)" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>สัปดาห์ที่ {report.week}</p>
            <span
              className="px-2 py-0.5 rounded-full"
              style={{
                fontSize: "11px",
                fontWeight: 600,
                background: report.status === "reviewed" ? "#D1FAE5" : "#FEF3C7",
                color: report.status === "reviewed" ? "#065F46" : "#92400E",
              }}
            >
              {report.status === "reviewed" ? "ตรวจแล้ว" : "รอตรวจ"}
            </span>
          </div>
          <p style={{ fontSize: "12px", color: "var(--muted-foreground)", marginTop: "2px" }}>
            ส่งเมื่อ {new Date(report.submittedAt).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" })} · ความคืบหน้า {report.progress}% · {report.comments.length} ความคิดเห็น
          </p>
        </div>
        <div className="shrink-0">{expanded ? <ChevronDown size={16} style={{ color: "var(--muted-foreground)" }} /> : <ChevronRight size={16} style={{ color: "var(--muted-foreground)" }} />}</div>
      </button>

      {expanded && (
        <div className="px-5 pb-5" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "6px" }}>ความคืบหน้าสัปดาห์นี้</p>
                <ProgressBar value={report.progress} showLabel />
              </div>
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "6px" }}>วันที่ส่ง</p>
                <p style={{ fontSize: "13px", color: "var(--foreground)", fontWeight: 500 }}>
                  {new Date(report.submittedAt).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>

            {[
              { label: "สิ่งที่ทำในสัปดาห์นี้", value: report.description },
              { label: "ปัญหาและอุปสรรค", value: report.issues },
              { label: "แผนการสัปดาห์หน้า", value: report.nextPlan },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "6px" }}>{label}</p>
                <p style={{ fontSize: "13px", color: "var(--foreground)", lineHeight: 1.7 }}>{value}</p>
              </div>
            ))}

            {report.files.length > 0 && (
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "8px" }}>
                  ไฟล์แนบ ({report.files.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {report.files.map(f => <FileChip key={f.id} file={f} />)}
                </div>
              </div>
            )}

            <CommentSection report={report} project={project} currentUser={currentUser} role={role} onUpdate={onUpdate} />
          </div>
        </div>
      )}
    </div>
  );
}

function SubmitReportForm({ project, currentUser, onSubmit, onCancel }: {
  project: Project;
  currentUser: User;
  onSubmit: (report: WeeklyReport) => void;
  onCancel: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const nextWeek = (project.weeklyReports.length > 0
    ? Math.max(...project.weeklyReports.map(r => r.week)) + 1
    : 1);

  const [form, setForm] = useState({
    description: "",
    progress: project.progress,
    issues: "",
    nextPlan: "",
  });
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = (inputFiles: FileList | null) => {
    if (!inputFiles) return;
    const newFiles: FileAttachment[] = Array.from(inputFiles).map(f => ({
      id: `f_${Date.now()}_${Math.random()}`,
      name: f.name,
      size: f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : `${Math.round(f.size / 1024)} KB`,
      type: f.name.split(".").pop() ?? "file",
      uploadedAt: new Date().toISOString().slice(0, 10),
      uploadedBy: currentUser.name,
    }));
    setFiles(p => [...p, ...newFiles]);
  };

  const handleSubmit = () => {
    if (!form.description.trim()) return;
    const report: WeeklyReport = {
      id: `wr_${Date.now()}`,
      week: nextWeek,
      submittedAt: new Date().toISOString().slice(0, 10),
      description: form.description,
      progress: form.progress,
      issues: form.issues,
      nextPlan: form.nextPlan,
      files,
      comments: [],
      status: "pending",
    };
    onSubmit(report);
  };

  return (
    <div className="rounded-2xl p-6" style={{ background: "var(--card)", border: "2px solid var(--primary)" }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#DBEAFE" }}>
          <Plus size={18} style={{ color: "var(--primary)" }} />
        </div>
        <div>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)" }}>ส่งรายงานสัปดาห์ที่ {nextWeek}</h3>
          <p style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{project.title}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Progress slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)" }}>ความคืบหน้ารวม (%)</label>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--primary)", fontFamily: "'JetBrains Mono', monospace" }}>{form.progress}%</span>
          </div>
          <input
            type="range"
            min={project.progress}
            max={100}
            value={form.progress}
            onChange={e => setForm(p => ({ ...p, progress: Number(e.target.value) }))}
            className="w-full"
            style={{ accentColor: "var(--primary)" }}
          />
          <div className="mt-2">
            <ProgressBar value={form.progress} />
          </div>
        </div>

        {[
          { key: "description", label: "สิ่งที่ทำในสัปดาห์นี้ *", placeholder: "อธิบายสิ่งที่ทำในสัปดาห์นี้…" },
          { key: "issues", label: "ปัญหาและอุปสรรคที่พบ", placeholder: "ปัญหาที่พบและวิธีแก้ไข (ถ้ามี)…" },
          { key: "nextPlan", label: "แผนการสัปดาห์หน้า", placeholder: "สิ่งที่จะทำในสัปดาห์หน้า…" },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--foreground)", marginBottom: "6px" }}>{label}</label>
            <textarea
              rows={3}
              placeholder={placeholder}
              value={(form as any)[key]}
              onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
              className="w-full rounded-xl px-3 py-2.5 resize-none outline-none"
              style={{ background: "var(--input-background)", border: "1.5px solid var(--border)", fontSize: "13px", color: "var(--foreground)", lineHeight: 1.7 }}
            />
          </div>
        ))}

        {/* File upload */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--foreground)", marginBottom: "6px" }}>
            อัปโหลดไฟล์ PDF (ไม่บังคับ)
          </label>
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
            className="flex flex-col items-center justify-center py-6 rounded-xl cursor-pointer transition-all"
            style={{
              border: `2px dashed ${dragOver ? "var(--primary)" : "var(--border-strong)"}`,
              background: dragOver ? "var(--secondary)" : "var(--input-background)",
            }}
          >
            <Paperclip size={22} style={{ color: dragOver ? "var(--primary)" : "var(--muted-foreground)", marginBottom: "8px" }} />
            <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)" }}>
              {dragOver ? "วางไฟล์ที่นี่" : "ลากไฟล์มาวางหรือคลิกเพื่อเลือก"}
            </p>
            <p style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: "3px" }}>รองรับ PDF, DOCX, PPTX, IPYNB, ZIP</p>
            <input ref={fileRef} type="file" multiple accept=".pdf,.docx,.pptx,.ipynb,.zip" className="hidden" onChange={e => addFiles(e.target.files)} />
          </div>
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {files.map((f, i) => <FileChip key={f.id} file={f} onRemove={() => setFiles(p => p.filter((_, j) => j !== i))} />)}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
            style={{ background: "var(--primary)", color: "#FFFFFF", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 700 }}
          >
            <Send size={15} />
            ส่งรายงาน
          </button>
          <button
            onClick={onCancel}
            className="px-5 py-3 rounded-xl"
            style={{ background: "var(--muted)", color: "var(--muted-foreground)", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}

export function WeeklyProgress({ projects, role, currentUser, onUpdateProject }: WeeklyProgressProps) {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id ?? "");
  const [expandedReports, setExpandedReports] = useState<Record<string, boolean>>({ [projects[0]?.weeklyReports[projects[0]?.weeklyReports.length - 1]?.id ?? ""]: true });
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  const selectedProject = projects.find(p => p.id === selectedProjectId) ?? projects[0];

  const toggleReport = (id: string) => setExpandedReports(p => ({ ...p, [id]: !p[id] }));

  const handleUpdateReport = (report: WeeklyReport) => {
    if (!selectedProject) return;
    onUpdateProject({
      ...selectedProject,
      weeklyReports: selectedProject.weeklyReports.map(r => r.id === report.id ? report : r),
    });
  };

  const handleSubmitReport = (report: WeeklyReport) => {
    if (!selectedProject) return;
    onUpdateProject({
      ...selectedProject,
      progress: report.progress,
      weeklyReports: [...selectedProject.weeklyReports, report],
    });
    setShowSubmitForm(false);
    setExpandedReports(p => ({ ...p, [report.id]: true }));
  };

  if (!selectedProject) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <p style={{ color: "var(--muted-foreground)", fontSize: "15px" }}>ไม่มีโครงงานในระบบ</p>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden" style={{ fontFamily: "'Noto Sans Thai', 'Inter', sans-serif" }}>
      {/* Left — project selector */}
      <div className="w-72 shrink-0 overflow-y-auto flex flex-col" style={{ borderRight: "1px solid var(--border)", background: "var(--card)" }}>
        <div className="px-5 py-4 sticky top-0" style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", zIndex: 1 }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)" }}>
            {role === "student" ? "โครงงานของฉัน" : "โครงงานทั้งหมด"}
          </h2>
          <p style={{ fontSize: "12px", color: "var(--muted-foreground)", marginTop: "2px" }}>เลือกโครงงานเพื่อดูรายงาน</p>
        </div>
        <div className="flex-1 p-3 space-y-1.5">
          {projects.map(p => {
            const isSelected = p.id === selectedProjectId;
            const lastReport = p.weeklyReports[p.weeklyReports.length - 1];
            return (
              <button
                key={p.id}
                onClick={() => { setSelectedProjectId(p.id); setShowSubmitForm(false); }}
                className="w-full text-left rounded-xl p-3.5 transition-all"
                style={{
                  background: isSelected ? "var(--secondary)" : "transparent",
                  border: isSelected ? "1.5px solid var(--primary)" : "1.5px solid transparent",
                  cursor: "pointer",
                }}
              >
                <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)", marginBottom: "3px", lineHeight: 1.3 }}>{p.title}</p>
                <p style={{ fontSize: "11px", color: "var(--muted-foreground)", marginBottom: "6px" }}>{p.courseCode}</p>
                <ProgressBar value={p.progress} size="sm" />
                <div className="flex items-center justify-between mt-2">
                  <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>
                    {p.weeklyReports.length} รายงาน
                  </span>
                  {lastReport && lastReport.status === "pending" && (
                    <span className="flex items-center gap-1" style={{ fontSize: "10px", fontWeight: 600, color: "#D97706" }}>
                      <Clock size={10} /> รอตรวจ
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right — reports */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", marginBottom: "3px" }}>
              รายงานรายสัปดาห์
            </h2>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>
              {selectedProject.title} · {selectedProject.weeklyReports.length} รายงาน
            </p>
          </div>
          {role === "student" && !showSubmitForm && (
            <button
              onClick={() => setShowSubmitForm(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{ background: "var(--primary)", color: "#FFFFFF", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 700 }}
            >
              <Plus size={15} />
              ส่งรายงานสัปดาห์ใหม่
            </button>
          )}
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "รายงานทั้งหมด", value: selectedProject.weeklyReports.length, icon: ClipboardList, color: "#1A56DB" },
            { label: "ตรวจแล้ว", value: selectedProject.weeklyReports.filter(r => r.status === "reviewed").length, icon: CheckCircle2, color: "#16A34A" },
            { label: "รอตรวจ", value: selectedProject.weeklyReports.filter(r => r.status === "pending").length, icon: AlertCircle, color: "#D97706" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-xl p-4 flex items-center gap-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <Icon size={18} style={{ color }} />
              <div>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", fontFamily: "'JetBrains Mono', monospace" }}>{value}</p>
                <p style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Submit form */}
        {showSubmitForm && (
          <div className="mb-4">
            <SubmitReportForm
              project={selectedProject}
              currentUser={currentUser}
              onSubmit={handleSubmitReport}
              onCancel={() => setShowSubmitForm(false)}
            />
          </div>
        )}

        {/* Report list */}
        {selectedProject.weeklyReports.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <ClipboardList size={36} style={{ color: "var(--muted-foreground)", margin: "0 auto 12px" }} />
            <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--foreground)", marginBottom: "6px" }}>ยังไม่มีรายงาน</p>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>กดปุ่ม "ส่งรายงานสัปดาห์ใหม่" เพื่อเริ่มต้น</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[...selectedProject.weeklyReports].reverse().map(report => (
              <ReportCard
                key={report.id}
                report={report}
                project={selectedProject}
                currentUser={currentUser}
                role={role}
                expanded={!!expandedReports[report.id]}
                onToggle={() => toggleReport(report.id)}
                onUpdate={handleUpdateReport}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
