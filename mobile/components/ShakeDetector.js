import { useEffect, useRef } from "react";
import { Text } from "react-native";
import { Accelerometer } from "expo-sensors";

const SHAKE_THRESHOLD = 1.5;
const SHAKE_COOLDOWN_MS = 2500;

function ShakeDetector({ onShake, disabled }) {
  const lastShake = useRef(0);

  useEffect(() => {
    Accelerometer.setUpdateInterval(350);

    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      if (disabled) {
        return;
      }

      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();

      if (magnitude > SHAKE_THRESHOLD && now - lastShake.current > SHAKE_COOLDOWN_MS) {
        lastShake.current = now;
        onShake();
      }
    });

    return () => subscription.remove();
  }, [disabled, onShake]);

  return <Text style={{ color: "#93c5fd", fontWeight: "600" }}>Shake phone to trigger SOS</Text>;
}

export default ShakeDetector;
