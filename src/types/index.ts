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

export type GameMode = 'wishes' | 'dating';

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

export interface GameSettings {
  enabledCategories: import('../constants/wishes').WishCategory[];
  soundEnabled: boolean;
  spinDuration: number; // in milliseconds
  showTimer: boolean;
  timerDuration: number; // in seconds
}

export const DEFAULT_SETTINGS: GameSettings = {
  enabledCategories: ['all'],
  soundEnabled: true,
  spinDuration: 4000,
  showTimer: false,
  timerDuration: 60,
};
