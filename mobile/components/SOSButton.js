import { StyleSheet, Text, TouchableOpacity } from "react-native";

function SOSButton({ onPress, disabled }) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.label}>SOS</Text>
      <Text style={styles.subLabel}>{disabled ? "Requesting..." : "Tap for emergency"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 12
  },
  disabled: {
    opacity: 0.6
  },
  label: {
    color: "white",
    fontSize: 56,
    fontWeight: "900",
    lineHeight: 64
  },
  subLabel: {
    color: "#fee2e2",
    fontWeight: "700",
    marginTop: 8
  }
});

export default SOSButton;
