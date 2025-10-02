/**
 * 斜め切り取り自動補正（見開き対応）
 * OpenCV.js を使用した射影変換ベースの補正
 */

export type DeskewMode = 'LEFT' | 'RIGHT' | 'SPREAD';

export interface DeskewResult {
  image: ImageData;
  foldX?: number; // 綴じ部のX座標（見開き時）
  homography?: number[]; // 射影変換行列（3x3を平坦化）
  confidence: number; // 補正成功の信頼度 0-1
}

export interface DeskewOptions {
  mode: DeskewMode;
  maxSize?: number; // リサイズ上限（デフォルト1280）
  cannyLow?: number; // Cannyエッジ検出の下限（デフォルト50）
  cannyHigh?: number; // Cannyエッジ検出の上限（デフォルト150）
  minContourArea?: number; // 最小輪郭面積（画像面積比、デフォルト0.1）
}

/**
 * 斜め撮影された見開きページを自動補正
 * 
 * アルゴリズム:
 * 1. リサイズ → グレースケール → ガウシアンブラー → Canny
 * 2. 最大面積の四角形輪郭を検出（approxPolyDP）
 * 3. getPerspectiveTransform で射影変換行列を計算
 * 4. warpPerspective で正面化
 * 5. 見開き時: HoughLinesP で縦の綴じ線を検出
 * 6. mode に応じて左/右/全体を切り出し
 * 
 * @param input 入力画像（ImageData）
 * @param options 補正オプション
 * @returns 補正結果
 */
export async function deskewAndCrop(
  input: ImageData,
  options: DeskewOptions
): Promise<DeskewResult> {
  const {
    mode,
    maxSize = 1280,
    cannyLow = 50,
    cannyHigh = 150,
    minContourArea = 0.1,
  } = options;

  // OpenCV.js の動的ロード（Web環境）
  if (typeof window !== 'undefined' && !window.cv) {
    throw new Error('OpenCV.js not loaded. Please load opencv.js before calling deskewAndCrop.');
  }

  // React Native環境ではネイティブブリッジを使用
  if (typeof window === 'undefined') {
    return deskewAndCropNative(input, options);
  }

  const cv = window.cv;
  
  try {
    // 1. ImageData → cv.Mat
    const src = cv.matFromImageData(input);
    const original = src.clone();
    
    // 2. リサイズ（長辺がmaxSizeを超える場合）
    const scale = Math.min(1, maxSize / Math.max(src.cols, src.rows));
    const resized = new cv.Mat();
    const dsize = new cv.Size(src.cols * scale, src.rows * scale);
    cv.resize(src, resized, dsize, 0, 0, cv.INTER_LINEAR);
    
    // 3. グレースケール → ガウシアン → Canny
    const gray = new cv.Mat();
    cv.cvtColor(resized, gray, cv.COLOR_RGBA2GRAY);
    
    const blurred = new cv.Mat();
    const ksize = new cv.Size(5, 5);
    cv.GaussianBlur(gray, blurred, ksize, 0);
    
    const edges = new cv.Mat();
    cv.Canny(blurred, edges, cannyLow, cannyHigh);
    
    // 4. 輪郭検出
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    
    // 5. 最大面積の四角形を検出
    let maxArea = 0;
    let bestQuad: cv.Mat | null = null;
    const imageArea = resized.cols * resized.rows;
    
    for (let i = 0; i < contours.size(); i++) {
      const contour = contours.get(i);
      const area = cv.contourArea(contour);
      
      if (area < imageArea * minContourArea) continue;
      
      const peri = cv.arcLength(contour, true);
      const approx = new cv.Mat();
      cv.approxPolyDP(contour, approx, 0.02 * peri, true);
      
      if (approx.rows === 4 && area > maxArea) {
        maxArea = area;
        if (bestQuad) bestQuad.delete();
        bestQuad = approx.clone();
      }
      
      approx.delete();
      contour.delete();
    }
    
    let warped: cv.Mat;
    let confidence = 0;
    let homography: number[] | undefined;
    
    if (bestQuad && maxArea > imageArea * 0.3) {
      // 6. 射影変換
      confidence = Math.min(1, maxArea / (imageArea * 0.8));
      
      // 四角形の頂点を並び替え（左上→右上→右下→左下）
      const points = orderPoints(bestQuad);
      const srcPoints = cv.matFromArray(4, 1, cv.CV_32FC2, points);
      
      // 変換後の矩形サイズを計算
      const [tl, tr, br, bl] = reshapePoints(points);
      const widthA = distance(br, bl);
      const widthB = distance(tr, tl);
      const maxWidth = Math.max(widthA, widthB);
      const heightA = distance(tr, br);
      const heightB = distance(tl, bl);
      const maxHeight = Math.max(heightA, heightB);
      
      const dstPoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
        0, 0,
        maxWidth - 1, 0,
        maxWidth - 1, maxHeight - 1,
        0, maxHeight - 1,
      ]);
      
      const M = cv.getPerspectiveTransform(srcPoints, dstPoints);
      homography = Array.from(M.data64F);
      
      warped = new cv.Mat();
      const warpSize = new cv.Size(maxWidth, maxHeight);
      cv.warpPerspective(original, warped, M, warpSize);
      
      // クリーンアップ
      srcPoints.delete();
      dstPoints.delete();
      M.delete();
      bestQuad.delete();
    } else {
      // フォールバック: 回転のみ補正
      confidence = 0.3;
      const rect = cv.minAreaRect(edges);
      const angle = rect.angle < -45 ? rect.angle + 90 : rect.angle;
      
      warped = new cv.Mat();
      const center = new cv.Point(original.cols / 2, original.rows / 2);
      const M = cv.getRotationMatrix2D(center, angle, 1.0);
      cv.warpAffine(original, warped, M, new cv.Size(original.cols, original.rows));
      
      M.delete();
    }
    
    // 7. 見開き検出（綴じ線）
    let foldX: number | undefined;
    
    if (mode !== 'SPREAD') {
      const warpedGray = new cv.Mat();
      cv.cvtColor(warped, warpedGray, cv.COLOR_RGBA2GRAY);
      
      const lines = new cv.Mat();
      cv.HoughLinesP(
        warpedGray,
        lines,
        1,
        Math.PI / 180,
        100,
        warped.rows * 0.5,
        30
      );
      
      // 中央付近の最長縦線を検出
      let maxLength = 0;
      const centerX = warped.cols / 2;
      const tolerance = warped.cols * 0.2;
      
      for (let i = 0; i < lines.rows; i++) {
        const x1 = lines.data32S[i * 4];
        const y1 = lines.data32S[i * 4 + 1];
        const x2 = lines.data32S[i * 4 + 2];
        const y2 = lines.data32S[i * 4 + 3];
        
        const avgX = (x1 + x2) / 2;
        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const isVertical = Math.abs(x2 - x1) < 30;
        const isNearCenter = Math.abs(avgX - centerX) < tolerance;
        
        if (isVertical && isNearCenter && length > maxLength) {
          maxLength = length;
          foldX = avgX;
        }
      }
      
      lines.delete();
      warpedGray.delete();
    }
    
    // 8. mode に応じてクロップ
    let final: cv.Mat;
    
    if (mode === 'LEFT' && foldX) {
      const rect = new cv.Rect(0, 0, Math.floor(foldX), warped.rows);
      final = warped.roi(rect);
    } else if (mode === 'RIGHT' && foldX) {
      const rect = new cv.Rect(Math.floor(foldX), 0, warped.cols - Math.floor(foldX), warped.rows);
      final = warped.roi(rect);
    } else {
      final = warped;
    }
    
    // 9. cv.Mat → ImageData
    const canvas = document.createElement('canvas');
    canvas.width = final.cols;
    canvas.height = final.rows;
    cv.imshow(canvas, final);
    const ctx = canvas.getContext('2d')!;
    const resultImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // クリーンアップ
    src.delete();
    original.delete();
    resized.delete();
    gray.delete();
    blurred.delete();
    edges.delete();
    contours.delete();
    hierarchy.delete();
    warped.delete();
    if (final !== warped) final.delete();
    
    return {
      image: resultImageData,
      foldX,
      homography,
      confidence,
    };
  } catch (error) {
    console.error('Deskew error:', error);
    throw error;
  }
}

/**
 * React Native用のネイティブブリッジ実装
 * TODO: react-native-opencv3 または独自ネイティブモジュールで実装
 */
async function deskewAndCropNative(
  input: ImageData,
  options: DeskewOptions
): Promise<DeskewResult> {
  // 現時点ではダミー実装（将来的にネイティブモジュールを追加）
  console.warn('Native deskew not implemented yet, returning original image');
  return {
    image: input,
    confidence: 0,
  };
}

/**
 * 四角形の頂点を左上→右上→右下→左下の順に並び替え
 */
function orderPoints(quad: any): number[] {
  const pts = [];
  for (let i = 0; i < 4; i++) {
    pts.push({ x: quad.data32S[i * 2], y: quad.data32S[i * 2 + 1] });
  }
  
  // 重心を計算
  const cx = pts.reduce((sum, p) => sum + p.x, 0) / 4;
  const cy = pts.reduce((sum, p) => sum + p.y, 0) / 4;
  
  // 角度でソート
  pts.sort((a, b) => {
    const angleA = Math.atan2(a.y - cy, a.x - cx);
    const angleB = Math.atan2(b.y - cy, b.x - cx);
    return angleA - angleB;
  });
  
  // 左上が最初に来るように調整
  const topLeftIdx = pts.findIndex(p => p.x < cx && p.y < cy);
  if (topLeftIdx > 0) {
    const rotated = [...pts.slice(topLeftIdx), ...pts.slice(0, topLeftIdx)];
    return rotated.flatMap(p => [p.x, p.y]);
  }
  
  return pts.flatMap(p => [p.x, p.y]);
}

function reshapePoints(points: number[]): Array<[number, number]> {
  return [
    [points[0], points[1]],
    [points[2], points[3]],
    [points[4], points[5]],
    [points[6], points[7]],
  ];
}

function distance(p1: [number, number], p2: [number, number]): number {
  return Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2);
}

// OpenCV.js型定義の拡張
declare global {
  interface Window {
    cv: any;
  }
}

