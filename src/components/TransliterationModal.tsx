import React, { useState } from 'react';
import { X, Search, Volume2, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { TabType } from './Navigation.tsx';
import { soundService } from '../services/soundService.ts';

interface LexiconTerm {
  sanskrit: string;
  devanagari: string;
  transliteration: string;
  meaning: string;
  description: string;
  tattva: 'Ojas' | 'Prana' | 'Agni' | 'Sattva' | 'Dinacharya';
  targetTab: TabType;
  relatedItem: string;
}

const AYURVEDIC_TERMS: LexiconTerm[] = [
  {
    sanskrit: 'Ojas',
    devanagari: 'ओजस्',
    transliteration: 'O-jas',
    meaning: 'Vital Radiance, Cellular Immunity & Inner Glow',
    description: 'The supreme biological sap and essence of all seven bodily tissues (Dhatus). When Ojas is high, mind is serene and immune resilience is invincible.',
    tattva: 'Ojas',
    targetTab: 'vitals',
    relatedItem: 'Ojas Vitality Tracker',
  },
  {
    sanskrit: 'Prana',
    devanagari: 'प्राण',
    transliteration: 'Prā-ṇa',
    meaning: 'The Universal Life Force & Breath of Consciousness',
    description: 'The primordial vital breath that animates every cell, regulates nervous system coherence, and circulates through 72,000 subtle Nadis.',
    tattva: 'Prana',
    targetTab: 'practices',
    relatedItem: 'Sama Vritti Breath Pacer',
  },
  {
    sanskrit: 'Dinacharya',
    devanagari: 'दिनचर्या',
    transliteration: 'Di-na-char-yā',
    meaning: 'Daily Circadian Routine for Balance',
    description: 'The classical ritual calendar aligned with the diurnal cycles of nature (sunrise, solar zenith, twilight, and nocturnal renewal).',
    tattva: 'Dinacharya',
    targetTab: 'home',
    relatedItem: '24-Hour Wellness Blueprint',
  },
  {
    sanskrit: 'Abhyanga',
    devanagari: 'अभ्यङ्ग',
    transliteration: 'Abh-yan-ga',
    meaning: 'Warm Herbal Oil Anointing & Marma Massage',
    description: 'A deeply soothing self-care practice of applying warm, herb-infused oils from crown to feet to pacify Vata dosha, lubricate joints, and ground the nervous system.',
    tattva: 'Ojas',
    targetTab: 'spa',
    relatedItem: 'Warm Sesame Abhyanga',
  },
  {
    sanskrit: 'Shirodhara',
    devanagari: 'शिरोधारा',
    transliteration: 'Shi-ro-dhā-rā',
    meaning: 'Continuous Medicated Oil Pour Over Third Eye',
    description: 'A divine Ayurvedic therapy where a steady, rhythmic stream of warm herbal oil is poured continuously over the forehead (Ajna Marma) to dissolve mental chatter and insomnia.',
    tattva: 'Sattva',
    targetTab: 'spa',
    relatedItem: 'Shirodhara Serenity Sanctuary',
  },
  {
    sanskrit: 'Agni',
    devanagari: 'अग्नि',
    transliteration: 'Ag-ni',
    meaning: 'Digestive & Metabolic Fire',
    description: 'The biological power of transformation. Agni converts food into vital energy, clear thoughts, and vibrant tissues without creating toxic residue (Ama).',
    tattva: 'Agni',
    targetTab: 'vitals',
    relatedItem: 'Agni & Digestion Scoring',
  },
  {
    sanskrit: 'Rasayana',
    devanagari: 'रसायन',
    transliteration: 'Ra-sā-ya-na',
    meaning: 'The Path of Rejuvenation & Longevity',
    description: 'Master Ayurvedic formulations (such as Saffron Ojas Elixir and Ashwagandha) engineered to arrest cellular aging and optimize vitality.',
    tattva: 'Ojas',
    targetTab: 'apothecary',
    relatedItem: 'Saffron Ojas Elixir & Brahmi Taila',
  },
  {
    sanskrit: 'Sattva',
    devanagari: 'सत्त्व',
    transliteration: 'Sat-tva',
    meaning: 'Purity, Lucidity & Harmonious Calm',
    description: 'The mental quality of light, peace, compassion, and clarity. A Sattvic mind remains undisturbed by transient work stresses.',
    tattva: 'Sattva',
    targetTab: 'yoga',
    relatedItem: 'Sattvic Yin & Nidra Flow',
  },
];

interface TransliterationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: TabType) => void;
}

export const TransliterationModal: React.FC<TransliterationModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [search, setSearch] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredTerms = AYURVEDIC_TERMS.filter(
    (t) =>
      t.sanskrit.toLowerCase().includes(search.toLowerCase()) ||
      t.meaning.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.transliteration.toLowerCase().includes(search.toLowerCase())
  );

  const handlePronounce = (term: LexiconTerm) => {
    setPlayingId(term.sanskrit);
    soundService.playSingingBowl(528, 2.5);
    soundService.triggerVibration([100, 60, 100]);
    setTimeout(() => setPlayingId(null), 1800);
  };

  const handleJump = (tab: TabType) => {
    onClose();
    onNavigate(tab);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-[#fff8f6] rounded-3xl border border-[#f7ddd3] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#ffe9e1] bg-[#953c27] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white">
              <BookOpen className="w-5 h-5 text-[#ffdcc3]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffdcc3]">
                Translations &bull; Sanskrit Transliteration Guide
              </span>
              <h3 className="font-headline text-lg sm:text-xl font-bold text-white">
                VibeVeda Wisdom Lexicon
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 bg-[#fff1ec] border-b border-[#f7ddd3]">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89726d]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search translation of Sanskrit terms (e.g. Ojas, Prana, Agni)..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white border border-[#dcc0ba] text-[#261813] placeholder-[#89726d] focus:outline-none focus:border-[#953c27]"
            />
          </div>
        </div>

        {/* Terms list */}
        <div className="p-5 overflow-y-auto space-y-4 bg-[#fff8f6]">
          {filteredTerms.map((term) => (
            <div
              key={term.sanskrit}
              className="p-4 rounded-2xl bg-[#fff1ec] border border-[#f7ddd3] space-y-2 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <h4 className="font-headline text-xl font-bold text-[#261813]">
                      {term.sanskrit}
                    </h4>
                    <span className="text-sm font-medium text-[#953c27]">
                      {term.devanagari}
                    </span>
                    <span className="text-xs text-[#89726d] italic">
                      [{term.transliteration}]
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-[#904d00] mt-0.5">
                    {term.meaning}
                  </div>
                </div>

                <button
                  onClick={() => handlePronounce(term)}
                  className={`p-2 rounded-xl border transition-colors flex items-center gap-1 text-xs font-medium ${
                    playingId === term.sanskrit
                      ? 'bg-[#953c27] text-white border-[#953c27]'
                      : 'bg-white border-[#dcc0ba] text-[#56423e] hover:bg-[#ffe9e1]'
                  }`}
                  title="Listen to chime vibration"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Chime</span>
                </button>
              </div>

              <p className="text-xs text-[#56423e] leading-relaxed">
                {term.description}
              </p>

              <div className="pt-2 border-t border-[#f7ddd3]/80 flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#89726d]">
                  Tattva: <strong className="text-[#953c27]">{term.tattva}</strong>
                </span>

                <button
                  onClick={() => handleJump(term.targetTab)}
                  className="inline-flex items-center gap-1 font-semibold text-[#2e5b44] hover:text-[#1b3a2a] text-xs"
                >
                  <span>Experience: {term.relatedItem}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {filteredTerms.length === 0 && (
            <div className="text-center py-8 text-xs text-[#89726d]">
              No matching Sanskrit terms found. Try searching &quot;Ojas&quot;, &quot;Prana&quot;, or &quot;Agni&quot;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
