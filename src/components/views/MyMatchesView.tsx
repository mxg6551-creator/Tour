import React from 'react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../services/sound';
import { Calendar, Key, Trophy, Target, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const MyMatchesView: React.FC = () => {
  const { 
    tournaments, 
    currentUser, 
    setSelectedTournamentForRoom, 
    setActiveModal, 
    setSelectedTournamentForSlots,
    openAuthModal 
  } = useApp();

  const joinedMatches = tournaments.filter(t => 
    t.slots.some(s => s.userId === currentUser?.id)
  );

  return (
    <div className="space-y-4 pb-20 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">আমার ম্যাচ সমূহ (My Matches)</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">আপনার জয়েন করা সকল টুর্নামেন্ট ও রুম ট্র্যাকিং</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold bg-blue-100 dark:bg-cyan-950 text-blue-700 dark:text-cyan-400 border border-blue-300 dark:border-cyan-500/30 px-3 py-1 rounded-full">
          মোট জয়েন: {joinedMatches.length}টি
        </span>
      </div>

      {!currentUser || !currentUser.username ? (
        <div className="py-16 text-center rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
          <Calendar className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-300">লগইন প্রয়োজন</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            আপনার জয়েন করা ম্যাচ দেখতে অনুগ্রহ করে লগইন করুন।
          </p>
          <button
            onClick={() => openAuthModal('LOGIN')}
            className="py-2 px-5 rounded-xl bg-blue-600 text-white font-bold text-xs"
          >
            লগইন করুন
          </button>
        </div>
      ) : joinedMatches.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
          <Calendar className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-300">কোনো জয়েন করা ম্যাচ নেই</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            আপনি এখনও কোনো টুর্নামেন্টে জয়েন করেননি। হোম পেজ থেকে পছন্দের ম্যাচে জয়েন করুন!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {joinedMatches.map((t) => {
            const mySlot = t.slots.find(s => s.userId === currentUser.id);
            return (
              <div 
                key={t.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-blue-100 dark:bg-cyan-950 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-cyan-500/30">
                    {t.category} • {t.matchType}
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    স্লট #{mySlot?.slotNumber}
                  </span>
                </div>

                <h3 className="text-sm font-black text-slate-900 dark:text-white">{t.title}</h3>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">প্রাইজ পুল</span>
                    <span className="text-yellow-600 dark:text-yellow-400 font-bold">৳{t.prizePool}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">প্রতি কিল</span>
                    <span className="text-blue-600 dark:text-cyan-400 font-bold">৳{t.perKill}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">ম্যাপ</span>
                    <span className="text-slate-800 dark:text-white font-bold font-sans">{t.mapName}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setSelectedTournamentForRoom(t);
                      setActiveModal('ROOM_ID');
                    }}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>{t.isRoomReady ? 'Room ID দেখুন' : 'Room ID (অপেক্ষমাণ)'}</span>
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setSelectedTournamentForSlots(t);
                      setActiveModal('SLOT_VIEWER');
                    }}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>স্লট দেখুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
