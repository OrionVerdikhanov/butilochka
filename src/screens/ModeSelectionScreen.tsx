import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Player, GameMode } from '../types';
import { COLORS } from '../constants/colors';
import GradientBackground from '../components/GradientBackground';
import GradientButton from '../components/GradientButton';
import FloatingParticles from '../components/FloatingParticles';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

interface Props {
  players: Player[];
  onSelectMode: (mode: GameMode) => void;
  onBack: () => void;
}

export default function ModeSelectionScreenPremium({ players, onSelectMode, onBack }: Props) {
  const hasMaleAndFemale = () => {
    const hasMale = players.some(p => p.gender === 'M');
    const hasFemale = players.some(p => p.gender === 'F');
    return hasMale && hasFemale;
  };

  const handleDatingMode = () => {
    if (!hasMaleAndFemale()) {
      ReactNativeHapticFeedback.trigger('notificationError');
      Alert.alert(
        'Недостаточно игроков',
        'Для режима "Знакомства" нужен минимум один мужчина и одна женщина'
      );
      return;
    }
    ReactNativeHapticFeedback.trigger('impactMedium');
    onSelectMode('dating');
  };

  const handleWishesMode = () => {
    ReactNativeHapticFeedback.trigger('impactMedium');
    onSelectMode('wishes');
  };

  return (
    <GradientBackground colors={['#fff5f5', '#ffe8e8', '#ffd4d4']}>
      <FloatingParticles count={20} color="rgba(255, 107, 107, 0.2)" size={5} />
      
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
        <Text style={styles.title}>✨ Выберите режим игры ✨</Text>

        <LinearGradient
          colors={['#ffffff', '#fff5f5']}
          style={styles.playersInfo}
        >
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{players.length}</Text>
              <Text style={styles.statLabel}>Игроков</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: COLORS.male }]}>
                {players.filter(p => p.gender === 'M').length}
              </Text>
              <Text style={styles.statLabel}>Мужчин</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: COLORS.female }]}>
                {players.filter(p => p.gender === 'F').length}
              </Text>
              <Text style={styles.statLabel}>Женщин</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.modesContainer}>
          <TouchableOpacity
            style={styles.modeCard}
            onPress={handleWishesMode}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#ff6b6b', '#ee5a6f', '#d63447']}
              style={styles.modeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.modeContent}>
                <Text style={styles.modeEmoji}>🎯</Text>
                <Text style={styles.modeTitle}>Желания</Text>
                <Text style={styles.modeDescription}>
                  Крутящий загадывает случайное желание для того, на кого указала бутылочка
                </Text>
                <View style={styles.modeBadge}>
                  <Text style={styles.modeBadgeText}>✨ Для всех</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeCard,
              !hasMaleAndFemale() && styles.modeCardDisabled
            ]}
            onPress={handleDatingMode}
            activeOpacity={0.9}
            disabled={!hasMaleAndFemale()}
          >
            <LinearGradient
              colors={
                hasMaleAndFemale()
                  ? ['#4ecdc4', '#44a3d9', '#4a90e2']
                  : ['#999999', '#777777', '#666666']
              }
              style={styles.modeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.modeContent}>
                <Text style={styles.modeEmoji}>💕</Text>
                <Text style={styles.modeTitle}>Знакомства</Text>
                <Text style={styles.modeDescription}>
                  Мужчина крутит и попадает на женщину. Они могут поцеловаться или поставить лайк
                </Text>
                <View style={styles.modeBadge}>
                  <Text style={styles.modeBadgeText}>
                    {hasMaleAndFemale() ? '💕 М + Ж' : '⚠️ Нужны М и Ж'}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <GradientButton
          title="← Назад к игрокам"
          onPress={onBack}
          colors={['#868e96', '#495057']}
          style={styles.backButton}
        />
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  playersInfo: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  modesContainer: {
    flex: 1,
    gap: 20,
  },
  modeCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  modeCardDisabled: {
    opacity: 0.7,
  },
  modeGradient: {
    padding: 28,
  },
  modeContent: {
    alignItems: 'center',
  },
  modeEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  modeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  modeDescription: {
    fontSize: 15,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    opacity: 0.95,
  },
  modeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  modeBadgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
  },
});
