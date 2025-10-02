import { useState, useEffect } from 'react'
import { StickerLandingPage } from './components/sticker-landing-page'
import { LoginPage } from './components/login-page'
import { OnboardingPage } from './components/onboarding-page'
import { AlbumListPage } from './components/album-list-page'
import { AlbumDetailPage } from './components/album-detail-page'
import { StorePage } from './components/store-page'
import { SettingsPage } from './components/settings-page'
import { CameraCapturePage } from './components/camera-capture-page'
import { ImageEditPage } from './components/image-edit-page'

export type Screen = 
  | 'landing'
  | 'login'
  | 'onboarding'
  | 'album-list'
  | 'album-detail'
  | 'store'
  | 'settings'
  | 'camera-capture'
  | 'image-edit'

export interface AppContext {
  currentScreen: Screen
  setCurrentScreen: (screen: Screen) => void
  selectedAlbumId?: string
  setSelectedAlbumId: (id: string) => void
  isDarkMode: boolean
  setIsDarkMode: (dark: boolean) => void
  capturedImage?: string
  setCapturedImage: (image: string) => void
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing')
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string>('')

  const toggleDarkMode = (dark: boolean) => {
    setIsDarkMode(dark)
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const appContext: AppContext = {
    currentScreen,
    setCurrentScreen,
    selectedAlbumId,
    setSelectedAlbumId,
    isDarkMode,
    setIsDarkMode: toggleDarkMode,
    capturedImage,
    setCapturedImage
  }

  useEffect(() => {
    // Initialize dark mode from localStorage or system preference
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode) {
      toggleDarkMode(savedDarkMode === 'true')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      toggleDarkMode(prefersDark)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString())
  }, [isDarkMode])

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <StickerLandingPage appContext={appContext} />
      case 'login':
        return <LoginPage appContext={appContext} />
      case 'onboarding':
        return <OnboardingPage appContext={appContext} />
      case 'album-list':
        return <AlbumListPage appContext={appContext} />
      case 'album-detail':
        return <AlbumDetailPage appContext={appContext} />
      case 'store':
        return <StorePage appContext={appContext} />
      case 'settings':
        return <SettingsPage appContext={appContext} />
      case 'camera-capture':
        return <CameraCapturePage appContext={appContext} />
      case 'image-edit':
        return <ImageEditPage 
          onBack={() => setCurrentScreen('camera-capture')}
          onSave={(data) => {
            console.log('Saved sticker album:', data)
            setCurrentScreen('album-list')
          }}
          capturedImage={capturedImage}
        />
      default:
        return <StickerLandingPage appContext={appContext} />
    }
  }

  return (
    <div className="min-h-screen bg-background transition-all duration-300">
      {renderScreen()}
    </div>
  )
}