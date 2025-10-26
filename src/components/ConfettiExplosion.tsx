import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface Confetti {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  rotate: Animated.Value;
  scale: Animated.Value;
  color: string;
}

interface Props {
  count?: number;
  duration?: number;
}

export default function ConfettiExplosion({ count = 50, duration = 3000 }: Props) {
  const confettiPieces = useRef<Confetti[]>([]);

  const colors = [
    '#ff6b6b',
    '#4ecdc4',
    '#45b7d1',
    '#f9ca24',
    '#ff6348',
    '#a29bfe',
    '#fd79a8',
    '#fdcb6e',
  ];

  useEffect(() => {
    // Создаем частицы конфетти
    confettiPieces.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: new Animated.Value(width / 2),
      y: new Animated.Value(height / 3),
      rotate: new Animated.Value(0),
      scale: new Animated.Value(1),
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    // Запускаем анимацию для каждой частицы
    confettiPieces.current.forEach((confetti) => {
      const randomX = (Math.random() - 0.5) * width * 1.5;
      const randomY = Math.random() * height * 1.2;
      const randomRotate = Math.random() * 10;

      Animated.parallel([
        Animated.timing(confetti.x, {
          toValue: width / 2 + randomX,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(confetti.y, {
          toValue: height + 100,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.timing(confetti.rotate, {
            toValue: randomRotate,
            duration: 1000,
            useNativeDriver: true,
          })
        ),
        Animated.sequence([
          Animated.timing(confetti.scale, {
            toValue: 1.5,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(confetti.scale, {
            toValue: 0,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    });
  }, [count, duration]);

  return (
    <View style={styles.container} pointerEvents="none">
      {confettiPieces.current.map((confetti) => (
        <Animated.View
          key={confetti.id}
          style={[
            styles.confetti,
            {
              backgroundColor: confetti.color,
              transform: [
                { translateX: confetti.x },
                { translateY: confetti.y },
                {
                  rotate: confetti.rotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
                { scale: confetti.scale },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});
