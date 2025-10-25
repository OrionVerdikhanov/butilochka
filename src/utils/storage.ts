import AsyncStorage from '@react-native-async-storage/async-storage';
import { Player } from '../types';

const KEYS = {
  PLAYERS: '@butilochka_players',
  WISHES: '@butilochka_custom_wishes',
  STATS: '@butilochka_stats',
  SETTINGS: '@butilochka_settings',
};

// Сохранение игроков
export const savePlayers = async (players: Player[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.PLAYERS, JSON.stringify(players));
  } catch (error) {
    console.error('Error saving players:', error);
  }
};

// Загрузка игроков
export const loadPlayers = async (): Promise<Player[]> => {
  try {
    const playersJson = await AsyncStorage.getItem(KEYS.PLAYERS);
    return playersJson ? JSON.parse(playersJson) : [];
  } catch (error) {
    console.error('Error loading players:', error);
    return [];
  }
};

// Сохранение кастомных желаний
export const saveCustomWishes = async (wishes: string[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.WISHES, JSON.stringify(wishes));
  } catch (error) {
    console.error('Error saving wishes:', error);
  }
};

// Загрузка кастомных желаний
export const loadCustomWishes = async (): Promise<string[]> => {
  try {
    const wishesJson = await AsyncStorage.getItem(KEYS.WISHES);
    return wishesJson ? JSON.parse(wishesJson) : [];
  } catch (error) {
    console.error('Error loading wishes:', error);
    return [];
  }
};

// Сохранение статистики
export interface GameStats {
  totalGames: number;
  wishesGames: number;
  datingGames: number;
  totalSpins: number;
  playerStats: {
    [playerId: string]: {
      spins: number;
      targets: number;
      likes: number;
    };
  };
}

export const saveStats = async (stats: GameStats): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving stats:', error);
  }
};

export const loadStats = async (): Promise<GameStats> => {
  try {
    const statsJson = await AsyncStorage.getItem(KEYS.STATS);
    return statsJson
      ? JSON.parse(statsJson)
      : {
          totalGames: 0,
          wishesGames: 0,
          datingGames: 0,
          totalSpins: 0,
          playerStats: {},
        };
  } catch (error) {
    console.error('Error loading stats:', error);
    return {
      totalGames: 0,
      wishesGames: 0,
      datingGames: 0,
      totalSpins: 0,
      playerStats: {},
    };
  }
};

// Настройки
export interface Settings {
  vibrationEnabled: boolean;
  soundEnabled: boolean;
  useCustomWishes: boolean;
}

export const saveSettings = async (settings: Settings): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const loadSettings = async (): Promise<Settings> => {
  try {
    const settingsJson = await AsyncStorage.getItem(KEYS.SETTINGS);
    return settingsJson
      ? JSON.parse(settingsJson)
      : {
          vibrationEnabled: true,
          soundEnabled: true,
          useCustomWishes: false,
        };
  } catch (error) {
    console.error('Error loading settings:', error);
    return {
      vibrationEnabled: true,
      soundEnabled: true,
      useCustomWishes: false,
    };
  }
};

// Очистка всех данных
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};
