import { useEffect, useState } from "react";
import LiveTracking from "./LiveTracking";
import { acceptAmbulance, getAmbulanceRequest, pickupPatient } from "../services/api";

function AmbulanceDashboard() {
  const [emergency, setEmergency] = useState(null);
  const [message, setMessage] = useState("Waiting for request");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getAmbulanceRequest();
      setEmergency(data);
    };

    load();
    const timer = setInterval(load, 2000);
    return () => clearInterval(timer);
  }, []);

  const onAccept = async () => {
    setBusy(true);
    try {
      const next = await acceptAmbulance();
      setEmergency(next);
      setMessage("Request accepted. Heading to patient.");
    } catch (_error) {
      setMessage("Unable to accept request");
    } finally {
      setBusy(false);
    }
  };

  const onPickup = async () => {
    setBusy(true);
    try {
      const next = await pickupPatient();
      setEmergency(next);
      setMessage("Patient picked. Heading to hospital.");
    } catch (_error) {
      setMessage("Unable to mark pickup");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-bold">Ambulance Dashboard</h1>

      <div className="mt-4 rounded border bg-white p-4 text-sm">
        <p><span className="font-semibold">Patient:</span> {emergency?.patient?.name || "-"}</p>
        <p><span className="font-semibold">Patient Location:</span> {emergency?.patient?.lat}, {emergency?.patient?.lng}</p>
        <p><span className="font-semibold">Ambulance Status:</span> {emergency?.ambulance?.status || "idle"}</p>
        <p><span className="font-semibold">Emergency Status:</span> {emergency?.emergencyStatus || "idle"}</p>
        <p><span className="font-semibold">Message:</span> {message}</p>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={onAccept}
          disabled={busy || !emergency?.requestId}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Accept Request
        </button>
        <button
          type="button"
          onClick={onPickup}
          disabled={busy || emergency?.phase !== "to_patient"}
          className="rounded bg-orange-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Pickup Patient
        </button>
      </div>

      <div className="mt-4">
        <LiveTracking emergency={emergency} />
      </div>
    </main>
  );
}

export default AmbulanceDashboard;
