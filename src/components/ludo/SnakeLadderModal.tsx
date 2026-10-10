import React, { useState } from 'react';
import { X, Play, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { sound } from '../../services/sound';

export const SnakeLadderModal: React.FC = () => {
  const { 
    currentUser, 
    activeModal, 
    setActiveModal, 
    claimLudoWin, 
    settings,
    openAuthModal 
  } = useApp();

  const [gameState, setGameState] = useState<'LOBBY' | 'PLAYING' | 'WON' | 'LOST'>('LOBBY');
  const [playerPos, setPlayerPos] = useState<number>(1);
  const [botPos, setBotPos] = useState<number>(1);
  const [diceNumber, setDiceNumber] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [statusText, setStatusText] = useState<string>('ডাইস রোল করুন');

  const entryFee = settings.ludoConfig.entryFees.snake || 25;
  const prizePool = Math.round(entryFee * 1.8);

  const ladders: Record<number, number> = {
    4: 14, 9: 31, 20: 38, 28: 84, 40: 59, 51: 67, 63: 81, 71: 91
  };

  const snakes: Record<number, number> = {
    17: 7, 54: 34, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 99: 78
  };

  if (activeModal !== 'SNAKE_LADDER') return null;

  const handleClose = () => {
    sound.playClick();
    setActiveModal(null);
    setGameState('LOBBY');
  };

  const handleStart = () => {
    if (!currentUser || !currentUser.username) {
      openAuthModal('LOGIN');
      return;
    }

    if (currentUser.totalBalance < entryFee) {
      sound.playError();
      alert(`খেলতে সর্বনিম্ন ৳${entryFee} ব্যালেন্স প্রয়োজন! Add Money করুন।`);
      return;
    }
    sound.playClick();
    setPlayerPos(1);
    setBotPos(1);
    setIsPlayerTurn(true);
    setStatusText('আপনার চাল! ডাইস রোল করুন');
    setGameState('PLAYING');
  };

  const rollDice = () => {
    if (isRolling || !isPlayerTurn || gameState !== 'PLAYING') return;
    setIsRolling(true);
    sound.playDiceRoll();

    setTimeout(() => {
      const rolled = Math.floor(Math.random() * 6) + 1;
      setDiceNumber(rolled);
      setIsRolling(false);

      let nextPos = playerPos + rolled;
      if (nextPos > 100) nextPos = playerPos;

      if (ladders[nextPos]) {
        sound.playVictory();
        nextPos = ladders[nextPos];
        setStatusText(`মই পেয়ে উপরে উঠেছেন #${nextPos}-এ!`);
      } else if (snakes[nextPos]) {
        sound.playError();
        nextPos = snakes[nextPos];
        setStatusText(`সাপ কেটে নেমে গেছেন #${nextPos}-এ!`);
      } else {
        setStatusText(`পড়েছে ${rolled}! আপনি আছেন #${nextPos}-এ`);
      }

      setPlayerPos(nextPos);

      if (nextPos >= 100) {
        sound.playVictory();
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        setGameState('WON');
        return;
      }

      setIsPlayerTurn(false);
      setTimeout(botTurn, 1000);
    }, 600);
  };

  const botTurn = () => {
    setIsRolling(true);
    sound.playDiceRoll();

    setTimeout(() => {
      const rolled = Math.floor(Math.random() * 6) + 1;
      setDiceNumber(rolled);
      setIsRolling(false);

      let nextPos = botPos + rolled;
      if (nextPos > 100) nextPos = botPos;

      if (ladders[nextPos]) nextPos = ladders[nextPos];
      else if (snakes[nextPos]) nextPos = snakes[nextPos];

      setBotPos(nextPos);

      if (nextPos >= 100) {
        sound.playError();
        setGameState('LOST');
        return;
      }

      setIsPlayerTurn(true);
      setStatusText('আপনার চাল! ডাইস রোল করুন');
    }, 600);
  };

  const handleClaimReward = () => {
    sound.playVictory();
    claimLudoWin(prizePool, 'Snake & Ladder');
    handleClose();
  };

  const rows: number[][] = [];
  for (let r = 9; r >= 0; r--) {
    const rowNums: number[] = [];
    if (r % 2 === 1) {
      for (let c = 10; c >= 1; c--) rowNums.push(r * 10 + c);
    } else {
      for (let c = 1; c <= 10; c++) rowNums.push(r * 10 + c);
    }
    rows.push(rowNums);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/95 backdrop-blur-xl animate-fade-in select-none">
      <div 
        className="relative w-full max-w-md max-h-[96vh] flex flex-col rounded-3xl bg-gradient-to-b from-rose-950 via-slate-950 to-rose-950 border border-rose-500/40 shadow-2xl text-white overflow-hidden"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-rose-900/60 border-b border-rose-500/30">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐍</span>
            <div>
              <h3 className="text-sm sm:text-base font-black tracking-wider text-yellow-300">
                SNAKE & LADDER ARENA
              </h3>
              <p className="text-[10px] text-rose-200">ক্লাসিক সাপ ও মই প্রতিযোগিতা</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400 bg-black/50 px-2.5 py-1 rounded-lg border border-amber-500/30">
              প্রাইজ: ৳{prizePool}
            </span>
            <button
              onClick={handleClose}
              className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 overflow-y-auto flex-1 flex flex-col items-center justify-between space-y-3 custom-scrollbar">
          {gameState === 'LOBBY' && (
            <div className="w-full space-y-4 text-center my-auto">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-rose-600/30 border-2 border-yellow-400 p-2 flex items-center justify-center text-4xl shadow-xl">
                🐍
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-yellow-300">সাপ-লুডু চ্যালেঞ্জ!</h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  ১০০ ঘরে পৌঁছান আর জিতে নিন ৳{prizePool}!
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 max-w-xs mx-auto flex items-center justify-between text-xs">
                <span className="text-slate-400">এন্ট্রি ফি:</span>
                <span className="font-mono text-base font-black text-amber-400">৳{entryFee}</span>
              </div>
              <button
                onClick={handleStart}
                className="w-full max-w-xs py-3.5 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black text-base shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                খেলা শুরু করুন (৳{entryFee})
              </button>
            </div>
          )}

          {gameState === 'PLAYING' && (
            <div className="w-full flex flex-col items-center space-y-3">
              <div className="text-xs font-bold text-yellow-300 bg-slate-900/90 px-3 py-1 rounded-full border border-rose-500/30 text-center">
                {statusText}
              </div>

              {/* 10x10 BOARD MATRIX */}
              <div className="relative w-72 sm:w-80 aspect-square rounded-2xl bg-[#ffdede] border-4 border-yellow-400 shadow-2xl overflow-hidden p-1">
                <div className="grid grid-cols-10 grid-rows-10 w-full h-full gap-[1px] bg-rose-300/40">
                  {rows.flatMap((row) =>
                    row.map((cellNum) => {
                      const isEven = cellNum % 2 === 0;
                      const hasPlayer = playerPos === cellNum;
                      const hasBot = botPos === cellNum;
                      const hasLadder = Boolean(ladders[cellNum]);
                      const hasSnake = Boolean(snakes[cellNum]);

                      return (
                        <div
                          key={cellNum}
                          className={`relative flex items-center justify-center font-bold text-[8px] sm:text-[9px] ${
                            isEven ? 'bg-[#ffcccc] text-slate-900' : 'bg-[#fff0f0] text-slate-900'
                          }`}
                        >
                          {cellNum === 100 ? <span>🏁</span> : <span>{cellNum}</span>}
                          {hasSnake && <span className="absolute top-0 right-0 text-[8px] text-emerald-700">🐍</span>}
                          {hasLadder && <span className="absolute top-0 left-0 text-[8px] text-sky-600">🪜</span>}
                          {hasPlayer && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs animate-bounce">🔵</span>
                            </div>
                          )}
                          {hasBot && !hasPlayer && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs">🔴</span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Controller */}
              <div className="w-full max-w-sm pt-2">
                <div className="relative p-2 rounded-2xl bg-rose-900/80 border-2 border-yellow-400 flex items-center justify-between shadow-xl">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-800 border border-blue-400">
                    <span className="text-xs font-black text-yellow-300">You: #{playerPos}</span>
                  </div>

                  <div className="relative flex flex-col items-center">
                    {isPlayerTurn && (
                      <div className="absolute -top-7 text-yellow-400 text-lg font-black animate-bounce">
                        👇
                      </div>
                    )}
                    <button
                      onClick={rollDice}
                      disabled={isRolling || !isPlayerTurn}
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-white via-slate-100 to-sky-200 border-3 border-blue-400 shadow-lg flex items-center justify-center font-black text-2xl text-blue-900 transition-all active:scale-95 cursor-pointer ${
                        isRolling ? 'animate-spin' : isPlayerTurn ? 'ring-4 ring-yellow-400 animate-pulse' : 'opacity-85'
                      }`}
                    >
                      {diceNumber}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-800 border border-red-400">
                    <span className="text-xs font-black text-yellow-300">Bot: #{botPos}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WON STATE */}
          {gameState === 'WON' && (
            <div className="py-8 text-center space-y-4 my-auto animate-scale-in">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 text-slate-950 mx-auto flex items-center justify-center text-3xl shadow-xl">
                👑
              </div>
              <h3 className="text-2xl font-black text-yellow-300">YOU WIN! (আপনি বিজয়ী হয়েছেন!)</h3>
              <div className="p-3 rounded-2xl bg-slate-950 border border-yellow-400 max-w-xs mx-auto font-mono text-2xl font-black text-yellow-400">
                + ৳{prizePool}
              </div>
              <button
                onClick={handleClaimReward}
                className="py-3 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                CLAIM PRIZE
              </button>
            </div>
          )}

          {/* LOST STATE */}
          {gameState === 'LOST' && (
            <div className="py-8 text-center space-y-4 my-auto animate-scale-in">
              <h3 className="text-xl font-black text-red-400">আপনি হেরে গেছেন!</h3>
              <button
                onClick={handleClose}
                className="py-2.5 px-6 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
