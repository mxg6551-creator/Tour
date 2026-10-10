import React from 'react';
import { X, ExternalLink, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sound } from '../services/sound';

export const NoticeModal: React.FC = () => {
  const { settings, activeModal, setActiveModal } = useApp();

  if (activeModal !== 'NOTICE') return null;

  const notice = settings.popupNotice;
  if (!notice || !notice.enabled) return null;

  const handleClose = () => {
    sound.playClick();
    setActiveModal(null);
  };

  const handleAction = () => {
    sound.playClick();
    if (notice.actionUrl) {
      window.open(notice.actionUrl, '_blank');
    }
    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
      <div 
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-amber-500/40 shadow-2xl shadow-amber-500/10 text-slate-900 dark:text-white animate-scale-in"
        role="dialog"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white flex items-center justify-center transition-all cursor-pointer"
          aria-label="Close Notice"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Notice Graphic Banner */}
        {notice.imageUrl && (
          <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-950">
            <img
              src={notice.imageUrl}
              alt="Notice Banner"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            <div className="absolute bottom-2 left-4 flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest bg-black/80 px-2.5 py-1 rounded-md border border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>জরুরি নোটিশ</span>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <h3 className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-300 tracking-tight leading-snug">
            {notice.title}
          </h3>
          <div className="max-h-56 overflow-y-auto text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-2 whitespace-pre-line pr-1 custom-scrollbar">
            {notice.banglaDescription}
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            {notice.actionText && (
              <button
                onClick={handleAction}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-transform cursor-pointer"
              >
                <span>{notice.actionText}</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleClose}
              className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
