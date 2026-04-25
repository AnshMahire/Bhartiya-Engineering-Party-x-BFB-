function MapContainer({ title, subtitle, children, overlay }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800">{title}</h3>
          {subtitle ? <p className="text-xs text-slate-500">{subtitle}</p> : null}
        </div>
        {overlay ? <div>{overlay}</div> : null}
      </div>
      <div>{children}</div>
    </section>
  );
}

export default MapContainer;
