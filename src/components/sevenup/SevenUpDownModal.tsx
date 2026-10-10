import React, { useState, useEffect } from 'react';
import { 
  X, Home, TrendingUp, Settings as SettingsIcon, Volume2, 
  HelpCircle, Trophy, Sparkles, Check, AlertCircle, Users 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../services/sound';

export const SevenUpDownModal: React.FC = () => {
  const { 
    currentUser, 
    users,
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
  const [musicVol, setMusicVol] = useState<number>(() => sound.getMusicVolume());
  const [soundVol, setSoundVol] = useState<number>(() => sound.getSoundVolume());

  // Error toast
  const [errorToast, setErrorToast] = useState<string | null>(null);

  // Auto bet toggle
  const [autoBetEnabled, setAutoBetEnabled] = useState<boolean>(false);

  const { 
    phase, 
    timeLeft, 
    dice1, 
    dice2, 
    sum, 
    resultTarget, 
    history, 
    userBets, 
    totalBets, 
    otherPlayers, 
    lastWinMessage 
  } = sevenUpDownRound;

  // Background Music playback management inside 7 Up 7 Down
  useEffect(() => {
    if (is7Up7DownModalOpen && settings.sevenUpDownConfig?.musicEnabled) {
      sound.playMusic(settings.sevenUpDownConfig?.musicUrl);
    } else {
      sound.stopMusic();
    }

    return () => {
      sound.stopMusic();
    };
  }, [is7Up7DownModalOpen, settings.sevenUpDownConfig?.musicEnabled, settings.sevenUpDownConfig?.musicUrl]);

  if (!is7Up7DownModalOpen) return null;

  // Has active bet placed in current round
  const hasActiveBet = (userBets.DOWN > 0 || userBets.SEVEN > 0 || userBets.UP > 0) && phase !== 'REVEAL';

  const handleAttemptClose = () => {
    sound.playClick();
    if (hasActiveBet) {
      sound.playError();
      setErrorToast('আপনি দান ধরেছেন! এই রাউন্ড শেষ না হওয়া পর্যন্ত বের হতে পারবেন না।');
      setTimeout(() => setErrorToast(null), 3500);
      return;
    }
    sound.stopMusic();
    setIs7Up7DownModalOpen(false);
  };

  const chips = [
    { value: 10, label: '10', bg: 'from-emerald-600 to-green-500', rim: 'border-emerald-300', glow: 'shadow-[0_0_16px_rgba(16,185,129,0.9)]' },
    { value: 50, label: '50', bg: 'from-blue-700 to-cyan-600', rim: 'border-cyan-300', glow: 'shadow-[0_0_16px_rgba(59,130,246,0.9)]' },
    { value: 100, label: '100', bg: 'from-indigo-800 to-purple-600', rim: 'border-indigo-300', glow: 'shadow-[0_0_16px_rgba(99,102,241,0.9)]' },
    { value: 500, label: '500', bg: 'from-red-800 to-rose-600', rim: 'border-rose-300', glow: 'shadow-[0_0_16px_rgba(239,68,68,0.9)]' },
    { value: 1000, label: '1K', bg: 'from-amber-600 to-yellow-500', rim: 'border-yellow-200', glow: 'shadow-[0_0_16px_rgba(245,158,11,0.9)]' },
    { value: 5000, label: '5K', bg: 'from-neutral-800 to-neutral-700', rim: 'border-neutral-400', glow: 'shadow-[0_0_16px_rgba(115,115,115,0.9)]' }
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
    const dotColor = isRed ? 'bg-red-600' : 'bg-neutral-900';
    switch (num) {
      case 1:
        return (
          <div className="w-full h-full bg-white rounded-[3px] border border-neutral-300 flex items-center justify-center p-0.5 shadow-sm">
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
          </div>
        );
      case 2:
        return (
          <div className="w-full h-full bg-white rounded-[3px] border border-neutral-300 p-0.5 flex justify-between shadow-sm">
            <span className={`w-1 h-1 rounded-full ${dotColor}`} />
            <span className={`w-1 h-1 rounded-full ${dotColor} self-end`} />
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full bg-white rounded-[3px] border border-neutral-300 p-0.5 flex flex-col justify-between shadow-sm">
            <span className={`w-1 h-1 rounded-full ${dotColor} self-start`} />
            <span className={`w-1 h-1 rounded-full ${dotColor} self-center`} />
            <span className={`w-1 h-1 rounded-full ${dotColor} self-end`} />
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full bg-white rounded-[3px] border border-neutral-300 p-0.5 grid grid-cols-2 grid-rows-2 gap-0.5 place-items-center shadow-sm">
            <span className={`w-1 h-1 rounded-full ${dotColor}`} />
            <span className={`w-1 h-1 rounded-full ${dotColor}`} />
            <span className={`w-1 h-1 rounded-full ${dotColor}`} />
            <span className={`w-1 h-1 rounded-full ${dotColor}`} />
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full bg-white rounded-[3px] border border-neutral-300 p-0.5 grid grid-cols-3 grid-rows-3 place-items-center shadow-sm">
            <span className={`w-1 h-1 rounded-full ${dotColor} col-start-1 row-start-1`} />
            <span className={`w-1 h-1 rounded-full ${dotColor} col-start-3 row-start-1`} />
            <span className={`w-1 h-1 rounded-full ${dotColor} col-start-2 row-start-2`} />
            <span className={`w-1 h-1 rounded-full ${dotColor} col-start-1 row-start-3`} />
            <span className={`w-1 h-1 rounded-full ${dotColor} col-start-3 row-start-3`} />
          </div>
        );
      case 6:
      default:
        return (
          <div className="w-full h-full bg-white rounded-[3px] border border-neutral-300 p-0.5 grid grid-cols-2 grid-rows-3 gap-0.5 place-items-center shadow-sm">
            <span className={`w-0.5 h-0.5 rounded-full ${dotColor}`} />
            <span className={`w-0.5 h-0.5 rounded-full ${dotColor}`} />
            <span className={`w-0.5 h-0.5 rounded-full ${dotColor}`} />
            <span className={`w-0.5 h-0.5 rounded-full ${dotColor}`} />
            <span className={`w-0.5 h-0.5 rounded-full ${dotColor}`} />
            <span className={`w-0.5 h-0.5 rounded-full ${dotColor}`} />
          </div>
        );
    }
  };

  // Split seats: 3 on left (highest balance), 3 on right (highest wins / win streak)
  const showBots = settings.sevenUpDownConfig?.showBots !== false;

  // Real registered users fallback when bots disabled (fair & transparent)
  const realPlayersLeft = [...users]
    .filter(u => u.role === 'player')
    .sort((a, b) => (b.totalBalance || 0) - (a.totalBalance || 0))
    .slice(0, 3)
    .map((u, idx) => ({
      id: u.id,
      name: u.nickname || u.username,
      avatar: u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username}`,
      chipsAmount: u.totalBalance || 0,
      titleBadge: idx === 0 ? 'রিচি রিচ' : idx === 1 ? 'মেগামিলিয়নেয়ার' : undefined,
      side: 'LEFT' as const,
      rank: (idx + 1) as 1 | 2 | 3
    }));

  const realPlayersRight = [...users]
    .filter(u => u.role === 'player')
    .sort((a, b) => (b.totalWins || 0) - (a.totalWins || 0))
    .slice(0, 3)
    .map((u, idx) => ({
      id: u.id,
      name: u.nickname || u.username,
      avatar: u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username}`,
      chipsAmount: u.totalBalance || 0,
      titleBadge: idx === 0 ? 'হিউম্যান ক্যালকুলেটর' : idx === 1 ? 'উইনিং কিং' : undefined,
      winStreak: u.totalWins || 0,
      side: 'RIGHT' as const,
      rank: (idx + 1) as 1 | 2 | 3
    }));

  const leftSeats = showBots
    ? [...otherPlayers.filter(p => p.side === 'LEFT')].sort((a, b) => b.chipsAmount - a.chipsAmount)
    : realPlayersLeft;

  const rightSeats = showBots
    ? [...otherPlayers.filter(p => p.side === 'RIGHT')].sort((a, b) => (b.winStreak || 0) - (a.winStreak || 0))
    : realPlayersRight;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 select-none overflow-hidden font-sans">
      
      {/* 16:9 SIDE-BY-SIDE LANDSCAPE ARENA CONTAINER (Matching exact 16:9 aspect ratio and pixel styling of IMG_20261010_231113_937.png) */}
      <div className="relative w-full max-w-[1280px] aspect-[16/9] max-h-[100vh] flex flex-col justify-between p-2 sm:p-3 text-white overflow-hidden shadow-2xl select-none bg-[#11011c]">
        
        {/* CASINO ROOM BACKGROUND PATTERN: Hexagonal Tiles Floor & Dark Tufted Wall Vibe */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-45"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 0%, rgba(192, 38, 211, 0.25) 0%, transparent 60%),
              radial-gradient(circle at 10% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 40%),
              radial-gradient(circle at 90% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 40%),
              linear-gradient(135deg, #1b0326 25%, transparent 25%),
              linear-gradient(225deg, #1b0326 25%, transparent 25%),
              linear-gradient(315deg, #1b0326 25%, transparent 25%),
              linear-gradient(45deg, #1b0326 25%, transparent 25%)
            `,
            backgroundSize: '100% 100%, 100% 100%, 100% 100%, 36px 36px, 36px 36px, 36px 36px, 36px 36px',
            backgroundPosition: '0 0, 0 0, 0 0, 18px 0, 18px 0, 0 0, 0 0'
          }}
        />

        {/* Ambient Dark Room Vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/85 pointer-events-none" />

        {/* ============================================================== */}
        {/* 1. TOP HEADER BAR: Home, Trend, 8-Dice History, Info, Settings */}
        {/* ============================================================== */}
        <div className="relative z-30 flex items-center justify-between gap-1 sm:gap-2 px-1 sm:px-2 pt-0.5">
          
          {/* Top Left Buttons: Home & Trend */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <button
              onClick={handleAttemptClose}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-[#2a083d] to-[#12021c] border-2 border-[#eab308] hover:border-yellow-300 flex items-center justify-center text-[#facc15] shadow-[0_0_12px_rgba(234,179,8,0.4)] active:scale-95 transition-all cursor-pointer"
              title="Home"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => { sound.playClick(); setShowTrendModal(true); }}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-[#2a083d] to-[#12021c] border-2 border-[#eab308] hover:border-yellow-300 flex items-center justify-center text-[#facc15] shadow-[0_0_12px_rgba(234,179,8,0.4)] active:scale-95 transition-all cursor-pointer"
              title="ট্রেন্ড চার্ট (Trend)"
            >
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Top Center: Dice History Beads (Exact match to 8 bead boxes in screenshot) */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#160224]/90 border border-yellow-500/70 shadow-inner">
            {history.slice(0, 8).map((h, i) => {
              const isLast = i === 0; // Latest roll on right or highlighted
              return (
                <div 
                  key={i} 
                  className={`flex flex-col items-center justify-center px-1 sm:px-1.5 py-0.5 rounded ${
                    isLast 
                      ? 'border-2 border-yellow-400 bg-yellow-500/15 shadow-[0_0_8px_rgba(250,204,21,0.5)]' 
                      : 'border border-yellow-600/30 bg-black/60'
                  }`}
                >
                  {/* Pair of Dice (One White, One Red Pip) */}
                  <div className="flex items-center gap-0.5 scale-75 origin-center">
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4">{renderPipDice(h.dice1, false)}</div>
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4">{renderPipDice(h.dice2, true)}</div>
                  </div>
                  {/* Sum & Lightning (Red for Down 2-6, Green for Up 8-12, Cyan for 7) */}
                  <div className="flex items-center gap-0.5 text-[9px] sm:text-[11px] font-mono font-black leading-none mt-0.5">
                    <span className={
                      h.target === 'SEVEN' 
                        ? 'text-cyan-400' 
                        : h.target === 'UP' 
                        ? 'text-emerald-400' 
                        : 'text-red-500'
                    }>
                      {h.sum}
                    </span>
                    {h.isLightning && (
                      <span className="text-yellow-400 text-[8px] sm:text-[10px]">⚡</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Top Right Buttons: Info & Settings */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <button
              onClick={() => { sound.playClick(); setShowHelpModal(true); }}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-[#2a083d] to-[#12021c] border-2 border-[#eab308] hover:border-yellow-300 flex items-center justify-center text-[#facc15] shadow-[0_0_12px_rgba(234,179,8,0.4)] active:scale-95 transition-all cursor-pointer font-serif text-base sm:text-lg font-black"
              title="সাহায্য ও নিয়ম (Help)"
            >
              i
            </button>
            <button
              onClick={() => { sound.playClick(); setShowSettingsModal(true); }}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-[#2a083d] to-[#12021c] border-2 border-[#eab308] hover:border-yellow-300 flex items-center justify-center text-[#facc15] shadow-[0_0_12px_rgba(234,179,8,0.4)] active:scale-95 transition-all cursor-pointer"
              title="সেটিংস (Settings)"
            >
              <SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. THE MAIN OVAL CASINO TABLE (Exact Design of Screenshot)     */}
        {/* ============================================================== */}
        <div className="relative flex-1 w-full max-w-[94%] mx-auto my-1 rounded-[55px] sm:rounded-[95px] md:rounded-[120px] border-[5px] sm:border-[7px] md:border-[9px] border-[#eab308] bg-gradient-to-b from-[#941984] via-[#851475] to-[#6b0f5e] shadow-[0_0_40px_rgba(234,179,8,0.45)] overflow-hidden flex flex-col justify-between">
          
          {/* Subtle Felt Texture & Inner Bevel Shadow */}
          <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.6)] pointer-events-none z-10" />

          {/* ============================================================== */}
          {/* 6 PLAYER SEATS (3 LEFT by Balance, 3 RIGHT by Win Streaks)     */}
          {/* ============================================================== */}
          {(showBots || leftSeats.length > 0 || rightSeats.length > 0) && (
            <>
              {/* LEFT SIDE: 3 Players (Ranked 1, 2, 3 by Highest Balance) */}
              <div className="absolute left-1 sm:left-3 inset-y-1.5 sm:inset-y-3 flex flex-col justify-between pointer-events-none z-20 w-20 sm:w-28">
                
                {/* 1. Top Left (Rank 1 Balance - রিচি রিচ) */}
                {leftSeats[0] && (
                  <div className="flex flex-col items-center">
                    <div className="relative mb-0.5">
                      <span className="text-[8px] sm:text-[10px] font-black text-white bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 px-2 py-0.5 rounded-full border border-pink-300 shadow-[0_0_10px_rgba(236,72,153,0.8)] flex items-center gap-0.5 whitespace-nowrap animate-pulse">
                        <span>✨</span>
                        <span>{leftSeats[0].titleBadge || 'রিচি রিচ'}</span>
                        <span>✨</span>
                      </span>
                    </div>
                    <img 
                      src={leftSeats[0].avatar} 
                      alt="" 
                      className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl border-2 border-yellow-400 shadow-lg object-cover" 
                    />
                    <span className="text-[9px] sm:text-[11px] font-bold text-white leading-tight truncate max-w-full drop-shadow mt-0.5">
                      {leftSeats[0].name}
                    </span>
                    <span className="text-[9px] sm:text-[11px] font-mono font-bold text-yellow-300 drop-shadow">
                      {leftSeats[0].chipsAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                {/* 2. Mid Left (Rank 2 Balance - মেগামিলিয়নেয়ার) */}
                {leftSeats[1] && (
                  <div className="flex flex-col items-center">
                    <div className="relative mb-0.5">
                      <span className="text-[8px] sm:text-[10px] font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 px-2 py-0.5 rounded-full border border-indigo-300 shadow-[0_0_8px_rgba(168,85,247,0.8)] flex items-center gap-0.5 whitespace-nowrap">
                        <span>⭐</span>
                        <span>{leftSeats[1].titleBadge || 'মেগামিলিয়নেয়ার'}</span>
                        <span>⭐</span>
                      </span>
                    </div>
                    <img 
                      src={leftSeats[1].avatar} 
                      alt="" 
                      className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl border-2 border-yellow-400 shadow-lg object-cover" 
                    />
                    <span className="text-[9px] sm:text-[11px] font-bold text-white leading-tight truncate max-w-full drop-shadow mt-0.5">
                      {leftSeats[1].name}
                    </span>
                    <span className="text-[9px] sm:text-[11px] font-mono font-bold text-yellow-300 drop-shadow">
                      {leftSeats[1].chipsAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                {/* 3. Bottom Left (Rank 3 Balance - Narjy) */}
                {leftSeats[2] && (
                  <div className="flex flex-col items-center">
                    <img 
                      src={leftSeats[2].avatar} 
                      alt="" 
                      className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl border-2 border-pink-500 shadow-lg object-cover" 
                    />
                    <span className="text-[9px] sm:text-[11px] font-bold text-white leading-tight truncate max-w-full drop-shadow mt-0.5">
                      {leftSeats[2].name}
                    </span>
                    <span className="text-[9px] sm:text-[11px] font-mono font-bold text-yellow-300 drop-shadow">
                      {leftSeats[2].chipsAmount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* RIGHT SIDE: 3 Players (Ranked 1, 2, 3 by Highest Win Streak / Total Wins) */}
              <div className="absolute right-1 sm:right-3 inset-y-1.5 sm:inset-y-3 flex flex-col justify-between pointer-events-none z-20 w-20 sm:w-28">
                
                {/* 1. Top Right (Rank 1 Wins - হিউম্যান ক্যালকুলেটর) */}
                {rightSeats[0] && (
                  <div className="flex flex-col items-center">
                    <div className="relative mb-0.5">
                      <span className="text-[8px] sm:text-[10px] font-black text-amber-200 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 px-2 py-0.5 rounded-full border border-yellow-300 shadow-[0_0_10px_rgba(245,158,11,0.8)] flex items-center gap-0.5 whitespace-nowrap animate-pulse">
                        <span>👑</span>
                        <span>{rightSeats[0].titleBadge || 'হিউম্যান ক্যালকুলেটর'}</span>
                        <span>👑</span>
                      </span>
                    </div>
                    <img 
                      src={rightSeats[0].avatar} 
                      alt="" 
                      className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl border-2 border-yellow-400 shadow-lg object-cover" 
                    />
                    <span className="text-[9px] sm:text-[11px] font-bold text-white leading-tight truncate max-w-full drop-shadow mt-0.5">
                      {rightSeats[0].name}
                    </span>
                    <span className="text-[9px] sm:text-[11px] font-mono font-bold text-yellow-300 drop-shadow">
                      {rightSeats[0].chipsAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                {/* 2. Mid Right (Rank 2 Wins - name781757) */}
                {rightSeats[1] && (
                  <div className="flex flex-col items-center">
                    <img 
                      src={rightSeats[1].avatar} 
                      alt="" 
                      className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl border-2 border-yellow-400 shadow-lg object-cover" 
                    />
                    <span className="text-[9px] sm:text-[11px] font-bold text-white leading-tight truncate max-w-full drop-shadow mt-0.5">
                      {rightSeats[1].name}
                    </span>
                    <span className="text-[9px] sm:text-[11px] font-mono font-bold text-yellow-300 drop-shadow">
                      {rightSeats[1].chipsAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                {/* 3. Bottom Right (Rank 3 Wins - name528300) */}
                {rightSeats[2] && (
                  <div className="flex flex-col items-center">
                    <img 
                      src={rightSeats[2].avatar} 
                      alt="" 
                      className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl border-2 border-pink-500 shadow-lg object-cover" 
                    />
                    <span className="text-[9px] sm:text-[11px] font-bold text-white leading-tight truncate max-w-full drop-shadow mt-0.5">
                      {rightSeats[2].name}
                    </span>
                    <span className="text-[9px] sm:text-[11px] font-mono font-bold text-yellow-300 drop-shadow">
                      {rightSeats[2].chipsAmount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ============================================================== */}
          {/* TOP CENTER: Black Metallic Dome & Round Hanging Timer          */}
          {/* ============================================================== */}
          <div className="relative z-20 flex items-center justify-center gap-2 sm:gap-4 pt-1 sm:pt-2">
            
            {/* Round Hanging Timer Pocket-Watch / Medal Badge (e.g. 12 বাজি) */}
            <div className="relative flex flex-col items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-full border-3 sm:border-4 border-red-600 bg-yellow-400 text-slate-950 font-black shadow-[0_4px_10px_rgba(0,0,0,0.6)]">
              {/* Top loop ring hook */}
              <div className="absolute -top-1.5 w-3 h-2 rounded-full border border-yellow-600 bg-yellow-500/80 pointer-events-none" />
              <span className="font-mono text-xs sm:text-base leading-none font-black text-red-700">
                {timeLeft}
              </span>
              <span className="text-[8px] sm:text-[10px] leading-tight font-black text-red-700">
                {phase === 'BETTING' ? 'বাজি' : 'অপেক্ষা'}
              </span>
            </div>

            {/* Black Metallic Hemispherical Bell Dome Shaker */}
            <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-[#383838] via-[#1a1a1a] to-[#0a0a0a] border-2 sm:border-3 border-neutral-700 shadow-[0_12px_24px_rgba(0,0,0,0.9)] flex items-center justify-center overflow-hidden">
              {/* Chrome handle knob on top */}
              <div className="absolute top-1 sm:top-1.5 w-4 sm:w-6 h-2 sm:h-3 rounded-full bg-gradient-to-t from-neutral-800 to-neutral-300 border border-neutral-900 shadow" />

              {/* Dice inside dome */}
              <div className={`relative z-10 flex items-center gap-1 mt-1 ${phase === 'ROLLING' ? 'animate-spin' : ''}`}>
                <div className="w-5 h-5 sm:w-7 sm:h-7">
                  {renderPipDice(dice1, false)}
                </div>
                <div className="w-5 h-5 sm:w-7 sm:h-7">
                  {renderPipDice(dice2, true)}
                </div>
              </div>

              {/* Ping glow on reveal */}
              {phase === 'REVEAL' && (
                <div className="absolute inset-0 border-4 border-yellow-300 rounded-full animate-ping pointer-events-none" />
              )}
            </div>
          </div>

          {/* ============================================================== */}
          {/* THE 3 DISTINCT BETTING ZONES: Left (2-6), Center Arched (7), Right (8-12) */}
          {/* ============================================================== */}
          <div className="relative z-20 flex-1 grid grid-cols-3 max-w-[84%] mx-auto w-full px-2 items-stretch mt-1 mb-2">
            
            {/* 1. LEFT ZONE: 2 - 6 (Down) */}
            <div
              onClick={() => handleBetClick('DOWN')}
              className={`relative rounded-l-3xl p-2 sm:p-4 flex flex-col justify-between items-center cursor-pointer transition-all ${
                phase === 'REVEAL' && resultTarget === 'DOWN'
                  ? 'bg-yellow-400/25 ring-2 ring-yellow-300 shadow-[0_0_25px_rgba(234,179,8,0.7)]'
                  : userBets.DOWN > 0
                  ? 'bg-purple-950/60 ring-2 ring-emerald-400'
                  : 'hover:bg-purple-950/40'
              }`}
            >
              <div className="text-center pt-2 sm:pt-4">
                <span className="text-3xl sm:text-5xl md:text-6xl font-black text-purple-950/60 drop-shadow-[0_1px_1px_rgba(255,255,255,0.2)] tracking-tight block">
                  2-6
                </span>
                <span className="text-sm sm:text-base font-black text-purple-950/50 block -mt-1 font-mono">
                  1:1
                </span>
              </div>

              {/* Bottom Curved Red Indicator Pill `👥 0` */}
              <div className="w-full flex justify-center pb-1">
                <div className="flex items-center gap-1 px-3 sm:px-4 py-0.5 rounded-full bg-red-600/90 text-white font-mono font-bold text-[10px] sm:text-xs shadow border border-red-400">
                  <span className="opacity-80">👥</span>
                  <span>{userBets.DOWN > 0 ? `৳${userBets.DOWN}` : '0'}</span>
                </div>
              </div>
            </div>

            {/* 2. CENTER ZONE: 7 (Lucky 7 Arched Dome) */}
            <div
              onClick={() => handleBetClick('SEVEN')}
              className={`relative rounded-t-[50px] sm:rounded-t-[80px] p-2 sm:p-4 border-2 border-purple-400/40 bg-gradient-to-b from-[#7a1268] to-[#590b4c] flex flex-col justify-between items-center cursor-pointer transition-all ${
                phase === 'REVEAL' && resultTarget === 'SEVEN'
                  ? 'bg-yellow-400/35 ring-4 ring-yellow-300 shadow-[0_0_35px_rgba(234,179,8,0.85)] scale-102'
                  : userBets.SEVEN > 0
                  ? 'ring-2 ring-cyan-400'
                  : 'hover:brightness-110'
              }`}
            >
              {/* Top Curved Blue Header Ribbon with `👥 0` and `0 👥` */}
              <div className="w-full flex items-center justify-between px-2 pt-0.5 text-[9px] sm:text-[11px] font-mono text-blue-200">
                <span className="flex items-center gap-0.5">
                  <span>👥</span>
                  <span>0</span>
                </span>
                <span className="flex items-center gap-0.5">
                  <span>0</span>
                  <span>👥</span>
                </span>
              </div>

              {/* Huge Bold 7 & 1:4 */}
              <div className="text-center my-auto">
                <span className="text-4xl sm:text-6xl md:text-7xl font-black text-purple-950/60 drop-shadow-[0_1px_1px_rgba(255,255,255,0.2)] block leading-none">
                  7
                </span>
                <span className="text-sm sm:text-base font-black text-purple-950/50 block font-mono">
                  1:4
                </span>
              </div>

              {/* Bottom Center Circular Medallion with Lightning Bolts ⚡ & Red/Green indicators */}
              <div className="relative flex items-center justify-center">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-purple-950/80 border border-purple-400/50 shadow flex items-center justify-center overflow-hidden">
                  {/* Lightning bolts in circle */}
                  <div className="flex items-center justify-center gap-0.5 text-yellow-300 text-sm sm:text-base drop-shadow">
                    <span>⚡</span>
                    <span className="text-[10px] font-black text-yellow-200">⚡</span>
                    <span>⚡</span>
                  </div>
                </div>

                {/* Bottom Red & Green Split indicator badge underneath */}
                <div className="absolute -bottom-2 flex items-center gap-1 font-mono text-[9px] sm:text-[10px] text-white">
                  <span className="px-1.5 py-0.5 rounded-l-full bg-red-600/90 border border-red-400">0 👥</span>
                  <span className="px-1.5 py-0.5 rounded-r-full bg-green-600/90 border border-green-400">👥 0</span>
                </div>
              </div>

              {/* Active User Bet Indicator for 7 */}
              {userBets.SEVEN > 0 && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-mono font-black text-[10px] shadow">
                  ৳{userBets.SEVEN}
                </div>
              )}
            </div>

            {/* 3. RIGHT ZONE: 8 - 12 (Up) */}
            <div
              onClick={() => handleBetClick('UP')}
              className={`relative rounded-r-3xl p-2 sm:p-4 flex flex-col justify-between items-center cursor-pointer transition-all ${
                phase === 'REVEAL' && resultTarget === 'UP'
                  ? 'bg-yellow-400/25 ring-2 ring-yellow-300 shadow-[0_0_25px_rgba(234,179,8,0.7)]'
                  : userBets.UP > 0
                  ? 'bg-purple-950/60 ring-2 ring-emerald-400'
                  : 'hover:bg-purple-950/40'
              }`}
            >
              <div className="text-center pt-2 sm:pt-4">
                <span className="text-3xl sm:text-5xl md:text-6xl font-black text-purple-950/60 drop-shadow-[0_1px_1px_rgba(255,255,255,0.2)] tracking-tight block">
                  8-12
                </span>
                <span className="text-sm sm:text-base font-black text-purple-950/50 block -mt-1 font-mono">
                  1:1
                </span>
              </div>

              {/* Bottom Curved Green Indicator Pill `0 👥` */}
              <div className="w-full flex justify-center pb-1">
                <div className="flex items-center gap-1 px-3 sm:px-4 py-0.5 rounded-full bg-green-600/90 text-white font-mono font-bold text-[10px] sm:text-xs shadow border border-green-400">
                  <span>{userBets.UP > 0 ? `৳${userBets.UP}` : '0'}</span>
                  <span className="opacity-80">👥</span>
                </div>
              </div>
            </div>

          </div>

          {/* ============================================================== */}
          {/* WIN CELEBRATION BANNER: English "You Win" (Exact User Requirement) */}
          {/* ============================================================== */}
          {lastWinMessage && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center justify-center animate-scale-in pointer-events-none px-4">
              <div className="relative px-8 sm:px-14 py-3 sm:py-5 rounded-3xl bg-gradient-to-r from-red-600 via-amber-500 to-red-600 border-4 border-yellow-300 shadow-[0_0_70px_rgba(234,179,8,0.95)] text-center transform scale-105">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-xl sm:text-3xl animate-bounce">✨</span>
                  <h3 className="text-2xl sm:text-5xl font-black text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.85)] tracking-widest uppercase">
                    You Win
                  </h3>
                  <span className="text-xl sm:text-3xl animate-bounce">✨</span>
                </div>
                <span className="font-mono text-3xl sm:text-5xl md:text-6xl font-black text-yellow-200 tracking-wider drop-shadow-[0_3px_10px_rgba(0,0,0,0.95)]">
                  {lastWinMessage.replace('You Win ', '').replace('তুমি জিতেছিলে ', '')}
                </span>
              </div>
            </div>
          )}

          {/* Error / Locked Bet Toast */}
          {errorToast && (
            <div className="absolute top-2 inset-x-6 z-40 flex justify-center animate-fade-in pointer-events-none">
              <div className="bg-red-950/95 text-red-200 border-2 border-red-500 px-4 py-1.5 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorToast}</span>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* 3. BOTTOM CONTROL BAR: Profile, 6 Chips, Rebet, Player Count  */}
        {/* ============================================================== */}
        <div className="relative z-30 flex items-center justify-between gap-1 sm:gap-3 px-1 sm:px-2 py-0.5 rounded-full bg-gradient-to-r from-[#2c053d] via-[#3a0852] to-[#2c053d] border border-purple-500/40 shadow-xl">
          
          {/* User Profile Card on Left (Exact match to MOON2007 29.86 in screenshot) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 p-1 rounded-full bg-black/40 border border-yellow-500/30">
            <img 
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'} 
              alt="" 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-yellow-400 object-cover shadow" 
            />
            <div className="pr-2">
              <span className="text-[10px] sm:text-xs font-black text-white block truncate max-w-[80px] sm:max-w-[110px]">
                {currentUser?.nickname || currentUser?.username || 'MOON2007'}
              </span>
              <div className="flex items-center gap-1 text-[11px] sm:text-xs font-mono font-black text-yellow-300">
                <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center text-[8px] sm:text-[9px] font-bold">
                  $
                </span>
                <span>{currentUser?.totalBalance?.toFixed(2) || '29.86'}</span>
              </div>
            </div>
          </div>

          {/* 6 Circular Fluted Casino Chips: 10, 50, 100, 500, 1K, 5K */}
          <div className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto p-1 custom-scrollbar">
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
                  className={`relative w-8 h-8 sm:w-11 sm:h-11 rounded-full border-2 sm:border-3 border-dashed border-white/80 flex items-center justify-center font-black text-[10px] sm:text-xs font-mono transition-all transform active:scale-95 cursor-pointer bg-gradient-to-b ${
                    chip.bg
                  } ${
                    isSelected 
                      ? 'ring-3 sm:ring-4 ring-green-400 scale-110 -translate-y-1.5 shadow-[0_0_20px_rgba(34,197,94,0.9)] z-20' 
                      : 'opacity-90 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <span className="drop-shadow-md text-white">{chip.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action: Rebet Button & Player Counter (Exact match to screenshot) */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setAutoBetEnabled(!autoBetEnabled);
              }}
              className={`px-2.5 sm:px-4 py-1.5 rounded-xl text-[10px] sm:text-xs font-black transition-all cursor-pointer shadow-md ${
                autoBetEnabled 
                  ? 'bg-amber-500 text-slate-950 ring-2 ring-yellow-300' 
                  : 'bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 text-yellow-100 hover:brightness-110'
              }`}
            >
              <span className="block leading-none">নবায়ন করুন</span>
              <span className="block text-[8px] font-normal opacity-85 leading-none mt-0.5">অটো বাজি</span>
            </button>

            {/* Total Active Players Pill Button (e.g. 25) */}
            <button
              onClick={() => {
                sound.playClick();
                setShowPlayersModal(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#1b0326] border border-yellow-500/70 text-yellow-300 font-mono font-bold text-[10px] sm:text-xs shadow hover:border-yellow-300 cursor-pointer"
              title="খেলোয়াড়ের তালিকা"
            >
              <Users className="w-3.5 h-3.5 text-purple-300" />
              <span>25</span>
            </button>
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* 4. SUB-MODALS: Trend Graph, Rules, Settings, Players           */}
      {/* ============================================================== */}
      
      {/* Trend Graph Modal */}
      {showTrendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#2d0943] to-[#140420] border-4 border-yellow-400 shadow-2xl p-4 sm:p-6 text-white animate-scale-in space-y-4">
            <div className="flex items-center justify-between border-b border-yellow-500/30 pb-2">
              <h3 className="text-lg font-black text-yellow-300 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>ট্রেন্ড চার্ট (Trend Analysis)</span>
              </h3>
              <button 
                onClick={() => setShowTrendModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full h-48 bg-[#1f0530] rounded-2xl border border-yellow-500/30 p-2 relative flex items-center justify-center overflow-x-auto">
              <svg className="w-full h-full" viewBox="0 0 600 150">
                <line x1="0" y1="25" x2="600" y2="25" stroke="#4a1566" strokeDasharray="3 3" />
                <line x1="0" y1="75" x2="600" y2="75" stroke="#4a1566" strokeDasharray="3 3" />
                <line x1="0" y1="125" x2="600" y2="125" stroke="#4a1566" strokeDasharray="3 3" />

                <polyline
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth="3"
                  points={history.slice(0, 15).reverse().map((h, idx) => {
                    const x = 30 + idx * 38;
                    const y = 140 - ((h.sum - 2) / 10) * 115;
                    return `${x},${y}`;
                  }).join(' ')}
                />

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

            <div className="flex items-center gap-1.5 overflow-x-auto p-2 bg-[#1f0530] rounded-xl border border-yellow-500/20 custom-scrollbar">
              {history.slice(0, 15).map((h, idx) => (
                <div key={idx} className="flex flex-col items-center shrink-0 p-1 bg-black/40 rounded-lg border border-slate-700">
                  <div className="flex gap-0.5">
                    <div className="w-3.5 h-3.5">{renderPipDice(h.dice1, false)}</div>
                    <div className="w-3.5 h-3.5">{renderPipDice(h.dice2, true)}</div>
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

      {/* Rules / Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#2d0943] to-[#140420] border-4 border-yellow-400 shadow-2xl p-5 sm:p-6 text-white animate-scale-in space-y-4">
            <div className="flex items-center justify-between border-b border-yellow-500/30 pb-2">
              <h3 className="text-lg font-black text-yellow-300 flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                <span>সাহায্য ও খেলার নিয়ম (Rules)</span>
              </h3>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
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

      {/* Settings Modal (Volume control for BGM & SFX) */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#2d0943] to-[#140420] border-4 border-yellow-400 shadow-2xl p-5 text-white animate-scale-in space-y-4">
            <div className="flex items-center justify-between border-b border-yellow-500/30 pb-2">
              <h3 className="text-base font-black text-yellow-300">বিন্যাস (Settings)</h3>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 py-2">
              {/* Music Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>সঙ্গীত (Music Volume)</span>
                  <span className="font-mono text-yellow-400">{musicVol}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={musicVol} 
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setMusicVol(v);
                    sound.setMusicVolume(v);
                  }}
                  className="w-full accent-yellow-400 cursor-pointer"
                />
              </div>

              {/* Sound Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>শব্দ (Sound Effects Volume)</span>
                  <span className="font-mono text-yellow-400">{soundVol}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={soundVol} 
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setSoundVol(v);
                    sound.setSoundVolume(v);
                  }}
                  className="w-full accent-yellow-400 cursor-pointer"
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
                  onClick={handleAttemptClose}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs cursor-pointer"
                >
                  প্রস্থান করুন (Exit)
                </button>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-purple-900 border border-purple-400 text-white font-bold text-xs cursor-pointer"
                >
                  পেছনে (Back)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Players List Modal */}
      {showPlayersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#2d0943] to-[#140420] border-4 border-yellow-400 shadow-2xl p-5 text-white animate-scale-in space-y-4">
            <div className="flex items-center justify-between border-b border-yellow-500/30 pb-2">
              <h3 className="text-base font-black text-yellow-300 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <span>খেলোয়াড়ের তালিকা (Top Players)</span>
              </h3>
              <button 
                onClick={() => setShowPlayersModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto custom-scrollbar pr-1">
              {otherPlayers.map((p) => (
                <div key={p.id} className="p-3 rounded-2xl bg-black/50 border border-purple-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={p.avatar} alt="" className="w-10 h-10 rounded-xl ring-2 ring-yellow-400 object-cover" />
                    <div>
                      {p.titleBadge && (
                        <span className="text-[10px] font-bold text-yellow-300 block">{p.titleBadge}</span>
                      )}
                      <span className="font-black text-white text-sm">{p.name}</span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-amber-400 font-black block">ব্যালেন্স: ৳{p.chipsAmount.toLocaleString()}</span>
                    {p.winStreak && (
                      <span className="text-[11px] text-emerald-400 font-bold">উইন স্ট্রিক: {p.winStreak}</span>
                    )}
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
