import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, Copy, Check, Download, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

interface QRCodeDisplayProps {
  value?: string;
  size?: number;
  title?: string;
  subtitle?: string;
  upiId?: string;
  amount?: number;
  showCardWrapper?: boolean;
  onScanClick?: () => void;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 200,
  title = 'Scan & Pay QR Code',
  subtitle = 'Scan with any UPI App (GPay, PhonePe, Paytm, BHIM)',
  upiId,
  amount,
  showCardWrapper = true,
  onScanClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string>('');
  const [selectedUpi, setSelectedUpi] = useState<string>(upiId || 'typepfcc@ptaxis');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeUpi = selectedUpi;

  const qrPayload = amount
    ? `upi://pay?pa=${activeUpi}&pn=CCSTORE&am=${amount}&cu=INR`
    : (value || `upi://pay?pa=${activeUpi}&pn=CCSTORE&cu=INR`);

  useEffect(() => {
    const generateQR = async () => {
      try {
        if (canvasRef.current) {
          await QRCode.toCanvas(canvasRef.current, qrPayload, {
            width: size,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#ffffff'
            },
            errorCorrectionLevel: 'H'
          });
        }
        const url = await QRCode.toDataURL(qrPayload, {
          width: 400,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          },
          errorCorrectionLevel: 'H'
        });
        setDataUrl(url);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };

    generateQR();
  }, [qrPayload, size]);

  const handleCopyUpi = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadQR = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `CCStore-QRCode-${amount ? '₹' + amount : 'Payment'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const content = (
    <div className="flex flex-col items-center text-center">
      {/* Title & Badge */}
      {title && (
        <div className="flex items-center gap-1.5 mb-1.5">
          <QrCode className="w-4 h-4 text-amber-400" />
          <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">{title}</h3>
        </div>
      )}
      {subtitle && (
        <p className="text-xs text-gray-400 mb-3 max-w-[280px]">{subtitle}</p>
      )}

      {/* QR Code Container with Frame */}
      <div 
        onClick={onScanClick}
        className="relative group p-3 bg-white rounded-2xl shadow-xl shadow-black/40 cursor-pointer transition-transform hover:scale-[1.02] border-2 border-amber-400/40"
      >
        <canvas ref={canvasRef} className="rounded-lg block mx-auto" />
        
        {/* Subtle center logo badge */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 rounded-full bg-neutral-900 border-2 border-amber-400 flex items-center justify-center text-[10px] font-black text-amber-400 shadow-md">
            CC
          </div>
        </div>

        {amount && (
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-neutral-900 border border-amber-400/60 text-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-lg whitespace-nowrap">
            ₹{amount}
          </div>
        )}
      </div>

      {/* UPI Info and Actions */}
      <div className="w-full mt-4 space-y-2 max-w-[340px]">
        <div className="bg-[#0b1626] border border-[#263b52] rounded-xl px-3 py-2.5 flex items-center justify-between text-xs">
          <div className="text-left">
            <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">
              UPI ID
            </span>
            <span className="text-white font-mono font-bold text-sm tracking-wide">
              {activeUpi}
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleCopyUpi(activeUpi)}
            className="inline-flex items-center gap-1.5 bg-[#1a2d42] hover:bg-[#253e5c] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-[#3b5578]"
          >
            {copiedId === activeUpi ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 text-[11px] font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleDownloadQR}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#152336] hover:bg-[#1f324c] border border-[#314660] text-gray-200 text-xs font-semibold py-2 px-3 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Save QR</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (!showCardWrapper) {
    return content;
  }

  return (
    <div className="mx-5 my-5 p-5 sm:p-6 bg-[#101b29] border border-[#2a3c50] rounded-[22px] shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />
      {content}
    </div>
  );
};
