import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Player } from '../../types';

interface PlayerCircleProps {
  player: Player;
  isSpinner: boolean;
  isTarget: boolean;
  pulseAnim?: Animated.Value;
  spinnerBadgeEmoji?: string;
  showLikes?: boolean;
}

export default function PlayerCircle({
  player,
  isSpinner,
  isTarget,
  pulseAnim,
  spinnerBadgeEmoji = '🎯',
  showLikes = false,
}: PlayerCircleProps) {
  return (
    <View style={styles.container}>
      {isSpinner && pulseAnim && (
        <Animated.View
          style={[
            styles.spinnerGlow,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255, 212, 59, 0.6)', 'rgba(250, 176, 5, 0.3)']}
            style={styles.glowGradient}
          />
        </Animated.View>
      )}
      <LinearGradient
        colors={
          isSpinner
            ? ['#ffd43b', '#fab005']
            : isTarget
            ? ['#51cf66', '#37b24d']
            : player.gender === 'M'
            ? ['#4a90e2', '#357abd']
            : ['#ff69b4', '#e65a9f']
        }
        style={[
          styles.playerGradient,
          isSpinner && styles.playerGradientActive,
        ]}
      >
        <Text style={styles.playerText}>{player.name}</Text>
        {isSpinner && (
          <View style={styles.spinnerBadge}>
            <Text style={styles.spinnerBadgeText}>{spinnerBadgeEmoji}</Text>
          </View>
        )}
        {showLikes && player.likes > 0 && !isSpinner && (
          <View style={styles.likeBadge}>
            <Text style={styles.likeBadgeText}>❤️ {player.likes}</Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  spinnerGlow: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    top: -8,
    left: -8,
    zIndex: -1,
  },
  glowGradient: {
    flex: 1,
    borderRadius: 48,
  },
  playerGradient: {
    flex: 1,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    borderWidth: 0,
  },
  playerGradientActive: {
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#ffd43b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 12,
  },
  playerText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  spinnerBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffd43b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  spinnerBadgeText: {
    fontSize: 16,
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
    color: '#ff6b6b',
  },
});
