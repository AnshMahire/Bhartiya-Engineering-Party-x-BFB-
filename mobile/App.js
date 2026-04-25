import { useEffect, useRef, useState } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import EmergencyScreen from "./screens/EmergencyScreen";
import { acceptEmergency, createEmergency, getActiveEmergency } from "./services/api";

const DEFAULT_PATIENT = {
  patientName: "Mobile Patient",
  lat: 19.076,
  lng: 72.8777
};

export default function App() {
  const [screen, setScreen] = useState("home");
  const [emergency, setEmergency] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const autoAcceptTriggered = useRef(false);

  const triggerEmergency = async (source) => {
    setLoading(true);
    setError("");

    try {
      const data = await createEmergency({
        ...DEFAULT_PATIENT,
        patientName: `${DEFAULT_PATIENT.patientName} (${source})`
      });

      setEmergency(data);
      setScreen("emergency");
      autoAcceptTriggered.current = false;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to trigger emergency.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const active = await getActiveEmergency();
        if (active) {
          setEmergency(active);
          setScreen("emergency");
        }
      } catch (_err) {
        // Keep UI simple during network glitches.
      }
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!emergency || emergency.status !== "ambulance_assigned" || autoAcceptTriggered.current) {
      return;
    }

    autoAcceptTriggered.current = true;

    const timeout = setTimeout(async () => {
      try {
        const accepted = await acceptEmergency(emergency.emergencyId);
        setEmergency(accepted);
      } catch (_err) {
        // Driver accept can still be done from dashboard.
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [emergency]);

  const goHome = () => {
    setScreen("home");
    setError("");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <StatusBar barStyle="light-content" />
      {screen === "home" ? (
        <HomeScreen
          onSOS={() => triggerEmergency("SOS")}
          onShake={() => triggerEmergency("Shake")}
          loading={loading}
          error={error}
        />
      ) : (
        <EmergencyScreen emergency={emergency} onBack={goHome} />
      )}
    </SafeAreaView>
  );
}
