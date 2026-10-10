import React, { useRef, useEffect } from 'react';
import { Trophy, Sun, Moon, Wallet, User as UserIcon, LogIn, Swords, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sound } from '../services/sound';

interface HeaderProps {
  onSelectTab?: (tab: 'HOME' | 'MY_MATCHES' | 'RESULT' | 'PROFILE') => void;
}

export const Header: React.FC<HeaderProps> = ({ onSelectTab }) => {
  const { 
    theme, 
    toggleTheme, 
    currentUser, 
    setActiveModal, 
    setIsAdminOpen,
    openAuthModal,
    logoutUser,
    settings 
  } = useApp();

  const clickCountRef = useRef<number>(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check URL hash for #admin support as an alternative convenience
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setIsAdminOpen]);

  // Exact 10 clicks within 3 seconds on brand logo/text opens Admin Panel!
  // If 3 seconds pass without reaching 10 clicks, resets to 0 (next click restarts count from 1).
  const handleBrandSecretClick = () => {
    sound.playClick();

    if (clickCountRef.current === 0) {
      clickCountRef.current = 1;
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickTimerRef.current = setTimeout(() => {
        // 3 seconds passed without reaching 10 clicks -> reset to 0
        clickCountRef.current = 0;
      }, 3000);
      return;
    }

    clickCountRef.current += 1;

    if (clickCountRef.current >= 10) {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickCountRef.current = 0;
      sound.playVictory();
      setIsAdminOpen(true);
    }
  };

  // Parse brand text into two parts for styling
  const brandWords = (settings.siteBrandText || 'XEB TOUR').split(' ');
  const firstWord = brandWords[0] || 'XEB';
  const restWords = brandWords.slice(1).join(' ') || 'TOUR';

  const isGuest = !currentUser || !currentUser.username;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/90 dark:bg-black/95 border-b border-slate-200 dark:border-slate-800/80 px-3 md:px-6 py-2.5 transition-colors duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-4">
        {/* Brand Zone with 10-Click within 3 seconds Secret Admin Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleBrandSecretClick}
            type="button"
            className="flex items-center gap-2 cursor-pointer focus:outline-none select-none transition-transform active:scale-95 text-left group"
            title="Click 10 times within 3 seconds to open Admin Panel"
          >
            {settings.siteLogoUrl ? (
              <img 
                src={settings.siteLogoUrl} 
                alt="Logo" 
                className="w-8 h-8 rounded-lg object-contain shadow-md"
              />
            ) : (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                {settings.siteLogoIcon || '⚡'}
              </div>
            )}
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-blue-600 dark:text-cyan-400 group-hover:text-blue-500 dark:group-hover:text-cyan-300 transition-colors">
                  {firstWord}
                </span>
                {restWords && (
                  <span className="text-xl sm:text-2xl font-bold tracking-wider text-slate-800 dark:text-slate-200 group-hover:text-black dark:group-hover:text-white transition-colors">
                    {restWords}
                  </span>
                )}
              </div>
              {settings.siteTagline && (
                <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider -mt-1 hidden sm:block">
                  {settings.siteTagline}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Right Navigation & Wallet Zone */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>

          {/* Leaderboard Trophy Icon */}
          <button
            onClick={() => {
              sound.playClick();
              setActiveModal('LEADERBOARD');
            }}
            className="p-2 rounded-xl text-yellow-600 dark:text-yellow-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Leaderboard & Rankings"
            aria-label="Leaderboard"
          >
            <Trophy className="w-5 h-5" />
          </button>

          {/* Real-Time Wallet Balance in BDT (৳) */}
          <button
            onClick={() => {
              sound.playClick();
              if (isGuest) {
                openAuthModal('LOGIN');
              } else {
                setActiveModal('WALLET');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-amber-500/50 text-slate-800 dark:text-amber-400 transition-all active:scale-95 cursor-pointer font-bold text-xs sm:text-sm shadow-sm"
            title="Open Digital Wallet"
          >
            <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-mono text-slate-900 dark:text-white text-xs sm:text-sm font-black tabular-nums">
              ৳ {currentUser?.totalBalance ?? 0}
            </span>
          </button>

          {/* User Profile or Auth Trigger */}
          {isGuest ? (
            <button
              onClick={() => {
                sound.playClick();
                openAuthModal('LOGIN');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>LOGIN</span>
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                if (onSelectTab) {
                  onSelectTab('PROFILE');
                } else {
                  setActiveModal('PROFILE');
                }
              }}
              className="flex items-center gap-1.5 p-1 rounded-full ring-2 ring-blue-500/40 hover:ring-blue-400 transition-all"
              title={currentUser.username}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-7 h-7 rounded-full bg-slate-800 object-cover"
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
