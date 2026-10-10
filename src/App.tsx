import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { WinnerTicker } from './components/WinnerTicker';
import { HeroSlider } from './components/HeroSlider';
import { NoticeModal } from './components/NoticeModal';
import { SponsorBanner } from './components/SponsorBanner';
import { GameModeGrid } from './components/GameModeGrid';
import { TournamentCard } from './components/TournamentCard';
import { JoinMatchModal } from './components/JoinMatchModal';
import { SlotViewerModal } from './components/SlotViewerModal';
import { RoomIdModal } from './components/RoomIdModal';
import { WalletModal } from './components/WalletModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { SupportFAB } from './components/SupportFAB';
import { BlockedScreen } from './components/BlockedScreen';
import { LudoArenaModal } from './components/ludo/LudoArenaModal';
import { SnakeLadderModal } from './components/ludo/SnakeLadderModal';
import { SevenUpDownModal } from './components/sevenup/SevenUpDownModal';
import { AuthModal } from './components/auth/AuthModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { BottomNav, MainTabType } from './components/BottomNav';
import { MyMatchesView } from './components/views/MyMatchesView';
import { ResultView } from './components/views/ResultView';
import { ProfileView } from './components/views/ProfileView';
import { Swords } from 'lucide-react';
import { sound } from './services/sound';

const MainAppContent: React.FC = () => {
  const { 
    currentUser, 
    tournaments, 
    setActiveModal, 
    settings 
  } = useApp();

  const [activeTab, setActiveTab] = useState<MainTabType>('HOME');
  const [selectedCategory, setSelectedCategory] = useState<string | 'ALL'>('ALL');

  // Trigger notice modal on first load if enabled
  useEffect(() => {
    if (settings.popupNotice?.enabled) {
      const timer = setTimeout(() => {
        setActiveModal('NOTICE');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // If user is blocked, display blocked screen
  if (currentUser?.isBlocked) {
    return <BlockedScreen />;
  }

  const filteredTournaments = selectedCategory === 'ALL'
    ? tournaments
    : tournaments.filter((t) => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* 1. Header Bar with 10-Click Admin Trigger & Theme Switcher */}
      <Header onSelectTab={setActiveTab} />

      {/* 2. Scrolling Winner Ticker with Real Data */}
      <WinnerTicker />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-5 pb-28">
        {/* VIEW 1: HOME */}
        {activeTab === 'HOME' && (
          <div className="space-y-6 animate-fade-in">
            {/* Promo Banner Carousel */}
            <HeroSlider />

            {/* TikTok Video Earning Banner */}
            <SponsorBanner />

            {/* Game Mode Category Grid (Free Fire on Top, Others Games Below) */}
            <GameModeGrid 
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Tournaments Match List */}
            <section id="matches-section" className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-6 rounded-full bg-blue-600 dark:bg-cyan-400" />
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <Swords className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                    <span>
                      {selectedCategory === 'ALL' 
                        ? 'লাইভ ও আসন্ন ম্যাচ সমূহ (Active Matches)' 
                        : `${selectedCategory} এর ম্যাচ সমূহ`}
                    </span>
                  </h3>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {filteredTournaments.length}টি ম্যাচ পাওয়া গেছে
                </div>
              </div>

              {filteredTournaments.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
                  <Swords className="w-10 h-10 text-slate-400 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    এই মোডে বর্তমানে কোনো ম্যাচ সক্রিয় নেই
                  </h4>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setSelectedCategory('ALL');
                    }}
                    className="mt-2 py-1.5 px-4 rounded-xl bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    সবগুলো ম্যাচ দেখুন
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTournaments.map((tournament) => (
                    <TournamentCard
                      key={tournament.id}
                      tournament={tournament}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* VIEW 2: MY MATCHES (Dedicated Tab) */}
        {activeTab === 'MY_MATCHES' && (
          <MyMatchesView />
        )}

        {/* VIEW 3: RESULT (Dedicated Tab) */}
        {activeTab === 'RESULT' && (
          <ResultView />
        )}

        {/* VIEW 4: PROFILE (Dedicated Tab) */}
        {activeTab === 'PROFILE' && (
          <ProfileView />
        )}
      </main>

      {/* Floating Action Support FAB */}
      <SupportFAB />

      {/* FIXED 4-OPTION BOTTOM NAVIGATION BAR (Home, My Match, Result, Profile) */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />

      {/* Modals & Dialogs */}
      <NoticeModal />
      <JoinMatchModal />
      <SlotViewerModal />
      <RoomIdModal />
      <WalletModal />
      <LeaderboardModal />
      <LudoArenaModal />
      <SnakeLadderModal />
      <SevenUpDownModal />
      <AuthModal />

      {/* Secret Super Admin Login & Dashboard */}
      <AdminLoginModal />
      <SuperAdminDashboard />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
