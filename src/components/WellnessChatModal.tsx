import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ShoppingBag, 
  Calendar, 
  ArrowRight,
  MessageCircle,
  HelpCircle,
  Check
} from 'lucide-react';
import { TabType } from './Navigation.tsx';
import { PRODUCTS, SPA_SESSIONS } from '../data/mockData.ts';
import { ApothecaryProduct } from '../types/veda.ts';

interface WellnessChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: TabType) => void;
  onAddToCart: (product: ApothecaryProduct) => void;
}

interface ChatMessage {
  id: string;
  sender: 'vaidya' | 'user';
  text: string;
  timestamp: string;
  action?: {
    type: 'product' | 'spa' | 'yoga' | 'vitals';
    label: string;
    targetId?: string;
  };
}

const FAQ_PROMPTS = [
  'Which product helps with late-night screen fatigue?',
  'How do I take VibeVeda focus powder?',
  'What is the difference between Shirodhara and Abhyanga?',
  'How do I know my Ayurvedic Dosha?',
];

export const WellnessChatModal: React.FC<WellnessChatModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onAddToCart,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'vaidya',
      text: 'Namaste! Welcome to VibeVeda Concierge. I am your Ayurvedic guide. How may I assist your mind and body equilibrium today?',
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendQuery = (query: string) => {
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      let action: ChatMessage['action'] | undefined = undefined;

      const lower = query.toLowerCase();

      if (lower.includes('oil') || lower.includes('fatigue') || lower.includes('screen') || lower.includes('head') || lower.includes('sleep')) {
        replyText = 'For screen fatigue and mental restlessness, our signature VibeVeda Calming Oil (Brahmi & Ashwagandha) pacifies aggravated Vata winds. Massage 4-6 drops into temples and scalp before bed.';
        action = {
          type: 'product',
          label: 'Acquire VibeVeda Oil ($48)',
          targetId: 'prod-vibeveda-oil',
        };
      } else if (lower.includes('powder') || lower.includes('focus') || lower.includes('energy') || lower.includes('burnout')) {
        replyText = 'VibeVeda Focus & Energy Powder provides sustained cognitive stamina without caffeine spikes. Mix 1 scoop into warm oat milk or your morning smoothie.';
        action = {
          type: 'product',
          label: 'Acquire VibeVeda Powder ($42)',
          targetId: 'prod-vibeveda-powder',
        };
      } else if (lower.includes('shirodhara') || lower.includes('abhyanga') || lower.includes('spa') || lower.includes('massage')) {
        replyText = 'Shirodhara is a continuous stream of warm medicated herbal oil over the forehead to reset mental burnout, while Abhyanga is a synchronized full-body detox massage.';
        action = {
          type: 'spa',
          label: 'Book a Spa Sanctuary Session',
        };
      } else if (lower.includes('dosha') || lower.includes('quiz') || lower.includes('constitution') || lower.includes('prakriti')) {
        replyText = 'Your Prakriti is your unique biological blueprint of Vata, Pitta, and Kapha elements. Take our 4-question clinical diagnostic assessment in the Vitals suite!';
        action = {
          type: 'vitals',
          label: 'Take Diagnostic Dosha Quiz',
        };
      } else if (lower.includes('yoga') || lower.includes('stretch') || lower.includes('neck') || lower.includes('desk')) {
        replyText = 'Try our 15-minute Desk Worker Neck & Shoulder Relief flow in the Yoga Studio, complete with guided timers and vibration cues!';
        action = {
          type: 'yoga',
          label: 'Open Yoga & Meditation Studio',
        };
      } else {
        replyText = 'According to classical Ayurveda, wellness is attained when Agni (digestion), Dhatus (tissues), and sensory tranquility dwell in harmony. Explore our Apothecary or book a Vaidya telehealth session!';
        action = {
          type: 'product',
          label: 'Explore Apothecary Dispensary',
        };
      }

      const botMsg: ChatMessage = {
        id: `v-${Date.now()}`,
        sender: 'vaidya',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleActionClick = (action: ChatMessage['action']) => {
    if (!action) return;

    if (action.type === 'product') {
      const prod = PRODUCTS.find((p) => p.id === action.targetId) || PRODUCTS[0];
      onAddToCart(prod);
      setAddedToast(`${prod.name} added to your basket!`);
      setTimeout(() => setAddedToast(null), 2500);
    } else if (action.type === 'spa') {
      onNavigate('spa');
      onClose();
    } else if (action.type === 'yoga') {
      onNavigate('yoga');
      onClose();
    } else if (action.type === 'vitals') {
      onNavigate('vitals');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md h-full sm:h-[620px] bg-[#fff8f6] border border-[#f7ddd3] rounded-none sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#234735] text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[20px]">spa</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-headline text-base font-bold text-white">
                  VibeVeda Wellness Concierge
                </h3>
              </div>
              <span className="text-[10px] text-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Vaidya Team Online &bull; Instant Ayurvedic Guidance
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast */}
        {addedToast && (
          <div className="p-2.5 bg-[#261813] text-[#ffede7] text-xs font-semibold flex items-center justify-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{addedToast}</span>
          </div>
        )}

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fff8f6]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#2e5b44] text-white rounded-br-none'
                    : 'bg-[#fff1ec] text-[#261813] border border-[#f7ddd3] rounded-bl-none shadow-2xs'
                }`}
              >
                <p>{msg.text}</p>

                {/* Optional Action Button inside bot message */}
                {msg.action && (
                  <div className="mt-2.5 pt-2 border-t border-[#f7ddd3]">
                    <button
                      onClick={() => handleActionClick(msg.action)}
                      className="w-full py-2 px-3 rounded-xl bg-[#953c27] text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#b4533c] shadow-xs active:scale-95 transition-all"
                    >
                      {msg.action.type === 'product' && <ShoppingBag className="w-3.5 h-3.5" />}
                      {msg.action.type === 'spa' && <Calendar className="w-3.5 h-3.5" />}
                      <span>{msg.action.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-[#89726d] px-1 mt-0.5">{msg.timestamp}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-[#fff1ec] text-xs text-[#56423e] w-24">
              <span className="w-1.5 h-1.5 rounded-full bg-[#953c27] animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#953c27] animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#953c27] animate-bounce [animation-delay:0.4s]" />
            </div>
          )}
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="px-4 py-2 bg-[#fff1ec]/70 border-t border-[#f7ddd3] flex gap-1.5 overflow-x-auto">
          {FAQ_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendQuery(prompt)}
              className="px-2.5 py-1 rounded-xl bg-white border border-[#dcc0ba] text-[10px] font-medium text-[#56423e] hover:border-[#953c27] hover:text-[#261813] whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery(inputText);
          }}
          className="p-3 bg-white border-t border-[#f7ddd3] flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything about stress, herbs, sleep, or therapies..."
            className="flex-1 px-3.5 py-2 text-xs bg-[#fff1ec] border border-[#dcc0ba] rounded-xl text-[#261813] placeholder-[#89726d] outline-none focus:border-[#2e5b44]"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-9 h-9 rounded-xl bg-[#2e5b44] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#234735] transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
