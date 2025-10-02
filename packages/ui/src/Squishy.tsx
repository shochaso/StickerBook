import { PropsWithChildren } from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated";

export type SquishyProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function Squishy({ children, style }: SquishyProps) {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const animatedCard = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(scale.value, { damping: 12, stiffness: 240 }) },
      { rotateZ: `${rotate.value}deg` }
    ]
  }));

  const onPressIn = () => {
    scale.value = 0.94;
    rotate.value = -2;
  };

  const onPressOut = () => {
    scale.value = 1;
    rotate.value = 0;
  };

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} style={[styles.container, style]}>
      <Animated.View style={[styles.card, animatedCard]}>{children}</Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20
  },
  card: {
    borderRadius: 20,
    overflow: "hidden"
  }
});
