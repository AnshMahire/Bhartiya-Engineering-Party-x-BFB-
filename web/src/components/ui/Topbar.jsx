import StatusBadge from "./StatusBadge";

function Topbar({ title, subtitle, emergencyStatus }) {
  const tone = emergencyStatus === "completed"
    ? "green"
    : emergencyStatus === "idle"
      ? "gray"
      : "blue";

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge label={emergencyStatus || "idle"} tone={tone} />
          <StatusBadge label="Hospital Online" tone="green" />
        </div>
      </div>
    </div>
  );
}

export default Topbar;
