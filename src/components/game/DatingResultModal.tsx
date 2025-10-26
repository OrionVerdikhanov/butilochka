import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Player } from '../../types';
import { COLORS } from '../../constants/colors';
import GradientButton from '../GradientButton';

interface DatingResultModalProps {
  visible: boolean;
  currentSpinner: Player;
  targetPlayer: Player | null;
  onKiss: () => void;
  onLike: () => void;
}

export default function DatingResultModal({
  visible,
  currentSpinner,
  targetPlayer,
  onKiss,
  onLike,
}: DatingResultModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <LinearGradient
          colors={['#ffffff', '#fff5f5']}
          style={styles.modalContent}
        >
          <Text style={styles.modalTitle}>💕 Совпадение!</Text>

          <View style={styles.playersContainer}>
            <LinearGradient
              colors={
                currentSpinner.gender === 'M'
                  ? ['#4a90e2', '#357abd']
                  : ['#ff69b4', '#e65a9f']
              }
              style={styles.playerBadge}
            >
              <Text style={styles.playerText}>{currentSpinner.name}</Text>
              <Text style={styles.genderIcon}>
                {currentSpinner.gender === 'M' ? '♂' : '♀'}
              </Text>
            </LinearGradient>

            <Text style={styles.heartIcon}>💕</Text>

            <LinearGradient
              colors={
                targetPlayer?.gender === 'M'
                  ? ['#4a90e2', '#357abd']
                  : ['#ff69b4', '#e65a9f']
              }
              style={styles.playerBadge}
            >
              <Text style={styles.playerText}>{targetPlayer?.name}</Text>
              <Text style={styles.genderIcon}>
                {targetPlayer?.gender === 'M' ? '♂' : '♀'}
              </Text>
            </LinearGradient>
          </View>

          <Text style={styles.question}>Что вы хотите сделать?</Text>

          <View style={styles.buttonsContainer}>
            <GradientButton
              title="💋 Поцеловаться"
              onPress={onKiss}
              colors={['#ff6b6b', '#ee5a6f', '#d63447']}
            />
            <GradientButton
              title="❤️ Поставить лайк"
              onPress={onLike}
              colors={['#51cf66', '#37b24d']}
              style={styles.likeButton}
            />
          </View>
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
  playersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 30,
  },
  playerBadge: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 100,
  },
  playerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  genderIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  heartIcon: {
    fontSize: 40,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonsContainer: {
    gap: 12,
  },
  likeButton: {
    marginTop: 0,
  },
});
