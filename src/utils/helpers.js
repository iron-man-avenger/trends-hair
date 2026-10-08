/**
 * Utility helpers for formatting, WhatsApp redirection, and Calendar integration
 */

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDuration(minutes) {
  if (!minutes) return '0 min';
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (hours > 0 && remainingMins > 0) {
    return `${hours}h ${remainingMins}m`;
  } else if (hours > 0) {
    return `${hours} hr${hours > 1 ? 's' : ''}`;
  }
  return `${minutes} mins`;
}

export function generateBookingId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `THS-${randomNum}`;
}

/**
 * Generate a pre-filled WhatsApp confirmation message
 */
export function getWhatsAppBookingUrl(booking, salonInfo) {
  const serviceNames = booking.services.map(s => s.name).join(', ');
  const message = `Hello Trends Hair Studio! ✂️\n\nI have booked an appointment through your online app:\n\n` +
    `• *Booking ID:* ${booking.id}\n` +
    `• *Client Name:* ${booking.customerName}\n` +
    `• *Date & Time:* ${booking.date} at ${booking.time}\n` +
    `• *Duration:* ${formatDuration(booking.totalDuration)}\n` +
    `• *Services:* ${serviceNames}\n` +
    `• *Stylist:* ${booking.stylist}\n` +
    `• *Estimated Total:* ${formatCurrency(booking.totalPrice)}\n\n` +
    `Looking forward to visiting your Satellite studio!`;

  return `https://wa.me/${salonInfo.cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate Google Calendar add event URL
 */
export function getGoogleCalendarUrl(booking, salonInfo) {
  const title = `Trends Hair Studio Appointment: ${booking.services.map(s => s.name).join(', ')}`;
  const details = `Appointment at Trends Hair Studio (${salonInfo.shortAddress}).\nDuration: ${formatDuration(booking.totalDuration)}\nStylist: ${booking.stylist}\nContact: ${salonInfo.phone}`;
  const location = salonInfo.address;
  
  // Create ISO date approximation for today/selected day
  const now = new Date();
  const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0);
  const endTime = new Date(startTime.getTime() + (booking.totalDuration || 45) * 60000);
  
  const formatGCalDate = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatGCalDate(startTime)}/${formatGCalDate(endTime)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
}
