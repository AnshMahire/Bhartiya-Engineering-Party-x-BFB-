const statusStyles = {
  waiting: "bg-slate-100 text-slate-900",
  searching: "bg-amber-100 text-amber-900",
  ambulance_assigned: "bg-blue-100 text-blue-900",
  driver_arriving: "bg-indigo-100 text-indigo-900",
  patient_picked: "bg-orange-100 text-orange-900",
  to_hospital: "bg-purple-100 text-purple-900",
  reached_hospital: "bg-emerald-100 text-emerald-900",
  error: "bg-red-100 text-red-900"
};

function StatusPanel({ statusKey, statusMessage }) {
  const style = statusStyles[statusKey] || "bg-slate-100 text-slate-900";

  return (
    <div className={`rounded-xl p-4 shadow-sm ${style}`}>
      <h2 className="text-sm font-semibold uppercase tracking-wide">Emergency Status</h2>
      <p className="mt-2 text-xl font-bold">{statusMessage}</p>
    </div>
  );
}

export default StatusPanel;
