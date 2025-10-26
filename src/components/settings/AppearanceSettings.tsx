import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Settings } from '../../utils/storage';

interface Props {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

/**
 * Компонент настроек внешнего вида
 */
export function AppearanceSettings({ settings, onSettingsChange }: Props) {
  const updateSetting = (key: keyof Settings, value: any) => {
    ReactNativeHapticFeedback.trigger('impactMedium');
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <>
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
              onPress={() => updateSetting('spinDuration', option.value)}
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

      {/* Тема оформления */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎨 Тема оформления</Text>
        <Text style={styles.sectionDescription}>
          Выберите визуальный стиль игры
        </Text>
        <View style={styles.themesGrid}>
          {[
            { label: 'Романтика', value: 'romantic', colors: ['#ff6b9d', '#ff85a8'], emoji: '💕' },
            { label: 'Вечеринка', value: 'party', colors: ['#ffd43b', '#ffe066'], emoji: '🎉' },
            { label: 'Океан', value: 'ocean', colors: ['#4ecdc4', '#6bcfeb'], emoji: '🌊' },
            { label: 'Закат', value: 'sunset', colors: ['#ff9068', '#ffc078'], emoji: '🌅' },
            { label: 'Галактика', value: 'galaxy', colors: ['#533483', '#8e24aa'], emoji: '🌌' },
            { label: 'Лес', value: 'forest', colors: ['#51cf66', '#8ce99a'], emoji: '🌲' },
            { label: 'Неон', value: 'neon', colors: ['#8e24aa', '#ab47bc'], emoji: '✨' },
            { label: 'Пастель', value: 'pastel', colors: ['#f48fb1', '#f8bbd0'], emoji: '🎀' },
          ].map(theme => (
            <TouchableOpacity
              key={theme.value}
              style={styles.themeCard}
              onPress={() => updateSetting('theme', theme.value)}
            >
              <LinearGradient
                colors={theme.colors}
                style={[
                  styles.themeGradient,
                  settings.theme === theme.value && styles.themeSelected,
                ]}
              >
                <Text style={styles.themeEmoji}>{theme.emoji}</Text>
                <Text style={styles.themeText}>{theme.label}</Text>
                {settings.theme === theme.value && (
                  <View style={styles.themeCheckmark}>
                    <Text style={styles.themeCheckmarkText}>✓</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Цвет бутылочки */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🍾 Цвет бутылочки</Text>
        <View style={styles.bottleColors}>
          {[
            { label: 'Красная', value: 'red', colors: ['#ff6b6b', '#ee5a6f'] },
            { label: 'Зеленая', value: 'green', colors: ['#51cf66', '#40c057'] },
            { label: 'Синяя', value: 'blue', colors: ['#4a90e2', '#357abd'] },
            { label: 'Фиолетовая', value: 'purple', colors: ['#cc5de8', '#be4bdb'] },
            { label: 'Золотая', value: 'gold', colors: ['#ffd43b', '#fcc419'] },
          ].map(color => (
            <TouchableOpacity
              key={color.value}
              style={styles.bottleColorButton}
              onPress={() => updateSetting('bottleColor', color.value)}
            >
              <LinearGradient
                colors={color.colors}
                style={[
                  styles.bottleColorGradient,
                  settings.bottleColor === color.value && styles.bottleColorSelected,
                ]}
              >
                <Text style={styles.bottleColorText}>{color.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
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
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  themeCard: {
    width: '47%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  themeGradient: {
    padding: 16,
    alignItems: 'center',
    minHeight: 90,
    justifyContent: 'center',
  },
  themeSelected: {
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  themeEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  themeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  themeCheckmark: {
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
  themeCheckmarkText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottleColors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  bottleColorButton: {
    flex: 1,
    minWidth: '30%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  bottleColorGradient: {
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottleColorSelected: {
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  bottleColorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
});