import React, { useState } from 'react';
import { X, Trophy, Medal, Flame, Calendar, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sound } from '../services/sound';

export const LeaderboardModal: React.FC = () => {
  const { users, activeModal, setActiveModal, currentUser } = useApp();
  const [period, setPeriod] = useState<'WEEKLY' | 'MONTHLY' | 'ALL_TIME'>('WEEKLY');

  if (activeModal !== 'LEADERBOARD') return null;

  const handleClose = () => {
    sound.playClick();
    setActiveModal(null);
  };

  // Sort by selected period: Total Kills & Wins
  const sortedUsers = [...users].sort((a, b) => {
    if (period === 'WEEKLY') {
      const scoreA = (a.weeklyWins || 0) * 10 + (a.weeklyKills || 0);
      const scoreB = (b.weeklyWins || 0) * 10 + (b.weeklyKills || 0);
      return scoreB - scoreA;
    } else if (period === 'MONTHLY') {
      const scoreA = (a.monthlyWins || 0) * 10 + (a.monthlyKills || 0);
      const scoreB = (b.monthlyWins || 0) * 10 + (b.monthlyKills || 0);
      return scoreB - scoreA;
    } else {
      const scoreA = (a.totalWins || 0) * 10 + (a.totalKills || 0);
      const scoreB = (b.totalWins || 0) * 10 + (b.totalKills || 0);
      return scoreB - scoreA;
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div 
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-yellow-500/40 shadow-2xl shadow-yellow-950/30 text-slate-900 dark:text-white animate-scale-in overflow-hidden"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-yellow-500/20 text-yellow-500 flex items-center justify-center shadow-sm">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                প্লেয়ার লিডারবোর্ড (Leaderboard)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                টোটাল কিল এবং ম্যাচ জয়ের ভিত্তিতে শীর্ষ প্লেয়ার তালিকা
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Periods Switcher: WEEKLY, MONTHLY, ALL-TIME */}
        <div className="grid grid-cols-3 p-1.5 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 gap-1.5 text-xs font-bold">
          <button
            onClick={() => { sound.playClick(); setPeriod('WEEKLY'); }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              period === 'WEEKLY'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white'
            }`}
          >
            উইকলি (Weekly)
          </button>
          <button
            onClick={() => { sound.playClick(); setPeriod('MONTHLY'); }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              period === 'MONTHLY'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white'
            }`}
          >
            মান্থলি (Monthly)
          </button>
          <button
            onClick={() => { sound.playClick(); setPeriod('ALL_TIME'); }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              period === 'ALL_TIME'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white'
            }`}
          >
            অল টাইম (All-Time)
          </button>
        </div>

        {/* Podium Top 3 */}
        <div className="p-4 bg-slate-50/70 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-2 text-center pt-6">
          {/* #2 */}
          {sortedUsers[1] && (
            <div className="space-y-1">
              <div className="relative inline-block">
                <img src={sortedUsers[1].avatar} alt="" className="w-12 h-12 rounded-full ring-2 ring-slate-400 mx-auto object-cover" />
                <span className="absolute -top-2 -right-1 bg-slate-400 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">2</span>
              </div>
              <div className="text-xs font-bold truncate text-slate-800 dark:text-slate-200">{sortedUsers[1].nickname || sortedUsers[1].username}</div>
              <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {period === 'WEEKLY' ? `${sortedUsers[1].weeklyWins || 0}W • ${sortedUsers[1].weeklyKills || 0}K` : period === 'MONTHLY' ? `${sortedUsers[1].monthlyWins || 0}W • ${sortedUsers[1].monthlyKills || 0}K` : `${sortedUsers[1].totalWins}W • ${sortedUsers[1].totalKills}K`}
              </div>
            </div>
          )}

          {/* #1 Champion */}
          {sortedUsers[0] && (
            <div className="space-y-1 -mt-4">
              <div className="relative inline-block">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-500 animate-bounce">👑</div>
                <img src={sortedUsers[0].avatar} alt="" className="w-16 h-16 rounded-full ring-4 ring-yellow-400 mx-auto object-cover shadow-lg shadow-yellow-500/30" />
                <span className="absolute -top-2 -right-1 bg-yellow-400 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">1</span>
              </div>
              <div className="text-xs font-black truncate text-yellow-600 dark:text-yellow-300">{sortedUsers[0].nickname || sortedUsers[0].username}</div>
              <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-black">
                {period === 'WEEKLY' ? `${sortedUsers[0].weeklyWins || 0}W • ${sortedUsers[0].weeklyKills || 0}K` : period === 'MONTHLY' ? `${sortedUsers[0].monthlyWins || 0}W • ${sortedUsers[0].monthlyKills || 0}K` : `${sortedUsers[0].totalWins}W • ${sortedUsers[0].totalKills}K`}
              </div>
            </div>
          )}

          {/* #3 */}
          {sortedUsers[2] && (
            <div className="space-y-1">
              <div className="relative inline-block">
                <img src={sortedUsers[2].avatar} alt="" className="w-12 h-12 rounded-full ring-2 ring-amber-700 mx-auto object-cover" />
                <span className="absolute -top-2 -right-1 bg-amber-700 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">3</span>
              </div>
              <div className="text-xs font-bold truncate text-slate-800 dark:text-slate-200">{sortedUsers[2].nickname || sortedUsers[2].username}</div>
              <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {period === 'WEEKLY' ? `${sortedUsers[2].weeklyWins || 0}W • ${sortedUsers[2].weeklyKills || 0}K` : period === 'MONTHLY' ? `${sortedUsers[2].monthlyWins || 0}W • ${sortedUsers[2].monthlyKills || 0}K` : `${sortedUsers[2].totalWins}W • ${sortedUsers[2].totalKills}K`}
              </div>
            </div>
          )}
        </div>

        {/* Full Ranking List */}
        <div className="p-4 overflow-y-auto flex-1 custom-scrollbar space-y-2">
          {sortedUsers.map((user, idx) => {
            const isMe = user.id === currentUser?.id;
            const wins = period === 'WEEKLY' ? (user.weeklyWins || 0) : period === 'MONTHLY' ? (user.monthlyWins || 0) : user.totalWins;
            const kills = period === 'WEEKLY' ? (user.weeklyKills || 0) : period === 'MONTHLY' ? (user.monthlyKills || 0) : user.totalKills;

            return (
              <div
                key={user.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                  isMe 
                    ? 'bg-amber-50 dark:bg-slate-950 border-amber-400 ring-1 ring-amber-400/50' 
                    : 'bg-white dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-slate-500 w-5 text-center">
                    #{idx + 1}
                  </span>
                  <img src={user.avatar} alt="" className="w-8 h-8 rounded-full bg-slate-800 object-cover" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {user.nickname || user.username} {isMe ? '(YOU)' : ''}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      UID: {user.ffUid}
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-sm font-black text-amber-600 dark:text-amber-400 block">
                    {wins} জয়
                  </span>
                  <span className="text-[10px] text-blue-600 dark:text-cyan-400 font-bold">
                    {kills} কিল
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
