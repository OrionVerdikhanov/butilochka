import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { Player } from '@types/index';

interface UsePlayerAnimationProps {
  currentPlayer?: Player | null;
  enabled?: boolean;
  pulseScale?: number;
  duration?: number;
}

export const usePlayerAnimation = ({
  currentPlayer,
  enabled = true,
  pulseScale = 1.1,
  duration = 800,
}: UsePlayerAnimationProps = {}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const playerAnimations = useRef<Map<string, Animated.Value>>(new Map()).current;

  // Initialize animation values for players
  const getPlayerAnimation = (playerId: string): Animated.Value => {
    if (!playerAnimations.has(playerId)) {
      playerAnimations.set(playerId, new Animated.Value(1));
    }
    return playerAnimations.get(playerId)!;
  };

  // Pulse animation for current spinner
  useEffect(() => {
    if (!enabled || !currentPlayer) {
      pulseAnim.setValue(1);
      return;
    }

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: pulseScale,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
      pulseAnim.setValue(1);
    };
  }, [currentPlayer, enabled, pulseScale, duration, pulseAnim]);

  // Animate player entrance
  const animatePlayerEntrance = (playerId: string, delay: number = 0) => {
    const anim = getPlayerAnimation(playerId);
    anim.setValue(0);

    setTimeout(() => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, delay);
  };

  // Animate player exit
  const animatePlayerExit = (playerId: string) => {
    const anim = getPlayerAnimation(playerId);

    Animated.timing(anim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      playerAnimations.delete(playerId);
    });
  };

  // Bounce animation for selected player
  const animatePlayerBounce = (playerId: string) => {
    const anim = getPlayerAnimation(playerId);

    Animated.sequence([
      Animated.timing(anim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Shake animation for wrong action
  const animatePlayerShake = (playerId: string) => {
    const anim = getPlayerAnimation(playerId);

    Animated.sequence([
      Animated.timing(anim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Scale animation for bottle spin
  const animateBottleSpin = () => {
    scaleAnim.setValue(1);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return {
    pulseAnim,
    scaleAnim,
    getPlayerAnimation,
    animatePlayerEntrance,
    animatePlayerExit,
    animatePlayerBounce,
    animatePlayerShake,
    animateBottleSpin,
  };
};