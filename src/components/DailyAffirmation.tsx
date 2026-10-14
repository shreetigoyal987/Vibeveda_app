import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, Volume2, RefreshCw, Quote, Heart } from 'lucide-react';
import { soundService } from '../services/soundService.ts';

export interface Affirmation {
  id: string;
  sanskrit: string;
  quote: string;
  translation: string;
  source: string;
  tattva: 'Prana' | 'Ojas' | 'Sattva' | 'Agni' | 'Shanti';
}

const AFFIRMATIONS: Affirmation[] = [
  {
    id: 'aff-1',
    sanskrit: '“Swasthasya Swāsthya Rakṣaṇam”',
    quote: 'My body is a sacred sanctuary. Through gentle breath and mindful pause, I preserve my natural state of luminous balance.',
    translation: 'Preserve the radiant health of the healthy and restore equilibrium to the burdened.',
    source: 'Charaka Samhita Sutrasthana • XXX.26',
    tattva: 'Sattva',
  },
  {
    id: 'aff-2',
    sanskrit: '“Yathā Piṇḍe Tathā Brahmāṇḍe”',
    quote: 'As is the human body, so is the cosmic universe. When I align with nature’s quiet rhythm, peace arises from within.',
    translation: 'As is the microcosm of the body, so is the macrocosm of the cosmos.',
    source: 'Yajurveda Shanti Patha',
    tattva: 'Prana',
  },
  {
    id: 'aff-3',
    sanskrit: '“Śāntaṁ Śivam Advaitam”',
    quote: 'Beneath the surface waves of working thoughts lies an ocean of unshakable stillness. Today, I anchor in silence.',
    translation: 'Peaceful, auspicious, and unified in unbroken awareness.',
    source: 'Mandukya Upanishad • VII',
    tattva: 'Shanti',
  },
  {
    id: 'aff-4',
    sanskrit: '“Ojo Hi Balaṁ Smṛtam”',
    quote: 'True strength is not frantic effort, but deeply nourished Ojas. I honor rest, digestion, and restorative stillness.',
    translation: 'Ojas is the supreme essence of physical stamina and mental immunity.',
    source: 'Sushruta Samhita Sutrasthana • XV.24',
    tattva: 'Ojas',
  },
  {
    id: 'aff-5',
    sanskrit: '“Sama Agni Sama Dhātuśca”',
    quote: 'With each nourishing meal and calm breath, my digestive Agni burns clean, illuminating both mind and spirit.',
    translation: 'When the digestive fire, tissues, and senses abide in harmony, true health flourishes.',
    source: 'Sushruta Samhita • XV.41',
    tattva: 'Agni',
  },
  {
    id: 'aff-6',
    sanskrit: '“Prasanna Ātma Indriya Manaḥ”',
    quote: 'A pleasant soul, serene senses, and a clear mind are the true measures of wellness. I release comparison today.',
    translation: 'Delight of the soul, clarity of senses, and tranquility of the mind define Swastha.',
    source: 'Ashtanga Hridaya • I.1',
    tattva: 'Sattva',
  },
  {
    id: 'aff-7',
    sanskrit: '“Maitrī Karuṇā Mudito-Pekṣāṇām”',
    quote: 'I choose kindness toward my body’s limits, benevolence in my work, and equanimity amid change.',
    translation: 'Cultivate friendliness toward joy and calm neutrality toward disturbance.',
    source: 'Patanjali Yoga Sutras • I.33',
    tattva: 'Shanti',
  },
];

export const DailyAffirmation: React.FC = () => {
  // Deterministic daily selection based on calendar date (updates once per day)
  const getTodayIndex = () => {
    const today = new Date();
    // Days since epoch or date string hash
    const dateInt = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    return dateInt % AFFIRMATIONS.length;
  };

  const [currentIndex, setCurrentIndex] = useState<number>(getTodayIndex);
  const [copied, setCopied] = useState<boolean>(false);
  const [isPlayingChime, setIsPlayingChime] = useState<boolean>(false);

  // Sync index whenever date changes
  useEffect(() => {
    setCurrentIndex(getTodayIndex());
  }, []);

  const activeAffirmation = AFFIRMATIONS[currentIndex];

  const handleCopy = () => {
    const text = `${activeAffirmation.sanskrit}\n\n"${activeAffirmation.quote}"\n\n— ${activeAffirmation.source} via VibeVeda`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChime = () => {
    setIsPlayingChime(true);
    soundService.playSingingBowl(528, 4.0);
    setTimeout(() => setIsPlayingChime(false), 4000);
  };

  const handleShuffle = () => {
    setCurrentIndex((prev) => (prev + 1) % AFFIRMATIONS.length);
    soundService.playSingingBowl(432, 2.5);
  };

  const getTattvaBadge = (tattva: string) => {
    switch (tattva) {
      case 'Prana':
        return 'bg-[#ffdcc3] text-[#904d00]';
      case 'Ojas':
        return 'bg-[#ffe9e1] text-[#953c27]';
      case 'Agni':
        return 'bg-amber-100 text-amber-900';
      case 'Shanti':
        return 'bg-indigo-100 text-indigo-900';
      default:
        return 'bg-emerald-100 text-emerald-900';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#fff1ec] via-[#ffe9e1]/70 to-[#fde3d9]/50 border border-[#f7ddd3] p-6 sm:p-8 shadow-xs">
      {/* Subtle watermark glyph in corner */}
      <div className="absolute -right-6 -bottom-6 text-[#953c27]/10 pointer-events-none select-none">
        <span className="material-symbols-outlined text-[130px]">spa</span>
      </div>

      <div className="relative z-10 flex flex-col space-y-4">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f7ddd3]/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#953c27] text-white flex items-center justify-center shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#ffdcc3]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#904d00] block">
                Daily Ayurvedic Affirmation &bull; Sandhya Ritucharya
              </span>
              <span className="text-xs text-[#56423e] font-medium">
                Refreshed for Today ({new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${getTattvaBadge(
                activeAffirmation.tattva
              )}`}
            >
              {activeAffirmation.tattva} Balance
            </span>

            {/* Cycle next reflection */}
            <button
              onClick={handleShuffle}
              className="p-1.5 rounded-xl bg-white/80 hover:bg-white text-[#56423e] hover:text-[#261813] transition-colors border border-[#dcc0ba]/60 shadow-2xs"
              title="Draw another wisdom spark"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Sanskrit Sutra */}
        <div className="pt-1">
          <span className="font-headline text-lg sm:text-xl italic text-[#953c27] font-semibold tracking-wide">
            {activeAffirmation.sanskrit}
          </span>
          <span className="text-xs text-[#89726d] block mt-0.5">
            {activeAffirmation.translation}
          </span>
        </div>

        {/* Daily Affirmation Main Quote */}
        <blockquote className="font-headline text-xl sm:text-2xl text-[#261813] font-normal leading-relaxed pl-4 border-l-2 border-[#953c27]">
          “{activeAffirmation.quote}”
        </blockquote>

        {/* Source and Action Footer */}
        <div className="pt-2 border-t border-[#f7ddd3]/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="text-[11px] font-semibold text-[#89726d] flex items-center gap-1.5">
            <Quote className="w-3 h-3 text-[#904d00]" />
            <span>{activeAffirmation.source}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Play Singing Bowl Harmonic Chime */}
            <button
              onClick={handleChime}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isPlayingChime
                  ? 'bg-[#953c27] text-white border-[#953c27] shadow-xs'
                  : 'bg-white text-[#56423e] border-[#dcc0ba] hover:bg-[#fff8f6]'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-[#fe932c]" />
              <span>{isPlayingChime ? 'Resonating 528Hz...' : 'Breathe & Chime'}</span>
            </button>

            {/* Copy / Share Affirmation */}
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-white text-[#261813] border border-[#dcc0ba] hover:bg-[#fff8f6] font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#89726d]" />
                  <span>Copy Affirmation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
