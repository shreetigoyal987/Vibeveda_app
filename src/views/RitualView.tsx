import React, { useState, useEffect } from 'react';
import { HERO_RITUAL, PRODUCTS, SHASTRA_SUTRAS } from '../data/mockData.ts';
import { ApothecaryProduct } from '../types/veda.ts';
import { soundService } from '../services/soundService.ts';

interface RitualViewProps {
  onBeginRitual: () => void;
  onAddToCart: (product: ApothecaryProduct) => void;
  onOpenHerbarium: () => void;
  onOpenProductDetail: (product: ApothecaryProduct) => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const RitualView: React.FC<RitualViewProps> = ({
  onBeginRitual,
  onAddToCart,
  onOpenHerbarium,
  onOpenProductDetail,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [isPlayingSutra, setIsPlayingSutra] = useState(false);
  const [sutraTimer, setSutraTimer] = useState(45);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // Saffron & Brahmi products from curated data
  const saffronProduct = PRODUCTS.find((p) => p.id === 'prod-saffron-ojas') || PRODUCTS[0];
  const brahmiProduct = PRODUCTS.find((p) => p.id === 'prod-brahmi-taila') || PRODUCTS[1];

  // Shastra audio toggle
  const toggleShastraAudio = () => {
    if (!isPlayingSutra) {
      soundService.startShastraDrone();
      setIsPlayingSutra(true);
      setSutraTimer(45);
    } else {
      soundService.stopShastraDrone();
      setIsPlayingSutra(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlayingSutra && sutraTimer > 0) {
      interval = setInterval(() => {
        setSutraTimer((prev) => prev - 1);
      }, 1000);
    } else if (sutraTimer === 0 && isPlayingSutra) {
      setIsPlayingSutra(false);
      soundService.stopShastraDrone();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingSutra, sutraTimer]);

  const handleAdd = (product: ApothecaryProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedNotice(`${product.name} added to Apothecary Basket`);
    setTimeout(() => setAddedNotice(null), 2500);
  };

  return (
    <div className="flex flex-col w-full pb-20 max-w-lg md:max-w-2xl mx-auto transition-all">
      {/* Toast notification */}
      {addedNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#261813] text-[#ffede7] text-xs font-semibold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[16px] text-[#fe932c]">check_circle</span>
          <span>{addedNotice}</span>
        </div>
      )}

      {/* Editorial Publication Masthead */}
      <section className="px-5 pt-2 pb-6 flex flex-col gap-3">
        <div className="flex items-center justify-between text-[#56423e] text-[11px] font-semibold tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#904d00]" />
            <span>Vol. IV • No. 12</span>
          </div>
          <span>Late Autumn • Evening Issue</span>
        </div>

        <div className="py-1">
          <h2 className="font-headline text-3xl sm:text-4xl tracking-tighter text-[#261813] uppercase font-normal select-none">
            Vibaveda
          </h2>
          <p className="font-headline text-xl sm:text-2xl italic text-[#953c27] mt-1 leading-snug">
            “The evening belongs to silence.”
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#904d00] font-semibold uppercase tracking-wider">
            Tattva I
          </span>
          <div className="flex-1 h-[1px] bg-[#dcc0ba]/40" />
          <span className="text-xs text-[#56423e] italic">
            Sandhya Ritucharya
          </span>
        </div>
      </section>

      {/* Hero Feature: Art-Book Story Spread */}
      <section className="px-5 mb-8">
        <article className="bg-[#fff1ec] rounded-2xl overflow-hidden shadow-xs flex flex-col border border-[#f7ddd3]/80">
          <div className="relative w-full h-72 overflow-hidden">
            <img
              src={HERO_RITUAL.image}
              alt={HERO_RITUAL.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3c2d26]/90 via-[#3c2d26]/30 to-transparent" />

            {/* Pill & Metadata overlay */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b4533c] text-white text-[11px] font-semibold uppercase tracking-wider shadow-xs">
                <span className="material-symbols-outlined text-[13px]">nights_stay</span>
                <span>Pradosha Ritual</span>
              </div>

              <button
                aria-label="Save to Grantham"
                onClick={onToggleBookmark}
                className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-transform active:scale-90 ${
                  isBookmarked
                    ? 'bg-[#953c27] text-white shadow-sm'
                    : 'bg-[#fff1ec]/85 text-[#261813]'
                }`}
                title="Bookmark Ritual"
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {isBookmarked ? 'bookmark' : 'bookmark_border'}
                </span>
              </button>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex flex-col">
              <span className="text-[11px] font-semibold text-[#ffdcc3] uppercase tracking-widest mb-1">
                Deep Nourishment
              </span>
              <h3 className="font-headline text-2xl sm:text-3xl text-[#ffede7] font-normal leading-tight">
                {HERO_RITUAL.title}
              </h3>
            </div>
          </div>

          {/* Narrative Meta & Pull Text */}
          <div className="p-4 sm:p-5 flex flex-col gap-3 bg-[#fff1ec]">
            <p className="text-xs sm:text-sm text-[#56423e] leading-relaxed font-body">
              {HERO_RITUAL.description}
            </p>

            <div className="flex items-center justify-between pt-2 text-[#56423e] text-xs">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#ffe9e1] flex items-center justify-center text-[#953c27] text-[10px] font-bold">
                  V
                </span>
                <span className="font-medium">{HERO_RITUAL.vaidya}</span>
              </div>
              <div className="flex items-center gap-1 text-[#904d00]">
                <span className="material-symbols-outlined text-[15px]">schedule</span>
                <span className="font-medium">{HERO_RITUAL.durationCadence}</span>
              </div>
            </div>

            {/* Full-Width Ritual Launch Ribbon */}
            <button
              onClick={onBeginRitual}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#953c27] text-white flex items-center justify-between transition-all active:scale-[0.99] hover:bg-[#b4533c] shadow-sm group"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">spa</span>
                <span className="text-xs sm:text-sm font-semibold tracking-wide">
                  Begin Ritual — 18 min
                </span>
              </div>
              <span className="material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:translate-x-1">
                arrow_forward
              </span>
            </button>
          </div>
        </article>
      </section>

      {/* Editorial Section Break II */}
      <div className="px-5 flex items-center gap-3 mb-6">
        <span className="text-[11px] text-[#904d00] font-semibold uppercase tracking-wider">
          Tattva II
        </span>
        <div className="flex-1 h-[1px] bg-[#dcc0ba]/40" />
        <span className="text-xs text-[#56423e] italic">
          Apothecary Curations
        </span>
      </div>

      {/* Staggered Offset Portrait Grid (matching mockup) */}
      <section className="px-5 grid grid-cols-2 gap-3 mb-10">
        {/* Left Staggered Card (Higher: -translate-y-2) */}
        <div
          onClick={() => onOpenProductDetail(saffronProduct)}
          className="flex flex-col bg-[#fff1ec] rounded-2xl overflow-hidden shadow-xs relative -translate-y-2 border border-[#f7ddd3]/80 cursor-pointer group"
        >
          <div className="relative w-full h-44 overflow-hidden">
            <img
              src={saffronProduct.image}
              alt={saffronProduct.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#fff8f6]/90 backdrop-blur-sm text-[#904d00] text-[10px] font-semibold tracking-wide">
              {saffronProduct.badge}
            </div>
          </div>

          <div className="p-3 flex flex-col flex-1 justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-[#953c27] uppercase tracking-wider">
                {saffronProduct.compoundNo}
              </span>
              <h4 className="font-headline text-[15px] sm:text-[16px] leading-snug text-[#261813] mt-0.5 font-medium line-clamp-1">
                {saffronProduct.name}
              </h4>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-sm font-semibold text-[#261813]">
                ${saffronProduct.price}
              </span>
              <button
                aria-label={`Acquire ${saffronProduct.name}`}
                onClick={(e) => handleAdd(saffronProduct, e)}
                className="w-7 h-7 rounded-full bg-[#fde3d9] flex items-center justify-center text-[#953c27] hover:bg-[#953c27] hover:text-white transition-colors"
                title="Add to Basket"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Staggered Card (Lower: translate-y-3) */}
        <div
          onClick={() => onOpenProductDetail(brahmiProduct)}
          className="flex flex-col bg-[#fff1ec] rounded-2xl overflow-hidden shadow-xs relative translate-y-3 border border-[#f7ddd3]/80 cursor-pointer group"
        >
          <div className="relative w-full h-44 overflow-hidden">
            <img
              src={brahmiProduct.image}
              alt={brahmiProduct.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#f7ddd3]/90 backdrop-blur-sm text-[#261813] text-[10px] font-semibold tracking-wide">
              {brahmiProduct.badge}
            </div>
          </div>

          <div className="p-3 flex flex-col flex-1 justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-[#904d00] uppercase tracking-wider">
                {brahmiProduct.compoundNo}
              </span>
              <h4 className="font-headline text-[15px] sm:text-[16px] leading-snug text-[#261813] mt-0.5 font-medium line-clamp-1">
                {brahmiProduct.name}
              </h4>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-sm font-semibold text-[#261813]">
                ${brahmiProduct.price}
              </span>
              <button
                aria-label={`Acquire ${brahmiProduct.name}`}
                onClick={(e) => handleAdd(brahmiProduct, e)}
                className="w-7 h-7 rounded-full bg-[#fde3d9] flex items-center justify-center text-[#953c27] hover:bg-[#953c27] hover:text-white transition-colors"
                title="Add to Basket"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Section Break III */}
      <div className="px-5 flex items-center gap-3 mt-4 mb-4">
        <span className="text-[11px] text-[#904d00] font-semibold uppercase tracking-wider">
          Tattva III
        </span>
        <div className="flex-1 h-[1px] bg-[#dcc0ba]/40" />
        <span className="text-xs text-[#56423e] italic">
          Nectar of Shastra
        </span>
      </div>

      {/* Sanskrit Shastra Sutra Ribbon */}
      <section className="px-5 mb-6">
        <div className="bg-[#ffe9e1] p-4 sm:p-5 rounded-2xl shadow-xs flex flex-col gap-3 relative overflow-hidden border border-[#f7ddd3]">
          {/* Ambient glyph backdrop */}
          <div className="absolute -right-4 -bottom-4 text-[#f7ddd3] pointer-events-none select-none opacity-40">
            <span className="material-symbols-outlined text-[90px]">filter_vintage</span>
          </div>

          <div className="flex items-center gap-2 text-[#953c27]">
            <span className="material-symbols-outlined text-[18px]">auto_stories</span>
            <span className="text-[10px] uppercase tracking-widest font-bold">
              {SHASTRA_SUTRAS[0].source}
            </span>
          </div>

          <blockquote className="font-headline text-[17px] sm:text-[18px] leading-relaxed text-[#261813] italic pl-3 relative border-l-2 border-[#953c27]">
            {SHASTRA_SUTRAS[0].sanskrit}
            <span className="block mt-1 text-xs not-italic text-[#56423e] font-body">
              {SHASTRA_SUTRAS[0].translation}
            </span>
          </blockquote>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-[#904d00] font-medium">
              Daily Contemplation
            </span>

            <button
              onClick={toggleShastraAudio}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isPlayingSutra
                  ? 'bg-[#953c27] text-white shadow-xs'
                  : 'bg-[#fde3d9] text-[#261813] hover:bg-[#eed5cb]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isPlayingSutra ? 'pause' : 'volume_up'}
              </span>
              <span>
                {isPlayingSutra
                  ? `Drone Active • 0:${sutraTimer.toString().padStart(2, '0')}`
                  : 'Listen • 0:45'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Asymmetrical Full-Width Banner Action (108 Herb Herbarium) */}
      <section className="px-5 mb-4">
        <button
          onClick={onOpenHerbarium}
          className="w-full text-left p-4 sm:p-5 rounded-2xl bg-[#3c2d26] text-[#ffede7] shadow-md flex items-center justify-between group active:scale-[0.99] transition-all hover:bg-[#2b1f1a]"
        >
          <div className="flex flex-col gap-1 pr-4">
            <div className="flex items-center gap-1.5 text-[#ffdcc3]">
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
              <span className="text-[10px] font-bold tracking-widest uppercase">
                The Winter Almanac
              </span>
            </div>
            <span className="font-headline text-lg sm:text-xl font-normal text-[#ffede7] leading-tight">
              Browse the 108 Herb Herbarium
            </span>
            <span className="text-xs text-[#dcc0ba] mt-0.5">
              Curated formulations, doshic profiles &amp; preparations
            </span>
          </div>

          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#ffede7] group-hover:translate-x-1 transition-transform">
            <span className="material-symbols-outlined text-[20px]">north_east</span>
          </div>
        </button>
      </section>
    </div>
  );
};
