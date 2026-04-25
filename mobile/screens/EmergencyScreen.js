import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const STATUS_COPY = {
  ambulance_assigned: "Ambulance assigned",
  driver_arriving: "Driver arriving",
  patient_picked: "Patient picked up",
  to_hospital: "On the way to hospital",
  reached_hospital: "Reached hospital"
};

function EmergencyScreen({ emergency, onBack }) {
  const statusText = emergency ? STATUS_COPY[emergency.status] || emergency.statusMessage : "Searching ambulance...";

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Emergency Live Status</Text>
      <Text style={styles.status}>{statusText}</Text>

      {emergency && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ambulance</Text>
          <Text style={styles.text}>ID: {emergency.ambulance.id}</Text>
          <Text style={styles.text}>Driver: {emergency.ambulance.driverName}</Text>
          <Text style={styles.text}>ETA: {emergency.eta === 0 ? "Arrived" : `${emergency.eta} mins`}</Text>

          <Text style={[styles.cardTitle, { marginTop: 14 }]}>Hospital</Text>
          <Text style={styles.text}>{emergency.hospital.name}</Text>
          <Text style={styles.text}>Beds: {emergency.hospital.beds} | ICU: {emergency.hospital.icu}</Text>
        </View>
      )}

      {emergency?.status === "reached_hospital" && (
        <Text style={styles.success}>Patient reached hospital successfully</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={onBack}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 24,
    justifyContent: "center"
  },
  heading: {
    color: "#f8fafc",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center"
  },
  status: {
    color: "#fcd34d",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
    fontSize: 18
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 18
  },
  cardTitle: {
    color: "#e2e8f0",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 6
  },
  text: {
    color: "#cbd5e1",
    marginBottom: 2,
    fontSize: 15
  },
  success: {
    marginTop: 20,
    textAlign: "center",
    color: "#86efac",
    fontSize: 16,
    fontWeight: "700"
  },
  button: {
    marginTop: 26,
    alignSelf: "center",
    backgroundColor: "#ef4444",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12
  },
  buttonText: {
    color: "white",
    fontWeight: "700"
  }
});

export default EmergencyScreen;
