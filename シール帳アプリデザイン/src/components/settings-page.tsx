import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Separator } from './ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { AppContext } from '../App'
import {
  ArrowLeft,
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Download,
  Share2,
  HelpCircle,
  Mail,
  Moon,
  Sun,
  Smartphone,
  Volume2,
  VolumeX,
  Globe,
  Camera,
  Crown,
  Star,
  LogOut,
  Trash2,
  Edit
} from 'lucide-react'

interface SettingsPageProps {
  appContext: AppContext
}

export function SettingsPage({ appContext }: SettingsPageProps) {
  const [profileName, setProfileName] = useState('ユーザー名')
  const [profileBio, setProfileBio] = useState('シール帳を楽しんでいます！')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [autoBackup, setAutoBackup] = useState(true)
  const [publicProfile, setPublicProfile] = useState(false)
  const [language, setLanguage] = useState('ja')
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const currentPlan = '無料プラン'
  const storageUsed = '15'
  const storageLimit = '100'

  const handleLogout = () => {
    appContext.setCurrentScreen('landing')
  }

  const handleUpgrade = () => {
    setShowUpgradeModal(true)
  }

  const handleSettingClick = (id: string) => {
    switch (id) {
      case 'profile':
        setShowProfileModal(true)
        break
      case 'subscription':
        handleUpgrade()
        break
      case 'logout':
        handleLogout()
        break
      default:
        break
    }
  }

  const settingSections = [
    {
      title: 'アカウント',
      icon: User,
      items: [
        {
          id: 'profile',
          title: 'プロフィール編集',
          description: '名前やプロフィール画像を変更',
          action: 'edit'
        },
        {
          id: 'plan',
          title: 'プラン管理',
          description: currentPlan,
          action: 'view',
          badge: currentPlan === '無料プラン' ? 'Free' : 'Pro'
        }
      ]
    },
    {
      title: '通知',
      icon: Bell,
      items: [
        {
          id: 'push-notifications',
          title: 'プッシュ通知',
          description: '新しいシールや更新をお知らせ',
          action: 'toggle',
          value: notificationsEnabled,
          onChange: setNotificationsEnabled
        },
        {
          id: 'sound',
          title: 'サウンド',
          description: '効果音とフィードバック音',
          action: 'toggle',
          value: soundEnabled,
          onChange: setSoundEnabled
        }
      ]
    },
    {
      title: '外観',
      icon: Palette,
      items: [
        {
          id: 'theme',
          title: 'ダークモード',
          description: '暗いテーマを使用',
          action: 'toggle',
          value: appContext.isDarkMode,
          onChange: appContext.setIsDarkMode
        },
        {
          id: 'language',
          title: '言語設定',
          description: '日本語',
          action: 'select'
        }
      ]
    },
    {
      title: 'データ',
      icon: Shield,
      items: [
        {
          id: 'backup',
          title: '自動バックアップ',
          description: 'クラウドに自動保存',
          action: 'toggle',
          value: autoBackup,
          onChange: setAutoBackup
        },
        {
          id: 'storage',
          title: 'ストレージ使用量',
          description: `${storageUsed}MB / ${storageLimit}MB使用中`,
          action: 'view'
        },
        {
          id: 'export',
          title: 'データエクスポート',
          description: 'アルバムをエクスポート',
          action: 'button'
        }
      ]
    },
    {
      title: 'プライバシー',
      icon: Shield,
      items: [
        {
          id: 'public-profile',
          title: '公開プロフィール',
          description: '他のユーザーがプロフィールを閲覧可能',
          action: 'toggle',
          value: publicProfile,
          onChange: setPublicProfile
        },
        {
          id: 'analytics',
          title: 'データ分析',
          description: 'アプリ改善のためのデータ収集',
          action: 'toggle',
          value: true,
          onChange: () => {}
        }
      ]
    },
    {
      title: 'サポート',
      icon: HelpCircle,
      items: [
        {
          id: 'help',
          title: 'ヘルプセンター',
          description: 'よくある質問と使い方',
          action: 'link'
        },
        {
          id: 'contact',
          title: 'お問い合わせ',
          description: 'サポートチームに連絡',
          action: 'link'
        },
        {
          id: 'feedback',
          title: 'フィードバック',
          description: 'アプリの改善提案',
          action: 'link'
        }
      ]
    }
  ]

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
              <h1 className="font-bold">設定</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6 max-w-2xl">
        {/* Profile Card */}
        <Card className="border-0 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="" alt={profileName} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xl">
                    {profileName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full p-0 bg-background border"
                >
                  <Camera className="w-3 h-3" />
                </Button>
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold mb-1">{profileName}</h3>
                <p className="text-sm text-muted-foreground mb-2">{profileBio}</p>
                <div className="flex items-center gap-2">
                  <Badge variant={currentPlan === '無料プラン' ? 'secondary' : 'default'}>
                    {currentPlan === '無料プラン' ? (
                      <>
                        <User className="w-3 h-3 mr-1" />
                        無料
                      </>
                    ) : (
                      <>
                        <Crown className="w-3 h-3 mr-1" />
                        Pro
                      </>
                    )}
                  </Badge>
                  {currentPlan === '無料プラン' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleUpgrade}
                      className="text-xs"
                    >
                      アップグレード
                    </Button>
                  )}
                </div>
              </div>

              <Button variant="ghost" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Storage Usage */}
        <Card className="border-0 bg-card/50 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">ストレージ使用量</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {storageUsed}MB / {storageLimit}MB
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${(parseInt(storageUsed) / parseInt(storageLimit)) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              あと{parseInt(storageLimit) - parseInt(storageUsed)}MB利用可能
            </p>
          </CardContent>
        </Card>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => {
          const SectionIcon = section.icon
          return (
            <Card key={section.title} className="border-0 bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <SectionIcon className="w-5 h-5 text-primary" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-1">
                {section.items.map((item, itemIndex) => (
                  <div key={item.id}>
                    <div className="flex items-center justify-between py-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{item.title}</span>
                          {item.badge && (
                            <Badge variant="outline" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      
                      <div className="ml-4">
                        {item.action === 'toggle' && (
                          <Switch
                            checked={item.value}
                            onCheckedChange={item.onChange}
                          />
                        )}
                        {item.action === 'edit' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleSettingClick(item.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {item.action === 'button' && (
                          <Button variant="outline" size="sm">
                            実行
                          </Button>
                        )}
                        {(item.action === 'view' || item.action === 'link' || item.action === 'select') && (
                          <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 rotate-180" />
                          </Button>
                        )}
                      </div>
                    </div>
                    {itemIndex < section.items.length - 1 && (
                      <Separator className="opacity-50" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        })}

        {/* Quick Actions */}
        <Card className="border-0 bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle>クイックアクション</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Share2 className="w-4 h-4 mr-2" />
              アプリを友達に紹介
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Star className="w-4 h-4 mr-2" />
              アプリを評価
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <HelpCircle className="w-4 h-4 mr-2" />
              使い方ガイド
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="border-0 bg-muted/30">
          <CardContent className="p-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">シール帳 v1.0.0</p>
            <p className="text-xs text-muted-foreground">
              © 2024 Sticker Album. All rights reserved.
            </p>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-destructive">危険な操作</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start text-destructive border-destructive/20 hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              すべてのデータを削除
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              ログアウト
            </Button>
          </CardContent>
        </Card>

        {/* Bottom spacing for mobile */}
        <div className="h-20 sm:h-0" />
      </div>

      {/* Profile Edit Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>プロフィール編集</DialogTitle>
            <DialogDescription>
              プロフィール情報を編集できます
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback>
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                <Camera className="w-4 h-4 mr-2" />
                写真を変更
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">ユーザー名</Label>
              <Input
                id="name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="ユーザー名を入力"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">自己紹介</Label>
              <Textarea
                id="bio"
                value={profileBio}
                onChange={(e) => setProfileBio(e.target.value)}
                placeholder="自己紹介を入力"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="public-profile">プロフィールを公開</Label>
              <Switch
                id="public-profile"
                checked={publicProfile}
                onCheckedChange={setPublicProfile}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowProfileModal(false)}
                className="flex-1"
              >
                キャンセル
              </Button>
              <Button 
                onClick={() => setShowProfileModal(false)}
                className="flex-1"
              >
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>プランをアップグレード</DialogTitle>
            <DialogDescription>
              より多くの機能を利用できます
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4">
              <Card className="border-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">スタンダードプラン</CardTitle>
                    <Badge className="bg-primary">人気</Badge>
                  </div>
                  <CardDescription>日常使いに最適</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-2xl font-bold">¥980<span className="text-sm font-normal">/月</span></div>
                  <ul className="text-sm space-y-1">
                    <li>• 2～10ページ</li>
                    <li>• シール貼り替え可能</li>
                    <li>• モーション追加</li>
                    <li>• 広告少ない</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">プレミアムプラン</CardTitle>
                    <Badge variant="secondary">最高級</Badge>
                  </div>
                  <CardDescription>クリエイターにおすすめ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-2xl font-bold">¥1,980<span className="text-sm font-normal">/月</span></div>
                  <ul className="text-sm space-y-1">
                    <li>• 無制限ページ</li>
                    <li>• シール貼り替え可能</li>
                    <li>• 高品質シェア機能</li>
                    <li>• 広告なし</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1"
              >
                後で
              </Button>
              <Button 
                onClick={() => {
                  setShowUpgradeModal(false)
                  // Navigate to payment
                  console.log('Upgrading...')
                }}
                className="flex-1"
              >
                アップグレード
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}