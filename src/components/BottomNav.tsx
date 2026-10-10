import React from 'react';
import { Home, Calendar, BarChart2, User } from 'lucide-react';
import { sound } from '../services/sound';

export type MainTabType = 'HOME' | 'MY_MATCHES' | 'RESULT' | 'PROFILE';

interface BottomNavProps {
  activeTab: MainTabType;
  onChangeTab: (tab: MainTabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    {
      id: 'HOME' as MainTabType,
      label: 'হোম',
      icon: Home
    },
    {
      id: 'MY_MATCHES' as MainTabType,
      label: 'মাই ম্যাচ',
      icon: Calendar
    },
    {
      id: 'RESULT' as MainTabType,
      label: 'রেজাল্ট',
      icon: BarChart2
    },
    {
      id: 'PROFILE' as MainTabType,
      label: 'প্রোফাইল',
      icon: User
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800/80 px-2 py-1.5 shadow-2xl transition-all">
      <div className="max-w-md mx-auto grid grid-cols-4 items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                onChangeTab(tab.id);
              }}
              className="flex flex-col items-center justify-center py-1 select-none transition-transform active:scale-95 group focus:outline-none cursor-pointer"
            >
              <div
                className={`relative px-4 py-1 rounded-xl transition-all ${
                  isActive
                    ? 'bg-blue-600/15 dark:bg-blue-600/30 text-blue-600 dark:text-cyan-400'
                    : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400'}`} />
              </div>
              <span
                className={`text-[10px] tracking-wider uppercase font-bold mt-0.5 transition-colors ${
                  isActive ? 'text-blue-600 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-cyan-400 mt-0.5 shadow-sm shadow-blue-400/50" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
