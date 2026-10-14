/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navigation, TabType } from './components/Navigation.tsx';
import { LandingHomeView } from './views/LandingHomeView.tsx';
import { RitualView } from './views/RitualView.tsx';
import { ApothecaryView } from './views/ApothecaryView.tsx';
import { SpaView } from './views/SpaView.tsx';
import { YogaView } from './views/YogaView.tsx';
import { PracticesView } from './views/PracticesView.tsx';
import { VitalsView } from './views/VitalsView.tsx';
import { ProfileView } from './views/ProfileView.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { RitualPlayerModal } from './components/RitualPlayerModal.tsx';
import { HerbariumModal } from './components/HerbariumModal.tsx';
import { MembershipModal } from './components/MembershipModal.tsx';
import { WellnessChatModal } from './components/WellnessChatModal.tsx';
import { WellnessPlanModal } from './components/WellnessPlanModal.tsx';
import { TransliterationModal } from './components/TransliterationModal.tsx';
import { HERO_RITUAL } from './data/mockData.ts';
import { CartItem, ApothecaryProduct, Order, SpaBooking } from './types/veda.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Smooth Tab Switcher with scroll to top
  const handleTabChange = (newTab: TabType) => {
    setActiveTab(newTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart state persisted to localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vibeveda_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Bookmarks (Grantham) state persisted to localStorage
  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('vibeveda_bookmarked');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  // Membership state persisted to localStorage
  const [isMember, setIsMember] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('vibeveda_member');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  // Orders history persisted to localStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('vibeveda_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Spa bookings history
  const [spaBookings, setSpaBookings] = useState<SpaBooking[]>(() => {
    try {
      const saved = localStorage.getItem('vibeveda_spa_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRitualPlayerOpen, setIsRitualPlayerOpen] = useState(false);
  const [isHerbariumOpen, setIsHerbariumOpen] = useState(false);
  const [isMembershipOpen, setIsMembershipOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isTransliterationOpen, setIsTransliterationOpen] = useState(false);
  const [selectedHerbFilter, setSelectedHerbFilter] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('vibeveda_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('vibeveda_bookmarked', String(isBookmarked));
  }, [isBookmarked]);

  useEffect(() => {
    localStorage.setItem('vibeveda_member', String(isMember));
  }, [isMember]);

  useEffect(() => {
    localStorage.setItem('vibeveda_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('vibeveda_spa_bookings', JSON.stringify(spaBookings));
  }, [spaBookings]);

  // Cart Handlers
  const handleAddToCart = (product: ApothecaryProduct, isSubscription = false) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.isSubscription === isSubscription
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.isSubscription === isSubscription
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, isSubscription }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleOrderPlaced = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const handleBookSpa = (booking: SpaBooking) => {
    setSpaBookings((prev) => [booking, ...prev]);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fff8f6] text-[#261813] font-body flex flex-col selection:bg-[#ffdcc3] selection:text-[#2f1500]">
      {/* Top Header & Mobile Nav Bar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
        bookmarkCount={isBookmarked ? 1 : 0}
        openBookmarks={() => {
          handleTabChange('rituals');
        }}
        openMembership={() => setIsMembershipOpen(true)}
        openTransliteration={() => setIsTransliterationOpen(true)}
      />

      {/* Main Content Area with Smooth View Transition */}
      <main className="flex-1 w-full pt-20 pb-20">
        <div key={activeTab} className="animate-veda-fade w-full">
          {activeTab === 'home' && (
            <LandingHomeView
              onNavigate={handleTabChange}
              onAddToCart={handleAddToCart}
              onOpenHerbarium={() => setIsHerbariumOpen(true)}
              onOpenChat={() => setIsChatOpen(true)}
              onOpenPlan={() => setIsPlanModalOpen(true)}
            />
          )}

          {activeTab === 'apothecary' && (
            <ApothecaryView
              onAddToCart={handleAddToCart}
              selectedHerbFilter={selectedHerbFilter}
              onClearHerbFilter={() => setSelectedHerbFilter(null)}
              isMember={isMember}
            />
          )}

          {activeTab === 'spa' && (
            <SpaView
              onBookSpa={handleBookSpa}
              isMember={isMember}
            />
          )}

          {activeTab === 'yoga' && (
            <YogaView
              onSessionComplete={() => {
                // Streak logged
              }}
            />
          )}

          {activeTab === 'rituals' && (
            <RitualView
              onBeginRitual={() => setIsRitualPlayerOpen(true)}
              onAddToCart={handleAddToCart}
              onOpenHerbarium={() => setIsHerbariumOpen(true)}
              onOpenProductDetail={() => {
                handleTabChange('apothecary');
              }}
              isBookmarked={isBookmarked}
              onToggleBookmark={() => setIsBookmarked(!isBookmarked)}
            />
          )}

          {activeTab === 'practices' && <PracticesView />}

          {activeTab === 'vitals' && <VitalsView />}

          {activeTab === 'profile' && (
            <ProfileView
              orders={orders}
              spaBookings={spaBookings}
              isMember={isMember}
              onOpenMembership={() => setIsMembershipOpen(true)}
              isBookmarked={isBookmarked}
              onBeginRitual={() => setIsRitualPlayerOpen(true)}
            />
          )}
        </div>
      </main>

      {/* Modals & Overlays */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={handleUpdateQuantity}
        removeFromCart={handleRemoveFromCart}
        clearCart={handleClearCart}
        onOrderPlaced={handleOrderPlaced}
      />

      <RitualPlayerModal
        ritual={HERO_RITUAL}
        isOpen={isRitualPlayerOpen}
        onClose={() => setIsRitualPlayerOpen(false)}
      />

      <HerbariumModal
        isOpen={isHerbariumOpen}
        onClose={() => setIsHerbariumOpen(false)}
        onSelectHerbProduct={(herbName) => {
          setSelectedHerbFilter(herbName);
          handleTabChange('apothecary');
        }}
      />

      <MembershipModal
        isOpen={isMembershipOpen}
        onClose={() => setIsMembershipOpen(false)}
        isMember={isMember}
        onUpgrade={() => setIsMember(true)}
      />

      <WellnessChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onNavigate={handleTabChange}
        onAddToCart={handleAddToCart}
      />

      <WellnessPlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onNavigate={handleTabChange}
      />

      <TransliterationModal
        isOpen={isTransliterationOpen}
        onClose={() => setIsTransliterationOpen(false)}
        onNavigate={handleTabChange}
      />
    </div>
  );
}
