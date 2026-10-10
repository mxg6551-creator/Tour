import React, { useState } from 'react';
import { X, User, Mail, Lock, Gift, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle, Phone, Hash } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../services/sound';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    setAuthModalMode, 
    registerUser, 
    loginUser,
    loginWithGoogle,
    settings 
  } = useApp();

  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [ffUid, setFfUid] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    sound.playClick();
    closeAuthModal();
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleGoogleAuth = () => {
    sound.playClick();
    setIsLoading(true);
    setTimeout(() => {
      loginWithGoogle();
      sound.playVictory();
      setSuccessMessage('গুগল দিয়ে লগইন সফল হয়েছে!');
      setTimeout(() => {
        setIsLoading(false);
        handleClose();
      }, 700);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (authModalMode === 'REGISTER') {
      const cleanUser = username.trim();
      if (cleanUser.length < 6 || cleanUser.length > 18) {
        setErrorMessage('ইউজারনেম অবশ্যই ৬ থেকে ১৮ অক্ষরের মধ্যে হতে হবে!');
        sound.playError();
        return;
      }
      if (password.length < 4 || password.length > 20) {
        setErrorMessage('পাসওয়ার্ড অবশ্যই ৪ থেকে ২০ অক্ষরের মধ্যে হতে হবে!');
        sound.playError();
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না!');
        sound.playError();
        return;
      }

      setIsLoading(true);
      const res = registerUser({
        username: cleanUser,
        nickname: nickname.trim() || cleanUser,
        password,
        phone: phone.trim() || '01700000000',
        ffUid: ffUid.trim() || String(Math.floor(100000000 + Math.random() * 900000000)),
        email: email.trim() || undefined,
        referralCode: referralCode.trim() || undefined
      });
      setIsLoading(false);

      if (res.success) {
        sound.playVictory();
        setSuccessMessage(res.message);
        setTimeout(handleClose, 900);
      } else {
        setErrorMessage(res.message);
        sound.playError();
      }
    } else {
      // LOGIN
      if (!username.trim()) {
        setErrorMessage('ইউজারনেম বা গেম UID লিখুন!');
        sound.playError();
        return;
      }

      setIsLoading(true);
      const res = loginUser(username.trim(), password.trim());
      setIsLoading(false);

      if (res.success) {
        sound.playVictory();
        setSuccessMessage(res.message);
        setTimeout(handleClose, 900);
      } else {
        setErrorMessage(res.message);
        sound.playError();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in select-none">
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-blue-400/50 dark:border-blue-500/40 shadow-2xl text-slate-900 dark:text-white animate-scale-in"
        role="dialog"
      >
        {/* Header Strip */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70">
          <div className="flex items-center gap-1.5 font-black text-xl tracking-tight">
            <span className="text-blue-600 dark:text-cyan-400">
              {(settings.siteBrandText || 'XEB TOUR').split(' ')[0]}
            </span>
            <span className="text-slate-700 dark:text-slate-300">
              {(settings.siteBrandText || 'XEB TOUR').split(' ').slice(1).join(' ')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-slate-200 dark:bg-slate-800 p-0.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setAuthModalMode('LOGIN');
                  setErrorMessage('');
                }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  authModalMode === 'LOGIN'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                }`}
              >
                LOGIN
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setAuthModalMode('REGISTER');
                  setErrorMessage('');
                }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  authModalMode === 'REGISTER'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                }`}
              >
                REGISTER
              </button>
            </div>

            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar">
          {/* Sign in with Google Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-blue-400 dark:border-blue-500/40 hover:border-blue-600 shadow-md flex items-center justify-center gap-3 font-black text-xs sm:text-sm text-slate-800 dark:text-white tracking-wider uppercase transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{authModalMode === 'REGISTER' ? 'SIGN UP WITH GOOGLE' : 'SIGN IN WITH GOOGLE'}</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase shrink-0">
              {authModalMode === 'REGISTER' ? 'অথবা তথ্য দিয়ে রেজিস্টার করুন' : 'অথবা ইউজারনেম দিয়ে লগইন'}
            </span>
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* USERNAME */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                {authModalMode === 'REGISTER' ? 'ইউজারনেম (৬-১৮ সংখ্যা/অক্ষর) *' : 'ইউজারনেম / গেম UID / ফোন নম্বর'}
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={authModalMode === 'REGISTER' ? 'e.g. MOON2007' : 'Username or Game UID'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:outline-none text-slate-900 dark:text-white text-xs sm:text-sm font-bold font-mono"
              />
            </div>

            {/* In Register: NICKNAME & FF UID */}
            {authModalMode === 'REGISTER' && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                      গেমের নাম (Nickname) *
                    </label>
                    <input
                      type="text"
                      required
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="e.g. MOON_PRO"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                      Free Fire UID *
                    </label>
                    <input
                      type="text"
                      required
                      value={ffUid}
                      onChange={(e) => setFfUid(e.target.value)}
                      placeholder="e.g. 849201948"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                      ফোন নম্বর (Phone) *
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                      ইমেইল (ঐচ্ছিক)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@email.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono"
                    />
                  </div>
                </div>
              </>
            )}

            {/* PASSWORD */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                পাসওয়ার্ড (৪-২০ অক্ষর) *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="পাসওয়ার্ড লিখুন"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:outline-none text-slate-900 dark:text-white text-xs sm:text-sm font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD (Register only) */}
            {authModalMode === 'REGISTER' && (
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  কনফার্ম পাসওয়ার্ড *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="একই পাসওয়ার্ড পুনরায় লিখুন"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:outline-none text-slate-900 dark:text-white text-xs sm:text-sm font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* REFERRAL CODE (Register only, controlled by Admin on/off) */}
            {authModalMode === 'REGISTER' && settings.referralConfig?.isEnabled !== false && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-amber-500" />
                  <span>রেফার কোড (ঐচ্ছিক):</span>
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="যেমন: MOON777"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-mono uppercase"
                />
              </div>
            )}

            {/* Error & Success Messages */}
            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/80 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-500/30 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-blue-500/30 hover:scale-[1.01] active:scale-95 transition-all mt-2 cursor-pointer"
            >
              {isLoading 
                ? 'অপেক্ষা করুন...' 
                : authModalMode === 'REGISTER' 
                ? 'রেজিস্টার করুন (REGISTER)' 
                : 'লগইন করুন (LOGIN)'}
            </button>
          </form>

          {/* Bottom Switch Link */}
          <div className="text-center pt-2">
            {authModalMode === 'REGISTER' ? (
              <p className="text-xs text-slate-600 dark:text-slate-400">
                ইতিমধ্যে একাউন্ট আছে?{' '}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setAuthModalMode('LOGIN');
                    setErrorMessage('');
                  }}
                  className="text-blue-600 dark:text-cyan-400 font-bold hover:underline cursor-pointer"
                >
                  লগইন করুন
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-600 dark:text-slate-400">
                একাউন্ট নেই?{' '}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setAuthModalMode('REGISTER');
                    setErrorMessage('');
                  }}
                  className="text-blue-600 dark:text-cyan-400 font-bold hover:underline cursor-pointer"
                >
                  নতুন একাউন্ট খুলুন
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
