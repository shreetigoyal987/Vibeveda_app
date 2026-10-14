import React, { useState } from 'react';
import { 
  Crown, 
  Calendar, 
  ShoppingBag, 
  Bookmark, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles,
  PhoneCall,
  User,
  ShieldCheck
} from 'lucide-react';
import { Order, SpaBooking } from '../types/veda.ts';
import { HERO_RITUAL } from '../data/mockData.ts';

interface ProfileViewProps {
  orders: Order[];
  spaBookings?: SpaBooking[];
  isMember: boolean;
  onOpenMembership: () => void;
  isBookmarked: boolean;
  onBeginRitual: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  orders,
  spaBookings = [],
  isMember,
  onOpenMembership,
  isBookmarked,
  onBeginRitual,
}) => {
  const [activeTab, setActiveTab] = useState<'membership' | 'orders' | 'spaBookings' | 'grantham' | 'consultation'>('membership');
  const [consultDate, setConsultDate] = useState('2026-10-22');
  const [consultTime, setConsultTime] = useState('16:00');
  const [consultationBooked, setConsultationBooked] = useState(false);
  const [calendarNotice, setCalendarNotice] = useState<string | null>(null);

  const handleBookConsult = (e: React.FormEvent) => {
    e.preventDefault();
    setConsultationBooked(true);
  };

  return (
    <div className="flex flex-col w-full pb-24 max-w-lg md:max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Profile Header */}
      <div className="p-6 rounded-3xl bg-[#fff1ec] border border-[#f7ddd3] flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-[#953c27] text-white flex items-center justify-center font-headline text-2xl font-bold shadow-md">
          S
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="font-headline text-2xl text-[#261813]">
              Shreeti Goyal
            </h2>
            <span
              className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                isMember
                  ? 'bg-[#ffdcc3] text-[#904d00]'
                  : 'bg-[#ffe9e1] text-[#953c27]'
              }`}
            >
              {isMember ? 'Sanctuary Circle Patron' : 'Complimentary Initiate'}
            </span>
          </div>
          <p className="text-xs text-[#56423e] mt-0.5">
            shreetigoyal2109@gmail.com &bull; Vata-Pitta Balance
          </p>

          <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start text-xs">
            <span className="px-2.5 py-1 rounded-xl bg-white border border-[#dcc0ba] text-[#56423e]">
              Total Orders: <strong>{orders.length}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-white border border-[#dcc0ba] text-[#56423e]">
              Grantham Saved: <strong>{isBookmarked ? '1 Ritual' : '0'}</strong>
            </span>
          </div>
        </div>

        {!isMember && (
          <button
            onClick={onOpenMembership}
            className="px-4 py-2 rounded-xl bg-[#953c27] text-white text-xs font-semibold shadow hover:bg-[#b4533c] flex items-center gap-1.5"
          >
            <Crown className="w-3.5 h-3.5 text-[#ffdcc3]" />
            <span>Join Circle</span>
          </button>
        )}
      </div>

      {/* Sub-tab navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'membership', label: 'Membership & Earning' },
          { id: 'consultation', label: 'Vaidya Telehealth ($65)' },
          { id: 'spaBookings', label: `Spa Bookings (${spaBookings.length})` },
          { id: 'orders', label: `Orders (${orders.length})` },
          { id: 'grantham', label: 'Grantham Library' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-[#953c27] text-white shadow-xs'
                : 'bg-[#ffe9e1] text-[#56423e] hover:bg-[#fde3d9]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Membership & Commercial Monetization */}
      {activeTab === 'membership' && (
        <div className="p-6 rounded-3xl bg-[#ffe9e1] border border-[#f7ddd3] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#904d00]">
                VibeVeda Monetization Engine
              </span>
              <h3 className="font-headline text-xl text-[#261813]">
                The Sanctuary Circle ($29/mo or $240/yr)
              </h3>
            </div>
            <Crown className="w-6 h-6 text-[#fe932c]" />
          </div>

          <p className="text-xs text-[#56423e] leading-relaxed">
            Generate recurring customer revenue through our monthly refill subscription and patron club tiers. Members receive wholesale discounts, seasonal mystery boxes, and priority dispensary batches.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-white border border-[#dcc0ba] text-xs space-y-2">
              <span className="font-bold text-[#261813]">Apothecary Subscriptions</span>
              <p className="text-[#56423e]">
                Customers can subscribe to monthly recurring deliveries for Saffron Ojas Elixir, Brahmi Taila, and Ashwagandha Jam at a 20% privilege.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#dcc0ba] text-xs space-y-2">
              <span className="font-bold text-[#261813]">Private Telehealth Bookings</span>
              <p className="text-[#56423e]">
                Monetize certified Ayurvedic Vaidya consultations ($65 for 30 minutes) directly inside the app with integrated scheduling.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenMembership}
            className="w-full py-3 rounded-xl bg-[#953c27] text-white font-semibold text-xs shadow hover:bg-[#b4533c]"
          >
            {isMember ? 'View Circle Member Pass' : 'Join Sanctuary Circle Patronage'}
          </button>
        </div>
      )}

      {/* Tab 2: Vaidya Doctor Consultation Booking ($65) */}
      {activeTab === 'consultation' && (
        <div className="p-6 rounded-3xl bg-[#fff1ec] border border-[#f7ddd3] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#904d00]">
                Ayurvedic Telehealth &bull; $65 Fee
              </span>
              <h3 className="font-headline text-xl text-[#261813]">
                1-on-1 Pulse &amp; Prakriti Consultation
              </h3>
            </div>
            <PhoneCall className="w-5 h-5 text-[#953c27]" />
          </div>

          {!consultationBooked ? (
            <form onSubmit={handleBookConsult} className="space-y-4">
              <p className="text-xs text-[#56423e] leading-relaxed">
                Connect for a dedicated 30-minute private consultation with Senior Ayurvedic Physician <strong>Vaidya M. Varma</strong>. Includes tongue diagnosis analysis and bespoke custom herbal formulation script.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#56423e] block mb-1">
                    Select Consultation Date
                  </label>
                  <input
                    type="date"
                    required
                    value={consultDate}
                    onChange={(e) => setConsultDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#dcc0ba] text-[#261813]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#56423e] block mb-1">
                    Select Time Window
                  </label>
                  <select
                    value={consultTime}
                    onChange={(e) => setConsultTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#dcc0ba] text-[#261813]"
                  >
                    <option value="10:00">10:00 AM PST (Morning Agni)</option>
                    <option value="14:00">02:00 PM PST (Midday Pitta)</option>
                    <option value="16:00">04:00 PM PST (Sandhya Sunset)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#953c27] text-white font-semibold text-xs shadow hover:bg-[#b4533c] flex items-center justify-center gap-2"
              >
                <span>Reserve Appointment &bull; $65</span>
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-2xl bg-white border border-[#953c27] text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#953c27] mx-auto" />
              <h4 className="font-headline text-lg text-[#261813]">
                Consultation Confirmed with Vaidya M. Varma
              </h4>
              <p className="text-xs text-[#56423e]">
                Date: {consultDate} at {consultTime} PST. A calendar link with private encrypted video conference has been sent to shreetigoyal2109@gmail.com.
              </p>
              <button
                onClick={() => setConsultationBooked(false)}
                className="text-xs text-[#904d00] font-semibold underline pt-1"
              >
                Book another slot
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab: Spa Bookings */}
      {activeTab === 'spaBookings' && (
        <div className="space-y-3">
          {calendarNotice && (
            <div className="p-3 bg-[#261813] text-[#ffede7] rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{calendarNotice}</span>
            </div>
          )}

          {spaBookings.length === 0 ? (
            <div className="p-8 text-center bg-[#fff1ec] rounded-3xl border border-[#f7ddd3] space-y-2">
              <span className="material-symbols-outlined text-[32px] text-[#89726d]">hot_tub</span>
              <p className="text-xs text-[#56423e]">No spa therapy appointments scheduled yet.</p>
            </div>
          ) : (
            spaBookings.map((booking) => (
              <div
                key={booking.id}
                className="p-4 rounded-2xl bg-[#fff1ec] border border-[#f7ddd3] space-y-2 text-xs shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="flex items-center justify-between font-semibold text-[#261813]">
                  <span className="font-headline text-sm">{booking.sessionTitle}</span>
                  <span className="text-[#953c27] font-bold">${booking.price.toFixed(2)}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#56423e]">
                  <span>Date: <strong>{booking.date} at {booking.timeSlot}</strong></span>
                  <span>Vaidya: <strong>{booking.therapist}</strong></span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    {booking.status}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#f7ddd3] flex justify-end">
                  <button
                    onClick={() => {
                      setCalendarNotice(`Appointment for ${booking.sessionTitle} on ${booking.date} synced to your device calendar!`);
                      setTimeout(() => setCalendarNotice(null), 3000);
                    }}
                    className="px-3 py-1 rounded-xl bg-white border border-[#dcc0ba] hover:bg-[#ffe9e1] text-xs font-semibold text-[#904d00] transition-colors"
                  >
                    Sync to Calendar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Order History */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="p-8 text-center bg-[#fff1ec] rounded-3xl border border-[#f7ddd3] space-y-2">
              <ShoppingBag className="w-8 h-8 text-[#89726d] mx-auto" />
              <p className="text-xs text-[#56423e]">No dispensary orders placed yet.</p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl bg-[#fff1ec] border border-[#f7ddd3] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between font-semibold text-[#261813]">
                  <span>Order {ord.id}</span>
                  <span className="text-[#953c27] font-bold">${ord.total.toFixed(2)}</span>
                </div>
                <div className="text-[11px] text-[#56423e]">
                  {ord.date} &bull; {ord.paymentMethod} &bull;{' '}
                  <span className="text-emerald-700 font-semibold">{ord.status}</span>
                </div>
                <div className="pt-1 text-[11px] text-[#89726d]">
                  Items: {ord.items.map((it) => `${it.product.name} (x${it.quantity})`).join(', ')}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Grantham Library */}
      {activeTab === 'grantham' && (
        <div className="space-y-3">
          {isBookmarked ? (
            <div className="p-4 rounded-2xl bg-[#fff1ec] border border-[#f7ddd3] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={HERO_RITUAL.image}
                  alt={HERO_RITUAL.title}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-headline text-base text-[#261813]">
                    {HERO_RITUAL.title}
                  </h4>
                  <span className="text-xs text-[#904d00]">
                    {HERO_RITUAL.durationCadence} &bull; {HERO_RITUAL.vaidya}
                  </span>
                </div>
              </div>

              <button
                onClick={onBeginRitual}
                className="px-3.5 py-1.5 rounded-xl bg-[#953c27] text-white text-xs font-semibold hover:bg-[#b4533c]"
              >
                Launch
              </button>
            </div>
          ) : (
            <div className="p-8 text-center bg-[#fff1ec] rounded-3xl border border-[#f7ddd3] space-y-2">
              <Bookmark className="w-8 h-8 text-[#89726d] mx-auto" />
              <p className="text-xs text-[#56423e]">No bookmarked rituals in your Grantham yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
