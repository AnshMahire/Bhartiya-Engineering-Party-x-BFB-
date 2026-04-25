function StatusCard({ title, value, subtitle, tone = "neutral", children, className = "" }) {
  const tones = {
    neutral: "border-slate-200 bg-white",
    success: "border-emerald-200 bg-emerald-50",
    danger: "border-red-200 bg-red-50",
    warning: "border-amber-200 bg-amber-50",
    info: "border-blue-200 bg-blue-50"
  };

  return (
    <section className={`rounded-2xl border p-4 shadow-sm ${tones[tone] || tones.neutral} ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
      {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
      {children ? <div className="mt-3">{children}</div> : null}
    </section>
  );
}

export default StatusCard;
