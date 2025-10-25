export type Gender = 'M' | 'F';

export interface Player {
  id: string;
  name: string;
  gender: Gender;
  likes: number;
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
