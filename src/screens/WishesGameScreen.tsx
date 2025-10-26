import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { Player } from '../types';
import { Settings, DEFAULT_SETTINGS } from '../utils/storage';
import { COLORS } from '../constants/colors';
import { getWishesByCategories } from '../constants/wishes';
import { useBottleSpin } from '../hooks/useBottleSpin';
import Bottle from '../components/Bottle';
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
  // Состояния для UI
  const [currentWish, setCurrentWish] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Используем хук для управления вращением
  const {
    isSpinning,
    currentSpinner,
    targetPlayer,
    rotationValue,
    spinBottle,
    nextTurn,
  } = useBottleSpin({
    players,
    settings,
    onSpinComplete: useCallback((result) => {
      // Генерируем желание после завершения вращения
      const availableWishes = getWishesByCategories(settings.enabledCategories);
      const randomWish = availableWishes[Math.floor(Math.random() * availableWishes.length)];
      setCurrentWish(randomWish);
      setShowResult(true);
      setShowConfetti(true);
    }, [settings.enabledCategories]),
  });

  // Анимация пульсации для текущего игрока
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    if (currentSpinner) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true })
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [currentSpinner, pulseAnim]);

  /**
   * Обработчик нажатия на кнопку вращения
   */
  const handleSpinBottle = useCallback(() => {
    if (isSpinning) return;
    setShowResult(false);
    setShowConfetti(false);
    setCurrentWish(null);
    spinBottle();
  }, [isSpinning, spinBottle]);

  /**
   * Обработчик перехода к следующему ходу
   */
  const handleNextTurn = useCallback(() => {
    setShowResult(false);
    setShowConfetti(false);
    setCurrentWish(null);
    nextTurn();
  }, [nextTurn]);

  const renderSectorBoundaries = () => {
    const radius = 160;
    const centerX = 160;
    const centerY = 160;

    return players.map((player, index) => {
      const angle = (index * 360) / players.length - 90;
      const x = centerX + radius * Math.cos((angle * Math.PI) / 180);
      const y = centerY + radius * Math.sin((angle * Math.PI) / 180);

      return (
        <Line
          key={`boundary-${player.id}`}
          x1={centerX}
          y1={centerY}
          x2={x}
          y2={y}
          stroke="#ff6b6b"
          strokeWidth="2"
          opacity="0.25"
        />
      );
    });
  };

  const renderPlayers = () => {
    const radius = 140;
    const centerX = 0;
    const centerY = 0;

    return players.map((player, index) => {
      const angle = (index * 360) / players.length - 90;
      const x = centerX + radius * Math.cos((angle * Math.PI) / 180);
      const y = centerY + radius * Math.sin((angle * Math.PI) / 180);

      const isSpinner = currentSpinner && index === players.indexOf(currentSpinner);
      const isTarget = targetPlayer && index === players.indexOf(targetPlayer);

      return (
        <Animated.View
          key={player.id}
          style={[
            styles.playerCircle,
            {
              left: x + 150,
              top: y + 150,
              transform: [{ scale: isSpinner ? pulseAnim : 1 }]
            },
          ]}
        >
          <LinearGradient
            colors={
              isSpinner
                ? ['#ffd43b', '#fab005']  // Gold/yellow for spinner
                : isTarget
                ? ['#51cf66', '#37b24d']  // Green for target
                : player.gender === 'M'
                ? ['#4a90e2', '#357abd']  // Blue for male
                : ['#ff69b4', '#e65a9f']  // Pink for female
            }
            style={[
              styles.playerGradient,
              isSpinner && styles.spinnerPlayer  // Special style for spinner
            ]}
          >
            <Text style={styles.playerCircleText}>{player.name}</Text>
          </LinearGradient>
        </Animated.View>
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
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.spinnerLabel}>Крутит:</Text>
          <Text style={styles.spinnerName}>{currentSpinner.name}</Text>
        </LinearGradient>

        <View style={styles.gameArea}>
          <Svg style={StyleSheet.absoluteFill} width={320} height={320}>
            {renderSectorBoundaries()}
          </Svg>
          
          <View style={styles.playersCircle}>{renderPlayers()}</View>

          <View style={styles.bottleContainer}>
            <Bottle
              rotation={rotationValue}
              isSpinning={isSpinning}
              size={200}
              color={settings.bottleColor}
            />
          </View>
        </View>

        <GradientButton
          title={isSpinning ? 'КРУТИТСЯ...' : '🎯 КРУТИТЬ БУТЫЛОЧКУ'}
          onPress={handleSpinBottle}
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
                onPress={handleNextTurn}
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
  spinnerPlayer: {
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#ffd43b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 12,
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
