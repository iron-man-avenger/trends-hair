import React, { useState } from 'react';
import { X, Trash2, Clock, ChevronRight, ArrowLeft, ShieldCheck, User, Phone, Sparkles } from 'lucide-react';
import { formatCurrency, formatDuration } from '../utils/helpers';
import SlotSelector from './SlotSelector';
import { STYLISTS } from '../data/salonData';

export default function BookingDrawer({
  isOpen,
  onClose,
  selectedServices,
  onRemoveService,
  existingBookings,
  chairStatus,
  onFinalizeBooking
}) {
  const [step, setStep] = useState(1); // 1: Select Slot & Stylist, 2: Customer Contact
  const [selectedDate, setSelectedDate] = useState("Today");
  const [selectedStylist, setSelectedStylist] = useState("any");
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Customer contact form
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const totalDuration = selectedServices.reduce((acc, s) => acc + s.duration, 0);
  const totalPrice = selectedServices.reduce((acc, s) => acc + s.price, 0);
  const stylistObj = STYLISTS.find(s => s.id === selectedStylist) || STYLISTS[0];

  const handleProceedToDetails = () => {
    if (!selectedSlot) {
      alert("Please select an available start time slot.");
      return;
    }
    setStep(2);
  };

  const handleCompleteBooking = (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setFormError("Please enter your name.");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setFormError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setFormError('');

    const bookingPayload = {
      customerName: customerName.trim(),
      phone: phone.trim(),
      notes: notes.trim(),
      services: [...selectedServices],
      totalDuration,
      totalPrice,
      date: selectedDate,
      time: selectedSlot.time,
      stylist: stylistObj.name,
      status: "confirmed"
    };

    onFinalizeBooking(bookingPayload);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex justify-end transition-opacity">
      {/* Drawer Container (Warm Alabaster) */}
      <div className="w-full max-w-xl min-h-screen bg-[#FAF7F2] border-l border-[#E5DCCE] text-[#1A1918] flex flex-col justify-between shadow-2xl relative animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="sticky top-0 z-20 bg-[#FAF7F2]/95 backdrop-blur-md px-5 py-4 border-b border-[#EAE3D6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="p-1.5 rounded-full bg-white border border-[#E5DCCE] text-[#5C554C] hover:text-[#1A1918]"
                title="Back to slot selection"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h3 className="font-editorial text-xl font-bold text-[#1A1918]">
                {step === 1 ? "Schedule Appointment" : "Client Contact Details"}
              </h3>
              <p className="text-[11px] text-[#7A7266]">
                Trends Hair Studio • Satellite, Ahmedabad
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white border border-[#E5DCCE] text-[#7A7266] hover:text-[#1A1918] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="p-5 flex-1 space-y-6 overflow-y-auto">
          {/* Selected Services Breakdown Card */}
          <div className="bg-white rounded-2xl p-4 border border-[#E5DCCE] shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs text-[#7A7266] pb-2 border-b border-[#F0EAE0]">
              <span className="font-medium">Selected Treatments ({selectedServices.length})</span>
              <span className="flex items-center gap-1 text-[#5C4931] font-bold">
                <Clock className="w-3.5 h-3.5 text-[#B38F5F]" />
                Total Duration: {formatDuration(totalDuration)}
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {selectedServices.map(service => (
                <div key={service.id} className="flex items-center justify-between text-xs text-[#2C2825] bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EFE9DF]">
                  <div className="truncate pr-2">
                    <div className="font-bold text-[#1A1918] truncate">{service.name}</div>
                    <div className="text-[10px] text-[#7A7266]">{formatDuration(service.duration)} • {formatCurrency(service.price)}</div>
                  </div>
                  {selectedServices.length > 1 && (
                    <button
                      onClick={() => onRemoveService(service.id)}
                      className="text-[#9E9589] hover:text-red-600 p-1 transition-colors"
                      title="Remove service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#F0EAE0] flex items-center justify-between text-sm font-semibold">
              <span className="text-[#5C554C]">Estimated Total Price</span>
              <span className="text-lg text-[#1A1918] font-sans font-bold">{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          {step === 1 ? (
            /* STEP 1: Date & Dynamic Slot Engine */
            <SlotSelector
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedStylist={selectedStylist}
              setSelectedStylist={setSelectedStylist}
              totalDuration={totalDuration}
              existingBookings={existingBookings}
              chairStatus={chairStatus}
              selectedSlot={selectedSlot}
              setSelectedSlot={setSelectedSlot}
            />
          ) : (
            /* STEP 2: Customer Contact Form */
            <form onSubmit={handleCompleteBooking} className="space-y-4 text-left">
              <div className="p-4 rounded-2xl bg-[#F7F1E7] border border-[#E8DCBF] text-xs flex items-center justify-between">
                <div>
                  <div className="text-[#8C714E] text-[10px] uppercase font-bold">Reserved Window</div>
                  <div className="text-sm font-bold text-[#1A1918]">{selectedDate} at {selectedSlot?.time}</div>
                </div>
                <div className="text-right">
                  <div className="text-[#8C714E] text-[10px] uppercase font-bold">Stylist</div>
                  <div className="text-xs font-bold text-[#1A1918]">{stylistObj.name}</div>
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
                  {formError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#3D3A36] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#B38F5F]" />
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-white border border-[#E5DCCE] rounded-2xl px-4 py-3 text-sm text-[#1A1918] placeholder-[#9E9589] focus:outline-none focus:border-[#C5A880] shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#3D3A36] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#B38F5F]" />
                  WhatsApp Mobile Number *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-2xl border border-r-0 border-[#E5DCCE] bg-[#F5EFEB] text-[#5C554C] text-sm font-semibold">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98250 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-white border border-[#E5DCCE] rounded-r-2xl px-4 py-3 text-sm text-[#1A1918] placeholder-[#9E9589] focus:outline-none focus:border-[#C5A880] shadow-xs"
                  />
                </div>
                <p className="text-[10px] text-[#7A7266]">
                  Instant booking confirmation will be sent to your WhatsApp.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#3D3A36]">
                  Special Request or Hair/Skin Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Sensitive scalp, consulting for low-lights, wedding styling"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white border border-[#E5DCCE] rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-[#1A1918] placeholder-[#9E9589] focus:outline-none focus:border-[#C5A880] shadow-xs"
                />
              </div>

              <div className="pt-2 flex items-center gap-2 text-[11px] text-[#6E6559]">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>No advance payment needed. Pay in-salon via UPI / Card / Cash.</span>
              </div>
            </form>
          )}
        </div>

        {/* Drawer Sticky Action Footer */}
        <div className="sticky bottom-0 bg-[#FAF7F2] border-t border-[#EAE3D6] p-4">
          {step === 1 ? (
            <button
              onClick={handleProceedToDetails}
              disabled={!selectedSlot}
              className={`w-full py-3.5 rounded-full font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedSlot
                  ? 'bg-[#1A1918] text-white shadow-lg shadow-black/20 hover:bg-[#38332E] active:scale-[0.99]'
                  : 'bg-[#E5DCCE] text-[#8C8477] cursor-not-allowed'
              }`}
            >
              <span>{selectedSlot ? `Confirm Slot: ${selectedSlot.time}` : 'Select an Open Time Slot Above'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleCompleteBooking}
              className="w-full py-3.5 rounded-full font-bold text-sm tracking-wide bg-[#1A1918] hover:bg-[#38332E] text-white shadow-xl shadow-black/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#C5A880]" />
              <span>Confirm & Lock Appointment</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
