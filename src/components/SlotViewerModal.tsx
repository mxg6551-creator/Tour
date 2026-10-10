import React, { useState } from 'react';
import { X, ShieldAlert, Users, Info, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sound } from '../services/sound';

export const SlotViewerModal: React.FC = () => {
  const { 
    selectedTournamentForSlots, 
    setSelectedTournamentForSlots, 
    activeModal, 
    setActiveModal,
    setSelectedTournamentForJoin,
    modes 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'PLAYERS' | 'RULES' | 'OVERVIEW'>('PLAYERS');

  const tournament = selectedTournamentForSlots;

  if (activeModal !== 'SLOT_VIEWER' || !tournament) return null;

  const handleClose = () => {
    sound.playClick();
    setActiveModal(null);
    setSelectedTournamentForSlots(null);
  };

  const occupiedCount = tournament.slots.filter(s => s.occupied).length;
  const parentMode = modes.find(m => m.id === tournament.modeId || m.name === tournament.category);
  const rulesToDisplay = tournament.rulesText || parentMode?.rules || 'অফিশিয়াল ফেয়ার প্লে টুর্নামেন্ট রুলস মেনে খেলুন।';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-amber-500/40 shadow-2xl shadow-amber-950/30 text-slate-900 dark:text-white animate-scale-in overflow-hidden"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {tournament.category} • {tournament.matchType}
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
              {tournament.title}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Navigation Tabs: PLAYERS, RULES, OVERVIEW */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 px-4 pt-2 gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('PLAYERS');
            }}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-black border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'PLAYERS'
                ? 'border-amber-400 text-amber-500'
                : 'border-transparent text-slate-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>স্লট তালিকা ({occupiedCount}/{tournament.totalSlots})</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('RULES');
            }}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-black border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'RULES'
                ? 'border-amber-400 text-amber-500'
                : 'border-transparent text-slate-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>মোড নিয়মাবলী</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('OVERVIEW');
            }}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-black border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'OVERVIEW'
                ? 'border-amber-400 text-amber-500'
                : 'border-transparent text-slate-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>ম্যাচ বিস্তারিত</span>
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 custom-scrollbar space-y-4">
          {/* TAB 1: PLAYERS SLOTS GRID */}
          {activeTab === 'PLAYERS' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-1">
                <span>স্লট বুকিং তথ্য:</span>
                <span className="font-mono text-amber-500 font-bold">
                  বাকি আছে: {tournament.totalSlots - occupiedCount}টি স্লট
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {tournament.slots.map((slot) => (
                  <div
                    key={slot.slotNumber}
                    className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                      slot.occupied
                        ? 'bg-slate-50 dark:bg-slate-950/90 border-emerald-500/40 shadow-sm'
                        : 'bg-white dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 flex items-center justify-center font-mono text-xs font-black text-amber-500">
                        #{slot.slotNumber}
                      </span>
                      {slot.occupied ? (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          বুকড ✓
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded">
                          ফাঁকা
                        </span>
                      )}
                    </div>

                    <div className="mt-2 text-left">
                      {slot.occupied ? (
                        <>
                          <div className="text-xs font-black text-slate-900 dark:text-white truncate" title={slot.userName}>
                            {slot.userName}
                          </div>
                          {slot.teamMembers && slot.teamMembers.length > 1 && (
                            <div className="text-[10px] text-blue-500 dark:text-cyan-400 truncate mt-0.5">
                              টিম: {slot.teamMembers.join(', ')}
                            </div>
                          )}
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            {slot.ffUid ? `UID: ${slot.ffUid}` : 'Verified Player'}
                          </div>
                        </>
                      ) : (
                        <div className="text-xs text-slate-400 font-medium py-1">
                          স্লট খালি আছে
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: RULES TAB */}
          {activeTab === 'RULES' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 font-bold space-y-1">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black">
                  <ShieldAlert className="w-4 h-4" />
                  <span>{tournament.category} এর অফিশিয়াল নিয়মাবলী:</span>
                </div>
                <p className="whitespace-pre-line text-xs font-normal">
                  {rulesToDisplay}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="font-black text-slate-900 dark:text-white text-sm">সাধারণ টুর্নামেন্ট নির্দেশনা:</h4>
                <ul className="space-y-2 list-disc list-inside text-slate-600 dark:text-slate-300">
                  <li>ম্যাচ শুরুর ঠিক ১০ মিনিট আগে রুম আইডি এবং পাসওয়ার্ড উন্মুক্ত করা হবে।</li>
                  <li>রুম আইডি পাওয়ার পর নিজ স্লট অনুযায়ী সঠিক পজিশনে বসুন।</li>
                  <li>ম্যাচে যেকোনো ধরনের হ্যাকিং বা গ্লিচ ব্যবহার করলে আজীবন ব্যান করা হবে।</li>
                  <li>ম্যাচ শেষ হওয়ার পর সঠিক উইনিং ব্যালেন্স আপনার ওয়ালেটে অটো যোগ হবে।</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">প্রাইজ পুল</span>
                  <span className="text-sm font-black text-yellow-500 font-mono">৳{tournament.prizePool}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">প্রতি কিল</span>
                  <span className="text-sm font-black text-blue-500 dark:text-cyan-400 font-mono">৳{tournament.perKill}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">এন্ট্রি ফি</span>
                  <span className="text-sm font-black text-amber-500 font-mono">
                    {tournament.entryFee === 0 ? 'FREE' : `৳${tournament.entryFee}`}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">ম্যাপ</span>
                  <span className="text-sm font-black text-slate-800 dark:text-white">{tournament.mapName}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            ম্যাচ আইডি: {tournament.id}
          </span>
          <button
            onClick={() => {
              sound.playClick();
              setSelectedTournamentForJoin(tournament);
              setActiveModal('JOIN_MATCH');
            }}
            className="py-2 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs sm:text-sm hover:scale-105 transition-transform cursor-pointer shadow-md"
          >
            এখনই জয়েন করুন (Join)
          </button>
        </div>
      </div>
    </div>
  );
};
