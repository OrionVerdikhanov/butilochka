import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Player } from '../../types';
import { COLORS } from '../../constants/colors';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

interface PlayerListItemProps {
  player: Player;
  index: number;
  onRemove: (id: string) => void;
}

const PlayerListItem = React.memo(({ player, index, onRemove }: PlayerListItemProps) => {
  const handleRemove = useCallback(() => {
    ReactNativeHapticFeedback.trigger('impactMedium');
    onRemove(player.id);
  }, [player.id, onRemove]);

  return (
    <View style={styles.playerItem}>
      <View style={styles.playerNumber}>
        <Text style={styles.playerNumberText}>{index + 1}</Text>
      </View>
      <View
        style={[
          styles.genderIndicator,
          {
            backgroundColor:
              player.gender === 'M' ? COLORS.male : COLORS.female,
          },
        ]}
      />
      <Text style={styles.playerName}>{player.name}</Text>
      <Text style={styles.playerGender}>
        ({player.gender === 'M' ? 'М' : 'Ж'})
      </Text>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={handleRemove}
      >
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playerNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  playerNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  genderIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  playerName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  playerGender: {
    fontSize: 14,
    color: COLORS.textLight,
    marginRight: 12,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

PlayerListItem.displayName = 'PlayerListItem';

export default PlayerListItem;