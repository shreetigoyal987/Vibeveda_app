import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Star, 
  Check, 
  ShieldCheck, 
  X, 
  ArrowRight, 
  UserCheck,
  CheckCircle2,
  Heart
} from 'lucide-react';
import { SPA_SESSIONS } from '../data/mockData.ts';
import { SpaSession, SpaBooking } from '../types/veda.ts';

interface SpaViewProps {
  onBookSpa: (booking: SpaBooking) => void;
  isMember: boolean;
}

export const SpaView: React.FC<SpaViewProps> = ({ onBookSpa, isMember }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSession, setActiveSession] = useState<SpaSession | null>(null);

  // Booking Modal States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState('2026-10-24');
  const [bookingTime, setBookingTime] = useState('11:00 AM');
  const [selectedTherapist, setSelectedTherapist] = useState('');
  const [clientName, setClientName] = useState('Shreeti Goyal');
  const [clientEmail, setClientEmail] = useState('shreetigoyal2109@gmail.com');
  const [addonAroma, setAddonAroma] = useState(false);
  const [addonFoot, setAddonFoot] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const categories = ['All', 'Shirodhara', 'Abhyanga', 'Marma Therapy', 'Herbal Compress'];

  const filteredSessions = SPA_SESSIONS.filter(
    (s) => selectedCategory === 'All' || s.category === selectedCategory
  );

  const startBooking = (session: SpaSession) => {
    setActiveSession(session);
    setSelectedTherapist(session.therapist);
    setIsConfirmed(false);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSession) return;

    let total = isMember ? Math.round(activeSession.price * 0.8) : activeSession.price;
    if (addonAroma) total += 25;
    if (addonFoot) total += 35;

    const booking: SpaBooking = {
      id: `SPA-${Math.floor(100000 + Math.random() * 900000)}`,
      sessionTitle: activeSession.title,
      therapist: selectedTherapist,
      date: bookingDate,
      timeSlot: bookingTime,
      clientName,
      clientEmail,
      price: total,
      status: 'Confirmed',
    };

    onBookSpa(booking);
    setIsConfirmed(true);
  };

  return (
    <div className="flex flex-col w-full pb-24 max-w-lg md:max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Header Banner */}
      <div className="pt-2 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#904d00] bg-[#ffdcc3]/70 px-2.5 py-0.5 rounded-full">
            Ayurvedic Chikitsa Sanctuary
          </span>
          {isMember && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#953c27] bg-[#fde3d9] px-2.5 py-0.5 rounded-full">
              20% Member Privilege Applied
            </span>
          )}
        </div>

        <h2 className="font-headline text-3xl sm:text-4xl font-normal text-[#261813]">
          Classical Spa &amp; Healing Therapies
        </h2>
        <p className="text-xs sm:text-sm text-[#56423e] max-w-2xl leading-relaxed">
          Restore autonomic balance and flush deep cellular fatigue. Administered with warm medicinal oils, custom dosha herbs, and certified Kerala Ayurvedic Vaidyas.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-[#953c27] text-white shadow-xs'
                : 'bg-[#ffe9e1] text-[#56423e] hover:bg-[#fde3d9]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Spa Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSessions.map((session) => {
          const effectivePrice = isMember ? Math.round(session.price * 0.8) : session.price;

          return (
            <div
              key={session.id}
              className="rounded-3xl bg-[#fff1ec] border border-[#f7ddd3] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={session.image}
                    alt={session.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#fff8f6]/95 text-[#904d00] text-[10px] font-bold uppercase tracking-wider shadow-xs">
                    {session.category}
                  </div>
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#261813]/85 text-[#ffdcc3] text-[11px] font-semibold flex items-center gap-1 backdrop-blur-sm">
                    <Clock className="w-3.5 h-3.5 text-[#fe932c]" />
                    <span>{session.durationMinutes} min</span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs italic text-[#904d00] font-headline">
                      {session.sanskritName}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-[#261813] font-semibold">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{session.rating.toFixed(1)}</span>
                      <span className="text-[#89726d] font-normal">({session.reviewsCount})</span>
                    </div>
                  </div>

                  <h3 className="font-headline text-xl font-medium text-[#261813] leading-snug">
                    {session.title}
                  </h3>

                  <p className="text-xs text-[#56423e] leading-relaxed">
                    {session.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1.5 pt-1">
                    {session.benefits.slice(0, 2).map((b, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#261813]">
                        <Check className="w-3.5 h-3.5 text-[#953c27] shrink-0 mt-0.5" />
                        <span className="leading-snug">{b}</span>
                      </div>
                    ))}
                  </div>

                  {/* Therapist info */}
                  <div className="pt-2 border-t border-[#f7ddd3] flex items-center justify-between text-xs text-[#56423e]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#ffe9e1] flex items-center justify-center text-[#953c27] font-bold text-xs">
                        {session.therapist[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-[#261813]">{session.therapist}</div>
                        <div className="text-[10px] text-[#89726d] truncate max-w-[160px]">
                          {session.therapistRole}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Booking action */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-[#f7ddd3] flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-headline text-2xl font-bold text-[#261813]">
                        ${effectivePrice}
                      </span>
                      {isMember && (
                        <span className="text-xs line-through text-[#89726d]">
                          ${session.price}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#89726d]">Inclusive of organic herbal oils</span>
                  </div>

                  <button
                    onClick={() => startBooking(session)}
                    className="px-5 py-2.5 rounded-xl bg-[#953c27] text-white text-xs font-semibold shadow hover:bg-[#b4533c] active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Reserve Session</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && activeSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#fff8f6] border border-[#f7ddd3] shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#56423e] hover:bg-[#ffe9e1]"
            >
              <X className="w-5 h-5" />
            </button>

            {!isConfirmed ? (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div className="border-b border-[#ffe9e1] pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#904d00]">
                    Ayurvedic Spa Reservation
                  </span>
                  <h3 className="font-headline text-2xl text-[#261813] mt-0.5">
                    {activeSession.title}
                  </h3>
                  <p className="text-xs text-[#56423e] mt-1">
                    {activeSession.durationMinutes} min session &bull; Standard Fee ${activeSession.price}
                  </p>
                </div>

                {/* Date & Time Select */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#56423e] block mb-1">
                      Appointment Date
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#dcc0ba] text-[#261813]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#56423e] block mb-1">
                      Time Slot
                    </label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#dcc0ba] text-[#261813]"
                    >
                      <option value="09:00 AM">09:00 AM (Early Prana)</option>
                      <option value="11:00 AM">11:00 AM (Midday Awakening)</option>
                      <option value="02:30 PM">02:30 PM (Digestive Agni)</option>
                      <option value="05:00 PM">05:00 PM (Sandhya Sunset)</option>
                    </select>
                  </div>
                </div>

                {/* Therapist Selection */}
                <div>
                  <label className="text-[11px] font-semibold text-[#56423e] block mb-1">
                    Preferred Vaidya / Bodyworker
                  </label>
                  <select
                    value={selectedTherapist}
                    onChange={(e) => setSelectedTherapist(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#dcc0ba] text-[#261813]"
                  >
                    <option value={activeSession.therapist}>{activeSession.therapist} (Specialist)</option>
                    <option value="Dr. Ananya Joshi">Dr. Ananya Joshi (Panchakarma MD)</option>
                    <option value="Master K. Pillai">Master K. Pillai (Marma Bodywork)</option>
                    <option value="Devika Nair">Devika Nair (Sound & Herbal Therapy)</option>
                  </select>
                </div>

                {/* Contact info */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#56423e] block mb-1">
                      Client Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#dcc0ba] text-[#261813]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#56423e] block mb-1">
                      Confirmation Email
                    </label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#dcc0ba] text-[#261813]"
                    />
                  </div>
                </div>

                {/* Add-ons for Upsell (Earning) */}
                <div className="p-3.5 rounded-2xl bg-[#fff1ec] border border-[#f7ddd3] space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#904d00] block">
                    Optional Sanctuary Ritual Add-ons
                  </span>
                  <label className="flex items-center justify-between text-xs text-[#261813] cursor-pointer">
                    <span>Organic Damask Rose Herbal Facial Steam</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#953c27]">+$25</span>
                      <input
                        type="checkbox"
                        checked={addonAroma}
                        onChange={(e) => setAddonAroma(e.target.checked)}
                        className="accent-[#953c27]"
                      />
                    </div>
                  </label>
                  <label className="flex items-center justify-between text-xs text-[#261813] cursor-pointer">
                    <span>Kansa Bronze Bowl Herbal Foot Reflexology (20 min)</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#953c27]">+$35</span>
                      <input
                        type="checkbox"
                        checked={addonFoot}
                        onChange={(e) => setAddonFoot(e.target.checked)}
                        className="accent-[#953c27]"
                      />
                    </div>
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#953c27] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-[#b4533c] transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-[#ffdcc3]" />
                  <span>
                    Confirm &bull; $
                    {(isMember ? Math.round(activeSession.price * 0.8) : activeSession.price) +
                      (addonAroma ? 25 : 0) +
                      (addonFoot ? 35 : 0)}
                  </span>
                </button>
              </form>
            ) : (
              /* Success screen */
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#fde3d9] text-[#953c27] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#904d00]">
                    Appointment Confirmed
                  </span>
                  <h3 className="font-headline text-2xl text-[#261813] mt-0.5">
                    Your Sacred Therapy is Reserved
                  </h3>
                  <p className="text-xs text-[#56423e] mt-1 max-w-sm mx-auto leading-relaxed">
                    A confirmation packet with pre-session dietary guidelines and location pass has been dispatched to {clientEmail}.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#fff1ec] border border-[#f7ddd3] text-left text-xs space-y-1.5">
                  <div className="flex justify-between font-semibold text-[#261813]">
                    <span>Session:</span>
                    <span>{activeSession.title}</span>
                  </div>
                  <div className="flex justify-between text-[#56423e]">
                    <span>Date &amp; Time:</span>
                    <span>{bookingDate} at {bookingTime}</span>
                  </div>
                  <div className="flex justify-between text-[#56423e]">
                    <span>Therapist:</span>
                    <span>{selectedTherapist}</span>
                  </div>
                  <div className="flex justify-between text-[#56423e] pt-1 border-t border-[#f7ddd3]">
                    <span>Total Amount:</span>
                    <span className="font-bold text-[#953c27]">
                      $
                      {(isMember ? Math.round(activeSession.price * 0.8) : activeSession.price) +
                        (addonAroma ? 25 : 0) +
                        (addonFoot ? 35 : 0)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="w-full py-3 rounded-xl bg-[#953c27] text-white text-xs font-semibold shadow hover:bg-[#b4533c]"
                >
                  Return to Spa Sanctuary
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
