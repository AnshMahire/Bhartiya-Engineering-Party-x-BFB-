import { useEffect, useState } from "react";
import { confirmHospital, getHospitalAlert } from "../services/api";

function HospitalDashboard() {
  const [emergency, setEmergency] = useState(null);
  const [message, setMessage] = useState("No incoming patient");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getHospitalAlert();
      setEmergency(data);
    };

    load();
    const timer = setInterval(load, 2000);
    return () => clearInterval(timer);
  }, []);

  const onConfirm = async () => {
    setBusy(true);
    try {
      const next = await confirmHospital();
      setEmergency(next);
      setMessage("Bed allocation confirmed");
    } catch (_error) {
      setMessage("Unable to confirm bed allocation");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-bold">Hospital Dashboard</h1>

      <div className="mt-4 rounded border bg-white p-4 text-sm">
        <p><span className="font-semibold">Incoming Patient:</span> {emergency?.patient?.name || "-"}</p>
        <p><span className="font-semibold">Assigned Ambulance:</span> {emergency?.ambulance?.id || "-"}</p>
        <p><span className="font-semibold">Hospital:</span> {emergency?.hospital?.name || "-"}</p>
        <p><span className="font-semibold">Emergency Status:</span> {emergency?.emergencyStatus || "idle"}</p>
        <p><span className="font-semibold">Bed Allocation:</span> {emergency?.hospital?.confirmed ? "Confirmed" : "Pending"}</p>
        <p><span className="font-semibold">Patient arriving in:</span> {emergency?.eta ?? 0} minutes</p>
        <p><span className="font-semibold">Message:</span> {message}</p>
      </div>

      <button
        type="button"
        onClick={onConfirm}
        disabled={busy || !emergency?.requestId}
        className="mt-4 rounded bg-emerald-600 px-4 py-2 text-white disabled:opacity-50"
      >
        Confirm Bed Allocation
      </button>
    </main>
  );
}

export default HospitalDashboard;
