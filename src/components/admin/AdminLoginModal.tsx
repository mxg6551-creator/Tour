import React, { useState } from 'react';
import { X, Lock, User, ShieldAlert, KeyRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../services/sound';

export const AdminLoginModal: React.FC = () => {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    isAdminLoggedIn, 
    loginAdmin,
    settings 
  } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAdminOpen || isAdminLoggedIn) return null;

  const handleClose = () => {
    sound.playClick();
    setIsAdminOpen(false);
    setErrorMsg('');
    setUsername('');
    setPassword('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(username, password);
    if (!success) {
      setErrorMsg('ভুল ইউজারনেম অথবা পাসওয়ার্ড! পুনরায় চেষ্টা করুন।');
    } else {
      setErrorMsg('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in select-none">
      <div 
        className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-slate-900 border border-amber-500/50 shadow-2xl shadow-amber-500/20 text-white animate-scale-in"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">
                সুপার অ্যাডমিন সিকিউর লগইন
              </h3>
              <p className="text-[10px] text-slate-400">
                {settings.siteBrandText || 'XEB TOUR'} Master Control
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>অ্যাডমিন ইউজারনেম</span>
              </label>
              <input
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username (e.g. immoon)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 text-white text-xs sm:text-sm font-bold font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>মাস্টার সিক্রেট পাসওয়ার্ড</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (e.g. 66449988)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 text-white text-xs sm:text-sm font-mono"
              />
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-red-950/80 text-red-300 border border-red-500/30 text-xs flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>প্রবেশ করুন (UNLOCK)</span>
            </button>
          </form>

          <p className="text-[10px] text-center text-slate-500">
            ডিফল্ট লগইন: <code className="text-slate-400">immoon</code> / <code className="text-slate-400">66449988</code> (প্যানেল থেকে পরিবর্তনযোগ্য)
          </p>
        </div>
      </div>
    </div>
  );
};
