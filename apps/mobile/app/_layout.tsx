import { Stack } from "expo-router";
import { ThemeProvider } from "@sticker/theme";
import { useEffect } from "react";
import { setStatusBarStyle } from "expo-status-bar";

export default function RootLayout() {
  useEffect(() => {
    setStatusBarStyle("light");
  }, []);

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
