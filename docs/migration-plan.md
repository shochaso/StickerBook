# Expo + React Native Web Migration Guide

## Objectives
- Deliver iOS / Android / Web from a single React Native codebase.
- Preserve current web UX while introducing high-FPS tactile effects (ぷにぷに / つるつる / きらきら).
- Keep marketing/SSR pages independent so SEO and acquisition remain unaffected.

## Monorepo Layout (pnpm + Turbo)
```
stickerbook/
  apps/
    mobile/       # Expo Router app (React Native + react-native-web)
    site/         # Existing Vite site / playground
  packages/
    ui/           # RN-first component primitives (Squishy, Tilt, Gloss, Sparkle...)
    theme/        # Design tokens + ThemeProvider that works on native + web
    core/         # Domain logic, sticker models, heavy processing entrypoint
  pnpm-workspace.yaml
  turbo.json
  tsconfig.base.json
```
- `pnpm-workspace.yaml` wires all apps/packages.
- `turbo.json` defines `build`, `dev`, `lint`, `typecheck` pipelines so `pnpm turbo <task>` fans out across workspaces.
- `tsconfig.base.json` centralises strict settings + path aliases (`@sticker/*`).

## App Targets
### `apps/mobile` (Expo)
- Expo SDK 51 (`expo-router`, `react-native-reanimated`, `react-native-gesture-handler`, `@shopify/react-native-skia`, `lottie-react-native`, `expo-sensors`, `expo-haptics`).
- `babel.config.js` resolves shared packages + enables Reanimated + Router plugins.
- `metro.config.js` is monorepo-aware (watches workspace root, disables hierarchical lookup).
- `app/_layout.tsx` wraps `Stack` with `ThemeProvider` and standardises status bar look.
- `app/index.tsx` showcases `StickerCard` grid + CTA.

### `apps/site` (Vite)
- Keeps existing marketing / design system assets.
- Adds `ThemeProvider` wrapper so tokens match mobile.
- Vite aliases map `@sticker/*` to package sources for instantaneous preview.

## Shared Packages
- `packages/theme`: exports tokens (`colors`, `radius`, `shadow`, `motion`) and a platform-neutral `ThemeProvider`/`useTheme` hook.
- `packages/ui`: Squishy press feedback, Gloss sheen, Tilt 3D spring, Sparkle Skia emitter, StickerCard composition; all React Native primitives.
- `packages/core`: Sticker types + helpers (grouping, tag filters, factory). Entry point for future heavy logic (WASM, native modules).

Each package has `build/typecheck` scripts (`tsc`) so Turbo can cache artefacts or emit declarations when needed.

## Migration Steps
1. **Extract shared logic** – move reusable business rules into `packages/core`.
2. **Tokenise styles** – port color/typography/motion decisions into `packages/theme`.
3. **Rewrite UI primitives** – convert DOM-centric components to RN primitives within `packages/ui`.
4. **Recompose screens** – rebuild flows (capture → select → edit → album) under `apps/mobile/app/` using Expo Router segments.
5. **Layer tactile effects** – wire Reanimated springs, Skia sparkles, Lottie gloss; expose tuning knobs via `packages/ui` props.
6. **Web roll-out** – run `pnpm --filter @sticker/mobile web` to validate react-native-web output, optimise with memoisation, FlatList, asset sizing.
7. **Native enhancements** – add haptics, gyroscope tilt, GPU shaders per platform once stable.

## Performance Guardrails
- Keep animations on the UI thread (`useSharedValue` + worklets).
- Stick to `transform`/`opacity` mutations; avoid layout thrash.
- Optimise textures (1024–2048px WebP/HEIC) and prefer `expo-image` for decoding.
- Tune spring params to settle within 0.8s; highlight follow time ≤100ms.
- Provide accessibility toggles for gloss/tilt intensity + haptics opt-out.

## Tilt / Holographic Effect Notes
- `Tilt` component handles pointer & touch; `scale` + `rotateX/Y` respond within 80–120ms.
- Future: add sensor-driven parallax (`expo-sensors`) and layered specular maps (Skia) fed by `Sparkle` emitter.
- Shadow + sheen respond to angle for the Pokemon-card-style depth.

## Daily Commands
```bash
# install
pnpm install

# expo dev (native/web)
pnpm --filter @sticker/mobile dev

# site dev server
pnpm --filter @sticker/site dev

# type-check everything
pnpm typecheck
```

This repo now acts as the implementation template for migrating the existing React web app into a single Expo-powered, multi-platform experience.

## 15. 立体ホロTilt効果（ポケモンカード風）

- **目的**: 指の置き方や端末の傾きに応じて、立体感と光の反射が変化するカード体験を再現する。
- **挙動要件**: 3Dチルト、ジャイロ連動、光沢ハイライト／擬似ホログラム、レイヤーごとのパララックス、スプリング収束アニメーションを組み合わせる。
- **実装案**: Web は `react-spring` + CSS カスタムプロパティでチルト／光沢を制御。Expo / React Native は `react-native-reanimated` + `@shopify/react-native-skia` + `expo-sensors` で傾きとホログラムを描画する。
- **パフォーマンス要件**: `transform` / `opacity` を中心に更新し、目標 60fps（最低 30fps）を維持。メインスレッドのブロッキングを避け、必要なら worklet／Skia レイヤーにオフロードする。
- **アクセシビリティ**: 強い明滅を避け、設定画面からエフェクト強度調整と無効化が可能なトグルを提供する。
- **受け入れ基準**: 入力追従 100ms 以内、エフェクトの収束 0.8s 以内、実行中フレームレート 30fps 以上、設定で強度変更／オフ切り替えができること。
