import React, { useEffect } from 'react';
import { NavTab } from '../types';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  orderCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const showCards = () => {
    onTabChange('cards');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const showReviews = () => {
    onTabChange('delivery');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const showOnlineCards = () => {
    onTabChange('online-cards');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    (window as any).showCards = showCards;
    (window as any).showReviews = showReviews;
    (window as any).showOnlineCards = showOnlineCards;
    return () => {
      delete (window as any).showCards;
      delete (window as any).showReviews;
      delete (window as any).showOnlineCards;
    };
  }, [onTabChange]);

  return (
    <div id="bottom-nav-bar" className="bottom md:hidden">
      <div
        id="nav-cards"
        role="button"
        tabIndex={0}
        className={`nav-item nav ${activeTab === 'cards' ? 'active' : ''}`}
        onClick={showCards}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            showCards();
          }
        }}
      >
        <svg className="cards-logo" viewBox="0 0 32 24" fill="none">
          <rect
            x="2"
            y="2"
            width="28"
            height="20"
            rx="3"
            stroke="currentColor"
            strokeWidth="2.2"
          />
          <path
            d="M3 8H29"
            stroke="currentColor"
            strokeWidth="2.2"
          />
        </svg>
        <span>CARDS</span>
      </div>

      <button
        id="nav-online-cards"
        type="button"
        className={`nav ${activeTab === 'online-cards' ? 'active' : ''}`}
        onClick={showOnlineCards}
      >
        <span className="flex items-center justify-center mb-1">
          <svg
            className="w-5 h-5 transition-transform duration-200"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </span>
        <b className="whitespace-nowrap">ONLINE CARDS</b>
      </button>

      <button
        id="nav-reviews"
        type="button"
        className={`nav ${activeTab === 'delivery' || activeTab === 'reviews' ? 'active' : ''}`}
        onClick={showReviews}
      >
        <span className="flex items-center justify-center mb-1">
          <svg
            className="w-5 h-5 transition-transform duration-200"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Exact outer hexagon boundary */}
            <path
              d="M 50 14 L 83 33 L 83 71 L 50 90 L 17 71 L 17 33 Z"
              strokeWidth="9"
            />
            {/* Center Y division for isometric top and side faces */}
            <path
              d="M 17 33 L 50 52 L 83 33"
              strokeWidth="9"
            />
            <path
              d="M 50 52 L 50 90"
              strokeWidth="9"
            />
            {/* Diagonal tape band across the top flap */}
            <line
              x1="33.5"
              y1="23.5"
              x2="66.5"
              y2="42.5"
              strokeWidth="9"
            />
            {/* Front tape seal flap */}
            <path
              d="M 60 48.5 L 60 62.5 L 70.5 56.5 L 70.5 42.5"
              strokeWidth="8"
            />
          </svg>
        </span>
        <b className="whitespace-nowrap">YOUR DELIVERY</b>
      </button>
    </div>
  );
};

