export type CardCategory = 'all' | 'mastercard' | 'visa' | 'rupay' | 'gold' | 'online';

export interface CardItem {
  id: string;
  title: string;
  category: 'mastercard' | 'visa' | 'rupay' | 'gold' | 'online';
  theme: 'red' | 'red2' | 'green' | 'gold' | 'blue' | 'purple' | 'black';
  number: string;
  price: number;
  originalPrice?: number;
  discountBadge?: string;
  limit?: string;
  realBalance: number;
  realMoney: string;
  expiry: string;
  cvv: string;
  cvc: string;
  purchasedCount: number;
  verifyText: string;
  features: string[];
  popular?: boolean;
}

export interface PurchasedOrder {
  id: string;
  cardId: string;
  cardTitle: string;
  price: number;
  orderNumber: string;
  timestamp: number;
  status: 'Delivered' | 'Active' | 'Verified';
  cardDetails: {
    number: string;
    expiry: string;
    cvv: string;
    limit?: string;
    realBalance?: number;
    realMoney?: string;
    pin: string;
  };
}

export interface ReviewItem {
  id: string;
  author: string;
  avatarColor: string;
  rating: number;
  cardPurchased: string;
  date: string;
  comment: string;
  verified: boolean;
  likes: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'delivery' | 'payment' | 'usage' | 'security';
}

export type NavTab = 'cards' | 'online-cards' | 'delivery' | 'reviews' | 'support';
