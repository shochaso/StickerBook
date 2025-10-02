import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { AppContext } from '../App'
import { 
  Circle, 
  Sparkles, 
  Users, 
  Share2, 
  ArrowRight, 
  ArrowLeft,
  Heart,
  Star,
  Camera,
  Zap
} from 'lucide-react'

interface OnboardingPageProps {
  appContext: AppContext
}

interface OnboardingStep {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  features: string[]
  background: string
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: 'シール帳へようこそ！',
    description: 'デジタルシールで楽しいコレクションを始めましょう',
    icon: <Circle className="w-12 h-12 text-white" />,
    features: [
      '美しいデジタルシールコレクション',
      'いつでもどこでもアクセス可能',
      '友達と楽しく共有'
    ],
    background: 'from-primary/20 to-accent/20'
  },
  {
    id: 2,
    title: 'シールを集めよう',
    description: 'お気に入りのシールを見つけて、あなただけのコレクションを作りましょう',
    icon: <Sparkles className="w-12 h-12 text-white" />,
    features: [
      '豊富なシールカテゴリ',
      '毎週新しいシール追加',
      '限定シールも登場'
    ],
    background: 'from-secondary/20 to-primary/20'
  },
  {
    id: 3,
    title: 'アルバムを作成',
    description: 'テーマ別にシールを整理して、素敵なアルバムを作りましょう',
    icon: <Heart className="w-12 h-12 text-white" />,
    features: [
      'カスタマイズ可能なアルバム',
      'ドラッグ&ドロップで簡単配置',
      '背景やテーマを選択'
    ],
    background: 'from-accent/20 to-secondary/20'
  },
  {
    id: 4,
    title: '友達と共有',
    description: 'あなたの作品を友達と共有して、一緒に楽しみましょう',
    icon: <Users className="w-12 h-12 text-white" />,
    features: [
      'SNSで簡単シェア',
      '友達のコレクションを見る',
      'いいね！やコメント機能'
    ],
    background: 'from-primary/20 to-accent/20'
  }
]

export function OnboardingPage({ appContext }: OnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const totalSteps = onboardingSteps.length

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      appContext.setCurrentScreen('album-list')
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    appContext.setCurrentScreen('album-list')
  }

  const step = onboardingSteps[currentStep]
  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-secondary/10 to-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            戻る
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground"
          >
            スキップ
          </Button>
        </div>

        {/* Progress */}
        <div className="px-4 md:px-6 mb-8">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                {currentStep + 1} / {totalSteps}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2 rounded-full" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-8">
            {/* Step Card */}
            <Card className={`bg-gradient-to-br ${step.background} border-0 shadow-2xl backdrop-blur`}>
              <CardContent className="p-8 text-center space-y-6">
                {/* Icon */}
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                  {step.icon}
                </div>

                {/* Title & Description */}
                <div className="space-y-3">
                  <h1 className="text-2xl font-bold">{step.title}</h1>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {step.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-left">
                      <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                        <Star className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex gap-3">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="flex-1 rounded-2xl border-border"
                >
                  前へ
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                className="flex-1 rounded-2xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                {currentStep === totalSteps - 1 ? (
                  <>
                    はじめる
                    <Zap className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    次へ
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>

            {/* Step Indicators */}
            <div className="flex justify-center gap-2">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-gradient-to-r from-primary to-accent w-6'
                      : index < currentStep
                      ? 'bg-primary/50'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="p-4 text-center">
          <div className="flex justify-center gap-4 opacity-20">
            <Circle className="w-4 h-4 text-primary" />
            <Sparkles className="w-4 h-4 text-secondary" />
            <Heart className="w-4 h-4 text-accent" />
            <Star className="w-4 h-4 text-primary" />
            <Camera className="w-4 h-4 text-secondary" />
          </div>
        </div>
      </div>
    </div>
  )
}