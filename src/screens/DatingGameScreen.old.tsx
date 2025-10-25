import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Modal,
} from 'react-native';
import { Player } from '../types';
import { COLORS } from '../constants/colors';
import Bottle from '../components/Bottle';

interface Props {
  players: Player[];
  onBack: () => void;
}

export default function DatingGameScreen({ players, onBack }: Props) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSpinnerIndex, setCurrentSpinnerIndex] = useState(0);
  const [targetPlayerIndex, setTargetPlayerIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [playersState, setPlayersState] = useState(players);

  const rotationValue = useRef(new Animated.Value(0)).current;

  const malePlayers = playersState.filter(p => p.gender === 'M');
  const femalePlayers = playersState.filter(p => p.gender === 'F');

  const spinBottle = () => {
    if (isSpinning) return;

    const currentPlayer = playersState[currentSpinnerIndex];
    const oppositeGenderPlayers = playersState.filter(
      p => p.gender !== currentPlayer.gender
    );

    if (oppositeGenderPlayers.length === 0) return;

    setIsSpinning(true);
    setShowResult(false);
    setTargetPlayerIndex(null);

    // Случайный выбор из противоположного пола
    const randomTarget =
      oppositeGenderPlayers[Math.floor(Math.random() * oppositeGenderPlayers.length)];
    const targetIndex = playersState.findIndex(p => p.id === randomTarget.id);

    // Рассчитываем угол для целевого игрока
    const anglePerPlayer = 360 / playersState.length;
    const targetAngle = targetIndex * anglePerPlayer;

    // Добавляем несколько оборотов
    const randomRotations = 3 + Math.random() * 5;
    const totalRotation = randomRotations * 360 + targetAngle;

    Animated.timing(rotationValue, {
      toValue: totalRotation,
      duration: 3000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setIsSpinning(false);
      setTargetPlayerIndex(targetIndex);
      setShowResult(true);
    });
  };

  const handleAction = (action: 'kiss' | 'ignore' | 'like') => {
    if (action === 'like' && targetPlayerIndex !== null) {
      const updatedPlayers = [...playersState];
      updatedPlayers[targetPlayerIndex].likes += 1;
      updatedPlayers[currentSpinnerIndex].likes += 1;
      setPlayersState(updatedPlayers);
    }

    nextTurn();
  };

  const nextTurn = () => {
    setShowResult(false);

    // Находим следующего игрока противоположного пола
    const currentGender = playersState[currentSpinnerIndex].gender;
    let nextIndex = (currentSpinnerIndex + 1) % playersState.length;

    // Ищем следующего игрока с противоположным полом текущему
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

  // Расположение игроков по кругу
  const renderPlayers = () => {
    const radius = 130;
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
              backgroundColor: isSpinner
                ? COLORS.warning
                : isTarget
                ? COLORS.success
                : player.gender === 'M'
                ? COLORS.male
                : COLORS.female,
            },
          ]}
        >
          <Text style={styles.playerCircleText}>{player.name}</Text>
          {player.likes > 0 && (
            <View style={styles.likeBadge}>
              <Text style={styles.likeBadgeText}>❤️ {player.likes}</Text>
            </View>
          )}
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Назад</Text>
        </TouchableOpacity>
        <Text style={styles.modeTitle}>Режим: Знакомства 💕</Text>
      </View>

      <View style={styles.spinnerInfo}>
        <Text style={styles.spinnerLabel}>Крутит:</Text>
        <Text style={styles.spinnerName}>
          {currentSpinner.name} ({currentSpinner.gender})
        </Text>
      </View>

      <View style={styles.gameArea}>
        <View style={styles.playersCircle}>{renderPlayers()}</View>

        <View style={styles.bottleContainer}>
          <Bottle rotation={rotationValue} isSpinning={isSpinning} />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.spinButton, isSpinning && styles.spinButtonDisabled]}
        onPress={spinBottle}
        disabled={isSpinning}
      >
        <Text style={styles.spinButtonText}>
          {isSpinning ? 'Крутится...' : 'КРУТИТЬ'}
        </Text>
      </TouchableOpacity>

      <Modal visible={showResult} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Пара найдена! 💕</Text>

            <View style={styles.pairContainer}>
              <View style={styles.playerCard}>
                <View
                  style={[
                    styles.playerAvatar,
                    {
                      backgroundColor:
                        currentSpinner.gender === 'M' ? COLORS.male : COLORS.female,
                    },
                  ]}
                >
                  <Text style={styles.playerAvatarText}>
                    {currentSpinner.name[0]}
                  </Text>
                </View>
                <Text style={styles.playerCardName}>{currentSpinner.name}</Text>
              </View>

              <Text style={styles.heartIcon}>💕</Text>

              <View style={styles.playerCard}>
                <View
                  style={[
                    styles.playerAvatar,
                    {
                      backgroundColor:
                        targetPlayer?.gender === 'M' ? COLORS.male : COLORS.female,
                    },
                  ]}
                >
                  <Text style={styles.playerAvatarText}>
                    {targetPlayer?.name[0]}
                  </Text>
                </View>
                <Text style={styles.playerCardName}>{targetPlayer?.name}</Text>
              </View>
            </View>

            <Text style={styles.actionPrompt}>Что вы выберете?</Text>

            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.kissButton]}
                onPress={() => handleAction('kiss')}
              >
                <Text style={styles.actionEmoji}>💋</Text>
                <Text style={styles.actionButtonText}>Поцеловать</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.likeButton]}
                onPress={() => handleAction('like')}
              >
                <Text style={styles.actionEmoji}>❤️</Text>
                <Text style={styles.actionButtonText}>Лайк</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.ignoreButton]}
                onPress={() => handleAction('ignore')}
              >
                <Text style={styles.actionEmoji}>🤷</Text>
                <Text style={styles.actionButtonText}>Пропустить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  modeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 10,
  },
  spinnerInfo: {
    backgroundColor: COLORS.secondary,
    padding: 15,
    alignItems: 'center',
  },
  spinnerLabel: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '600',
  },
  spinnerName: {
    fontSize: 20,
    color: COLORS.white,
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
    width: 300,
    height: 300,
  },
  playerCircle: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -35 }, { translateY: -35 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  playerCircleText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  likeBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
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
    backgroundColor: COLORS.secondary,
    margin: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  spinButtonDisabled: {
    backgroundColor: COLORS.textLight,
  },
  spinButtonText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 25,
  },
  pairContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  playerCard: {
    alignItems: 'center',
  },
  playerAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  playerAvatarText: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: 'bold',
  },
  playerCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  heartIcon: {
    fontSize: 40,
    marginHorizontal: 20,
  },
  actionPrompt: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  kissButton: {
    backgroundColor: COLORS.primary,
  },
  likeButton: {
    backgroundColor: COLORS.success,
  },
  ignoreButton: {
    backgroundColor: COLORS.textLight,
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
