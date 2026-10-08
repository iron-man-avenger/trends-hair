/**
 * Audio Notifier & Broadcast Channel
 * Separates customer device from salon terminal:
 * - Customers' devices remain SILENT upon booking.
 * - Voice alerts and luxury chimes ONLY trigger on the Salon / Stylist Terminal.
 */

class AudioNotifier {
  constructor() {
    this.audioCtx = null;
    this.speechSynthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.audioEnabled = true;
  }

  initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Warm, luxury concierge chime (C5 -> E5 tone)
   */
  async playLuxuryChime() {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;

      // Tone 1: C5 (523.25 Hz)
      const osc1 = this.audioCtx.createOscillator();
      const gain1 = this.audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);

      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.25, now + 0.03);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc1.connect(gain1);
      gain1.connect(this.audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.65);

      // Tone 2: E5 (659.25 Hz)
      const osc2 = this.audioCtx.createOscillator();
      const gain2 = this.audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.16);

      gain2.gain.setValueAtTime(0, now + 0.16);
      gain2.gain.linearRampToValueAtTime(0.28, now + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

      osc2.connect(gain2);
      gain2.connect(this.audioCtx.destination);
      osc2.start(now + 0.16);
      osc2.stop(now + 1.15);

      return new Promise((resolve) => setTimeout(resolve, 800));
    } catch (err) {
      console.warn("Chime notification notice:", err);
    }
  }

  /**
   * Speak announcement hands-free for salon staff
   */
  async announceBooking({ customerName, totalDuration, time, servicesText, stylist }) {
    if (!this.audioEnabled) return;

    await this.playLuxuryChime();
    if (!this.speechSynthesis) return;

    this.speechSynthesis.cancel();

    const shortServices = servicesText || "Salon Service";
    const speechText = `New appointment for ${customerName}. Duration: ${totalDuration} minutes for ${shortServices} at ${time}. Assigned to ${stylist || "Stylist"}.`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = this.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (naturalVoice) utterance.voice = naturalVoice;

    this.speechSynthesis.speak(utterance);
  }

  async testAlert() {
    this.initAudio();
    await this.announceBooking({
      customerName: "Rahul Sharma",
      totalDuration: 45,
      time: "12:15 PM",
      servicesText: "Precision Cut and Beard",
      stylist: "Jay Vaghela"
    });
  }

  setAudioEnabled(val) {
    this.audioEnabled = val;
  }
}

export const audioNotifier = new AudioNotifier();

// Cross-tab broadcast channel for salon sync
export const salonBroadcast = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('trends_hair_studio_channel')
  : { postMessage: () => {}, onmessage: null };
