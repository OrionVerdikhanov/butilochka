import { AppRepositoryImpl } from './repositories';
import { Player, Settings, GameStats } from '../utils/storage';

/**
 * Сервисный слой приложения
 * Инкапсулирует бизнес-логику и работает с репозиториями
 */
export class AppService {
  private repository: AppRepositoryImpl;

  constructor() {
    this.repository = new AppRepositoryImpl();
  }

  /**
   * Получить репозиторий игроков
   */
  get playerRepository() {
    return this.repository.players;
  }

  /**
   * Получить репозиторий настроек
   */
  get settingsRepository() {
    return this.repository.settings;
  }

  /**
   * Инициализация приложения
   * Загружает начальные данные и настраивает приложение
   */
  async initializeApp(): Promise<void> {
    try {
      // Проверяем, есть ли сохраненные настройки
      const settings = await this.repository.settings.loadSettings();

      // Если настроек нет, устанавливаем значения по умолчанию
      if (!settings) {
        await this.repository.settings.saveSettings({
          vibrationEnabled: true,
          soundEnabled: true,
          useCustomWishes: false,
          enabledCategories: ['all'],
          spinDuration: 4000,
          showTimer: false,
          timerDuration: 60,
          theme: 'romantic',
          bottleColor: 'red',
        });
      }

      console.log('App initialized successfully');
    } catch (error) {
      console.error('Failed to initialize app:', error);
      throw error;
    }
  }

  /**
   * Сброс приложения к начальному состоянию
   */
  async resetApp(): Promise<void> {
    try {
      await this.repository.clearAllData();
      await this.initializeApp();
      console.log('App reset successfully');
    } catch (error) {
      console.error('Failed to reset app:', error);
      throw error;
    }
  }

  /**
   * Получить статистику приложения
   */
  async getAppStats(): Promise<{
    playersCount: number;
    totalGames: number;
    appVersion: string;
  }> {
    try {
      const players = await this.repository.players.loadPlayers();

      return {
        playersCount: players.length,
        totalGames: 0, // Будет реализовано с репозиторием статистики
        appVersion: '1.0.0', // Версия приложения
      };
    } catch (error) {
      console.error('Failed to get app stats:', error);
      return {
        playersCount: 0,
        totalGames: 0,
        appVersion: '1.0.0',
      };
    }
  }

  /**
   * Валидация игрока
   */
  validatePlayer(player: Partial<Player>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!player.name || player.name.trim().length === 0) {
      errors.push('Имя игрока обязательно');
    }

    if (player.name && player.name.length > 20) {
      errors.push('Имя не должно превышать 20 символов');
    }

    if (!player.gender || !['M', 'F'].includes(player.gender)) {
      errors.push('Пол должен быть указан (M или F)');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Валидация настроек
   */
  validateSettings(settings: Partial<Settings>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (settings.spinDuration !== undefined) {
      if (settings.spinDuration < 1000 || settings.spinDuration > 10000) {
        errors.push('Длительность вращения должна быть от 1 до 10 секунд');
      }
    }

    if (settings.timerDuration !== undefined) {
      if (settings.timerDuration < 10 || settings.timerDuration > 300) {
        errors.push('Длительность таймера должна быть от 10 до 300 секунд');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Экспорт экземпляра сервиса как синглтона
export const appService = new AppService();