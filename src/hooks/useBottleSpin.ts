import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

export function useBottleSpin() {
  const rotationValue = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Анимация пульсации для текущего игрока
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const spinToPlayer = (
    targetIndex: number,
    playersCount: number,
    duration: number,
    onComplete: () => void
  ) => {
    // Рассчитываем угол для выбранного игрока
    // Игроки расположены начиная с -90° (12 часов)
    const anglePerPlayer = 360 / playersCount;
    const targetAngle = targetIndex * anglePerPlayer - 90;

    // Добавляем случайное количество полных оборотов
    const randomRotations = 4 + Math.random() * 6;
    const totalRotation = randomRotations * 360 + targetAngle;

    Animated.timing(rotationValue, {
      toValue: totalRotation,
      duration,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
      useNativeDriver: true,
    }).start(onComplete);
  };

  const resetRotation = () => {
    rotationValue.setValue(0);
  };

  return {
    rotationValue,
    pulseAnim,
    spinToPlayer,
    resetRotation,
  };
}
