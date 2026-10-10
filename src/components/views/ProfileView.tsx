import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../services/sound';
import { 
  User, Mail, Phone, Hash, Shield, Copy, Check, 
  Share2, Award, Globe, LogOut, Video, Wallet, 
  ArrowDownCircle, ArrowUpCircle, CheckCircle2, Gift, Users, Sun, Moon 
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser, 
    setActiveModal, 
    openAuthModal,
    logoutUser,
    language, 
    toggleLanguage, 
    theme,
    toggleTheme,
    claimReferralBonus,
    settings 
  } = useApp();

  const [username, setUsername] = useState(currentUser?.username || '');
  const [nickname, setNickname] = useState(currentUser?.nickname || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [ffUid, setFfUid] = useState(currentUser?.ffUid || '');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [claimMessage, setClaimMessage] = useState<string | null>(null);

  const avatars = [
    'https://api.dicebear.com/7.x/bottts/svg?seed=MOON2007',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Valverde',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Prince',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Crusher',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Shadow'
  ];

  if (!currentUser || !currentUser.username) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-500 mx-auto flex items-center justify-center">
          <User className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-black text-slate-800 dark:text-white">প্রোফাইল দেখতে লগইন করুন</h3>
        <p className="text-xs text-slate-500">আপনার গেম প্রোফাইল, ওয়ালেট ব্যালেন্স এবং রেফার ইনকাম পরিচালনা করুন।</p>
        <button
          onClick={() => openAuthModal('LOGIN')}
          className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20"
        >
          লগইন বা রেজিস্টার করুন
        </button>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playCoin();
    setCurrentUser({
      ...currentUser,
      username: username.trim(),
      nickname: nickname.trim() || username.trim(),
      phone: phone.trim(),
      ffUid: ffUid.trim()
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const copyReferral = () => {
    sound.playClick();
    navigator.clipboard.writeText(currentUser.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const shareWhatsApp = () => {
    sound.playClick();
    const shareText = `XEB TOUR-এ আমার সাথে ফ্রি ফায়ার টুর্নামেন্ট ও লুডু খেলুন এবং ক্যাশ প্রাইজ জিতুন! সাইন আপ করার সময় আমার রেফার কোড ${currentUser.referralCode} ব্যবহার করুন: ${window.location.origin}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleClaimEarnings = () => {
    const res = claimReferralBonus();
    setClaimMessage(res.message);
    setTimeout(() => setClaimMessage(null), 3000);
  };

  return (
    <div className="space-y-4 pb-24 animate-fade-in max-w-2xl mx-auto">
      {/* Top Profile Summary Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-md">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.username}
            className="w-16 h-16 rounded-2xl ring-2 ring-amber-400 bg-slate-950 object-cover shadow-md"
          />
          <div className="space-y-0.5 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {currentUser.username}
              </h3>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-bold font-mono">
              নিকনেম: {currentUser.nickname || currentUser.username}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              গেম UID: <b className="text-slate-800 dark:text-slate-200">{currentUser.ffUid}</b>
            </p>
            <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <span>ম্যাচ: <b className="text-slate-900 dark:text-white">{currentUser.totalMatches}</b></span>
              <span>জয়: <b className="text-emerald-500">{currentUser.totalWins}</b></span>
              <span>কিল: <b className="text-blue-500 dark:text-cyan-400">{currentUser.totalKills}</b></span>
            </div>
          </div>
        </div>

        {/* Avatar Selectors */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">অ্যাভাটার পরিবর্তন করুন:</span>
          <div className="flex items-center gap-2">
            {avatars.map((av, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setCurrentUser({ ...currentUser, avatar: av });
                }}
                className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  currentUser.avatar === av ? 'border-amber-400 scale-105 shadow-md' : 'border-slate-300 dark:border-slate-800 opacity-60'
                }`}
              >
                <img src={av} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Wallet Balance Summary Card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-emerald-500" />
            <span>ওয়ালেট ব্যালেন্স সামারি</span>
          </span>
          <span className="font-mono text-base font-black text-amber-500">
            টোটাল: ৳{currentUser.totalBalance}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">ডিপোজিট ব্যালেন্স</span>
            <span className="font-mono text-sm font-black text-emerald-600 dark:text-emerald-400">৳{currentUser.depositBalance}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">উইনিং ব্যালেন্স (উত্তোলনযোগ্য)</span>
            <span className="font-mono text-sm font-black text-pink-600 dark:text-pink-400">৳{currentUser.winningBalance}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => {
              sound.playClick();
              setActiveModal('WALLET');
            }}
            className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <ArrowDownCircle className="w-4 h-4" />
            <span>Add Money (ডিপোজিট)</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveModal('WALLET');
            }}
            className="py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-pink-600/20 cursor-pointer"
          >
            <ArrowUpCircle className="w-4 h-4" />
            <span>Withdraw (উত্তোলন)</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Form (Exact user requested labels and guideline) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-md">
        <div className="space-y-1">
          <h4 className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
            ব্যক্তিগত ও গেম আইডি তথ্য
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            * আপনি চাইলে আপনার ফ্রি ফায়ার গেম আইডির নামের সাথে সেম নাম আপনার নিকনেম হিসেবে দিতে হবে এবং সঠিক গেম ইউআইডি দিতে হবে।
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-3">
          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              ইউজারনেম (Login Username):
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold font-mono focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              নিকনেম / গেম আইডির নাম (Nickname):
            </label>
            <input
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="আপনার গেমের নাম"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                মোবাইল নম্বর (Phone):
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                ফ্রি ফায়ার গেম UID:
              </label>
              <input
                type="text"
                required
                value={ffUid}
                onChange={(e) => setFfUid(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center justify-between mb-1">
              <span>ইমেইল অ্যাড্রেস (Email - ঐচ্ছিক):</span>
            </label>
            <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs font-mono">
              {currentUser.email || 'কোনো ইমেইল যুক্ত নেই'}
            </div>
          </div>

          {savedSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>প্রোফাইল তথ্য সফলভাবে সেভ হয়েছে!</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs hover:scale-[1.01] active:scale-95 transition-all shadow-md cursor-pointer"
          >
            পরিবর্তন সেভ করুন
          </button>
        </form>
      </div>

      {/* REFERRAL SYSTEM SECTION (Controlled by Admin On/Off) */}
      {settings.referralConfig?.isEnabled !== false && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/40 space-y-3.5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-amber-500" />
              <span>মাই রেফারেল কোড ও ইনকাম (Refer & Earn)</span>
            </span>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {settings.referralConfig.commissionPercentage || 20}% কমিশন
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            * আপনার রেফার কোড বা লিংক বন্ধুদের সাথে শেয়ার করুন। তারা একাউন্ট খুলে ম্যাচে জয়েন করলেই আপনি জয়েনিং ফি থেকে {settings.referralConfig.commissionPercentage || 20}% লাভ বা কমিশন পাবেন যা আপনি উইনিং ওয়ালেটে ক্লেইম করতে পারবেন।
          </p>

          {/* Referral Code Box */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 gap-2">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">আপনার রেফারেল কোড:</span>
              <span className="font-mono text-base font-black text-amber-500 tracking-wider">
                {currentUser.referralCode}
              </span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={copyReferral}
                className="flex-1 sm:flex-none py-1.5 px-3 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-amber-300 flex items-center justify-center gap-1 cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'কপি হয়েছে' : 'কোড কপি'}</span>
              </button>
              <button
                onClick={shareWhatsApp}
                className="flex-1 sm:flex-none py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center justify-center gap-1 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp শেয়ার</span>
              </button>
            </div>
          </div>

          {/* Claimable Earnings Card */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-600 dark:text-slate-300 block font-bold">ক্লেইমযোগ্য রেফারেল প্রফিট:</span>
              <span className="font-mono text-lg font-black text-amber-500">
                ৳{currentUser.referralClaimable || 0}
              </span>
            </div>
            <button
              onClick={handleClaimEarnings}
              disabled={!currentUser.referralClaimable || currentUser.referralClaimable <= 0}
              className={`py-2 px-4 rounded-xl font-black text-xs transition-all ${
                currentUser.referralClaimable && currentUser.referralClaimable > 0
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:scale-105 active:scale-95 shadow cursor-pointer'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              ওয়ালেটে ক্লেইম করুন
            </button>
          </div>

          {claimMessage && (
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{claimMessage}</span>
            </div>
          )}

          {/* Referred Users History */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-blue-500" />
              <span>রেফার করা বন্ধুদের তালিকা ({currentUser.referredUsers?.length || 0} জন):</span>
            </span>

            {(!currentUser.referredUsers || currentUser.referredUsers.length === 0) ? (
              <p className="text-[11px] text-slate-400 italic bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                এখনও কোনো বন্ধু আপনার রেফার কোড ব্যবহার করেনি। কোডটি বন্ধুদের সাথে শেয়ার করুন!
              </p>
            ) : (
              <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
                {currentUser.referredUsers.map((ref, i) => (
                  <div key={i} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-white block">{ref.username}</span>
                      <span className="text-[10px] text-slate-500">{ref.joinedAt}</span>
                    </div>
                    <span className="text-emerald-500 font-bold">+৳{ref.commissionEarned}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preferences & Support */}
      <div className="space-y-2 text-xs">
        <button
          onClick={toggleTheme}
          className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-300 shadow-sm cursor-pointer"
        >
          <div className="flex items-center gap-2">
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            <span>থিম মোড (Theme):</span>
          </div>
          <span className="font-bold text-amber-500">{theme === 'dark' ? 'ডার্ক মোড (Dark)' : 'লাইট মোড (Light)'}</span>
        </button>

        <button
          onClick={toggleLanguage}
          className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-300 shadow-sm cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-500 dark:text-cyan-400" />
            <span>ভাষা (Language):</span>
          </div>
          <span className="font-bold text-amber-500">{language === 'bn' ? 'বাংলা (Bangla)' : 'English'}</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            window.open(settings.telegramSupportLink, '_blank');
          }}
          className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-300 shadow-sm cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>কাস্টমার সাপোর্ট (Telegram):</span>
          </div>
          <span className="text-emerald-500 font-bold">লাইভ সাপোর্ট</span>
        </button>

        <button
          onClick={logoutUser}
          className="w-full p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 flex items-center justify-center gap-2 text-red-600 dark:text-red-400 font-bold shadow-sm cursor-pointer hover:bg-red-100 dark:hover:bg-red-950/60"
        >
          <LogOut className="w-4 h-4" />
          <span>লগআউট করুন (Logout)</span>
        </button>
      </div>
    </div>
  );
};
