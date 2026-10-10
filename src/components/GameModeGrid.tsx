import React from 'react';
import { useApp } from '../context/AppContext';
import { sound } from '../services/sound';
import { ASSET_IMAGES } from '../assets/images';
import { Swords, Dice5, Sparkles, Flame, Shield, Users, Target, Zap } from 'lucide-react';

interface GameModeGridProps {
  selectedCategory: string | 'ALL';
  onSelectCategory: (cat: string | 'ALL') => void;
}

export const GameModeGrid: React.FC<GameModeGridProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const { 
    tournaments, 
    modes, 
    setActiveModal, 
    setIs7Up7DownModalOpen, 
    settings 
  } = useApp();

  // Active Free Fire Modes (filter only enabled ones)
  const activeFFModes = modes.filter(m => m.isEnabled && m.isFreeFire);

  // Other Games configuration
  const otherGames = [
    {
      id: 'seven-up-seven-down',
      name: '৭ আপ ৭ ডাউন (7 Up 7 Down)',
      badgeText: '24/7 LIVE CASINO',
      tag: 'HOT LIVE',
      image: ASSET_IMAGES.gameMode7Up7Down,
      accent: 'border-purple-500/60 shadow-purple-500/20',
      action: 'SEVEN_UP'
    },
    {
      id: 'ludo-king',
      name: 'লুডু কিং এরিনা (Ludo King)',
      badgeText: '1v1, 2v2, 4v4',
      tag: 'REAL BOARD',
      image: ASSET_IMAGES.gameModeLudo,
      accent: 'border-yellow-500/60 shadow-yellow-500/20',
      action: 'LUDO'
    },
    {
      id: 'snake-ladder',
      name: 'সাপ-লুডু (Snake & Ladder)',
      badgeText: 'Classic 100 Tiles',
      tag: 'INSTANT WIN',
      image: ASSET_IMAGES.gameModeSnake,
      accent: 'border-rose-500/60 shadow-rose-500/20',
      action: 'SNAKE'
    }
  ];

  const handleFFModeClick = (modeName: string) => {
    sound.playClick();
    if (selectedCategory === modeName) {
      onSelectCategory('ALL');
    } else {
      onSelectCategory(modeName);
      const el = document.getElementById('matches-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOtherGameClick = (action: string) => {
    sound.playClick();
    if (action === 'SEVEN_UP') {
      setIs7Up7DownModalOpen(true);
    } else if (action === 'LUDO') {
      setActiveModal('LUDO_ARENA');
    } else if (action === 'SNAKE') {
      setActiveModal('SNAKE_LADDER');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. FREE FIRE MODES (On Top, as requested) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-6 rounded-full bg-gradient-to-b from-amber-400 to-yellow-600" />
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>ফ্রি ফায়ার গেম মোড সমূহ (Free Fire Modes)</span>
            </h3>
            <span className="text-xs text-slate-500 font-bold">({activeFFModes.length}টি অ্যাক্টিভ)</span>
          </div>

          {selectedCategory !== 'ALL' && (
            <button
              onClick={() => {
                sound.playClick();
                onSelectCategory('ALL');
              }}
              className="text-xs font-bold text-amber-500 hover:text-amber-400 underline underline-offset-4 cursor-pointer"
            >
              সবগুলো ম্যাচ দেখুন (Show All)
            </button>
          )}
        </div>

        {/* Free Fire Modes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {activeFFModes.map((mode) => {
            const matchCount = tournaments.filter(
              (t) => (t.category === mode.name || t.modeId === mode.id) && t.status === 'UPCOMING'
            ).length;
            const isSelected = selectedCategory === mode.name;

            return (
              <div
                key={mode.id}
                onClick={() => handleFFModeClick(mode.name)}
                className={`group relative overflow-hidden rounded-2xl border bg-white dark:bg-slate-900/90 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl ${
                  isSelected
                    ? 'ring-2 ring-amber-400 border-amber-400 shadow-amber-500/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-amber-500/50'
                }`}
              >
                <div className="relative h-24 sm:h-28 w-full overflow-hidden bg-slate-950">
                  <img
                    src={mode.image || ASSET_IMAGES.gameModeFreeFire}
                    alt={mode.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <span className="absolute top-2 right-2 text-[10px] font-bold text-white px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10">
                    {mode.badgeText || 'FF Mode'}
                  </span>
                  <div className="absolute bottom-2 left-2 text-[11px] font-bold text-amber-300 font-mono">
                    {matchCount > 0 ? `${matchCount}টি ম্যাচ লাইভ` : 'ম্যাচ আসছে'}
                  </div>
                </div>

                <div className="p-2.5 space-y-1">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors truncate">
                    {mode.name}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Free Fire</span>
                    <span className="font-mono text-amber-500 font-bold">
                      {isSelected ? 'SELECTED ✓' : 'ENTER →'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. DIVIDER LINE WITH "OTHERS GAME / আদার্স গেম" (Exact request) */}
      <div className="space-y-3 pt-2">
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-300 dark:border-slate-800 w-full" />
          <div className="bg-slate-100 dark:bg-black px-4 py-1 rounded-full border border-purple-500/40 text-xs font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 shrink-0 shadow-sm flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>আদার্স গেম (OTHERS GAMES)</span>
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
          </div>
          <div className="border-t border-slate-300 dark:border-slate-800 w-full" />
        </div>

        {/* Other Games Cards (7 Up 7 Down, Ludo King, Snake & Ladder) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {otherGames.map((game) => (
            <div
              key={game.id}
              onClick={() => handleOtherGameClick(game.action)}
              className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br from-slate-900 to-slate-950 text-white transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-2xl ${game.accent}`}
            >
              <div className="relative h-32 sm:h-36 w-full overflow-hidden">
                <img
                  src={game.image}
                  alt={game.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-600 text-white shadow-lg animate-pulse">
                    {game.tag}
                  </span>
                </div>
                <div className="absolute bottom-2.5 left-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-black/70 px-2 py-0.5 rounded border border-amber-500/30">
                    {game.badgeText}
                  </span>
                </div>
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm sm:text-base font-black text-white group-hover:text-yellow-300 transition-colors">
                    {game.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {game.action === 'SEVEN_UP'
                      ? '২-৬ ডাউন, ৭ লাকি ও ৮-১২ আপ বাজি'
                      : game.action === 'LUDO'
                      ? 'আসল ডাইস রোলিং ও লাইভ বোর্ড'
                      : '১০০ ঘরে সাপ ও মই লড়াই'}
                  </p>
                </div>
                <button
                  type="button"
                  className="py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs group-hover:scale-105 active:scale-95 transition-transform shrink-0"
                >
                  PLAY ⚡
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
