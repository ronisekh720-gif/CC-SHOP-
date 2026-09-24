import React, { useState } from 'react';
import { Lock, CheckCircle2, Film, Sparkles, ExternalLink, Play } from 'lucide-react';
import { PurchasedOrder } from '../types';

interface DeliveryVideoGuideProps {
  orders: PurchasedOrder[];
  onBrowseCards?: () => void;
  alwaysUnlocked?: boolean;
  title?: string;
}

// Center Point Gamer Free Fire ATM Card Top-Up Tutorial
const DEFAULT_YT_ID = 'xCWPnuAODAg';

export const DeliveryVideoGuide: React.FC<DeliveryVideoGuideProps> = ({
  orders,
  onBrowseCards,
  alwaysUnlocked = false,
  title,
}) => {
  const isUnlocked = alwaysUnlocked || orders.length > 0;
  const latestOrder = orders[0];

  const [activeSeconds, setActiveSeconds] = useState<number>(0);
  const [playerKey, setPlayerKey] = useState<number>(0);

  // Video Tutorial Key Chapters with exact timestamps
  const tutorialSteps = [
    {
      seconds: 0,
      time: '00:00',
      title: 'Free Fire Membership & Top-Up Selection',
      titleBn: 'Select Membership or Top-Up in Free Fire Store',
      desc: 'Select Weekly Lite or any top-up diamond pack from the in-game store.',
    },
    {
      seconds: 58,
      time: '00:58',
      title: 'Select Add Credit or Debit Card',
      titleBn: 'Select "Add credit or debit card" in Google Play',
      desc: 'Tap on Google Play payment methods and choose credit or debit card.',
    },
    {
      seconds: 76,
      time: '01:16',
      title: 'Enter 16-Digit Card Number & Details',
      titleBn: 'Enter 16-digit Card Number, Expiry (MM/YY) & CVV',
      desc: 'Carefully input your unlocked card credentials and billing details.',
    },
    {
      seconds: 158,
      time: '02:38',
      title: 'OTP Verification (One Time Password)',
      titleBn: 'Verify One Time Password (OTP) from Bank',
      desc: 'Enter the verification OTP code sent to complete the payment.',
    },
    {
      seconds: 220,
      time: '03:40',
      title: 'Payment Successful & Diamonds Claimed',
      titleBn: 'Payment Successful & Diamonds Added Instantly',
      desc: 'Receive confirmation and enjoy your diamonds / membership in-game.',
    }
  ];

  const handleJumpToStep = (seconds: number) => {
    setActiveSeconds(seconds);
    setPlayerKey((prev) => prev + 1);
  };

  // Embed URL for YouTube video with start time
  const embedUrl = `https://www.youtube-nocookie.com/embed/${DEFAULT_YT_ID}?autoplay=1&start=${activeSeconds}&rel=0&modestbranding=1`;

  // IF LOCKED: Card not purchased yet - do not show video before buying a card
  if (!isUnlocked) {
    return null;
  }

  // IF UNLOCKED: Delivery active
  return (
    <div
      id="delivery-video-unlocked-section"
      className="mt-5 border border-[#233549] bg-[#0d1827] rounded-2xl p-4 sm:p-5 text-left shadow-2xl relative overflow-hidden animate-fade-in"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#21354c] pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-600/60 flex items-center justify-center text-emerald-400 shadow">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                {title || 'Free Fire ATM Card Top-Up Tutorial by Center Point Gamer'}
              </h3>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-700/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>ACTIVE VIDEO</span>
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Watch the complete video tutorial to top-up diamonds in Free Fire after purchasing your card (Full Audio & Video Playback)
            </p>
          </div>
        </div>

        {/* External Link & Controls */}
        <div className="flex items-center gap-2">
          <a
            href={`https://www.youtube.com/watch?v=${DEFAULT_YT_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in YouTube"
            className="text-[11px] font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow"
          >
            <ExternalLink className="w-3 h-3 text-black" />
            <span>Open in YouTube</span>
          </a>
        </div>
      </div>

      {/* Main Video View - Embedded YouTube Player */}
      <div className="relative w-full rounded-xl overflow-hidden bg-black border border-[#1d2d40] shadow-2xl aspect-video flex items-center justify-center">
        <iframe
          key={playerKey}
          src={embedUrl}
          title="Free Fire ATM Card Top-Up Tutorial"
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      {/* Active Card Credentials reminder box */}
      {latestOrder && (
        <div className="mt-3 p-3 rounded-xl bg-[#08121d] border border-emerald-600/40 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-gray-300">Your Purchased Card:</span>
            <span className="font-mono font-bold text-emerald-300">{latestOrder.cardTitle}</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-gray-300">
            <span>No: <strong className="text-white">{latestOrder.cardDetails.number}</strong></span>
            <span>Exp: <strong className="text-white">{latestOrder.cardDetails.expiry}</strong></span>
            <span>CVV: <strong className="text-amber-300">{latestOrder.cardDetails.cvv}</strong></span>
          </div>
        </div>
      )}

      {/* Video Chapters / Key Steps Navigator */}
      <div className="mt-4 pt-3 border-t border-[#1d2d40]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-amber-400" />
            <span>Jump to Tutorial Timestamps:</span>
          </span>
          <span className="text-[10px] text-amber-400 font-mono">
            {activeSeconds > 0 ? `Current: ${Math.floor(activeSeconds / 60)}:${(activeSeconds % 60).toString().padStart(2, '0')}` : 'Full Video'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {tutorialSteps.map((step, idx) => {
            const isSelected = activeSeconds === step.seconds;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleJumpToStep(step.seconds)}
                className={`text-left p-2.5 rounded-xl text-xs border transition-all cursor-pointer flex items-start gap-2.5 ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500 text-amber-100 shadow-md ring-1 ring-amber-500/50'
                    : 'bg-[#09121d] border-[#1b2b3d] text-gray-400 hover:text-gray-200 hover:bg-[#111e2f]'
                }`}
              >
                <div className="flex flex-col items-center justify-center">
                  <span className="text-[11px] font-mono bg-black/70 px-2 py-0.5 rounded text-amber-400 font-bold flex items-center gap-1">
                    <Play className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                    <span>{step.time}</span>
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate text-white text-[11px]">
                    {step.titleBn}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">
                    {step.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
