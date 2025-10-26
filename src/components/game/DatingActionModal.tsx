import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Player } from '../../types';
import { COLORS } from '../../constants/colors';

interface DatingActionModalProps {
  visible: boolean;
  currentSpinner: Player | null;
  targetPlayer: Player | null;
  onAction: (action: 'kiss' | 'ignore' | 'like') => void;
}

const DatingActionModal = React.memo(({
  visible,
  currentSpinner,
  targetPlayer,
  onAction
}: DatingActionModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
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
                {currentSpinner?.name[0] || '?'}
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
                {targetPlayer?.name[0] || '?'}
              </Text>
            </LinearGradient>
          </View>

          <Text style={styles.actionPrompt}>Что вы выберете?</Text>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onAction('kiss')}
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
              onPress={() => onAction('like')}
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
              onPress={() => onAction('ignore')}
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
  );
});

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
});

DatingActionModal.displayName = 'DatingActionModal';

export default DatingActionModal;