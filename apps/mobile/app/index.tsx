import { StickerCard } from "@sticker/ui";
import { colors } from "@sticker/theme";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const SAMPLE_URI = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200";

export default function HomeScreen() {
  const cards = useMemo(() => Array.from({ length: 6 }), []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Stickerbook Playground</Text>
      <View style={styles.grid}>
        {cards.map((_, index) => (
          <StickerCard key={index} uri={`${SAMPLE_URI}&t=${index}`} size={160} />
        ))}
      </View>
      <Pressable style={styles.cta}>
        <Text style={styles.ctaText}>Add new sticker</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    paddingBottom: 120,
    alignItems: "center",
    backgroundColor: colors.surface,
    gap: 32
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.primary
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 24
  },
  cta: {
    marginTop: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 999,
    backgroundColor: colors.primary
  },
  ctaText: {
    color: colors.surface,
    fontWeight: "600"
  }
});
