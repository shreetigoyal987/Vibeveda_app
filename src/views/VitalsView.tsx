import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  Wind, 
  Droplet, 
  RotateCcw, 
  ArrowRight,
  Heart,
  Moon,
  Zap,
  Activity,
  PlusCircle,
  Calendar,
  Check,
  TrendingUp,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Dosha, DailyVitalsLog } from '../types/veda.ts';
import { INITIAL_VITALS_LOGS } from '../data/mockData.ts';

interface QuizQuestion {
  question: string;
  options: { label: string; dosha: 'Vata' | 'Pitta' | 'Kapha' }[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    question: 'How does your physical frame and body temperature feel most naturally?',
    options: [
      { label: 'Slender, tends toward cold hands/feet and dry skin', dosha: 'Vata' },
      { label: 'Medium, muscular athletic build, feels warm easily with flushed skin', dosha: 'Pitta' },
      { label: 'Solid, broad frame, steady endurance, smooth cool skin', dosha: 'Kapha' },
    ],
  },
  {
    question: 'How does your mind respond when unexpected stress strikes?',
    options: [
      { label: 'Racing thoughts, anxiety, feeling scattered or restless', dosha: 'Vata' },
      { label: 'Irritation, intense focus, impatience or passionate debate', dosha: 'Pitta' },
      { label: 'Withdrawal, resistance to change, quiet complacency', dosha: 'Kapha' },
    ],
  },
  {
    question: 'How is your daily digestive rhythm (Agni)?',
    options: [
      { label: 'Irregular — some days ravenous, other days forget to eat, prone to gas', dosha: 'Vata' },
      { label: 'Sharp and intense — must eat on time or becomes irritable', dosha: 'Pitta' },
      { label: 'Slow and steady — can easily skip meals without hunger spikes', dosha: 'Kapha' },
    ],
  },
  {
    question: 'What is your typical nocturnal sleep pattern?',
    options: [
      { label: 'Light, interrupted, often waking between 2:00 AM - 4:00 AM', dosha: 'Vata' },
      { label: 'Sound but short (6-7 hrs), vivid dreaming, wakes alert', dosha: 'Pitta' },
      { label: 'Heavy and prolonged (8-9+ hrs), difficult to rise in the dawn', dosha: 'Kapha' },
    ],
  },
];

// Custom Recharts Tooltip with VibeVeda Luxury Styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data: DailyVitalsLog = payload[0].payload;
    return (
      <div className="rounded-2xl bg-[#fff8f6] border border-[#f7ddd3] p-3 shadow-xl text-xs space-y-1.5 min-w-[190px]">
        <div className="flex items-center justify-between border-b border-[#ffe9e1] pb-1 font-bold text-[#261813]">
          <span>{data.dayLabel} &bull; {data.date}</span>
        </div>
        {payload.map((item: any) => (
          <div key={item.dataKey} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 font-medium" style={{ color: item.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}:
            </span>
            <span className="font-bold text-[#261813]">{item.value}/10</span>
          </div>
        ))}
        {data.notes && (
          <div className="pt-1.5 border-t border-[#ffe9e1] text-[10px] text-[#56423e] italic leading-tight">
            “{data.notes}”
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const VitalsView: React.FC = () => {
  // Dosha Quiz state
  const [answers, setAnswers] = useState<Record<number, 'Vata' | 'Pitta' | 'Kapha'>>({});
  const [calculatedDosha, setCalculatedDosha] = useState<Dosha | null>(null);
  const [scores, setScores] = useState({ vata: 40, pitta: 35, kapha: 25 });

  // 7-day Vitals logs state with localStorage persistence
  const [vitalsLogs, setVitalsLogs] = useState<DailyVitalsLog[]>(() => {
    try {
      const saved = localStorage.getItem('vibeveda_vitals_logs');
      return saved ? JSON.parse(saved) : INITIAL_VITALS_LOGS;
    } catch {
      return INITIAL_VITALS_LOGS;
    }
  });

  // Daily Logging Form state
  const [logDate, setLogDate] = useState('2026-10-14');
  const [sleepScore, setSleepScore] = useState<number>(9);
  const [energyScore, setEnergyScore] = useState<number>(9);
  const [digestionScore, setDigestionScore] = useState<number>(9);
  const [notes, setNotes] = useState<string>('');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Filter line toggles
  const [visibleLines, setVisibleLines] = useState({
    sleep: true,
    energy: true,
    digestion: true,
  });

  useEffect(() => {
    localStorage.setItem('vibeveda_vitals_logs', JSON.stringify(vitalsLogs));
  }, [vitalsLogs]);

  // Compute 7-day averages
  const last7Days = vitalsLogs.slice(-7);
  const avgSleep = (
    last7Days.reduce((acc, curr) => acc + curr.sleepQuality, 0) / (last7Days.length || 1)
  ).toFixed(1);
  const avgEnergy = (
    last7Days.reduce((acc, curr) => acc + curr.energyLevel, 0) / (last7Days.length || 1)
  ).toFixed(1);
  const avgDigestion = (
    last7Days.reduce((acc, curr) => acc + curr.digestion, 0) / (last7Days.length || 1)
  ).toFixed(1);

  // Overall Ojas index
  const ojasScore = Math.min(
    100,
    Math.round(((parseFloat(avgSleep) + parseFloat(avgEnergy) + parseFloat(avgDigestion)) / 30) * 100)
  );

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();

    const d = new Date(logDate);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const isToday = logDate === new Date().toISOString().split('T')[0];
    const dayLabel = isToday ? 'Today' : dayNames[d.getUTCDay()];

    const newLog: DailyVitalsLog = {
      date: logDate,
      dayLabel,
      sleepQuality: sleepScore,
      energyLevel: energyScore,
      digestion: digestionScore,
      notes: notes.trim() || undefined,
      loggedAt: Date.now(),
    };

    setVitalsLogs((prev) => {
      // If date already logged, update it; otherwise append
      const existingIdx = prev.findIndex((item) => item.date === logDate);
      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx] = newLog;
        return updated;
      }
      return [...prev, newLog];
    });

    setIsSavedNotice(true);
    setNotes('');
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleSelectOption = (qIdx: number, dosha: 'Vata' | 'Pitta' | 'Kapha') => {
    const updated = { ...answers, [qIdx]: dosha };
    setAnswers(updated);

    if (Object.keys(updated).length === QUESTIONS.length) {
      let vCount = 0;
      let pCount = 0;
      let kCount = 0;
      Object.values(updated).forEach((d) => {
        if (d === 'Vata') vCount++;
        if (d === 'Pitta') pCount++;
        if (d === 'Kapha') kCount++;
      });
      const total = QUESTIONS.length;
      setScores({
        vata: Math.round((vCount / total) * 100),
        pitta: Math.round((pCount / total) * 100),
        kapha: Math.round((kCount / total) * 100),
      });
      if (vCount >= pCount && vCount >= kCount) setCalculatedDosha('Vata');
      else if (pCount >= vCount && pCount >= kCount) setCalculatedDosha('Pitta');
      else setCalculatedDosha('Kapha');
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setCalculatedDosha(null);
  };

  // Helper description tags
  const getSleepLabel = (v: number) => {
    if (v <= 3) return 'Restless & Broken';
    if (v <= 6) return 'Fair (Interrupted)';
    if (v <= 8) return 'Deep & Refreshing';
    return 'Sattvic Regenerative';
  };

  const getEnergyLabel = (v: number) => {
    if (v <= 3) return 'Low / Sluggish';
    if (v <= 6) return 'Fluctuating / Midday Dip';
    if (v <= 8) return 'Steady & Sustained';
    return 'Peak Ojas Vitality';
  };

  const getDigestionLabel = (v: number) => {
    if (v <= 3) return 'Manda (Heavy / Bloated)';
    if (v <= 6) return 'Visham (Irregular / Gas)';
    if (v <= 8) return 'Tikshna (Fast / Acidic)';
    return 'Sama Agni (Harmonious)';
  };

  return (
    <div className="flex flex-col w-full pb-24 max-w-lg md:max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
      {/* Toast Alert */}
      {isSavedNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#261813] text-[#ffede7] text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Daily Biomarkers saved! 7-day chart updated.</span>
        </div>
      )}

      {/* Header */}
      <div className="pt-2 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#904d00] bg-[#ffdcc3]/70 px-2.5 py-0.5 rounded-full">
            Ayurvedic Bio-Telemetry
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2e5b44] bg-emerald-100 px-2.5 py-0.5 rounded-full">
            7-Day Clinical Trends
          </span>
        </div>
        <h2 className="font-headline text-3xl sm:text-4xl font-normal text-[#261813]">
          Vitals &amp; Biological Equilibrium
        </h2>
        <p className="text-xs sm:text-sm text-[#56423e] leading-relaxed max-w-2xl">
          Track the foundational triad of Ayurvedic longevity: <strong>Nidra</strong> (Sleep Quality), <strong>Prana</strong> (Vital Energy), and <strong>Agni</strong> (Metabolic Digestion).
        </p>
      </div>

      {/* 7-Day Trend Chart & Summary Cards */}
      <section className="p-6 rounded-3xl bg-[#fff1ec] border border-[#f7ddd3] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#904d00] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>7-Day Longitudinal Trend</span>
            </span>
            <h3 className="font-headline text-xl sm:text-2xl text-[#261813] mt-0.5">
              Sleep, Energy &amp; Agni Digestion
            </h3>
          </div>

          {/* Metric Filter Toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setVisibleLines((p) => ({ ...p, sleep: !p.sleep }))}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                visibleLines.sleep
                  ? 'bg-[#953c27] text-white border-[#953c27]'
                  : 'bg-white text-[#89726d] border-[#dcc0ba]'
              }`}
            >
              <Moon className="w-3 h-3" />
              <span>Sleep</span>
            </button>

            <button
              onClick={() => setVisibleLines((p) => ({ ...p, energy: !p.energy }))}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                visibleLines.energy
                  ? 'bg-[#fe932c] text-white border-[#fe932c]'
                  : 'bg-white text-[#89726d] border-[#dcc0ba]'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>Energy</span>
            </button>

            <button
              onClick={() => setVisibleLines((p) => ({ ...p, digestion: !p.digestion }))}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                visibleLines.digestion
                  ? 'bg-[#2e5b44] text-white border-[#2e5b44]'
                  : 'bg-white text-[#89726d] border-[#dcc0ba]'
              }`}
            >
              <Flame className="w-3 h-3" />
              <span>Agni Digestion</span>
            </button>
          </div>
        </div>

        {/* 7-Day Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-white border border-[#f7ddd3] shadow-2xs">
            <div className="flex items-center justify-between text-[#953c27]">
              <span className="text-[10px] font-bold uppercase tracking-wider">Sleep Quality</span>
              <Moon className="w-3.5 h-3.5" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-headline text-2xl font-bold text-[#261813]">{avgSleep}</span>
              <span className="text-[10px] text-[#89726d]">/10 avg</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium block mt-0.5">
              +14% vs last week
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#f7ddd3] shadow-2xs">
            <div className="flex items-center justify-between text-[#fe932c]">
              <span className="text-[10px] font-bold uppercase tracking-wider">Energy Levels</span>
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-headline text-2xl font-bold text-[#261813]">{avgEnergy}</span>
              <span className="text-[10px] text-[#89726d]">/10 avg</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium block mt-0.5">
              Sustained Ojas
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#f7ddd3] shadow-2xs">
            <div className="flex items-center justify-between text-[#2e5b44]">
              <span className="text-[10px] font-bold uppercase tracking-wider">Agni Digestion</span>
              <Flame className="w-3.5 h-3.5" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-headline text-2xl font-bold text-[#261813]">{avgDigestion}</span>
              <span className="text-[10px] text-[#89726d]">/10 avg</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium block mt-0.5">
              Sama Agni equilibrium
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#ffe9e1] border border-[#f7ddd3] shadow-2xs">
            <div className="flex items-center justify-between text-[#904d00]">
              <span className="text-[10px] font-bold uppercase tracking-wider">Ojas Score</span>
              <Sparkles className="w-3.5 h-3.5 text-[#fe932c]" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-headline text-2xl font-bold text-[#953c27]">{ojasScore}</span>
              <span className="text-[10px] text-[#904d00]">/100</span>
            </div>
            <span className="text-[10px] text-[#904d00] font-semibold block mt-0.5">
              Optimal Sattvic Health
            </span>
          </div>
        </div>

        {/* Recharts Line Chart Container */}
        <div className="w-full h-72 sm:h-80 pt-2 bg-white/70 rounded-2xl p-3 border border-[#f7ddd3]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last7Days} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f7ddd3" vertical={false} />
              <XAxis 
                dataKey="dayLabel" 
                stroke="#89726d" 
                fontSize={12} 
                tickLine={false} 
                axisLine={{ stroke: '#f7ddd3' }} 
              />
              <YAxis 
                domain={[0, 10]} 
                ticks={[2, 4, 6, 8, 10]} 
                stroke="#89726d" 
                fontSize={12} 
                tickLine={false} 
                axisLine={{ stroke: '#f7ddd3' }} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={36} 
                formatter={(value: string) => (
                  <span className="text-xs font-semibold text-[#56423e]">{value}</span>
                )}
              />

              {visibleLines.sleep && (
                <Line
                  type="monotone"
                  dataKey="sleepQuality"
                  name="Sleep Quality"
                  stroke="#953c27"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#953c27', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, stroke: '#953c27', strokeWidth: 2 }}
                />
              )}

              {visibleLines.energy && (
                <Line
                  type="monotone"
                  dataKey="energyLevel"
                  name="Energy Levels"
                  stroke="#fe932c"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#fe932c', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, stroke: '#fe932c', strokeWidth: 2 }}
                />
              )}

              {visibleLines.digestion && (
                <Line
                  type="monotone"
                  dataKey="digestion"
                  name="Digestion (Agni)"
                  stroke="#2e5b44"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#2e5b44', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, stroke: '#2e5b44', strokeWidth: 2 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Daily Logging Form */}
      <section className="p-6 rounded-3xl bg-[#ffe9e1] border border-[#f7ddd3] shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-[#f7ddd3] pb-3">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#953c27]" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#904d00]">
                Daily Journal Entry
              </span>
              <h3 className="font-headline text-xl text-[#261813]">
                Log Today's Sleep, Energy &amp; Digestion
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#89726d]" />
            <input
              type="date"
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
              className="px-2.5 py-1 text-xs bg-white rounded-xl border border-[#dcc0ba] text-[#261813] outline-none"
            />
          </div>
        </div>

        <form onSubmit={handleSaveLog} className="space-y-6">
          {/* 1. Sleep Quality Slider */}
          <div className="p-4 rounded-2xl bg-white border border-[#dcc0ba] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-[#953c27]" />
                <span className="text-xs font-bold text-[#261813]">1. Sleep Quality (Nidra)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#953c27]">{sleepScore}/10</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ffe9e1] text-[#904d00] font-semibold">
                  {getSleepLabel(sleepScore)}
                </span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={sleepScore}
              onChange={(e) => setSleepScore(parseInt(e.target.value))}
              className="w-full accent-[#953c27]"
            />
            <div className="flex justify-between text-[10px] text-[#89726d]">
              <span>1 (Restless/Insomnia)</span>
              <span>5 (Moderate)</span>
              <span>10 (Deep REM Rejuvenation)</span>
            </div>
          </div>

          {/* 2. Energy Levels Slider */}
          <div className="p-4 rounded-2xl bg-white border border-[#dcc0ba] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#fe932c]" />
                <span className="text-xs font-bold text-[#261813]">2. Daytime Energy &amp; Focus (Prana)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#fe932c]">{energyScore}/10</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ffdcc3] text-[#904d00] font-semibold">
                  {getEnergyLabel(energyScore)}
                </span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={energyScore}
              onChange={(e) => setEnergyScore(parseInt(e.target.value))}
              className="w-full accent-[#fe932c]"
            />
            <div className="flex justify-between text-[10px] text-[#89726d]">
              <span>1 (Exhausted/Burnout)</span>
              <span>5 (Midday Slump)</span>
              <span>10 (Vibrant Ojas Stamina)</span>
            </div>
          </div>

          {/* 3. Digestion / Agni Slider */}
          <div className="p-4 rounded-2xl bg-white border border-[#dcc0ba] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#2e5b44]" />
                <span className="text-xs font-bold text-[#261813]">3. Digestive Agni Harmony</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#2e5b44]">{digestionScore}/10</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                  {getDigestionLabel(digestionScore)}
                </span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={digestionScore}
              onChange={(e) => setDigestionScore(parseInt(e.target.value))}
              className="w-full accent-[#2e5b44]"
            />
            <div className="flex justify-between text-[10px] text-[#89726d]">
              <span>1 (Sluggish/Bloated)</span>
              <span>5 (Acidic/Gas)</span>
              <span>10 (Sama Agni / Effortless)</span>
            </div>
          </div>

          {/* Qualitative Notes */}
          <div>
            <label className="text-[11px] font-semibold text-[#56423e] block mb-1">
              Holistic Journal Reflection (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Took VibeVeda oil before bed, practiced Desk Relief yoga, light dinner..."
              className="w-full px-4 py-2.5 text-xs bg-white rounded-xl border border-[#dcc0ba] text-[#261813] placeholder-[#89726d] outline-none focus:border-[#953c27]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#953c27] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:bg-[#b4533c] active:scale-98 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Record Today's Ayurvedic Biomarkers</span>
          </button>
        </form>
      </section>

      {/* Classical Prakriti Diagnostic Quiz Section */}
      <section className="p-6 rounded-3xl bg-[#fff1ec] border border-[#f7ddd3] shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#953c27]">
              Classical Assessment
            </span>
            <h3 className="font-headline text-xl text-[#261813]">
              Diagnostic Prakriti Calculator
            </h3>
          </div>
          {calculatedDosha && (
            <button
              onClick={resetQuiz}
              className="text-xs text-[#953c27] flex items-center gap-1 font-semibold hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake</span>
            </button>
          )}
        </div>

        {/* Questions list */}
        <div className="space-y-4">
          {QUESTIONS.map((q, idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="text-xs font-semibold text-[#261813]">
                {idx + 1}. {q.question}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {q.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(idx, opt.dosha)}
                    className={`p-3 rounded-2xl text-left text-xs transition-all border ${
                      answers[idx] === opt.dosha
                        ? 'border-[#953c27] bg-[#953c27] text-white shadow-xs font-semibold'
                        : 'border-[#dcc0ba] bg-white text-[#56423e] hover:border-[#953c27]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Result dossier */}
        {calculatedDosha && (
          <div className="p-5 rounded-2xl bg-white border border-[#953c27] shadow-sm space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#fe932c]" />
                <span className="font-headline text-xl font-medium text-[#261813]">
                  Your Dominant Dosha: {calculatedDosha}
                </span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#ffdcc3] text-[#904d00] font-bold">
                {scores[calculatedDosha.toLowerCase() as 'vata' | 'pitta' | 'kapha']}% Dominance
              </span>
            </div>

            {/* Dosha breakdown bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-[#56423e]">
                <span>Vata ({scores.vata}%)</span>
                <span>Pitta ({scores.pitta}%)</span>
                <span>Kapha ({scores.kapha}%)</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden flex bg-[#f7ddd3]">
                <div style={{ width: `${scores.vata}%` }} className="bg-[#fe932c]" />
                <div style={{ width: `${scores.pitta}%` }} className="bg-[#953c27]" />
                <div style={{ width: `${scores.kapha}%` }} className="bg-[#2e5b44]" />
              </div>
            </div>

            <p className="text-xs text-[#56423e] leading-relaxed pt-1">
              {calculatedDosha === 'Vata' &&
                'Your constitution is governed by Space and Air. Pacify cold and lightness with warm VibeVeda Calming Oil, Brahmi Taila, grounding root decoctions, and consistent sleep schedules.'}
              {calculatedDosha === 'Pitta' &&
                'Your constitution is governed by Fire and Water. Dispel excess metabolic heat with cold-pressed Sandalwood paste, sweet Kashmiri Saffron tisanes, and cooling moonlit walks.'}
              {calculatedDosha === 'Kapha' &&
                'Your constitution is governed by Earth and Water. Invigorate sluggish Agni fire with VibeVeda Focus Powder, warm ginger infusions, and Morning Prana Vinyasa yoga flows.'}
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
