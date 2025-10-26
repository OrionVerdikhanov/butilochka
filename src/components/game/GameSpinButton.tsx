import React from 'react';
import { StyleSheet } from 'react-native';
import GradientButton from '../../components/GradientButton';

interface GameSpinButtonProps {
  isSpinning: boolean;
  onPress: () => void;
}

const GameSpinButton = React.memo(({ isSpinning, onPress }: GameSpinButtonProps) => {
  return (
    <GradientButton
      title={isSpinning ? 'КРУТИТСЯ...' : '💕 КРУТИТЬ БУТЫЛОЧКУ'}
      onPress={onPress}
      disabled={isSpinning}
      colors={['#4ecdc4', '#44a3d9']}
      style={styles.spinButton}
    />
  );
});

const styles = StyleSheet.create({
  spinButton: {
    margin: 20,
  },
});

GameSpinButton.displayName = 'GameSpinButton';

export default GameSpinButton;