import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Player } from '../../types';
import { COLORS } from '../../constants/colors';
import GradientButton from '../GradientButton';
import CountdownTimer from '../CountdownTimer';

interface WishesResultModalProps {
  visible: boolean;
  currentSpinner: Player;
  targetPlayer: Player | null;
  wish: string | null;
  showTimer: boolean;
  timerDuration: number;
  onTimerComplete: () => void;
  onNextTurn: () => void;
}

export default function WishesResultModal({
  visible,
  currentSpinner,
  targetPlayer,
  wish,
  showTimer,
  timerDuration,
  onTimerComplete,
  onNextTurn,
}: WishesResultModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
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
            <Text style={styles.wishText}>{wish}</Text>
          </LinearGradient>

          {showTimer && visible && (
            <CountdownTimer
              duration={timerDuration}
              onComplete={onTimerComplete}
            />
          )}

          <GradientButton
            title="Следующий ход ➡"
            onPress={onNextTurn}
            colors={['#51cf66', '#37b24d']}
          />
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
