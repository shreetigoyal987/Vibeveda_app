import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Check, 
  Sparkles, 
  Star, 
  ShoppingBag, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X
} from 'lucide-react';
import { PRODUCTS } from '../data/mockData.ts';
import { ApothecaryProduct } from '../types/veda.ts';

interface ApothecaryViewProps {
  onAddToCart: (product: ApothecaryProduct, isSubscription?: boolean) => void;
  selectedHerbFilter?: string | null;
  onClearHerbFilter?: () => void;
  isMember: boolean;
}

export const ApothecaryView: React.FC<ApothecaryViewProps> = ({
  onAddToCart,
  selectedHerbFilter,
  onClearHerbFilter,
  isMember,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDosha, setSelectedDosha] = useState<string>('All');
  const [activeProduct, setActiveProduct] = useState<ApothecaryProduct | null>(null);
  const [isSubscribeSelected, setIsSubscribeSelected] = useState(false);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const categories = ['All', 'Elixirs', 'Oils', 'Rasayana', 'Botanicals', 'Teas'];
  const doshas = ['All', 'Vata', 'Pitta', 'Kapha', 'Tridoshic'];

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.compoundNo.toLowerCase().includes(search.toLowerCase()) ||
      p.sanskritName.toLowerCase().includes(search.toLowerCase()) ||
      p.ingredients.some((ing) => ing.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesDosha = selectedDosha === 'All' || p.dosha === selectedDosha;
    const matchesHerb =
      !selectedHerbFilter ||
      p.name.toLowerCase().includes(selectedHerbFilter.toLowerCase()) ||
      p.ingredients.some((ing) => ing.toLowerCase().includes(selectedHerbFilter.toLowerCase()));

    return matchesSearch && matchesCategory && matchesDosha && matchesHerb;
  });

  const handleQuickAdd = (p: ApothecaryProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(p, false);
    setToastNotice(`${p.name} added to Apothecary Basket`);
    setTimeout(() => setToastNotice(null), 2500);
  };

  const handleModalAdd = () => {
    if (!activeProduct) return;
    onAddToCart(activeProduct, isSubscribeSelected);
    setToastNotice(
      `${activeProduct.name} (${isSubscribeSelected ? 'Monthly Refill' : 'One-Time'}) added to Basket`
    );
    setActiveProduct(null);
    setTimeout(() => setToastNotice(null), 2500);
  };

  return (
    <div className="flex flex-col w-full pb-24 max-w-lg md:max-w-4xl mx-auto px-4 sm:px-6">
      {/* Toast Alert */}
      {toastNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#261813] text-[#ffede7] text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[16px] text-[#fe932c]">check_circle</span>
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="pt-2 pb-5 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#904d00] bg-[#ffdcc3]/60 px-2.5 py-0.5 rounded-full">
            Artisanal Dispensary
          </span>
          {isMember && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#953c27] bg-[#fde3d9] px-2.5 py-0.5 rounded-full">
              Sanctuary 20% Privilege Active
            </span>
          )}
        </div>

        <h2 className="font-headline text-3xl font-normal text-[#261813]">
          VibeVeda Botanical Apothecary
        </h2>
        <p className="text-xs text-[#56423e] max-w-xl leading-relaxed">
          Each compound is hand-decocted according to Classical Samhita scriptures, harvested under favorable astrological moon cadences.
        </p>
      </div>

      {/* Herb Filter Alert if active */}
      {selectedHerbFilter && (
        <div className="mb-4 p-3 rounded-2xl bg-[#ffe9e1] border border-[#f7ddd3] flex items-center justify-between text-xs text-[#953c27]">
          <span>Filtered by Herbarium Botanical: <strong>{selectedHerbFilter}</strong></span>
          <button
            onClick={onClearHerbFilter}
            className="text-[#953c27] font-bold hover:underline"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Search Bar & Dosha Selector */}
      <div className="space-y-3 mb-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89726d]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search classical oils, extracts, rasayanas, or botanicals..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-[#fff1ec] border border-[#dcc0ba] text-[#261813] placeholder-[#89726d] focus:outline-none focus:border-[#953c27]"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
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

        {/* Dosha Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs text-[#56423e]">
          <span className="text-[11px] font-semibold text-[#89726d] mr-1">Dosha:</span>
          {doshas.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDosha(d)}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-medium transition-colors ${
                selectedDosha === d
                  ? 'bg-[#904d00] text-white'
                  : 'bg-white border border-[#dcc0ba] text-[#56423e] hover:border-[#904d00]'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => {
          const effectivePrice = isMember ? Math.round(product.price * 0.8) : product.price;

          return (
            <div
              key={product.id}
              onClick={() => {
                setActiveProduct(product);
                setIsSubscribeSelected(false);
              }}
              className="flex flex-col justify-between bg-[#fff1ec] rounded-2xl overflow-hidden border border-[#f7ddd3] shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="relative w-full h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-[#fff8f6]/95 text-[#904d00] text-[10px] font-bold tracking-wide shadow-xs">
                  {product.badge || product.compoundNo}
                </div>
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#261813]/85 text-[#ffdcc3] text-[10px] font-semibold">
                  {product.dosha}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-1 text-[11px] text-[#904d00] font-semibold">
                    <span>{product.compoundNo}</span>
                    <span>&bull;</span>
                    <span className="italic">{product.sanskritName}</span>
                  </div>

                  <h3 className="font-headline text-lg font-medium text-[#261813] mt-0.5 line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="text-xs text-[#56423e] line-clamp-2 mt-1 leading-relaxed">
                    {product.shortDesc}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#f7ddd3] flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-headline text-lg font-semibold text-[#261813]">
                        ${effectivePrice}
                      </span>
                      {isMember && (
                        <span className="text-[10px] line-through text-[#89726d]">
                          ${product.price}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#904d00] block">
                      Sub: ${product.subscriptionPrice}/mo
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleQuickAdd(product, e)}
                    className="px-3 py-1.5 rounded-xl bg-[#953c27] text-white text-xs font-semibold flex items-center gap-1 hover:bg-[#b4533c] shadow-xs active:scale-95 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Acquire</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Detail Modal */}
      {activeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="w-full max-w-xl bg-[#fff8f6] rounded-3xl border border-[#f7ddd3] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="relative h-64 w-full shrink-0">
              <img
                src={activeProduct.image}
                alt={activeProduct.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveProduct(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/60"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                <span className="px-2.5 py-1 rounded-full bg-[#953c27] text-[10px] font-bold uppercase tracking-wider">
                  {activeProduct.compoundNo}
                </span>
                <span className="text-xs bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {activeProduct.size}
                </span>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <h3 className="font-headline text-2xl text-[#261813]">
                  {activeProduct.name}
                </h3>
                <span className="text-xs italic text-[#904d00]">
                  Classical Sanskrit: {activeProduct.sanskritName}
                </span>
                <p className="text-xs sm:text-sm text-[#56423e] mt-2 leading-relaxed">
                  {activeProduct.description}
                </p>
              </div>

              {/* Ingredients & Benefits */}
              <div className="p-4 rounded-2xl bg-[#fff1ec] border border-[#f7ddd3] space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#904d00]">
                  Formulation Ingredients
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeProduct.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-white border border-[#dcc0ba] text-[11px] text-[#261813]"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#904d00] mb-1">
                  How To Dispense &amp; Apply
                </h4>
                <p className="text-xs text-[#56423e] leading-relaxed">
                  {activeProduct.howToUse}
                </p>
              </div>

              {/* Purchase Mode Selector: One-Time vs Subscription (Monetization) */}
              <div className="pt-2 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#904d00]">
                  Select Dispensation Cadence
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setIsSubscribeSelected(false)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      !isSubscribeSelected
                        ? 'border-[#953c27] bg-[#ffe9e1]'
                        : 'border-[#dcc0ba] bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#261813]">One-Time Batch</div>
                    <div className="font-headline text-base text-[#953c27] font-semibold mt-1">
                      ${activeProduct.price}
                    </div>
                    <div className="text-[10px] text-[#89726d]">Standard delivery</div>
                  </div>

                  <div
                    onClick={() => setIsSubscribeSelected(true)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all relative ${
                      isSubscribeSelected
                        ? 'border-[#953c27] bg-[#ffe9e1]'
                        : 'border-[#dcc0ba] bg-white'
                    }`}
                  >
                    <span className="absolute -top-2 right-2 px-1.5 py-0.2 bg-[#fe932c] text-white text-[9px] font-bold rounded-full">
                      Save 20%
                    </span>
                    <div className="text-xs font-bold text-[#261813]">Monthly Subscription</div>
                    <div className="font-headline text-base text-[#953c27] font-semibold mt-1">
                      ${activeProduct.subscriptionPrice}
                    </div>
                    <div className="text-[10px] text-[#89726d]">Auto lunar refill • Cancel anytime</div>
                  </div>
                </div>
              </div>

              {/* Add to Basket Action */}
              <div className="pt-3">
                <button
                  onClick={handleModalAdd}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#953c27] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:bg-[#b4533c] transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    Add to Basket • ${isSubscribeSelected ? activeProduct.subscriptionPrice : activeProduct.price}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
