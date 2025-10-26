import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import GradientButton from '../components/GradientButton';
import { Settings, saveSettings, loadSettings, DEFAULT_SETTINGS, clearAllData } from '../utils/storage';
import { WishCategory, CATEGORY_NAMES, CATEGORY_EMOJIS } from '../constants/wishes';
import { COLORS } from '../constants/colors';
import SettingSection from '../components/settings/SettingSection';
import CategoryToggle from '../components/settings/CategoryToggle';
import ToggleSetting from '../components/settings/ToggleSetting';
import ColorSelector from '../components/settings/ColorSelector';

interface Props {
  onBack: () => void;
  onSettingsChange: (settings: Settings) => void;
}

const categories: WishCategory[] = ['all', 'funny', 'romantic', 'extreme', 'creative', 'social'];

const getCategoryColor = (category: WishCategory): string[] => {
  const colorMap: Record<WishCategory, string[]> = {
    all: ['#667eea', '#764ba2'],
    funny: ['#f093fb', '#f5576c'],
    romantic: ['#fa709a', '#fee140'],
    extreme: ['#ff6b6b', '#ee5a6f'],
    creative: ['#4facfe', '#00f2fe'],
    social: ['#43e97b', '#38f9d7'],
  };
  return colorMap[category] || colorMap.all;
};

const THEME_OPTIONS = [
  { value: 'default', label: 'По умолчанию' },
  { value: 'sunset', label: 'Закат' },
  { value: 'ocean', label: 'Океан' },
  { value: 'forest', label: 'Лес' },
  { value: 'night', label: 'Ночь' },
  { value: 'candy', label: 'Конфеты' },
  { value: 'fire', label: 'Огонь' },
  { value: 'ice', label: 'Лёд' },
];

const BOTTLE_COLORS = [
  { value: '#8B4513', label: 'Коричневый' },
  { value: '#228B22', label: 'Зелёный' },
  { value: '#1E90FF', label: 'Синий' },
  { value: '#DC143C', label: 'Красный' },
  { value: '#32CD32', label: 'Салатовый' },
];

const SPEED_OPTIONS = [
  { label: 'Медленно', value: 6000 },
  { label: 'Нормально', value: 4000 },
  { label: 'Быстро', value: 2000 },
];

const TIMER_OPTIONS = [
  { label: '30 сек', value: 30000 },
  { label: '60 сек', value: 60000 },
  { label: '90 сек', value: 90000 },
  { label: '120 сек', value: 120000 },
];

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

  return (
    <LinearGradient colors={['#f8f9ff', '#f0f2ff', '#e8eaff']} style={styles.mainContainer}>
      <View style={styles.container}>
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Назад</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>⚙️ Настройки</Text>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Категории желаний */}
          <SettingSection
            title="Категории желаний"
            emoji="🎯"
            colors={['#667eea', '#764ba2']}
          >
            <Text style={styles.description}>
              Выберите какие желания будут использоваться в игре
            </Text>
            <View style={styles.grid}>
              {categories.map(category => {
                const isEnabled = settings.enabledCategories.includes(category) ||
                                 settings.enabledCategories.includes('all');

                return (
                  <CategoryToggle
                    key={category}
                    category={category}
                    name={CATEGORY_NAMES[category]}
                    emoji={CATEGORY_EMOJIS[category]}
                    colors={getCategoryColor(category)}
                    isEnabled={isEnabled}
                    onToggle={() => toggleCategory(category)}
                  />
                );
              })}
            </View>
          </SettingSection>

          {/* Настройки игры */}
          <SettingSection
            title="Настройки игры"
            emoji="🎮"
            colors={['#4ecdc4', '#44a3d9']}
          >
            <ToggleSetting
              label="Вибрация"
              value={settings.vibrationEnabled}
              onValueChange={value => {
                ReactNativeHapticFeedback.trigger('impactLight');
                setSettings({ ...settings, vibrationEnabled: value });
              }}
            />
            <ToggleSetting
              label="Таймер"
              value={settings.showTimer}
              onValueChange={value => {
                ReactNativeHapticFeedback.trigger('impactLight');
                setSettings({ ...settings, showTimer: value });
              }}
            />
            <ToggleSetting
              label="Пользовательские желания"
              value={settings.useCustomWishes}
              onValueChange={value => {
                ReactNativeHapticFeedback.trigger('impactLight');
                setSettings({ ...settings, useCustomWishes: value });
              }}
            />
          </SettingSection>

          {/* Скорость вращения */}
          <SettingSection
            title="Скорость вращения"
            emoji="⚡"
            colors={['#ff6b6b', '#ee5a6f']}
          >
            <ColorSelector
              label=""
              options={SPEED_OPTIONS}
              selectedValue={settings.spinDuration}
              onSelect={(value) => {
                ReactNativeHapticFeedback.trigger('impactLight');
                setSettings({ ...settings, spinDuration: parseInt(value) });
              }}
            />
          </SettingSection>

          {/* Длительность таймера */}
          {settings.showTimer && (
            <SettingSection
              title="Длительность таймера"
              emoji="⏱"
              colors={['#51cf66', '#37b24d']}
            >
              <ColorSelector
                label=""
                options={TIMER_OPTIONS}
                selectedValue={settings.timerDuration}
                onSelect={(value) => {
                  ReactNativeHapticFeedback.trigger('impactLight');
                  setSettings({ ...settings, timerDuration: parseInt(value) });
                }}
              />
            </SettingSection>
          )}

          {/* Тема оформления */}
          <SettingSection
            title="Тема оформления"
            emoji="🎨"
            colors={['#f093fb', '#f5576c']}
          >
            <ColorSelector
              label=""
              options={THEME_OPTIONS}
              selectedValue={settings.theme}
              onSelect={(value) => {
                ReactNativeHapticFeedback.trigger('impactLight');
                setSettings({ ...settings, theme: value });
              }}
            />
          </SettingSection>

          {/* Цвет бутылки */}
          <SettingSection
            title="Цвет бутылки"
            emoji="🍾"
            colors={['#4facfe', '#00f2fe']}
          >
            <View style={styles.colorOptions}>
              {BOTTLE_COLORS.map(color => (
                <TouchableOpacity
                  key={color.value}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color.value },
                    settings.bottleColor === color.value && styles.colorCircleSelected,
                  ]}
                  onPress={() => {
                    ReactNativeHapticFeedback.trigger('impactLight');
                    setSettings({ ...settings, bottleColor: color.value });
                  }}
                />
              ))}
            </View>
          </SettingSection>

          {/* Кнопки действий */}
          <View style={styles.actions}>
            <GradientButton
              title="💾 Сохранить настройки"
              onPress={handleSaveSettings}
              colors={['#51cf66', '#37b24d']}
            />
            <GradientButton
              title="🗑️ Сбросить все данные"
              onPress={handleResetData}
              colors={['#ff6b6b', '#ee5a6f']}
              style={styles.resetButton}
            />
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
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
  description: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  grid: {
    gap: 12,
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  colorCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorCircleSelected: {
    borderColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  actions: {
    gap: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  resetButton: {
    marginTop: 0,
  },
});
