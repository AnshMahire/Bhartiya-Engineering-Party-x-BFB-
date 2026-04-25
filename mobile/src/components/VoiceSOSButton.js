import { useEffect, useMemo, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function VoiceSOSButton({ isListening, onPress, disabled }) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isListening) {
      pulse.stopAnimation();
      pulse.setValue(1);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.14, duration: 550, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 550, useNativeDriver: true })
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [isListening, pulse]);

  const listeningText = useMemo(
    () => (isListening ? "Listening for: help / sos / emergency" : "Start Voice SOS"),
    [isListening]
  );

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.9}
    >
      <Animated.View style={[styles.iconWrap, { transform: [{ scale: pulse }] }]}>
        <MaterialCommunityIcons name={isListening ? "microphone" : "microphone-outline"} size={24} color="#fff" />
      </Animated.View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>Voice SOS</Text>
        <Text style={styles.subtitle}>{listeningText}</Text>
      </View>
      {isListening ? <View style={styles.dot} /> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    backgroundColor: "#1f2937",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center"
  },
  disabled: {
    opacity: 0.6
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#dc2626",
    alignItems: "center",
    justifyContent: "center"
  },
  textWrap: {
    flex: 1,
    marginLeft: 12
  },
  title: {
    color: "#f9fafb",
    fontSize: 15,
    fontWeight: "700"
  },
  subtitle: {
    color: "#cbd5e1",
    fontSize: 12,
    marginTop: 2
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#22c55e"
  }
});

export default VoiceSOSButton;
