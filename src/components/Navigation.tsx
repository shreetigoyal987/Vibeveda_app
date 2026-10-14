import React, { useState } from 'react';
import { ShoppingBag, Bookmark, Bell, X, User, Languages, BookOpen, Sparkles } from 'lucide-react';

export type TabType = 'home' | 'apothecary' | 'spa' | 'yoga' | 'rituals' | 'practices' | 'vitals' | 'profile';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  cartCount: number;
  openCart: () => void;
  bookmarkCount: number;
  openBookmarks: () => void;
  openMembership: () => void;
  openTransliteration: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  bookmarkCount,
  openBookmarks,
  openMembership,
  openTransliteration,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: '1',
      title: 'Daily Streak Active',
      time: '12 Days',
      desc: 'You are on a 12-day mindful streak! Join Morning Prana Yoga or do evening Abhyanga.',
    },
    {
      id: '2',
      title: 'VibeVeda Oil Dispensed',
      time: '2 hours ago',
      desc: 'Your monthly refill of Calming Ayurvedic Oil has been hand-bottled.',
    },
    {
      id: '3',
      title: 'Spa Sanctuary Reservation',
      time: 'New',
      desc: 'Shirodhara Serenity Spa weekend slots are now open with Dr. Joshi.',
    },
  ];

  const allTabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'apothecary', label: 'Products', icon: 'sanitizer' },
    { id: 'spa', label: 'Spa Sessions', icon: 'hot_tub' },
    { id: 'yoga', label: 'Yoga & Flow', icon: 'self_improvement' },
    { id: 'rituals', label: 'Rituals', icon: 'auto_stories' },
    { id: 'practices', label: 'Practices', icon: 'air' },
    { id: 'vitals', label: 'Vitals & Chart', icon: 'monitoring' },
    { id: 'profile', label: 'Sanctuary', icon: 'account_circle' },
  ];

  return (
    <>
      {/* Top Header */}
      <header className="fixed top-0 w-full z-40 bg-[#fff8f6]/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(38,24,19,0.04)] border-b border-[#f7ddd3]/70 transition-colors">
        <div className="mx-auto max-w-7xl h-18 px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-full bg-[#2e5b44] group-hover:bg-[#234735] flex items-center justify-center text-white shadow-xs transition-colors">
              <span className="material-symbols-outlined text-[18px]">spa</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-headline text-xl sm:text-2xl font-bold tracking-tight text-[#261813]">
                  VibeVeda
                </span>
              </div>
              <span className="text-[10px] text-[#89726d] font-medium tracking-wide block -mt-1">
                Ayurveda for Modern Life
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold text-[#56423e]">
            {allTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`transition-all hover:text-[#261813] py-1 ${
                  activeTab === tab.id
                    ? 'text-[#2e5b44] font-bold border-b-2 border-[#2e5b44]'
                    : ''
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sanskrit Translations / Lexicon Button */}
            <button
              onClick={openTransliteration}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#ffe9e1] hover:bg-[#fde3d9] text-[#953c27] text-xs font-semibold transition-all cursor-pointer"
              title="Ayurvedic Translations & Lexicon (Sanskrit to English)"
            >
              <Languages className="w-3.5 h-3.5 text-[#953c27]" />
              <span className="text-[11px] font-bold">Trans</span>
            </button>

            {/* Grantham Bookmarks */}
            <button
              onClick={() => setActiveTab('rituals')}
              aria-label="Saved Rituals"
              className="relative w-9 h-9 flex items-center justify-center rounded-full text-[#56423e] hover:bg-[#ffe9e1] transition-colors"
              title="Grantham (Saved Rituals)"
            >
              <Bookmark className="w-4 h-4 text-[#904d00]" />
              {bookmarkCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#904d00] text-white text-[9px] font-bold flex items-center justify-center">
                  {bookmarkCount}
                </span>
              )}
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              className="relative w-9 h-9 flex items-center justify-center rounded-full text-[#56423e] hover:bg-[#ffe9e1] transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2e5b44]" />
            </button>

            {/* Shopping Cart (Sell & Earn) */}
            <button
              onClick={openCart}
              aria-label="Cart"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ffe9e1] text-[#953c27] hover:bg-[#fde3d9] transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-bold">{cartCount}</span>
            </button>

            {/* Sanctuary Profile Button */}
            <button
              onClick={() => setActiveTab('profile')}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2e5b44] text-white text-xs font-semibold hover:bg-[#234735] shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sanctuary</span>
            </button>
          </div>
        </div>

        {/* Sub-bar for Mobile / Medium screens to easily reach all sections */}
        <div className="xl:hidden flex items-center gap-1.5 overflow-x-auto px-4 py-2 border-t border-[#f7ddd3]/60 bg-[#fff8f6]">
          {allTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all font-medium ${
                activeTab === tab.id
                  ? 'bg-[#2e5b44] text-white font-bold shadow-xs'
                  : 'bg-[#fff1ec] text-[#56423e] hover:bg-[#ffe9e1]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications Popover */}
        {showNotifications && (
          <div className="absolute right-4 top-18 w-80 rounded-2xl bg-[#fff8f6] border border-[#f7ddd3] p-4 shadow-xl z-50 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#ffe9e1]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#904d00]">
                VibeVeda Notifications
              </span>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-[#89726d] hover:text-[#261813]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3 space-y-2.5">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    setShowNotifications(false);
                    if (n.id === '1') setActiveTab('yoga');
                    else if (n.id === '2') setActiveTab('apothecary');
                    else if (n.id === '3') setActiveTab('spa');
                  }}
                  className="p-2.5 rounded-xl bg-[#fff1ec] hover:bg-[#ffe9e1] border border-[#f7ddd3]/50 text-xs cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between font-semibold text-[#261813]">
                    <span>{n.title}</span>
                    <span className="text-[10px] text-[#2e5b44] font-bold">{n.time}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#56423e] leading-snug">{n.desc}</p>
                  <div className="mt-1.5 flex justify-end text-[10px] text-[#953c27] font-semibold">
                    <span>Tap to view &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Bottom Fixed Navigation Bar (Mobile Quick Switcher) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#fff8f6]/95 backdrop-blur-xl border-t border-[#f7ddd3]/80 shadow-[0_-2px_12px_rgba(38,24,19,0.05)]">
        <div className="mx-auto max-w-lg md:max-w-xl h-20 px-2 flex items-center justify-around">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center min-w-[50px] min-h-[48px] py-1 transition-colors cursor-pointer ${
              activeTab === 'home' ? 'text-[#2e5b44] font-bold' : 'text-[#56423e]'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">home</span>
            <span className="text-[11px] mt-0.5">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('apothecary')}
            className={`flex flex-col items-center justify-center min-w-[50px] min-h-[48px] py-1 transition-colors cursor-pointer ${
              activeTab === 'apothecary' ? 'text-[#2e5b44] font-bold' : 'text-[#56423e]'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">sanitizer</span>
            <span className="text-[11px] mt-0.5">Products</span>
          </button>

          <button
            onClick={() => setActiveTab('spa')}
            className={`flex flex-col items-center justify-center min-w-[50px] min-h-[48px] py-1 transition-colors cursor-pointer ${
              activeTab === 'spa' ? 'text-[#2e5b44] font-bold' : 'text-[#56423e]'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">hot_tub</span>
            <span className="text-[11px] mt-0.5">Spa</span>
          </button>

          <button
            onClick={() => setActiveTab('yoga')}
            className={`flex flex-col items-center justify-center min-w-[50px] min-h-[48px] py-1 transition-colors cursor-pointer ${
              activeTab === 'yoga' ? 'text-[#2e5b44] font-bold' : 'text-[#56423e]'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">self_improvement</span>
            <span className="text-[11px] mt-0.5">Yoga</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center min-w-[50px] min-h-[48px] py-1 transition-colors cursor-pointer ${
              activeTab === 'profile' ? 'text-[#2e5b44] font-bold' : 'text-[#56423e]'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">account_circle</span>
            <span className="text-[11px] mt-0.5">Sanctuary</span>
          </button>
        </div>
      </nav>
    </>
  );
};
