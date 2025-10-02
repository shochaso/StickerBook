/**
 * ポケモンカード風3Dエフェクトのプロファイル定義
 * どの画面でも同一の見た目を再現するためのパラメータセット
 */

export type SpringConfig = {
  stiffness: number;
  damping: number;
  mass: number;
};

export type CardFXProfile = {
  name: string;
  tilt: {
    maxDegX: number; // X軸最大回転角度
    maxDegY: number; // Y軸最大回転角度
    zLift: number; // Z軸持ち上げ量（px）
    spring: SpringConfig; // スプリングアニメーション設定
  };
  gloss: {
    radiusPx: number; // 光沢のradius
    intensity: number; // 光沢の強度 0-1
  };
  specular: {
    intensity: number; // 鏡面反射の強度 0-1
    falloff: number; // 減衰率 0-1
  };
  parallax: {
    depthPx: number; // パララックス深度（px）
  };
  saturation: {
    default: number; // 既定の彩度 0.5-2.0
    min: number; // 最小値
    max: number; // 最大値
  };
  shadow: {
    enabled: boolean;
    offsetX: number; // 影のX offset（px）
    offsetY: number; // 影のY offset（px）
    blur: number; // ぼかし（px）
    opacity: number; // 不透明度 0-1
  };
  haptics: {
    onPress: boolean; // タップ時の振動
    onDrop: boolean; // ドロップ時の振動
  };
};

/**
 * ポケモンカード風プロファイル
 * 大きめの傾き、強めの光沢、パララックスあり
 */
export const PokemonCardLike: CardFXProfile = {
  name: 'pokemon-card-like',
  tilt: {
    maxDegX: 16,
    maxDegY: 18,
    zLift: 6,
    spring: {
      stiffness: 240,
      damping: 18,
      mass: 0.7,
    },
  },
  gloss: {
    radiusPx: 180,
    intensity: 0.65,
  },
  specular: {
    intensity: 0.45,
    falloff: 0.6,
  },
  parallax: {
    depthPx: 3,
  },
  saturation: {
    default: 1.1,
    min: 0.6,
    max: 1.6,
  },
  shadow: {
    enabled: true,
    offsetX: 0,
    offsetY: 8,
    blur: 16,
    opacity: 0.3,
  },
  haptics: {
    onPress: true,
    onDrop: true,
  },
};

/**
 * シンプルプロファイル
 * 控えめな傾き、軽めの光沢
 */
export const SimpleCard: CardFXProfile = {
  name: 'simple-card',
  tilt: {
    maxDegX: 8,
    maxDegY: 10,
    zLift: 3,
    spring: {
      stiffness: 300,
      damping: 25,
      mass: 0.5,
    },
  },
  gloss: {
    radiusPx: 120,
    intensity: 0.35,
  },
  specular: {
    intensity: 0.25,
    falloff: 0.8,
  },
  parallax: {
    depthPx: 1,
  },
  saturation: {
    default: 1.0,
    min: 0.8,
    max: 1.3,
  },
  shadow: {
    enabled: true,
    offsetX: 0,
    offsetY: 4,
    blur: 8,
    opacity: 0.2,
  },
  haptics: {
    onPress: false,
    onDrop: false,
  },
};

/**
 * フラットプロファイル
 * Tilt無効、光沢のみ
 */
export const FlatCard: CardFXProfile = {
  name: 'flat-card',
  tilt: {
    maxDegX: 0,
    maxDegY: 0,
    zLift: 0,
    spring: {
      stiffness: 400,
      damping: 30,
      mass: 0.3,
    },
  },
  gloss: {
    radiusPx: 80,
    intensity: 0.2,
  },
  specular: {
    intensity: 0.1,
    falloff: 0.9,
  },
  parallax: {
    depthPx: 0,
  },
  saturation: {
    default: 1.0,
    min: 0.9,
    max: 1.2,
  },
  shadow: {
    enabled: false,
    offsetX: 0,
    offsetY: 0,
    blur: 0,
    opacity: 0,
  },
  haptics: {
    onPress: false,
    onDrop: false,
  },
};

/**
 * プロファイルのマップ
 */
export const CardFXProfiles = {
  pokemonCardLike: PokemonCardLike,
  simple: SimpleCard,
  flat: FlatCard,
} as const;

export type CardFXProfileName = keyof typeof CardFXProfiles;

/**
 * プロファイル取得のヘルパー
 */
export function getCardFXProfile(name: CardFXProfileName): CardFXProfile {
  return CardFXProfiles[name];
}

/**
 * プロファイルを部分的に上書き
 */
export function mergeCardFXProfile(
  base: CardFXProfile,
  overrides: Partial<CardFXProfile>
): CardFXProfile {
  return {
    ...base,
    ...overrides,
    tilt: { ...base.tilt, ...(overrides.tilt || {}) },
    gloss: { ...base.gloss, ...(overrides.gloss || {}) },
    specular: { ...base.specular, ...(overrides.specular || {}) },
    parallax: { ...base.parallax, ...(overrides.parallax || {}) },
    saturation: { ...base.saturation, ...(overrides.saturation || {}) },
    shadow: { ...base.shadow, ...(overrides.shadow || {}) },
    haptics: { ...base.haptics, ...(overrides.haptics || {}) },
  };
}

