import React, { useState } from 'react';
import { 
  X, Home, TrendingUp, Info, Settings as SettingsIcon, Volume2, 
  HelpCircle, Trophy, Sparkles, Check, AlertCircle, RotateCcw 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { sound } from '../../services/sound';

export const SevenUpDownModal: React.FC = () => {
  const { 
    currentUser, 
    is7Up7DownModalOpen, 
    setIs7Up7DownModalOpen, 
    sevenUpDownRound, 
    placeSevenUpDownBet, 
    settings,
    openAuthModal 
  } = useApp();

  // Selected chip amount
  const [selectedChip, setSelectedChip] = useState<number>(10);

  // Sub-dialog states
  const [showTrendModal, setShowTrendModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showPlayersModal, setShowPlayersModal] = useState<boolean>(false);

  // Audio sliders
  const [musicVol, setMusicVol] = useState<number>(80);
  const [soundVol, setSoundVol] = useState<number>(90);

  // Error toast
  const [errorToast, setErrorToast] = useState<string | null>(null);

  if (!is7Up7DownModalOpen) return null;

  const handleClose = () => {
    sound.playClick();
    setIs7Up7DownModalOpen(false);
  };

  const chips = [
    { value: 10, label: '10', bg: 'bg-emerald-600', ring: 'ring-emerald-400', text: 'text-white' },
    { value: 50, label: '50', bg: 'bg-blue-600', ring: 'ring-blue-400', text: 'text-white' },
    { value: 100, label: '100', bg: 'bg-indigo-700', ring: 'ring-indigo-400', text: 'text-white' },
    { value: 500, label: '500', bg: 'bg-red-600', ring: 'ring-red-400', text: 'text-white' },
    { value: 1000, label: '1K', bg: 'bg-amber-600', ring: 'ring-amber-400', text: 'text-yellow-200' },
    { value: 5000, label: '5K', bg: 'bg-slate-800', ring: 'ring-slate-400', text: 'text-white' }
  ];

  const handleBetClick = (target: 'DOWN' | 'SEVEN' | 'UP') => {
    if (!currentUser) {
      openAuthModal('LOGIN');
      return;
    }

    if (currentUser.totalBalance < 10) {
      sound.playError();
      setErrorToast('দান ধরতে একাউন্টে সর্বনিম্ন ১০ টাকা ব্যালেন্স থাকতে হবে!');
      setTimeout(() => setErrorToast(null), 3000);
      return;
    }

    const res = placeSevenUpDownBet(target, selectedChip);
    if (!res.success) {
      setErrorToast(res.message);
      setTimeout(() => setErrorToast(null), 3000);
    }
  };

  // Render authentic 6-sided die pip dots
  const renderPipDice = (num: number, isRed = false) => {
    const dotColor = isRed ? 'bg-red-500' : 'bg-slate-900';
    switch (num) {
      case 1:
        return (
          <div className="w-full h-full bg-white rounded-lg border border-slate-300 flex items-center justify-center p-0.5 shadow-sm">
            <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
          </div>
        );
      case 2:
        return (
          <div className="w-full h-full bg-white rounded-lg border border-slate-300 p-1 flex justify-between shadow-sm">
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor} self-end`} />
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full bg-white rounded-lg border border-slate-300 p-0.5 flex flex-col justify-between shadow-sm">
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor} self-start`} />
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor} self-center`} />
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor} self-end`} />
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full bg-white rounded-lg border border-slate-300 p-1 grid grid-cols-2 grid-rows-2 gap-1 place-items-center shadow-sm">
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full bg-white rounded-lg border border-slate-300 p-0.5 grid grid-cols-3 grid-rows-3 place-items-center shadow-sm">
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor} col-start-1 row-start-1`} />
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor} col-start-3 row-start-1`} />
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor} col-start-2 row-start-2`} />
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor} col-start-1 row-start-3`} />
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor} col-start-3 row-start-3`} />
          </div>
        );
      case 6:
      default:
        return (
          <div className="w-full h-full bg-white rounded-lg border border-slate-300 p-0.5 grid grid-cols-2 grid-rows-3 gap-0.5 place-items-center shadow-sm">
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
          </div>
        );
    }
  };

  const { phase, timeLeft, dice1, dice2, sum, resultTarget, history, userBets, totalBets, otherPlayers, lastWinMessage } = sevenUpDownRound;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 select-none overflow-hidden font-sans">
      {/* FULLSCREEN CASINO TABLE CONTAINER (Landscape-optimized, matches Screenshot 1 to 7) */}
      <div className="relative w-full h-full max-w-6xl max-h-[100vh] flex flex-col justify-between p-2 sm:p-4 bg-gradient-to-b from-[#1a0826] via-[#2d0943] to-[#140420] text-white overflow-hidden shadow-2xl">
        
        {/* ============================================================== */}
        {/* TOP BAR: Navigation, Recent Dice History, Announcements, Icons */}
        {/* ============================================================== */}
        <div className="flex items-center justify-between gap-2 z-20 pb-1">
          {/* Left: Home & Trend Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-slate-900/90 border border-yellow-500/50 hover:border-yellow-300 flex items-center justify-center text-yellow-400 shadow-lg active:scale-95 transition-all"
              title="Home"
            >
              <Home className="w-5 h-5" />
            </button>
            <button
              onClick={() => { sound.playClick(); setShowTrendModal(true); }}
              className="w-10 h-10 rounded-full bg-slate-900/90 border border-yellow-500/50 hover:border-yellow-300 flex items-center justify-center text-yellow-400 shadow-lg active:scale-95 transition-all"
              title="ট্রেন্ড চার্ট (Trend)"
            >
              <TrendingUp className="w-5 h-5" />
            </button>
          </div>

          {/* Center-Left: Recent Rolls Bar (Matching top dice history in Screenshot 2, 5, 7) */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl bg-black/60 border border-yellow-500/30 backdrop-blur-md custom-scrollbar">
            {history.slice(0, 8).map((h, i) => (
              <div 
                key={i} 
                className="flex flex-col items-center justify-center px-1.5 py-0.5 rounded-lg bg-slate-900/90 border border-slate-700/80 shrink-0"
              >
                <div className="flex gap-0.5 scale-75 origin-center">
                  <div className="w-4 h-4">{renderPipDice(h.dice1, false)}</div>
                  <div className="w-4 h-4">{renderPipDice(h.dice2, true)}</div>
                </div>
                <div className="flex items-center gap-0.5 text-[10px] font-mono font-black">
                  <span className={h.target === 'SEVEN' ? 'text-cyan-400' : h.target === 'UP' ? 'text-emerald-400' : 'text-red-400'}>
                    {h.sum}
                  </span>
                  {h.isLightning && <span className="text-yellow-400 text-[9px]">⚡</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Center Announcement Ticker */}
          <div className="hidden lg:flex items-center gap-2 max-w-sm px-3 py-1 rounded-full bg-black/50 border border-yellow-500/20 text-[11px] truncate text-slate-300">
            <Volume2 className="w-4 h-4 text-yellow-400 shrink-0" />
            <span className="truncate">
              অভিনন্দন player*** জ্যাকপট জয়ের জন্য <b className="text-yellow-400 font-mono">৳18,360</b> জিতেছেন!
            </span>
          </div>

          {/* Right: Info Help & Settings */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { sound.playClick(); setShowPlayersModal(true); }}
              className="w-10 h-10 rounded-full bg-slate-900/90 border border-yellow-500/50 hover:border-yellow-300 flex items-center justify-center text-yellow-400 shadow-lg active:scale-95 transition-all"
              title="খেলোয়াড়ের তালিকা (Players)"
            >
              <Trophy className="w-5 h-5" />
            </button>
            <button
              onClick={() => { sound.playClick(); setShowHelpModal(true); }}
              className="w-10 h-10 rounded-full bg-slate-900/90 border border-yellow-500/50 hover:border-yellow-300 flex items-center justify-center text-yellow-400 shadow-lg active:scale-95 transition-all"
              title="সাহায্য ও নিয়ম (Help)"
            >
              <Info className="w-5 h-5" />
            </button>
            <button
              onClick={() => { sound.playClick(); setShowSettingsModal(true); }}
              className="w-10 h-10 rounded-full bg-slate-900/90 border border-yellow-500/50 hover:border-yellow-300 flex items-center justify-center text-yellow-400 shadow-lg active:scale-95 transition-all"
              title="সেটিংস (Settings)"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MAIN CASINO VELVET TABLE (Exact Oval with Velvet Felt) */}
        {/* ============================================================== */}
        <div className="relative flex-1 w-full max-w-5xl mx-auto rounded-[60px] sm:rounded-[90px] border-8 border-yellow-500/80 bg-gradient-to-br from-[#681878] via-[#85188f] to-[#4c095e] shadow-[0_0_50px_rgba(217,70,239,0.3)] flex flex-col justify-between p-3 sm:p-6 overflow-hidden my-1">
          {/* Subtle Inner Felt Texture & Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-600/30 via-transparent to-black/60 pointer-events-none" />

          {/* Surrounding Player Seats (Marsh, Lobo81, Marc, Landon, etc. as in Screenshot 1-7) */}
          <div className="absolute inset-x-4 top-4 flex justify-between pointer-events-none z-10">
            {/* Player 1 Left */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-black text-yellow-300 bg-black/60 px-2 py-0.5 rounded-full border border-yellow-400/40 mb-1">
                {otherPlayers[0]?.titleBadge || 'রিচি রিচ'}
              </span>
              <img src={otherPlayers[0]?.avatar} alt="" className="w-10 h-10 rounded-xl ring-2 ring-yellow-400 shadow-md object-cover" />
              <span className="text-[10px] font-bold text-white mt-0.5">{otherPlayers[0]?.name}</span>
              <span className="text-[9px] font-mono text-yellow-300 font-bold">{otherPlayers[0]?.chipsAmount}</span>
            </div>

            {/* Player 2 Right */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-black text-yellow-300 bg-black/60 px-2 py-0.5 rounded-full border border-yellow-400/40 mb-1">
                {otherPlayers[2]?.titleBadge || 'হিউম্যান ক্যালকুলেটর'}
              </span>
              <img src={otherPlayers[2]?.avatar} alt="" className="w-10 h-10 rounded-xl ring-2 ring-yellow-400 shadow-md object-cover" />
              <span className="text-[10px] font-bold text-white mt-0.5">{otherPlayers[2]?.name}</span>
              <span className="text-[9px] font-mono text-yellow-300 font-bold">{otherPlayers[2]?.chipsAmount}</span>
            </div>
          </div>

          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-10">
            {/* Player 3 Mid-Left */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-black text-yellow-300 bg-black/60 px-2 py-0.5 rounded-full border border-yellow-400/40 mb-1">
                {otherPlayers[1]?.titleBadge || 'মেগামিলিয়নেয়ার'}
              </span>
              <img src={otherPlayers[1]?.avatar} alt="" className="w-10 h-10 rounded-xl ring-2 ring-yellow-400 shadow-md object-cover" />
              <span className="text-[10px] font-bold text-white mt-0.5">{otherPlayers[1]?.name}</span>
              <span className="text-[9px] font-mono text-yellow-300 font-bold">{otherPlayers[1]?.chipsAmount}</span>
            </div>

            {/* Player 4 Mid-Right */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-black text-yellow-300 bg-black/60 px-2 py-0.5 rounded-full border border-yellow-400/40 mb-1">
                {otherPlayers[3]?.titleBadge || 'লাকি প্লেয়ার'}
              </span>
              <img src={otherPlayers[3]?.avatar} alt="" className="w-10 h-10 rounded-xl ring-2 ring-yellow-400 shadow-md object-cover" />
              <span className="text-[10px] font-bold text-white mt-0.5">{otherPlayers[3]?.name}</span>
              <span className="text-[9px] font-mono text-yellow-300 font-bold">{otherPlayers[3]?.chipsAmount}</span>
            </div>
          </div>

          {/* ============================================================== */}
          {/* CENTER DOME: Rolling Dice & Round Countdown Badge */}
          {/* ============================================================== */}
          <div className="relative z-20 flex flex-col items-center justify-center pt-1">
            {/* Countdown Badge (e.g., 8 বাজি, 2 অপেক্ষা) */}
            <div className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 border-2 border-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-yellow-500/30 mb-2 animate-bounce">
              <span className="font-mono text-base">{timeLeft}</span>
              <span>{phase === 'BETTING' ? 'বাজি (Betting)' : phase === 'ROLLING' ? 'অপেক্ষা (Rolling)' : 'ফলাফল (Reveal)'}</span>
            </div>

            {/* Center Dome Covering Dice */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-slate-900 via-slate-950 to-black border-4 border-yellow-400 shadow-[0_10px_25px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-emerald-950/40 rounded-full" />
              {/* Dice animation */}
              <div className={`relative z-10 flex items-center gap-1.5 ${phase === 'ROLLING' ? 'animate-spin' : ''}`}>
                <div className="w-7 h-7 sm:w-8 sm:h-8 transform hover:scale-110 transition-transform">
                  {renderPipDice(dice1, false)}
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 transform hover:scale-110 transition-transform">
                  {renderPipDice(dice2, true)}
                </div>
              </div>

              {/* Reveal Glow Ring */}
              {phase === 'REVEAL' && (
                <div className="absolute inset-0 border-4 border-yellow-300 rounded-full animate-ping pointer-events-none" />
              )}
            </div>

            {/* Sum Indicator */}
            {phase === 'REVEAL' && (
              <div className="mt-1 px-3 py-0.5 rounded-full bg-black/80 border border-yellow-400 text-yellow-300 font-mono font-black text-xs sm:text-sm">
                ডাইস যোগফল: {sum} ({resultTarget})
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* 3 BETTING ZONES: 2-6 (Down), 7 (Center Lucky), 8-12 (Up) */}
          {/* ============================================================== */}
          <div className="relative z-20 grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto w-full pt-2">
            
            {/* 1. DOWN (2 - 6) ZONE */}
            <div
              onClick={() => handleBetClick('DOWN')}
              className={`group relative rounded-3xl p-3 sm:p-5 border-3 transition-all cursor-pointer flex flex-col items-center justify-between min-h-[110px] sm:min-h-[140px] ${
                phase === 'REVEAL' && resultTarget === 'DOWN'
                  ? 'border-yellow-300 bg-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.5)] scale-105'
                  : userBets.DOWN > 0
                  ? 'border-emerald-400 bg-emerald-950/40'
                  : 'border-fuchsia-400/40 bg-purple-950/50 hover:border-yellow-400/80 hover:bg-purple-900/60'
              }`}
            >
              <div className="text-center">
                <span className="text-2xl sm:text-4xl font-black tracking-tight text-white/90 drop-shadow">
                  2 - 6
                </span>
                <span className="block text-[11px] sm:text-xs font-black text-yellow-300 font-mono">
                  1 : 1
                </span>
              </div>

              {/* Placed chips indicator */}
              <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-300 pt-1">
                <span className="text-[10px] text-fuchsia-200">👥 {totalBets.DOWN}</span>
                {userBets.DOWN > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] shadow">
                    আপনার: ৳{userBets.DOWN}
                  </span>
                )}
              </div>
            </div>

            {/* 2. LUCKY 7 ZONE (Center with Lightning) */}
            <div
              onClick={() => handleBetClick('SEVEN')}
              className={`group relative rounded-3xl p-3 sm:p-5 border-3 transition-all cursor-pointer flex flex-col items-center justify-between min-h-[110px] sm:min-h-[140px] ${
                phase === 'REVEAL' && resultTarget === 'SEVEN'
                  ? 'border-yellow-300 bg-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.5)] scale-105'
                  : userBets.SEVEN > 0
                  ? 'border-cyan-400 bg-cyan-950/40'
                  : 'border-fuchsia-400/40 bg-purple-950/50 hover:border-yellow-400/80 hover:bg-purple-900/60'
              }`}
            >
              <div className="text-center relative">
                <span className="text-3xl sm:text-5xl font-black text-yellow-300 drop-shadow flex items-center justify-center gap-1">
                  7
                </span>
                <span className="inline-block text-[10px] sm:text-xs font-black text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-400 font-mono">
                  1:4 ⚡ 6X
                </span>
              </div>

              {/* Placed chips indicator */}
              <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-300 pt-1">
                <span className="text-[10px] text-fuchsia-200">👥 {totalBets.SEVEN}</span>
                {userBets.SEVEN > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-black text-[10px] shadow">
                    আপনার: ৳{userBets.SEVEN}
                  </span>
                )}
              </div>
            </div>

            {/* 3. UP (8 - 12) ZONE */}
            <div
              onClick={() => handleBetClick('UP')}
              className={`group relative rounded-3xl p-3 sm:p-5 border-3 transition-all cursor-pointer flex flex-col items-center justify-between min-h-[110px] sm:min-h-[140px] ${
                phase === 'REVEAL' && resultTarget === 'UP'
                  ? 'border-yellow-300 bg-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.5)] scale-105'
                  : userBets.UP > 0
                  ? 'border-emerald-400 bg-emerald-950/40'
                  : 'border-fuchsia-400/40 bg-purple-950/50 hover:border-yellow-400/80 hover:bg-purple-900/60'
              }`}
            >
              <div className="text-center">
                <span className="text-2xl sm:text-4xl font-black tracking-tight text-white/90 drop-shadow">
                  8 - 12
                </span>
                <span className="block text-[11px] sm:text-xs font-black text-yellow-300 font-mono">
                  1 : 1
                </span>
              </div>

              {/* Placed chips indicator */}
              <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-300 pt-1">
                <span className="text-[10px] text-fuchsia-200">👥 {totalBets.UP}</span>
                {userBets.UP > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] shadow">
                    আপনার: ৳{userBets.UP}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* WIN RIBBON CELEBRATION OVERLAY (Exact match to Screenshot 2) */}
          {lastWinMessage && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center justify-center animate-scale-in pointer-events-none">
              <div className="relative px-8 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-amber-500 to-red-600 border-4 border-yellow-300 shadow-[0_0_50px_rgba(234,179,8,0.8)] text-center">
                <h3 className="text-xl sm:text-3xl font-black text-white drop-shadow tracking-wider">
                  তুমি জিতেছিলে
                </h3>
                <span className="font-mono text-2xl sm:text-4xl font-black text-yellow-200 tracking-wider">
                  {lastWinMessage.replace('তুমি জিতেছিলে ', '')}
                </span>
              </div>
            </div>
          )}

          {/* Error Toast if user tries mutual exclusion violation */}
          {errorToast && (
            <div className="absolute top-2 inset-x-8 z-30 flex justify-center animate-fade-in pointer-events-none">
              <div className="bg-red-950/90 text-red-200 border border-red-500 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorToast}</span>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* BOTTOM BAR: User Profile, Balance & Authentic Chips Tray */}
        {/* ============================================================== */}
        <div className="flex items-center justify-between gap-3 z-20 pt-1">
          {/* User Profile Card with Live ৳ Balance (Matching Screenshot 1-7) */}
          <div className="flex items-center gap-2.5 p-1.5 sm:p-2 rounded-2xl bg-black/70 border border-yellow-500/40 backdrop-blur-md">
            <img 
              src={currentUser?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=MOON2007'} 
              alt="" 
              className="w-10 h-10 rounded-xl ring-2 ring-yellow-400 object-cover" 
            />
            <div className="pr-2">
              <span className="text-xs font-black text-white block truncate max-w-[100px]">
                {currentUser?.nickname || currentUser?.username || 'MOON2007'}
              </span>
              <div className="flex items-center gap-1 text-xs font-mono font-black text-yellow-400">
                <span>🪙</span>
                <span>৳ {currentUser?.totalBalance?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>

          {/* Chips Rack: 10, 50, 100, 500, 1K, 5K */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto p-1 custom-scrollbar">
            {chips.map((chip) => {
              const isSelected = selectedChip === chip.value;
              return (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => {
                    sound.playChip();
                    setSelectedChip(chip.value);
                  }}
                  className={`relative w-11 h-11 sm:w-13 sm:h-13 rounded-full border-3 border-dashed border-white/60 shadow-xl flex items-center justify-center font-black text-xs sm:text-sm font-mono transition-all transform active:scale-95 cursor-pointer ${
                    chip.bg
                  } ${chip.text} ${
                    isSelected 
                      ? 'ring-4 ring-yellow-300 scale-110 -translate-y-1.5 shadow-[0_0_20px_rgba(250,204,21,0.6)]' 
                      : 'opacity-90 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <span className="drop-shadow-md">{chip.label}</span>
                </button>
              );
            })}
          </div>

          {/* Table Spectator Live Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 border border-yellow-500/30 text-xs font-bold text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>24/7 LIVE</span>
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* 1. TREND GRAPH MODAL (Exact match to Screenshot 5) */}
      {/* ============================================================== */}
      {showTrendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#2d0943] to-[#140420] border-4 border-yellow-400 shadow-2xl p-4 sm:p-6 text-white animate-scale-in space-y-4">
            <div className="flex items-center justify-between border-b border-yellow-500/30 pb-2">
              <h3 className="text-lg font-black text-yellow-300 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>ট্রেন্ড চার্ট (Trend Analysis)</span>
              </h3>
              <button 
                onClick={() => setShowTrendModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* SVG Trend Polyline Chart */}
            <div className="w-full h-48 bg-[#1f0530] rounded-2xl border border-yellow-500/30 p-2 relative flex items-center justify-center overflow-x-auto">
              <svg className="w-full h-full" viewBox="0 0 600 150">
                {/* Horizontal guide grids */}
                <line x1="0" y1="25" x2="600" y2="25" stroke="#4a1566" strokeDasharray="3 3" />
                <line x1="0" y1="75" x2="600" y2="75" stroke="#4a1566" strokeDasharray="3 3" />
                <line x1="0" y1="125" x2="600" y2="125" stroke="#4a1566" strokeDasharray="3 3" />

                {/* Connecting Trend Line */}
                <polyline
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth="3"
                  points={history.slice(0, 15).reverse().map((h, idx) => {
                    const x = 30 + idx * 38;
                    // Scale sum (2-12) to y (130 to 20)
                    const y = 140 - ((h.sum - 2) / 10) * 115;
                    return `${x},${y}`;
                  }).join(' ')}
                />

                {/* Data points */}
                {history.slice(0, 15).reverse().map((h, idx) => {
                  const x = 30 + idx * 38;
                  const y = 140 - ((h.sum - 2) / 10) * 115;
                  const color = h.target === 'SEVEN' ? '#06b6d4' : h.target === 'UP' ? '#22c55e' : '#ef4444';
                  return (
                    <g key={idx}>
                      <circle cx={x} cy={y} r="8" fill={color} stroke="#ffffff" strokeWidth="2" />
                      <text x={x} y={y + 3} textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                        {h.sum}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Bottom Dice Pairs Grid */}
            <div className="flex items-center gap-1.5 overflow-x-auto p-2 bg-[#1f0530] rounded-xl border border-yellow-500/20 custom-scrollbar">
              {history.slice(0, 15).map((h, idx) => (
                <div key={idx} className="flex flex-col items-center shrink-0 p-1 bg-black/40 rounded-lg border border-slate-700">
                  <div className="flex gap-0.5">
                    <div className="w-4 h-4">{renderPipDice(h.dice1, false)}</div>
                    <div className="w-4 h-4">{renderPipDice(h.dice2, true)}</div>
                  </div>
                  <span className={`text-[10px] font-mono font-black mt-0.5 ${
                    h.target === 'SEVEN' ? 'text-cyan-400' : h.target === 'UP' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {h.sum}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. HELP & RULES MODAL (Exact match to Screenshot 3) */}
      {/* ============================================================== */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#2d0943] to-[#140420] border-4 border-yellow-400 shadow-2xl p-5 sm:p-6 text-white animate-scale-in space-y-4">
            <div className="flex items-center justify-between border-b border-yellow-500/30 pb-2">
              <h3 className="text-lg font-black text-yellow-300 flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                <span>সাহায্য ও খেলার নিয়ম (Help & Rules)</span>
              </h3>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              <div className="p-3 rounded-2xl bg-black/40 border border-yellow-500/30 space-y-1.5">
                <h4 className="font-bold text-yellow-300 text-sm">খেলার নিয়ম:</h4>
                <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                  <li>৭ আপ ৭ ডাউন হলো দুটি ৬-পার্শ্বযুক্ত পাশার একটা সাধারণ খেলা।</li>
                  <li><b>বড় (Up 8-12):</b> দুটি পাশার মোট সংখ্যা ৭ এর চেয়ে বেশি হলে 1:1 পেআউট।</li>
                  <li><b>ছোট (Down 2-6):</b> দুটি পাশার মোট সংখ্যা ৭ এর কম হলে 1:1 পেআউট।</li>
                  <li><b>৭ এর সমান (Lucky 7):</b> দুটি পাশার মোট সংখ্যা ৭ হলে 1:4 বা লাইটনিংয়ে 6X পর্যন্ত পেআউট!</li>
                  <li><b>মিউচুয়াল রুল:</b> আপে ধরলে ডাউনে ধরা যাবে না, ডাউনে ধরলে আপে ধরা যাবে না (৭-এ অপশনাল ধরা যাবে)।</li>
                </ul>
              </div>

              {/* Lightning Payout Display Box (Matching Screenshot 3) */}
              <div className="p-3 rounded-2xl bg-black/60 border border-purple-500/40 space-y-2">
                <span className="text-xs font-black text-cyan-300 block text-center uppercase tracking-wider">
                  লাইটনিং পেআউট (Lightning Payout)
                </span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-400">
                    <span className="text-xs font-bold block text-slate-300">2 - 6</span>
                    <span className="font-mono text-sm font-black text-yellow-300">1X ⚡ 2X</span>
                  </div>
                  <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-400">
                    <span className="text-xs font-bold block text-cyan-300">7</span>
                    <span className="font-mono text-sm font-black text-yellow-300">4X ⚡ 6X</span>
                  </div>
                  <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-400">
                    <span className="text-xs font-bold block text-slate-300">8 - 12</span>
                    <span className="font-mono text-sm font-black text-yellow-300">1X ⚡ 2X</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. SETTINGS MODAL (Exact match to Screenshot 1) */}
      {/* ============================================================== */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#2d0943] to-[#140420] border-4 border-yellow-400 shadow-2xl p-5 text-white animate-scale-in space-y-4">
            <div className="flex items-center justify-between border-b border-yellow-500/30 pb-2">
              <h3 className="text-base font-black text-yellow-300">বিন্যাস (Settings)</h3>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 py-2">
              {/* Music Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>সঙ্গীত (Music)</span>
                  <span className="font-mono text-yellow-400">{musicVol}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={musicVol} 
                  onChange={(e) => setMusicVol(Number(e.target.value))}
                  className="w-full accent-yellow-400"
                />
              </div>

              {/* Sound Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>শব্দ (Sound Effects)</span>
                  <span className="font-mono text-yellow-400">{soundVol}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={soundVol} 
                  onChange={(e) => setSoundVol(Number(e.target.value))}
                  className="w-full accent-yellow-400"
                />
              </div>

              {/* Player ID */}
              <div className="p-2.5 rounded-xl bg-black/50 border border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-400">আইডি:</span>
                <span className="font-mono font-bold text-yellow-300">{currentUser?.ffUid || '3795385'}</span>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleClose}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs"
                >
                  প্রস্থান করুন (Exit)
                </button>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-purple-900 border border-purple-400 text-white font-bold text-xs"
                >
                  পেছনে (Back)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. PLAYERS LIST MODAL (Exact match to Screenshot 4) */}
      {/* ============================================================== */}
      {showPlayersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#2d0943] to-[#140420] border-4 border-yellow-400 shadow-2xl p-5 text-white animate-scale-in space-y-4">
            <div className="flex items-center justify-between border-b border-yellow-500/30 pb-2">
              <h3 className="text-base font-black text-yellow-300 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <span>খেলোয়াড়ের তালিকা (Top High Rollers)</span>
              </h3>
              <button 
                onClick={() => setShowPlayersModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto custom-scrollbar pr-1">
              {otherPlayers.map((p, idx) => (
                <div key={p.id} className="p-3 rounded-2xl bg-black/50 border border-purple-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={p.avatar} alt="" className="w-10 h-10 rounded-xl ring-2 ring-yellow-400 object-cover" />
                    <div>
                      <span className="text-[10px] font-bold text-yellow-300 block">{p.titleBadge}</span>
                      <span className="font-black text-white text-sm">{p.name}</span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-amber-400 font-black block">বাজি: ৳{p.chipsAmount.toLocaleString()}</span>
                    <span className="text-[11px] text-emerald-400 font-bold">জয়: {9 + idx}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
