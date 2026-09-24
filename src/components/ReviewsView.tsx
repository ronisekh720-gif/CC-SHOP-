import React, { useState } from 'react';
import { ReviewItem, CardItem } from '../types';
import { Star, ThumbsUp, ShieldCheck, MessageSquarePlus, CheckCircle2 } from 'lucide-react';

interface ReviewsViewProps {
  reviews: ReviewItem[];
  cards: CardItem[];
  onAddReview: (review: ReviewItem) => void;
}

interface LivePurchaseItem {
  id: string;
  name: string;
  avatar: string;
  avatarBg: string;
  card: string;
  price: string;
  time: string;
  rating: number;
  review: string;
}

const LIVE_PURCHASES: LivePurchaseItem[] = [
  {
    id: 'lp-1',
    name: 'Rahul Sharma',
    avatar: 'R',
    avatarBg: 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)',
    card: 'Mastercard Gold',
    price: '₹499',
    time: 'Just now',
    rating: 5,
    review: 'I bought Mastercard Gold and the card worked 100%! Instant delivery under 5 seconds, full balance active.',
  },
  {
    id: 'lp-2',
    name: 'Amit Kumar',
    avatar: 'A',
    avatarBg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    card: 'Mastercard Platinum',
    price: '₹648',
    time: '2m ago',
    rating: 5,
    review: 'Bought Mastercard Platinum, 100% working on all test transactions! Decrypted PIN and CVV on screen.',
  },
  {
    id: 'lp-3',
    name: 'Vikram Mehta',
    avatar: 'V',
    avatarBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    card: 'Mastercard Premium',
    price: '₹810',
    time: '5m ago',
    rating: 5,
    review: 'I purchased Mastercard Premium, worked 100%! Active status verified smoothly with zero decline.',
  },
  {
    id: 'lp-4',
    name: 'Sneha Patel',
    avatar: 'S',
    avatarBg: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    card: 'RuPay Premium',
    price: '₹699',
    time: '9m ago',
    rating: 5,
    review: 'I bought RuPay Premium and the card worked 100%! Instant token dispatch and top-notch service.',
  },
  {
    id: 'lp-5',
    name: 'Rohan Das',
    avatar: 'R',
    avatarBg: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    card: 'Visa Gold',
    price: '₹599',
    time: '14m ago',
    rating: 5,
    review: 'Got Visa Gold, 100% working with instant credentials in vault. Super fast and reliable!',
  },
  {
    id: 'lp-6',
    name: 'Pooja Banerjee',
    avatar: 'P',
    avatarBg: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
    card: 'RuPay Gold',
    price: '₹1,199',
    time: '21m ago',
    rating: 5,
    review: 'Bought RuPay Gold, card worked 100%! All details decrypted in 3 seconds directly on screen.',
  },
  {
    id: 'lp-7',
    name: 'Arjun Thakur',
    avatar: 'A',
    avatarBg: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    card: 'Visa Premier',
    price: '₹729',
    time: '29m ago',
    rating: 5,
    review: 'Purchased Visa Premier, 100% genuine and working! Active status verified, tested smoothly.',
  },
  {
    id: 'lp-8',
    name: 'Devansh Roy',
    avatar: 'D',
    avatarBg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    card: 'Royal Gold Prestige',
    price: '₹999',
    time: '36m ago',
    rating: 5,
    review: 'I bought Royal Gold Prestige — card worked 100%! Tested international checkout smoothly with zero hassle.',
  },
  {
    id: 'lp-9',
    name: 'Vicky Patel',
    avatar: 'V',
    avatarBg: 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)',
    card: 'Visa Infinite Black',
    price: '₹1,099',
    time: '44m ago',
    rating: 5,
    review: 'Highest tier card, 100% working on all platforms with instant token reveal and active status.',
  },
  {
    id: 'lp-10',
    name: 'Ritu Sen',
    avatar: 'R',
    avatarBg: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    card: 'Mastercard Elite',
    price: '₹899',
    time: '53m ago',
    rating: 5,
    review: 'Purchased Mastercard Elite, worked 100%! 1-click token copy, decrypted CVV in 3 seconds, top quality!',
  },
  {
    id: 'lp-11',
    name: 'Farhan Ali',
    avatar: 'F',
    avatarBg: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
    card: 'Mastercard Black',
    price: '₹999',
    time: '1h ago',
    rating: 5,
    review: 'Bought Mastercard Black, card worked 100%! Clean delivery vault, instant credentials reveal, great support.',
  },
  {
    id: 'lp-12',
    name: 'Ananya Sen',
    avatar: 'A',
    avatarBg: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    card: 'Mastercard Gold',
    price: '₹499',
    time: '1h ago',
    rating: 5,
    review: 'I bought Mastercard Gold, worked 100%! Instant token code delivery, very satisfied.',
  },
  {
    id: 'lp-13',
    name: 'Rajesh Iyer',
    avatar: 'R',
    avatarBg: 'linear-gradient(135deg, #475569 0%, #1e293b 100%)',
    card: 'Visa Infinite Black',
    price: '₹1,099',
    time: '2h ago',
    rating: 5,
    review: 'Purchased Visa Infinite Black, 100% working on all platforms! Fast delivery and active balance.',
  },
  {
    id: 'lp-14',
    name: 'Priya Mukherjee',
    avatar: 'P',
    avatarBg: 'linear-gradient(135deg, #db2777 0%, #9d174d 100%)',
    card: 'RuPay Premium',
    price: '₹699',
    time: '2h ago',
    rating: 5,
    review: 'Card worked 100% with zero decline! Instant UPI confirmation and decrypted CVV.',
  },
  {
    id: 'lp-15',
    name: 'Siddharth Roy',
    avatar: 'S',
    avatarBg: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
    card: 'Mastercard Elite',
    price: '₹899',
    time: '2h ago',
    rating: 5,
    review: 'Purchased Mastercard Elite, worked 100%! CVV and PIN unlocked in delivery vault in 3 seconds.',
  },
  {
    id: 'lp-16',
    name: 'Neha Singhal',
    avatar: 'N',
    avatarBg: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
    card: 'Mastercard Platinum',
    price: '₹648',
    time: '3h ago',
    rating: 5,
    review: 'Bought Mastercard Platinum, card worked 100%! Quick, reliable, and active verified status.',
  },
  {
    id: 'lp-17',
    name: 'Tanmoy Mondal',
    avatar: 'T',
    avatarBg: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
    card: 'Royal Gold Prestige',
    price: '₹999',
    time: '3h ago',
    rating: 5,
    review: 'I bought Royal Gold Prestige, card worked 100%! Delivered with full 16-digit PAN and CVV.',
  },
  {
    id: 'lp-18',
    name: 'Kabir Verma',
    avatar: 'K',
    avatarBg: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    card: 'RuPay Gold',
    price: '₹1,199',
    time: '4h ago',
    rating: 5,
    review: 'I bought RuPay Gold and it worked 100%! Effortless delivery and active status.',
  },
  {
    id: 'lp-19',
    name: 'Shreya Bose',
    avatar: 'S',
    avatarBg: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
    card: 'Visa Premier',
    price: '₹729',
    time: '4h ago',
    rating: 5,
    review: 'Purchased Visa Premier, 100% working on my tests! Sleek UI and instant credential reveal.',
  },
  {
    id: 'lp-20',
    name: 'Abhishek Chawla',
    avatar: 'A',
    avatarBg: 'linear-gradient(135deg, #ca8a04 0%, #a16207 100%)',
    card: 'Mastercard Premium',
    price: '₹810',
    time: '5h ago',
    rating: 5,
    review: 'Bought Mastercard Premium, worked 100%! Active status verified smoothly.',
  },
  {
    id: 'lp-21',
    name: 'Meera Kulkarni',
    avatar: 'M',
    avatarBg: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
    card: 'Visa Gold',
    price: '₹599',
    time: '5h ago',
    rating: 5,
    review: 'I purchased Visa Gold, card worked 100%! Delivered in under 4 seconds, copied tokens directly.',
  },
  {
    id: 'lp-22',
    name: 'Deepankar Paul',
    avatar: 'D',
    avatarBg: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
    card: 'Mastercard Black',
    price: '₹999',
    time: '6h ago',
    rating: 5,
    review: 'Purchased Mastercard Black, 100% genuine and working! Great customer service.',
  },
  {
    id: 'lp-23',
    name: 'Ritika Kapoor',
    avatar: 'R',
    avatarBg: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
    card: 'Royal Gold Prestige',
    price: '₹999',
    time: '6h ago',
    rating: 5,
    review: 'Bought Royal Gold Prestige, card worked 100%! Flawless verification and decrypted details.',
  },
  {
    id: 'lp-24',
    name: 'Sourav Ganguly',
    avatar: 'S',
    avatarBg: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
    card: 'Mastercard Gold',
    price: '₹499',
    time: '7h ago',
    rating: 5,
    review: 'Fast, smooth and 100% working card. Verified buyer here, highly recommended!',
  },
  {
    id: 'lp-25',
    name: 'Pankaj Tripathi',
    avatar: 'P',
    avatarBg: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
    card: 'Visa Infinite Black',
    price: '₹1,099',
    time: '8h ago',
    rating: 5,
    review: 'I bought Visa Infinite Black and the card worked 100%! Highest tier card with instant token reveal.',
  },
];

const toEnglishComment = (text: string): string => {
  if (!text) return 'I purchased this card and the card worked 100%! Instant delivery and active balance.';
  if (/[\u0980-\u09FF]/.test(text)) {
    return 'I bought this card and the card worked 100%! Instant delivery, decrypted PIN and CVV right away.';
  }
  return text;
};

const getCardPrice = (cardName: string, index = 0): string => {
  if (!cardName) return '₹499';
  const name = cardName.trim().toLowerCase();

  if (name.includes('infinite black') || name.includes('infinite')) return '₹1,099';
  if (name.includes('ultimate sovereign') || name.includes('sovereign')) return '₹1,350';
  if (name.includes('black titanium')) return '₹1,299';
  if (name.includes('royal gold prestige') || name.includes('gold prestige')) return '₹999';
  if (name.includes('online card') || name.includes('online')) return '₹5';
  if (name.includes('mastercard black')) return '₹999';
  if (name.includes('diamond crest')) return '₹999';
  if (name.includes('diamond master') || name.includes('diamond')) return '₹899';
  if (name.includes('mastercard elite') || name.includes('elite')) return '₹899';
  if (name.includes('sapphire reserve')) return '₹920';
  if (name.includes('mastercard world')) return '₹890';
  if (name.includes('rupay premium')) return '₹699';
  if (name.includes('visa signature')) return '₹850';
  if (name.includes('mastercard premium')) return '₹810';
  if (name.includes('sapphire elite')) return '₹799';
  if (name.includes('titanium edge')) return '₹780';
  if (name.includes('visa premier')) return '₹729';
  if (name.includes('emerald privilege') || name.includes('emerald')) return '₹749';
  if (name.includes('mastercard platinum') || name.includes('platinum card')) return '₹648';
  if (name.includes('platinum club')) return '₹630';
  if (name.includes('rupay business')) return '₹650';
  if (name.includes('visa gold')) return '₹599';
  if (name.includes('ruby preferred') || name.includes('ruby')) return '₹599';
  if (name.includes('rupay gold')) return '₹1,199';
  if (name.includes('mastercard gold') || name.includes('gold card') || name.includes('gold star')) return '₹499';
  if (name.includes('rupay select') || name.includes('rupay platinum') || name.includes('rupay')) return '₹499';
  if (name.includes('coral card') || name.includes('coral')) return '₹399';
  if (name.includes('silver essential') || name.includes('silver')) return '₹349';

  const defaultVaried = ['₹499', '₹648', '₹866', '₹599', '₹999', '₹749', '₹810', '₹949', '₹559', '₹1,199'];
  return defaultVaried[index % defaultVaried.length];
};

export const ReviewsView: React.FC<ReviewsViewProps> = ({
  reviews,
  cards,
  onAddReview,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [selectedCard, setSelectedCard] = useState(cards[0]?.title || 'Mastercard Gold');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});

  const handleLike = (id: string) => {
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    const colors = ['#ff6500', '#a900ff', '#00df91', '#ffb300', '#00b4d8', '#ff0054'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: authorName.trim(),
      avatarColor: randomColor,
      rating,
      cardPurchased: selectedCard,
      date: 'Just now',
      comment: comment.trim(),
      verified: true,
      likes: 1,
    };

    onAddReview(newRev);
    setAuthorName('');
    setComment('');
    setShowForm(false);
  };

  return (
    <section id="reviews-view-container" className="reviews-section">
      {/* Featured Testimonials Header */}
      <div className="flex items-center justify-between">
        <div className="reviews-title">
          <h2>⭐ Featured Testimonials</h2>
          <p>See what our customers are saying</p>
        </div>

        {/* Write Review Toggle Button */}
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1.5 bg-[#172637] hover:bg-[#20344b] border border-[#3b516d] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-md"
        >
          <MessageSquarePlus className="w-3.5 h-3.5 text-amber-400" />
          <span>{showForm ? 'Cancel' : 'Write Review'}</span>
        </button>
      </div>

      {/* Review Submission Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#0e1824] border border-amber-500/40 rounded-[20px] p-5 shadow-2xl space-y-4 animate-fade-in"
        >
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Share Your Experience
          </h3>

          <div>
            <label className="text-xs text-gray-300 block mb-1">Your Name</label>
            <input
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. Roni"
              className="w-full bg-[#07101a] border border-[#273d56] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">Card Purchased</label>
            <select
              value={selectedCard}
              onChange={(e) => setSelectedCard(e.target.value)}
              className="w-full bg-[#07101a] border border-[#273d56] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-amber-400"
            >
              {cards.map((c) => (
                <option key={c.id} value={c.title}>
                  {c.title} (₹{c.price})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="p-1 cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 ${
                      s <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">Review Feedback</label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share how fast the delivery was and the card sandbox features..."
              className="w-full bg-[#07101a] border border-[#273d56] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-neutral-950 font-bold text-xs shadow-lg cursor-pointer hover:brightness-110"
          >
            Post Verified Review
          </button>
        </form>
      )}

      {/* Featured Testimonials Continuous Infinite Right-to-Left Marquee Slider */}
      <div className="testimonials-marquee-wrapper">
        <div className="testimonials-marquee-track">
          {[
            {
              id: 'feat-sample',
              author: 'Rahul Sen',
              avatar: 'R',
              avatarBg: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
              verified: true,
              rating: 5,
              comment: 'I bought this Mastercard Gold and the card worked 100%! Instant delivery under 4 seconds, balance active.',
              cardPurchased: 'Mastercard Gold',
              price: '₹499',
            },
            ...reviews.map((rev, idx) => ({
              id: rev.id,
              author: rev.author,
              avatar: rev.author.charAt(0),
              avatarBg: rev.avatarColor,
              verified: rev.verified,
              rating: rev.rating,
              comment: toEnglishComment(rev.comment),
              cardPurchased: rev.cardPurchased,
              price: getCardPrice(rev.cardPurchased, idx),
            })),
            {
              id: 'feat-1',
              author: 'Devansh Roy',
              avatar: 'D',
              avatarBg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              verified: true,
              rating: 5,
              comment: 'I purchased Mastercard Platinum and it worked 100%! Instant delivery in 5 seconds with zero decline.',
              cardPurchased: 'Mastercard Platinum',
              price: '₹648',
            },
            {
              id: 'feat-2',
              author: 'Ritu Sen',
              avatar: 'R',
              avatarBg: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
              verified: true,
              rating: 5,
              comment: 'I bought Royal Gold Prestige and the card worked 100%! Decrypted PIN & CVV in 3 seconds directly on screen.',
              cardPurchased: 'Royal Gold Prestige',
              price: '₹999',
            },
            {
              id: 'feat-3',
              author: 'Vicky Patel',
              avatar: 'V',
              avatarBg: 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)',
              verified: true,
              rating: 5,
              comment: 'Bought Visa Infinite Black card, 100% working on all test transactions! Super legit with full active balance.',
              cardPurchased: 'Visa Infinite Black',
              price: '₹649',
            },
            // Duplicate copy for seamless infinite 360° circular loop
            {
              id: 'feat-sample-dup',
              author: 'Rahul Sen',
              avatar: 'R',
              avatarBg: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
              verified: true,
              rating: 5,
              comment: 'I bought this Mastercard Gold and the card worked 100%! Instant delivery under 4 seconds, balance active.',
              cardPurchased: 'Mastercard Gold',
              price: '₹499',
            },
            ...reviews.map((rev, idx) => ({
              id: `${rev.id}-dup`,
              author: rev.author,
              avatar: rev.author.charAt(0),
              avatarBg: rev.avatarColor,
              verified: rev.verified,
              rating: rev.rating,
              comment: toEnglishComment(rev.comment),
              cardPurchased: rev.cardPurchased,
              price: getCardPrice(rev.cardPurchased, idx),
            })),
            {
              id: 'feat-1-dup',
              author: 'Devansh Roy',
              avatar: 'D',
              avatarBg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              verified: true,
              rating: 5,
              comment: 'I purchased Mastercard Platinum and it worked 100%! Instant delivery in 5 seconds with zero decline.',
              cardPurchased: 'Mastercard Platinum',
              price: '₹648',
            },
            {
              id: 'feat-2-dup',
              author: 'Ritu Sen',
              avatar: 'R',
              avatarBg: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
              verified: true,
              rating: 5,
              comment: 'I bought Royal Gold Prestige and the card worked 100%! Decrypted PIN & CVV in 3 seconds directly on screen.',
              cardPurchased: 'Royal Gold Prestige',
              price: '₹999',
            },
            {
              id: 'feat-3-dup',
              author: 'Vicky Patel',
              avatar: 'V',
              avatarBg: 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)',
              verified: true,
              rating: 5,
              comment: 'Bought Visa Infinite Black card, 100% working on all test transactions! Super legit with full active balance.',
              cardPurchased: 'Visa Infinite Black',
              price: '₹649',
            },
          ].map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="testimonial-card testimonial-card-slide">
              <div className="review-user">
                <div
                  style={{ background: item.avatarBg }}
                  className="avatar"
                >
                  {item.avatar}
                </div>
                <div>
                  <h3>{item.author}</h3>
                  {item.verified && <span>✓ Verified Buyer</span>}
                </div>
              </div>

              <div className="stars">
                {'★'.repeat(item.rating)} <b>{item.rating}.0</b>
              </div>

              <p className="review-text">
                “{item.comment}”
              </p>

              <div className="review-product">
                <span>{item.cardPurchased}</span>
                <strong>{item.price}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Purchase Feed */}
      <div className="purchase-title">
        <h2>🟢 Live Purchase Feed</h2>
        <p>Recent customer activity &amp; verified reviews</p>
      </div>

      <div className="space-y-2.5">
        {LIVE_PURCHASES.slice(0, 5).map((item) => (
          <div key={item.id} className="purchase-item">
            <div
              style={{ background: item.avatarBg }}
              className="avatar"
            >
              {item.avatar}
            </div>
            <div className="purchase-info">
              <div className="flex items-center justify-between">
                <div>
                  <b>{item.name}</b>
                  <span className="ml-1.5 text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                    ✓ Verified
                  </span>
                </div>
                <small>{item.time}</small>
              </div>

              <strong>{item.card} • {item.price}</strong>

              <div className="purchase-stars mt-0.5">
                {'★'.repeat(item.rating)}
              </div>

              <p className="purchase-review-text">
                “{item.review}”
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
