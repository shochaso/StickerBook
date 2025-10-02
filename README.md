# Stickerbook Monorepo

Expo + React Native Web workspace that keeps mobile and marketing web surfaces in sync while sharing the same sticker UI DNA.

## Structure
- `apps/mobile` – Expo Router app (iOS / Android / Web) with high-FPS sticker interactions.
- `apps/site` – existing Vite playground/landing that now consumes shared packages.
- `packages/theme` – design tokens + lightweight theme context.
- `packages/ui` – React Native primitives (Squishy, Gloss, Tilt, StickerCard, Sparkle).
- `packages/core` – domain types and sticker helpers.

## Getting Started
1. Install pnpm `npm install -g pnpm` (once per machine).
2. Install deps `pnpm install` (Turbo caches per package).
3. Mobile dev server `pnpm --filter @sticker/mobile dev`.
4. Web playground `pnpm --filter @sticker/site dev`.
5. Type-check everything `pnpm typecheck`.

## Key Tech Decisions
- **Single source of truth**: RN-first primitives render on native + web via `react-native-web`.
- **Animation stack**: Reanimated-driven Squishy/Tilt spring effects, Skia Sparkle emitter, Expo Sensors reserved for device tilt.
- **Theming**: `ThemeProvider` bridges Expo + DOM, exposing tokens for RN and traditional CSS.
- **Build tooling**: pnpm + Turbo keeps app/package builds isolated while supporting incremental adoption.

## Next Steps
- Flesh out image editing + heavy processing inside `packages/core` (WASM or native module).
- Expand `packages/ui` catalog (editor surfaces, controls) alongside accessibility toggles for tilt/gloss intensity.
- Wire Expo Sensors + Haptics in `apps/mobile` once device testing is ready.
