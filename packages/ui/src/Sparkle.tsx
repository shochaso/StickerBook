import { useEffect, useState } from "react";
import { Canvas, Circle, Group, useTouchHandler } from "@shopify/react-native-skia";

export type SparkleProps = {
  width: number;
  height: number;
};

type Particle = {
  x: number;
  y: number;
  life: number;
};

export function Sparkle({ width, height }: SparkleProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  const touchHandler = useTouchHandler({
    onStart: (event) => {
      const created = Array.from({ length: 12 }).map(() => ({
        x: event.x + (Math.random() - 0.5) * 24,
        y: event.y + (Math.random() - 0.5) * 24,
        life: 1
      }));
      setParticles((prev) => [...prev, ...created]);
    }
  });

  useEffect(() => {
    const id = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((particle) => ({ ...particle, life: particle.life - 0.06 }))
          .filter((particle) => particle.life > 0)
      );
    }, 16);

    return () => clearInterval(id);
  }, []);

  return (
    <Canvas style={{ width, height }} onTouch={touchHandler}>
      <Group blendMode="plus">
        {particles.map((particle, index) => (
          <Circle
            key={index}
            cx={particle.x}
            cy={particle.y}
            r={3 * particle.life}
            color={`rgba(255,255,255,${0.8 * particle.life})`}
          />
        ))}
      </Group>
    </Canvas>
  );
}
