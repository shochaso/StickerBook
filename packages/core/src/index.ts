export type StickerSurface = "matte" | "gloss" | "sparkle";

export type StickerAsset = {
  id: string;
  title: string;
  uri: string;
  surface: StickerSurface;
  tags: string[];
};

export type StickerPack = {
  id: string;
  name: string;
  stickers: StickerAsset[];
};

export function groupBySurface(stickers: StickerAsset[]): Record<StickerSurface, StickerAsset[]> {
  return stickers.reduce<Record<StickerSurface, StickerAsset[]>>(
    (acc, sticker) => {
      acc[sticker.surface].push(sticker);
      return acc;
    },
    { matte: [], gloss: [], sparkle: [] }
  );
}

export function filterByTag(stickers: StickerAsset[], tag: string) {
  const normalized = tag.toLowerCase();
  return stickers.filter((sticker) => sticker.tags.some((entry) => entry.toLowerCase() === normalized));
}

export function createSticker(id: string, title: string, uri: string, surface: StickerSurface, tags: string[] = []): StickerAsset {
  return { id, title, uri, surface, tags };
}
