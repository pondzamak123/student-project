interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
  size?: "sm" | "md";
  color?: string;
}

function getColor(value: number) {
  if (value >= 100) return "#16A34A";
  if (value >= 60) return "#1A56DB";
  if (value >= 30) return "#D97706";
  return "#DC2626";
}

export function ProgressBar({ value, showLabel = false, size = "md", color }: ProgressBarProps) {
  const barColor = color ?? getColor(value);
  const height = size === "sm" ? "5px" : "7px";
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 rounded-full overflow-hidden" style={{ background: "var(--secondary)", height }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(value, 100)}%`, background: barColor }}
        />
      </div>
      {showLabel && (
        <span style={{ fontSize: "12px", fontWeight: 700, color: barColor, minWidth: "34px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>
          {value}%
        </span>
      )}
    </div>
  );
}
