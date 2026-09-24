import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { ArrowLeft, Camera, Upload, RefreshCw, AlertCircle, CheckCircle2, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

interface RealQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess?: (code: string) => void;
}

export const RealQrScannerModal: React.FC<RealQrScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    setScannedResult(null);
    setIsScanning(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported on this browser/environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setHasCamera(true);
        scanLoop();
      }
    } catch (err: any) {
      console.warn('Camera initiation failed:', err);
      setHasCamera(false);
      setCameraError(err.message || 'Unable to access camera. Please allow camera permissions or upload a QR image.');
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Handle scanned code
  const handleQr = (code: string) => {
    if (!code) return;
    setIsScanning(false);
    setScannedResult(code);
    stopCamera();

    if (onScanSuccess) {
      onScanSuccess(code);
      return;
    }

    // Try handling URL or UPI (only if not handled by onScanSuccess callback)
    try {
      showToast('Scanned: ' + code);
    } catch {
      showToast('Invalid or unsupported QR code');
    }
  };

  // Scan frame by frame
  const scanLoop = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code && code.data && code.data.trim().length > 0) {
        handleQr(code.data.trim());
        return;
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanLoop);
  };

  // Image Upload Scanner
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          handleQr(code.data.trim());
        } else {
          showToast('Invalid or unsupported QR code in selected image');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setScannedResult(null);
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#0B1220] text-white animate-fade-in select-none">
      {/* Top App Bar - matches Flutter RealQrScannerPage AppBar */}
      <header className="h-14 px-4 flex items-center justify-between border-b border-[#1c293d] bg-[#0B1220] z-20">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 text-white hover:text-emerald-400 transition-colors cursor-pointer py-2 pr-2"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg font-bold">Scan to Pay</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-lg bg-[#162338] hover:bg-[#20324e] text-emerald-300 border border-[#2b4162] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            title="Upload QR Image"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Upload Image</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </header>

      {/* Main Scanner Body */}
      <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden bg-[#0B1220]">
        {/* Hidden processing canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Video Camera Feed */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          autoPlay
          playsInline
        />

        {/* Camera Permission / Fallback State */}
        {hasCamera === false && !scannedResult && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[#0B1220]/95 text-center z-10">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Camera Scanner Ready</h3>
            <p className="text-sm text-gray-400 max-w-sm mb-6 leading-relaxed">
              {cameraError || 'Allow camera permission to scan directly, or select a QR image to scan.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <button
                type="button"
                onClick={startCamera}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/30"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Camera</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-3 px-4 rounded-xl bg-[#162338] hover:bg-[#20324e] border border-[#2b4162] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Select Image</span>
              </button>
            </div>
          </div>
        )}

        {/* Scanner Overlay Box matching Flutter: 260x260, border: 3px Colors.greenAccent, borderRadius: 20 */}
        {!scannedResult && (
          <>
            <div className="relative z-10 flex items-center justify-center pointer-events-none">
              <div className="w-[260px] h-[260px] rounded-[20px] border-[3px] border-[#69f0ae] shadow-[0_0_25px_rgba(105,240,174,0.35)] relative overflow-hidden bg-emerald-500/5">
                {/* Laser animation bar */}
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#69f0ae] to-transparent animate-pulse absolute top-1/2 -translate-y-1/2 shadow-[0_0_10px_#69f0ae]" />
              </div>
            </div>

            {/* Bottom prompt text - matching Flutter Positioned bottom: 80 */}
            <div className="absolute bottom-20 left-5 right-5 z-10 text-center pointer-events-none">
              <p className="text-white text-base font-medium drop-shadow-md">
                Point your camera at a valid payment QR code
              </p>
            </div>
          </>
        )}

        {/* Scanned Result Modal / Card */}
        {scannedResult && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-[#0B1220]/90 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-sm bg-[#101b29] border border-[#233549] rounded-2xl p-6 text-center shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">QR Code Detected</h3>
              <p className="text-xs text-gray-400 mb-4">Content extracted from scanned code:</p>

              <div className="p-3.5 bg-[#08101a] border border-[#1b2a3c] rounded-xl text-left font-mono text-xs text-emerald-300 break-all max-h-32 overflow-y-auto mb-5 select-text">
                {scannedResult}
              </div>

              <div className="flex flex-col gap-2.5">
                {scannedResult.startsWith('upi://') || scannedResult.startsWith('http') ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (scannedResult.startsWith('http')) {
                        window.open(scannedResult, '_blank', 'noopener,noreferrer');
                      } else {
                        window.location.href = scannedResult;
                      }
                    }}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/40"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Proceed / Open Payment</span>
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={() => {
                    setScannedResult(null);
                    startCamera();
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#162338] hover:bg-[#20324e] border border-[#2b4162] text-white font-semibold text-xs cursor-pointer"
                >
                  Scan Another Code
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white text-xs pt-1 cursor-pointer"
                >
                  Back to Store
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Flutter style SnackBar Toast */}
      {toastMessage && (
        <div className="absolute bottom-6 left-4 right-4 z-50 flex items-center gap-2.5 bg-[#1b2638] text-white px-4 py-3 rounded-xl border border-[#344b6a] shadow-xl text-sm animate-slide-up">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="flex-1">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
