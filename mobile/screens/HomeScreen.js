import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import * as Speech from "expo-speech";
import { Entypo, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import SOSButton from "../components/SOSButton";
import ShakeDetector from "../components/ShakeDetector";
import useVoiceSOS from "../src/hooks/useVoiceSOS";
import VoiceSOSButton from "../src/components/VoiceSOSButton";
import CancelSlider from "../src/components/CancelSlider";

const { width } = Dimensions.get("window");

function HomeScreen({ onSOS, onShake, loading, error }) {
  const [showCancelOverlay, setShowCancelOverlay] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [pendingTrigger, setPendingTrigger] = useState(null);
  const countdownTimerRef = useRef(null);

  const clearCountdown = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }, []);

  const finalizeSOS = useCallback(() => {
    clearCountdown();
    setShowCancelOverlay(false);

    if (pendingTrigger === "shake") {
      onShake();
    } else {
      onSOS();
    }

    setPendingTrigger(null);
    setCountdown(5);
  }, [clearCountdown, onSOS, onShake, pendingTrigger]);

  const armCancelableSOS = useCallback((source) => {
    setPendingTrigger(source);
    setCountdown(5);
    setShowCancelOverlay(true);
  }, []);

  const cancelPendingSOS = useCallback(() => {
    clearCountdown();
    setShowCancelOverlay(false);
    setPendingTrigger(null);
    setCountdown(5);
    Speech.stop();
    Speech.speak("SOS Cancelled", { language: "en" });
  }, [clearCountdown]);

  const { isListening, startListening, stopListening } = useVoiceSOS({
    onVoiceDetected: () => armCancelableSOS("voice")
  });

  useEffect(() => {
    if (!showCancelOverlay) {
      return undefined;
    }

    clearCountdown();
    countdownTimerRef.current = setInterval(() => {
      setCountdown((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return clearCountdown;
  }, [clearCountdown, showCancelOverlay]);

  useEffect(() => {
    if (!showCancelOverlay) {
      return;
    }

    if (countdown === 0) {
      finalizeSOS();
    }
  }, [countdown, finalizeSOS, showCancelOverlay]);

  useEffect(() => {
    if (showCancelOverlay && isListening) {
      stopListening();
    }
  }, [isListening, showCancelOverlay, stopListening]);

  useEffect(() => {
    return () => {
      clearCountdown();
    };
  }, [clearCountdown]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <MaterialIcons name="menu" size={30} color="#c81e1e" />
        </TouchableOpacity>
        <Text style={styles.logoText}>RESQ</Text>
        <TouchableOpacity style={styles.avatarWrap}>
          <View style={styles.avatar} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.locationCard}>
          <View style={styles.locationIconCircle}>
            <MaterialIcons name="location-on" size={20} color="#c81e1e" />
          </View>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>Current Location</Text>
            <Text style={styles.locationValue}>Detecting location...</Text>
          </View>
          <TouchableOpacity>
            <Entypo name="dots-three-horizontal" size={20} color="#dc2626" />
          </TouchableOpacity>
        </View>

        <View style={styles.sosArea}>
          <View style={styles.sosOuter}>
            <SOSButton onPress={onSOS} disabled={loading} />
          </View>
          <View style={styles.shakeRow}>
            <MaterialCommunityIcons name="cellphone-sound" size={22} color="#4b5563" />
            <Text style={styles.shakeText}>Or Shake Your Phone to Trigger</Text>
          </View>
          <View style={styles.shakeDetectorWrap}>
            <ShakeDetector onShake={() => armCancelableSOS("shake")} disabled={loading || showCancelOverlay} />
          </View>
          <View style={styles.voiceButtonWrap}>
            <VoiceSOSButton
              isListening={isListening}
              onPress={startListening}
              disabled={loading || showCancelOverlay}
            />
          </View>
        </View>

        {loading ? <Text style={styles.info}>Searching ambulance...</Text> : null}

        <Text style={styles.sectionTitle}>What is the emergency?</Text>

        <View style={styles.grid}>
          <EmergencyCard icon="car-crash" label="Accident" />
          <EmergencyCard icon="heartbeat" label="Cardiac" />
          <EmergencyCard icon="fire" label="Fire" />
          <EmergencyCard icon="shield-alt" label="Security" />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItemActive}>
          <View style={styles.activeNavBg}>
            <FontAwesome5 name="asterisk" size={18} color="#c81e1e" />
            <Text style={styles.navLabelActive}>SOS</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="location-on" size={24} color="#6b7280" />
          <Text style={styles.navLabel}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <FontAwesome5 name="user" size={20} color="#6b7280" />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>

      {showCancelOverlay ? (
        <View style={styles.overlay}>
          <Text style={styles.overlayTitle}>Sending SOS in {countdown}s</Text>
          <Text style={styles.overlaySubtitle}>Slide below to cancel emergency trigger</Text>
          <CancelSlider onCancel={cancelPendingSOS} />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

function EmergencyCard({ icon, label }) {
  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardIconCircle}>
        <FontAwesome5 name={icon} size={20} color="#c81e1e" />
      </View>
      <Text style={styles.cardLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6"
  },
  header: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  logoText: {
    fontSize: 48 / 2,
    color: "#c81e1e",
    fontWeight: "800",
    letterSpacing: 1
  },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center"
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#000"
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120
  },
  locationCard: {
    marginTop: 24,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2
  },
  locationIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12
  },
  locationTextContainer: {
    flex: 1
  },
  locationLabel: {
    color: "#6b7280",
    fontSize: 14
  },
  locationValue: {
    color: "#111827",
    fontSize: 40 / 2,
    fontWeight: "500",
    marginTop: 2
  },
  sosArea: {
    marginTop: 40,
    alignItems: "center"
  },
  sosOuter: {
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: "#f1dddd",
    alignItems: "center",
    justifyContent: "center"
  },
  shakeRow: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  shakeText: {
    marginLeft: 8,
    fontSize: 20 / 2,
    color: "#4b5563",
    fontWeight: "500"
  },
  shakeDetectorWrap: {
    marginTop: 6
  },
  voiceButtonWrap: {
    marginTop: 14,
    width: "88%"
  },
  info: {
    marginTop: 12,
    textAlign: "center",
    color: "#92400e",
    fontWeight: "700"
  },
  sectionTitle: {
    marginTop: 52,
    marginBottom: 18,
    textAlign: "center",
    color: "#243047",
    fontSize: 42 / 2,
    fontWeight: "800"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },
  card: {
    width: (width - 52) / 2,
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eceff1"
  },
  cardIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10
  },
  cardLabel: {
    fontSize: 18 / 2,
    color: "#111827",
    fontWeight: "500"
  },
  error: {
    marginTop: 10,
    color: "#b91c1c",
    textAlign: "center"
  },
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 88,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 10
  },
  navItem: {
    alignItems: "center"
  },
  navItemActive: {
    alignItems: "center"
  },
  activeNavBg: {
    backgroundColor: "#fdf0f0",
    borderRadius: 14,
    paddingHorizontal: 26,
    paddingVertical: 8,
    alignItems: "center"
  },
  navLabel: {
    marginTop: 4,
    fontSize: 16 / 2,
    color: "#6b7280"
  },
  navLabelActive: {
    marginTop: 4,
    fontSize: 16 / 2,
    color: "#c81e1e",
    fontWeight: "700"
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(2, 6, 23, 0.92)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    zIndex: 999
  },
  overlayTitle: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center"
  },
  overlaySubtitle: {
    color: "#cbd5e1",
    marginTop: 10,
    marginBottom: 22,
    fontSize: 14,
    textAlign: "center"
  }
});

export default HomeScreen;
