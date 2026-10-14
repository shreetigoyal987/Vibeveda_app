import React, { useState } from 'react';
import { X, Check, Sparkles, ShieldCheck, Heart, Crown } from 'lucide-react';

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMember: boolean;
  onUpgrade: () => void;
}

export const MembershipModal: React.FC<MembershipModalProps> = ({
  isOpen,
  onClose,
  isMember,
  onUpgrade,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [upgradedSuccess, setUpgradedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setUpgradedSuccess(true);
      onUpgrade();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-3xl bg-[#fff8f6] border border-[#f7ddd3] shadow-2xl overflow-hidden p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#56423e] hover:bg-[#ffe9e1]"
        >
          <X className="w-5 h-5" />
        </button>

        {!upgradedSuccess && !isMember ? (
          <div className="space-y-5">
            <div className="text-center space-y-1.5 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdcc3] text-[#904d00] text-[10px] font-bold tracking-widest uppercase">
                <Crown className="w-3.5 h-3.5" />
                <span>Sanctuary Circle Patronage</span>
              </div>
              <h2 className="font-headline text-2xl sm:text-3xl font-medium text-[#261813]">
                Enter The Inner Circle
              </h2>
              <p className="text-xs text-[#56423e] max-w-sm mx-auto leading-relaxed">
                Join our private patron community of dedicated Ayurvedic practitioners and botanical connoisseurs.
              </p>
            </div>

            {/* Toggle Monthly / Annual */}
            <div className="flex justify-center">
              <div className="p-1 rounded-2xl bg-[#ffe9e1] border border-[#f7ddd3] flex items-center gap-1 text-xs">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-1.5 rounded-xl font-semibold transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-white text-[#953c27] shadow-xs'
                      : 'text-[#56423e]'
                  }`}
                >
                  Monthly ($29/mo)
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1 ${
                    billingCycle === 'yearly'
                      ? 'bg-[#953c27] text-white shadow-xs'
                      : 'text-[#56423e]'
                  }`}
                >
                  <span>Annual ($240/yr)</span>
                  <span className="text-[10px] bg-[#fe932c] text-white px-1.5 py-0.2 rounded-full font-bold">
                    Save 32%
                  </span>
                </button>
              </div>
            </div>

            {/* Privileges List */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-[#fff1ec] border border-[#f7ddd3]">
              {[
                '20% permanent privilege on all apothecary elixirs & oils',
                'Complimentary seasonal Ojas discovery box delivered every equinox',
                'One quarterly 30-minute telehealth consultation with certified Vaidya',
                'Full access to all 108 classical Vedic Shastra soundscapes & audiobooks',
                'Priority reservations for limited lunar harvest batches',
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-[#261813]">
                  <Check className="w-4 h-4 text-[#953c27] shrink-0 mt-0.5" />
                  <span className="leading-snug">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Subscribe Action */}
            <button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-[#953c27] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-[#b4533c] disabled:opacity-50 transition-all"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Activating Circle Membership...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#ffdcc3]" />
                  <span>
                    Join Sanctuary Circle &bull;{' '}
                    {billingCycle === 'yearly' ? '$240 / Year' : '$29 / Month'}
                  </span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Active Member Dossier */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#fde3d9] text-[#953c27] mx-auto flex items-center justify-center">
              <Crown className="w-8 h-8 text-[#fe932c]" />
            </div>

            <h3 className="font-headline text-2xl text-[#261813]">
              Welcome, Sanctuary Circle Patron
            </h3>

            <p className="text-xs text-[#56423e] max-w-sm mx-auto leading-relaxed">
              Your patron tier is active. All prices across the Apothecary now reflect your automatic 20% privilege.
            </p>

            <div className="p-3 rounded-2xl bg-[#fff1ec] border border-[#f7ddd3] text-xs text-[#904d00] font-semibold">
              Member ID: VV-CIRCLE-8821 &bull; Active until Autumn 2027
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-[#953c27] text-white text-xs font-semibold shadow hover:bg-[#b4533c]"
            >
              Continue Exploring
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
