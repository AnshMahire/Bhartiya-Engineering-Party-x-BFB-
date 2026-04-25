import { StyleSheet, Text, View } from "react-native";
import SOSButton from "../components/SOSButton";
import ShakeDetector from "../components/ShakeDetector";

function HomeScreen({ onSOS, onShake, loading, error }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Help</Text>
      <Text style={styles.subtitle}>Tap SOS or shake your phone to request an ambulance.</Text>

      <SOSButton onPress={onSOS} disabled={loading} />

      <View style={styles.shakeBox}>
        <ShakeDetector onShake={onShake} disabled={loading} />
      </View>

      {loading ? <Text style={styles.info}>Searching ambulance...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f172a"
  },
  title: {
    color: "#f8fafc",
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 8
  },
  subtitle: {
    color: "#cbd5e1",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 28
  },
  shakeBox: {
    marginTop: 20
  },
  info: {
    marginTop: 20,
    color: "#fde68a",
    fontSize: 16,
    fontWeight: "600"
  },
  error: {
    marginTop: 14,
    color: "#fca5a5",
    textAlign: "center"
  }
});

export default HomeScreen;
