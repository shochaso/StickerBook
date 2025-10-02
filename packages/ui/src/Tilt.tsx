import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  ViewStyle
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from "react-native-reanimated";

export type TiltProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

type LayoutEvent = NativeSyntheticEvent<{ layout: { width: number; height: number } }>;
type MoveEvent = NativeSyntheticEvent<{ locationX: number; locationY: number }>;

export function Tilt({ children, style }: TiltProps) {
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const [size, setSize] = useState({ width: 200, height: 200 });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { rotateX: `${rotateX.value}deg` },
      { rotateY: `${rotateY.value}deg` },
      { scale: scale.value }
    ],
    shadowColor: "#000",
    shadowOffset: { width: rotateY.value * 2, height: rotateX.value * -2 },
    shadowOpacity: 0.25,
    shadowRadius: 16
  }));

  const reset = useCallback(() => {
    rotateX.value = withTiming(0, { duration: 120 });
    rotateY.value = withTiming(0, { duration: 120 });
    scale.value = withSpring(1, { damping: 12, stiffness: 220 });
  }, [rotateX, rotateY, scale]);

  const handleMove = useCallback(
    (event: MoveEvent) => {
      const { locationX, locationY } = event.nativeEvent;
      const centerX = size.width / 2;
      const centerY = size.height / 2;
      const deltaX = ((locationX - centerX) / centerX) * 1.1;
      const deltaY = ((locationY - centerY) / centerY) * 1.1;

      rotateX.value = withTiming(deltaY * -10, { duration: 80 });
      rotateY.value = withTiming(deltaX * 12, { duration: 80 });
      scale.value = withSpring(1.02, { damping: 15, stiffness: 250 });
    },
    [rotateX, rotateY, scale, size.height, size.width]
  );

  const handleLayout = useCallback((event: LayoutEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  }, []);

  return (
    <Animated.View
      onLayout={handleLayout}
      onTouchEnd={reset}
      onTouchCancel={reset}
      onMouseLeave={reset as never}
      onTouchMove={handleMove as never}
      onMouseMove={handleMove as never}
      style={[styles.base, style, animatedStyle]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 20
  }
});
