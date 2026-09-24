import React, { useState, useEffect } from 'react';
import { PurchasedOrder } from '../types';
import { DeliveryVideoGuide } from './DeliveryVideoGuide';
import {
  Package,
  Copy,
  Check,
  ShieldCheck,
  Eye,
  EyeOff,
  Trash2,
  X,
  ExternalLink,
  Lock,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

interface DeliveryVaultModalProps {
  orders: PurchasedOrder[];
  onClose: () => void;
  onClearOrders: () => void;
  onBrowseCards: () => void;
}

export const DeliveryVaultModal: React.FC<DeliveryVaultModalProps> = ({
  orders,
  onClose,
  onClearOrders,
  onBrowseCards
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (window as any).unlockNumber = () => {
      const cardNumEl = document.getElementById('cardNumber');
      const revealBtnEl = document.getElementById('revealBtn');
      if (cardNumEl) {
        cardNumEl.textContent = '5384 1234 5678 2386';
      }
      if (revealBtnEl) {
        revealBtnEl.textContent = 'Unlocked ✓';
      }
    };

    (window as any).unlockDetails = () => {
      const cardNumber = document.getElementById("cardNumber");
      const expiry = document.getElementById("expiry");
      const limit = document.getElementById("limit");
      const revealBtn = document.getElementById("revealBtn") || document.getElementById("unlockBtn");

      if (cardNumber) cardNumber.textContent = "5384 1234 5678 2386";
      if (expiry) expiry.textContent = "09/30";
      if (limit) limit.textContent = "₹175K";

      if (revealBtn) {
        revealBtn.textContent = "✓ Unlocked";
      }
    };
  }, []);

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyFormatted = (order: PurchasedOrder) => {
    const text = `${order.cardDetails.number}|${order.cardDetails.expiry}|${order.cardDetails.cvv}|PIN:${order.cardDetails.pin}`;
    navigator.clipboard.writeText(text);
    setCopiedId(order.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // If no card has been purchased yet, show the "Delivery Locked" popup
  if (orders.length === 0) {
    return (
      <div className="delivery-modal" id="deliveryModal" onClick={onClose}>
        <div className="delivery-popup" onClick={(e) => e.stopPropagation()}>
          <div className="lock-icon">🔒</div>

          <h2>Delivery Locked</h2>

          <p className="main-text">
            You haven't purchased a card yet
          </p>

          <p className="sub-text">
            Complete your payment to unlock your credit card details and setup video
          </p>

          <button className="close-btn" type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      id="deliveryModal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        id="delivery-vault-content"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[500px] bg-[#101b29] border border-[#233549] rounded-[22px] p-6 text-left shadow-2xl relative max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#233549] pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl shadow-md">
              📦
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">
                Items Ready &amp; Delivered
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                All purchased card goods, generated tokens, PINs and encrypted keys are stored safely here
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#182637] text-gray-400 hover:text-white flex items-center justify-center border border-[#31455d] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Orders list container */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {orders.map((order) => {
            const isRevealed = revealedIds[order.id];
            const isCopied = copiedId === order.id;

            return (
              <div
                key={order.id}
                className="bg-[#0b1420] border border-[#233549] hover:border-amber-500/40 rounded-2xl p-4 transition-all duration-200 shadow-md"
              >
                <div className="flex items-center justify-between border-b border-[#1b2b3d] pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <h4 className="text-sm font-bold text-white tracking-wide">
                      {order.cardTitle}
                    </h4>
                  </div>

                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-2.5 py-0.5 rounded-full">
                    ✓ {order.status}
                  </span>
                </div>

                {/* Card Credentials Box */}
                <div className="bg-[#050b12] border border-[#1d2d3e] rounded-xl p-3.5 space-y-2 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-sans text-[11px]">Card Number:</span>
                    <span id="cardNumber" className="text-amber-300 font-bold tracking-wider">
                      {isRevealed
                        ? order.cardDetails.number
                        : `${order.cardDetails.number.slice(0, 4)} •••• •••• ${order.cardDetails.number.slice(-4)}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-sans text-[11px]">Expiry / CVV:</span>
                    <span className="text-cyan-300 font-bold">
                      <span id="expiry">{order.cardDetails.expiry}</span> | CVV: <span id="cvv">{isRevealed ? order.cardDetails.cvv : '•••'}</span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-sans text-[11px]">Limit / PIN:</span>
                    <span className="text-emerald-400 font-bold">
                      <span id="limit">{order.cardDetails.limit || '₹62K'}</span> | PIN: {isRevealed ? order.cardDetails.pin : '••••'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-gray-800/60 text-[10px] text-gray-500 font-sans">
                    <span>Order: #{order.orderNumber}</span>
                    <span>{new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {/* Action Buttons for this card */}
                <div className="flex items-center gap-2 mt-3">
                  <button
                    id="revealBtn"
                    type="button"
                    onClick={() => toggleReveal(order.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#142335] hover:bg-[#1d334d] text-gray-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#314a68] transition-colors cursor-pointer"
                  >
                    {isRevealed ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>✓ Unlocked</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>Reveal Details</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyFormatted(order)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#1c2e42] hover:bg-[#253e5a] text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 border border-amber-500/30 transition-colors cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Token</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Unlocked Setup & Top-Up Video Tutorial */}
          <DeliveryVideoGuide orders={orders} />
        </div>

        {/* Footer actions */}
        <div className="pt-4 mt-4 border-t border-[#25374d] flex items-center justify-between">
          <button
            type="button"
            onClick={onClearOrders}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Vault</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-[#162436] hover:bg-[#1f324a] text-white text-xs font-semibold border border-[#3a4b60] cursor-pointer"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
};
