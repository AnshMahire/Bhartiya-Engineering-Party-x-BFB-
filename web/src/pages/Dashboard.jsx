import { useEffect, useMemo, useState } from "react";
import AmbulanceCard from "../components/AmbulanceCard";
import StatusPanel from "../components/StatusPanel";
import LiveTracking from "./LiveTracking";
import {
  acceptEmergency,
  createEmergency,
  getActiveEmergency,
  resetEmergency
} from "../services/api";

const DEFAULT_PATIENT = {
  patientName: "Hackathon Demo Patient",
  lat: 19.076,
  lng: 72.8777
};

function Dashboard() {
  const [emergency, setEmergency] = useState(null);
  const [statusKey, setStatusKey] = useState("waiting");
  const [statusMessage, setStatusMessage] = useState("Waiting for emergency request...");
  const [busy, setBusy] = useState(false);

  const refreshEmergency = async () => {
    try {
      const current = await getActiveEmergency();
      if (!current) {
        setEmergency(null);
        setStatusKey("waiting");
        setStatusMessage("Waiting for emergency request...");
        return;
      }

      setEmergency(current);
      setStatusKey(current.status);
      setStatusMessage(current.statusMessage);
    } catch (_error) {
      setStatusKey("error");
      setStatusMessage("Backend not reachable. Start backend server on port 4000.");
    }
  };

  useEffect(() => {
    refreshEmergency();
    const timer = setInterval(refreshEmergency, 2000);
    return () => clearInterval(timer);
  }, []);

  const triggerEmergency = async () => {
    setBusy(true);
    setStatusKey("searching");
    setStatusMessage("Searching ambulance...");

    try {
      const result = await createEmergency(DEFAULT_PATIENT);
      setEmergency(result);
      setStatusKey(result.status);
      setStatusMessage(result.statusMessage);
    } catch (error) {
      const apiMessage = error.response?.data?.message;
      setStatusKey("error");
      setStatusMessage(apiMessage || "Unable to create emergency.");
    } finally {
      setBusy(false);
    }
  };

  const handleAccept = async () => {
    if (!emergency) {
      return;
    }

    setBusy(true);
    try {
      const updated = await acceptEmergency(emergency.emergencyId);
      setEmergency(updated);
      setStatusKey(updated.status);
      setStatusMessage(updated.statusMessage);
    } catch (error) {
      setStatusKey("error");
      setStatusMessage(error.response?.data?.message || "Could not accept request.");
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async () => {
    setBusy(true);
    try {
      await resetEmergency();
      setEmergency(null);
      setStatusKey("waiting");
      setStatusMessage("Waiting for emergency request...");
    } catch (_error) {
      setStatusKey("error");
      setStatusMessage("Reset failed.");
    } finally {
      setBusy(false);
    }
  };

  const etaLabel = useMemo(() => {
    if (!emergency) {
      return "--";
    }

    return emergency.eta === 0 ? "Arrived" : `${emergency.eta} mins`;
  }, [emergency]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col gap-3 rounded-2xl bg-slate-900 p-6 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              AI Smart Emergency Response Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Hackathon MVP: real-time ambulance assignment and tracking
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={triggerEmergency}
              disabled={busy}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Trigger Emergency
            </button>
            <button
              type="button"
              onClick={handleAccept}
              disabled={busy || !emergency || emergency.status !== "ambulance_assigned"}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Driver Accept
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={busy}
              className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reset Demo
            </button>
          </div>
        </header>

        <StatusPanel statusKey={statusKey} statusMessage={statusMessage} />

        <section className="mt-5 grid gap-4 md:grid-cols-3">
          <AmbulanceCard ambulance={emergency?.ambulance} />

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Assigned Hospital</h3>
            {!emergency ? (
              <p className="mt-2 text-sm text-slate-500">No hospital selected yet.</p>
            ) : (
              <div className="mt-3 space-y-1 text-sm text-slate-700">
                <p>
                  <span className="font-medium">Name:</span> {emergency.hospital.name}
                </p>
                <p>
                  <span className="font-medium">Beds:</span> {emergency.hospital.beds}
                </p>
                <p>
                  <span className="font-medium">ICU:</span> {emergency.hospital.icu}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">ETA</h3>
            <p className="mt-3 text-3xl font-bold text-red-500">{etaLabel}</p>
            {emergency && (
              <div className="mt-3 space-y-1 text-sm text-slate-700">
                <p>
                  <span className="font-medium">To Patient:</span>{" "}
                  {emergency.etaBreakdown.toPatient} mins
                </p>
                <p>
                  <span className="font-medium">To Hospital:</span>{" "}
                  {emergency.etaBreakdown.toHospital} mins
                </p>
              </div>
            )}
          </div>
        </section>

        <div className="mt-6">
          <LiveTracking emergency={emergency} />
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
