import React from 'react';
import { CardItem } from '../types';
import { ShieldCheck, Zap, Lock, Award, Check, X, ArrowRight } from 'lucide-react';

interface PlanModalProps {
  card: CardItem | null;
  onClose: () => void;
  onSelectCardForPay: (card: CardItem) => void;
}

export const PlanModal: React.FC<PlanModalProps> = ({
  card,
  onClose,
  onSelectCardForPay,
}) => {
  if (!card) return null;

  return (
    <div
      id="plan-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        id="plan-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[480px] border border-[#34465c]/50 rounded-[22px] p-6 text-left shadow-2xl relative max-h-[90vh] overflow-y-auto"
        style={{
          background: 'rgba(16, 27, 41, 0.70)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#25374d] pb-4 mb-4">
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
              Purchase Plan Details
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              {card.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#182637] text-gray-400 hover:text-white flex items-center justify-center border border-[#31455d] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pricing Banner */}
        <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 border border-amber-500/30 rounded-xl p-4 mb-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-300">Plan Price:</div>
            <div className="text-2xl font-black text-white font-mono flex items-baseline gap-2">
              ₹{card.price}
              {card.originalPrice && (
                <span className="text-xs line-through text-gray-400 font-normal">
                  ₹{card.originalPrice}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-300">Spending Ceiling:</div>
            <div className="text-base font-bold text-emerald-400 font-mono">
              {card.limit} Limit
            </div>
          </div>
        </div>

        {/* Plan Guarantees & Features */}
        <div className="space-y-3 mb-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Included with this Purchase Plan:
          </h4>

          {card.features.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-200">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mt-0.5 shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span>{feat}</span>
            </div>
          ))}

          <div className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-200">
            <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mt-0.5 shrink-0">
              <Zap className="w-3 h-3" />
            </div>
            <span>Instant delivery in "Your Delivery" vault within 3 seconds</span>
          </div>

          <div className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-200">
            <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mt-0.5 shrink-0">
              <Lock className="w-3 h-3" />
            </div>
            <span>100% Encrypted Sandbox Key Tokens & Auto Backup</span>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-[#0b1420] border border-[#273d55] rounded-xl p-3.5 mb-5 text-xs text-gray-400 leading-relaxed flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-gray-200">Protected Mode:</strong> All transactions are performed in Verified Mode with simulated UPI checkout.
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            id="btn-plan-proceed"
            onClick={() => {
              onClose();
              onSelectCardForPay(card);
            }}
            className="demo-checkout w-full"
          >
            Proceed to Checkout (₹{card.price}) →
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#162436] hover:bg-[#1f324a] text-white text-xs font-semibold border border-[#3a4b60] cursor-pointer"
          >
            Close Plan Details
          </button>
        </div>
      </div>
    </div>
  );
};
