import React, { useState } from 'react';
import { Send, X, ExternalLink, Headphones } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sound } from '../services/sound';

export const SupportFAB: React.FC = () => {
  const { settings } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenTelegram = () => {
    sound.playClick();
    window.open(settings.telegramSupportLink, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-18 right-4 sm:bottom-6 sm:right-6 z-40">
        <button
          onClick={() => {
            sound.playClick();
            setIsOpen((prev) => !prev);
          }}
          className="relative flex items-center gap-2 p-3 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs sm:text-sm shadow-2xl shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-blue-400/20"
          aria-label="Customer Support"
        >
          <Send className="w-5 h-5 fill-current animate-pulse" />
          <span className="hidden sm:inline font-bold">SUPPORT</span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full" />
        </button>
      </div>

      {/* Pop-up Support Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6 p-3 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
          <div 
            className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-blue-400/50 dark:border-blue-500/40 shadow-2xl p-5 text-slate-900 dark:text-white animate-scale-in space-y-4"
            role="dialog"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    ২৪/৭ অফিশিয়াল সাপোর্ট
                  </h4>
                  <span className="text-[10px] text-emerald-500 flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>অনলাইন আছেন</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => { sound.playClick(); setIsOpen(false); }}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              ডিপোজিট, উইথড্র, টুর্নামেন্ট সমস্যা বা যেকোনো সহায়তায় আমাদের অফিশিয়াল টেলিগ্রাম হেল্পডেস্কে সরাসরি মেসেজ দিন।
            </p>

            <button
              onClick={handleOpenTelegram}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 active:scale-95 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4 fill-current" />
              <span>টেলিগ্রামে মেসেজ দিন (Chat on Telegram)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
