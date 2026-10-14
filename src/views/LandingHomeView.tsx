import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Flame, 
  Moon, 
  Heart, 
  BarChart3, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Leaf, 
  Star,
  Clock,
  CheckCircle2,
  Play,
  ShoppingBag
} from 'lucide-react';
import { PRODUCTS, TESTIMONIALS, PROBLEM_POINTS } from '../data/mockData.ts';
import { TabType } from '../components/Navigation.tsx';
import { ApothecaryProduct } from '../types/veda.ts';
import { DailyAffirmation } from '../components/DailyAffirmation.tsx';

interface LandingHomeViewProps {
  onNavigate: (tab: TabType) => void;
  onAddToCart: (product: ApothecaryProduct) => void;
  onOpenHerbarium: () => void;
  onOpenChat: () => void;
  onOpenPlan: () => void;
}

export const LandingHomeView: React.FC<LandingHomeViewProps> = ({
  onNavigate,
  onAddToCart,
  onOpenHerbarium,
  onOpenChat,
  onOpenPlan,
}) => {
  const [duoNotice, setDuoNotice] = React.useState(false);
  const [selectedGuarantee, setSelectedGuarantee] = React.useState<{ title: string; desc: string } | null>(null);
  const vibeVedaOil = PRODUCTS.find((p) => p.id === 'prod-vibeveda-oil') || PRODUCTS[0];
  const vibeVedaPowder = PRODUCTS.find((p) => p.id === 'prod-vibeveda-powder') || PRODUCTS[1];

  const handleGetDuo = () => {
    onAddToCart(vibeVedaOil);
    onAddToCart(vibeVedaPowder);
    setDuoNotice(true);
    setTimeout(() => setDuoNotice(false), 2500);
  };

  return (
    <div className="flex flex-col w-full pb-20 max-w-6xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-24">
      {/* 1. Hero Section */}
      <section className="pt-4 sm:pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Copy */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffe9e1] border border-[#f7ddd3] text-[#953c27] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#fe932c]" />
            <span>Ayurveda for Modern Life</span>
          </div>

          <h1 className="font-headline text-4xl sm:text-6xl text-[#261813] font-normal tracking-tight leading-[1.15]">
            Your Daily Ritual for a <span className="italic text-[#953c27]">Calmer Mind</span>
          </h1>

          <p className="text-sm sm:text-base text-[#56423e] leading-relaxed max-w-xl font-body">
            Ayurvedic wellness products, mindfulness practices and digital technology to help working professionals relieve stress and build a balanced life.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('vitals')}
              className="px-6 py-3.5 rounded-xl bg-[#2e5b44] hover:bg-[#234735] text-white text-xs sm:text-sm font-semibold shadow-md active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Start Your Wellness Journey</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('apothecary')}
              className="px-6 py-3.5 rounded-xl border border-[#dcc0ba] bg-white text-[#261813] text-xs sm:text-sm font-semibold hover:bg-[#fff1ec] transition-all"
            >
              Explore Products
            </button>
          </div>

          {/* Trust Badges Bar */}
          <div className="pt-6 border-t border-[#f7ddd3] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#56423e]">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[18px] text-[#2e5b44]">spa</span>
              <span>Ayurvedic Inspired</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[18px] text-[#2e5b44]">science</span>
              <span>Science Backed</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[18px] text-[#2e5b44]">verified</span>
              <span>Expert Curated</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[18px] text-[#2e5b44]">sentiment_satisfied</span>
              <span>Loved by 10,000+ Users</span>
            </div>
          </div>
        </div>

        {/* Right Visual: Meditating Professional with Floating Biometric Badges */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-full max-w-sm sm:max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <img
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
              alt="Professional meditating in serenity"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Floating Biometric Badges matching image */}
            {/* Top Left: Stress Level */}
            <div className="absolute top-4 left-4 p-2.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-[#f7ddd3] text-xs animate-pulse">
              <span className="text-[10px] text-[#89726d] font-bold uppercase block">Stress Level</span>
              <div className="flex items-center gap-1.5 font-bold text-emerald-700 mt-0.5">
                <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Low</span>
              </div>
            </div>

            {/* Top Right: Daily Streak */}
            <div className="absolute top-4 right-4 p-2.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-[#f7ddd3] text-xs">
              <div className="flex items-center gap-1 text-[#fe932c] font-bold">
                <Flame className="w-4 h-4 fill-current" />
                <span>Daily Streak</span>
              </div>
              <span className="text-sm font-extrabold text-[#261813] block text-center">12 Days</span>
            </div>

            {/* Mid Left: Sleep Quality */}
            <div className="absolute bottom-24 left-4 p-2.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-[#f7ddd3] text-xs">
              <div className="flex items-center gap-1 text-indigo-700 font-semibold">
                <Moon className="w-3.5 h-3.5 text-indigo-500 fill-current" />
                <span>Sleep Quality</span>
              </div>
              <span className="text-sm font-extrabold text-[#261813] block">84%</span>
            </div>

            {/* Mid Right: Mindful Minutes */}
            <div className="absolute bottom-24 right-4 p-2.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-[#f7ddd3] text-xs">
              <div className="flex items-center gap-1 text-rose-700 font-semibold">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                <span>Mindful Minutes</span>
              </div>
              <span className="text-sm font-extrabold text-[#261813] block">25 min</span>
            </div>

            {/* Bottom Products Strip overlay */}
            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#ffe9e1] flex items-center justify-center text-[#953c27] font-bold text-xs">
                  VV
                </div>
                <div>
                  <div className="text-xs font-bold text-[#261813]">VibeVeda Oil &amp; Powder</div>
                  <div className="text-[10px] text-[#89726d]">Signature Stress Reliever Duo</div>
                </div>
              </div>

              <button
                onClick={handleGetDuo}
                className="px-3.5 py-1.5 rounded-xl bg-[#2e5b44] text-white text-xs font-semibold hover:bg-[#234735] shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Get Duo ($90)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Chat with us button from Y.jpeg */}
        <button
          onClick={onOpenChat}
          className="fixed bottom-24 right-5 sm:bottom-6 sm:right-6 z-40 bg-[#25d366] hover:bg-[#20ba5a] text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs sm:text-sm font-bold border-2 border-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          title="Chat with Ayurvedic Vaidya"
        >
          <span className="material-symbols-outlined text-[20px]">chat</span>
          <span>Chat with us</span>
        </button>

        {duoNotice && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#261813] text-[#ffede7] text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in">
            <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
            <span>VibeVeda Oil &amp; Powder Duo added to your basket!</span>
          </div>
        )}
      </section>

      {/* Daily Affirmation Section */}
      <section>
        <DailyAffirmation />
      </section>

      {/* 2. Section: The Problem We Solve */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-headline text-3xl sm:text-4xl text-[#261813]">
            The Problem We Solve
          </h2>
          <p className="text-xs sm:text-sm text-[#56423e] leading-relaxed">
            Today’s lifestyle is silently taking a toll on our mental well-being.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* 6 Problem cards - Interactive */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PROBLEM_POINTS.map((item, idx) => {
              const getProblemRoute = (index: number) => {
                switch (index) {
                  case 0: return () => onNavigate('spa'); // Burnout -> Spa
                  case 1: return () => onNavigate('rituals'); // Insomnia -> Sandalwood ritual
                  case 2: return () => onNavigate('apothecary'); // Brain fog -> Brahmi
                  case 3: return () => onNavigate('apothecary'); // Low energy -> Saffron Ojas
                  case 4: return () => onNavigate('vitals'); // Digestion -> Agni tracker
                  default: return () => onNavigate('yoga'); // Tension -> Desk Yoga
                }
              };

              return (
                <button
                  key={idx}
                  onClick={getProblemRoute(idx)}
                  className="p-4 rounded-2xl bg-[#fff1ec] hover:bg-[#ffe9e1] border border-[#f7ddd3] hover:border-[#953c27]/40 flex flex-col justify-between text-center transition-all cursor-pointer group text-left"
                >
                  <div>
                    <div className="w-10 h-10 rounded-full bg-white mx-auto flex items-center justify-center text-[#953c27] mb-2 shadow-xs group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    </div>
                    <h3 className="text-xs font-bold text-[#261813] mb-1">{item.title}</h3>
                    <p className="text-[11px] text-[#56423e] leading-snug">{item.desc}</p>
                  </div>
                  <div className="mt-2 text-[10px] font-bold text-[#953c27] flex items-center justify-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Explore Remedy</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Quote Callout */}
          <div className="md:col-span-4 p-6 rounded-3xl bg-[#ffe9e1] border border-[#f7ddd3] flex flex-col justify-between space-y-4">
            <blockquote className="font-headline text-lg sm:text-xl text-[#261813] leading-relaxed italic">
              “Stress is not just a feeling, it’s affecting focus, relationships and overall health. We help you break this cycle naturally.”
            </blockquote>
            <div className="pt-3 border-t border-[#f7ddd3] flex items-center gap-2 text-xs font-semibold text-[#904d00]">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Backed by Ayurvedic Doctors</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section: Our Ayurvedic & Digital Wellness Solutions (6 Cards) */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-headline text-3xl sm:text-4xl text-[#261813]">
            Our Ayurvedic &amp; Digital Wellness Solutions
          </h2>
          <p className="text-xs sm:text-sm text-[#56423e]">
            Holistic synergy combining ancient herbs, bodywork, live yoga, and habit diagnostics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. VibeVeda Oil */}
          <div
            onClick={() => onNavigate('apothecary')}
            className="p-5 rounded-3xl bg-[#fff1ec] border border-[#f7ddd3] flex flex-col justify-between cursor-pointer group hover:shadow-md transition-all"
          >
            <div>
              <div className="h-44 rounded-2xl overflow-hidden mb-3">
                <img
                  src={vibeVedaOil.image}
                  alt="VibeVeda Oil"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-headline text-xl text-[#261813] font-medium">
                VibeVeda Oil
              </h3>
              <p className="text-xs text-[#56423e] mt-1 leading-relaxed">
                A calming Ayurvedic oil blend that helps relax the mind and body.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#f7ddd3] flex items-center justify-between text-xs font-bold text-[#953c27]">
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. VibeVeda Powder */}
          <div
            onClick={() => onNavigate('apothecary')}
            className="p-5 rounded-3xl bg-[#fff1ec] border border-[#f7ddd3] flex flex-col justify-between cursor-pointer group hover:shadow-md transition-all"
          >
            <div>
              <div className="h-44 rounded-2xl overflow-hidden mb-3">
                <img
                  src={vibeVedaPowder.image}
                  alt="VibeVeda Powder"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-headline text-xl text-[#261813] font-medium">
                VibeVeda Powder
              </h3>
              <p className="text-xs text-[#56423e] mt-1 leading-relaxed">
                Daily Ayurvedic wellness blend to support energy, focus and stress relief.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#f7ddd3] flex items-center justify-between text-xs font-bold text-[#953c27]">
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Relaxation Audio */}
          <div
            onClick={() => onNavigate('practices')}
            className="p-5 rounded-3xl bg-[#fff1ec] border border-[#f7ddd3] flex flex-col justify-between cursor-pointer group hover:shadow-md transition-all"
          >
            <div>
              <div className="h-44 rounded-2xl overflow-hidden mb-3 bg-[#ffe9e1] flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#953c27] shadow-md">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
              </div>
              <h3 className="font-headline text-xl text-[#261813] font-medium">
                Relaxation Audio
              </h3>
              <p className="text-xs text-[#56423e] mt-1 leading-relaxed">
                Mindfulness music, healing frequencies and guided audios.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#f7ddd3] flex items-center justify-between text-xs font-bold text-[#953c27]">
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. Wellness Guide */}
          <div
            onClick={onOpenHerbarium}
            className="p-5 rounded-3xl bg-[#fff1ec] border border-[#f7ddd3] flex flex-col justify-between cursor-pointer group hover:shadow-md transition-all"
          >
            <div>
              <div className="h-44 rounded-2xl overflow-hidden mb-3 bg-[#e8ddcf] flex items-center justify-center text-center p-4">
                <div className="border border-[#89726d] p-4 rounded-xl">
                  <span className="font-headline text-lg font-bold text-[#261813]">Wellness Guide</span>
                  <span className="text-[10px] text-[#56423e] block">108 Herb Almanac</span>
                </div>
              </div>
              <h3 className="font-headline text-xl text-[#261813] font-medium">
                Wellness Guide
              </h3>
              <p className="text-xs text-[#56423e] mt-1 leading-relaxed">
                Simple, practical and actionable techniques for daily balance.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#f7ddd3] flex items-center justify-between text-xs font-bold text-[#953c27]">
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 5. Yoga & Meditation */}
          <div
            onClick={() => onNavigate('yoga')}
            className="p-5 rounded-3xl bg-[#fff1ec] border border-[#f7ddd3] flex flex-col justify-between cursor-pointer group hover:shadow-md transition-all"
          >
            <div>
              <div className="h-44 rounded-2xl overflow-hidden mb-3">
                <img
                  src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80"
                  alt="Yoga & Meditation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-headline text-xl text-[#261813] font-medium">
                Yoga &amp; Meditation
              </h3>
              <p className="text-xs text-[#56423e] mt-1 leading-relaxed">
                Live &amp; recorded sessions with expert teachers anytime, anywhere.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#f7ddd3] flex items-center justify-between text-xs font-bold text-[#953c27]">
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 6. Habit & Mood Tracker */}
          <div
            onClick={() => onNavigate('vitals')}
            className="p-5 rounded-3xl bg-[#fff1ec] border border-[#f7ddd3] flex flex-col justify-between cursor-pointer group hover:shadow-md transition-all"
          >
            <div>
              <div className="h-44 rounded-2xl overflow-hidden mb-3 bg-[#e4ded6] p-4 flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#2e5b44] shadow-xs mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-[#261813]">Daily Ojas Score</span>
                <span className="text-[10px] text-[#56423e]">Personalized Bio-Tracking</span>
              </div>
              <h3 className="font-headline text-xl text-[#261813] font-medium">
                Habit &amp; Mood Tracker
              </h3>
              <p className="text-xs text-[#56423e] mt-1 leading-relaxed">
                Track your mood, sleep, habits and progress daily.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#f7ddd3] flex items-center justify-between text-xs font-bold text-[#953c27]">
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section: Built on Tradition. Backed by Science. (Green banner) */}
      <section className="rounded-3xl bg-[#234735] text-white p-6 sm:p-10 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="font-headline text-2xl sm:text-3xl text-white font-normal">
              Built on Tradition. Backed by Science.
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              “Our formulations are inspired by Ayurveda and validated through modern research to ensure safety, quality and effectiveness.”
            </p>
          </div>

          <button
            onClick={onOpenHerbarium}
            className="px-5 py-3 rounded-xl bg-white text-[#234735] text-xs font-semibold hover:bg-emerald-50 transition-all shrink-0"
          >
            Explore Our Science
          </button>
        </div>

        <div className="pt-6 border-t border-emerald-800/80 grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
          <div className="p-2 space-y-1">
            <span className="material-symbols-outlined text-[24px] text-emerald-300">spa</span>
            <div className="text-xs font-semibold text-white">Ayurvedic Wisdom</div>
          </div>
          <div className="p-2 space-y-1">
            <span className="material-symbols-outlined text-[24px] text-emerald-300">eco</span>
            <div className="text-xs font-semibold text-white">High Quality Natural Ingredients</div>
          </div>
          <div className="p-2 space-y-1">
            <span className="material-symbols-outlined text-[24px] text-emerald-300">biotech</span>
            <div className="text-xs font-semibold text-white">Research Supported</div>
          </div>
          <div className="p-2 space-y-1">
            <span className="material-symbols-outlined text-[24px] text-emerald-300">verified_user</span>
            <div className="text-xs font-semibold text-white">Safe &amp; Effective</div>
          </div>
          <div className="p-2 space-y-1 col-span-2 sm:col-span-1">
            <span className="material-symbols-outlined text-[24px] text-emerald-300">flag</span>
            <div className="text-xs font-semibold text-white">Made in India</div>
          </div>
        </div>
      </section>

      {/* 5. Section: Loved by Thousands of Professionals */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="font-headline text-2xl sm:text-3xl text-[#261813]">
            Loved by Thousands of Professionals
          </h2>
          <p className="text-xs text-[#56423e]">Real stories from tech workers, founders, and managers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-[#fff1ec] border border-[#f7ddd3] flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div>
                <div className="flex gap-1 text-amber-500 mb-2">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-[#56423e] leading-relaxed italic font-headline text-sm">
                  {t.comment}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[#f7ddd3]">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#dcc0ba]"
                />
                <div>
                  <h3 className="text-xs font-bold text-[#261813]">{t.name}</h3>
                  <p className="text-[10px] text-[#89726d]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Section: How It Works */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="font-headline text-2xl sm:text-3xl text-[#261813]">How It Works</h2>
          <p className="text-xs text-[#56423e]">5 seamless steps to sustainable calm.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          {[
            { step: '1', title: 'Take Your Wellness Assessment', icon: 'assignment', action: () => onNavigate('vitals') },
            { step: '2', title: 'Get Your Personalized Wellness Plan', icon: 'person_search', action: onOpenPlan },
            { step: '3', title: 'Use VibeVeda Products Daily', icon: 'sanitizer', action: () => onNavigate('apothecary') },
            { step: '4', title: 'Join Sessions & Build Healthy Habits', icon: 'self_improvement', action: () => onNavigate('yoga') },
            { step: '5', title: 'Track Progress & Feel the Difference', icon: 'insights', action: () => onNavigate('vitals') },
          ].map((s, idx) => (
            <button
              key={idx}
              onClick={s.action}
              className="p-4 rounded-2xl bg-[#fff1ec] hover:bg-[#ffe9e1] border border-[#f7ddd3] hover:border-[#953c27]/40 flex flex-col items-center justify-between text-center transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
            >
              <span className="w-6 h-6 rounded-full bg-[#953c27] text-white text-[10px] font-bold flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                {s.step}
              </span>
              <span className="material-symbols-outlined text-[24px] text-[#2e5b44] mb-2">{s.icon}</span>
              <p className="text-xs font-semibold text-[#261813] leading-snug">{s.title}</p>
              <div className="mt-2 text-[10px] font-bold text-[#953c27] flex items-center gap-0.5 opacity-90 group-hover:translate-x-0.5 transition-transform">
                <span>Start &rarr;</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 7. Section: Start Your Wellness Journey Today (CTA) */}
      <section className="p-6 sm:p-10 rounded-3xl bg-[#ffe9e1] border border-[#f7ddd3] shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-lg text-center md:text-left">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#904d00]">
            Take The Next Step
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl text-[#261813]">
            Start Your Wellness Journey Today
          </h2>
          <p className="text-xs sm:text-sm text-[#56423e] leading-relaxed">
            Join 10,000+ professionals choosing a natural way to manage stress and live better.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <button
              onClick={() => onNavigate('apothecary')}
              className="px-6 py-3 rounded-xl bg-[#2e5b44] text-white text-xs sm:text-sm font-semibold hover:bg-[#234735] shadow active:scale-95 transition-all cursor-pointer"
            >
              Get Started Now
            </button>
            <button
              onClick={() => onNavigate('apothecary')}
              className="px-6 py-3 rounded-xl border border-[#dcc0ba] bg-white text-[#261813] text-xs sm:text-sm font-semibold hover:bg-[#fff1ec] active:scale-95 transition-all cursor-pointer"
            >
              Explore Products
            </button>
          </div>
        </div>

        <div className="w-64 h-48 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
          <img
            src={vibeVedaOil.image}
            alt="VibeVeda signature formulations"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 8. Bottom Guarantee Badges - Interactive */}
      <div className="py-4 border-t border-[#f7ddd3] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs text-[#56423e]">
        <button
          onClick={() =>
            setSelectedGuarantee({
              title: '30 Days Money Back Guarantee',
              desc: 'Try VibeVeda risk-free for 30 days. If our classical formulations or guided sessions do not noticeably reduce your work tension or improve your rest, contact us for a prompt, courteous refund.',
            })
          }
          className="flex items-center justify-center gap-1.5 p-2 rounded-xl hover:bg-[#fff1ec] cursor-pointer transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-[#2e5b44]" />
          <span className="font-medium hover:underline">30 Days Money Back</span>
        </button>

        <button
          onClick={() =>
            setSelectedGuarantee({
              title: 'Bank-Grade 256-Bit Secure Payments',
              desc: 'Every order is processed through encrypted end-to-end payment gateways supporting Apple Pay, Stripe, Visa, MasterCard, and UPI with zero data retention of sensitive details.',
            })
          }
          className="flex items-center justify-center gap-1.5 p-2 rounded-xl hover:bg-[#fff1ec] cursor-pointer transition-colors"
        >
          <ShieldCheck className="w-4 h-4 text-[#2e5b44]" />
          <span className="font-medium hover:underline">Secure Payments</span>
        </button>

        <button
          onClick={() =>
            setSelectedGuarantee({
              title: 'Temperature-Regulated Fast Delivery',
              desc: 'Our botanical apothecary oils and elixirs are compounded fresh and shipped via temperature-stabilized courier within 24-48 business hours with live tracking.',
            })
          }
          className="flex items-center justify-center gap-1.5 p-2 rounded-xl hover:bg-[#fff1ec] cursor-pointer transition-colors"
        >
          <Truck className="w-4 h-4 text-[#2e5b44]" />
          <span className="font-medium hover:underline">Fast Delivery</span>
        </button>

        <button
          onClick={() =>
            setSelectedGuarantee({
              title: '100% Certified Natural Botanicals',
              desc: 'Conformant to classical Charaka and Sushruta Samhita pharmacopeia. Free from artificial preservatives, GMOs, parabens, synthetic perfumes, or petrochemical binders.',
            })
          }
          className="flex items-center justify-center gap-1.5 p-2 rounded-xl hover:bg-[#fff1ec] cursor-pointer transition-colors"
        >
          <Leaf className="w-4 h-4 text-[#2e5b44]" />
          <span className="font-medium hover:underline">100% Natural Ingredients</span>
        </button>
      </div>

      {/* Trust & Guarantee Detail Modal */}
      {selectedGuarantee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#fff8f6] rounded-3xl border border-[#f7ddd3] p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#ffe9e1]">
              <div className="flex items-center gap-2 text-[#2e5b44]">
                <ShieldCheck className="w-5 h-5" />
                <h4 className="font-headline text-lg font-bold text-[#261813]">
                  {selectedGuarantee.title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedGuarantee(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#89726d] hover:bg-[#ffe9e1]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <p className="text-xs text-[#56423e] leading-relaxed">
              {selectedGuarantee.desc}
            </p>
            <button
              onClick={() => setSelectedGuarantee(null)}
              className="w-full py-2.5 rounded-xl bg-[#2e5b44] text-white text-xs font-semibold hover:bg-[#234735] transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
