import React from 'react';
import { Clock, Plus, Check } from 'lucide-react';
import { formatCurrency, formatDuration } from '../utils/helpers';

export default function ServiceCard({ service, isSelected, onToggle }) {
  return (
    <div
      onClick={() => onToggle(service)}
      className={`relative rounded-3xl p-5 transition-all duration-200 cursor-pointer text-left select-none group ${
        isSelected
          ? 'bg-white border-2 border-[#1A1918] shadow-md'
          : 'bg-white border border-[#EAE4D9] hover:border-[#C5A880] shadow-xs'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: Info */}
        <div className="space-y-1.5 flex-1 pr-2">
          {/* Subtle category/gender tag */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C8477]">
              {service.gender}
            </span>
            {service.badge && (
              <span className="text-[10px] font-semibold text-[#8C714E] bg-[#FAF6EE] px-2 py-0.5 rounded-full border border-[#EFE5D7]">
                {service.badge}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-editorial text-lg sm:text-xl text-[#1A1918] font-normal group-hover:text-[#000000] leading-snug">
            {service.name}
          </h3>

          {/* Clean 1-line description */}
          <p className="text-xs text-[#736B60] leading-relaxed line-clamp-2">
            {service.description}
          </p>

          {/* Price & Duration Line */}
          <div className="pt-2 flex items-center gap-3">
            <span className="text-base font-bold font-sans text-[#1A1918]">
              {formatCurrency(service.price)}
            </span>
            <span className="text-xs text-[#8C8477] flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3 text-[#B38F5F]" />
              {formatDuration(service.duration)}
            </span>
          </div>
        </div>

        {/* Right: Tactile Circular Selection Action */}
        <div className="shrink-0 pt-1">
          <button
            type="button"
            aria-label={isSelected ? `Remove ${service.name}` : `Select ${service.name}`}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isSelected
                ? 'bg-[#1A1918] text-white shadow-sm'
                : 'bg-[#FAF7F2] text-[#5C554C] border border-[#E5DCCE] group-hover:bg-[#1A1918] group-hover:text-white'
            }`}
          >
            {isSelected ? (
              <Check className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
