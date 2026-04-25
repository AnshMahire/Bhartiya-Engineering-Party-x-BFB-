import { useEffect, useMemo, useState } from "react";
import {
  acceptAmbulance,
  getTracking,
  pickupPatient
} from "../services/api";
import EmergencyModal from "../components/EmergencyModal";
import MapSection from "../components/MapSection";
import BottomActionPanel from "../components/BottomActionPanel";
import NavigationView from "./NavigationView";
import NotificationBanner from "../components/NotificationBanner";
import StatusCard from "../components/StatusCard";
import LoadingAnimation from "../components/LoadingAnimation";

function toRad(value) {
  return (value * Math.PI) / 180;
}

function getDistanceKm(a, b) {
  const radius = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const latA = toRad(a.lat);
  const latB = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(latA) * Math.cos(latB) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  return radius * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function AmbulanceDashboard() {
  const [emergency, setEmergency] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("System online. Waiting for dispatch.");
  const [modalDismissed, setModalDismissed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tone, setTone] = useState("info");

  useEffect(() => {
    let mounted = true;

    const pollEmergency = async () => {
      try {
        const data = await getTracking();

        if (!mounted) {
          return;
        }

        setEmergency(data);
        setLoading(false);
        if (!data?.requestId) {
          setModalDismissed(false);
        }
      } catch {
        if (mounted) {
          setMessage("Unable to fetch latest tracking data.");
          setTone("danger");
        }
      }
    };

    pollEmergency();
    const timer = setInterval(pollEmergency, 2000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  const onAccept = async () => {
    setBusy(true);
    try {
      const next = await acceptAmbulance();
      setEmergency(next);
      setMessage("Request accepted. EN ROUTE to patient.");
      setTone("success");
      setModalDismissed(true);
    } catch {
      setMessage("Unable to accept emergency request.");
      setTone("danger");
    } finally {
      setBusy(false);
    }
  };

  const onPickup = async () => {
    setBusy(true);
    try {
      const next = await pickupPatient();
      setEmergency(next);
      setMessage("Patient picked. Navigation switched to hospital route.");
      setTone("warning");
    } catch {
      setMessage("Unable to mark patient pickup.");
      setTone("danger");
    } finally {
      setBusy(false);
    }
  };

  const distanceToPatient = useMemo(() => {
    if (!emergency?.requestId) {
      return "-";
    }

    const km = getDistanceKm(
      { lat: emergency.ambulance.lat, lng: emergency.ambulance.lng },
      { lat: emergency.patient.lat, lng: emergency.patient.lng }
    );

    return `${km.toFixed(1)} km`;
  }, [emergency]);

  const showIncomingModal =
    Boolean(emergency?.requestId) &&
    emergency?.ambulance?.status === "assigned" &&
    !modalDismissed;

  const pendingAlerts =
    emergency?.requestId && emergency?.ambulance?.status === "assigned" ? 1 : 0;

  return (
    <main className="min-h-screen bg-[#f4f4f5] text-slate-900">
      <section className="mx-auto w-full max-w-7xl px-4 pt-4">
        {loading ? <LoadingAnimation label="Loading ambulance dispatch feed..." /> : null}
        <div className="mt-3">
          <NotificationBanner message={message} tone={tone} />
        </div>
      </section>

      <section className="mx-auto mt-4 grid w-full max-w-7xl grid-cols-1 gap-4 px-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <StatusCard
              title="Driver"
              value={emergency?.ambulance?.driverName || "Driver"}
              subtitle={emergency?.ambulance?.id || "No ambulance"}
            />
            <StatusCard
              title="Emergency Status"
              value={emergency?.emergencyStatus || "idle"}
              subtitle={emergency?.phase || "waiting"}
              tone="warning"
            />
            <StatusCard
              title="ETA"
              value={`${emergency?.eta ?? 0} mins`}
              subtitle={emergency?.requestId || "No request"}
              tone="info"
            />
          </div>
          <MapSection emergency={emergency} />
        </div>

        <div className="space-y-4">
          <NavigationView
            emergency={emergency}
            onPickup={onPickup}
            busy={busy}
            message={message}
          />
        </div>
      </section>

      <BottomActionPanel
        pendingAlerts={pendingAlerts}
        emergency={emergency}
        busy={busy}
        onDispatch={onAccept}
      />

      <EmergencyModal
        open={showIncomingModal}
        emergency={emergency}
        distance={distanceToPatient}
        onAccept={onAccept}
        onIgnore={() => setModalDismissed(true)}
        busy={busy}
      />
    </main>
  );
}

export default AmbulanceDashboard;
