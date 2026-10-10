import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sound } from '../services/sound';

export const TopAdBanner: React.FC = () => {
  const { settings } = useApp();
  const ad = settings.topAdBanner;

  if (!ad || !ad.enabled) return null;

  const handleClick = () => {
    sound.playClick();
    if (ad.redirectUrl) {
      window.open(ad.redirectUrl, '_blank');
    }
  };

  return (
    <div className="w-full bg-slate-100 dark:bg-slate-950/80 border-b border-slate-200 dark:border-amber-500/20 py-2 px-2 flex flex-col items-center justify-center transition-colors">
      <div className="max-w-[728px] w-full relative flex flex-col items-center">
        {/* Tiny Ad badge */}
        <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500 pb-1 px-1">
          <span className="flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>স্পন্সরড বিজ্ঞাপন (728×90 Leaderboard)</span>
          </span>
          <span className="uppercase text-[9px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold">
            AD
          </span>
        </div>

        {ad.type === 'HTML' && ad.htmlCode ? (
          <div 
            className="w-full min-h-[70px] sm:h-[90px] rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 flex items-center justify-center shadow-sm"
            dangerouslySetInnerHTML={{ __html: ad.htmlCode }}
          />
        ) : (
          <div
            onClick={handleClick}
            className={`w-full h-[70px] sm:h-[90px] rounded-xl overflow-hidden border border-amber-500/30 relative group shadow-md transition-all ${
              ad.redirectUrl ? 'cursor-pointer hover:border-amber-400' : ''
            }`}
          >
            <img
              src={ad.imageUrl || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80'}
              alt="Advertisement"
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            {/* Subtle overlay with Call to action */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center justify-between px-4 sm:px-6">
              <div className="space-y-0.5">
                <span className="text-[10px] sm:text-xs font-black uppercase text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>XEB TOUR অফিসিয়াল পার্টনার</span>
                </span>
                <p className="text-xs sm:text-sm font-black text-white drop-shadow">
                  সেরা গেমিং রিওয়ার্ড ও ইনস্ট্যান্ট ক্যাশআউট উপভোগ করুন
                </p>
              </div>

              {ad.redirectUrl && (
                <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-xs shadow-md group-hover:bg-amber-400 transition-colors">
                  <span>ভিজিট করুন</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
