import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import GradientBackground from '../components/GradientBackground';
import GradientButton from '../components/GradientButton';
import FloatingParticles from '../components/FloatingParticles';
import {
  WishCategoriesSettings,
  GameSettings,
  AppearanceSettings,
  DataManagement
} from '../components/settings';
import { useSettings } from '../hooks/useSettings';
import { DEFAULT_SETTINGS } from '../utils/storage';

interface Props {
  onBack: () => void;
  onSettingsChange: (settings: any) => void;
}

/**
 * Экран настроек приложения
 *
 * Компонент использует модульную архитектуру с разделением на:
 * - WishCategoriesSettings - управление категориями желаний
 * - GameSettings - игровые настройки (вибрация, таймер)
 * - AppearanceSettings - внешний вид (темы, цвета, скорость)
 * - DataManagement - управление данными (сброс)
 * - useSettings - хук для управления состоянием настроек
 */
export default function SettingsScreen({ onBack, onSettingsChange }: Props) {
  const { settings, updateSettings, resetSettings, isSaving, isLoading } = useSettings();

  /**
   * Обработчик сохранения настроек
   */
  const handleSaveSettings = useCallback(async () => {
    ReactNativeHapticFeedback.trigger('notificationSuccess');
    await updateSettings(settings);
    onSettingsChange(settings);
    Alert.alert('Настройки сохранены', 'Ваши настройки успешно сохранены!');
  }, [settings, updateSettings, onSettingsChange]);

  /**
   * Обработчик сброса данных
   */
  const handleResetData = useCallback(async () => {
    await resetSettings();
    onSettingsChange(DEFAULT_SETTINGS);
  }, [resetSettings, onSettingsChange]);

  /**
   * Обработчик изменения настроек
   */
  const handleSettingsChange = useCallback((newSettings: any) => {
    updateSettings(newSettings);
  }, [updateSettings]);

  return (
    <GradientBackground colors={['#f8f9ff', '#f0f2ff', '#e8eaff']}>
      <FloatingParticles count={12} color="rgba(102, 126, 234, 0.2)" size={5} />

      <View style={styles.container}>
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Назад</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>⚙️ Настройки</Text>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Категории желаний */}
          <WishCategoriesSettings
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />

          {/* Настройки игры */}
          <GameSettings
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />

          {/* Внешний вид */}
          <AppearanceSettings
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />

          {/* Управление данными */}
          <DataManagement onResetComplete={handleResetData} />

          <View style={{ height: 100 }} />
        </ScrollView>

        <View style={styles.footer}>
          <GradientButton
            title="💾 Сохранить настройки"
            onPress={handleSaveSettings}
            colors={['#667eea', '#764ba2']}
            disabled={isSaving}
          />
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
});
