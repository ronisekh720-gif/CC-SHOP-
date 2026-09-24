import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

interface CustomerCounterBadgeProps {
  className?: string;
  baseCount?: number;
  storageKey?: string;
  locale?: string;
}

const INTERVAL_MS = 10 * 1000; // 10 seconds = 10,000ms
const DEFAULT_BASE_CUSTOMERS = 780530;

export const CustomerCounterBadge: React.FC<CustomerCounterBadgeProps> = ({
  className = '',
  baseCount = DEFAULT_BASE_CUSTOMERS,
  storageKey = 'cc_store_online_total_customers',
  locale = 'en-US',
}) => {
  const [customerCount, setCustomerCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      let count = saved ? parseInt(saved, 10) : baseCount;
      if (isNaN(count) || count < baseCount) count = baseCount;
      return count;
    } catch {
      return baseCount;
    }
  });

  useEffect(() => {
    // 10-second interval (10000ms) to increment customer count by 1
    const customerTimer = setInterval(() => {
      setCustomerCount((prev) => {
        const next = prev + 1;
        try {
          localStorage.setItem(storageKey, next.toString());
        } catch {
          // ignore
        }
        return next;
      });
    }, INTERVAL_MS);

    return () => {
      clearInterval(customerTimer);
    };
  }, [storageKey]);

  return (
    <div
      id="total-customers-badge"
      className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-950/70 via-[#0a2318]/80 to-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-bold text-xs sm:text-[13px] shadow-sm backdrop-blur-xs transition-all ${className}`}
    >
      <Users className="w-3.5 h-3.5 text-amber-300" />
      <span className="font-sans tracking-wide text-emerald-300">
        {customerCount.toLocaleString(locale)}+ TOTAL CUSTOMERS
      </span>
    </div>
  );
};
