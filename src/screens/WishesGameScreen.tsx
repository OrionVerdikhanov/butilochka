import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Player } from '../types';
import { Settings, DEFAULT_SETTINGS } from '../utils/storage';
import { getWishesByCategories } from '../constants/wishes';
import Bottle3D from '../components/Bottle3D';
import AnimatedBackground from '../components/AnimatedBackground';
import GradientButton from '../components/GradientButton';
import ConfettiExplosion from '../components/ConfettiExplosion';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useBottleSpin } from '../hooks/useBottleSpin';
import GameHeader from '../components/game/GameHeader';
import SpinnerInfoPanel from '../components/game/SpinnerInfoPanel';
import PlayersCircle from '../components/game/PlayersCircle';
import WishesResultModal from '../components/game/WishesResultModal';

interface Props {
  players: Player[];
  onBack: () => void;
  settings?: Settings;
}

export default function WishesGameScreen({ players, onBack, settings = DEFAULT_SETTINGS }: Props) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSpinnerIndex, setCurrentSpinnerIndex] = useState(0);
  const [targetPlayerIndex, setTargetPlayerIndex] = useState<number | null>(null);
  const [currentWish, setCurrentWish] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const { rotationValue, pulseAnim, spinToPlayer, resetRotation } = useBottleSpin();

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

    // Get wishes based on settings
    const availableWishes = getWishesByCategories(settings.enabledCategories);
    const randomWish = availableWishes[Math.floor(Math.random() * availableWishes.length)];

    spinToPlayer(targetIndex, players.length, settings.spinDuration, () => {
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
    resetRotation();
  };

  const handleTimerComplete = () => {
    if (settings.vibrationEnabled) {
      ReactNativeHapticFeedback.trigger('notificationWarning');
    }
  };

  const currentSpinner = players[currentSpinnerIndex];
  const targetPlayer = targetPlayerIndex !== null ? players[targetPlayerIndex] : null;

  return (
    <AnimatedBackground theme={settings.theme}>
      {showConfetti && <ConfettiExplosion count={60} duration={3000} />}

      <View style={styles.container}>
        <GameHeader
          title="🎯 Режим: Желания"
          colors={['#ff6b6b', '#ee5a6f']}
          onBack={onBack}
        />

        <SpinnerInfoPanel
          player={currentSpinner}
          emoji="🎯"
          hint="Крутите бутылочку!"
          colors={['#ffd43b', '#fab005']}
        />

        <View style={styles.gameArea}>
          <PlayersCircle
            players={players}
            currentSpinnerIndex={currentSpinnerIndex}
            targetPlayerIndex={targetPlayerIndex}
            pulseAnim={pulseAnim}
            spinnerBadgeEmoji="🎯"
          />

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

        <WishesResultModal
          visible={showResult}
          currentSpinner={currentSpinner}
          targetPlayer={targetPlayer}
          wish={currentWish}
          showTimer={settings.showTimer}
          timerDuration={settings.timerDuration}
          onTimerComplete={handleTimerComplete}
          onNextTurn={nextTurn}
        />
      </View>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinButton: {
    margin: 20,
  },
});
