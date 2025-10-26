import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Player } from '../../types';

interface SpinnerInfoPanelProps {
  player: Player;
  emoji: string;
  hint: string;
  colors: string[];
}

export default function SpinnerInfoPanel({
  player,
  emoji,
  hint,
  colors,
}: SpinnerInfoPanelProps) {
  return (
    <LinearGradient
      colors={colors}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <Text style={styles.label}>СЕЙЧАС КРУТИТ</Text>
        <View style={styles.nameContainer}>
          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={styles.name}>{player.name}</Text>
        </View>
        <Text style={styles.hint}>{hint}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  content: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 32,
  },
  name: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  hint: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
    marginTop: 8,
  },
});
