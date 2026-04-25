function NotificationBanner({ message, tone = "info" }) {
  if (!message) {
    return null;
  }

  const tones = {
    info: "border-blue-200 bg-blue-50 text-blue-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    danger: "border-red-200 bg-red-50 text-red-800"
  };

  return (
    <div className={`animate-[slideDown_0.25s_ease-out] rounded-xl border px-3 py-2 text-sm font-medium ${tones[tone] || tones.info}`}>
      {message}
    </div>
  );
}

export default NotificationBanner;
