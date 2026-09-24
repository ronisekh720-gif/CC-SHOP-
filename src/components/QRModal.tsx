import React, { useState } from 'react';
import { QRCodeDisplay } from './QRCodeDisplay';
import { X, QrCode, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount?: number;
  upiId?: string;
  onOpenScanner?: () => void;
}

export const QRModal: React.FC<QRModalProps> = ({
  isOpen,
  onClose,
  amount,
  upiId = 'typepfcc@ptaxis',
  onOpenScanner
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[420px] bg-[#0e1927] border border-[#2e4258] rounded-[24px] p-6 text-center shadow-2xl relative"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white bg-[#1a293c] p-1.5 rounded-full border border-[#34485e] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>OFFICIAL QR CODE</span>
        </div>

        <h2 className="text-xl font-bold text-white mb-1">
          CC SHOP ZONE Quick Pay
        </h2>
        <p className="text-xs text-gray-400 mb-4">
          Scan with any UPI Scanner to initiate instant verified checkout.
        </p>

        <QRCodeDisplay
          size={220}
          upiId={upiId}
          amount={amount}
          title=""
          subtitle=""
          showCardWrapper={false}
        />

        <div className="mt-4 pt-3 border-t border-[#233549] flex items-center justify-center gap-2 text-xs text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>256-Bit SSL Encrypted & Instant Delivery</span>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          {onOpenScanner && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenScanner();
              }}
              className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/30"
            >
              <QrCode className="w-4 h-4" />
              <span>Camera QR Scanner</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-[#162538] hover:bg-[#1e324a] text-white text-xs font-bold border border-[#34485e] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
