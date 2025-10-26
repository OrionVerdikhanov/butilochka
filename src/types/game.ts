import { Player } from './index';

// Game modes
export type GameMode = 'wishes' | 'dating' | 'truthOrDare' | 'custom';

// Game difficulty levels
export type GameDifficulty = 'easy' | 'medium' | 'hard' | 'extreme';

// Bottle variants
export type BottleVariant = '2d' | '3d' | 'premium';

// Game actions for different modes
export type GameAction =
  // Dating game actions
  | 'kiss'
  | 'hug'
  | 'compliment'
  | 'like'
  | 'ignore'
  // Wishes game actions
  | 'complete'
  | 'skip'
  | 'modify'
  // General actions
  | 'spin'
  | 'next'
  | 'pause'
  | 'reset';

// Player state in game
export interface PlayerGameState {
  player: Player;
  isSpinner: boolean;
  isTarget: boolean;
  likes?: number;
  score?: number;
  completedWishes?: number;
  skippedWishes?: number;
}

// Game configuration
export interface GameConfig {
  mode: GameMode;
  difficulty: GameDifficulty;
  maxRounds?: number;
  timeLimit?: number; // in seconds
  targetFilter?: (spinner: Player, players: Player[]) => Player[];
  bottleVariant?: BottleVariant;
  enableConfetti?: boolean;
  enableSound?: boolean;
  enableVibration?: boolean;
}

// Game session state
export interface GameSession {
  id: string;
  config: GameConfig;
  players: PlayerGameState[];
  currentRound: number;
  currentSpinner?: Player;
  currentTarget?: Player;
  isSpinning: boolean;
  isPaused: boolean;
  isFinished: boolean;
  startTime: Date;
  endTime?: Date;
  history: GameRound[];
}

// Single round in game
export interface GameRound {
  roundNumber: number;
  spinner: Player;
  target?: Player;
  action?: GameAction;
  result?: 'success' | 'skip' | 'fail';
  duration: number; // in milliseconds
  timestamp: Date;
  metadata?: {
    wishText?: string;
    truthQuestion?: string;
    dareTask?: string;
    points?: number;
  };
}

// Game statistics
export interface GameStats {
  totalRounds: number;
  totalDuration: number; // in milliseconds
  playerStats: PlayerStats[];
  sessionHistory: GameSession[];
}

// Individual player statistics
export interface PlayerStats {
  player: Player;
  gamesPlayed: number;
  gamesWon: number;
  totalSpins: number;
  timesAsTarget: number;
  averageReactionTime: number; // in milliseconds
  favoriteAction: GameAction;
  totalLikes: number;
  totalScore: number;
  achievements: Achievement[];
}

// Achievement system
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  category: 'social' | 'gameplay' | 'special' | 'seasonal';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: {
    current: number;
    required: number;
  };
}

// Wish categories for filtering
export interface WishCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  wishes: string[];
  ageRestriction?: number;
  difficulty?: GameDifficulty;
}

// Animation states
export interface AnimationState {
  isAnimating: boolean;
  type: 'spin' | 'pulse' | 'bounce' | 'shake' | 'fadeIn' | 'fadeOut';
  duration: number;
  progress: number;
}

// Modal types for game UI
export type GameModalType =
  | 'result'
  | 'settings'
  | 'playerList'
  | 'statistics'
  | 'achievements'
  | 'pause'
  | 'gameOver';

// Game result types
export interface GameResult {
  winner?: Player;
  scores: PlayerScore[];
  rankings: PlayerRanking[];
  achievements: Achievement[];
}

export interface PlayerScore {
  player: Player;
  score: number;
  breakdown: {
    spins: number;
    targets: number;
    actions: Record<GameAction, number>;
    bonuses: number;
    penalties: number;
  };
}

export interface PlayerRanking {
  rank: number;
  player: Player;
  score: number;
  change: 'up' | 'down' | 'same';
}

// Navigation types for game screens
export type GameScreen = 'modeSelection' | 'players' | 'game' | 'result' | 'settings';

export interface GameNavigationState {
  currentScreen: GameScreen;
  history: GameScreen[];
  params?: Record<string, any>;
  canGoBack: boolean;
}

// Error types for game
export interface GameError {
  code: string;
  message: string;
  type: 'warning' | 'error' | 'critical';
  recoverable: boolean;
  timestamp: Date;
  context?: {
    screen?: GameScreen;
    action?: GameAction;
    player?: Player;
  };
}

// All types are already exported individually above