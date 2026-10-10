export type UserRole = 'player' | 'admin';

export interface UserProfile {
  id: string;
  username: string;
  nickname: string;
  email?: string;
  phone: string;
  ffUid: string;
  avatar: string;
  role: UserRole;
  isOnline: boolean;
  isBlocked: boolean;
  registeredAt: string; // ISO string
  totalBalance: number;
  depositBalance: number;
  winningBalance: number;
  referralCode: string;
  referredBy?: string;
  referralEarnings: number;
  referralClaimable: number;
  referredUsers: {
    username: string;
    joinedAt: string;
    commissionEarned: number;
  }[];
  totalMatches: number;
  totalWins: number;
  totalKills: number;
  weeklyWins: number;
  weeklyKills: number;
  monthlyWins: number;
  monthlyKills: number;
}

export interface GameModeItem {
  id: string;
  name: string;
  badgeText: string;
  icon: string;
  image: string;
  rules: string;
  isEnabled: boolean;
  isFreeFire: boolean;
  order: number;
}

export type MatchType = 'SOLO' | 'DUO' | 'SQUAD';

export interface TournamentSlot {
  slotNumber: number;
  occupied: boolean;
  userId?: string;
  userName?: string;
  ffUid?: string;
  teamName?: string;
  teamMembers?: string[];
  joinedAt?: string;
}

export interface TournamentWinner {
  rank: number;
  userId?: string;
  userName: string;
  kills: number;
  prize: number;
}

export interface Tournament {
  id: string;
  title: string;
  modeId: string;
  category: string;
  mapName: string;
  matchType: MatchType;
  startTime: string; // ISO string
  entryFee: number;
  prizePool: number;
  perKill: number;
  totalSlots: number;
  slots: TournamentSlot[];
  roomId?: string;
  roomPassword?: string;
  isRoomReady: boolean;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  bannerImage?: string;
  rulesText?: string;
  winners?: TournamentWinner[];
}

export type PaymentMethod = 'bKash' | 'Nagad' | 'Rocket';

export interface WalletTransaction {
  id: string;
  userId: string;
  userName: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'ENTRY_FEE' | 'WINNING_PRIZE' | 'ADMIN_ADJUST' | 'REFERRAL_COMMISSION' | 'SEVEN_UP_BET' | 'SEVEN_UP_WIN';
  amount: number;
  method?: PaymentMethod;
  phoneNumber?: string;
  trxId?: string;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  description: string;
  createdAt: string;
  verifiedBySMS?: boolean;
}

export interface SMSMessage {
  id: string;
  sender: string;
  body: string;
  trxId: string;
  amount: number;
  receivedAt: string;
  matched: boolean;
}

export interface LiveWinnerAnnouncement {
  id: string;
  gameIdName: string;
  eventOrMatch: string;
  prize: number;
  time: string;
}

export interface SevenUpDownHistoryItem {
  round: number;
  sum: number;
  target: 'DOWN' | 'SEVEN' | 'UP';
  dice1: number;
  dice2: number;
  isLightning?: boolean;
}

export interface SevenUpDownConfig {
  isEnabled: boolean;
  payoutMultiplierDown: number; // default 2.0 (1:1 profit)
  payoutMultiplierUp: number; // default 2.0 (1:1 profit)
  payoutMultiplierSeven: number; // default 4.0 or 6.0
  lightningMultiplierSeven: number; // default 6.0
  sevenFrequencyPerHour: number; // how many 7s target per hour
  adminNextRollForce?: number; // admin can force e.g. 7, 3, 11
  minBet: number;
}

export interface AppSettings {
  siteBrandText: string; // editable e.g. "XEB TOUR"
  siteTagline?: string;
  siteLogoUrl?: string;
  siteLogoIcon: string;
  popupNotice: {
    enabled: boolean;
    title: string;
    banglaDescription: string;
    imageUrl: string;
    actionText: string;
    actionUrl: string;
  };
  tiktokSponsor: {
    enabled: boolean;
    title: string;
    banglaDescription: string;
    actionText: string;
    actionUrl: string;
    rewardPer1000Views: number;
  };
  telegramSupportLink: string;
  referralConfig: {
    isEnabled: boolean;
    commissionPercentage: number; // e.g. 20%
  };
  paymentNumbers: {
    bKash: string;
    bKashType: 'Personal' | 'Agent' | 'Merchant';
    nagad: string;
    nagadType: 'Personal' | 'Agent' | 'Merchant';
    rocket: string;
    rocketType: 'Personal' | 'Agent' | 'Merchant';
  };
  adminCredentials: {
    username: string;
    passwordHash: string;
  };
  ludoConfig: {
    isEnabled: boolean;
    fairRngPercentage: number;
    entryFees: {
      '1v1': number;
      '2v2': number;
      '4v4': number;
      snake: number;
    };
    winningMultiplier: number;
  };
  sevenUpDownConfig: SevenUpDownConfig;
}
