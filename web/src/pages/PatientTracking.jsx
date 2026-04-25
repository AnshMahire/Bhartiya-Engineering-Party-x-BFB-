import { useEffect, useState } from "react";
import LiveTracking from "./LiveTracking";
import { getTracking } from "../services/api";
import StatusCard from "../components/StatusCard";
import EmergencyCard from "../components/EmergencyCard";
import LoadingAnimation from "../components/LoadingAnimation";

function PatientTracking() {
  const [emergency, setEmergency] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getTracking();
      setEmergency(data);
      setLoading(false);
    };

    load();
    const timer = setInterval(load, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-900">Patient Tracking</h1>
      <div className="mt-3">{loading ? <LoadingAnimation label="Syncing live emergency data..." /> : null}</div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <StatusCard title="Request" value={emergency?.requestId || "-"} subtitle={emergency?.emergencyStatus || "idle"} tone="info" />
        <StatusCard title="Assigned Ambulance" value={emergency?.ambulance?.id || "-"} subtitle={emergency?.ambulance?.status || "idle"} />
        <StatusCard title="ETA" value={`${emergency?.eta ?? 0} mins`} subtitle={emergency?.hospital?.name || "-"} tone="warning" />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <EmergencyCard
          title="Patient Details"
          rows={[
            { label: "Name", value: emergency?.patient?.name || "-" },
            { label: "Status", value: emergency?.patient?.status || "idle" },
            { label: "Coordinates", value: `${emergency?.patient?.lat ?? "-"}, ${emergency?.patient?.lng ?? "-"}` }
          ]}
        />
        <EmergencyCard
          title="Hospital Details"
          rows={[
            { label: "Name", value: emergency?.hospital?.name || "-" },
            { label: "Bed Confirmed", value: emergency?.hospital?.confirmed ? "Yes" : "Pending" },
            { label: "Ambulance", value: emergency?.ambulance?.driverName || "-" }
          ]}
        />
      </div>

      <div className="mt-4">
        <LiveTracking emergency={emergency} />
      </div>
    </main>
  );
}

export default PatientTracking;
