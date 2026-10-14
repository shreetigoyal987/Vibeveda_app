import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Sparkles, 
  Flame, 
  Wind, 
  Moon, 
  Sun,
  CheckCircle2
} from 'lucide-react';
import { soundService } from '../services/soundService.ts';

export const PracticesView: React.FC = () => {
  // Breath pacer state
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Stillness'>('Inhale');
  const [timer, setTimer] = useState(4);
  const [breathCount, setBreathCount] = useState(0);

  // Soundscape state
  const [activeSound, setActiveSound] = useState<string | null>(null);

  // Breath pacer cycle (Box Breathing / Sama Vritti: 4s - 4s - 4s - 4s)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isBreathing) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            // Transition phase
            if (phase === 'Inhale') {
              setPhase('Hold');
              soundService.playBreathCue(false);
              return 4;
            } else if (phase === 'Hold') {
              setPhase('Exhale');
              soundService.playBreathCue(false);
              return 4;
            } else if (phase === 'Exhale') {
              setPhase('Stillness');
              soundService.playBreathCue(false);
              return 4;
            } else {
              setPhase('Inhale');
              setBreathCount((c) => c + 1);
              soundService.playBreathCue(true);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreathing, phase]);

  const toggleSoundscape = (name: string, freq: number) => {
    if (activeSound === name) {
      soundService.stopShastraDrone();
      setActiveSound(null);
    } else {
      soundService.stopShastraDrone();
      soundService.playSingingBowl(freq, 4);
      soundService.startShastraDrone();
      setActiveSound(name);
    }
  };

  return (
    <div className="flex flex-col w-full pb-24 max-w-lg md:max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="pt-2 space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#904d00] bg-[#ffdcc3]/60 px-2.5 py-0.5 rounded-full">
          Sadhana &bull; Daily Disciplines
        </span>
        <h2 className="font-headline text-3xl font-normal text-[#261813]">
          Ayurvedic Guided Practices
        </h2>
        <p className="text-xs text-[#56423e] leading-relaxed max-w-lg">
          Cultivate Sattva (clarity) through classical rhythmic breath pacing, Marma therapy, and consecrated sound frequencies.
        </p>
      </div>

      {/* Interactive Breath Pacer (Pranayama) */}
      <div className="rounded-3xl bg-[#fff1ec] border border-[#f7ddd3] p-6 sm:p-8 flex flex-col items-center text-center shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffe9e1] text-[#953c27] text-xs font-semibold mb-4">
          <Wind className="w-3.5 h-3.5" />
          <span>Sama Vritti &bull; 4-Count Harmonizing Cadence</span>
        </div>

        {/* Breathing Ring */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center my-3">
          <div
            className={`absolute rounded-full bg-gradient-to-tr from-[#953c27]/20 to-[#fe932c]/20 transition-all duration-1000 ${
              isBreathing && phase === 'Inhale'
                ? 'w-44 h-44 sm:w-52 sm:h-52 scale-110 opacity-80'
                : isBreathing && phase === 'Exhale'
                ? 'w-24 h-24 sm:w-28 sm:h-28 scale-90 opacity-40'
                : 'w-36 h-36 opacity-60'
            }`}
          />

          <div className="relative z-10 w-36 h-36 rounded-full bg-[#fff8f6] border-2 border-[#ffe9e1] shadow-md flex flex-col items-center justify-center">
            <span className="text-xs uppercase font-bold tracking-widest text-[#904d00]">
              {isBreathing ? phase : 'Ready'}
            </span>
            <span className="font-headline text-4xl text-[#261813] font-medium mt-0.5">
              {isBreathing ? timer : '4s'}
            </span>
            <span className="text-[10px] text-[#89726d] mt-1 font-semibold">
              Cycle: {breathCount}
            </span>
          </div>
        </div>

        <p className="text-xs text-[#56423e] max-w-sm leading-relaxed mb-4">
          Inhale life force (Prana), hold in equanimity, exhale stagnant tension (Apana), and settle into stillness.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (!isBreathing) {
                soundService.playSingingBowl(528, 3);
                setPhase('Inhale');
                setTimer(4);
              }
              setIsBreathing(!isBreathing);
            }}
            className="px-6 py-2.5 rounded-xl bg-[#953c27] text-white text-xs font-semibold shadow hover:bg-[#b4533c] flex items-center gap-2"
          >
            {isBreathing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isBreathing ? 'Pause Pacing' : 'Begin Pranayama'}</span>
          </button>

          <button
            onClick={() => {
              setIsBreathing(false);
              setPhase('Inhale');
              setTimer(4);
              setBreathCount(0);
            }}
            className="w-9 h-9 rounded-xl border border-[#dcc0ba] flex items-center justify-center text-[#56423e] hover:bg-[#ffe9e1]"
            title="Reset Pacer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Consecrated Soundscapes */}
      <div className="space-y-4">
        <h3 className="font-headline text-xl text-[#261813]">
          Classical Meditative Resonances
        </h3>
        <p className="text-xs text-[#56423e]">
          Synthesized harmonic frequencies tuned to sacred healing ratios. Tap any resonance to bathe your space.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { name: '432Hz Sacred Tanpura Drone', freq: 432, desc: 'Aligns heart frequency and dissolves mental chatter.' },
            { name: '528Hz Solfeggio Ojas Tone', freq: 528, desc: 'Promotes cellular DNA repair and biological vitality.' },
            { name: '108Hz Grounding Root Tone', freq: 108, desc: 'Deeply anchors restless Vata into earth tranquility.' },
          ].map((snd) => (
            <div
              key={snd.name}
              onClick={() => toggleSoundscape(snd.name, snd.freq)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                activeSound === snd.name
                  ? 'bg-[#ffe9e1] border-[#953c27] shadow-sm'
                  : 'bg-[#fff1ec] border-[#f7ddd3] hover:border-[#dcc0ba]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[#953c27] mb-1">
                  <Volume2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {activeSound === snd.name ? 'Playing' : 'Idle'}
                  </span>
                </div>
                <h4 className="font-headline text-sm font-semibold text-[#261813]">
                  {snd.name}
                </h4>
                <p className="text-[11px] text-[#56423e] mt-1 leading-snug">
                  {snd.desc}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-[#f7ddd3] flex justify-end">
                <span className="text-xs font-semibold text-[#904d00]">
                  {activeSound === snd.name ? 'Tap to silence' : 'Listen now'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
