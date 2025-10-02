import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Stickerbook",
  slug: "stickerbook",
  scheme: "stickerbook",
  version: "0.1.0",
  orientation: "portrait",
  platforms: ["ios", "android", "web"],
  experiments: {
    typedRoutes: true
  },
  extra: {
    story: "multi-platform"
  },
  updates: {
    url: "https://u.expo.dev/placeholder",
    enabled: false
  },
  plugins: [
    "expo-router",
    "expo-linear-gradient"
  ]
};

export default config;
