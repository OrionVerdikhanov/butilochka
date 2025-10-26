import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Modal } from 'react-native';
import { Player } from '../types';
import { Settings, DEFAULT_SETTINGS } from '../utils/storage';
import { COLORS } from '../constants/colors';
import { getWishesByCategories } from '../constants/wishes';
import Bottle3D from '../components/Bottle3D';
import AnimatedBackground from '../components/AnimatedBackground';
import GradientButton from '../components/GradientButton';
import ConfettiExplosion from '../components/ConfettiExplosion';
import CountdownTimer from '../components/CountdownTimer';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

interface Props {
  players: Player[];
  onBack: () => void;
  settings?: Settings;
}

export default function WishesGameScreenPremium({ players, onBack, settings = DEFAULT_SETTINGS }: Props) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSpinnerIndex, setCurrentSpinnerIndex] = useState(0);
  const [targetPlayerIndex, setTargetPlayerIndex] = useState<number | null>(null);
  const [currentWish, setCurrentWish] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const rotationValue = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Анимация пульсации для текущего игрока
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const spinBottle = () => {
    if (isSpinning) return;

    if (settings.vibrationEnabled) {
      ReactNativeHapticFeedback.trigger('impactHeavy');
    }
    setIsSpinning(true);
    setShowResult(false);
    setShowConfetti(false);
    setTargetPlayerIndex(null);

    // Выбираем случайного игрока (не крутящего)
    let targetIndex;
    do {
      targetIndex = Math.floor(Math.random() * players.length);
    } while (targetIndex === currentSpinnerIndex);

    // Рассчитываем угол для выбранного игрока
    // Игроки расположены начиная с -90° (12 часов)
    const anglePerPlayer = 360 / players.length;
    const targetAngle = targetIndex * anglePerPlayer - 90;

    // Добавляем случайное количество полных оборотов
    const randomRotations = 4 + Math.random() * 6;
    const totalRotation = randomRotations * 360 + targetAngle;

    // Get wishes based on settings
    const availableWishes = getWishesByCategories(settings.enabledCategories);
    const randomWish = availableWishes[Math.floor(Math.random() * availableWishes.length)];

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
      setCurrentWish(randomWish);
      setShowResult(true);
      setShowConfetti(true);
    });
  };

  const nextTurn = () => {
    if (settings.vibrationEnabled) {
      ReactNativeHapticFeedback.trigger('impactMedium');
    }
    setShowResult(false);
    setShowConfetti(false);
    setCurrentSpinnerIndex((currentSpinnerIndex + 1) % players.length);
    setTargetPlayerIndex(null);
    setCurrentWish(null);
    rotationValue.setValue(0);
  };

  const currentSpinner = players[currentSpinnerIndex];
  const targetPlayer = targetPlayerIndex !== null ? players[targetPlayerIndex] : null;

  const renderPlayers = () => {
    const radius = 140;
    const centerX = 0;
    const centerY = 0;

    return players.map((player, index) => {
      const angle = (index * 360) / players.length - 90;
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
              left: x + 160,
              top: y + 160,
            },
          ]}
        >
          {isSpinner && (
            <Animated.View
              style={[
                styles.spinnerGlow,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={['rgba(255, 212, 59, 0.6)', 'rgba(250, 176, 5, 0.3)']}
                style={styles.glowGradient}
              />
            </Animated.View>
          )}
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
            style={[
              styles.playerGradient,
              isSpinner && styles.playerGradientActive,
            ]}
          >
            <Text style={styles.playerCircleText}>{player.name}</Text>
            {isSpinner && (
              <View style={styles.spinnerBadge}>
                <Text style={styles.spinnerBadgeText}>🎯</Text>
              </View>
            )}
          </LinearGradient>
        </View>
      );
    });
  };

  return (
    <AnimatedBackground theme={settings.theme}>
      {showConfetti && <ConfettiExplosion count={60} duration={3000} />}

      <View style={styles.container}>
        <LinearGradient
          colors={['#ff6b6b', '#ee5a6f']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Назад</Text>
          </TouchableOpacity>
          <Text style={styles.modeTitle}>🎯 Режим: Желания</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#ffd43b', '#fab005']}
          style={styles.spinnerInfo}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.spinnerInfoContent}>
            <Text style={styles.spinnerLabel}>СЕЙЧАС КРУТИТ</Text>
            <View style={styles.spinnerNameContainer}>
              <Text style={styles.spinnerEmoji}>🎯</Text>
              <Text style={styles.spinnerName}>{currentSpinner.name}</Text>
            </View>
            <Text style={styles.spinnerHint}>Крутите бутылочку!</Text>
          </View>
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
          title={isSpinning ? 'КРУТИТСЯ...' : '🎯 КРУТИТЬ БУТЫЛОЧКУ'}
          onPress={spinBottle}
          disabled={isSpinning}
          colors={['#ff6b6b', '#ee5a6f', '#d63447']}
          style={styles.spinButton}
        />

        <Modal visible={showResult} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={['#ffffff', '#fff5f5']}
              style={styles.modalContent}
            >
              <Text style={styles.modalTitle}>🎉 Результат!</Text>

              <View style={styles.resultInfo}>
                <Text style={styles.resultLabel}>
                  {currentSpinner.name} загадывает желание для:
                </Text>
                <LinearGradient
                  colors={targetPlayer?.gender === 'M' ? ['#4a90e2', '#357abd'] : ['#ff69b4', '#e65a9f']}
                  style={styles.targetPlayerBadge}
                >
                  <Text style={styles.resultPlayer}>{targetPlayer?.name}</Text>
                </LinearGradient>
              </View>

              <LinearGradient
                colors={['#fff5f5', '#ffe8e8']}
                style={styles.wishContainer}
              >
                <Text style={styles.wishLabel}>💫 Желание:</Text>
                <Text style={styles.wishText}>{currentWish}</Text>
              </LinearGradient>

              {settings.showTimer && showResult && (
                <CountdownTimer
                  duration={settings.timerDuration}
                  onComplete={() => {
                    if (settings.vibrationEnabled) {
                      ReactNativeHapticFeedback.trigger('notificationWarning');
                    }
                  }}
                />
              )}

              <GradientButton
                title="Следующий ход ➡"
                onPress={nextTurn}
                colors={['#51cf66', '#37b24d']}
              />
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
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  spinnerInfoContent: {
    alignItems: 'center',
  },
  spinnerLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  spinnerNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  spinnerEmoji: {
    fontSize: 32,
  },
  spinnerName: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  spinnerHint: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
    marginTop: 8,
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
  spinnerGlow: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    top: -8,
    left: -8,
    zIndex: -1,
  },
  glowGradient: {
    flex: 1,
    borderRadius: 48,
  },
  playerGradient: {
    flex: 1,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    borderWidth: 0,
  },
  playerGradientActive: {
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#ffd43b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 12,
  },
  spinnerBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffd43b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  spinnerBadgeText: {
    fontSize: 16,
  },
  playerCircleText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
    marginBottom: 24,
  },
  resultInfo: {
    marginBottom: 24,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 12,
  },
  targetPlayerBadge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  resultPlayer: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  wishContainer: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  wishLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  wishText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 28,
  },
});
