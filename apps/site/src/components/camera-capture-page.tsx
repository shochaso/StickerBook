import { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { AppContext } from '../App'
import {
  Camera,
  X,
  RotateCcw,
  Zap,
  ZapOff,
  Grid3X3,
  ScanLine,
  Check,
  ArrowLeft,
  ImageIcon,
  Download,
  Crop
} from 'lucide-react'

interface CameraCapturePageProps {
  appContext: AppContext
}

export function CameraCapturePage({ appContext }: CameraCapturePageProps) {
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [gridEnabled, setGridEnabled] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Camera access error:', error)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext('2d')
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      if (context) {
        context.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL('image/jpeg', 0.9)
        setCapturedImage(imageData)
        setShowPreview(true)
      }
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    setShowPreview(false)
  }

  const confirmPhoto = () => {
    if (capturedImage) {
      appContext.setCapturedImage(capturedImage)
      appContext.setCurrentScreen('image-edit')
    }
  }

  const handleBack = () => {
    stopCamera()
    appContext.setCurrentScreen('album-list')
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4">
        <div className="flex items-center justify-between text-white">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-white hover:bg-white/20 rounded-full p-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setGridEnabled(!gridEnabled)}
              className={`text-white hover:bg-white/20 rounded-full p-2 ${
                gridEnabled ? 'bg-white/20' : ''
              }`}
            >
              <Grid3X3 className="w-6 h-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFlashEnabled(!flashEnabled)}
              className={`text-white hover:bg-white/20 rounded-full p-2 ${
                flashEnabled ? 'bg-white/20' : ''
              }`}
            >
              {flashEnabled ? (
                <Zap className="w-6 h-6" />
              ) : (
                <ZapOff className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Camera View */}
      <div className="relative w-full h-full">
        {!showPreview ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Grid overlay */}
            {gridEnabled && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="border border-white/30"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Scan frame - Portrait orientation for sticker album */}
            <div className="absolute top-8 bottom-32 left-8 right-8 border-2 border-primary rounded-3xl pointer-events-none max-w-sm mx-auto aspect-[3/4]">
              <div className="absolute -top-1 -left-1 w-8 h-8 border-l-4 border-t-4 border-white rounded-tl-2xl" />
              <div className="absolute -top-1 -right-1 w-8 h-8 border-r-4 border-t-4 border-white rounded-tr-2xl" />
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-l-4 border-b-4 border-white rounded-bl-2xl" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-r-4 border-b-4 border-white rounded-br-2xl" />
              
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur">
                  シール帳をフレーム内に収めてください
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <img
              src={capturedImage || ''}
              alt="Captured"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        {!showPreview ? (
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-8">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 rounded-full p-3"
                onClick={() => {
                  appContext.setCurrentScreen('gallery-selection')
                }}
              >
                <ImageIcon className="w-8 h-8" />
              </Button>

              <Button
                size="lg"
                onClick={capturePhoto}
                disabled={isCapturing}
                className="w-20 h-20 rounded-full bg-white border-4 border-white/30 hover:bg-white/90 flex items-center justify-center"
              >
                <Camera className="w-10 h-10 text-black" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 rounded-full p-3"
                onClick={() => {
                  // Switch camera (front/back)
                  console.log('Switch camera')
                }}
              >
                <RotateCcw className="w-8 h-8" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              onClick={retakePhoto}
              className="rounded-2xl bg-black/50 border-white/30 text-white hover:bg-black/70"
            >
              <X className="w-4 h-4 mr-2" />
              撮り直し
            </Button>
            
            <Button
              onClick={confirmPhoto}
              className="rounded-2xl bg-gradient-to-r from-primary to-secondary px-8"
            >
              <Check className="w-4 h-4 mr-2" />
              この写真を使用
            </Button>
          </div>
        )}
      </div>

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Tips */}
      {!showPreview && (
        <div className="absolute bottom-24 left-4 right-4">
          <Card className="bg-black/50 border-white/20 backdrop-blur">
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <ScanLine className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="text-white text-sm">
                  <p className="font-medium mb-1">撮影のコツ</p>
                  <ul className="text-xs text-white/80 space-y-1">
                    <li>• シール帳を縦向きでフレーム内に収めてください</li>
                    <li>• 明るい場所で撮影すると認識精度が向上します</li>
                    <li>• ページが平らになるよう整えてください</li>
                    <li>• シール帳全体が見えるよう少し距離を取ってください</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}