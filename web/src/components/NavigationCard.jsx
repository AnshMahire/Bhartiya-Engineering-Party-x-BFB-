function NavigationCard({ title, description, badge, actions = [], rows = [] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        {badge ? (
          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
            {badge}
          </span>
        ) : null}
      </div>

      {rows.length ? (
        <div className="space-y-2 rounded-lg bg-slate-50 p-3 text-sm">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-3">
              <span className="text-slate-500">{row.label}</span>
              <span className="text-right font-medium text-slate-800">{row.value}</span>
            </div>
          ))}
        </div>
      ) : null}

      {actions.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              disabled={action.disabled}
              className={action.primary
                ? "rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                : "rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"}
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default NavigationCard;
