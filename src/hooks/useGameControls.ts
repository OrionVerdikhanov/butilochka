import { useState, useCallback } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Player } from '@types/index';
import { Settings, DEFAULT_SETTINGS } from '@utils/storage';

interface UseGameControlsProps {
  players: Player[];
  settings?: Settings;
  onSpinComplete?: () => void;
  onPlayerAction?: (player: Player, action: string) => void;
  onGameEnd?: () => void;
}

export const useGameControls = ({
  players,
  settings = DEFAULT_SETTINGS,
  onSpinComplete,
  onPlayerAction,
  onGameEnd,
}: UseGameControlsProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameHistory, setGameHistory] = useState<Array<{
    round: number;
    spinner: Player;
    target: Player;
    action: string;
    timestamp: Date;
  }>>([]);

  const triggerHaptic = useCallback(
    (type: 'impactLight' | 'impactMedium' | 'impactHeavy' | 'notificationSuccess' | 'notificationWarning' | 'notificationError') => {
      if (settings.vibrationEnabled) {
        ReactNativeHapticFeedback.trigger(type);
      }
    },
    [settings.vibrationEnabled]
  );

  const handleSpinStart = useCallback(() => {
    if (isSpinning || players.length < 2) return;

    setIsSpinning(true);
    setShowResult(false);
    setShowConfetti(false);
    triggerHaptic('impactMedium');
  }, [isSpinning, players.length, triggerHaptic]);

  const handleSpinComplete = useCallback(() => {
    setIsSpinning(false);
    setShowResult(true);
    setCurrentRound(prev => prev + 1);
    triggerHaptic('notificationSuccess');
    onSpinComplete?.();
  }, [triggerHaptic, onSpinComplete]);

  const handlePlayerAction = useCallback(
    (player: Player, action: string) => {
      triggerHaptic('impactLight');
      onPlayerAction?.(player, action);

      // Add to history
      setGameHistory(prev => [
        ...prev,
        {
          round: currentRound,
          spinner: player,
          target: player,
          action,
          timestamp: new Date(),
        },
      ]);
    },
    [triggerHaptic, onPlayerAction, currentRound]
  );

  const handlePositiveAction = useCallback(() => {
    setShowConfetti(true);
    triggerHaptic('notificationSuccess');

    setTimeout(() => {
      setShowResult(false);
      setShowConfetti(false);
    }, 2000);
  }, [triggerHaptic]);

  const handleNegativeAction = useCallback(() => {
    triggerHaptic('notificationWarning');

    setTimeout(() => {
      setShowResult(false);
    }, 1000);
  }, [triggerHaptic]);

  const resetGame = useCallback(() => {
    setIsSpinning(false);
    setShowResult(false);
    setShowConfetti(false);
    setCurrentRound(1);
    setGameHistory([]);
    triggerHaptic('impactLight');
  }, [triggerHaptic]);

  const pauseGame = useCallback(() => {
    triggerHaptic('notificationWarning');
  }, [triggerHaptic]);

  const resumeGame = useCallback(() => {
    triggerHaptic('notificationSuccess');
  }, [triggerHaptic]);

  const endGame = useCallback(() => {
    triggerHaptic('notificationError');
    onGameEnd?.();
  }, [triggerHaptic, onGameEnd]);

  const skipTurn = useCallback(() => {
    if (isSpinning) return;

    setShowResult(false);
    triggerHaptic('impactLight');
  }, [isSpinning, triggerHaptic]);

  // Game statistics
  const getGameStats = useCallback(() => {
    const totalSpins = gameHistory.length;
    const playerStats = players.map(player => {
      const playerSpins = gameHistory.filter(h => h.spinner.id === player.id);
      const playerTargets = gameHistory.filter(h => h.target.id === player.id);

      return {
        player,
        spinsAsSpinner: playerSpins.length,
        timesAsTarget: playerTargets.length,
        lastAction: playerSpins[playerSpins.length - 1]?.action || 'none',
      };
    });

    return {
      totalRounds: currentRound,
      totalSpins,
      playerStats,
      gameDuration: gameHistory.length > 0
        ? new Date().getTime() - gameHistory[0].timestamp.getTime()
        : 0,
    };
  }, [gameHistory, currentRound, players]);

  return {
    // State
    isSpinning,
    showResult,
    showConfetti,
    currentRound,
    gameHistory,

    // Actions
    handleSpinStart,
    handleSpinComplete,
    handlePlayerAction,
    handlePositiveAction,
    handleNegativeAction,
    resetGame,
    pauseGame,
    resumeGame,
    endGame,
    skipTurn,

    // Utilities
    getGameStats,
    triggerHaptic,
  };
};