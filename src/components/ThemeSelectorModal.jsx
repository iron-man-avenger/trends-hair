import React from 'react';
import { X, Check, Palette } from 'lucide-react';
import { LUXURY_THEMES } from '../data/themesData';

export default function ThemeSelectorModal({
  isOpen,
  onClose,
  currentThemeId,
  onSelectTheme
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EAE4D9] p-6 text-[#1A1918] shadow-2xl relative text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE0]">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#B38F5F]" />
            <div>
              <h3 className="font-editorial text-xl font-bold text-[#1A1918]">
                Select Luxury Theme
              </h3>
              <p className="text-[11px] text-[#736B60]">
                Top rated salon palettes from modern design trends
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#FAF7F2] border border-[#E5DCCE] text-[#736B60] hover:text-[#1A1918] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Theme Options */}
        <div className="my-5 space-y-2.5">
          {Object.values(LUXURY_THEMES).map((theme) => {
            const isSelected = currentThemeId === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => {
                  onSelectTheme(theme.id);
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-2 border-[#1A1918] bg-[#FAF7F2] shadow-sm'
                    : 'border-[#EAE4D9] bg-white hover:border-[#C5A880] hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Swatch dots */}
                  <div className="flex items-center -space-x-1.5 shrink-0">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-xs" 
                      style={{ backgroundColor: theme.dotColor }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-xs" 
                      style={{ backgroundColor: theme.accentColor }}
                    />
                  </div>

                  <div>
                    <div className="text-sm font-bold text-[#1A1918]">
                      {theme.name}
                    </div>
                    <div className="text-[11px] text-[#736B60]">
                      {theme.subtitle}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[#1A1918] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-[#8C8477] text-center">
          Tap any theme to instantly preview how the entire salon looks!
        </p>
      </div>
    </div>
  );
}
