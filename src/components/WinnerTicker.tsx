import React from 'react';
import { Flame, Trophy, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WinnerTicker: React.FC = () => {
  const { winnerAnnouncements } = useApp();

  // If no real winners exist, do not display fake bot wins!
  if (!winnerAnnouncements || winnerAnnouncements.length === 0) {
    return (
      <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-950/80 border-y border-slate-200 dark:border-slate-800/80 py-1.5 text-xs select-none">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-slate-700 dark:text-slate-300">XEB TOUR LIVE ARENA:</span>
            <span>ফেয়ার প্লে এবং রিয়েল-টাইম গেমিং প্ল্যাটফর্ম। জয়ী হলে লাইভ উইনিং লিস্টে আপনার নাম যুক্ত হবে!</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% REAL DATA</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-slate-100 dark:via-slate-950 to-amber-500/10 border-y border-amber-500/20 py-2 text-xs select-none">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black rounded-r-full text-[11px] uppercase tracking-wider z-10 shrink-0 shadow-md">
          <Flame className="w-3.5 h-3.5 fill-current animate-bounce" />
          <span>লাইভ উইনার্স</span>
        </div>

        {/* Marquee track scrolling real winner announcements */}
        <div className="flex space-x-8 overflow-hidden whitespace-nowrap">
          <div className="flex space-x-8 animate-marquee">
            {winnerAnnouncements.map((msg) => (
              <div key={msg.id} className="flex items-center gap-2 text-slate-700 dark:text-slate-300 shrink-0">
                <Trophy className="w-3.5 h-3.5 text-yellow-500 dark:text-yellow-400" />
                <span className="font-bold text-amber-600 dark:text-amber-300">{msg.gameIdName}</span>
                <span className="text-slate-400">জয়ী হয়েছেন</span>
                <span className="text-slate-900 dark:text-white font-medium">{msg.eventOrMatch}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-black">+৳{msg.prize}</span>
                <span className="text-slate-400 text-[10px] font-mono">({msg.time})</span>
              </div>
            ))}
          </div>
          {/* Duplicate track for seamless infinite marquee loop */}
          <div className="flex space-x-8 animate-marquee" aria-hidden="true">
            {winnerAnnouncements.map((msg) => (
              <div key={`dup-${msg.id}`} className="flex items-center gap-2 text-slate-700 dark:text-slate-300 shrink-0">
                <Trophy className="w-3.5 h-3.5 text-yellow-500 dark:text-yellow-400" />
                <span className="font-bold text-amber-600 dark:text-amber-300">{msg.gameIdName}</span>
                <span className="text-slate-400">জয়ী হয়েছেন</span>
                <span className="text-slate-900 dark:text-white font-medium">{msg.eventOrMatch}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-black">+৳{msg.prize}</span>
                <span className="text-slate-400 text-[10px] font-mono">({msg.time})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
