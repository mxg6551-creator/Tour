import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../services/sound';
import { BarChart2, Trophy, Target, Award, Calendar, Sparkles } from 'lucide-react';

export const ResultView: React.FC = () => {
  const { tournaments } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const completedTournaments = tournaments.filter(t => t.status === 'COMPLETED');

  // Sample results when none completed yet
  const displayResults = completedTournaments.length > 0 ? completedTournaments : [
    {
      id: 'res-101',
      title: 'BR Match #101 | DUO BERMUDA',
      category: 'BR Match',
      mapName: 'Bermuda',
      startTime: '2026-10-09T14:30:00Z',
      winners: [
        { rank: 1, userName: 'MOON_ESPORTS', kills: 11, prize: 400 },
        { rank: 2, userName: 'PRINCE_FIRE', kills: 7, prize: 180 }
      ]
    },
    {
      id: 'res-102',
      title: 'Clash Squad #102 | 4v4 BERMUDA',
      category: 'Clash Squad',
      mapName: 'Bermuda',
      startTime: '2026-10-09T18:00:00Z',
      winners: [
        { rank: 1, userName: 'PRINCE_FIRE', kills: 8, prize: 650 },
        { rank: 2, userName: 'SKY_KILLER', kills: 4, prize: 200 }
      ]
    }
  ];

  const filtered = selectedFilter === 'ALL'
    ? displayResults
    : displayResults.filter(r => r.category === selectedFilter);

  return (
    <div className="space-y-4 pb-20 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">ফলাফল (Match Results)</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">সমাপ্ত হওয়া টুর্নামেন্ট ও উইনার্স তালিকা</p>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
        {['ALL', 'BR Match', 'BR Survival', 'Clash Squad', 'Lone Wolf 1v1', 'Katana VS Katana'].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              sound.playClick();
              setSelectedFilter(cat);
            }}
            className={`py-1.5 px-3 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === cat
                ? 'bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-black dark:hover:text-white'
            }`}
          >
            {cat === 'ALL' ? 'সবগুলো' : cat}
          </button>
        ))}
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {filtered.map((res: any) => {
          const firstWinner = res.winners?.[0] || { rank: 1, userName: 'Champion', kills: 0, prize: 0 };
          const secondWinner = res.winners?.[1];

          return (
            <div
              key={res.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 transition-all space-y-3 shadow-md"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                  {res.category} • {res.mapName}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  {new Date(res.startTime).toLocaleDateString('en-GB')}
                </span>
              </div>

              <h3 className="text-sm font-black text-slate-900 dark:text-white">{res.title}</h3>

              {/* Booyah Champion Box */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-yellow-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 flex items-center justify-center text-slate-950 font-black text-base shadow-md">
                    👑
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-yellow-400 block">
                      বুয়াহ্ চ্যাম্পিয়ন (Booyah Champion):
                    </span>
                    <span className="text-sm font-black text-slate-900 dark:text-yellow-300">
                      {firstWinner.userName}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono ml-2">
                      ({firstWinner.kills} কিল)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-sans">প্রাইজ মানি</span>
                  <span className="text-sm font-mono font-black text-emerald-600 dark:text-emerald-400">
                    ৳{firstWinner.prize}
                  </span>
                </div>
              </div>

              {/* 2nd Place */}
              {secondWinner && (
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2 font-mono">
                  <span>২য় স্থান: <b className="text-slate-800 dark:text-slate-200">{secondWinner.userName}</b> ({secondWinner.kills} কিল)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">৳{secondWinner.prize}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
