import React, { useState } from 'react';
import { CardItem } from '../types';
import { Star, ThumbsUp, ShieldCheck, MessageSquarePlus, CheckCircle2, Zap } from 'lucide-react';

interface OnlineCardsReviewsViewProps {
  cards: CardItem[];
}

interface OnlineReviewItem {
  id: string;
  name: string;
  avatar: string;
  avatarBg: string;
  cardName: string;
  price: number;
  time: string;
  rating: number;
  badge: string;
  review: string;
  likes: number;
}

const INITIAL_ONLINE_REVIEWS: OnlineReviewItem[] = [
  {
    id: 'or-1',
    name: 'Tanvir Hossain',
    avatar: 'T',
    avatarBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    cardName: 'Mastercard Gold',
    price: 549,
    time: '12 mins ago',
    rating: 5,
    badge: '100% Online Verified',
    review: 'Outstanding quality! Purchased Mastercard Gold for ₹549 and received decrypted full card details within 5 seconds in the delivery box. Tested on multiple international subscriptions and checkout went through instantly! Highly recommended.',
    likes: 42,
  },
  {
    id: 'or-2',
    name: 'Sayan Banerjee',
    avatar: 'S',
    avatarBg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    cardName: 'Visa Premier',
    price: 629,
    time: '26 mins ago',
    rating: 5,
    badge: 'Instant Delivery Verified',
    review: 'Bought the ₹629 Visa Premier card. Limit and credentials matched perfectly. Zero decline rate and OTP verification passed smoothly on first attempt. Premium experience!',
    likes: 38,
  },
  {
    id: 'or-3',
    name: 'Arindam Das',
    avatar: 'A',
    avatarBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    cardName: 'RuPay Platinum',
    price: 719,
    time: '45 mins ago',
    rating: 5,
    badge: '100% Working Order',
    review: 'Purchased RuPay Platinum for ₹719. Instant token reveal with active status. Best automated delivery vault I have experienced. 5-star service all the way!',
    likes: 29,
  },
  {
    id: 'or-4',
    name: 'Mehedi Hasan',
    avatar: 'M',
    avatarBg: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    cardName: 'Mastercard Gold',
    price: 549,
    time: '1 hour ago',
    rating: 5,
    badge: 'Instant Verified',
    review: 'Superfast delivery! Paid ₹549 for Mastercard Gold and received the credentials in the delivery section immediately. Everything works flawlessly for online testing and checkout. Thank you!',
    likes: 56,
  },
  {
    id: 'or-5',
    name: 'Subhashish Roy',
    avatar: 'S',
    avatarBg: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    cardName: 'Visa Premier',
    price: 629,
    time: '2 hours ago',
    rating: 5,
    badge: '100% Successful',
    review: 'Online cards have top-notch response speed. Handled recurring simulation payments smoothly with active verified status. Excellent platform reliability.',
    likes: 34,
  },
  {
    id: 'or-6',
    name: 'Kallol Chakraborty',
    avatar: 'K',
    avatarBg: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
    cardName: 'RuPay Platinum',
    price: 719,
    time: '3 hours ago',
    rating: 5,
    badge: 'High Speed Verified',
    review: 'Worth every rupee. The ₹719 card came with complete credentials, instant copy features, and valid expiry. Clean UI and instant delivery.',
    likes: 47,
  },
  {
    id: 'or-7',
    name: 'Anirban Mukherjee',
    avatar: 'A',
    avatarBg: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
    cardName: 'Mastercard Premium',
    price: 888,
    time: '3 hours ago',
    rating: 5,
    badge: 'Instant Verified',
    review: 'Purchased for ₹888. Complete decrypted details showed up in seconds with active status. Excellent service and zero decline!',
    likes: 39,
  },
  {
    id: 'or-8',
    name: 'Debojyoti Sen',
    avatar: 'D',
    avatarBg: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
    cardName: 'Titanium Black',
    price: 998,
    time: '4 hours ago',
    rating: 5,
    badge: 'Ultra VIP Verified',
    review: 'Bought the ₹998 Titanium Black online card. Active real funded card verified. Instant automated reveal in vault. Perfect!',
    likes: 51,
  }
];

const getOnlineCardFriendlyName = (card: CardItem) => {
  if (card.id.includes('mc-gold') || card.theme === 'gold') return 'Mastercard Gold';
  if (card.id.includes('visa-premier') || card.theme === 'blue') return 'Visa Premier';
  if (card.id.includes('rupay-plat') || card.theme === 'green') return 'RuPay Platinum';
  if (card.id.includes('mc-prem') || card.theme === 'red') return 'Mastercard Premium';
  if (card.id.includes('black') || card.theme === 'black') return 'Titanium Black';
  return card.title.replace(/\s*\(\d{4}\)/g, '').trim() || 'Mastercard Gold';
};

const formatCardDisplay = (cardName: string, price: number) => {
  const cleaned = cardName.replace(/\s*\(\d{4}\)/g, '').trim();
  if (cleaned.includes('₹')) {
    return cleaned;
  }
  return `${cleaned} (₹${price})`;
};

export const OnlineCardsReviewsView: React.FC<OnlineCardsReviewsViewProps> = ({ cards }) => {
  const [reviewsList, setReviewsList] = useState<OnlineReviewItem[]>(INITIAL_ONLINE_REVIEWS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0]?.id || '');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const selectedCard = cards.find((c) => c.id === selectedCardId) || cards[0];

  const handleToggleLike = (id: string) => {
    setLikedMap((prev) => {
      const isLiked = !prev[id];
      setReviewsList((current) =>
        current.map((r) => {
          if (r.id === id) {
            return {
              ...r,
              likes: isLiked ? r.likes + 1 : r.likes - 1,
            };
          }
          return r;
        })
      );
      return { ...prev, [id]: isLiked };
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    const cardToUse = cards.find((c) => c.id === selectedCardId) || cards[0];
    const cardDisplayName = cardToUse
      ? getOnlineCardFriendlyName(cardToUse)
      : 'Mastercard Gold';

    const newReview: OnlineReviewItem = {
      id: `online-rev-${Date.now()}`,
      name: authorName.trim(),
      avatar: authorName.trim().charAt(0).toUpperCase(),
      avatarBg: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      cardName: cardDisplayName,
      price: cardToUse ? cardToUse.price : 549,
      time: 'Just now',
      rating,
      badge: 'Verified Online Buyer',
      review: comment.trim(),
      likes: 1,
    };

    setReviewsList([newReview, ...reviewsList]);
    setAuthorName('');
    setComment('');
    setRating(5);
    setIsFormOpen(false);
    setShowSuccessToast(true);

    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3500);
  };

  return (
    <section id="online-cards-reviews-section" className="mt-8 pt-6 border-t border-[#1e2f44] px-4">
      {/* Header with Title and Add Review Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
              <span className="text-amber-400">⭐</span> Customer Reviews & Feedback
            </h2>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> 100% Verified
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Real experiences and verified reviews from online card buyers
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-amber-500/20"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" />
          {isFormOpen ? 'Close Form' : 'Write a Review'}
        </button>
      </div>

      {/* Success Notification */}
      {showSuccessToast && (
        <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          Your review has been successfully posted! Thank you.
        </div>
      )}

      {/* Write Review Form */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmitReview}
          className="mb-5 p-4 rounded-2xl bg-[#0c1622] border border-[#233549] shadow-xl animate-fade-in"
        >
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            Share Your Experience
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tanvir Hossain"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-[#101b29] border border-[#263b52] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                Select Online Card (Price)
              </label>
              <select
                value={selectedCardId}
                onChange={(e) => setSelectedCardId(e.target.value)}
                className="w-full bg-[#101b29] border border-[#263b52] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                {cards.map((c) => (
                  <option key={c.id} value={c.id}>
                    {getOnlineCardFriendlyName(c)} (₹{c.price})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-[11px] font-semibold text-gray-300 mb-1">
              Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setRating(s)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-5 h-5 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-amber-300 ml-2">
                {rating} of 5 Stars
              </span>
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-[11px] font-semibold text-gray-300 mb-1">
              Review & Experience
            </label>
            <textarea
              required
              rows={3}
              placeholder="How fast was delivery? Did credentials reveal accurately? Write your positive experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-[#101b29] border border-[#263b52] rounded-lg p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 text-xs hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs hover:brightness-110 active:scale-95 shadow-md"
            >
              Submit Review
            </button>
          </div>
        </form>
      )}

      {/* Online Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {reviewsList.map((rev) => {
          const isLiked = !!likedMap[rev.id];
          return (
            <div
              key={rev.id}
              className="bg-[#0e1724] border border-[#233549] rounded-2xl p-4 shadow-md hover:border-[#324a66] transition-all flex flex-col justify-between"
            >
              <div>
                {/* User Top Row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-inner"
                      style={{ background: rev.avatarBg }}
                    >
                      {rev.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        {rev.name}
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                      </div>
                      <div className="text-[10px] text-gray-400">{rev.time}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-[11px] font-bold text-amber-300 ml-1">
                      {rev.rating}.0
                    </span>
                  </div>
                </div>

                {/* Card Tag & Badge */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                  <span className="bg-[#172538] text-amber-300/90 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-[#2b415e]">
                    💳 {formatCardDisplay(rev.cardName, rev.price)}
                  </span>
                  <span className="bg-emerald-950/60 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-emerald-500/30">
                    ✓ {rev.badge}
                  </span>
                </div>

                {/* Review Message */}
                <p className="text-xs text-gray-300 leading-relaxed font-normal">
                  “{rev.review}”
                </p>
              </div>

              {/* Bottom Helpful / Like Row */}
              <div className="mt-3 pt-2.5 border-t border-[#1a283b] flex items-center justify-between text-[11px] text-gray-400">
                <span className="text-emerald-400/90 text-[10px] font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> 100% Verified Purchase
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleLike(rev.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                    isLiked
                      ? 'bg-amber-400/20 text-amber-300 font-bold'
                      : 'hover:bg-[#1a2b40] text-gray-400 hover:text-white'
                  }`}
                >
                  <ThumbsUp className={`w-3 h-3 ${isLiked ? 'fill-amber-400' : ''}`} />
                  <span>{rev.likes}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
