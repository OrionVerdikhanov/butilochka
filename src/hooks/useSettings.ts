import { useState, useEffect, useCallback } from 'react';
import { Settings, DEFAULT_SETTINGS, saveSettings, loadSettings } from '../utils/storage';

/**
 * Возвращаемое значение хука useSettings
 */
export interface UseSettingsReturn {
  /** Текущие настройки */
  settings: Settings;
  /** Функция обновления настроек */
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  /** Функция сброса настроек к значениям по умолчанию */
  resetSettings: () => Promise<void>;
  /** Функция перезагрузки настроек из хранилища */
  reloadSettings: () => Promise<void>;
  /** Происходит ли сохранение настроек */
  isSaving: boolean;
  /** Происходит ли загрузка настроек */
  isLoading: boolean;
}

/**
 * Кастомный хук для управления настройками приложения
 *
 * @param initialSettings - Начальные настройки (опционально)
 * @returns Объект с настройками и функциями управления
 *
 * @example
 * ```typescript
 * const {
 *   settings,
 *   updateSettings,
 *   resetSettings,
 *   isLoading
 * } = useSettings();
 *
 * // Обновление настройки
 * await updateSettings({ vibrationEnabled: false });
 *
 * // Сброс настроек
 * await resetSettings();
 * ```
 */
export function useSettings(initialSettings?: Settings): UseSettingsReturn {
  const [settings, setSettings] = useState<Settings>(initialSettings || DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Загрузка настроек из хранилища
   */
  const loadSettingsFromStorage = useCallback(async () => {
    try {
      setIsLoading(true);
      const savedSettings = await loadSettings();
      setSettings(savedSettings);
    } catch (error) {
      console.error('Failed to load settings:', error);
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Сохранение настроек в хранилище
   */
  const saveSettingsToStorage = useCallback(async (newSettings: Settings) => {
    try {
      setIsSaving(true);
      await saveSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, []);

  /**
   * Обновление настроек
   */
  const updateSettings = useCallback(async (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    await saveSettingsToStorage(updatedSettings);
  }, [settings, saveSettingsToStorage]);

  /**
   * Сброс настроек к значениям по умолчанию
   */
  const resetSettings = useCallback(async () => {
    await saveSettingsToStorage(DEFAULT_SETTINGS);
  }, [saveSettingsToStorage]);

  /**
   * Перезагрузка настроек из хранилища
   */
  const reloadSettings = useCallback(async () => {
    await loadSettingsFromStorage();
  }, [loadSettingsFromStorage]);

  // Загружаем настройки при монтировании компонента
  useEffect(() => {
    if (!initialSettings) {
      loadSettingsFromStorage();
    } else {
      setIsLoading(false);
    }
  }, [initialSettings, loadSettingsFromStorage]);

  return {
    settings,
    updateSettings,
    resetSettings,
    reloadSettings,
    isSaving,
    isLoading,
  };
}