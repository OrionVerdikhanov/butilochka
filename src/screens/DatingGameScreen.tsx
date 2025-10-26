import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Player } from '../types';
import { Settings, DEFAULT_SETTINGS } from '../utils/storage';
import { useBottleSpin } from '../hooks/useBottleSpin';
import AnimatedBackground from '../components/AnimatedBackground';
import Bottle from '../components/Bottle';
import ConfettiExplosion from '../components/ConfettiExplosion';
import GameHeader from '../components/game/GameHeader';
import GameCircle from '../components/game/GameCircle';
import GameSpinButton from '../components/game/GameSpinButton';
import DatingActionModal from '../components/game/DatingActionModal';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

interface Props {
  players: Player[];
  onBack: () => void;
  settings?: Settings;
}

export default function DatingGameScreenPremium({ players, onBack, settings = DEFAULT_SETTINGS }: Props) {
  // Состояния для UI и игроков с лайками
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [playersWithLikes, setPlayersWithLikes] = useState(() =>
    players.map(p => ({ ...p, likes: 0 }))
  );

  /**
   * Фильтр для выбора целей только противоположного пола
   */
  const oppositeGenderFilter = useCallback((spinner: Player, allPlayers: Player[]) => {
    return allPlayers.filter(p => p.gender !== spinner.gender);
  }, []);

  /**
   * Обработчик завершения вращения
   */
  const handleSpinComplete = useCallback(() => {
    setShowResult(true);
  }, []);

  // Используем хук для управления вращением
  const {
    isSpinning,
    currentSpinner,
    targetPlayer,
    rotationValue,
    spinBottle,
    nextTurn,
  } = useBottleSpin({
    players: playersWithLikes,
    settings,
    onSpinComplete: handleSpinComplete,
    targetFilter: oppositeGenderFilter,
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
   * Обработчик действий с игроками
   */
  const handleAction = useCallback((action: 'kiss' | 'ignore' | 'like') => {
    if (!currentSpinner || !targetPlayer) return;

    if (action === 'like') {
      if (settings.vibrationEnabled) {
        ReactNativeHapticFeedback.trigger('notificationSuccess');
      }
      setShowConfetti(true);

      // Обновляем лайки
      setPlayersWithLikes(prev => {
        const updated = [...prev];
        const spinnerIndex = updated.findIndex(p => p.id === currentSpinner.id);
        const targetIndex = updated.findIndex(p => p.id === targetPlayer.id);

        if (spinnerIndex !== -1) updated[spinnerIndex].likes += 1;
        if (targetIndex !== -1) updated[targetIndex].likes += 1;

        return updated;
      });

      setTimeout(() => {
        setShowResult(false);
        setShowConfetti(false);
        nextTurn();
      }, 500);
    } else if (action === 'kiss') {
      if (settings.vibrationEnabled) {
        ReactNativeHapticFeedback.trigger('notificationWarning');
      }
      setShowResult(false);
      nextTurn();
    } else {
      setShowResult(false);
      nextTurn();
    }
  }, [currentSpinner, targetPlayer, settings.vibrationEnabled, nextTurn]);

  /**
   * Обработчик вращения бутылки
   */
  const handleSpinBottle = useCallback(() => {
    if (isSpinning) return;
    setShowResult(false);
    setShowConfetti(false);
    spinBottle();
  }, [isSpinning, spinBottle]);

  return (
    <AnimatedBackground theme={settings.theme}>
      {showConfetti && <ConfettiExplosion count={80} duration={3000} />}

      <View style={styles.container}>
        {currentSpinner && (
          <GameHeader
            currentSpinner={currentSpinner}
            onBack={onBack}
          />
        )}

        <View style={styles.gameArea}>
          <GameCircle
            players={playersWithLikes}
            currentSpinner={currentSpinner}
            targetPlayer={targetPlayer}
            pulseAnim={pulseAnim}
          />

          <View style={styles.bottleContainer}>
            <Bottle
              rotation={rotationValue}
              isSpinning={isSpinning}
              size={200}
              color={settings.bottleColor}
            />
          </View>
        </View>

        <GameSpinButton
          isSpinning={isSpinning}
          onPress={handleSpinBottle}
        />

        {currentSpinner && targetPlayer && (
          <DatingActionModal
            visible={showResult}
            currentSpinner={currentSpinner}
            targetPlayer={targetPlayer}
            onAction={handleAction}
          />
        )}
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
});