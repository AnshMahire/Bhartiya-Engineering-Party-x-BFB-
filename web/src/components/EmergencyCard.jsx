function EmergencyCard({ title, rows = [], tone = "neutral", footer }) {
  const tones = {
    neutral: "border-slate-200",
    urgent: "border-red-200",
    highlight: "border-blue-200"
  };

  return (
    <article className={`rounded-2xl border bg-white p-4 shadow-sm ${tones[tone] || tones.neutral}`}>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <div className="mt-3 space-y-2 text-sm">
        {rows.map((row) => (
          <div key={`${title}-${row.label}`} className="flex items-center justify-between gap-3">
            <span className="text-slate-500">{row.label}</span>
            <span className="text-right font-medium text-slate-800">{row.value}</span>
          </div>
        ))}
      </div>
      {footer ? <div className="mt-4">{footer}</div> : null}
    </article>
  );
}

export default EmergencyCard;
