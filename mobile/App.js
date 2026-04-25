import "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HomeScreen from "./screens/HomeScreen";
import EmergencyScreen from "./screens/EmergencyScreen";
import { createEmergency, getTracking } from "./services/api";

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
    } catch (err) {
      setError(err.response?.data?.message || "Failed to trigger emergency.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const current = await getTracking();

        if (current?.requestId) {
          setEmergency(current);
          setScreen("emergency");
        } else if (screen === "emergency") {
          setEmergency(null);
          setScreen("home");
        }
      } catch (_err) {
        // Keep current UI state during network glitches.
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [screen]);

  const goHome = () => {
    setScreen("home");
    setError("");
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
}
