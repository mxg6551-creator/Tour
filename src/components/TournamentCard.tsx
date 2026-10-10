import React, { useState, useEffect } from 'react';
import { Tournament } from '../types';
import { useApp } from '../context/AppContext';
import { sound } from '../services/sound';
import { 
  Clock, MapPin, Trophy, Target, Users, Key, ChevronRight, Sparkles, 
  ChevronDown, ChevronUp, FileText, ShieldAlert, CheckCircle2 
} from 'lucide-react';

interface TournamentCardProps {
  tournament: Tournament;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
  const { 
    currentUser, 
    setSelectedTournamentForJoin, 
    setSelectedTournamentForSlots, 
    setSelectedTournamentForRoom, 
    setActiveModal,
    openAuthModal,
    modes 
  } = useApp();

  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; isPassed: boolean; isTenMinsBefore: boolean }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
    isTenMinsBefore: false
  });

  const [showRulesDropdown, setShowRulesDropdown] = useState(false);

  useEffect(() => {
    const calcTime = () => {
      const diff = new Date(tournament.startTime).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isPassed: true, isTenMinsBefore: true });
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const isTenMins = diff <= 10 * 60 * 1000;
      setTimeLeft({ hours, minutes, seconds, isPassed: false, isTenMinsBefore: isTenMins });
    };

    calcTime();
    const interval = setInterval(calcTime, 1000);
    return () => clearInterval(interval);
  }, [tournament.startTime]);

  const occupiedCount = tournament.slots.filter(s => s.occupied).length;
  const spotsLeft = tournament.totalSlots - occupiedCount;
  const isFull = spotsLeft <= 0;
  const isJoined = tournament.slots.some(s => s.userId === currentUser?.id);

  // Match mode rules inheritance
  const parentMode = modes.find(m => m.id === tournament.modeId || m.name === tournament.category);
  const rulesToDisplay = tournament.rulesText || parentMode?.rules || 'অফিশিয়াল ফেয়ার প্লে টুর্নামেন্ট রুলস প্রযোজ্য।';

  const handleJoinClick = () => {
    sound.playClick();
    if (!currentUser || !currentUser.username) {
      openAuthModal('LOGIN');
      return;
    }
    setSelectedTournamentForJoin(tournament);
    setActiveModal('JOIN_MATCH');
  };

  const handleSlotsClick = () => {
    sound.playClick();
    setSelectedTournamentForSlots(tournament);
    setActiveModal('SLOT_VIEWER');
  };

  const handleRoomClick = () => {
    sound.playClick();
    if (!currentUser || !currentUser.username) {
      openAuthModal('LOGIN');
      return;
    }
    setSelectedTournamentForRoom(tournament);
    setActiveModal('ROOM_ID');
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition-all duration-300 shadow-md hover:shadow-2xl hover:shadow-amber-500/10 group flex flex-col justify-between">
      {/* Top Banner Image with Badges */}
      <div>
        <div className="relative h-32 sm:h-36 w-full overflow-hidden bg-slate-950">
          <img
            src={tournament.bannerImage || '/src/assets/images/game_mode_freefire_1791621189696.jpg'}
            alt={tournament.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-md">
              {tournament.category}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white font-bold text-[10px] border border-white/10 uppercase">
              {tournament.matchType}
            </span>
          </div>

          {/* Map Name */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[11px] font-bold text-white bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/10">
            <MapPin className="w-3 h-3 text-red-400" />
            <span>{tournament.mapName}</span>
          </div>

          {/* Live Countdown Timer Bar */}
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-500/30 font-mono text-amber-300 font-bold">
              <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>
                {timeLeft.isPassed
                  ? 'ম্যাচ শুরু হয়েছে (Live)'
                  : `স্টার্ট ইন: ${String(timeLeft.hours).padStart(2, '0')}h ${String(timeLeft.minutes).padStart(2, '0')}m ${String(timeLeft.seconds).padStart(2, '0')}s`}
              </span>
            </div>

            {isJoined && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                <CheckCircle2 className="w-3 h-3" />
                <span>JOINED</span>
              </span>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 space-y-3.5">
          {/* Title */}
          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
            {tournament.title}
          </h3>

          {/* 3 Metrics: Prize Pool, Per Kill, Entry Fee */}
          <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-center font-mono">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block font-sans">
                টোটাল প্রাইজ
              </span>
              <div className="flex items-center justify-center gap-1 text-yellow-600 dark:text-yellow-400 font-black text-xs sm:text-sm">
                <Trophy className="w-3.5 h-3.5" />
                <span>৳{tournament.prizePool}</span>
              </div>
            </div>

            <div className="space-y-0.5 border-x border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block font-sans">
                প্রতি কিল
              </span>
              <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-cyan-400 font-black text-xs sm:text-sm">
                <Target className="w-3.5 h-3.5" />
                <span>৳{tournament.perKill}</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block font-sans">
                এন্ট্রি ফি
              </span>
              <span className={`font-black text-xs sm:text-sm ${tournament.entryFee === 0 ? 'text-emerald-500 font-sans' : 'text-amber-600 dark:text-amber-400'}`}>
                {tournament.entryFee === 0 ? 'FREE' : `৳${tournament.entryFee}`}
              </span>
            </div>
          </div>

          {/* Spots Progress */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>স্লট বুকিং:</span>
              </span>
              <span className="font-mono text-slate-900 dark:text-white">
                {occupiedCount}/{tournament.totalSlots}
                <span className="text-slate-500 text-[11px] ml-1">
                  ({spotsLeft > 0 ? `বাকি ${spotsLeft}টি` : 'ফুল'})
                </span>
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  spotsLeft <= 5 ? 'bg-red-500' : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                }`}
                style={{ width: `${Math.min(100, (occupiedCount / tournament.totalSlots) * 100)}%` }}
              />
            </div>
          </div>

          {/* Action Buttons: Room ID, Slots View, Join Now */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            {/* Room ID Button */}
            <button
              onClick={handleRoomClick}
              type="button"
              className="py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="রুম আইডি ও পাসওয়ার্ড"
            >
              <Key className="w-3.5 h-3.5 text-amber-500" />
              <span>Room ID</span>
            </button>

            {/* Slots View Button */}
            <button
              onClick={handleSlotsClick}
              type="button"
              className="py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="স্লট তালিকা"
            >
              <Users className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
              <span>স্লট দেখুন</span>
            </button>

            {/* Join Button */}
            <button
              onClick={handleJoinClick}
              disabled={isFull && !isJoined}
              type="button"
              className={`col-span-2 sm:col-span-1 py-2 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer active:scale-95 ${
                isJoined
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : isFull
                  ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                  : tournament.entryFee === 0
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/30 hover:scale-105'
                  : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 shadow-amber-500/30 hover:scale-105'
              }`}
            >
              {isJoined ? (
                <span>জয়েন করা আছে</span>
              ) : isFull ? (
                <span>স্লট ফুল</span>
              ) : tournament.entryFee === 0 ? (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>FREE JOIN</span>
                </>
              ) : (
                <>
                  <span>JOIN NOW</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Auto Mode & Match Rules Dropdown (Requested Feature!) */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 rounded-b-2xl">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setShowRulesDropdown(!showRulesDropdown);
          }}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-amber-500 transition-colors cursor-pointer py-1"
        >
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-amber-500" />
            <span>📜 মোড রুলস ও নিয়মাবলী (Match Rules)</span>
          </div>
          {showRulesDropdown ? (
            <ChevronUp className="w-4 h-4 text-amber-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showRulesDropdown && (
          <div className="mt-2.5 p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-500/30 text-xs text-slate-700 dark:text-slate-300 space-y-1.5 animate-fade-in font-sans">
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-black text-[11px] uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{tournament.category} এর অফিশিয়াল নিয়মাবলী:</span>
            </div>
            <p className="whitespace-pre-line leading-relaxed text-[11px] text-slate-600 dark:text-slate-300">
              {rulesToDisplay}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
