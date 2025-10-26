import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface Particle {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
}

interface Props {
  count?: number;
  color?: string;
  size?: number;
}

export default function FloatingParticles({
  count = 15,
  color = '#ffffff',
  size = 4
}: Props) {
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    // Создаем частицы
    particles.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: new Animated.Value(Math.random() * 100),
      y: new Animated.Value(Math.random() * 100),
      opacity: new Animated.Value(Math.random() * 0.5 + 0.2),
      scale: new Animated.Value(Math.random() * 0.5 + 0.5),
    }));

    // Анимация для каждой частицы
    particles.current.forEach((particle) => {
      const animateParticle = () => {
        Animated.parallel([
          Animated.loop(
            Animated.sequence([
              Animated.timing(particle.y, {
                toValue: (Math.random() * 100),
                duration: 3000 + Math.random() * 2000,
                useNativeDriver: true,
              }),
              Animated.timing(particle.y, {
                toValue: Math.random() * 100,
                duration: 3000 + Math.random() * 2000,
                useNativeDriver: true,
              }),
            ])
          ),
          Animated.loop(
            Animated.sequence([
              Animated.timing(particle.x, {
                toValue: Math.random() * 100,
                duration: 4000 + Math.random() * 2000,
                useNativeDriver: true,
              }),
              Animated.timing(particle.x, {
                toValue: Math.random() * 100,
                duration: 4000 + Math.random() * 2000,
                useNativeDriver: true,
              }),
            ])
          ),
          Animated.loop(
            Animated.sequence([
              Animated.timing(particle.opacity, {
                toValue: Math.random() * 0.5 + 0.3,
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.timing(particle.opacity, {
                toValue: Math.random() * 0.3 + 0.1,
                duration: 2000,
                useNativeDriver: true,
              }),
            ])
          ),
        ]).start();
      };

      animateParticle();
    });
  }, [count]);

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.current.map((particle) => (
        <Animated.View
          key={particle.id}
          style={[
            styles.particle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
              opacity: particle.opacity,
              transform: [
                {
                  translateX: particle.x.interpolate({
                    inputRange: [0, 100],
                    outputRange: [-50, 350],
                  }),
                },
                {
                  translateY: particle.y.interpolate({
                    inputRange: [0, 100],
                    outputRange: [-50, 700],
                  }),
                },
                { scale: particle.scale },
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
  },
  particle: {
    position: 'absolute',
  },
});
