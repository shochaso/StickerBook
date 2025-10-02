import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect
} from "react";
import { colors, motion, radius, shadow } from "./tokens";

export type ThemeScheme = "light" | "dark";

export type Theme = {
  scheme: ThemeScheme;
  colors: typeof colors;
  radius: typeof radius;
  shadow: typeof shadow;
  motion: typeof motion;
};

const ThemeContext = createContext<Theme | null>(null);

const resolveColors = (scheme: ThemeScheme) => {
  if (scheme === "dark") {
    return {
      ...colors,
      surface: colors.surfaceDark,
      text: "#F8F9FF"
    } as typeof colors;
  }

  return {
    ...colors,
    text: colors.text
  } as typeof colors;
};

const getPreferredScheme = (): ThemeScheme => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export function ThemeProvider({ children, scheme }: PropsWithChildren<{ scheme?: ThemeScheme }>) {
  const [effectiveScheme, setEffectiveScheme] = useState<ThemeScheme>(() => scheme ?? getPreferredScheme());

  useEffect(() => {
    if (scheme) {
      setEffectiveScheme(scheme);
      return;
    }

    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (event: MediaQueryListEvent | MediaQueryListEventMap["change"] | MediaQueryList) => {
      const matches = "matches" in event ? event.matches : mediaQuery.matches;
      setEffectiveScheme(matches ? "dark" : "light");
    };

    listener(mediaQuery);

    if ("addEventListener" in mediaQuery) {
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }

    mediaQuery.addListener(listener as (this: MediaQueryList, ev: MediaQueryListEvent) => void);
    return () => mediaQuery.removeListener(listener as (this: MediaQueryList, ev: MediaQueryListEvent) => void);
  }, [scheme]);

  const value = useMemo<Theme>(() => {
    return {
      scheme: effectiveScheme,
      colors: resolveColors(effectiveScheme),
      radius,
      shadow,
      motion
    };
  }, [effectiveScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return ctx;
}
