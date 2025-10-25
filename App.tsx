import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import SplashScreen from './src/screens/SplashScreen';
import PlayersScreen from './src/screens/PlayersScreen';
import ModeSelectionScreen from './src/screens/ModeSelectionScreen';
import WishesGameScreen from './src/screens/WishesGameScreen';
import DatingGameScreen from './src/screens/DatingGameScreen';
import { Player, GameMode } from './src/types';
import { COLORS } from './src/constants/colors';

type Screen = 'splash' | 'players' | 'mode' | 'game';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);

  const handleSplashFinish = () => {
    setCurrentScreen('players');
  };

  const handlePlayersAdded = (newPlayers: Player[]) => {
    setPlayers(newPlayers);
    setCurrentScreen('mode');
  };

  const handleModeSelected = (mode: GameMode) => {
    setGameMode(mode);
    setCurrentScreen('game');
  };

  const handleBackToPlayers = () => {
    setCurrentScreen('players');
    setGameMode(null);
  };

  const handleBackToMode = () => {
    setCurrentScreen('mode');
    setGameMode(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#ff6b6b" />

      {currentScreen === 'splash' && (
        <SplashScreen onFinish={handleSplashFinish} />
      )}

      {currentScreen === 'players' && (
        <PlayersScreen onContinue={handlePlayersAdded} />
      )}

      {currentScreen === 'mode' && (
        <ModeSelectionScreen
          players={players}
          onSelectMode={handleModeSelected}
          onBack={handleBackToPlayers}
        />
      )}

      {currentScreen === 'game' && gameMode === 'wishes' && (
        <WishesGameScreen players={players} onBack={handleBackToMode} />
      )}

      {currentScreen === 'game' && gameMode === 'dating' && (
        <DatingGameScreen players={players} onBack={handleBackToMode} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
