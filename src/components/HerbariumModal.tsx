import React, { useState } from 'react';
import { X, Search, Sparkles, Filter, ArrowRight } from 'lucide-react';
import { HERBARIUM_DATA } from '../data/mockData.ts';
import { Dosha, Herb } from '../types/veda.ts';

interface HerbariumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHerbProduct?: (herbName: string) => void;
}

export const HerbariumModal: React.FC<HerbariumModalProps> = ({
  isOpen,
  onClose,
  onSelectHerbProduct,
}) => {
  const [search, setSearch] = useState('');
  const [selectedDosha, setSelectedDosha] = useState<string>('All');
  const [activeHerb, setActiveHerb] = useState<Herb>(HERBARIUM_DATA[0]);

  if (!isOpen) return null;

  const filteredHerbs = HERBARIUM_DATA.filter((herb) => {
    const matchesSearch =
      herb.commonName.toLowerCase().includes(search.toLowerCase()) ||
      herb.sanskritName.toLowerCase().includes(search.toLowerCase()) ||
      herb.botanicalName.toLowerCase().includes(search.toLowerCase());
    const matchesDosha = selectedDosha === 'All' || herb.primaryDosha === selectedDosha;
    return matchesSearch && matchesDosha;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="w-full max-w-3xl rounded-3xl bg-[#fff8f6] border border-[#f7ddd3] shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#ffe9e1] flex items-center justify-between bg-[#fff1ec]">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#953c27] text-[20px]">
                menu_book
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#904d00]">
                The Winter Herbarium
              </span>
            </div>
            <h2 className="font-headline text-lg sm:text-xl font-medium text-[#261813] mt-0.5">
              108 Classical Ayurvedic Botanical Index
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#56423e] hover:bg-[#ffe9e1]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-[#f7ddd3]/60 bg-[#fff8f6] flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#89726d]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Sanskrit, common, or botanical genus..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white border border-[#dcc0ba] text-[#261813] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto">
            {['All', 'Vata', 'Pitta', 'Kapha'].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDosha(d)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedDosha === d
                    ? 'bg-[#953c27] text-white'
                    : 'bg-[#ffe9e1] text-[#953c27] hover:bg-[#fde3d9]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Content: Herb list on left, Herb details on right */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Herb List Sidebar */}
          <div className="md:col-span-5 border-r border-[#ffe9e1] overflow-y-auto p-3 space-y-2 bg-[#fff1ec]/40">
            {filteredHerbs.map((herb) => (
              <div
                key={herb.id}
                onClick={() => setActiveHerb(herb)}
                className={`p-3 rounded-2xl cursor-pointer border transition-all flex items-center gap-3 ${
                  activeHerb.id === herb.id
                    ? 'bg-[#ffe9e1] border-[#953c27] shadow-xs'
                    : 'bg-white border-[#f7ddd3] hover:border-[#dcc0ba]'
                }`}
              >
                <img
                  src={herb.image}
                  alt={herb.commonName}
                  className="w-12 h-12 rounded-xl object-cover border border-[#f7ddd3]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-headline text-sm font-semibold text-[#261813] truncate">
                      {herb.sanskritName}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#fff8f6] text-[#904d00]">
                      {herb.primaryDosha}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#56423e] truncate">
                    {herb.commonName}
                  </div>
                  <div className="text-[10px] italic text-[#89726d] truncate">
                    {herb.botanicalName}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Active Herb Dossier */}
          <div className="md:col-span-7 overflow-y-auto p-5 space-y-4 bg-[#fff8f6]">
            <div className="relative h-44 rounded-2xl overflow-hidden shadow-sm">
              <img
                src={activeHerb.image}
                alt={activeHerb.commonName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#ffdcc3]">
                  {activeHerb.botanicalName}
                </span>
                <h3 className="font-headline text-xl text-white">
                  {activeHerb.sanskritName} ({activeHerb.commonName})
                </h3>
              </div>
            </div>

            {/* Ayurvedic Pharmacology Triple: Rasa, Virya, Vipaka */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-[#fff1ec] border border-[#f7ddd3]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#904d00] block">
                  Rasa (Taste)
                </span>
                <span className="text-xs font-semibold text-[#261813] mt-0.5 block truncate">
                  {activeHerb.taste}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#fff1ec] border border-[#f7ddd3]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#904d00] block">
                  Virya (Potency)
                </span>
                <span className="text-xs font-semibold text-[#261813] mt-0.5 block truncate">
                  {activeHerb.potency}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#fff1ec] border border-[#f7ddd3]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#904d00] block">
                  Vipaka (Post)
                </span>
                <span className="text-xs font-semibold text-[#261813] mt-0.5 block truncate">
                  {activeHerb.postDigestive}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#904d00] mb-1">
                Classical Shastra Commentary
              </h4>
              <p className="text-xs text-[#56423e] leading-relaxed">
                {activeHerb.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#904d00] mb-1.5">
                Target Indications
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeHerb.indications.map((ind, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-lg bg-[#ffe9e1] text-[#953c27] text-[11px] font-medium"
                  >
                    {ind}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  onClose();
                  if (onSelectHerbProduct) onSelectHerbProduct(activeHerb.sanskritName);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#953c27] text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#b4533c] shadow-xs"
              >
                <span>Acquire Formulations with {activeHerb.sanskritName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
