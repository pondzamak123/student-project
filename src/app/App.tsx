import { useState } from "react";
import { Login } from "./components/Login";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { ProjectList } from "./components/ProjectList";
import { WeeklyProgress } from "./components/WeeklyProgress";
import { AdminView } from "./components/AdminView";
import { MOCK_PROJECTS, Project, User, getProjectsByRole } from "./components/data";
import { Upload, MessageSquare, BarChart3, Settings, FileText, Paperclip, Download, Trash2, Send } from "lucide-react";

{/* MARKER-MAKE-KIT-INVOKED */}
{/* MARKER-MAKE-KIT-DISCOVERY-READ */}

function FilesView({ projects, currentUser, onUpdateProject }: {
  projects: Project[];
  currentUser: User;
  onUpdateProject: (p: Project) => void;
}) {
  const [dragProject, setDragProject] = useState<string | null>(null);
  const allFiles = projects.flatMap(p => p.files.map(f => ({ ...f, projectTitle: p.title, projectId: p.id })));

  const handleDrop = (e: React.DragEvent, projectId: string) => {
    e.preventDefault();
    setDragProject(null);
    const files = e.dataTransfer.files;
    if (!files.length) return;
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    const newFiles = Array.from(files).map(f => ({
      id: `f_${Date.now()}_${Math.random()}`,
      name: f.name,
      size: f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : `${Math.round(f.size / 1024)} KB`,
      type: f.name.split(".").pop() ?? "file",
      uploadedAt: new Date().toISOString().slice(0, 10),
      uploadedBy: currentUser.name,
    }));
    onUpdateProject({ ...project, files: [...project.files, ...newFiles] });
  };

  return (
    <div className="p-7 overflow-y-auto h-full" style={{ fontFamily: "'Noto Sans Thai', 'Inter', sans-serif" }}>
      <div className="mb-7">
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--foreground)", marginBottom: "4px" }}>
          {currentUser.role === "student" ? "ไฟล์ของฉัน" : "ไฟล์นักศึกษา"}
        </h2>
        <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>ไฟล์ทั้งหมด {allFiles.length} ไฟล์ จาก {projects.length} โครงงาน</p>
      </div>

      <div className="space-y-5">
        {projects.map(project => (
          <div key={project.id} className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: `2px solid ${dragProject === project.id ? "var(--primary)" : "var(--border)"}` }}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)", background: "var(--muted)" }}>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>{project.title}</p>
                <p style={{ fontSize: "12px", color: "var(--muted-foreground)", marginTop: "2px" }}>{project.files.length} ไฟล์</p>
              </div>
              {currentUser.role === "student" && (
                <label
                  className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer"
                  style={{ background: "var(--primary)", color: "#FFFFFF", fontSize: "13px", fontWeight: 600 }}
                >
                  <Upload size={14} />
                  เพิ่มไฟล์
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.docx,.pptx,.ipynb,.zip"
                    className="hidden"
                    onChange={e => {
                      const files = e.target.files;
                      if (!files) return;
                      const newFiles = Array.from(files).map(f => ({
                        id: `f_${Date.now()}_${Math.random()}`,
                        name: f.name,
                        size: f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : `${Math.round(f.size / 1024)} KB`,
                        type: f.name.split(".").pop() ?? "file",
                        uploadedAt: new Date().toISOString().slice(0, 10),
                        uploadedBy: currentUser.name,
                      }));
                      onUpdateProject({ ...project, files: [...project.files, ...newFiles] });
                      e.target.value = "";
                    }}
                  />
                </label>
              )}
            </div>

            {/* Drop zone */}
            {currentUser.role === "student" && (
              <div
                onDragOver={e => { e.preventDefault(); setDragProject(project.id); }}
                onDragLeave={() => setDragProject(null)}
                onDrop={e => handleDrop(e, project.id)}
                className="mx-5 my-4 py-5 rounded-xl flex flex-col items-center justify-center"
                style={{
                  border: `2px dashed ${dragProject === project.id ? "var(--primary)" : "var(--border-strong)"}`,
                  background: dragProject === project.id ? "var(--secondary)" : "var(--input-background)",
                  cursor: "default",
                }}
              >
                <Paperclip size={20} style={{ color: dragProject === project.id ? "var(--primary)" : "var(--muted-foreground)", marginBottom: "6px" }} />
                <p style={{ fontSize: "12px", color: "var(--muted-foreground)", fontWeight: 500 }}>
                  {dragProject === project.id ? "วางไฟล์ที่นี่" : "ลากไฟล์ PDF มาวางที่นี่ หรือใช้ปุ่ม \"เพิ่มไฟล์\""}
                </p>
              </div>
            )}

            {/* File list */}
            {project.files.length > 0 ? (
              <div className="px-5 pb-4 space-y-2">
                {project.files.map(file => (
                  <div key={file.id} className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: file.type === "pdf" ? "#FEE2E2" : file.type === "ipynb" ? "#FEF3C7" : "var(--secondary)" }}>
                      <FileText size={16} style={{ color: file.type === "pdf" ? "#DC2626" : file.type === "ipynb" ? "#D97706" : "var(--primary)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
                      <p style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>
                        {file.size} · {file.uploadedBy} · {new Date(file.uploadedAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", padding: "6px", borderRadius: "8px" }} title="ดาวน์โหลด">
                        <Download size={14} />
                      </button>
                      {currentUser.role === "student" && (
                        <button
                          onClick={() => onUpdateProject({ ...project, files: project.files.filter(f => f.id !== file.id) })}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--destructive)", padding: "6px", borderRadius: "8px" }}
                          title="ลบ"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !dragProject && (
                <div className="px-5 pb-5">
                  <p style={{ fontSize: "13px", color: "var(--muted-foreground)", textAlign: "center", paddingTop: "4px" }}>ยังไม่มีไฟล์</p>
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CommentsView({ projects, currentUser, onUpdateProject }: {
  projects: Project[];
  currentUser: User;
  onUpdateProject: (p: Project) => void;
}) {
  const [replyText, setReplyText] = useState<Record<string, Record<string, string>>>({});

  const setReply = (projId: string, reportId: string, text: string) => {
    setReplyText(p => ({ ...p, [projId]: { ...(p[projId] ?? {}), [reportId]: text } }));
  };

  const submitReply = (project: Project, reportId: string) => {
    const text = replyText[project.id]?.[reportId];
    if (!text?.trim()) return;
    const updated = {
      ...project,
      weeklyReports: project.weeklyReports.map(r =>
        r.id === reportId ? {
          ...r,
          status: "reviewed" as const,
          comments: [...r.comments, {
            id: `c_${Date.now()}`,
            authorId: currentUser.id,
            authorName: currentUser.name,
            authorRole: currentUser.role,
            content: text.trim(),
            createdAt: new Date().toISOString().slice(0, 10),
          }],
        } : r
      ),
    };
    onUpdateProject(updated);
    setReply(project.id, reportId, "");
  };

  const pendingReports = projects.flatMap(p =>
    p.weeklyReports.filter(r => r.status === "pending" || r.comments.length > 0).map(r => ({ project: p, report: r }))
  );

  return (
    <div className="p-7 overflow-y-auto h-full" style={{ fontFamily: "'Noto Sans Thai', 'Inter', sans-serif" }}>
      <div className="mb-7">
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--foreground)", marginBottom: "4px" }}>ความคิดเห็น</h2>
        <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>รายงานที่รอตรวจและความคิดเห็นทั้งหมด</p>
      </div>

      {pendingReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <MessageSquare size={40} style={{ color: "var(--muted-foreground)", marginBottom: "12px" }} />
          <p style={{ fontSize: "15px", color: "var(--muted-foreground)" }}>ไม่มีรายงานที่รอตรวจ</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingReports.map(({ project, report }) => (
            <div key={`${project.id}-${report.id}`} className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: `1px solid ${report.status === "pending" ? "#FDE68A" : "var(--border)"}` }}>
              <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)", background: report.status === "pending" ? "#FFFBEB" : "var(--muted)" }}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full" style={{ fontSize: "10px", fontWeight: 700, background: report.status === "pending" ? "#FEF3C7" : "#D1FAE5", color: report.status === "pending" ? "#92400E" : "#065F46" }}>
                      {report.status === "pending" ? "รอตรวจ" : "ตรวจแล้ว"}
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}>สัปดาห์ที่ {report.week}</span>
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                    {project.title} · {project.studentNames.join(", ")}
                  </p>
                </div>
                <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                  ส่ง {new Date(report.submittedAt).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}
                </span>
              </div>
              <div className="px-5 py-4">
                <p style={{ fontSize: "13px", color: "var(--foreground)", lineHeight: 1.7, marginBottom: "12px" }}>{report.description}</p>

                {report.comments.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {report.comments.map(c => (
                      <div key={c.id} className="flex gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--primary)", color: "#FFFFFF", fontSize: "10px", fontWeight: 700 }}>
                          {c.authorName.slice(-2)}
                        </div>
                        <div className="rounded-xl px-3 py-2 flex-1" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
                          <div className="flex items-center gap-2 mb-1">
                            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--foreground)" }}>{c.authorName}</span>
                            <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>
                              {new Date(c.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}
                            </span>
                          </div>
                          <p style={{ fontSize: "13px", color: "var(--foreground)", lineHeight: 1.65 }}>{c.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {currentUser.role === "teacher" && (
                  <div className="flex gap-2 mt-3">
                    <input
                      type="text"
                      placeholder="เขียนความคิดเห็นถึงนักศึกษา…"
                      value={replyText[project.id]?.[report.id] ?? ""}
                      onChange={e => setReply(project.id, report.id, e.target.value)}
                      onKeyDown={e => e.key === "Enter" && submitReply(project, report.id)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl outline-none"
                      style={{ background: "var(--input-background)", border: "1.5px solid var(--border)", fontSize: "13px", color: "var(--foreground)" }}
                    />
                    <button
                      onClick={() => submitReply(project, report.id)}
                      className="px-4 py-2.5 rounded-xl flex items-center gap-2"
                      style={{ background: "var(--primary)", color: "#FFFFFF", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 700 }}
                    >
                      <Send size={14} />
                      ส่ง
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState("dashboard");
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setActiveView("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView("dashboard");
  };

  const handleUpdateProject = (updated: Project) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const visibleProjects = getProjectsByRole(currentUser.role, currentUser.id, projects);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ fontFamily: "'Noto Sans Thai', 'Inter', sans-serif", background: "var(--background)" }}
    >
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="flex-1 overflow-hidden">
        {activeView === "dashboard" && (
          <Dashboard
            projects={visibleProjects}
            role={currentUser.role}
            currentUser={currentUser}
            onSelectProject={() => setActiveView("projects")}
          />
        )}

        {activeView === "projects" && (
          <ProjectList
            projects={visibleProjects}
            role={currentUser.role}
            currentUser={currentUser}
            onSelectProject={() => {}}
            onUpdateProject={handleUpdateProject}
            onCreateProject={(newProject) => {
              setProjects(prev => [newProject, ...prev]);
            }}
          />
        )}

        {activeView === "weekly" && (
          <WeeklyProgress
            projects={visibleProjects}
            role={currentUser.role}
            currentUser={currentUser}
            onUpdateProject={handleUpdateProject}
          />
        )}

        {activeView === "files" && (
          <FilesView
            projects={visibleProjects}
            currentUser={currentUser}
            onUpdateProject={handleUpdateProject}
          />
        )}

        {activeView === "comments" && (
          <CommentsView
            projects={visibleProjects}
            currentUser={currentUser}
            onUpdateProject={handleUpdateProject}
          />
        )}

        {activeView === "users" && currentUser.role === "admin" && (
          <AdminView projects={projects} />
        )}

        {activeView === "analytics" && currentUser.role === "admin" && (
          <Dashboard
            projects={projects}
            role="admin"
            currentUser={currentUser}
            onSelectProject={() => setActiveView("projects")}
          />
        )}

        {activeView === "settings" && currentUser.role === "admin" && (
          <div className="p-8 overflow-y-auto h-full" style={{ fontFamily: "'Noto Sans Thai', 'Inter', sans-serif" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--foreground)", marginBottom: "6px" }}>ตั้งค่าระบบ</h2>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginBottom: "28px" }}>การตั้งค่าสำหรับผู้ดูแลระบบ</p>
            <div className="max-w-xl space-y-4">
              {[
                { label: "ชื่อมหาวิทยาลัย", value: "มหาวิทยาลัยเทคโนโลยีสารสนเทศ" },
                { label: "ปีการศึกษา", value: "2567 (2024-2025)" },
                { label: "ระดับเกรด", value: "A, B+, B, C+, C, D+, D, F" },
                { label: "นโยบายส่งล่าช้า", value: "อนุญาตส่งช้าได้ 7 วัน" },
                { label: "รูปแบบไฟล์ที่อนุญาต", value: "PDF, DOCX, PPTX, IPYNB, ZIP" },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-2xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--muted-foreground)", marginBottom: "8px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    {label}
                  </label>
                  <input
                    type="text"
                    defaultValue={value}
                    className="w-full px-3.5 py-2.5 rounded-xl outline-none"
                    style={{ background: "var(--input-background)", border: "1.5px solid var(--border)", fontSize: "14px", color: "var(--foreground)" }}
                  />
                </div>
              ))}
              <button
                className="px-6 py-3 rounded-xl"
                style={{ background: "var(--primary)", color: "#FFFFFF", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 700 }}
              >
                บันทึกการเปลี่ยนแปลง
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
