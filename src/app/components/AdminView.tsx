import { Project, MOCK_USERS, User } from "./data";
import { StatusBadge } from "./StatusBadge";
import { ProgressBar } from "./ProgressBar";
import { Users, BookOpen, FolderKanban, Award, UserCheck, GraduationCap, Shield } from "lucide-react";

interface AdminViewProps {
  projects: Project[];
}

export function AdminView({ projects }: AdminViewProps) {
  const students = MOCK_USERS.filter(u => u.role === "student");
  const teachers = MOCK_USERS.filter(u => u.role === "teacher");
  const admins = MOCK_USERS.filter(u => u.role === "admin");
  const courses = [...new Set(projects.map(p => p.courseCode))];

  const roleIcon = (role: string) => {
    if (role === "teacher") return <UserCheck size={15} style={{ color: "#1A56DB" }} />;
    if (role === "admin") return <Shield size={15} style={{ color: "#D97706" }} />;
    return <GraduationCap size={15} style={{ color: "#16A34A" }} />;
  };

  const roleBg = (role: string) => {
    if (role === "teacher") return { bg: "#DBEAFE", color: "#1D4ED8" };
    if (role === "admin") return { bg: "#FEF3C7", color: "#92400E" };
    return { bg: "#D1FAE5", color: "#065F46" };
  };

  const roleLabel = (role: string) => {
    if (role === "teacher") return "อาจารย์";
    if (role === "admin") return "ผู้ดูแลระบบ";
    return "นักศึกษา";
  };

  return (
    <div className="p-7 overflow-y-auto h-full" style={{ fontFamily: "'Noto Sans Thai', 'Inter', sans-serif" }}>
      <div className="mb-7">
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--foreground)", marginBottom: "4px" }}>จัดการผู้ใช้</h2>
        <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>ผู้ใช้งานและสิทธิ์ในระบบ</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        {[
          { label: "นักศึกษา", value: students.length, icon: GraduationCap, color: "#16A34A", bg: "#D1FAE5" },
          { label: "อาจารย์", value: teachers.length, icon: UserCheck, color: "#1A56DB", bg: "#DBEAFE" },
          { label: "ผู้ดูแลระบบ", value: admins.length, icon: Shield, color: "#D97706", bg: "#FEF3C7" },
          { label: "รายวิชา", value: courses.length, icon: BookOpen, color: "#7C3AED", bg: "#EDE9FE" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                <Icon size={17} style={{ color }} />
              </div>
              <span style={{ fontSize: "26px", fontWeight: 700, color: "var(--foreground)", fontFamily: "'JetBrains Mono', monospace" }}>{value}</span>
            </div>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted-foreground)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="mb-6 rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>รายชื่อผู้ใช้ทั้งหมด</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ background: "var(--muted)" }}>
              {["ชื่อ-นามสกุล", "อีเมล", "ภาควิชา", "รหัสนักศึกษา", "บทบาท", "สถานะ"].map(h => (
                <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.07em", textTransform: "uppercase", borderBottom: "1px solid var(--border)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_USERS.map((user, i) => {
              const { bg, color } = roleBg(user.role);
              return (
                <tr key={user.id} style={{ borderBottom: i < MOCK_USERS.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <td style={{ padding: "12px 20px" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--primary)", color: "#FFFFFF", fontSize: "11px", fontWeight: 700 }}>
                        {user.avatar}
                      </div>
                      <span style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--foreground)" }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 20px", fontSize: "12px", color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace" }}>{user.email}</td>
                  <td style={{ padding: "12px 20px", fontSize: "13px", color: "var(--foreground)" }}>{user.department}</td>
                  <td style={{ padding: "12px 20px", fontSize: "13px", color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace" }}>{user.studentId ?? "—"}</td>
                  <td style={{ padding: "12px 20px" }}>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit" style={{ background: bg, color, fontSize: "12px", fontWeight: 600 }}>
                      {roleIcon(user.role)} {roleLabel(user.role)}
                    </span>
                  </td>
                  <td style={{ padding: "12px 20px" }}>
                    <span className="px-2.5 py-0.5 rounded-full" style={{ fontSize: "11px", fontWeight: 600, background: "#D1FAE5", color: "#065F46" }}>ใช้งานได้</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Projects overview */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>ภาพรวมโครงงาน</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ background: "var(--muted)" }}>
              {["ชื่อโครงงาน", "นักศึกษา", "อาจารย์", "รายวิชา", "ความคืบหน้า", "สถานะ", "เกรด"].map(h => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.07em", textTransform: "uppercase", borderBottom: "1px solid var(--border)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: i < projects.length - 1 ? "1px solid var(--border)" : "none" }}>
                <td style={{ padding: "12px 16px", maxWidth: "220px" }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</p>
                </td>
                <td style={{ padding: "12px 16px", fontSize: "12px", color: "var(--foreground)", whiteSpace: "nowrap" }}>{p.studentNames[0]}</td>
                <td style={{ padding: "12px 16px", fontSize: "12px", color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>{p.teacherName}</td>
                <td style={{ padding: "12px 16px", fontSize: "12px", color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace" }}>{p.courseCode}</td>
                <td style={{ padding: "12px 16px", width: "130px" }}>
                  <ProgressBar value={p.progress} showLabel size="sm" />
                </td>
                <td style={{ padding: "12px 16px" }}><StatusBadge status={p.status} /></td>
                <td style={{ padding: "12px 16px" }}>
                  {p.grade ? (
                    <span className="flex items-center gap-1" style={{ fontSize: "14px", fontWeight: 700, color: "#D97706" }}>
                      <Award size={13} style={{ color: "#D97706" }} />{p.grade}
                    </span>
                  ) : <span style={{ color: "var(--muted-foreground)", fontSize: "13px" }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
