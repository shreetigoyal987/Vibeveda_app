import React from 'react';
import { 
  X, 
  Sparkles, 
  Sun, 
  Clock, 
  Moon, 
  Flame, 
  CheckCircle2, 
  ArrowRight,
  ShoppingBag,
  Play
} from 'lucide-react';
import { TabType } from './Navigation.tsx';
import { soundService } from '../services/soundService.ts';

interface WellnessPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: TabType) => void;
}

export const WellnessPlanModal: React.FC<WellnessPlanModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const planPhases = [
    {
      period: 'Brahma Muhurta & Morning (6:00 AM – 8:00 AM)',
      icon: 'sunny',
      title: 'Ignite Agni & Awaken Prana',
      actions: [
        'Ushapan: Drink 1 glass of warm copper-steeped water',
        'Practice 20-min Morning Prana Awakening Yoga flow',
        'Stir 1 scoop of VibeVeda Powder into warm plant milk for sustained focus',
      ],
      tag: 'Morning Ritual',
    },
    {
      period: 'Madhyahna / Midday (12:00 PM – 2:00 PM)',
      icon: 'light_mode',
      title: 'Peak Digestion & Work Focus',
      actions: [
        'Main balanced meal of the day when solar Agni is highest',
        'Avoid iced drinks that douse digestive fire',
        '5-minute mindful walking pause without looking at screens',
      ],
      tag: 'Agni Nourishment',
    },
    {
      period: 'Aparahna / Afternoon (4:00 PM – 5:30 PM)',
      icon: 'wb_twilight',
      title: 'Desk Tension Release & Vitality Reset',
      actions: [
        '15-minute Desk Worker Neck & Shoulder Relief stretch',
        'Cup of caffeine-free Kashmiri Saffron & Cardamom tea',
        'Sama Vritti 4-count harmonizing breathing cycle',
      ],
      tag: 'Midday Reset',
    },
    {
      period: 'Sandhya & Ratri / Evening (8:00 PM – 10:00 PM)',
      icon: 'nights_stay',
      title: 'Pradosha Wind-Down & Deep REM Rest',
      actions: [
        'Light sunset meal at least 2.5 hours before sleeping',
        'Warm 4 drops of VibeVeda Calming Oil and gently massage crown & temples',
        'Read or listen to sacred Tanpura drone, transition into restorative sleep by 10:30 PM',
      ],
      tag: 'Nidra Sanctuary',
    },
  ];

  const handleAdopt = () => {
    soundService.playSingingBowl(528, 4.0);
    soundService.triggerVibration([180, 80, 180]);
    onClose();
    onNavigate('vitals');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-[#fff8f6] rounded-3xl border border-[#f7ddd3] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#ffe9e1] bg-[#234735] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[22px]">person_search</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                Ayurvedic Dinacharya Blueprint
              </span>
              <h3 className="font-headline text-lg sm:text-xl font-bold text-white">
                Your Personalized 24-Hour Wellness Plan
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 bg-[#fff8f6]">
          <div className="space-y-1">
            <h4 className="font-headline text-xl text-[#261813]">
              Synchronize Your Biological Circadian Rhythm
            </h4>
            <p className="text-xs text-[#56423e] leading-relaxed">
              Based on classical Ayurvedic chronobiology, this daily schedule protects your natural Ojas vitality, neutralizes screen fatigue, and harmonizes digestive fire.
            </p>
          </div>

          {/* 4 Phases Timeline */}
          <div className="space-y-4">
            {planPhases.map((phase, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#fff1ec] border border-[#f7ddd3] space-y-2.5 shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#953c27]">
                    <span className="material-symbols-outlined text-[20px]">{phase.icon}</span>
                    <span className="text-xs font-bold text-[#261813]">{phase.period}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-[#904d00] border border-[#dcc0ba]">
                    {phase.tag}
                  </span>
                </div>

                <div className="font-headline text-base font-semibold text-[#261813]">
                  {phase.title}
                </div>

                <ul className="space-y-1.5 pt-1">
                  {phase.actions.map((act, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-2 text-xs text-[#56423e]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2e5b44] shrink-0 mt-0.5" />
                      <span className="leading-snug">{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="p-4 rounded-2xl bg-[#ffe9e1] border border-[#f7ddd3] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-xs font-bold text-[#261813] block">Ready to live in harmony?</span>
              <span className="text-[11px] text-[#56423e]">Sync your daily biomarkers and track your Ojas progress.</span>
            </div>

            <button
              onClick={handleAdopt}
              className="px-5 py-2.5 rounded-xl bg-[#2e5b44] hover:bg-[#234735] text-white text-xs font-semibold shadow flex items-center gap-1.5 active:scale-95 transition-all shrink-0"
            >
              <span>Adopt Plan &amp; Log Vitals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
