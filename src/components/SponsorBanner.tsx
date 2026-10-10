import React from 'react';
import { Video, ExternalLink, Sparkles, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sound } from '../services/sound';

export const SponsorBanner: React.FC = () => {
  const { settings } = useApp();
  const sponsor = settings.tiktokSponsor;

  if (!sponsor || !sponsor.enabled) return null;

  const handleClick = () => {
    sound.playClick();
    if (sponsor.actionUrl) {
      window.open(sponsor.actionUrl, '_blank');
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-950/70 via-slate-900 to-pink-950/60 border border-pink-500/30 p-4 sm:p-5 shadow-xl text-white">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-36 h-36 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side Info */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-pink-500/30">
            <Video className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-wider text-pink-400 bg-pink-500/20 px-2 py-0.5 rounded-md border border-pink-500/30">
                টিকটক ভিডিও ইনকাম
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                <Sparkles className="w-3 h-3" />
                <span>প্রতি ১০০০ ভিউতে ৳{sponsor.rewardPer1000Views}</span>
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              {sponsor.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {sponsor.banglaDescription}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2.5 shrink-0 pt-1 md:pt-0">
          <button
            onClick={handleClick}
            type="button"
            className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <TrendingUp className="w-4 h-4" />
            <span>{sponsor.actionText || 'ভিডিও জমা দিন'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
