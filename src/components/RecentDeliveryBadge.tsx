import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

interface DeliveryRecord {
  card: string;
  name: string;
  timeAgo?: string;
}

const DELIVERY_LIST: DeliveryRecord[] = [
  { card: 'MasterCard Pro', name: 'Arjun' },
  { card: 'Gold Card', name: 'Karan' },
  { card: 'Visa Platinum', name: 'Rahul' },
  { card: 'MasterCard Elite', name: 'Amit' },
  { card: 'RuPay Prime', name: 'Sneha' },
  { card: 'Black Metal Card', name: 'Rohan' },
  { card: 'Visa Infinite', name: 'Priya' },
  { card: 'Gold Card', name: 'Vikram' },
  { card: 'RuPay Platinum', name: 'Neha' },
  { card: 'Visa Signature', name: 'Deepak' },
  { card: 'Black Diamond', name: 'Akash' },
  { card: 'Gold Card', name: 'Kabir' },
  { card: 'MasterCard Gold', name: 'Riya' },
  { card: 'Visa Titanium', name: 'Sanjay' },
  { card: 'RuPay Select', name: 'Ananya' },
  { card: 'Gold Card', name: 'Suraj' },
  { card: 'Platinum Card', name: 'Monu' },
  { card: 'MasterCard VIP', name: 'Sujit' },
  { card: 'Visa Platinum', name: 'Sameer' },
  { card: 'Gold Card', name: 'Tanmoy' },
];

export const RecentDeliveryBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;

    const showBadge = () => {
      setIsVisible(true);

      // Stays for 4 seconds (4000ms) as requested, then disappears
      hideTimer = setTimeout(() => {
        setIsVisible(false);
        // Switch to the next delivery for subsequent cycle
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % DELIVERY_LIST.length);
        }, 400);
      }, 4000);
    };

    // First appearance after 1.5 seconds so user can see MasterCard Pro to Arjun immediately
    const initialTimer = setTimeout(() => {
      showBadge();
    }, 1500);

    // Re-appears every 10 seconds (10000ms)
    const interval = setInterval(showBadge, 10000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
      clearTimeout(hideTimer);
    };
  }, []);

  const current = DELIVERY_LIST[currentIndex];

  return (
    <div
      id="recent-delivery-badge"
      className={`inline-flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-[#00ba68] text-white shadow-xl border border-white/25 transition-all duration-300 select-none ${
        isVisible
          ? 'opacity-100 scale-100 pointer-events-auto'
          : 'opacity-0 scale-90 pointer-events-none'
      } ${className}`}
      style={{
        boxShadow: '0 8px 20px -4px rgba(0, 186, 104, 0.45), 0 4px 10px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Icon Circle */}
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
        <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2.2} />
      </div>

      {/* Texts matching the user's reference image */}
      <div className="text-left leading-tight">
        <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-emerald-100/95 leading-none mb-0.5">
          RECENT DELIVERY
        </div>
        <div className="text-xs sm:text-[13px] font-bold text-white tracking-tight leading-snug whitespace-nowrap">
          {current.card} to {current.name}
        </div>
        <div className="text-[8px] sm:text-[9px] font-bold text-emerald-200/90 uppercase tracking-wider leading-none mt-0.5">
          JUST NOW
        </div>
      </div>
    </div>
  );
};
