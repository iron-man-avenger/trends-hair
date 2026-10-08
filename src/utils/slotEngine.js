/**
 * Smart Slot Calculation Engine for Trends Hair Studio
 * Dynamically computes open appointment windows based on total service runtime,
 * current real-time chair busy status, and existing schedule bookings.
 */

// Converts "HH:MM AM/PM" to minutes from midnight
export function timeStringToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }
  return hours * 60 + (minutes || 0);
}

// Converts minutes from midnight to "HH:MM AM/PM"
export function minutesToTimeString(totalMinutes) {
  let hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const modifier = hours >= 12 ? 'PM' : 'AM';

  if (hours > 12) {
    hours -= 12;
  } else if (hours === 0) {
    hours = 12;
  }

  const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const paddedHours = hours < 10 ? `0${hours}` : hours;
  return `${paddedHours}:${paddedMinutes} ${modifier}`;
}

/**
 * Generate available time slots for a specified date and required duration
 * @param {string} selectedDate - e.g. "Today", "Tomorrow"
 * @param {number} requiredDuration - Total minutes of selected services
 * @param {Array} existingBookings - Current list of confirmed bookings
 * @param {Object} chairStatus - Live status of the stylist chair
 * @param {string} selectedStylist - Stylist ID ("any", "jay", "riya")
 */
export function generateAvailableSlots({
  selectedDate = "Today",
  requiredDuration = 30,
  existingBookings = [],
  chairStatus = null,
  selectedStylist = "any",
  openHour = 10, // 10:00 AM
  closeHour = 21.5, // 9:30 PM
  stepMinutes = 15 // Check slots every 15 mins
}) {
  const startMinute = openHour * 60; // 600 (10:00 AM)
  const endMinute = Math.floor(closeHour * 60); // 1290 (9:30 PM)

  // Map existing bookings into interval ranges
  // Filter by date and stylist (if specific stylist selected)
  const bookedIntervals = existingBookings
    .filter(b => b.date === selectedDate && b.status !== 'cancelled')
    .filter(b => {
      if (selectedStylist === 'any') return false; // In 'any' mode, multiple chairs exist
      if (selectedStylist === 'jay' && b.stylist && !b.stylist.includes('Jay')) return false;
      if (selectedStylist === 'riya' && b.stylist && !b.stylist.includes('Riya')) return false;
      return true;
    })
    .map(b => {
      const start = timeStringToMinutes(b.time);
      const end = start + (b.totalDuration || 30);
      return { start, end };
    });

  // Calculate current time baseline for "Today"
  let earliestAllowedMinute = startMinute;

  if (selectedDate === "Today") {
    // Current live time approximation
    const now = new Date();
    const currentLiveMinute = now.getHours() * 60 + now.getMinutes();

    // If salon has live chair busy status, respect chairEndTime
    if (chairStatus && chairStatus.isBusy && chairStatus.serviceEndTime) {
      const chairBusyUntil = timeStringToMinutes(chairStatus.serviceEndTime);
      earliestAllowedMinute = Math.max(currentLiveMinute, chairBusyUntil, startMinute);
    } else {
      earliestAllowedMinute = Math.max(currentLiveMinute + 15, startMinute);
    }

    // Round up to nearest 15-minute slot boundary
    const remainder = earliestAllowedMinute % 15;
    if (remainder > 0) {
      earliestAllowedMinute += (15 - remainder);
    }
  }

  const candidateSlots = [];
  let foundFirstAvailable = false;

  for (let m = startMinute; m + requiredDuration <= endMinute; m += stepMinutes) {
    const slotStart = m;
    const slotEnd = m + requiredDuration;
    const timeStr = minutesToTimeString(slotStart);

    // Is it in the past for today?
    const isPast = selectedDate === "Today" && slotStart < earliestAllowedMinute;

    // Check overlap with existing appointments
    const hasCollision = bookedIntervals.some(booking => {
      // Overlap condition: slotStart < booking.end && slotEnd > booking.start
      return slotStart < (booking.end + 5) && slotEnd > booking.start;
    });

    const isAvailable = !isPast && !hasCollision;

    let tag = null;
    if (isAvailable && !foundFirstAvailable && selectedDate === "Today") {
      tag = "⚡ Next Free Slot";
      foundFirstAvailable = true;
    } else if (isAvailable && slotStart >= 18 * 60 && slotStart <= 19.5 * 60) {
      tag = "🌆 Evening Prime";
    }

    // Format human-friendly period
    let period = "Morning";
    if (slotStart >= 12 * 60 && slotStart < 17 * 60) period = "Afternoon";
    else if (slotStart >= 17 * 60) period = "Evening";

    candidateSlots.push({
      time: timeStr,
      minutes: slotStart,
      period,
      isAvailable,
      tag,
      reason: isPast ? "Slot has passed or chair busy" : hasCollision ? "Stylist booked" : null
    });
  }

  return candidateSlots;
}

/**
 * Returns summary stats for the current day
 */
export function getScheduleMetrics(existingBookings = []) {
  const todayBookings = existingBookings.filter(b => b.date === "Today");
  const totalMinsBooked = todayBookings.reduce((acc, b) => acc + (b.totalDuration || 0), 0);
  const totalSlotsCapacity = (21.5 - 10) * 60; // 690 mins
  const occupancyPercent = Math.min(100, Math.round((totalMinsBooked / totalSlotsCapacity) * 100));

  return {
    todayCount: todayBookings.length,
    totalMinsBooked,
    occupancyPercent
  };
}
