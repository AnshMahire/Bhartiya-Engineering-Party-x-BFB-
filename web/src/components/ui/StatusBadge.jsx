function StatusBadge({ label, tone = "gray" }) {
  const tones = {
    red: "bg-red-100 text-red-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-600",
    gray: "bg-gray-100 text-gray-600"
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone] || tones.gray}`}>
      {label}
    </span>
  );
}

export default StatusBadge;
