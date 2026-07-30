import { Role, User } from "./data";
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  Upload,
  MessageSquare,
  Users,
  BarChart3,
  Settings,
  GraduationCap,
  LogOut,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  currentUser: User;
  onLogout: () => void;
}

const navItems: Record<Role, { id: string; label: string; icon: React.FC<{ size?: number; color?: string }> }[]> = {
  student: [
    { id: "dashboard", label: "แดชบอร์ด", icon: LayoutDashboard },
    { id: "projects", label: "โครงงานของฉัน", icon: FolderKanban },
    { id: "weekly", label: "รายงานรายสัปดาห์", icon: ClipboardList },
    { id: "files", label: "อัปโหลดไฟล์", icon: Upload },
  ],
  teacher: [
    { id: "dashboard", label: "แดชบอร์ด", icon: LayoutDashboard },
    { id: "projects", label: "โครงงานทั้งหมด", icon: FolderKanban },
    { id: "weekly", label: "รายงานนักศึกษา", icon: ClipboardList },
    { id: "comments", label: "ความคิดเห็น", icon: MessageSquare },
  ],
  admin: [
    { id: "dashboard", label: "แดชบอร์ด", icon: LayoutDashboard },
    { id: "projects", label: "โครงงานทั้งหมด", icon: FolderKanban },
    { id: "users", label: "จัดการผู้ใช้", icon: Users },
    { id: "analytics", label: "รายงานภาพรวม", icon: BarChart3 },
    { id: "settings", label: "ตั้งค่าระบบ", icon: Settings },
  ],
};

const roleLabel: Record<Role, string> = {
  student: "นักศึกษา",
  teacher: "อาจารย์ที่ปรึกษา",
  admin: "ผู้ดูแลระบบ",
};

export function Sidebar({ activeView, setActiveView, currentUser, onLogout }: SidebarProps) {
  const items = navItems[currentUser.role];

  return (
    <aside
      className="w-60 h-full flex flex-col shrink-0"
      style={{ background: "var(--sidebar)", color: "var(--sidebar-foreground)" }}
    >
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-3" style={{ borderBottom: "1px solid var(--sidebar-border)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--primary)" }}>
          <GraduationCap size={20} color="#FFFFFF" />
        </div>
        <div>
          <p style={{ fontSize: "15px", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2 }}>UniProject</p>
          <p style={{ fontSize: "11px", color: "rgba(240,244,252,0.45)" }}>ระบบติดตามโครงงาน</p>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-4" style={{ borderBottom: "1px solid var(--sidebar-border)" }}>
        <div className="flex items-center gap-3 rounded-xl px-3 py-3" style={{ background: "var(--sidebar-accent)" }}>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "var(--primary)", fontSize: "12px", fontWeight: 700, color: "#FFFFFF" }}
          >
            {currentUser.avatar}
          </div>
          <div className="min-w-0">
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {currentUser.name}
            </p>
            <p style={{ fontSize: "11px", color: "rgba(240,244,252,0.5)", marginTop: "1px" }}>
              {roleLabel[currentUser.role]}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,244,252,0.3)", padding: "4px 10px 8px" }}>
          เมนูหลัก
        </p>
        <ul className="space-y-0.5">
          {items.map(({ id, label, icon: Icon }) => {
            const isActive = activeView === id;
            return (
              <li key={id}>
                <button
                  onClick={() => setActiveView(id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                  style={{
                    background: isActive ? "var(--primary)" : "transparent",
                    color: isActive ? "#FFFFFF" : "rgba(240,244,252,0.65)",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <Icon size={17} />
                  <span style={{ fontSize: "13.5px", fontWeight: isActive ? 600 : 400, flex: 1 }}>{label}</span>
                  {isActive && <ChevronRight size={13} color="rgba(255,255,255,0.7)" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4" style={{ borderTop: "1px solid var(--sidebar-border)" }}>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
          style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(240,244,252,0.5)" }}
        >
          <LogOut size={16} />
          <span style={{ fontSize: "13px" }}>ออกจากระบบ</span>
        </button>
      </div>
    </aside>
  );
}
