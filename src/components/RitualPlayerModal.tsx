import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Flame,
  Check
} from 'lucide-react';
import { Ritual } from '../types/veda.ts';
import { soundService } from '../services/soundService.ts';

interface RitualPlayerModalProps {
  ritual: Ritual;
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export const RitualPlayerModal: React.FC<RitualPlayerModalProps> = ({
  ritual,
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const currentStep = ritual.steps[currentStepIdx];
  const [stepSecondsLeft, setStepSecondsLeft] = useState(currentStep.durationMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // When step changes, update remaining seconds
  useEffect(() => {
    setStepSecondsLeft(ritual.steps[currentStepIdx].durationMinutes * 60);
    soundService.playSingingBowl(432, 3);
  }, [currentStepIdx, ritual]);

  // Audio drone management
  useEffect(() => {
    if (isOpen && isRunning && !isMuted) {
      soundService.startShastraDrone();
    } else {
      soundService.stopShastraDrone();
    }
    return () => {
      soundService.stopShastraDrone();
    };
  }, [isOpen, isRunning, isMuted]);

  // Timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && stepSecondsLeft > 0) {
      interval = setInterval(() => {
        setStepSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (stepSecondsLeft === 0 && isRunning) {
      // Step complete
      soundService.playSingingBowl(528, 4);
      if (currentStepIdx < ritual.steps.length - 1) {
        setCurrentStepIdx((prev) => prev + 1);
      } else {
        setIsRunning(false);
        setIsFinished(true);
        if (onComplete) onComplete();
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, stepSecondsLeft, currentStepIdx, ritual.steps.length, onComplete]);

  if (!isOpen) return null;

  const formatMinSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalStepSec = currentStep.durationMinutes * 60;
  const progressPct = ((totalStepSec - stepSecondsLeft) / totalStepSec) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-3xl bg-[#fff8f6] border border-[#f7ddd3] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#ffe9e1] flex items-center justify-between bg-[#fff1ec]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#953c27] text-[22px]">
              spa
            </span>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#904d00] font-bold">
                Guided Pradosha Cadence
              </span>
              <h3 className="font-headline text-base font-semibold text-[#261813] line-clamp-1">
                {ritual.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (!isMuted) {
                  soundService.stopShastraDrone();
                  setIsMuted(true);
                } else {
                  setIsMuted(false);
                  if (isRunning) soundService.startShastraDrone();
                }
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#56423e] hover:bg-[#ffe9e1]"
              title={isMuted ? 'Unmute Drone' : 'Mute Ambient Drone'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#953c27]" />}
            </button>
            <button
              onClick={() => {
                soundService.stopShastraDrone();
                onClose();
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#56423e] hover:bg-[#ffe9e1]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isFinished ? (
          <div className="p-6 flex-1 overflow-y-auto flex flex-col items-center justify-between space-y-6">
            {/* Step Progress indicators */}
            <div className="w-full flex items-center justify-between gap-1.5">
              {ritual.steps.map((st, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1 cursor-pointer"
                  onClick={() => setCurrentStepIdx(i)}
                >
                  <div
                    className={`w-full h-1.5 rounded-full transition-all ${
                      i < currentStepIdx
                        ? 'bg-[#953c27]'
                        : i === currentStepIdx
                        ? 'bg-[#fe932c]'
                        : 'bg-[#f7ddd3]'
                    }`}
                  />
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-[#89726d]">
                    Part {i + 1}
                  </span>
                </div>
              ))}
            </div>

            {/* Circular Digital Timer */}
            <div className="relative w-48 h-48 rounded-full border-4 border-[#ffe9e1] flex flex-col items-center justify-center bg-gradient-to-br from-[#fff1ec] to-[#ffe9e1]/50 shadow-inner">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="90"
                  stroke="#fe932c"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={565}
                  strokeDashoffset={565 - (565 * progressPct) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>

              <span className="text-3xl font-bold font-mono text-[#261813] tracking-tight">
                {formatMinSec(stepSecondsLeft)}
              </span>
              <span className="text-[11px] text-[#904d00] font-semibold mt-0.5">
                Step {currentStepIdx + 1} of {ritual.steps.length}
              </span>
            </div>

            {/* Step Narrative & Instructions */}
            <div className="text-center max-w-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#953c27]">
                {currentStep.title}
              </span>
              <p className="text-xs sm:text-sm text-[#56423e] leading-relaxed">
                {currentStep.instruction}
              </p>
              {currentStep.mantra && (
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#ffe9e1] text-[#904d00] font-headline italic text-xs">
                    Mantra: {currentStep.mantra}
                  </span>
                </div>
              )}
            </div>

            {/* Play / Next / Prev Controls */}
            <div className="w-full flex items-center justify-center gap-4 pt-2">
              <button
                disabled={currentStepIdx === 0}
                onClick={() => setCurrentStepIdx((p) => Math.max(0, p - 1))}
                className="w-10 h-10 rounded-full border border-[#dcc0ba] flex items-center justify-center text-[#56423e] disabled:opacity-30 hover:bg-[#ffe9e1]"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsRunning(!isRunning)}
                className="px-6 py-3 rounded-2xl bg-[#953c27] text-white font-semibold text-xs flex items-center gap-2 shadow-md hover:bg-[#b4533c] active:scale-95 transition-all"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause Ritual</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Begin Step</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  if (currentStepIdx < ritual.steps.length - 1) {
                    setCurrentStepIdx((p) => p + 1);
                  } else {
                    setIsFinished(true);
                  }
                }}
                className="w-10 h-10 rounded-full border border-[#dcc0ba] flex items-center justify-center text-[#56423e] hover:bg-[#ffe9e1]"
                title="Next Step"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Finished Screen */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#fde3d9] text-[#953c27] mx-auto flex items-center justify-center shadow-md">
              <Check className="w-8 h-8" />
            </div>

            <h3 className="font-headline text-2xl text-[#261813]">
              Ritual Cadence Completed
            </h3>

            <p className="text-xs text-[#56423e] max-w-sm mx-auto leading-relaxed">
              Your Prana has settled. The Sandalwood paste and Ashwagandha adaptogens have pacified Vata restlessness. May your evening be steeped in silence.
            </p>

            <div className="p-3 rounded-2xl bg-[#fff1ec] border border-[#f7ddd3] text-xs text-[#904d00] font-semibold flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-[#fe932c]" />
              <span>+25 Ojas Vitality points added to your Sanctuary Profile</span>
            </div>

            <button
              onClick={() => {
                soundService.stopShastraDrone();
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-[#953c27] text-white text-xs font-semibold shadow hover:bg-[#b4533c]"
            >
              Seal and Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
