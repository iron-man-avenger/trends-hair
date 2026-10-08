import React from 'react';
import { Phone, Volume2, Palette, Disc } from 'lucide-react';
import { SALON_INFO } from '../data/salonData';

export default function Navbar({
  activeView,
  setActiveView,
  isAudioReady,
  onEnableAudio,
  onOpenThemeModal,
  onOpenVinylModal,
  isPlayingMusic
}) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-[#EAE4D9]/80 transition-all">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        
        {/* Brand: Clean Minimalist Editorial Logo */}
        <div className="flex items-baseline gap-2.5">
          <h1 className="font-brand text-xl sm:text-2xl font-bold tracking-[0.18em] text-[#1A1918] uppercase">
            TRENDS
          </h1>
          <span className="text-[10px] tracking-[0.15em] text-[#8C8477] uppercase font-medium">
            Satellite
          </span>
        </div>

        {/* Right Actions: Theme, 90s Vinyl, Phone, Mode Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* 90s Vinyl Music Button */}
          <button
            onClick={onOpenVinylModal}
            className="p-2 rounded-full bg-[#FAF7F2] border border-[#EAE4D9] text-[#1A1918] hover:border-[#C5A880] transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
            title="90s Bollywood Vinyl Player"
          >
            <Disc className={`w-3.5 h-3.5 text-[#B38F5F] ${isPlayingMusic ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline text-[11px] font-semibold">90s Radio</span>
          </button>

          {/* Theme Palette Switcher */}
          <button
            onClick={onOpenThemeModal}
            className="p-2 rounded-full bg-[#FAF7F2] border border-[#EAE4D9] text-[#1A1918] hover:border-[#C5A880] transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
            title="Change Luxury Color Theme"
          >
            <Palette className="w-3.5 h-3.5 text-[#B38F5F]" />
            <span className="hidden md:inline text-[11px] font-semibold">Theme</span>
          </button>

          {/* Subtle Phone Link */}
          <a
            href={`tel:${SALON_INFO.cleanPhone}`}
            className="hidden sm:flex items-center gap-1.5 text-xs text-[#5C554C] hover:text-[#1A1918] transition-colors font-medium px-2.5 py-1.5 rounded-full hover:bg-white"
          >
            <Phone className="w-3.5 h-3.5 text-[#B38F5F]" />
            <span>{SALON_INFO.phone}</span>
          </a>

          {/* Mode Switcher: Sleek, Unobtrusive Pill */}
          <div className="flex items-center p-0.5 rounded-full bg-[#EFE9DF] border border-[#E5DCCE]">
            <button
              onClick={() => setActiveView('customer')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'customer'
                  ? 'bg-white text-[#1A1918] shadow-xs'
                  : 'text-[#736B60] hover:text-[#1A1918]'
              }`}
            >
              Book
            </button>
            <button
              onClick={() => {
                setActiveView('barber');
                if (!isAudioReady && onEnableAudio) onEnableAudio();
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                activeView === 'barber'
                  ? 'bg-[#1A1918] text-white shadow-xs'
                  : 'text-[#736B60] hover:text-[#1A1918]'
              }`}
            >
              <Volume2 className="w-3 h-3 text-[#C5A880]" />
              <span>Stylist</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
