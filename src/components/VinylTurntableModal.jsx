import React, { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, X, Disc } from 'lucide-react';
import { BOLLYWOOD_90S_PLAYLIST } from '../data/musicData';

export default function VinylTurntableModal({
  isOpen,
  onClose,
  currentTrack,
  setCurrentTrack,
  isPlaying,
  setIsPlaying,
  volume,
  setVolume,
  onTogglePlay,
  onNextTrack,
  onPrevTrack
}) {
  const [rpmSpeed, setRpmSpeed] = useState(33);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#131317] border border-[#C5A880]/30 rounded-3xl p-4 sm:p-6 text-white shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <Disc className={`w-4 h-4 text-[#C5A880] ${isPlaying ? 'animate-spin' : ''}`} />
            <div>
              <h2 className="font-editorial text-base sm:text-lg font-bold text-white tracking-wide">
                Trends 90s Vinyl Lounge
              </h2>
              <p className="text-[10px] text-[#C5A880] uppercase tracking-wider">
                Vintage Bollywood Turntable
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Container for Turntable + Generous Tracklist */}
        <div className="flex-1 overflow-y-auto pr-0.5 space-y-4 my-2">
          
          {/* Turntable Platter Deck */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-[#1A1A22] to-[#101014] border border-white/10 shadow-xl relative select-none">
            
            {/* The Rotating 12" Vinyl Disc & Stylus */}
            <div className="relative w-full h-38 sm:h-44 flex items-center justify-center overflow-hidden">
              
              {/* Spinning Vinyl */}
              <div 
                className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full border-4 border-[#24242C] shadow-2xl flex items-center justify-center overflow-hidden shrink-0"
                style={{
                  boxShadow: '0 10px 25px rgba(0,0,0,0.8), inset 0 0 10px rgba(0,0,0,0.9)'
                }}
              >
                <div 
                  className={`absolute inset-0 rounded-full transition-all ${
                    isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
                  }`}
                  style={{
                    background: 'repeating-radial-gradient(circle, #0B0B0E 0px, #16161C 1.5px, #0B0B0E 3px, #181820 4.5px)',
                    animationDuration: rpmSpeed === 45 ? '2.8s' : '4.2s'
                  }}
                >
                  {/* Vinyl Light Sheen Reflection */}
                  <div 
                    className="absolute inset-0 rounded-full opacity-35 pointer-events-none"
                    style={{
                      background: 'conic-gradient(from 45deg, transparent 0deg, rgba(255,255,255,0.2) 45deg, transparent 90deg, rgba(255,255,255,0.1) 180deg, transparent 270deg, rgba(255,255,255,0.2) 315deg, transparent 360deg)'
                    }}
                  />

                  {/* Center Vintage Label */}
                  <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-black/40 flex flex-col items-center justify-center p-1 text-center shadow-inner"
                    style={{ backgroundColor: currentTrack.color || '#C5A880' }}
                  >
                    <span className="text-[6px] font-bold text-black uppercase tracking-wider">
                      {currentTrack.label || 'HMV'}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-[#0E0E12] border border-white/40 my-0.5 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-white" />
                    </div>
                    <span className="text-[5.5px] font-mono font-bold text-black/90">
                      {rpmSpeed} RPM
                    </span>
                  </div>
                </div>
              </div>

              {/* Physical Tonearm & Stylus */}
              <div className="absolute top-1 right-6 sm:right-8 w-20 h-32 pointer-events-none">
                <div className="absolute top-0 right-1 w-6 h-6 rounded-full bg-gradient-to-tr from-zinc-700 via-amber-200 to-zinc-400 border border-black/60 shadow-md flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-600" />
                </div>

                <div 
                  className="absolute top-3 right-4 w-1 h-24 origin-top transition-transform duration-700 ease-out"
                  style={{
                    transform: isPlaying ? 'rotate(-24deg)' : 'rotate(0deg)'
                  }}
                >
                  <div className="w-1 h-full bg-gradient-to-b from-amber-200 via-zinc-300 to-amber-300 rounded-full shadow-md" />
                  <div className="absolute bottom-0 -left-1 w-3.5 h-5 bg-gradient-to-b from-zinc-800 to-zinc-950 border border-amber-300/60 rounded-xs shadow-md flex items-center justify-center">
                    <div className="w-0.5 h-1.5 bg-amber-400 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Currently Playing Track Info */}
            <div className="mt-2 text-center px-1">
              <h3 className="font-editorial text-base sm:text-lg font-bold text-white truncate">
                {currentTrack.title}
              </h3>
              <p className="text-[11px] text-[#C5A880] truncate">
                {currentTrack.artists} • {currentTrack.movie}
              </p>
            </div>

            {/* Transport Controls Bar */}
            <div className="mt-2.5 pt-2.5 border-t border-white/10 flex items-center justify-between gap-2 px-1">
              <button
                onClick={() => setRpmSpeed(rpmSpeed === 33 ? 45 : 33)}
                className="px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-[9px] font-mono font-bold text-[#C5A880] hover:border-[#C5A880] transition-colors cursor-pointer"
              >
                {rpmSpeed} RPM
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={onPrevTrack}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  title="Previous Track"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onTogglePlay}
                  className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#C5A880] to-[#E5D7C2] text-black font-bold flex items-center justify-center shadow-lg shadow-[#C5A880]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title={isPlaying ? "Pause Record" : "Drop Needle & Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-black" />
                  ) : (
                    <Play className="w-4 h-4 fill-black ml-0.5" />
                  )}
                </button>

                <button
                  onClick={onNextTrack}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  title="Next Track"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#C5A880]" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-14 accent-[#C5A880] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Generous, Easily Browseable Tracklist Container */}
          <div className="bg-[#181820] p-3 rounded-2xl border border-white/10 text-left space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#C5A880] pb-1 border-b border-white/10">
              <span>90s Collection ({BOLLYWOOD_90S_PLAYLIST.length} Songs)</span>
              <span className="text-[10px] text-zinc-400 font-normal">Tap to play</span>
            </div>

            <div className="space-y-1.5 max-h-56 sm:max-h-64 overflow-y-auto pr-1">
              {BOLLYWOOD_90S_PLAYLIST.map((track) => {
                const isCurrent = currentTrack.id === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => {
                      setCurrentTrack(track);
                      setIsPlaying(true);
                    }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'bg-[#22222E] border-[#C5A880] text-white shadow-xs'
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06] text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div 
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 text-black shadow-xs"
                        style={{ backgroundColor: track.color || '#C5A880' }}
                      >
                        {isCurrent && isPlaying ? (
                          <Disc className="w-4 h-4 animate-spin" />
                        ) : (
                          '90s'
                        )}
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-xs sm:text-sm truncate text-white">{track.title}</div>
                        <div className="text-[10px] text-zinc-400 truncate">{track.artists} • {track.movie}</div>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-[#C5A880] shrink-0 font-medium">
                      {track.duration}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
