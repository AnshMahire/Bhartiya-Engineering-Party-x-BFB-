function Card({ title, subtitle, children, className = "" }) {
  return (
    <section className={`rounded-2xl bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md ${className}`}>
      {(title || subtitle) && (
        <header className="mb-3">
          {title ? <h3 className="text-xl font-semibold text-slate-800">{title}</h3> : null}
          {subtitle ? <p className="mt-1 text-sm text-gray-500">{subtitle}</p> : null}
        </header>
      )}
      {children}
    </section>
  );
}

export default Card;
