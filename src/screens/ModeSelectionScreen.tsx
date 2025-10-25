import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Player, GameMode } from '../types';
import { COLORS } from '../constants/colors';

interface Props {
  players: Player[];
  onSelectMode: (mode: GameMode) => void;
  onBack: () => void;
}

export default function ModeSelectionScreen({ players, onSelectMode, onBack }: Props) {
  const hasMaleAndFemale = () => {
    const hasMale = players.some(p => p.gender === 'M');
    const hasFemale = players.some(p => p.gender === 'F');
    return hasMale && hasFemale;
  };

  const handleDatingMode = () => {
    if (!hasMaleAndFemale()) {
      Alert.alert(
        'Недостаточно игроков',
        'Для режима "Знакомства" нужен минимум один мужчина и одна женщина'
      );
      return;
    }
    onSelectMode('dating');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Выберите режим игры</Text>

      <View style={styles.playersInfo}>
        <Text style={styles.playersInfoText}>
          Игроков: {players.length}
        </Text>
        <Text style={styles.playersInfoText}>
          М: {players.filter(p => p.gender === 'M').length} /
          Ж: {players.filter(p => p.gender === 'F').length}
        </Text>
      </View>

      <View style={styles.modesContainer}>
        <TouchableOpacity
          style={[styles.modeCard, styles.wishesMode]}
          onPress={() => onSelectMode('wishes')}
        >
          <Text style={styles.modeEmoji}>🎯</Text>
          <Text style={styles.modeTitle}>Желания</Text>
          <Text style={styles.modeDescription}>
            Крутящий загадывает случайное желание для того, на кого указала бутылочка
          </Text>
          <View style={styles.modeBadge}>
            <Text style={styles.modeBadgeText}>Для всех</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeCard,
            styles.datingMode,
            !hasMaleAndFemale() && styles.modeCardDisabled
          ]}
          onPress={handleDatingMode}
        >
          <Text style={styles.modeEmoji}>💕</Text>
          <Text style={styles.modeTitle}>Знакомства</Text>
          <Text style={styles.modeDescription}>
            Мужчина крутит и попадает на женщину. Они могут поцеловаться или поставить лайк
          </Text>
          {!hasMaleAndFemale() && (
            <View style={[styles.modeBadge, styles.modeBadgeWarning]}>
              <Text style={styles.modeBadgeText}>Нужны М и Ж</Text>
            </View>
          )}
          {hasMaleAndFemale() && (
            <View style={styles.modeBadge}>
              <Text style={styles.modeBadgeText}>М + Ж</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Назад к игрокам</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  playersInfo: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playersInfoText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  modesContainer: {
    flex: 1,
    gap: 20,
  },
  modeCard: {
    backgroundColor: COLORS.white,
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  wishesMode: {
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  datingMode: {
    borderWidth: 3,
    borderColor: COLORS.secondary,
  },
  modeCardDisabled: {
    opacity: 0.5,
  },
  modeEmoji: {
    fontSize: 60,
    marginBottom: 15,
  },
  modeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  modeDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 15,
  },
  modeBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modeBadgeWarning: {
    backgroundColor: COLORS.warning,
  },
  modeBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: COLORS.textLight,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
