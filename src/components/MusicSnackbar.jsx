import React from 'react';
import { Play, Pause, SkipForward, Disc } from 'lucide-react';

export default function MusicSnackbar({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onNextTrack,
  onOpenVinylModal
}) {
  return (
    <div className="fixed bottom-20 sm:bottom-5 right-3 sm:right-5 z-35 max-w-xs sm:max-w-sm">
      <div className="backdrop-blur-xl bg-[#1A1918]/95 border border-[#C5A880]/40 rounded-full py-1.5 px-3 pl-2 shadow-2xl flex items-center gap-2.5 text-white transition-all hover:border-[#C5A880] group">
        
        {/* Spinning Mini Vinyl Thumbnail */}
        <div 
          onClick={onOpenVinylModal}
          className="relative w-8 h-8 rounded-full bg-black border border-white/20 flex items-center justify-center cursor-pointer shrink-0 shadow-sm"
        >
          <Disc 
            className={`w-6 h-6 text-[#C5A880] transition-transform ${
              isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
            }`} 
          />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-white" />
        </div>

        {/* Track Title & Artist (Tap to open Vinyl Deck) */}
        <div 
          onClick={onOpenVinylModal}
          className="flex-1 text-left truncate cursor-pointer pr-1"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-wider font-bold">
              90s VINYL
            </span>
            <span className="relative flex h-1.5 w-1.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPlaying ? 'bg-amber-400' : 'bg-zinc-600'} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isPlaying ? 'bg-amber-500' : 'bg-zinc-600'}`} />
            </span>
          </div>
          <div className="text-xs font-semibold text-white truncate max-w-[140px] sm:max-w-[170px]">
            {currentTrack.title}
          </div>
        </div>

        {/* Compact Transport Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePlay();
            }}
            className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-black" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNextTrack();
            }}
            className="w-7 h-7 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer"
            title="Next Track"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
