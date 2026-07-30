import { useState } from "react";
import { Project, Role, User } from "./data";
import { StatusBadge } from "./StatusBadge";
import { ProgressBar } from "./ProgressBar";
import { CreateProjectModal } from "./CreateProjectModal";
import {
  Search, Filter, Calendar, User as UserIcon, BookOpen, AlertTriangle,
  ChevronRight, FolderKanban, CheckCircle2, Circle, Tag, X, Plus, Wrench, Users as UsersIcon,
} from "lucide-react";

interface ProjectListProps {
  projects: Project[];
  role: Role;
  currentUser: User;
  onSelectProject: (p: Project) => void;
  onUpdateProject: (p: Project) => void;
  onCreateProject?: (p: Project) => void;
}

const STATUS_FILTERS = ["ทั้งหมด", "กำลังดำเนินการ", "ส่งแล้ว", "ตรวจแล้ว", "อนุมัติแล้ว", "เกินกำหนด"];
const STATUS_MAP: Record<string, string[]> = {
  "ทั้งหมด": [],
  "กำลังดำเนินการ": ["in_progress"],
  "ส่งแล้ว": ["submitted"],
  "ตรวจแล้ว": ["reviewed"],
  "อนุมัติแล้ว": ["approved"],
  "เกินกำหนด": ["overdue"],
};

function ProjectCard({ project, role, onSelect, onUpdate }: {
  project: Project;
  role: Role;
  onSelect: () => void;
  onUpdate: (p: Project) => void;
}) {
  const done = project.milestones.filter(m => m.completed).length;
  const total = project.milestones.length;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all cursor-pointer"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      onClick={onSelect}
    >
      {/* Cover image or status strip */}
      {project.coverImage ? (
        <div className="relative h-28 overflow-hidden">
          <img src={project.coverImage} alt="cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(13,27,62,0.6))" }} />
          <div className="absolute bottom-2 left-3">
            <StatusBadge status={project.status} />
          </div>
        </div>
      ) : (
        <div
          className="h-1"
          style={{
            background: project.status === "overdue" ? "#DC2626" :
              project.status === "approved" || project.status === "reviewed" ? "#16A34A" :
              project.status === "submitted" ? "#7C3AED" : "var(--primary)"
          }}
        />
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)", lineHeight: 1.4, marginBottom: "3px" }}>
              {project.title}
            </h3>
            {project.status === "overdue" && (
              <div className="flex items-center gap-1 mb-1">
                <AlertTriangle size={11} style={{ color: "#DC2626" }} />
                <span style={{ fontSize: "11px", color: "#DC2626", fontWeight: 600 }}>เกินกำหนดส่ง</span>
              </div>
            )}
          </div>
          {!project.coverImage && <StatusBadge status={project.status} />}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-4">
          <div className="flex items-center gap-1.5">
            <UserIcon size={12} style={{ color: "var(--muted-foreground)" }} />
            <span style={{ fontSize: "12px", color: "var(--muted-foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {project.studentNames.join(", ")}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen size={12} style={{ color: "var(--muted-foreground)" }} />
            <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{project.courseCode}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={12} style={{ color: "var(--muted-foreground)" }} />
            <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
              ครบ {new Date(project.dueDate).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={12} style={{ color: "var(--muted-foreground)" }} />
            <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{done}/{total} milestone</span>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--muted-foreground)" }}>ความคืบหน้า</span>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary)", fontFamily: "'JetBrains Mono', monospace" }}>{project.progress}%</span>
          </div>
          <ProgressBar value={project.progress} size="sm" />
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1.5 flex-wrap flex-1 min-w-0">
            {project.tools?.slice(0, 2).map(tool => (
              <span key={tool} className="px-2 py-0.5 rounded" style={{ fontSize: "10px", fontWeight: 600, background: "#EFF6FF", color: "var(--primary)", border: "1px solid #BFDBFE", whiteSpace: "nowrap" }}>
                {tool}
              </span>
            ))}
            {(project.tools?.length ?? 0) > 2 && (
              <span style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>+{(project.tools?.length ?? 0) - 2}</span>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <div className="flex -space-x-1.5">
              {project.studentNames.slice(0, 3).map((name, i) => (
                <div key={i} className="w-5 h-5 rounded-full flex items-center justify-center border" style={{ background: "var(--primary)", color: "#FFF", fontSize: "8px", fontWeight: 700, borderColor: "var(--card)" }}>
                  {name.slice(-1)}
                </div>
              ))}
            </div>
            {project.studentNames.length > 3 && (
              <span style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>+{project.studentNames.length - 3}</span>
            )}
            <ChevronRight size={13} style={{ color: "var(--muted-foreground)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectDetail({ project, role, onUpdate, onClose }: {
  project: Project;
  role: Role;
  onUpdate: (p: Project) => void;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [comment, setComment] = useState("");

  const tabs = [
    { id: "overview", label: "ภาพรวม" },
    { id: "milestones", label: "Milestone" },
    { id: "reports", label: `รายงาน (${project.weeklyReports.length})` },
  ];

  const toggleMilestone = (mid: string) => {
    if (role === "student") return;
    onUpdate({ ...project, milestones: project.milestones.map(m => m.id === mid ? { ...m, completed: !m.completed } : m) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(13,27,62,0.5)", backdropFilter: "blur(4px)" }}>
      <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: "var(--background)", width: "720px", maxWidth: "100%", maxHeight: "90vh", boxShadow: "0 24px 64px rgba(13,27,62,0.18)" }}>
        {/* Header */}
        <div className="px-6 py-5 flex items-start gap-4" style={{ background: "var(--primary)", color: "#FFFFFF" }}>
          <div className="flex-1 min-w-0">
            <StatusBadge status={project.status} />
            <h2 style={{ fontSize: "18px", fontWeight: 700, marginTop: "8px", lineHeight: 1.35 }}>{project.title}</h2>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", marginTop: "4px" }}>
              {project.studentNames.join(", ")} · {project.courseCode} · {project.teacherName}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", color: "#FFFFFF", borderRadius: "10px", padding: "8px", flexShrink: 0 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pt-1" style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className="px-1 py-3 mr-5 transition-all"
              style={{
                background: "none",
                border: "none",
                borderBottom: `2px solid ${activeTab === t.id ? "var(--primary)" : "transparent"}`,
                color: activeTab === t.id ? "var(--primary)" : "var(--muted-foreground)",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: activeTab === t.id ? 700 : 400,
                paddingBottom: "11px",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && (
            <div className="space-y-5">
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>คำอธิบายโครงงาน</p>
                <p style={{ fontSize: "14px", color: "var(--foreground)", lineHeight: 1.8 }}>{project.description}</p>
              </div>
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>ความคืบหน้าโดยรวม</p>
                <ProgressBar value={project.progress} showLabel />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "วันเริ่มต้น", value: new Date(project.startDate).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" }) },
                  { label: "กำหนดส่ง", value: new Date(project.dueDate).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" }) },
                  { label: "อาจารย์ที่ปรึกษา", value: project.teacherName },
                  { label: "รายวิชา", value: `${project.courseCode} · ${project.courseName}` },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl p-4" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                    <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "4px" }}>{label}</p>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--foreground)" }}>{value}</p>
                  </div>
                ))}
              </div>
              {project.tools?.length > 0 && (
                <div>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
                    <Wrench size={11} style={{ display: "inline", marginRight: "5px" }} />เครื่องมือที่ใช้
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map(tool => (
                      <span key={tool} className="flex items-center gap-1 px-3 py-1 rounded-lg" style={{ fontSize: "12px", fontWeight: 600, background: "#EFF6FF", color: "var(--primary)", border: "1px solid #BFDBFE" }}>
                        <Tag size={10} />{tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {project.tags?.length > 0 && (
                <div>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>คีย์เวิร์ด</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-lg" style={{ fontSize: "12px", fontWeight: 600, background: "var(--secondary)", color: "var(--secondary-foreground)", border: "1px solid var(--border)" }}>{tag}</span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
                  <UsersIcon size={11} style={{ display: "inline", marginRight: "5px" }} />สมาชิกกลุ่ม ({project.studentNames.length} คน)
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.studentNames.map((name, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--primary)", color: "#FFFFFF", fontSize: "9px", fontWeight: 700 }}>
                        {name.slice(-2)}
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--foreground)" }}>{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "milestones" && (
            <div className="space-y-2.5">
              {project.milestones.map((m, i) => (
                <div
                  key={m.id}
                  onClick={() => toggleMilestone(m.id)}
                  className="flex items-center gap-3.5 rounded-xl px-4 py-3.5 transition-all"
                  style={{
                    background: "var(--card)",
                    border: `1px solid ${m.completed ? "#BBF7D0" : "var(--border)"}`,
                    cursor: role !== "student" ? "pointer" : "default",
                  }}
                >
                  {m.completed
                    ? <CheckCircle2 size={18} style={{ color: "#16A34A", flexShrink: 0 }} />
                    : <Circle size={18} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
                  }
                  <div className="flex-1">
                    <p style={{ fontSize: "13.5px", fontWeight: 500, color: "var(--foreground)", textDecoration: m.completed ? "line-through" : "none", opacity: m.completed ? 0.5 : 1 }}>
                      {m.title}
                    </p>
                    <p style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: "2px" }}>
                      ครบกำหนด {new Date(m.dueDate).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-3">
              {project.weeklyReports.length === 0 ? (
                <p style={{ color: "var(--muted-foreground)", textAlign: "center", padding: "32px 0", fontSize: "14px" }}>ยังไม่มีรายงาน</p>
              ) : (
                [...project.weeklyReports].reverse().map(r => (
                  <div key={r.id} className="rounded-xl p-4" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}>สัปดาห์ที่ {r.week}</p>
                      <span className="px-2 py-0.5 rounded-full" style={{ fontSize: "10px", fontWeight: 600, background: r.status === "reviewed" ? "#D1FAE5" : "#FEF3C7", color: r.status === "reviewed" ? "#065F46" : "#92400E" }}>
                        {r.status === "reviewed" ? "ตรวจแล้ว" : "รอตรวจ"}
                      </span>
                    </div>
                    <p style={{ fontSize: "13px", color: "var(--foreground)", lineHeight: 1.65, marginBottom: "6px" }}>{r.description}</p>
                    <div className="flex items-center gap-3">
                      <ProgressBar value={r.progress} showLabel size="sm" />
                      <span style={{ fontSize: "11px", color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>{r.comments.length} ความคิดเห็น</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProjectList({ projects, role, currentUser, onSelectProject, onUpdateProject, onCreateProject }: ProjectListProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ทั้งหมด");
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.studentNames.some(n => n.includes(search)) ||
      p.courseCode.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "ทั้งหมด" || STATUS_MAP[filter].includes(p.status);
    return matchSearch && matchFilter;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ fontFamily: "'Noto Sans Thai', 'Inter', sans-serif" }}>
      {/* Header */}
      <div className="px-6 py-5 shrink-0" style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
        <div className="flex items-center justify-between mb-3">
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)" }}>
            {role === "student" ? "โครงงานของฉัน" : role === "teacher" ? "โครงงานในที่ปรึกษา" : "โครงงานทั้งหมด"}
          </h2>
          {role === "student" && (
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all"
              style={{ background: "var(--primary)", color: "#FFFFFF", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 700 }}
            >
              <Plus size={16} />
              สร้างโครงงานใหม่
            </button>
          )}
        </div>
        <div className="relative mb-3">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
          <input
            type="text"
            placeholder="ค้นหาโครงงาน, นักศึกษา, รหัสวิชา…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none"
            style={{ background: "var(--input-background)", border: "1.5px solid var(--border)", fontSize: "13px", color: "var(--foreground)" }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1 rounded-full transition-all"
              style={{
                fontSize: "11px",
                fontWeight: filter === f ? 700 : 400,
                background: filter === f ? "var(--primary)" : "var(--muted)",
                color: filter === f ? "#FFFFFF" : "var(--muted-foreground)",
                border: "none",
                cursor: "pointer",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="px-6 py-2.5 shrink-0 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)", background: "var(--background)" }}>
        <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
          พบ <span style={{ fontWeight: 700, color: "var(--foreground)" }}>{filtered.length}</span> โครงงาน
        </span>
        <Filter size={13} style={{ color: "var(--muted-foreground)" }} />
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FolderKanban size={40} style={{ color: "var(--muted-foreground)", marginBottom: "12px" }} />
            <p style={{ fontSize: "14px", color: "var(--muted-foreground)" }}>ไม่พบโครงงานที่ตรงกัน</p>
          </div>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
            {filtered.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                role={role}
                onSelect={() => setDetailProject(project)}
                onUpdate={onUpdateProject}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {detailProject && (
        <ProjectDetail
          project={detailProject}
          role={role}
          onUpdate={(p) => { onUpdateProject(p); setDetailProject(p); }}
          onClose={() => setDetailProject(null)}
        />
      )}

      {/* Create project modal */}
      {showCreate && (
        <CreateProjectModal
          currentUser={currentUser}
          onClose={() => setShowCreate(false)}
          onSubmit={(project) => {
            onCreateProject?.(project);
            setShowCreate(false);
          }}
        />
      )}
    </div>
  );
}
