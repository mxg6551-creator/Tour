import React, { useState } from 'react';
import { X, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { sound } from '../../services/sound';

type LudoMode = '1v1' | '2v2' | '4v4';

interface Pawn {
  id: number;
  inBase: boolean;
  step: number; // 0 to 36
  isFinished: boolean;
}

export const LudoArenaModal: React.FC = () => {
  const { 
    currentUser, 
    activeModal, 
    setActiveModal, 
    claimLudoWin, 
    settings,
    openAuthModal 
  } = useApp();

  const [mode, setMode] = useState<LudoMode>('1v1');
  const [gameState, setGameState] = useState<'LOBBY' | 'PLAYING' | 'WON' | 'LOST'>('LOBBY');

  const [currentTurn, setCurrentTurn] = useState<'blue' | 'green'>('blue');
  const [diceNumber, setDiceNumber] = useState<number>(6);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [hasRolled, setHasRolled] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>('ডাইস রোল করুন');
  const [lastAction, setLastAction] = useState<string>('');

  const [bluePawns, setBluePawns] = useState<Pawn[]>([
    { id: 0, inBase: true, step: 0, isFinished: false },
    { id: 1, inBase: true, step: 0, isFinished: false },
    { id: 2, inBase: true, step: 0, isFinished: false },
    { id: 3, inBase: true, step: 0, isFinished: false }
  ]);

  const [greenPawns, setGreenPawns] = useState<Pawn[]>([
    { id: 0, inBase: true, step: 0, isFinished: false },
    { id: 1, inBase: true, step: 0, isFinished: false },
    { id: 2, inBase: true, step: 0, isFinished: false },
    { id: 3, inBase: true, step: 0, isFinished: false }
  ]);

  const entryFee = settings.ludoConfig.entryFees[mode] || 30;
  const prizePool = Math.round(entryFee * settings.ludoConfig.winningMultiplier * (mode === '4v4' ? 4 : 2));

  if (activeModal !== 'LUDO_ARENA') return null;

  const handleClose = () => {
    sound.playClick();
    setActiveModal(null);
    setGameState('LOBBY');
  };

  const handleStartGame = () => {
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
    // Start with 1 pawn ready on start track for instant action
    setBluePawns([
      { id: 0, inBase: false, step: 0, isFinished: false },
      { id: 1, inBase: true, step: 0, isFinished: false },
      { id: 2, inBase: true, step: 0, isFinished: false },
      { id: 3, inBase: true, step: 0, isFinished: false }
    ]);
    setGreenPawns([
      { id: 0, inBase: false, step: 0, isFinished: false },
      { id: 1, inBase: true, step: 0, isFinished: false },
      { id: 2, inBase: true, step: 0, isFinished: false },
      { id: 3, inBase: true, step: 0, isFinished: false }
    ]);
    setCurrentTurn('blue');
    setHasRolled(false);
    setStatusText('আপনার চাল! ডাইস রোল করুন');
    setGameState('PLAYING');
  };

  const handleRollDice = () => {
    if (isRolling || hasRolled || currentTurn !== 'blue' || gameState !== 'PLAYING') return;

    setIsRolling(true);
    sound.playDiceRoll();

    setTimeout(() => {
      const rolled = Math.floor(Math.random() * 6) + 1;
      setDiceNumber(rolled);
      setIsRolling(false);
      setHasRolled(true);

      const canSpawn = rolled === 6 && bluePawns.some(p => p.inBase);
      const activePawns = bluePawns.filter(p => !p.inBase && !p.isFinished);
      const canMove = activePawns.length > 0;

      if (!canSpawn && !canMove) {
        setStatusText(`পড়েছে ${rolled}! কোনো চাল নেই, অপোনেন্টের চাল`);
        setTimeout(passTurnToOpponent, 900);
      } else if (rolled === 6 && bluePawns.every(p => p.inBase)) {
        spawnPlayerPawn();
      } else if (activePawns.length === 1 && !canSpawn) {
        movePlayerPawn(activePawns[0].id, rolled);
      } else {
        setStatusText(`পড়েছে ${rolled}! আপনার ঘুঁটি সিলেক্ট করুন`);
      }
    }, 600);
  };

  const spawnPlayerPawn = () => {
    const basePawn = bluePawns.find(p => p.inBase);
    if (!basePawn) return;
    sound.playCoin();
    setBluePawns(prev => prev.map(p => p.id === basePawn.id ? { ...p, inBase: false, step: 0 } : p));
    setLastAction('ঘুঁটি বেইস থেকে বের হয়েছে!');
    setStatusText('অতিরিক্ত চাল পেলেন! আবার রোল করুন');
    setHasRolled(false);
  };

  const movePlayerPawn = (pawnId: number, steps: number) => {
    sound.playClick();
    let gotCapture = false;

    setBluePawns(prev => {
      const updated = prev.map(p => {
        if (p.id === pawnId) {
          const nextStep = p.step + steps;
          if (nextStep >= 36) {
            return { ...p, step: 36, isFinished: true };
          }
          return { ...p, step: nextStep };
        }
        return p;
      });

      const movedPawn = updated.find(p => p.id === pawnId);
      if (movedPawn && movedPawn.isFinished) {
        setTimeout(() => {
          sound.playVictory();
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
          setGameState('WON');
        }, 500);
        return updated;
      }

      // Check capture opponent pawn if not safe tile
      if (movedPawn && movedPawn.step % 8 !== 0) {
        const capturedOpponent = greenPawns.find(gp => !gp.inBase && !gp.isFinished && gp.step === movedPawn.step);
        if (capturedOpponent) {
          gotCapture = true;
          sound.playVictory();
          setGreenPawns(gprev => gprev.map(gp => gp.id === capturedOpponent.id ? { ...gp, inBase: true, step: 0 } : gp));
          setLastAction('অপোনেন্টের ঘুঁটি কেটেছেন!');
        }
      }

      return updated;
    });

    if (steps === 6 || gotCapture) {
      setTimeout(() => {
        setHasRolled(false);
        setStatusText(gotCapture ? 'ঘুঁটি কেটেছেন! বোনাস চাল' : '৬ পড়েছে! অতিরিক্ত চাল');
      }, 700);
    } else {
      setTimeout(passTurnToOpponent, 800);
    }
  };

  const passTurnToOpponent = () => {
    setHasRolled(false);
    setCurrentTurn('green');
    setStatusText('অপোনেন্টের চাল... অপেক্ষা করুন');
    triggerOpponentTurn();
  };

  const triggerOpponentTurn = () => {
    setTimeout(() => {
      setIsRolling(true);
      sound.playDiceRoll();

      setTimeout(() => {
        const rolled = Math.floor(Math.random() * 6) + 1;
        setDiceNumber(rolled);
        setIsRolling(false);

        setGreenPawns(prev => {
          const activePawns = prev.filter(p => !p.inBase && !p.isFinished);
          let updated = [...prev];

          if (rolled === 6 && prev.some(p => p.inBase)) {
            const bIdx = updated.findIndex(p => p.inBase);
            if (bIdx !== -1) {
              updated[bIdx] = { ...updated[bIdx], inBase: false, step: 0 };
              sound.playCoin();
            }
          } else if (activePawns.length > 0) {
            const chosen = activePawns[0];
            const nextStep = chosen.step + rolled;
            if (nextStep >= 36) {
              updated = updated.map(p => p.id === chosen.id ? { ...p, step: 36, isFinished: true } : p);
              setTimeout(() => {
                sound.playError();
                setGameState('LOST');
              }, 500);
              return updated;
            }
            updated = updated.map(p => p.id === chosen.id ? { ...p, step: nextStep } : p);

            // Capture player
            if (nextStep % 8 !== 0) {
              const capPlayer = bluePawns.find(bp => !bp.inBase && !bp.isFinished && bp.step === nextStep);
              if (capPlayer) {
                sound.playError();
                setBluePawns(bprev => bprev.map(bp => bp.id === capPlayer.id ? { ...bp, inBase: true, step: 0 } : bp));
                setLastAction('আপনার ঘুঁটি কাটা গেছে!');
              }
            }
          }

          setTimeout(() => {
            setCurrentTurn('blue');
            setHasRolled(false);
            setStatusText('আপনার চাল! ডাইস রোল করুন');
          }, 800);

          return updated;
        });
      }, 600);
    }, 600);
  };

  const handleClaimReward = () => {
    sound.playVictory();
    claimLudoWin(prizePool, `Ludo King ${mode}`);
    handleClose();
  };

  const renderDicePips = (num: number) => {
    switch (num) {
      case 1:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-slate-900 shadow-inner" />
          </div>
        );
      case 2:
        return (
          <div className="w-full h-full p-2 flex justify-between">
            <span className="w-3 h-3 rounded-full bg-slate-900" />
            <span className="w-3 h-3 rounded-full bg-slate-900 self-end" />
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full p-1.5 flex flex-col justify-between">
            <span className="w-3 h-3 rounded-full bg-slate-900 self-start" />
            <span className="w-3 h-3 rounded-full bg-slate-900 self-center" />
            <span className="w-3 h-3 rounded-full bg-slate-900 self-end" />
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full p-2 grid grid-cols-2 grid-rows-2 gap-2 place-items-center">
            <span className="w-3 h-3 rounded-full bg-slate-900" />
            <span className="w-3 h-3 rounded-full bg-slate-900" />
            <span className="w-3 h-3 rounded-full bg-slate-900" />
            <span className="w-3 h-3 rounded-full bg-slate-900" />
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full p-1.5 grid grid-cols-3 grid-rows-3 place-items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 col-start-1 row-start-1" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 col-start-3 row-start-1" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 col-start-2 row-start-2" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 col-start-1 row-start-3" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 col-start-3 row-start-3" />
          </div>
        );
      case 6:
      default:
        return (
          <div className="w-full h-full p-2 grid grid-cols-2 grid-rows-3 gap-1 place-items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/95 backdrop-blur-xl animate-fade-in select-none">
      <div 
        className="relative w-full max-w-lg max-h-[96vh] flex flex-col rounded-3xl bg-gradient-to-b from-blue-950 via-slate-950 to-blue-950 border border-blue-500/40 shadow-2xl text-white overflow-hidden"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-blue-900/60 border-b border-blue-500/30 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎲</span>
            <div>
              <h3 className="text-sm sm:text-base font-black tracking-wider text-yellow-300 flex items-center gap-1.5">
                <span>LUDO KING LIVE ARENA</span>
                <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded border border-yellow-500/30">
                  {mode}
                </span>
              </h3>
              <p className="text-[10px] text-blue-200">ক্লাসিক ১৫×১৫ লুডু কিং এরিনা</p>
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
        <div className="p-3 sm:p-4 overflow-y-auto flex-1 flex flex-col items-center justify-between space-y-3 custom-scrollbar">
          {/* LOBBY VIEW */}
          {gameState === 'LOBBY' && (
            <div className="w-full space-y-4 text-center my-auto">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-600/30 border-2 border-yellow-400 p-2 flex items-center justify-center text-4xl shadow-xl shadow-yellow-500/20">
                🎲
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-yellow-300">লুডু কিং টুর্নামেন্ট!</h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  আসল ডাইস রোলিংয়ে খেলুন এবং জিতে নিন ৳{prizePool} ক্যাশ রিওয়ার্ড।
                </p>
              </div>

              {/* Mode Selectors */}
              <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                {(['1v1', '2v2', '4v4'] as LudoMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                      mode === m
                        ? 'bg-amber-500 text-slate-950 border-yellow-300 shadow-md font-black'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {m === '1v1' ? '1v1 Battle' : m === '2v2' ? '2v2 Team' : '4v4 Classic'}
                  </button>
                ))}
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 max-w-xs mx-auto flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">এন্ট্রি ফি:</span>
                <span className="text-base font-black text-amber-400">৳{entryFee}</span>
              </div>

              <button
                onClick={handleStartGame}
                className="w-full max-w-xs py-3.5 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black text-base shadow-xl shadow-yellow-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                ম্যাচ শুরু করুন (৳{entryFee})
              </button>
            </div>
          )}

          {/* ACTIVE PLAY VIEW */}
          {gameState === 'PLAYING' && (
            <div className="w-full flex flex-col items-center space-y-2">
              <div className="text-xs font-bold text-amber-300 bg-slate-900/90 px-4 py-1.5 rounded-full border border-amber-500/30 text-center animate-pulse">
                {statusText}
              </div>

              {lastAction && (
                <div className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-500/30">
                  {lastAction}
                </div>
              )}

              {/* 15x15 Ludo Board */}
              <div className="relative w-72 sm:w-80 aspect-square rounded-2xl bg-white border-4 border-yellow-400 shadow-2xl overflow-hidden grid grid-cols-15 grid-rows-15">
                {/* Red Base (Top Left) */}
                <div className="col-span-6 row-span-6 bg-red-600 p-2.5 flex flex-col items-center justify-center">
                  <div className="w-full h-full bg-white rounded-xl grid grid-cols-2 grid-rows-2 p-2 gap-2 shadow-inner">
                    <div className="rounded-full bg-red-600 border-2 border-red-800" />
                    <div className="rounded-full bg-red-600 border-2 border-red-800" />
                    <div className="rounded-full bg-red-600 border-2 border-red-800" />
                    <div className="rounded-full bg-red-600 border-2 border-red-800" />
                  </div>
                </div>

                {/* Top Path */}
                <div className="col-span-3 row-span-6 bg-slate-100 grid grid-cols-3 grid-rows-6 border-x border-slate-300">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <div
                      key={i}
                      className={`border border-slate-300 flex items-center justify-center text-[8px] font-bold ${
                        i % 3 === 1 ? 'bg-emerald-500 text-white' : ''
                      }`}
                    />
                  ))}
                </div>

                {/* Green Base (Opponent) */}
                <div className="col-span-6 row-span-6 bg-emerald-600 p-2.5 flex flex-col items-center justify-center">
                  <span className="text-[8px] font-black text-white uppercase mb-1">Opponent</span>
                  <div className="w-full h-full bg-white rounded-xl grid grid-cols-2 grid-rows-2 p-2 gap-2 shadow-inner">
                    {greenPawns.map((p) => (
                      <div
                        key={p.id}
                        className={`rounded-full flex items-center justify-center border-2 border-emerald-800 transition-all ${
                          p.inBase ? 'bg-emerald-600 shadow ring-2 ring-emerald-300' : 'bg-slate-200 opacity-20'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Middle Left */}
                <div className="col-span-6 row-span-3 bg-slate-100 grid grid-cols-6 grid-rows-3 border-y border-slate-300">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <div key={i} className={`border border-slate-300 ${i >= 6 && i < 12 ? 'bg-red-600' : ''}`} />
                  ))}
                </div>

                {/* Center Home Triangle */}
                <div className="col-span-3 row-span-3 relative bg-yellow-400 overflow-hidden flex items-center justify-center font-black text-xs text-slate-900 shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-yellow-400 to-emerald-600 opacity-90" />
                  <span className="relative z-10 text-white font-black text-[10px] drop-shadow">HOME 👑</span>
                </div>

                {/* Middle Right */}
                <div className="col-span-6 row-span-3 bg-slate-100 grid grid-cols-6 grid-rows-3 border-y border-slate-300">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <div key={i} className={`border border-slate-300 ${i >= 6 && i < 12 ? 'bg-yellow-400' : ''}`} />
                  ))}
                </div>

                {/* Blue Base (Player / You) */}
                <div className="col-span-6 row-span-6 bg-blue-600 p-2.5 flex flex-col items-center justify-center">
                  <span className="text-[8px] font-black text-white uppercase mb-1">You</span>
                  <div className="w-full h-full bg-white rounded-xl grid grid-cols-2 grid-rows-2 p-2 gap-2 shadow-inner">
                    {bluePawns.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          if (currentTurn === 'blue' && hasRolled && diceNumber === 6 && p.inBase) {
                            spawnPlayerPawn();
                          }
                        }}
                        className={`rounded-full flex items-center justify-center border-2 border-blue-900 transition-all cursor-pointer ${
                          p.inBase ? 'bg-blue-600 shadow ring-2 ring-blue-300 hover:scale-110 active:scale-95' : 'bg-slate-200 opacity-20'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Bottom Runway */}
                <div className="col-span-3 row-span-6 bg-slate-100 grid grid-cols-3 grid-rows-6 border-x border-slate-300">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <div
                      key={i}
                      className={`border border-slate-300 flex items-center justify-center text-[8px] relative ${
                        i % 3 === 1 ? 'bg-blue-600 text-white' : ''
                      }`}
                    >
                      {bluePawns.some(p => !p.inBase && !p.isFinished && p.step % 18 === i) && (
                        <div 
                          onClick={() => {
                            const p = bluePawns.find(bp => !bp.inBase && !bp.isFinished && bp.step % 18 === i);
                            if (p && currentTurn === 'blue' && hasRolled) {
                              movePlayerPawn(p.id, diceNumber);
                            }
                          }}
                          className="absolute inset-1 rounded-full bg-blue-600 border-2 border-white shadow-md animate-bounce cursor-pointer ring-2 ring-yellow-400"
                        />
                      )}
                      {greenPawns.some(p => !p.inBase && !p.isFinished && p.step % 18 === i) && (
                        <div className="absolute inset-1 rounded-full bg-emerald-600 border-2 border-white shadow-md animate-bounce" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Yellow Base */}
                <div className="col-span-6 row-span-6 bg-yellow-400 p-2.5 flex flex-col items-center justify-center">
                  <div className="w-full h-full bg-white rounded-xl grid grid-cols-2 grid-rows-2 p-2 gap-2 shadow-inner">
                    <div className="rounded-full bg-yellow-400 border-2 border-yellow-600" />
                    <div className="rounded-full bg-yellow-400 border-2 border-yellow-600" />
                    <div className="rounded-full bg-yellow-400 border-2 border-yellow-600" />
                    <div className="rounded-full bg-yellow-400 border-2 border-yellow-600" />
                  </div>
                </div>
              </div>

              {/* CONTROLLER */}
              <div className="w-full max-w-sm pt-1">
                <div className="relative p-2 rounded-2xl bg-blue-900/90 border-2 border-yellow-400 flex items-center justify-between shadow-xl">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-800 border border-blue-400/40">
                    <span className="text-xs font-black text-yellow-300">You (Blue)</span>
                  </div>

                  <div className="relative flex flex-col items-center">
                    {currentTurn === 'blue' && !hasRolled && (
                      <div className="absolute -top-7 text-yellow-400 text-lg font-black animate-bounce">
                        👇
                      </div>
                    )}
                    <button
                      onClick={handleRollDice}
                      disabled={isRolling || hasRolled || currentTurn !== 'blue'}
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-white via-slate-100 to-sky-100 border-3 border-blue-400 shadow-xl flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
                        isRolling ? 'animate-spin' : currentTurn === 'blue' && !hasRolled ? 'ring-4 ring-yellow-400 animate-pulse' : 'opacity-90'
                      }`}
                    >
                      {renderDicePips(diceNumber)}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-800 border border-blue-400/40">
                    <span className="text-xs font-black text-emerald-300">Opponent</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WON VIEW */}
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
                CLAIM PRIZE (প্রাইজ ক্লেইম করুন)
              </button>
            </div>
          )}

          {/* LOST VIEW */}
          {gameState === 'LOST' && (
            <div className="py-8 text-center space-y-4 my-auto animate-scale-in">
              <h3 className="text-xl font-black text-red-400">ম্যাচে হেরে গেছেন!</h3>
              <p className="text-xs text-slate-400">পরের ম্যাচে শুভকামনা!</p>
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
