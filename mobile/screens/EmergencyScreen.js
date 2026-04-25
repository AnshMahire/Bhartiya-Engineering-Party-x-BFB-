import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

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
  const etaText = emergency?.eta === 0 ? "Arrived" : `${emergency?.eta ?? "-"} mins`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RESQ</Text>
        <View style={styles.liveBadge}>
          <MaterialCommunityIcons name="pulse" size={14} color="#b91c1c" />
          <Text style={styles.liveBadgeText}>LIVE</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Emergency Live Status</Text>
        <View style={styles.statusPill}>
          <Text style={styles.status}>{statusText}</Text>
        </View>

        <View style={styles.etaCard}>
          <View>
            <Text style={styles.etaLabel}>Estimated Arrival</Text>
            <Text style={styles.etaValue}>{etaText}</Text>
          </View>
          <View style={styles.etaIconWrap}>
            <MaterialIcons name="access-time-filled" size={24} color="#b91c1c" />
          </View>
        </View>

        {emergency?.requestId && (
          <>
            <InfoCard
              title="Ambulance"
              icon={<FontAwesome5 name="ambulance" size={16} color="#b91c1c" />}
              rows={[
                { label: "ID", value: emergency.ambulance.id },
                { label: "Driver", value: emergency.ambulance.driverName },
                { label: "Status", value: emergency.ambulance.status }
              ]}
            />

            <InfoCard
              title="Hospital"
              icon={<MaterialIcons name="local-hospital" size={18} color="#b91c1c" />}
              rows={[
                { label: "Name", value: emergency.hospital.name },
                { label: "Available Beds", value: emergency.hospital.beds },
                { label: "Available ICU", value: emergency.hospital.icu },
                { label: "Bed Confirmed", value: emergency.hospital.confirmed ? "Yes" : "Pending" }
              ]}
            />

            <InfoCard
              title="Patient"
              icon={<FontAwesome5 name="user-alt" size={14} color="#b91c1c" />}
              rows={[
                { label: "Name", value: emergency.patient.name },
                { label: "Status", value: emergency.patient.status },
                { label: "Request ID", value: emergency.requestId }
              ]}
            />
          </>
        )}

        {emergency?.emergencyStatus === "completed" && (
          <View style={styles.successWrap}>
            <MaterialIcons name="check-circle" size={20} color="#16a34a" />
            <Text style={styles.success}>Patient reached hospital successfully</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={onBack}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function InfoCard({ title, icon, rows }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIcon}>{icon}</View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>

      {rows.map((row) => (
        <View key={`${title}-${row.label}`} style={styles.row}>
          <Text style={styles.rowLabel}>{row.label}</Text>
          <Text style={styles.rowValue}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6"
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#c81e1e",
    letterSpacing: 1
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fee2e2",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  liveBadgeText: {
    color: "#b91c1c",
    fontWeight: "700",
    fontSize: 12,
    marginLeft: 4
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    paddingBottom: 110
  },
  heading: {
    color: "#1f2937",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center"
  },
  statusPill: {
    alignSelf: "center",
    backgroundColor: "#fff1f2",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 16
  },
  status: {
    color: "#9f1239",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 14
  },
  etaCard: {
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eceff1",
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  etaLabel: {
    color: "#6b7280",
    fontSize: 13
  },
  etaValue: {
    marginTop: 2,
    color: "#b91c1c",
    fontSize: 24,
    fontWeight: "800"
  },
  etaIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fee2e2",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#eceff1",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  cardIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8
  },
  cardTitle: {
    color: "#111827",
    fontWeight: "700",
    fontSize: 16
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4
  },
  rowLabel: {
    color: "#6b7280",
    fontSize: 14
  },
  rowValue: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
    maxWidth: "58%",
    textAlign: "right"
  },
  successWrap: {
    marginTop: 4,
    borderRadius: 12,
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  success: {
    marginLeft: 8,
    color: "#166534",
    fontSize: 14,
    fontWeight: "700"
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 18,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb"
  },
  button: {
    backgroundColor: "#c81e1e",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center"
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700"
  }
});

export default EmergencyScreen;
