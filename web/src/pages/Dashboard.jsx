import { useMemo, useState } from "react";
import { createEmergency, resetEmergency } from "../services/api";
import ActionButton from "../components/ActionButton";
import StatusCard from "../components/StatusCard";
import NotificationBanner from "../components/NotificationBanner";
import EmergencyCard from "../components/EmergencyCard";

const DEMO_PATIENT = {
  patientName: "John",
  lat: 19.087,
  lng: 72.8777
};

function Dashboard() {
  const [emergency, setEmergency] = useState(null);
  const [message, setMessage] = useState("No active request");
  const [busy, setBusy] = useState(false);
  const [tone, setTone] = useState("info");

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
      setTone("success");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create emergency");
      setTone("danger");
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
      setTone("warning");
    } catch {
      setMessage("Reset failed");
      setTone("danger");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Smart Emergency Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Trigger patient emergency and start full coordination flow.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <ActionButton onClick={trigger} disabled={busy} variant="primary">
            Trigger Emergency
          </ActionButton>
          <ActionButton onClick={reset} disabled={busy} variant="secondary">
            Reset State
          </ActionButton>
        </div>
        <div className="mt-4">
          <NotificationBanner message={message} tone={tone} />
        </div>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-2">
        <StatusCard title="System Summary" value={summary} subtitle="Real-time orchestration status" />
        <EmergencyCard
          title="Demo Patient Payload"
          rows={[
            { label: "Name", value: DEMO_PATIENT.patientName },
            { label: "Latitude", value: DEMO_PATIENT.lat },
            { label: "Longitude", value: DEMO_PATIENT.lng }
          ]}
          tone="highlight"
        />
      </section>
      <div className="mt-4">
        <StatusCard
          title="Current Request"
          value={emergency?.requestId || "No request"}
          subtitle={emergency?.emergencyStatus || "idle"}
          tone={emergency?.requestId ? "info" : "neutral"}
        />
      </div>
    </main>
  );
}

export default Dashboard;
