import React, { useState } from 'react';
import { 
  Users, Trophy, Wallet, Settings, 
  Plus, Edit, Trash2, KeyRound, 
  Check, Lock, Search, Swords, Dice5, Zap, ShieldAlert, Sparkles, RefreshCw, CheckCircle2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserProfile, Tournament, GameModeItem, MatchType, PaymentMethod } from '../../types';
import { sound } from '../../services/sound';

export const SuperAdminDashboard: React.FC = () => {
  const { 
    isAdminLoggedIn, 
    logoutAdmin, 
    users, 
    updateUser, 
    deleteUser, 
    blockUser, 
    adjustUserBalance, 
    modes, 
    createMode, 
    updateMode, 
    deleteMode, 
    toggleModeStatus, 
    tournaments, 
    createTournament, 
    updateTournament, 
    deleteTournament, 
    setRoomDetails, 
    distributeTournamentPrize, 
    transactions, 
    approveTransaction, 
    rejectTransaction, 
    smsInbox, 
    addSMSMessage, 
    settings, 
    updateSettings, 
    updateAdminCredentials,
    sevenUpDownRound,
    setSevenUpDownAdminForce 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'USERS' | 'MODES' | 'MATCHES' | 'SEVEN_UP' | 'LUDO' | 'WALLET_SMS' | 'CMS' | 'SECURITY'>('USERS');

  // Real-time Users Analytics & Filtering
  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<'ALL' | 'ONLINE' | 'OFFLINE' | 'BLOCKED'>('ALL');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [balanceAdjustUser, setBalanceAdjustUser] = useState<UserProfile | null>(null);
  const [adjustDepositAmount, setAdjustDepositAmount] = useState<number>(0);
  const [adjustWinningAmount, setAdjustWinningAmount] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState<string>('বোনাস / অ্যাডজাস্টমেন্ট');

  // Game Modes management states
  const [isCreatingMode, setIsCreatingMode] = useState(false);
  const [editingMode, setEditingMode] = useState<GameModeItem | null>(null);
  const [newModeName, setNewModeName] = useState('');
  const [newModeBadge, setNewModeBadge] = useState('');
  const [newModeIcon, setNewModeIcon] = useState('Swords');
  const [newModeImage, setNewModeImage] = useState('');
  const [newModeRules, setNewModeRules] = useState('');

  // Match management states
  const [isCreatingMatch, setIsCreatingMatch] = useState(false);
  const [newMatchModeId, setNewMatchModeId] = useState(modes[0]?.id || 'mode-br');
  const [newMatchCategory, setNewMatchCategory] = useState(modes[0]?.name || 'BR Match');
  const [newMatchTitle, setNewMatchTitle] = useState('');
  const [newMatchMap, setNewMatchMap] = useState('Bermuda');
  const [newMatchType, setNewMatchType] = useState<MatchType>('SQUAD');
  const [newMatchFee, setNewMatchFee] = useState<number>(10);
  const [newMatchPrize, setNewMatchPrize] = useState<number>(400);
  const [newMatchPerKill, setNewMatchPerKill] = useState<number>(6);
  const [newMatchSlots, setNewMatchSlots] = useState<number>(48);
  const [newMatchRules, setNewMatchRules] = useState(modes[0]?.rules || '');

  const [roomModalMatch, setRoomModalMatch] = useState<Tournament | null>(null);
  const [roomIdInput, setRoomIdInput] = useState('');
  const [roomPassInput, setRoomPassInput] = useState('');

  const [winnerModalMatch, setWinnerModalMatch] = useState<Tournament | null>(null);
  const [winnerRank, setWinnerRank] = useState<number>(1);
  const [winnerNameInput, setWinnerNameInput] = useState('');
  const [winnerPrizeInput, setWinnerPrizeInput] = useState<number>(400);
  const [winnerKillsInput, setWinnerKillsInput] = useState<number>(8);

  // 7 Up 7 Down Admin Controller state
  const [forceDiceSum, setForceDiceSum] = useState<number>(7);
  const [forceMessage, setForceMessage] = useState<string | null>(null);

  // SMS Simulator State
  const [simSender, setSimSender] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [simTrxId, setSimTrxId] = useState('');
  const [simAmount, setSimAmount] = useState<number>(500);

  // Admin Credentials form
  const [newAdminUser, setNewAdminUser] = useState(settings.adminCredentials.username);
  const [newAdminPass, setNewAdminPass] = useState(settings.adminCredentials.passwordHash);
  const [credMessage, setCredMessage] = useState('');

  // CMS forms (Including Brand Name & Logo Editing)
  const [siteBrandName, setSiteBrandName] = useState(settings.siteBrandText || 'XEB TOUR');
  const [siteTagline, setSiteTagline] = useState(settings.siteTagline || 'Esports & Ludo Arena');
  const [siteLogoIcon, setSiteLogoIcon] = useState(settings.siteLogoIcon || '⚡');
  const [siteLogoUrl, setSiteLogoUrl] = useState(settings.siteLogoUrl || '');

  const [noticeTitle, setNoticeTitle] = useState(settings.popupNotice.title);
  const [noticeDesc, setNoticeDesc] = useState(settings.popupNotice.banglaDescription);
  const [noticeImage, setNoticeImage] = useState(settings.popupNotice.imageUrl);
  const [noticeAction, setNoticeAction] = useState(settings.popupNotice.actionText);
  const [noticeLink, setNoticeLink] = useState(settings.popupNotice.actionUrl);
  const [noticeEnabled, setNoticeEnabled] = useState(settings.popupNotice.enabled);

  const [referralEnabled, setReferralEnabled] = useState(settings.referralConfig?.isEnabled ?? true);
  const [referralPercent, setReferralPercent] = useState(settings.referralConfig?.commissionPercentage || 20);

  const [tiktokTitle, setTiktokTitle] = useState(settings.tiktokSponsor.title);
  const [tiktokDesc, setTiktokDesc] = useState(settings.tiktokSponsor.banglaDescription);
  const [tiktokLink, setTiktokLink] = useState(settings.tiktokSponsor.actionUrl);
  const [tiktokReward, setTiktokReward] = useState(settings.tiktokSponsor.rewardPer1000Views);

  const [telegramLink, setTelegramLink] = useState(settings.telegramSupportLink);
  const [bKashNum, setBKashNum] = useState(settings.paymentNumbers.bKash);
  const [nagadNum, setNagadNum] = useState(settings.paymentNumbers.nagad);
  const [rocketNum, setRocketNum] = useState(settings.paymentNumbers.rocket);

  if (!isAdminLoggedIn) return null;

  // Real-time Live Analytics (Fair, Zero Bots, Exact Date matching)
  const now = new Date();
  const isSameDay = (d1: Date, d2: Date) => 
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const isYesterday = (d: Date) => {
    const yest = new Date(now);
    yest.setDate(now.getDate() - 1);
    return isSameDay(d, yest);
  };

  const isThisMonth = (d: Date) => 
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth();

  const isThisYear = (d: Date) => 
    d.getFullYear() === now.getFullYear();

  const todayRegistered = users.filter(u => {
    const d = new Date(u.registeredAt);
    return !isNaN(d.getTime()) && isSameDay(d, now);
  }).length;

  const yesterdayRegistered = users.filter(u => {
    const d = new Date(u.registeredAt);
    return !isNaN(d.getTime()) && isYesterday(d);
  }).length;

  const thisMonthRegistered = users.filter(u => {
    const d = new Date(u.registeredAt);
    return !isNaN(d.getTime()) && isThisMonth(d);
  }).length;

  const thisYearRegistered = users.filter(u => {
    const d = new Date(u.registeredAt);
    return !isNaN(d.getTime()) && isThisYear(d);
  }).length;

  const totalUsers = users.length;
  const onlineUsers = users.filter(u => u.isOnline).length;
  const offlineUsers = users.filter(u => !u.isOnline).length;
  const blockedUsers = users.filter(u => u.isBlocked).length;

  const totalDepositAll = users.reduce((acc, u) => acc + (u.depositBalance || 0), 0);
  const totalWinningAll = users.reduce((acc, u) => acc + (u.winningBalance || 0), 0);

  // Filtered Users List
  const filteredUsers = users.filter(u => {
    const q = userSearch.trim().toLowerCase();
    const matchQ = !q || 
      u.username.toLowerCase().includes(q) ||
      (u.nickname && u.nickname.toLowerCase().includes(q)) ||
      (u.ffUid && u.ffUid.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q));

    if (!matchQ) return false;
    if (userStatusFilter === 'ONLINE') return u.isOnline;
    if (userStatusFilter === 'OFFLINE') return !u.isOnline;
    if (userStatusFilter === 'BLOCKED') return u.isBlocked;
    return true;
  });

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminCredentials(newAdminUser, newAdminPass);
    sound.playVictory();
    setCredMessage('অ্যাডমিন ইউজারনেম ও পাসওয়ার্ড সফলভাবে আপডেট হয়েছে!');
    setTimeout(() => setCredMessage(''), 3000);
  };

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      siteBrandText: siteBrandName.trim() || 'XEB TOUR',
      siteTagline: siteTagline.trim() || 'Esports & Ludo Arena',
      siteLogoIcon: siteLogoIcon.trim() || '⚡',
      siteLogoUrl: siteLogoUrl.trim() || undefined,
      popupNotice: {
        enabled: noticeEnabled,
        title: noticeTitle,
        banglaDescription: noticeDesc,
        imageUrl: noticeImage,
        actionText: noticeAction,
        actionUrl: noticeLink
      },
      referralConfig: {
        isEnabled: referralEnabled,
        commissionPercentage: Number(referralPercent)
      },
      tiktokSponsor: {
        ...settings.tiktokSponsor,
        title: tiktokTitle,
        banglaDescription: tiktokDesc,
        actionUrl: tiktokLink,
        rewardPer1000Views: Number(tiktokReward)
      },
      telegramSupportLink: telegramLink,
      paymentNumbers: {
        ...settings.paymentNumbers,
        bKash: bKashNum,
        nagad: nagadNum,
        rocket: rocketNum
      }
    });
    sound.playCoin();
    alert('ওয়েবসাইটের নাম, ব্র্যান্ডিং এবং CMS তথ্য সফলভাবে আপডেট হয়েছে!');
  };

  const handleCreateModeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModeName.trim()) return;
    createMode({
      name: newModeName.trim(),
      badgeText: newModeBadge.trim() || 'Custom Mode',
      icon: newModeIcon || 'Swords',
      image: newModeImage.trim() || '/src/assets/images/game_mode_freefire_1791621189696.jpg',
      rules: newModeRules.trim() || 'অফিশিয়াল ফেয়ার প্লে টুর্নামেন্ট রুলস প্রযোজ্য।',
      isEnabled: true,
      isFreeFire: true
    });
    setIsCreatingMode(false);
    setNewModeName('');
    setNewModeBadge('');
    setNewModeRules('');
    setNewModeImage('');
    sound.playVictory();
  };

  const handleSaveEditMode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMode) return;
    updateMode(editingMode);
    setEditingMode(null);
    sound.playCoin();
  };

  const handleCreateMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetMode = modes.find(m => m.id === newMatchModeId);
    createTournament({
      title: newMatchTitle || `${newMatchCategory} #${Math.floor(100 + Math.random() * 900)}`,
      modeId: newMatchModeId,
      category: targetMode ? targetMode.name : newMatchCategory,
      mapName: newMatchMap,
      matchType: newMatchType,
      startTime: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
      entryFee: Number(newMatchFee),
      prizePool: Number(newMatchPrize),
      perKill: Number(newMatchPerKill),
      totalSlots: Number(newMatchSlots),
      rulesText: newMatchRules || targetMode?.rules || 'অফিশিয়াল ফেয়ার প্লে রুলস প্রযোজ্য।'
    });
    setIsCreatingMatch(false);
    setNewMatchTitle('');
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomModalMatch) {
      setRoomDetails(roomModalMatch.id, roomIdInput.trim(), roomPassInput.trim());
      sound.playCoin();
      setRoomModalMatch(null);
    }
  };

  const handleDistributePrize = (e: React.FormEvent) => {
    e.preventDefault();
    if (winnerModalMatch && winnerNameInput.trim()) {
      distributeTournamentPrize(winnerModalMatch.id, [
        {
          rank: Number(winnerRank),
          userName: winnerNameInput.trim(),
          kills: Number(winnerKillsInput),
          prize: Number(winnerPrizeInput)
        }
      ]);
      setWinnerModalMatch(null);
      setWinnerNameInput('');
    }
  };

  const handleSimulateSMS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simTrxId.trim()) return;
    addSMSMessage({
      sender: simSender,
      body: `Received Tk ${simAmount}.00 from 01700000000. TrxID ${simTrxId.trim().toUpperCase()} at ${new Date().toLocaleTimeString()}`,
      trxId: simTrxId.trim().toUpperCase(),
      amount: Number(simAmount)
    });
    sound.playCoin();
    setSimTrxId('');
    alert(`টেস্ট SMS সফলভাবে গৃহীত হয়েছে! TrxID দিয়ে ডিপোজিট টেস্ট করুন।`);
  };

  const handleForceRoll = (forcedSum: number) => {
    setSevenUpDownAdminForce(forcedSum);
    sound.playCoin();
    setForceMessage(`পরবর্তী রাউন্ডের জন্য ডাইস যোগফল ${forcedSum} সেট করা হয়েছে!`);
    setTimeout(() => setForceMessage(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white overflow-hidden animate-fade-in font-sans">
      {/* Top Header Bar */}
      <header className="px-4 py-3 bg-slate-900 border-b border-amber-500/30 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-lg">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-amber-400">
                {settings.siteBrandText || 'XEB TOUR'} SUPER ADMIN
              </h1>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40 font-mono font-bold">
                ROOT MASTER
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              অ্যাডমিন ইউজার: <b className="text-white">{settings.adminCredentials.username}</b>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            logoutAdmin();
          }}
          className="py-1.5 px-3.5 rounded-xl bg-red-600/80 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>প্যানেল লক করুন</span>
        </button>
      </header>

      {/* Real-Time Live Registration & Financial Analytics Strip (Zero Bots, 100% Real Fair Data) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 p-3 sm:px-6 bg-slate-900/60 border-b border-slate-800 text-xs shrink-0">
        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-bold">আজকে রেজিস্টার:</span>
          <span className="text-sm font-black text-emerald-400 font-mono">{todayRegistered} জন</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-bold">গতকালের রেজিস্টার:</span>
          <span className="text-sm font-black text-cyan-400 font-mono">{yesterdayRegistered} জন</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-bold">এই মাসে রেজিস্টার:</span>
          <span className="text-sm font-black text-indigo-300 font-mono">{thisMonthRegistered} জন</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-bold">এই বছরে রেজিস্টার:</span>
          <span className="text-sm font-black text-amber-300 font-mono">{thisYearRegistered} জন</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-bold">সর্বমোট ইউজার:</span>
          <span className="text-sm font-black text-white font-mono">{totalUsers} জন</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-bold">লাইভ অনলাইন / অফলাইন:</span>
          <span className="text-sm font-black text-emerald-400 font-mono flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{onlineUsers} / {offlineUsers}</span>
          </span>
        </div>
        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-bold">মোট ডিপোজিট ফান্ড:</span>
          <span className="text-sm font-black text-emerald-400 font-mono">৳{totalDepositAll}</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-bold">মোট উইনিং ফান্ড:</span>
          <span className="text-sm font-black text-yellow-300 font-mono">৳{totalWinningAll}</span>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1 px-3 sm:px-6 py-2 bg-slate-950 border-b border-slate-800 overflow-x-auto custom-scrollbar shrink-0 text-xs font-bold">
        <button
          onClick={() => { sound.playClick(); setActiveTab('USERS'); }}
          className={`py-2 px-3.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'USERS' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>ইউজার ম্যানেজমেন্ট</span>
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('MODES'); }}
          className={`py-2 px-3.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'MODES' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Swords className="w-4 h-4" />
          <span>গেম মোড কন্ট্রোলার</span>
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('MATCHES'); }}
          className={`py-2 px-3.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'MATCHES' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>ম্যাচ ও রুম আইডি</span>
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('SEVEN_UP'); }}
          className={`py-2 px-3.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'SEVEN_UP' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Dice5 className="w-4 h-4" />
          <span>৭ আপ ৭ ডাউন কন্ট্রোল</span>
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('LUDO'); }}
          className={`py-2 px-3.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'LUDO' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Dice5 className="w-4 h-4" />
          <span>লুডু ও সাপ-লুডু</span>
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('WALLET_SMS'); }}
          className={`py-2 px-3.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'WALLET_SMS' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>ওয়ালেট ও SMS গেটওয়ে</span>
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('CMS'); }}
          className={`py-2 px-3.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'CMS' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>CMS, ব্র্যান্ড ও নোটিশ</span>
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('SECURITY'); }}
          className={`py-2 px-3.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'SECURITY' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>অ্যাডমিন পাসওয়ার্ড</span>
        </button>
      </div>

      {/* Main Workspace Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-6">
        
        {/* ========================================================= */}
        {/* TAB 1: USERS & REAL-TIME ANALYTICS */}
        {/* ========================================================= */}
        {activeTab === 'USERS' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white">রেজিস্টার্ড ইউজার তালিকা</h3>
                <p className="text-xs text-slate-400">সার্চ দিয়ে সরাসরি ইউজারের ব্যালেন্স, আইডি ও তথ্য এডিট করুন</p>
              </div>

              {/* Search Bar & Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="ইউজারনেম, নিকনেম, UID বা ফোন..."
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs w-48 sm:w-64 focus:border-amber-400"
                  />
                </div>
                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                >
                  <option value="ALL">সকল ইউজার ({users.length})</option>
                  <option value="ONLINE">অনলাইন ({onlineUsers})</option>
                  <option value="OFFLINE">অফলাইন ({offlineUsers})</option>
                  <option value="BLOCKED">ব্লকড ({blockedUsers})</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase">
                  <tr>
                    <th className="p-3">ইউজার ও নিকনেম</th>
                    <th className="p-3">গেম UID ও ফোন</th>
                    <th className="p-3">রেজিস্ট্রেশন তারিখ ও সময়</th>
                    <th className="p-3">স্ট্যাটাস</th>
                    <th className="p-3">টোটাল ব্যালেন্স</th>
                    <th className="p-3">ডিপোজিট / উইনিং</th>
                    <th className="p-3 text-right">অ্যাকশনস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500 font-bold">
                        কোনো ইউজার পাওয়া যায়নি
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const regDate = new Date(u.registeredAt);
                      const formattedDate = !isNaN(regDate.getTime()) 
                        ? `${regDate.toLocaleDateString('en-GB')} ${regDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
                        : u.registeredAt;

                      return (
                        <tr key={u.id} className="hover:bg-slate-950/40 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              <img src={u.avatar} alt="" className="w-8 h-8 rounded-full bg-slate-800 object-cover" />
                              <div>
                                <span className="font-bold text-white block">{u.username}</span>
                                <span className="text-[10px] text-cyan-400">{u.nickname || u.username}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 font-mono">
                            <div>UID: <b className="text-amber-400">{u.ffUid || 'N/A'}</b></div>
                            <div className="text-[10px] text-slate-400">{u.phone}</div>
                          </td>
                          <td className="p-3 text-[11px] font-mono text-slate-400">
                            {formattedDate}
                          </td>
                          <td className="p-3">
                            {u.isBlocked ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-400 border border-red-500/40">
                                ব্লকড (BLOCKED)
                              </span>
                            ) : u.isOnline ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center gap-1 w-max">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>ONLINE</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">
                                OFFLINE
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-mono font-black text-amber-300 text-sm">
                            ৳{u.totalBalance}
                          </td>
                          <td className="p-3 font-mono text-[11px]">
                            <span className="text-emerald-400">ডিপোজিট: ৳{u.depositBalance}</span>
                            <br />
                            <span className="text-pink-400">উইনিং: ৳{u.winningBalance}</span>
                          </td>
                          <td className="p-3 text-right space-x-1 whitespace-nowrap">
                            {/* Adjust Balance Button */}
                            <button
                              onClick={() => {
                                sound.playClick();
                                setBalanceAdjustUser(u);
                                setAdjustDepositAmount(0);
                                setAdjustWinningAmount(0);
                              }}
                              className="py-1 px-2.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-400 font-bold text-[11px] cursor-pointer"
                              title="টাকা যোগ বা কর্তন"
                            >
                              ± ব্যালেন্স
                            </button>
                            {/* Edit User Button */}
                            <button
                              onClick={() => {
                                sound.playClick();
                                setEditingUser(u);
                              }}
                              className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] cursor-pointer"
                              title="ইউজার তথ্য এডিট"
                            >
                              এডিট
                            </button>
                            {/* Block Toggle */}
                            <button
                              onClick={() => {
                                sound.playClick();
                                blockUser(u.id, !u.isBlocked);
                              }}
                              className={`py-1 px-2.5 rounded-lg font-bold text-[11px] cursor-pointer ${
                                u.isBlocked 
                                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                                  : 'bg-red-950 hover:bg-red-900 text-red-400 border border-red-500/40'
                              }`}
                            >
                              {u.isBlocked ? 'আনব্লক' : 'ব্লক'}
                            </button>
                            {/* Delete User */}
                            <button
                              onClick={() => {
                                if (window.confirm(`আপনি কি নিশ্চিতভাবে '${u.username}' একাউন্টটি ডিলিট করতে চান?`)) {
                                  deleteUser(u.id);
                                }
                              }}
                              className="py-1 px-2 rounded-lg bg-red-950 hover:bg-red-900 border border-red-500/30 text-red-400 font-bold text-[11px] cursor-pointer"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Edit User Modal */}
            {editingUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-amber-500/40 p-5 space-y-4">
                  <h4 className="text-sm font-black text-white">ইউজার তথ্য এডিট ({editingUser.username})</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] text-slate-400">ইউজারনেম</label>
                      <input
                        type="text"
                        value={editingUser.username}
                        onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400">নিকনেম</label>
                      <input
                        type="text"
                        value={editingUser.nickname || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, nickname: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400">Free Fire UID</label>
                      <input
                        type="text"
                        value={editingUser.ffUid}
                        onChange={(e) => setEditingUser({ ...editingUser, ffUid: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400">মোবাইল নম্বর</label>
                      <input
                        type="text"
                        value={editingUser.phone}
                        onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        updateUser(editingUser);
                        sound.playCoin();
                        setEditingUser(null);
                      }}
                      className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs cursor-pointer"
                    >
                      সেভ করুন
                    </button>
                    <button
                      onClick={() => setEditingUser(null)}
                      className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs cursor-pointer"
                    >
                      বাতিল
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Adjust Balance Modal */}
            {balanceAdjustUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-emerald-500/40 p-5 space-y-4">
                  <h4 className="text-sm font-black text-white">ব্যালেন্স অ্যাডজাস্ট: {balanceAdjustUser.username}</h4>
                  <p className="text-xs text-slate-400">টাকা যোগ করতে পজিটিভ সংখ্যা এবং কর্তন করতে নেগেটিভ সংখ্যা দিন।</p>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] text-slate-400">ডিপোজিট ব্যালেন্স পরিবর্তন (৳)</label>
                      <input
                        type="number"
                        value={adjustDepositAmount}
                        onChange={(e) => setAdjustDepositAmount(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400">উইনিং ব্যালেন্স পরিবর্তন (৳)</label>
                      <input
                        type="number"
                        value={adjustWinningAmount}
                        onChange={(e) => setAdjustWinningAmount(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-pink-400 text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400">কারণ / নোট</label>
                      <input
                        type="text"
                        value={adjustReason}
                        onChange={(e) => setAdjustReason(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        adjustUserBalance(balanceAdjustUser.id, adjustDepositAmount, adjustWinningAmount, adjustReason);
                        sound.playCoin();
                        setBalanceAdjustUser(null);
                      }}
                      className="flex-1 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs cursor-pointer"
                    >
                      ব্যালেন্স আপডেট করুন
                    </button>
                    <button
                      onClick={() => setBalanceAdjustUser(null)}
                      className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs cursor-pointer"
                    >
                      বাতিল
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: GAME MODES & RULES CONTROLLER */}
        {/* ========================================================= */}
        {activeTab === 'MODES' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white">ডায়নামিক গেম মোড ম্যানেজার</h3>
                <p className="text-xs text-slate-400">নতুন মোড তৈরি, নাম ও ছবি পরিবর্তন, রুলস লেখা এবং অন/অফ করুন</p>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setIsCreatingMode(true);
                }}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs flex items-center gap-1.5 self-start cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন মোড তৈরি করুন</span>
              </button>
            </div>

            {/* Mode Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modes.map((mode) => {
                const matchCount = tournaments.filter(t => t.category === mode.name || t.modeId === mode.id).length;
                return (
                  <div 
                    key={mode.id} 
                    className={`p-4 rounded-2xl bg-slate-900 border transition-all space-y-3 shadow-lg ${
                      mode.isEnabled ? 'border-slate-800 hover:border-amber-500/40' : 'border-red-950/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-lg border border-slate-700">
                          ⚡
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-white">{mode.name}</h4>
                          <span className="text-[10px] text-amber-400 font-bold">{mode.badgeText}</span>
                        </div>
                      </div>

                      {/* On/Off Switch Button */}
                      <button
                        onClick={() => {
                          sound.playClick();
                          toggleModeStatus(mode.id);
                        }}
                        className={`py-1 px-3 rounded-xl text-[10px] font-black transition-all cursor-pointer ${
                          mode.isEnabled 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-900' 
                            : 'bg-red-950 text-red-400 border border-red-500/40 hover:bg-red-900'
                        }`}
                      >
                        {mode.isEnabled ? 'চালু আছে (ON)' : 'বন্ধ আছে (OFF)'}
                      </button>
                    </div>

                    {mode.image && (
                      <div className="h-20 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                        <img src={mode.image} alt={mode.name} className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Mode Rules Preview */}
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        মোডের অফিশিয়াল নিয়মাবলী (Rules):
                      </span>
                      <p className="text-[11px] text-slate-300 line-clamp-3 whitespace-pre-line leading-relaxed font-sans">
                        {mode.rules || 'কোনো রুলস লেখা নেই'}
                      </p>
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                      <span>এই মোডে ম্যাচ: <b>{matchCount}টি</b></span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          sound.playClick();
                          setEditingMode(mode);
                        }}
                        className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>এডিট</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`আপনি কি '${mode.name}' মোডটি ডিলিট করতে চান?`)) {
                            deleteMode(mode.id);
                          }
                        }}
                        className="py-1.5 px-3 rounded-xl bg-red-950 hover:bg-red-900 border border-red-500/30 text-red-400 font-bold text-xs cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          sound.playClick();
                          setNewMatchModeId(mode.id);
                          setNewMatchCategory(mode.name);
                          setNewMatchRules(mode.rules);
                          setActiveTab('MATCHES');
                          setIsCreatingMatch(true);
                        }}
                        className="py-1.5 px-3 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-bold text-xs cursor-pointer"
                      >
                        + ম্যাচ বানান
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Create Mode Modal */}
            {isCreatingMode && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-amber-500/40 p-5 space-y-4">
                  <h4 className="text-sm font-black text-white">নতুন গেম মোড যুক্ত করুন</h4>
                  <form onSubmit={handleCreateModeSubmit} className="space-y-3">
                    <div>
                      <label className="text-[11px] text-slate-400">মোডের নাম (যেমন: BR Match, CS Headshot)</label>
                      <input
                        type="text"
                        required
                        value={newModeName}
                        onChange={(e) => setNewModeName(e.target.value)}
                        placeholder="e.g. BR Survival Pro"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400">ব্যাজ / সাবটাইটেল</label>
                      <input
                        type="text"
                        value={newModeBadge}
                        onChange={(e) => setNewModeBadge(e.target.value)}
                        placeholder="e.g. 48 Slots / Solo Battle"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400">ইমেজ URL</label>
                      <input
                        type="text"
                        value={newModeImage}
                        onChange={(e) => setNewModeImage(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400">এই মোডের অফিশিয়াল রুলস ও নিয়মাবলী *</label>
                      <textarea
                        rows={4}
                        required
                        value={newModeRules}
                        onChange={(e) => setNewModeRules(e.target.value)}
                        placeholder="১. নো হ্যাক...\n২. গ্রেনেড অফ..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs leading-relaxed"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs cursor-pointer"
                      >
                        মোড সেভ করুন
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCreatingMode(false)}
                        className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs cursor-pointer"
                      >
                        বাতিল
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Mode Modal */}
            {editingMode && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-amber-500/40 p-5 space-y-4">
                  <h4 className="text-sm font-black text-white">মোড এডিট: {editingMode.name}</h4>
                  <form onSubmit={handleSaveEditMode} className="space-y-3">
                    <div>
                      <label className="text-[11px] text-slate-400">মোডের নাম</label>
                      <input
                        type="text"
                        required
                        value={editingMode.name}
                        onChange={(e) => setEditingMode({ ...editingMode, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400">ব্যাজ / সাবটাইটেল</label>
                      <input
                        type="text"
                        value={editingMode.badgeText}
                        onChange={(e) => setEditingMode({ ...editingMode, badgeText: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400">ইমেজ URL</label>
                      <input
                        type="text"
                        value={editingMode.image}
                        onChange={(e) => setEditingMode({ ...editingMode, image: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400">অফিশিয়াল রুলস ও নিয়মাবলী</label>
                      <textarea
                        rows={4}
                        value={editingMode.rules}
                        onChange={(e) => setEditingMode({ ...editingMode, rules: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs leading-relaxed"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs cursor-pointer"
                      >
                        আপডেট করুন
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingMode(null)}
                        className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs cursor-pointer"
                      >
                        বাতিল
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: MATCHES & ROOM ID CONTROLLER */}
        {/* ========================================================= */}
        {activeTab === 'MATCHES' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">ম্যাচ ও রুম কন্ট্রোলার</h3>
                <p className="text-xs text-slate-400">নির্দিষ্ট মোডের অধীনে ম্যাচ তৈরি ও রুম আইডি পাবলিশ করুন</p>
              </div>
              <button
                onClick={() => { sound.playClick(); setIsCreatingMatch(true); }}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন ম্যাচ তৈরি করুন</span>
              </button>
            </div>

            {/* Tournaments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tournaments.map((t) => {
                const occupied = t.slots.filter(s => s.occupied).length;
                return (
                  <div key={t.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {t.category} • {t.matchType}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        বুকিং: {occupied}/{t.totalSlots}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-white">{t.title}</h4>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-500 block">প্রাইজ</span>
                        <span className="text-yellow-400 font-bold">৳{t.prizePool}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">কিল</span>
                        <span className="text-cyan-400 font-bold">৳{t.perKill}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">ফি</span>
                        <span className="text-amber-400 font-bold">৳{t.entryFee}</span>
                      </div>
                    </div>

                    {/* Room ID status */}
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">রুম আইডি স্ট্যাটাস:</span>
                        <span className="font-mono font-bold text-white">
                          {t.isRoomReady ? `ID: ${t.roomId} | Pass: ${t.roomPassword}` : 'রুম আইডি এখনো দেওয়া হয়নি'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          sound.playClick();
                          setRoomModalMatch(t);
                          setRoomIdInput(t.roomId || '');
                          setRoomPassInput(t.roomPassword || '');
                        }}
                        className="py-1 px-3 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] cursor-pointer"
                      >
                        {t.isRoomReady ? 'রুম এডিট' : 'রুম আইডি দিন'}
                      </button>
                    </div>

                    {/* Distribute & Delete */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <button
                        onClick={() => {
                          sound.playClick();
                          setWinnerModalMatch(t);
                          setWinnerPrizeInput(t.prizePool);
                        }}
                        className="py-1.5 px-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 font-bold cursor-pointer"
                      >
                        উইনিং প্রাইজ ও কিল দিন
                      </button>
                      <button
                        onClick={() => deleteTournament(t.id)}
                        className="py-1.5 px-3 rounded-xl bg-red-950 hover:bg-red-900 border border-red-500/30 text-red-400 font-bold cursor-pointer"
                      >
                        ডিলিট
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Create Match Modal */}
            {isCreatingMatch && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-amber-500/40 p-5 space-y-4">
                  <h4 className="text-sm font-black text-white">নতুন টুর্নামেন্ট ম্যাচ তৈরি করুন</h4>
                  
                  <form onSubmit={handleCreateMatchSubmit} className="space-y-3">
                    <div>
                      <label className="text-[11px] text-slate-400">নির্দিষ্ট গেম মোড বেছে নিন (Game Mode)</label>
                      <select
                        value={newMatchModeId}
                        onChange={(e) => {
                          const mId = e.target.value;
                          setNewMatchModeId(mId);
                          const chosen = modes.find(m => m.id === mId);
                          if (chosen) {
                            setNewMatchCategory(chosen.name);
                            setNewMatchRules(chosen.rules);
                          }
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold"
                      >
                        {modes.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.badgeText}) {!m.isEnabled ? '[বন্ধ]' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400">ম্যাচের শিরোনাম (Title)</label>
                      <input
                        type="text"
                        value={newMatchTitle}
                        onChange={(e) => setNewMatchTitle(e.target.value)}
                        placeholder={`যেমন: ${newMatchCategory} #105 | DUO`}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-400">ম্যাপের নাম</label>
                        <input
                          type="text"
                          value={newMatchMap}
                          onChange={(e) => setNewMatchMap(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400">ম্যাচ টাইপ</label>
                        <select
                          value={newMatchType}
                          onChange={(e) => setNewMatchType(e.target.value as MatchType)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                        >
                          <option value="SOLO">SOLO</option>
                          <option value="DUO">DUO</option>
                          <option value="SQUAD">SQUAD</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-400">এন্ট্রি ফি (৳)</label>
                        <input
                          type="number"
                          value={newMatchFee}
                          onChange={(e) => setNewMatchFee(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400">প্রাইজ পুল (৳)</label>
                        <input
                          type="number"
                          value={newMatchPrize}
                          onChange={(e) => setNewMatchPrize(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400">প্রতি কিল (৳)</label>
                        <input
                          type="number"
                          value={newMatchPerKill}
                          onChange={(e) => setNewMatchPerKill(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400">এই ম্যাচের নিয়মাবলী (Rules)</label>
                      <textarea
                        rows={3}
                        value={newMatchRules}
                        onChange={(e) => setNewMatchRules(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs leading-relaxed"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs cursor-pointer"
                      >
                        ম্যাচ তৈরি করুন
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCreatingMatch(false)}
                        className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs cursor-pointer"
                      >
                        বাতিল
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Room ID Modal */}
            {roomModalMatch && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-amber-500/40 p-5 space-y-4">
                  <h4 className="text-sm font-black text-white">রুম আইডি ও পাসওয়ার্ড দিন</h4>
                  <form onSubmit={handleSaveRoom} className="space-y-3">
                    <div>
                      <label className="text-[11px] text-slate-400">Custom Room ID</label>
                      <input
                        type="text"
                        required
                        value={roomIdInput}
                        onChange={(e) => setRoomIdInput(e.target.value)}
                        placeholder="যেমন: 9845210"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400">Room Password</label>
                      <input
                        type="text"
                        required
                        value={roomPassInput}
                        onChange={(e) => setRoomPassInput(e.target.value)}
                        placeholder="যেমন: 778"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs cursor-pointer"
                      >
                        পাবলিশ করুন
                      </button>
                      <button
                        type="button"
                        onClick={() => setRoomModalMatch(null)}
                        className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs cursor-pointer"
                      >
                        বাতিল
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Winner Distribution Modal */}
            {winnerModalMatch && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-emerald-500/40 p-5 space-y-4">
                  <h4 className="text-sm font-black text-emerald-400">ম্যাচ ফলাফল ও উইনিং পুরস্কার বিতরণ</h4>
                  <form onSubmit={handleDistributePrize} className="space-y-3">
                    <div>
                      <label className="text-[11px] text-slate-400">পজিশন / স্থান</label>
                      <select
                        value={winnerRank}
                        onChange={(e) => setWinnerRank(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                      >
                        <option value={1}>১ম স্থান (Booyah Champion)</option>
                        <option value={2}>২য় স্থান (Runner Up)</option>
                        <option value={3}>৩য় স্থান</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400">জয়ী প্লেয়ারের ইউজারনেম / IGN</label>
                      <input
                        type="text"
                        required
                        value={winnerNameInput}
                        onChange={(e) => setWinnerNameInput(e.target.value)}
                        placeholder="Username / IGN"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-400">কিল সংখ্যা</label>
                        <input
                          type="number"
                          value={winnerKillsInput}
                          onChange={(e) => setWinnerKillsInput(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400">উইনিং প্রাইজ (৳)</label>
                        <input
                          type="number"
                          value={winnerPrizeInput}
                          onChange={(e) => setWinnerPrizeInput(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs cursor-pointer"
                      >
                        প্রাইজ ক্রেডিট করুন
                      </button>
                      <button
                        type="button"
                        onClick={() => setWinnerModalMatch(null)}
                        className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs cursor-pointer"
                      >
                        বাতিল
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: 7 UP 7 DOWN CASINO CONTROLLER (NEW USER REQUEST!) */}
        {/* ========================================================= */}
        {activeTab === 'SEVEN_UP' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h3 className="text-base font-black text-white">৭ আপ ৭ ডাউন ক্যাসিনো লাইভ ইঞ্জিন কন্ট্রোল</h3>
              <p className="text-xs text-slate-400">প্রতি ঘণ্টায় ৭ ও অন্যান্য সংখ্যা পড়ার হার নির্ধারণ করুন এবং পেআউট গুণফল সেট করুন</p>
            </div>

            {/* Current Live Game Monitor */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950 to-slate-900 border border-purple-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-yellow-300 uppercase flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>লাইভ রাউন্ড #{sevenUpDownRound.roundId} মনিটর</span>
                </span>
                <span className="text-xs font-mono font-bold text-amber-400 bg-black/60 px-2.5 py-1 rounded-lg">
                  ফেজ: {sevenUpDownRound.phase} ({sevenUpDownRound.timeLeft}s)
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2 rounded-xl bg-black/40 border border-purple-400/30">
                  <span className="text-[10px] text-slate-400 block font-sans">২-৬ (ডাউন বাজি)</span>
                  <span className="text-sm font-black text-emerald-400">৳{sevenUpDownRound.totalBets.DOWN}</span>
                </div>
                <div className="p-2 rounded-xl bg-black/40 border border-cyan-400/30">
                  <span className="text-[10px] text-slate-400 block font-sans">৭ (লাকি ৭ বাজি)</span>
                  <span className="text-sm font-black text-cyan-400">৳{sevenUpDownRound.totalBets.SEVEN}</span>
                </div>
                <div className="p-2 rounded-xl bg-black/40 border border-purple-400/30">
                  <span className="text-[10px] text-slate-400 block font-sans">৮-১২ (আপ বাজি)</span>
                  <span className="text-sm font-black text-emerald-400">৳{sevenUpDownRound.totalBets.UP}</span>
                </div>
              </div>
            </div>

            {/* Force Next Roll (Admin Master Power) */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-3">
              <h4 className="text-sm font-black text-amber-400">পরবর্তী রাউন্ডের ডাইস জোরপূর্বক নির্ধারণ (Force Next Outcome):</h4>
              <p className="text-xs text-slate-400">আপনি ক্লিক করলেই পরবর্তী ডাইস রোলে ঠিক এই ফলাফলটি পড়বে!</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <button
                  onClick={() => handleForceRoll(7)}
                  className="py-2.5 px-3 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-cyan-300 font-black text-xs cursor-pointer shadow"
                >
                  ⚡ Force 7 (লাকি ৭)
                </button>
                <button
                  onClick={() => handleForceRoll(4)}
                  className="py-2.5 px-3 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-400 text-purple-300 font-black text-xs cursor-pointer shadow"
                >
                  Force Down (৪ পড়বে)
                </button>
                <button
                  onClick={() => handleForceRoll(10)}
                  className="py-2.5 px-3 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-400 text-purple-300 font-black text-xs cursor-pointer shadow"
                >
                  Force Up (১০ পড়বে)
                </button>
                <div className="flex gap-1">
                  <input
                    type="number"
                    min="2"
                    max="12"
                    value={forceDiceSum}
                    onChange={(e) => setForceDiceSum(Number(e.target.value))}
                    className="w-16 px-2 py-1 rounded-xl bg-slate-950 border border-slate-700 text-center font-mono font-bold text-xs"
                  />
                  <button
                    onClick={() => handleForceRoll(forceDiceSum)}
                    className="flex-1 py-1 px-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs cursor-pointer"
                  >
                    সেট
                  </button>
                </div>
              </div>

              {forceMessage && (
                <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs flex items-center gap-1.5 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{forceMessage}</span>
                </div>
              )}
            </div>

            {/* Payout Multipliers Setting */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h4 className="text-sm font-black text-white">উইনিং পেআউট গুণফল নির্ধারণ (Payout Multipliers):</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block">২-৬ ডাউন গুণফল (X)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.sevenUpDownConfig?.payoutMultiplierDown || 2.0}
                    onChange={(e) => {
                      updateSettings({
                        sevenUpDownConfig: {
                          ...settings.sevenUpDownConfig,
                          payoutMultiplierDown: Number(e.target.value)
                        }
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block">৮-১২ আপ গুণফল (X)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.sevenUpDownConfig?.payoutMultiplierUp || 2.0}
                    onChange={(e) => {
                      updateSettings({
                        sevenUpDownConfig: {
                          ...settings.sevenUpDownConfig,
                          payoutMultiplierUp: Number(e.target.value)
                        }
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block">৭ নরমাল গুণফল (X)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.sevenUpDownConfig?.payoutMultiplierSeven || 4.0}
                    onChange={(e) => {
                      updateSettings({
                        sevenUpDownConfig: {
                          ...settings.sevenUpDownConfig,
                          payoutMultiplierSeven: Number(e.target.value)
                        }
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block">৭ লাইটনিং গুণফল (X)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.sevenUpDownConfig?.lightningMultiplierSeven || 6.0}
                    onChange={(e) => {
                      updateSettings({
                        sevenUpDownConfig: {
                          ...settings.sevenUpDownConfig,
                          lightningMultiplierSeven: Number(e.target.value)
                        }
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: LUDO & SNAKE SETTINGS */}
        {/* ========================================================= */}
        {activeTab === 'LUDO' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-base font-black text-white">লুডু ও সাপ-লুডু এরিনা কন্ট্রোলার</h3>
              <p className="text-xs text-slate-400">এন্ট্রি ফি এবং ফেয়ার-প্লে অ্যালগরিদম পরিচালনা করুন</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h4 className="text-sm font-black text-amber-400">এন্ট্রি ফি সেটিংস:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block">1v1 Battle (৳)</label>
                  <input
                    type="number"
                    value={settings.ludoConfig.entryFees['1v1']}
                    onChange={(e) => {
                      updateSettings({
                        ludoConfig: {
                          ...settings.ludoConfig,
                          entryFees: { ...settings.ludoConfig.entryFees, '1v1': Number(e.target.value) }
                        }
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block">2v2 Team (৳)</label>
                  <input
                    type="number"
                    value={settings.ludoConfig.entryFees['2v2']}
                    onChange={(e) => {
                      updateSettings({
                        ludoConfig: {
                          ...settings.ludoConfig,
                          entryFees: { ...settings.ludoConfig.entryFees, '2v2': Number(e.target.value) }
                        }
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block">4v4 Royal (৳)</label>
                  <input
                    type="number"
                    value={settings.ludoConfig.entryFees['4v4']}
                    onChange={(e) => {
                      updateSettings({
                        ludoConfig: {
                          ...settings.ludoConfig,
                          entryFees: { ...settings.ludoConfig.entryFees, '4v4': Number(e.target.value) }
                        }
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block">সাপ-লুডু ফি (৳)</label>
                  <input
                    type="number"
                    value={settings.ludoConfig.entryFees.snake}
                    onChange={(e) => {
                      updateSettings({
                        ludoConfig: {
                          ...settings.ludoConfig,
                          entryFees: { ...settings.ludoConfig.entryFees, snake: Number(e.target.value) }
                        }
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: WALLET & SMS CHECKER */}
        {/* ========================================================= */}
        {activeTab === 'WALLET_SMS' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-black text-white">ওয়ালেট ও পেমেন্ট SMS গেটওয়ে</h3>
              <p className="text-xs text-slate-400">ডিপোজিট এবং ক্যাশআউট অনুমোদন করুন</p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase">
                  <tr>
                    <th className="p-3">ইউজার ও ধরন</th>
                    <th className="p-3">মেথড ও TrxID</th>
                    <th className="p-3">পরিমাণ (৳)</th>
                    <th className="p-3">স্ট্যাটাস</th>
                    <th className="p-3">তারিখ</th>
                    <th className="p-3 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 font-bold">
                        কোনো পেন্ডিং লেনদেন নেই
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-950/40">
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.type === 'DEPOSIT' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-pink-950 text-pink-400 border border-pink-500/30'
                          }`}>
                            {tx.type}
                          </span>
                          <span className="font-bold text-white block mt-1">{tx.userName}</span>
                        </td>
                        <td className="p-3 font-mono">
                          <span className="text-amber-400 font-bold">{tx.method}</span>
                          <div className="text-[10px] text-slate-400">Trx: {tx.trxId || 'N/A'}</div>
                          <div className="text-[10px] text-slate-500">{tx.phoneNumber}</div>
                        </td>
                        <td className="p-3 font-mono font-black text-amber-300 text-sm">
                          ৳{tx.amount}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-400' : tx.status === 'PENDING' ? 'bg-yellow-950 text-yellow-400 animate-pulse' : 'bg-red-950 text-red-400'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400 text-[11px] font-mono">
                          {tx.createdAt}
                        </td>
                        <td className="p-3 text-right space-x-1 whitespace-nowrap">
                          {tx.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => {
                                  approveTransaction(tx.id);
                                  sound.playVictory();
                                }}
                                className="py-1 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer"
                              >
                                অনুমোদন করুন
                              </button>
                              <button
                                onClick={() => {
                                  rejectTransaction(tx.id);
                                  sound.playError();
                                }}
                                className="py-1 px-2.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-400 font-bold text-[11px] border border-red-500/30 cursor-pointer"
                              >
                                বাতিল
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Test SMS Simulator */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-3">
              <h4 className="text-sm font-black text-cyan-300">
                অটোমেটিক SMS সিমুলেটর (Test SMS Checker Simulator):
              </h4>
              <form onSubmit={handleSimulateSMS} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <select
                  value={simSender}
                  onChange={(e) => setSimSender(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Rocket">Rocket</option>
                </select>
                <input
                  type="text"
                  required
                  placeholder="TrxID (যেমন: 9K4L2M8P1Q)"
                  value={simTrxId}
                  onChange={(e) => setSimTrxId(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono uppercase"
                />
                <input
                  type="number"
                  required
                  placeholder="টাকা"
                  value={simAmount}
                  onChange={(e) => setSimAmount(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                />
                <button
                  type="submit"
                  className="py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs cursor-pointer"
                >
                  সিমুলেট করুন
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: CMS, BRANDING & NOTICE */}
        {/* ========================================================= */}
        {activeTab === 'CMS' && (
          <form onSubmit={handleSaveCMS} className="space-y-6 max-w-3xl">
            <div>
              <h3 className="text-base font-black text-white">ওয়েবসাইটের নাম, ব্র্যান্ডিং এবং নোটিশ কন্ট্রোল</h3>
              <p className="text-xs text-slate-400">ওয়েবসাইটের মূল লোগো, নাম, রেফারেল সিস্টেম ও নোটিশ পরিচালনা করুন</p>
            </div>

            {/* 1. Website Branding */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-3 shadow-md">
              <h4 className="text-sm font-black text-amber-400">ওয়েবসাইটের মূল নাম ও ব্র্যান্ড লোগো (Brand Identity)</h4>
              <p className="text-xs text-slate-400">এখানে আপনি ইচ্ছামতো নাম ও লোগো পরিবর্তন করলে পুরো সাইটে তাৎক্ষণিক আপডেট হয়ে যাবে।</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] text-slate-400 block mb-1">ওয়েবসাইটের মূল নাম (Brand Name)</label>
                  <input
                    type="text"
                    required
                    value={siteBrandName}
                    onChange={(e) => setSiteBrandName(e.target.value)}
                    placeholder="যেমন: XEB TOUR"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">লোগো আইকন / ইমোজি</label>
                  <input
                    type="text"
                    value={siteLogoIcon}
                    onChange={(e) => setSiteLogoIcon(e.target.value)}
                    placeholder="⚡"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="text-[11px] text-slate-400 block mb-1">কাস্টম ইমেজ লোগো URL (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={siteLogoUrl}
                    onChange={(e) => setSiteLogoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* 2. Referral System On/Off Toggle (User Requested!) */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-amber-400">রেফারেল সিস্টেম কন্ট্রোল (Referral On/Off)</h4>
                  <p className="text-xs text-slate-400">অফ করলে সকল ইউজারের প্রোফাইল থেকে রেফার কোড হাইড হয়ে যাবে।</p>
                </div>
                <button
                  type="button"
                  onClick={() => setReferralEnabled(!referralEnabled)}
                  className={`py-1.5 px-4 rounded-xl text-xs font-black cursor-pointer transition-all ${
                    referralEnabled 
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' 
                      : 'bg-red-950 text-red-400 border border-red-500/40'
                  }`}
                >
                  {referralEnabled ? 'রেফারেল চালু (ON)' : 'রেফারেল বন্ধ (OFF)'}
                </button>
              </div>

              {referralEnabled && (
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">ম্যাচ জয়েন কমিশন শতকরা (%)</label>
                  <input
                    type="number"
                    value={referralPercent}
                    onChange={(e) => setReferralPercent(Number(e.target.value))}
                    className="w-48 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                  />
                </div>
              )}
            </div>

            {/* 3. Dynamic Popup Notice */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-amber-400">ওয়েবসাইট পপ-আপ নোটিশ</h4>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={noticeEnabled}
                    onChange={(e) => setNoticeEnabled(e.target.checked)}
                    className="accent-amber-400"
                  />
                  <span>নোটিশ অন রাখুন</span>
                </label>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="text-[11px] text-slate-400">শিরোনাম</label>
                  <input
                    type="text"
                    value={noticeTitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400">বিবরণ (বাংলায়)</label>
                  <textarea
                    rows={3}
                    value={noticeDesc}
                    onChange={(e) => setNoticeDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* 4. Payment Numbers */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-md">
              <h4 className="text-sm font-black text-emerald-400">অফিশিয়াল পেমেন্ট নম্বর সমূহ</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">বিকাশ (bKash) নম্বর</label>
                  <input
                    type="text"
                    value={bKashNum}
                    onChange={(e) => setBKashNum(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">নগদ (Nagad) নম্বর</label>
                  <input
                    type="text"
                    value={nagadNum}
                    onChange={(e) => setNagadNum(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">রকেট (Rocket) নম্বর</label>
                  <input
                    type="text"
                    value={rocketNum}
                    onChange={(e) => setRocketNum(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-sm cursor-pointer shadow-lg"
            >
              CMS সেটিংস সেভ করুন
            </button>
          </form>
        )}

        {/* ========================================================= */}
        {/* TAB 8: SECURITY & MASTER ADMIN CREDENTIALS */}
        {/* ========================================================= */}
        {activeTab === 'SECURITY' && (
          <form onSubmit={handleSaveCredentials} className="space-y-4 max-w-md">
            <div>
              <h3 className="text-base font-black text-white">সুপার অ্যাডমিন সিকিউরিটি</h3>
              <p className="text-xs text-slate-400">আপনার অ্যাডমিন ইউজারনেম এবং মাস্টার পাসওয়ার্ড পরিবর্তন করুন</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-4 shadow-md">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  অ্যাডমিন ইউজারনেম
                </label>
                <input
                  type="text"
                  required
                  value={newAdminUser}
                  onChange={(e) => setNewAdminUser(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs sm:text-sm font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  মাস্টার পাসওয়ার্ড
                </label>
                <input
                  type="text"
                  required
                  value={newAdminPass}
                  onChange={(e) => setNewAdminPass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs sm:text-sm"
                />
              </div>

              {credMessage && (
                <div className="p-3 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{credMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
              >
                পাসওয়ার্ড আপডেট করুন
              </button>
            </div>
          </form>
        )}

      </main>
    </div>
  );
};
