import React, { useState } from 'react';
import { X, Key, Lock, Copy, Check, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sound } from '../services/sound';

export const RoomIdModal: React.FC = () => {
  const { 
    selectedTournamentForRoom, 
    setSelectedTournamentForRoom, 
    activeModal, 
    setActiveModal,
    currentUser,
    setSelectedTournamentForJoin 
  } = useApp();

  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  const tournament = selectedTournamentForRoom;

  if (activeModal !== 'ROOM_ID' || !tournament) return null;

  const handleClose = () => {
    sound.playClick();
    setActiveModal(null);
    setSelectedTournamentForRoom(null);
    setCopiedId(false);
    setCopiedPass(false);
  };

  const isJoined = tournament.slots.some(s => s.userId === currentUser?.id);

  const copyToClipboard = (text: string, type: 'id' | 'pass') => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-amber-500/40 shadow-2xl shadow-amber-950/30 text-slate-900 dark:text-white animate-scale-in"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                কাস্টম রুম তথ্য (Room ID & Pass)
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {tournament.title}
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

        {/* Body content */}
        <div className="p-5 space-y-4">
          {!tournament.isRoomReady || !tournament.roomId ? (
            /* Room ID not given yet */
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-500 mx-auto flex items-center justify-center">
                <Clock className="w-6 h-6 animate-spin" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-amber-600 dark:text-amber-300">
                  রুম আইডি ও পাসওয়ার্ড এখনো দেওয়া হয়নি
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  ম্যাচ শুরু হওয়ার ঠিক ১০ মিনিট আগে অ্যাডমিন প্যানেল থেকে Room ID এবং Password এখানে লাইভ আপডেট করা হবে। অপেক্ষা করুন।
                </p>
              </div>
            </div>
          ) : !isJoined ? (
            /* Room ready but user has not joined */
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 mx-auto flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-red-500">
                  আপনি এই ম্যাচে জয়েন করেননি!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  রুম আইডি ও পাসওয়ার্ড দেখার জন্য আপনাকে অবশ্যই এই টুর্নামেন্টে জয়েন করতে হবে।
                </p>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedTournamentForJoin(tournament);
                  setActiveModal('JOIN_MATCH');
                }}
                className="py-2 px-4 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-colors shadow-md"
              >
                এখনই জয়েন করুন (Join)
              </button>
            </div>
          ) : (
            /* User is joined & Room is published */
            <div className="space-y-3.5">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>রুম উন্মুক্ত হয়েছে! নির্ধারিত সময়ের মধ্যে ফ্রি ফায়ার রুমে প্রবেশ করুন:</span>
              </div>

              {/* Room ID Box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                  রুম আইডি (Room ID):
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xl font-black text-amber-500 tracking-wider">
                    {tournament.roomId}
                  </span>
                  <button
                    onClick={() => copyToClipboard(tournament.roomId!, 'id')}
                    className="py-1.5 px-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                  </button>
                </div>
              </div>

              {/* Room Password Box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                  রুম পাসওয়ার্ড (Password):
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xl font-black text-blue-600 dark:text-cyan-400 tracking-wider">
                    {tournament.roomPassword || '123'}
                  </span>
                  <button
                    onClick={() => copyToClipboard(tournament.roomPassword || '123', 'pass')}
                    className="py-1.5 px-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    {copiedPass ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPass ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="pt-1">
            <button
              onClick={handleClose}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
            >
              বন্ধ করুন (Close)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
