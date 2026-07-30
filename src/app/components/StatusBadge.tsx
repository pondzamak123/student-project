import { ProjectStatus } from "./data";

const config: Record<ProjectStatus, { label: string; bg: string; color: string }> = {
  in_progress: { label: "กำลังดำเนินการ", bg: "#DBEAFE", color: "#1D4ED8" },
  submitted: { label: "ส่งแล้ว", bg: "#EDE9FE", color: "#6D28D9" },
  reviewed: { label: "ตรวจแล้ว", bg: "#D1FAE5", color: "#065F46" },
  approved: { label: "อนุมัติแล้ว", bg: "#D1FAE5", color: "#065F46" },
  overdue: { label: "เกินกำหนด", bg: "#FEE2E2", color: "#991B1B" },
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const { label, bg, color } = config[status];
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: bg, color, fontSize: "11px", fontWeight: 600 }}
    >
      {label}
    </span>
  );
}
