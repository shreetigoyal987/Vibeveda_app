import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, Volume2, Coffee, Flame } from 'lucide-react';

interface FocusTimerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionsCompleted, setSessionsCompleted] = useState<number>(0);

  const durationMap = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch {
      // Audio not permitted or supported in iframe
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playChime();
      if (mode === 'work') {
        setSessionsCompleted((prev) => prev + 1);
        setMode('shortBreak');
        setTimeLeft(durationMap.shortBreak);
      } else {
        setMode('work');
        setTimeLeft(durationMap.work);
      }
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft, mode]);

  const switchMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(durationMap[newMode]);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(durationMap[mode]);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((durationMap[mode] - timeLeft) / durationMap[mode]) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 w-80 rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/95 transition-all">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Focus Timer
          </span>
          <span className="rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-1.5 py-0.5">
            {sessionsCompleted} completed
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Mode selection buttons */}
      <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800/80">
        <button
          onClick={() => switchMode('work')}
          className={`rounded-lg py-1 text-xs font-medium transition-all ${
            mode === 'work'
              ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
          }`}
        >
          Work
        </button>
        <button
          onClick={() => switchMode('shortBreak')}
          className={`rounded-lg py-1 text-xs font-medium transition-all ${
            mode === 'shortBreak'
              ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
          }`}
        >
          Short
        </button>
        <button
          onClick={() => switchMode('longBreak')}
          className={`rounded-lg py-1 text-xs font-medium transition-all ${
            mode === 'longBreak'
              ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
          }`}
        >
          Long
        </button>
      </div>

      {/* Digital clock display & progress */}
      <div className="relative my-4 flex flex-col items-center justify-center">
        <div className="font-mono text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          {formatTime(timeLeft)}
        </div>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
          {mode === 'work' ? (
            <>
              <Flame className="h-3 w-3 text-orange-500 inline" /> Deep Focus Mode
            </>
          ) : (
            <>
              <Coffee className="h-3 w-3 text-emerald-500 inline" /> Relax & Recharge
            </>
          )}
        </p>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-bold text-white shadow-md transition-all ${
            isRunning
              ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="h-4 w-4" /> Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" /> Start
            </>
          )}
        </button>

        <button
          onClick={resetTimer}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-all"
          title="Reset Timer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
