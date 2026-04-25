import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const STATUS_COPY = {
  ambulance_assigned: "Ambulance assigned",
  driver_enroute: "Driver accepted and is on the way",
  driver_arriving: "Driver arriving",
  awaiting_pickup: "Ambulance reached patient location",
  enroute_hospital: "On the way to hospital",
  completed: "Reached hospital"
};

function EmergencyScreen({ emergency, onBack }) {
  const statusText = emergency
    ? STATUS_COPY[emergency.emergencyStatus] || emergency.emergencyStatus
    : "Searching ambulance...";

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Emergency Live Status</Text>
      <Text style={styles.status}>{statusText}</Text>

      {emergency?.requestId && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ambulance</Text>
          <Text style={styles.text}>ID: {emergency.ambulance.id}</Text>
          <Text style={styles.text}>Driver: {emergency.ambulance.driverName}</Text>
          <Text style={styles.text}>ETA: {emergency.eta === 0 ? "Arrived" : `${emergency.eta} mins`}</Text>
          <Text style={styles.text}>Status: {emergency.ambulance.status}</Text>

          <Text style={[styles.cardTitle, { marginTop: 14 }]}>Hospital</Text>
          <Text style={styles.text}>{emergency.hospital.name}</Text>
          <Text style={styles.text}>Beds: {emergency.hospital.beds} | ICU: {emergency.hospital.icu}</Text>
          <Text style={styles.text}>Bed Confirmed: {emergency.hospital.confirmed ? "Yes" : "Pending"}</Text>

          <Text style={[styles.cardTitle, { marginTop: 14 }]}>Patient</Text>
          <Text style={styles.text}>Name: {emergency.patient.name}</Text>
          <Text style={styles.text}>Status: {emergency.patient.status}</Text>
        </View>
      )}

      {emergency?.emergencyStatus === "completed" && (
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
