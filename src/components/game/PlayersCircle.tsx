import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Player } from '../../types';
import PlayerCircle from './PlayerCircle';

interface PlayersCircleProps {
  players: Player[];
  currentSpinnerIndex: number;
  targetPlayerIndex: number | null;
  pulseAnim?: Animated.Value;
  spinnerBadgeEmoji?: string;
  showLikes?: boolean;
}

export default function PlayersCircle({
  players,
  currentSpinnerIndex,
  targetPlayerIndex,
  pulseAnim,
  spinnerBadgeEmoji = '🎯',
  showLikes = false,
}: PlayersCircleProps) {
  const radius = 140;
  const centerX = 0;
  const centerY = 0;

  return (
    <View style={styles.container}>
      {players.map((player, index) => {
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
                left: x + 160,
                top: y + 160,
              },
            ]}
          >
            <PlayerCircle
              player={player}
              isSpinner={isSpinner}
              isTarget={isTarget}
              pulseAnim={pulseAnim}
              spinnerBadgeEmoji={spinnerBadgeEmoji}
              showLikes={showLikes}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
});
