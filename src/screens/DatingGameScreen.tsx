import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { Player } from '../types';
import { Settings, DEFAULT_SETTINGS } from '../utils/storage';
import { COLORS } from '../constants/colors';
import { useBottleSpin } from '../hooks/useBottleSpin';
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
  // Состояния для UI и игроков с лайками
  const [showResult, setShowResult] = useState(false);
  const [playersWithLikes, setPlayersWithLikes] = useState(players.map(p => ({ ...p, likes: 0 })));
  const [showConfetti, setShowConfetti] = useState(false);
  
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

  const renderSectorBoundaries = () => {
    const radius = 160;
    const centerX = 160;
    const centerY = 160;

    return playersWithLikes.map((player, index) => {
      const angle = (index * 360) / playersWithLikes.length - 90;
      const x = centerX + radius * Math.cos((angle * Math.PI) / 180);
      const y = centerY + radius * Math.sin((angle * Math.PI) / 180);

      const strokeColor = player.gender === 'M' ? '#4a90e2' : '#ff69b4';

      return (
        <Line
          key={`boundary-${player.id}`}
          x1={centerX}
          y1={centerY}
          x2={x}
          y2={y}
          stroke={strokeColor}
          strokeWidth="2"
          opacity="0.3"
        />
      );
    });
  };

  const renderPlayers = () => {
    const radius = 140;
    const centerX = 0;
    const centerY = 0;

    return playersWithLikes.map((player, index) => {
      const angle = (index * 360) / playersWithLikes.length - 90;
      const x = centerX + radius * Math.cos((angle * Math.PI) / 180);
      const y = centerY + radius * Math.sin((angle * Math.PI) / 180);

      const isSpinner = currentSpinner && index === playersWithLikes.indexOf(currentSpinner);
      const isTarget = targetPlayer && index === playersWithLikes.indexOf(targetPlayer);

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
            {player.likes > 0 && (
              <View style={styles.likeBadge}>
                <Text style={styles.likeBadgeText}>❤️ {player.likes}</Text>
              </View>
            )}
          </LinearGradient>
        </Animated.View>
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
          <Svg style={StyleSheet.absoluteFill} width={320} height={320}>
            {renderSectorBoundaries()}
          </Svg>
          
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
          onPress={handleSpinBottle}
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
  spinnerPlayer: {
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#ffd43b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 12,
  },
});
