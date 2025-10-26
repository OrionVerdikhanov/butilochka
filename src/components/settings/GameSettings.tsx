import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Settings } from '../../utils/storage';

interface Props {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

/**
 * Компонент игровых настроек
 */
export function GameSettings({ settings, onSettingsChange }: Props) {
  const updateSetting = (key: keyof Settings, value: any) => {
    ReactNativeHapticFeedback.trigger('impactLight');
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
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
          onValueChange={(value) => updateSetting('vibrationEnabled', value)}
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
          onValueChange={(value) => updateSetting('showTimer', value)}
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
          onValueChange={(value) => updateSetting('useCustomWishes', value)}
          trackColor={{ false: '#d1d5db', true: '#667eea' }}
          thumbColor={settings.useCustomWishes ? '#ffffff' : '#f3f4f6'}
        />
      </View>
    </View>
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
    marginBottom: 16,
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
    color: '#1f2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
});