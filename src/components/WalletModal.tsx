import React, { useState } from 'react';
import { 
  X, Wallet, ArrowDownCircle, ArrowUpCircle, History, 
  Copy, Check, ShieldCheck, AlertCircle, Sparkles, Smartphone 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PaymentMethod } from '../types';
import { sound } from '../services/sound';

export const WalletModal: React.FC = () => {
  const { 
    currentUser, 
    activeModal, 
    setActiveModal, 
    settings, 
    transactions,
    addDepositRequest,
    addWithdrawRequest 
  } = useApp();

  const [walletTab, setWalletTab] = useState<'OVERVIEW' | 'ADD_MONEY' | 'WITHDRAW' | 'HISTORY'>('OVERVIEW');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('bKash');

  // Deposit form
  const [depositAmount, setDepositAmount] = useState<number>(200);
  const [depositPhone, setDepositPhone] = useState<string>(currentUser?.phone || '');
  const [depositTrxId, setDepositTrxId] = useState<string>('');

  // Withdraw form
  const [withdrawAmount, setWithdrawAmount] = useState<number>(150);
  const [withdrawPhone, setWithdrawPhone] = useState<string>(currentUser?.phone || '');

  const [notification, setNotification] = useState<{ text: string; success: boolean } | null>(null);
  const [copiedNumber, setCopiedNumber] = useState<boolean>(false);

  if (activeModal !== 'WALLET') return null;

  const handleClose = () => {
    sound.playClick();
    setActiveModal(null);
    setNotification(null);
  };

  const currentPayNumber = selectedMethod === 'bKash' 
    ? settings.paymentNumbers.bKash 
    : selectedMethod === 'Nagad' 
    ? settings.paymentNumbers.nagad 
    : settings.paymentNumbers.rocket;

  const currentPayType = selectedMethod === 'bKash' 
    ? settings.paymentNumbers.bKashType 
    : selectedMethod === 'Nagad' 
    ? settings.paymentNumbers.nagadType 
    : settings.paymentNumbers.rocketType;

  const handleCopyNumber = () => {
    sound.playClick();
    navigator.clipboard.writeText(currentPayNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addDepositRequest(selectedMethod, Number(depositAmount), depositPhone, depositTrxId);
    setNotification({ text: res.message, success: res.success });
    if (res.success && res.autoVerified) {
      setDepositTrxId('');
      setTimeout(() => {
        setWalletTab('OVERVIEW');
        setNotification(null);
      }, 2500);
    }
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addWithdrawRequest(selectedMethod, Number(withdrawAmount), withdrawPhone);
    setNotification({ text: res.message, success: res.success });
    if (res.success) {
      setTimeout(() => {
        setWalletTab('OVERVIEW');
        setNotification(null);
      }, 2000);
    }
  };

  const userTransactions = transactions.filter(t => t.userId === currentUser?.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div 
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-emerald-500/40 shadow-2xl shadow-emerald-950/40 text-slate-900 dark:text-white animate-scale-in overflow-hidden"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                ডিজিটাল ওয়ালেট ও ব্যালেন্স
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                অটোমেটেড পেমেন্ট ও SMS ভেরিফিকেশন সিস্টেম
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4-Tab Navigation */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-slate-100 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
          <button
            onClick={() => { sound.playClick(); setWalletTab('OVERVIEW'); setNotification(null); }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${walletTab === 'OVERVIEW' ? 'bg-white dark:bg-slate-800 text-amber-500 shadow' : 'text-slate-500 dark:text-slate-400'}`}
          >
            ওভারভিউ
          </button>
          <button
            onClick={() => { sound.playClick(); setWalletTab('ADD_MONEY'); setNotification(null); }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${walletTab === 'ADD_MONEY' ? 'bg-emerald-600 text-white shadow' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Add Money
          </button>
          <button
            onClick={() => { sound.playClick(); setWalletTab('WITHDRAW'); setNotification(null); }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${walletTab === 'WITHDRAW' ? 'bg-pink-600 text-white shadow' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Withdraw
          </button>
          <button
            onClick={() => { sound.playClick(); setWalletTab('HISTORY'); setNotification(null); }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${walletTab === 'HISTORY' ? 'bg-white dark:bg-slate-800 text-blue-500 dark:text-cyan-400 shadow' : 'text-slate-500 dark:text-slate-400'}`}
          >
            হিস্ট্রি
          </button>
        </div>

        {/* Body Area */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 custom-scrollbar space-y-4">
          {notification && (
            <div className={`p-3 rounded-2xl text-xs flex items-start gap-2 ${
              notification.success 
                ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40' 
                : 'bg-red-50 dark:bg-red-950/80 text-red-600 dark:text-red-300 border border-red-300 dark:border-red-500/40'
            }`}>
              {notification.success ? <Check className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
              <span>{notification.text}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {walletTab === 'OVERVIEW' && (
            <div className="space-y-4">
              {/* 3 Main Balances Cards */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-gradient-to-b dark:from-slate-950 dark:to-slate-900 border border-amber-500/30">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                    Total Balance
                  </span>
                  <span className="text-base sm:text-lg font-black text-amber-500 font-mono mt-1 block">
                    ৳{currentUser?.totalBalance || 0}
                  </span>
                  <span className="text-[10px] text-slate-400">সর্বমোট ব্যালেন্স</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-gradient-to-b dark:from-slate-950 dark:to-slate-900 border border-emerald-500/30">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                    Deposit Balance
                  </span>
                  <span className="text-base sm:text-lg font-black text-emerald-500 font-mono mt-1 block">
                    ৳{currentUser?.depositBalance || 0}
                  </span>
                  <span className="text-[10px] text-slate-400">ম্যাচ খেলার ফান্ড</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-gradient-to-b dark:from-slate-950 dark:to-slate-900 border border-pink-500/30">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                    Winning Balance
                  </span>
                  <span className="text-base sm:text-lg font-black text-pink-500 font-mono mt-1 block">
                    ৳{currentUser?.winningBalance || 0}
                  </span>
                  <span className="text-[10px] text-slate-400">উত্তোলনযোগ্য</span>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => { sound.playClick(); setWalletTab('ADD_MONEY'); }}
                  className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                >
                  <ArrowDownCircle className="w-4 h-4" />
                  <span>Add Money (টাকা যোগ)</span>
                </button>
                <button
                  onClick={() => { sound.playClick(); setWalletTab('WITHDRAW'); }}
                  className="py-3 px-4 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-600/20 active:scale-95 transition-all cursor-pointer"
                >
                  <ArrowUpCircle className="w-4 h-4" />
                  <span>Withdraw (টাকা তোলা)</span>
                </button>
              </div>

              {/* SMS Gateway Badge */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5 animate-pulse" />
                </div>
                <div className="text-xs">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>অটোমেটিক SMS পেমেন্ট গেটওয়ে</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    টাকা পাঠানোর পর সঠিক TrxID দিলেই অ্যাকাউন্ট ব্যালেন্স স্বয়ংক্রিয়ভাবে ক্রেডিট হবে।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADD MONEY */}
          {walletTab === 'ADD_MONEY' && (
            <div className="space-y-4">
              {/* Method Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  পেমেন্ট মাধ্যম নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['bKash', 'Nagad', 'Rocket'] as PaymentMethod[]).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => { sound.playClick(); setSelectedMethod(method); }}
                      className={`py-2 px-3 rounded-xl font-black text-xs border transition-all cursor-pointer ${
                        selectedMethod === method
                          ? method === 'bKash'
                            ? 'bg-pink-600 border-pink-400 text-white shadow'
                            : method === 'Nagad'
                            ? 'bg-orange-600 border-orange-400 text-white shadow'
                            : 'bg-purple-600 border-purple-400 text-white shadow'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {method === 'bKash' ? 'বিকাশ' : method === 'Nagad' ? 'নগদ' : 'রকেট'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number Copy Box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>অফিশিয়াল {selectedMethod} ({currentPayType}) নম্বর:</span>
                  <span className="text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Send Money করুন
                  </span>
                </div>
                <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="font-mono text-base font-black text-slate-900 dark:text-white tracking-wider">
                    {currentPayNumber}
                  </span>
                  <button
                    onClick={handleCopyNumber}
                    className="py-1 px-3 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNumber ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                  </button>
                </div>
              </div>

              {/* Deposit Form */}
              <form onSubmit={handleDepositSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      টাকার পরিমাণ (৳)
                    </label>
                    <input
                      type="number"
                      min="20"
                      required
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      যে নম্বর থেকে পাঠিয়েছেন
                    </label>
                    <input
                      type="text"
                      required
                      value={depositPhone}
                      onChange={(e) => setDepositPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Transaction ID (TrxID) *</span>
                    <span className="text-[10px] text-emerald-500 font-mono flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>অটো ভেরিফাই হবে</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    value={depositTrxId}
                    onChange={(e) => setDepositTrxId(e.target.value)}
                    placeholder="যেমন: 9K4L2M8P1Q"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-emerald-400 font-mono text-sm uppercase tracking-wider focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>ডিপোজিট সাবমিট করুন</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: WITHDRAW */}
          {walletTab === 'WITHDRAW' && (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-500/30 flex items-center justify-between text-xs">
                <span className="text-slate-700 dark:text-slate-300">উত্তোলনযোগ্য উইনিং ব্যালেন্স:</span>
                <span className="font-mono text-base font-black text-pink-600 dark:text-pink-400">৳{currentUser?.winningBalance || 0}</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  উত্তোলনের মাধ্যম:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['bKash', 'Nagad', 'Rocket'] as PaymentMethod[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => { sound.playClick(); setSelectedMethod(m); }}
                      className={`py-2 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                        selectedMethod === m 
                          ? 'bg-pink-600 text-white border-pink-400' 
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {m === 'bKash' ? 'বিকাশ' : m === 'Nagad' ? 'নগদ' : 'রকেট'}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleWithdrawSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    টাকার পরিমাণ (সর্বনিম্ন ১০০ ৳)
                  </label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    আপনার {selectedMethod} মোবাইল নম্বর
                  </label>
                  <input
                    type="text"
                    required
                    value={withdrawPhone}
                    onChange={(e) => setWithdrawPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={(currentUser?.winningBalance || 0) < withdrawAmount || withdrawAmount < 100}
                  className={`w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                    (currentUser?.winningBalance || 0) >= withdrawAmount && withdrawAmount >= 100
                      ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-pink-600/30'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <ArrowUpCircle className="w-4 h-4" />
                  <span>উত্তোলন রিকোয়েস্ট পাঠান (৳{withdrawAmount})</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: HISTORY */}
          {walletTab === 'HISTORY' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-1">
                <span>লেনদেন হিস্ট্রি:</span>
                <span>{userTransactions.length}টি রেকর্ড</span>
              </div>

              {userTransactions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  এখনো কোনো লেনদেন রেকর্ড নেই
                </div>
              ) : (
                <div className="space-y-2">
                  {userTransactions.map((tx) => (
                    <div 
                      key={tx.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${
                            tx.type === 'DEPOSIT' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                            tx.type === 'WINNING_PRIZE' || tx.type === 'SEVEN_UP_WIN' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' :
                            tx.type === 'WITHDRAW' ? 'bg-pink-500/20 text-pink-600 dark:text-pink-400' :
                            'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            {tx.type}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">{tx.description}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {tx.createdAt} {tx.trxId ? ` • TrxID: ${tx.trxId}` : ''}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-mono text-sm font-black ${
                          tx.type === 'DEPOSIT' || tx.type === 'WINNING_PRIZE' || tx.type === 'SEVEN_UP_WIN'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-red-500'
                        }`}>
                          {tx.type === 'DEPOSIT' || tx.type === 'WINNING_PRIZE' || tx.type === 'SEVEN_UP_WIN' ? '+' : '-'} ৳{tx.amount}
                        </span>
                        <div className="text-[10px] font-bold text-slate-400">
                          {tx.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
