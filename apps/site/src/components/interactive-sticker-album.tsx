import React, { useState, useRef, useEffect } from "react";
import { motion, useSpring, useTransform } from "motion/react";
import {
  Sparkles,
  Download,
  Share2,
  RotateCcw,
  Plus,
  Move3d,
  Palette,
  Sticker,
  Heart,
  ArrowLeft,
  X,
  Trash2,
  Upload,
  Scissors,
  Archive,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "./ui/dialog";
import { AppContext } from "../App";

interface InteractiveStickerAlbumProps {
  appContext: AppContext;
  albumImage: string;
  onBack: () => void;
}

interface PlacedSticker {
  id: string;
  src: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
}

interface StickerTemplate {
  id: string;
  src: string;
  category: string;
  isPremium: boolean;
}

export function InteractiveStickerAlbum({
  appContext,
  albumImage,
  onBack,
}: InteractiveStickerAlbumProps) {
  const [sparkleEffect, setSparkleEffect] = useState(false);
  const [tiltEnabled, setTiltEnabled] = useState(false);
  const [squishy, setSquishy] = useState(false);
  const [placedStickers, setPlacedStickers] = useState<
    PlacedSticker[]
  >([]);
  const [selectedSticker, setSelectedSticker] =
    useState<PlacedSticker | null>(null);
  const [stickerStock, setStickerStock] = useState<
    StickerTemplate[]
  >([
    {
      id: "1",
      src: "https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?w=100&h=100&fit=crop",
      category: "animals",
      isPremium: false,
    },
    {
      id: "2",
      src: "https://images.unsplash.com/photo-1618618042268-5e4bfbf3a6b2?w=100&h=100&fit=crop",
      category: "emoji",
      isPremium: false,
    },
    {
      id: "3",
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop",
      category: "hearts",
      isPremium: true,
    },
  ]);
  const [uploadedStickers, setUploadedStickers] = useState<
    string[]
  >([]);
  const [removedStickers, setRemovedStickers] = useState<
    PlacedSticker[]
  >([]);
  const [cuttingMode, setCuttingMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tilt effect
  const mouseX = useSpring(0, { damping: 20, stiffness: 300 });
  const mouseY = useSpring(0, { damping: 20, stiffness: 300 });
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!tiltEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / rect.width;
    const y = (e.clientY - centerY) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleAlbumClick = (e: React.MouseEvent) => {
    if (selectedSticker) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      const newSticker: PlacedSticker = {
        id: Date.now().toString(),
        src: selectedSticker.src,
        x,
        y,
        scale: 1,
        rotation: 0,
        zIndex: placedStickers.length + 1,
      };

      setPlacedStickers((prev) => [...prev, newSticker]);
      setSelectedSticker(null);
    }
  };

  const handleStickerClick = (sticker: StickerTemplate) => {
    setSelectedSticker({
      id: sticker.id,
      src: sticker.src,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      zIndex: 0,
    });
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedStickers((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePlacedSticker = (id: string) => {
    const sticker = placedStickers.find((s) => s.id === id);
    if (sticker) {
      setRemovedStickers((prev) => [...prev, sticker]);
      setPlacedStickers((prev) =>
        prev.filter((s) => s.id !== id),
      );
    }
  };

  const restoreSticker = (sticker: PlacedSticker) => {
    setPlacedStickers((prev) => [...prev, sticker]);
    setRemovedStickers((prev) =>
      prev.filter((s) => s.id !== sticker.id),
    );
  };

  const sparkles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 1 + Math.random() * 2,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-purple-200 dark:border-purple-700">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              戻る
            </Button>
            <h1 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
              マイシール帳
            </h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSparkleEffect(!sparkleEffect)}
              >
                <Sparkles
                  className={`h-4 w-4 ${sparkleEffect ? "text-yellow-500" : ""}`}
                />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTiltEnabled(!tiltEnabled)}
              >
                <Move3d
                  className={`h-4 w-4 ${tiltEnabled ? "text-purple-500" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Main Album View */}
        <Card className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700 relative overflow-hidden">
          {/* Sparkle Effect */}
          {sparkleEffect && (
            <div className="absolute inset-0 pointer-events-none">
              {sparkles.map((sparkle) => (
                <motion.div
                  key={sparkle.id}
                  className="absolute w-2 h-2"
                  style={{
                    left: `${sparkle.x}%`,
                    top: `${sparkle.y}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: sparkle.duration,
                    delay: sparkle.delay,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  <Sparkles className="w-full h-full text-yellow-400" />
                </motion.div>
              ))}
            </div>
          )}

          {/* Album Image with Tilt Effect */}
          <motion.div
            className="relative bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden mx-auto max-w-md aspect-[3/4] cursor-pointer"
            style={{
              rotateX: tiltEnabled ? rotateX : 0,
              rotateY: tiltEnabled ? rotateY : 0,
              transformStyle: "preserve-3d",
              transformOrigin: "center center",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleAlbumClick}
            whileHover={squishy ? { scale: 1.02 } : {}}
            whileTap={squishy ? { scale: 0.98 } : {}}
          >
            <ImageWithFallback
              src={albumImage}
              alt="シール帳"
              className="w-full h-full object-contain"
            />

            {/* Placed Stickers */}
            {placedStickers.map((sticker) => (
              <motion.div
                key={sticker.id}
                className="absolute group cursor-pointer"
                style={{
                  left: `${sticker.x}%`,
                  top: `${sticker.y}%`,
                  transform: `translate(-50%, -50%) scale(${sticker.scale}) rotate(${sticker.rotation}deg)`,
                  zIndex: sticker.zIndex,
                }}
                whileHover={{
                  scale: sticker.scale * 1.1,
                  rotateX: squishy ? 20 : 0,
                  rotateY: squishy ? 10 : 0,
                  z: squishy ? 50 : 0,
                }}
                whileTap={{
                  scale: sticker.scale * 0.9,
                  rotateX: squishy ? -10 : 0,
                }}
                drag
                dragConstraints={{
                  left: -50,
                  right: 50,
                  top: -50,
                  bottom: 50,
                }}
                animate={
                  squishy
                    ? {
                        rotateX: [0, 5, 0],
                        rotateY: [0, -3, 3, 0],
                        z: [0, 20, 0],
                      }
                    : {}
                }
                transition={{
                  duration: 3,
                  repeat: squishy ? Infinity : 0,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
              >
                <div
                  className={`relative ${squishy ? "transform-gpu" : ""}`}
                  style={{
                    filter: squishy
                      ? "drop-shadow(0 10px 20px rgba(0,0,0,0.3))"
                      : "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <img
                    src={sticker.src}
                    alt="シール"
                    className="w-12 h-12 object-cover rounded-lg"
                    style={{
                      transform: squishy
                        ? "translateZ(8px)"
                        : "none",
                    }}
                  />
                  {squishy && (
                    <div
                      className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent rounded-lg"
                      style={{ transform: "translateZ(10px)" }}
                    />
                  )}
                </div>
                {cuttingMode ? (
                  <div
                    className="absolute inset-0 bg-red-500/20 border-2 border-red-500 border-dashed rounded-lg flex items-center justify-center cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePlacedSticker(sticker.id);
                    }}
                  >
                    <Scissors className="h-4 w-4 text-red-600" />
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePlacedSticker(sticker.id);
                    }}
                  >
                    <X className="h-3 w-3 text-white" />
                  </Button>
                )}
              </motion.div>
            ))}

            {/* Cursor sticker preview */}
            {selectedSticker && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-12 h-12 bg-white/20 border-2 border-dashed border-purple-400 rounded-lg flex items-center justify-center">
                  <Sticker className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            )}
          </motion.div>

          {/* Effect Controls */}
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            <Button
              variant={squishy ? "default" : "outline"}
              size="sm"
              onClick={() => setSquishy(!squishy)}
            >
              3D飛び出し
            </Button>
            <Button
              variant={cuttingMode ? "destructive" : "outline"}
              size="sm"
              onClick={() => setCuttingMode(!cuttingMode)}
            >
              <Scissors className="h-4 w-4 mr-1" />
              {cuttingMode ? "カット終了" : "シール切り取り"}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              保存
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              シェア
            </Button>
          </div>

          {cuttingMode && (
            <div className="mt-2 text-center">
              <p className="text-sm text-red-600 dark:text-red-400">
                ✂️ シール切り取りモード:
                切り取りたいシールをクリック
              </p>
            </div>
          )}
        </Card>

        {/* Sticker Panel */}
        <Card className="p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700">
          <Tabs defaultValue="stock" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="stock">ストック</TabsTrigger>
              <TabsTrigger value="upload">
                アップロード
              </TabsTrigger>
              <TabsTrigger value="remove">剥がす</TabsTrigger>
              <TabsTrigger value="archive">
                アーカイブ
                {removedStickers.length > 0 && (
                  <Badge className="ml-1 bg-orange-500 text-white text-xs">
                    {removedStickers.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stock" className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Sticker className="h-4 w-4 text-purple-600" />
                <h3 className="font-medium text-purple-900 dark:text-purple-100">
                  シールコレクション
                </h3>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {stickerStock.map((sticker) => (
                  <motion.div
                    key={sticker.id}
                    className="relative cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleStickerClick(sticker)}
                  >
                    <img
                      src={sticker.src}
                      alt="シール"
                      className="w-full aspect-square object-cover rounded-lg border-2 border-purple-200 dark:border-purple-700"
                    />
                    {sticker.isPremium && (
                      <Badge className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs">
                        PRO
                      </Badge>
                    )}
                  </motion.div>
                ))}
                {uploadedStickers.map((sticker, index) => (
                  <motion.div
                    key={`uploaded-${index}`}
                    className="relative cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      handleStickerClick({
                        id: `uploaded-${index}`,
                        src: sticker,
                        x: 0,
                        y: 0,
                        scale: 1,
                        rotation: 0,
                        zIndex: 0,
                      })
                    }
                  >
                    <img
                      src={sticker}
                      alt="カスタムシール"
                      className="w-full aspect-square object-cover rounded-lg border-2 border-green-200 dark:border-green-700"
                    />
                    <Badge className="absolute -top-1 -right-1 bg-green-500 text-white text-xs">
                      カスタム
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              <div className="text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  シール画像をアップロード
                </Button>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  JPG, PNG形式に対応
                </p>
              </div>
            </TabsContent>

            <TabsContent value="remove" className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  シール帳から剥がしたいシールをタップしてください
                </p>
                {placedStickers.length === 0 ? (
                  <p className="text-gray-500">
                    貼られているシールがありません
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-3">
                    {placedStickers.map((sticker) => (
                      <motion.div
                        key={sticker.id}
                        className="relative cursor-pointer group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img
                          src={sticker.src}
                          alt="貼られているシール"
                          className="w-full aspect-square object-cover rounded-lg border-2 border-red-200 dark:border-red-700"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/20 hover:bg-red-500/30"
                          onClick={() =>
                            removePlacedSticker(sticker.id)
                          }
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="archive" className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Archive className="h-4 w-4 text-orange-600" />
                <h3 className="font-medium text-orange-900 dark:text-orange-100">
                  剥がしたシール
                </h3>
              </div>
              {removedStickers.length === 0 ? (
                <div className="text-center py-8">
                  <Archive className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">
                    剥がしたシールがありません
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    シールを剥がすとここに保存されます
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {removedStickers.map((sticker) => (
                    <motion.div
                      key={`removed-${sticker.id}`}
                      className="relative cursor-pointer group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={sticker.src}
                        alt="剥がされたシール"
                        className="w-full aspect-square object-cover rounded-lg border-2 border-orange-200 dark:border-orange-700 opacity-75"
                      />
                      <div className="absolute inset-0 bg-orange-100/50 dark:bg-orange-900/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                          onClick={() =>
                            restoreSticker(sticker)
                          }
                        >
                          復元
                        </Button>
                      </div>
                      <Badge className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs">
                        剥がし済み
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}