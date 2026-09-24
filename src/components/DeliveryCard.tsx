import React from 'react';
import { PurchasedOrder } from '../types';

interface DeliveryCardProps {
  orders: PurchasedOrder[];
  onOpenDelivery: () => void;
}

export const DeliveryCard: React.FC<DeliveryCardProps> = ({ orders, onOpenDelivery }) => {
  return (
    <div
      id="delivery-card-section"
      className="delivery delivery-card mx-5 my-6 p-6 sm:p-7 border border-[#233549] rounded-[22px] bg-[#111f2e] text-center relative overflow-hidden group hover:border-[#334b66] transition-all duration-300 shadow-xl"
    >
      <div className="deliveryIcon">📦</div>

      <h2 className="your-delivery-title">Your Delivery</h2>

      <p className="delivery-subtitle">
        Access and receive your purchased goods securely
      </p>

      <button
        id="btn-check-goods"
        type="button"
        onClick={onOpenDelivery}
        className="check"
      >
        Check Goods
      </button>

      <div className="customer-review">
        <p>
          “Received the credentials in under 5 seconds directly in the delivery box!
          Excellent UI and super smooth test flow.”
        </p>
      </div>
    </div>
  );
};

