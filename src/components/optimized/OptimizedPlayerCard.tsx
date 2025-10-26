import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Player } from '../../types';

interface OptimizedPlayerCardProps {
  player: Player;
  isSelected?: boolean;
  isTarget?: boolean;
  onPress?: (playerId: string) => void;
}

/**
 * Оптимизированная карточка игрока с мемоизацией
 * Компонент перерисовывается только при изменении пропсов
 */
export const OptimizedPlayerCard = React.memo<OptimizedPlayerCardProps>(({
  player,
  isSelected = false,
  isTarget = false,
  onPress,
}) => {
  // Оптимизированные стили на основе пропсов
  const containerStyle = React.useMemo(() => [
    styles.container,
    isSelected && styles.selectedContainer,
    isTarget && styles.targetContainer,
  ], [isSelected, isTarget]);

  const gradientColors = React.useMemo(() => {
    if (isSelected) {
      return ['#ffd43b', '#fab005'];
    }
    if (isTarget) {
      return ['#51cf66', '#37b24d'];
    }
    return player.gender === 'M' ? ['#4a90e2', '#357abd'] : ['#ff69b4', '#e65a9f'];
  }, [isSelected, isTarget, player.gender]);

  // Оптимизированный обработчик нажатия
  const handlePress = React.useCallback(() => {
    onPress?.(player.id);
  }, [onPress, player.id]);

  return (
    <LinearGradient colors={gradientColors} style={containerStyle}>
      <Text style={styles.name}>{player.name}</Text>
      {player.likes > 0 && (
        <View style={styles.likeBadge}>
          <Text style={styles.likeText}>❤️ {player.likes}</Text>
        </View>
      )}
    </LinearGradient>
  );
});

OptimizedPlayerCard.displayName = 'OptimizedPlayerCard';

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  selectedContainer: {
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  targetContainer: {
    borderWidth: 3,
    borderColor: '#51cf66',
  },
  name: {
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
  likeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});