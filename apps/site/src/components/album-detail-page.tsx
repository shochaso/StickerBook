import { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { AppContext } from '../App'
import {
  ArrowLeft,
  Share2,
  Heart,
  Star,
  Plus,
  MoreVertical,
  Download,
  Edit,
  Palette,
  Grid3X3,
  RotateCcw,
  Trash2,
  Move,
  ZoomIn,
  ZoomOut,
  Settings,
  Lock,
  Unlock
} from 'lucide-react'

interface AlbumDetailPageProps {
  appContext: AppContext
}

interface Sticker {
  id: string
  image: string
  x: number
  y: number
  scale: number
  rotation: number
  zIndex: number
}

interface StickerOption {
  id: string
  image: string
  category: string
  name: string
}

// Mock sticker data
const mockStickers: StickerOption[] = [
  {
    id: 's1',
    image: 'https://images.unsplash.com/photo-1615821044195-d158c5b986de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwYW5pbWFsJTIwc3RpY2tlcnMlMjBrYXdhaWl8ZW58MXx8fHwxNzU4OTg3MTU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'animals',
    name: '可愛い猫'
  },
  {
    id: 's2',
    image: 'https://images.unsplash.com/photo-1633533452206-8ab246b00e30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbW9qaSUyMHN0aWNrZXJzJTIwc2hlZXR8ZW58MXx8fHwxNzU4OTg3MTU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'emoji',
    name: 'にっこり'
  }
]

export function AlbumDetailPage({ appContext }: AlbumDetailPageProps) {
  const [placedStickers, setPlacedStickers] = useState<Sticker[]>([
    {
      id: 'placed1',
      image: mockStickers[0].image,
      x: 100,
      y: 150,
      scale: 1,
      rotation: 0,
      zIndex: 1
    },
    {
      id: 'placed2',
      image: mockStickers[1].image,
      x: 200,
      y: 100,
      scale: 0.8,
      rotation: 15,
      zIndex: 2
    }
  ])
  
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [albumTitle, setAlbumTitle] = useState('かわいい動物たち')
  const [backgroundStyle, setBackgroundStyle] = useState('default')
  const [showStickerSheet, setShowStickerSheet] = useState(false)
  const [zoom, setZoom] = useState(1)
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleStickerClick = (stickerId: string) => {
    if (isEditing) {
      setSelectedSticker(selectedSticker === stickerId ? null : stickerId)
    }
  }

  const handleAddSticker = (stickerOption: StickerOption) => {
    const newSticker: Sticker = {
      id: `placed_${Date.now()}`,
      image: stickerOption.image,
      x: Math.random() * 200 + 50,
      y: Math.random() * 200 + 50,
      scale: 1,
      rotation: 0,
      zIndex: Math.max(...placedStickers.map(s => s.zIndex), 0) + 1
    }
    setPlacedStickers([...placedStickers, newSticker])
    setShowStickerSheet(false)
  }

  const handleDeleteSticker = (stickerId: string) => {
    setPlacedStickers(placedStickers.filter(s => s.id !== stickerId))
    setSelectedSticker(null)
  }

  const handleStickerTransform = (stickerId: string, updates: Partial<Sticker>) => {
    setPlacedStickers(stickers => 
      stickers.map(sticker => 
        sticker.id === stickerId ? { ...sticker, ...updates } : sticker
      )
    )
  }

  const backgrounds = [
    { id: 'default', name: 'デフォルト', style: 'bg-white' },
    { id: 'pastel', name: 'パステル', style: 'bg-gradient-to-br from-pink-100 to-blue-100' },
    { id: 'nature', name: '自然', style: 'bg-gradient-to-br from-green-100 to-blue-100' },
    { id: 'sunset', name: '夕焼け', style: 'bg-gradient-to-br from-orange-100 to-pink-100' }
  ]

  const selectedStickerData = placedStickers.find(s => s.id === selectedSticker)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => appContext.setCurrentScreen('album-list')}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              
              {isEditing ? (
                <input
                  type="text"
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  className="bg-transparent border-none outline-none font-medium"
                />
              ) : (
                <h1 className="font-medium">{albumTitle}</h1>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isEditing ? (
                <>
                  <Button variant="ghost" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    完了
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
        {/* Main Canvas Area */}
        <div className="flex-1 p-4 lg:p-6">
          <div className="flex flex-col items-center space-y-4">
            {/* Zoom Controls */}
            {isEditing && (
              <div className="flex items-center gap-2 bg-muted rounded-2xl p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                  disabled={zoom <= 0.5}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium w-12 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                  disabled={zoom >= 2}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Album Canvas */}
            <div className="relative">
              <Card className={`w-[350px] h-[500px] lg:w-[400px] lg:h-[600px] overflow-hidden border-2 ${
                isEditing ? 'border-primary' : 'border-border'
              }`}>
                <CardContent className="p-0 h-full relative">
                  {/* Background */}
                  <div 
                    ref={canvasRef}
                    className={`w-full h-full relative ${
                      backgrounds.find(b => b.id === backgroundStyle)?.style || 'bg-white'
                    }`}
                    style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
                  >
                    {/* Placed Stickers */}
                    {placedStickers.map((sticker) => (
                      <div
                        key={sticker.id}
                        className={`absolute cursor-pointer select-none transition-all duration-200 ${
                          selectedSticker === sticker.id ? 'ring-2 ring-primary ring-offset-2' : ''
                        }`}
                        style={{
                          left: sticker.x,
                          top: sticker.y,
                          transform: `scale(${sticker.scale}) rotate(${sticker.rotation}deg)`,
                          zIndex: sticker.zIndex
                        }}
                        onClick={() => handleStickerClick(sticker.id)}
                      >
                        <ImageWithFallback
                          src={sticker.image}
                          alt="Sticker"
                          className="w-16 h-16 object-cover rounded-lg shadow-lg"
                          draggable={false}
                        />
                      </div>
                    ))}

                    {/* Grid overlay when editing */}
                    {isEditing && (
                      <div 
                        className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                          backgroundImage: `
                            linear-gradient(to right, #ccc 1px, transparent 1px),
                            linear-gradient(to bottom, #ccc 1px, transparent 1px)
                          `,
                          backgroundSize: '20px 20px'
                        }}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Empty state */}
              {placedStickers.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-muted rounded-3xl flex items-center justify-center mx-auto">
                      <Plus className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        シールを追加してアルバムを作成しましょう
                      </p>
                      <Button
                        variant="link"
                        onClick={() => setShowStickerSheet(true)}
                        className="mt-2"
                      >
                        シールを選ぶ
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Editing Panel */}
        {isEditing && (
          <div className="w-full lg:w-80 bg-muted/30 border-t lg:border-t-0 lg:border-l border-border">
            <div className="p-4 space-y-6">
              <div>
                <h3 className="font-medium mb-3">背景</h3>
                <div className="grid grid-cols-2 gap-2">
                  {backgrounds.map((bg) => (
                    <Button
                      key={bg.id}
                      variant={backgroundStyle === bg.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setBackgroundStyle(bg.id)}
                      className="h-auto p-3 flex flex-col items-center gap-2"
                    >
                      <div className={`w-8 h-8 rounded-lg ${bg.style} border`} />
                      <span className="text-xs">{bg.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {selectedStickerData && (
                <div>
                  <h3 className="font-medium mb-3">選択中のシール</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">サイズ</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStickerTransform(selectedSticker!, {
                            scale: Math.max(0.5, selectedStickerData.scale - 0.1)
                          })}
                        >
                          -
                        </Button>
                        <span className="text-sm w-12 text-center">
                          {Math.round(selectedStickerData.scale * 100)}%
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStickerTransform(selectedSticker!, {
                            scale: Math.min(2, selectedStickerData.scale + 0.1)
                          })}
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">回転</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStickerTransform(selectedSticker!, {
                            rotation: selectedStickerData.rotation - 15
                          })}
                        >
                          ↺
                        </Button>
                        <span className="text-sm w-12 text-center">
                          {selectedStickerData.rotation}°
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStickerTransform(selectedSticker!, {
                            rotation: selectedStickerData.rotation + 15
                          })}
                        >
                          ↻
                        </Button>
                      </div>
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteSticker(selectedSticker!)}
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      削除
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <Button
                  onClick={() => setShowStickerSheet(true)}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  シールを追加
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticker Selection Sheet */}
      <Sheet open={showStickerSheet} onOpenChange={setShowStickerSheet}>
        <SheetContent side="bottom" className="h-[70vh]">
          <SheetHeader>
            <SheetTitle>シールを選択</SheetTitle>
            <SheetDescription>
              アルバムに追加するシールを選んでください
            </SheetDescription>
          </SheetHeader>
          
          <Tabs defaultValue="all" className="mt-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">すべて</TabsTrigger>
              <TabsTrigger value="animals">動物</TabsTrigger>
              <TabsTrigger value="emoji">絵文字</TabsTrigger>
              <TabsTrigger value="nature">自然</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {mockStickers.map((sticker) => (
                  <Button
                    key={sticker.id}
                    variant="outline"
                    className="aspect-square p-2 h-auto"
                    onClick={() => handleAddSticker(sticker)}
                  >
                    <ImageWithFallback
                      src={sticker.image}
                      alt={sticker.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      {/* Mobile Action Bar */}
      {isEditing && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border p-4 lg:hidden">
          <div className="flex items-center justify-around">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStickerSheet(true)}
              className="flex flex-col gap-1"
            >
              <Plus className="w-5 h-5" />
              <span className="text-xs">追加</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col gap-1">
              <Palette className="w-5 h-5" />
              <span className="text-xs">背景</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col gap-1">
              <Settings className="w-5 h-5" />
              <span className="text-xs">設定</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}