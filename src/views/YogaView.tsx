import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Clock, 
  Users, 
  Flame, 
  CheckCircle2, 
  Sparkles,
  Volume2,
  VolumeX,
  Volume1,
  Zap,
  Sliders,
  Smartphone,
  SlidersHorizontal,
  Check,
  Plus,
  Minus
} from 'lucide-react';
import { YOGA_SESSIONS } from '../data/mockData.ts';
import { YogaSession } from '../types/veda.ts';
import { soundService, AmbientPreset } from '../services/soundService.ts';

interface YogaViewProps {
  onSessionComplete?: (minutes: number) => void;
}

export const YogaView: React.FC<YogaViewProps> = ({ onSessionComplete }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSession, setActiveSession] = useState<YogaSession | null>(null);

  // Player state
  const [currentPoseIdx, setCurrentPoseIdx] = useState(0);
  const [poseSecondsLeft, setPoseSecondsLeft] = useState(0);
  const [initialPoseSeconds, setInitialPoseSeconds] = useState(180);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Ambient sound controls
  const [isAmbientOn, setIsAmbientOn] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState<AmbientPreset>('tanpura');
  const [volume, setVolume] = useState<number>(0.65);
  const [showAudioControls, setShowAudioControls] = useState(false);

  // Vibration / Haptic feedback state
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(true);
  const [hapticFired, setHapticFired] = useState(false);

  const categories = ['All', 'Morning Flow', 'Desk Relief', 'Restorative Yin', 'Breathwork & Nidra'];

  const filteredSessions = YOGA_SESSIONS.filter(
    (s) => selectedCategory === 'All' || s.category === selectedCategory
  );

  const launchSession = (session: YogaSession) => {
    setActiveSession(session);
    setCurrentPoseIdx(0);
    const firstDuration = session.poses[0]?.durationSeconds || 180;
    setInitialPoseSeconds(firstDuration);
    setPoseSecondsLeft(firstDuration);
    setIsRunning(true);
    setIsFinished(false);

    // Start ambient audio track if enabled
    if (isAmbientOn) {
      soundService.setVolume(volume);
      soundService.startAmbientTrack(selectedPreset);
    }
    soundService.playSingingBowl(528, 3.5);
  };

  const closePlayer = () => {
    soundService.stopAmbientTrack();
    setActiveSession(null);
    setIsRunning(false);
  };

  // Manage ambient sound when toggle or preset changes
  useEffect(() => {
    if (activeSession && isRunning) {
      soundService.setVolume(volume);
      if (isAmbientOn) {
        soundService.startAmbientTrack(selectedPreset);
      } else {
        soundService.stopAmbientTrack();
      }
    }
  }, [isAmbientOn, selectedPreset, activeSession, isRunning]);

  // Sync volume adjustments live
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundService.setVolume(newVol);
  };

  // Trigger completion haptics and audio bell
  const triggerPoseTransition = () => {
    // 1. Play harmonic transition bell
    soundService.playPoseTransitionBell();

    // 2. Trigger hardware vibration if enabled
    if (isVibrationEnabled) {
      soundService.triggerVibration([220, 90, 220, 90, 320]);
    }

    // 3. Trigger visual haptic ripple
    setHapticFired(true);
    setTimeout(() => setHapticFired(false), 2200);
  };

  // Timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && poseSecondsLeft > 0) {
      interval = setInterval(() => {
        setPoseSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (poseSecondsLeft === 0 && isRunning && activeSession) {
      // Pose Finished -> Trigger Vibration & Bell!
      triggerPoseTransition();

      if (currentPoseIdx < activeSession.poses.length - 1) {
        const nextIdx = currentPoseIdx + 1;
        setCurrentPoseIdx(nextIdx);
        const nextSec = activeSession.poses[nextIdx].durationSeconds;
        setInitialPoseSeconds(nextSec);
        setPoseSecondsLeft(nextSec);
      } else {
        setIsRunning(false);
        setIsFinished(true);
        soundService.stopAmbientTrack();
        if (onSessionComplete) onSessionComplete(activeSession.durationMinutes);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, poseSecondsLeft, currentPoseIdx, activeSession, isVibrationEnabled, onSessionComplete]);

  const currentPose = activeSession?.poses[currentPoseIdx];

  const formatMinSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Quick time adjustments
  const adjustTime = (deltaSec: number) => {
    setPoseSecondsLeft((prev) => Math.max(5, prev + deltaSec));
  };

  const progressPercent = initialPoseSeconds > 0
    ? ((initialPoseSeconds - poseSecondsLeft) / initialPoseSeconds) * 100
    : 0;

  return (
    <div className="flex flex-col w-full pb-24 max-w-lg md:max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Header Banner */}
      <div className="pt-2 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#904d00] bg-[#ffdcc3]/70 px-2.5 py-0.5 rounded-full">
            Live &amp; Recorded Sessions
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            All Levels Welcome
          </span>
        </div>

        <h2 className="font-headline text-3xl sm:text-4xl font-normal text-[#261813]">
          Yoga &amp; Meditation Studio
        </h2>
        <p className="text-xs sm:text-sm text-[#56423e] max-w-2xl leading-relaxed">
          Guided Vinyasa flows, somatic desk relief, restorative yin, and Kundalini breathwork with synchronized ambient soundscapes and haptic vibration feedback.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
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

      {/* Yoga Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSessions.map((session) => (
          <div
            key={session.id}
            className="rounded-3xl bg-[#fff1ec] border border-[#f7ddd3] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={session.thumbnail}
                  alt={session.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#fff8f6]/95 text-[#904d00] text-[10px] font-bold uppercase tracking-wider shadow-xs">
                  {session.category}
                </div>
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#261813]/85 text-[#ffdcc3] text-[11px] font-semibold flex items-center gap-1 backdrop-blur-sm">
                  <Clock className="w-3.5 h-3.5 text-[#fe932c]" />
                  <span>{session.durationMinutes} min</span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="italic text-[#904d00] font-headline">
                    {session.sanskritTitle}
                  </span>
                  <div className="flex items-center gap-1 text-[#56423e]">
                    <Users className="w-3.5 h-3.5 text-[#89726d]" />
                    <span>{session.enrolledCount} practitioners</span>
                  </div>
                </div>

                <h3 className="font-headline text-xl font-medium text-[#261813] leading-snug">
                  {session.title}
                </h3>

                <p className="text-xs text-[#56423e] leading-relaxed">
                  {session.description}
                </p>

                {/* Poses Preview */}
                <div className="pt-2 border-t border-[#f7ddd3] space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#904d00]">
                    <span>Included Flow Poses ({session.poses.length})</span>
                    <span className="text-[#2e5b44] flex items-center gap-1">
                      <Smartphone className="w-3 h-3" /> Haptic Guided
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {session.poses.map((p, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-white border border-[#dcc0ba] text-[11px] text-[#261813]"
                      >
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Instructor & Launch Button */}
            <div className="p-5 pt-0">
              <div className="pt-3 border-t border-[#f7ddd3] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-[#261813]">{session.instructor}</div>
                  <div className="text-[10px] text-[#89726d]">{session.instructorRole}</div>
                </div>

                <button
                  onClick={() => launchSession(session)}
                  className="px-5 py-2.5 rounded-xl bg-[#953c27] text-white text-xs font-semibold shadow hover:bg-[#b4533c] active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Guided Practice</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Guided Yoga Player Modal */}
      {activeSession && currentPose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-[#fff8f6] border border-[#f7ddd3] shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
            {/* Top Bar with Audio & Haptic Controls */}
            <div className="p-4 sm:p-5 border-b border-[#ffe9e1] flex items-center justify-between bg-[#fff1ec]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#953c27] text-[22px]">
                  self_improvement
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#904d00] flex items-center gap-1">
                    Guided Flow Studio &bull; {activeSession.level}
                  </span>
                  <h3 className="font-headline text-base sm:text-lg font-semibold text-[#261813] line-clamp-1">
                    {activeSession.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Audio Controls Toggle Button */}
                <button
                  onClick={() => setShowAudioControls(!showAudioControls)}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all border ${
                    showAudioControls
                      ? 'bg-[#953c27] text-white border-[#953c27]'
                      : 'bg-white text-[#56423e] border-[#dcc0ba] hover:bg-[#ffe9e1]'
                  }`}
                  title="Toggle Ambient Audio Controls"
                >
                  {isAmbientOn ? (
                    <Volume2 className="w-4 h-4 text-[#fe932c]" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-[#89726d]" />
                  )}
                  <span className="hidden sm:inline">Ambient</span>
                </button>

                {/* Haptic Vibration Feedback Toggle */}
                <button
                  onClick={() => {
                    const next = !isVibrationEnabled;
                    setIsVibrationEnabled(next);
                    if (next) soundService.triggerVibration([100, 50, 100]);
                  }}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all border ${
                    isVibrationEnabled
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-white text-[#89726d] border-[#dcc0ba]'
                  }`}
                  title={isVibrationEnabled ? 'Vibration Feedback Active' : 'Vibration Feedback Muted'}
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="hidden sm:inline">Haptics</span>
                </button>

                {/* Close Button */}
                <button
                  onClick={closePlayer}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#56423e] hover:bg-[#ffe9e1]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Ambient Sound & Volume Controls Drawer */}
            {showAudioControls && (
              <div className="p-4 bg-[#ffe9e1]/80 border-b border-[#f7ddd3] space-y-3 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#904d00]">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Sacred Ambient Soundscape</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAmbientOn(!isAmbientOn)}
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold transition-colors ${
                        isAmbientOn
                          ? 'bg-[#2e5b44] text-white'
                          : 'bg-[#dcc0ba] text-[#56423e]'
                      }`}
                    >
                      {isAmbientOn ? 'Soundscape Active' : 'Muted'}
                    </button>
                  </div>
                </div>

                {/* Sound Presets */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'tanpura', label: '108Hz Tanpura', desc: 'Harmonic Indian Drone' },
                    { id: 'singing_bowl', label: '432Hz Bowls', desc: 'Resonant Tibetan Tone' },
                    { id: 'temple_chimes', label: 'Temple Chimes', desc: 'Pentatonic Wind Chimes' },
                    { id: 'forest_stream', label: 'Forest Rain', desc: 'Flowing Pink Noise' },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setSelectedPreset(preset.id as AmbientPreset);
                        setIsAmbientOn(true);
                      }}
                      className={`p-2 rounded-xl text-left border transition-all ${
                        selectedPreset === preset.id && isAmbientOn
                          ? 'bg-white border-[#953c27] shadow-xs'
                          : 'bg-[#fff1ec] border-[#dcc0ba] hover:bg-white'
                      }`}
                    >
                      <div className="text-xs font-bold text-[#261813] truncate">{preset.label}</div>
                      <div className="text-[10px] text-[#89726d] truncate">{preset.desc}</div>
                    </button>
                  ))}
                </div>

                {/* Volume Slider */}
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-xs text-[#56423e] flex items-center gap-1">
                    {volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#953c27]" />}
                    <span>Volume</span>
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="flex-1 accent-[#953c27]"
                  />
                  <span className="text-xs font-mono font-bold text-[#261813] w-10 text-right">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
              </div>
            )}

            {/* Haptic Fired Visual Alert Badge */}
            {hapticFired && (
              <div className="bg-[#2e5b44] text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 animate-bounce shadow-md">
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Pose Completed! Haptic Vibration &amp; Sacred Transition Bell Triggered</span>
              </div>
            )}

            {!isFinished ? (
              <div className="p-6 overflow-y-auto flex flex-col items-center justify-between space-y-6">
                {/* Pose Milestones Tracker */}
                <div className="w-full space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[#56423e] px-1 font-semibold">
                    <span>Flow Sequence</span>
                    <span className="text-[#953c27]">
                      Pose {currentPoseIdx + 1} of {activeSession.poses.length}
                    </span>
                  </div>
                  <div className="w-full flex items-center gap-1">
                    {activeSession.poses.map((p, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setCurrentPoseIdx(idx);
                          setInitialPoseSeconds(activeSession.poses[idx].durationSeconds);
                          setPoseSecondsLeft(activeSession.poses[idx].durationSeconds);
                          triggerPoseTransition();
                        }}
                        className={`flex-1 h-2 rounded-full cursor-pointer transition-all ${
                          idx < currentPoseIdx
                            ? 'bg-[#2e5b44]'
                            : idx === currentPoseIdx
                            ? 'bg-[#fe932c] ring-2 ring-offset-1 ring-[#fe932c]'
                            : 'bg-[#f7ddd3]'
                        }`}
                        title={`${idx + 1}. ${p.name}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Circular Pose Timer with SVG Progress */}
                <div className="relative w-52 h-52 rounded-full border-4 border-[#ffe9e1] flex flex-col items-center justify-center bg-gradient-to-br from-[#fff1ec] to-[#ffe9e1]/70 shadow-inner">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="104"
                      cy="104"
                      r="98"
                      stroke="#fe932c"
                      strokeWidth="7"
                      fill="none"
                      strokeDasharray={615}
                      strokeDashoffset={615 - (615 * progressPercent) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                  </svg>

                  <span className="text-4xl font-extrabold font-mono text-[#261813] tracking-tight">
                    {formatMinSec(poseSecondsLeft)}
                  </span>
                  <span className="text-[11px] font-semibold text-[#904d00] mt-1">
                    Remaining in Pose
                  </span>

                  {/* Time Adjustment Micro-buttons */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => adjustTime(-15)}
                      className="w-6 h-6 rounded-full bg-white border border-[#dcc0ba] text-[#56423e] flex items-center justify-center hover:bg-[#ffe9e1] text-[10px]"
                      title="-15 seconds"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-[10px] font-semibold text-[#89726d]">Adjust</span>
                    <button
                      onClick={() => adjustTime(30)}
                      className="w-6 h-6 rounded-full bg-white border border-[#dcc0ba] text-[#56423e] flex items-center justify-center hover:bg-[#ffe9e1] text-[10px]"
                      title="+30 seconds"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Current Pose Dossier */}
                <div className="text-center max-w-md space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdcc3] text-[#904d00] text-xs font-bold">
                    <Zap className="w-3 h-3" />
                    <span>Focus Area: {currentPose.focusArea}</span>
                  </div>

                  <h4 className="font-headline text-2xl sm:text-3xl text-[#261813] font-medium">
                    {currentPose.name}
                  </h4>

                  <span className="text-xs italic text-[#904d00] block">
                    Classical Sanskrit: {currentPose.sanskritName}
                  </span>

                  <p className="text-xs sm:text-sm text-[#56423e] leading-relaxed pt-1 font-body">
                    {currentPose.instruction}
                  </p>
                </div>

                {/* Controls Bar */}
                <div className="w-full flex items-center justify-center gap-4 pt-2">
                  <button
                    disabled={currentPoseIdx === 0}
                    onClick={() => {
                      const prevIdx = currentPoseIdx - 1;
                      setCurrentPoseIdx(prevIdx);
                      const sec = activeSession.poses[prevIdx].durationSeconds;
                      setInitialPoseSeconds(sec);
                      setPoseSecondsLeft(sec);
                      triggerPoseTransition();
                    }}
                    className="w-11 h-11 rounded-2xl border border-[#dcc0ba] flex items-center justify-center text-[#56423e] disabled:opacity-30 hover:bg-[#ffe9e1] transition-colors"
                    title="Previous Pose"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="px-7 py-3.5 rounded-2xl bg-[#953c27] text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:bg-[#b4533c] active:scale-95 transition-all"
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-4 h-4" /> <span>Pause Flow</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" /> <span>Resume Flow</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      triggerPoseTransition();
                      if (currentPoseIdx < activeSession.poses.length - 1) {
                        const nextIdx = currentPoseIdx + 1;
                        setCurrentPoseIdx(nextIdx);
                        const sec = activeSession.poses[nextIdx].durationSeconds;
                        setInitialPoseSeconds(sec);
                        setPoseSecondsLeft(sec);
                      } else {
                        setIsFinished(true);
                      }
                    }}
                    className="w-11 h-11 rounded-2xl border border-[#dcc0ba] flex items-center justify-center text-[#56423e] hover:bg-[#ffe9e1] transition-colors"
                    title="Next Pose (triggers vibration)"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Haptic & Audio status chip */}
                <div className="text-[11px] text-[#89726d] flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-[#2e5b44]" />
                    <span>Haptic cues: {isVibrationEnabled ? 'Active' : 'Muted'}</span>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-[#953c27]" />
                    <span>Ambient: {isAmbientOn ? selectedPreset.replace('_', ' ') : 'Off'}</span>
                  </span>
                </div>
              </div>
            ) : (
              /* Session Completed Screen */
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#fde3d9] text-[#953c27] mx-auto flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <h3 className="font-headline text-2xl sm:text-3xl text-[#261813]">
                  Namaste &bull; Flow Completed
                </h3>

                <p className="text-xs sm:text-sm text-[#56423e] max-w-sm mx-auto leading-relaxed">
                  You have completed {activeSession.poses.length} guided poses over {activeSession.durationMinutes} mindful minutes. Your neurological tone is grounded and serene.
                </p>

                <div className="p-3.5 rounded-2xl bg-[#fff1ec] border border-[#f7ddd3] text-xs text-[#904d00] font-semibold flex items-center justify-center gap-2">
                  <Flame className="w-4 h-4 text-[#fe932c]" />
                  <span>+1 Daily Streak &bull; {activeSession.durationMinutes} Mindful Minutes Added</span>
                </div>

                <button
                  onClick={closePlayer}
                  className="w-full py-3.5 rounded-xl bg-[#953c27] text-white text-xs sm:text-sm font-semibold shadow hover:bg-[#b4533c] transition-all"
                >
                  Conclude &amp; Close Studio
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
