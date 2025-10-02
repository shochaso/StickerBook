import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export function Gloss({ children }: PropsWithChildren) {
  return (
    <View style={styles.wrap}>
      {children}
      <LinearGradient
        colors={["rgba(255,255,255,0.0)", "rgba(255,255,255,0.7)", "rgba(255,255,255,0.0)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.sheen}
        pointerEvents="none"
      />
      <View pointerEvents="none" style={styles.speckle} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 20,
    overflow: "hidden"
  },
  sheen: {
    position: "absolute",
    left: -60,
    right: -60,
    top: -60,
    bottom: -60,
    transform: [{ rotate: "18deg" }],
    opacity: 0.5
  },
  speckle: {
    position: "absolute",
    inset: 0
  }
});
