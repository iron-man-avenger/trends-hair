import React from 'react';
import { ArrowRight } from 'lucide-react';
import { formatCurrency, formatDuration } from '../utils/helpers';

export default function StickyBookingBar({ selectedServices, onOpenBookingFlow }) {
  const count = selectedServices.length;
  if (count === 0) return null;

  const totalDuration = selectedServices.reduce((acc, s) => acc + s.duration, 0);
  const totalPrice = selectedServices.reduce((acc, s) => acc + s.price, 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 p-4 pb-6 pointer-events-none">
      <div className="max-w-md mx-auto backdrop-blur-xl bg-[#1A1918]/95 border border-white/10 rounded-full px-5 py-3 shadow-xl pointer-events-auto flex items-center justify-between gap-3 text-white animate-in slide-in-from-bottom-2 duration-200">
        
        {/* Left: Tally info */}
        <div className="text-left leading-tight truncate">
          <div className="text-xs font-semibold truncate flex items-center gap-1.5">
            <span>{count} {count === 1 ? 'service' : 'services'}</span>
            <span className="text-[#C5A880]">•</span>
            <span className="text-[#EFE9DF]">{formatDuration(totalDuration)}</span>
          </div>
          <div className="text-sm font-bold font-sans tracking-tight text-white">
            {formatCurrency(totalPrice)}
          </div>
        </div>

        {/* Right: Clean Action Button */}
        <button
          onClick={onOpenBookingFlow}
          className="shrink-0 px-5 py-2.5 rounded-full bg-white hover:bg-[#FAF7F2] text-[#1A1918] font-bold text-xs tracking-wide shadow-sm flex items-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>Choose Slot</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
