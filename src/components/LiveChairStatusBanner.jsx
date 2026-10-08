import React from 'react';
import { Star } from 'lucide-react';
import { SALON_INFO } from '../data/salonData';

export default function LiveChairStatusBanner({ chairStatus }) {
  const isBusy = chairStatus?.isBusy;

  return (
    <section className="px-4 pt-5 pb-2 max-w-4xl mx-auto">
      {/* Breathable, Clean Minimalist Status Card */}
      <div className="bg-white rounded-3xl border border-[#EAE4D9] p-5 sm:p-6 shadow-xs text-left transition-all">
        {/* Top Micro-Bar: Status Pill & Rating */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isBusy ? 'bg-amber-500 animate-pulse' : 'bg-emerald-600'}`} />
            <span className="text-xs font-semibold text-[#1A1918] tracking-wide uppercase">
              {isBusy ? 'Chair Currently In Service' : 'Chair Free & Ready'}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-[#7A7266] font-medium bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-[#EFE9DF]">
            <Star className="w-3 h-3 fill-[#C5A880] text-[#C5A880]" />
            <span className="font-bold text-[#1A1918]">{SALON_INFO.rating}</span>
            <span className="text-[11px] text-[#8C8477]">({SALON_INFO.reviewsCount}+ reviews)</span>
          </div>
        </div>

        {/* Core Message: Crisp & Instantaneous */}
        <div className="space-y-1">
          <h2 className="font-editorial text-2xl sm:text-3xl text-[#1A1918] font-normal leading-snug">
            {isBusy ? (
              <>
                Next opening today at <span className="font-semibold underline decoration-[#C5A880] underline-offset-4">{chairStatus.serviceEndTime}</span>
              </>
            ) : (
              <>
                Immediate walk-in & booking available now
              </>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-[#736B60] leading-relaxed pt-1">
            {isBusy ? (
              <>
                Stylist is attending a client (~{chairStatus.busyUntilMinutes}m remaining). Choose your treatments below to book the next continuous slot without calling the shop.
              </>
            ) : (
              <>
                Stylist chair is open. Select your preferred services below to lock in your appointment instantly.
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
