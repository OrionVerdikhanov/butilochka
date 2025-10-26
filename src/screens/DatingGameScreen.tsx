import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Player } from '../types';
import { Settings, DEFAULT_SETTINGS } from '../utils/storage';
import Bottle3D from '../components/Bottle3D';
import AnimatedBackground from '../components/AnimatedBackground';
import GradientButton from '../components/GradientButton';
import ConfettiExplosion from '../components/ConfettiExplosion';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useBottleSpin } from '../hooks/useBottleSpin';
import GameHeader from '../components/game/GameHeader';
import SpinnerInfoPanel from '../components/game/SpinnerInfoPanel';
import PlayersCircle from '../components/game/PlayersCircle';
import DatingResultModal from '../components/game/DatingResultModal';

interface Props {
  players: Player[];
  onBack: () => void;
  settings?: Settings;
}

export default function DatingGameScreen({ players, onBack, settings = DEFAULT_SETTINGS }: Props) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSpinnerIndex, setCurrentSpinnerIndex] = useState(0);
  const [targetPlayerIndex, setTargetPlayerIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [playersState, setPlayersState] = useState(players);
  const [showConfetti, setShowConfetti] = useState(false);

  const { rotationValue, pulseAnim, spinToPlayer, resetRotation } = useBottleSpin();

  const spinBottle = () => {
    if (isSpinning) return;

    const currentPlayer = playersState[currentSpinnerIndex];
    const oppositeGenderPlayers = playersState.filter(
      p => p.gender !== currentPlayer.gender
    );

    if (oppositeGenderPlayers.length === 0) {
      Alert.alert('Ошибка', 'Нет игроков противоположного пола');
      return;
    }

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

    spinToPlayer(targetIndex, playersState.length, settings.spinDuration, () => {
      if (settings.vibrationEnabled) {
        ReactNativeHapticFeedback.trigger('notificationSuccess');
      }
      setIsSpinning(false);
      setTargetPlayerIndex(targetIndex);
      setShowResult(true);
      setShowConfetti(true);
    });
  };

  const handleKiss = () => {
    if (settings.vibrationEnabled) {
      ReactNativeHapticFeedback.trigger('notificationSuccess');
    }
    Alert.alert('💋', 'Приятного поцелуя!', [
      {
        text: 'OK',
        onPress: nextTurn,
      },
    ]);
  };

  const handleLike = () => {
    if (settings.vibrationEnabled) {
      ReactNativeHapticFeedback.trigger('impactMedium');
    }

    if (targetPlayerIndex !== null) {
      const updatedPlayers = [...playersState];
      updatedPlayers[targetPlayerIndex] = {
        ...updatedPlayers[targetPlayerIndex],
        likes: updatedPlayers[targetPlayerIndex].likes + 1,
      };
      setPlayersState(updatedPlayers);
    }

    Alert.alert('❤️', 'Лайк поставлен!', [
      {
        text: 'OK',
        onPress: nextTurn,
      },
    ]);
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
    resetRotation();
  };

  const currentSpinner = playersState[currentSpinnerIndex];
  const targetPlayer =
    targetPlayerIndex !== null ? playersState[targetPlayerIndex] : null;

  return (
    <AnimatedBackground theme={settings.theme}>
      {showConfetti && <ConfettiExplosion count={80} duration={3000} />}

      <View style={styles.container}>
        <GameHeader
          title="💕 Режим: Знакомства"
          colors={['#4ecdc4', '#44a3d9']}
          onBack={onBack}
        />

        <SpinnerInfoPanel
          player={currentSpinner}
          emoji={currentSpinner.gender === 'M' ? '♂️' : '♀️'}
          hint="Ищем пару..."
          colors={
            currentSpinner.gender === 'M'
              ? ['#4a90e2', '#357abd']
              : ['#ff69b4', '#e65a9f']
          }
        />

        <View style={styles.gameArea}>
          <PlayersCircle
            players={playersState}
            currentSpinnerIndex={currentSpinnerIndex}
            targetPlayerIndex={targetPlayerIndex}
            pulseAnim={pulseAnim}
            spinnerBadgeEmoji="💕"
            showLikes={true}
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
          title={isSpinning ? 'КРУТИТСЯ...' : '💕 КРУТИТЬ БУТЫЛОЧКУ'}
          onPress={spinBottle}
          disabled={isSpinning}
          colors={['#4ecdc4', '#44a3d9', '#4a90e2']}
          style={styles.spinButton}
        />

        <DatingResultModal
          visible={showResult}
          currentSpinner={currentSpinner}
          targetPlayer={targetPlayer}
          onKiss={handleKiss}
          onLike={handleLike}
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
