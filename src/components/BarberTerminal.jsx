import React, { useState, useEffect } from 'react';
import { 
  Volume2, VolumeX, Play, Plus, Clock, Phone, CheckCircle2, 
  Sparkles, Scissors, Check, Zap, Disc
} from 'lucide-react';
import { formatCurrency, formatDuration } from '../utils/helpers';
import { audioNotifier, salonBroadcast } from '../utils/audioNotifier';

export default function BarberTerminal({
  chairStatus,
  setChairStatus,
  bookings,
  setBookings,
  onSimulateIncomingBooking,
  onOpenVinylModal
}) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  const showTemporaryNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(''), 4500);
  };

  // Listen for real-time bookings from customer devices via BroadcastChannel
  useEffect(() => {
    const handleBroadcast = (event) => {
      if (event.data?.type === 'NEW_BOOKING' && event.data?.booking) {
        const b = event.data.booking;
        showTemporaryNotice(`🔔 New booking: ${b.customerName} for ${b.time}`);
        
        // Stylist terminal announces verbally out loud
        const servicesSummary = b.services.map(s => s.name).join(' and ');
        audioNotifier.announceBooking({
          customerName: b.customerName,
          totalDuration: b.totalDuration,
          time: b.time,
          servicesText: servicesSummary,
          stylist: b.stylist
        });
      }
    };

    salonBroadcast.onmessage = handleBroadcast;
    return () => {
      salonBroadcast.onmessage = null;
    };
  }, []);

  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    audioNotifier.setAudioEnabled(nextVal);
    showTemporaryNotice(nextVal ? "🔊 Stylist Voice Alerts ON" : "🔇 Stylist Voice Alerts MUTED");
  };

  const handleTestAudio = async () => {
    setIsPlayingTest(true);
    await audioNotifier.testAlert();
    setIsPlayingTest(false);
  };

  // Autonomous completion trigger
  const handleAutonomousCompleteCurrent = async () => {
    const currentName = chairStatus.currentClient || "Client";
    const nextBooking = bookings.find(b => b.status === 'confirmed');

    // 1. Mark current completed in chair
    setChairStatus({
      isBusy: false,
      currentClient: null,
      currentService: null,
      stylistName: "Jay Vaghela",
      busyUntilMinutes: 0,
      serviceEndTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    // 2. Announce hands-free out loud
    await audioNotifier.playLuxuryChime();
    const nextAnnouncement = nextBooking 
      ? `Service completed for ${currentName}. Next appointment: ${nextBooking.customerName} at ${nextBooking.time} for ${nextBooking.services.map(s => s.name).join(' and ')}.`
      : `Service completed for ${currentName}. Chair is now free for walk-ins.`;

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(nextAnnouncement);
      u.rate = 0.92;
      window.speechSynthesis.speak(u);
    }

    showTemporaryNotice(`Autonomous transition complete: ${currentName} finished.`);
  };

  // Large-target quick buffer actions (elbow/palm-friendly)
  const handleExtendBusyTime = (extraMinutes) => {
    const currentWait = chairStatus.busyUntilMinutes || 15;
    const newWait = currentWait + extraMinutes;

    const now = new Date();
    now.setMinutes(now.getMinutes() + newWait);
    const newEndStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChairStatus(prev => ({
      ...prev,
      isBusy: true,
      busyUntilMinutes: newWait,
      serviceEndTime: newEndStr,
      currentClient: prev.currentClient || "Ongoing Client",
      currentService: prev.currentService || "Custom Service"
    }));

    showTemporaryNotice(`Extended chair buffer by +${extraMinutes}m. Online slots pushed to ${newEndStr}.`);
  };

  const handleUpdateBookingStatus = (bookingId, newStatus) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: newStatus };
      }
      return b;
    }));

    const booking = bookings.find(b => b.id === bookingId);
    if (newStatus === 'in-chair' && booking) {
      setChairStatus({
        isBusy: true,
        currentClient: booking.customerName,
        currentService: booking.services.map(s => s.name).join(' + '),
        stylistName: booking.stylist,
        busyUntilMinutes: booking.totalDuration,
        serviceEndTime: booking.time
      });
      showTemporaryNotice(`${booking.customerName} marked IN CHAIR.`);
    } else if (newStatus === 'completed') {
      showTemporaryNotice(`Appointment ${bookingId} completed.`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 text-left">
      {/* Toast Notice */}
      {actionNotice && (
        <div className="sticky top-16 z-30 p-3 rounded-2xl bg-[#1A1918] text-white font-medium text-xs sm:text-sm flex items-center justify-between shadow-xl animate-in fade-in slide-in-from-top-1">
          <span>{actionNotice}</span>
          <button onClick={() => setActionNotice('')} className="font-bold px-2 text-[#C5A880]">✕</button>
        </div>
      )}

      {/* Terminal Header */}
      <div className="bg-white border border-[#EAE4D9] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
            <h2 className="text-xl font-bold font-sans text-[#1A1918]">
              Stylist Hands-Free Station
            </h2>
          </div>
          <p className="text-xs text-[#736B60] mt-0.5">
            Auto-progresses appointments so you never touch the screen while cutting hair.
          </p>
        </div>

        {/* Audio & Radio Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenVinylModal}
            className="px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#C5A880]/50 text-[#1A1918] text-xs font-semibold hover:border-[#1A1918] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Disc className="w-3.5 h-3.5 text-[#B38F5F]" />
            <span>90s Vinyl Player</span>
          </button>

          <button
            onClick={handleToggleSound}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-[#FAF7F2] text-[#1A1918] border border-[#EAE4D9] hover:bg-[#F2E8DC]'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#B38F5F]" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{soundEnabled ? 'Voice Alerts Active' : 'Muted'}</span>
          </button>

          <button
            onClick={handleTestAudio}
            disabled={isPlayingTest}
            className="px-3.5 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#F2E8DC] text-[#1A1918] text-xs font-semibold flex items-center gap-1.5 transition-all border border-[#EAE4D9] cursor-pointer"
          >
            <Play className="w-3 h-3 text-[#B38F5F]" />
            <span>{isPlayingTest ? 'Speaking...' : 'Test Speaker'}</span>
          </button>

          <button
            onClick={onSimulateIncomingBooking}
            className="px-4 py-1.5 rounded-full bg-[#1A1918] hover:bg-[#38332E] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Simulate Booking</span>
          </button>
        </div>
      </div>

      {/* Autonomous Transition Bar */}
      <div className="bg-gradient-to-r from-[#F7F1E7] to-[#FAF7F2] border border-[#E8DCBF] rounded-3xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#B38F5F]" />
            <span className="font-bold text-sm text-[#1A1918]">
              Autonomous Hands-Free Transition Engine
            </span>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
            Clock-Sync Active
          </span>
        </div>
        <p className="text-xs text-[#5C4931]">
          When service time finishes, the salon terminal automatically marks completion, chimes, and announces the next client verbally.
        </p>

        {/* Big Elbow/Palm Target Action */}
        <div className="pt-2 flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleAutonomousCompleteCurrent}
            className="px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Auto-Finish & Call Next Client (Palm Tap)</span>
          </button>

          <button
            onClick={() => handleExtendBusyTime(10)}
            className="px-4 py-3 rounded-2xl bg-white border border-[#E5DCCE] text-[#1A1918] font-bold text-xs sm:text-sm hover:border-[#1A1918] shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#B38F5F]" />
            <span>+10m Delay Buffer</span>
          </button>

          <button
            onClick={() => handleExtendBusyTime(20)}
            className="px-4 py-3 rounded-2xl bg-white border border-[#E5DCCE] text-[#1A1918] font-bold text-xs sm:text-sm hover:border-[#1A1918] shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#B38F5F]" />
            <span>+20m Extra</span>
          </button>
        </div>
      </div>

      {/* Current Chair Status Display */}
      <div className="bg-white border border-[#EAE4D9] rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#F0EAE0]">
          <div>
            <h3 className="text-sm font-bold text-[#1A1918] flex items-center gap-2">
              <Scissors className="w-4 h-4 text-[#B38F5F]" />
              <span>Real-Time Chair Status</span>
            </h3>
            <p className="text-[11px] text-[#736B60]">
              Controls the online availability banner seen by Satellite customers.
            </p>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
            chairStatus.isBusy ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
          }`}>
            {chairStatus.isBusy ? '● In Service' : '● Free'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE3D6]">
          <div>
            <span className="text-[#8C8477] block text-[10px] uppercase font-bold">Client in Chair</span>
            <span className="text-[#1A1918] font-bold text-sm">
              {chairStatus.currentClient || "Chair Free"}
            </span>
          </div>
          <div>
            <span className="text-[#8C8477] block text-[10px] uppercase font-bold">Ongoing Service</span>
            <span className="text-[#3D3A36] font-medium">
              {chairStatus.currentService || "Awaiting next appointment"}
            </span>
          </div>
          <div>
            <span className="text-[#8C8477] block text-[10px] uppercase font-bold">Expected Free At</span>
            <span className="text-[#5C4931] font-bold text-sm">
              {chairStatus.serviceEndTime} ({chairStatus.busyUntilMinutes}m wait)
            </span>
          </div>
        </div>
      </div>

      {/* Today's Appointments Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#1A1918]">
            Today's Schedule ({bookings.length})
          </h3>
          <span className="text-xs text-[#8C8477]">10:00 AM – 9:30 PM</span>
        </div>

        <div className="space-y-3">
          {bookings.map((booking) => {
            const isConfirmed = booking.status === 'confirmed';
            const isInChair = booking.status === 'in-chair';
            const isCompleted = booking.status === 'completed';

            return (
              <div
                key={booking.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isInChair
                    ? 'bg-[#F7F1E7] border-2 border-[#1A1918] shadow-xs'
                    : isCompleted
                    ? 'bg-white border-[#EAE4D9] opacity-60'
                    : 'bg-white border-[#EAE4D9] shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left Info */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#8C714E]">
                        {booking.id}
                      </span>
                      <span className="text-base font-bold text-[#1A1918]">
                        {booking.customerName}
                      </span>
                      <span className="text-xs text-[#736B60] flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#B38F5F]" />
                        <a href={`tel:${booking.phone}`} className="hover:text-[#1A1918] underline">
                          {booking.phone}
                        </a>
                      </span>
                      <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                        isInChair
                          ? 'bg-amber-100 text-amber-800'
                          : isCompleted
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="text-xs text-[#5C554C] flex flex-wrap items-center gap-2">
                      <span className="font-bold text-[#1A1918]">
                        {booking.time} ({booking.date})
                      </span>
                      <span>•</span>
                      <span className="text-[#5C4931] font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#B38F5F]" />
                        {formatDuration(booking.totalDuration)}
                      </span>
                      <span>•</span>
                      <span className="text-[#736B60]">Stylist: {booking.stylist}</span>
                      <span>•</span>
                      <span className="font-bold text-[#1A1918]">{formatCurrency(booking.totalPrice)}</span>
                    </div>

                    <div className="text-xs text-[#736B60]">
                      <span className="font-medium text-[#5C554C]">Treatments: </span>
                      {booking.services.map(s => s.name).join(', ')}
                    </div>
                  </div>

                  {/* Right Status Actions */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0EAE0]">
                    {isConfirmed && (
                      <button
                        onClick={() => handleUpdateBookingStatus(booking.id, 'in-chair')}
                        className="px-4 py-1.5 rounded-full bg-[#1A1918] text-white text-xs font-semibold hover:bg-[#38332E] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Scissors className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>Start In Chair</span>
                      </button>
                    )}

                    {isInChair && (
                      <button
                        onClick={() => handleUpdateBookingStatus(booking.id, 'completed')}
                        className="px-4 py-1.5 rounded-full bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Finish & Free</span>
                      </button>
                    )}

                    {isCompleted && (
                      <span className="text-xs text-[#8C8477] font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        Done
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
