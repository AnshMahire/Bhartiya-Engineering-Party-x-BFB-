import { useMemo } from "react";

function EmergencyModal({ open, emergency, distance, onAccept, onIgnore, busy }) {
  const eta = useMemo(() => {
    if (!emergency?.requestId) {
      return "-";
    }
    return emergency.eta === 0 ? "Arrived" : `${emergency.eta} mins`;
  }, [emergency]);

  if (!open || !emergency?.requestId) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 px-4">
      <div className="relative z-[2001] w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold text-red-700">Urgent Request</h2>
          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
            HIGH
          </span>
        </div>

        <div className="space-y-2 rounded-xl border border-red-100 bg-red-50/40 p-3 text-sm text-slate-700">
          <p><span className="font-semibold">Patient:</span> {emergency.patient.name}</p>
          <p><span className="font-semibold">Location:</span> {emergency.patient.lat}, {emergency.patient.lng}</p>
          <p><span className="font-semibold">Distance:</span> {distance}</p>
          <p><span className="font-semibold">ETA:</span> {eta}</p>
          <p><span className="font-semibold">Emergency Type:</span> Medical Emergency</p>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={onAccept}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            Accept
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onIgnore}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            Ignore
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmergencyModal;
