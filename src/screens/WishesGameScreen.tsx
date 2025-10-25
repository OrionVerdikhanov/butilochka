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
import { WISHES } from '../constants/wishes';
import Bottle from '../components/Bottle';

interface Props {
  players: Player[];
  onBack: () => void;
}

export default function WishesGameScreen({ players, onBack }: Props) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSpinnerIndex, setCurrentSpinnerIndex] = useState(0);
  const [targetPlayerIndex, setTargetPlayerIndex] = useState<number | null>(null);
  const [currentWish, setCurrentWish] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const rotationValue = useRef(new Animated.Value(0)).current;

  const spinBottle = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setShowResult(false);
    setTargetPlayerIndex(null);

    // Случайный угол поворота (минимум 3 оборота + случайный угол)
    const randomRotations = 3 + Math.random() * 5;
    const randomAngle = Math.random() * 360;
    const totalRotation = randomRotations * 360 + randomAngle;

    // Определяем на кого указывает бутылочка
    const anglePerPlayer = 360 / players.length;
    let targetIndex = Math.floor(((randomAngle % 360) / anglePerPlayer)) % players.length;

    // Убедимся, что не попадаем на того, кто крутит
    if (targetIndex === currentSpinnerIndex) {
      targetIndex = (targetIndex + 1) % players.length;
    }

    // Случайное желание
    const randomWish = WISHES[Math.floor(Math.random() * WISHES.length)];

    Animated.timing(rotationValue, {
      toValue: totalRotation,
      duration: 3000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setIsSpinning(false);
      setTargetPlayerIndex(targetIndex);
      setCurrentWish(randomWish);
      setShowResult(true);
    });
  };

  const nextTurn = () => {
    setShowResult(false);
    setCurrentSpinnerIndex((currentSpinnerIndex + 1) % players.length);
    setTargetPlayerIndex(null);
    setCurrentWish(null);
    rotationValue.setValue(0);
  };

  const currentSpinner = players[currentSpinnerIndex];
  const targetPlayer = targetPlayerIndex !== null ? players[targetPlayerIndex] : null;

  // Расположение игроков по кругу
  const renderPlayers = () => {
    const radius = 130;
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
        <Text style={styles.modeTitle}>Режим: Желания</Text>
      </View>

      <View style={styles.spinnerInfo}>
        <Text style={styles.spinnerLabel}>Крутит:</Text>
        <Text style={styles.spinnerName}>{currentSpinner.name}</Text>
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
            <Text style={styles.modalTitle}>Результат!</Text>

            <View style={styles.resultInfo}>
              <Text style={styles.resultLabel}>
                {currentSpinner.name} загадывает желание для:
              </Text>
              <Text style={styles.resultPlayer}>{targetPlayer?.name}</Text>
            </View>

            <View style={styles.wishContainer}>
              <Text style={styles.wishLabel}>Желание:</Text>
              <Text style={styles.wishText}>{currentWish}</Text>
            </View>

            <TouchableOpacity style={styles.nextButton} onPress={nextTurn}>
              <Text style={styles.nextButtonText}>Следующий ход</Text>
            </TouchableOpacity>
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
    backgroundColor: COLORS.warning,
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
  bottleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinButton: {
    backgroundColor: COLORS.primary,
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
    marginBottom: 20,
  },
  resultInfo: {
    marginBottom: 20,
  },
  resultLabel: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 10,
  },
  resultPlayer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  wishContainer: {
    backgroundColor: COLORS.background,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  wishLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 10,
    textAlign: 'center',
  },
  wishText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  nextButton: {
    backgroundColor: COLORS.success,
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
