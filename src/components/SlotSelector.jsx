import React, { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { generateAvailableSlots } from '../utils/slotEngine';
import { STYLISTS } from '../data/salonData';
import { formatDuration } from '../utils/helpers';

export default function SlotSelector({
  selectedDate,
  setSelectedDate,
  selectedStylist,
  setSelectedStylist,
  totalDuration,
  existingBookings,
  chairStatus,
  selectedSlot,
  setSelectedSlot
}) {
  const dates = [
    { id: "Today", label: "Today", sub: "Live queue" },
    { id: "Tomorrow", label: "Tomorrow", sub: "Advance slot" },
    { id: "Day After", label: "In 2 Days", sub: "Advance booking" }
  ];

  // Dynamically calculate slot availability for the exact totalDuration
  const slots = useMemo(() => {
    return generateAvailableSlots({
      selectedDate,
      requiredDuration: totalDuration,
      existingBookings,
      chairStatus,
      selectedStylist,
      stepMinutes: 15
    });
  }, [selectedDate, totalDuration, existingBookings, chairStatus, selectedStylist]);

  // Group slots by period
  const groupedSlots = useMemo(() => {
    const groups = { Morning: [], Afternoon: [], Evening: [] };
    slots.forEach(slot => {
      if (groups[slot.period]) {
        groups[slot.period].push(slot);
      }
    });
    return groups;
  }, [slots]);

  return (
    <div className="space-y-5 text-left">
      {/* 1. Date Selector */}
      <div>
        <label className="text-xs uppercase tracking-wider text-[#736B60] font-semibold block mb-2">
          1. Select Booking Date
        </label>
        <div className="grid grid-cols-3 gap-2">
          {dates.map(d => {
            const isSelected = selectedDate === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  setSelectedDate(d.id);
                  setSelectedSlot(null);
                }}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1A1918] text-white border-[#1A1918] shadow-md font-semibold'
                    : 'bg-white border-[#E5DCCE] text-[#3D3A36] hover:border-[#C5A880] hover:bg-[#FBF9F5]'
                }`}
              >
                <div className="text-sm">{d.label}</div>
                <div className={`text-[10px] ${isSelected ? 'text-[#D9D3CA]' : 'text-[#8C8477]'}`}>
                  {d.sub}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Stylist Preference */}
      <div>
        <label className="text-xs uppercase tracking-wider text-[#736B60] font-semibold block mb-2">
          2. Preferred Stylist / Chair
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {STYLISTS.map(stylist => {
            const isSelected = selectedStylist === stylist.id;
            return (
              <button
                key={stylist.id}
                type="button"
                onClick={() => {
                  setSelectedStylist(stylist.id);
                  setSelectedSlot(null);
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#FCFAF7] border-2 border-[#1A1918] text-[#1A1918] shadow-sm'
                    : 'bg-white border-[#E5DCCE] text-[#3D3A36] hover:border-[#C5A880]'
                }`}
              >
                <span className="text-xl shrink-0">{stylist.avatar}</span>
                <div className="truncate">
                  <div className="text-xs font-bold text-[#1A1918] truncate">{stylist.name}</div>
                  <div className="text-[10px] text-[#736B60] truncate">{stylist.experience}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration window reassurance card */}
      <div className="p-3.5 rounded-2xl bg-[#F7F1E7] border border-[#E8DCBF] flex items-start gap-2.5 text-xs text-[#5C4931]">
        <Sparkles className="w-4 h-4 text-[#B38F5F] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#1A1918]">Smart Continuous Duration: </span>
          Showing slots that guarantee a continuous <span className="font-bold text-[#1A1918] underline">{formatDuration(totalDuration)}</span> uninterrupted block for your selected treatments.
        </div>
      </div>

      {/* 3. Slot Matrix */}
      <div>
        <label className="text-xs uppercase tracking-wider text-[#736B60] font-semibold block mb-2">
          3. Choose Open Start Time
        </label>

        {Object.entries(groupedSlots).map(([period, periodSlots]) => {
          if (!periodSlots.length) return null;
          return (
            <div key={period} className="mb-4">
              <h4 className="text-[11px] font-bold tracking-wider text-[#8C8477] uppercase mb-2">
                {period} Slots
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {periodSlots.map(slot => {
                  const isSelected = selectedSlot?.time === slot.time;
                  if (!slot.isAvailable) {
                    return (
                      <div
                        key={slot.time}
                        className="p-2.5 rounded-xl bg-[#EDE7DF] border border-[#E2DAD0] text-[#A69E92] text-center text-xs line-through cursor-not-allowed select-none"
                        title={slot.reason || "Slot unavailable"}
                      >
                        {slot.time}
                      </div>
                    );
                  }

                  return (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`relative p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1A1918] text-white border-[#1A1918] font-bold shadow-md scale-[1.02]'
                          : slot.tag?.includes('Next')
                          ? 'bg-[#F7F1E7] text-[#1A1918] border-[#C5A880] hover:bg-[#F2E8D7]'
                          : 'bg-white border-[#E5DCCE] text-[#1A1918] hover:border-[#C5A880] hover:bg-[#FCFAF7]'
                      }`}
                    >
                      {slot.tag && (
                        <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold px-2 py-0.2 rounded-full whitespace-nowrap shadow-xs ${
                          isSelected ? 'bg-[#C5A880] text-black' : 'bg-[#1A1918] text-white'
                        }`}>
                          {slot.tag}
                        </span>
                      )}
                      <div className="text-xs font-semibold">{slot.time}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
