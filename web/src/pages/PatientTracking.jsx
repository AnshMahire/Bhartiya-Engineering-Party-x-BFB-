import { useEffect, useState } from "react";
import LiveTracking from "./LiveTracking";
import { getTracking } from "../services/api";

function PatientTracking() {
  const [emergency, setEmergency] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await getTracking();
      setEmergency(data);
    };

    load();
    const timer = setInterval(load, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-bold">Patient Tracking</h1>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded border bg-white p-4 text-sm">
          <p><span className="font-semibold">Request:</span> {emergency?.requestId || "-"}</p>
          <p><span className="font-semibold">Status:</span> {emergency?.emergencyStatus || "idle"}</p>
          <p><span className="font-semibold">Ambulance:</span> {emergency?.ambulance?.id || "-"}</p>
          <p><span className="font-semibold">Hospital:</span> {emergency?.hospital?.name || "-"}</p>
          <p><span className="font-semibold">ETA:</span> {emergency?.eta ?? 0} mins</p>
        </div>
      </div>

      <div className="mt-4">
        <LiveTracking emergency={emergency} />
      </div>
    </main>
  );
}

export default PatientTracking;
