import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform
} from "motion/react";
import {
  Camera,
  ImageDown,
  Layers,
  Smartphone,
  Sparkles,
  Zap
} from "lucide-react";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

type HoloTiltCardProps = {
  image: string;
  alt?: string;
  size?: number;
  tiltStrength?: number;
  glossStrength?: number;
  saturation?: number; // 彩度 0.6-1.6
  noiseStrength?: number;
  gyro?: boolean;
  reduceMotion?: boolean;
};

function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefers(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return prefers;
}

function useDeviceOrientation(
  enabled: boolean,
  onChange: (x: number, y: number) => void
) {
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    const handler = (event: DeviceOrientationEvent) => {
      if (cancelled) return;
      const gamma = event.gamma ?? 0; // left/right
      const beta = event.beta ?? 0; // front/back
      // 感度を3倍に強化（45 → 15）、範囲も拡大（0.7 → 0.85）
      const x = clamp(gamma / 15, -0.85, 0.85);
      const y = clamp(beta / 15, -0.85, 0.85);
      onChange(x, y);
    };

    const start = async () => {
      try {
        if (
          typeof DeviceOrientationEvent !== "undefined" &&
          typeof DeviceOrientationEvent.requestPermission === "function"
        ) {
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission !== "granted") {
            cancelled = true;
            return;
          }
        }
      } catch {
        cancelled = true;
        return;
      }

      window.addEventListener("deviceorientation", handler);
    };

    start();

    return () => {
      cancelled = true;
      window.removeEventListener("deviceorientation", handler);
    };
  }, [enabled, onChange]);
}

export function HoloTiltCard({
  image,
  alt = "holographic sticker",
  size = 320,
  tiltStrength = 18, // ポケモンカード風に拡張
  glossStrength = 0.65,
  saturation = 1.1,
  noiseStrength = 0.35,
  gyro = false,
  reduceMotion = false
}: HoloTiltCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldReduceMotion = reduceMotion || prefersReducedMotion;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const press = useSpring(1, {
    stiffness: 420,
    damping: 28,
    mass: 0.35
  });

  const rotateXTarget = useTransform(pointerY, (value) => -value * tiltStrength);
  const rotateYTarget = useTransform(
    pointerX,
    (value) => value * (tiltStrength + 4)
  );
  const rotateX = useSpring(rotateXTarget, {
    stiffness: shouldReduceMotion ? 160 : 300,
    damping: shouldReduceMotion ? 35 : 22
  });
  const rotateY = useSpring(rotateYTarget, {
    stiffness: shouldReduceMotion ? 160 : 300,
    damping: shouldReduceMotion ? 35 : 22
  });

  const shadow = useTransform([pointerX, pointerY], ([x, y]) => {
    const offsetX = x * 18;
    const offsetY = y * 24;
    return `0 ${offsetY}px ${Math.max(28, 52 + Math.abs(x) * 20)}px rgba(15, 23, 42, 0.35)`;
  });

  const parallaxLargeX = useSpring(
    useTransform(pointerX, (value) => value * -16),
    { stiffness: 180, damping: 22 }
  );
  const parallaxLargeY = useSpring(
    useTransform(pointerY, (value) => value * -16),
    { stiffness: 180, damping: 22 }
  );
  const parallaxMediumX = useSpring(
    useTransform(pointerX, (value) => value * -10),
    { stiffness: 180, damping: 22 }
  );
  const parallaxMediumY = useSpring(
    useTransform(pointerY, (value) => value * -10),
    { stiffness: 180, damping: 22 }
  );
  const parallaxFineX = useSpring(
    useTransform(pointerX, (value) => value * -6),
    { stiffness: 220, damping: 24 }
  );
  const parallaxFineY = useSpring(
    useTransform(pointerY, (value) => value * -6),
    { stiffness: 220, damping: 24 }
  );

  const shimmer = useMotionValue(0);
  useAnimationFrame((time) => {
    if (shouldReduceMotion) {
      shimmer.set(0);
      return;
    }
    shimmer.set((time % 6000) / 6000);
  });

  const glossBackground = useTransform(
    [pointerX, pointerY, shimmer],
    ([x, y, progress]) => {
      const px = 50 + x * 45;
      const py = 40 + y * 40;
      const animatedAlpha = glossStrength * (0.8 + progress * 0.3);
      return `radial-gradient(160% 140% at ${px}% ${py}%, rgba(255,255,255,${animatedAlpha.toFixed(
        3
      )}), rgba(255,255,255,0) 62%)`;
    }
  );

  // Rainbow削除: 彩度はCSS filterで適用

  const noiseBackground = useTransform(shimmer, (progress) => {
    const offset = progress * 140;
    return `radial-gradient(circle at ${20 + offset}% ${30 + offset / 2}%, rgba(255,255,255,${noiseStrength * 0.45}), transparent 35%), radial-gradient(circle at ${70 - offset / 1.5}% ${80 - offset}% , rgba(255,255,255,${noiseStrength * 0.3}), transparent 40%)`;
  });

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
  }, [press, shouldReduceMotion]);

  const handlePointerUp = useCallback(() => {
    press.set(1);
  }, [press]);

  useEffect(() => {
    if (shouldReduceMotion) {
      pointerX.set(0);
      pointerY.set(0);
    }
  }, [pointerX, pointerY, shouldReduceMotion]);

  useDeviceOrientation(
    gyro && !shouldReduceMotion,
    useCallback(
      (x, y) => {
        pointerX.set(x);
        pointerY.set(y * -1);
      },
      [pointerX, pointerY]
    )
  );

  const sparkles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => ({
        id: index,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        scale: 0.6 + Math.random() * 0.9
      })),
    [image]
  );

  return (
    <div
      ref={containerRef}
      className="relative mx-auto touch-none"
      style={{ width: size, height: size * 1.35 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <motion.div
        className="relative w-full h-full rounded-[32px] overflow-hidden shadow-xl"
        style={{
          transformStyle: "preserve-3d",
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
          scale: shouldReduceMotion ? 1 : press,
          boxShadow: shadow
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            translateZ: shouldReduceMotion ? 0 : 2,
            x: parallaxLargeX,
            y: parallaxLargeY
          }}
        >
          <motion.img
            src={image}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
            style={{ filter: `saturate(${saturation})` }}
          />
        </motion.div>

        <motion.div
          className="absolute inset-[12%] rounded-[24px] border border-white/40"
          style={{
            translateZ: shouldReduceMotion ? 0 : 18,
            x: parallaxFineX,
            y: parallaxFineY,
            backdropFilter: "blur(0.5px)",
            opacity: 0.45
          }}
        />

        {/* Rainbow層を削除 - 彩度はimg filterで適用 */}

        <motion.div
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{
            translateZ: shouldReduceMotion ? 0 : 24,
            backgroundImage: glossBackground,
            opacity: shouldReduceMotion ? 0.2 : 1
          }}
        />

        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            translateZ: shouldReduceMotion ? 0 : 28,
            backgroundImage: noiseBackground,
            opacity: noiseStrength,
            mixBlendMode: "screen"
          }}
        />

        {!shouldReduceMotion && (
          <div className="absolute inset-0 pointer-events-none">
            {sparkles.map((sparkle) => (
              <motion.span
                key={sparkle.id}
                className="absolute rounded-full bg-white/70 shadow-[0_0_12px_rgba(255,255,255,0.65)]"
                style={{
                  width: `${sparkle.scale * 10}px`,
                  height: `${sparkle.scale * 10}px`,
                  left: `${sparkle.x}%`,
                  top: `${sparkle.y}%`
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, sparkle.scale, 0],
                  y: [0, -8, 0]
                }}
                transition={{
                  duration: 2.8 + sparkle.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: sparkle.delay
                }}
              />
            ))}
          </div>
        )}

        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.16),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.12),transparent_45%)]" />

        <div className="absolute inset-0 rounded-[32px] border border-white/60 [mask:linear-gradient(to_bottom,rgba(0,0,0,0.35),rgba(0,0,0,0.08)_20%,rgba(0,0,0,0.08)_80%,rgba(0,0,0,0.4))]" />
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 -bottom-12 h-16 bg-gradient-to-b from-purple-500/20 via-purple-500/8 to-transparent blur-2xl" />
    </div>
  );
}

interface HoloTiltPlaygroundProps {
  initialImage?: string;
}

export function HoloTiltPlayground({ initialImage }: HoloTiltPlaygroundProps) {
  const [imgSrc, setImgSrc] = useState(
    initialImage ||
    "https://images.unsplash.com/photo-1520975922284-c2c139bdf181?q=80&w=800&auto=format&fit=crop"
  );
  const [tiltStrength, setTiltStrength] = useState(18); // ±18°に拡張
  const [glossStrength, setGlossStrength] = useState(0.7);
  const [saturation, setSaturation] = useState(1.1);
  const [noiseStrength, setNoiseStrength] = useState(0.35);
  const [gyro, setGyro] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [size, setSize] = useState(320);
  const dropZoneRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialImage) {
      setImgSrc(initialImage);
    }
  }, [initialImage]);

  const readFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        setImgSrc(result);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        readFile(file);
      }
    },
    [readFile]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files?.[0];
      if (file) {
        readFile(file);
      }
    },
    [readFile]
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const resetImage = useCallback(() => {
    setImgSrc(
      initialImage ||
      "https://images.unsplash.com/photo-1520975922284-c2c139bdf181?q=80&w=800&auto=format&fit=crop"
    );
  }, [initialImage]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <label className="flex flex-col gap-2">
            <span className="flex items-center gap-2 font-medium text-purple-900 dark:text-purple-100">
              <Layers className="h-4 w-4" /> Tilt strength
            </span>
            <input
              type="range"
              min={6}
              max={24}
              step={1}
              value={tiltStrength}
              onChange={(event) => setTiltStrength(Number(event.target.value))}
              className="accent-purple-500"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="flex items-center gap-2 font-medium text-purple-900 dark:text-purple-100">
              <Sparkles className="h-4 w-4" /> Gloss
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={glossStrength}
              onChange={(event) =>
                setGlossStrength(Number(event.target.value))
              }
              className="accent-purple-500"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="flex items-center gap-2 font-medium text-purple-900 dark:text-purple-100">
              <Zap className="h-4 w-4" /> Saturation
            </span>
            <input
              type="range"
              min={0.6}
              max={1.6}
              step={0.05}
              value={saturation}
              onChange={(event) =>
                setSaturation(Number(event.target.value))
              }
              className="accent-purple-500"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="flex items-center gap-2 font-medium text-purple-900 dark:text-purple-100">
              <Camera className="h-4 w-4" /> Size
            </span>
            <input
              type="range"
              min={240}
              max={420}
              step={10}
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
              className="accent-purple-500"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={gyro}
              onChange={(event) => setGyro(event.target.checked)}
            />
            <span className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" /> Gyro follow
            </span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={reduceMotion}
              onChange={(event) => setReduceMotion(event.target.checked)}
            />
            <span>Reduce motion</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={noiseStrength > 0}
              onChange={(event) =>
                setNoiseStrength(event.target.checked ? 0.35 : 0)
              }
            />
            <span>Holo grain</span>
          </label>
        </div>
      </div>

      <div
        ref={dropZoneRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="rounded-2xl border border-dashed border-purple-300/70 dark:border-purple-600/60 bg-purple-50/40 dark:bg-purple-900/10 p-4 text-sm text-purple-800 dark:text-purple-100"
      >
        <div className="flex flex-col gap-3 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-purple-200/80 bg-white/70 px-4 py-2 text-purple-600 shadow-sm backdrop-blur dark:border-purple-600/60 dark:bg-purple-900/40 dark:text-purple-200">
              <ImageDown className="h-4 w-4" />
              <span>Upload image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={resetImage}
              className="inline-flex items-center gap-2 rounded-full border border-purple-200/70 px-4 py-2 text-purple-600 transition hover:border-purple-400 hover:text-purple-700 dark:border-purple-600/60 dark:text-purple-200"
            >
              Reset
            </button>
          </div>
          <p className="text-xs opacity-70">
            Drag & drop your sticker-book photo here. Motion reacts to imported images instantly.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <HoloTiltCard
          image={imgSrc}
          tiltStrength={tiltStrength}
          glossStrength={glossStrength}
          saturation={saturation}
          noiseStrength={noiseStrength}
          size={size}
          gyro={gyro}
          reduceMotion={reduceMotion}
        />
        <p className="max-w-xl text-center text-sm text-purple-900/80 dark:text-purple-100/70">
          マウスや指でカードをなぞると “ぷにっ” としたチルトと光沢が追従します。ジャイロをONにすると端末の傾きでも反応し、強度はスライダーでリアルタイムに調整できます。
        </p>
      </div>
    </div>
  );
}
