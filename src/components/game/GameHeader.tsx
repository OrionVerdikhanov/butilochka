import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Player } from '../../types';

interface GameHeaderProps {
  currentSpinner: Player | null;
  onBack: () => void;
}

const GameHeader = React.memo(({ currentSpinner, onBack }: GameHeaderProps) => {
  return (
    <>
      <LinearGradient
        colors={['#4ecdc4', '#44a3d9']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Назад</Text>
        </TouchableOpacity>
        <Text style={styles.modeTitle}>💕 Режим: Знакомства</Text>
      </LinearGradient>

      <LinearGradient
        colors={
          currentSpinner?.gender === 'M'
            ? ['#4a90e2', '#357abd']
            : ['#ff69b4', '#e65a9f']
        }
        style={styles.spinnerInfo}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.spinnerLabel}>Крутит:</Text>
        <Text style={styles.spinnerName}>
          {currentSpinner?.name} ({currentSpinner?.gender === 'M' ? '♂' : '♀'})
        </Text>
      </LinearGradient>
    </>
  );
});

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 10,
  },
  spinnerInfo: {
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  spinnerLabel: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  spinnerName: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
    marginTop: 5,
  },
});

GameHeader.displayName = 'GameHeader';

export default GameHeader;