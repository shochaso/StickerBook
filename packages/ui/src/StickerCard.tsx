import { Image, StyleSheet } from "react-native";
import { Gloss } from "./Gloss";
import { Squishy } from "./Squishy";
import { Tilt } from "./Tilt";

export type StickerCardProps = {
  uri: string;
  size?: number;
};

export function StickerCard({ uri, size = 160 }: StickerCardProps) {
  return (
    <Tilt>
      <Squishy style={{ width: size, height: size }}>
        <Gloss>
          <Image
            source={{ uri }}
            style={[styles.image, { width: size, height: size }]}
            resizeMode="cover"
          />
        </Gloss>
      </Squishy>
    </Tilt>
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 20
  }
});
