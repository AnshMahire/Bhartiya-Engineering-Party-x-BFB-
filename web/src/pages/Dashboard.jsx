import { useMemo, useState } from "react";
import { createEmergency, resetEmergency } from "../services/api";

const DEMO_PATIENT = {
  patientName: "John",
  lat: 19.087,
  lng: 72.8777
};

function Dashboard() {
  const [emergency, setEmergency] = useState(null);
  const [message, setMessage] = useState("No active request");
  const [busy, setBusy] = useState(false);

  const summary = useMemo(() => {
    if (!emergency?.requestId) {
      return "Waiting for emergency trigger";
    }

    return `${emergency.requestId} | ${emergency.emergencyStatus} | ETA ${emergency.eta} mins`;
  }, [emergency]);

  const trigger = async () => {
    setBusy(true);
    setMessage("Creating emergency request...");

    try {
      const next = await createEmergency(DEMO_PATIENT);
      setEmergency(next);
      setMessage("Emergency created and shared with ambulance + hospital dashboards");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create emergency");
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    setBusy(true);
    try {
      const cleared = await resetEmergency();
      setEmergency(cleared);
      setMessage("Emergency state cleared");
    } catch (_error) {
      setMessage("Reset failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-bold">Smart Emergency Dashboard</h1>
      <p className="mt-2 text-sm text-slate-600">Trigger patient emergency and start full coordination flow.</p>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={trigger}
          disabled={busy}
          className="rounded bg-red-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Trigger Emergency
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={busy}
          className="rounded bg-slate-700 px-4 py-2 text-white disabled:opacity-50"
        >
          Reset State
        </button>
      </div>

      <div className="mt-4 rounded border bg-white p-4">
        <p className="font-semibold">Status</p>
        <p className="mt-1 text-sm">{message}</p>
        <p className="mt-2 text-sm text-slate-600">{summary}</p>
      </div>
    </main>
  );
}

export default Dashboard;
