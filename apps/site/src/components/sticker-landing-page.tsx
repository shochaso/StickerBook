import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { Switch } from "./ui/switch"
import { ImageWithFallback } from './figma/ImageWithFallback'
import { AppContext } from '../App'
import { 
  Camera, 
  Sparkles, 
  Circle, 
  Zap, 
  Heart, 
  Users, 
  Share2, 
  Download, 
  Play,
  Check,
  Star,
  Menu,
  X,
  ChevronDown,
  ArrowRight
} from "lucide-react"
import { useState } from 'react'

interface StickerLandingPageProps {
  appContext?: AppContext
}

export function StickerLandingPage({ appContext }: StickerLandingPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleGetStarted = () => {
    if (appContext) {
      appContext.setCurrentScreen('login')
    }
  }

  const toggleDarkMode = () => {
    if (appContext) {
      appContext.setIsDarkMode(!appContext.isDarkMode)
    } else {
      document.documentElement.classList.toggle('dark')
    }
  }

  return (
    <div className={`min-h-screen bg-background transition-all duration-300`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                <Circle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-medium">シール帳</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">機能</a>
              <a href="#pricing" className="text-foreground/80 hover:text-foreground transition-colors">料金</a>
              <a href="#gallery" className="text-foreground/80 hover:text-foreground transition-colors">ギャラリー</a>
              <a href="#faq" className="text-foreground/80 hover:text-foreground transition-colors">FAQ</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Switch 
                checked={appContext?.isDarkMode || false} 
                onCheckedChange={toggleDarkMode}
                className="data-[state=checked]:bg-primary"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:flex"
                onClick={handleGetStarted}
              >
                ログイン
              </Button>
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90 rounded-2xl px-6"
                onClick={handleGetStarted}
              >
                無料ではじめる
              </Button>
              
              <button 
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <a href="#features" className="block text-foreground/80 hover:text-foreground transition-colors">機能</a>
              <a href="#pricing" className="block text-foreground/80 hover:text-foreground transition-colors">料金</a>
              <a href="#gallery" className="block text-foreground/80 hover:text-foreground transition-colors">ギャラリー</a>
              <a href="#faq" className="block text-foreground/80 hover:text-foreground transition-colors">FAQ</a>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                ログイン
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section with Animated Background */}
      <section className="relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            {/* Floating sticker animations */}
            <div className="absolute top-20 left-20 w-12 h-12 bg-primary/20 rounded-full animate-bounce" 
                 style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
            <div className="absolute top-40 right-32 w-8 h-8 bg-accent/30 rounded-full animate-pulse" 
                 style={{ animationDelay: '1s', animationDuration: '2s' }}></div>
            <div className="absolute bottom-32 left-40 w-10 h-10 bg-secondary/25 rounded-full animate-bounce" 
                 style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
            <div className="absolute top-60 left-1/3 w-6 h-6 bg-primary/40 rounded-full animate-ping" 
                 style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
            <div className="absolute bottom-40 right-20 w-14 h-14 bg-accent/20 rounded-full animate-pulse" 
                 style={{ animationDelay: '1.5s', animationDuration: '2.5s' }}></div>
            
            {/* Additional floating elements for more motion */}
            <div className="absolute top-32 right-16 w-4 h-4 bg-primary/30 rounded-full animate-bounce" 
                 style={{ animationDelay: '2.5s', animationDuration: '3.5s' }}></div>
            <div className="absolute bottom-20 left-32 w-7 h-7 bg-secondary/35 rounded-full animate-ping" 
                 style={{ animationDelay: '1.8s', animationDuration: '4.5s' }}></div>
            <div className="absolute top-48 left-16 w-5 h-5 bg-accent/25 rounded-full animate-pulse" 
                 style={{ animationDelay: '3s', animationDuration: '2.8s' }}></div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-primary/10 text-primary border-primary/20 rounded-2xl px-4 py-2 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  あなたの毎日を特別に
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium leading-tight">
                  シール帳
                  <br />
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    あなたの毎日を
                  </span>
                  <br />
                  貼って、振り返る。
                </h1>
                <p className="text-lg text-foreground/70 max-w-xl">
                  デジタルシール帳で思い出を楽しく整理。写真や動画は不要、シールを貼るだけで素敵なアルバムが完成します。
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 rounded-2xl px-8 py-6 text-lg shadow-xl"
                  onClick={handleGetStarted}
                >
                  <Play className="w-5 h-5 mr-2" />
                  無料ではじめる
                </Button>
                <Button variant="outline" size="lg" className="rounded-2xl px-8 py-6 text-lg border-2 backdrop-blur-sm bg-background/50">
                  機能を見る
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
              <div className="flex items-center space-x-8 text-sm text-foreground/60">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-accent" />
                  <span>1ページ無料</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-accent" />
                  <span>クレジットカード不要</span>
                </div>
              </div>
            </div>
            
            {/* Auto-playing demo preview */}
            <div className="relative">
              <div className="relative bg-card/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-border overflow-hidden">
                <div className="relative">
                  {/* Simulated app interface with auto-playing content */}
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 h-64 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                      </div>
                      <div className="text-xs text-foreground/60 flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>ライブデモ</span>
                      </div>
                    </div>
                    
                    {/* Auto-animated stickers with more dynamic movement */}
                    <div className="relative h-40 bg-white/50 rounded-xl overflow-hidden">
                      {/* Primary stickers with complex animations */}
                      <div className="absolute top-4 left-4 w-8 h-8 bg-primary rounded-full animate-bounce" 
                           style={{ animationDuration: '2s', animationDelay: '0s' }}></div>
                      <div className="absolute top-6 right-8 w-6 h-6 bg-accent rounded-full animate-ping" 
                           style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
                      <div className="absolute bottom-6 left-8 w-10 h-10 bg-secondary rounded-full animate-pulse" 
                           style={{ animationDuration: '2.5s', animationDelay: '1s' }}></div>
                      <div className="absolute bottom-4 right-4 w-7 h-7 bg-primary/70 rounded-full animate-bounce" 
                           style={{ animationDuration: '3.5s', animationDelay: '1.5s' }}></div>
                      
                      {/* Additional moving stickers */}
                      <div className="absolute top-12 left-16 w-5 h-5 bg-accent/80 rounded-full animate-ping" 
                           style={{ animationDuration: '4s', animationDelay: '2s' }}></div>
                      <div className="absolute bottom-8 right-16 w-4 h-4 bg-secondary/60 rounded-full animate-bounce" 
                           style={{ animationDuration: '2.8s', animationDelay: '2.5s' }}></div>
                      <div className="absolute top-20 right-20 w-6 h-6 bg-primary/50 rounded-full animate-pulse" 
                           style={{ animationDuration: '3.2s', animationDelay: '3s' }}></div>
                      
                      {/* Dynamic motion trails */}
                      <div className="absolute top-8 left-8 w-20 h-0.5 bg-gradient-to-r from-primary via-primary/50 to-transparent animate-pulse" 
                           style={{ animationDuration: '1.5s' }}></div>
                      <div className="absolute bottom-10 right-12 w-16 h-0.5 bg-gradient-to-l from-accent via-accent/50 to-transparent animate-pulse" 
                           style={{ animationDuration: '2s', animationDelay: '1s' }}></div>
                      <div className="absolute top-16 left-20 w-12 h-0.5 bg-gradient-to-r from-secondary via-secondary/50 to-transparent animate-pulse" 
                           style={{ animationDuration: '1.8s', animationDelay: '0.5s' }}></div>
                      
                      {/* Floating particles for extra motion */}
                      <div className="absolute top-2 left-2 w-1 h-1 bg-primary/60 rounded-full animate-ping" 
                           style={{ animationDuration: '5s', animationDelay: '0s' }}></div>
                      <div className="absolute top-4 right-2 w-1 h-1 bg-accent/60 rounded-full animate-ping" 
                           style={{ animationDuration: '4.5s', animationDelay: '1s' }}></div>
                      <div className="absolute bottom-2 left-6 w-1 h-1 bg-secondary/60 rounded-full animate-ping" 
                           style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
                      <div className="absolute bottom-6 right-6 w-1 h-1 bg-primary/40 rounded-full animate-ping" 
                           style={{ animationDuration: '5.5s', animationDelay: '3s' }}></div>
                    </div>
                    
                    {/* Progress bar to simulate video playback */}
                    <div className="absolute bottom-2 left-6 right-6 h-1 bg-black/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full animate-pulse" 
                           style={{ 
                             width: '60%',
                             animation: 'progressBar 8s ease-in-out infinite'
                           }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-4 -right-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-2xl shadow-lg">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span>自動再生中</span>
                  </div>
                </div>
                
                {/* Subtle shimmer effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse opacity-50" 
                     style={{ animationDuration: '3s' }}></div>
              </div>
            </div>

            {/* Add custom CSS for progress bar animation */}
            <style jsx>{`
              @keyframes progressBar {
                0% { width: 0%; }
                50% { width: 75%; }
                100% { width: 100%; }
              }
            `}</style>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-medium mb-6">
              かんたん3ステップで
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent ml-2">
                始められます
              </span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              複雑な操作は一切不要。直感的な操作でシール帳が作れます。
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-all duration-300 rounded-3xl shadow-lg hover:shadow-xl">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">画像取り込み</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  1ページ無料で画像を取り込み。自動で最適化されます。
                </CardDescription>
                <div className="mt-4 p-3 bg-muted rounded-2xl">
                  <p className="text-sm text-muted-foreground">広告表示: 大きめ・頻度高</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent/50 transition-all duration-300 rounded-3xl shadow-lg hover:shadow-xl">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-xl">モーション追加</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  有料プランでページにアニメーションを追加できます。
                </CardDescription>
                <div className="mt-4 p-3 bg-accent/10 rounded-2xl">
                  <p className="text-sm text-accent">¥980プラン以上で利用可能</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-secondary/50 transition-all duration-300 rounded-3xl shadow-lg hover:shadow-xl">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-secondary/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Circle className="w-8 h-8 text-secondary" />
                </div>
                <CardTitle className="text-xl">シール貼替</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  豊富なシールから選んで自由にデコレーション。
                </CardDescription>
                <div className="mt-4 p-3 bg-secondary/10 rounded-2xl">
                  <p className="text-sm text-secondary">¥980プラン以上で利用可能</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all duration-300 rounded-3xl shadow-lg hover:shadow-xl">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">シェア機能</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  作ったアルバムを家族や友達と簡単にシェア。
                </CardDescription>
                <div className="mt-4 p-3 bg-primary/10 rounded-2xl">
                  <p className="text-sm text-primary">全プランで利用可能</p>
                </div>
              </CardContent>
            </Card>
          </div>


        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-medium mb-6">
              あなたにぴったりの
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent ml-2">
                プランを選択
              </span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              まずは無料プランで始めて、必要に応じてアップグレード。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* 無料プラン */}
            <Card className="rounded-3xl border-2 hover:border-muted-foreground/30 transition-all duration-300 shadow-lg">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl mb-2">無料プラン</CardTitle>
                <div className="text-4xl font-bold mb-2">¥0</div>
                <CardDescription className="text-base">お試しで始めたい方に</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>1ページのみ取り込み可能</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <X className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">モーション機��なし</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <X className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">シール貼替不可</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-5 h-5 text-orange-500 flex-shrink-0">⚠</span>
                    <span className="text-orange-600">広告多め（大きめ表示）</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>基本的なシェア機能</span>
                  </div>
                </div>
                <Button className="w-full rounded-2xl py-6" variant="outline">
                  このプランを選ぶ
                </Button>
              </CardContent>
            </Card>

            {/* ¥980プラン（おすすめ） */}
            <Card className="rounded-3xl border-2 border-primary shadow-xl relative scale-105 bg-primary/5">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-secondary text-secondary-foreground px-4 py-2 rounded-2xl shadow-lg">
                  初めての方におすすめ
                </Badge>
              </div>
              <CardHeader className="text-center pb-6 pt-8">
                <CardTitle className="text-2xl mb-2">スタンダード</CardTitle>
                <div className="text-4xl font-bold mb-2 text-primary">¥980</div>
                <CardDescription className="text-base">月額・楽しく使いたい方に</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>2〜10ページまで取り込み</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>モーション追加機能</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>シール貼替可能</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-accent">広告少なめ（小型表示）</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>高品質シェア機能</span>
                  </div>
                </div>
                <Button className="w-full rounded-2xl py-6 bg-primary hover:bg-primary/90">
                  このプランを選ぶ
                </Button>
              </CardContent>
            </Card>

            {/* ¥1,980プラン */}
            <Card className="rounded-3xl border-2 hover:border-accent/50 transition-all duration-300 shadow-lg">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl mb-2">プレミアム</CardTitle>
                <div className="text-4xl font-bold mb-2 text-accent">¥1,980</div>
                <CardDescription className="text-base">制限なく使いたい方に</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>無制限ページ取り込み</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>全モーション機能</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>シール貼替可能</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-accent">広告最小限（小型・低頻度）</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>高品質シェア機能</span>
                  </div>
                </div>
                <Button className="w-full rounded-2xl py-6 bg-accent hover:bg-accent/90">
                  このプランを選ぶ
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12 space-y-4">
            <p className="text-sm text-muted-foreground">
              ※ Apple App Store / Google Play Store での購入時は、各ストアの手数料が含まれます
            </p>
            <p className="text-sm text-muted-foreground">
              ※ 料金は税込み表示です。いつでもプラン変更・解約が可能です
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-medium mb-6">
              みんなの
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent ml-2">
                シール帳ギャラリー
              </span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              ユーザーの皆さんが作った素敵なシール帳をご覧ください。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="group overflow-hidden rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1627353802168-e8e8a81e51f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90byUyMGFsYnVtJTIwc2NyYXBib29rJTIwbWVtb3JpZXN8ZW58MXx8fHwxNzU4ODk4NjIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt={`ギャラリー ${i}`}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{Math.floor(Math.random() * 100) + 10}</span>
                      <Star className="w-4 h-4 ml-2" />
                      <span className="text-sm">4.{Math.floor(Math.random() * 10)}</span>
                    </div>
                    <p className="text-sm opacity-90">思い出のアルバム #{i}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="rounded-2xl px-8 py-6">
              もっと見る
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-medium mb-6">
              よくある
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent ml-2">
                質問
              </span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              シール帳について、よくお寄せいただく質問にお答えします。
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border border-border rounded-3xl px-6">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  無料プランでできることを教えてください
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 pb-6">
                  無料プランでは1ページの画像取り込みとシェア機能をご利用いただけます。モーション機能やシール貼替機能はご利用いただけませんが、基本���なシール帳作成をお試しいただけます。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-border rounded-3xl px-6">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  広告はどのように表示されますか？
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 pb-6">
                  無料プランでは大きめの広告が頻繁に表示されます。¥980プラン以上では小型で頻度の低い広告に変更され、より快適にご利用いただけます。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-border rounded-3xl px-6">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  プランの変更や解約はいつでもできますか？
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 pb-6">
                  はい、いつでもプランの変更や解約が可能です。アプリ内の設定画面から簡単に手続きできます。解約後も作成済みのデータは保持されます。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-border rounded-3xl px-6">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  データのバックアップはされますか？
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 pb-6">
                  作成されたシール帳のデータは自動的にクラウドに保存されます。端末を変更された場合でも、同じアカウントでログインすることでデータを引き継ぐことができます。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-border rounded-3xl px-6">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  家族や友達とシール帳を共有できますか？
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 pb-6">
                  はい、全プランでシェア機能をご利用いただけます。作成したシール帳のリンクを送ることで、簡単に共有できます。相手がアプリを持っていなくても閲覧可能です。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border border-border rounded-3xl px-6">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  モーション機能とは何ですか？
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 pb-6">
                  シール帳のページに動きのあるエフェクトを追加できる機能です。ページめくりのアニメーションや、シールが動くエフェクトなど、より楽しいシール帳を作成できます。¥980プラン以上でご利用いただけます。
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border border-border rounded-3xl px-6">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  対応している画像形式を教えてください
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 pb-6">
                  JPEG、PNG、HEIC（iOS）に対応しています。画像は自動的に最適化され、シール帳に適したサイズに調整されます。動画ファイルには対応していません。
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                  <Circle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-medium">シール帳</span>
              </div>
              <p className="text-foreground/70">
                あなたの毎日を貼って、振り返る。デジタルシール帳で思い出を楽しく整理しましょう。
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-4">製品</h3>
              <ul className="space-y-2 text-foreground/70">
                <li><a href="#" className="hover:text-foreground transition-colors">機能一覧</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">料金プラン</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">ギャラリー</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">アップデート情報</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">サポート</h3>
              <ul className="space-y-2 text-foreground/70">
                <li><a href="#" className="hover:text-foreground transition-colors">よくある質問</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">お問い合わせ</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">使い方ガイド</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">コミュニティ</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">法的情報</h3>
              <ul className="space-y-2 text-foreground/70">
                <li><a href="#" className="hover:text-foreground transition-colors">利用規約</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">プライバシーポリシー</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">特定商取引法</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">会社概要</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-foreground/60 text-sm">
              © 2024 シール帳. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
                <Users className="w-5 h-5" />
              </a>
              <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
                <Download className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}