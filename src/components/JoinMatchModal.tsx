import React, { useState } from 'react';
import { X, Users, User, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MatchType } from '../types';
import { sound } from '../services/sound';

export const JoinMatchModal: React.FC = () => {
  const { 
    currentUser, 
    selectedTournamentForJoin, 
    setSelectedTournamentForJoin, 
    activeModal, 
    setActiveModal, 
    joinTournament 
  } = useApp();

  const tournament = selectedTournamentForJoin;

  // Local form states
  const [matchType, setMatchType] = useState<MatchType>(tournament?.matchType || 'SOLO');
  const [ign, setIgn] = useState(currentUser?.nickname || currentUser?.username || '');
  const [teammate1, setTeammate1] = useState('');
  const [teammate2, setTeammate2] = useState('');
  const [teammate3, setTeammate3] = useState('');

  // Find first available slot
  const firstEmptySlot = tournament?.slots.find(s => !s.occupied)?.slotNumber || 1;
  const [selectedSlotNumber, setSelectedSlotNumber] = useState<number>(firstEmptySlot);
  const [resultMessage, setResultMessage] = useState<{ text: string; success: boolean } | null>(null);

  if (activeModal !== 'JOIN_MATCH' || !tournament) return null;

  const playerCount = matchType === 'SOLO' ? 1 : matchType === 'DUO' ? 2 : 4;
  const totalFee = tournament.entryFee * playerCount;
  const hasEnoughBalance = (currentUser?.totalBalance || 0) >= totalFee;

  const handleClose = () => {
    sound.playClick();
    setActiveModal(null);
    setSelectedTournamentForJoin(null);
    setResultMessage(null);
  };

  const handleConfirmJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ign.trim()) {
      sound.playError();
      setResultMessage({ text: 'আপনার Free Fire গেমের নাম (IGN) লিখুন!', success: false });
      return;
    }

    const teammates = matchType === 'SOLO' 
      ? [] 
      : matchType === 'DUO' 
      ? [teammate1.trim()] 
      : [teammate1.trim(), teammate2.trim(), teammate3.trim()];

    const res = joinTournament(tournament.id, selectedSlotNumber, ign.trim(), teammates, matchType);
    setResultMessage({ text: res.message, success: res.success });
    if (res.success) {
      setTimeout(() => {
        handleClose();
      }, 1600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div 
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-amber-500/40 shadow-2xl shadow-amber-950/30 text-slate-900 dark:text-white animate-scale-in"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              ম্যাচ জয়েন কনফার্মেশন
            </span>
            <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
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

        {/* Form Body */}
        <div className="p-4 sm:p-5 space-y-4">
          <form onSubmit={handleConfirmJoin} className="space-y-3.5">
            {/* Primary IGN */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-500" />
                <span>আপনার Free Fire IGN (গেমের নাম) *</span>
              </label>
              <input
                type="text"
                required
                value={ign}
                onChange={(e) => setIgn(e.target.value)}
                placeholder="যেমন: MOON_ESPORTS"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-amber-400 focus:outline-none text-slate-900 dark:text-white text-xs sm:text-sm font-bold"
              />
            </div>

            {/* Teammates based on DUO / SQUAD */}
            {matchType === 'DUO' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  <span>টিমমেট ১ Free Fire IGN *</span>
                </label>
                <input
                  type="text"
                  required
                  value={teammate1}
                  onChange={(e) => setTeammate1(e.target.value)}
                  placeholder="যেমন: SKY_HUNTER"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-amber-400 text-slate-900 dark:text-white text-xs sm:text-sm font-medium"
                />
              </div>
            )}

            {matchType === 'SQUAD' && (
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-500" />
                    <span>টিমমেট ১ Free Fire IGN *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={teammate1}
                    onChange={(e) => setTeammate1(e.target.value)}
                    placeholder="টিমমেট ১ এর নাম"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-500" />
                    <span>টিমমেট ২ Free Fire IGN *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={teammate2}
                    onChange={(e) => setTeammate2(e.target.value)}
                    placeholder="টিমমেট ২ এর নাম"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-500" />
                    <span>টিমমেট ৩ Free Fire IGN *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={teammate3}
                    onChange={(e) => setTeammate3(e.target.value)}
                    placeholder="টিমমেট ৩ এর নাম"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>
            )}

            {/* Slot Selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                পছন্দের স্লট নম্বর সিলেক্ট করুন:
              </label>
              <select
                value={selectedSlotNumber}
                onChange={(e) => setSelectedSlotNumber(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-mono font-bold"
              >
                {tournament.slots.map((s) => (
                  <option 
                    key={s.slotNumber} 
                    value={s.slotNumber}
                    disabled={s.occupied}
                  >
                    স্লট #{s.slotNumber} {s.occupied ? `[বুকড: ${s.userName}]` : '[খালি / Available]'}
                  </option>
                ))}
              </select>
            </div>

            {/* Fee summary box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-amber-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>সিঙ্গেল এন্ট্রি ফি:</span>
                <span className="font-mono text-slate-900 dark:text-white">৳{tournament.entryFee}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>প্লেয়ার সংখ্যা:</span>
                <span className="font-mono text-slate-900 dark:text-white">{playerCount} জন ({matchType})</span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-slate-200 dark:border-slate-800 pt-1.5">
                <span className="text-slate-500 dark:text-slate-400">আপনার ব্যালেন্স:</span>
                <span className="font-mono text-emerald-500 font-bold">৳{currentUser?.totalBalance || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold border-t border-slate-200 dark:border-slate-800 pt-1.5">
                <span className="text-amber-600 dark:text-amber-400">টোটাল পরিশোধযোগ্য ফি:</span>
                <span className="font-mono text-base text-slate-900 dark:text-yellow-300 font-black">৳{totalFee}</span>
              </div>
            </div>

            {/* Notification message */}
            {resultMessage && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                resultMessage.success 
                  ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30' 
                  : 'bg-red-50 dark:bg-red-950/80 text-red-600 dark:text-red-300 border border-red-300 dark:border-red-500/30'
              }`}>
                {resultMessage.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{resultMessage.text}</span>
              </div>
            )}

            {/* Confirm Button */}
            <button
              type="submit"
              disabled={!hasEnoughBalance}
              className={`w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                hasEnoughBalance 
                  ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 hover:scale-[1.01] active:scale-95 shadow-amber-500/30'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {hasEnoughBalance 
                  ? `জয়েন কনফার্ম করুন (৳${totalFee})` 
                  : `অপর্যাপ্ত ব্যালেন্স (৳${totalFee} প্রয়োজন)`}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
