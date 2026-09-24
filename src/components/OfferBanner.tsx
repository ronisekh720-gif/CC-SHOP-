import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Flame } from 'lucide-react';
import { RecentDeliveryBadge } from './RecentDeliveryBadge';

export const OfferBanner: React.FC = () => {
  // Live ticking countdown timer starting from 7D 01H 07M 43S
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 1,
    minutes: 7,
    seconds: 43
  });

  useEffect(() => {
    // 1-second interval for countdown timer
    const countdownTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => {
      clearInterval(countdownTimer);
    };
  }, []);

  const format2 = (n: number) => n.toString().padStart(2, '0');

  return (
    <div
      id="offer-banner"
      className="offer-banner relative overflow-hidden py-4 px-3 text-center shadow-lg select-none"
      style={{
        background: 'linear-gradient(90deg, #cf00ce 0%, #ee006a 38%, #ff0038 65%, #ff6200 100%)'
      }}
    >
      {/* Decorative Shimmer Overlay */}
      <div className="absolute inset-0 bg-white/10 pointer-events-none mix-blend-overlay" />

      {/* Floating Recent Delivery Notification (Pops up every 10s for 4s on left, moved slightly down) */}
      <div className="absolute top-7 sm:top-8 left-2 sm:left-3 z-30">
        <RecentDeliveryBadge />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-2.5">
        {/* Top Pill Badge: PUJA SPECIAL OFFER */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#941348]/90 backdrop-blur-xs px-4 sm:px-5 py-1 sm:py-1.5 rounded-full text-xs sm:text-[13px] font-bold tracking-wide shadow-md border border-white/25 text-white">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span className="text-sm">🎉</span>
          <span className="font-extrabold uppercase tracking-wider">PUJA SPECIAL OFFER</span>
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        </div>

        {/* Center Main Text: GET [FLAT 80% OFF] ON PREMIUM CARDS */}
        <h2 className="text-sm sm:text-base md:text-lg font-extrabold tracking-normal text-white flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 my-0.5">
          <span className="tracking-wide">GET</span>
          <span className="bg-white text-[#bd005a] px-3 sm:px-4 py-1 sm:py-1.5 rounded-2xl font-black tracking-wide shadow-md inline-block">
            FLAT 80% OFF
          </span>
          <span className="tracking-wide">ON PREMIUM CARDS</span>
        </h2>

        {/* Bottom Pill Badge: ENDS IN: 22D 01H 07M 43S */}
        <div className="inline-flex items-center gap-2 bg-[#7e0c3d]/90 backdrop-blur-xs border border-white/25 px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-[13px] font-bold shadow-md text-white">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="tracking-wider">ENDS IN:</span>
          <span className="text-amber-400 font-mono font-black tracking-wider">
            {timeLeft.days}D &nbsp;{format2(timeLeft.hours)}H &nbsp;{format2(timeLeft.minutes)}M &nbsp;{format2(timeLeft.seconds)}S
          </span>
        </div>
      </div>
    </div>
  );
};



