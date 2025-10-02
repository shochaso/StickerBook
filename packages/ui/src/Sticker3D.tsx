/**
 * Sticker3D - ポケモンカード風3Dステッカーコンポーネント
 * 
 * 機能:
 * - 大きめの傾き（±18°）
 * - 内側ハイライト（角度に追従）
 * - 外側シャドウ（角度に追従）
 * - パララックス（複数レイヤー）
 * - ハプティクスフィードバック
 * - CardFXProfile対応
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import { CardFXProfile, PokemonCardLike } from '@sticker/theme';

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export type Sticker3DProps = {
  image: string;
  alt?: string;
  size?: number;
  profile?: CardFXProfile;
  gyro?: boolean;
  reduceMotion?: boolean;
  onPress?: () => void;
  className?: string;
};

function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefers(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return prefers;
}

function triggerHapticFeedback(type: 'light' | 'medium' | 'heavy' = 'light') {
  // Web Vibration API（対応ブラウザのみ）
  if ('vibrate' in navigator) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30,
    };
    navigator.vibrate(patterns[type]);
  }
}

export function Sticker3D({
  image,
  alt = 'sticker',
  size = 320,
  profile = PokemonCardLike,
  gyro = false,
  reduceMotion = false,
  onPress,
  className = '',
}: Sticker3DProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldReduceMotion = reduceMotion || prefersReducedMotion;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  // Spring設定
  const springConfig = {
    stiffness: profile.tilt.spring.stiffness,
    damping: profile.tilt.spring.damping,
    mass: profile.tilt.spring.mass,
  };

  // Tilt変換
  const rotateXTarget = useTransform(
    pointerY,
    (value) => -value * profile.tilt.maxDegX
  );
  const rotateYTarget = useTransform(
    pointerX,
    (value) => value * profile.tilt.maxDegY
  );

  const rotateX = useSpring(rotateXTarget, {
    stiffness: shouldReduceMotion ? 160 : springConfig.stiffness,
    damping: shouldReduceMotion ? 35 : springConfig.damping,
    mass: springConfig.mass,
  });

  const rotateY = useSpring(rotateYTarget, {
    stiffness: shouldReduceMotion ? 160 : springConfig.stiffness,
    damping: shouldReduceMotion ? 35 : springConfig.damping,
    mass: springConfig.mass,
  });

  // Z-lift（押下時）
  const press = useSpring(1, {
    stiffness: 420,
    damping: 28,
    mass: 0.35,
  });

  const translateZ = useTransform(
    press,
    (p) => (1 - p) * -profile.tilt.zLift
  );

  // Shadow（角度に追従）
  const shadow = useTransform([pointerX, pointerY, press], ([x, y, p]) => {
    const baseOffsetX = profile.shadow.offsetX;
    const baseOffsetY = profile.shadow.offsetY;
    const dynamicOffsetX = baseOffsetX + x * 20;
    const dynamicOffsetY = baseOffsetY + y * 28 + (1 - p) * 4;
    const blur = profile.shadow.blur + Math.abs(x) * 8;
    const opacity = profile.shadow.opacity * p;
    return `${dynamicOffsetX}px ${dynamicOffsetY}px ${blur}px rgba(15, 23, 42, ${opacity})`;
  });

  // パララックスレイヤー
  const parallaxDepth = profile.parallax.depthPx;
  const parallaxX = useSpring(
    useTransform(pointerX, (value) => value * -parallaxDepth),
    { stiffness: 180, damping: 22 }
  );
  const parallaxY = useSpring(
    useTransform(pointerY, (value) => value * -parallaxDepth),
    { stiffness: 180, damping: 22 }
  );

  // Gloss/Specular（ポインタ追従）
  const glossBackground = useTransform([pointerX, pointerY], ([x, y]) => {
    const px = 50 + x * 45;
    const py = 40 + y * 40;
    const radius = profile.gloss.radiusPx;
    const intensity = profile.gloss.intensity;
    return `radial-gradient(${radius}px ${radius}px at ${px}% ${py}%, rgba(255,255,255,${intensity}), rgba(255,255,255,0) 62%)`;
  });

  const specularBackground = useTransform([pointerX, pointerY], ([x, y]) => {
    const px = 50 + x * 35;
    const py = 50 + y * 35;
    const intensity = profile.specular.intensity;
    const falloff = profile.specular.falloff;
    return `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,${intensity}), rgba(255,255,255,0) ${falloff * 100}%)`;
  });

  // ポインタハンドラ
  const handlePointer = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;
      pointerX.set(clamp(x, -0.65, 0.65));
      pointerY.set(clamp(y, -0.65, 0.65));
    },
    [pointerX, pointerY]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (shouldReduceMotion) return;
      handlePointer(event.clientX, event.clientY);
    },
    [handlePointer, shouldReduceMotion]
  );

  const resetPointer = useCallback(() => {
    pointerX.set(0);
    pointerY.set(0);
    press.set(1);
  }, [pointerX, pointerY, press]);

  const handlePointerLeave = useCallback(() => {
    resetPointer();
  }, [resetPointer]);

  const handlePointerDown = useCallback(() => {
    if (shouldReduceMotion) return;
    press.set(0.94);
    if (profile.haptics.onPress) {
      triggerHapticFeedback('light');
    }
    onPress?.();
  }, [press, shouldReduceMotion, profile.haptics, onPress]);

  const handlePointerUp = useCallback(() => {
    press.set(1);
    if (profile.haptics.onDrop) {
      triggerHapticFeedback('medium');
    }
  }, [press, profile.haptics]);

  useEffect(() => {
    if (shouldReduceMotion) {
      pointerX.set(0);
      pointerY.set(0);
    }
  }, [pointerX, pointerY, shouldReduceMotion]);

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto touch-none ${className}`}
      style={{ width: size, height: size * 1.35 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <motion.div
        className="relative w-full h-full rounded-[32px] overflow-hidden"
        style={{
          transformStyle: 'preserve-3d',
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
          scale: shouldReduceMotion ? 1 : press,
          translateZ: shouldReduceMotion ? 0 : translateZ,
          boxShadow: profile.shadow.enabled ? shadow : 'none',
        }}
      >
        {/* 背景画像（パララックス） */}
        <motion.div
          className="absolute inset-0"
          style={{
            translateZ: shouldReduceMotion ? 0 : 2,
            x: parallaxX,
            y: parallaxY,
          }}
        >
          <motion.img
            src={image}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
            style={{
              filter: `saturate(${profile.saturation.default})`,
            }}
          />
        </motion.div>

        {/* 内側ボーダー（深度感） */}
        <motion.div
          className="absolute inset-[12%] rounded-[24px] border border-white/40"
          style={{
            translateZ: shouldReduceMotion ? 0 : 18,
            backdropFilter: 'blur(0.5px)',
            opacity: 0.45,
          }}
        />

        {/* スペキュラハイライト（鏡面反射） */}
        <motion.div
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{
            translateZ: shouldReduceMotion ? 0 : 22,
            backgroundImage: specularBackground,
            opacity: shouldReduceMotion ? 0.1 : 1,
          }}
        />

        {/* グロス（光沢帯） */}
        <motion.div
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{
            translateZ: shouldReduceMotion ? 0 : 24,
            backgroundImage: glossBackground,
            opacity: shouldReduceMotion ? 0.2 : 1,
          }}
        />

        {/* エッジハイライト（内側） */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            translateZ: shouldReduceMotion ? 0 : 26,
            background: useTransform([pointerX, pointerY], ([x, y]) => {
              const angle = Math.atan2(y, x);
              const deg = (angle * 180) / Math.PI + 90;
              return `linear-gradient(${deg}deg, rgba(255,255,255,0.15) 0%, transparent 40%)`;
            }),
            opacity: 0.6,
          }}
        />
      </motion.div>
    </div>
  );
}

