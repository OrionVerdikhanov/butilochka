import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { clearAllData, DEFAULT_SETTINGS } from '../../utils/storage';
import { Settings } from '../../utils/storage';

interface Props {
  onResetComplete: () => void;
}

/**
 * Компонент для управления данными приложения
 */
export function DataManagement({ onResetComplete }: Props) {
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
            ReactNativeHapticFeedback.trigger('notificationWarning');
            Alert.alert('Данные удалены', 'Все данные игры были удалены');
            onResetComplete();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🗑️ Опасная зона</Text>

      <TouchableOpacity onPress={handleResetData}>
        <LinearGradient colors={['#ef4444', '#dc2626']} style={styles.dangerButton}>
          <Text style={styles.dangerButtonText}>Сбросить все данные</Text>
        </LinearGradient>
      </TouchableOpacity>
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
});