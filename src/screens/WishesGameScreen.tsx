import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Modal } from 'react-native';
import { Player } from '../types';
import { COLORS } from '../constants/colors';
import { WISHES } from '../constants/wishes';
import BottlePremium from '../components/BottlePremium';
import GradientBackground from '../components/GradientBackground';
import GradientButton from '../components/GradientButton';
import ConfettiExplosion from '../components/ConfettiExplosion';
import FloatingParticles from '../components/FloatingParticles';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

interface Props {
  players: Player[];
  onBack: () => void;
}

export default function WishesGameScreenPremium({ players, onBack }: Props) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSpinnerIndex, setCurrentSpinnerIndex] = useState(0);
  const [targetPlayerIndex, setTargetPlayerIndex] = useState<number | null>(null);
  const [currentWish, setCurrentWish] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const rotationValue = useRef(new Animated.Value(0)).current;

  const spinBottle = () => {
    if (isSpinning) return;

    ReactNativeHapticFeedback.trigger('impactHeavy');
    setIsSpinning(true);
    setShowResult(false);
    setShowConfetti(false);
    setTargetPlayerIndex(null);

    const randomRotations = 4 + Math.random() * 6;
    const randomAngle = Math.random() * 360;
    const totalRotation = randomRotations * 360 + randomAngle;

    const anglePerPlayer = 360 / players.length;
    let targetIndex = Math.floor(((randomAngle % 360) / anglePerPlayer)) % players.length;

    if (targetIndex === currentSpinnerIndex) {
      targetIndex = (targetIndex + 1) % players.length;
    }

    const randomWish = WISHES[Math.floor(Math.random() * WISHES.length)];

    Animated.timing(rotationValue, {
      toValue: totalRotation,
      duration: 4000,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
      useNativeDriver: true,
    }).start(() => {
      ReactNativeHapticFeedback.trigger('notificationSuccess');
      setIsSpinning(false);
      setTargetPlayerIndex(targetIndex);
      setCurrentWish(randomWish);
      setShowResult(true);
      setShowConfetti(true);
    });
  };

  const nextTurn = () => {
    ReactNativeHapticFeedback.trigger('impactMedium');
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
          </LinearGradient>
        </View>
      );
    });
  };

  return (
    <GradientBackground colors={['#fff5f5', '#ffe8e8', '#ffd4d4']}>
      <FloatingParticles count={15} color="rgba(255, 107, 107, 0.3)" size={6} />
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
          <View style={styles.playersCircle}>{renderPlayers()}</View>

          <View style={styles.bottleContainer}>
            <BottlePremium rotation={rotationValue} isSpinning={isSpinning} />
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

              <GradientButton
                title="Следующий ход ➡"
                onPress={nextTurn}
                colors={['#51cf66', '#37b24d']}
              />
            </LinearGradient>
          </View>
        </Modal>
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
