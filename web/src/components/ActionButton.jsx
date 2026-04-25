function ActionButton({
  children,
  onClick,
  disabled,
  variant = "primary",
  className = "",
  type = "button"
}) {
  const variants = {
    primary: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-300",
    secondary: "bg-slate-700 text-white hover:bg-slate-800 focus-visible:ring-slate-300",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-300",
    ghost: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 focus-visible:ring-slate-200"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
}

export default ActionButton;
