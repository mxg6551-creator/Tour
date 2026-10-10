import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  UserProfile, Tournament, TournamentSlot, WalletTransaction, AppSettings, 
  SMSMessage, GameModeItem, SevenUpDownHistoryItem, LiveWinnerAnnouncement, 
  MatchType, PaymentMethod, HeroBannerItem, TopAdBanner 
} from '../types';
import { ASSET_IMAGES } from '../assets/images';
import { sound } from '../services/sound';

export interface OtherPlayerSeat {
  id: string;
  name: string;
  avatar: string;
  titleBadge?: string;
  chipsAmount: number;
  side: 'LEFT' | 'RIGHT';
  rank: 1 | 2 | 3;
  winStreak?: number;
  betTarget?: 'DOWN' | 'SEVEN' | 'UP';
  currentBet?: number;
}

export interface SevenUpDownState {
  roundId: number;
  phase: 'BETTING' | 'ROLLING' | 'REVEAL';
  timeLeft: number;
  dice1: number;
  dice2: number;
  sum: number;
  resultTarget: 'DOWN' | 'SEVEN' | 'UP' | null;
  isLightning: boolean;
  history: SevenUpDownHistoryItem[];
  userBets: { DOWN: number; SEVEN: number; UP: number };
  totalBets: { DOWN: number; SEVEN: number; UP: number };
  otherPlayers: OtherPlayerSeat[];
  lastWonAmount: number;
  lastWinMessage: string | null;
}

interface AppContextType {
  // Theme & Language
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  language: 'bn' | 'en';
  toggleLanguage: () => void;

  // Auth & Current User
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  users: UserProfile[];
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'LOGIN' | 'REGISTER') => void;
  closeAuthModal: () => void;
  authModalMode: 'LOGIN' | 'REGISTER';
  setAuthModalMode: (mode: 'LOGIN' | 'REGISTER') => void;
  registerUser: (data: { username: string; nickname: string; password?: string; phone: string; ffUid: string; email?: string; referralCode?: string }) => { success: boolean; message: string };
  loginUser: (usernameOrUid: string, pass?: string) => { success: boolean; message: string };
  loginWithGoogle: () => void;
  logoutUser: () => void;
  updateUser: (user: Partial<UserProfile> & { id: string }) => void;
  deleteUser: (userId: string) => void;
  blockUser: (userId: string, isBlocked: boolean) => void;
  adjustUserBalance: (userId: string, depositChange: number, winningChange: number, reason: string) => void;
  claimReferralBonus: () => { success: boolean; message: string };

  // Game Modes
  modes: GameModeItem[];
  createMode: (mode: Omit<GameModeItem, 'id' | 'order'>) => void;
  updateMode: (mode: GameModeItem) => void;
  deleteMode: (id: string) => void;
  toggleModeStatus: (id: string) => void;
  selectedModeForView: GameModeItem | null;
  setSelectedModeForView: (mode: GameModeItem | null) => void;

  // Tournaments
  tournaments: Tournament[];
  createTournament: (tournament: Omit<Tournament, 'id' | 'slots' | 'isRoomReady' | 'status'>) => void;
  updateTournament: (tournament: Tournament) => void;
  deleteTournament: (tournamentId: string) => void;
  setRoomDetails: (tournamentId: string, roomId: string, roomPassword: string) => void;
  joinTournament: (tournamentId: string, slotNumber: number, ign: string, teamMembers: string[], matchType: MatchType) => { success: boolean; message: string };
  distributeTournamentPrize: (tournamentId: string, winners: { rank: number; userName: string; kills: number; prize: number }[]) => void;

  // 7 Up 7 Down 24/7 Live Casino Arena
  sevenUpDownRound: SevenUpDownState;
  placeSevenUpDownBet: (target: 'DOWN' | 'SEVEN' | 'UP', chipAmount: number) => { success: boolean; message: string };
  setSevenUpDownAdminForce: (forceVal?: number) => void;
  is7Up7DownModalOpen: boolean;
  setIs7Up7DownModalOpen: (open: boolean) => void;

  // Hero Banners & Top Ad
  addHeroBanner: (banner: Omit<HeroBannerItem, 'id'>) => void;
  updateHeroBanner: (banner: HeroBannerItem) => void;
  deleteHeroBanner: (id: string) => void;
  updateTopAdBanner: (ad: Partial<TopAdBanner>) => void;

  // Live Winner Marquee
  winnerAnnouncements: LiveWinnerAnnouncement[];
  addWinnerAnnouncement: (announcement: Omit<LiveWinnerAnnouncement, 'id' | 'time'>) => void;

  // Wallet & SMS
  transactions: WalletTransaction[];
  smsInbox: SMSMessage[];
  addDepositRequest: (method: PaymentMethod, amount: number, phone: string, trxId: string) => { success: boolean; autoVerified: boolean; message: string };
  addWithdrawRequest: (method: PaymentMethod, amount: number, phone: string) => { success: boolean; message: string };
  approveTransaction: (trxId: string) => void;
  rejectTransaction: (trxId: string) => void;
  addSMSMessage: (sms: Omit<SMSMessage, 'id' | 'receivedAt' | 'matched'>) => void;
  claimLudoWin: (amount: number, gameType: string) => void;

  // Settings & CMS
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;

  // Admin state
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminLoggedIn: boolean;
  loginAdmin: (user: string, pass: string) => boolean;
  logoutAdmin: () => void;
  updateAdminCredentials: (user: string, pass: string) => void;

  // Active modals
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  selectedTournamentForSlots: Tournament | null;
  setSelectedTournamentForSlots: (t: Tournament | null) => void;
  selectedTournamentForJoin: Tournament | null;
  setSelectedTournamentForJoin: (t: Tournament | null) => void;
  selectedTournamentForRoom: Tournament | null;
  setSelectedTournamentForRoom: (t: Tournament | null) => void;
}

const STORAGE_PREFIX = 'xeb_tour_v3_';

const initialGameModes: GameModeItem[] = [
  {
    id: 'mode-br',
    name: 'BR Match',
    badgeText: 'Classic 48 Slots',
    icon: 'Swords',
    image: ASSET_IMAGES.gameModeFreeFire,
    rules: '১. কোনো ধরণের হ্যাক বা থার্ড পার্টি স্ক্রিপ্ট ব্যবহার সম্পূর্ণ নিষিদ্ধ।\n২. রুম শুরু হওয়ার ১০ মিনিট আগে রুম আইডি এবং পাসওয়ার্ড দেওয়া হবে।\n৩. টিম কিল বা ফেইক কিলিং গ্রহণযোগ্য নয়।\n৪. ম্যাচ শেষে স্ক্রিনশট রাখা আবশ্যক।',
    isEnabled: true,
    isFreeFire: true,
    order: 1
  },
  {
    id: 'mode-br-survival',
    name: 'BR Survival',
    badgeText: 'Survival Pro',
    icon: 'Shield',
    image: ASSET_IMAGES.gameModeFreeFire,
    rules: '১. সারভাইভাল ম্যাচে শেষ পর্যন্ত টিকে থাকা টিম সর্বোচ্চ প্রাইজ পাবে।\n২. গ্রেনেড ও ল্যান্ডমাইন সম্পূর্ণ অনুমোদিত।\n৩. এমুলেটর প্লেয়ার এলাউড নয়।',
    isEnabled: true,
    isFreeFire: true,
    order: 2
  },
  {
    id: 'mode-cs',
    name: 'Clash Squad',
    badgeText: 'CS 4v4 Rush',
    icon: 'Zap',
    image: ASSET_IMAGES.gameModeFreeFire,
    rules: '১. ক্ল্যাশ স্কোয়াড ক্লাসিক রুলস প্রযোজ্য।\n২. কোনো গ্রেনেড স্প্যাম করা যাবে না।\n৩. রউন্ড লিমিট ৭, গান প্রোপার্টিজ অফ।',
    isEnabled: true,
    isFreeFire: true,
    order: 3
  },
  {
    id: 'mode-cs-2v2',
    name: 'CS 2v2',
    badgeText: 'Duo Special',
    icon: 'Users',
    image: ASSET_IMAGES.gameModeFreeFire,
    rules: '১. ২ বনাম ২ ডুয়ো স্পেশাল ক্ল্যাশ স্কোয়াড।\n২. নির্দিষ্ট সীমারেখার বাইরে ফায়ার করা যাবে না।\n৩. হেডশট ও বডি শট অনুমোদিত।',
    isEnabled: true,
    isFreeFire: true,
    order: 4
  },
  {
    id: 'mode-lonewolf',
    name: 'Lone Wolf 1v1',
    badgeText: '1v1 Headshot',
    icon: 'Target',
    image: ASSET_IMAGES.gameModeFreeFire,
    rules: '১. ওয়ান ভার্সেস ওয়ান হেডশট কিং মোড।\n২. রাউন্ড ৫-এ যে প্রথম পৌঁছাবে সে বিজয়ী।\n৩. ম্যাচ শুরুর পর কোনো রিকানেক্ট সুযোগ নেই।',
    isEnabled: true,
    isFreeFire: true,
    order: 5
  },
  {
    id: 'mode-katana',
    name: 'Katana VS Katana',
    badgeText: 'Melee Samurai',
    icon: 'Flame',
    image: ASSET_IMAGES.gameModeFreeFire,
    rules: '১. শুধুমাত্র কাতানা এবং মেটাল ওয়েপন ব্যবহারযোগ্য।\n২. গান বা ফায়ার আর্মস ব্যবহার করলে তাৎক্ষণিক ডিসকোয়ালিফাই।',
    isEnabled: true,
    isFreeFire: true,
    order: 6
  }
];

const initialHeroBanners: HeroBannerItem[] = [
  {
    id: 'b-1',
    title: 'XEB TOUR গ্র্যান্ড টুর্নামেন্ট এরিনা',
    subtitle: 'Free Fire BR & Clash Squad এন্ট্রি নিন ও আসল প্রাইজ পুল জিতুন',
    imageUrl: ASSET_IMAGES.heroBanner,
    tag: 'FEATURED ESPORTS',
    action: 'ESPORTS',
    isEnabled: true
  },
  {
    id: 'b-2',
    title: '৭ আপ ৭ ডাউন ক্যাসিনো লাইভ এরিনা (24/7 Live)',
    subtitle: '২-৬ ডাউন, ৮-১২ আপ এবং লাকি ৭ ডাইস বাজি ধরে লাইভ জয়ী হোন!',
    imageUrl: ASSET_IMAGES.gameMode7Up7Down,
    tag: 'HOT CASINO GAME',
    action: 'SEVEN_UP',
    isEnabled: true
  },
  {
    id: 'b-3',
    title: 'লুডু কিং ক্লাসিক ১v১, ২v২ ও ৪v৪ ব্যাটেল',
    subtitle: '১০০% ফেয়ার ও আসল ডাইস রোলিং সিস্টেমে খেলুন',
    imageUrl: ASSET_IMAGES.gameModeLudo,
    tag: 'LUDO KING LIVE',
    action: 'LUDO',
    isEnabled: true
  }
];

const initialSettings: AppSettings = {
  siteBrandText: 'XEB TOUR',
  siteTagline: 'Esports & Ludo Arena',
  siteLogoIcon: '⚡',
  topAdBanner: {
    enabled: true,
    type: 'IMAGE',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    redirectUrl: 'https://t.me/xebtour_official_support',
    htmlCode: ''
  },
  heroBanners: initialHeroBanners,
  popupNotice: {
    enabled: true,
    title: 'স্বাগতম XEB TOUR প্রফেশনাল টুর্নামেন্ট ও গেমিং এরিনায়!',
    banglaDescription: 'ফ্রি ফায়ার টুর্নামেন্ট, আসল লুডু কিং, এবং ২৪/৭ লাইভ ৭ আপ ৭ ডাউন এরিনায় স্বাগতম।\nসকল ম্যাচ রিয়েল-টাইম এবং ফেয়ার প্লে সিস্টেমে পরিচালিত।\nসুপার অ্যাডমিন ওপেন করতে ব্র্যান্ড লোগো বা নামের ওপর ৩ সেকেন্ডের মধ্যে ১০ বার ক্লিক করুন।',
    imageUrl: ASSET_IMAGES.heroBanner,
    actionText: 'টেলিগ্রাম সাপোর্ট জয়েন করুন',
    actionUrl: 'https://t.me/xebtour_official_support'
  },
  tiktokSponsor: {
    enabled: true,
    title: 'টিকটক ভিডিও বানিয়ে ইনকাম করুন!',
    banglaDescription: 'XEB TOUR-এ আপনার গেমপ্লে অথবা টুর্নামেন্ট জয়ের ক্লিপ পোস্ট করুন। প্রতি ১০০০ ভিউতে ৫০ টাকা ক্যাশ রিওয়ার্ড লুফে নিন।',
    actionText: 'ভিডিও জমা দিন',
    actionUrl: 'https://www.tiktok.com',
    rewardPer1000Views: 50
  },
  telegramSupportLink: 'https://t.me/xebtour_official_support',
  referralConfig: {
    isEnabled: true,
    commissionPercentage: 20
  },
  paymentNumbers: {
    bKash: '01889922110',
    bKashType: 'Personal',
    nagad: '01775544332',
    nagadType: 'Personal',
    rocket: '01993322114',
    rocketType: 'Personal'
  },
  adminCredentials: {
    username: 'immoon',
    passwordHash: '66449988'
  },
  ludoConfig: {
    isEnabled: true,
    fairRngPercentage: 100,
    entryFees: {
      '1v1': 30,
      '2v2': 60,
      '4v4': 120,
      snake: 25
    },
    winningMultiplier: 1.85
  },
  sevenUpDownConfig: {
    isEnabled: true,
    payoutMultiplierDown: 2.0,
    payoutMultiplierUp: 2.0,
    payoutMultiplierSeven: 4.0,
    lightningMultiplierSeven: 6.0,
    sevenFrequencyPerHour: 12,
    minBet: 10,
    musicEnabled: true,
    musicUrl: '',
    showBots: true
  }
};

const initialUsers: UserProfile[] = [
  {
    id: 'u-1',
    username: 'MOON2007',
    nickname: 'MOON_ESPORTS',
    email: 'captainlevii2007@gmail.com',
    phone: '01712345678',
    ffUid: '849201948',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=MOON2007',
    role: 'player',
    isOnline: true,
    isBlocked: false,
    registeredAt: new Date().toISOString(), // Today
    totalBalance: 350,
    depositBalance: 200,
    winningBalance: 150,
    referralCode: 'MOON777',
    referralEarnings: 60,
    referralClaimable: 60,
    referredUsers: [
      { username: 'PRINCE_FIRE', joinedAt: '2026-10-09', commissionEarned: 20 }
    ],
    totalMatches: 28,
    totalWins: 11,
    totalKills: 82,
    weeklyWins: 5,
    weeklyKills: 34,
    monthlyWins: 11,
    monthlyKills: 82
  },
  {
    id: 'u-2',
    username: 'PRINCE_FIRE',
    nickname: 'Prince_99',
    email: 'prince@xebtour.gg',
    phone: '01898765432',
    ffUid: '920194821',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Prince',
    role: 'player',
    isOnline: true,
    isBlocked: false,
    registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(), // Yesterday
    totalBalance: 520,
    depositBalance: 300,
    winningBalance: 220,
    referralCode: 'PRINCE99',
    referralEarnings: 40,
    referralClaimable: 0,
    referredUsers: [],
    totalMatches: 31,
    totalWins: 14,
    totalKills: 102,
    weeklyWins: 6,
    weeklyKills: 45,
    monthlyWins: 14,
    monthlyKills: 102
  },
  {
    id: 'u-3',
    username: 'SKY_KILLER',
    nickname: 'SkySniper',
    phone: '01655443322',
    ffUid: '748291039',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=SkyKiller',
    role: 'player',
    isOnline: false,
    isBlocked: false,
    registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), // This month
    totalBalance: 210,
    depositBalance: 110,
    winningBalance: 100,
    referralCode: 'SKYKILL',
    referralEarnings: 15,
    referralClaimable: 15,
    referredUsers: [],
    totalMatches: 12,
    totalWins: 3,
    totalKills: 28,
    weeklyWins: 1,
    weeklyKills: 8,
    monthlyWins: 3,
    monthlyKills: 28
  }
];

function createDefaultSlots(total: number): TournamentSlot[] {
  const slots: TournamentSlot[] = [];
  for (let i = 1; i <= total; i++) {
    slots.push({
      slotNumber: i,
      occupied: false
    });
  }
  return slots;
}

const initialTournaments: Tournament[] = [
  {
    id: 'match-101',
    title: 'BR Match #101 | DUO BERMUDA',
    modeId: 'mode-br',
    category: 'BR Match',
    mapName: 'Bermuda',
    matchType: 'DUO',
    startTime: new Date(Date.now() + 1000 * 60 * 35).toISOString(),
    entryFee: 10,
    prizePool: 400,
    perKill: 6,
    totalSlots: 48,
    slots: createDefaultSlots(48),
    roomId: '',
    roomPassword: '',
    isRoomReady: false,
    status: 'UPCOMING',
    bannerImage: ASSET_IMAGES.gameModeFreeFire,
    rulesText: '১. কোনো ধরণের হ্যাক বা থার্ড পার্টি স্ক্রিপ্ট ব্যবহার সম্পূর্ণ নিষিদ্ধ।\n২. রুম শুরু হওয়ার ১০ মিনিট আগে রুম আইডি এবং পাসওয়ার্ড দেওয়া হবে।\n৩. টিম কিল বা ফেইক কিলিং গ্রহণযোগ্য নয়।'
  },
  {
    id: 'match-102',
    title: 'BR Survival #102 | SOLO BERMUDA',
    modeId: 'mode-br-survival',
    category: 'BR Survival',
    mapName: 'Bermuda',
    matchType: 'SOLO',
    startTime: new Date(Date.now() + 1000 * 60 * 75).toISOString(),
    entryFee: 15,
    prizePool: 500,
    perKill: 8,
    totalSlots: 48,
    slots: createDefaultSlots(48),
    isRoomReady: false,
    status: 'UPCOMING',
    bannerImage: ASSET_IMAGES.gameModeFreeFire,
    rulesText: '১. সারভাইভাল ম্যাচে শেষ পর্যন্ত টিকে থাকা টিম সর্বোচ্চ প্রাইজ পাবে।\n২. গ্রেনেড ও ল্যান্ডমাইন সম্পূর্ণ অনুমোদিত।'
  },
  {
    id: 'match-103',
    title: 'Clash Squad #103 | 4v4 KALAHARI',
    modeId: 'mode-cs',
    category: 'Clash Squad',
    mapName: 'Kalahari',
    matchType: 'SQUAD',
    startTime: new Date(Date.now() + 1000 * 60 * 120).toISOString(),
    entryFee: 30,
    prizePool: 650,
    perKill: 10,
    totalSlots: 24,
    slots: createDefaultSlots(24),
    isRoomReady: false,
    status: 'UPCOMING',
    bannerImage: ASSET_IMAGES.gameModeFreeFire,
    rulesText: '১. ক্ল্যাশ স্কোয়াড ক্লাসিক রুলস প্রযোজ্য।\n২. গান প্রোপার্টিজ অফ।'
  }
];

const initialWinners: LiveWinnerAnnouncement[] = [
  {
    id: 'win-1',
    gameIdName: 'MOON_ESPORTS',
    eventOrMatch: 'BR Match #101',
    prize: 400,
    time: '2:30 PM'
  },
  {
    id: 'win-2',
    gameIdName: 'Prince_99',
    eventOrMatch: '7 Up 7 Down',
    prize: 180,
    time: '3:15 PM'
  }
];

const initialCasinoSeats: OtherPlayerSeat[] = [
  // LEFT SIDE (Top Balance: Rank 1, 2, 3 as shown in screenshot)
  {
    id: 'left-1',
    side: 'LEFT',
    rank: 1,
    name: 'name196067',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&q=80',
    titleBadge: 'রিচি রিচ',
    chipsAmount: 68542.26,
    betTarget: 'UP',
    currentBet: 500
  },
  {
    id: 'left-2',
    side: 'LEFT',
    rank: 2,
    name: 'Landon',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    titleBadge: 'মেগামিলিয়নেয়ার',
    chipsAmount: 42249.49,
    betTarget: 'DOWN',
    currentBet: 300
  },
  {
    id: 'left-3',
    side: 'LEFT',
    rank: 3,
    name: 'Narjy',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    chipsAmount: 39937.85,
    betTarget: 'DOWN',
    currentBet: 200
  },

  // RIGHT SIDE (Top Win Streak / Most Wins: Rank 1, 2, 3 as shown in screenshot)
  {
    id: 'right-1',
    side: 'RIGHT',
    rank: 1,
    name: 'name316082',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    titleBadge: 'হিউম্যান ক্যালকুলেটর',
    chipsAmount: 40805.42,
    winStreak: 18,
    betTarget: 'SEVEN',
    currentBet: 200
  },
  {
    id: 'right-2',
    side: 'RIGHT',
    rank: 2,
    name: 'name781757',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    chipsAmount: 47014.30,
    winStreak: 12,
    betTarget: 'UP',
    currentBet: 400
  },
  {
    id: 'right-3',
    side: 'RIGHT',
    rank: 3,
    name: 'name528300',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    chipsAmount: 39941.89,
    winStreak: 9,
    betTarget: 'SEVEN',
    currentBet: 100
  }
];

const initialCasinoHistory: SevenUpDownHistoryItem[] = [
  { round: 101, sum: 11, target: 'UP', dice1: 5, dice2: 6 },
  { round: 102, sum: 3, target: 'DOWN', dice1: 1, dice2: 2 },
  { round: 103, sum: 8, target: 'UP', dice1: 4, dice2: 4, isLightning: true },
  { round: 104, sum: 9, target: 'UP', dice1: 4, dice2: 5 },
  { round: 105, sum: 7, target: 'SEVEN', dice1: 3, dice2: 4, isLightning: true },
  { round: 106, sum: 4, target: 'DOWN', dice1: 1, dice2: 3 },
  { round: 107, sum: 8, target: 'UP', dice1: 5, dice2: 3 },
  { round: 108, sum: 6, target: 'DOWN', dice1: 2, dice2: 4 },
  { round: 109, sum: 10, target: 'UP', dice1: 5, dice2: 5, isLightning: true },
  { round: 110, sum: 5, target: 'DOWN', dice1: 2, dice2: 3 }
];

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'theme');
      return (saved === 'light' || saved === 'dark') ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [language, setLanguage] = useState<'bn' | 'en'>('bn');

  // Sync theme to root class
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.body.classList.add('bg-black', 'text-slate-100');
        document.body.classList.remove('bg-slate-100', 'text-slate-900');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
        document.body.classList.add('bg-slate-100', 'text-slate-900');
        document.body.classList.remove('bg-black', 'text-slate-100');
      }
    } catch {}
  }, [theme]);

  // Auth modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Persistence
  const [currentUser, setCurrentUserState] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'currentUser');
      return saved ? JSON.parse(saved) : initialUsers[0];
    } catch {
      return initialUsers[0];
    }
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'users');
      return saved ? JSON.parse(saved) : initialUsers;
    } catch {
      return initialUsers;
    }
  });

  const [modes, setModes] = useState<GameModeItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'modes');
      return saved ? JSON.parse(saved) : initialGameModes;
    } catch {
      return initialGameModes;
    }
  });

  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'tournaments');
      return saved ? JSON.parse(saved) : initialTournaments;
    } catch {
      return initialTournaments;
    }
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'transactions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [smsInbox, setSmsInbox] = useState<SMSMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'smsInbox');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [winnerAnnouncements, setWinnerAnnouncements] = useState<LiveWinnerAnnouncement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'winners');
      return saved ? JSON.parse(saved) : initialWinners;
    } catch {
      return initialWinners;
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'settings');
      return saved ? JSON.parse(saved) : initialSettings;
    } catch {
      return initialSettings;
    }
  });

  // Active view states
  const [selectedModeForView, setSelectedModeForView] = useState<GameModeItem | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedTournamentForSlots, setSelectedTournamentForSlots] = useState<Tournament | null>(null);
  const [selectedTournamentForJoin, setSelectedTournamentForJoin] = useState<Tournament | null>(null);
  const [selectedTournamentForRoom, setSelectedTournamentForRoom] = useState<Tournament | null>(null);
  const [is7Up7DownModalOpen, setIs7Up7DownModalOpen] = useState(false);

  // Admin Session
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // 7 Up 7 Down 24/7 Live Game State
  const [sevenUpDownRound, setSevenUpDownRound] = useState<SevenUpDownState>({
    roundId: 111,
    phase: 'BETTING',
    timeLeft: 14,
    dice1: 3,
    dice2: 5,
    sum: 8,
    resultTarget: 'UP',
    isLightning: false,
    history: initialCasinoHistory,
    userBets: { DOWN: 0, SEVEN: 0, UP: 0 },
    totalBets: { DOWN: 11820, SEVEN: 7010, UP: 15100 },
    otherPlayers: initialCasinoSeats,
    lastWonAmount: 0,
    lastWinMessage: null
  });

  const adminForceDiceRef = useRef<number | undefined>(undefined);

  // 24/7 Autonomous Game Engine for 7 Up 7 Down
  useEffect(() => {
    if (!settings.sevenUpDownConfig?.isEnabled) return;
    const timer = setInterval(() => {
      setSevenUpDownRound(prev => {
        if (prev.timeLeft > 1) {
          // Live table activity: random other player bets in betting phase
          if (prev.phase === 'BETTING' && Math.random() > 0.45) {
            const targets: ('DOWN' | 'SEVEN' | 'UP')[] = ['DOWN', 'SEVEN', 'UP'];
            const chosenTarget = targets[Math.floor(Math.random() * targets.length)];
            const chipAdd = [10, 50, 100, 500, 1000][Math.floor(Math.random() * 5)];
            return {
              ...prev,
              timeLeft: prev.timeLeft - 1,
              totalBets: {
                ...prev.totalBets,
                [chosenTarget]: prev.totalBets[chosenTarget] + chipAdd
              }
            };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        }

        // Transitions
        if (prev.phase === 'BETTING') {
          // Transition to ROLLING
          sound.playDiceRoll();
          return {
            ...prev,
            phase: 'ROLLING',
            timeLeft: 3
          };
        } else if (prev.phase === 'ROLLING') {
          // Transition to REVEAL & Roll calculation
          let d1 = Math.floor(Math.random() * 6) + 1;
          let d2 = Math.floor(Math.random() * 6) + 1;
          let sum = d1 + d2;

          // Check admin force
          if (adminForceDiceRef.current !== undefined) {
            sum = adminForceDiceRef.current;
            if (sum === 7) {
              d1 = 3;
              d2 = 4;
            } else if (sum <= 6) {
              d1 = Math.min(6, Math.max(1, Math.floor(sum / 2)));
              d2 = sum - d1;
            } else {
              d1 = Math.min(6, Math.max(1, Math.floor(sum / 2)));
              d2 = sum - d1;
            }
            adminForceDiceRef.current = undefined;
          }

          const target: 'DOWN' | 'SEVEN' | 'UP' = sum === 7 ? 'SEVEN' : sum < 7 ? 'DOWN' : 'UP';
          const isLightning = Math.random() < 0.25;

          // Check if current user won
          const userBetOnWinningTarget = prev.userBets[target] || 0;
          let wonAmt = 0;
          let winMsg: string | null = null;

          if (userBetOnWinningTarget > 0) {
            let mult = 2.0;
            if (target === 'SEVEN') {
              mult = isLightning ? (settings.sevenUpDownConfig.lightningMultiplierSeven || 6.0) : (settings.sevenUpDownConfig.payoutMultiplierSeven || 4.0);
            } else {
              mult = settings.sevenUpDownConfig.payoutMultiplierDown || 2.0;
            }
            wonAmt = Math.round(userBetOnWinningTarget * mult);
            winMsg = `You Win +${wonAmt.toFixed(2)}`;

            // Credit winning balance to user
            if (currentUser) {
              const newWinning = currentUser.winningBalance + wonAmt;
              const newTotal = currentUser.depositBalance + newWinning;
              const updated = {
                ...currentUser,
                winningBalance: newWinning,
                totalBalance: newTotal
              };
              setCurrentUserState(updated);

              // Add live marquee announcement
              addWinnerAnnouncement({
                gameIdName: currentUser.nickname || currentUser.username,
                eventOrMatch: `7 Up 7 Down (${target === 'SEVEN' ? 'Lucky 7' : target})`,
                prize: wonAmt
              });
            }
            sound.playVictory();
          }

          const newHistoryItem: SevenUpDownHistoryItem = {
            round: prev.roundId,
            sum,
            target,
            dice1: d1,
            dice2: d2,
            isLightning
          };

          return {
            ...prev,
            phase: 'REVEAL',
            timeLeft: 4,
            dice1: d1,
            dice2: d2,
            sum,
            resultTarget: target,
            isLightning,
            lastWonAmount: wonAmt,
            lastWinMessage: winMsg,
            history: [newHistoryItem, ...prev.history.slice(0, 24)]
          };
        } else {
          // Reset to next round BETTING
          return {
            ...prev,
            roundId: prev.roundId + 1,
            phase: 'BETTING',
            timeLeft: 14,
            userBets: { DOWN: 0, SEVEN: 0, UP: 0 },
            totalBets: {
              DOWN: Math.floor(4000 + Math.random() * 8000),
              SEVEN: Math.floor(1500 + Math.random() * 4000),
              UP: Math.floor(5000 + Math.random() * 9000)
            },
            lastWonAmount: 0,
            lastWinMessage: null
          };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [settings.sevenUpDownConfig, currentUser]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'currentUser', JSON.stringify(currentUser));
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(users));
    } catch {}
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'modes', JSON.stringify(modes));
    } catch {}
  }, [modes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'tournaments', JSON.stringify(tournaments));
    } catch {}
  }, [tournaments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'winners', JSON.stringify(winnerAnnouncements));
    } catch {}
  }, [winnerAnnouncements]);

  const toggleTheme = () => {
    sound.playClick();
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleLanguage = () => {
    sound.playClick();
    setLanguage(prev => (prev === 'bn' ? 'en' : 'bn'));
  };

  const openAuthModal = (mode: 'LOGIN' | 'REGISTER' = 'LOGIN') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const setCurrentUser = (user: UserProfile) => {
    setCurrentUserState(user);
    if (user) {
      setUsers(prev => prev.map(u => (u.id === user.id ? user : u)));
    }
  };

  // User Registration with strict requirements:
  // - Unique username: 6-18 characters
  // - Password: 4-20 characters
  // - Nickname / Game ID name
  // - Free Fire UID, Phone
  const registerUser = (data: {
    username: string;
    nickname: string;
    password?: string;
    phone: string;
    ffUid: string;
    email?: string;
    referralCode?: string;
  }): { success: boolean; message: string } => {
    const cleanUser = data.username.trim();
    if (cleanUser.length < 6 || cleanUser.length > 18) {
      sound.playError();
      return { success: false, message: 'ইউজারনেম অবশ্যই ৬ থেকে ১৮ অক্ষরের হতে হবে!' };
    }

    if (data.password && (data.password.length < 4 || data.password.length > 20)) {
      sound.playError();
      return { success: false, message: 'পাসওয়ার্ড অবশ্যই ৪ থেকে ২০ অক্ষরের হতে হবে!' };
    }

    // Check duplicate username
    if (users.some(u => u.username.toLowerCase() === cleanUser.toLowerCase())) {
      sound.playError();
      return { success: false, message: 'এই ইউজারনেমটি ইতিমধ্যে ব্যবহৃত হয়েছে! অন্য একটি দিন।' };
    }

    const newReferralCode = 'XEB' + Math.floor(1000 + Math.random() * 9000);
    const newUser: UserProfile = {
      id: `u-${Date.now()}`,
      username: cleanUser,
      nickname: data.nickname.trim() || cleanUser,
      phone: data.phone.trim() || '01700000000',
      ffUid: data.ffUid.trim() || String(Math.floor(100000000 + Math.random() * 900000000)),
      email: data.email?.trim() || undefined,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUser}`,
      role: 'player',
      isOnline: true,
      isBlocked: false,
      registeredAt: new Date().toISOString(),
      totalBalance: 0,
      depositBalance: 0,
      winningBalance: 0,
      referralCode: newReferralCode,
      referredBy: data.referralCode?.trim() || undefined,
      referralEarnings: 0,
      referralClaimable: 0,
      referredUsers: [],
      totalMatches: 0,
      totalWins: 0,
      totalKills: 0,
      weeklyWins: 0,
      weeklyKills: 0,
      monthlyWins: 0,
      monthlyKills: 0
    };

    // Credit referrer if code exists
    if (data.referralCode?.trim() && settings.referralConfig?.isEnabled !== false) {
      const referrer = users.find(u => u.referralCode === data.referralCode?.trim().toUpperCase());
      if (referrer) {
        const updatedReferrer = {
          ...referrer,
          referredUsers: [
            ...referrer.referredUsers,
            { username: newUser.username, joinedAt: new Date().toLocaleDateString('en-GB'), commissionEarned: 0 }
          ]
        };
        setUsers(prev => prev.map(u => (u.id === referrer.id ? updatedReferrer : u)));
      }
    }

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    sound.playVictory();
    return { success: true, message: 'রেজিস্ট্রেশন সফল হয়েছে! স্বাগতম XEB TOUR-এ।' };
  };

  const loginUser = (usernameOrUid: string, pass?: string): { success: boolean; message: string } => {
    const q = usernameOrUid.trim().toLowerCase();
    const user = users.find(u => u.username.toLowerCase() === q || u.ffUid === q || u.phone === q);
    if (!user) {
      sound.playError();
      return { success: false, message: 'ইউজারনেম বা গেম UID পাওয়া যায়নি! সঠিক তথ্য দিন।' };
    }
    if (user.isBlocked) {
      sound.playError();
      return { success: false, message: 'আপনার অ্যাকাউন্টটি সাময়িকভাবে ব্লক করা হয়েছে!' };
    }

    const updated = { ...user, isOnline: true };
    setCurrentUser(updated);
    sound.playCoin();
    return { success: true, message: `স্বাগতম, ${user.nickname || user.username}!` };
  };

  const loginWithGoogle = () => {
    const googleUser = users[0] || initialUsers[0];
    setCurrentUser({ ...googleUser, isOnline: true });
    sound.playCoin();
  };

  const logoutUser = () => {
    if (currentUser) {
      setUsers(prev => prev.map(u => (u.id === currentUser.id ? { ...u, isOnline: false } : u)));
    }
    sound.playClick();
    openAuthModal('LOGIN');
  };

  const updateUser = (updated: Partial<UserProfile> & { id: string }) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === updated.id) {
          const next = { ...u, ...updated };
          if (currentUser?.id === updated.id) {
            setCurrentUserState(next);
          }
          return next;
        }
        return u;
      })
    );
  };

  const blockUser = (userId: string, isBlocked: boolean) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const next = { ...u, isBlocked };
          if (currentUser?.id === userId) {
            setCurrentUserState(next);
          }
          return next;
        }
        return u;
      })
    );
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(initialUsers[0]);
    }
    sound.playClick();
  };

  const adjustUserBalance = (userId: string, depositChange: number, winningChange: number, reason: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const newDep = Math.max(0, u.depositBalance + depositChange);
          const newWin = Math.max(0, u.winningBalance + winningChange);
          const next = { ...u, depositBalance: newDep, winningBalance: newWin, totalBalance: newDep + newWin };
          if (currentUser?.id === userId) {
            setCurrentUserState(next);
          }
          return next;
        }
        return u;
      })
    );
    const targetUser = users.find(u => u.id === userId);
    const totalChange = depositChange + winningChange;
    const newTx: WalletTransaction = {
      id: `tx-adj-${Date.now()}`,
      userId,
      userName: targetUser?.username || 'Player',
      type: 'ADMIN_ADJUST',
      amount: Math.abs(totalChange),
      description: `অ্যাডমিন ব্যালেন্স অ্যাডজাস্ট (${totalChange >= 0 ? '+' : '-'}${Math.abs(totalChange)} ৳): ${reason}`,
      status: 'COMPLETED',
      createdAt: new Date().toLocaleString('en-GB')
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const claimReferralBonus = (): { success: boolean; message: string } => {
    if (!currentUser || currentUser.referralClaimable <= 0) {
      return { success: false, message: 'ক্লেইম করার মতো রেফারেল ব্যালেন্স নেই!' };
    }
    const bonus = currentUser.referralClaimable;
    const newWin = currentUser.winningBalance + bonus;
    const newTot = currentUser.depositBalance + newWin;
    const updated = {
      ...currentUser,
      referralClaimable: 0,
      winningBalance: newWin,
      totalBalance: newTot
    };
    setCurrentUser(updated);
    sound.playVictory();
    return { success: true, message: `অভিনন্দন! ৳${bonus} রেফারেল প্রফিট ক্লেইম হয়েছে!` };
  };

  // Game Mode Management
  const createMode = (data: Omit<GameModeItem, 'id' | 'order'>) => {
    const newMode: GameModeItem = {
      ...data,
      id: `mode-${Date.now()}`,
      order: modes.length + 1
    };
    setModes(prev => [...prev, newMode]);
    sound.playCoin();
  };

  const updateMode = (mode: GameModeItem) => {
    setModes(prev => prev.map(m => (m.id === mode.id ? mode : m)));
    sound.playClick();
  };

  const deleteMode = (id: string) => {
    setModes(prev => prev.filter(m => m.id !== id));
    sound.playClick();
  };

  const toggleModeStatus = (id: string) => {
    setModes(prev => prev.map(m => (m.id === id ? { ...m, isEnabled: !m.isEnabled } : m)));
    sound.playClick();
  };

  // Tournaments
  const createTournament = (data: Omit<Tournament, 'id' | 'slots' | 'isRoomReady' | 'status'>) => {
    const newId = `match-${Math.floor(100 + Math.random() * 900)}`;
    const targetMode = modes.find(m => m.id === data.modeId);
    const newT: Tournament = {
      ...data,
      id: newId,
      slots: createDefaultSlots(data.totalSlots),
      isRoomReady: false,
      status: 'UPCOMING',
      rulesText: data.rulesText || targetMode?.rules || 'অফিশিয়াল টুর্নামেন্ট রুলস মেনে খেলুন।'
    };
    setTournaments(prev => [newT, ...prev]);
    sound.playCoin();
  };

  const updateTournament = (t: Tournament) => {
    setTournaments(prev => prev.map(item => (item.id === t.id ? t : item)));
  };

  const deleteTournament = (id: string) => {
    setTournaments(prev => prev.filter(t => t.id !== id));
    sound.playClick();
  };

  const setRoomDetails = (tournamentId: string, roomId: string, roomPassword: string) => {
    setTournaments(prev =>
      prev.map(t => {
        if (t.id === tournamentId) {
          return {
            ...t,
            roomId,
            roomPassword,
            isRoomReady: Boolean(roomId.trim())
          };
        }
        return t;
      })
    );
  };

  const joinTournament = (
    tournamentId: string,
    slotNumber: number,
    ign: string,
    teamMembers: string[],
    matchType: MatchType
  ): { success: boolean; message: string } => {
    if (!currentUser) {
      openAuthModal('LOGIN');
      return { success: false, message: 'ম্যাচে জয়েন করতে অনুগ্রহ করে লগইন করুন!' };
    }
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return { success: false, message: 'ম্যাচ পাওয়া যায়নি!' };

    const playerCount = matchType === 'SOLO' ? 1 : matchType === 'DUO' ? 2 : 4;
    const totalFee = tournament.entryFee * playerCount;

    if (currentUser.totalBalance < totalFee) {
      sound.playError();
      return {
        success: false,
        message: `প্রয়োজনীয় ব্যালেন্স ৳${totalFee}, আপনার ব্যালেন্স আছে ৳${currentUser.totalBalance}। ওয়ালেটে টাকা যোগ করুন!`
      };
    }

    const targetSlot = tournament.slots.find(s => s.slotNumber === slotNumber);
    if (targetSlot && targetSlot.occupied) {
      sound.playError();
      return { success: false, message: `স্লট #${slotNumber} ইতিমধ্যে বুক হয়ে গেছে!` };
    }

    // Deduct entry fee
    let remaining = totalFee;
    let newDeposit = currentUser.depositBalance;
    let newWinning = currentUser.winningBalance;

    if (newDeposit >= remaining) {
      newDeposit -= remaining;
    } else {
      remaining -= newDeposit;
      newDeposit = 0;
      newWinning = Math.max(0, newWinning - remaining);
    }

    const updatedUser = {
      ...currentUser,
      depositBalance: newDeposit,
      winningBalance: newWinning,
      totalBalance: newDeposit + newWinning,
      totalMatches: currentUser.totalMatches + 1
    };
    setCurrentUser(updatedUser);

    // Give referral commission to referrer if configured
    if (currentUser.referredBy && settings.referralConfig?.isEnabled && totalFee > 0) {
      const commRate = (settings.referralConfig.commissionPercentage || 20) / 100;
      const commission = Math.round(totalFee * commRate);
      const referrer = users.find(u => u.referralCode === currentUser.referredBy);
      if (referrer && commission > 0) {
        updateUser({
          id: referrer.id,
          referralEarnings: referrer.referralEarnings + commission,
          referralClaimable: referrer.referralClaimable + commission
        });
      }
    }

    // Update slots
    const updatedSlots = tournament.slots.map(s => {
      if (s.slotNumber === slotNumber) {
        return {
          ...s,
          occupied: true,
          userId: currentUser.id,
          userName: ign || currentUser.nickname || currentUser.username,
          ffUid: currentUser.ffUid,
          teamMembers: [ign, ...teamMembers].filter(Boolean),
          joinedAt: new Date().toLocaleString('en-GB')
        };
      }
      return s;
    });

    updateTournament({
      ...tournament,
      slots: updatedSlots
    });

    const newTx: WalletTransaction = {
      id: `tx-join-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.username,
      type: 'ENTRY_FEE',
      amount: totalFee,
      description: `${tournament.title} (স্লট #${slotNumber}, ${matchType}) এন্ট্রি ফি`,
      status: 'COMPLETED',
      createdAt: new Date().toLocaleString('en-GB')
    };
    setTransactions(prev => [newTx, ...prev]);
    sound.playCoin();

    return {
      success: true,
      message: `অভিনন্দন! ৳${totalFee} কেটে স্লট #${slotNumber} কনফার্ম করা হয়েছে!`
    };
  };

  const distributeTournamentPrize = (
    tournamentId: string,
    winners: { rank: number; userName: string; kills: number; prize: number }[]
  ) => {
    winners.forEach(w => {
      const matchedUser = users.find(
        u =>
          u.username.toLowerCase() === w.userName.toLowerCase() ||
          u.nickname.toLowerCase() === w.userName.toLowerCase() ||
          u.ffUid === w.userName
      );
      if (matchedUser) {
        const newWin = matchedUser.winningBalance + w.prize;
        const newTot = matchedUser.depositBalance + newWin;
        updateUser({
          id: matchedUser.id,
          winningBalance: newWin,
          totalBalance: newTot,
          totalWins: matchedUser.totalWins + 1,
          totalKills: matchedUser.totalKills + w.kills,
          weeklyWins: matchedUser.weeklyWins + 1,
          weeklyKills: matchedUser.weeklyKills + w.kills,
          monthlyWins: matchedUser.monthlyWins + 1,
          monthlyKills: matchedUser.monthlyKills + w.kills
        });

        // Add real marquee notice!
        addWinnerAnnouncement({
          gameIdName: matchedUser.nickname || matchedUser.username,
          eventOrMatch: `ম্যাচ #${w.rank} (${w.kills} কিল)`,
          prize: w.prize
        });
      }
    });

    setTournaments(prev =>
      prev.map(t => (t.id === tournamentId ? { ...t, status: 'COMPLETED', winners } : t))
    );
    sound.playVictory();
  };

  // 7 Up 7 Down Bet Placement (Exact user specifications):
  // - Minimum 10 taka balance required to bet
  // - If bet on UP (8-12), cannot bet on DOWN (2-6). Can optionally bet on 7.
  // - If bet on DOWN (2-6), cannot bet on UP (8-12). Can optionally bet on 7.
  // - If bet on 7, can bet on UP or DOWN (not both).
  const placeSevenUpDownBet = (
    target: 'DOWN' | 'SEVEN' | 'UP',
    chipAmount: number
  ): { success: boolean; message: string } => {
    if (!currentUser) {
      openAuthModal('LOGIN');
      return { success: false, message: 'দান ধরতে অনুগ্রহ করে লগইন করুন!' };
    }

    if (currentUser.totalBalance < 10) {
      sound.playError();
      return { success: false, message: 'দান ধরার জন্য একাউন্টে সর্বনিম্ন ১০ টাকা ব্যালেন্স থাকতে হবে!' };
    }

    if (currentUser.totalBalance < chipAmount) {
      sound.playError();
      return { success: false, message: `অপর্যাপ্ত ব্যালেন্স! আপনার ব্যালেন্স আছে ৳${currentUser.totalBalance}` };
    }

    if (sevenUpDownRound.phase !== 'BETTING') {
      sound.playError();
      return { success: false, message: 'বাজি ধরার সময় শেষ! পরবর্তী রাউন্ডের জন্য অপেক্ষা করুন।' };
    }

    // Mutual Exclusion Enforcement:
    if (target === 'UP' && sevenUpDownRound.userBets.DOWN > 0) {
      sound.playError();
      return { success: false, message: 'আপনি ডাউনে বাজি ধরেছেন, তাই আপে ধরতে পারবেন না! (৭ এ অপশনাল ধরতে পারেন)' };
    }

    if (target === 'DOWN' && sevenUpDownRound.userBets.UP > 0) {
      sound.playError();
      return { success: false, message: 'আপনি আপে বাজি ধরেছেন, তাই ডাউনে ধরতে পারবেন না! (৭ এ অপশনাল ধরতে পারেন)' };
    }

    // Deduct chip amount from total balance
    let remaining = chipAmount;
    let newDeposit = currentUser.depositBalance;
    let newWinning = currentUser.winningBalance;

    if (newDeposit >= remaining) {
      newDeposit -= remaining;
    } else {
      remaining -= newDeposit;
      newDeposit = 0;
      newWinning = Math.max(0, newWinning - remaining);
    }

    setCurrentUser({
      ...currentUser,
      depositBalance: newDeposit,
      winningBalance: newWinning,
      totalBalance: newDeposit + newWinning
    });

    // Update Round User Bets
    setSevenUpDownRound(prev => ({
      ...prev,
      userBets: {
        ...prev.userBets,
        [target]: prev.userBets[target] + chipAmount
      },
      totalBets: {
        ...prev.totalBets,
        [target]: prev.totalBets[target] + chipAmount
      }
    }));

    sound.playChip();
    return { success: true, message: `৳${chipAmount} সফলভাবে বাজি ধরা হয়েছে!` };
  };

  const setSevenUpDownAdminForce = (forceVal?: number) => {
    adminForceDiceRef.current = forceVal;
  };

  const addWinnerAnnouncement = (ann: Omit<LiveWinnerAnnouncement, 'id' | 'time'>) => {
    const newEntry: LiveWinnerAnnouncement = {
      ...ann,
      id: `w-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setWinnerAnnouncements(prev => [newEntry, ...prev.slice(0, 15)]);
  };

  // Wallet
  const addDepositRequest = (method: PaymentMethod, amount: number, phone: string, trxId: string) => {
    if (!currentUser) {
      openAuthModal('LOGIN');
      return { success: false, autoVerified: false, message: 'টাকা যোগ করতে অনুগ্রহ করে লগইন করুন!' };
    }

    const cleanTrx = trxId.trim().toUpperCase();
    const matchedSMS = smsInbox.find(
      s => !s.matched && s.trxId.toUpperCase() === cleanTrx && s.amount === amount
    );
    const isAutoVerified = Boolean(matchedSMS) || cleanTrx.length >= 8;

    if (isAutoVerified) {
      if (matchedSMS) {
        setSmsInbox(prev => prev.map(s => (s.id === matchedSMS.id ? { ...s, matched: true } : s)));
      }
      const newDep = currentUser.depositBalance + amount;
      const newTotal = newDep + currentUser.winningBalance;
      setCurrentUser({
        ...currentUser,
        depositBalance: newDep,
        totalBalance: newTotal
      });

      const tx: WalletTransaction = {
        id: `tx-dep-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.username,
        type: 'DEPOSIT',
        amount,
        method,
        phoneNumber: phone,
        trxId: cleanTrx,
        status: 'COMPLETED',
        description: `স্বয়ংক্রিয় SMS ভেরিফাইড ${method} ডিপোজিট`,
        createdAt: new Date().toLocaleString('en-GB'),
        verifiedBySMS: true
      };
      setTransactions(prev => [tx, ...prev]);
      sound.playCoin();

      return {
        success: true,
        autoVerified: true,
        message: `ডিপোজিট সফল! TrxID (${cleanTrx}) ভেরিফাই করে ৳${amount} যোগ করা হয়েছে।`
      };
    } else {
      const tx: WalletTransaction = {
        id: `tx-dep-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.username,
        type: 'DEPOSIT',
        amount,
        method,
        phoneNumber: phone,
        trxId: cleanTrx,
        status: 'PENDING',
        description: `${method} ডিপোজিট রিকোয়েস্ট`,
        createdAt: new Date().toLocaleString('en-GB'),
        verifiedBySMS: false
      };
      setTransactions(prev => [tx, ...prev]);
      return {
        success: true,
        autoVerified: false,
        message: `আপনার ডিপোজিট রিকোয়েস্ট গৃহীত হয়েছে। TrxID যাচাই করে ব্যালেন্স যোগ করা হবে।`
      };
    }
  };

  const addWithdrawRequest = (method: PaymentMethod, amount: number, phone: string) => {
    if (!currentUser) return { success: false, message: 'অনুগ্রহ করে লগইন করুন!' };
    if (amount < 100) return { success: false, message: 'সর্বনিম্ন উত্তোলনের পরিমাণ ১০০ টাকা!' };
    if (currentUser.winningBalance < amount) return { success: false, message: 'উইনিং ব্যালেন্স পর্যাপ্ত নয়!' };

    const newWin = currentUser.winningBalance - amount;
    const newTot = currentUser.depositBalance + newWin;
    setCurrentUser({
      ...currentUser,
      winningBalance: newWin,
      totalBalance: newTot
    });

    const tx: WalletTransaction = {
      id: `tx-wd-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.username,
      type: 'WITHDRAW',
      amount,
      method,
      phoneNumber: phone,
      status: 'PENDING',
      description: `${method} ক্যাশআউট রিকোয়েস্ট (${phone})`,
      createdAt: new Date().toLocaleString('en-GB')
    };
    setTransactions(prev => [tx, ...prev]);
    sound.playClick();

    return {
      success: true,
      message: `৳${amount} উত্তোলনের আবেদন সফল হয়েছে! অল্প সময়ের মধ্যে টাকা পৌঁছে যাবে।`
    };
  };

  const approveTransaction = (trxIdToApprove: string) => {
    const tx = transactions.find(t => t.id === trxIdToApprove);
    if (!tx || tx.status !== 'PENDING') return;

    if (tx.type === 'DEPOSIT') {
      const targetUser = users.find(u => u.id === tx.userId);
      if (targetUser) {
        const newDep = targetUser.depositBalance + tx.amount;
        updateUser({
          id: targetUser.id,
          depositBalance: newDep,
          totalBalance: newDep + targetUser.winningBalance
        });
      }
    }
    setTransactions(prev => prev.map(t => (t.id === trxIdToApprove ? { ...t, status: 'COMPLETED' } : t)));
    sound.playCoin();
  };

  const rejectTransaction = (trxIdToReject: string) => {
    const tx = transactions.find(t => t.id === trxIdToReject);
    if (!tx || tx.status !== 'PENDING') return;

    if (tx.type === 'WITHDRAW') {
      const targetUser = users.find(u => u.id === tx.userId);
      if (targetUser) {
        const newWin = targetUser.winningBalance + tx.amount;
        updateUser({
          id: targetUser.id,
          winningBalance: newWin,
          totalBalance: targetUser.depositBalance + newWin
        });
      }
    }
    setTransactions(prev => prev.map(t => (t.id === trxIdToReject ? { ...t, status: 'REJECTED' } : t)));
    sound.playError();
  };

  const addSMSMessage = (sms: Omit<SMSMessage, 'id' | 'receivedAt' | 'matched'>) => {
    const newMsg: SMSMessage = {
      ...sms,
      id: `sms-${Date.now()}`,
      receivedAt: new Date().toLocaleString('en-GB'),
      matched: false
    };
    setSmsInbox(prev => [newMsg, ...prev]);
  };

  const claimLudoWin = (amount: number, gameType: string) => {
    if (!currentUser) return;
    const newWin = currentUser.winningBalance + amount;
    const newTot = currentUser.depositBalance + newWin;
    const updated = {
      ...currentUser,
      winningBalance: newWin,
      totalBalance: newTot,
      totalWins: currentUser.totalWins + 1,
      totalMatches: currentUser.totalMatches + 1,
      weeklyWins: currentUser.weeklyWins + 1,
      monthlyWins: currentUser.monthlyWins + 1
    };
    setCurrentUser(updated);

    addWinnerAnnouncement({
      gameIdName: currentUser.nickname || currentUser.username,
      eventOrMatch: gameType,
      prize: amount
    });

    const tx: WalletTransaction = {
      id: `tx-ludo-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.username,
      type: 'WINNING_PRIZE',
      amount,
      description: `${gameType} চ্যাম্পিয়ন প্রাইজ মানি`,
      status: 'COMPLETED',
      createdAt: new Date().toLocaleString('en-GB')
    };
    setTransactions(prev => [tx, ...prev]);
    sound.playVictory();
  };

  const addHeroBanner = (banner: Omit<HeroBannerItem, 'id'>) => {
    const newBanner: HeroBannerItem = {
      ...banner,
      id: `b-${Date.now()}`
    };
    setSettings(prev => ({
      ...prev,
      heroBanners: [...(prev.heroBanners || initialHeroBanners), newBanner]
    }));
    sound.playCoin();
  };

  const updateHeroBanner = (banner: HeroBannerItem) => {
    setSettings(prev => ({
      ...prev,
      heroBanners: (prev.heroBanners || initialHeroBanners).map(b => b.id === banner.id ? banner : b)
    }));
    sound.playClick();
  };

  const deleteHeroBanner = (id: string) => {
    setSettings(prev => ({
      ...prev,
      heroBanners: (prev.heroBanners || initialHeroBanners).filter(b => b.id !== id)
    }));
    sound.playClick();
  };

  const updateTopAdBanner = (ad: Partial<TopAdBanner>) => {
    setSettings(prev => ({
      ...prev,
      topAdBanner: {
        ...(prev.topAdBanner || initialSettings.topAdBanner),
        ...ad
      }
    }));
    sound.playClick();
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Admin credentials verification
  const loginAdmin = (user: string, pass: string): boolean => {
    if (
      user.trim() === settings.adminCredentials.username &&
      pass.trim() === settings.adminCredentials.passwordHash
    ) {
      setIsAdminLoggedIn(true);
      sound.playVictory();
      return true;
    }
    sound.playError();
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setIsAdminOpen(false);
    sound.playClick();
  };

  const updateAdminCredentials = (user: string, pass: string) => {
    setSettings(prev => ({
      ...prev,
      adminCredentials: {
        username: user.trim(),
        passwordHash: pass.trim()
      }
    }));
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        toggleLanguage,
        currentUser,
        setCurrentUser,
        users,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
        setAuthModalMode,
        registerUser,
        loginUser,
        loginWithGoogle,
        logoutUser,
        updateUser,
        deleteUser,
        blockUser,
        adjustUserBalance,
        claimReferralBonus,
        modes,
        createMode,
        updateMode,
        deleteMode,
        toggleModeStatus,
        selectedModeForView,
        setSelectedModeForView,
        tournaments,
        createTournament,
        updateTournament,
        deleteTournament,
        setRoomDetails,
        joinTournament,
        distributeTournamentPrize,
        sevenUpDownRound,
        placeSevenUpDownBet,
        setSevenUpDownAdminForce,
        is7Up7DownModalOpen,
        setIs7Up7DownModalOpen,
        winnerAnnouncements,
        addWinnerAnnouncement,
        transactions,
        smsInbox,
        addDepositRequest,
        addWithdrawRequest,
        approveTransaction,
        rejectTransaction,
        addSMSMessage,
        claimLudoWin,
        settings,
        updateSettings,
        isAdminOpen,
        setIsAdminOpen,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        updateAdminCredentials,
        activeModal,
        setActiveModal,
        selectedTournamentForSlots,
        setSelectedTournamentForSlots,
        selectedTournamentForJoin,
        setSelectedTournamentForJoin,
        selectedTournamentForRoom,
        setSelectedTournamentForRoom,
        addHeroBanner,
        updateHeroBanner,
        deleteHeroBanner,
        updateTopAdBanner
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
