import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { AppContext } from '../App'
import {
  ArrowLeft,
  Search,
  Star,
  Download,
  Heart,
  ShoppingCart,
  Crown,
  Sparkles,
  Gift,
  TrendingUp,
  Calendar,
  Filter,
  Grid3X3,
  List
} from 'lucide-react'

interface StorePageProps {
  appContext: AppContext
}

interface StickerPack {
  id: string
  title: string
  description: string
  coverImage: string
  price: number
  originalPrice?: number
  category: string
  stickerCount: number
  rating: number
  downloads: number
  isNew: boolean
  isFeatured: boolean
  isLimited: boolean
  tags: string[]
}

// Mock store data
const mockStickerPacks: StickerPack[] = [
  {
    id: 'pack1',
    title: 'かわいい動物パック',
    description: '愛らしい動物たちのシールセット。猫、犬、うさぎなど20種類',
    coverImage: 'https://images.unsplash.com/photo-1706251266917-32447a490262?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYXdhaWklMjBjaGFyYWN0ZXIlMjBzdGlja2Vyc3xlbnwxfHx8fDE3NTg5ODcyMjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: 299,
    originalPrice: 399,
    category: 'animals',
    stickerCount: 20,
    rating: 4.8,
    downloads: 1250,
    isNew: true,
    isFeatured: true,
    isLimited: false,
    tags: ['動物', '可愛い', '人気']
  },
  {
    id: 'pack2',
    title: 'カラフルエモーション',
    description: '感情豊かな絵文字風シール。喜怒哀楽を表現する15種類',
    coverImage: 'https://images.unsplash.com/photo-1621158200545-f6539352af8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwc3RpY2tlciUyMHBhY2tzJTIwY29sb3JmdWx8ZW58MXx8fHwxNzU4OTg3MjE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: 199,
    category: 'emoji',
    stickerCount: 15,
    rating: 4.6,
    downloads: 980,
    isNew: false,
    isFeatured: false,
    isLimited: true,
    tags: ['絵文字', 'カラフル', '感情']
  }
]

const categories = [
  { id: 'all', name: 'すべて', icon: Grid3X3 },
  { id: 'featured', name: '注目', icon: Star },
  { id: 'new', name: '新着', icon: Sparkles },
  { id: 'animals', name: '動物', icon: Heart },
  { id: 'emoji', name: '絵文字', icon: Gift },
  { id: 'limited', name: '限定', icon: Crown }
]

export function StorePage({ appContext }: StorePageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price-low' | 'price-high'>('popular')
  const [selectedPack, setSelectedPack] = useState<StickerPack | null>(null)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [purchasedPacks, setPurchasedPacks] = useState<string[]>(['pack2']) // Mock purchased packs

  const filteredPacks = mockStickerPacks.filter(pack => {
    const matchesSearch = pack.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pack.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' ||
                           (selectedCategory === 'featured' && pack.isFeatured) ||
                           (selectedCategory === 'new' && pack.isNew) ||
                           (selectedCategory === 'limited' && pack.isLimited) ||
                           pack.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handlePurchase = (pack: StickerPack) => {
    setSelectedPack(pack)
    setShowPurchaseModal(true)
  }

  const confirmPurchase = () => {
    if (selectedPack) {
      setPurchasedPacks(prev => [...prev, selectedPack.id])
      setShowPurchaseModal(false)
      setSelectedPack(null)
      // Show success message
      console.log(`Purchased: ${selectedPack.title}`)
    }
  }

  const isPurchased = (packId: string) => purchasedPacks.includes(packId)

  const sortedPacks = [...filteredPacks].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.isNew ? 1 : a.isNew ? -1 : 0
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'popular':
      default:
        return b.downloads - a.downloads
    }
  })



  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString()}`
  }

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
              <h1 className="font-bold">ストア</h1>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <ShoppingCart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Hero Banner */}
        <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 border-0">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center mx-auto">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">新春セール開催中！</h2>
                <p className="text-muted-foreground">人気のシールパックが最大30%オフ</p>
              </div>
              <Badge className="bg-secondary text-secondary-foreground">
                期間限定
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="シールパックを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input-background border-border rounded-2xl"
            />
          </div>

          <div className="flex items-center justify-between">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="bg-muted rounded-2xl overflow-x-auto">
                {categories.slice(0, 4).map(category => {
                  const Icon = category.icon
                  return (
                    <TabsTrigger key={category.id} value={category.id} className="rounded-xl whitespace-nowrap">
                      <Icon className="w-4 h-4 mr-1" />
                      {category.name}
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Sticker Packs Grid */}
        <div className={`grid gap-4 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {sortedPacks.map((pack) => (
            <Card 
              key={pack.id}
              className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden border-0 bg-card/50 backdrop-blur"
            >
              <CardContent className="p-0">
                {viewMode === 'grid' ? (
                  <>
                    {/* Cover Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <ImageWithFallback
                        src={pack.coverImage}
                        alt={pack.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {pack.isNew && (
                          <Badge className="bg-accent text-white">NEW</Badge>
                        )}
                        {pack.isFeatured && (
                          <Badge className="bg-primary text-white">
                            <Star className="w-3 h-3 mr-1" />
                            注目
                          </Badge>
                        )}
                        {pack.isLimited && (
                          <Badge className="bg-secondary text-secondary-foreground">
                            <Crown className="w-3 h-3 mr-1" />
                            限定
                          </Badge>
                        )}
                      </div>

                      {/* Price discount */}
                      {pack.originalPrice && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="destructive">
                            {Math.round(((pack.originalPrice - pack.price) / pack.originalPrice) * 100)}% OFF
                          </Badge>
                        </div>
                      )}

                      {/* Quick action button */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePurchase(pack.id)
                          }}
                          className="bg-white text-black hover:bg-white/90"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          購入
                        </Button>
                      </div>
                    </div>

                    {/* Pack Info */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-medium mb-1 line-clamp-1">{pack.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{pack.description}</p>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span>{pack.rating}</span>
                          </div>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{pack.stickerCount}枚</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Download className="w-3 h-3" />
                          <span>{pack.downloads.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {pack.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(pack.originalPrice)}
                            </span>
                          )}
                          <span className="font-bold text-primary">
                            {formatPrice(pack.price)}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePurchase(pack.id)
                          }}
                          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                        >
                          購入
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* List View */}
                    <div className="flex items-center p-4 gap-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={pack.coverImage}
                          alt={pack.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium truncate">{pack.title}</h3>
                              {pack.isNew && <Badge variant="secondary" className="text-xs">NEW</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">{pack.description}</p>
                          </div>
                          <div className="text-right ml-4">
                            {pack.originalPrice && (
                              <span className="text-xs text-muted-foreground line-through block">
                                {formatPrice(pack.originalPrice)}
                              </span>
                            )}
                            <span className="font-bold text-primary">
                              {formatPrice(pack.price)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span>{pack.rating}</span>
                            </div>
                            <span>{pack.stickerCount}枚</span>
                            <div className="flex items-center gap-1">
                              <Download className="w-3 h-3" />
                              <span>{pack.downloads.toLocaleString()}</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handlePurchase(pack)
                            }}
                            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                          >
                            購入
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedPacks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">シールパックが見つかりません</h3>
            <p className="text-muted-foreground text-sm">
              検索条件を変更するか、カテゴリを変更してみてください
            </p>
          </div>
        )}

        {/* Footer info */}
        <Card className="bg-muted/30 border-0">
          <CardContent className="p-6 text-center">
            <div className="space-y-2">
              <h3 className="font-medium">毎週新しいシールが追加されます</h3>
              <p className="text-sm text-muted-foreground">
                お気に入りのアーティストをフォローして最新情報をチェック
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purchase Modal */}
      <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>購入確認</DialogTitle>
            <DialogDescription>
              シールパックの購入内容を確認してください
            </DialogDescription>
          </DialogHeader>
          {selectedPack && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden">
                  <ImageWithFallback
                    src={selectedPack.coverImage}
                    alt={selectedPack.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{selectedPack.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPack.stickerCount}枚のシール</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(selectedPack.price)}
                    </span>
                    {selectedPack.originalPrice && (
                      <span className="text-sm line-through text-muted-foreground">
                        {formatPrice(selectedPack.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• このシールパックを購入すると、すべてのシールが利用可能になります</p>
                <p>• 購入したシールは無制限で利用できます</p>
                <p>• 新しいアルバムでも使用できます</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowPurchaseModal(false)}
                  className="rounded-2xl"
                >
                  キャンセル
                </Button>
                <Button 
                  onClick={confirmPurchase}
                  className="rounded-2xl bg-gradient-to-r from-primary to-secondary"
                >
                  {formatPrice(selectedPack.price)}で購入
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}