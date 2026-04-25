import { useMemo, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";

const KNOB_SIZE = 52;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function CancelSlider({ onCancel, disabled, label = "Slide to Cancel SOS" }) {
  const [trackWidth, setTrackWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const dragStart = useRef(0);

  const maxSlide = useMemo(() => Math.max(trackWidth - KNOB_SIZE - 8, 1), [trackWidth]);
  const threshold = useMemo(() => maxSlide * 0.72, [maxSlide]);

  const handleLayout = (event) => {
    const width = event.nativeEvent.layout.width;
    setTrackWidth(width);
  };

  const resetToStart = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0
    }).start();
  };

  const onGestureEvent = (event) => {
    if (disabled) {
      return;
    }

    const next = clamp(dragStart.current + event.nativeEvent.translationX, 0, maxSlide);
    translateX.setValue(next);
  };

  const onHandlerStateChange = (event) => {
    if (disabled) {
      return;
    }

    const currentX = clamp(dragStart.current + event.nativeEvent.translationX, 0, maxSlide);

    if (event.nativeEvent.state === State.ACTIVE) {
      translateX.setValue(currentX);
      return;
    }

    if (event.nativeEvent.oldState === State.ACTIVE) {
      if (currentX >= threshold) {
        Animated.timing(translateX, {
          toValue: maxSlide,
          duration: 120,
          useNativeDriver: true
        }).start(() => {
          dragStart.current = 0;
          translateX.setValue(0);
          if (typeof onCancel === "function") {
            onCancel();
          }
        });
        return;
      }

      dragStart.current = 0;
      resetToStart();
    }
  };

  return (
    <View style={[styles.container, disabled && styles.disabled]} onLayout={handleLayout}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.track}>
        <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
          <Animated.View style={[styles.knob, { transform: [{ translateX }] }]}>
            <MaterialIcons name="keyboard-double-arrow-right" size={22} color="#ffffff" />
          </Animated.View>
        </PanGestureHandler>
        <View style={styles.hintWrap} pointerEvents="none">
          <Text style={styles.hint}>Slide right to cancel</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%"
  },
  disabled: {
    opacity: 0.6
  },
  label: {
    color: "#f9fafb",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center"
  },
  track: {
    height: 60,
    borderRadius: 30,
    backgroundColor: "#334155",
    borderWidth: 1,
    borderColor: "#475569",
    justifyContent: "center",
    paddingHorizontal: 4,
    overflow: "hidden"
  },
  knob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2
  },
  hintWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center"
  },
  hint: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "600"
  }
});

export default CancelSlider;
