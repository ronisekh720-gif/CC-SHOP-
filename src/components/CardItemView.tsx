import React from 'react';
import { CardItem } from '../types';

interface CardItemViewProps {
  card: CardItem;
  onSelectCard: (card: CardItem) => void;
  onOpenPlan: (card: CardItem, e: React.MouseEvent) => void;
}

export const CardItemView: React.FC<CardItemViewProps> = ({
  card,
  onSelectCard,
  onOpenPlan,
}) => {
  // Theme gradients matching cards
  const getThemeBackground = (theme: CardItem['theme']) => {
    switch (theme) {
      case 'red':
        return 'linear-gradient(135deg, #a93600 0%, #631100 48%, #020305 100%)';
      case 'red2':
        return 'radial-gradient(circle at 85% 25%, rgba(225, 29, 72, 0.52) 0%, transparent 55%), linear-gradient(145deg, #580a12 0%, #2f0409 50%, #0e0204 100%)';
      case 'gold':
        return 'linear-gradient(135deg, #050505 0%, #151515 55%, #5a1f25 78%, #9b3038 100%)';
      case 'green':
        return 'linear-gradient(135deg, #075c3e 0%, #032a1c 48%, #010d08 100%)';
      case 'blue':
        return 'linear-gradient(135deg, #075c79 0%, #042f3e 48%, #010f14 100%)';
      case 'purple':
        return 'linear-gradient(135deg, #5b1085 0%, #2f0447 48%, #100118 100%)';
      case 'black':
        return 'linear-gradient(135deg, #050505 0%, #141414 40%, #1f1f1f 70%, #333333 100%)';
      default:
        return 'linear-gradient(135deg, #a93600 0%, #631100 48%, #020305 100%)';
    }
  };

  const isMastercardPremium = card.title.toUpperCase().includes('MASTERCARD PREMIUM');
  const isMastercardGold = card.title.toUpperCase().includes('MASTERCARD GOLD');
  const isMastercardPlatinum = card.title.toUpperCase().includes('MASTERCARD PLATINUM');
  const isMastercardElite = card.title.toUpperCase().includes('MASTERCARD ELITE');
  const isMastercardBlack = card.title.toUpperCase().includes('MASTERCARD BLACK');
  const isVisa = card.category === 'visa' || card.title.toUpperCase().includes('VISA') || card.id.includes('visa');
  const isRupay = card.category === 'rupay' || card.title.toUpperCase().includes('RUPAY') || card.id.includes('rupay');
  const isVisaGold = card.title.toUpperCase().includes('VISA GOLD');
  const isRupayGold = card.title.toUpperCase().includes('RUPAY GOLD');
  const isRupayPremium = card.title.toUpperCase().includes('RUPAY PREMIUM');
  const isVisaSignaturePremier = card.title.toUpperCase().includes('VISA PREMIER') || card.title.toUpperCase().includes('VISA PREMIUM') || card.title.toUpperCase().includes('VISA SIGNATURE PREMIER');
  const isVisaSignatureCard = card.title.toUpperCase().includes('VISA SIGNATURE');
  const isVisaInfiniteCard = card.title.toUpperCase().includes('VISA INFINITE');
  const isOnline = card.category === 'online' || card.title.toUpperCase().includes('ONLINE');

  return (
    <div
      id={`card-item-${card.id}`}
      onClick={() => onSelectCard(card)}
      className={`premium-card credit-card ${isVisa ? 'visa-card' : isRupay ? 'rupay-card' : 'mastercard-card'} ${isOnline ? `online-card online-card-${card.theme}` : ''} atm-card store-card ${(!isOnline && (isMastercardGold || card.theme === 'gold')) ? 'gold-card card-gold' : ''} card-item card mb-6 cursor-pointer select-none transition-transform hover:-translate-y-1 ${
        isOnline
          ? ''
          : isMastercardPremium
          ? 'mastercard-premium card-premium'
          : isMastercardGold
          ? 'mastercard-gold master-gold-card card-gold'
          : isMastercardPlatinum
          ? 'mastercard-platinum card-platinum platinum-card'
          : isMastercardElite
          ? 'mastercard-elite card-elite'
          : isMastercardBlack
          ? 'mastercard-black card-black'
          : isVisaGold
          ? 'visa-gold'
          : isRupayGold
          ? 'rupay-gold'
          : isRupayPremium
          ? 'rupay-premium'
          : isVisaSignaturePremier
          ? 'visa-premium visa-premier visa-signature-premier visa-signature-card'
          : isVisaSignatureCard
          ? 'visa-signature-card'
          : isVisaInfiniteCard
          ? 'visa-infinite-card visa-infinite-black'
          : ''
      }`}
      style={{ background: getThemeBackground(card.theme) }}
    >
      {/* Brand Logo / Online Badge */}
      {isOnline ? (
        <div className="online-badge-logo">ONLINE</div>
      ) : isVisa ? (
        <div className="visa-logo">VISA</div>
      ) : isRupay ? (
        <div className="rupay-text">RuPay</div>
      ) : (
        <div className="mastercard-logo">
          <span className="mc-red"></span>
          <span className="mc-orange"></span>
        </div>
      )}

      {/* Top */}
      <div className="card-header card-top">
        <div className="chip card-chip">
          <span></span>
          <span></span>
        </div>

        <div className="contactless">◔</div>
      </div>

      {/* Card Name */}
      <h2 className="card-name card-title">{card.title}</h2>

      {/* Masked Number */}
      <div className="card-number">
        {card.number}
      </div>

      {/* Price */}
      <div className="price-row">
        <div className="price">₹{card.price}</div>
        {card.originalPrice && (
          <span className="old-price">₹{card.originalPrice}</span>
        )}
        {card.discountBadge && (
          isMastercardPlatinum ? (
            <span className="platinum-discount discount">{card.discountBadge}</span>
          ) : isRupayPremium ? (
            <span className="rupay-premium-discount discount">{card.discountBadge}</span>
          ) : isVisaSignaturePremier ? (
            <span className="visa-signature-premier-discount discount">{card.discountBadge}</span>
          ) : (
            <span className="discount">{card.discountBadge}</span>
          )
        )}
      </div>

      {/* Details Box */}
      <div className="details-box">
        <div className="detail">
          <span>LIMIT</span>
          <strong>{card.limit}</strong>
        </div>

        <div className="detail">
          <span>EXPIRY</span>
          <strong>{card.expiry}</strong>
        </div>

        <div className="detail">
          <span>CVV</span>
          <strong>{card.cvv}</strong>
        </div>

        <div className="detail last">
          <span>CVC</span>
          <strong>{card.cvc}</strong>
        </div>
      </div>

      {/* Line 1 - Above Purchased by */}
      <div className="line"></div>

      {/* Purchased */}
      <div className="purchased">
        Purchased by: <b>{card.purchasedCount ? `${card.purchasedCount.toLocaleString()}+` : '387,420+'}</b> people
      </div>

      {/* Purchase Plan / Verified Mode Button */}
      <div
        role="button"
        tabIndex={0}
        id={`btn-verify-${card.id}`}
        className="verified-mode"
        onClick={(e) => {
          e.stopPropagation();
          onSelectCard(card);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            onSelectCard(card);
          }
        }}
      >Verified Mode</div>

      {/* Line 2 - Below Verified Mode */}
      <div className="line"></div>

      {/* VIEW PURCHASE PLAN Button */}
      <div
        role="button"
        tabIndex={0}
        id={`btn-plan-${card.id}`}
        className="view-purchase-plan"
        onClick={(e) => {
          e.stopPropagation();
          onSelectCard(card);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            onSelectCard(card);
          }
        }}
      >
        <span>VIEW PURCHASE PLAN</span>
      </div>
    </div>
  );
};

