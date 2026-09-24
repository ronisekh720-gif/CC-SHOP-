import React, { useState, useEffect } from 'react';
import { CardCategory, CardItem, NavTab, PurchasedOrder, ReviewItem } from './types';
import { INITIAL_CARDS, INITIAL_REVIEWS, ONLINE_CARDS, ONLINE_CARD } from './data/cardsData';
import { OfferBanner } from './components/OfferBanner';
import { CustomerCounterBadge } from './components/CustomerCounterBadge';
import { DeliveryCard } from './components/DeliveryCard';
import { CardItemView } from './components/CardItemView';
import { PaymentModal, generateDeliveredCardOrder } from './components/PaymentModal';
import { PlanModal } from './components/PlanModal';
import { DeliveryVaultModal } from './components/DeliveryVaultModal';
import { DeliveryVideoGuide } from './components/DeliveryVideoGuide';
import { ReviewsView } from './components/ReviewsView';
import { OnlineCardsReviewsView } from './components/OnlineCardsReviewsView';
import { SupportView } from './components/SupportView';
import { BottomNav } from './components/BottomNav';
import { ToastContainer, ToastMessage } from './components/Toast';
import { QRCodeDisplay } from './components/QRCodeDisplay';
import { QRModal } from './components/QRModal';
import { RealQrScannerModal } from './components/RealQrScannerModal';
import { Search, ShieldAlert, Sparkles, Filter, QrCode, ScanLine } from 'lucide-react';

export default function App() {
  // Navigation & Category state
  const [activeNav, setActiveNav] = useState<NavTab>('cards');
  const [selectedCategory, setSelectedCategory] = useState<CardCategory>('mastercard');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Selected Card state
  const [selectedCardForPayment, setSelectedCardForPayment] = useState<CardItem | null>(null);
  const [selectedCardForPlan, setSelectedCardForPlan] = useState<CardItem | null>(null);
  const [isDeliveryVaultOpen, setIsDeliveryVaultOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isRealQrScannerOpen, setIsRealQrScannerOpen] = useState(false);

  // Payment Scanner aliases
  const isPaymentScannerOpen = !!selectedCardForPayment;
  const handleClosePaymentScanner = () => setSelectedCardForPayment(null);
  const handleScanner = () => {
    setIsRealQrScannerOpen(true);
  };

  // Purchased Orders state (persisted in localStorage for convenience)
  const [orders, setOrders] = useState<PurchasedOrder[]>(() => {
    try {
      const saved = localStorage.getItem('cc_store_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Reviews state (persisted with latest authentic 100% working high-praise testimonials)
  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      const version = localStorage.getItem('cc_store_reviews_version');
      if (version === 'v4_praise') {
        const saved = localStorage.getItem('cc_store_reviews');
        if (saved) return JSON.parse(saved);
      }
      localStorage.setItem('cc_store_reviews', JSON.stringify(INITIAL_REVIEWS));
      localStorage.setItem('cc_store_reviews_version', 'v4_praise');
      return INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const original = (window as unknown as { demoPurchaseComplete?: () => void }).demoPurchaseComplete;
    (window as unknown as { demoPurchaseComplete: () => void }).demoPurchaseComplete = () => {
      setActiveNav('delivery');
      const el = document.getElementById('walletCard');
      if (el) {
        el.style.display = 'block';
      }
    };
    return () => {
      if (original) {
        (window as unknown as { demoPurchaseComplete: () => void }).demoPurchaseComplete = original;
      }
    };
  }, []);

  const addToast = (type: ToastMessage['type'], text: string) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cc_store_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Sync reviews to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cc_store_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews]);

  // Filter cards by category & search query
  const filteredCards = INITIAL_CARDS.filter((card) => {
    const matchesCategory =
      selectedCategory === 'all' ? true : card.category === selectedCategory;
    const matchesSearch =
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (card.limit && card.limit.toLowerCase().includes(searchQuery.toLowerCase())) ||
      card.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.number.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const handlePaymentSuccess = (newOrder: PurchasedOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setActiveNav('delivery');
    setTimeout(() => {
      const el = document.getElementById('walletCard');
      if (el) {
        el.style.display = 'block';
      }
    }, 50);
    addToast('success', `Payment successful! Order #${newOrder.orderNumber} delivered.`);
  };

  const handleClearOrders = () => {
    setOrders([]);
    addToast('info', 'Delivery vault cleared.');
  };

  const handleAddReview = (newReview: ReviewItem) => {
    setReviews((prev) => [newReview, ...prev]);
    addToast('success', 'Thank you! Your verified review was posted.');
  };

  const handleSelectCard = (card: CardItem) => {
    // Silent selection: do not trigger any toast/selected notification
    setSelectedCardForPayment(card);
  };

  const handleOpenCardByName = (cardName: string) => {
    const all = [...INITIAL_CARDS, ...ONLINE_CARDS];
    const found = all.find(
      (c) => c.title.toLowerCase().trim() === cardName.toLowerCase().trim()
    ) || all.find(
      (c) => c.title.toLowerCase().includes(cardName.toLowerCase())
    );
    if (found) {
      handleSelectCard(found);
    }
  };

  useEffect(() => {
    (window as unknown as { openCard: (name: string) => void }).openCard = handleOpenCardByName;
    return () => {
      delete (window as unknown as { openCard?: unknown }).openCard;
    };
  }, []);

  return (
    <div className="app app-container min-h-screen text-white flex flex-col items-center select-none font-sans antialiased">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Main App Container - Responsive on Mobile & PC */}
      <main className="main-content w-full max-w-[520px] md:max-w-5xl lg:max-w-6xl xl:max-w-7xl min-h-screen pb-[72px] md:pb-16 relative flex flex-col shadow-2xl mx-auto transition-all">
        {/* Top Header Offer Banner */}
        <OfferBanner />

        {/* Dedicated Desktop PC Navigation Bar (Shown on PC/Computers) */}
        <header className="hidden md:flex items-center justify-between px-6 py-3.5 mb-5 bg-[#091320]/95 backdrop-blur-md border border-[#20344b] rounded-2xl mx-5 mt-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-black text-neutral-950 shadow-md text-base">
              CC
            </div>
            <div>
              <div className="text-base font-black tracking-wider text-white flex items-center gap-2">
                <span>CC SHOP ZONE</span>
                <span className="text-[10px] bg-amber-400/20 border border-amber-400/40 text-amber-300 px-2 py-0.5 rounded-full font-bold uppercase">
                  Desktop Edition
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium">Instant Verified Simulation Store &amp; Delivery</p>
            </div>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="flex items-center gap-1.5 bg-[#050b14] p-1.5 rounded-xl border border-[#1a2b3e]">
            <button
              type="button"
              onClick={() => {
                setActiveNav('cards');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeNav === 'cards'
                  ? 'bg-amber-400 text-neutral-950 shadow-md font-extrabold'
                  : 'text-gray-300 hover:text-white hover:bg-[#101d2d]'
              }`}
            >
              <span>💳 CARDS</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${activeNav === 'cards' ? 'bg-neutral-950/20 text-neutral-950' : 'bg-[#1b2a3c] text-amber-300'}`}>
                {INITIAL_CARDS.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNav('online-cards');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeNav === 'online-cards'
                  ? 'bg-amber-400 text-neutral-950 shadow-md font-extrabold'
                  : 'text-gray-300 hover:text-white hover:bg-[#101d2d]'
              }`}
            >
              <span>🌐 ONLINE CARDS</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${activeNav === 'online-cards' ? 'bg-neutral-950/20 text-neutral-950' : 'bg-[#1b2a3c] text-amber-300'}`}>
                {ONLINE_CARDS.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNav('delivery');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeNav === 'delivery'
                  ? 'bg-amber-400 text-neutral-950 shadow-md font-extrabold'
                  : 'text-gray-300 hover:text-white hover:bg-[#101d2d]'
              }`}
            >
              <span>📦 YOUR DELIVERY</span>
              {orders.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500 text-white animate-pulse">
                  {orders.length}
                </span>
              )}
            </button>
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleScanner}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer"
            >
              <ScanLine className="w-3.5 h-3.5" />
              <span>Camera Scan</span>
            </button>

            <button
              type="button"
              onClick={() => setIsQRModalOpen(true)}
              className="bg-[#152538] hover:bg-[#1d334d] border border-[#304764] text-amber-300 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Store QR</span>
            </button>
          </div>
        </header>

        {/* CC SHOP ZONE BRAND / CARDS FOR ONLINE USE */}
        <div className="text-center flex flex-col items-center">
          <div className="app-name cc-store-title !mb-1.5">
            {activeNav === 'online-cards' ? 'CARDS FOR ONLINE USE' : 'CC SHOP ZONE'}
          </div>
          {activeNav === 'online-cards' && (
            <CustomerCounterBadge
              className="mb-2 animate-fade-in"
              baseCount={780530}
              storageKey="cc_store_online_total_customers"
              locale="en-US"
            />
          )}
          {activeNav === 'cards' && (
            <CustomerCounterBadge
              className="mb-2 animate-fade-in"
              baseCount={11097302}
              storageKey="cc_store_main_total_customers_v3"
              locale="en-IN"
            />
          )}
          <p className="tagline subtitle store-description text-[11px] font-medium tracking-wider text-amber-300/80 uppercase px-4 mb-5">
            {activeNav === 'online-cards'
              ? 'Instant Verified Online Access Cards with Immediate Delivery'
              : 'Premium Cards & Secure Simulation Store with Instant Test Delivery'}
          </p>
        </div>

        {/* Tab-Specific Views */}
        {activeNav === 'cards' && (
          <section id="cards-screen" className="flex-1 animate-fade-in">
            {/* Delivery Teaser Box */}
            <DeliveryCard
              orders={orders}
              onOpenDelivery={() => setIsDeliveryVaultOpen(true)}
            />

            {/* Quick QR Code Pay Shortcut */}
            <div className="quick-scan mx-5 mb-5 p-4 rounded-2xl bg-[#0b1626] border border-[#233549] flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div 
                  onClick={() => setIsRealQrScannerOpen(true)}
                  className="w-12 h-12 rounded-xl bg-white p-1.5 flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform"
                >
                  <QrCode className="w-full h-full text-neutral-900" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>Scan to Pay</span>
                    <span className="text-[10px] bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-2 py-0.5 rounded-full font-bold">Live</span>
                  </h4>
                  <p className="text-xs text-gray-400">Scan camera QR code or open store QR</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsRealQrScannerOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-emerald-900/30 flex items-center gap-1"
                >
                  <ScanLine className="w-3.5 h-3.5" />
                  <span>Scan</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsQRModalOpen(true)}
                  className="bg-[#18293d] hover:bg-[#223955] border border-[#3b5578] text-amber-300 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  QR Code
                </button>
              </div>
            </div>

            {/* Category Tabs */}
            <div
              id="category-tabs-container"
              className="card-categories categories card-tabs no-scrollbar"
            >
              {[
                { id: 'mastercard', label: 'Mastercard Card' },
                { id: 'visa', label: 'Visa Card' },
                { id: 'rupay', label: 'RuPay Card' },
              ].map((tab) => {
                const isActive = selectedCategory === tab.id;
                const count = tab.id === 'all' 
                  ? INITIAL_CARDS.length 
                  : INITIAL_CARDS.filter((c) => c.category === tab.id).length;

                return (
                  <button
                    key={tab.id}
                    id={`category-tab-${tab.id}`}
                    type="button"
                    onClick={() => setSelectedCategory(tab.id as CardCategory)}
                    className={`category-btn card-category card-tab tab ${isActive ? 'active' : ''}`}
                  >
                    <span>{tab.label}</span>
                    <span className="count category-count card-count badge tab-count">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Search filter bar */}
            <div className="search-section px-5 mb-4">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cards by name or limit (e.g. Gold, ₹79K)..."
                  className="w-full bg-[#0d1724] border border-[#233549] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-hidden focus:border-amber-400 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Cards List */}
            <div className="px-5 cards-container">
              {filteredCards.length === 0 ? (
                <div className="text-center py-12 px-4 bg-[#0c1622] rounded-2xl border border-[#233549] my-4">
                  <p className="text-sm font-semibold text-gray-300">
                    No cards found matching "{searchQuery}"
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="mt-3 text-xs text-amber-400 font-bold underline cursor-pointer"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                filteredCards.map((card) => (
                  <CardItemView
                    key={card.id}
                    card={card}
                    onSelectCard={handleSelectCard}
                    onOpenPlan={(c) => setSelectedCardForPlan(c)}
                  />
                ))
              )}
            </div>

            {/* Card Video Tutorial Guide below cards - Only shown after purchasing a card */}
            {orders.length > 0 && (
              <div className="px-5 mt-4 mb-2">
                <DeliveryVideoGuide
                  orders={orders}
                  title="Free Fire ATM Card Top-Up Video Tutorial"
                  onBrowseCards={() => setActiveNav('cards')}
                />
              </div>
            )}

            {/* Customer Reviews & Live Purchase Feed at the bottom */}
            <div className="mt-8 pt-4 border-t border-[#1e2f44]">
              <ReviewsView
                reviews={reviews}
                cards={INITIAL_CARDS}
                onAddReview={handleAddReview}
              />
            </div>
          </section>
        )}

        {/* Online Cards View (₹5 Online Cards) */}
        {activeNav === 'online-cards' && (
          <section id="online-cards-screen" className="flex-1 animate-fade-in">
            <div className="px-5 cards-container">
              {ONLINE_CARDS.map((card) => (
                <CardItemView
                  key={card.id}
                  card={card}
                  onSelectCard={handleSelectCard}
                  onOpenPlan={(c) => setSelectedCardForPlan(c)}
                />
              ))}
            </div>

            {/* Card Video Tutorial Guide below online cards - Only shown after purchasing a card */}
            {orders.length > 0 && (
              <div className="px-5 mt-4 mb-2">
                <DeliveryVideoGuide
                  orders={orders}
                  title="Online Card Top-Up Video Guide"
                  onBrowseCards={() => setActiveNav('online-cards')}
                />
              </div>
            )}

            {/* Dedicated Positive Customer Reviews for Online Cards */}
            <OnlineCardsReviewsView cards={ONLINE_CARDS} />
          </section>
        )}

        {/* Delivery Screen Tab */}
        <section
          id="delivery-screen"
          className={`flex-1 px-5 py-4 animate-fade-in ${activeNav === 'delivery' ? 'block' : 'hidden'}`}
        >
          <div className="bg-[#101b29] border border-[#233549] rounded-[22px] p-6 text-center shadow-xl mb-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg mb-3">
              📦
            </div>
            <h2 className="text-xl font-bold text-white">Items Ready &amp; Delivered</h2>
            <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
              All purchased card goods, generated tokens, PINs and encrypted keys are stored safely here
            </p>
          </div>

          {/* Success Message Banner */}
          {orders.length > 0 && (
            <div className="mb-5 animate-fade-in">
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h2>Payment Successful</h2>
                <p>Order #{orders[0].orderNumber} Delivered</p>
              </div>
            </div>
          )}

          {/* Vault items - only shown when orders exist */}
          {orders.length > 0 && (
            <div className="space-y-4 mb-5">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#101b29] border border-[#233549] rounded-2xl p-4.5 shadow-md"
                >
                  <div className="flex items-center justify-between border-b border-[#1b2b3d] pb-2 mb-3">
                    <h4 className="text-sm font-bold text-amber-300">
                      {order.cardTitle}
                    </h4>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded-full">
                      ✓ {order.status}
                    </span>
                  </div>

                  <div className="bg-[#07111c] border border-[#1b2b3d] rounded-xl p-3 space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-sans">Number:</span>
                      <span className="text-white font-bold">{order.cardDetails.number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-sans">Expiry / CVV:</span>
                      <span className="text-cyan-300">{order.cardDetails.expiry} | CVV: {order.cardDetails.cvv}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-sans">Limit / PIN:</span>
                      <span className="text-emerald-400">{order.cardDetails.limit || 'Active'} | PIN: {order.cardDetails.pin}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-between items-center text-[11px]">
                    <span className="text-gray-400 font-mono">#{order.orderNumber}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const text = `${order.cardDetails.number}|${order.cardDetails.expiry}|${order.cardDetails.cvv}|PIN:${order.cardDetails.pin}`;
                        navigator.clipboard.writeText(text);
                        addToast('success', 'Card credentials token copied!');
                      }}
                      className="text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
                    >
                      Copy Credentials →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Hidden helper element for script compatibility if orders is empty */}
          <div id="walletCard" style={{ display: 'none' }} />

            {/* Tutorial Video Guide - Visible only after card purchase */}
            {orders.length > 0 && (
              <DeliveryVideoGuide
                orders={orders}
                onBrowseCards={() => setActiveNav('cards')}
              />
            )}
          </section>

        {/* Reviews Screen Tab */}
        {activeNav === 'reviews' && (
          <section id="reviews-screen" className="flex-1 animate-fade-in">
            <ReviewsView
              reviews={reviews}
              cards={INITIAL_CARDS}
              onAddReview={handleAddReview}
            />
          </section>
        )}

        {/* Support Screen Tab */}
        {activeNav === 'support' && (
          <section id="support-screen" className="flex-1 animate-fade-in">
            <SupportView />
          </section>
        )}

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeNav}
          onTabChange={(tab) => setActiveNav(tab)}
          orderCount={orders.length}
        />

        {/* Payment Modal */}
        {isPaymentScannerOpen && (
          <PaymentModal
            isOpen={isPaymentScannerOpen}
            card={selectedCardForPayment}
            onClose={handleClosePaymentScanner}
            onPaymentSuccess={(newOrder) => {
              handlePaymentSuccess(newOrder);
            }}
          />
        )}

        {/* Plan Details Modal */}
        <PlanModal
          card={selectedCardForPlan}
          onClose={() => setSelectedCardForPlan(null)}
          onSelectCardForPay={(card) => {
            setSelectedCardForPlan(null);
            setSelectedCardForPayment(card);
          }}
        />

        {/* QR Code Full View Modal */}
        <QRModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          onOpenScanner={() => setIsRealQrScannerOpen(true)}
        />

        {/* Real QR Scanner Page / Modal (Flutter RealQrScannerPage counterpart) */}
        <RealQrScannerModal
          isOpen={isRealQrScannerOpen}
          onClose={() => setIsRealQrScannerOpen(false)}
          onScanSuccess={(code) => {
            const targetCard = selectedCardForPayment || INITIAL_CARDS[0];
            const targetTitle = targetCard?.title || targetCard?.name || 'Mastercard Gold';
            const targetPrice = targetCard?.price || 549;
            const newOrder = generateDeliveredCardOrder(targetCard, targetTitle, targetPrice);
            setIsRealQrScannerOpen(false);
            handlePaymentSuccess(newOrder);
            addToast('success', `⚡ Real Scanner verified! Card (${targetTitle}) unlocked.`);
          }}
        />

        {/* Delivery Goods Vault Modal */}
        {isDeliveryVaultOpen && (
          <DeliveryVaultModal
            orders={orders}
            onClose={() => setIsDeliveryVaultOpen(false)}
            onClearOrders={handleClearOrders}
            onBrowseCards={() => {
              setIsDeliveryVaultOpen(false);
              setActiveNav('cards');
            }}
          />
        )}
      </main>
    </div>
  );
}
