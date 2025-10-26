import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings, DEFAULT_SETTINGS } from '../../utils/storage';
import { SettingsRepository } from './interfaces';

const SETTINGS_KEY = '@butilochka_settings';

/**
 * Реализация репозитория для работы с настройками
 */
export class SettingsRepositoryImpl implements SettingsRepository {
  /**
   * Сохранить настройки
   */
  async saveSettings(settings: Settings): Promise<void> {
    try {
      const jsonValue = JSON.stringify(settings);
      await AsyncStorage.setItem(SETTINGS_KEY, jsonValue);
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw new Error('Failed to save settings');
    }
  }

  /**
   * Загрузить настройки
   */
  async loadSettings(): Promise<Settings> {
    try {
      const jsonValue = await AsyncStorage.getItem(SETTINGS_KEY);
      return jsonValue ? JSON.parse(jsonValue) : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return DEFAULT_SETTINGS;
    }
  }

  /**
   * Сбросить настройки к значениям по умолчанию
   */
  async resetSettings(): Promise<void> {
    try {
      await this.saveSettings(DEFAULT_SETTINGS);
    } catch (error) {
      console.error('Failed to reset settings:', error);
      throw new Error('Failed to reset settings');
    }
  }

  /**
   * Обновить отдельные настройки
   */
  async updateSettings(updates: Partial<Settings>): Promise<void> {
    try {
      const currentSettings = await this.loadSettings();
      const updatedSettings = { ...currentSettings, ...updates };
      await this.saveSettings(updatedSettings);
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw new Error('Failed to update settings');
    }
  }
}