import { Project, Role, User } from "./data";
import { StatusBadge } from "./StatusBadge";
import { ProgressBar } from "./ProgressBar";
import {
  FolderKanban, Clock, CheckCircle2, AlertTriangle, TrendingUp, ClipboardList, Award
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid
} from "recharts";

interface DashboardProps {
  projects: Project[];
  role: Role;
  currentUser: User;
  onSelectProject: (p: Project) => void;
}

export function Dashboard({ projects, role, currentUser, onSelectProject }: DashboardProps) {
  const total = projects.length;
  const inProgress = projects.filter(p => p.status === "in_progress").length;
  const done = projects.filter(p => p.status === "approved" || p.status === "reviewed").length;
  const overdue = projects.filter(p => p.status === "overdue").length;
  const submitted = projects.filter(p => p.status === "submitted").length;
  const avgProgress = total ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / total) : 0;

  const pieData = [
    { name: "กำลังดำเนินการ", value: inProgress, color: "#1A56DB" },
    { name: "ส่งแล้ว", value: submitted, color: "#7C3AED" },
    { name: "เสร็จสิ้น", value: done, color: "#16A34A" },
    { name: "เกินกำหนด", value: overdue, color: "#DC2626" },
  ].filter(d => d.value > 0);

  const progressTrend = [
    { week: "สป.8", avg: 28 },
    { week: "สป.10", avg: 35 },
    { week: "สป.12", avg: 45 },
    { week: "สป.14", avg: 52 },
    { week: "สป.16", avg: 61 },
    { week: "สป.18", avg: 68 },
    { week: "สป.20", avg: avgProgress },
  ];

  const statCards = [
    { label: "โครงงานทั้งหมด", value: total, icon: FolderKanban, color: "#1A56DB", bg: "#DBEAFE" },
    { label: "กำลังดำเนินการ", value: inProgress, icon: Clock, color: "#7C3AED", bg: "#EDE9FE" },
    { label: "เสร็จสิ้นแล้ว", value: done, icon: CheckCircle2, color: "#16A34A", bg: "#D1FAE5" },
    { label: "เกินกำหนด", value: overdue, icon: AlertTriangle, color: "#DC2626", bg: "#FEE2E2" },
  ];

  const greetingText = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "สวัสดีตอนเช้า";
    if (hour < 17) return "สวัสดีตอนบ่าย";
    return "สวัสดีตอนเย็น";
  };

  return (
    <div className="p-7 overflow-y-auto h-full" style={{ fontFamily: "'Noto Sans Thai', 'Inter', sans-serif" }}>
      {/* Greeting */}
      <div className="mb-7">
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--foreground)", marginBottom: "3px" }}>
          {greetingText()}, {currentUser.name.split(" ")[0]} 👋
        </h1>
        <p style={{ fontSize: "14px", color: "var(--muted-foreground)" }}>
          {new Date().toLocaleDateString("th-TH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          {role === "admin" ? ` · ${total} โครงงานในระบบ` : ""}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                <Icon size={18} style={{ color }} />
              </div>
              <span style={{ fontSize: "28px", fontWeight: 700, color: "var(--foreground)", fontFamily: "'JetBrains Mono', monospace" }}>
                {value}
              </span>
            </div>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted-foreground)" }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: "1fr 1.4fr" }}>
        {/* Pie chart */}
        <div className="rounded-2xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={15} style={{ color: "var(--muted-foreground)" }} />
            <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--foreground)" }}>สถานะโครงงาน</h3>
          </div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="45%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v} โครงงาน`, n]} />
              </PieChart>
            </ResponsiveContainer>
          ) : null}
          <div className="space-y-1.5 mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{d.name}</span>
                </div>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--foreground)", fontFamily: "'JetBrains Mono', monospace" }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Area chart */}
        <div className="rounded-2xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList size={15} style={{ color: "var(--muted-foreground)" }} />
            <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--foreground)" }}>ความคืบหน้าเฉลี่ย (รายสัปดาห์)</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={progressTrend} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A56DB" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1A56DB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} domain={[0, 100]} />
              <Tooltip formatter={(v) => [`${v}%`, "ความคืบหน้าเฉลี่ย"]} />
              <Area type="monotone" dataKey="avg" stroke="#1A56DB" strokeWidth={2} fill="url(#areaGrad)" dot={{ r: 4, fill: "#1A56DB" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--foreground)" }}>
            {role === "student" ? "โครงงานของฉัน" : "โครงงานล่าสุด"}
          </h3>
          <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{projects.length} รายการ</span>
        </div>
        <div>
          {projects.slice(0, 5).map((project, i) => (
            <button
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="w-full text-left px-6 py-4 flex items-center gap-4 transition-all"
              style={{
                background: "transparent",
                border: "none",
                borderTop: i > 0 ? "1px solid var(--border)" : "none",
                cursor: "pointer",
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "var(--secondary)" }}
              >
                <FolderKanban size={17} style={{ color: "var(--primary)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--foreground)", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {project.title}
                </p>
                <p style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                  {project.studentNames.join(", ")} · {project.courseCode}
                </p>
              </div>
              <div className="w-24 shrink-0">
                <ProgressBar value={project.progress} showLabel size="sm" />
              </div>
              <StatusBadge status={project.status} />
              {project.grade && (
                <div className="flex items-center gap-1 shrink-0">
                  <Award size={14} style={{ color: "#D97706" }} />
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#D97706" }}>{project.grade}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
