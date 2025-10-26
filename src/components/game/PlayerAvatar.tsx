import React from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Player } from '../../types';

interface PlayerAvatarProps {
  player: Player;
  x: number;
  y: number;
  isSpinner: boolean;
  isTarget: boolean;
  pulseAnim?: Animated.Value;
}

const PlayerAvatar = React.memo(({
  player,
  x,
  y,
  isSpinner,
  isTarget,
  pulseAnim
}: PlayerAvatarProps) => {
  return (
    <Animated.View
      style={[
        styles.playerCircle,
        {
          left: x + 150,
          top: y + 150,
          transform: [{ scale: isSpinner && pulseAnim ? pulseAnim : 1 }]
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

const styles = StyleSheet.create({
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

PlayerAvatar.displayName = 'PlayerAvatar';

export default PlayerAvatar;