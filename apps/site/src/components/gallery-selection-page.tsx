import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, Image as ImageIcon, Camera, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { AppContext } from '../App';

interface GallerySelectionPageProps {
  appContext: AppContext;
}

export function GallerySelectionPage({ appContext }: GallerySelectionPageProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = async () => {
    if (selectedImage) {
      setIsProcessing(true);
      
      // シミュレート処理時間
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      appContext.setCapturedImage(selectedImage);
      appContext.setCurrentScreen('image-edit');
      setIsProcessing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
      {/* ヘッダー */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-purple-100 dark:border-purple-700 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => appContext.setCurrentScreen('camera-capture')}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            戻る
          </Button>
          <h1 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
            画像を選択
          </h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* 説明カード */}
        <Card className="p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700">
          <div className="flex items-start gap-3">
            <div className="bg-purple-100 dark:bg-purple-800 p-2 rounded-full">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-1">
                シール帳の写真を選択
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                ギャラリーからシール帳の写真を選んでデジタル化しましょう。
                クリアで全体が写っている写真がおすすめです。
              </p>
            </div>
          </div>
        </Card>

        {/* 画像選択エリア */}
        <Card className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700">
          {!selectedImage ? (
            <div className="text-center space-y-4">
              <div 
                onClick={triggerFileInput}
                className="border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-2xl p-8 cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 transition-colors mx-auto max-w-xs aspect-[3/4]"
              >
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <div className="bg-purple-100 dark:bg-purple-800 p-4 rounded-full">
                    <Upload className="h-8 w-8 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                      シール帳の写真を選択
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      縦型のシール帳写真を<br />タップして選択してください
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200">
                  JPG, PNG対応
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200">
                  最大10MB
                </Badge>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden flex justify-center">
                <img
                  src={selectedImage}
                  alt="選択された画像"
                  className="w-auto max-w-full h-80 object-contain"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-green-500 text-white">
                    <ImageIcon className="h-3 w-3 mr-1" />
                    選択完了
                  </Badge>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={triggerFileInput}
                  className="flex-1 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-200"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  別の画像を選択
                </Button>
                <Button
                  variant="outline"
                  onClick={() => appContext.setCurrentScreen('camera-capture')}
                  className="flex-1 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-200"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  カメラで撮影
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* 推奨事項 */}
        <Card className="p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700">
          <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-3">
            より良い結果のために
          </h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
              <span>シール帳全体が写っている</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
              <span>明るい場所で撮影されている</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
              <span>影や反射が少ない</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
              <span>真上から撮影されている</span>
            </div>
          </div>
        </Card>

        {/* 確認ボタン */}
        {selectedImage && (
          <div className="pb-8">
            <Button
              onClick={handleConfirm}
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
                  <Sparkles className="h-5 w-5 mr-2" />
                  画像を編集する
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* 隠しファイル入力 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}