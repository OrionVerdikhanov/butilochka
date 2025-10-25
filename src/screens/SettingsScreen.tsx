import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import GradientBackground from '../components/GradientBackground';
import GradientButton from '../components/GradientButton';
import FloatingParticles from '../components/FloatingParticles';
import { Settings, saveSettings, loadSettings, DEFAULT_SETTINGS, clearAllData } from '../utils/storage';
import { WishCategory, CATEGORY_NAMES, CATEGORY_EMOJIS } from '../constants/wishes';
import { COLORS } from '../constants/colors';

interface Props {
  onBack: () => void;
  onSettingsChange: (settings: Settings) => void;
}

export default function SettingsScreen({ onBack, onSettingsChange }: Props) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    loadSettingsData();
  }, []);

  const loadSettingsData = async () => {
    const loadedSettings = await loadSettings();
    setSettings(loadedSettings);
  };

  const handleSaveSettings = async () => {
    ReactNativeHapticFeedback.trigger('notificationSuccess');
    await saveSettings(settings);
    onSettingsChange(settings);
    Alert.alert('Настройки сохранены', 'Ваши настройки успешно сохранены!');
  };

  const handleResetData = () => {
    Alert.alert(
      'Сброс данных',
      'Вы уверены что хотите удалить все данные игры? Это действие необратимо.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            setSettings(DEFAULT_SETTINGS);
            ReactNativeHapticFeedback.trigger('notificationWarning');
            Alert.alert('Данные удалены', 'Все данные игры были удалены');
          },
        },
      ]
    );
  };

  const toggleCategory = (category: WishCategory) => {
    ReactNativeHapticFeedback.trigger('impactLight');

    if (category === 'all') {
      setSettings({ ...settings, enabledCategories: ['all'] });
      return;
    }

    const isEnabled = settings.enabledCategories.includes(category);
    let newCategories: WishCategory[];

    if (isEnabled) {
      newCategories = settings.enabledCategories.filter(c => c !== category && c !== 'all');
      if (newCategories.length === 0) {
        newCategories = ['all'];
      }
    } else {
      newCategories = settings.enabledCategories.filter(c => c !== 'all');
      newCategories.push(category);
    }

    setSettings({ ...settings, enabledCategories: newCategories });
  };

  const categories: WishCategory[] = ['all', 'funny', 'romantic', 'extreme', 'creative', 'social'];

  const getCategoryColor = (category: WishCategory): string[] => {
    switch (category) {
      case 'all':
        return ['#667eea', '#764ba2'];
      case 'funny':
        return ['#f093fb', '#f5576c'];
      case 'romantic':
        return ['#fa709a', '#fee140'];
      case 'extreme':
        return ['#ff6b6b', '#ee5a6f'];
      case 'creative':
        return ['#4facfe', '#00f2fe'];
      case 'social':
        return ['#43e97b', '#38f9d7'];
      default:
        return ['#667eea', '#764ba2'];
    }
  };

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
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Категории желаний</Text>
            <Text style={styles.sectionDescription}>
              Выберите какие желания будут использоваться в игре
            </Text>

            <View style={styles.categoriesGrid}>
              {categories.map(category => {
                const isEnabled = settings.enabledCategories.includes(category) ||
                                 settings.enabledCategories.includes('all');
                const isAll = category === 'all';
                const isAllSelected = settings.enabledCategories.includes('all');

                return (
                  <TouchableOpacity
                    key={category}
                    style={styles.categoryCard}
                    onPress={() => toggleCategory(category)}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={
                        isEnabled || (isAllSelected && !isAll)
                          ? getCategoryColor(category)
                          : ['#e9ecef', '#dee2e6']
                      }
                      style={[
                        styles.categoryGradient,
                        (isEnabled || (isAllSelected && !isAll)) && styles.categoryEnabled,
                      ]}
                    >
                      <Text style={styles.categoryEmoji}>{CATEGORY_EMOJIS[category]}</Text>
                      <Text
                        style={[
                          styles.categoryText,
                          !(isEnabled || (isAllSelected && !isAll)) && styles.categoryTextDisabled,
                        ]}
                      >
                        {CATEGORY_NAMES[category]}
                      </Text>
                      {(isEnabled && !isAll) || (isAll && isAllSelected) ? (
                        <View style={styles.checkmark}>
                          <Text style={styles.checkmarkText}>✓</Text>
                        </View>
                      ) : null}
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Настройки игры */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎮 Настройки игры</Text>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Вибрация</Text>
                <Text style={styles.settingDescription}>
                  Тактильный отклик при действиях
                </Text>
              </View>
              <Switch
                value={settings.vibrationEnabled}
                onValueChange={value => {
                  ReactNativeHapticFeedback.trigger('impactLight');
                  setSettings({ ...settings, vibrationEnabled: value });
                }}
                trackColor={{ false: '#d1d5db', true: '#667eea' }}
                thumbColor={settings.vibrationEnabled ? '#ffffff' : '#f3f4f6'}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Таймер</Text>
                <Text style={styles.settingDescription}>
                  Показывать таймер для выполнения желаний
                </Text>
              </View>
              <Switch
                value={settings.showTimer}
                onValueChange={value => {
                  ReactNativeHapticFeedback.trigger('impactLight');
                  setSettings({ ...settings, showTimer: value });
                }}
                trackColor={{ false: '#d1d5db', true: '#667eea' }}
                thumbColor={settings.showTimer ? '#ffffff' : '#f3f4f6'}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Пользовательские желания</Text>
                <Text style={styles.settingDescription}>
                  Использовать свои желания вместо стандартных
                </Text>
              </View>
              <Switch
                value={settings.useCustomWishes}
                onValueChange={value => {
                  ReactNativeHapticFeedback.trigger('impactLight');
                  setSettings({ ...settings, useCustomWishes: value });
                }}
                trackColor={{ false: '#d1d5db', true: '#667eea' }}
                thumbColor={settings.useCustomWishes ? '#ffffff' : '#f3f4f6'}
              />
            </View>
          </View>

          {/* Скорость вращения */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚡ Скорость вращения</Text>
            <View style={styles.speedOptions}>
              {[
                { label: 'Медленно', value: 6000 },
                { label: 'Нормально', value: 4000 },
                { label: 'Быстро', value: 2500 },
              ].map(option => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => {
                    ReactNativeHapticFeedback.trigger('impactMedium');
                    setSettings({ ...settings, spinDuration: option.value });
                  }}
                >
                  <LinearGradient
                    colors={
                      settings.spinDuration === option.value
                        ? ['#667eea', '#764ba2']
                        : ['#f3f4f6', '#e5e7eb']
                    }
                    style={styles.speedButton}
                  >
                    <Text
                      style={[
                        styles.speedText,
                        settings.spinDuration !== option.value && styles.speedTextInactive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Действия */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🗑️ Опасная зона</Text>

            <TouchableOpacity onPress={handleResetData}>
              <LinearGradient colors={['#ef4444', '#dc2626']} style={styles.dangerButton}>
                <Text style={styles.dangerButtonText}>Сбросить все данные</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        <View style={styles.footer}>
          <GradientButton
            title="💾 Сохранить настройки"
            onPress={handleSaveSettings}
            colors={['#667eea', '#764ba2']}
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
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 16,
    lineHeight: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '47%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryGradient: {
    padding: 16,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
    opacity: 0.7,
  },
  categoryEnabled: {
    opacity: 1,
  },
  categoryEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  categoryTextDisabled: {
    color: '#6b7280',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ffffff',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  speedOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  speedButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  speedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  speedTextInactive: {
    color: '#6b7280',
  },
  dangerButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  dangerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
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
