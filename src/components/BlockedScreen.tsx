import React from 'react';
import { ShieldAlert, Send, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sound } from '../services/sound';

export const BlockedScreen: React.FC = () => {
  const { settings, currentUser } = useApp();

  const handleSupportClick = () => {
    sound.playClick();
    window.open(settings.telegramSupportLink, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950 text-white select-none">
      <div className="relative max-w-md w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border border-red-500/50 shadow-2xl shadow-red-950/60 text-center space-y-5 animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-red-500/20 text-red-500 mx-auto flex items-center justify-center border-2 border-red-500/40">
          <ShieldAlert className="w-10 h-10 animate-bounce" />
        </div>
        <div className="space-y-2">
          <span className="text-[11px] font-black uppercase tracking-widest text-red-400 bg-red-500/20 px-3 py-1 rounded-full border border-red-500/30">
            অ্যাকাউন্ট সাময়িকভাবে ব্লক (BLOCKED)
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            অ্যাক্সেস স্থগিত করা হয়েছে
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            দুঃখিত <b className="text-amber-400">{currentUser.username}</b>, আপনার অ্যাকাউন্টটি সিস্টেম পলিসি বা নিরাপত্তা নির্দেশিকা লঙ্ঘনের কারণে অ্যাডমিন কর্তৃক সাময়িকভাবে ব্লক করা হয়েছে।
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={handleSupportClick}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-red-600/30 active:scale-95 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4 fill-current" />
            <span>অ্যাডমিনের সাথে যোগাযোগ করুন (Telegram)</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[11px] text-slate-500">
          XEB TOUR Security & Compliance Enforcement
        </p>
      </div>
    </div>
  );
};
