import React, { useState } from 'react';
import { ArrowLeft, RotateCw, Crop, Sparkles, Save, Camera, Eye, EyeOff, Zap, Star, Split, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ImageEditPageProps {
  onBack: () => void;
  onSave: (data: any) => void;
  capturedImage?: string;
}

export function ImageEditPage({ onBack, onSave, capturedImage }: ImageEditPageProps) {
  const [title, setTitle] = useState('マイシール帳');
  const [rotation, setRotation] = useState(0);
  const [quality, setQuality] = useState([85]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStickers, setShowStickers] = useState(true);
  const [pageMode, setPageMode] = useState<'full' | 'left' | 'right'>('full');
  const [autoAngleCorrection, setAutoAngleCorrection] = useState(true);
  const [detectedStickers] = useState([
    { id: 1, name: 'パンダ', x: 45, y: 35, confidence: 0.95, category: 'アニマル' },
    { id: 2, name: 'ゾウ', x: 25, y: 55, confidence: 0.92, category: 'アニマル' },
    { id: 3, name: 'カップケーキ', x: 15, y: 25, confidence: 0.88, category: 'フード' },
    { id: 4, name: '星', x: 75, y: 15, confidence: 0.91, category: 'シェイプ' },
    { id: 5, name: 'うめがた', x: 65, y: 45, confidence: 0.85, category: 'キャラクター' },
  ]);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleSave = async () => {
    setIsProcessing(true);
    
    // シミュレート処理時間
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onSave({
      title,
      rotation,
      quality: quality[0],
      detectedStickers,
      image: capturedImage || "https://images.unsplash.com/photo-1623423299949-6b4f92507ea6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8fDE3NTkwNzM2NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      processedAt: new Date().toISOString()
    });
    
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
      {/* ヘッダー */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-purple-100 dark:border-purple-700 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            戻る
          </Button>
          <h1 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
            画像を編集
          </h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* タイトル入力 */}
        <Card className="p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700">
          <label className="block text-sm font-medium mb-2 text-purple-900 dark:text-purple-100">
            ページタイトル
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="シール帳のタイトルを入力"
            className="border-purple-200 dark:border-purple-700 focus:border-purple-400"
          />
        </Card>

        {/* 画像プレビュー */}
        <Card className="p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-purple-900 dark:text-purple-100">プレビュー</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowStickers(!showStickers)}
                className="border-purple-200 dark:border-purple-700"
              >
                {showStickers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showStickers ? 'シール非表示' : 'シール表示'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRotate}
                className="border-purple-200 dark:border-purple-700"
              >
                <RotateCw className="h-4 w-4 mr-1" />
                回転
              </Button>
            </div>
          </div>

          {/* 見開きページ選択 */}
          <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Split className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-purple-900 dark:text-purple-100">ページ選択</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={pageMode === 'left' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPageMode('left')}
                className="text-xs"
              >
                <ChevronLeft className="h-3 w-3 mr-1" />
                左ページ
              </Button>
              <Button
                variant={pageMode === 'full' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPageMode('full')}
                className="text-xs"
              >
                見開き全体
              </Button>
              <Button
                variant={pageMode === 'right' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPageMode('right')}
                className="text-xs"
              >
                右ページ
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
              {autoAngleCorrection ? '✓ 自動角度補正 ON' : '✗ 自動角度補正 OFF'}
            </div>
          </div>
          
          <div className="relative bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden flex justify-center">
            <div className="relative">
              <ImageWithFallback
                src={capturedImage || "https://images.unsplash.com/photo-1623423299949-6b4f92507ea6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGlja2VyJTIwYWxidW0lMjBub3RlYm9vayUyMHNjcmFwYm9va3xlbnwxfHx8fDE3NTkwNzM2NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
                alt="撮影したシール帳"
                className="w-auto max-w-full h-80 object-contain"
                style={{ 
                  transform: `rotate(${autoAngleCorrection ? rotation - 5 : rotation}deg)`,
                  clipPath: pageMode === 'left' ? 'inset(0 50% 0 0)' : 
                           pageMode === 'right' ? 'inset(0 0 0 50%)' : 'none'
                }}
              />
              
              {/* ページ分割ガイドライン */}
              {pageMode === 'full' && (
                <>
                  <div className="absolute inset-y-0 left-1/2 w-0.5 bg-purple-400/50 transform -translate-x-0.5" />
                  <div className="absolute top-2 left-1/4 transform -translate-x-1/2">
                    <Badge variant="outline" className="text-xs bg-white/80">左ページ</Badge>
                  </div>
                  <div className="absolute top-2 right-1/4 transform translate-x-1/2">
                    <Badge variant="outline" className="text-xs bg-white/80">右ページ</Badge>
                  </div>
                </>
              )}
              
              {/* 選択されたページのハイライト */}
              {pageMode !== 'full' && (
                <div className="absolute inset-0 border-2 border-purple-500 rounded-lg" />
              )}
            </div>
            
            {/* 検出されたシールのオーバーレイ */}
            {showStickers && (
              <div className="absolute inset-0">
                {detectedStickers.map((sticker) => (
                  <div
                    key={sticker.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${sticker.x}%`, top: `${sticker.y}%` }}
                  >
                    <div className="bg-purple-500/80 backdrop-blur-sm rounded-full p-2 border-2 border-white">
                      <Sparkles className="h-3 w-3 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* 画質調整 */}
        <Card className="p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-purple-600" />
            <label className="text-sm font-medium text-purple-900 dark:text-purple-100">
              画質: {quality[0]}%
            </label>
          </div>
          <Slider
            value={quality}
            onValueChange={setQuality}
            max={100}
            min={50}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>高速保存</span>
            <span>高画質</span>
          </div>
        </Card>

        {/* 自動検出結果 */}
        <Card className="p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <h3 className="font-medium text-purple-900 dark:text-purple-100">
              検出されたシール ({detectedStickers.length}個)
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {detectedStickers.map((sticker) => (
              <Badge
                key={sticker.id}
                variant="secondary"
                className="bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 border-purple-200 dark:border-purple-600"
              >
                <Star className="h-3 w-3 mr-1" />
                {sticker.name}
                <span className="ml-1 text-xs opacity-70">
                  {Math.round(sticker.confidence * 100)}%
                </span>
              </Badge>
            ))}
          </div>
        </Card>

        {/* アクションボタン */}
        <div className="space-y-3 pb-8">
          <Button
            onClick={handleSave}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-2xl"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                処理中...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                シール帳を保存
              </>
            )}
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-200"
            >
              <Camera className="h-4 w-4 mr-2" />
              再撮影
            </Button>
            <Button
              variant="outline"
              className="border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-200"
            >
              <Crop className="h-4 w-4 mr-2" />
              トリミング
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}