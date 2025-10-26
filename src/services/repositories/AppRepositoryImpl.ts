import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlayerRepositoryImpl } from './PlayerRepositoryImpl';
import { SettingsRepositoryImpl } from './SettingsRepositoryImpl';
import { AppRepository } from './interfaces';

const KEYS = {
  PLAYERS: '@butilochka_players',
  SETTINGS: '@butilochka_settings',
  WISHES: '@butilochka_custom_wishes',
  STATS: '@butilochka_stats',
} as const;

/**
 * Реализация основного репозитория приложения
 */
export class AppRepositoryImpl implements AppRepository {
  public readonly players: PlayerRepositoryImpl;
  public readonly settings: SettingsRepositoryImpl;

  constructor() {
    this.players = new PlayerRepositoryImpl();
    this.settings = new SettingsRepositoryImpl();
  }

  /**
   * Очистить все данные приложения
   */
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(KEYS));
    } catch (error) {
      console.error('Failed to clear all data:', error);
      throw new Error('Failed to clear all data');
    }
  }
}