import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Modal } from 'react-native';
import { Player } from '../types';
import { Settings, DEFAULT_SETTINGS } from '../utils/storage';
import { COLORS } from '../constants/colors';
import Bottle3D from '../components/Bottle3D';
import AnimatedBackground from '../components/AnimatedBackground';
import GradientButton from '../components/GradientButton';
import ConfettiExplosion from '../components/ConfettiExplosion';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

interface Props {
  players: Player[];
  onBack: () => void;
  settings?: Settings;
}

export default function DatingGameScreenPremium({ players, onBack, settings = DEFAULT_SETTINGS }: Props) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSpinnerIndex, setCurrentSpinnerIndex] = useState(0);
  const [targetPlayerIndex, setTargetPlayerIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [playersState, setPlayersState] = useState(players);
  const [showConfetti, setShowConfetti] = useState(false);

  const rotationValue = useRef(new Animated.Value(0)).current;

  const spinBottle = () => {
    if (isSpinning) return;

    const currentPlayer = playersState[currentSpinnerIndex];
    const oppositeGenderPlayers = playersState.filter(
      p => p.gender !== currentPlayer.gender
    );

    if (oppositeGenderPlayers.length === 0) return;

    if (settings.vibrationEnabled) {
      ReactNativeHapticFeedback.trigger('impactHeavy');
    }
    setIsSpinning(true);
    setShowResult(false);
    setShowConfetti(false);
    setTargetPlayerIndex(null);

    const randomTarget =
      oppositeGenderPlayers[Math.floor(Math.random() * oppositeGenderPlayers.length)];
    const targetIndex = playersState.findIndex(p => p.id === randomTarget.id);

    const anglePerPlayer = 360 / playersState.length;
    const targetAngle = targetIndex * anglePerPlayer;

    const randomRotations = 4 + Math.random() * 6;
    const totalRotation = randomRotations * 360 + targetAngle;

    Animated.timing(rotationValue, {
      toValue: totalRotation,
      duration: settings.spinDuration,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
      useNativeDriver: true,
    }).start(() => {
      if (settings.vibrationEnabled) {
        ReactNativeHapticFeedback.trigger('notificationSuccess');
      }
      setIsSpinning(false);
      setTargetPlayerIndex(targetIndex);
      setShowResult(true);
    });
  };

  const handleAction = (action: 'kiss' | 'ignore' | 'like') => {
    if (action === 'like' && targetPlayerIndex !== null) {
      if (settings.vibrationEnabled) {
        ReactNativeHapticFeedback.trigger('notificationSuccess');
      }
      setShowConfetti(true);
      const updatedPlayers = [...playersState];
      updatedPlayers[targetPlayerIndex].likes += 1;
      updatedPlayers[currentSpinnerIndex].likes += 1;
      setPlayersState(updatedPlayers);

      setTimeout(() => nextTurn(), 500);
    } else if (action === 'kiss') {
      if (settings.vibrationEnabled) {
        ReactNativeHapticFeedback.trigger('notificationWarning');
      }
      nextTurn();
    } else {
      nextTurn();
    }
  };

  const nextTurn = () => {
    setShowResult(false);
    setShowConfetti(false);

    const currentGender = playersState[currentSpinnerIndex].gender;
    let nextIndex = (currentSpinnerIndex + 1) % playersState.length;

    while (playersState[nextIndex].gender === currentGender) {
      nextIndex = (nextIndex + 1) % playersState.length;
    }

    setCurrentSpinnerIndex(nextIndex);
    setTargetPlayerIndex(null);
    rotationValue.setValue(0);
  };

  const currentSpinner = playersState[currentSpinnerIndex];
  const targetPlayer =
    targetPlayerIndex !== null ? playersState[targetPlayerIndex] : null;

  const renderPlayers = () => {
    const radius = 140;
    const centerX = 0;
    const centerY = 0;

    return playersState.map((player, index) => {
      const angle = (index * 360) / playersState.length - 90;
      const x = centerX + radius * Math.cos((angle * Math.PI) / 180);
      const y = centerY + radius * Math.sin((angle * Math.PI) / 180);

      const isSpinner = index === currentSpinnerIndex;
      const isTarget = index === targetPlayerIndex;

      return (
        <View
          key={player.id}
          style={[
            styles.playerCircle,
            {
              left: x + 150,
              top: y + 150,
            },
          ]}
        >
          <LinearGradient
            colors={
              isSpinner
                ? ['#ffd43b', '#fab005']
                : isTarget
                ? ['#51cf66', '#37b24d']
                : player.gender === 'M'
                ? ['#4a90e2', '#357abd']
                : ['#ff69b4', '#e65a9f']
            }
            style={styles.playerGradient}
          >
            <Text style={styles.playerCircleText}>{player.name}</Text>
            {player.likes > 0 && (
              <View style={styles.likeBadge}>
                <Text style={styles.likeBadgeText}>❤️ {player.likes}</Text>
              </View>
            )}
          </LinearGradient>
        </View>
      );
    });
  };

  return (
    <AnimatedBackground theme={settings.theme}>
      {showConfetti && <ConfettiExplosion count={80} duration={3000} />}

      <View style={styles.container}>
        <LinearGradient
          colors={['#4ecdc4', '#44a3d9']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Назад</Text>
          </TouchableOpacity>
          <Text style={styles.modeTitle}>💕 Режим: Знакомства</Text>
        </LinearGradient>

        <LinearGradient
          colors={
            currentSpinner.gender === 'M'
              ? ['#4a90e2', '#357abd']
              : ['#ff69b4', '#e65a9f']
          }
          style={styles.spinnerInfo}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.spinnerLabel}>Крутит:</Text>
          <Text style={styles.spinnerName}>
            {currentSpinner.name} ({currentSpinner.gender === 'M' ? '♂' : '♀'})
          </Text>
        </LinearGradient>

        <View style={styles.gameArea}>
          <View style={styles.playersCircle}>{renderPlayers()}</View>

          <View style={styles.bottleContainer}>
            <Bottle3D
              rotation={rotationValue}
              isSpinning={isSpinning}
              size={200}
              color={settings.bottleColor}
            />
          </View>
        </View>

        <GradientButton
          title={isSpinning ? 'КРУТИТСЯ...' : '💕 КРУТИТЬ БУТЫЛОЧКУ'}
          onPress={spinBottle}
          disabled={isSpinning}
          colors={['#4ecdc4', '#44a3d9']}
          style={styles.spinButton}
        />

        <Modal visible={showResult} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={['#ffffff', '#fff0f6']}
              style={styles.modalContent}
            >
              <Text style={styles.modalTitle}>💕 Пара найдена!</Text>

              <View style={styles.pairContainer}>
                <LinearGradient
                  colors={
                    currentSpinner.gender === 'M'
                      ? ['#4a90e2', '#357abd']
                      : ['#ff69b4', '#e65a9f']
                  }
                  style={styles.playerAvatar}
                >
                  <Text style={styles.playerAvatarText}>
                    {currentSpinner.name[0]}
                  </Text>
                </LinearGradient>

                <Text style={styles.heartIcon}>💕</Text>

                <LinearGradient
                  colors={
                    targetPlayer?.gender === 'M'
                      ? ['#4a90e2', '#357abd']
                      : ['#ff69b4', '#e65a9f']
                  }
                  style={styles.playerAvatar}
                >
                  <Text style={styles.playerAvatarText}>
                    {targetPlayer?.name[0]}
                  </Text>
                </LinearGradient>
              </View>

              <Text style={styles.actionPrompt}>Что вы выберете?</Text>

              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleAction('kiss')}
                >
                  <LinearGradient
                    colors={['#ff6b6b', '#ee5a6f']}
                    style={styles.actionButtonGradient}
                  >
                    <Text style={styles.actionEmoji}>💋</Text>
                    <Text style={styles.actionButtonText}>Поцеловать</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleAction('like')}
                >
                  <LinearGradient
                    colors={['#51cf66', '#37b24d']}
                    style={styles.actionButtonGradient}
                  >
                    <Text style={styles.actionEmoji}>❤️</Text>
                    <Text style={styles.actionButtonText}>Лайк</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleAction('ignore')}
                >
                  <LinearGradient
                    colors={['#868e96', '#495057']}
                    style={styles.actionButtonGradient}
                  >
                    <Text style={styles.actionEmoji}>🤷</Text>
                    <Text style={styles.actionButtonText}>Пропустить</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </Modal>
      </View>
    </AnimatedBackground>
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
  modeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 10,
  },
  spinnerInfo: {
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  spinnerLabel: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  spinnerName: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
    marginTop: 5,
  },
  gameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playersCircle: {
    position: 'absolute',
    width: 320,
    height: 320,
  },
  playerCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    transform: [{ translateX: -40 }, { translateY: -40 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playerGradient: {
    flex: 1,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  playerCircleText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  likeBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  likeBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  bottleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinButton: {
    margin: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 24,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 28,
  },
  pairContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  playerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playerAvatarText: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  heartIcon: {
    fontSize: 44,
    marginHorizontal: 20,
  },
  actionPrompt: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  actionsContainer: {
    gap: 14,
  },
  actionButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 12,
  },
  actionEmoji: {
    fontSize: 26,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
