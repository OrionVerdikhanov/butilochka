export type Gender = 'M' | 'F';

export interface Player {
  id: string;
  name: string;
  gender: Gender;
  likes: number;
  wishesCompleted?: number;
  actions?: GameAction[];
}

export interface GameAction {
  id: string;
  timestamp: number;
  type: 'wish' | 'kiss' | 'like' | 'ignore';
  fromPlayer: string;
  toPlayer?: string;
  wish?: string;
}

// Re-export GameMode from game.ts to avoid duplication
export type { GameMode } from './game';

export interface GameState {
  players: Player[];
  currentMode: GameMode | null;
  currentSpinner: number;
  currentTarget: number;
  isSpinning: boolean;
}

export interface SpinResult {
  spinner: Player;
  target: Player;
  wish?: string;
}

export interface WishesGameSettings {
  enabledCategories: import('../constants/wishes').WishCategory[];
  soundEnabled: boolean;
  spinDuration: number; // in milliseconds
  showTimer: boolean;
  timerDuration: number; // in seconds
}

export const DEFAULT_WISHES_SETTINGS: WishesGameSettings = {
  enabledCategories: ['all'],
  soundEnabled: true,
  spinDuration: 4000,
  showTimer: false,
  timerDuration: 60,
};
