import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Switch } from './ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { AppContext } from '../App'
import {
  Circle,
  Plus,
  Search,
  Heart,
  Star,
  Settings,
  ShoppingBag,
  Menu,
  Grid3X3,
  List,
  Filter,
  Sun,
  Moon,
  MoreVertical,
  Share2,
  Edit,
  Trash2,
  Camera,
  ImageIcon,
  ScanLine
} from 'lucide-react'

interface AlbumListPageProps {
  appContext: AppContext
}

interface Album {
  id: string
  title: string
  coverImage: string
  stickerCount: number
  lastModified: string
  isPublic: boolean
  likes: number
  category: 'animals' | 'food' | 'nature' | 'cute' | 'travel'
}

// Mock data
const mockAlbums: Album[] = [
  {
    id: '1',
    title: 'かわいい動物たち',
    coverImage: 'https://images.unsplash.com/photo-1753430708971-892048584cf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYXdhaWklMjBhbmltYWxzJTIwc3RpY2tlcnN8ZW58MXx8fHwxNzU4OTg3MTAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    stickerCount: 24,
    lastModified: '2時間前',
    isPublic: true,
    likes: 12,
    category: 'animals'
  },
  {
    id: '2',
    title: 'パステルコレクション',
    coverImage: 'https://images.unsplash.com/photo-1611571741792-edb58d0ceb67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0ZWwlMjBub3RlYm9vayUyMGRpYXJ5fGVufDF8fHx8MTc1ODk4NzEwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    stickerCount: 18,
    lastModified: '1日前',
    isPublic: false,
    likes: 8,
    category: 'cute'
  },
  {
    id: '3',
    title: 'カラフルワールド',
    coverImage: 'https://images.unsplash.com/photo-1738606410165-46da2b5b700e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwc3RpY2tlcnMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NTg5ODcxMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    stickerCount: 32,
    lastModified: '3日前',
    isPublic: true,
    likes: 25,
    category: 'cute'
  }
]

export function AlbumListPage({ appContext }: AlbumListPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showMenu, setShowMenu] = useState(false)
  const [showCameraModal, setShowCameraModal] = useState(false)

  const filteredAlbums = mockAlbums.filter(album => {
    const matchesSearch = album.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || album.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCreateAlbum = () => {
    // Create new album logic
    console.log('Creating new album...')
  }

  const handleCameraCapture = () => {
    setShowCameraModal(true)
  }

  const handlePhotoUpload = () => {
    // Handle photo upload from gallery
    console.log('Upload from gallery...')
  }

  const handleOpenAlbum = (albumId: string) => {
    appContext.setSelectedAlbumId(albumId)
    appContext.setCurrentScreen('album-detail')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                <Circle className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold">シール帳</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => appContext.setCurrentScreen('store')}
                className="hidden sm:flex"
              >
                <ShoppingBag className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4" />
                <Switch
                  checked={appContext.isDarkMode}
                  onCheckedChange={appContext.setIsDarkMode}
                  size="sm"
                />
                <Moon className="w-4 h-4" />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => appContext.setCurrentScreen('settings')}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold mb-2">あなたのシール帳</h1>
          <p className="text-muted-foreground">
            {mockAlbums.length}個のアルバムがあります
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="アルバムを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input-background border-border rounded-2xl"
            />
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <div className="flex items-center justify-between">
              <TabsList className="bg-muted rounded-2xl">
                <TabsTrigger value="all" className="rounded-xl">すべて</TabsTrigger>
                <TabsTrigger value="animals" className="rounded-xl">動物</TabsTrigger>
                <TabsTrigger value="cute" className="rounded-xl">かわいい</TabsTrigger>
                <TabsTrigger value="nature" className="rounded-xl">自然</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                >
                  {viewMode === 'grid' ? (
                    <List className="w-4 h-4" />
                  ) : (
                    <Grid3X3 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </Tabs>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Camera Capture */}
          <Card 
            className="border-2 border-dashed border-primary/30 hover:border-primary/50 cursor-pointer transition-all duration-200 hover:shadow-lg"
            onClick={handleCameraCapture}
          >
            <CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-medium mb-1">シール帳を撮影</h3>
                <p className="text-sm text-muted-foreground">カメラでシール帳を撮影してデジタル化</p>
              </div>
            </CardContent>
          </Card>

          {/* Create New Album */}
          <Card 
            className="border-2 border-dashed border-accent/30 hover:border-accent/50 cursor-pointer transition-all duration-200 hover:shadow-lg"
            onClick={handleCreateAlbum}
          >
            <CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-3xl flex items-center justify-center">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-medium mb-1">新しいアルバムを作成</h3>
                <p className="text-sm text-muted-foreground">空のアルバムを作成してシールを追加</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Upload Option */}
        <Card 
          className="border border-border/50 hover:border-border cursor-pointer transition-all duration-200 hover:shadow-md"
          onClick={handlePhotoUpload}
        >
          <CardContent className="flex items-center justify-center py-6 text-center space-x-4">
            <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="text-left">
              <h3 className="font-medium mb-1">ギャラリーから写真を選択</h3>
              <p className="text-sm text-muted-foreground">撮影済みの写真からシール帳を取り込み</p>
            </div>
          </CardContent>
        </Card>

        {/* Albums Grid/List */}
        <div className={`grid gap-4 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredAlbums.map((album) => (
            <Card 
              key={album.id}
              className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden border-0 bg-card/50 backdrop-blur"
              onClick={() => handleOpenAlbum(album.id)}
            >
              <CardContent className="p-0">
                {viewMode === 'grid' ? (
                  <>
                    {/* Cover Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <ImageWithFallback
                        src={album.coverImage}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      
                      {/* Album Stats */}
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-white/90 text-dark backdrop-blur">
                          {album.stickerCount}枚
                        </Badge>
                      </div>

                      {/* Public/Private indicator */}
                      {album.isPublic && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-accent/90 text-white backdrop-blur">
                            公開中
                          </Badge>
                        </div>
                      )}

                      {/* Bottom overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-medium mb-1">{album.title}</h3>
                        <div className="flex items-center justify-between text-sm opacity-90">
                          <span>{album.lastModified}</span>
                          {album.isPublic && (
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              <span>{album.likes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* List View */}
                    <div className="flex items-center p-4 gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={album.coverImage}
                          alt={album.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium truncate">{album.title}</h3>
                          {album.isPublic && (
                            <Badge className="bg-accent text-white text-xs">公開</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{album.stickerCount}枚</span>
                          <span>{album.lastModified}</span>
                          {album.isPublic && (
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              <span>{album.likes}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAlbums.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">アルバムが見つかりません</h3>
            <p className="text-muted-foreground text-sm">
              検索条件を変更するか、新しいアルバムを作成してみてください
            </p>
          </div>
        )}
      </div>

      {/* Mobile bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border sm:hidden">
        <div className="flex items-center justify-around py-2">
          <Button variant="ghost" size="sm" className="flex flex-col gap-1">
            <Circle className="w-5 h-5" />
            <span className="text-xs">ホーム</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col gap-1"
            onClick={() => appContext.setCurrentScreen('store')}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs">ストア</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col gap-1"
            onClick={handleCameraCapture}
          >
            <Camera className="w-5 h-5" />
            <span className="text-xs">撮影</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col gap-1"
            onClick={() => appContext.setCurrentScreen('settings')}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs">設定</span>
          </Button>
        </div>
      </div>

      {/* Camera Modal */}
      <Dialog open={showCameraModal} onOpenChange={setShowCameraModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>シール帳を撮影</DialogTitle>
            <DialogDescription>
              カメラでシール帳を撮影してデジタルアルバムに取り込みます
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-video bg-muted rounded-2xl flex items-center justify-center">
              <div className="text-center space-y-2">
                <Camera className="w-12 h-12 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">カメラを起動中...</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowCameraModal(false)}
                className="rounded-2xl"
              >
                キャンセル
              </Button>
              <Button 
                onClick={() => {
                  setShowCameraModal(false)
                  // Navigate to camera capture screen
                  appContext.setCurrentScreen('camera-capture')
                }}
                className="rounded-2xl bg-gradient-to-r from-primary to-secondary"
              >
                <Camera className="w-4 h-4 mr-2" />
                撮影開始
              </Button>
            </div>

            <div className="text-center">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setShowCameraModal(false)
                  handlePhotoUpload()
                }}
                className="text-sm"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                ギャラリーから選択
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}