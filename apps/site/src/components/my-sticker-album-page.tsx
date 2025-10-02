import React, { useState } from 'react';
import { ArrowLeft, Heart, Share2, Download, Edit3, Trash2, Star, Sparkles, Calendar, Tag, Palette } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AppContext } from '../App';
import { InteractiveStickerAlbum } from './interactive-sticker-album';
import { HoloTiltPlayground } from './holo-tilt-playground';

interface MyStickerAlbumPageProps {
  appContext: AppContext;
}

interface StickerAlbum {
  id: string;
  title: string;
  image: string;
  createdAt: string;
  stickerCount: number;
  category: string;
  isFavorite: boolean;
  tags: string[];
}

export function MyStickerAlbumPage({ appContext }: MyStickerAlbumPageProps) {
  const [albums, setAlbums] = useState<StickerAlbum[]>([
    {
      id: '1',
      title: '私のシール帳',
      image: appContext.capturedImage || 'https://images.unsplash.com/photo-1623423299949-6b4f92507ea6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGlja2VyJTIwYWxidW0lMjBub3RlYm9vayUyMHNjcmFwYm9va3xlbnwxfHx8fDE3NTkwNzM2NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      createdAt: new Date().toISOString(),
      stickerCount: 12,
      category: 'マイコレクション',
      isFavorite: true,
      tags: ['新着', 'デジタル化']
    }
  ]);

  const [selectedAlbum, setSelectedAlbum] = useState<StickerAlbum | null>(albums[0]);
  const [showInteractiveView, setShowInteractiveView] = useState(false);

  const handleFavoriteToggle = (albumId: string) => {
    setAlbums(prev => prev.map(album => 
      album.id === albumId 
        ? { ...album, isFavorite: !album.isFavorite }
        : album
    ));
  };

  const handleShare = () => {
    // シェア機能の実装
    navigator.share?.({
      title: selectedAlbum?.title,
      text: 'シール帳をデジタル化しました！',
      url: window.location.href
    }).catch(console.error);
  };

  const handleDownload = () => {
    // ダウンロード機能の実装
    if (selectedAlbum?.image) {
      const link = document.createElement('a');
      link.href = selectedAlbum.image;
      link.download = `${selectedAlbum.title}.jpg`;
      link.click();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  if (!selectedAlbum) return null;

  if (showInteractiveView) {
    return (
      <InteractiveStickerAlbum
        appContext={appContext}
        albumImage={selectedAlbum.image}
        onBack={() => setShowInteractiveView(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
      {/* ヘッダー */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-purple-100 dark:border-purple-700 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => appContext.setCurrentScreen('album-list')}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            戻る
          </Button>
          <h1 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
            マイシール帳
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFavoriteToggle(selectedAlbum.id)}
          >
            <Heart 
              className={`h-5 w-5 ${
                selectedAlbum.isFavorite 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-400'
              }`} 
            />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* 成功メッセージ */}
        <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
              <Sparkles className="h-5 w-5 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <h3 className="font-medium text-green-900 dark:text-green-100 mb-1">
                シール帳の保存が完了しました！
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                デジタル化されたシール帳がマイコレクションに追加されました。
              </p>
            </div>
          </div>
        </Card>

        {/* アルバム情報 */}
        <Card className="p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-purple-900 dark:text-purple-100">
              {selectedAlbum.title}
            </h2>
            <Badge className="bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200">
              {selectedAlbum.category}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(selectedAlbum.createdAt)}
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              {selectedAlbum.stickerCount}個のシール
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {selectedAlbum.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-300"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </Card>

        {/* メイン画像 */}
        <Card className="p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700">
          <div className="relative bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden mb-4 flex justify-center">
            <ImageWithFallback
              src={selectedAlbum.image}
              alt={selectedAlbum.title}
              className="w-auto max-w-full h-80 object-contain"
            />
            <div className="absolute top-2 right-2">
              <Badge className="bg-purple-500 text-white">
                高品質
              </Badge>
            </div>
          </div>

          {/* シール検出結果 */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <h4 className="font-medium text-purple-900 dark:text-purple-100">
                検出されたシール
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">パンダ</span>
                <span className="text-purple-600 dark:text-purple-300">95%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">ゾウ</span>
                <span className="text-purple-600 dark:text-purple-300">92%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">ケーキ</span>
                <span className="text-purple-600 dark:text-purple-300">88%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">星</span>
                <span className="text-purple-600 dark:text-purple-300">91%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* ホログラフィックプレビュー */}
        <Card className="p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <h4 className="font-medium text-purple-900 dark:text-purple-100">
              立体ホロTiltプレビュー
            </h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            取り込んだ画像に立体チルトとホログラムのモーションを重ねています。マウス・タッチ・ジャイロに反応し、輝き方が滑らかに変化します。
          </p>
          <div className="bg-gradient-to-br from-purple-100/60 via-white/40 to-purple-50/40 dark:from-purple-900/20 dark:via-gray-900/30 dark:to-purple-800/30 rounded-3xl p-4">
            <HoloTiltPlayground initialImage={selectedAlbum.image} />
          </div>
        </Card>

        {/* アクションボタン */}
        <div className="space-y-3 pb-8">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleShare}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl"
            >
              <Share2 className="h-4 w-4 mr-2" />
              シェア
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-200 rounded-2xl"
            >
              <Download className="h-4 w-4 mr-2" />
              保存
            </Button>
          </div>

          <Button
            onClick={() => setShowInteractiveView(true)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-2xl mb-3"
          >
            <Palette className="h-5 w-5 mr-2" />
            インタラクティブモード
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => appContext.setCurrentScreen('image-edit')}
              className="border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-200 rounded-2xl"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              再編集
            </Button>
            <Button
              variant="outline"
              className="border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-2xl"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              削除
            </Button>
          </div>

          <Button
            onClick={() => appContext.setCurrentScreen('camera-capture')}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-2xl"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            新しいシール帳を追加
          </Button>
        </div>
      </div>
    </div>
  );
}
