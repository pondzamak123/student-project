import { useState } from "react";
import { User } from "./data";
import { GraduationCap, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

interface LoginProps {
  onLogin: (user: User) => void;
}

const DEMO_ACCOUNTS = [
  { label: "นักศึกษา", email: "thanakorn.w@student.uni.ac.th", password: "student123", color: "#1A56DB" },
  { label: "อาจารย์", email: "somchai.j@uni.ac.th", password: "teacher123", color: "#16A34A" },
  { label: "ผู้ดูแลระบบ", email: "admin@uni.ac.th", password: "admin123", color: "#D97706" },
];

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email || !password) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // เรียก API Backend จริง
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        // เก็บ token ใน localStorage
        localStorage.setItem("token", data.data.token);
        onLogin(data.data.user);
      } else {
        setError(data.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (err) {
      // ถ้า backend ไม่พร้อม ใช้ mock fallback
      setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบว่า backend ทำงานอยู่");
    }
    setLoading(false);
  };

  const quickLogin = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError("");
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Noto Sans Thai', 'Inter', sans-serif", background: "var(--background)" }}>
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0D1B3E 0%, #1A56DB 100%)" }}
      >
        <div className="absolute top-[-80px] right-[-80px] w-64 h-64 rounded-full opacity-10" style={{ background: "#FFFFFF" }} />
        <div className="absolute bottom-[-60px] left-[-60px] w-48 h-48 rounded-full opacity-10" style={{ background: "#FFFFFF" }} />
        <div className="absolute top-1/2 right-[-40px] w-32 h-32 rounded-full opacity-5" style={{ background: "#FFFFFF" }} />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
            <GraduationCap size={24} color="#FFFFFF" />
          </div>
          <div>
            <p style={{ color: "#FFFFFF", fontSize: "18px", fontWeight: 700, lineHeight: 1.2 }}>UniProject</p>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px" }}>ระบบติดตามโครงงาน</p>
          </div>
        </div>

        <div className="relative z-10">
          <h1 style={{ color: "#FFFFFF", fontSize: "36px", fontWeight: 700, lineHeight: 1.35, marginBottom: "16px" }}>
            ติดตามความคืบหน้า<br />โครงงานนักศึกษา<br />อย่างมีประสิทธิภาพ
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "15px", lineHeight: 1.75 }}>
            แพลตฟอร์มสำหรับนักศึกษา อาจารย์ และผู้ดูแลระบบ<br />
            ในการบริหารจัดการโครงงานอย่างครบวงจร
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 relative z-10">
          {[
            { value: "1,240+", label: "นักศึกษา" },
            { value: "86", label: "อาจารย์" },
            { value: "430+", label: "โครงงาน" },
          ].map(({ value, label }) => (
            <div key={label} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.1)" }}>
              <p style={{ color: "#FFFFFF", fontSize: "22px", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{value}</p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", marginTop: "2px" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--primary)" }}>
              <GraduationCap size={22} color="#FFFFFF" />
            </div>
            <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)" }}>UniProject</p>
          </div>

          <h2 style={{ fontSize: "26px", fontWeight: 700, color: "var(--foreground)", marginBottom: "6px" }}>
            เข้าสู่ระบบ
          </h2>
          <p style={{ fontSize: "14px", color: "var(--muted-foreground)", marginBottom: "32px" }}>
            กรอกข้อมูลบัญชีมหาวิทยาลัยของคุณ
          </p>

          <div className="mb-6">
            <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted-foreground)", marginBottom: "8px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              ทดสอบเข้าสู่ระบบด้วย
            </p>
            <div className="flex gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.label}
                  onClick={() => quickLogin(acc)}
                  className="flex-1 py-2 rounded-lg transition-all"
                  style={{
                    background: `${acc.color}12`,
                    border: `1.5px solid ${acc.color}30`,
                    color: acc.color,
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: "var(--border-strong)" }} />
            <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>หรือกรอกข้อมูลเอง</span>
            <div className="flex-1 h-px" style={{ background: "var(--border-strong)" }} />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--foreground)", marginBottom: "6px" }}>
                อีเมลมหาวิทยาลัย
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
                <input
                  type="email"
                  placeholder="your@student.uni.ac.th"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all"
                  style={{
                    background: "var(--input-background)",
                    border: `1.5px solid ${error ? "var(--destructive)" : "var(--border-strong)"}`,
                    fontSize: "14px",
                    color: "var(--foreground)",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--foreground)", marginBottom: "6px" }}>
                รหัสผ่าน
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="w-full pl-10 pr-12 py-3 rounded-xl outline-none transition-all"
                  style={{
                    background: "var(--input-background)",
                    border: `1.5px solid ${error ? "var(--destructive)" : "var(--border-strong)"}`,
                    fontSize: "14px",
                    color: "var(--foreground)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", padding: "2px" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg px-3 py-2.5" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
                <AlertCircle size={14} style={{ color: "var(--destructive)", flexShrink: 0 }} />
                <p style={{ fontSize: "13px", color: "var(--destructive)" }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl transition-all"
              style={{
                background: loading ? "var(--muted)" : "var(--primary)",
                color: loading ? "var(--muted-foreground)" : "var(--primary-foreground)",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "15px",
                fontWeight: 700,
                marginTop: "8px",
              }}
            >
              {loading ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
            </button>
          </form>

          <p style={{ fontSize: "12px", color: "var(--muted-foreground)", textAlign: "center", marginTop: "24px" }}>
            มหาวิทยาลัยเทคโนโลยีสารสนเทศ · ระบบบริหารโครงงาน v2.1
          </p>
        </div>
      </div>
    </div>
  );
}
