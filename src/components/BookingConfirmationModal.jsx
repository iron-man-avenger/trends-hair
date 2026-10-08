import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Check, Calendar, MessageSquare, Volume2, X, Navigation } from 'lucide-react';
import { formatCurrency, formatDuration, getWhatsAppBookingUrl, getGoogleCalendarUrl } from '../utils/helpers';
import { SALON_INFO } from '../data/salonData';

export default function BookingConfirmationModal({ booking, onClose }) {
  useEffect(() => {
    // Celebratory confetti burst
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#C5A880', '#1A1918', '#E5D7C2', '#8C714E']
    });
  }, []);

  if (!booking) return null;

  const whatsappUrl = getWhatsAppBookingUrl(booking, SALON_INFO);
  const calendarUrl = getGoogleCalendarUrl(booking, SALON_INFO);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white border border-[#E5DCCE] rounded-3xl p-6 sm:p-7 text-[#1A1918] shadow-2xl relative animate-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#FAF7F2] border border-[#E5DCCE] text-[#7A7266] hover:text-[#1A1918]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Success Badge */}
        <div className="text-center space-y-3 pb-5 border-b border-[#F0EAE0]">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#1A1918] text-[#FAF7F2] flex items-center justify-center shadow-lg shadow-black/15">
            <Check className="w-7 h-7 stroke-[2.5] text-[#C5A880]" />
          </div>

          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8C714E] block">
              RESERVATION CONFIRMED
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl text-[#1A1918] font-bold mt-0.5">
              You're Booked at Trends
            </h2>
            <p className="text-xs text-[#736B60] mt-1">
              Satellite, Ahmedabad • Sachin Tower, Anand Nagar Rd
            </p>
          </div>

          {/* Voice Dispatch Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F7F1E7] border border-[#E8DCBF] text-[11px] text-[#5C4931]">
            <Volume2 className="w-3.5 h-3.5 text-[#B38F5F] animate-pulse" />
            <span>Voice alert & chime announced on stylist's terminal</span>
          </div>
        </div>

        {/* Digital Luxury Boarding Pass Body */}
        <div className="my-5 p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6] space-y-3.5 text-left text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5DCCE]">
            <div>
              <span className="text-[10px] uppercase text-[#8C8477] font-semibold block">Booking Reference</span>
              <span className="font-mono font-bold text-sm text-[#1A1918]">{booking.id}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase text-[#8C8477] font-semibold block">Client</span>
              <span className="font-bold text-[#1A1918]">{booking.customerName}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#E5DCCE]">
            <div>
              <span className="text-[10px] uppercase text-[#8C8477] font-semibold block">Date & Time</span>
              <span className="font-bold text-[#1A1918] text-sm">
                {booking.date} • {booking.time}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#8C8477] font-semibold block">Total Runtime</span>
              <span className="font-bold text-[#5C4931] text-sm">
                {formatDuration(booking.totalDuration)}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase text-[#8C8477] font-semibold block mb-1">Booked Services</span>
            <div className="space-y-1">
              {booking.services.map((s, idx) => (
                <div key={idx} className="flex justify-between text-[#3D3A36]">
                  <span>• {s.name}</span>
                  <span className="text-[#736B60] font-medium">{formatCurrency(s.price)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#E5DCCE] flex items-center justify-between font-semibold">
            <span className="text-[#5C554C]">Estimated Total (Pay in Salon)</span>
            <span className="text-base font-bold text-[#1A1918] font-sans">
              {formatCurrency(booking.totalPrice)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-950/20"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open in WhatsApp (Direct Salon Link)</span>
          </a>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 rounded-full bg-white hover:bg-[#FAF7F2] text-[#2C2825] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#E5DCCE]"
            >
              <Calendar className="w-3.5 h-3.5 text-[#B38F5F]" />
              <span>Add to Calendar</span>
            </a>

            <a
              href={SALON_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 rounded-full bg-white hover:bg-[#FAF7F2] text-[#2C2825] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#E5DCCE]"
            >
              <Navigation className="w-3.5 h-3.5 text-[#B38F5F]" />
              <span>Studio Directions</span>
            </a>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full text-[#7A7266] hover:text-[#1A1918] text-xs font-medium mt-1 cursor-pointer"
          >
            Done & Return to Studio Home
          </button>
        </div>
      </div>
    </div>
  );
}
