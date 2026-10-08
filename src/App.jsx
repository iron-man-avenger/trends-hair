import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import LiveChairStatusBanner from './components/LiveChairStatusBanner';
import ServiceCatalog from './components/ServiceCatalog';
import StickyBookingBar from './components/StickyBookingBar';
import BookingDrawer from './components/BookingDrawer';
import BookingConfirmationModal from './components/BookingConfirmationModal';
import BarberTerminal from './components/BarberTerminal';
import VinylTurntableModal from './components/VinylTurntableModal';
import MusicSnackbar from './components/MusicSnackbar';
import ThemeSelectorModal from './components/ThemeSelectorModal';
import { 
  SALON_INFO, 
  INITIAL_CHAIR_STATUS, 
  INITIAL_UPCOMING_BOOKINGS,
  SERVICES 
} from './data/salonData';
import { BOLLYWOOD_90S_PLAYLIST } from './data/musicData';
import { LUXURY_THEMES } from './data/themesData';
import { audioNotifier, salonBroadcast } from './utils/audioNotifier';
import { generateBookingId } from './utils/helpers';
import { Phone, Clock, Disc } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export default function App() {
  const [activeView, setActiveView] = useState('customer'); // 'customer' | 'barber'
  
  // Theme state
  const [currentThemeId, setCurrentThemeId] = useState(() => {
    try {
      return localStorage.getItem('ths_theme') || 'alabaster';
    } catch {
      return 'alabaster';
    }
  });
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // 90s Bollywood Music Player state
  const [currentTrack, setCurrentTrack] = useState(BOLLYWOOD_90S_PLAYLIST[0]);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.65);
  const [isVinylModalOpen, setIsVinylModalOpen] = useState(false);
  const audioRef = useRef(null);

  // Salon state with localStorage persistence
  const [chairStatus, setChairStatus] = useState(() => {
    try {
      const saved = localStorage.getItem('ths_chair_status');
      return saved ? JSON.parse(saved) : INITIAL_CHAIR_STATUS;
    } catch {
      return INITIAL_CHAIR_STATUS;
    }
  });

  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('ths_bookings');
      return saved ? JSON.parse(saved) : INITIAL_UPCOMING_BOOKINGS;
    } catch {
      return INITIAL_UPCOMING_BOOKINGS;
    }
  });

  // Customer booking selection
  const [selectedServices, setSelectedServices] = useState([SERVICES[0]]);
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isAudioReady, setIsAudioReady] = useState(false);

  // Sync theme
  useEffect(() => {
    localStorage.setItem('ths_theme', currentThemeId);
  }, [currentThemeId]);

  // Audio stream control
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = musicVolume;
    if (isPlayingMusic) {
      audioRef.current.play().catch(e => console.warn("Audio play prevented:", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlayingMusic, currentTrack, musicVolume]);

  const handleTogglePlayMusic = () => {
    setIsPlayingMusic(prev => !prev);
  };

  const handleNextTrack = () => {
    const currentIndex = BOLLYWOOD_90S_PLAYLIST.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % BOLLYWOOD_90S_PLAYLIST.length;
    setCurrentTrack(BOLLYWOOD_90S_PLAYLIST[nextIndex]);
    setIsPlayingMusic(true);
  };

  const handlePrevTrack = () => {
    const currentIndex = BOLLYWOOD_90S_PLAYLIST.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + BOLLYWOOD_90S_PLAYLIST.length) % BOLLYWOOD_90S_PLAYLIST.length;
    setCurrentTrack(BOLLYWOOD_90S_PLAYLIST[prevIndex]);
    setIsPlayingMusic(true);
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('ths_chair_status', JSON.stringify(chairStatus));
  }, [chairStatus]);

  useEffect(() => {
    localStorage.setItem('ths_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Unlock Web Audio
  const handleUnlockAudio = () => {
    audioNotifier.initAudio();
    setIsAudioReady(true);
  };

  // Toggle service
  const handleToggleService = (service) => {
    handleUnlockAudio();
    setSelectedServices(prev => {
      const exists = prev.some(s => s.id === service.id);
      if (exists) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleRemoveService = (serviceId) => {
    setSelectedServices(prev => prev.filter(s => s.id !== serviceId));
  };

  // Finalize booking from customer drawer
  const handleFinalizeBooking = (bookingData) => {
    handleUnlockAudio();
    const newBooking = {
      ...bookingData,
      id: generateBookingId(),
      status: 'confirmed'
    };

    // 1. Add to bookings queue
    setBookings(prev => [newBooking, ...prev]);

    // 2. Broadcast ONLY to Salon / Stylist Terminal
    salonBroadcast.postMessage({
      type: 'NEW_BOOKING',
      booking: newBooking
    });

    // 3. Customer device remains quiet & displays confirmation pass
    setIsBookingDrawerOpen(false);
    setConfirmedBooking(newBooking);
  };

  // Simulation handler for demonstration from Stylist terminal
  const handleSimulateIncomingBooking = async () => {
    handleUnlockAudio();
    const sampleNames = ["Aditya Trivedi", "Meera Desai", "Bhavik Joshi", "Simran Vora"];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomService = SERVICES[Math.floor(Math.random() * 4)];
    
    const simulated = {
      id: generateBookingId(),
      customerName: randomName,
      phone: "9825" + Math.floor(100000 + Math.random() * 900000),
      services: [randomService],
      totalDuration: randomService.duration,
      totalPrice: randomService.price,
      date: "Today",
      time: "03:15 PM",
      stylist: "Jay Vaghela",
      status: "confirmed",
      notes: "Online Smart Booking Test"
    };

    setBookings(prev => [simulated, ...prev]);

    await audioNotifier.announceBooking({
      customerName: simulated.customerName,
      totalDuration: simulated.totalDuration,
      time: simulated.time,
      servicesText: randomService.name,
      stylist: simulated.stylist
    });
  };

  const activeTheme = LUXURY_THEMES[currentThemeId] || LUXURY_THEMES.alabaster;

  return (
    <div 
      onClick={handleUnlockAudio}
      className={`min-h-screen ${activeTheme.bgClass} ${activeTheme.textMain} flex flex-col font-sans transition-colors duration-300 selection:bg-[#C5A880]/30`}
    >
      {/* Hidden Persistent Audio Tag for 90s Bollywood */}
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        preload="auto"
        onEnded={handleNextTrack}
      />

      {/* Luxury Navigation Header */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        isAudioReady={isAudioReady}
        onEnableAudio={handleUnlockAudio}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onOpenVinylModal={() => setIsVinylModalOpen(true)}
        isPlayingMusic={isPlayingMusic}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-32">
        {activeView === 'customer' ? (
          <>
            {/* Live Chair Wait / Availability Banner */}
            <LiveChairStatusBanner
              chairStatus={chairStatus}
            />

            {/* Service Catalog & Cumulative Duration Calculator */}
            <ServiceCatalog
              selectedServices={selectedServices}
              onToggleService={handleToggleService}
            />

            {/* Sticky Mobile Summary Bar */}
            <StickyBookingBar
              selectedServices={selectedServices}
              onOpenBookingFlow={() => setIsBookingDrawerOpen(true)}
            />
          </>
        ) : (
          /* Barber / Studio Terminal View */
          <BarberTerminal
            chairStatus={chairStatus}
            setChairStatus={setChairStatus}
            bookings={bookings}
            setBookings={setBookings}
            onSimulateIncomingBooking={handleSimulateIncomingBooking}
            onOpenVinylModal={() => setIsVinylModalOpen(true)}
          />
        )}
      </main>

      {/* Persistent 90s Bollywood Music Snackbar at Bottom */}
      <MusicSnackbar
        currentTrack={currentTrack}
        isPlaying={isPlayingMusic}
        onTogglePlay={handleTogglePlayMusic}
        onNextTrack={handleNextTrack}
        onOpenVinylModal={() => setIsVinylModalOpen(true)}
      />

      {/* Dedicated 90s Bollywood Vinyl Turntable Modal */}
      <VinylTurntableModal
        isOpen={isVinylModalOpen}
        onClose={() => setIsVinylModalOpen(false)}
        currentTrack={currentTrack}
        setCurrentTrack={setCurrentTrack}
        isPlaying={isPlayingMusic}
        setIsPlaying={setIsPlayingMusic}
        volume={musicVolume}
        setVolume={setMusicVolume}
        onTogglePlay={handleTogglePlayMusic}
        onNextTrack={handleNextTrack}
        onPrevTrack={handlePrevTrack}
      />

      {/* Multi-Theme Palette Selector Modal */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentThemeId={currentThemeId}
        onSelectTheme={(id) => setCurrentThemeId(id)}
      />

      {/* Booking Drawer Flow */}
      <BookingDrawer
        isOpen={isBookingDrawerOpen}
        onClose={() => setIsBookingDrawerOpen(false)}
        selectedServices={selectedServices}
        onRemoveService={handleRemoveService}
        existingBookings={bookings}
        chairStatus={chairStatus}
        onFinalizeBooking={handleFinalizeBooking}
      />

      {/* Booking Confirmation Modal */}
      {confirmedBooking && (
        <BookingConfirmationModal
          booking={confirmedBooking}
          onClose={() => setConfirmedBooking(null)}
        />
      )}

      {/* Luxury Footer */}
      <footer className="mt-auto border-t border-[#EAE4D9]/80 bg-white/40 text-[#736B60] py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-4 text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="font-brand text-base text-[#1A1918] font-bold tracking-widest uppercase">
                TRENDS HAIR STUDIO
              </div>
              <p className="text-xs text-[#736B60]">
                Sachin Tower, 100 Ft Anand Nagar Rd, Satellite, Ahmedabad
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <a 
                href={`tel:${SALON_INFO.cleanPhone}`}
                className="flex items-center gap-1.5 text-[#3D3A36] hover:text-[#B38F5F] font-semibold transition-colors"
              >
                <Phone className="w-3 h-3 text-[#B38F5F]" />
                <span>+91 75670 98929</span>
              </a>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#3D3A36]">
                <Clock className="w-3 h-3 text-[#B38F5F]" />
                <span>10 AM – 9:30 PM</span>
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#EAE4D9]/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#8C8477]">
            <div>
              © {CURRENT_YEAR} Trends Hair Studio Satellite.
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsVinylModalOpen(true)}
                className="hover:text-[#1A1918] flex items-center gap-1 cursor-pointer"
              >
                <Disc className="w-3 h-3 text-[#B38F5F]" />
                <span>90s Bollywood Radio</span>
              </button>
              <span>•</span>
              <button 
                onClick={() => setIsThemeModalOpen(true)}
                className="hover:text-[#1A1918] underline cursor-pointer"
              >
                Palette: {activeTheme.name}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
